import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$app/env/public';
import type { RequestEvent } from '@sveltejs/kit';

export function createSupabaseServerClient(event: RequestEvent): SupabaseClient {
	return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
		cookies: {
			getAll() {
				return event.cookies.getAll();
			},
			setAll(cookiesToSet) {
				try {
					for (const { name, value, options } of cookiesToSet) {
						event.cookies.set(name, value, { ...options, path: '/' });
					}
				} catch {
					// 在 Server Load 中调用 set 时会抛错（无法修改响应头），
					// 会话刷新由后续请求的 cookie 写回完成，可安全忽略。
				}
			}
		}
	});
}
