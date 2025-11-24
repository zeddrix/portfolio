<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Section from '$lib/components/Section.svelte';
	import Container from '$lib/components/Container.svelte';
	import Grid from '$lib/components/Grid.svelte';
	import Card from '$lib/components/Card.svelte';
	import Feature from '$lib/components/Feature.svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<svelte:head>
	<title>Zeddrix - Full-Stack Developer & Designer</title>
	<meta
		name="description"
		content="Portfolio of Zeddrix - Full-stack developer specializing in modern web applications with exceptional UI/UX"
	/>
</svelte:head>

<!-- Hero Section -->
<Hero
	title="Building Digital Experiences That Matter"
	subtitle="Full-stack developer and designer crafting elegant solutions to complex problems."
	background="gradient"
	height="full"
	alignment="center"
>
	<svelte:fragment slot="cta">
		<Button variant="primary" size="large" href="/projects">View My Work</Button>
		<Button variant="outline" size="large" href="/contact">Get In Touch</Button>
	</svelte:fragment>
</Hero>

<!-- Featured Work Section -->
<Section background="white" padding="large">
	<Container maxWidth="lg">
		<div class="text-center mb-20">
			<h2 class="text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900 mb-6 tracking-tight">
				Featured Projects
			</h2>
			<p class="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto font-light leading-relaxed">
				A selection of recent work showcasing modern web development and thoughtful design.
			</p>
		</div>

		<Grid cols={1} md={2} lg={3} gap="loose">
			<Card shadow="xl" padding="large" hover>
				<div class="space-y-6">
					<div
						class="w-full h-56 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-lg shadow-md"
					/>
					<h3 class="text-2xl font-semibold text-neutral-900">E-Commerce Platform</h3>
					<p class="text-neutral-600 text-lg leading-relaxed">
						A full-featured online store with advanced product filtering, cart management, and
						secure checkout.
					</p>
					<div class="flex flex-wrap gap-2">
						<span class="px-4 py-2 bg-primary-100 text-primary-700 text-sm font-medium rounded-full"
							>SvelteKit</span
						>
						<span class="px-4 py-2 bg-primary-100 text-primary-700 text-sm font-medium rounded-full"
							>TypeScript</span
						>
						<span class="px-4 py-2 bg-primary-100 text-primary-700 text-sm font-medium rounded-full"
							>Tailwind</span
						>
					</div>
				</div>
			</Card>

			<Card shadow="xl" padding="large" hover>
				<div class="space-y-6">
					<div
						class="w-full h-56 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-lg shadow-md"
					/>
					<h3 class="text-2xl font-semibold text-neutral-900">Task Management App</h3>
					<p class="text-neutral-600 text-lg leading-relaxed">
						Collaborative project management tool with real-time updates, team features, and
						analytics.
					</p>
					<div class="flex flex-wrap gap-2">
						<span class="px-4 py-2 bg-primary-100 text-primary-700 text-sm font-medium rounded-full"
							>React</span
						>
						<span class="px-4 py-2 bg-primary-100 text-primary-700 text-sm font-medium rounded-full"
							>Node.js</span
						>
						<span class="px-4 py-2 bg-primary-100 text-primary-700 text-sm font-medium rounded-full"
							>MongoDB</span
						>
					</div>
				</div>
			</Card>

			<Card shadow="xl" padding="large" hover>
				<div class="space-y-6">
					<div
						class="w-full h-56 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-lg shadow-md"
					/>
					<h3 class="text-2xl font-semibold text-neutral-900">Analytics Dashboard</h3>
					<p class="text-neutral-600 text-lg leading-relaxed">
						Real-time data visualization dashboard with interactive charts and customizable reports.
					</p>
					<div class="flex flex-wrap gap-2">
						<span class="px-4 py-2 bg-primary-100 text-primary-700 text-sm font-medium rounded-full"
							>Vue.js</span
						>
						<span class="px-4 py-2 bg-primary-100 text-primary-700 text-sm font-medium rounded-full"
							>D3.js</span
						>
						<span class="px-4 py-2 bg-primary-100 text-primary-700 text-sm font-medium rounded-full"
							>Firebase</span
						>
					</div>
				</div>
			</Card>
		</Grid>

		<div class="text-center mt-16">
			<Button variant="primary" size="large" href="/projects">View All Projects</Button>
		</div>
	</Container>
</Section>

<!-- About Preview Section -->
<Section background="gray" padding="large">
	<Container maxWidth="lg">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
			<div class="space-y-8">
				<h2
					class="text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900 leading-tight tracking-tight"
				>
					Crafting Solutions With Code & Design
				</h2>
				<p class="text-xl text-neutral-600 leading-relaxed">
					I'm a full-stack developer with a passion for creating beautiful, functional web
					applications. With expertise in modern JavaScript frameworks and a keen eye for design, I
					bring ideas to life through clean code and intuitive user experiences.
				</p>
				<p class="text-xl text-neutral-600 leading-relaxed">
					From concept to deployment, I handle every aspect of web development with attention to
					detail and a focus on performance, accessibility, and maintainability.
				</p>
				<Button variant="outline" size="large" href="/about">Learn More About Me</Button>
			</div>

			<div class="space-y-6">
				<Feature
					title="Full-Stack Development"
					description="Proficient in modern frontend frameworks and backend technologies, building complete web applications from database to UI."
					layout="horizontal"
				/>
				<Feature
					title="UI/UX Design"
					description="Creating intuitive interfaces with a focus on user experience, accessibility, and visual appeal."
					layout="horizontal"
				/>
				<Feature
					title="Performance Optimization"
					description="Ensuring fast load times, smooth animations, and optimal performance across all devices."
					layout="horizontal"
				/>
			</div>
		</div>
	</Container>
</Section>

<!-- CTA Section -->
<Section background="dark" padding="large">
	<Container maxWidth="md">
		<div class="text-center space-y-8">
			<h2
				class="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight tracking-tight"
			>
				Ready to Start Your Project?
			</h2>
			<p class="text-xl md:text-2xl text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
				Let's work together to bring your ideas to life. I'm available for freelance projects and
				collaborations.
			</p>
			<div class="flex flex-wrap gap-6 justify-center mt-8">
				<Button variant="primary" size="large" href="/contact">Get In Touch</Button>
				<Button variant="secondary" size="large" href="/projects">View Portfolio</Button>
			</div>
		</div>
	</Container>
</Section>
