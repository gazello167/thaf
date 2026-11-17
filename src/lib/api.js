const API_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

export async function analyzeSubject(photoBase64) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode: 'analyze',
        photo_base64: photoBase64,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.message || 'Analysis failed');
    }

    return data;
  } catch (error) {
    console.error('Analyze error:', error);
    throw error;
  }
}

export async function generateTryOn(photoBase64, kainId, modelId, customerPhone = null) {
  try {
    const startTime = Date.now();
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode: 'generate',
        photo_base64: photoBase64,
        kain_id: kainId,
        model_id: modelId,
        customer_phone: customerPhone,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.message || 'Generation failed');
    }

    const generationTime = Date.now() - startTime;
    
    // Simpan ke history via API internal
    try {
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kain_id: kainId,
          model_id: modelId,
          result_url: data.result_url,
          short_url: data.short_url,
          customer_phone: customerPhone,
          generation_time_ms: generationTime,
        }),
      });
    } catch (historyError) {
      console.warn('Failed to save history:', historyError);
    }
    
    return {
      ...data,
      generation_time_ms: generationTime,
    };
  } catch (error) {
    console.error('Generate error:', error);
    throw error;
  }
}

export async function fetchKainList(kategori = null) {
  try {
    const url = new URL('/api/kain', window.location.origin);
    if (kategori) url.searchParams.set('kategori', kategori);
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch kain');
    
    const data = await response.json();
    
    // Cache di localStorage untuk offline-first
    localStorage.setItem('kain_cache', JSON.stringify(data));
    localStorage.setItem('kain_cache_time', Date.now().toString());
    
    return data;
  } catch (error) {
    console.error('Fetch kain error:', error);
    
    // Fallback ke cache
    const cached = localStorage.getItem('kain_cache');
    return cached ? JSON.parse(cached) : [];
  }
}

export async function fetchModelList(kategori = null, gender = null) {
  try {
    const url = new URL('/api/model', window.location.origin);
    if (kategori) url.searchParams.set('kategori', kategori);
    if (gender) url.searchParams.set('gender', gender);
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch model');
    
    const data = await response.json();
    
    // Cache di localStorage
    localStorage.setItem('model_cache', JSON.stringify(data));
    localStorage.setItem('model_cache_time', Date.now().toString());
    
    return data;
  } catch (error) {
    console.error('Fetch model error:', error);
    
    // Fallback ke cache
    const cached = localStorage.getItem('model_cache');
    return cached ? JSON.parse(cached) : [];
  }
}
