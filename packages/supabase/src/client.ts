import { createClient } from '@supabase/supabase-js';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';

import { Database } from './database.types';

// const storage = Platform.OS === 'web' ? AsyncStorage : new LargeSecureStore();
const storage = AsyncStorage;

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
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
