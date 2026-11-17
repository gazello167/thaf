import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// GET - Ambil history
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const phone = searchParams.get('phone');

    let sql = `
      SELECT 
        h.*,
        k.kode as kain_kode,
        m.nama as model_nama
      FROM try_on_history h
      LEFT JOIN kain_katalog k ON h.kain_id = k.id
      LEFT JOIN model_baju m ON h.model_id = m.id
      WHERE 1=1
    `;
    const params = [];

    if (phone) {
      sql += ' AND h.customer_phone = ?';
      params.push(phone);
    }

    sql += ' ORDER BY h.created_at DESC LIMIT ?';
    params.push(limit);

    const history = await query(sql, params);

    // Parse JSON fields
    const parsed = history.map(h => ({
      ...h,
      ai_analysis: h.ai_analysis ? JSON.parse(h.ai_analysis) : null,
      is_sent_whatsapp: Boolean(h.is_sent_whatsapp),
    }));

    return NextResponse.json(parsed);

  } catch (error) {
    console.error('API /history GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history', message: error.message },
      { status: 500 }
    );
  }
}

// POST - Simpan history baru
export async function POST(request) {
  try {
    const body = await request.json();
    
    const {
      session_id,
      kain_id,
      model_id,
      result_url,
      short_url,
      customer_phone,
      photo_base64,
      ai_analysis,
      generation_time_ms,
    } = body;

    // Validasi
    if (!kain_id || !model_id) {
      return NextResponse.json(
        { error: 'Missing kain_id or model_id' },
        { status: 400 }
      );
    }

    // Generate photo hash untuk deteksi duplikasi
    let photo_hash = null;
    if (photo_base64) {
      photo_hash = crypto
        .createHash('sha256')
        .update(photo_base64)
        .digest('hex');
    }

    // Expires 24 jam dari sekarang
    const expires_at = new Date();
    expires_at.setHours(expires_at.getHours() + 24);

    const sql = `
      INSERT INTO try_on_history (
        session_id, kain_id, model_id, result_url, short_url,
        customer_phone, photo_hash, ai_analysis, generation_time_ms, expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      session_id || null,
      kain_id,
      model_id,
      result_url || null,
      short_url || null,
      customer_phone || null,
      photo_hash,
      ai_analysis ? JSON.stringify(ai_analysis) : null,
      generation_time_ms || null,
      expires_at,
    ]);

    return NextResponse.json({ 
      success: true, 
      id: result.insertId,
      expires_at,
    }, { status: 201 });

  } catch (error) {
    console.error('API /history POST error:', error);
    return NextResponse.json(
      { error: 'Failed to save history', message: error.message },
      { status: 500 }
    );
  }
}
