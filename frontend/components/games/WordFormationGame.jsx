// 'use client';
// import { useState, useEffect, useRef, useCallback } from 'react';
// import useSound from 'use-sound';
// import confetti from 'canvas-confetti';
// import styles from './WordFormationGame.module.css';

// const correctSfxUrl = '/word_sounds/correct.mp3';
// const wrongSfxUrl = '/word_sounds/wrong.mp3';
// const timeoutSfxUrl = '/word_sounds/timeout.mp3';

// // FIXED: Default to Express backend URL
// export default function WordFormationGame({ userId, apiBaseUrl = 'http://localhost:5000/api' }) {
//   const [correctWord, setCorrectWord] = useState('');
//   const [wordText, setWordText] = useState('');
//   const [hintText, setHintText] = useState('');
//   const [userInput, setUserInput] = useState('');
//   const [timer, setTimer] = useState(30);
//   const [score, setScore] = useState(0);
//   const [level, setLevel] = useState(1);
//   const [sessionId, setSessionId] = useState(null);
//   const [totalAttempts, setTotalAttempts] = useState(0);
//   const [correctAttempts, setCorrectAttempts] = useState(0);
//   const [startTime, setStartTime] = useState(null);

//   const [playCorrect] = useSound(correctSfxUrl);
//   const [playWrong] = useSound(wrongSfxUrl);
//   const [playTimeout] = useSound(timeoutSfxUrl);

//   const timerRef = useRef(null);

//   // CRITICAL: Auto-correct /api to Express backend
//   const actualApiUrl = apiBaseUrl === '/api' || apiBaseUrl.startsWith('/api') 
//     ? 'http://localhost:5000/api' 
//     : apiBaseUrl;

//   const words = [
//     { word: 'addition', hint: 'The process of adding numbers' },
//     { word: 'meeting', hint: 'Event in which people come together' },
//     { word: 'number', hint: 'Math symbol used for counting' },
//     { word: 'exchange', hint: 'The act of trading' },
//     { word: 'canvas', hint: 'Piece of fabric for oil painting' },
//     { word: 'garden', hint: 'Space for planting flower and plant' },
//     { word: 'position', hint: 'Location of someone or something' },
//     { word: 'feather', hint: 'Hair like outer covering of bird' },
//     { word: 'comfort', hint: 'A pleasant feeling of relaxation' },
//     { word: 'tongue', hint: 'The muscular organ of mouth' },
//     { word: 'expansion', hint: 'The process of increase or grow' },
//     { word: 'country', hint: 'A politically identified region' },
//     { word: 'group', hint: 'A number of objects or persons' },
//     { word: 'taste', hint: 'Ability of tongue to detect flavour' },
//     { word: 'store', hint: 'Large shop where goods are traded' },
//     { word: 'field', hint: 'Area of land for farming activities' },
//     { word: 'friend', hint: 'Person other than a family member' },
//     { word: 'pocket', hint: 'A bag for carrying small items' },
//     { word: 'needle', hint: 'A thin and sharp metal pin' },
//     { word: 'expert', hint: 'Person with extensive knowledge' },
//     { word: 'statement', hint: 'A declaration of something' },
//     { word: 'second', hint: 'One-sixtieth of a minute' },
//     { word: 'library', hint: 'Place containing collection of books' },
//   ];

//   // FIXED: Move startGameSession before useEffect
//   const startGameSession = useCallback(async () => {
//     try {
//       console.log('Starting word-formation session at:', `${actualApiUrl}/word-formation/start-session`);
//       const response = await fetch(`${actualApiUrl}/word-formation/start-session`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId })
//       });
//       const data = await response.json();
//       if (data.success) {
//         setSessionId(data.sessionId);
//         console.log('Word Formation session started:', data.sessionId);
//       }
//     } catch (error) {
//       console.error('Error starting game session:', error);
//     }
//   }, [actualApiUrl, userId]);

//   const endGameSession = useCallback(async () => {
//     if (!sessionId) return;

//     try {
//       console.log('Ending word-formation session:', sessionId);
//       await fetch(`${actualApiUrl}/word-formation/end-session`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           sessionId,
//           userId,
//           finalScore: score,
//           finalLevel: level,
//           totalAttempts,
//           correctAttempts,
//           accuracy: totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0
//         })
//       });
//       console.log('Word Formation session ended successfully');
//     } catch (error) {
//       console.error('Error ending game session:', error);
//     }
//   }, [sessionId, actualApiUrl, userId, score, level, totalAttempts, correctAttempts]);

