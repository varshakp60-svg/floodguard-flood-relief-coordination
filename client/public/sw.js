self.addEventListener("push", (event) => {
  let data = {
    title: "Flood Emergency Alert",
    body: "A new emergency alert has been issued.",
    url: "/"
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (error) {
      console.error("Invalid push notification data:", error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      tag: data.id || "flood-emergency-alert",
      vibrate: [200, 100, 200],
      data: {
        url: data.url || "/"
      }
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data.url || "/",
    self.location.origin
  ).href;

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.startsWith(self.location.origin)) {
          return client.focus().then(() => client.navigate(targetUrl));
        }
      }

      return clients.openWindow(targetUrl);
    })
  );
});

