// // pages/psychologist/blogs/index.jsx
// // Blog management page for psychologists - Beautiful dark theme

// import { useState, useEffect, useCallback } from 'react';
// import Head from 'next/head';
// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import PsychologistLayout from '../../../components/psychologist/layout/PsychologistLayout';
// import ProtectedRoute from '../../../components/psychologist/common/ProtectedRoute';
// import { blogsAPI } from '../../../services/psychologistApi';
// import toast from 'react-hot-toast';
// import styles from '../../../styles/psychologist/Blogs.module.css';

// export default function BlogsPage() {
//   const router = useRouter();
//   const [blogs, setBlogs] = useState([]);
//   const [counts, setCounts] = useState({ all: 0, draft: 0, published: 0, archived: 0 });
//   const [isLoading, setIsLoading] = useState(true);
//   const [statusFilter, setStatusFilter] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 12,
//     total: 0,
//     pages: 1
//   });

//   const blogCategories = [
//     'Child Development',
//     'Parenting Tips',
//     'Mental Health',
//     'Learning Strategies',
//     'Behavioral Issues',
//     'Educational Psychology',
//     'Cognitive Development',
//     'Social Skills',
//     'Emotional Intelligence',
//     'ADHD & Focus',
//     'Anxiety & Stress',
//     'Study Tips',
//     'Family Dynamics',
//     'Special Needs',
//     'Research & Insights',
//     'General Wellness'
//   ];

//   const fetchBlogs = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       const response = await blogsAPI.getMyBlogs({
//         status: statusFilter,
//         category: categoryFilter,
//         page: pagination.page,
//         limit: pagination.limit
//       });

//       if (response.data) {
//         setBlogs(response.data.blogs || []);
//         setCounts(response.data.counts || { all: 0, draft: 0, published: 0, archived: 0 });
//         setPagination(prev => ({
//           ...prev,
//           ...response.data.pagination
//         }));
//       }
//     } catch (error) {
//       console.error('Failed to fetch blogs:', error);
//       toast.error('Unable to load blogs');
//     } finally {
//       setIsLoading(false);
//     }
//   }, [statusFilter, categoryFilter, pagination.page, pagination.limit]);

//   useEffect(() => {
//     fetchBlogs();
//   }, [fetchBlogs]);

//   const handleDeleteBlog = async (blogId, blogTitle, e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (!confirm(`Are you sure you want to delete "${blogTitle}"? This action cannot be undone.`)) return;

//     try {
//       await blogsAPI.deleteBlog(blogId);
//       toast.success('Blog deleted successfully');
//       fetchBlogs();
//     } catch (error) {
//       console.error('Delete error:', error);
//       toast.error('Failed to delete blog');
//     }
//   };

//   const handleStatusChange = async (blogId, newStatus, e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     try {
//       const formData = new FormData();
//       formData.append('status', newStatus);
//       await blogsAPI.updateBlog(blogId, formData);
//       toast.success(`Blog ${newStatus === 'published' ? 'published' : 'updated'} successfully`);
//       fetchBlogs();
//     } catch (error) {
//       console.error('Status update error:', error);
//       toast.error('Failed to update blog status');
//     }
//   };

//   const getStatusClass = (status) => {
//     switch (status) {
//       case 'published': return styles.statusPublished;
//       case 'draft': return styles.statusDraft;
//       case 'archived': return styles.statusArchived;
//       default: return '';
//     }
//   };

//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   const formatTimeAgo = (date) => {
//     const now = new Date();
//     const past = new Date(date);
//     const diffMs = now - past;
//     const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
//     if (diffDays === 0) return 'Today';
//     if (diffDays === 1) return 'Yesterday';
//     if (diffDays < 7) return `${diffDays} days ago`;
//     if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
//     return formatDate(date);
//   };

//   const filteredBlogs = blogs.filter(blog => {
//     if (!searchQuery) return true;
//     const query = searchQuery.toLowerCase();
//     return (
//       blog.title?.toLowerCase().includes(query) ||
//       blog.excerpt?.toLowerCase().includes(query) ||
//       blog.category?.toLowerCase().includes(query) ||
//       blog.tags?.some(tag => tag.toLowerCase().includes(query))
//     );
//   });

