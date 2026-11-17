'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';

export default function UploadGarment({ onGenerate, onBack }) {
  const [mode, setMode] = useState('upload');
  const [garmentPhoto, setGarmentPhoto] = useState(null);
  const [category, setCategory] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const webcamRef = useRef(null);

  const categories = [
    { value: 'atasan', label: 'Atasan / Jaket / Sweater', crop: 'half_body', cropHeightPercentage: 50, icon: '👚', desc: 'Hanya setengah badan (dada ke atas)' },
    { value: 'tunik', label: 'Tunik', crop: 'three_quarter', cropHeightPercentage: 75, icon: '👗', desc: 'Lebih panjang (lutut ke atas)' },
    { value: 'dress', label: 'Dress / Gamis', crop: 'full_body', cropHeightPercentage: 100, icon: '👘', desc: 'Seluruh badan (hingga kaki)' },
    { value: 'setelan', label: 'Setelan', crop: 'full_body', cropHeightPercentage: 100, icon: '👔', desc: 'Atasan + Celana/Rok' }
  ];

  const videoConstraints = {
    width: 1080,
    height: 1920,
    facingMode: 'environment',
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setGarmentPhoto(e.target.result);
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
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setGarmentPhoto(imageSrc);
      setShowCamera(false);
    }
  };

  const handleRetake = () => {
    setGarmentPhoto(null);
  };

  const handleGenerate = () => {
    if (garmentPhoto && category) {
      const selectedCat = categories.find(c => c.value === category);
      onGenerate({ garmentPhoto, category: selectedCat });
    }
  };

  return (
    <div className="min-h-screen min-h-dvh overflow-y-auto bg-gradient-to-br from-purple-50 to-pink-50 py-6 px-4">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-5 sm:p-8 max-w-4xl w-full mx-auto"
      >
        <h2 className="text-xl sm:text-3xl font-bold text-purple-800 mb-4 sm:mb-6 text-center">
          Upload Foto Pakaian
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 mb-6 sm:mb-8">
          <div>
            {/* Mode Toggle */}
            <div className="flex gap-2 mb-3 bg-purple-100 p-1.5 rounded-xl">
              <button
                onClick={() => setMode('upload')}
                className={`flex-1 py-2 rounded-lg font-semibold transition-all text-xs sm:text-sm ${
                  mode === 'upload' ? 'bg-white text-purple-800 shadow-md' : 'text-purple-600'
                }`}
              >
                📤 Upload
              </button>
              <button
                onClick={handleOpenCamera}
                className={`flex-1 py-2 rounded-lg font-semibold transition-all text-xs sm:text-sm ${
                  mode === 'camera' ? 'bg-white text-purple-800 shadow-md' : 'text-purple-600'
                }`}
              >
                📷 Kamera
              </button>
            </div>

            <label
              htmlFor="garment-upload"
              className={`block w-full h-56 sm:h-96 border-4 border-dashed border-purple-300 rounded-2xl relative overflow-hidden group ${
                mode === 'upload' ? 'cursor-pointer hover:border-purple-500' : ''
              }`}
            >
              {garmentPhoto ? (
                <div className="relative w-full h-full">
                  <img src={garmentPhoto} alt="Garment" className="w-full h-full object-contain bg-gray-50" />
                  <button
                    onClick={(e) => { e.preventDefault(); handleRetake(); }}
                    className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold hover:bg-red-600 transition"
                  >
                    🔄 Ganti
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-purple-400 group-hover:text-purple-600 px-4">
                  <svg className="w-14 h-14 sm:w-20 sm:h-20 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-base sm:text-xl font-semibold text-center">
                    {mode === 'upload' ? 'Upload Foto Pakaian' : 'Klik tombol Kamera di atas'}
                  </p>
                  <p className="text-xs sm:text-sm mt-2 text-center">Background putih/polos</p>
                </div>
              )}
              {mode === 'upload' && (
                <input
                  id="garment-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              )}
            </label>
          </div>

          {/* Category selection */}
          <div>
            <h3 className="font-semibold text-purple-800 mb-3 sm:mb-4 text-base sm:text-lg">
              Pilih Kategori Pakaian:
            </h3>
            <div className="space-y-2.5 sm:space-y-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all text-left flex items-start gap-3 sm:gap-4 ${
                    category === cat.value ? 'border-purple-600 bg-purple-50 shadow-lg' : 'border-purple-200 active:border-purple-400'
                  }`}
                >
                  <div className="text-2xl sm:text-4xl">{cat.icon}</div>
                  <div className="flex-1">
                    <div className="font-bold text-purple-800 mb-0.5 sm:mb-1 text-sm sm:text-base">{cat.label}</div>
                    <div className="text-xs sm:text-sm text-purple-600">{cat.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-3 sm:p-4 mb-5 sm:mb-6">
          <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">ℹ️ Tips Foto Pakaian:</h3>
          <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
            <li>✓ Foto hanya pakaian (tidak dipakai)</li>
            <li>✓ Background putih atau polos</li>
            <li>✓ Pencahayaan merata tanpa bayangan</li>
            <li>✓ Pakaian terlihat jelas dan tidak terlipat</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-200 text-gray-800 font-bold py-3.5 sm:py-4 rounded-xl active:bg-gray-300 transition-all text-sm sm:text-base order-2 sm:order-1"
          >
            Kembali
          </button>
          <button
            onClick={handleGenerate}
            disabled={!garmentPhoto || !category}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3.5 sm:py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform text-sm sm:text-base order-1 sm:order-2"
          >
            Generate Virtual Try-On
          </button>
        </div>
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

            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-x-8 inset-y-16 border-2 border-white/50 rounded-2xl" />
            </div>

            <div className="absolute top-6 sm:top-8 left-0 right-0 text-center px-4">
              <div className="bg-black/50 backdrop-blur-sm text-white px-4 sm:px-8 py-2.5 sm:py-4 rounded-full inline-block">
                <p className="text-sm sm:text-2xl font-semibold">
                  Letakkan pakaian di tengah bingkai
                </p>
              </div>
            </div>

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
                disabled={!isCameraReady}
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
