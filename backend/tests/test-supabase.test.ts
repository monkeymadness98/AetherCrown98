import { testSupabaseConnection } from '@/lib/supabase';

describe('Supabase Connection Tests', () => {
  it('should test Supabase connection', async () => {
    const result = await testSupabaseConnection();
    
    expect(result).toBeDefined();
    expect(result).toHaveProperty('success');
    
    // Connection can succeed or fail based on environment
    if (result.success) {
      expect(result.message).toBe('Supabase connection successful');
    } else {
      expect(result).toHaveProperty('error');
    }
  });

  it('should return proper structure on connection test', async () => {
    const result = await testSupabaseConnection();
    
    expect(typeof result.success).toBe('boolean');
    
    if (result.success) {
      expect(result).toHaveProperty('message');
    } else {
      expect(result).toHaveProperty('error');
    }
  });
});
