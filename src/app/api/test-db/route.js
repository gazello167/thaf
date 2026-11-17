import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT 1 + 1 AS test');
    return NextResponse.json({
      status: 'OK',
      test: result[0].test,
      message: 'Database connection successful!'
    });
  } catch (error) {
    return NextResponse.json({
      status: 'ERROR',
      error: error.message,
      hint: 'Check DB credentials in environment variables'
    }, { status: 500 });
  }
}
