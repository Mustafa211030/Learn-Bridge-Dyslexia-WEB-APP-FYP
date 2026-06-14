// pages/student/games/[gameId].jsx
// Individual Game Play Page - Wraps existing game components

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useAuth } from '../../../contexts/AuthContext';
import { studentAPI } from '../../../services/api';
import StudentLayout from '../../../components/student/StudentLayout';
import styles from '../../../styles/StudentGames.module.css';

// Dynamically import game components to avoid SSR issues
const MathQuest = dynamic(() => import('../../../components/games/MathQuest'), { ssr: false });
const PhonemeGame = dynamic(() => import('../../../components/games/PhonemeGame'), { ssr: false });
const WordFormationGame = dynamic(() => import('../../../components/games/WordFormationGame'), { ssr: false });
const LetterTracingGame = dynamic(() => import('../../../components/games/LetterTracingGame'), { ssr: false });
const StoryReader = dynamic(() => import('../../../components/ebook/StoryReader'), { ssr: false });
const StoryLibrary = dynamic(() => import('../../../components/ebook/StoryLibrary'), { ssr: false });

// Map game IDs to their components
const gameComponents = {
  'mathquest': MathQuest,
  'math-quest': MathQuest,
  'phoneme-game': PhonemeGame,
  'phoneme': PhonemeGame,
  'word-formation': WordFormationGame,
  'word-formation-game': WordFormationGame,
  'letter-tracing': LetterTracingGame,
  'letter-tracing-game': LetterTracingGame,
  'story-reader': StoryReader,
  'ebook-reader': StoryReader,
  'story-library': StoryLibrary,
  'ebook-library': StoryLibrary
};

// Game metadata for display
const gameMetadata = {
  'mathquest': {
    name: 'Math Quest',
    description: 'Practice arithmetic operations with fun challenges!',
    category: 'math',
    icon: '🔢'
  },
  'math-quest': {
    name: 'Math Quest',
    description: 'Practice arithmetic operations with fun challenges!',
    category: 'math',
    icon: '🔢'
  },
  'phoneme-game': {
    name: 'Phoneme Game',
    description: 'Learn phonics and sound recognition skills!',
    category: 'language',
    icon: '📖'
  },
  'phoneme': {
    name: 'Phoneme Game',
    description: 'Learn phonics and sound recognition skills!',
    category: 'language',
    icon: '📖'
  },
  'word-formation': {
    name: 'Word Formation',
    description: 'Unscramble letters to form words!',
    category: 'language',
    icon: '🔤'
  },
  'word-formation-game': {
    name: 'Word Formation',
    description: 'Unscramble letters to form words!',
    category: 'language',
    icon: '🔤'
  },
  'letter-tracing': {
    name: 'Letter Tracing',
    description: 'Practice writing letters with guided tracing!',
    category: 'motor-skills',
    icon: '✏️'
  },
  'letter-tracing-game': {
    name: 'Letter Tracing',
    description: 'Practice writing letters with guided tracing!',
    category: 'motor-skills',
    icon: '✏️'
  },
  'story-reader': {
    name: 'Story Reader',
    description: 'Read interactive stories with audio support!',
    category: 'reading',
    icon: '📚'
  },
  'ebook-reader': {
    name: 'E-Book Reader',
    description: 'Read interactive stories with audio support!',
    category: 'reading',
    icon: '📚'
  },
  'story-library': {
    name: 'Story Library',
    description: 'Browse and select stories to read!',
    category: 'reading',
    icon: '📚'
  }
};

export default function GamePlayPage() {
  const router = useRouter();
  const { gameId, storyId } = router.query;
  const { user } = useAuth();
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (gameId) {
      fetchGameData();
    }
  }, [gameId]);

  const fetchGameData = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getGameById(gameId);
      if (response.data?.success) {
        setGameData(response.data.data.game);
      }
    } catch (error) {
      console.error('Failed to fetch game data:', error);
      // Use local metadata as fallback
      setGameData(gameMetadata[gameId] || null);
    } finally {
      setLoading(false);
    }
  };

  const handleGameEnd = async (results) => {
    try {
      await studentAPI.recordGameSession(gameId, {
        score: results.score,
        accuracy: results.accuracy,
        timePlayed: results.timePlayed,
        completed: true,
        details: results
      });
    } catch (error) {
      console.error('Failed to record game session:', error);
    }
  };

  const handleViewAnalytics = () => {
    router.push(`/student/progress?game=${gameId}`);
  };

  const handleBack = () => {
    router.push('/student/games');
  };

  // Get the game component
  const GameComponent = gameId ? gameComponents[gameId.toLowerCase()] : null;
  const metadata = gameId ? (gameData || gameMetadata[gameId.toLowerCase()]) : null;

  if (loading) {
    return (
      <StudentLayout title="Loading Game...">
        <div className={styles.gamePlayPage}>
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading game...</p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  if (!GameComponent) {
    return (
      <StudentLayout title="Game Not Found">
        <div className={styles.gamePlayPage}>
          <div className={styles.gameNotFound}>
            <span className={styles.emptyIcon}>🎮</span>
            <h2>Game Not Found</h2>
            <p>The game you're looking for doesn't exist or isn't available.</p>
            <button onClick={handleBack} className={styles.backToGamesBtn}>
              Back to Games Hub
            </button>
          </div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title={metadata?.name || metadata?.displayName || 'Play Game'}>
      <Head>
        <title>{metadata?.name || metadata?.displayName || 'Game'} | LearnBridge</title>
      </Head>

      <div className={styles.gamePlayPage}>
        {/* Game Header */}
        <div className={styles.gameHeader}>
          <button onClick={handleBack} className={styles.backBtn}>
            ← Back to Games
          </button>
          <div className={styles.gameInfo}>
            <h1>
              {metadata?.icon} {metadata?.name || metadata?.displayName}
            </h1>
            <p>{metadata?.description || metadata?.shortDescription}</p>
          </div>
        </div>

        {/* Game Container */}
        <div className={styles.gameContainer}>
          <GameComponent
            userId={user?._id}
            odId={user?._id}
            odName={user?.firstName || user?.username}
            apiBaseUrl={API_BASE}
            storyId={storyId ? parseInt(storyId) : 0}
            onGameEnd={handleGameEnd}
            onViewAnalytics={handleViewAnalytics}
          />
        </div>
      </div>
    </StudentLayout>
  );
}