//   return (
//     <>
//       <Head>
//         <title>Blog Posts - Psychologist Dashboard</title>
//         <meta name="description" content="Manage your blog posts and articles" />
//       </Head>

//       <ProtectedRoute allowedRoles={['Psychologist']}>
//         <PsychologistLayout>
//           <div className={styles.blogsPage}>
//             {/* Page Header */}
//             <div className={styles.pageHeader}>
//               <div className={styles.headerContent}>
//                 <div className={styles.headerText}>
//                   <h1 className={styles.pageTitle}>
//                     <svg className={styles.pageTitleIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                     </svg>
//                     Blog Posts
//                   </h1>
//                   <p className={styles.pageSubtitle}>Share insights, tips, and expertise with your audience</p>
//                 </div>
//                 <div className={styles.headerActions}>
//                   <Link href="/psychologist/blogs/new" className={styles.btnPrimary}>
//                     <svg className={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                     </svg>
//                     New Post
//                   </Link>
//                 </div>
//               </div>
//             </div>

//             {/* Stats Cards */}
//             <div className={styles.statsRow}>
//               <div className={styles.statCard}>
//                 <div className={styles.statIcon}>
//                   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//                   </svg>
//                 </div>
//                 <div className={styles.statContent}>
//                   <span className={styles.statNumber}>{counts.all}</span>
//                   <span className={styles.statLabel}>Total Posts</span>
//                 </div>
//               </div>
//               <div className={`${styles.statCard} ${styles.statCardGreen}`}>
//                 <div className={styles.statIcon}>
//                   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//                 <div className={styles.statContent}>
//                   <span className={styles.statNumber}>{counts.published}</span>
//                   <span className={styles.statLabel}>Published</span>
//                 </div>
//               </div>
//               <div className={`${styles.statCard} ${styles.statCardYellow}`}>
//                 <div className={styles.statIcon}>
//                   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                   </svg>
//                 </div>
//                 <div className={styles.statContent}>
//                   <span className={styles.statNumber}>{counts.draft}</span>
//                   <span className={styles.statLabel}>Drafts</span>
//                 </div>
//               </div>
//               <div className={`${styles.statCard} ${styles.statCardGray}`}>
//                 <div className={styles.statIcon}>
//                   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
//                   </svg>
//                 </div>
//                 <div className={styles.statContent}>
//                   <span className={styles.statNumber}>{counts.archived}</span>
//                   <span className={styles.statLabel}>Archived</span>
//                 </div>
//               </div>
//             </div>

//             {/* Filters */}
//             <div className={styles.filtersSection}>
//               <div className={styles.searchBox}>
//                 <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//                 <input
//                   type="text"
//                   placeholder="Search posts..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className={styles.searchInput}
//                 />
//               </div>

