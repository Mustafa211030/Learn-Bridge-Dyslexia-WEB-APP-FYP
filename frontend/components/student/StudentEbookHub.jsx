// // components/student/StudentEbookHub.jsx
// // E-book Hub for Students - Fixed all ESLint errors

// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import styles from '../../styles/StudentEbookHub.module.css';

// // Import ebook components from components/ebook/
// import StoryReader from '../ebook/StoryReader';

// // Stories data
// const stories = [
//   {
//     id: 0,
//     title: { en: "The Curious Cat", ur: "جستجوئی بلی" },
//     description: { en: "A cat and a clever mouse play hide and seek.", ur: "ایک بلی اور ہوشیار چوہا چھپن چھپائی کھیلتے ہیں۔" },
//     theme: "#DFF3FF",
//     cover: "/ebook_images/curios-cat.png",
//     pages: 3,
//     category: "Animals",
//   },
//   {
//     id: 1,
//     title: { en: "The Brave Little Bird", ur: "بہادر چھوٹا پرندہ" },
//     description: { en: "A small bird who dreams of touching the clouds.", ur: "ایک چھوٹا پرندہ جو بادلوں کو چھو کر دیکھنا چاہتا تھا۔" },
//     theme: "#DFFFEF",
//     cover: "/ebook_images/little-bird.png",
//     pages: 3,
//     category: "Adventure",
//   },
//   {
//     id: 2,
//     title: { en: "The Funny Dog", ur: "مزاحیہ کتا" },
//     description: { en: "A playful dog who loves silly tricks.", ur: "ایک شقی کتا جو مزاحیہ حرکتیں کرنا پسند کرتا ہے۔" },
//     theme: "#FFF8E6",
//     cover: "/ebook_images/funny-dog.png",
//     pages: 3,
//     category: "Animals",
//   },
//   {
//     id: 3,
//     title: { en: "The Magical Forest", ur: "جادوئی جنگل" },
//     description: { en: "Trees, animals, and nighttime magic.", ur: "درخت، جانور اور رات کا جادو۔" },
//     theme: "#F0F2FF",
//     cover: "/ebook_images/magical-forest.png",
//     pages: 3,
//     category: "Fantasy",
//   },
//   {
//     id: 4,
//     title: { en: "The Little Explorer", ur: "چھوٹا مہم جو" },
//     description: { en: "Adventure-seeking child finds hidden treasures.", ur: "مہم جوئی کا شوق رکھنے والا بچہ چھپے ہوئے خزانے تلاش کرتا ہے۔" },
//     theme: "#FFF0FF",
//     cover: "/ebook_images/explorer.png",
//     pages: 3,
//     category: "Adventure",
//   },
// ];

// const categories = ['All', 'Animals', 'Adventure', 'Fantasy'];

// export default function StudentEbookHub({ userId, apiBaseUrl = '/api' }) {
//   const [view, setView] = useState('home');
//   const [selectedStory, setSelectedStory] = useState(null);
//   const [activeCategory, setActiveCategory] = useState('All');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [readingProgress, setReadingProgress] = useState({});

//   // Fetch reading progress on mount - using proper async pattern
//   useEffect(() => {
//     if (!userId) return;

//     let isMounted = true;
//     const controller = new AbortController();

//     (async () => {
//       try {
//         const response = await fetch(
//           `${apiBaseUrl}/ebook/progress?userId=${userId}`,
//           { signal: controller.signal }
//         );
//         const data = await response.json();
        
//         if (isMounted && data.success && data.progress) {
//           const progressMap = {};
//           data.progress.forEach(item => {
//             progressMap[item.storyId] = item;
//           });
//           setReadingProgress(progressMap);
//         }
//       } catch (error) {
//         if (error.name !== 'AbortError') {
//           console.error('Error fetching progress:', error);
//         }
//       }
//     })();

//     return () => {
//       isMounted = false;
//       controller.abort();
//     };
//   }, [userId, apiBaseUrl]);

