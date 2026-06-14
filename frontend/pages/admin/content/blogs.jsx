// pages/admin/content/blogs.jsx
// Admin Blog Content Moderation Page

import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import AdminProtectedRoute from '../../../components/admin/AdminProtectedRoute';
import AdminLayout from '../../../components/admin/AdminLayout';
import { contentAPI } from '../../../services/adminApi';
import styles from '../../../styles/admin/ContentBlogs.module.css';

const Icons = {
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Eye: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  MessageCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
};

// Blog Card Component
const BlogCard = ({ blog, onApprove, onReject, onHide, onToggleComments }) => {
  const [loading, setLoading] = useState(null);

  const handleAction = async (action, fn) => {
    setLoading(action);
    await fn();
    setLoading(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: '#f59e0b',
      published: '#10b981',
      archived: '#64748b',
    };
    return colors[status] || '#64748b';
  };

  return (
    <div className={styles.blogCard}>
      <div className={styles.blogHeader}>
        {blog.featuredImage?.url && (
          <div 
            className={styles.blogImage}
            style={{ backgroundImage: `url(${blog.featuredImage.url})` }}
          />
        )}
        <div className={styles.blogMeta}>
          <span 
            className={styles.statusBadge}
            style={{ backgroundColor: `${getStatusColor(blog.status)}20`, color: getStatusColor(blog.status) }}
          >
            {blog.status}
          </span>
          <span className={styles.categoryBadge}>{blog.category}</span>
        </div>
      </div>

      <div className={styles.blogBody}>
        <h3 className={styles.blogTitle}>{blog.title}</h3>
        <p className={styles.blogExcerpt}>{blog.excerpt}</p>

        <div className={styles.authorInfo}>
          <div className={styles.authorAvatar}>
            {blog.author?.firstName?.charAt(0)}{blog.author?.lastName?.charAt(0)}
          </div>
          <div className={styles.authorDetails}>
            <span className={styles.authorName}>
              {blog.author?.firstName} {blog.author?.lastName}
            </span>
            <span className={styles.blogDate}>
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className={styles.blogStats}>
          <span className={styles.stat}>👁 {blog.metrics?.views || 0}</span>
          <span className={styles.stat}>❤️ {blog.metrics?.likes || 0}</span>
          <span className={styles.stat}>💬 {blog.metrics?.comments || 0}</span>
        </div>
      </div>

      <div className={styles.blogActions}>
        {blog.status === 'draft' && (
          <>
            <button
              className={`${styles.actionBtn} ${styles.approveBtn}`}
              onClick={() => handleAction('approve', () => onApprove(blog._id))}
              disabled={loading}
            >
              {loading === 'approve' ? 'Processing...' : <><Icons.Check /> Approve</>}
            </button>
            <button
              className={`${styles.actionBtn} ${styles.rejectBtn}`}
              onClick={() => handleAction('reject', () => onReject(blog._id))}
              disabled={loading}
            >
              {loading === 'reject' ? 'Processing...' : <><Icons.X /> Reject</>}
            </button>
          </>
        )}

        {blog.status === 'published' && (
          <>
            <button
              className={`${styles.actionBtn} ${styles.hideBtn}`}
              onClick={() => handleAction('hide', () => onHide(blog._id))}
              disabled={loading}
            >
              {loading === 'hide' ? 'Processing...' : <><Icons.EyeOff /> Hide</>}
            </button>
            <button
              className={`${styles.actionBtn} ${blog.allowComments ? styles.disableBtn : styles.enableBtn}`}
              onClick={() => handleAction('comments', () => onToggleComments(blog._id, !blog.allowComments))}
              disabled={loading}
            >
              {loading === 'comments' ? 'Processing...' : (
                <><Icons.MessageCircle /> {blog.allowComments ? 'Disable' : 'Enable'} Comments</>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// Main Component
const ContentBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [counts, setCounts] = useState({ all: 0, draft: 0, published: 0, archived: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 12 });

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await contentAPI.getBlogs({
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter,
        search,
      });
      setBlogs(response.data.data.blogs);
      setCounts(response.data.data.counts);
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, statusFilter, search]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleApprove = async (blogId) => {
    try {
      await contentAPI.approveBlog(blogId);
      fetchBlogs();
    } catch (err) {
      console.error('Failed to approve blog:', err);
      alert('Failed to approve blog');
    }
  };

  const handleReject = async (blogId) => {
    const reason = prompt('Enter rejection reason (optional):');
    try {
      await contentAPI.rejectBlog(blogId, reason);
      fetchBlogs();
    } catch (err) {
      console.error('Failed to reject blog:', err);
      alert('Failed to reject blog');
    }
  };

  const handleHide = async (blogId) => {
    try {
      await contentAPI.hideBlog(blogId);
      fetchBlogs();
    } catch (err) {
      console.error('Failed to hide blog:', err);
      alert('Failed to hide blog');
    }
  };

  const handleToggleComments = async (blogId, allowComments) => {
    try {
      await contentAPI.toggleComments(blogId, allowComments);
      fetchBlogs();
    } catch (err) {
      console.error('Failed to toggle comments:', err);
      alert('Failed to toggle comments');
    }
  };

  return (
    <AdminProtectedRoute>
      <Head>
        <title>Content Moderation | LearnBridge Admin</title>
      </Head>

      <AdminLayout title="Blog Moderation">
        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard} onClick={() => setStatusFilter('')}>
            <span className={styles.statValue}>{counts.all}</span>
            <span className={styles.statLabel}>All Blogs</span>
          </div>
          <div className={styles.statCard} onClick={() => setStatusFilter('draft')}>
            <span className={styles.statValue}>{counts.draft}</span>
            <span className={styles.statLabel}>Pending Review</span>
          </div>
          <div className={styles.statCard} onClick={() => setStatusFilter('published')}>
            <span className={styles.statValue}>{counts.published}</span>
            <span className={styles.statLabel}>Published</span>
          </div>
          <div className={styles.statCard} onClick={() => setStatusFilter('archived')}>
            <span className={styles.statValue}>{counts.archived}</span>
            <span className={styles.statLabel}>Archived</span>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filtersSection}>
          <div className={styles.tabsContainer}>
            {['', 'draft', 'published', 'archived'].map(status => (
              <button
                key={status}
                className={`${styles.tab} ${statusFilter === status ? styles.tabActive : ''}`}
                onClick={() => setStatusFilter(status)}
              >
                {status === '' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className={styles.searchForm}>
            <Icons.Search />
            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Loading blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No blogs found</p>
          </div>
        ) : (
          <div className={styles.blogsGrid}>
            {blogs.map(blog => (
              <BlogCard
                key={blog._id}
                blog={blog}
                onApprove={handleApprove}
                onReject={handleReject}
                onHide={handleHide}
                onToggleComments={handleToggleComments}
              />
            ))}
          </div>
        )}
      </AdminLayout>
    </AdminProtectedRoute>
  );
};

export default ContentBlogsPage;
