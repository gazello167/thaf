'use client';

export default function IdleScreen({ onStart }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <h1 className="text-white text-6xl font-bold mb-4">
        Virtual Try-On
      </h1>
      
      <p className="text-white text-2xl mb-12 opacity-90">
        Lihat bagaimana Anda tampil dengan kain pilihan kami
      </p>

      <button
        onClick={onStart}
        className="bg-white text-indigo-600 px-16 py-6 rounded-full text-3xl font-bold shadow-2xl hover:scale-105 transition-transform"
      >
        Sentuh untuk Mulai
      </button>

      <p className="text-white mt-8 text-lg opacity-75">
        ✨ Gratis • Cepat • Pribadi
      </p>
    </div>
  );
}
