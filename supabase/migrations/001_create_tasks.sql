-- 001_create_tasks.sql
-- tasks 表 + RLS：所有策略绑定 auth.uid()，用户只能访问自己的数据

create table public.tasks (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
	title text not null,
	note text,
	completed boolean not null default false,
	created_at timestamptz default now(),
	updated_at timestamptz default now()
);

alter table public.tasks enable row level security;

create policy "tasks_select_own" on public.tasks for select
	using (auth.uid() = user_id);

create policy "tasks_insert_own" on public.tasks for insert
	with check (auth.uid() = user_id);

create policy "tasks_update_own" on public.tasks for update
	using (auth.uid() = user_id)
	with check (auth.uid() = user_id);

create policy "tasks_delete_own" on public.tasks for delete
	using (auth.uid() = user_id);
