'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { fetchKainList } from '@/lib/api';

export default function KainSelector({ onSelect, onBack, recommendations = [] }) {
  const [kainList, setKainList] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState('semua');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function loadKain() {
    try {
      const data = await fetchKainList();
      setKainList(data);
    } catch (error) {
      console.error('Failed to load kain:', error);
    } finally {
      setLoading(false);
    }
  }
  loadKain();
}, []);

  const kategoriList = ['semua', 'batik', 'polos', 'motif', 'brokat', 'denim'];
  
  const filteredKain = selectedKategori === 'semua'
    ? kainList
    : kainList.filter(k => k.kategori === selectedKategori);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-2xl text-gray-600">Memuat katalog kain...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          Pilih Kain Favorit Anda
        </h2>
        {recommendations.length > 0 && (
          <p className="text-lg text-gray-600">
            💡 Rekomendasi untuk Anda berdasarkan analisa AI
          </p>
        )}
      </div>

      {/* Kategori Filter */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {kategoriList.map((kat) => (
          <button
            key={kat}
            onClick={() => setSelectedKategori(kat)}
            className={`px-6 py-3 rounded-full font-semibold capitalize whitespace-nowrap touch-feedback transition ${
              selectedKategori === kat
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {kat}
          </button>
        ))}
      </div>

      {/* Kain Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 gap-6">
          {filteredKain.map((kain) => (
            <motion.div
              key={kain.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(kain)}
              className="relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer touch-feedback"
            >
              <div className="aspect-square relative bg-gray-100">
                <Image
                  src={kain.foto_url}
                  alt={kain.kode}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 33vw, 25vw"
                />
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
                  {kain.kode}
                </h3>
                <p className="text-sm text-gray-600 capitalize">{kain.kategori}</p>
                <p className="text-lg font-semibold text-primary-600 mt-2">
                  Rp {kain.harga_per_meter?.toLocaleString('id-ID')}/m
                </p>
              </div>

              {/* Recommended badge */}
              {recommendations.includes(kain.id) && (
                <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                  ⭐ Cocok
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Back button */}
      <div className="mt-6">
        <button
          onClick={onBack}
          className="bg-gray-200 text-gray-800 px-8 py-4 rounded-full text-xl font-semibold hover:bg-gray-300 transition touch-feedback"
        >
          ← Foto Ulang
        </button>
      </div>
    </div>
  );
}
