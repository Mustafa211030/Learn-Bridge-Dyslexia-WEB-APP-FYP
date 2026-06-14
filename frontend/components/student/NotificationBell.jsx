// components/student/NotificationBell.jsx
// Notification bell with dropdown for student notifications

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { studentAPI } from '../../services/api';
import styles from './NotificationBell.module.css';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await studentAPI.getNotifications({ limit: 5 });
      if (response.data?.success) {
        setNotifications(response.data.data.notifications);
        setUnreadCount(response.data.data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await studentAPI.markNotificationRead(id);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await studentAPI.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button 
        className={styles.bellButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <span className={styles.bellIcon}>🔔</span>
        {unreadCount > 0 && (
          <span className={styles.badge}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <h3 className={styles.title}>Notifications</h3>
            {unreadCount > 0 && (
              <button 
                className={styles.markAllBtn}
                onClick={markAllAsRead}
              >
                Mark all read
              </button>
            )}
          </div>

          <div className={styles.list}>
            {loading ? (
              <div className={styles.loading}>Loading...</div>
            ) : notifications.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>📭</span>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`${styles.item} ${!notification.isRead ? styles.unread : ''}`}
                  onClick={() => !notification.isRead && markAsRead(notification._id)}
                >
                  <span className={styles.itemIcon}>{notification.icon || '🔔'}</span>
                  <div className={styles.itemContent}>
                    <p className={styles.itemTitle}>{notification.title}</p>
                    <p className={styles.itemMessage}>{notification.message}</p>
                    <span className={styles.itemTime}>
                      {getTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                  {!notification.isRead && (
                    <span className={styles.unreadDot}></span>
                  )}
                </div>
              ))
            )}
          </div>

          <Link href="/student/notifications" className={styles.viewAll}>
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
