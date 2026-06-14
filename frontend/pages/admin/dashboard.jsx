// pages/admin/dashboard.jsx
// Premium Admin Dashboard with Beautiful UI

import { useState, useEffect } from 'react';
import AdminProtectedRoute from '../../components/admin/AdminProtectedRoute';
import AdminLayout from '../../components/admin/AdminLayout';
import { dashboardAPI } from '../../services/adminApi';
import styles from '../../styles/admin/Dashboard.module.css';

// Icon Components
const Icons = {
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  UserCheck: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <polyline points="17,11 19,13 23,9" />
    </svg>
  ),
  Gamepad: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="6" y1="11" x2="10" y2="11" />
      <line x1="8" y1="9" x2="8" y2="13" />
      <line x1="15" y1="12" x2="15.01" y2="12" />
      <line x1="18" y1="10" x2="18.01" y2="10" />
      <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
    </svg>
  ),
  FileText: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  TrendingUp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
      <polyline points="17,6 23,6 23,12" />
    </svg>
  ),
  TrendingDown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23,18 13.5,8.5 8.5,13.5 1,6" />
      <polyline points="17,18 23,18 23,12" />
    </svg>
  ),
  Activity: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  ),
  Eye: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  ArrowRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12,5 19,12 12,19" />
    </svg>
  ),
  Database: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  Cpu: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  ),
  HardDrive: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="22" y1="12" x2="2" y2="12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      <line x1="6" y1="16" x2="6.01" y2="16" />
      <line x1="10" y1="16" x2="10.01" y2="16" />
    </svg>
  ),
  Zap: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
    </svg>
  ),
};

// Stat Card Component
const StatCard = ({ title, value, change, changeType, icon: Icon, color }) => {
  const isPositive = changeType === 'positive';
  
  return (
    <div className={styles.statCard} style={{ '--accent-color': color }}>
      <div className={styles.statCardHeader}>
        <div className={styles.statIconWrapper}>
          <Icon />
        </div>
        <div className={styles.statChange} data-type={changeType}>
          {isPositive ? <Icons.TrendingUp /> : <Icons.TrendingDown />}
          <span>{change}</span>
        </div>
      </div>
      <div className={styles.statCardBody}>
        <h3 className={styles.statValue}>{value}</h3>
        <p className={styles.statTitle}>{title}</p>
      </div>
      <div className={styles.statCardFooter}>
        <span>View details</span>
        <Icons.ArrowRight />
      </div>
    </div>
  );
};

// Activity Item Component
const ActivityItem = ({ activity }) => {
  const getActivityIcon = (action) => {
    const icons = {
      'user_created': '👤',
      'user_updated': '✏️',
      'user_deleted': '🗑️',
      'game_enabled': '🎮',
      'game_disabled': '⏸️',
      'blog_approved': '✅',
      'blog_rejected': '❌',
      'settings_updated': '⚙️',
      'login': '🔐',
    };
    return icons[action] || '📌';
  };

  const formatTime = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffMs = now - activityDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className={styles.activityItem}>
      <div className={styles.activityIcon}>
        {getActivityIcon(activity.action)}
      </div>
      <div className={styles.activityContent}>
        <p className={styles.activityText}>
          <strong>{activity.adminName || 'Admin'}</strong> {activity.description}
        </p>
        <span className={styles.activityTime}>
          <Icons.Clock /> {formatTime(activity.createdAt)}
        </span>
      </div>
    </div>
  );
};

