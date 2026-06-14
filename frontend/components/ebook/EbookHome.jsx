'use client';
import { useRouter } from 'next/navigation';
import styles from './EbookHome.module.css';

export default function EbookHome() {
  const router = useRouter();

  const navigateToLibrary = () => {
    router.push('/ebook/library');
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundPattern}></div>
      
      <div className={styles.contentCard}>
        <div className={styles.iconWrapper}>
          <div className={styles.bookIcon}>
            📚
          </div>
        </div>
        
        <h1 className={styles.title}>
          Dyslexia-Friendly
          <span className={styles.titleHighlight}> eBook Reader</span>
        </h1>
        
        <p className={styles.description}>
          Welcome to an interactive reading experience designed specifically for dyslexic readers. 
          Enjoy bilingual stories with read-aloud features, word highlighting, and beautiful illustrations.
        </p>

        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🗣️</span>
            <span className={styles.featureText}>Read Aloud</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🌐</span>
            <span className={styles.featureText}>Bilingual</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>✨</span>
            <span className={styles.featureText}>Interactive</span>
          </div>
        </div>

        <button onClick={navigateToLibrary} className={styles.primaryBtn}>
          <span className={styles.btnText}>Open Story Library</span>
          <span className={styles.btnIcon}>→</span>
        </button>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statNumber}>5</div>
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
  );
}