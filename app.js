const permissionButton = document.querySelector("#permission-button");
const permissionStatus = document.querySelector("#permission-status");

function showPermissionStatus() {
  if (!("Notification" in window)) {
    permissionStatus.textContent = "Notifications are not available in this browsing context. Open the installed Home Screen app on iPhone.";
    return;
  }
  permissionStatus.textContent = `Current permission: ${Notification.permission}`;
}

showPermissionStatus();

permissionButton.addEventListener("click", async () => {
  if (!("Notification" in window)) {
    showPermissionStatus();
    return;
  }
  try {
    const result = await Notification.requestPermission();
    permissionStatus.textContent = `Permission result: ${result}. This only verifies permission; it does not test background delivery.`;
  } catch (error) {
    permissionStatus.textContent = `Permission request failed: ${error.message}`;
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js", { scope: "./" })
    .then(() => {
      document.documentElement.dataset.serviceWorker = "registered";
    })
    .catch((error) => {
      permissionStatus.textContent = `Service worker registration failed: ${error.message}`;
    });
} else {
  permissionStatus.textContent = "Service workers are unavailable in this browser.";
}
