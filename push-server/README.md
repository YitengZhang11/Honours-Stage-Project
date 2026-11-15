# Web Push test server

This small Node.js service sends a test notification to a subscribed PWA. It is for the RK-26-1235 feasibility test only; it is not production-ready.

## Before you start

- The PWA is hosted at https://yitengzhang11.github.io/Honours-Stage-Project/.
- The server must be hosted separately on an HTTPS-capable Node.js service. GitHub Pages cannot run this server.
- Use a private test deployment. Do not collect workout or health data.

## Run locally for development

From this folder, install dependencies with npm install.

Generate a VAPID public/private key pair locally. The output includes a secret:

    node --input-type=module -e "import webpush from 'web-push'; console.log(webpush.generateVAPIDKeys())"

Create a long random test token locally:

    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Set these environment variables in your shell or the hosting provider's private environment settings. Do not put their values in this repository:

- VAPID_PUBLIC_KEY: generated public key
- VAPID_PRIVATE_KEY: generated private key; keep it secret
- VAPID_SUBJECT: a contact address, for example mailto:you@example.com
- PUSH_TEST_TOKEN: random test token; keep it secret
- WEB_ORIGIN: https://yitengzhang11.github.io

Then start the server with npm start. A local HTTP server is useful for development but cannot be called by the HTTPS iPhone PWA; use an HTTPS host for the actual iPhone test.

## Connect the iPhone PWA

1. Deploy this folder as a Node.js web service with HTTPS. Set its root directory to push-server, build command to npm install, and start command to npm start.
2. Configure all five environment variables above in the host's private settings. Set WEB_ORIGIN to the exact PWA origin shown above.
3. Open https://your-server/health. Confirm ok is true.
4. In the installed PWA on iPhone, enter the server base URL and the same PUSH_TEST_TOKEN. Tap Subscribe this device, then Send test push.
5. Lock the iPhone or close the PWA and check Notification Centre. Record whether the notification arrived and the observed delay.

## Test-only limits

- Subscriptions are kept in RAM, with a maximum of 10. They disappear when the process restarts or sleeps; subscribe the iPhone again after a restart.
- The send endpoint requires the private test token. The browser page does not save the token, but sends it to the server over HTTPS when you request a test.
- The service has no database, account system, subscription management, or production abuse protection. Do not use it for real users or personal fitness records.
- Never commit VAPID private keys, test tokens, or device subscription objects to GitHub.
