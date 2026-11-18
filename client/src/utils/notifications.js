
export async function enableNotifications() {
  if (!("Notification" in window)) {
    alert("Your browser does not support notifications.");
    return false;
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    alert("Please allow notifications in your browser settings.");
    return false;
  }

  return true;
}

export async function playAlertSound() {
  try {
    const audio = new Audio("/sounds/alert.mp3");
    audio.volume = 1;

    await audio.play();

    console.log("Alert sound played successfully");
  } catch (error) {
    console.error("Sound playback failed:", error);
  }
}

export async function showFloodNotification(alert) {
  if (!("Notification" in window)) return;

  if (Notification.permission !== "granted") return;

  try {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;

      await registration.showNotification(
        alert.title || "Flood Emergency Alert",
        {
          body:
            alert.message ||
            alert.description ||
            "A new flood alert has been issued.",

          tag: `flood-alert-${alert.id || Date.now()}`,

          icon: "/vite.svg",

          data: {
            url: "/"
          }
        }
      );
    }

    await playAlertSound();

  } catch (error) {
    console.error("Notification failed:", error);
  }
}

// Temporary sound test function
export async function testAlertSound() {
  console.log("Testing flood alert sound...");

  const audio = new Audio("/sounds/alert.mp3");

  try {
    await audio.play();
    console.log("Sound played successfully");
  } catch (error) {
    console.error("Audio error:", error);
  }
}