//               <div className={styles.filterGroup}>
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => {
//                     setStatusFilter(e.target.value);
//                     setPagination(prev => ({ ...prev, page: 1 }));
//                   }}
//                   className={styles.filterSelect}
//                 >
//                   <option value="">All Status</option>
//                   <option value="published">Published</option>
//                   <option value="draft">Drafts</option>
//                   <option value="archived">Archived</option>
//                 </select>

//                 <select
//                   value={categoryFilter}
//                   onChange={(e) => {
//                     setCategoryFilter(e.target.value);
//                     setPagination(prev => ({ ...prev, page: 1 }));
//                   }}
//                   className={styles.filterSelect}
//                 >
//                   <option value="">All Categories</option>
//                   {blogCategories.map(cat => (
//                     <option key={cat} value={cat}>{cat}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Blogs Grid */}
//             <div className={styles.contentSection}>
//               {isLoading ? (
//                 <div className={styles.blogsGrid}>
//                   {[...Array(6)].map((_, i) => (
//                     <div key={i} className={styles.skeletonCard}>
//                       <div className={styles.skeletonImage}></div>
//                       <div className={styles.skeletonContent}>
//                         <div className={styles.skeletonLine}></div>
//                         <div className={styles.skeletonLineShort}></div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : filteredBlogs.length > 0 ? (
//                 <div className={styles.blogsGrid}>
//                   {filteredBlogs.map((blog) => (
//                     <article key={blog._id} className={styles.blogCard}>
//                       <Link href={`/psychologist/blogs/${blog._id}/edit`} className={styles.blogCardLink}>
//                         <div className={styles.blogCardImage}>
//                           {blog.featuredImage?.url ? (
//                             <img
//                               src={blog.featuredImage.url}
//                               alt={blog.title}
//                               className={styles.blogCardImg}
//                             />
//                           ) : (
//                             <div className={styles.blogCardPlaceholder}>
//                               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                               </svg>
//                             </div>
//                           )}
//                           <span className={`${styles.blogCardStatus} ${getStatusClass(blog.status)}`}>
//                             {blog.status}
//                           </span>
//                         </div>

//                         <div className={styles.blogCardBody}>
//                           <div className={styles.blogCardMeta}>
//                             <span className={styles.blogCardCategory}>{blog.category}</span>
//                             <span className={styles.blogCardDate}>{formatTimeAgo(blog.createdAt)}</span>
//                           </div>
                          
//                           <h3 className={styles.blogCardTitle}>{blog.title}</h3>
                          
//                           <p className={styles.blogCardExcerpt}>
//                             {blog.excerpt?.substring(0, 120)}...
//                           </p>

//                           <div className={styles.blogCardStats}>
//                             <span className={styles.blogCardStat}>
//                               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                               </svg>
//                               {blog.metrics?.views || 0}
//                             </span>
//                             <span className={styles.blogCardStat}>
//                               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                               </svg>
//                               {blog.metrics?.likes || 0}
//                             </span>
//                             <span className={styles.blogCardStat}>
//                               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                               </svg>
//                               {blog.metrics?.readTime || 1} min
//                             </span>
//                           </div>
//                         </div>
//                       </Link>

//                       <div className={styles.blogCardFooter}>
//                         <div className={styles.blogCardTags}>
//                           {blog.tags?.slice(0, 2).map((tag, i) => (
//                             <span key={i} className={styles.blogCardTag}>#{tag}</span>
//                           ))}
//                         </div>
//                         <div className={styles.blogCardActions}>
//                           {blog.status === 'draft' && (
//                             <button
//                               className={styles.actionBtnPublish}
//                               onClick={(e) => handleStatusChange(blog._id, 'published', e)}
//                               title="Publish"
//                             >
//                               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                               </svg>
//                             </button>
//                           )}
//                           <Link
//                             href={`/psychologist/blogs/${blog._id}/edit`}
//                             className={styles.actionBtnEdit}
//                             title="Edit"
//                           >
//                             <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                             </svg>
//                           </Link>
//                           <button
//                             className={styles.actionBtnDelete}
//                             onClick={(e) => handleDeleteBlog(blog._id, blog.title, e)}
//                             title="Delete"
//                           >
//                             <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                             </svg>
//                           </button>
//                         </div>
//                       </div>
//                     </article>
//                   ))}
//                 </div>
//               ) : (
//                 <div className={styles.emptyState}>
//                   <div className={styles.emptyStateIcon}>
//                     <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                     </svg>
//                   </div>
//                   <h3 className={styles.emptyStateTitle}>No Blog Posts Yet</h3>
//                   <p className={styles.emptyStateText}>
//                     Start sharing your expertise by creating your first blog post.
//                   </p>
//                   <Link href="/psychologist/blogs/new" className={styles.btnPrimary}>
//                     <svg className={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                     </svg>
//                     Create Your First Post
//                   </Link>
//                 </div>
//               )}
//             </div>

//             {/* Pagination */}
//             {pagination.pages > 1 && (
//               <div className={styles.pagination}>
//                 <button
//                   className={styles.paginationBtn}
//                   disabled={pagination.page <= 1}
//                   onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
//                 >
//                   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                   </svg>
//                   Previous
//                 </button>
//                 <div className={styles.paginationInfo}>
//                   <span>Page {pagination.page} of {pagination.pages}</span>
//                   <span className={styles.paginationTotal}>({pagination.total} posts)</span>
//                 </div>
//                 <button
//                   className={styles.paginationBtn}
//                   disabled={pagination.page >= pagination.pages}
//                   onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
//                 >
//                   Next
//                   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </button>
//               </div>
//             )}
//           </div>
//         </PsychologistLayout>
//       </ProtectedRoute>
//     </>
//   );
// }

































// pages/psychologist/blogs/index.jsx
// Blog management page for psychologists - Dark theme with full CRUD

import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PsychologistLayout from '../../../components/psychologist/layout/PsychologistLayout';
import ProtectedRoute from '../../../components/psychologist/common/ProtectedRoute';
import { blogsAPI } from '../../../services/psychologistApi';
import toast from 'react-hot-toast';
import styles from '../../../styles/psychologist/Blogs.module.css';

export default function BlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [counts, setCounts] = useState({ all: 0, draft: 0, published: 0, archived: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1
  });

  const blogCategories = [
    'Child Development', 'Parenting Tips', 'Mental Health', 'Learning Strategies',
    'Behavioral Issues', 'Educational Psychology', 'Cognitive Development', 'Social Skills',
    'Emotional Intelligence', 'ADHD & Focus', 'Anxiety & Stress', 'Study Tips',
    'Family Dynamics', 'Special Needs', 'Research & Insights', 'General Wellness'
  ];

  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await blogsAPI.getMyBlogs({
        status: statusFilter,
        category: categoryFilter,
        page: pagination.page,
        limit: pagination.limit
      });

      if (response.data) {
        setBlogs(response.data.blogs || []);
        setCounts(response.data.counts || { all: 0, draft: 0, published: 0, archived: 0 });
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination?.total || 0,
          pages: response.data.pagination?.pages || 1
        }));
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      toast.error('Unable to load blogs');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, categoryFilter, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDeleteBlog = async (blogId, blogTitle, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm(`Are you sure you want to delete "${blogTitle}"? This action cannot be undone.`)) return;

    try {
      await blogsAPI.deleteBlog(blogId);
      toast.success('Blog deleted successfully');
      fetchBlogs();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete blog');
    }
  };

  const handleStatusChange = async (blogId, newStatus, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const formData = new FormData();
      formData.append('status', newStatus);
      await blogsAPI.updateBlog(blogId, formData);
      toast.success(`Blog ${newStatus === 'published' ? 'published' : 'updated'} successfully`);
      fetchBlogs();
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update blog status');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'published': return styles.statusPublished;
      case 'draft': return styles.statusDraft;
      case 'archived': return styles.statusArchived;
      default: return '';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(date);
  };

  const filteredBlogs = blogs.filter(blog => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      blog.title?.toLowerCase().includes(query) ||
      blog.excerpt?.toLowerCase().includes(query) ||
      blog.category?.toLowerCase().includes(query) ||
      blog.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  });

  return (
    <>
      <Head>
        <title>Blog Posts - Psychologist Dashboard</title>
        <meta name="description" content="Manage your blog posts and articles" />
      </Head>

      <ProtectedRoute allowedRoles={['Psychologist']}>
        <PsychologistLayout>
          <div className={styles.blogsPage}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
              <div className={styles.headerContent}>
                <div className={styles.headerText}>
                  <h1 className={styles.pageTitle}>
                    <svg className={styles.pageTitleIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Blog Posts
                  </h1>
                  <p className={styles.pageSubtitle}>Share insights, tips, and expertise with your audience</p>
                </div>
                <div className={styles.headerActions}>
                  <Link href="/psychologist/blogs/new" className={styles.btnPrimary}>
                    <svg className={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Post
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statNumber}>{counts.all}</span>
                  <span className={styles.statLabel}>Total Posts</span>
                </div>
              </div>
              <div className={`${styles.statCard} ${styles.statCardGreen}`}>
                <div className={styles.statIcon}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statNumber}>{counts.published}</span>
                  <span className={styles.statLabel}>Published</span>
                </div>
              </div>
              <div className={`${styles.statCard} ${styles.statCardYellow}`}>
                <div className={styles.statIcon}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statNumber}>{counts.draft}</span>
                  <span className={styles.statLabel}>Drafts</span>
                </div>
              </div>
              <div className={`${styles.statCard} ${styles.statCardGray}`}>
                <div className={styles.statIcon}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statNumber}>{counts.archived}</span>
                  <span className={styles.statLabel}>Archived</span>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className={styles.filtersSection}>
              <div className={styles.searchBox}>
                <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <div className={styles.filterGroup}>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
                  className={styles.filterSelect}
                >
                  <option value="">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Drafts</option>
                  <option value="archived">Archived</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
                  className={styles.filterSelect}
                >
                  <option value="">All Categories</option>
                  {blogCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Blogs Grid */}
            <div className={styles.contentSection}>
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
              ) : filteredBlogs.length > 0 ? (
                <div className={styles.blogsGrid}>
                  {filteredBlogs.map((blog) => (
                    <article key={blog._id} className={styles.blogCard}>
                      <Link href={`/psychologist/blogs/${blog._id}/edit`} className={styles.blogCardLink}>
                        <div className={styles.blogCardImage}>
                          {blog.featuredImage?.url ? (
                            <img src={blog.featuredImage.url} alt={blog.title} className={styles.blogCardImg} />
                          ) : (
                            <div className={styles.blogCardPlaceholder}>
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <span className={`${styles.blogCardStatus} ${getStatusClass(blog.status)}`}>
                            {blog.status}
                          </span>
                        </div>

                        <div className={styles.blogCardBody}>
                          <div className={styles.blogCardMeta}>
                            <span className={styles.blogCardCategory}>{blog.category}</span>
                            <span className={styles.blogCardDate}>{formatTimeAgo(blog.createdAt)}</span>
                          </div>
                          
                          <h3 className={styles.blogCardTitle}>{blog.title}</h3>
                          
                          <p className={styles.blogCardExcerpt}>
                            {blog.excerpt?.substring(0, 120)}...
                          </p>

                          <div className={styles.blogCardStats}>
                            <span className={styles.blogCardStat}>
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {blog.metrics?.views || 0}
                            </span>
                            <span className={styles.blogCardStat}>
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              {blog.metrics?.likes || 0}
                            </span>
                            <span className={styles.blogCardStat}>
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {blog.metrics?.readTime || 1} min
                            </span>
                          </div>
                        </div>
                      </Link>

                      <div className={styles.blogCardFooter}>
                        <div className={styles.blogCardTags}>
                          {blog.tags?.slice(0, 2).map((tag, i) => (
                            <span key={i} className={styles.blogCardTag}>#{tag}</span>
                          ))}
                        </div>
                        <div className={styles.blogCardActions}>
                          {blog.status === 'draft' && (
                            <button
                              className={styles.actionBtnPublish}
                              onClick={(e) => handleStatusChange(blog._id, 'published', e)}
                              title="Publish"
                            >
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          )}
                          <Link href={`/psychologist/blogs/${blog._id}/edit`} className={styles.actionBtnEdit} title="Edit">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            className={styles.actionBtnDelete}
                            onClick={(e) => handleDeleteBlog(blog._id, blog.title, e)}
                            title="Delete"
                          >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateIcon}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className={styles.emptyStateTitle}>No Blog Posts Yet</h3>
                  <p className={styles.emptyStateText}>Start sharing your expertise by creating your first blog post.</p>
                  <Link href="/psychologist/blogs/new" className={styles.btnPrimary}>
                    <svg className={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Your First Post
                  </Link>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.paginationBtn}
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <div className={styles.paginationInfo}>
                  <span>Page {pagination.page} of {pagination.pages}</span>
                  <span className={styles.paginationTotal}>({pagination.total} posts)</span>
                </div>
                <button
                  className={styles.paginationBtn}
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </PsychologistLayout>
      </ProtectedRoute>
    </>
  );
}