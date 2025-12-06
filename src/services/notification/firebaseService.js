import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { toast } from 'sonner';
const VAPID_KEY = import.meta.env.VITE_VAPID_KEY;
import { api } from "@/config/api";
import { API_ENDPOINTS } from '@/config/constants';
const firebaseConfig = {
  apiKey: "AIzaSyDwTSDcMelDyFMrjUTkqcRjQPaS31dS_J4",
  authDomain: "gradify-f423e.firebaseapp.com",
  projectId: "gradify-f423e",
  storageBucket: "gradify-f423e.firebasestorage.app",
  messagingSenderId: "158565016627",
  appId: "1:158565016627:web:acc2fb9e2fe4097c4a6f46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);
const notificationSound = new Audio('/notification-sound.mp3');

export const requestNotificationPermission = async (userId) => {
  try {
      if (!('Notification' in window)) {
          console.log('This browser does not support notifications');
          return false;
      }
      
      if (Notification.permission === 'granted') {
          const token = await getToken(messaging, { vapidKey: VAPID_KEY });
          await registerTokenWithServer(token, userId);
          return token;
      }
      
      if (Notification.permission !== 'denied') {
          const permission = await Notification.requestPermission();
          
          if (permission === 'granted') {
              const token = await getToken(messaging, { vapidKey: VAPID_KEY });
              await registerTokenWithServer(token, userId);
              return token;
          } else {
              console.log('Notification permission was not granted');
              return false;
          }
      } else {
          console.log('Notification permission was previously denied');
          return false;
      }
  } catch (err) {
      console.error('Failed to get notification permission:', err);
      return false;
  }
};

const registerTokenWithServer = async (token, userId) => {
  try {
      const authToken = localStorage.getItem('token');
      await api.post(`${API_ENDPOINTS.FCM.REGISTER_DEVICE}`, 
          { token, userId },
          {
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
              }
          }
      );
      console.log("Device registered with token for user:", token, userId);
  } catch (error) {
      console.error('Failed to register token with server:', error);
  }
};

// Handle foreground messages
export const setupMessageListener = (onNotificationReceived) => {
  console.log('🔔 FCM Listener setup called');
  
  onMessage(messaging, (payload) => {
    console.log('✅ FCM Message received in FOREGROUND:', payload);
    console.log('📦 Payload structure:', {
      hasNotification: !!payload.notification,
      hasData: !!payload.data,
      notification: payload.notification,
      data: payload.data
    });
    
    const title = payload.notification?.title || payload.data?.title || 'New Notification';
    const body = payload.notification?.body || payload.data?.body || 'New update in Gradify';
    const notificationType = payload.data?.type;
    
    console.log('📢 Processing notification:', { title, body, notificationType });
    
    try {
      // Show toast notification
      toast.message(title, {
        description: body,
        duration: 5000,
      });
      console.log('✅ Toast shown');
      
      notificationSound.play().catch((error) => {
        console.error('Failed to play notification sound:', error);
      });
      
      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body: body,
          icon: '/favicon.ico'
        });
        console.log('✅ Browser notification shown');
      }
      
      // Trigger callback to refetch notifications
      if (onNotificationReceived) {
        console.log('🔄 Triggering notification refetch callback');
        onNotificationReceived(payload);
      } else {
        console.warn('⚠️ No callback provided to setupMessageListener');
      }
    } catch (error) {
      console.error('❌ Failed to show notification:', error);
    }
  });
  
  console.log('🔔 FCM Listener registered successfully');
};
