'use client';

import { useState, useEffect, useCallback } from 'react';

export default function ResultDisplay({ resultData, onRestart }) {
  const IDLE_TIMEOUT = 60; // detik sebelum auto-restart
  const [countdown, setCountdown] = useState(IDLE_TIMEOUT);
  const [showWarning, setShowWarning] = useState(false);

  // Reset timer ke awal setiap ada interaksi user
  const resetTimer = useCallback(() => {
    setCountdown(IDLE_TIMEOUT);
    setShowWarning(false);
  }, [IDLE_TIMEOUT]);

  useEffect(() => {
    // Event yang dianggap "aktivitas user"
    const events = ['touchstart', 'touchmove', 'mousedown', 'mousemove', 'scroll', 'keydown'];
    
    events.forEach(event => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    const timer = setInterval(() => {
      setCountdown((prev) => {
        // Tampilkan warning 10 detik terakhir
        if (prev <= 10 && prev > 0) {
          setShowWarning(true);
        }

        if (prev <= 1) {
          onRestart();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [onRestart, resetTimer]);

  // =====================
  // Guard: no result data
  // =====================
  if (!resultData) {
    return (
      <div className="min-h-screen min-h-dvh flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 p-4">
        <div className="bg-white rounded-3xl p-8 text-center shadow-2xl">
          <h2 className="text-xl font-bold text-red-600 mb-4">Data tidak ditemukan</h2>
          <button
            onClick={onRestart}
            className="bg-purple-600 text-white px-6 py-3 rounded-full font-bold"
          >
            Mulai Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-dvh bg-gradient-to-br from-purple-500 to-pink-500 py-6 px-4 overflow-y-auto">
      <div className="max-w-md mx-auto pb-8">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            ✨ Try-On Berhasil!
          </h1>
          <p className="text-white/80 text-sm md:text-base">
            Generated in {resultData.generationTime}
          </p>
        </div>

        {/* Result Image */}
        <div className="bg-white rounded-3xl p-4 mb-4 shadow-2xl">
          <img
            src={resultData.imageUrl}
            alt="Virtual Try-On Result"
            className="w-full rounded-2xl object-cover"
            onError={(e) => {
              e.target.src = 'https://picsum.photos/400/600';
            }}
          />
        </div>

        {/* QR Code */}
        {resultData.qrCode && (
          <div className="bg-white rounded-3xl p-6 mb-4 shadow-2xl text-center">
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              📱 Scan untuk Simpan
            </h2>
            <div className="bg-gray-50 p-4 rounded-2xl inline-block">
              <img
                src={resultData.qrCode}
                alt="QR Code"
                className="w-48 h-48 mx-auto"
              />
            </div>
            <p className="text-gray-500 text-sm mt-3">
              Scan dengan HP untuk simpan hasil
            </p>
          </div>
        )}

        {/* Session Info */}
        <div className="bg-black/20 backdrop-blur rounded-2xl p-3 mb-6">
          <p className="text-white text-xs font-mono text-center break-all">
            {resultData.sessionId}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="w-full bg-white text-purple-600 py-4 rounded-2xl font-bold text-lg shadow-lg touch-feedback active:scale-95 transition-transform"
          >
            🔄 Coba Lagi
          </button>
          
          <button
            onClick={() => window.print()}
            className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg touch-feedback active:scale-95 transition-transform"
          >
            🖨️ Print / Download
          </button>
        </div>

        {/* Idle Warning Banner - hanya muncul 10 detik terakhir */}
        {showWarning && (
          <div className="fixed bottom-4 left-4 right-4 z-50 animate-pulse">
            <div className="bg-red-500 text-white rounded-2xl px-6 py-4 shadow-2xl text-center max-w-md mx-auto">
              <p className="font-bold text-lg">
                ⏰ Restart otomatis dalam <span className="text-2xl">{countdown}</span> detik
              </p>
              <p className="text-sm opacity-90 mt-1">
                Sentuh layar untuk melanjutkan
              </p>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-center text-white/60 text-xs mt-6 px-4">
          ⚠️ Hasil adalah simulasi AI. Warna dan tekstur aktual mungkin berbeda.
        </p>
      </div>
    </div>
  );
}
