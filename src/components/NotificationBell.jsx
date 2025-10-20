import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, CheckCheck, Trash2, MessageSquare, Calendar, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { useTranslation } from 'react-i18next';

const NotificationBell = ({ isCompact }) => {
  const { t } = useTranslation();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'due_date':
        return <Calendar className="w-5 h-5 text-orange-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'message':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'due_date':
        return 'bg-orange-500/10 border-orange-500/20';
      case 'error':
        return 'bg-red-500/10 border-red-500/20';
      case 'success':
        return 'bg-green-500/10 border-green-500/20';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20';
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return t('notifications.justNow');
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return t('notifications.minutesAgo', { count: minutes });
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return t('notifications.hoursAgo', { count: hours });
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return t('notifications.daysAgo', { count: days });
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative transition-all duration-200 ${
          isCompact 
            ? 'flex items-center justify-center w-10 h-10 rounded-lg hover:bg-accent/10' 
            : 'flex items-center gap-3 w-full p-2 rounded-lg hover:bg-accent/10'
        }`}
        title={isCompact ? t('notifications.title') : ''}
        aria-label={t('notifications.title')}
      >
        <Bell size={20} className={`${unreadCount > 0 ? 'text-accent' : 'text-muted-foreground'}`} />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        
        {!isCompact && (
          <span className="font-medium transition-colors">{t('notifications.title')}</span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          style={{ background: 'hsl(var(--panel))' }}
          className={`absolute ${
            isCompact ? 'left-full ml-2' : 'left-0'
          } top-0 w-80 sm:w-96 border border-border rounded-lg shadow-2xl z-50 max-h-[600px] flex flex-col`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-foreground">
                {t('notifications.title')}
              </h3>
              {unreadCount > 0 && (
                <span className="bg-accent text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-subtle hover:text-foreground transition-colors"
              aria-label={t('notifications.close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Actions */}
          {notifications.length > 0 && (
            <div className="flex items-center gap-2 p-3 border-b border-border bg-muted/30">
              <button
                onClick={markAllAsRead}
                className="text-xs text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
              >
                <CheckCheck className="w-4 h-4" />
                {t('notifications.markAllRead')}
              </button>
              <span className="text-subtle">•</span>
              <button
                onClick={clearAll}
                className="text-xs text-error hover:text-error/80 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                {t('notifications.clearAll')}
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Bell className="w-12 h-12 text-subtle mb-3 opacity-50" />
                <p className="text-subtle">{t('notifications.noNotifications')}</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                      !notification.read ? 'bg-accent/5 border-l-2 border-l-accent' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)} flex-shrink-0`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={`text-sm font-semibold ${
                            !notification.read ? 'text-foreground' : 'text-foreground/70'
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-1.5"></div>
                          )}
                        </div>
                        
                        <p className={`text-sm ${
                          !notification.read ? 'text-subtle' : 'text-subtle/70'
                        } line-clamp-2`}>
                          {notification.message}
                        </p>
                        
                        {notification.from && (
                          <p className="text-xs text-accent mt-1">
                            {t('notifications.from')}: {notification.from}
                          </p>
                        )}
                        
                        {notification.dueDate && (
                          <p className="text-xs text-orange-500 mt-1">
                            {t('notifications.dueDate')}: {new Date(notification.dueDate).toLocaleDateString()}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-subtle">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="text-subtle hover:text-error transition-colors p-1"
                            aria-label={t('notifications.delete')}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
