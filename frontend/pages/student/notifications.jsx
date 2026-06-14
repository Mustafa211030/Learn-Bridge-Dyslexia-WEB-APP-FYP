// pages/student/notifications.jsx
// Student notifications page - full list view

import { useState, useEffect } from 'react';
import Head from 'next/head';
import StudentLayout from '../../components/student/StudentLayout';
import { studentAPI } from '../../services/studentAPI';
import styles from '../../styles/StudentNotifications.module.css';

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all'); // 'all', 'unread'

  useEffect(() => {
    fetchNotifications();
  }, [page, filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = { 
        page, 
        limit: 15,
        unreadOnly: filter === 'unread'
      };
      
      const response = await studentAPI.getNotifications(params);
      if (response.data?.success) {
        setNotifications(response.data.data.notifications);
        setTotalPages(response.data.data.totalPages);
        setUnreadCount(response.data.data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await studentAPI.markNotificationRead(id);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await studentAPI.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return new Date(date).toLocaleDateString();
  };

  const getNotificationColor = (type) => {
    const colors = {
      achievement: '#f59e0b',
      badge: '#8b5cf6',
      level_up: '#10b981',
      new_blog: '#3b82f6',
      new_ebook: '#6366f1',
      weekly_summary: '#06b6d4',
      streak: '#ef4444',
      reward: '#ec4899',
      reminder: '#f97316',
      system: '#6b7280'
    };
    return colors[type] || colors.system;
  };

  if (loading && page === 1) {
    return (
      <StudentLayout title="Notifications">
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading notifications...</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="Notifications">
      <Head>
        <title>Notifications | LearnBridge Student</title>
      </Head>

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>🔔 Notifications</h1>
            {unreadCount > 0 && (
              <span className={styles.unreadBadge}>{unreadCount} unread</span>
            )}
          </div>
          <div className={styles.headerActions}>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className={styles.markAllBtn}
              >
                ✓ Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <button 
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => { setFilter('all'); setPage(1); }}
          >
            All
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'unread' ? styles.active : ''}`}
            onClick={() => { setFilter('unread'); setPage(1); }}
          >
            Unread
          </button>
        </div>

        {/* Notifications List */}
        {error ? (
          <div className={styles.error}>
            <span className={styles.errorIcon}>😕</span>
            <p>{error}</p>
            <button onClick={fetchNotifications} className={styles.retryBtn}>
              Try Again
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📭</span>
            <h3>No Notifications</h3>
            <p>
              {filter === 'unread' 
                ? "You've read all your notifications!" 
                : "You don't have any notifications yet."}
            </p>
          </div>
        ) : (
          <div className={styles.list}>
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`${styles.item} ${!notification.isRead ? styles.unread : ''}`}
                onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
              >
                <div 
                  className={styles.itemIcon}
                  style={{ background: getNotificationColor(notification.type) }}
                >
                  {notification.icon || '🔔'}
                </div>
                <div className={styles.itemContent}>
                  <h3 className={styles.itemTitle}>{notification.title}</h3>
                  <p className={styles.itemMessage}>{notification.message}</p>
                  <span className={styles.itemTime}>
                    {getTimeAgo(notification.createdAt)}
                  </span>
                </div>
                {!notification.isRead && (
                  <span className={styles.unreadDot}></span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button 
              className={styles.pageBtn}
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              ← Previous
            </button>
            <span className={styles.pageInfo}>
              Page {page} of {totalPages}
            </span>
            <button 
              className={styles.pageBtn}
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