//   const saveAttemptToBackend = useCallback(async (isCorrect, isTimeout = false) => {
//     if (!sessionId || !correctWord) return;

//     const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

//     try {
//       await fetch(`${actualApiUrl}/word-formation/save-attempt`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           sessionId,
//           userId,
//           word: correctWord,
//           scrambledWord: wordText,
//           hint: hintText,
//           userAnswer: userInput || '(timeout)',
//           isCorrect,
//           isTimeout,
//           timeSpent,
//           level,
//           timestamp: new Date()
//         })
//       });

//       setTotalAttempts(prev => prev + 1);
//       if (isCorrect) {
//         setCorrectAttempts(prev => prev + 1);
//       }
//     } catch (error) {
//       console.error('Error saving attempt:', error);
//     }
//   }, [sessionId, userId, correctWord, wordText, hintText, userInput, level, startTime, actualApiUrl]);

//   const initGame = useCallback(() => {
//     const randomObj = words[Math.floor(Math.random() * words.length)];
//     const wordArray = randomObj.word.split('');
    
//     for (let i = wordArray.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
//     }
    
//     setWordText(wordArray.join(''));
//     setHintText(randomObj.hint);
//     setCorrectWord(randomObj.word.toLowerCase());
//     setUserInput('');
    
//     clearInterval(timerRef.current);
//     setTimer(30);
//     setStartTime(Date.now());
    
//     timerRef.current = setInterval(() => {
//       setTimer(prevTimer => {
//         const newTimer = prevTimer - 1;
//         if (newTimer <= 0) {
//           clearInterval(timerRef.current);
//           return 0;
//         }
//         return newTimer;
//       });
//     }, 1000);
//   }, []);

//   const handleTimeout = useCallback(async () => {
//     playTimeout();
//     alert(`⏰ Time's up! The correct word was: ${correctWord.toUpperCase()}`);
//     await saveAttemptToBackend(false, true);
//     initGame();
//   }, [correctWord, playTimeout, saveAttemptToBackend, initGame]);

//   useEffect(() => {
//     if (timer === 0 && correctWord) {
//       handleTimeout();
//     }
//   }, [timer, correctWord, handleTimeout]);

//   useEffect(() => {
//     if (userId) {
//       startGameSession();
//     }
//   }, [userId, startGameSession]);

//   const checkWord = async () => {
//     const userWord = userInput.toLowerCase().trim();
    
//     if (!userWord) {
//       alert('Please enter the word to check!');
//       return;
//     }
    
//     clearInterval(timerRef.current);
    
//     if (userWord !== correctWord) {
//       playWrong();
//       alert(`❌ ${userWord} is not correct. Try again!`);
//       await saveAttemptToBackend(false);
//       initGame();
//       return;
//     }

//     playCorrect();
//     confetti({
//       particleCount: 150,
//       spread: 70,
//       origin: { y: 0.6 },
//     });
    
//     alert(`🎉 Correct! ${correctWord.toUpperCase()} is the word!`);
    
//     setScore(prev => prev + 1);
//     setLevel(prev => prev + 1);
    
//     await saveAttemptToBackend(true);
//     initGame();
//   };

//   const resetGame = async () => {
//     if (sessionId) {
//       await endGameSession();
//     }
    
//     setScore(0);
//     setLevel(1);
//     setTotalAttempts(0);
//     setCorrectAttempts(0);
//     clearInterval(timerRef.current);
    
//     if (userId) {
//       await startGameSession();
//     }
    
//     initGame();
//   };

//   // FIXED: Add dependencies to useEffect
//   useEffect(() => {
//     initGame();

//     return () => {
//       clearInterval(timerRef.current);
//       if (sessionId) {
//         endGameSession();
//       }
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.container}>
//         <h2 className={styles.title}>Word Formation Game</h2>
        
//         <div className={styles.statsBar}>
//           <span>Score: {score}</span>
//           <span>Level: {level}</span>
//           <span>Accuracy: {totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0}%</span>
//         </div>