//   const getProgressPercentage = (storyId) => {
//     const progress = readingProgress[storyId];
//     if (!progress) return 0;
//     const story = stories.find(s => s.id === storyId);
//     if (!story) return 0;
//     return Math.round((progress.pagesRead / story.pages) * 100);
//   };

//   const isCompleted = (storyId) => getProgressPercentage(storyId) === 100;

//   const filteredStories = stories.filter(story => {
//     const matchesCategory = activeCategory === 'All' || story.category === activeCategory;
//     const matchesSearch = 
//       story.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       story.description.en.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesCategory && matchesSearch;
//   });

//   const handleReadStory = (story) => {
//     setSelectedStory(story);
//     setView('reader');
//   };

//   const handleBackToLibrary = () => {
//     setSelectedStory(null);
//     setView('library');
//   };

//   const handleBackToHome = () => {
//     setSelectedStory(null);
//     setView('home');
//   };

//   // Render Reader
//   if (view === 'reader' && selectedStory) {
//     return (
//       <div className={styles.readerContainer}>
//         <div className={styles.readerHeader}>
//           <button onClick={handleBackToLibrary} className={styles.backButton}>
//             ← Back to Library
//           </button>
//         </div>
//         <StoryReader 
//           storyId={selectedStory.id} 
//           userId={userId} 
//           apiBaseUrl={apiBaseUrl} 
//         />
//       </div>
//     );
//   }

//   // Render Home/Landing
//   if (view === 'home') {
//     return (
//       <div className={styles.container}>
//         <div className={styles.hero}>
//           <div className={styles.heroContent}>
//             <div className={styles.heroIcon}>📚</div>
//             <h1 className={styles.heroTitle}>
//               Dyslexia-Friendly
//               <span className={styles.heroHighlight}> eBook Reader</span>
//             </h1>
//             <p className={styles.heroDescription}>
//               Welcome to an interactive reading experience designed for young readers. 
//               Enjoy bilingual stories with read-aloud features and word highlighting.
//             </p>
            
//             <div className={styles.features}>
//               <div className={styles.feature}>
//                 <span className={styles.featureIcon}>🗣️</span>
//                 <span className={styles.featureText}>Read Aloud</span>
//               </div>
//               <div className={styles.feature}>
//                 <span className={styles.featureIcon}>🌍</span>
//                 <span className={styles.featureText}>Bilingual</span>
//               </div>
//               <div className={styles.feature}>
//                 <span className={styles.featureIcon}>✨</span>
//                 <span className={styles.featureText}>Interactive</span>
//               </div>
//             </div>

//             <button onClick={() => setView('library')} className={styles.primaryButton}>
//               <span>Open Story Library</span>
//               <span className={styles.buttonArrow}>→</span>
//             </button>

//             <div className={styles.stats}>
//               <div className={styles.stat}>
//                 <div className={styles.statNumber}>{stories.length}</div>
//                 <div className={styles.statLabel}>Stories</div>
//               </div>
//               <div className={styles.stat}>
//                 <div className={styles.statNumber}>2</div>
//                 <div className={styles.statLabel}>Languages</div>
//               </div>
//               <div className={styles.stat}>
//                 <div className={styles.statNumber}>∞</div>
//                 <div className={styles.statLabel}>Adventures</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Render Library
//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <button onClick={handleBackToHome} className={styles.backButton}>
//           ← Back to Home
//         </button>
//         <div className={styles.headerContent}>
//           <h1 className={styles.title}>
//             <span className={styles.titleIcon}>📖</span>
//             Story Library
//           </h1>
//           <p className={styles.subtitle}>
//             Choose a story to begin your reading adventure
//           </p>
//         </div>
//       </div>

