import { supabase } from './supabase.js';

export class NotificationService {
  static async requestPermissionAndRegister(role = 'patient', userIdentifier = '') {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.warn('Push notifications not supported on this browser.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Notification permission denied or dismissed.');
        return false;
      }

      const registration = await navigator.serviceWorker.ready;
      
      // Attempt push subscription or fallback token
      let token = '';
      try {
        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
          // If public VAPID key is configured, subscribe
          // Else generate unique persistent device token
          const storedToken = localStorage.getItem('dp_device_token');
          token = storedToken || 'dev_' + Math.random().toString(36).substring(2) + Date.now();
          localStorage.setItem('dp_device_token', token);
        } else {
          token = JSON.stringify(subscription);
        }
      } catch (e) {
        const storedToken = localStorage.getItem('dp_device_token');
        token = storedToken || 'dev_' + Math.random().toString(36).substring(2) + Date.now();
        localStorage.setItem('dp_device_token', token);
      }

      // Upsert into Supabase notification_devices
      if (token) {
        await supabase
          .from('notification_devices')
          .upsert({
            role: role,
            user_identifier: userIdentifier,
            fcm_token: token,
            device_info: navigator.userAgent,
            last_active: new Date().toISOString()
          }, { onConflict: 'fcm_token' });
      }

      return true;
    } catch (err) {
      console.error('Error registering notification device:', err);
      return false;
    }
  }

  // Display rich notification with Dental Paradise favicon
  static async showLocalNotification(title, body, url = '/') {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      // Fallback to in-app toast
      this.showToast(title + ': ' + body);
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        body: body,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        vibrate: [100, 50, 100],
        data: { url: url }
      });
    } catch (e) {
      new Notification(title, {
        body: body,
        icon: '/favicon.svg'
      });
    }

    this.showToast(title + ': ' + body);
  }

  static showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <img src="/favicon.svg" alt="Dental Paradise" class="toast-icon"/>
        <span>${message}</span>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.add('toast-fade-out');
        setTimeout(() => toast.remove(), 300);
      }
    }, 5000);
  }
}
