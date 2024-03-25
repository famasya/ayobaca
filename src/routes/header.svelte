<script>
	import { BookA } from 'lucide-svelte';
	import HomeMenu from './home-menu.svelte';
</script>

<div class="space-between mb-4 flex flex-row items-center">
	<div class="grow">
		<a href="/">
			<span class="flex flex-row">
				<BookA class="h-8" />
				<h1 class="mx-2 inline text-2xl">Ayo Baca</h1>
			</span>
		</a>
		<span class="mt-1 text-sm">Baca cerita dari LetsReadAsia</span>
	</div>
	<div class="flex-none">
		<HomeMenu />
	</div>
</div>