//         <div className={styles.content}>
//           <p className={styles.word}>{wordText}</p>
          
//           <div className={styles.details}>
//             <p className={styles.hint}>
//               Hint: <span>{hintText}</span>
//             </p>
//             <p className={styles.time}>
//               Time Left: <span><b>{timer}</b>s</span>
//             </p>
//           </div>

//           <input
//             type="text"
//             spellCheck="false"
//             placeholder="Enter a valid word"
//             value={userInput}
//             onChange={(e) => setUserInput(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && checkWord()}
//             maxLength={correctWord.length}
//             className={styles.input}
//           />

//           <div className={styles.buttons}>
//             <button className={styles.refreshWord} onClick={initGame}>
//               🔄 Refresh Word
//             </button>
//             <button className={styles.checkWord} onClick={checkWord}>
//               ✅ Check Word
//             </button>
//           </div>
          
//           <button className={styles.resetGame} onClick={resetGame}>
//             🔁 Reset Game
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }









'use client';
import { useState, useEffect, useRef } from 'react';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';
import styles from './WordFormationGame.module.css';

const correctSfxUrl = '/word_sounds/correct.mp3';
const wrongSfxUrl = '/word_sounds/wrong.mp3';
const timeoutSfxUrl = '/word_sounds/timeout.mp3';

