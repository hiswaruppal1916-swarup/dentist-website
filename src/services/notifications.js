import { supabase } from './supabase.js';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

// Public Firebase Web Client Configuration (Safe for client-side use)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let firebaseApp = null;
let fcmMessaging = null;
let foregroundListenerInitialized = false;

async function getFirebaseMessaging() {
  if (fcmMessaging) return fcmMessaging;
  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn('[FCM] Firebase Messaging is not supported in this browser environment.');
      return null;
    }
    if (!getApps().length) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApp();
    }
    fcmMessaging = getMessaging(firebaseApp);
    return fcmMessaging;
  } catch (err) {
    console.warn('[FCM] Error initializing Firebase Messaging:', err);
    return null;
  }
}

export function playNotificationChime(type = 'doctor') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';

    if (type === 'doctor') {
      // 3-note ascending chime for doctor alert
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880.0, now + 0.12); // A5
      osc.frequency.setValueAtTime(1174.66, now + 0.24); // D6
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.7);
    } else {
      // Soft 2-tone melodic chime for patient
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.15); // E5
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    }
  } catch (e) {
    // AudioContext may be blocked before first user gesture
    console.warn('Audio chime playback omitted (autoplay restriction):', e);
  }
}

export class NotificationService {
  /**
   * Request push/notification permission and register device in Supabase.
   * Obtains real Google Firebase Cloud Messaging (FCM) token via Firebase Web SDK.
   * Supports multiple devices per account (laptop, phone, tablet) without overwriting.
   */
  static async requestPermissionAndRegister(role = 'patient', userIdentifier = '') {
    if (!('Notification' in window)) {
      console.warn('Notification API not supported on this browser.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Notification permission not granted:', permission);
        return false;
      }

      // Ensure service worker is registered for firebase-messaging-sw.js
      let swRegistration = null;
      if ('serviceWorker' in navigator) {
        try {
          swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });
          await navigator.serviceWorker.ready;
          console.log('[FCM] ServiceWorker ready for FCM registration:', swRegistration.scope);
        } catch (swErr) {
          console.warn('[FCM] ServiceWorker registration warning:', swErr);
        }
      }

      // Attempt to obtain real Firebase Cloud Messaging registration token
      const messaging = await getFirebaseMessaging();
      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
      let realFcmToken = null;

      if (messaging && vapidKey) {
        try {
          realFcmToken = await getToken(messaging, {
            vapidKey: vapidKey,
            serviceWorkerRegistration: swRegistration || undefined
          });
          if (realFcmToken) {
            console.log(`[FCM] Real FCM token successfully acquired for ${role}:`, realFcmToken.substring(0, 20) + '...');
          }
        } catch (tokenErr) {
          console.warn('[FCM] getToken failed, falling back to persistent token:', tokenErr);
        }
      }

      // If real FCM token was acquired, use it; otherwise fallback to local unique token
      let token = realFcmToken;
      if (!token) {
        token = localStorage.getItem('dp_fcm_token') || localStorage.getItem('dp_device_token');
        if (!token) {
          token = 'dp_' + (role === 'doctor' ? 'doc_' : 'pat_') + Math.random().toString(36).substring(2, 12) + '_' + Date.now();
        }
      }

      localStorage.setItem('dp_fcm_token', token);
      localStorage.setItem('dp_device_token', token);

      const cleanIdentifier = (userIdentifier || '').trim().toLowerCase();

      // Upsert into Supabase notification_devices (unique on fcm_token)
      // Preserves every other valid registered device for doctor or patient
      const { error } = await supabase
        .from('notification_devices')
        .upsert({
          role: role,
          user_identifier: cleanIdentifier,
          fcm_token: token,
          device_info: navigator.userAgent.substring(0, 255),
          last_active: new Date().toISOString()
        }, { onConflict: 'fcm_token' });

      if (error) {
        console.error('Failed to register notification device in database:', error);
      } else {
        console.log(`Registered ${role} device [${token.substring(0, 16)}...] for ${cleanIdentifier}`);
      }

      // Attach foreground message listener (once)
      if (messaging && !foregroundListenerInitialized) {
        foregroundListenerInitialized = true;
        onMessage(messaging, (payload) => {
          console.log('[FCM] Foreground push message received:', payload);
          const title = payload.notification?.title || payload.data?.title || 'Dental Paradise';
          const body = payload.notification?.body || payload.data?.body || '';

          playNotificationChime(role === 'doctor' ? 'doctor' : 'patient');
          NotificationService.showToast(`${title}: ${body}`, 'info');
        });
      }

      return true;
    } catch (err) {
      console.error('Error in requestPermissionAndRegister:', err);
      return false;
    }
  }

  /**
   * Notify DOCTOR that a patient has booked a new appointment.
   * Inserts into public.notifications for doctor role with target URL.
   */
  static async notifyDoctorNewAppointment(apt) {
    if (!apt) return;
    try {
      const docEmail = 'supriyosahu96@gmail.com';
      const targetUrl = `/doctor-dashboard?appointment=${apt.id}`;
      const title = 'New Appointment Booked 🩺';
      const body = `Queue #${apt.queue_number || '•'}: ${apt.patient_name} booked ${apt.treatment_name} on ${apt.appointment_date} at ${apt.appointment_time}.`;

      const { data, error } = await supabase
        .from('notifications')
        .insert({
          recipient_role: 'doctor',
          recipient_identifier: docEmail,
          appointment_id: apt.id,
          title: title,
          body: body,
          target_url: targetUrl,
          is_read: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error writing doctor notification to database:', error);
      } else if (data) {
        // Dispatch real FCM background push to all doctor devices
        supabase.functions.invoke('send-fcm-push', {
          body: {
            notification_id: data.id,
            appointment_id: apt.id,
            recipient_role: 'doctor',
            recipient_identifier: docEmail,
            title: title,
            body: body,
            target_url: targetUrl,
            type: 'new_appointment'
          }
        }).catch(err => console.warn('[FCM Dispatch] Doctor push error:', err));
      }

      return data;
    } catch (err) {
      console.error('notifyDoctorNewAppointment error:', err);
    }
  }

  /**
   * Notify PATIENT that their booking is received and registered in queue.
   * Strictly targeted to patient role and patient phone.
   */
  static async notifyPatientBookingConfirmation(apt) {
    if (!apt || !apt.patient_phone) return;
    try {
      const targetUrl = `/appointment-status?id=${apt.id}&phone=${encodeURIComponent(apt.patient_phone)}`;
      const title = 'Appointment Booked ✅';
      const body = `Queue #${apt.queue_number || '•'}: Booked for ${apt.treatment_name} on ${apt.appointment_date} at ${apt.appointment_time}.`;

      const { data, error } = await supabase
        .from('notifications')
        .insert({
          recipient_role: 'patient',
          recipient_identifier: apt.patient_phone,
          appointment_id: apt.id,
          title: title,
          body: body,
          target_url: targetUrl,
          is_read: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error writing patient booking confirmation to database:', error);
      } else if (data) {
        // Dispatch real FCM background push to patient device
        supabase.functions.invoke('send-fcm-push', {
          body: {
            notification_id: data.id,
            appointment_id: apt.id,
            recipient_role: 'patient',
            recipient_identifier: apt.patient_phone,
            title: title,
            body: body,
            target_url: targetUrl,
            type: 'booking_confirmation'
          }
        }).catch(err => console.warn('[FCM Dispatch] Patient push error:', err));
      }

      return data;
    } catch (err) {
      console.error('notifyPatientBookingConfirmation error:', err);
    }
  }

  /**
   * Deactivate/remove an expired or invalid device token
   */
  static async removeDeviceToken(token) {
    if (!token) return;
    try {
      await supabase
        .from('notification_devices')
        .delete()
        .eq('fcm_token', token);
    } catch (e) {
      console.warn('Could not remove device token:', e);
    }
  }

  /**
   * Notify PATIENT that their appointment status was changed by the Doctor.
   * Strictly targeted to patient role and patient phone.
   */
  static async notifyPatientStatusChange(apt, newStatus, reason = '') {
    if (!apt || !apt.patient_phone) return;
    try {
      const targetUrl = `/appointment-status?id=${apt.id}&phone=${encodeURIComponent(apt.patient_phone)}`;

      let title = `Appointment ${newStatus.toUpperCase()}`;
      let body = `Your appointment #${apt.id} is now ${newStatus}.`;

      if (newStatus === 'confirmed') {
        title = 'Appointment Confirmed! ✅';
        body = `Dr. Supriyo Sahu has confirmed your visit for Queue #${apt.queue_number || '•'} on ${apt.appointment_date} at ${apt.appointment_time}.`;
      } else if (newStatus === 'rejected') {
        title = 'Appointment Update ⚠️';
        body = reason 
          ? `Status: Not accepted. Reason: ${reason}. Please contact clinic or book another slot.`
          : 'Status: Not accepted. Please select an alternate consultation slot.';
      } else if (newStatus === 'arrived') {
        title = 'Clinic Check-In Registered 🏥';
        body = 'You are checked in. Dr. Supriyo Sahu has been alerted of your arrival.';
      } else if (newStatus === 'in_consultation') {
        title = 'Your Turn: In Consultation 🩺';
        body = 'Dr. Supriyo Sahu is ready to see you in the dental operatory.';
      } else if (newStatus === 'completed') {
        title = 'Consultation Completed ✨';
        body = 'Thank you for visiting Dental Paradise! Maintain prescribed oral care routines.';
      }

      const { data, error } = await supabase
        .from('notifications')
        .insert({
          recipient_role: 'patient',
          recipient_identifier: apt.patient_phone,
          appointment_id: apt.id,
          title: title,
          body: body,
          target_url: targetUrl,
          is_read: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error writing patient notification to database:', error);
      } else if (data) {
        // Dispatch real FCM background push for status change
        supabase.functions.invoke('send-fcm-push', {
          body: {
            notification_id: data.id,
            appointment_id: apt.id,
            recipient_role: 'patient',
            recipient_identifier: apt.patient_phone,
            title: title,
            body: body,
            target_url: targetUrl,
            type: `status_${newStatus}`
          }
        }).catch(err => console.warn('[FCM Dispatch] Status change push error:', err));
      }

      return data;
    } catch (err) {
      console.error('notifyPatientStatusChange error:', err);
    }
  }

  /**
   * Fetch notifications filtered by role and identifier
   */
  static async getNotifications(role, identifier) {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (role) {
        query = query.eq('recipient_role', role);
      }
      if (identifier) {
        query = query.eq('recipient_identifier', identifier.trim().toLowerCase());
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }
      return data || [];
    } catch (e) {
      console.error('getNotifications error:', e);
      return [];
    }
  }

  /**
   * Fetch unread count for role & identifier
   */
  static async getUnreadCount(role, identifier) {
    try {
      let query = supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('is_read', false);

      if (role) {
        query = query.eq('recipient_role', role);
      }
      if (identifier) {
        query = query.eq('recipient_identifier', identifier.trim().toLowerCase());
      }

      const { count, error } = await query;
      if (error) return 0;
      return count || 0;
    } catch (e) {
      return 0;
    }
  }

  /**
   * Mark a single notification as read
   */
  static async markAsRead(id) {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
    } catch (e) {
      console.error('markAsRead error:', e);
    }
  }

  /**
   * Mark all notifications as read for role & identifier
   */
  static async markAllAsRead(role, identifier) {
    try {
      let query = supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);

      if (role) query = query.eq('recipient_role', role);
      if (identifier) query = query.eq('recipient_identifier', identifier.trim().toLowerCase());

      await query;
    } catch (e) {
      console.error('markAllAsRead error:', e);
    }
  }

  /**
   * Delete a single notification by id
   */
  static async deleteNotification(id) {
    if (!id) return;
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('deleteNotification error from Supabase:', error);
      }
    } catch (e) {
      console.error('deleteNotification error:', e);
    }
  }

  /**
   * Delete and clear all notifications for a role and identifier
   */
  static async clearAllNotifications(role, identifier) {
    try {
      let query = supabase.from('notifications').delete();

      if (role) {
        query = query.eq('recipient_role', role);
      }
      if (identifier) {
        query = query.eq('recipient_identifier', identifier.trim().toLowerCase());
      }

      const { error } = await query;
      if (error) {
        console.error('clearAllNotifications error from Supabase:', error);
      }
    } catch (e) {
      console.error('clearAllNotifications error:', e);
    }
  }

  /**
   * Show local system push notification with clinic favicon & reliable URL
   */
  static async showLocalNotification(title, body, url = '/') {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      this.showToast(title + ': ' + body);
      return;
    }

    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
          body: body,
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-192.png',
          vibrate: [100, 50, 100],
          data: { url: url }
        });
      } else {
        new Notification(title, {
          body: body,
          icon: '/icons/icon-192.png'
        });
      }
    } catch (e) {
      try {
        new Notification(title, {
          body: body,
          icon: '/icons/icon-192.png'
        });
      } catch (err2) {
        console.warn('Notification constructor failed:', err2);
      }
    }

    this.showToast(title + ': ' + body);
  }

  /**
   * Show toast alert in DOM
   */
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
        <img src="/icons/icon-192.png" alt="Dental Paradise" class="toast-icon"/>
        <span>${message}</span>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()" aria-label="Close notification">&times;</button>
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

