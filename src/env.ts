import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PUBLIC_SUPABASE_URL: {
		public: true,
		static: true,
		schema: (value) => {
			if (!value) throw new Error('PUBLIC_SUPABASE_URL 未设置：检查项目根目录的 .env（本地）或 GitHub Actions Variables（CI）');
			return value;
		}
	},
	PUBLIC_SUPABASE_PUBLISHABLE_KEY: {
		public: true,
		static: true,
		schema: (value) => {
			if (!value) throw new Error('PUBLIC_SUPABASE_PUBLISHABLE_KEY 未设置：检查项目根目录的 .env（本地）或 GitHub Actions Variables（CI）');
			return value;
		}
	}
});
