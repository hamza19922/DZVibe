import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sptrhsqbzrlvlrpddffj.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_Rd-9d78-sc4QirBb4uvq6g_y_QZqgEm';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
