import { useState, useEffect } from 'react';
import Head from 'next/head';

const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    // Set a minimum display time of 3 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleVideoEnd = () => {
    // If video ends before 3 seconds, still wait for timer
    setShouldShow(false);
  };

  if (!shouldShow || !loading) return null;

  return (
    <>
      <Head>
        <title>Loading...</title>
      </Head>
      <div className="loading-container">
        <video 
          autoPlay 
          muted 
          playsInline
          className="loading-video"
          onEnded={handleVideoEnd}
        >
          <source src="/loading/loading.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <style jsx global>{`
        html, body {
          overflow: hidden;
        }
      `}</style>
      <style jsx>{`
        .loading-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: #000;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        
        .loading-video {
          max-width: 90%;
          max-height: 90%;
          object-fit: contain;
        }

        @media (orientation: portrait) {
          .loading-video {
            width: 90%;
            height: auto;
          }
        }

        @media (orientation: landscape) {
          .loading-video {
            width: auto;
            height: 90%;
          }
        }
      `}</style>
    </>
  );
};

export default LoadingScreen;