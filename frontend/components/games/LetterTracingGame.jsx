'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './LetterTracingGame.module.css';

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// FIXED: Default to Express backend URL
export default function LetterTracingGame({ userId, apiBaseUrl = 'http://localhost:5000/api' }) {
  const canvasRef = useRef(null);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [drawing, setDrawing] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isValid, setIsValid] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [startTime, setStartTime] = useState(null);

  // CRITICAL: Auto-correct /api to Express backend
  const actualApiUrl = apiBaseUrl === '/api' || apiBaseUrl.startsWith('/api') 
    ? 'http://localhost:5000/api' 
    : apiBaseUrl;

  const boundingBox = {
    x: 80,
    y: 60,
    width: 240,
    height: 250,
  };

  const getCurrentLetter = useCallback(() => letters[currentLetterIndex], [currentLetterIndex]);

  const getDynamicBoundingBox = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return boundingBox;
    
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 200px Comic Sans MS';

    const letter = getCurrentLetter();
    const letterWidth = ctx.measureText(letter).width;
    const letterHeight = 200;

    const letterX = boundingBox.x + (boundingBox.width - letterWidth) / 2;
    const letterY = boundingBox.y + (boundingBox.height + letterHeight) / 2;

    return {
      x: letterX - 10,
      y: letterY - letterHeight + 10,
      width: letterWidth + 20,
      height: letterHeight + 20,
    };
  }, [getCurrentLetter]);

  // FIXED: Move drawLetter before useEffect
  const drawLetter = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 200px Comic Sans MS';
    ctx.fillStyle = '#ddd';

    const letter = getCurrentLetter();
    const letterWidth = ctx.measureText(letter).width;
    const letterHeight = 200;

    const letterX = boundingBox.x + (boundingBox.width - letterWidth) / 2;
    const letterY = boundingBox.y + (boundingBox.height + letterHeight) / 2;

    ctx.fillText(letter, letterX, letterY);

    const box = getDynamicBoundingBox();
    ctx.strokeStyle = '#00f';
    ctx.lineWidth = 2;
    ctx.strokeRect(box.x, box.y, box.width, box.height);
  }, [getCurrentLetter, getDynamicBoundingBox]);

  // FIXED: Move startGameSession before useEffect
  const startGameSession = useCallback(async () => {
    try {
      console.log('Starting letter-tracing session at:', `${actualApiUrl}/letter-tracing/start-session`);
      const response = await fetch(`${actualApiUrl}/letter-tracing/start-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await response.json();
      if (data.success) {
        setSessionId(data.sessionId);
        console.log('Letter Tracing session started:', data.sessionId);
      }
    } catch (error) {
      console.error('Error starting game session:', error);
    }
  }, [actualApiUrl, userId]);

  const endGameSession = useCallback(async () => {
    if (!sessionId) return;

    try {
      console.log('Ending letter-tracing session:', sessionId);
      await fetch(`${actualApiUrl}/letter-tracing/end-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId,
          lettersCompleted: currentLetterIndex + 1,
          totalAttempts,
          correctAttempts,
          accuracy: totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0
        })
      });
      console.log('Letter Tracing session ended successfully');
    } catch (error) {
      console.error('Error ending game session:', error);
    }
  }, [sessionId, actualApiUrl, userId, currentLetterIndex, totalAttempts, correctAttempts]);

  // FIXED: Add dependencies to useEffect
  useEffect(() => {
    if (userId) {
      startGameSession();
    }
  }, [userId, startGameSession]);

  useEffect(() => {
    drawLetter();
    setStartTime(Date.now());
  }, [currentLetterIndex, drawLetter]);

  const validateTracing = useCallback(() => {
    if (drawing.length < 5) return false;

    const xs = drawing.map((p) => p.x);
    const ys = drawing.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const box = getDynamicBoundingBox();

    return (
      minX >= box.x &&
      maxX <= box.x + box.width &&
      minY >= box.y &&
      maxY <= box.y + box.height
    );
  }, [drawing, getDynamicBoundingBox]);

  const handlePointerDown = (e) => {
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDrawing([{ x, y }]);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#333';

    const lastPoint = drawing[drawing.length - 1];
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    setDrawing((prev) => [...prev, { x, y }]);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const playSound = (type) => {
    try {
      const sound = new Audio(`/sounds/${type}.mp3`);
      sound.play().catch(e => console.log('Sound play failed:', e));
    } catch (error) {
      console.log('Sound error:', error);
    }
  };

  const showConfetti = () => {
    const shapes = ['square', 'circle', 'triangle'];
    const colors = ['#FF0A54', '#FF477E', '#FF7096', '#FF85A1', '#FBB1BD', '#FFD700'];

    for (let i = 0; i < 80; i++) {
      const div = document.createElement('div');
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      div.className = styles.confettiPiece;
      div.style.left = `${Math.random() * 100}vw`;
      div.style.top = '-20px';
      div.style.position = 'fixed';
      div.style.zIndex = '999';

      if (shape === 'circle') {
        div.style.width = '10px';
        div.style.height = '10px';
        div.style.borderRadius = '50%';
        div.style.backgroundColor = color;
      } else if (shape === 'triangle') {
        div.style.width = '0';
        div.style.height = '0';
        div.style.borderLeft = '5px solid transparent';
        div.style.borderRight = '5px solid transparent';
        div.style.borderBottom = `10px solid ${color}`;
        div.style.background = 'none';
      } else {
        div.style.width = '10px';
        div.style.height = '10px';
        div.style.backgroundColor = color;
      }

      div.style.animation = 'fall 3s linear forwards';
      document.body.appendChild(div);
      setTimeout(() => div.remove(), 3000);
    }
  };

  const saveAttemptToBackend = async (isCorrect) => {
    if (!sessionId) return;

    const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

    try {
      await fetch(`${actualApiUrl}/letter-tracing/save-attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId,
          letter: getCurrentLetter(),
          letterIndex: currentLetterIndex,
          isCorrect,
          timeSpent,
          strokeCount: drawing.length,
          timestamp: new Date()
        })
      });
    } catch (error) {
      console.error('Error saving attempt:', error);
    }
  };

  const handleValidate = async () => {
    const valid = validateTracing();
    setTotalAttempts(prev => prev + 1);
    
    if (valid) {
      playSound('correct');
      showConfetti();
      setIsValid(true);
      setCorrectAttempts(prev => prev + 1);
      await saveAttemptToBackend(true);
    } else {
      playSound('error');
      alert('Please trace the letter more accurately!');
      setIsValid(false);
      await saveAttemptToBackend(false);
    }
  };

  const handleNext = () => {
    if (!isValid) {
      alert('Please validate the tracing first!');
      return;
    }

    if (currentLetterIndex === letters.length - 1) {
      setIsComplete(true);
      endGameSession();
    } else {
      setCurrentLetterIndex((i) => (i + 1) % letters.length);
    }

    setDrawing([]);
    setIsValid(null);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLetter();
  };

  const handleRestart = async () => {
    if (sessionId) {
      await endGameSession();
    }
    
    setCurrentLetterIndex(0);
    setIsComplete(false);
    setDrawing([]);
    setIsValid(null);
    setTotalAttempts(0);
    setCorrectAttempts(0);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLetter();
    
    if (userId) {
      startGameSession();
    }
  };

  return (
    <div className={styles.tracingContainer}>
      <h1 className={styles.title}>Trace the Letter: {getCurrentLetter()}</h1>
      
      <div className={styles.statsBar}>
        <span>Progress: {currentLetterIndex + 1}/26</span>
        <span>Accuracy: {totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0}%</span>
      </div>

      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className={styles.tracingCanvas}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
      
      <div className={styles.buttonContainer}>
        {!isComplete ? (
          <>
            <button className={styles.validateButton} onClick={handleValidate}>
              ✅ Validate
            </button>
            <button 
              className={styles.nextButton} 
              onClick={handleNext}
              disabled={!isValid}
            >
              ➡️ Next Letter
            </button>
          </>
        ) : (
          <div className={styles.celebrationMessage}>
            <h2>🎉 Congratulations! You&apos;ve completed the alphabet! 🎉</h2>
            <p>Total Accuracy: {totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0}%</p>
          </div>
        )}
        <button className={styles.restartButton} onClick={handleRestart}>
          🔄 Restart
        </button>
      </div>
    </div>
  );
}