'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import stories from './stories.json';
import styles from './StoryReader.module.css';

export default function StoryReader({ storyId = 0, userId, apiBaseUrl = '/api' }) {
  const router = useRouter();
  const story = stories[storyId] || stories[0];

  const [lang, setLang] = useState('en');
  const [pageIndex, setPageIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(true);

  const synthRef = useRef(null);
  const flipSoundRef = useRef(null);

  // Initialize
  useEffect(() => {
    // Check speech synthesis support
    if (typeof window !== 'undefined') {
      setSpeechSupported('speechSynthesis' in window);
      synthRef.current = window.speechSynthesis || null;
    }

    // Load saved language preference
    const savedLang = localStorage.getItem('ebook_lang');
    if (savedLang) setLang(savedLang);

    // Create flip sound (use local file instead of external URL)
    try {
      flipSoundRef.current = new Audio('/sounds/page-flip.mp3');
      flipSoundRef.current.volume = 0.5;
    } catch (e) {
      console.log('Could not load flip sound');
    }

    // Start reading session
    if (userId) {
      startReadingSession();
    }

    return () => {
      stopSpeaking();
    };
  }, [userId]);

  useEffect(() => {
    setPageIndex(0);
    stopSpeaking();
    setHighlightIndex(null);
  }, [storyId, lang]);

  useEffect(() => {
    stopSpeaking();
    setHighlightIndex(null);
    setStartTime(Date.now());
  }, [pageIndex]);

  const startReadingSession = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/ebook/start-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, storyId })
      });
      const data = await response.json();
      if (data.success) {
        setSessionId(data.sessionId);
      }
    } catch (error) {
      console.error('Error starting reading session:', error);
    }
  };

  const savePageRead = async () => {
    if (!sessionId || !startTime) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    try {
      await fetch(`${apiBaseUrl}/ebook/save-page`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId,
          storyId,
          pageIndex,
          language: lang,
          timeSpent,
          wasReadAloud: isSpeaking,
          timestamp: new Date()
        })
      });
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  const endReadingSession = async () => {
    if (!sessionId) return;

    try {
      await fetch(`${apiBaseUrl}/ebook/end-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId,
          storyId,
          pagesRead: pageIndex + 1,
          completed: pageIndex === story.pages.length - 1
        })
      });
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
    setHighlightIndex(null);
  }, []);

  const speakText = useCallback(async (text) => {
    if (!synthRef.current || !speechSupported) {
      alert('Speech synthesis is not supported in your browser. Try Chrome or Edge.');
      return;
    }

    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    setIsSpeaking(true);
    const words = text.split(/\s+/).filter(Boolean);
    let wordIndex = 0;

    const speakNextWord = () => {
      if (wordIndex >= words.length) {
        setHighlightIndex(null);
        setIsSpeaking(false);
        return;
      }

      setHighlightIndex(wordIndex);
      
      const utterance = new SpeechSynthesisUtterance(words[wordIndex]);
      utterance.rate = 0.85; // Slightly slower for clarity
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Set language based on current selection
      if (lang === 'ur') {
        utterance.lang = 'ur-PK';
      } else {
        utterance.lang = 'en-US';
      }

      utterance.onend = () => {
        wordIndex++;
        // Small delay between words for better comprehension
        setTimeout(speakNextWord, 80);
      };

      utterance.onerror = (e) => {
        console.error('Speech error:', e);
        wordIndex++;
        setTimeout(speakNextWord, 80);
      };

      synthRef.current.speak(utterance);
    };

    // Small delay to ensure speech synthesis is ready
    setTimeout(speakNextWord, 100);
  }, [lang, speechSupported]);

  const readAloud = async () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    
    const pageText = lang === 'ur' ? story.pages[pageIndex].ur : story.pages[pageIndex].en;
    await speakText(pageText);
  };

  const playFlipSound = () => {
    if (flipSoundRef.current) {
      flipSoundRef.current.currentTime = 0;
      flipSoundRef.current.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  };

  const flipPage = async (direction) => {
    if (isFlipping) return;
    
    // Save current page before flipping
    await savePageRead();
    
    setFlipDirection(direction);
    setIsFlipping(true);
    stopSpeaking();
    playFlipSound();

    setTimeout(() => {
      if (direction === 'next') {
        if (pageIndex < story.pages.length - 1) {
          setPageIndex(pageIndex + 1);
        } else if (storyId < stories.length - 1) {
          endReadingSession();
          router.push(`/ebook/reader/${storyId + 1}`);
        } else {
          endReadingSession();
          router.push('/ebook/library');
        }
      } else {
        if (pageIndex > 0) {
          setPageIndex(pageIndex - 1);
        }
      }
      setIsFlipping(false);
      setFlipDirection(null);
    }, 600);
  };

  const toggleLang = (l) => {
    stopSpeaking();
    setLang(l);
    localStorage.setItem('ebook_lang', l);
    setHighlightIndex(null);
  };

  const navigate = async (path) => {
    await savePageRead();
    await endReadingSession();
    stopSpeaking();
    router.push(path);
  };

  const pageText = lang === 'ur' ? story.pages[pageIndex].ur : story.pages[pageIndex].en;
  const isRTL = lang === 'ur';

  return (
    <div className={styles.container} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={styles.readerWrapper}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button onClick={() => navigate('/ebook/library')} className={styles.backBtn}>
              ← Library
            </button>
            <button onClick={() => navigate('/ebook')} className={styles.homeBtn}>
              🏠 Home
            </button>
          </div>

          <h2 className={styles.storyTitle}>
            {lang === 'ur' ? story.title.ur : story.title.en}
          </h2>

          <div className={styles.langSelector}>
            <button
              onClick={() => toggleLang('en')}
              className={`${styles.langBtn} ${lang === 'en' ? styles.langBtnActive : ''}`}
            >
              English
            </button>
            <button
              onClick={() => toggleLang('ur')}
              className={`${styles.langBtn} ${lang === 'ur' ? styles.langBtnActive : ''}`}
            >
              اردو
            </button>
          </div>
        </div>

        {/* Speech Support Warning */}
        {!speechSupported && (
          <div className={styles.warningBanner}>
            ⚠️ Speech synthesis not supported. Try Chrome or Edge for read-aloud feature.
          </div>
        )}

        {/* Page Content */}
        <div className={styles.pageContainer}>
          <div
            className={styles.page}
            style={{
              backgroundColor: story.theme + '22',
              transform: isFlipping ? `rotateY(${flipDirection === 'next' ? -180 : 180}deg)` : 'rotateY(0deg)',
            }}
          >
            {story.pages[pageIndex].image && (
              <div className={styles.imageWrapper}>
                <img
                  src={story.pages[pageIndex].image}
                  className={styles.pageImage}
                  alt=""
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className={styles.textContent}>
              <p className={styles.pageText}>
                {pageText.split(/\s+/).map((word, i) => (
                  <span
                    key={i}
                    className={`${styles.word} ${i === highlightIndex ? styles.wordHighlight : ''}`}
                  >
                    {word}{' '}
                  </span>
                ))}
              </p>
            </div>

            {/* Page Controls */}
            <div className={styles.pageFooter}>
              <div className={styles.pageNumber}>
                Page {pageIndex + 1} of {story.pages.length}
              </div>

              <div className={styles.controls}>
                {pageIndex > 0 && (
                  <button onClick={() => flipPage('prev')} className={styles.navBtn}>
                    ← Previous
                  </button>
                )}

                <button
                  onClick={readAloud}
                  className={`${styles.readBtn} ${isSpeaking ? styles.reading : ''}`}
                  disabled={!speechSupported}
                >
                  {isSpeaking ? '⏸ Stop' : lang === 'ur' ? '🔊 پڑھیں' : '🔊 Read Aloud'}
                </button>

                {pageIndex < story.pages.length - 1 ? (
                  <button onClick={() => flipPage('next')} className={styles.navBtn}>
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={() => flipPage('next')}
                    className={styles.nextStoryBtn}
                  >
                    {lang === 'ur' ? 'اگلی کہانی' : 'Next Story'} →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBar}
            style={{ width: `${((pageIndex + 1) / story.pages.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}