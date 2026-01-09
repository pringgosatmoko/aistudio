
import { createClient } from '@supabase/supabase-js';

/**
 * SATMOKO Creative Studio AI - Supabase Configuration
 * 
 * Note: The Supabase client requires a valid URL and Anon Key.
 * We use placeholder strings as fallbacks to prevent "supabaseUrl is required" errors 
 * during the initial module evaluation if the environment variables are not yet injected.
 */
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
