import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
        setUnreadCount(parsed.filter(n => !n.read).length);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
      setUnreadCount(notifications.filter(n => !n.read).length);
    }
  }, [notifications]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep max 50 notifications
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  };

  // Simulate backend error notifications (for demo purposes)
  useEffect(() => {
    // You can remove this in production and replace with actual backend integration
    const addSampleNotifications = () => {
      const sampleNotifications = [
        {
          type: 'message',
          title: 'New Message',
          message: 'You have a new message from John Doe',
          from: 'John Doe',
        },
        {
          type: 'due_date',
          title: 'Task Due Soon',
          message: 'Project deadline is approaching in 2 days',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          type: 'success',
          title: 'Upload Complete',
          message: 'Your file has been uploaded successfully',
        },
      ];

      // Only add sample notifications if there are no notifications
      if (notifications.length === 0) {
        sampleNotifications.forEach((notif, index) => {
          setTimeout(() => addNotification(notif), index * 500);
        });
      }
    };

    // Uncomment to enable sample notifications
    // const timer = setTimeout(addSampleNotifications, 2000);
    // return () => clearTimeout(timer);
  }, []);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
