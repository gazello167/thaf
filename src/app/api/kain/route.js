import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const kategori = searchParams.get('kategori');
    const id = searchParams.get('id');

    let sql = `
      SELECT 
        id,
        kode,
        kategori,
        warna_dominan,
        foto_url,
        texture_prompt,
        lebar_cm,
        harga_per_meter,
        stok_meter,
        is_active,
        created_at
      FROM kain_katalog
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

    sql += ' ORDER BY kode ASC';

    const kainList = await query(sql, params);

    // Parse JSON fields jika ada
    const parsed = kainList.map(kain => ({
      ...kain,
      is_active: Boolean(kain.is_active),
    }));

    return NextResponse.json(parsed, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });

  } catch (error) {
    console.error('API /kain error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch kain data', message: error.message },
      { status: 500 }
    );
  }
}

// POST untuk menambah kain baru (opsional, untuk admin)
export async function POST(request) {
  try {
    const body = await request.json();
    
    const {
      id,
      kode,
      kategori,
      warna_dominan,
      foto_url,
      texture_prompt,
      lebar_cm,
      harga_per_meter,
      stok_meter,
    } = body;

    // Validasi
    if (!id || !kode || !kategori || !foto_url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO kain_katalog (
        id, kode, kategori, warna_dominan, foto_url, 
        texture_prompt, lebar_cm, harga_per_meter, stok_meter
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      id,
      kode,
      kategori,
      warna_dominan,
      foto_url,
      texture_prompt,
      lebar_cm || 150,
      harga_per_meter || 0,
      stok_meter || 0,
    ]);

    return NextResponse.json({ success: true, id }, { status: 201 });

  } catch (error) {
    console.error('API /kain POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create kain', message: error.message },
      { status: 500 }
    );
  }
}
