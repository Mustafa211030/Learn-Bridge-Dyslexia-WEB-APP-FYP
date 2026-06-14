// 'use client';
// import { useState, useEffect, useCallback } from 'react';
// import styles from './PhonemeGame.module.css';

// const phonemes = [
//   { sound: 'a', word: 'Apple', image: '/phoneme_pics/apple.jpg', language: 'English' },
//   { sound: 'b', word: 'Ball', image: '/phoneme_pics/ball.jpg', language: 'English' },
//   { sound: 'c', word: 'Cat', image: '/phoneme_pics/cat.jpg', language: 'English' },
//   { sound: 'd', word: 'Dog', image: '/phoneme_pics/dog.jpg', language: 'English' },
//   { sound: 'e', word: 'Elephant', image: '/phoneme_pics/elephant.jpg', language: 'English' },
//   { sound: 'f', word: 'Fish', image: '/phoneme_pics/fish.jpg', language: 'English' },
//   { sound: 'g', word: 'Goat', image: '/phoneme_pics/goat.jpg', language: 'English' },
//   { sound: 'h', word: 'Hat', image: '/phoneme_pics/hat.jpg', language: 'English' },
//   { sound: 'i', word: 'Ice', image: '/phoneme_pics/ice.jpg', language: 'English' },
//   { sound: 'j', word: 'Juice', image: '/phoneme_pics/juice.jpg', language: 'English' },
//   { sound: 'k', word: 'Kite', image: '/phoneme_pics/kite.jpg', language: 'English' },
//   { sound: 'l', word: 'Lion', image: '/phoneme_pics/lion.jpg', language: 'English' },
//   { sound: 'm', word: 'Monkey', image: '/phoneme_pics/monkey.jpg', language: 'English' },
//   { sound: 'n', word: 'Nest', image: '/phoneme_pics/nest.jpg', language: 'English' },
//   { sound: 'o', word: 'Orange', image: '/phoneme_pics/orange.jpg', language: 'English' },
//   { sound: 'p', word: 'Pen', image: '/phoneme_pics/pen.jpg', language: 'English' },
//   { sound: 'q', word: 'Queen', image: '/phoneme_pics/queen.jpg', language: 'English' },
//   { sound: 'r', word: 'Rabbit', image: '/phoneme_pics/rabbit.jpg', language: 'English' },
//   { sound: 's', word: 'Sun', image: '/phoneme_pics/sun.jpg', language: 'English' },
//   { sound: 't', word: 'Tiger', image: '/phoneme_pics/tiger.jpg', language: 'English' },
//   { sound: 'u', word: 'Umbrella', image: '/phoneme_pics/umbrella.jpg', language: 'English' },
//   { sound: 'v', word: 'Violin', image: '/phoneme_pics/violin.jpg', language: 'English' },
//   { sound: 'w', word: 'Watermelon', image: '/phoneme_pics/watermelon.jpg', language: 'English' },
//   { sound: 'x', word: 'Xylophone', image: '/phoneme_pics/xylophone.jpg', language: 'English' },
//   { sound: 'y', word: 'Yarn', image: '/phoneme_pics/yarn.jpg', language: 'English' },
// ];

// // FIXED: Default to Express backend URL
// export default function PhonemeGame({ userId, apiBaseUrl = 'http://localhost:5000/api' }) {
//   const [currentLevel, setCurrentLevel] = useState(1);
//   const [feedback, setFeedback] = useState('');
//   const [gameOver, setGameOver] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [correctAnswers, setCorrectAnswers] = useState(0);
//   const [isLevelComplete, setIsLevelComplete] = useState(false);
//   const [scores, setScores] = useState([0, 0, 0, 0, 0]);
//   const [sessionId, setSessionId] = useState(null);
//   const [choices, setChoices] = useState([]);
//   const [speechSupported, setSpeechSupported] = useState(true);
//   const [isSpeaking, setIsSpeaking] = useState(false);

//   // CRITICAL: Auto-correct /api to Express backend
//   const actualApiUrl = apiBaseUrl === '/api' || apiBaseUrl.startsWith('/api') 
//     ? 'http://localhost:5000/api' 
//     : apiBaseUrl;

