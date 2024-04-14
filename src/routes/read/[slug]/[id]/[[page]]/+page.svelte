<script lang="ts">
	import { browser } from '$app/environment';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import { supabase, userPrefs } from '$lib/common';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { createQuery } from '@tanstack/svelte-query';
	import { ALargeSmall, ArrowLeft, Book as BookIcon, Captions, Heart, Menu } from 'lucide-svelte';
	import { swipe } from 'svelte-gestures';
	import { writable } from 'svelte/store';
	import type { BookContent } from '../../../../../types';

	const { slug, id, page: openPage } = $page.params;
	const lang = $page.url.searchParams.get('lang') ?? '6260074016145408';
	const bookContent = writable<BookContent['book_details']>();
	const resolveImageUrl = (bookId: string, page: number) => {
		return `https://storage.ayobaca.cc/${bookId}/${page}.webp`;
	};

	let pageState = {
		current: openPage ? parseInt(openPage) : 0,
		next: openPage ? parseInt(openPage) + 1 : 1,
		prev: openPage ? parseInt(openPage) - 1 : -1
	};

	$: query = createQuery<BookContent | null>({
		queryKey: ['book-content'],
		queryFn: async () => {
			const contents = await supabase
				.from('books')
				.select(
					`
					id,
					masterBookId,
					name,
					authors,
					coverImage,
					book_details(
						pageNum,
						bookId,
						content,
						contentRaw
					)`
				)
				.eq('masterBookId', id)
				.single();
			if (contents.error) throw contents.error;

			const data = contents.data as BookContent | null;
			if (data === null) throw new Error('Book not found');
			bookContent.set(data.book_details.sort((a, b) => a.pageNum - b.pageNum));

			return data;
		},
		enabled: browser
	});

	$: preloadImageUrls =
		[resolveImageUrl(id, 0)].concat($bookContent?.map((_, i) => resolveImageUrl(id, i + 1))) ?? [];
	$: caption = true;
	$: fontSize = 'md';

	const navigateTo = (state: 'next' | 'prev') => {
		const openPage = pageState.current + (state === 'next' ? 1 : -1);
		pushState(`/read/${slug}/${id}/${openPage}?lang=${lang}`, {});
		console.log(pageState.current, $bookContent.length);
		if (state === 'next' && pageState.current !== $bookContent.length - 1) {
			pageState = {
				next: pageState.current + 2,
				current: openPage,
				prev: pageState.current
			};
		}
		if (state === 'prev' && pageState.current !== 0) {
			pageState = {
				next: pageState.current,
				current: openPage,
				prev: pageState.current - 2
			};
		}
	};

	const swipeHandler = (event: any) => {
		const direction = event.detail.direction;
		if (direction === 'left') {
			navigateTo('next');
		}
		if (direction === 'right') {
			navigateTo('prev');
		}
	};

	const navigationHandler = (event: any) => {
		switch (event.keyCode) {
			case 37:
				navigateTo('prev');
				break;
			case 39:
				navigateTo('next');
				break;
		}
	};

	const addToFavorite = () => {
		if ($query.data !== undefined && $query.data !== null) {
			const { name, authors, coverImage } = $query.data;
			userPrefs.update((prefs) => {
				return {
					favoriteBooks: [
						...prefs.favoriteBooks,
						{
							id: id,
							slug: slug,
							title: name,
							cover: coverImage,
							language: lang
						}
					]
				};
			});
		}
	};
	$: isInFavoriteBooks = $userPrefs.favoriteBooks.some((book) => book.id === id);
</script>

<svelte:head>
	<title>{$query.data ? $query.data.name : 'Memuat...'}</title>

	{#each preloadImageUrls as imageUrl}
		<link rel="preload" as="image" href={imageUrl} />
	{/each}
</svelte:head>

<svelte:window on:keydown={navigationHandler} />

<div
	class="relative flex h-dvh items-center justify-center"
	use:swipe={{ timeframe: 300, minSwipeDistance: 60 }}
	on:swipe={swipeHandler}
>
	<div class="absolute left-2 top-2">
		<Button variant="outline" on:click={() => window.close()} size="sm" class="shadow"
			><ArrowLeft class="h-4" /> Kembali</Button
		>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Button variant="outline" size="sm" class="shadow"><Menu class="h-4" /> Menu</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					<DropdownMenu.Item class="py-2">
						<div class="flex flex-row items-center justify-center gap-2">
							<Button
								variant="default"
								class="bg-green-700 text-sm shadow"
								on:click={() => (fontSize = 'sm')}><ALargeSmall class="mr-2 h-4" /> Kecil</Button
							>
							<Button
								variant="default"
								class="bg-green-700 text-sm shadow"
								on:click={() => (fontSize = 'md')}><ALargeSmall class="mr-2 h-6" /> Sedang</Button
							>
							<Button
								variant="default"
								class="bg-green-700 text-sm shadow"
								on:click={() => (fontSize = 'lg')}><ALargeSmall class="mr-2 h-8" /> Besar</Button
							>
						</div>
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<Button
							variant="default"
							class="w-full bg-green-700 text-sm shadow"
							on:click={() => (caption = !caption)}
							><Captions class="h-4" /> {caption ? 'Sembunyikan' : 'Munculkan'} narasi</Button
						>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	<div class="absolute right-2 top-2">
		<div class="flex flex-row items-center justify-center gap-2">
			<Badge class="bg-green-700">
				Hal. {pageState.current} dari {$bookContent ? $bookContent.length - 1 : '-'}
			</Badge>
			<Button
				size="icon"
				variant="outline"
				on:click={addToFavorite}
				class="bg-rose-600 shadow hover:bg-rose-700"
			>
				{#if isInFavoriteBooks}
					<Heart color="#ffffff" fill="#ffffff" class="h-5" />
				{:else}
					<Heart color="#ffffff" class="h-5" />
				{/if}
			</Button>
		</div>
	</div>

	{#if $query.isError}
		<p>Error: {$query.error.message}</p>
	{:else if $bookContent === undefined}
		<p>Memuat...</p>
	{:else}
		{#if pageState.current === 0}
			<img
				class="h-full object-contain"
				id="cover-{slug}-{pageState.current}"
				src={preloadImageUrls[0]}
				alt={'Sampul'}
			/>
		{:else}
			<img
				class="h-full object-contain"
				id="content-{slug}-{pageState.current}"
				src={preloadImageUrls[pageState.current]}
				alt={$bookContent[pageState.current].content}
			/>
		{/if}
		<div class="absolute bottom-0 left-0 w-full text-center">
			{#if pageState.current === 0}
				<div class="mt-10 bg-gradient-to-b from-black/40 to-black/80 p-4">
					<div>
						<h1 class="mb-1 text-3xl font-semibold text-white">
							{$query.data ? $query.data.name : ''}
						</h1>
						<h4 class="text-md mb-4 text-white">
							{$query.data ? $query.data.authors : ''}
						</h4>
					</div>
					<Button variant="outline" size="lg" class="shadow" on:click={() => navigateTo('next')}
						><BookIcon class="mr-2 h-6" /> MULAI</Button
					>
					<div class="mt-2 text-white">
						<Badge class="text-sm">
							Geser menggunakan jari atau kibor ke arah kiri / kanan untuk navigasi halaman
						</Badge>
					</div>
				</div>
			{:else}
				<div class="mx-auto flex max-w-xl items-center px-4 py-2">
					<div class="mx-2 grow rounded bg-black bg-opacity-50 text-{fontSize} text-white">
						{#if caption}
							{@html $bookContent[pageState.current - 1].contentRaw}
						{/if}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
