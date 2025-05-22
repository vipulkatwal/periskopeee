'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { type Database } from '../types/supabase'

// Server-side Supabase client (for Server Components)
export const createServerSupabaseClient = () => {
  return createServerComponentClient<Database>({ cookies })
}