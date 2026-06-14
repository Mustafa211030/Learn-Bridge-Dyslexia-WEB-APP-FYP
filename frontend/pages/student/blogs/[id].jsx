// pages/student/blogs/[id].jsx
// Individual Blog Reading Page

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { studentAPI } from '../../../services/api';
import StudentLayout from '../../../components/student/StudentLayout';
import BlogCard from '../../../components/student/BlogCard';
import styles from '../../../styles/StudentBlogs.module.css';

export default function BlogReadingPage() {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getBlogById(id);
      if (response.data?.success) {
        setBlog(response.data.data.blog);
        setRelatedBlogs(response.data.data.relatedBlogs || []);
        setIsLiked(response.data.data.blog.isLiked || false);
      }
    } catch (error) {
      console.error('Failed to fetch blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const response = await studentAPI.toggleBlogLike(id);
      if (response.data?.success) {
        setIsLiked(response.data.data.isLiked);
        setBlog(prev => ({
          ...prev,
          metrics: {
            ...prev.metrics,
            likes: response.data.data.likesCount
          }
        }));
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <StudentLayout title="Loading...">
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading article...</p>
        </div>
      </StudentLayout>
    );
  }

  if (!blog) {
    return (
      <StudentLayout title="Not Found">
        <div className={styles.notFound}>
          <span className={styles.notFoundIcon}>📭</span>
          <h2>Article Not Found</h2>
          <p>The article you're looking for doesn't exist or has been removed.</p>
          <Link href="/student/blogs" className={styles.backLink}>
            ← Back to Articles
          </Link>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title={blog.title}>
      <Head>
        <title>{blog.title} | LearnBridge</title>
        <meta name="description" content={blog.excerpt} />
      </Head>

      <div className={styles.blogReadPage}>
        {/* Back Navigation */}
        <div className={styles.backNav}>
          <Link href="/student/blogs" className={styles.backLink}>
            ← Back to Articles
          </Link>
        </div>

        {/* Article Content */}
        <article className={styles.article}>
          {/* Featured Image */}
          {blog.featuredImage?.url && (
            <div className={styles.featuredImage}>
              <img src={blog.featuredImage.url} alt={blog.featuredImage.alt || blog.title} />
            </div>
          )}

          {/* Article Header */}
          <header className={styles.articleHeader}>
            <span className={styles.articleCategory}>{blog.category}</span>
            <h1 className={styles.articleTitle}>{blog.title}</h1>
            
            <div className={styles.articleMeta}>
              <div className={styles.authorInfo}>
                <div className={styles.authorAvatar}>
                  {blog.author?.firstName?.charAt(0) || 'A'}
                </div>
                <div className={styles.authorDetails}>
                  <span className={styles.authorName}>
                    {blog.author?.firstName} {blog.author?.lastName}
                  </span>
                  <span className={styles.articleDate}>
                    {formatDate(blog.publishedAt || blog.createdAt)}
                  </span>
                </div>
              </div>
              <div className={styles.articleStats}>
                <span>📖 {blog.metrics?.readTime || 1} min read</span>
                <span>👁️ {blog.metrics?.views || 0} views</span>
              </div>
            </div>
          </header>

          {/* Article Body */}
          <div 
            className={styles.articleContent}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className={styles.tags}>
              {blog.tags.map((tag, index) => (
                <span key={index} className={styles.tag}>#{tag}</span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className={styles.articleActions}>
            <button 
              className={`${styles.likeBtn} ${isLiked ? styles.liked : ''}`}
              onClick={handleLike}
            >
              {isLiked ? '❤️' : '🤍'} {blog.metrics?.likes || 0} Likes
            </button>
            <button className={styles.shareBtn}>
              📤 Share
            </button>
          </div>
        </article>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <section className={styles.relatedSection}>
            <h3 className={styles.relatedTitle}>Related Articles</h3>
            <div className={styles.relatedGrid}>
              {relatedBlogs.map((related) => (
                <BlogCard key={related._id} blog={related} variant="compact" />
              ))}
            </div>
          </section>
        )}
      </div>
    </StudentLayout>
  );
}