//   const getCurrentLevelPhonemes = useCallback(() => {
//     const start = (currentLevel - 1) * 5;
//     return phonemes.slice(start, start + 5);
//   }, [currentLevel]);

//   const currentPhoneme = getCurrentLevelPhonemes()[currentIndex];

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       setSpeechSupported('speechSynthesis' in window);
//     }
//   }, []);

//   useEffect(() => {
//     if (userId) {
//       startGameSession();
//     }
//   }, [userId]);

//   useEffect(() => {
//     if (currentPhoneme) {
//       const newChoices = getRandomChoices();
//       setChoices(newChoices);
//     }
//   }, [currentIndex, currentLevel]);

//   const startGameSession = async () => {
//     try {
//       console.log('Starting phoneme session at:', `${actualApiUrl}/phoneme-game/start-session`);
//       const response = await fetch(`${actualApiUrl}/phoneme-game/start-session`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId })
//       });
//       const data = await response.json();
//       if (data.success) {
//         setSessionId(data.sessionId);
//         console.log('Phoneme session started:', data.sessionId);
//       }
//     } catch (error) {
//       console.error('Error starting game session:', error);
//     }
//   };

//   const playSound = () => {
//     if (!currentPhoneme) return;
//     if (!speechSupported) {
//       alert("Sorry, your browser does not support speech synthesis. Try using Chrome or Edge.");
//       return;
//     }

//     if (typeof window !== 'undefined' && window.speechSynthesis) {
//       window.speechSynthesis.cancel();
//     }

//     setIsSpeaking(true);
//     const utterance = new SpeechSynthesisUtterance(currentPhoneme.sound);
//     utterance.lang = 'en-US';
//     utterance.rate = 0.8;
//     utterance.pitch = 1;
//     utterance.volume = 1;

//     utterance.onend = () => setIsSpeaking(false);
//     utterance.onerror = (e) => {
//       console.error('Speech error:', e);
//       setIsSpeaking(false);
//     };

//     setTimeout(() => {
//       window.speechSynthesis.speak(utterance);
//     }, 100);
//   };

//   const speakWord = (word) => {
//     if (!speechSupported || typeof window === 'undefined') return;
//     window.speechSynthesis.cancel();
//     const utterance = new SpeechSynthesisUtterance(word);
//     utterance.lang = 'en-US';
//     utterance.rate = 0.9;
//     window.speechSynthesis.speak(utterance);
//   };

//   const getRandomChoices = () => {
//     if (!currentPhoneme) return [];
//     let otherChoices = phonemes.filter(p => p.word !== currentPhoneme.word);
//     otherChoices = otherChoices.sort(() => 0.5 - Math.random()).slice(0, 2);
//     return [...otherChoices.map(c => c.word), currentPhoneme.word].sort(() => 0.5 - Math.random());
//   };

//   const saveAnswerToBackend = async (isCorrect, selectedWord) => {
//     if (!sessionId) return;
    
//     try {
//       await fetch(`${actualApiUrl}/phoneme-game/save-answer`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           sessionId,
//           userId,
//           level: currentLevel,
//           phoneme: currentPhoneme.sound,
//           word: currentPhoneme.word,
//           selectedWord,
//           isCorrect,
//           timestamp: new Date()
//         })
//       });
//     } catch (error) {
//       console.error('Error saving answer:', error);
//     }
//   };

//   const checkAnswer = async (selectedWord) => {
//     const isCorrect = selectedWord === currentPhoneme.word;
//     speakWord(selectedWord);

//     if (isCorrect) {
//       setFeedback('✅ Correct! 🎉');
//       setCorrectAnswers(prev => prev + 1);
//       setScores(prevScores => {
//         const updatedScores = [...prevScores];
//         updatedScores[currentLevel - 1] = updatedScores[currentLevel - 1] + 1;
//         return updatedScores;
//       });
//     } else {
//       setFeedback(`❌ Try Again! The correct answer was: ${currentPhoneme.word}`);
//     }

//     await saveAnswerToBackend(isCorrect, selectedWord);

//     setTimeout(() => {
//       setFeedback('');
//       setCurrentIndex((prev) => {
//         if (prev + 1 === 5) {
//           if (correctAnswers + (isCorrect ? 1 : 0) === 5) {
//             setFeedback(`🎉 You passed Level ${currentLevel}!`);
//             setIsLevelComplete(true);
//           } else {
//             setFeedback(`😢 You failed Level ${currentLevel}. Try again!`);
//             setIsLevelComplete(true);
//           }
//           return 5;
//         }
//         return prev + 1;
//       });
//     }, 1500);
//   };

