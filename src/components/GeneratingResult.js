'use client';

import { useState, useEffect } from 'react';

export default function GeneratingResult() {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Memproses foto...');

  useEffect(() => {
    const messages = [
      'Menganalisis bentuk badan...',
      'Mempersiapkan kain...',
      'Menghitung proporsi...',
      'Menempelkan pakaian...',
      'Menyesuaikan warna...',
      'Menyempurnakan detail...',
      'Hampir selesai...'
    ];

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 10;
      });
    }, 500);

    const messageTimer = setInterval(() => {
      setMessage((prev) => {
        const currentIndex = messages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 2000);

    return () => {
      clearInterval(progressTimer);
      clearInterval(messageTimer);
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #7c3aed, #ec4899)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      fontFamily: 'system-ui, sans-serif',
      color: 'white'
    }}>
      {/* Spinner */}
      <div style={{
        width: '100px',
        height: '100px',
        border: '8px solid rgba(255,255,255,0.3)',
        borderTop: '8px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '40px'
      }} />

      {/* Progress Bar */}
      <div style={{
        width: '300px',
        height: '8px',
        background: 'rgba(255,255,255,0.3)',
        borderRadius: '999px',
        overflow: 'hidden',
        marginBottom: '20px'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'white',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Message */}
      <p style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        {message}
      </p>

      {/* Tips */}
      <p style={{
        marginTop: '40px',
        fontSize: '0.9rem',
        opacity: 0.8,
        textAlign: 'center'
      }}>
        Proses ini memakan waktu 20-60 detik...
      </p>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
