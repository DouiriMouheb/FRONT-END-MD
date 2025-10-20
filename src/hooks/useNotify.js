import { useNotifications } from '../contexts/NotificationContext';

/**
 * Custom hook to easily add notifications from anywhere in the app
 * 
 * Usage examples:
 * 
 * const notify = useNotify();
 * 
 * // Add a message notification
 * notify.message('New message from John', { from: 'John Doe' });
 * 
 * // Add a due date notification
 * notify.dueDate('Project deadline approaching', { dueDate: new Date('2025-12-31') });
 * 
 * // Add an error notification
 * notify.error('Failed to save data', { message: 'Server error occurred' });
 * 
 * // Add a success notification
 * notify.success('Operation completed successfully');
 * 
 * // Add a warning notification
 * notify.warning('Low storage space');
 * 
 * // Add a custom notification
 * notify.custom({ type: 'info', title: 'Custom Title', message: 'Custom message', ...otherData });
 */
export const useNotify = () => {
  const { addNotification } = useNotifications();

  return {
    message: (title, options = {}) => {
      addNotification({
        type: 'message',
        title: title || 'New Message',
        message: options.message || '',
        from: options.from,
        ...options,
      });
    },

    dueDate: (title, options = {}) => {
      addNotification({
        type: 'due_date',
        title: title || 'Task Due Soon',
        message: options.message || '',
        dueDate: options.dueDate,
        ...options,
      });
    },

    error: (title, options = {}) => {
      addNotification({
        type: 'error',
        title: title || 'Error',
        message: options.message || 'An error occurred',
        ...options,
      });
    },

    success: (title, options = {}) => {
      addNotification({
        type: 'success',
        title: title || 'Success',
        message: options.message || 'Operation completed successfully',
        ...options,
      });
    },

    warning: (title, options = {}) => {
      addNotification({
        type: 'warning',
        title: title || 'Warning',
        message: options.message || '',
        ...options,
      });
    },

    info: (title, options = {}) => {
      addNotification({
        type: 'info',
        title: title || 'Information',
        message: options.message || '',
        ...options,
      });
    },

    custom: (notification) => {
      addNotification(notification);
    },
  };
};
