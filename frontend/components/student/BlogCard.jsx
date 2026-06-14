// components/student/BlogCard.jsx
// Card component for displaying blog posts

import Link from 'next/link';
import styles from './BlogCard.module.css';

const categoryColors = {
  'Child Development': '#4f46e5',
  'Parenting Tips': '#ec4899',
  'Mental Health': '#10b981',
  'Learning Strategies': '#f59e0b',
  'Behavioral Issues': '#ef4444',
  'Educational Psychology': '#8b5cf6',
  'Cognitive Development': '#06b6d4',
  'Social Skills': '#6366f1',
  'Emotional Intelligence': '#f97316',
  'ADHD & Focus': '#14b8a6',
  'Anxiety & Stress': '#a855f7',
  'Study Tips': '#3b82f6',
  'Family Dynamics': '#e11d48',
  'Special Needs': '#0ea5e9',
  'Research & Insights': '#84cc16',
  'General Wellness': '#22c55e',
  'Other': '#64748b'
};

export default function BlogCard({ blog, variant = 'default' }) {
  const categoryColor = categoryColors[blog.category] || categoryColors['Other'];
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (variant === 'compact') {
    return (
      <Link href={`/student/blogs/${blog._id || blog.slug}`} className={styles.compactCard}>
        <div className={styles.compactContent}>
          <span 
            className={styles.compactCategory}
            style={{ color: categoryColor }}
          >
            {blog.category}
          </span>
          <h3 className={styles.compactTitle}>{blog.title}</h3>
          <span className={styles.compactMeta}>
            {blog.metrics?.readTime || 1} min read
          </span>
        </div>
        {blog.featuredImage?.url && (
          <div className={styles.compactImage}>
            <img src={blog.featuredImage.url} alt="" />
          </div>
        )}
      </Link>
    );
  }

  return (
    <Link href={`/student/blogs/${blog._id || blog.slug}`} className={styles.card}>
      {/* Image */}
      <div className={styles.imageWrapper}>
        {blog.featuredImage?.url ? (
          <img 
            src={blog.featuredImage.url} 
            alt={blog.featuredImage.alt || blog.title}
            className={styles.image}
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span>📝</span>
          </div>
        )}
        <span 
          className={styles.category}
          style={{ backgroundColor: categoryColor }}
        >
          {blog.category}
        </span>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h3 className={styles.title}>{blog.title}</h3>
        <p className={styles.excerpt}>
          {blog.excerpt || blog.content?.substring(0, 120)}...
        </p>

        {/* Meta */}
        <div className={styles.meta}>
          <div className={styles.author}>
            <div className={styles.authorAvatar}>
              {blog.author?.firstName?.charAt(0) || 'A'}
            </div>
            <span className={styles.authorName}>
              {blog.author?.firstName} {blog.author?.lastName}
            </span>
          </div>
          <div className={styles.metaRight}>
            <span className={styles.date}>
              {formatDate(blog.publishedAt || blog.createdAt)}
            </span>
            <span className={styles.readTime}>
              📖 {blog.metrics?.readTime || 1} min
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <span className={styles.stat}>
            👁️ {blog.metrics?.views || 0}
          </span>
          <span className={styles.stat}>
            ❤️ {blog.metrics?.likes || 0}
          </span>
          {blog.metrics?.comments > 0 && (
            <span className={styles.stat}>
              💬 {blog.metrics.comments}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
