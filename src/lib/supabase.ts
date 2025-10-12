import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Cliente para componentes 'use client' (browser-side, sem cookies server)
export const createClientComponentClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

// Cliente para Server Components/Actions/Handlers (simplificado)
export async function createServerComponentClient() {
  return createClient();
}

// Cliente para APIs (server-side, sem cookies)
export const createClient = () =>
  createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
