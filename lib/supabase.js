import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://sptrhsqbzrlvlrpddffj.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_Rd-9d78-sc4QirBb4uvq6g_y_QZqgEm';

const client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
});

// During email-confirmation signup Supabase returns a user but no session.
// The database trigger already creates the profile in that case, so the
// client must not attempt a second RLS-protected upsert as the anon role.
export const supabase = new Proxy(client, {
  get(target, prop, receiver) {
    if (prop !== 'from') return Reflect.get(target, prop, receiver);

    return (table) => {
      const builder = target.from(table);
      if (table !== 'profiles') return builder;

      return new Proxy(builder, {
        get(query, method, queryReceiver) {
          if (method === 'upsert') {
            return async (...args) => {
              const { data: { session } } = await target.auth.getSession();
              if (!session) return { data: null, error: null };
              return query.upsert.apply(query, args);
            };
          }
          return Reflect.get(query, method, queryReceiver);
        },
      });
    };
  },
});
