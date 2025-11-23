<script lang="ts">
	import Section from '$lib/components/Section.svelte';
	import Container from '$lib/components/Container.svelte';
	import Grid from '$lib/components/Grid.svelte';
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';

	interface Project {
		title: string;
		description: string;
		tags: string[];
		gradient: string;
		link?: string;
	}

	const projects: Project[] = [
		{
			title: 'E-Commerce Platform',
			description:
				'A comprehensive online shopping platform with product management, cart functionality, secure checkout, and admin dashboard. Features include advanced filtering, wishlists, and order tracking.',
			tags: ['SvelteKit', 'TypeScript', 'Tailwind', 'Stripe', 'PostgreSQL'],
			gradient: 'from-primary-400 to-primary-600'
		},
		{
			title: 'Task Management App',
			description:
				'Collaborative project management tool with real-time updates, team features, kanban boards, and analytics. Includes time tracking, file attachments, and customizable workflows.',
			tags: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Redux'],
			gradient: 'from-green-400 to-green-600'
		},
		{
			title: 'Analytics Dashboard',
			description:
				'Real-time data visualization dashboard with interactive charts, customizable reports, and data export capabilities. Supports multiple data sources and automated reporting.',
			tags: ['Vue.js', 'D3.js', 'Firebase', 'Chart.js', 'Vuex'],
			gradient: 'from-purple-400 to-purple-600'
		},
		{
			title: 'Social Media Platform',
			description:
				'Full-featured social networking application with posts, comments, likes, real-time messaging, and user profiles. Includes content moderation and recommendation algorithms.',
			tags: ['Next.js', 'GraphQL', 'Prisma', 'Redis', 'AWS'],
			gradient: 'from-blue-400 to-blue-600'
		},
		{
			title: 'Blog CMS',
			description:
				'Content management system for bloggers and publishers. Features markdown editor, media library, SEO optimization, and multi-author support with role-based permissions.',
			tags: ['Nuxt.js', 'Strapi', 'PostgreSQL', 'Cloudinary', 'Algolia'],
			gradient: 'from-orange-400 to-orange-600'
		},
		{
			title: 'Weather App',
			description:
				'Beautiful weather application with hourly and weekly forecasts, location search, favorite locations, and weather alerts. Includes interactive weather maps and historical data.',
			tags: ['Svelte', 'OpenWeather API', 'Mapbox', 'PWA', 'IndexedDB'],
			gradient: 'from-cyan-400 to-cyan-600'
		},
		{
			title: 'Recipe Finder',
			description:
				'Recipe discovery platform with advanced search, meal planning, shopping lists, and nutritional information. Users can save favorites and share their own recipes.',
			tags: ['React Native', 'Express', 'MongoDB', 'Spoonacular API', 'JWT'],
			gradient: 'from-red-400 to-red-600'
		},
		{
			title: 'Fitness Tracker',
			description:
				'Comprehensive fitness tracking app with workout logging, progress charts, goal setting, and personalized recommendations. Integrates with wearable devices.',
			tags: ['Flutter', 'Firebase', 'HealthKit', 'Google Fit', 'Charts'],
			gradient: 'from-pink-400 to-pink-600'
		},
		{
			title: 'Chat Application',
			description:
				'Real-time messaging application with group chats, file sharing, voice/video calls, and end-to-end encryption. Features presence indicators and message threading.',
			tags: ['React', 'WebRTC', 'Socket.io', 'Node.js', 'MongoDB'],
			gradient: 'from-indigo-400 to-indigo-600'
		}
	];

	let selectedCategory = 'all';
	const categories = ['all', 'web', 'mobile', 'data'];

	$: filteredProjects =
		selectedCategory === 'all' ? projects : projects.filter(() => Math.random() > 0.3);
</script>

<svelte:head>
	<title>Projects - Zeddrix</title>
	<meta
		name="description"
		content="Browse the portfolio of projects by Zeddrix - Full-stack developer creating modern web applications"
	/>
</svelte:head>

<!-- Header Section -->
<Section background="white" padding="large">
	<Container maxWidth="lg">
		<div class="text-center space-y-6">
			<h1 class="text-4xl md:text-5xl font-bold text-neutral-900">My Projects</h1>
			<p class="text-xl text-neutral-600 max-w-3xl mx-auto">
				A collection of projects showcasing modern web development, thoughtful design, and technical
				excellence. Each project represents a unique challenge and learning opportunity.
			</p>
		</div>

		<!-- Filter Buttons -->
		<div class="flex flex-wrap justify-center gap-3 mt-8">
			{#each categories as category}
				<button
					type="button"
					on:click={() => (selectedCategory = category)}
					class="px-6 py-2 rounded-full font-medium transition-all duration-150
						{selectedCategory === category
						? 'bg-primary-600 text-white'
						: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}"
				>
					{category.charAt(0).toUpperCase() + category.slice(1)}
				</button>
			{/each}
		</div>
	</Container>
</Section>

<!-- Projects Grid -->
<Section background="gray" padding="large">
	<Container maxWidth="lg">
		<Grid cols={1} md={2} lg={3} gap="loose">
			{#each filteredProjects as project}
				<Card variant="elevated" padding="large" hover>
					<div class="space-y-4">
						<!-- Project Image Placeholder -->
						<div class="w-full h-48 bg-gradient-to-br {project.gradient} rounded-lg" />

						<!-- Project Title -->
						<h3 class="text-xl font-bold text-neutral-900">{project.title}</h3>

						<!-- Project Description -->
						<p class="text-neutral-600 line-clamp-3">{project.description}</p>

						<!-- Tags -->
						<div class="flex flex-wrap gap-2">
							{#each project.tags as tag}
								<span class="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
									{tag}
								</span>
							{/each}
						</div>

						<!-- Action Button -->
						{#if project.link}
							<Button variant="outline" size="small" fullWidth href={project.link}>
								View Project
							</Button>
						{:else}
							<Button variant="ghost" size="small" fullWidth disabled>Coming Soon</Button>
						{/if}
					</div>
				</Card>
			{/each}
		</Grid>

		{#if filteredProjects.length === 0}
			<div class="text-center py-12">
				<p class="text-lg text-neutral-600">No projects found in this category.</p>
			</div>
		{/if}
	</Container>
</Section>

<!-- CTA Section -->
<Section background="dark" padding="large">
	<Container maxWidth="md">
		<div class="text-center space-y-6">
			<h2 class="text-3xl md:text-4xl font-bold text-white">Have a Project in Mind?</h2>
			<p class="text-lg text-neutral-300">
				I'm always interested in hearing about new opportunities and exciting projects.
			</p>
			<Button variant="primary" size="large" href="/contact">Let's Talk</Button>
		</div>
	</Container>
</Section>