//   const endGameSession = async () => {
//     if (!sessionId) return;
    
//     try {
//       console.log('Ending phoneme session:', sessionId);
//       await fetch(`${actualApiUrl}/phoneme-game/end-session`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           sessionId,
//           userId,
//           finalScore: scores.reduce((acc, score) => acc + score, 0),
//           levelsCompleted: currentLevel,
//           totalCorrect: scores.reduce((acc, score) => acc + score, 0),
//           totalQuestions: currentLevel * 5
//         })
//       });
//       console.log('Phoneme session ended successfully');
//     } catch (error) {
//       console.error('Error ending game session:', error);
//     }
//   };

//   const resetGame = async () => {
//     await endGameSession();
//     setGameOver(false);
//     setScores([0, 0, 0, 0, 0]);
//     setCorrectAnswers(0);
//     setCurrentLevel(1);
//     setCurrentIndex(0);
//     setIsLevelComplete(false);
//     startGameSession();
//   };

//   const handleNextLevel = () => {
//     if (correctAnswers === 5) {
//       if (currentLevel < 5) {
//         setCurrentLevel((prev) => prev + 1);
//         setCurrentIndex(0);
//         setCorrectAnswers(0);
//         setIsLevelComplete(false);
//       } else {
//         setGameOver(true);
//         endGameSession();
//       }
//     } else {
//       alert("You must answer all questions correctly to move to the next level!");
//     }
//   };

//   const handlePreviousLevel = () => {
//     if (currentLevel > 1) {
//       setCurrentLevel((prev) => prev - 1);
//       setCurrentIndex(0);
//       setCorrectAnswers(0);
//       setIsLevelComplete(false);
//     }
//   };

//   const retryLevel = () => {
//     setCurrentIndex(0);
//     setCorrectAnswers(0);
//     setFeedback('');
//     setIsLevelComplete(false);
//     setScores(prevScores => {
//       const updatedScores = [...prevScores];
//       updatedScores[currentLevel - 1] = 0;
//       return updatedScores;
//     });
//   };

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Phoneme Recognition Game</h1>
      
//       {!speechSupported && (
//         <div className={styles.warningBanner}>
//           ⚠️ Speech synthesis not supported. Try Chrome or Edge for audio.
//         </div>
//       )}

//       {gameOver ? (
//         <div className={styles.gameOver}>
//           <h2 className={styles.gameOverTitle}>Game Over! 🎮</h2>
//           <p className={styles.finalScore}>Your final score: {scores.reduce((acc, score) => acc + score, 0)}/25</p>
//           <p className={styles.finalStats}>You answered {scores.reduce((acc, score) => acc + score, 0)} out of 25 questions correctly!</p>
//           <button onClick={resetGame} className={styles.btnPrimary}>
//             Start New Game
//           </button>
//         </div>
//       ) : (
//         <>
//           <p className={styles.scoreDisplay}>Score: {scores[currentLevel - 1]}/5 | Level: {currentLevel}/5</p>
          
//           <button
//             className={`${styles.btnSound} ${isSpeaking ? styles.speaking : ''}`}
//             onClick={playSound}
//             disabled={isSpeaking}
//             aria-label={`Play the sound for the phoneme ${currentPhoneme?.sound}`}
//           >
//             {isSpeaking ? '🔊 Playing...' : '🔊 Play Sound'}
//           </button>

//           {currentPhoneme && (
//             <>
//               <img
//                 src={currentPhoneme.image}
//                 alt={`Image representing the word ${currentPhoneme.word}`}
//                 className={styles.phonemeImage}
//                 onError={(e) => {
//                   e.target.src = '/phoneme_pics/placeholder.jpg';
//                 }}
//               />
//               <div className={styles.choicesGrid}>
//                 {choices.map((word) => (
//                   <button
//                     key={word}
//                     className={styles.choiceBtn}
//                     onClick={() => checkAnswer(word)}
//                     aria-label={`Select the word ${word}`}
//                     disabled={isLevelComplete}
//                   >
//                     {word}
//                   </button>
//                 ))}
//               </div>
//             </>
//           )}

