// // pages/student/ebooks/index.jsx
// // E-books library page for students

// import { useState, useEffect } from 'react';
// import Head from 'next/head';
// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import StudentLayout from '../../../components/student/StudentLayout';
// import { studentAPI } from '../../../services/studentAPI';
// import styles from '../../../styles/StudentEbooks.module.css';

// export default function StudentEbooks() {
//   const router = useRouter();
//   const [ebooks, setEbooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [category, setCategory] = useState('');

//   const categories = [
//     'All Categories',
//     'Cognitive Development',
//     'Learning Strategies',
//     'Study Skills',
//     'Communication Skills'
//   ];

//   useEffect(() => {
//     fetchEbooks();
//   }, [page, category]);

//   const fetchEbooks = async () => {
//     try {
//       setLoading(true);
//       const params = { page, limit: 12 };
//       if (category && category !== 'All Categories') {
//         params.category = category;
//       }
      
//       const response = await studentAPI.getEbooks(params);
//       if (response.data?.success) {
//         setEbooks(response.data.data.ebooks);
//         setTotalPages(response.data.data.pagination.totalPages);
//       }
//     } catch (err) {
//       console.error('Failed to fetch ebooks:', err);
//       setError('Failed to load ebooks');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReadBook = (bookId) => {
//     router.push(`/ebook/reader/${bookId}`);
//   };

//   if (loading && page === 1) {
//     return (
//       <StudentLayout title="E-Books">
//         <div className={styles.loading}>
//           <div className={styles.spinner}></div>
//           <p>Loading your library...</p>
//         </div>
//       </StudentLayout>
//     );
//   }

//   return (
//     <StudentLayout title="E-Books">
//       <Head>
//         <title>E-Books | LearnBridge Student</title>
//       </Head>

//       <div className={styles.container}>
//         {/* Header */}
//         <div className={styles.header}>
//           <div className={styles.headerContent}>
//             <h1 className={styles.title}>📚 E-Book Library</h1>
//             <p className={styles.subtitle}>
//               Explore our collection of dyslexia-friendly stories and books
//             </p>
//           </div>
//         </div>

//         {/* Quick Access */}
//         <div className={styles.quickAccess}>
//           <Link href="/ebook" className={styles.quickAccessCard}>
//             <span className={styles.quickIcon}>📖</span>
//             <div className={styles.quickInfo}>
//               <span className={styles.quickTitle}>Story Reader</span>
//               <span className={styles.quickDesc}>Continue reading bilingual stories</span>
//             </div>
//             <span className={styles.quickArrow}>→</span>
//           </Link>
//           <Link href="/ebook/library" className={styles.quickAccessCard}>
//             <span className={styles.quickIcon}>📚</span>
//             <div className={styles.quickInfo}>
//               <span className={styles.quickTitle}>Story Library</span>
//               <span className={styles.quickDesc}>Browse all available stories</span>
//             </div>
//             <span className={styles.quickArrow}>→</span>
//           </Link>
//         </div>

//         {/* Filters */}
//         <div className={styles.filters}>
//           <select 
//             value={category}
//             onChange={(e) => {
//               setCategory(e.target.value);
//               setPage(1);
//             }}
//             className={styles.filterSelect}
//           >
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>{cat}</option>
//             ))}
//           </select>
//         </div>

//         {/* Books Grid */}
//         {error ? (
//           <div className={styles.error}>
//             <span className={styles.errorIcon}>😕</span>
//             <p>{error}</p>
//             <button onClick={fetchEbooks} className={styles.retryBtn}>
//               Try Again
//             </button>
//           </div>
//         ) : ebooks.length === 0 ? (
//           <div className={styles.empty}>
//             <span className={styles.emptyIcon}>📚</span>
//             <h3>No E-Books Available Yet</h3>
//             <p>Check out our Story Library for bilingual stories!</p>
//             <Link href="/ebook/library" className={styles.emptyBtn}>
//               Go to Story Library
//             </Link>
//           </div>
//         ) : (
//           <div className={styles.grid}>
//             {ebooks.map((book) => (
//               <div key={book._id} className={styles.bookCard}>
//                 <div className={styles.bookCover}>
//                   {book.thumbnail?.url ? (
//                     <img src={book.thumbnail.url} alt={book.title} />
//                   ) : (
//                     <div className={styles.bookPlaceholder}>
//                       <span>📖</span>
//                     </div>
//                   )}
//                   {book.readingProgress?.completed && (
//                     <span className={styles.completedBadge}>✓ Read</span>
//                   )}
//                 </div>
//                 <div className={styles.bookInfo}>
//                   <h3 className={styles.bookTitle}>{book.title}</h3>
//                   <p className={styles.bookAuthor}>
//                     By {book.uploadedBy?.firstName} {book.uploadedBy?.lastName}
//                   </p>
//                   {book.description && (
//                     <p className={styles.bookDescription}>
//                       {book.description.substring(0, 80)}...
//                     </p>
//                   )}
//                   <div className={styles.bookMeta}>
//                     <span className={styles.metaItem}>
//                       📄 {book.pageCount || 'N/A'} pages
//                     </span>
//                     <span className={styles.metaItem}>
//                       👁️ {book.metrics?.views || 0} views
//                     </span>
//                   </div>
//                   <button 
//                     className={styles.readBtn}
//                     onClick={() => handleReadBook(book._id)}
//                   >
//                     {book.readingProgress ? 'Continue Reading' : 'Start Reading'}
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className={styles.pagination}>
//             <button 
//               className={styles.pageBtn}
//               disabled={page === 1}
//               onClick={() => setPage(p => p - 1)}
//             >
//               ← Previous
//             </button>
//             <span className={styles.pageInfo}>
//               Page {page} of {totalPages}
//             </span>
//             <button 
//               className={styles.pageBtn}
//               disabled={page === totalPages}
//               onClick={() => setPage(p => p + 1)}
//             >
//               Next →
//             </button>
//           </div>
//         )}
//       </div>
//     </StudentLayout>
//   );
// }
















// pages/student/ebooks/index.jsx
// Student E-Books - Uses StudentEbookHub component with inline story reading

import Head from 'next/head';
import { useAuth } from '../../../contexts/AuthContext';
import StudentLayout from '../../../components/student/StudentLayout';
import StudentEbookHub from '../../../components/student/StudentEbookHub';

export default function EbooksPage() {
  const { user } = useAuth();

  return (
    <StudentLayout title="E-Books">
      <Head>
        <title>E-Books | LearnBridge</title>
      </Head>
      <StudentEbookHub 
        userId={user?._id || user?.id} 
        apiBaseUrl="/api" 
      />
    </StudentLayout>
  );
}