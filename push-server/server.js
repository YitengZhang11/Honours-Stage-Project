import express from "express";
import cors from "cors";
import webpush from "web-push";

const app = express();
const port = Number(process.env.PORT || 3000);
const webOrigin = process.env.WEB_ORIGIN || "https://yitengzhang11.github.io";
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:project-owner@example.com";
const testToken = process.env.PUSH_TEST_TOKEN;
const subscriptions = new Map();

app.use(cors({ origin: webOrigin }));
app.use(express.json({ limit: "16kb" }));

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

app.get("/health", (_req, res) => {
  res.json({
    ok: Boolean(vapidPublicKey && vapidPrivateKey && testToken),
    vapidConfigured: Boolean(vapidPublicKey && vapidPrivateKey),
    testTokenConfigured: Boolean(testToken),
    subscriptionCount: subscriptions.size
  });
});

app.get("/api/vapid-public-key", (_req, res) => {
  if (!vapidPublicKey) return res.status(503).json({ error: "VAPID keys are not configured." });
  res.json({ publicKey: vapidPublicKey });
});

app.post("/api/subscribe", (req, res) => {
  const subscription = req.body;
  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    return res.status(400).json({ error: "A valid browser push subscription is required." });
  }
  if (!subscription.endpoint.startsWith("https://")) {
    return res.status(400).json({ error: "Subscription endpoint must use HTTPS." });
  }
  if (subscriptions.size >= 10 && !subscriptions.has(subscription.endpoint)) {
    return res.status(429).json({ error: "This test server is limited to 10 subscriptions." });
  }
  subscriptions.set(subscription.endpoint, subscription);
  res.status(201).json({ saved: true, subscriptionCount: subscriptions.size });
});

app.post("/api/send-test", async (req, res) => {
  const suppliedToken = req.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!testToken || suppliedToken !== testToken) {
    return res.status(401).json({ error: "Test token is missing or incorrect." });
  }
  if (!vapidPublicKey || !vapidPrivateKey) {
    return res.status(503).json({ error: "VAPID keys are not configured." });
  }
  if (subscriptions.size === 0) {
    return res.status(409).json({ error: "No device is subscribed yet." });
  }

  let sent = 0;
  let expired = 0;
  for (const [endpoint, subscription] of subscriptions) {
    try {
      await webpush.sendNotification(subscription, JSON.stringify({
        title: "Workout reminder test",
        body: "Web Push reached your subscribed device. This is a test only.",
        tag: "rk26-web-push-test",
        url: webOrigin + "/Honours-Stage-Project/"
      }));
      sent += 1;
    } catch (error) {
      if (error.statusCode === 404 || error.statusCode === 410) {
        subscriptions.delete(endpoint);
        expired += 1;
      } else {
        console.error("Push delivery failed:", error.statusCode || error.message);
      }
    }
  }
  res.json({ sent, expired, remaining: subscriptions.size });
});

app.listen(port, () => console.log("Push test server listening on port " + port));
