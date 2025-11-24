<script lang="ts">
	import Section from '$lib/components/Section.svelte';
	import Container from '$lib/components/Container.svelte';
	import Card from '$lib/components/Card.svelte';
	import Input from '$lib/components/Input.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import Button from '$lib/components/Button.svelte';
	import Toast from '$lib/components/Toast.svelte';

	let formData = {
		name: '',
		email: '',
		subject: '',
		message: ''
	};

	let errors = {
		name: '',
		email: '',
		subject: '',
		message: ''
	};

	let isSubmitting = false;
	let showToast = false;
	let toastMessage = '';
	let toastType: 'success' | 'error' | 'warning' | 'info' = 'success';

	function validateForm(): boolean {
		let isValid = true;
		errors = { name: '', email: '', subject: '', message: '' };

		if (!formData.name.trim()) {
			errors.name = 'Name is required';
			isValid = false;
		}

		if (!formData.email.trim()) {
			errors.email = 'Email is required';
			isValid = false;
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			errors.email = 'Please enter a valid email address';
			isValid = false;
		}

		if (!formData.subject.trim()) {
			errors.subject = 'Subject is required';
			isValid = false;
		}

		if (!formData.message.trim()) {
			errors.message = 'Message is required';
			isValid = false;
		} else if (formData.message.trim().length < 10) {
			errors.message = 'Message must be at least 10 characters';
			isValid = false;
		}

		return isValid;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!validateForm()) {
			toastMessage = 'Please fix the errors in the form';
			toastType = 'error';
			showToast = true;
			return;
		}

		isSubmitting = true;

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Success
			toastMessage = "Message sent successfully! I'll get back to you soon.";
			toastType = 'success';
			showToast = true;

			// Reset form
			formData = { name: '', email: '', subject: '', message: '' };
		} catch {
			toastMessage = 'Failed to send message. Please try again.';
			toastType = 'error';
			showToast = true;
		} finally {
			isSubmitting = false;
		}
	}

	const contactInfo = [
		{
			title: 'Email',
			value: 'hello@zeddrix.dev',
			icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>'
		},
		{
			title: 'Phone',
			value: '+1 (555) 123-4567',
			icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>'
		},
		{
			title: 'Location',
			value: 'San Francisco, CA',
			icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>'
		}
	];
</script>

<svelte:head>
	<title>Contact - Zeddrix</title>
	<meta
		name="description"
		content="Get in touch with Zeddrix for project inquiries, collaborations, or just to say hello"
	/>
</svelte:head>

<!-- Header Section -->
<Section background="white" padding="large">
	<Container maxWidth="md">
		<div class="text-center space-y-8">
			<h1
				class="text-5xl md:text-6xl lg:text-7xl font-light text-neutral-900 tracking-tight leading-tight"
			>
				Get In Touch
			</h1>
			<p class="text-xl md:text-2xl text-neutral-600 font-light leading-relaxed">
				Have a project in mind or just want to chat? I'd love to hear from you. Fill out the form
				below or reach out via email.
			</p>
		</div>
	</Container>
</Section>

<!-- Contact Info Cards -->
<Section background="gray" padding="medium">
	<Container maxWidth="lg">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			{#each contactInfo as info}
				<Card shadow="xl" padding="large">
					<div class="flex flex-col items-center text-center space-y-4">
						<div class="text-primary-600">
							{@html info.icon}
						</div>
						<h3 class="text-xl font-semibold text-neutral-900">{info.title}</h3>
						<p class="text-neutral-600 text-lg">{info.value}</p>
					</div>
				</Card>
			{/each}
		</div>
	</Container>
</Section>

<!-- Contact Form Section -->
<Section background="white" padding="large">
	<Container maxWidth="md">
		<Card shadow="2xl" padding="large">
			<div class="space-y-8">
				<div class="text-center">
					<h2
						class="text-3xl md:text-4xl lg:text-5xl font-light text-neutral-900 mb-4 tracking-tight"
					>
						Send a Message
					</h2>
					<p class="text-neutral-600 text-lg">I'll respond within 24 hours</p>
				</div>

				<form on:submit={handleSubmit} class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<Input
							label="Name"
							type="text"
							placeholder="Your name"
							bind:value={formData.name}
							error={errors.name}
							disabled={isSubmitting}
							required
						/>

						<Input
							label="Email"
							type="email"
							placeholder="your.email@example.com"
							bind:value={formData.email}
							error={errors.email}
							disabled={isSubmitting}
							required
						/>
					</div>

					<Input
						label="Subject"
						type="text"
						placeholder="What is this about?"
						bind:value={formData.subject}
						error={errors.subject}
						disabled={isSubmitting}
						required
					/>

					<Textarea
						label="Message"
						placeholder="Tell me about your project or inquiry..."
						rows={6}
						bind:value={formData.message}
						error={errors.message}
						disabled={isSubmitting}
						required
					/>

					<Button
						type="submit"
						variant="primary"
						size="large"
						fullWidth
						loading={isSubmitting}
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Sending...' : 'Send Message'}
					</Button>
				</form>
			</div>
		</Card>
	</Container>
</Section>

<!-- Social Links Section -->
<Section background="gray" padding="large">
	<Container maxWidth="md">
		<div class="text-center space-y-8">
			<h2
				class="text-3xl md:text-4xl lg:text-5xl font-light text-neutral-900 tracking-tight leading-tight"
			>
				Connect With Me
			</h2>
			<p class="text-neutral-600 text-lg">Follow me on social media for updates and insights</p>

			<div class="flex justify-center gap-6">
				<a
					href="https://github.com"
					target="_blank"
					rel="noopener noreferrer"
					class="p-4 rounded-full bg-neutral-900 text-white hover:bg-neutral-700 transition-all duration-200 hover:scale-110 shadow-md hover:shadow-lg"
					aria-label="GitHub"
				>
					<svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
						<path
							fill-rule="evenodd"
							d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
							clip-rule="evenodd"
						/>
					</svg>
				</a>

				<a
					href="https://linkedin.com"
					target="_blank"
					rel="noopener noreferrer"
					class="p-4 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 hover:scale-110 shadow-md hover:shadow-lg"
					aria-label="LinkedIn"
				>
					<svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
						/>
					</svg>
				</a>

				<a
					href="https://twitter.com"
					target="_blank"
					rel="noopener noreferrer"
					class="p-4 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-all duration-200 hover:scale-110 shadow-md hover:shadow-lg"
					aria-label="Twitter"
				>
					<svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
						/>
					</svg>
				</a>
			</div>
		</div>
	</Container>
</Section>

<!-- Toast Notification -->
<Toast message={toastMessage} type={toastType} duration={5000} bind:visible={showToast} />
