<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { getSupabaseBrowserClient } from '#lib/supabase/client';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { auth } from '#lib/auth.svelte';

	interface Task {
		id: string;
		user_id: string;
		title: string;
		note: string;
		completed: boolean;
		created_at: string;
		updated_at: string;
	}

	let client: SupabaseClient | undefined;
	// 仅在浏览器中创建客户端（$effect / 事件处理器不会在预渲染时执行）
	function getClient(): SupabaseClient {
		client ??= getSupabaseBrowserClient();
		return client;
	}

	let tasks = $state<Task[]>([]);
	let newTitle = $state('');
	let busy = $state(false);
	let error = $state('');

	$effect(() => {
		if (auth.loading) return;
		if (!auth.session) {
			goto(resolve('/login'), { replaceState: true });
			return;
		}
		loadTasks();
	});

	function normalize(row: any): Task {
		return { ...row, note: row.note ?? '' };
	}

	async function loadTasks() {
		busy = true;
		error = '';
		const { data, error: err } = await getClient()
			.from('tasks')
			.select('id, user_id, title, note, completed, created_at, updated_at')
			.order('created_at', { ascending: false });
		busy = false;
		if (err) {
			error = err.message;
			return;
		}
		tasks = (data ?? []).map(normalize);
	}

	async function addTask(e: SubmitEvent) {
		e.preventDefault();
		const title = newTitle.trim();
		if (!title) return;
		busy = true;
		error = '';
		const { data, error: err } = await getClient().from('tasks').insert({ title }).select().single();
		busy = false;
		if (err) {
			error = err.message;
			return;
		}
		newTitle = '';
		tasks = [normalize(data), ...tasks];
	}

	async function toggleTask(task: Task) {
		const completed = !task.completed;
		const { error: err } = await getClient()
			.from('tasks')
			.update({ completed, updated_at: new Date().toISOString() })
			.eq('id', task.id);
		if (err) {
			error = err.message;
			return;
		}
		tasks = tasks.map((t) => (t.id === task.id ? { ...t, completed } : t));
	}

	async function saveTask(task: Task, patch: { title?: string; note?: string }) {
		const { error: err } = await getClient()
			.from('tasks')
			.update({ ...patch, updated_at: new Date().toISOString() })
			.eq('id', task.id);
		if (err) {
			error = err.message;
			return;
		}
		tasks = tasks.map((t) => (t.id === task.id ? { ...t, ...patch } : t));
	}

	async function deleteTask(id: string) {
		const { error: err } = await getClient().from('tasks').delete().eq('id', id);
		if (err) {
			error = err.message;
			return;
		}
		tasks = tasks.filter((t) => t.id !== id);
	}
</script>

<svelte:head>
	<title>raystodo</title>
</svelte:head>

<main>
	{#if auth.loading}
		<p>加载中…</p>
	{:else if auth.session}
		<header>
			<h1>raystodo</h1>
			<div class="user">
				<span>{auth.session.user.email}</span>
				<button onclick={() => auth.signOut()}>退出</button>
			</div>
		</header>

		<form onsubmit={addTask}>
			<input bind:value={newTitle} placeholder="新任务…" required />
			<button disabled={busy}>添加</button>
		</form>

		{#if error}<p class="error">{error}</p>{/if}

		<ul>
			{#each tasks as task (task.id)}
				<li class:done={task.completed}>
					<input
						type="checkbox"
						checked={task.completed}
						onchange={() => toggleTask(task)}
						aria-label="完成"
					/>
					<div class="fields">
						<input
							class="title"
							bind:value={task.title}
							onchange={() => saveTask(task, { title: task.title.trim() })}
							onkeydown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
						/>
						<input
							class="note"
							bind:value={task.note}
							placeholder="备注…"
							onchange={() => saveTask(task, { note: task.note })}
							onkeydown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
						/>
					</div>
					<button onclick={() => deleteTask(task.id)} aria-label="删除">✕</button>
				</li>
			{:else}
				<li class="empty">暂无任务，添加一个吧。</li>
			{/each}
		</ul>
	{/if}
</main>

<style>
	main {
		max-width: 32rem;
		margin: 2rem auto;
		padding: 0 1rem;
		display: grid;
		gap: 1rem;
	}
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	h1 {
		font-size: 1.25rem;
		margin: 0;
	}
	.user {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.85rem;
	}
	form {
		display: flex;
		gap: 0.5rem;
	}
	input,
	button {
		font-size: 1rem;
		padding: 0.5rem;
	}
	form input {
		flex: 1;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.5rem;
	}
	li {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
	}
	li .fields {
		flex: 1;
		display: grid;
		gap: 0.25rem;
	}
	li input[type='checkbox'] {
		margin-top: 0.6rem;
	}
	li .title {
		font-weight: 500;
	}
	li .note {
		font-size: 0.85rem;
	}
	li.done .title {
		text-decoration: line-through;
		opacity: 0.5;
	}
	li.empty {
		opacity: 0.6;
	}
	.error {
		color: #c0392b;
		margin: 0;
	}
</style>
