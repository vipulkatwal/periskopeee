import { supabase } from './supabaseClient';
import { User } from '@supabase/supabase-js';

/**
 * Gets the current user session from Supabase.
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data.user;
}