import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'generate',
        session_id: 'test_connection',
        subject_photo_url: 'https://picsum.photos/400/600',
        garment_photo_url: 'https://picsum.photos/400/600',
        subject_details: {
          tinggi: 170,
          berat: 60,
          bmi: 20.8,
          body_type: 'average',
          age_range: 'adult'
        },
        garment_category: {
          value: 'atasan',
          label: 'Atasan',
          crop_area: 'half_body',
          crop_height_percentage: 50
        }
      }),
    });

    const result = await response.json();
    
    return NextResponse.json({
      status: response.ok ? 'SUCCESS' : 'ERROR',
      httpStatus: response.status,
      n8nResponse: result
    });

  } catch (error) {
    return NextResponse.json({
      status: 'ERROR',
      error: error.message
    }, { status: 500 });
  }
}
