<script lang="ts">
	import { browser } from '$app/environment';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import { Badge } from '$lib/components/ui/badge';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Card } from '$lib/components/ui/card';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { createQuery } from '@tanstack/svelte-query';
	import { ExternalLink } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import type { SearchResult } from '../types';
	import Header from './header.svelte';

	let searchTerm = $page.url.searchParams.get('search') ?? '';
	$: isSearching = false;

	if ($page.state.search) {
		searchTerm = $page.state.search;
	}

	let previousSearch: string | null = null;
	$: cursor = '0';
	const searchResults = writable<SearchResult['other']>([]);

	let timer: ReturnType<typeof setTimeout>;
	const setSearchKeyword = (term: string) => {
		clearTimeout(timer);
		timer = setTimeout(async () => {
			searchResults.set([]);
			pushState(`/?search=${term}`, {
				search: term
			});
			searchTerm = term;
			cursor = '0';
		}, 500);
	};

	$: search = createQuery<SearchResult>({
		queryKey: ['search', searchTerm, cursor],
		queryFn: async () => {
			isSearching = true;
			const results = (await (
				await fetch(
					`https://letsreadasia.org/api/book/elastic/search/?searchText=${searchTerm}&lId=6260074016145408&limit=24&cursor=${cursor}`,
					{
						cache: 'force-cache',
						headers: {
							'Cache-Control': 'max-age=29030400'
						}
					}
				)
			).json()) as SearchResult;

			if (searchTerm.length > 0) {
				pushState(`/?search=${searchTerm}`, {
					search: searchTerm
				});
			}

			if (previousSearch !== searchTerm) {
				searchResults.set([...results.other]);
			} else {
				// load more page
				searchResults.update((current) => [...current, ...results.other]);
			}

			previousSearch = searchTerm;
			isSearching = false;

			return results;
		},
		refetchOnWindowFocus: false,
		enabled: browser
	});

	let selectedLang = {
		label: 'Bahasa Indonesia',
		value: 6260074016145408
	};
</script>

<svelte:head>
	<title>Ayo Baca</title>
</svelte:head>

<div class="mx-auto mb-8 flex max-w-2xl flex-col px-2 py-4">
	<Header />
	<Input
		placeholder="Ketikkan sesuatu..."
		value={searchTerm}
		on:keyup={(e) => {
			setSearchKeyword(e.currentTarget.value);
		}}
		class="h-12 border border-2 border-green-600 shadow shadow-md focus:outline-none"
	/>

	{#if searchTerm.length > 0}
		<h4 class="mt-4 font-semibold">
			Hasil pencarian <Badge>
				{searchTerm}
			</Badge>
		</h4>
	{/if}
	<div class="mb-4 mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-4">
		{#if ($search.isLoading || isSearching || $search.status === 'pending') && previousSearch !== searchTerm}
			{#each Array(24) as _, index (index)}
				<Skeleton class="h-48 rounded" />
			{/each}
		{:else if $search.isError}
			<p>Error: {$search.error.message}</p>
		{/if}
		{#if $searchResults.length > 0}
			{#each $searchResults as result}
				{@const slug = result.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}
				<Drawer.Root>
					<Drawer.Trigger>
						<Card
							id={slug}
							class="relative flex h-full flex-col items-center justify-center text-center shadow"
						>
							<img
								id={`${slug}-cover`}
								src={result.thumborCoverImageUrl}
								alt={result.name}
								height="400"
								width="300"
								class="h-48 object-cover"
							/>
							<div
								class="absolute bottom-0 left-0 right-0 rounded-b bg-gradient-to-b from-transparent to-black/70 p-2 pt-10 font-semibold text-white"
							>
								<p>{result.name}</p>
							</div>
						</Card>
					</Drawer.Trigger>
					<Drawer.Content>
						<div class="mx-auto w-full max-w-xl">
							<Drawer.Header>
								<Drawer.Title>{result.name}</Drawer.Title>
								<Drawer.Description class="mt-2 flex flex-col gap-2">
									<p>Jumlah halaman : {result.totalPages} halaman</p>
									<p>Tingkat kesulitan : {result.readingLevel}</p>
									<p>
										Kontributor :
										{#if result.contributingUsers.length === 0}
											Tidak tersedia
										{:else}
											{result.contributingUsers.join(', ')}
										{/if}
									</p>
									<p>
										Kategori : {result.tags
											.map((t) => t.localizations[6260074016145408])
											.join(', ')}
									</p>
									<p>
										Origin URL : <a
											href={`https://www.letsreadasia.org/book/${result.masterBookId}?bookLang=6260074016145408`}
											target="_blank"
											rel="noreferrer"
											><Badge class="bg-green-700"
												>Let's Read Asia <ExternalLink class="ml-2 h-4" /></Badge
											></a
										>
									</p>
								</Drawer.Description>
							</Drawer.Header>
							<div class="mx-4 mb-8 mt-4">
								<div class="mb-8">
									<h4 class="mb-1 font-semibold">Ringkasan</h4>
									<p>{result.description ?? 'Tidak tersedia'}</p>
								</div>
								<div class="flex flex-row gap-2">
									<div class="w-1/3">
										<Select.Root
											selected={selectedLang}
											onSelectedChange={(e) =>
												e &&
												(selectedLang = {
													label: e.label ?? 'Bahasa Indonesia',
													value: e.value ?? 6260074016145408
												})}
										>
											<Select.Trigger class="w-full">
												<Select.Value placeholder="Pilih bahasa" />
											</Select.Trigger>
											<Select.Content>
												{#each result.availableLanguages as lang}
													<Select.Item value={lang.id} label={lang.name}>{lang.name}</Select.Item>
												{/each}
											</Select.Content>
											<Select.Input name="favoriteFruit" />
										</Select.Root>
									</div>
									<div class="w-2/3">
										<div class="flex flex-row gap-2">
											<Button
												href="/read/{slug}/{result.masterBookId}?lang={selectedLang.value}"
												class="w-full bg-green-700">Buka Buku</Button
											>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Drawer.Content>
				</Drawer.Root>
			{/each}
		{/if}
	</div>
	{#if !isSearching && $searchResults.length === 0 && $search.status !== 'pending'}
		<p class="rounded bg-gray-100 p-12 text-center">Tidak ada hasil</p>
	{/if}
	{#if $search.data?.cursorWebSafeString}
		<Button
			class="bg-green-700 shadow hover:bg-green-800"
			on:click={() => (cursor = $search.data?.cursorWebSafeString ?? '')}
			disabled={$search.isLoading || $search.data?.cursorWebSafeString === null}
			>{$search.isLoading ? 'Memuat...' : 'Selanjutnya'}</Button
		>
	{/if}
</div>
