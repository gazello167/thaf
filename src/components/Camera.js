'use client';

import { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '@/lib/utils';

export default function Camera({ onCapture, onBack }) {
  const webcamRef = useRef(null);
  const [countdown, setCountdown] = useState(null);
  const [flash, setFlash] = useState(false);

  const videoConstraints = {
    width: 1080,
    height: 1920,
    facingMode: 'user',
  };

  const handleCapture = useCallback(() => {
    setCountdown(3);
    
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          
          // Flash effect
          setFlash(true);
          playSound('camera-shutter');
          
          setTimeout(() => {
            const imageSrc = webcamRef.current?.getScreenshot();
            if (imageSrc) {
              const base64 = imageSrc.split(',')[1];
              onCapture(base64);
            }
            setFlash(false);
          }, 100);
          
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, [onCapture]);

  return (
    <div className="relative w-full h-full bg-black">
      {/* Webcam */}
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="w-full h-full object-cover"
        mirrored
      />

      {/* Camera overlay guide */}
      <div className="camera-overlay" />

      {/* Flash effect */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white"
          />
        )}
      </AnimatePresence>

      {/* Countdown */}
      <AnimatePresence>
        {countdown && (
          <motion.div
            key={countdown}
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-white text-[200px] font-bold drop-shadow-2xl">
              {countdown}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="absolute top-8 left-0 right-0 text-center">
        <div className="bg-black/50 backdrop-blur-sm text-white px-8 py-4 rounded-full inline-block">
          <p className="text-2xl font-semibold">
            Posisikan wajah dan tubuh Anda di dalam bingkai
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-8">
        <button
          onClick={onBack}
          className="bg-gray-800/80 backdrop-blur-sm text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-gray-700 transition touch-feedback"
        >
          ← Kembali
        </button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCapture}
          disabled={countdown !== null}
          className="bg-white text-gray-900 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl disabled:opacity-50 touch-feedback"
        >
          <div className="w-20 h-20 rounded-full border-4 border-gray-900" />
        </motion.button>

        <div className="w-32" /> {/* Spacer for symmetry */}
      </div>
    </div>
  );
}
