# AGENTS.md — 不可协商的规则

本文件中的规则**不可协商**。任何 AI 代理（opencode 或其他）在本仓库工作时必须严格遵守。违反任何一条即视为工作失败。

## 1. 密钥安全（最高优先级）

- **禁止**在前端代码、客户端代码或任何提交到仓库的文件中出现：
  - `service_role` 密钥
  - `SUPABASE_SECRET_KEY`（或任何形式的 secret / service key）
- 只允许使用 `PUBLIC_SUPABASE_URL` 和 `PUBLIC_SUPABASE_PUBLISHABLE_KEY`（匿名公开密钥）。
- 在编写、审查、提交代码前，必须确认没有引入上述密钥。发现即立即移除并提醒用户。

## 2. 数据库行级安全（RLS）

- 所有 Supabase 表**必须**启用 RLS（Row Level Security）。
- 每张表的策略（policy）必须绑定 `auth.uid()`，确保用户只能访问自己的数据。
- 不允许创建无策略或全开放（`USING (true)` 且不绑定用户）的策略。

## 3. Svelte 语法：必须使用 Svelte 5 Runes

- 组件状态**必须**使用 Svelte 5 Runes 语法：
  - `$state` — 响应式状态
  - `$derived` — 派生值
  - `$effect` — 副作用
- **禁止**使用 Svelte 4 的旧语法：
  - `export let` 作为组件 props / 状态
  - `writable` / `readable` 等 store 作为组件状态

## 4. 构建验证（每完成一个功能）

- 每完成一个功能，**先运行 `npm run build` 确认静态构建通过**，再进行下一步开发。
- 构建失败必须修复后才能继续；不允许把构建错误留到后面。
