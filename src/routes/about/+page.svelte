<script lang="ts">
	import Section from '$lib/components/Section.svelte';
	import Container from '$lib/components/Container.svelte';
	import Grid from '$lib/components/Grid.svelte';
	import Feature from '$lib/components/Feature.svelte';
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';

	const skills = [
		{
			category: 'Frontend',
			items: [
				'React & Next.js',
				'Vue.js & Nuxt.js',
				'Svelte & SvelteKit',
				'TypeScript',
				'Tailwind CSS',
				'Responsive Design'
			]
		},
		{
			category: 'Backend',
			items: [
				'Node.js & Express',
				'Python & Django',
				'REST APIs',
				'GraphQL',
				'PostgreSQL',
				'MongoDB'
			]
		},
		{
			category: 'Tools & Others',
			items: ['Git & GitHub', 'Docker', 'CI/CD', 'Figma', 'AWS', 'Testing (Jest, Playwright)']
		}
	];

	const experience = [
		{
			title: 'Senior Full-Stack Developer',
			company: 'Tech Innovations Inc.',
			period: '2021 - Present',
			description:
				'Leading development of scalable web applications, mentoring junior developers, and implementing best practices for code quality and performance.'
		},
		{
			title: 'Full-Stack Developer',
			company: 'Digital Solutions Ltd.',
			period: '2019 - 2021',
			description:
				'Developed and maintained multiple client projects, focusing on modern JavaScript frameworks and responsive design.'
		},
		{
			title: 'Frontend Developer',
			company: 'Creative Web Studio',
			period: '2017 - 2019',
			description:
				'Built interactive user interfaces and collaborated with designers to create pixel-perfect implementations.'
		}
	];
</script>

<svelte:head>
	<title>About - Zeddrix</title>
	<meta
		name="description"
		content="Learn more about Zeddrix - Full-stack developer with expertise in modern web technologies and UI/UX design"
	/>
</svelte:head>

<!-- Intro Section -->
<Section background="white" padding="large">
	<Container maxWidth="md">
		<div class="text-center space-y-6">
			<div
				class="w-32 h-32 mx-auto bg-gradient-to-br from-primary-400 to-primary-600 rounded-full"
			/>
			<h1 class="text-4xl md:text-5xl font-bold text-neutral-900">About Me</h1>
			<p class="text-xl text-neutral-600 leading-relaxed">
				I'm a passionate full-stack developer and designer dedicated to creating exceptional digital
				experiences that combine beautiful design with robust functionality.
			</p>
		</div>
	</Container>
</Section>

<!-- Story Section -->
<Section background="gray" padding="large">
	<Container maxWidth="lg">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
			<div class="space-y-6">
				<h2 class="text-3xl md:text-4xl font-bold text-neutral-900">My Journey</h2>
				<p class="text-lg text-neutral-600">
					With over 6 years of experience in web development, I've had the opportunity to work on
					diverse projects ranging from e-commerce platforms to complex SaaS applications.
				</p>
				<p class="text-lg text-neutral-600">
					My journey started with a curiosity about how websites work, which evolved into a deep
					passion for creating seamless user experiences. I believe that great software is not just
					about writing code—it's about understanding users, solving real problems, and crafting
					solutions that are both elegant and effective.
				</p>
				<p class="text-lg text-neutral-600">
					When I'm not coding, you'll find me exploring new technologies, contributing to
					open-source projects, or sharing knowledge with the developer community through blog posts
					and tutorials.
				</p>
			</div>

			<div class="space-y-6">
				<Feature
					title="Problem Solver"
					description="I approach every challenge with a methodical mindset, breaking down complex problems into manageable solutions."
					layout="vertical"
				/>
				<Feature
					title="Continuous Learner"
					description="The tech landscape evolves rapidly, and I'm committed to staying current with the latest tools and best practices."
					layout="vertical"
				/>
				<Feature
					title="Collaborative Team Player"
					description="I thrive in collaborative environments, believing that the best solutions come from diverse perspectives."
					layout="vertical"
				/>
			</div>
		</div>
	</Container>
</Section>

<!-- Skills Section -->
<Section background="white" padding="large">
	<Container maxWidth="lg">
		<div class="text-center mb-12">
			<h2 class="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Skills & Expertise</h2>
			<p class="text-lg text-neutral-600">
				A comprehensive toolkit for building modern web applications
			</p>
		</div>

		<Grid cols={1} md={2} lg={3} gap="loose">
			{#each skills as skillGroup}
				<Card variant="elevated" padding="large">
					<div class="space-y-4">
						<h3 class="text-xl font-bold text-neutral-900">{skillGroup.category}</h3>
						<ul class="space-y-2">
							{#each skillGroup.items as skill}
								<li class="flex items-start gap-2">
									<svg
										class="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M5 13l4 4L19 7"
										/>
									</svg>
									<span class="text-neutral-600">{skill}</span>
								</li>
							{/each}
						</ul>
					</div>
				</Card>
			{/each}
		</Grid>
	</Container>
</Section>

<!-- Experience Section -->
<Section background="gray" padding="large">
	<Container maxWidth="lg">
		<div class="text-center mb-12">
			<h2 class="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Work Experience</h2>
			<p class="text-lg text-neutral-600">
				Building solutions across various industries and technologies
			</p>
		</div>

		<div class="space-y-8 max-w-3xl mx-auto">
			{#each experience as job}
				<Card variant="elevated" padding="large">
					<div class="space-y-3">
						<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
							<h3 class="text-xl font-bold text-neutral-900">{job.title}</h3>
							<span class="text-sm text-primary-600 font-medium">{job.period}</span>
						</div>
						<p class="text-neutral-700 font-medium">{job.company}</p>
						<p class="text-neutral-600">{job.description}</p>
					</div>
				</Card>
			{/each}
		</div>
	</Container>
</Section>

<!-- CTA Section -->
<Section background="dark" padding="large">
	<Container maxWidth="md">
		<div class="text-center space-y-6">
			<h2 class="text-3xl md:text-4xl font-bold text-white">Let's Work Together</h2>
			<p class="text-lg text-neutral-300">
				Interested in collaborating on a project? I'd love to hear from you.
			</p>
			<div class="flex flex-wrap gap-4 justify-center">
				<Button variant="primary" size="large" href="/contact">Get In Touch</Button>
				<Button variant="outline" size="large" href="/projects">View My Work</Button>
			</div>
		</div>
	</Container>
</Section>
