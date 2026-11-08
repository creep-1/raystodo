import type { Session } from '@supabase/supabase-js';
import { browser, building } from '$app/env';
import { getSupabaseBrowserClient } from '#lib/supabase/client';

class AuthState {
	session = $state<Session | null>(null);
	loading = $state(true);

	constructor() {
		// 预渲染与构建阶段不初始化，仅在浏览器中运行
		if (building || !browser) return;
		const supabase = getSupabaseBrowserClient();
		supabase.auth.getSession().then(({ data }) => {
			this.session = data.session;
			this.loading = false;
		});
		supabase.auth.onAuthStateChange((_event, session) => {
			this.session = session;
			this.loading = false;
		});
	}

	signUp(email: string, password: string) {
		return getSupabaseBrowserClient().auth.signUp({ email, password });
	}

	signIn(email: string, password: string) {
		return getSupabaseBrowserClient().auth.signInWithPassword({ email, password });
	}

	async signOut() {
		await getSupabaseBrowserClient().auth.signOut();
	}
}

export const auth = new AuthState();
