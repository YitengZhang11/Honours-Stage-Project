const permissionButton = document.querySelector("#permission-button");
const permissionStatus = document.querySelector("#permission-status");
const pushStatus = document.querySelector("#push-status");
const subscribeButton = document.querySelector("#subscribe-button");
const sendTestButton = document.querySelector("#send-test-button");
const serverUrlInput = document.querySelector("#server-url");
const testTokenInput = document.querySelector("#test-token");

function showPermissionStatus(message) {
  if (!("Notification" in window)) {
    permissionStatus.textContent = "Notifications are unavailable here. Open the installed Home Screen app on iPhone.";
    return;
  }
  permissionStatus.textContent = message || "Current permission: " + Notification.permission;
}

function getServerBase() {
  const raw = serverUrlInput.value.trim();
  if (!raw) throw new Error("Enter your HTTPS push server URL first.");
  const url = new URL(raw);
  if (url.protocol !== "https:") throw new Error("The push server must use HTTPS.");
  return url.href.replace(/\/$/, "");
}

async function readJson(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Request failed with status " + response.status);
  return payload;
}

function decodeVapidKey(base64String) {
  const padded = base64String.replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(padded + "=".repeat((4 - padded.length % 4) % 4));
  return Uint8Array.from(raw, (character) => character.charCodeAt(0));
}

showPermissionStatus();

permissionButton.addEventListener("click", async () => {
  if (!("Notification" in window)) return showPermissionStatus();
  try {
    const result = await Notification.requestPermission();
    showPermissionStatus("Permission result: " + result + ". You must subscribe to test background delivery.");
  } catch (error) {
    showPermissionStatus("Permission request failed: " + error.message);
  }
});

subscribeButton.addEventListener("click", async () => {
  pushStatus.textContent = "Connecting and creating this device's push subscription…";
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      throw new Error("Web Push is not available here. Open the installed iPhone Home Screen app.");
    }
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") throw new Error("Notification permission was not granted.");
    }

    const base = getServerBase();
    const keyData = await readJson(await fetch(base + "/api/vapid-public-key"));
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: decodeVapidKey(keyData.publicKey)
      });
    }

    const saved = await readJson(await fetch(base + "/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription)
    }));
    pushStatus.textContent = "Device subscribed. Server currently has " + saved.subscriptionCount + " test subscription(s). Now tap Send test push.";
  } catch (error) {
    pushStatus.textContent = "Subscription failed: " + error.message;
  }
});

sendTestButton.addEventListener("click", async () => {
  pushStatus.textContent = "Sending a test push…";
  try {
    const base = getServerBase();
    const token = testTokenInput.value;
    if (!token) throw new Error("Enter the private test token configured on your push server.");
    const result = await readJson(await fetch(base + "/api/send-test", {
      method: "POST",
      headers: { Authorization: "Bearer " + token }
    }));
    pushStatus.textContent = "Server accepted the push for " + result.sent + " device(s). Check iPhone Notification Centre. Expired subscriptions removed: " + result.expired + ".";
  } catch (error) {
    pushStatus.textContent = "Push failed: " + error.message;
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js", { scope: "./" })
    .then(() => { document.documentElement.dataset.serviceWorker = "registered"; })
    .catch((error) => { permissionStatus.textContent = "Service worker registration failed: " + error.message; });
} else {
  permissionStatus.textContent = "Service workers are unavailable in this browser.";
}
