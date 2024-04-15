<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Github, Heart, Home, Menu, MessageCircleHeart, Notebook } from 'lucide-svelte';
	let openChangelog = false;

	const releaseNotes = [
		{
			date: '2024-03-25',
			notes: [
				'Ditambahkan fitur "favorit" untuk menandai buku favoritmu. Klik tombol hati di sebelah kanan atas ketika membaca buku.'
			]
		},
		{
			date: '2024-04-07',
			notes: [
				'Mempercepat proses pencarian',
				'Buku di halaman awal sekarang ditampilkan secara acak'
			]
		},
		{
			date: '2024-04-15',
			notes: ['Loading gambar kini lebih cepat']
		}
	];
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Button variant="outline" size="icon" class="border-1 rounded border p-2 shadow">
			<Menu />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Item href="/">
			<Home class="mr-2 h-4 w-4" />
			<span>Beranda</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item href="/favorites">
			<Heart class="mr-2 h-4 w-4" />
			<span>Buku favorit</span>
		</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item on:click={() => (openChangelog = true)}>
			<Notebook class="mr-2 h-4 w-4" />
			<span>Catatan rilis</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item href="https://tally.so/r/3ly0NW" target="_blank">
			<MessageCircleHeart class="mr-2 h-4 w-4" />
			<span>Beri saran</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item href="https://github.com/famasya/ayobaca" target="_blank">
			<Github class="mr-2 h-4 w-4" />
			<span>Kode sumber</span>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<AlertDialog.Root
	open={openChangelog}
	onOpenChange={(state) => (openChangelog = state)}
	closeOnOutsideClick
>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title class="mb-2">Catatan Rilis</AlertDialog.Title>
			<AlertDialog.Description>
				{#each releaseNotes as note}
					<div class="mt-2 border-l-4 border-green-500 pl-4">
						<p class="text-black">{note.date}</p>
						<ul class="list-decimal pl-4">
							{#each note.notes as noteText}
								<li>
									{@html noteText}
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</AlertDialog.Description>
		</AlertDialog.Header>
	</AlertDialog.Content>
</AlertDialog.Root>