//       <div className={styles.filterSection}>
//         <div className={styles.searchBox}>
//           <span className={styles.searchIcon}>🔍</span>
//           <input
//             type="text"
//             placeholder="Search stories..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className={styles.searchInput}
//           />
//         </div>
//         <div className={styles.categories}>
//           {categories.map(category => (
//             <button
//               key={category}
//               onClick={() => setActiveCategory(category)}
//               className={`${styles.categoryBtn} ${activeCategory === category ? styles.categoryActive : ''}`}
//             >
//               {category}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className={styles.storiesGrid}>
//         {filteredStories.map((story) => (
//           <div 
//             key={story.id} 
//             className={styles.storyCard}
//             style={{ '--theme-color': story.theme }}
//           >
//             {isCompleted(story.id) && (
//               <div className={styles.completedBadge}>✓ Completed</div>
//             )}
            
//             <div 
//               className={styles.cardCover}
//               style={{ backgroundColor: story.theme }}
//             >
//               <Image 
//                 src={story.cover} 
//                 alt={story.title.en}
//                 className={styles.coverImage}
//                 width={320}
//                 height={200}
//                 style={{ objectFit: 'cover' }}
//               />
//               <div className={styles.coverOverlay}>
//                 <span className={styles.readNow}>Read Now →</span>
//               </div>
//             </div>

//             <div className={styles.cardBody}>
//               <div className={styles.cardCategory}>{story.category}</div>
//               <h3 className={styles.storyTitle}>{story.title.en}</h3>
//               <p className={styles.storyTitleUrdu}>{story.title.ur}</p>
//               <p className={styles.storyDescription}>{story.description.en}</p>

//               {getProgressPercentage(story.id) > 0 && (
//                 <div className={styles.progressContainer}>
//                   <div className={styles.progressBar}>
//                     <div 
//                       className={styles.progressFill}
//                       style={{ width: `${getProgressPercentage(story.id)}%` }}
//                     />
//                   </div>
//                   <span className={styles.progressText}>
//                     {getProgressPercentage(story.id)}% Complete
//                   </span>
//                 </div>
//               )}

//               <div className={styles.cardFooter}>
//                 <span className={styles.pageCount}>📖 {story.pages} pages</span>
//                 <span className={styles.languages}>🌐 EN / UR</span>
//               </div>

