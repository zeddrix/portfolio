<script lang="ts">
	/**
	 * Contact section variant
	 */
	export let variant: 'full' | 'compact' = 'full';

	/**
	 * Contact information
	 */
	export let email = 'contact@example.com';
	export let phone: string | null = null;
	export let linkedinUrl: string | null = null;
	export let githubUrl: string | null = null;

	/**
	 * Form state
	 */
	let formData = {
		name: '',
		email: '',
		message: ''
	};

	let isSubmitting = false;
	let submitStatus: 'idle' | 'success' | 'error' = 'idle';

	/**
	 * Handle form submission
	 */
	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		isSubmitting = true;
		submitStatus = 'idle';

		try {
			// TODO: Implement contact form submission (Phase 15)
			await new Promise((resolve) => setTimeout(resolve, 1000));
			submitStatus = 'success';
			formData = { name: '', email: '', message: '' };
		} catch (error) {
			console.error('Form submission error:', error);
			submitStatus = 'error';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<section id="contact" class={`${variant === 'compact' ? 'py-12' : 'py-20'} bg-background`}>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-12">
			<h2 class="text-3xl sm:text-4xl font-bold text-primary mb-4">Get In Touch</h2>
			<p class="text-lg text-text-secondary">Let's discuss your next project or just say hello!</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
			<!-- Contact Information -->
			<div class="space-y-6">
				<h3 class="text-2xl font-bold text-text-primary mb-6">Contact Information</h3>
				<div class="space-y-4">
					<!-- Email -->
					<a
						href={`mailto:${email}`}
						class="flex items-center gap-3 text-text-primary hover:text-primary transition-colors no-underline"
					>
						<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
						<span>{email}</span>
					</a>

					<!-- Phone -->
					{#if phone}
						<a
							href={`tel:${phone}`}
							class="flex items-center gap-3 text-text-primary hover:text-primary transition-colors no-underline"
						>
							<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
								/>
							</svg>
							<span>{phone}</span>
						</a>
					{/if}

					<!-- Social Links -->
					<div class="flex gap-4 mt-6">
						{#if linkedinUrl}
							<a
								href={linkedinUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-border hover:bg-primary hover:border-primary hover:text-white transition-all"
								aria-label="LinkedIn"
							>
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
									/>
								</svg>
							</a>
						{/if}

						{#if githubUrl}
							<a
								href={githubUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-border hover:bg-primary hover:border-primary hover:text-white transition-all"
								aria-label="GitHub"
							>
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
									/>
								</svg>
							</a>
						{/if}
					</div>
				</div>
			</div>

			<!-- Contact Form -->
			<div class="bg-surface rounded-lg p-8 border border-border">
				<form on:submit={handleSubmit} class="space-y-6">
					<!-- Name -->
					<div>
						<label for="name" class="block text-sm font-medium text-text-primary mb-2">Name</label>
						<input
							type="text"
							id="name"
							bind:value={formData.name}
							required
							class="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
							placeholder="Your name"
						/>
					</div>

					<!-- Email -->
					<div>
						<label for="email" class="block text-sm font-medium text-text-primary mb-2">Email</label
						>
						<input
							type="email"
							id="email"
							bind:value={formData.email}
							required
							class="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
							placeholder="your.email@example.com"
						/>
					</div>

					<!-- Message -->
					<div>
						<label for="message" class="block text-sm font-medium text-text-primary mb-2"
							>Message</label
						>
						<textarea
							id="message"
							bind:value={formData.message}
							required
							rows="5"
							class="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
							placeholder="Your message..."
						></textarea>
					</div>

					<!-- Submit Button -->
					<button
						type="submit"
						disabled={isSubmitting}
						class="w-full px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed"
						class:cursor-wait={isSubmitting}
					>
						{#if isSubmitting}
							Sending...
						{:else}
							Send Message
						{/if}
					</button>

					<!-- Status Messages -->
					{#if submitStatus === 'success'}
						<p
							class="text-sm font-medium p-3 rounded-lg bg-success/10 text-success border border-success/30"
						>
							Message sent successfully! I'll get back to you soon.
						</p>
					{/if}
					{#if submitStatus === 'error'}
						<p
							class="text-sm font-medium p-3 rounded-lg bg-error/10 text-error border border-error/30"
						>
							Failed to send message. Please try again or contact me directly.
						</p>
					{/if}
				</form>
			</div>
		</div>
	</div>
</section>
