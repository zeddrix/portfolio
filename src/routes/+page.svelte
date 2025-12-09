<script lang="ts">
	import SEO from '$lib/components/shared/SEO.svelte';
	import Hero from '$lib/components/shared/Hero.svelte';
	import Navigation from '$lib/components/shared/Navigation.svelte';
	import StatsSection from '$lib/components/sections/StatsSection.svelte';
	import DevelopmentProcess from '$lib/components/sections/DevelopmentProcess.svelte';
	import ProjectDeliverables from '$lib/components/sections/ProjectDeliverables.svelte';
	import AIShowcase from '$lib/components/sections/AIShowcase.svelte';
	import InteractiveShowcase from '$lib/components/sections/InteractiveShowcase.svelte';
	import ContactSection from '$lib/components/shared/ContactSection.svelte';
	import Footer from '$lib/components/shared/Footer.svelte';
	import { generateKeywords } from '$lib/utils/seo';
	import type { PageData } from './$types';

	export let data: PageData;

	// Generate keywords from skills and tech stack
	$: keywords = data.skills
		? generateKeywords(
				data.skills.map((s) => s.name),
				['full stack developer', 'web developer', 'software engineer']
			)
		: '';

	// Extract settings with defaults
	$: animationType = data.siteSettings?.hero_animation_type || 'fade_up';
	$: introDuration = data.siteSettings?.hero_intro_duration || 5000;
	$: videoDuration = data.siteSettings?.hero_video_duration || 5000;
	$: statsDisplayMode = data.siteSettings?.stats_display_mode || 'hybrid';
	$: statsCountersEnabled = data.siteSettings?.stats_counters_enabled ?? true;
	$: statsIconsEnabled = data.siteSettings?.stats_icons_enabled ?? true;
</script>

<SEO
	title={data.profile?.full_name ? `${data.profile.full_name} - Portfolio` : 'Zeddrix - Portfolio'}
	description={data.profile?.tagline ||
		'Portfolio website of Zeddrix - Full Stack Developer specializing in modern web development'}
	{keywords}
	type="website"
/>

<!-- Navigation -->
<Navigation />

<!-- Main Content -->
<main>
	<!-- 1. Hero Section (Intro + Video Carousel) -->
	<Hero
		profile={data.profile}
		heroCarouselProjects={data.heroCarouselProjects}
		{animationType}
		{introDuration}
		{videoDuration}
	/>

	<!-- 2. Stats & Skills Section -->
	<StatsSection
		counters={data.statsCounters}
		skills={data.skills}
		displayMode={statsDisplayMode}
		countersEnabled={statsCountersEnabled}
		iconsEnabled={statsIconsEnabled}
	/>

	<!-- 3. Development Process Section -->
	<DevelopmentProcess steps={data.developmentSteps} />

	<!-- 4. Project Deliverables Section -->
	<ProjectDeliverables deliverables={data.deliverables} />

	<!-- 5. AI Showcase Section -->
	<AIShowcase tools={data.aiTools} stats={data.aiProductivityStats} />

	<!-- 6. Interactive Project Showcase -->
	<InteractiveShowcase projects={data.projects} />

	<!-- 7. Contact Section -->
	<ContactSection profile={data.profile} />
</main>

<!-- Footer -->
<Footer profile={data.profile} socialLinks={data.socialLinks} />
