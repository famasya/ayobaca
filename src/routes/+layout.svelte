<script>
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import '../app.pcss';

	const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
	<slot />
</QueryClientProvider>

<svelte:head>
	<!-- Cloudflare Web Analytics -->
	<script
		defer
		src="https://static.cloudflareinsights.com/beacon.min.js"
		data-cf-beacon="&lcub;&quot;token&quot;: &quot;fc596802ae6d4f6a906aee9203656426&quot;&rcub;"
	></script>
	<!-- End Cloudflare Web Analytics -->
</svelte:head>
