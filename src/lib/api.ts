import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const api = {
  async post(endpoint: string, data: any) {
    if (endpoint === '/auth/login') {
      const { data: result, error } = await supabase.rpc('authenticate_staff', {
        pincode_input: data.pincode
      });
      
      if (error) {
        console.error('Authentication error:', error);
        return { data: { success: false } };
      }

      if (result?.success) {
        return {
          data: {
            success: true,
            staff: result.staff
          }
        };
      }
      
      return { data: { success: false } };
    }
    throw new Error(`Endpoint not implemented: ${endpoint}`);
  },

  async get(endpoint: string) {
    if (endpoint === '/auth/me') {
      // Get staff details from localStorage
      const staffData = localStorage.getItem('staff');
      if (!staffData) {
        return { data: { success: false } };
      }

      try {
        const staff = JSON.parse(staffData);
        return {
          data: {
            success: true,
            staff
          }
        };
      } catch (error) {
        console.error('Error parsing staff data:', error);
        return { data: { success: false } };
      }
    }
    throw new Error(`Endpoint not implemented: ${endpoint}`);
  }
}; 