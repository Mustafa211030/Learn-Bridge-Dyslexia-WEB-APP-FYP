'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './MathQuest.module.css';

const questions = {
  addition: [
    { question: '5 + 3', answer: 8, hint: 'Think of fingers.' },
    { question: '10 + 6', answer: 16, hint: 'Double of 8.' },
    { question: '35 + 42', answer: 77, hint: 'Big numbers!' },
    { question: '123 + 456', answer: 579, hint: 'Add each digit column!' },
    { question: '999 + 1', answer: 1000, hint: 'A thousand!' }
  ],
  subtraction: [
    { question: '10 - 6', answer: 4, hint: 'Half of 8.' },
    { question: '15 - 5', answer: 10, hint: 'One more than 9.' },
    { question: '50 - 37', answer: 13, hint: 'Larger numbers!' },
    { question: '100 - 45', answer: 55, hint: 'Think about it!' },
    { question: '1000 - 999', answer: 1, hint: 'Almost nothing left!' }
  ],
  multiplication: [
    { question: '4 × 2', answer: 8, hint: 'Double it.' },
    { question: '3 × 5', answer: 15, hint: 'Three fives.' },
    { question: '12 × 8', answer: 96, hint: 'Big multiplication!' },
    { question: '7 × 7', answer: 49, hint: 'Lucky sevens!' },
    { question: '15 × 15', answer: 225, hint: 'Square of fifteen!' }
  ],
  division: [
    { question: '8 ÷ 2', answer: 4, hint: 'Half of 8.' },
    { question: '9 ÷ 3', answer: 3, hint: 'Three threes.' },
    { question: '56 ÷ 7', answer: 8, hint: 'Simple division!' },
    { question: '144 ÷ 12', answer: 12, hint: 'A dozen!' },
    { question: '100 ÷ 4', answer: 25, hint: 'Quarter of hundred!' }
  ]
};

