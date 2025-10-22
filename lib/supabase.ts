import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'placeholder-key';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.warn('Supabase credentials not found in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true, message: 'Supabase connection successful' };
  } catch (err) {
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error' 
    };
  }
}
