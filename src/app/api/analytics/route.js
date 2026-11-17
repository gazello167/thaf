import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7'; // days

    // Total statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_generations,
        COUNT(DISTINCT session_id) as unique_sessions,
        COUNT(CASE WHEN is_sent_whatsapp = 1 THEN 1 END) as whatsapp_sent,
        AVG(generation_time_ms) as avg_time_ms
      FROM try_on_history
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    `;

    const stats = await query(statsQuery, [period]);

    // Top kain
    const topKainQuery = `
      SELECT 
        k.kode,
        k.kategori,
        k.foto_url,
        COUNT(h.id) as usage_count
      FROM try_on_history h
      JOIN kain_katalog k ON h.kain_id = k.id
      WHERE h.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY h.kain_id
      ORDER BY usage_count DESC
      LIMIT 5
    `;

    const topKain = await query(topKainQuery, [period]);

    // Top model
    const topModelQuery = `
      SELECT 
        m.nama,
        m.kategori,
        m.foto_referensi_url,
        COUNT(h.id) as usage_count
      FROM try_on_history h
      JOIN model_baju m ON h.model_id = m.id
      WHERE h.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY h.model_id
      ORDER BY usage_count DESC
      LIMIT 5
    `;

    const topModel = await query(topModelQuery, [period]);

    // Daily trend
    const trendQuery = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM try_on_history
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    const trend = await query(trendQuery, [period]);

    return NextResponse.json({
      stats: stats[0],
      top_kain: topKain,
      top_model: topModel,
      daily_trend: trend,
    });

  } catch (error) {
    console.error('API /analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics', message: error.message },
      { status: 500 }
    );
  }
}
