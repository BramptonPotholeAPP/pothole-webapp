import { useEffect } from 'react';
import { usePotholeStore } from '../store/potholeStore';
import { useNotificationStore } from '../store/notificationStore';
import { notificationService } from '../services/notificationService';

// Check interval in milliseconds (5 minutes)
const CHECK_INTERVAL = 5 * 60 * 1000;

export const EscalationMonitor = () => {
  const { potholes } = usePotholeStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    const checkOverdueRepairs = () => {
      console.log('Running automated escalation check...');
      
      // Check for overdue repairs
      const escalationNotifications = notificationService.checkForOverdueRepairs(potholes);
      
      // Add notifications to store
      escalationNotifications.forEach((notification) => {
        addNotification(notification);
      });

      if (escalationNotifications.length > 0) {
        console.log(`Created ${escalationNotifications.length} escalation alerts`);
      }
    };

    // Run immediately on mount
    if (potholes.length > 0) {
      checkOverdueRepairs();
    }

    // Set up interval to check periodically
    const interval = setInterval(checkOverdueRepairs, CHECK_INTERVAL);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [potholes, addNotification]);

  // This component doesn't render anything
  return null;
};
