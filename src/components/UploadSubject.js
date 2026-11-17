'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';

export default function UploadSubject({ onNext }) {
  const [mode, setMode] = useState('upload');
  const [preview, setPreview] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [flash, setFlash] = useState(false);
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 1080,
    height: 1920,
    facingMode: 'environment', // kamera belakang untuk full body
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleOpenCamera = () => {
    setMode('camera');
    setShowCamera(true);
    setIsCameraReady(false);
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
    setCountdown(null);
  };

  const handleCapture = useCallback(() => {
    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setFlash(true);

          setTimeout(() => {
            const imageSrc = webcamRef.current?.getScreenshot();
            if (imageSrc) {
              setPreview(imageSrc);
            }
            setFlash(false);
            setShowCamera(false);
          }, 150);

          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleRetake = () => {
    setPreview(null);
  };

  const handleNext = () => {
    if (preview) {
      onNext({ subjectPhoto: preview });
    }
  };

  return (
    <div className="min-h-screen min-h-dvh overflow-y-auto bg-gradient-to-br from-purple-50 to-pink-50 py-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-5 sm:p-8 max-w-lg w-full mx-auto"
      >
        <h2 className="text-xl sm:text-3xl font-bold text-purple-800 mb-4 sm:mb-6 text-center">
          Upload Foto Anda
        </h2>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-4 sm:mb-6 bg-purple-100 p-1.5 rounded-xl">
          <button
            onClick={() => setMode('upload')}
            className={`flex-1 py-2.5 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
              mode === 'upload'
                ? 'bg-white text-purple-800 shadow-md'
                : 'text-purple-600 hover:text-purple-800'
            }`}
          >
            📤 Upload
          </button>
          <button
            onClick={handleOpenCamera}
            className={`flex-1 py-2.5 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
              mode === 'camera'
                ? 'bg-white text-purple-800 shadow-md'
                : 'text-purple-600 hover:text-purple-800'
            }`}
          >
            📷 Kamera
          </button>
        </div>

        {/* Preview / Upload area */}
        <div className="mb-4 sm:mb-6">
          <label
            htmlFor="subject-upload"
            className={`block w-full h-64 sm:h-96 border-4 border-dashed border-purple-300 rounded-2xl relative overflow-hidden group ${
              mode === 'upload' ? 'cursor-pointer hover:border-purple-500' : ''
            }`}
          >
            {preview ? (
              <div className="relative w-full h-full">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRetake();
                  }}
                  className="absolute top-3 right-3 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition"
                >
                  🔄 Ganti
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-purple-400 group-hover:text-purple-600 px-4">
                <svg className="w-14 h-14 sm:w-20 sm:h-20 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-base sm:text-xl font-semibold text-center">
                  {mode === 'upload' ? 'Klik untuk upload foto' : 'Klik tombol Kamera di atas'}
                </p>
                <p className="text-xs sm:text-sm mt-2 text-center">Format: JPG, PNG (Max 5MB)</p>
              </div>
            )}
            {mode === 'upload' && (
              <input
                id="subject-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            )}
          </label>
        </div>

        {/* Tips */}
        <div className="bg-purple-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
          <h3 className="font-semibold text-purple-800 mb-2 text-sm sm:text-base">💡 Tips Foto Terbaik:</h3>
          <ul className="text-xs sm:text-sm text-purple-700 space-y-1">
            <li>✓ Berdiri tegak menghadap kamera</li>
            <li>✓ Background polos (putih/abu-abu)</li>
            <li>✓ Pencahayaan terang dan merata</li>
            <li>✓ Pakai pakaian polos (tidak bermotif)</li>
            <li>✓ Foto seluruh badan terlihat jelas</li>
          </ul>
        </div>

        <button
          onClick={handleNext}
          disabled={!preview}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3.5 sm:py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform text-sm sm:text-base"
        >
          Lanjutkan
        </button>
      </motion.div>

      {/* FULLSCREEN CAMERA MODAL */}
      <AnimatePresence>
        {showCamera && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
          >
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full h-full object-cover"
              onUserMedia={() => setIsCameraReady(true)}
              onUserMediaError={() => {
                alert('Tidak dapat mengakses kamera');
                handleCloseCamera();
              }}
            />

            {/* Guide overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-x-8 inset-y-16 border-2 border-white/50 rounded-2xl" />
            </div>

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
                  <div className="text-white text-[120px] sm:text-[200px] font-bold drop-shadow-2xl">
                    {countdown}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Instructions */}
            <div className="absolute top-6 sm:top-8 left-0 right-0 text-center px-4">
              <div className="bg-black/50 backdrop-blur-sm text-white px-4 sm:px-8 py-2.5 sm:py-4 rounded-full inline-block">
                <p className="text-sm sm:text-2xl font-semibold">
                  Posisikan seluruh tubuh di dalam bingkai
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-8 sm:bottom-12 left-0 right-0 flex justify-center items-center gap-6 sm:gap-8">
              <button
                onClick={handleCloseCamera}
                className="bg-gray-800/80 backdrop-blur-sm text-white px-5 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-xl font-semibold hover:bg-gray-700 transition"
              >
                ← Batal
              </button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCapture}
                disabled={!isCameraReady || countdown !== null}
                className="bg-white text-gray-900 w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-2xl disabled:opacity-50"
              >
                <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full border-4 border-gray-900" />
              </motion.button>

              <div className="w-20 sm:w-32" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
