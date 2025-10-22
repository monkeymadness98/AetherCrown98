import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Fetch all AI clones
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('ai_clones')
      .select('*')
      .order('created_at', { ascending: false });

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

// POST: Create a new AI clone
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, model_type, status } = body;

    if (!name || !model_type) {
      return NextResponse.json({
        success: false,
        error: 'Name and model_type are required'
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('ai_clones')
      .insert([{
        name,
        description,
        model_type,
        status: status || 'active',
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
      message: 'AI clone created successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT: Update an AI clone
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, model_type, status } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Clone ID is required'
      }, { status: 400 });
    }

    const updateData: Record<string, string> = { updated_at: new Date().toISOString() };
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (model_type) updateData.model_type = model_type;
    if (status) updateData.status = status;

    const { data, error } = await supabase
      .from('ai_clones')
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
        error: 'Clone not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      message: 'AI clone updated successfully'
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE: Delete an AI clone
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Clone ID is required'
      }, { status: 400 });
    }

    const { error } = await supabase
      .from('ai_clones')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'AI clone deleted successfully'
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
