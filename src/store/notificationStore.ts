import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Notification } from '../types/notification';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  getUnreadCount: () => number;
  getHighPriorityNotifications: () => Notification[];
  getActionRequiredNotifications: () => Notification[];
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (notification) => {
        set((state) => {
          const newNotifications = [notification, ...state.notifications];
          const unreadCount = newNotifications.filter((n) => !n.read).length;
          return {
            notifications: newNotifications,
            unreadCount,
          };
        });
      },

      markAsRead: (id) => {
        set((state) => {
          const notifications = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          );
          const unreadCount = notifications.filter((n) => !n.read).length;
          return { notifications, unreadCount };
        });
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }));
      },

      removeNotification: (id) => {
        set((state) => {
          const notifications = state.notifications.filter((n) => n.id !== id);
          const unreadCount = notifications.filter((n) => !n.read).length;
          return { notifications, unreadCount };
        });
      },

      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      },

      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.read).length;
      },

      getHighPriorityNotifications: () => {
        return get().notifications.filter(
          (n) => n.type === 'high-priority' || n.type === 'escalation'
        );
      },

      getActionRequiredNotifications: () => {
        return get().notifications.filter((n) => n.actionRequired && !n.read);
      },
    }),
    {
      name: 'notification-storage',
    }
  )
);
