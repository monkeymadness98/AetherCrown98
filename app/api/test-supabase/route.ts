import { NextResponse } from 'next/server';
import { testSupabaseConnection } from '@/lib/supabase';

export async function GET() {
  try {
    const result = await testSupabaseConnection();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        timestamp: new Date().toISOString()
      }, { status: 200 });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
