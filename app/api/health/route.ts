import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Health check endpoint for monitoring backend status
export async function GET() {
  const startTime = Date.now();
  
  try {
    // Check Supabase connection
    const { error: supabaseError } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    const responseTime = Date.now() - startTime;
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      services: {
        api: {
          status: 'operational',
          responseTime: `${responseTime}ms`
        },
        database: {
          status: supabaseError ? 'degraded' : 'operational',
          message: supabaseError ? supabaseError.message : 'Connected'
        }
      },
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };

    // If database has issues, mark as degraded but still return 200
    if (supabaseError) {
      health.status = 'degraded';
    }

    return NextResponse.json(health, { status: 200 });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      error: error instanceof Error ? error.message : 'Unknown error',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    }, { status: 503 });
  }
}