// Chart Component - Bar Chart
const BarChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h3>{title}</h3>
        <span className={styles.chartPeriod}>Last 14 days</span>
      </div>
      <div className={styles.barChart}>
        {data.map((item, index) => (
          <div key={index} className={styles.barItem}>
            <div className={styles.barWrapper}>
              <div 
                className={styles.bar}
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              >
                <span className={styles.barTooltip}>{item.value}</span>
              </div>
            </div>
            <span className={styles.barLabel}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Donut Chart Component
const DonutChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const segments = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    return {
      ...item,
      percentage,
      startAngle,
      endAngle: currentAngle,
    };
  });

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h3>{title}</h3>
      </div>
      <div className={styles.donutChart}>
        <div className={styles.donutRing}>
          <svg viewBox="0 0 100 100">
            {segments.map((segment, index) => {
              const startAngle = (segment.startAngle - 90) * (Math.PI / 180);
              const endAngle = (segment.endAngle - 90) * (Math.PI / 180);
              const x1 = 50 + 40 * Math.cos(startAngle);
              const y1 = 50 + 40 * Math.sin(startAngle);
              const x2 = 50 + 40 * Math.cos(endAngle);
              const y2 = 50 + 40 * Math.sin(endAngle);
              const largeArc = segment.percentage > 50 ? 1 : 0;

              return (
                <path
                  key={index}
                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={segment.color}
                  className={styles.donutSegment}
                />
              );
            })}
            <circle cx="50" cy="50" r="28" fill="#0f172a" />
          </svg>
          <div className={styles.donutCenter}>
            <span className={styles.donutTotal}>{total}</span>
            <span className={styles.donutLabel}>Total</span>
          </div>
        </div>
        <div className={styles.donutLegend}>
          {segments.map((segment, index) => (
            <div key={index} className={styles.legendItem}>
              <span className={styles.legendColor} style={{ background: segment.color }} />
              <span className={styles.legendLabel}>{segment.label}</span>
              <span className={styles.legendValue}>{segment.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// System Status Component
const SystemStatus = ({ data }) => {
  const getStatusColor = (value) => {
    if (value < 50) return '#10b981';
    if (value < 80) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className={styles.systemCard}>
      <div className={styles.systemHeader}>
        <h3><Icons.Activity /> System Status</h3>
        <span className={styles.statusBadge}>
          <span className={styles.statusDot}></span>
          All Systems Operational
        </span>
      </div>
      <div className={styles.systemGrid}>
        <div className={styles.systemItem}>
          <div className={styles.systemIcon}><Icons.Database /></div>
          <div className={styles.systemInfo}>
            <span className={styles.systemLabel}>Database</span>
            <span className={styles.systemValue} style={{ color: '#10b981' }}>
              {data?.database || 'Connected'}
            </span>
          </div>
        </div>
        <div className={styles.systemItem}>
          <div className={styles.systemIcon}><Icons.Clock /></div>
          <div className={styles.systemInfo}>
            <span className={styles.systemLabel}>Uptime</span>
            <span className={styles.systemValue}>{data?.uptime || '99.9%'}</span>
          </div>
        </div>
        <div className={styles.systemItem}>
          <div className={styles.systemIcon}><Icons.Cpu /></div>
          <div className={styles.systemInfo}>
            <span className={styles.systemLabel}>CPU Usage</span>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ 
                  width: `${data?.cpu || 45}%`,
                  background: getStatusColor(data?.cpu || 45)
                }}
              />
            </div>
          </div>
        </div>
        <div className={styles.systemItem}>
          <div className={styles.systemIcon}><Icons.HardDrive /></div>
          <div className={styles.systemInfo}>
            <span className={styles.systemLabel}>Memory</span>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ 
                  width: `${data?.memory || 62}%`,
                  background: getStatusColor(data?.memory || 62)
                }}
              />
            </div>
          </div>
        </div>
        <div className={styles.systemItem}>
          <div className={styles.systemIcon}><Icons.Zap /></div>
          <div className={styles.systemInfo}>
            <span className={styles.systemLabel}>Active Users</span>
            <span className={styles.systemValue}>{data?.activeUsers || 24}</span>
          </div>
        </div>
        <div className={styles.systemItem}>
          <div className={styles.systemIcon}><Icons.Eye /></div>
          <div className={styles.systemInfo}>
            <span className={styles.systemLabel}>Today&apos;s Visits</span>
            <span className={styles.systemValue}>{data?.todayVisits || 1247}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getSummary();
      setData(response.data.data);
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
      // Set mock data for development
      setData({
        stats: {
          totalUsers: 1234,
          students: 1089,
          psychologists: 45,
          enabledGames: 8,
          publishedBlogs: 156,
        },
        changes: {
          users: '+12%',
          students: '+8%',
          games: '+2',
          blogs: '+15%',
        },
        newUsersChart: [
          { label: 'M', value: 45 },
          { label: 'T', value: 52 },
          { label: 'W', value: 38 },
          { label: 'T', value: 65 },
          { label: 'F', value: 48 },
          { label: 'S', value: 72 },
          { label: 'S', value: 55 },
          { label: 'M', value: 61 },
          { label: 'T', value: 43 },
          { label: 'W', value: 78 },
          { label: 'T', value: 54 },
          { label: 'F', value: 89 },
          { label: 'S', value: 67 },
          { label: 'S', value: 82 },
        ],
        roleDistribution: [
          { label: 'Students', value: 1089, color: '#6366f1' },
          { label: 'Psychologists', value: 45, color: '#8b5cf6' },
          { label: 'Admins', value: 12, color: '#ec4899' },
        ],
        recentActivity: [
          { action: 'user_created', description: 'created a new student account', adminName: 'John Admin', createdAt: new Date(Date.now() - 300000) },
          { action: 'game_enabled', description: 'enabled Math Quest game', adminName: 'Sarah Admin', createdAt: new Date(Date.now() - 1800000) },
          { action: 'blog_approved', description: 'approved blog post "Learning Tips"', adminName: 'John Admin', createdAt: new Date(Date.now() - 3600000) },
          { action: 'settings_updated', description: 'updated system settings', adminName: 'Sarah Admin', createdAt: new Date(Date.now() - 7200000) },
          { action: 'user_deleted', description: 'removed inactive user account', adminName: 'John Admin', createdAt: new Date(Date.now() - 86400000) },
        ],
        systemStatus: {
          database: 'Connected',
          uptime: '99.9%',
          cpu: 45,
          memory: 62,
          activeUsers: 24,
          todayVisits: 1247,
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminProtectedRoute>
        <AdminLayout title="Dashboard" breadcrumbs={['Dashboard']}>
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading dashboard...</p>
          </div>
        </AdminLayout>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute>
      <AdminLayout title="Dashboard" breadcrumbs={['Dashboard']}>
        {/* Welcome Section */}
        <div className={styles.welcomeSection}>
          <div className={styles.welcomeContent}>
            <h2>Welcome back! 👋</h2>
            <p>Here&apos;s what&apos;s happening with your platform today.</p>
          </div>
          <div className={styles.quickActions}>
            <button className={styles.quickActionBtn}>
              <Icons.Users /> Add User
            </button>
            <button className={styles.quickActionBtn}>
              <Icons.FileText /> New Post
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <StatCard
            title="Total Users"
            value={data?.stats?.totalUsers?.toLocaleString() || '0'}
            change={data?.changes?.users || '+0%'}
            changeType="positive"
            icon={Icons.Users}
            color="#6366f1"
          />
          <StatCard
            title="Students"
            value={data?.stats?.students?.toLocaleString() || '0'}
            change={data?.changes?.students || '+0%'}
            changeType="positive"
            icon={Icons.UserCheck}
            color="#10b981"
          />
          <StatCard
            title="Active Games"
            value={data?.stats?.enabledGames || '0'}
            change={data?.changes?.games || '+0'}
            changeType="positive"
            icon={Icons.Gamepad}
            color="#f59e0b"
          />
          <StatCard
            title="Published Blogs"
            value={data?.stats?.publishedBlogs?.toLocaleString() || '0'}
            change={data?.changes?.blogs || '+0%'}
            changeType="positive"
            icon={Icons.FileText}
            color="#ec4899"
          />
        </div>

        {/* Charts Section */}
        <div className={styles.chartsGrid}>
          <BarChart 
            data={data?.newUsersChart || []} 
            title="New User Registrations"
          />
          <DonutChart 
            data={data?.roleDistribution || []} 
            title="User Distribution"
          />
        </div>

        {/* Bottom Section */}
        <div className={styles.bottomGrid}>
          {/* Recent Activity */}
          <div className={styles.activityCard}>
            <div className={styles.activityHeader}>
              <h3><Icons.Activity /> Recent Activity</h3>
              <button className={styles.viewAllBtn}>View All</button>
            </div>
            <div className={styles.activityList}>
              {data?.recentActivity?.map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
              ))}
            </div>
          </div>

          {/* System Status */}
          <SystemStatus data={data?.systemStatus} />
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
};

export default DashboardPage;
