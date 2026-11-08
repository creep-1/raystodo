import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$app/env/public';

let client: SupabaseClient | undefined;

export function getSupabaseBrowserClient(): SupabaseClient {
	client ??= createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY);
	return client;
}
