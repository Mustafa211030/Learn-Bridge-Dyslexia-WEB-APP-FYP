// pages/blogs/[slug].jsx
// Single blog post view page

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { blogsAPI } from '../../services/psychologistApi';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import styles from '../../styles/BlogPost.module.css';

export default function BlogPostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { user } = useAuth();
  
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setIsLoading(true);
      const response = await blogsAPI.getBlogBySlug(slug);
      if (response.data) {
        setBlog(response.data.blog);
        setRelatedPosts(response.data.relatedPosts || []);
        setLikesCount(response.data.blog.metrics?.likes || 0);
        
        // Check if user has liked this blog
        if (user && response.data.blog.likedBy?.includes(user._id)) {
          setIsLiked(true);
        }
      }
    } catch (error) {
      console.error('Failed to fetch blog:', error);
      if (error.response?.status === 404) {
        router.push('/blogs');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like this post');
      return;
    }
    try {
      const response = await blogsAPI.toggleLike(blog._id);
      setIsLiked(response.data.liked);
      setLikesCount(response.data.likes);
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to comment');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    
    try {
      setIsSubmittingComment(true);
      await blogsAPI.addComment(blog._id, comment.trim());
      toast.success('Comment added!');
      setComment('');
      fetchBlog(); // Refresh to show new comment
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const sharePost = (platform) => {
    const url = window.location.href;
    const title = blog?.title || '';
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={styles.notFound}>
        <h1>Blog not found</h1>
        <Link href="/blogs">← Back to blogs</Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{blog.title} - LearnBridge Blog</title>
        <meta name="description" content={blog.excerpt} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        {blog.featuredImage?.url && (
          <meta property="og:image" content={blog.featuredImage.url} />
        )}
      </Head>

      <article className={styles.blogPost}>
        {/* Hero */}
        <header className={styles.blogHeader}>
          <div className={styles.headerContent}>
            <Link href="/blogs" className={styles.backLink}>
              ← Back to Blog
            </Link>
            
            <div className={styles.blogMeta}>
              <span className={styles.category}>{blog.category}</span>
              <span className={styles.date}>{formatDate(blog.publishedAt || blog.createdAt)}</span>
              <span className={styles.readTime}>{blog.metrics?.readTime || 1} min read</span>
            </div>
            
            <h1 className={styles.blogTitle}>{blog.title}</h1>
            
            <p className={styles.blogExcerpt}>{blog.excerpt}</p>
            
            <div className={styles.authorSection}>
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
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>
                  {blog.author?.firstName} {blog.author?.lastName}
                </span>
                <span className={styles.authorRole}>Psychologist</span>
              </div>
            </div>
          </div>
          
          {blog.featuredImage?.url && (
            <div className={styles.featuredImage}>
              <img src={blog.featuredImage.url} alt={blog.title} />
            </div>
          )}
        </header>

        {/* Content */}
        <div className={styles.blogContent}>
          <div className={styles.contentWrapper}>
            {/* Main Content */}
            <div className={styles.mainContent}>
              <div 
                className={styles.content}
                dangerouslySetInnerHTML={{ 
                  __html: blog.content.replace(/\n/g, '<br />') 
                }}
              />
              
              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className={styles.tagsSection}>
                  <span className={styles.tagsLabel}>Tags:</span>
                  <div className={styles.tags}>
                    {blog.tags.map((tag, i) => (
                      <Link key={i} href={`/blogs?tag=${tag}`} className={styles.tag}>
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Actions */}
              <div className={styles.actionsSection}>
                <button
                  className={`${styles.likeBtn} ${isLiked ? styles.liked : ''}`}
                  onClick={handleLike}
                >
                  {isLiked ? '❤️' : '🤍'} {likesCount} Likes
                </button>
                
                <div className={styles.shareButtons}>
                  <span>Share:</span>
                  <button onClick={() => sharePost('twitter')} className={styles.shareBtn}>Twitter</button>
                  <button onClick={() => sharePost('facebook')} className={styles.shareBtn}>Facebook</button>
                  <button onClick={() => sharePost('linkedin')} className={styles.shareBtn}>LinkedIn</button>
                  <button onClick={() => sharePost('whatsapp')} className={styles.shareBtn}>WhatsApp</button>
                </div>
              </div>
              
              {/* Comments */}
              {blog.allowComments && (
                <div className={styles.commentsSection}>
                  <h3 className={styles.commentsTitle}>
                    Comments ({blog.comments?.length || 0})
                  </h3>
                  
                  {/* Comment Form */}
                  <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={user ? "Write a comment..." : "Please login to comment"}
                      className={styles.commentInput}
                      disabled={!user}
                      maxLength={1000}
                    />
                    <button
                      type="submit"
                      className={styles.commentSubmitBtn}
                      disabled={!user || isSubmittingComment}
                    >
                      {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                    </button>
                  </form>
                  
                  {/* Comments List */}
                  <div className={styles.commentsList}>
                    {blog.comments?.filter(c => c.isApproved).map((comment, i) => (
                      <div key={i} className={styles.commentItem}>
                        <div className={styles.commentHeader}>
                          {comment.user?.profilePhoto ? (
                            <img
                              src={comment.user.profilePhoto}
                              alt=""
                              className={styles.commentAvatar}
                            />
                          ) : (
                            <div className={styles.commentAvatarPlaceholder}>
                              {comment.user?.firstName?.charAt(0) || 'U'}
                            </div>
                          )}
                          <div className={styles.commentMeta}>
                            <span className={styles.commentAuthor}>
                              {comment.user?.firstName} {comment.user?.lastName}
                            </span>
                            <span className={styles.commentDate}>
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                        </div>
                        <p className={styles.commentContent}>{comment.content}</p>
                      </div>
                    ))}
                    
                    {(!blog.comments || blog.comments.length === 0) && (
                      <p className={styles.noComments}>No comments yet. Be the first to comment!</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <aside className={styles.sidebar}>
              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className={styles.relatedPosts}>
                  <h3 className={styles.sidebarTitle}>Related Posts</h3>
                  <div className={styles.relatedList}>
                    {relatedPosts.map((post) => (
                      <Link key={post._id} href={`/blogs/${post.slug}`} className={styles.relatedItem}>
                        {post.featuredImage?.url ? (
                          <img src={post.featuredImage.url} alt="" className={styles.relatedImage} />
                        ) : (
                          <div className={styles.relatedImagePlaceholder}>📝</div>
                        )}
                        <div className={styles.relatedContent}>
                          <h4>{post.title}</h4>
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}