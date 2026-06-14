// pages/blogs/index.jsx
// Public blog listing page - displays all published blogs

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { blogsAPI } from '../../services/psychologistApi';
import styles from '../../styles/PublicBlogs.module.css';

export default function PublicBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, [selectedCategory, page]);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await blogsAPI.getPublishedBlogs({
        category: selectedCategory,
        page,
        limit: 9
      });
      if (response.data) {
        setBlogs(response.data.blogs || []);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await blogsAPI.getCategories();
      if (response.data?.categories) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      <Head>
        <title>Blog - LearnBridge</title>
        <meta name="description" content="Expert insights on child development, learning strategies, and mental health from our psychologists" />
      </Head>

      <div className={styles.blogsPage}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Expert Insights</h1>
            <p className={styles.heroSubtitle}>
              Discover valuable tips and guidance from our psychologists on child development, 
              learning strategies, and mental wellness.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Categories Filter */}
          <div className={styles.categoriesSection}>
            <div className={styles.categoriesWrapper}>
              <button
                className={`${styles.categoryBtn} ${!selectedCategory ? styles.active : ''}`}
                onClick={() => { setSelectedCategory(''); setPage(1); }}
              >
                All Posts
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  className={`${styles.categoryBtn} ${selectedCategory === cat.name ? styles.active : ''}`}
                  onClick={() => { setSelectedCategory(cat.name); setPage(1); }}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>
          </div>

          {/* Blog Grid */}
          <div className={styles.blogsSection}>
            {isLoading ? (
              <div className={styles.blogsGrid}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={styles.skeletonCard}>
                    <div className={styles.skeletonImage}></div>
                    <div className={styles.skeletonContent}>
                      <div className={styles.skeletonLine}></div>
                      <div className={styles.skeletonLineShort}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : blogs.length > 0 ? (
              <div className={styles.blogsGrid}>
                {blogs.map((blog) => (
                  <article key={blog._id} className={styles.blogCard}>
                    <Link href={`/blogs/${blog.slug}`} className={styles.blogCardLink}>
                      <div className={styles.blogCardImage}>
                        {blog.featuredImage?.url ? (
                          <img
                            src={blog.featuredImage.url}
                            alt={blog.title}
                            className={styles.blogImg}
                          />
                        ) : (
                          <div className={styles.blogPlaceholder}>
                            <span>📝</span>
                          </div>
                        )}
                        <span className={styles.blogCategory}>{blog.category}</span>
                      </div>

                      <div className={styles.blogCardContent}>
                        <div className={styles.blogMeta}>
                          <span className={styles.blogDate}>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                          <span className={styles.blogReadTime}>{blog.metrics?.readTime || 1} min read</span>
                        </div>

                        <h2 className={styles.blogTitle}>{blog.title}</h2>
                        <p className={styles.blogExcerpt}>{blog.excerpt?.substring(0, 150)}...</p>

                        <div className={styles.blogFooter}>
                          <div className={styles.blogAuthor}>
                            {blog.author?.profilePhoto ? (
                              <img
                                src={blog.author.profilePhoto}
                                alt={`${blog.author.firstName} ${blog.author.lastName}`}
                                className={styles.authorAvatar}
                              />
                            ) : (
                              <div className={styles.authorAvatarPlaceholder}>
                                {blog.author?.firstName?.charAt(0) || 'A'}
                              </div>
                            )}
                            <span className={styles.authorName}>
                              {blog.author?.firstName} {blog.author?.lastName}
                            </span>
                          </div>
                          <div className={styles.blogStats}>
                            <span>👁 {blog.metrics?.views || 0}</span>
                            <span>❤ {blog.metrics?.likes || 0}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📚</div>
                <h3>No blogs found</h3>
                <p>Check back later for new content!</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.paginationBtn}
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
              >
                ← Previous
              </button>
              <span className={styles.paginationInfo}>
                Page {page} of {totalPages}
              </span>
              <button
                className={styles.paginationBtn}
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}