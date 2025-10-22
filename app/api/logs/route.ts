import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST: Create log entry for tasks or payments
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, entity_id, action, details, level = 'info' } = body;

    if (!type || !entity_id || !action) {
      return NextResponse.json({
        success: false,
        error: 'type, entity_id, and action are required'
      }, { status: 400 });
    }

    // Validate log type
    const validTypes = ['task', 'payment', 'clone', 'system'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({
        success: false,
        error: `Invalid log type. Must be one of: ${validTypes.join(', ')}`
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('activity_logs')
      .insert([{
        log_type: type,
        entity_id,
        action,
        details: details || {},
        level,
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: data?.[0],
      message: 'Log entry created successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET: Fetch logs with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const entityId = searchParams.get('entity_id');
    const level = searchParams.get('level');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (type) {
      query = query.eq('log_type', type);
    }
    if (entityId) {
      query = query.eq('entity_id', entityId);
    }
    if (level) {
      query = query.eq('level', level);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
      pagination: {
        limit,
        offset,
        hasMore: (data?.length || 0) === limit
      }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE: Clear old logs (admin function)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const daysOld = parseInt(searchParams.get('days_old') || '30');

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const { error } = await supabase
      .from('activity_logs')
      .delete()
      .lt('created_at', cutoffDate.toISOString());

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Logs older than ${daysOld} days deleted successfully`
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
