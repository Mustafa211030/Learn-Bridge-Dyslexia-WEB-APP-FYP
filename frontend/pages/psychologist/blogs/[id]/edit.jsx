// // pages/psychologist/blogs/[id]/edit.jsx
// // Edit blog post page for psychologists

// import { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/router';
// import Head from 'next/head';
// import Link from 'next/link';
// import PsychologistLayout from '../../../../components/psychologist/layout/PsychologistLayout';
// import ProtectedRoute from '../../../../components/psychologist/common/ProtectedRoute';
// import { blogsAPI } from '../../../../services/psychologistApi';
// import toast from 'react-hot-toast';
// import styles from '../../../../styles/psychologist/BlogEditor.module.css';

// export default function EditBlogPage() {
//   const router = useRouter();
//   const { id } = router.query;
//   const fileInputRef = useRef(null);
  
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState({
//     title: '',
//     excerpt: '',
//     content: '',
//     category: '',
//     tags: '',
//     targetAudience: 'general',
//     allowComments: true,
//     status: 'draft'
//   });
//   const [featuredImage, setFeaturedImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [existingImage, setExistingImage] = useState(null);

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

//   const targetAudiences = [
//     { value: 'general', label: 'General Audience' },
//     { value: 'parents', label: 'Parents' },
//     { value: 'students', label: 'Students' },
//     { value: 'educators', label: 'Educators' },
//     { value: 'professionals', label: 'Professionals' }
//   ];

//   // Fetch blog data
//   useEffect(() => {
//     if (id) {
//       fetchBlog();
//     }
//   }, [id]);

//   const fetchBlog = async () => {
//     try {
//       setIsLoading(true);
//       const response = await blogsAPI.getBlogById(id);
      
//       if (response.data?.blog) {
//         const blog = response.data.blog;
//         setFormData({
//           title: blog.title || '',
//           excerpt: blog.excerpt || '',
//           content: blog.content || '',
//           category: blog.category || '',
//           tags: blog.tags?.join(', ') || '',
//           targetAudience: blog.targetAudience || 'general',
//           allowComments: blog.allowComments ?? true,
//           status: blog.status || 'draft'
//         });
        
//         if (blog.featuredImage?.url) {
//           setExistingImage(blog.featuredImage.url);
//           setImagePreview(blog.featuredImage.url);
//         }
//       }
//     } catch (error) {
//       console.error('Failed to fetch blog:', error);
//       toast.error('Failed to load blog post');
//       router.push('/psychologist/blogs');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error('Image size should be less than 5MB');
//         return;
//       }
//       if (!file.type.startsWith('image/')) {
//         toast.error('Please upload an image file');
//         return;
//       }
//       setFeaturedImage(file);
//       setImagePreview(URL.createObjectURL(file));
//       setExistingImage(null);
//     }
//   };

//   const removeImage = () => {
//     setFeaturedImage(null);
//     setImagePreview(null);
//     setExistingImage(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const validateForm = () => {
//     if (!formData.title.trim()) {
//       toast.error('Please enter a title');
//       return false;
//     }
//     if (formData.title.length < 10) {
//       toast.error('Title should be at least 10 characters');
//       return false;
//     }
//     if (!formData.content.trim()) {
//       toast.error('Please enter content');
//       return false;
//     }
//     if (formData.content.length < 100) {
//       toast.error('Content should be at least 100 characters');
//       return false;
//     }
//     if (!formData.category) {
//       toast.error('Please select a category');
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (publishStatus = null) => {
//     if (!validateForm()) return;

//     try {
//       setIsSubmitting(true);

//       const submitData = new FormData();
//       submitData.append('title', formData.title.trim());
//       submitData.append('content', formData.content);
//       submitData.append('excerpt', formData.excerpt.trim() || formData.content.substring(0, 200));
//       submitData.append('category', formData.category);
//       submitData.append('targetAudience', formData.targetAudience);
//       submitData.append('allowComments', formData.allowComments);
//       submitData.append('status', publishStatus || formData.status);
      
//       if (formData.tags) {
//         const tagsArray = formData.tags
//           .split(',')
//           .map(tag => tag.trim().toLowerCase())
//           .filter(Boolean);
//         submitData.append('tags', JSON.stringify(tagsArray));
//       }

//       if (featuredImage) {
//         submitData.append('featuredImage', featuredImage);
//       } else if (!existingImage && !imagePreview) {
//         submitData.append('removeImage', 'true');
//       }

//       await blogsAPI.updateBlog(id, submitData);
      
//       const message = publishStatus === 'published' 
//         ? '🎉 Blog published successfully!' 
//         : '✅ Blog updated successfully!';
//       toast.success(message);
//       router.push('/psychologist/blogs');
//     } catch (error) {
//       console.error('Failed to update blog:', error);
//       toast.error(error.response?.data?.message || 'Failed to update blog post');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       await blogsAPI.deleteBlog(id);
//       toast.success('Blog deleted successfully');
//       router.push('/psychologist/blogs');
//     } catch (error) {
//       console.error('Failed to delete blog:', error);
//       toast.error('Failed to delete blog post');
//     }
//   };

//   const wordCount = formData.content.split(/\s+/).filter(Boolean).length;
//   const readTime = Math.max(1, Math.ceil(wordCount / 200));

//   if (isLoading) {
//     return (
//       <ProtectedRoute allowedRoles={['Psychologist']}>
//         <PsychologistLayout>
//           <div className={styles.loadingWrapper}>
//             <div className={styles.loadingSpinner}></div>
//             <p>Loading blog post...</p>
//           </div>
//         </PsychologistLayout>
//       </ProtectedRoute>
//     );
//   }

//   return (
//     <>
//       <Head>
//         <title>Edit Blog Post - Psychologist Dashboard</title>
//         <meta name="description" content="Edit your blog post" />
//       </Head>

//       <ProtectedRoute allowedRoles={['Psychologist']}>
//         <PsychologistLayout>
//           <div className={styles.editorPage}>
//             {/* Page Header */}
//             <header className={styles.pageHeader}>
//               <div className={styles.headerContent}>
//                 <div className={styles.headerLeft}>
//                   <Link href="/psychologist/blogs" className={styles.backBtn}>
//                     <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                     </svg>
//                     Back
//                   </Link>
//                   <div className={styles.headerTitleGroup}>
//                     <h1 className={styles.pageTitle}>Edit Post</h1>
//                     <div className={styles.headerMeta}>
//                       <span className={`${styles.statusBadge} ${styles[`status${formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}`]}`}>
//                         {formData.status}
//                       </span>
//                       <span className={styles.metaItem}>
//                         <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                         {readTime} min read
//                       </span>
//                       <span className={styles.metaItem}>
//                         <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                         </svg>
//                         {wordCount} words
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className={styles.headerActions}>
//                   <button
//                     type="button"
//                     className={styles.btnDanger}
//                     onClick={handleDelete}
//                   >
//                     <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                     </svg>
//                     Delete
//                   </button>
//                   <button
//                     type="button"
//                     className={styles.btnSecondary}
//                     onClick={() => handleSubmit()}
//                     disabled={isSubmitting}
//                   >
//                     <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
//                     </svg>
//                     {isSubmitting ? 'Saving...' : 'Save Changes'}
//                   </button>
//                   {formData.status !== 'published' && (
//                     <button
//                       type="button"
//                       className={styles.btnPrimary}
//                       onClick={() => handleSubmit('published')}
//                       disabled={isSubmitting}
//                     >
//                       <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                       </svg>
//                       {isSubmitting ? 'Publishing...' : 'Publish'}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </header>

//             {/* Editor Content */}
//             <div className={styles.editorContent}>
//               <div className={styles.editorLayout}>
//                 {/* Main Editor Area */}
//                 <div className={styles.editorMain}>
//                   {/* Title */}
//                   <div className={styles.formGroup}>
//                     <input
//                       type="text"
//                       name="title"
//                       value={formData.title}
//                       onChange={handleInputChange}
//                       placeholder="Enter an engaging title..."
//                       className={styles.titleInput}
//                       maxLength={200}
//                     />
//                     <div className={styles.inputFooter}>
//                       <span className={styles.charCount}>{formData.title.length}/200</span>
//                     </div>
//                   </div>

//                   {/* Excerpt */}
//                   <div className={styles.formGroup}>
//                     <label className={styles.formLabel}>
//                       <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
//                       </svg>
//                       Excerpt (Summary)
//                     </label>
//                     <textarea
//                       name="excerpt"
//                       value={formData.excerpt}
//                       onChange={handleInputChange}
//                       placeholder="Write a brief summary that appears in blog listings..."
//                       className={styles.excerptInput}
//                       rows={3}
//                       maxLength={300}
//                     />
//                     <div className={styles.inputFooter}>
//                       <span className={styles.inputHint}>A compelling excerpt helps readers decide to click</span>
//                       <span className={styles.charCount}>{formData.excerpt.length}/300</span>
//                     </div>
//                   </div>

//                   {/* Content */}
//                   <div className={styles.formGroup}>
//                     <label className={styles.formLabel}>
//                       <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                       </svg>
//                       Content
//                     </label>
//                     <textarea
//                       name="content"
//                       value={formData.content}
//                       onChange={handleInputChange}
//                       placeholder="Write your blog content here..."
//                       className={styles.contentInput}
//                       rows={25}
//                     />
//                   </div>
//                 </div>

//                 {/* Sidebar */}
//                 <aside className={styles.editorSidebar}>
//                   {/* Featured Image */}
//                   <div className={styles.sidebarCard}>
//                     <h3 className={styles.sidebarCardTitle}>
//                       <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                       </svg>
//                       Featured Image
//                     </h3>
//                     <div className={styles.imageUploadArea}>
//                       {imagePreview ? (
//                         <div className={styles.imagePreviewWrapper}>
//                           <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
//                           <button
//                             type="button"
//                             className={styles.removeImageBtn}
//                             onClick={removeImage}
//                           >
//                             <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                           </button>
//                         </div>
//                       ) : (
//                         <label className={styles.imageUploadLabel}>
//                           <input
//                             ref={fileInputRef}
//                             type="file"
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             className={styles.imageUploadInput}
//                           />
//                           <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//                           </svg>
//                           <span>Click to upload</span>
//                           <span className={styles.uploadHint}>PNG, JPG up to 5MB</span>
//                         </label>
//                       )}
//                     </div>
//                   </div>

//                   {/* Status */}
//                   <div className={styles.sidebarCard}>
//                     <h3 className={styles.sidebarCardTitle}>
//                       <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       Status
//                     </h3>
//                     <select
//                       name="status"
//                       value={formData.status}
//                       onChange={handleInputChange}
//                       className={styles.formSelect}
//                     >
//                       <option value="draft">Draft</option>
//                       <option value="published">Published</option>
//                       <option value="archived">Archived</option>
//                     </select>
//                   </div>

//                   {/* Category */}
//                   <div className={styles.sidebarCard}>
//                     <h3 className={styles.sidebarCardTitle}>
//                       <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
//                       </svg>
//                       Category
//                     </h3>
//                     <select
//                       name="category"
//                       value={formData.category}
//                       onChange={handleInputChange}
//                       className={styles.formSelect}
//                     >
//                       <option value="">Select a category</option>
//                       {blogCategories.map(cat => (
//                         <option key={cat} value={cat}>{cat}</option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Tags */}
//                   <div className={styles.sidebarCard}>
//                     <h3 className={styles.sidebarCardTitle}>
//                       <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
//                       </svg>
//                       Tags
//                     </h3>
//                     <input
//                       type="text"
//                       name="tags"
//                       value={formData.tags}
//                       onChange={handleInputChange}
//                       placeholder="parenting, tips, child-development"
//                       className={styles.formInput}
//                     />
//                     <span className={styles.inputHint}>Separate tags with commas</span>
//                   </div>

//                   {/* Target Audience */}
//                   <div className={styles.sidebarCard}>
//                     <h3 className={styles.sidebarCardTitle}>
//                       <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                       </svg>
//                       Target Audience
//                     </h3>
//                     <select
//                       name="targetAudience"
//                       value={formData.targetAudience}
//                       onChange={handleInputChange}
//                       className={styles.formSelect}
//                     >
//                       {targetAudiences.map(audience => (
//                         <option key={audience.value} value={audience.value}>
//                           {audience.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Settings */}
//                   <div className={styles.sidebarCard}>
//                     <h3 className={styles.sidebarCardTitle}>
//                       <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       </svg>
//                       Settings
//                     </h3>
//                     <label className={styles.checkboxLabel}>
//                       <input
//                         type="checkbox"
//                         name="allowComments"
//                         checked={formData.allowComments}
//                         onChange={handleInputChange}
//                         className={styles.checkbox}
//                       />
//                       <span className={styles.checkboxText}>Allow comments</span>
//                     </label>
//                   </div>
//                 </aside>
//               </div>
//             </div>
//           </div>
//         </PsychologistLayout>
//       </ProtectedRoute>
//     </>
//   );
// }



























// pages/psychologist/blogs/[id]/edit.jsx
// Edit blog post page for psychologists

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import PsychologistLayout from '../../../../components/psychologist/layout/PsychologistLayout';
import ProtectedRoute from '../../../../components/psychologist/common/ProtectedRoute';
import { blogsAPI } from '../../../../services/psychologistApi';
import toast from 'react-hot-toast';
import styles from '../../../../styles/psychologist/BlogEditor.module.css';

export default function EditBlogPage() {
  const router = useRouter();
  const { id } = router.query;
  const fileInputRef = useRef(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'General Wellness',
    tags: '',
    targetAudience: 'general',
    allowComments: true,
    status: 'draft'
  });
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  const blogCategories = [
    'Child Development', 'Parenting Tips', 'Mental Health', 'Learning Strategies',
    'Behavioral Issues', 'Educational Psychology', 'Cognitive Development', 'Social Skills',
    'Emotional Intelligence', 'ADHD & Focus', 'Anxiety & Stress', 'Study Tips',
    'Family Dynamics', 'Special Needs', 'Research & Insights', 'General Wellness'
  ];

  const targetAudiences = [
    { value: 'general', label: 'General Audience' },
    { value: 'parents', label: 'Parents' },
    { value: 'students', label: 'Students' },
    { value: 'educators', label: 'Educators' },
    { value: 'professionals', label: 'Professionals' }
  ];

  // Fetch blog data
  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      setIsLoading(true);
      const response = await blogsAPI.getBlogById(id);
      
      if (response.data?.blog) {
        const blog = response.data.blog;
        setFormData({
          title: blog.title || '',
          excerpt: blog.excerpt || '',
          content: blog.content || '',
          category: blog.category || 'General Wellness',
          tags: blog.tags?.join(', ') || '',
          targetAudience: blog.targetAudience || 'general',
          allowComments: blog.allowComments ?? true,
          status: blog.status || 'draft'
        });
        
        if (blog.featuredImage?.url) {
          setExistingImage(blog.featuredImage.url);
          setImagePreview(blog.featuredImage.url);
        }
      }
    } catch (error) {
      console.error('Failed to fetch blog:', error);
      toast.error('Failed to load blog post');
      router.push('/psychologist/blogs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      setFeaturedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setExistingImage(null);
    }
  };

  const removeImage = () => {
    setFeaturedImage(null);
    setImagePreview(null);
    setExistingImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return false;
    }
    if (formData.title.length < 10) {
      toast.error('Title should be at least 10 characters');
      return false;
    }
    if (!formData.content.trim()) {
      toast.error('Please enter content');
      return false;
    }
    if (formData.content.length < 100) {
      toast.error('Content should be at least 100 characters');
      return false;
    }
    if (!formData.category) {
      toast.error('Please select a category');
      return false;
    }
    return true;
  };

  const handleSubmit = async (publishStatus = null) => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const submitData = new FormData();
      submitData.append('title', formData.title.trim());
      submitData.append('content', formData.content.trim());
      submitData.append('excerpt', formData.excerpt.trim() || formData.content.substring(0, 200).trim());
      submitData.append('category', formData.category);
      submitData.append('targetAudience', formData.targetAudience);
      submitData.append('allowComments', String(formData.allowComments));
      submitData.append('status', publishStatus || formData.status);
      
      if (formData.tags.trim()) {
        const tagsArray = formData.tags
          .split(',')
          .map(tag => tag.trim().toLowerCase())
          .filter(Boolean);
        submitData.append('tags', JSON.stringify(tagsArray));
      }

      // Handle image
      if (featuredImage) {
        submitData.append('featuredImage', featuredImage);
      } else if (!existingImage && !imagePreview) {
        submitData.append('removeImage', 'true');
      }

      console.log('📤 Updating blog...');
      const response = await blogsAPI.updateBlog(id, submitData);
      console.log('✅ Response:', response.data);
      
      const message = publishStatus === 'published' 
        ? '🎉 Blog published successfully!' 
        : '✅ Blog updated successfully!';
      toast.success(message);
      router.push('/psychologist/blogs');
    } catch (error) {
      console.error('❌ Failed to update blog:', error);
      toast.error(error.response?.data?.message || 'Failed to update blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    try {
      await blogsAPI.deleteBlog(id);
      toast.success('Blog deleted successfully');
      router.push('/psychologist/blogs');
    } catch (error) {
      console.error('Failed to delete blog:', error);
      toast.error('Failed to delete blog post');
    }
  };

  const wordCount = formData.content.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['Psychologist']}>
        <PsychologistLayout>
          <div className={styles.loadingWrapper}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading blog post...</p>
          </div>
        </PsychologistLayout>
      </ProtectedRoute>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Blog Post - Psychologist Dashboard</title>
        <meta name="description" content="Edit your blog post" />
      </Head>

      <ProtectedRoute allowedRoles={['Psychologist']}>
        <PsychologistLayout>
          <div className={styles.editorPage}>
            {/* Page Header */}
            <header className={styles.pageHeader}>
              <div className={styles.headerContent}>
                <div className={styles.headerLeft}>
                  <Link href="/psychologist/blogs" className={styles.backBtn}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                  </Link>
                  <div className={styles.headerTitleGroup}>
                    <h1 className={styles.pageTitle}>Edit Post</h1>
                    <div className={styles.headerMeta}>
                      <span className={`${styles.statusBadge} ${styles[`status${formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}`]}`}>
                        {formData.status}
                      </span>
                      <span className={styles.metaItem}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {readTime} min read
                      </span>
                      <span className={styles.metaItem}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {wordCount} words
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.headerActions}>
                  <button
                    type="button"
                    className={styles.btnDanger}
                    onClick={handleDelete}
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                  <button
                    type="button"
                    className={styles.btnSecondary}
                    onClick={() => handleSubmit()}
                    disabled={isSubmitting}
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                  {formData.status !== 'published' && (
                    <button
                      type="button"
                      className={styles.btnPrimary}
                      onClick={() => handleSubmit('published')}
                      disabled={isSubmitting}
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {isSubmitting ? 'Publishing...' : 'Publish'}
                    </button>
                  )}
                </div>
              </div>
            </header>

            {/* Editor Content */}
            <div className={styles.editorContent}>
              <div className={styles.editorLayout}>
                {/* Main Editor Area */}
                <div className={styles.editorMain}>
                  {/* Title */}
                  <div className={styles.formGroup}>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter an engaging title..."
                      className={styles.titleInput}
                      maxLength={200}
                    />
                    <div className={styles.inputFooter}>
                      <span className={styles.charCount}>{formData.title.length}/200</span>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      Excerpt (Summary)
                    </label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      placeholder="Write a brief summary that appears in blog listings..."
                      className={styles.excerptInput}
                      rows={3}
                      maxLength={300}
                    />
                    <div className={styles.inputFooter}>
                      <span className={styles.inputHint}>A compelling excerpt helps readers decide to click</span>
                      <span className={styles.charCount}>{formData.excerpt.length}/300</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Content
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Write your blog content here..."
                      className={styles.contentInput}
                      rows={25}
                    />
                  </div>
                </div>

                {/* Sidebar */}
                <aside className={styles.editorSidebar}>
                  {/* Featured Image */}
                  <div className={styles.sidebarCard}>
                    <h3 className={styles.sidebarCardTitle}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Featured Image
                    </h3>
                    <div className={styles.imageUploadArea}>
                      {imagePreview ? (
                        <div className={styles.imagePreviewWrapper}>
                          <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                          <button type="button" className={styles.removeImageBtn} onClick={removeImage}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <label className={styles.imageUploadLabel}>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            onChange={handleImageChange}
                            className={styles.imageUploadInput}
                          />
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span>Click to upload</span>
                          <span className={styles.uploadHint}>PNG, JPG up to 5MB</span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className={styles.sidebarCard}>
                    <h3 className={styles.sidebarCardTitle}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Status
                    </h3>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className={styles.formSelect}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div className={styles.sidebarCard}>
                    <h3 className={styles.sidebarCardTitle}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      Category *
                    </h3>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={styles.formSelect}
                    >
                      {blogCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tags */}
                  <div className={styles.sidebarCard}>
                    <h3 className={styles.sidebarCardTitle}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                      Tags
                    </h3>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="parenting, tips, child-development"
                      className={styles.formInput}
                    />
                    <span className={styles.inputHint}>Separate tags with commas</span>
                  </div>

                  {/* Target Audience */}
                  <div className={styles.sidebarCard}>
                    <h3 className={styles.sidebarCardTitle}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Target Audience
                    </h3>
                    <select
                      name="targetAudience"
                      value={formData.targetAudience}
                      onChange={handleInputChange}
                      className={styles.formSelect}
                    >
                      {targetAudiences.map(audience => (
                        <option key={audience.value} value={audience.value}>{audience.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Settings */}
                  <div className={styles.sidebarCard}>
                    <h3 className={styles.sidebarCardTitle}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </h3>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="allowComments"
                        checked={formData.allowComments}
                        onChange={handleInputChange}
                        className={styles.checkbox}
                      />
                      <span className={styles.checkboxText}>Allow comments</span>
                    </label>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </PsychologistLayout>
      </ProtectedRoute>
    </>
  );
}