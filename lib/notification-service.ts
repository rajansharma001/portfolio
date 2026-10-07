"use client";

import { playHarmonicChime } from './audio-chime';

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  try {
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      playHarmonicChime('alert');
      sendPushNotification('🎉 Notifications Activated', {
        body: 'Planner OS will notify you of upcoming schedule blocks and task deadlines.',
        icon: '/siteicon.png',
      });
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function sendPushNotification(title: string, options?: { body?: string; icon?: string; tag?: string }) {
  if (!isNotificationSupported()) return;

  // Play audio chime
  playHarmonicChime('alert');

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        icon: options?.icon || '/siteicon.png',
        badge: '/siteicon.png',
        body: options?.body,
        tag: options?.tag,
      });
    } catch {
      // Fallback for mobile browsers where ServiceWorker is required for notifications
      if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(title, {
            icon: options?.icon || '/siteicon.png',
            body: options?.body,
            tag: options?.tag,
          });
        });
      }
    }
  }
}
