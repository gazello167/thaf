'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const tips = [
  "Hasil terbaik dengan pencahayaan yang baik 💡",
  "AI kami sedang menganalisa ratusan detail kain 🧵",
  "Tekstur dan warna kain sedang disesuaikan 🎨",
  "Menciptakan simulasi yang sempurna untuk Anda ✨",
  "Hampir selesai! Sabar ya... ⏳",
  "Teknologi AI membuat proses ini lebih cepat 🚀",
  "Hasil simulasi bukan foto asli, tapi sangat realistis 📸",
];

export default function LoadingAnimation({ progress = 0, stage = 'processing' }) {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getStageText = () => {
    switch (stage) {
      case 'uploading':
        return 'Mengunggah foto...';
      case 'analyzing':
        return 'Menganalisa subjek...';
      case 'processing':
        return 'Memproses gambar...';
      case 'generating':
        return 'Membuat hasil virtual try-on...';
      case 'finalizing':
        return 'Finishing touches...';
      default:
        return 'Sedang memproses...';
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex flex-col items-center justify-center p-8 z-50">
      {/* Animated shirt icon */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mb-8"
      >
        <svg
          className="w-32 h-32 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M16 21v-2l1.2-7H7l1.2 7v2H4l4-8H2l4-4 4-4 2 2 2-2 4 4 4 4h-6l4 8h-4z" />
        </svg>
      </motion.div>

      {/* Stage text */}
      <motion.h2
        key={stage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-white mb-6"
      >
        {getStageText()}
      </motion.h2>

      {/* Progress bar */}
      <div className="w-full max-w-md mb-8">
        <div className="bg-white/30 rounded-full h-4 overflow-hidden backdrop-blur-sm">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-white rounded-full"
          />
        </div>
        <p className="text-white text-center mt-2 text-lg font-semibold">
          {progress}%
        </p>
      </div>

      {/* Rotating tips */}
      <motion.div
        key={currentTip}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-white/20 backdrop-blur-md rounded-2xl px-8 py-4 max-w-2xl"
      >
        <p className="text-white text-xl text-center">
          {tips[currentTip]}
        </p>
      </motion.div>

      {/* Spinning loader */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mt-8"
      >
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full" />
      </motion.div>

      {/* Disclaimer */}
      <p className="text-white/80 text-sm text-center mt-8 max-w-lg">
        Proses ini dapat memakan waktu 15-30 detik tergantung koneksi internet
      </p>
    </div>
  );
}
