<script lang="ts">
	import { browser } from '$app/environment';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { createQuery } from '@tanstack/svelte-query';
	import { Book as BookIcon, Captions, Home } from 'lucide-svelte';
	import type { Book } from '../../../../../types';
	const { slug, id, page: openPage } = $page.params;
	const lang = $page.url.searchParams.get('lang') ?? '6260074016145408';

	let pageState = {
		current: openPage ? parseInt(openPage) : 0,
		next: openPage ? parseInt(openPage) + 1 : 1,
		prev: openPage ? parseInt(openPage) - 1 : -1
	};

	$: caption = true;

	const query = createQuery<Book>({
		queryKey: ['book-content'],
		queryFn: async () =>
			await (
				await fetch(`https://letsreadasia.org/api/v5/book/preview/language/${lang}/book/${id}`)
			).json(),
		enabled: browser
	});

	$: preloadImageUrls = $query.data?.pages.map((page) => page.imageUrl) ?? [];

	const navigateTo = (state: 'next' | 'prev') => {
		const openPage = pageState.current + (state === 'next' ? 1 : -1);
		pushState(`/read/${slug}/${id}/${openPage}?lang=${lang}`, {});
		if (state === 'next') {
			pageState = {
				next: pageState.current + 2,
				current: openPage,
				prev: pageState.current
			};
		} else {
			pageState = {
				next: pageState.current,
				current: openPage,
				prev: pageState.current - 2
			};
		}
	};

	$: fontSize = 'lg';
</script>

<svelte:head>
	<title>{$query.data?.name ?? 'Memuat...'}</title>

	{#each preloadImageUrls as imageUrl}
		<link rel="preload" as="image" href={imageUrl} />
	{/each}
</svelte:head>

<div class="relative flex h-dvh items-center justify-center">
	<span class="absolute left-2 top-2">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Button variant="outline" size="sm">Menu</Button></DropdownMenu.Trigger
			>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					<DropdownMenu.Item href="/" class="py-2"
						><Home class="mr-2 h-4" /> Kembali ke Beranda</DropdownMenu.Item
					>
					<DropdownMenu.Item class="py-2">
						<div class="flex flex-row items-center justify-center gap-2">
							<Button variant="default" class="h-7 text-xs" on:click={() => (fontSize = 'sm')}
								>Kecil</Button
							>
							<Button variant="default" class="h-7 text-xs" on:click={() => (fontSize = 'md')}
								>Sedang</Button
							>
							<Button variant="default" class="h-7 text-xs" on:click={() => (fontSize = 'lg')}
								>Besar</Button
							>
						</div>
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<Button variant="default" class="h-7 text-xs" on:click={() => (caption = !caption)}
							><Captions class="h-4" /> {caption ? 'Sembunyikan' : 'Munculkan'} caption</Button
						>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root></span
	>
	{#if $query.isLoading}
		<p>Memuat...</p>
	{:else if $query.isError}
		<p>Error: {$query.error.message}</p>
	{:else if $query.data}
		{#if pageState.current === 0}
			<img
				class="h-full object-contain"
				src={$query.data.coverImageServingUrl}
				alt={$query.data.name}
			/>
		{:else}
			<img
				class="h-full object-contain"
				src={$query.data.pages[pageState.current - 1].imageServingUrl}
				alt={$query.data.pages[pageState.current - 1].alttext}
			/>
		{/if}
		<div class="absolute bottom-0 left-0 w-full text-center">
			{#if pageState.current === 0}
				<div class="mt-10 bg-gradient-to-b from-black/40 to-black/80 p-4">
					<div>
						<h1 class="text-3xl font-semibold text-white">{$query.data.name}</h1>
						<h4 class="text-md mb-4 text-white">
							Oleh {$query.data.collaboratorsByRole.AUTHOR.map((author) => author.name).join(', ')}, {$query
								.data.totalPages} halaman
						</h4>
					</div>
					<Button variant="outline" size="lg" on:click={() => navigateTo('next')}
						><BookIcon class="mr-2 h-6" /> Mulai Baca</Button
					>
				</div>
			{:else}
				<div class="mx-auto flex max-w-lg items-center px-4 py-2">
					<div class="flex-none">
						<Button variant="outline" on:click={() => navigateTo('prev')}
							>{pageState.current === 1 ? 'Sampul' : `Hal ${pageState.prev}`}</Button
						>
					</div>
					<div class="mx-2 grow rounded bg-black bg-opacity-50 text-{fontSize} text-white">
						{#if caption}
							{@html $query.data.pages[pageState.current - 1].extractedLongContentValue}
						{/if}
					</div>
					<div class="flex-none">
						{#if pageState.current !== $query.data.pages.length - 1}
							<Button variant="outline" on:click={() => navigateTo('next')}
								>Hal {pageState.next}</Button
							>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
