// pages/student/blogs/index.jsx
// Student Blogs Page - Browse and read psychologist-authored blogs

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { studentAPI } from '../../../services/api';
import StudentLayout from '../../../components/student/StudentLayout';
import BlogCard from '../../../components/student/BlogCard';
import styles from '../../../styles/StudentBlogs.module.css';

const categories = [
  'All',
  'Child Development',
  'Learning Strategies',
  'Mental Health',
  'Study Tips',
  'Parenting Tips',
  'Social Skills',
  'Anxiety & Stress'
];

export default function StudentBlogs() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  useEffect(() => {
    fetchBlogs();
  }, [activeCategory, pagination.page]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 12
      };
      if (activeCategory !== 'All') {
        params.category = activeCategory;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await studentAPI.getBlogs(params);
      if (response.data?.success) {
        setBlogs(response.data.data.blogs || []);
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.data.pagination?.totalPages || 1
        }));
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ page: 1, totalPages: 1 });
    fetchBlogs();
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setPagination({ page: 1, totalPages: 1 });
  };

  const handleBlogClick = (blog) => {
    router.push(`/student/blogs/${blog._id || blog.slug}`);
  };

  return (
    <StudentLayout title="Articles">
      <Head>
        <title>Articles & Blogs | LearnBridge</title>
      </Head>

      <div className={styles.blogsPage}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Articles & Insights 📝</h1>
            <p className={styles.subtitle}>
              Discover helpful articles written by our psychologists
            </p>
          </div>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchBtn}>
              🔍
            </button>
          </form>
        </div>

        {/* Categories */}
        <div className={styles.categories}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryBtn} ${activeCategory === category ? styles.active : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blogs Grid */}
        <div className={styles.blogsSection}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Loading articles...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>📭</span>
              <h3>No articles found</h3>
              <p>Try selecting a different category or adjust your search.</p>
            </div>
          ) : (
            <>
              <div className={styles.blogsGrid}>
                {blogs.map((blog) => (
                  <BlogCard
                    key={blog._id}
                    blog={blog}
                    onClick={() => handleBlogClick(blog)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    className={styles.pageBtn}
                    disabled={pagination.page === 1}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  >
                    ← Previous
                  </button>
                  <span className={styles.pageInfo}>
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    className={styles.pageBtn}
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
