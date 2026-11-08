<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '#lib/auth.svelte';

	let email = $state('');
	let password = $state('');
	let busy = $state(false);
	let error = $state('');
	let notice = $state('');

	$effect(() => {
		if (!auth.loading && auth.session) {
			goto('/', { replaceState: true });
		}
	});

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault();
		const intent = (e.submitter as HTMLButtonElement | null)?.value ?? 'signin';
		busy = true;
		error = '';
		notice = '';

		if (intent === 'signup') {
			const { data, error: err } = await auth.signUp(email.trim(), password);
			busy = false;
			if (err) {
				error = err.message;
				return;
			}
			if (data.session) {
				goto('/', { replaceState: true });
			} else {
				notice = '确认邮件已发送，请查收邮箱完成验证后登录。';
			}
		} else {
			const { error: err } = await auth.signIn(email.trim(), password);
			busy = false;
			if (err) {
				error = err.message;
				return;
			}
			goto('/', { replaceState: true });
		}
	}
</script>

<svelte:head>
	<title>登录 · raystodo</title>
</svelte:head>

<main>
	<h1>raystodo</h1>

	{#if auth.loading}
		<p>加载中…</p>
	{:else}
		<form onsubmit={onSubmit}>
			<input type="email" bind:value={email} placeholder="邮箱" required autocomplete="email" />
			<input
				type="password"
				bind:value={password}
				placeholder="密码（至少 6 位）"
				required
				minlength={6}
				autocomplete="current-password"
			/>
			<div class="actions">
				<button type="submit" name="intent" value="signin" disabled={busy}>登录</button>
				<button type="submit" name="intent" value="signup" disabled={busy}>注册</button>
			</div>
			{#if error}<p class="error">{error}</p>{/if}
			{#if notice}<p class="notice">{notice}</p>{/if}
		</form>
	{/if}
</main>

<style>
	main {
		max-width: 20rem;
		margin: 4rem auto;
		padding: 0 1rem;
		display: grid;
		gap: 1rem;
	}
	form {
		display: grid;
		gap: 0.5rem;
	}
	input,
	button {
		padding: 0.5rem;
		font-size: 1rem;
	}
	.actions {
		display: flex;
		gap: 0.5rem;
	}
	.actions button {
		flex: 1;
	}
	.error {
		color: #c0392b;
		margin: 0;
	}
	.notice {
		color: #1a7f37;
		margin: 0;
	}
</style>
