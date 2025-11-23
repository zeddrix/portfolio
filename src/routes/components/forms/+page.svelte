<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import Select from '$lib/components/Select.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Form from '$lib/components/Form.svelte';
	import Button from '$lib/components/Button.svelte';
	import Container from '$lib/components/Container.svelte';
	import Card from '$lib/components/Card.svelte';

	let name = '';
	let email = '';
	let message = '';
	let country = '';
	let subscribe = false;
	let formLoading = false;
	let formError = '';
	let formSuccess = '';

	const countries = [
		{ value: 'us', label: 'United States' },
		{ value: 'uk', label: 'United Kingdom' },
		{ value: 'ca', label: 'Canada' },
		{ value: 'au', label: 'Australia' }
	];

	function handleSubmit() {
		formLoading = true;
		formError = '';
		formSuccess = '';

		// eslint-disable-next-line no-undef
		setTimeout(() => {
			formLoading = false;
			formSuccess = 'Form submitted successfully!';
		}, 2000);
	}
</script>

<Container maxWidth="2xl">
	<div class="py-12 space-y-12">
		<div>
			<h1 class="text-4xl font-bold text-neutral-900 mb-2">Form Components</h1>
			<p class="text-lg text-neutral-600">Form inputs with validation states and accessibility</p>
		</div>

		<!-- Input Component -->
		<section class="space-y-6">
			<div>
				<h2 class="text-2xl font-semibold text-neutral-900 mb-2">Input</h2>
				<p class="text-neutral-600">Text input with label and error states</p>
			</div>

			<Card>
				<div slot="header" class="font-semibold">Input Examples</div>
				<div class="space-y-4 max-w-md">
					<Input label="Name" placeholder="Enter your name" bind:value={name} />
					<Input
						type="email"
						label="Email"
						placeholder="your@email.com"
						bind:value={email}
						required
					/>
					<Input
						type="password"
						label="Password"
						placeholder="Enter password"
						error="Password must be at least 8 characters"
					/>
					<Input label="Disabled Input" placeholder="This is disabled" disabled />
				</div>
			</Card>
		</section>

		<!-- Textarea Component -->
		<section class="space-y-6">
			<div>
				<h2 class="text-2xl font-semibold text-neutral-900 mb-2">Textarea</h2>
				<p class="text-neutral-600">Multiline text input</p>
			</div>

			<Card>
				<div slot="header" class="font-semibold">Textarea Examples</div>
				<div class="space-y-4 max-w-md">
					<Textarea
						label="Message"
						placeholder="Enter your message"
						rows={4}
						bind:value={message}
					/>
					<Textarea
						label="With Error"
						placeholder="Enter text"
						error="This field is required"
						rows={3}
					/>
				</div>
			</Card>
		</section>

		<!-- Select Component -->
		<section class="space-y-6">
			<div>
				<h2 class="text-2xl font-semibold text-neutral-900 mb-2">Select</h2>
				<p class="text-neutral-600">Dropdown selection with custom styling</p>
			</div>

			<Card>
				<div slot="header" class="font-semibold">Select Examples</div>
				<div class="space-y-4 max-w-md">
					<Select
						label="Country"
						options={countries}
						bind:value={country}
						placeholder="Select your country"
					/>
					<Select label="With Error" options={countries} error="Please select a country" required />
				</div>
			</Card>
		</section>

		<!-- Checkbox Component -->
		<section class="space-y-6">
			<div>
				<h2 class="text-2xl font-semibold text-neutral-900 mb-2">Checkbox</h2>
				<p class="text-neutral-600">Custom checkbox with label</p>
			</div>

			<Card>
				<div slot="header" class="font-semibold">Checkbox Examples</div>
				<div class="space-y-4">
					<Checkbox label="Subscribe to newsletter" bind:checked={subscribe} />
					<Checkbox label="I agree to the terms and conditions" />
					<Checkbox label="Disabled checkbox" disabled />
				</div>
			</Card>
		</section>

		<!-- Complete Form Example -->
		<section class="space-y-6">
			<div>
				<h2 class="text-2xl font-semibold text-neutral-900 mb-2">Complete Form</h2>
				<p class="text-neutral-600">Full form example with submission handling</p>
			</div>

			<Card>
				<div slot="header" class="font-semibold">Contact Form</div>
				<Form
					on:submit={handleSubmit}
					loading={formLoading}
					error={formError}
					success={formSuccess}
				>
					<div class="max-w-md space-y-4">
						<Input label="Full Name" placeholder="John Doe" required bind:value={name} />
						<Input
							type="email"
							label="Email Address"
							placeholder="john@example.com"
							required
							bind:value={email}
						/>
						<Select
							label="Country"
							options={countries}
							placeholder="Select country"
							bind:value={country}
						/>
						<Textarea
							label="Message"
							placeholder="Your message..."
							rows={4}
							required
							bind:value={message}
						/>
						<Checkbox label="Subscribe to our newsletter" bind:checked={subscribe} />
					</div>

					<div slot="actions" let:loading>
						<Button type="submit" {loading} disabled={loading} fullWidth>
							{loading ? 'Submitting...' : 'Submit Form'}
						</Button>
					</div>
				</Form>
			</Card>
		</section>
	</div>
</Container>
