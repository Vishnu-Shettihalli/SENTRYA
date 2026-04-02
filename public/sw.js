self.addEventListener('push', (event) => {
  let data = { title: 'SENTRYA Alert', body: 'New critical threat detected.' };
  
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    console.error('Error parsing push data:', e);
  }

  const options = {
    body: data.body,
    icon: '/shield-icon.png',
    badge: '/shield-icon.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/community'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
