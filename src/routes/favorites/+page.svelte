<script lang="ts">
	import { userPrefs } from '$lib/common';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { Trash } from 'lucide-svelte';
	import Header from '../header.svelte';

	const removeFromFavorites = (id: string) => {
		userPrefs.update((prefs) => {
			prefs.favoriteBooks = prefs.favoriteBooks.filter((book) => book.id !== id);
			return prefs;
		});
	};
</script>

<div class="mx-auto mb-8 flex max-w-2xl flex-col px-2 py-4">
	<Header />

	<div class="mt-4">
		<h2 class="text-2xl font-bold">Buku yang difavoritkan</h2>
		<span class="text-sm text-green-800">Buku favorit hanya tersimpan di perangkat ini</span>
		<div class="mb-4 mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-4">
			{#each $userPrefs.favoriteBooks as book}
				{@const slug = book.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}
				<div class="flex flex-col">
					<a href="/read/{slug}/{book.id}?lang={book.language}">
						<Card
							id={slug}
							class="relative flex h-full flex-col items-center justify-center text-center shadow"
						>
							<img src={book.cover} alt={book.title} class="h-48 object-cover" />
							<div
								class="absolute bottom-0 left-0 right-0 rounded-b bg-gradient-to-b from-transparent to-black/70 p-2 pt-10 font-semibold text-white"
							>
								<p>{book.title}</p>
							</div>
						</Card>
					</a>
					<Button
						size="sm"
						variant="outline"
						on:click={() => removeFromFavorites(book.id)}
						class="w-full bg-red-800 text-white shadow hover:bg-red-900 hover:text-white"
						><Trash class="h-4" /> Hapus</Button
					>
				</div>
			{/each}
		</div>
	</div>
</div>
