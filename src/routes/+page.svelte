<script lang="ts">
	import { browser } from '$app/environment';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import { supabase } from '$lib/common';
	import * as Alert from '$lib/components/ui/alert';
	import { Badge } from '$lib/components/ui/badge';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Card } from '$lib/components/ui/card';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { createQuery } from '@tanstack/svelte-query';
	import { ExternalLink, ShieldX } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import type { BookSearchResult } from '../types';
	import Header from './header.svelte';

	// redirect to new site
	if (browser && $page.url.href.includes('pages.dev')) {
		window.location.href = 'https://ayobaca.cc';
	}

	$: search = createQuery<BookSearchResult[]>({
		queryKey: ['search', searchTerm, cursor],
		queryFn: async () => {
			const { data, error } = await supabase.rpc('get_books', {
				_limit: 24,
				_randomize: searchTerm === '',
				_search: searchTerm,
				_offset: cursor * 24
			});
			if (error) throw error;

			if (searchTerm.length > 0) {
				pushState(`/?search=${searchTerm}`, {
					search: searchTerm
				});
			}

			if (previousSearch !== searchTerm) {
				searchResults.set([...data]);
			} else {
				// load more page
				searchResults.update((current) => [...current, ...data]);
			}

			previousSearch = searchTerm;
			isSearching = false;

			return data;
		},
		refetchOnWindowFocus: false,
		enabled: browser
	});

	let searchTerm = '';
	$: isSearching = false;

	if ($page.state.search) {
		searchTerm = $page.state.search;
	}

	let previousSearch: string | null = null;
	$: cursor = 0;
	const searchResults = writable<BookSearchResult[]>([]);

	let timer: ReturnType<typeof setTimeout>;
	const setSearchKeyword = (term: string) => {
		if (previousSearch === term) {
			return;
		}

		clearTimeout(timer);
		timer = setTimeout(async () => {
			searchResults.set([]);
			pushState(`/?search=${term}`, {
				search: term
			});
			searchTerm = term;
			cursor = 0;
		}, 500);
	};

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

	{#if $search.isError}
		<Alert.Root variant="destructive" class="my-4">
			<ShieldX class="h-5 w-5" />
			<Alert.Title>Terjadi kesalahan :(</Alert.Title>
			<Alert.Description
				>Sepertinya terjadi kesalahan di server. Harap laporkan ke kami.</Alert.Description
			>
		</Alert.Root>
	{:else}
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
			{/if}
			{#if $searchResults.length > 0}
				{#each $searchResults as result}
					{@const slug = result._name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}
					<Drawer.Root>
						<Drawer.Trigger>
							<Card
								id={slug}
								class="relative flex h-full flex-col items-center justify-center text-center shadow"
							>
								<img
									id={`${slug}-cover`}
									src={result._coverimage}
									alt={result._name}
									height="400"
									width="300"
									class="h-48 object-cover"
								/>
								<div
									class="absolute bottom-0 left-0 right-0 rounded-b bg-gradient-to-b from-transparent to-black/70 p-2 pt-10 font-semibold text-white"
								>
									<p>{result._name}</p>
								</div>
							</Card>
						</Drawer.Trigger>
						<Drawer.Content>
							<div class="mx-auto w-full max-w-xl">
								<Drawer.Header>
									<Drawer.Title>{result._name}</Drawer.Title>
									<Drawer.Description class="mt-2 flex flex-col gap-2">
										<p>Jumlah halaman : {result._totalpages - 1} halaman</p>
										<p>Tingkat kesulitan : {result._readinglevel}</p>
										<p>
											Pengarang : {result._authors}
										</p>
										<p>
											Kategori : {result._tags.map((tag) => tag.name).join(', ')}
										</p>
										<p>
											Origin URL : <a
												href={`https://www.letsreadasia.org/book/${result._masterbookid}?bookLang=6260074016145408`}
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
										<p>{result._description ?? 'Tidak tersedia'}</p>
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
												<Select.Trigger class="w-full shadow">
													<Select.Value placeholder="Pilih bahasa" />
												</Select.Trigger>
												<Select.Content>
													{#each result._availablelanguages as lang}
														<Select.Item value={lang.id} label={lang.name}>{lang.name}</Select.Item>
													{/each}
												</Select.Content>
												<Select.Input name="favoriteFruit" />
											</Select.Root>
										</div>
										<div class="w-2/3">
											<div class="flex flex-row gap-2">
												<Button
													href="/read/{slug}/{result._masterbookid}?lang={selectedLang.value}"
													target="_blank"
													class="w-full bg-green-700 shadow">Buka Buku</Button
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
			<p class="mb-4 rounded bg-gray-100 p-12 text-center">Tidak ada hasil</p>
		{/if}
		<Button
			class="bg-green-700 shadow hover:bg-green-800"
			on:click={() => (cursor = cursor + 1)}
			disabled={$search.isLoading || $search.data?.length === 0}
			>{$search.isLoading ? 'Memuat...' : 'Selanjutnya'}</Button
		>
	{/if}
</div>