const operationIcons = {
  addition: '➕',
  subtraction: '➖',
  multiplication: '✖️',
  division: '➗'
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function MathQuest({ odId, odName, onGameEnd, onViewAnalytics }) {
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState('');
  const [hintVisible, setHintVisible] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [operation, setOperation] = useState('');
  const [selectedOperation, setSelectedOperation] = useState('');
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [newAchievements, setNewAchievements] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const [questionDetails, setQuestionDetails] = useState([]);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHintUsed, setCurrentHintUsed] = useState(false);

  const guideRef = useRef(null);
  const timerRef = useRef(null);
  const correctSound = useRef(null);
  const wrongSound = useRef(null);
  const hintSound = useRef(null);

  // FIXED: Move function declarations before useEffect
  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/mathquest/leaderboard?operation=overall&limit=10`);
      const data = await res.json();
      if (data.success) {
        setLeaderboard(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      const saved = localStorage.getItem('mathquest_leaderboard');
      if (saved) setLeaderboard(JSON.parse(saved));
    }
  }, []);

  const recordQuestionResult = useCallback((isCorrect, userAnswer) => {
    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);
    const currentQ = questions[operation][level];
    
    setQuestionDetails(prev => [...prev, {
      question: currentQ.question,
      correctAnswer: currentQ.answer,
      userAnswer: userAnswer,
      isCorrect,
      timeTaken,
      hintUsed: currentHintUsed
    }]);
  }, [questionStartTime, operation, level, currentHintUsed]);

  const handleTimeUp = useCallback(() => {
    recordQuestionResult(false, null);
    setFeedback('⏰ Time&apos;s up!');
    wrongSound.current?.play();
    setTimerActive(false);
    setStreak(0);
    setWrongAnswers(prev => prev + 1);
    setTimeout(() => nextQuestion(), 1500);
  }, [recordQuestionResult]);

  const animateWizard = useCallback(() => {
    guideRef.current?.classList.add(styles.animate);
    setTimeout(() => guideRef.current?.classList.remove(styles.animate), 600);
  }, []);

  const nextQuestion = useCallback(() => {
    const next = level + 1;
    if (next >= questions[operation].length) {
      endGame();
    } else {
      setLevel(next);
      setAnswer('');
      setFeedback('');
      setHintVisible(false);
      setShowNext(false);
      setTimeLeft(30);
      setTimerActive(true);
      setCurrentHintUsed(false);
      setQuestionStartTime(Date.now());
    }
  }, [level, operation]);

  const endGame = useCallback(async () => {
    setTimerActive(false);
    setCompleted(true);
    setIsSaving(true);

    const totalTime = Math.round((Date.now() - gameStartTime) / 1000);
    const totalQuestions = questions[operation].length;

    const sessionData = {
      odId: odId || 'guest',
      odName: odName || 'Guest Player',
      operation,
      score,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      totalTime,
      hintsUsed,
      maxStreak,
      questionDetails,
      difficulty: 'medium'
    };

    try {
      const res = await fetch(`${API_BASE}/mathquest/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });

      const data = await res.json();
      
      if (data.success && data.data.newAchievements?.length > 0) {
        setNewAchievements(data.data.newAchievements);
      }

      await fetchLeaderboard();
    } catch (error) {
      console.error('Failed to save game session:', error);
      const entry = {
        odName: odName || 'Guest',
        score,
        operation,
        date: new Date().toISOString()
      };
      const existing = JSON.parse(localStorage.getItem('mathquest_leaderboard')) || [];
      const updated = [...existing, entry].sort((a, b) => b.score - a.score).slice(0, 10);
      localStorage.setItem('mathquest_leaderboard', JSON.stringify(updated));
      setLeaderboard(updated);
    }

    setIsSaving(false);
    
    if (onGameEnd) {
      onGameEnd({ score, operation, correctAnswers, wrongAnswers, maxStreak, totalTime });
    }
  }, [gameStartTime, operation, score, correctAnswers, wrongAnswers, hintsUsed, maxStreak, questionDetails, odId, odName, fetchLeaderboard, onGameEnd]);

  const checkAnswer = useCallback(() => {
    if (!answer.trim()) return;
    
    const correct = questions[operation][level].answer;
    const userAnswer = parseInt(answer);
    const isCorrect = userAnswer === correct;
    
    recordQuestionResult(isCorrect, userAnswer);
    
    if (isCorrect) {
      const bonusPoints = Math.max(0, timeLeft) + (streak * 2);
      const points = 10 + bonusPoints;
      
      setFeedback(`🧙‍♂️ Great job! +${points} points!`);
      correctSound.current?.play();
      setScore(prev => prev + points);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
      setCorrectAnswers(prev => prev + 1);
      setShowNext(true);
      setTimerActive(false);
      animateWizard();
    } else {
      setFeedback('🧙‍♂️ Not quite. Try again!');
      wrongSound.current?.play();
      setStreak(0);
      setWrongAnswers(prev => prev + 1);
    }
  }, [answer, operation, level, timeLeft, streak, recordQuestionResult, animateWizard]);

  // NOW useEffect hooks AFTER function declarations
  useEffect(() => {
    correctSound.current = new Audio('/sounds/correct.mp3');
    wrongSound.current = new Audio('/sounds/wrong.mp3');
    hintSound.current = new Audio('/sounds/hint.mp3');
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      handleTimeUp();
    }
    return () => clearTimeout(timerRef.current);
  }, [timerActive, timeLeft, handleTimeUp]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && gameStarted && !completed && !showNext) {
        checkAnswer();
      }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [checkAnswer, gameStarted, completed, showNext]);

  const startGame = () => {
    if (!selectedOperation) {
      alert('Please choose an operation!');
      return;
    }
    setOperation(selectedOperation);
    setGameStarted(true);
    setLevel(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTimeLeft(30);
    setTimerActive(true);
    setQuestionDetails([]);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setHintsUsed(0);
    setCurrentHintUsed(false);
    setGameStartTime(Date.now());
    setQuestionStartTime(Date.now());
  };

  const toggleHint = () => {
    if (!hintVisible) {
      setHintsUsed(prev => prev + 1);
      setCurrentHintUsed(true);
      setScore(prev => Math.max(0, prev - 2));
    }
    setHintVisible(prev => !prev);
    hintSound.current?.play();
  };

  const resetGame = () => {
    setLevel(0);
    setScore(0);
    setAnswer('');
    setHintVisible(false);
    setFeedback('');
    setGameStarted(false);
    setShowNext(false);
    setCompleted(false);
    setOperation('');
    setSelectedOperation('');
    setStreak(0);
    setMaxStreak(0);
    setTimeLeft(30);
    setTimerActive(false);
    setQuestionDetails([]);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setHintsUsed(0);
    setNewAchievements([]);
  };

  const getProgressPercentage = () => {
    if (!operation) return 0;
    return ((level + 1) / questions[operation].length) * 100;
  };

  const accuracy = correctAnswers + wrongAnswers > 0
    ? Math.round((correctAnswers / (correctAnswers + wrongAnswers)) * 100)
    : 0;

  return (
    <div className={styles.container}>
      {/* Home Screen */}
      {!gameStarted && !completed && (
        <div className={styles.home}>
          <div className={styles.wizardIcon} ref={guideRef}>🧙‍♂️</div>
          <h1 className={styles.title}>Math Quest</h1>
          <p className={styles.subtitle}>Embark on a magical math adventure!</p>
          
          {odName && (
            <div className={styles.playerBadge}>
              👋 Welcome, {odName}!
            </div>
          )}
          
          <div className={styles.operationGrid}>
            <h3>Choose Your Challenge:</h3>
            <div className={styles.operations}>
              {Object.keys(questions).map((op) => (
                <button
                  key={op}
                  className={`${styles.opBtn} ${selectedOperation === op ? styles.selected : ''}`}
                  onClick={() => setSelectedOperation(op)}
                >
                  <span className={styles.opIcon}>{operationIcons[op]}</span>
                  <span className={styles.opName}>{op.charAt(0).toUpperCase() + op.slice(1)}</span>
                </button>
              ))}
            </div>
          </div>
          
          <button 
            className={styles.startBtn}
            onClick={startGame}
            disabled={!selectedOperation}
          >
            Start Adventure
          </button>

          {onViewAnalytics && odId && (
            <button className={styles.analyticsBtn} onClick={onViewAnalytics}>
              📊 View My Performance
            </button>
          )}

          {leaderboard.length > 0 && (
            <div className={styles.leaderboardPreview}>
              <h4>🏆 Top Wizards</h4>
              <ol>
                {leaderboard.slice(0, 3).map((entry, index) => (
                  <li key={index}>
                    <span className={styles.rank}>{['🥇', '🥈', '🥉'][index]}</span>
                    <span className={styles.name}>{entry.odName || 'Guest'}</span>
                    <span className={styles.score}>{entry.score}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Game Screen */}
      {gameStarted && !completed && (
        <div className={styles.game}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Level</span>
              <span className={styles.statValue}>{level + 1}/{questions[operation].length}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Score</span>
              <span className={styles.statValue}>{score}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Streak</span>
              <span className={styles.statValue}>🔥 {streak}</span>
            </div>
            <div className={`${styles.timer} ${timeLeft <= 10 ? styles.warning : ''}`}>
              <span className={styles.statLabel}>Time</span>
              <span className={styles.statValue}>{timeLeft}s</span>
            </div>
          </div>

          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${getProgressPercentage()}%` }} />
          </div>

          <div className={styles.questionCard}>
            <div className={styles.operationBadge}>
              {operationIcons[operation]} {operation.toUpperCase()}
            </div>
            <p className={styles.question}>{questions[operation][level].question} = ?</p>
            
            <input
              type="number"
              className={styles.input}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Your answer..."
              autoFocus
            />

            <div className={styles.actions}>
              <button 
                className={`${styles.btn} ${styles.btnSubmit}`}
                onClick={checkAnswer}
                disabled={!answer.trim()}
              >
                Submit
              </button>
              <button 
                className={`${styles.btn} ${styles.btnHint}`}
                onClick={toggleHint}
              >
                {hintVisible ? '🙈 Hide' : '💡 Hint'} (-2pts)
              </button>
            </div>

            {showNext && (
              <button className={`${styles.btn} ${styles.btnNext}`} onClick={nextQuestion}>
                Next Question →
              </button>
            )}

            {hintVisible && (
              <div className={styles.hintBox}>
                💡 {questions[operation][level].hint}
              </div>
            )}

            {feedback && (
              <p className={`${styles.feedback} ${feedback.includes('Great') ? styles.success : styles.error}`}>
                {feedback}
              </p>
            )}
          </div>

          <button className={`${styles.btn} ${styles.btnQuit}`} onClick={resetGame}>
            ← Back to Menu
          </button>
        </div>
      )}

      {/* End Screen */}
      {completed && (
        <div className={styles.end}>
          <div className={styles.celebration}>🎉</div>
          <h2 className={styles.endTitle}>Quest Complete!</h2>
          
          {newAchievements.length > 0 && (
            <div className={styles.achievementsPopup}>
              <h4>🏅 New Achievements!</h4>
              {newAchievements.map((ach, i) => (
                <div key={i} className={styles.achievement}>
                  <span className={styles.achIcon}>{ach.icon}</span>
                  <div>
                    <strong>{ach.name}</strong>
                    <p>{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className={styles.finalScore}>
            <span className={styles.scoreLabel}>Final Score</span>
            <span className={styles.scoreValue}>{score}</span>
          </div>

          <div className={styles.statsSummary}>
            <div className={styles.summaryItem}>
              <span>Accuracy</span>
              <span>{accuracy}%</span>
            </div>
            <div className={styles.summaryItem}>
              <span>Best Streak</span>
              <span>🔥 {maxStreak}</span>
            </div>
            <div className={styles.summaryItem}>
              <span>Correct</span>
              <span>✅ {correctAnswers}</span>
            </div>
            <div className={styles.summaryItem}>
              <span>Wrong</span>
              <span>❌ {wrongAnswers}</span>
            </div>
          </div>

          {isSaving && <p className={styles.saving}>Saving your score...</p>}

          <div className={styles.leaderboard}>
            <h3>🏆 Leaderboard</h3>
            <ol className={styles.leaderboardList}>
              {leaderboard.slice(0, 5).map((entry, index) => (
                <li key={index} className={styles.leaderboardItem}>
                  <span className={styles.rank}>#{index + 1}</span>
                  <span className={styles.name}>{entry.odName || 'Guest'}</span>
                  <span className={styles.points}>{entry.score} pts</span>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.endActions}>
            <button className={`${styles.btn} ${styles.btnRestart}`} onClick={resetGame}>
              Play Again
            </button>
            
            {onViewAnalytics && odId && (
              <button className={`${styles.btn} ${styles.btnAnalytics}`} onClick={onViewAnalytics}>
                📊 View Full Analytics
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}