//           {feedback && (
//             <p className={`${styles.feedback} ${feedback.includes('Correct') || feedback.includes('passed') ? styles.feedbackCorrect : styles.feedbackWrong}`}>
//               {feedback}
//             </p>
//           )}

//           {isLevelComplete && (
//             <div className={styles.levelCompleteActions}>
//               {correctAnswers === 5 ? (
//                 <>
//                   {currentLevel > 1 && (
//                     <button onClick={handlePreviousLevel} className={styles.btnSecondary}>
//                       ← Previous Level
//                     </button>
//                   )}
//                   <button onClick={handleNextLevel} className={styles.btnSuccess}>
//                     {currentLevel === 5 ? 'Finish Game 🏆' : 'Next Level →'}
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <button onClick={retryLevel} className={styles.btnWarning}>
//                     🔄 Retry Level
//                   </button>
//                   {currentLevel > 1 && (
//                     <button onClick={handlePreviousLevel} className={styles.btnSecondary}>
//                       ← Previous Level
//                     </button>
//                   )}
//                 </>
//               )}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

































'use client';
import { useState, useEffect, useCallback } from 'react';
import styles from './PhonemeGame.module.css';

const phonemes = [
  { sound: 'a', word: 'Apple', image: '/phoneme_pics/apple.jpg', language: 'English' },
  { sound: 'b', word: 'Ball', image: '/phoneme_pics/ball.jpg', language: 'English' },
  { sound: 'c', word: 'Cat', image: '/phoneme_pics/cat.jpg', language: 'English' },
  { sound: 'd', word: 'Dog', image: '/phoneme_pics/dog.jpg', language: 'English' },
  { sound: 'e', word: 'Elephant', image: '/phoneme_pics/elephant.jpg', language: 'English' },
  { sound: 'f', word: 'Fish', image: '/phoneme_pics/fish.jpg', language: 'English' },
  { sound: 'g', word: 'Goat', image: '/phoneme_pics/goat.jpg', language: 'English' },
  { sound: 'h', word: 'Hat', image: '/phoneme_pics/hat.jpg', language: 'English' },
  { sound: 'i', word: 'Ice', image: '/phoneme_pics/ice.jpg', language: 'English' },
  { sound: 'j', word: 'Juice', image: '/phoneme_pics/juice.jpg', language: 'English' },
  { sound: 'k', word: 'Kite', image: '/phoneme_pics/kite.jpg', language: 'English' },
  { sound: 'l', word: 'Lion', image: '/phoneme_pics/lion.jpg', language: 'English' },
  { sound: 'm', word: 'Monkey', image: '/phoneme_pics/monkey.jpg', language: 'English' },
  { sound: 'n', word: 'Nest', image: '/phoneme_pics/nest.jpg', language: 'English' },
  { sound: 'o', word: 'Orange', image: '/phoneme_pics/orange.jpg', language: 'English' },
  { sound: 'p', word: 'Pen', image: '/phoneme_pics/pen.jpg', language: 'English' },
  { sound: 'q', word: 'Queen', image: '/phoneme_pics/queen.jpg', language: 'English' },
  { sound: 'r', word: 'Rabbit', image: '/phoneme_pics/rabbit.jpg', language: 'English' },
  { sound: 's', word: 'Sun', image: '/phoneme_pics/sun.jpg', language: 'English' },
  { sound: 't', word: 'Tiger', image: '/phoneme_pics/tiger.jpg', language: 'English' },
  { sound: 'u', word: 'Umbrella', image: '/phoneme_pics/umbrella.jpg', language: 'English' },
  { sound: 'v', word: 'Violin', image: '/phoneme_pics/violin.jpg', language: 'English' },
  { sound: 'w', word: 'Watermelon', image: '/phoneme_pics/watermelon.jpg', language: 'English' },
  { sound: 'x', word: 'Xylophone', image: '/phoneme_pics/xylophone.jpg', language: 'English' },
  { sound: 'y', word: 'Yarn', image: '/phoneme_pics/yarn.jpg', language: 'English' },
];

