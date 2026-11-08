import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// SvelteKit 3 不再读取 svelte.config.js，配置统一放在此处
			adapter: adapter({
				// GitHub Pages 上作为 SPA fallback
				fallback: '404.html'
			}),

			paths: {
				// 开发模式下留空；CI 构建时由环境变量注入仓库名（如 /raystodo）
				base: (process.env.BASE_PATH ?? '') as '' | `/${string}`
			}
		})
	]
});
