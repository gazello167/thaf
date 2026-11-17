export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function dataURLtoBlob(dataURL) {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function playSound(soundName) {
  if (typeof window === 'undefined') return;
  try {
    const audio = new Audio(`/sounds/${soundName}.mp3`);
    audio.volume = 0.3;
    audio.play().catch(() => {});
  } catch (error) {
    console.warn('Sound play failed:', error);
  }
}

export function formatPhoneNumber(phone) {
  // Convert +62 atau 08 ke format internasional
  if (!phone) return '';
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return '+' + cleaned;
}
