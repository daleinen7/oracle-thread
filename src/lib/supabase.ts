import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Define types for environment variables, if needed
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GATSBY_SUPABASE_URL: string;
      GATSBY_SUPABASE_PUBLIC_KEY: string;
    }
  }
}

// Retrieve environment variables
const supabaseUrl = process.env.GATSBY_SUPABASE_URL;
const supabaseKey = process.env.GATSBY_SUPABASE_PUBLIC_KEY;

// Ensure the environment variables are provided
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and key are missing in environment variables.');
}

// Create and export the Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
