'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { fetchModelList } from '@/lib/api';

export default function ModelSelector({ 
  onSelect, 
  onBack, 
  selectedKain,
  aiRecommendations = [] 
}) {
  const [modelList, setModelList] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState('semua');
  const [selectedGender, setSelectedGender] = useState('semua');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function loadModel() {
    try {
      const data = await fetchModelList();
      setModelList(data);
    } catch (error) {
      console.error('Failed to load model:', error);
      setModelList([]);
    } finally {
      setLoading(false);
    }
  }
  loadModel();
}, []);

  const kategoriList = ['semua', 'formal', 'casual', 'muslim', 'traditional', 'modern'];
  const genderList = ['semua', 'female', 'male', 'unisex'];
  
  const filteredModel = modelList.filter(m => {
    const matchKategori = selectedKategori === 'semua' || m.kategori === selectedKategori;
    const matchGender = selectedGender === 'semua' || m.gender === selectedGender;
    return matchKategori && matchGender && m.is_active;
  });

  // Cari rekomendasi AI untuk model ini
  const getRecommendation = (modelId) => {
    return aiRecommendations.find(r => r.id === modelId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-2xl text-gray-600">Memuat model baju...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          Pilih Model Baju
        </h2>
        <div className="flex items-center gap-3 text-lg text-gray-600">
          <span>Kain terpilih:</span>
          <div className="flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-full">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={selectedKain.foto_url}
                alt={selectedKain.kode}
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            <span className="font-semibold text-primary-700">{selectedKain.kode}</span>
          </div>
        </div>
        {aiRecommendations.length > 0 && (
          <p className="text-lg text-gray-600 mt-2">
            💡 Model yang cocok untuk Anda berdasarkan analisa AI
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        {/* Kategori */}
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-2 block">
            Kategori:
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {kategoriList.map((kat) => (
              <button
                key={kat}
                onClick={() => setSelectedKategori(kat)}
                className={`px-5 py-2 rounded-full font-semibold capitalize whitespace-nowrap touch-feedback transition text-sm ${
                  selectedKategori === kat
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {kat}
              </button>
            ))}
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-2 block">
            Untuk:
          </label>
          <div className="flex gap-2">
            {genderList.map((gender) => (
              <button
                key={gender}
                onClick={() => setSelectedGender(gender)}
                className={`px-5 py-2 rounded-full font-semibold capitalize whitespace-nowrap touch-feedback transition text-sm ${
                  selectedGender === gender
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {gender === 'semua' ? 'Semua' : gender === 'female' ? 'Wanita' : gender === 'male' ? 'Pria' : 'Unisex'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Model Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 gap-6">
          {filteredModel.map((model) => {
            const recommendation = getRecommendation(model.id);
            
            return (
              <motion.div
                key={model.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(model)}
                className="relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer touch-feedback"
              >
                <div className="aspect-[3/4] relative bg-gray-100">
                  <Image
                    src={model.foto_referensi_url}
                    alt={model.nama}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 25vw"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 line-clamp-2 mb-1">
                    {model.nama}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="capitalize">{model.kategori}</span>
                    <span>•</span>
                    <span className="capitalize">
                      {model.gender === 'female' ? 'Wanita' : model.gender === 'male' ? 'Pria' : 'Unisex'}
                    </span>
                  </div>

                  {/* AI Recommendation reason */}
                  {recommendation && (
                    <div className="mt-2 text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                      ✓ {recommendation.reason}
                    </div>
                  )}
                </div>

                {/* Recommended badge */}
                {recommendation && (
                  <div className="absolute top-3 right-3 bg-green-400 text-green-900 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    ⭐ Cocok
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {filteredModel.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <p className="text-xl">Tidak ada model yang sesuai filter</p>
          </div>
        )}
      </div>

      {/* Back button */}
      <div className="mt-6">
        <button
          onClick={onBack}
          className="bg-gray-200 text-gray-800 px-8 py-4 rounded-full text-xl font-semibold hover:bg-gray-300 transition touch-feedback"
        >
          ← Pilih Kain Lain
        </button>
      </div>
    </div>
  );
}
