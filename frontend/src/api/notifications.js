/**
 * LMONI Notifications Service
 */
import { request, isLiveBackendConfigured } from './client.js';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_1',
    title: 'Pool Dividend Distributed',
    message: 'Your monthly collective pool yield of ₦140 has been credited to your available balance.',
    date: 'Apr 24, 2025 • 09:30 AM',
    read: false,
    type: 'pool',
    isDemo: true,
  },
  {
    id: 'notif_2',
    title: 'Student ID Verified',
    message: 'Your University of Lagos matriculation credentials were successfully confirmed.',
    date: 'Apr 24, 2025 • 08:15 AM',
    read: true,
    type: 'verification',
    isDemo: true,
  },
  {
    id: 'notif_3',
    title: 'Repayment Reminder',
    message: 'Next peer pool contribution window closes in 5 days. Keep up your on-time score!',
    date: 'Apr 23, 2025 • 02:00 PM',
    read: true,
    type: 'reminder',
    isDemo: true,
  },
];

export const notificationService = {
  async getNotifications() {
    if (isLiveBackendConfigured) {
      try {
        return await request('/notifications');
      } catch (err) {
        if (err.status !== 0) throw err;
      }
    }

    const stored = localStorage.getItem('lmoni_notifications');
    return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
  },

  async markAllAsRead() {
    const list = await this.getNotifications();
    const updated = list.map((n) => ({ ...n, read: true }));
    localStorage.setItem('lmoni_notifications', JSON.stringify(updated));
    return updated;
  },

  async clearAll() {
    localStorage.setItem('lmoni_notifications', JSON.stringify([]));
    return [];
  },
};
