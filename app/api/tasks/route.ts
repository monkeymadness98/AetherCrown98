import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Fetch all tasks or filter by clone_id
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cloneId = searchParams.get('clone_id');

    let query = supabase
      .from('ai_tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (cloneId) {
      query = query.eq('clone_id', cloneId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST: Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clone_id, task_name, task_input, priority } = body;

    if (!clone_id || !task_name) {
      return NextResponse.json({
        success: false,
        error: 'clone_id and task_name are required'
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('ai_tasks')
      .insert([{
        clone_id,
        task_name,
        task_input: task_input || {},
        task_output: {},
        status: 'pending',
        priority: priority || 'medium',
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
      message: 'Task created successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT: Update task status and log output
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, task_output, error_message } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Task ID is required'
      }, { status: 400 });
    }

    const updateData: Record<string, string | Record<string, unknown>> = { 
      updated_at: new Date().toISOString() 
    };
    
    if (status) {
      updateData.status = status;
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }
    }
    if (task_output) updateData.task_output = task_output;
    if (error_message) updateData.error_message = error_message;

    const { data, error } = await supabase
      .from('ai_tasks')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Task not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      message: 'Task updated successfully'
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
