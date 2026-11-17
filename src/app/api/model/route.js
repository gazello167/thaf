import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const kategori = searchParams.get('kategori');
    const gender = searchParams.get('gender');
    const id = searchParams.get('id');

    let sql = `
      SELECT 
        id,
        nama,
        kategori,
        gender,
        foto_referensi_url,
        prompt_detail,
        cocok_untuk,
        body_type_rekomendasi,
        is_active,
        created_at
      FROM model_baju
      WHERE is_active = 1
    `;
    const params = [];

    // Filter by ID
    if (id) {
      sql += ' AND id = ?';
      params.push(id);
    }

    // Filter by kategori
    if (kategori && kategori !== 'semua') {
      sql += ' AND kategori = ?';
      params.push(kategori);
    }

    // Filter by gender
    if (gender && gender !== 'semua') {
      sql += ' AND (gender = ? OR gender = "unisex")';
      params.push(gender);
    }

    sql += ' ORDER BY nama ASC';

    const modelList = await query(sql, params);

    // Parse JSON fields
    const parsed = modelList.map(model => ({
      ...model,
      is_active: Boolean(model.is_active),
      cocok_untuk: model.cocok_untuk ? JSON.parse(model.cocok_untuk) : [],
      body_type_rekomendasi: model.body_type_rekomendasi 
        ? JSON.parse(model.body_type_rekomendasi) 
        : [],
    }));

    return NextResponse.json(parsed, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });

  } catch (error) {
    console.error('API /model error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch model data', message: error.message },
      { status: 500 }
    );
  }
}

// POST untuk menambah model baru (opsional, untuk admin)
export async function POST(request) {
  try {
    const body = await request.json();
    
    const {
      id,
      nama,
      kategori,
      gender,
      foto_referensi_url,
      prompt_detail,
      cocok_untuk,
      body_type_rekomendasi,
    } = body;

    // Validasi
    if (!id || !nama || !kategori || !foto_referensi_url || !prompt_detail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO model_baju (
        id, nama, kategori, gender, foto_referensi_url,
        prompt_detail, cocok_untuk, body_type_rekomendasi
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      id,
      nama,
      kategori,
      gender || 'female',
      foto_referensi_url,
      prompt_detail,
      JSON.stringify(cocok_untuk || []),
      JSON.stringify(body_type_rekomendasi || []),
    ]);

    return NextResponse.json({ success: true, id }, { status: 201 });

  } catch (error) {
    console.error('API /model POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create model', message: error.message },
      { status: 500 }
    );
  }
}
