// pages/test-simple.jsx
// ABSOLUTE MINIMAL TEST - Zero dependencies

export default function TestSimple() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f4f8',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ 
        color: '#111827', 
        marginBottom: '20px',
        fontSize: '32px'
      }}>
        🧪 MINIMAL TEST
      </h1>
      
      <p style={{ color: '#4b5563', marginBottom: '30px', textAlign: 'center' }}>
        If you see this and can click the button, your base setup works!
      </p>
      
      <button 
        onClick={() => alert('✅ JavaScript works! Click detected!')}
        style={{
          padding: '16px 32px',
          backgroundColor: '#4f46e5',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '18px',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        CLICK ME TO TEST
      </button>
      
      <div style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '12px',
        maxWidth: '500px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ color: '#111827', marginBottom: '10px' }}>Results:</h3>
        <ul style={{ color: '#4b5563', lineHeight: '2' }}>
          <li>✅ If page loads = HTML works</li>
          <li>✅ If styled = CSS works</li>
          <li>✅ If button clicks = JavaScript works</li>
          <li>❌ If frozen = Problem is in globals.css or _app.js</li>
        </ul>
      </div>
    </div>
  );
}