//               <button 
//                 onClick={() => handleReadStory(story)}
//                 className={styles.readButton}
//               >
//                 {getProgressPercentage(story.id) > 0 ? 'Continue Reading' : 'Start Reading'}
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {filteredStories.length === 0 && (
//         <div className={styles.emptyState}>
//           <span className={styles.emptyIcon}>📚</span>
//           <h3>No stories found</h3>
//           <p>Try adjusting your search or filter</p>
//           <button 
//             onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
//             className={styles.resetButton}
//           >
//             Reset Filters
//           </button>
//         </div>
//       )}

//       <div className={styles.tipsSection}>
//         <h3 className={styles.tipsTitle}>📝 Reading Tips</h3>
//         <div className={styles.tipsGrid}>
//           <div className={styles.tip}>
//             <span className={styles.tipIcon}>🔊</span>
//             <div className={styles.tipContent}>
//               <h4>Use Read Aloud</h4>
//               <p>Click the speaker button to hear the story read to you</p>
//             </div>
//           </div>
//           <div className={styles.tip}>
//             <span className={styles.tipIcon}>🌐</span>
//             <div className={styles.tipContent}>
//               <h4>Switch Languages</h4>
//               <p>Toggle between English and Urdu anytime</p>
//             </div>
//           </div>
//           <div className={styles.tip}>
//             <span className={styles.tipIcon}>👆</span>
//             <div className={styles.tipContent}>
//               <h4>Follow Along</h4>
//               <p>Words highlight as they&apos;re read to help you follow</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }








































// components/student/StudentEbookHub.jsx
// E-book Hub for Students - Shows stories with inline reading

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../../styles/StudentEbookHub.module.css';

// Import ebook components from components/ebook/
import StoryReader from '../ebook/StoryReader';

// Stories data
const stories = [
  {
    id: 0,
    title: { en: "The Curious Cat", ur: "جستجوئی بلی" },
    description: { en: "A cat and a clever mouse play hide and seek.", ur: "ایک بلی اور ہوشیار چوہا چھپن چھپائی کھیلتے ہیں۔" },
    theme: "#DFF3FF",
    cover: "/ebook_images/curios-cat.png",
    pages: 3,
    category: "Animals",
  },
  {
    id: 1,
    title: { en: "The Brave Little Bird", ur: "بہادر چھوٹا پرندہ" },
    description: { en: "A small bird who dreams of touching the clouds.", ur: "ایک چھوٹا پرندہ جو بادلوں کو چھو کر دیکھنا چاہتا تھا۔" },
    theme: "#DFFFEF",
    cover: "/ebook_images/little-bird.png",
    pages: 3,
    category: "Adventure",
  },
  {
    id: 2,
    title: { en: "The Funny Dog", ur: "مزاحیہ کتا" },
    description: { en: "A playful dog who loves silly tricks.", ur: "ایک شقی کتا جو مزاحیہ حرکتیں کرنا پسند کرتا ہے۔" },
    theme: "#FFF8E6",
    cover: "/ebook_images/funny-dog.png",
    pages: 3,
    category: "Animals",
  },
  {
    id: 3,
    title: { en: "The Magical Forest", ur: "جادوئی جنگل" },
    description: { en: "Trees, animals, and nighttime magic.", ur: "درخت، جانور اور رات کا جادو۔" },
    theme: "#F0F2FF",
    cover: "/ebook_images/magical-forest.png",
    pages: 3,
    category: "Fantasy",
  },
  {
    id: 4,
    title: { en: "The Little Explorer", ur: "چھوٹا مہم جو" },
    description: { en: "Adventure-seeking child finds hidden treasures.", ur: "مہم جوئی کا شوق رکھنے والا بچہ چھپے ہوئے خزانے تلاش کرتا ہے۔" },
    theme: "#FFF0FF",
    cover: "/ebook_images/explorer.png",
    pages: 3,
    category: "Adventure",
  },
];

const categories = ['All', 'Animals', 'Adventure', 'Fantasy'];

export default function StudentEbookHub({ userId, apiBaseUrl = '/api' }) {
  const [view, setView] = useState('home');
  const [selectedStory, setSelectedStory] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [readingProgress, setReadingProgress] = useState({});

  // Fetch reading progress on mount
  useEffect(() => {
    if (!userId) return;

    let isMounted = true;
    const controller = new AbortController();

    (async () => {
      try {
        const response = await fetch(
          `${apiBaseUrl}/ebook/progress?userId=${userId}`,
          { signal: controller.signal }
        );
        const data = await response.json();
        
        if (isMounted && data.success && data.progress) {
          const progressMap = {};
          data.progress.forEach(item => {
            progressMap[item.storyId] = item;
          });
          setReadingProgress(progressMap);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching progress:', error);
        }
      }
    })();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [userId, apiBaseUrl]);

  const getProgressPercentage = (storyId) => {
    const progress = readingProgress[storyId];
    if (!progress) return 0;
    const story = stories.find(s => s.id === storyId);
    if (!story) return 0;
    return Math.round((progress.pagesRead / story.pages) * 100);
  };

  const isCompleted = (storyId) => getProgressPercentage(storyId) === 100;

  const filteredStories = stories.filter(story => {
    const matchesCategory = activeCategory === 'All' || story.category === activeCategory;
    const matchesSearch = 
      story.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.description.en.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleReadStory = (story) => {
    setSelectedStory(story);
    setView('reader');
  };

  const handleBackToLibrary = () => {
    setSelectedStory(null);
    setView('library');
  };

  const handleBackToHome = () => {
    setSelectedStory(null);
    setView('home');
  };

  // Render Reader
  if (view === 'reader' && selectedStory) {
    return (
      <div className={styles.readerContainer}>
        <div className={styles.readerHeader}>
          <button onClick={handleBackToLibrary} className={styles.backButton}>
            ← Back to Library
          </button>
        </div>
        <StoryReader 
          storyId={selectedStory.id} 
          userId={userId} 
          apiBaseUrl={apiBaseUrl} 
        />
      </div>
    );
  }

  // Render Home/Landing
  if (view === 'home') {
    return (
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroIcon}>📚</div>
            <h1 className={styles.heroTitle}>
              Dyslexia-Friendly
              <span className={styles.heroHighlight}> eBook Reader</span>
            </h1>
            <p className={styles.heroDescription}>
              Welcome to an interactive reading experience designed for young readers. 
              Enjoy bilingual stories with read-aloud features and word highlighting.
            </p>
            
            <div className={styles.features}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🗣️</span>
                <span className={styles.featureText}>Read Aloud</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🌍</span>
                <span className={styles.featureText}>Bilingual</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>✨</span>
                <span className={styles.featureText}>Interactive</span>
              </div>
            </div>

            <button onClick={() => setView('library')} className={styles.primaryButton}>
              <span>Open Story Library</span>
              <span className={styles.buttonArrow}>→</span>
            </button>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>{stories.length}</div>
                <div className={styles.statLabel}>Stories</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>2</div>
                <div className={styles.statLabel}>Languages</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>∞</div>
                <div className={styles.statLabel}>Adventures</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Library
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={handleBackToHome} className={styles.backButton}>
          ← Back to Home
        </button>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}>📖</span>
            Story Library
          </h1>
          <p className={styles.subtitle}>
            Choose a story to begin your reading adventure
          </p>
        </div>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            id="story-search"
            name="story-search"
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.categories}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`${styles.categoryBtn} ${activeCategory === category ? styles.categoryActive : ''}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.storiesGrid}>
        {filteredStories.map((story) => (
          <div 
            key={story.id} 
            className={styles.storyCard}
            style={{ '--theme-color': story.theme }}
          >
            {isCompleted(story.id) && (
              <div className={styles.completedBadge}>✓ Completed</div>
            )}
            
            <div 
              className={styles.cardCover}
              style={{ backgroundColor: story.theme }}
            >
              <Image 
                src={story.cover} 
                alt={story.title.en}
                className={styles.coverImage}
                width={320}
                height={200}
                style={{ objectFit: 'cover' }}
              />
              <div className={styles.coverOverlay}>
                <span className={styles.readNow}>Read Now →</span>
              </div>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.cardCategory}>{story.category}</div>
              <h3 className={styles.storyTitle}>{story.title.en}</h3>
              <p className={styles.storyTitleUrdu}>{story.title.ur}</p>
              <p className={styles.storyDescription}>{story.description.en}</p>

              {getProgressPercentage(story.id) > 0 && (
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ width: `${getProgressPercentage(story.id)}%` }}
                    />
                  </div>
                  <span className={styles.progressText}>
                    {getProgressPercentage(story.id)}% Complete
                  </span>
                </div>
              )}

              <div className={styles.cardFooter}>
                <span className={styles.pageCount}>📖 {story.pages} pages</span>
                <span className={styles.languages}>🌐 EN / UR</span>
              </div>

              <button 
                onClick={() => handleReadStory(story)}
                className={styles.readButton}
              >
                {getProgressPercentage(story.id) > 0 ? 'Continue Reading' : 'Start Reading'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredStories.length === 0 && (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>📚</span>
          <h3>No stories found</h3>
          <p>Try adjusting your search or filter</p>
          <button 
            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
            className={styles.resetButton}
          >
            Reset Filters
          </button>
        </div>
      )}

      <div className={styles.tipsSection}>
        <h3 className={styles.tipsTitle}>📝 Reading Tips</h3>
        <div className={styles.tipsGrid}>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>🔊</span>
            <div className={styles.tipContent}>
              <h4>Use Read Aloud</h4>
              <p>Click the speaker button to hear the story read to you</p>
            </div>
          </div>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>🌐</span>
            <div className={styles.tipContent}>
              <h4>Switch Languages</h4>
              <p>Toggle between English and Urdu anytime</p>
            </div>
          </div>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>👆</span>
            <div className={styles.tipContent}>
              <h4>Follow Along</h4>
              <p>Words highlight as they are read to help you follow</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}