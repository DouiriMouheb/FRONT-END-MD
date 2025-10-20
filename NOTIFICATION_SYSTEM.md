# Notification System

A comprehensive notification system for displaying messages, due dates, errors, and other notifications from the backend.

## Features

- 🔔 **Bell Icon with Badge**: Shows unread notification count
- 📱 **Responsive Design**: Works on desktop and mobile
- 🎨 **Multiple Notification Types**: Messages, due dates, errors, success, warnings, info
- 🌐 **Internationalization**: Supports multiple languages (English, Italian)
- 💾 **Persistent Storage**: Notifications saved to localStorage
- ⚡ **Real-time Updates**: Add notifications from anywhere in the app
- ✅ **Mark as Read**: Individual or bulk mark as read
- 🗑️ **Delete Notifications**: Remove individual or all notifications

## Usage

### Basic Setup

The notification system is already integrated into the app. The `NotificationProvider` wraps the entire app in `App.jsx`.

### Adding Notifications

Use the `useNotify` hook to add notifications from anywhere in your app:

```javascript
import { useNotify } from '../hooks/useNotify';

function MyComponent() {
  const notify = useNotify();

  // Message notification
  const handleNewMessage = () => {
    notify.message('New Message', { 
      message: 'You have a new message from John Doe',
      from: 'John Doe'
    });
  };

  // Due date notification
  const handleDueDate = () => {
    notify.dueDate('Task Due Soon', {
      message: 'Project deadline is approaching',
      dueDate: new Date('2025-12-31')
    });
  };

  // Error notification
  const handleError = () => {
    notify.error('Upload Failed', {
      message: 'Failed to upload file. Please try again.'
    });
  };

  // Success notification
  const handleSuccess = () => {
    notify.success('Saved Successfully', {
      message: 'Your changes have been saved'
    });
  };

  // Warning notification
  const handleWarning = () => {
    notify.warning('Low Storage', {
      message: 'Your storage is running low'
    });
  };

  // Info notification
  const handleInfo = () => {
    notify.info('New Feature', {
      message: 'Check out our new dashboard!'
    });
  };

  // Custom notification
  const handleCustom = () => {
    notify.custom({
      type: 'message',
      title: 'Custom Title',
      message: 'Custom message content',
      // Any additional custom fields
    });
  };

  return (
    // Your component JSX
  );
}
```

### Backend Integration

To integrate with your backend, you can add notifications when receiving events or errors:

```javascript
// Example: API error handling
import { useNotify } from '../hooks/useNotify';

const MyApiComponent = () => {
  const notify = useNotify();

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      
      // Success notification
      notify.success('Data Loaded', {
        message: 'Successfully loaded data from server'
      });
      
    } catch (error) {
      // Error notification
      notify.error('Server Error', {
        message: error.message || 'Failed to connect to server'
      });
    }
  };

  return (
    <button onClick={fetchData}>Fetch Data</button>
  );
};
```

### WebSocket Integration Example

For real-time notifications from a WebSocket connection:

```javascript
import { useEffect } from 'react';
import { useNotify } from '../hooks/useNotify';

const useWebSocketNotifications = () => {
  const notify = useNotify();

  useEffect(() => {
    const ws = new WebSocket('wss://your-backend.com/notifications');

    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      
      // Add notification based on type
      switch (notification.type) {
        case 'message':
          notify.message(notification.title, {
            message: notification.content,
            from: notification.sender
          });
          break;
        case 'error':
          notify.error(notification.title, {
            message: notification.content
          });
          break;
        case 'due_date':
          notify.dueDate(notification.title, {
            message: notification.content,
            dueDate: new Date(notification.dueDate)
          });
          break;
        default:
          notify.info(notification.title, {
            message: notification.content
          });
      }
    };

    return () => ws.close();
  }, [notify]);
};
```

## Notification Types

| Type | Icon | Color | Use Case |
|------|------|-------|----------|
| `message` | 💬 | Blue | New messages, chats |
| `due_date` | 📅 | Orange | Deadlines, reminders |
| `error` | ❌ | Red | Errors, failures |
| `success` | ✅ | Green | Successful operations |
| `warning` | ⚠️ | Yellow | Warnings, cautions |
| `info` | ℹ️ | Blue | General information |

## API Reference

### `useNotify()` Hook

Returns an object with methods to add different types of notifications:

- **`notify.message(title, options)`** - Add a message notification
- **`notify.dueDate(title, options)`** - Add a due date notification
- **`notify.error(title, options)`** - Add an error notification
- **`notify.success(title, options)`** - Add a success notification
- **`notify.warning(title, options)`** - Add a warning notification
- **`notify.info(title, options)`** - Add an info notification
- **`notify.custom(notification)`** - Add a custom notification

### `useNotifications()` Hook

Direct access to the notification context:

```javascript
import { useNotifications } from '../contexts/NotificationContext';

const { 
  notifications,      // Array of all notifications
  unreadCount,        // Number of unread notifications
  addNotification,    // Add a notification
  markAsRead,         // Mark a specific notification as read
  markAllAsRead,      // Mark all notifications as read
  deleteNotification, // Delete a specific notification
  clearAll           // Clear all notifications
} = useNotifications();
```

## Customization

### Styling

The notification bell and panel use your theme's CSS variables:
- `--panel` - Panel background
- `--border` - Border color
- `--foreground` - Text color
- `--accent` - Accent color for active states
- `--muted` - Muted background color

### Translations

Add or modify translations in `src/locales/en.json` and `src/locales/it.json`:

```json
{
  "notifications": {
    "title": "Notifications",
    "markAllRead": "Mark all as read",
    "clearAll": "Clear all",
    // ... more translations
  }
}
```

## Notes

- Notifications are stored in localStorage and persist across sessions
- Maximum of 50 notifications are kept (oldest are removed automatically)
- The bell icon shows a badge with the unread count
- Clicking on a notification marks it as read automatically
