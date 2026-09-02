import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://sptrhsqbzrlvlrpddffj.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_Rd-9d78-sc4QirBb4uvq6g_y_QZqgEm';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
});
