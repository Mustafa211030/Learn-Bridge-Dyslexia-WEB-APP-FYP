// pages/psychologist/index.jsx
// Redirects to psychologist dashboard

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function PsychologistIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/psychologist/dashboard');
  }, [router]);

  return (
    <>
      <Head>
        <title>Psychologist Portal - LearnBridge</title>
      </Head>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTopColor: 'white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ fontSize: '16px', fontWeight: 500 }}>
            Redirecting to dashboard...
          </p>
          <style jsx>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    </>
  );
}
