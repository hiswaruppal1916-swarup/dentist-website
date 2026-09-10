// Firebase Messaging Service Worker for Dental Paradise
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize Firebase in Service Worker with public web config
firebase.initializeApp({
  apiKey: "AIzaSyAk7N7-Zu875ddUBY6SHCLnEPd8ZU9pKtw",
  authDomain: "dental-paradox.firebaseapp.com",
  projectId: "dental-paradox",
  storageBucket: "dental-paradox.firebasestorage.app",
  messagingSenderId: "624070613649",
  appId: "1:624070613649:web:c3574ac9484451c685fd30"
});

const messaging = firebase.messaging();

// Handle background FCM push notifications
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background FCM message received:', payload);

  const notificationTitle = payload.notification?.title || payload.data?.title || 'Dental Paradise';
  const notificationBody = payload.notification?.body || payload.data?.body || 'You have an update from Dental Paradise clinic.';
  const targetUrl = payload.data?.target_url || payload.data?.url || payload.fcmOptions?.link || '/';

  const notificationOptions = {
    body: notificationBody,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [150, 50, 150],
    tag: payload.data?.notification_id || ('dp-alert-' + Date.now()),
    renotify: true,
    data: {
      url: targetUrl,
      notification_id: payload.data?.notification_id,
      appointment_id: payload.data?.appointment_id,
      recipient_role: payload.data?.recipient_role
    },
    actions: [
      { action: 'open', title: 'Open Clinic Portal' }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Import existing PWA cache & notificationclick handler
importScripts('/sw.js');
