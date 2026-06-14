// pages/student/debug-stats.jsx
// DEBUG PAGE - Check if game stats are being saved and retrieved correctly
// FIXED: Uses correct Express backend URL

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import StudentLayout from '../../components/student/StudentLayout';

// CRITICAL: Default to Express backend URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function DebugStats() {
  const { user } = useAuth();
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState(null);

  const userId = user?._id || user?.id;

  // Ensure we use the correct API URL
  const actualApiUrl = API_BASE.startsWith('/api') 
    ? 'http://localhost:5000/api' 
    : API_BASE;

  const runTests = async () => {
    if (!userId) {
      alert('No user ID found! Please login first.');
      return;
    }

    setLoading(true);
    const testResults = {};

    console.log('=== DEBUG: Testing with userId:', userId, '===');
    console.log('=== Using API URL:', actualApiUrl, '===');

    // Test 1: MathQuest Analytics
    try {
      console.log('Testing MathQuest...');
      const url = `${actualApiUrl}/mathquest/analytics/${userId}?days=30`;
      console.log('URL:', url);
      
      const res = await fetch(url);
      const data = await res.json();
      
      testResults.mathquest = {
        status: res.status,
        success: data.success,
        hasData: data.data?.hasData,
        data: data,
        error: data.error || null
      };
      console.log('MathQuest result:', data);
    } catch (err) {
      testResults.mathquest = { error: err.message };
      console.error('MathQuest error:', err);
    }

    // Test 2: Phoneme Game Performance
    try {
      console.log('Testing Phoneme Game...');
      const url = `${actualApiUrl}/phoneme-game/performance?userId=${userId}&timeRange=all`;
      console.log('URL:', url);
      
      const res = await fetch(url);
      const data = await res.json();
      
      testResults.phoneme = {
        status: res.status,
        success: data.success,
        hasStats: !!data.stats,
        data: data,
        error: data.error || null
      };
      console.log('Phoneme result:', data);
    } catch (err) {
      testResults.phoneme = { error: err.message };
      console.error('Phoneme error:', err);
    }

    // Test 3: Word Formation Performance
    try {
      console.log('Testing Word Formation...');
      const url = `${actualApiUrl}/word-formation/performance?userId=${userId}&timeRange=all`;
      console.log('URL:', url);
      
      const res = await fetch(url);
      const data = await res.json();
      
      testResults.wordFormation = {
        status: res.status,
        success: data.success,
        hasStats: !!data.stats,
        data: data,
        error: data.error || null
      };
      console.log('Word Formation result:', data);
    } catch (err) {
      testResults.wordFormation = { error: err.message };
      console.error('Word Formation error:', err);
    }

    // Test 4: Letter Tracing Performance
    try {
      console.log('Testing Letter Tracing...');
      const url = `${actualApiUrl}/letter-tracing/performance?userId=${userId}&timeRange=all`;
      console.log('URL:', url);
      
      const res = await fetch(url);
      const data = await res.json();
      
      testResults.letterTracing = {
        status: res.status,
        success: data.success,
        hasStats: !!data.stats,
        data: data,
        error: data.error || null
      };
      console.log('Letter Tracing result:', data);
    } catch (err) {
      testResults.letterTracing = { error: err.message };
      console.error('Letter Tracing error:', err);
    }

    setResults(testResults);
    setLoading(false);
  };

  // Test saving a MathQuest session
  const testSaveSession = async () => {
    if (!userId) {
      alert('No user ID found!');
      return;
    }

    const testSession = {
      odId: userId,
      odName: user?.firstName || 'Test User',
      operation: 'addition',
      score: 50,
      totalQuestions: 5,
      correctAnswers: 4,
      wrongAnswers: 1,
      totalTime: 60,
      hintsUsed: 1,
      maxStreak: 3,
      questionDetails: [
        { question: '5+3', correctAnswer: 8, userAnswer: 8, isCorrect: true, timeTaken: 10 },
        { question: '10+6', correctAnswer: 16, userAnswer: 16, isCorrect: true, timeTaken: 12 },
      ],
      difficulty: 'medium'
    };

    try {
      console.log('Saving test session:', testSession);
      console.log('To URL:', `${actualApiUrl}/mathquest/session`);
      
      const res = await fetch(`${actualApiUrl}/mathquest/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testSession)
      });
      
      const data = await res.json();
      console.log('Save result:', data);
      setTestData(data);
      alert(data.success ? 'Session saved successfully!' : 'Failed to save: ' + data.message);
    } catch (err) {
      console.error('Save error:', err);
      alert('Error saving session: ' + err.message);
    }
  };

  return (
    <StudentLayout title="Debug Stats">
      <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '16px' }}>🔧 Debug Game Stats</h1>
        
        <div style={{ 
          padding: '16px', 
          background: '#fef3c7', 
          borderRadius: '8px', 
          marginBottom: '24px' 
        }}>
          <strong>User Info:</strong>
          <pre style={{ margin: '8px 0 0', fontSize: '12px' }}>
            {JSON.stringify({
              userId: userId,
              user_id: user?._id,
              user_id_alt: user?.id,
              firstName: user?.firstName,
              email: user?.email
            }, null, 2)}
          </pre>
        </div>

        <div style={{ 
          padding: '16px', 
          background: '#d1fae5', 
          borderRadius: '8px', 
          marginBottom: '24px',
          border: '2px solid #10b981'
        }}>
          <strong>✅ API Base URL (FIXED):</strong> {actualApiUrl}
          <br />
          <small style={{ color: '#065f46' }}>
            This should point to your Express backend at localhost:5000
          </small>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button 
            onClick={runTests}
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Testing...' : '🧪 Run API Tests'}
          </button>

          <button 
            onClick={testSaveSession}
            style={{
              padding: '12px 24px',
              background: '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            💾 Test Save MathQuest Session
          </button>
        </div>

        {Object.keys(results).length > 0 && (
          <div>
            <h2 style={{ marginBottom: '16px' }}>Test Results:</h2>
            
            {Object.entries(results).map(([game, result]) => (
              <div 
                key={game}
                style={{
                  padding: '16px',
                  background: result.error ? '#fee2e2' : result.success ? '#d1fae5' : '#fef3c7',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}
              >
                <h3 style={{ margin: '0 0 8px', textTransform: 'capitalize' }}>
                  {result.error ? '❌' : result.success ? '✅' : '⚠️'} {game.replace(/([A-Z])/g, ' $1')}
                </h3>
                
                <div style={{ fontSize: '14px' }}>
                  <p><strong>Status:</strong> {result.status || 'N/A'}</p>
                  <p><strong>Success:</strong> {result.success ? 'Yes' : 'No'}</p>
                  <p><strong>Has Data:</strong> {result.hasData || result.hasStats ? 'Yes' : 'No'}</p>
                  {result.error && <p><strong>Error:</strong> {result.error}</p>}
                </div>

                <details style={{ marginTop: '8px' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: '600' }}>
                    View Full Response
                  </summary>
                  <pre style={{ 
                    fontSize: '11px', 
                    background: 'white', 
                    padding: '12px', 
                    borderRadius: '4px',
                    overflow: 'auto',
                    maxHeight: '300px',
                    marginTop: '8px'
                  }}>
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        )}

        {testData && (
          <div style={{ 
            padding: '16px', 
            background: '#ecfdf5', 
            borderRadius: '8px', 
            marginTop: '24px' 
          }}>
            <h3>Test Save Result:</h3>
            <pre style={{ fontSize: '12px' }}>
              {JSON.stringify(testData, null, 2)}
            </pre>
          </div>
        )}

        <div style={{ 
          marginTop: '32px', 
          padding: '16px', 
          background: '#f3f4f6', 
          borderRadius: '8px' 
        }}>
          <h3 style={{ margin: '0 0 12px' }}>🔍 Common Issues:</h3>
          <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>404 Error:</strong> Backend route not registered. Check server.js/app.js has the routes.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>CORS Error:</strong> Backend needs CORS enabled for your frontend URL.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Empty Data:</strong> Game sessions not saving properly when game ends.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Wrong userId:</strong> userId format mismatch (string vs ObjectId).
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>API URL Wrong:</strong> Should be http://localhost:5000/api NOT /api
            </li>
          </ol>
        </div>
      </div>
    </StudentLayout>
  );
}