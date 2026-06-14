// pages/student/test.jsx
// SIMPLE TEST PAGE - No complex components, no auth, no sidebar
// Use this to check if the issue is in the layout components

export default function TestPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f4f8',
      padding: '40px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#111827', marginBottom: '20px' }}>
        🧪 Test Page - No Layout
      </h1>
      <p style={{ color: '#4b5563', marginBottom: '20px' }}>
        If you can see this clearly without any blur or frozen screen, 
        the problem is in one of the layout components.
      </p>
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#4f46e5' }}>✅ This page works!</h2>
        <p>Click the buttons below to test interactivity:</p>
        <button 
          onClick={() => alert('Button 1 clicked!')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginRight: '10px',
            marginTop: '10px'
          }}
        >
          Click Me 1
        </button>
        <button 
          onClick={() => alert('Button 2 clicked!')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Click Me 2
        </button>
      </div>
      
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
        <h3>📋 Next Steps:</h3>
        <ol style={{ lineHeight: '1.8' }}>
          <li>If this page works → Problem is in StudentLayout or ProtectedStudentRoute</li>
          <li>If this page is ALSO frozen → Problem is in _app.js or global CSS</li>
          <li>Check browser console (F12) for errors</li>
        </ol>
      </div>
    </div>
  );
}