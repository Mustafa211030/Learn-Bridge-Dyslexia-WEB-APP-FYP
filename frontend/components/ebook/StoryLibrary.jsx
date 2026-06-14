'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import stories from './stories.json';
import styles from './StoryLibrary.module.css';

export default function StoryLibrary({ userId, apiBaseUrl = '/api' }) {
  const router = useRouter();
  const [readingProgress, setReadingProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchReadingProgress();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const fetchReadingProgress = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/ebook/progress?userId=${userId}`);
      const data = await response.json();
      
      if (data.success && data.progress) {
        const progressMap = {};
        data.progress.forEach(item => {
          progressMap[item.storyId] = item;
        });
        setReadingProgress(progressMap);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToStory = (index) => {
    router.push(`/ebook/reader/${index}`);
  };

  const navigateToHome = () => {
    router.push('/ebook');
  };

  const getProgressPercentage = (storyId) => {
    const progress = readingProgress[storyId];
    if (!progress) return 0;
    
    const story = stories[storyId];
    if (!story) return 0;
    
    return Math.round((progress.pagesRead / story.pages.length) * 100);
  };

  const isCompleted = (storyId) => {
    return getProgressPercentage(storyId) === 100;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your library...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={navigateToHome} className={styles.backBtn}>
          ← Back to Home
        </button>
        <h1 className={styles.title}>Story Library</h1>
        <p className={styles.subtitle}>Choose a story to begin your adventure</p>
      </div>

      <div className={styles.shelf}>
        {stories.map((story, index) => (
          <div
            key={index}
            className={styles.card}
            style={{ '--theme-color': story.theme }}
            onClick={() => navigateToStory(index)}
          >
            {isCompleted(index) && (
              <div className={styles.completedBadge}>
                ✓ Completed
              </div>
            )}

            <div className={styles.cardImage}>
              <img 
                src={story.pages[0].image} 
                alt={story.title.en}
                className={styles.thumbnail}
              />
              <div className={styles.imageOverlay}>
                <span className={styles.readNow}>Read Now →</span>
              </div>
            </div>

            <div className={styles.cardContent}>
              <h2 className={styles.storyTitle}>{story.title.en}</h2>
              <p className={styles.storyTitleUrdu}>{story.title.ur}</p>
              <p className={styles.description}>{story.description.en}</p>
              
              {getProgressPercentage(index) > 0 && (
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ width: `${getProgressPercentage(index)}%` }}
                    ></div>
                  </div>
                  <span className={styles.progressText}>
                    {getProgressPercentage(index)}% Complete
                  </span>
                </div>
              )}

              <div className={styles.cardFooter}>
                <span className={styles.pageCount}>
                  📖 {story.pages.length} pages
                </span>
                <span className={styles.languages}>
                  🌐 EN / UR
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}