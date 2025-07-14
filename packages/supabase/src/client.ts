import { createClient } from '@supabase/supabase-js';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { z } from 'zod';

import { Database } from './database.types';
import { LargeSecureStore } from './large-secure-store';

const storage = Platform.OS === 'web' ? AsyncStorage : new LargeSecureStore();
console.log(
  'process.env.EXPO_PUBLIC_SUPABASE_API_URL',
  process.env.EXPO_PUBLIC_SUPABASE_API_URL,
);
console.log(
  'process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY',
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
);
const { supabaseUrl, supabaseAnonKey } = z
  .object({
    supabaseUrl: z.string(),
    supabaseAnonKey: z.string(),
  })
  .parse({
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_API_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  });

export const getSupabaseBrowserClient = <GenericSchema = Database>() =>
  createClient<GenericSchema>(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage,
      autoRefreshToken: true,
      persistSession: typeof document !== 'undefined',
      detectSessionInUrl: false,
    },
  });
