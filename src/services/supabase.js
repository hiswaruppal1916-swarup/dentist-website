import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 'https://hhrxwtldtqoxhniwbsho.supabase.co';
export const SUPABASE_ANON_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhocnh3dGxkdHFveGhuaXdic2hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5NjA2NDEsImV4cCI6MjEwNDUzNjY0MX0.b1mCtRs0xpKi7P3vgCwlE5ae8l1YfH-S56u1qcfTiQg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