// FIXED: Default to Express backend URL
export default function WordFormationGame({ userId, apiBaseUrl = 'http://localhost:5000/api' }) {
  const [correctWord, setCorrectWord] = useState('');
  const [wordText, setWordText] = useState('');
  const [hintText, setHintText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timer, setTimer] = useState(30);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [sessionId, setSessionId] = useState(null);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [startTime, setStartTime] = useState(null);

  const [playCorrect] = useSound(correctSfxUrl);
  const [playWrong] = useSound(wrongSfxUrl);
  const [playTimeout] = useSound(timeoutSfxUrl);

  const timerRef = useRef(null);

  // CRITICAL: Auto-correct /api to Express backend
  const actualApiUrl = apiBaseUrl === '/api' || apiBaseUrl.startsWith('/api') 
    ? 'http://localhost:5000/api' 
    : apiBaseUrl;

  const words = [
    { word: 'addition', hint: 'The process of adding numbers' },
    { word: 'meeting', hint: 'Event in which people come together' },
    { word: 'number', hint: 'Math symbol used for counting' },
    { word: 'exchange', hint: 'The act of trading' },
    { word: 'canvas', hint: 'Piece of fabric for oil painting' },
    { word: 'garden', hint: 'Space for planting flower and plant' },
    { word: 'position', hint: 'Location of someone or something' },
    { word: 'feather', hint: 'Hair like outer covering of bird' },
    { word: 'comfort', hint: 'A pleasant feeling of relaxation' },
    { word: 'tongue', hint: 'The muscular organ of mouth' },
    { word: 'expansion', hint: 'The process of increase or grow' },
    { word: 'country', hint: 'A politically identified region' },
    { word: 'group', hint: 'A number of objects or persons' },
    { word: 'taste', hint: 'Ability of tongue to detect flavour' },
    { word: 'store', hint: 'Large shop where goods are traded' },
    { word: 'field', hint: 'Area of land for farming activities' },
    { word: 'friend', hint: 'Person other than a family member' },
    { word: 'pocket', hint: 'A bag for carrying small items' },
    { word: 'needle', hint: 'A thin and sharp metal pin' },
    { word: 'expert', hint: 'Person with extensive knowledge' },
    { word: 'statement', hint: 'A declaration of something' },
    { word: 'second', hint: 'One-sixtieth of a minute' },
    { word: 'library', hint: 'Place containing collection of books' },
  ];

  useEffect(() => {
    if (userId) {
      startGameSession();
    }
  }, [userId]);

  const startGameSession = async () => {
    try {
      console.log('Starting word-formation session at:', `${actualApiUrl}/word-formation/start-session`);
      const response = await fetch(`${actualApiUrl}/word-formation/start-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await response.json();
      if (data.success) {
        setSessionId(data.sessionId);
        console.log('Word Formation session started:', data.sessionId);
      }
    } catch (error) {
      console.error('Error starting game session:', error);
    }
  };

  const initTimer = (maxTime) => {
    clearInterval(timerRef.current);
    setTimer(maxTime);
    setStartTime(Date.now());
    
    timerRef.current = setInterval(() => {
      maxTime--;
      setTimer(maxTime);
      if (maxTime <= 0) {
        clearInterval(timerRef.current);
        playTimeout();
        handleTimeout();
      }
    }, 1000);
  };

  const handleTimeout = async () => {
    alert(`⏰ Time's up! The correct word was: ${correctWord.toUpperCase()}`);
    await saveAttemptToBackend(false, true);
    initGame();
  };

  const saveAttemptToBackend = async (isCorrect, isTimeout = false) => {
    if (!sessionId || !correctWord) return;

    const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

    try {
      await fetch(`${actualApiUrl}/word-formation/save-attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId,
          word: correctWord,
          scrambledWord: wordText,
          hint: hintText,
          userAnswer: userInput || '(timeout)',
          isCorrect,
          isTimeout,
          timeSpent,
          level,
          timestamp: new Date()
        })
      });

      setTotalAttempts(prev => prev + 1);
      if (isCorrect) {
        setCorrectAttempts(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error saving attempt:', error);
    }
  };

  const initGame = () => {
    const randomObj = words[Math.floor(Math.random() * words.length)];
    const wordArray = randomObj.word.split('');
    
    for (let i = wordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }
    
    setWordText(wordArray.join(''));
    setHintText(randomObj.hint);
    setCorrectWord(randomObj.word.toLowerCase());
    setUserInput('');
    initTimer(30);
  };

  const checkWord = async () => {
    const userWord = userInput.toLowerCase().trim();
    
    if (!userWord) {
      alert('Please enter the word to check!');
      return;
    }
    
    clearInterval(timerRef.current);
    
    if (userWord !== correctWord) {
      playWrong();
      alert(`❌ ${userWord} is not correct. Try again!`);
      await saveAttemptToBackend(false);
      initGame();
      return;
    }

    playCorrect();
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
    
    alert(`🎉 Correct! ${correctWord.toUpperCase()} is the word!`);
    
    setScore(prev => prev + 1);
    setLevel(prev => prev + 1);
    
    await saveAttemptToBackend(true);
    initGame();
  };

  const resetGame = async () => {
    if (sessionId) {
      await endGameSession();
    }
    
    setScore(0);
    setLevel(1);
    setTotalAttempts(0);
    setCorrectAttempts(0);
    clearInterval(timerRef.current);
    
    if (userId) {
      await startGameSession();
    }
    
    initGame();
  };

  const endGameSession = async () => {
    if (!sessionId) return;

    try {
      console.log('Ending word-formation session:', sessionId);
      await fetch(`${actualApiUrl}/word-formation/end-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId,
          finalScore: score,
          finalLevel: level,
          totalAttempts,
          correctAttempts,
          accuracy: totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0
        })
      });
      console.log('Word Formation session ended successfully');
    } catch (error) {
      console.error('Error ending game session:', error);
    }
  };

  useEffect(() => {
    initGame();

    return () => {
      clearInterval(timerRef.current);
      if (sessionId) {
        endGameSession();
      }
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h2 className={styles.title}>Word Formation Game</h2>
        
        <div className={styles.statsBar}>
          <span>Score: {score}</span>
          <span>Level: {level}</span>
          <span>Accuracy: {totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0}%</span>
        </div>

        <div className={styles.content}>
          <p className={styles.word}>{wordText}</p>
          
          <div className={styles.details}>
            <p className={styles.hint}>
              Hint: <span>{hintText}</span>
            </p>
            <p className={styles.time}>
              Time Left: <span><b>{timer}</b>s</span>
            </p>
          </div>

          <input
            type="text"
            spellCheck="false"
            placeholder="Enter a valid word"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && checkWord()}
            maxLength={correctWord.length}
            className={styles.input}
          />

          <div className={styles.buttons}>
            <button className={styles.refreshWord} onClick={initGame}>
              🔄 Refresh Word
            </button>
            <button className={styles.checkWord} onClick={checkWord}>
              ✅ Check Word
            </button>
          </div>
          
          <button className={styles.resetGame} onClick={resetGame}>
            🔁 Reset Game
          </button>
        </div>
      </div>
    </div>
  );
}