// FIXED: Default to Express backend URL
export default function PhonemeGame({ userId, apiBaseUrl = 'http://localhost:5000/api' }) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [scores, setScores] = useState([0, 0, 0, 0, 0]);
  const [sessionId, setSessionId] = useState(null);
  const [choices, setChoices] = useState([]);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // CRITICAL: Auto-correct /api to Express backend
  const actualApiUrl = apiBaseUrl === '/api' || apiBaseUrl.startsWith('/api') 
    ? 'http://localhost:5000/api' 
    : apiBaseUrl;

  const getCurrentLevelPhonemes = useCallback(() => {
    const start = (currentLevel - 1) * 5;
    return phonemes.slice(start, start + 5);
  }, [currentLevel]);

  const currentPhoneme = getCurrentLevelPhonemes()[currentIndex];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSpeechSupported('speechSynthesis' in window);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      startGameSession();
    }
  }, [userId]);

  useEffect(() => {
    if (currentPhoneme) {
      const newChoices = getRandomChoices();
      setChoices(newChoices);
    }
  }, [currentIndex, currentLevel]);

  const startGameSession = async () => {
    try {
      console.log('Starting phoneme session at:', `${actualApiUrl}/phoneme-game/start-session`);
      const response = await fetch(`${actualApiUrl}/phoneme-game/start-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await response.json();
      if (data.success) {
        setSessionId(data.sessionId);
        console.log('Phoneme session started:', data.sessionId);
      }
    } catch (error) {
      console.error('Error starting game session:', error);
    }
  };

  const playSound = () => {
    if (!currentPhoneme) return;
    if (!speechSupported) {
      alert("Sorry, your browser does not support speech synthesis. Try using Chrome or Edge.");
      return;
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(currentPhoneme.sound);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error('Speech error:', e);
      setIsSpeaking(false);
    };

    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 100);
  };

  const speakWord = (word) => {
    if (!speechSupported || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const getRandomChoices = () => {
    if (!currentPhoneme) return [];
    let otherChoices = phonemes.filter(p => p.word !== currentPhoneme.word);
    otherChoices = otherChoices.sort(() => 0.5 - Math.random()).slice(0, 2);
    return [...otherChoices.map(c => c.word), currentPhoneme.word].sort(() => 0.5 - Math.random());
  };

  const saveAnswerToBackend = async (isCorrect, selectedWord) => {
    if (!sessionId) return;
    
    try {
      await fetch(`${actualApiUrl}/phoneme-game/save-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId,
          level: currentLevel,
          phoneme: currentPhoneme.sound,
          word: currentPhoneme.word,
          selectedWord,
          isCorrect,
          timestamp: new Date()
        })
      });
    } catch (error) {
      console.error('Error saving answer:', error);
    }
  };

  const checkAnswer = async (selectedWord) => {
    const isCorrect = selectedWord === currentPhoneme.word;
    speakWord(selectedWord);

    if (isCorrect) {
      setFeedback('✅ Correct! 🎉');
      setCorrectAnswers(prev => prev + 1);
      setScores(prevScores => {
        const updatedScores = [...prevScores];
        updatedScores[currentLevel - 1] = updatedScores[currentLevel - 1] + 1;
        return updatedScores;
      });
    } else {
      setFeedback(`❌ Try Again! The correct answer was: ${currentPhoneme.word}`);
    }

    await saveAnswerToBackend(isCorrect, selectedWord);

    setTimeout(() => {
      setFeedback('');
      setCurrentIndex((prev) => {
        if (prev + 1 === 5) {
          if (correctAnswers + (isCorrect ? 1 : 0) === 5) {
            setFeedback(`🎉 You passed Level ${currentLevel}!`);
            setIsLevelComplete(true);
          } else {
            setFeedback(`😢 You failed Level ${currentLevel}. Try again!`);
            setIsLevelComplete(true);
          }
          return 5;
        }
        return prev + 1;
      });
    }, 1500);
  };

  const endGameSession = async () => {
    if (!sessionId) return;
    
    try {
      console.log('Ending phoneme session:', sessionId);
      await fetch(`${actualApiUrl}/phoneme-game/end-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId,
          finalScore: scores.reduce((acc, score) => acc + score, 0),
          levelsCompleted: currentLevel,
          totalCorrect: scores.reduce((acc, score) => acc + score, 0),
          totalQuestions: currentLevel * 5
        })
      });
      console.log('Phoneme session ended successfully');
    } catch (error) {
      console.error('Error ending game session:', error);
    }
  };

  const resetGame = async () => {
    await endGameSession();
    setGameOver(false);
    setScores([0, 0, 0, 0, 0]);
    setCorrectAnswers(0);
    setCurrentLevel(1);
    setCurrentIndex(0);
    setIsLevelComplete(false);
    startGameSession();
  };

  const handleNextLevel = () => {
    if (correctAnswers === 5) {
      if (currentLevel < 5) {
        setCurrentLevel((prev) => prev + 1);
        setCurrentIndex(0);
        setCorrectAnswers(0);
        setIsLevelComplete(false);
      } else {
        setGameOver(true);
        endGameSession();
      }
    } else {
      alert("You must answer all questions correctly to move to the next level!");
    }
  };

  const handlePreviousLevel = () => {
    if (currentLevel > 1) {
      setCurrentLevel((prev) => prev - 1);
      setCurrentIndex(0);
      setCorrectAnswers(0);
      setIsLevelComplete(false);
    }
  };

  const retryLevel = () => {
    setCurrentIndex(0);
    setCorrectAnswers(0);
    setFeedback('');
    setIsLevelComplete(false);
    setScores(prevScores => {
      const updatedScores = [...prevScores];
      updatedScores[currentLevel - 1] = 0;
      return updatedScores;
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Phoneme Recognition Game</h1>
      
      {!speechSupported && (
        <div className={styles.warningBanner}>
          ⚠️ Speech synthesis not supported. Try Chrome or Edge for audio.
        </div>
      )}

      {gameOver ? (
        <div className={styles.gameOver}>
          <h2 className={styles.gameOverTitle}>Game Over! 🎮</h2>
          <p className={styles.finalScore}>Your final score: {scores.reduce((acc, score) => acc + score, 0)}/25</p>
          <p className={styles.finalStats}>You answered {scores.reduce((acc, score) => acc + score, 0)} out of 25 questions correctly!</p>
          <button onClick={resetGame} className={styles.btnPrimary}>
            Start New Game
          </button>
        </div>
      ) : (
        <>
          <p className={styles.scoreDisplay}>Score: {scores[currentLevel - 1]}/5 | Level: {currentLevel}/5</p>
          
          <button
            className={`${styles.btnSound} ${isSpeaking ? styles.speaking : ''}`}
            onClick={playSound}
            disabled={isSpeaking}
            aria-label={`Play the sound for the phoneme ${currentPhoneme?.sound}`}
          >
            {isSpeaking ? '🔊 Playing...' : '🔊 Play Sound'}
          </button>

          {currentPhoneme && (
            <>
              <img
                src={currentPhoneme.image}
                alt={`Image representing the word ${currentPhoneme.word}`}
                className={styles.phonemeImage}
                onError={(e) => {
                  e.target.src = '/phoneme_pics/placeholder.jpg';
                }}
              />
              <div className={styles.choicesGrid}>
                {choices.map((word) => (
                  <button
                    key={word}
                    className={styles.choiceBtn}
                    onClick={() => checkAnswer(word)}
                    aria-label={`Select the word ${word}`}
                    disabled={isLevelComplete}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </>
          )}

          {feedback && (
            <p className={`${styles.feedback} ${feedback.includes('Correct') || feedback.includes('passed') ? styles.feedbackCorrect : styles.feedbackWrong}`}>
              {feedback}
            </p>
          )}

          {isLevelComplete && (
            <div className={styles.levelCompleteActions}>
              {correctAnswers === 5 ? (
                <>
                  {currentLevel > 1 && (
                    <button onClick={handlePreviousLevel} className={styles.btnSecondary}>
                      ← Previous Level
                    </button>
                  )}
                  <button onClick={handleNextLevel} className={styles.btnSuccess}>
                    {currentLevel === 5 ? 'Finish Game 🏆' : 'Next Level →'}
                  </button>
                </>
              ) : (
                <>
                  <button onClick={retryLevel} className={styles.btnWarning}>
                    🔄 Retry Level
                  </button>
                  {currentLevel > 1 && (
                    <button onClick={handlePreviousLevel} className={styles.btnSecondary}>
                      ← Previous Level
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}