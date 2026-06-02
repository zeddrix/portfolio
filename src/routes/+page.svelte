<div class="min-h-screen min-w-0 bg-[#f5f5f5] text-zinc-950">
	<!-- Header (Rick-style: wide frame ~94% / 1800px — not max-w-7xl) -->
	<header class="mx-auto w-[94%] max-w-[1800px] pt-3 sm:pt-4 md:pt-5">
		<div class="flex justify-end">
			<a
				href="https://x.com/"
				class="inline-flex items-center gap-2 text-[15px] font-semibold text-[#8E8E93] transition-colors hover:text-zinc-700"
				target="_blank"
				rel="noopener noreferrer"
			>
				<svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<path
						d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
					/>
				</svg>
				<span>Follow me</span>
			</a>
		</div>
	</header>

	<main>
		<!-- Hero (typography aligned with rickwaalders.com: Inter, tight display / compact body) -->
		<section
			class="mx-auto w-[94%] max-w-[1800px] pb-16 pt-2 sm:pb-24 sm:pt-3 md:pb-32 md:pt-4 lg:min-h-[min(78vh,880px)] lg:pb-32 lg:pt-6"
		>
			<div
				class="grid items-center gap-8 sm:gap-10 md:gap-12 lg:grid-cols-2 lg:gap-12 lg:items-center xl:gap-16"
			>
				<div class="min-w-0 lg:pt-0">
					<h1
						class="text-[clamp(3rem,calc(0.25rem+5.5vw),5rem)] font-bold leading-[1.1] tracking-[-0.04em] text-black"
					>
						Hello, I’m Zeddrix Fabian
					</h1>
					<p
						class="mt-3 max-w-[38rem] text-[clamp(1.125rem,calc(1.1rem+1.25vw),2rem)] font-medium leading-[1.45] text-[#8E8E93] sm:mt-4"
					>
						Senior Design Engineer, I’ve built digital products used by millions of people. Open to
						exploring new and exciting projects.
					</p>
					<div class="mt-8 sm:mt-10 lg:mt-12">
						<a
							href="mailto:hello@example.com"
							class="inline-flex w-full min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-black px-8 py-3.5 text-lg font-semibold text-white shadow-sm transition-opacity hover:opacity-90 sm:w-auto sm:px-9 sm:text-xl"
						>
							<svg class="h-[1.15em] w-[1.15em] shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<path
									d="M4 6h16v12H4V6zm2 0 6 5 6-5"
									stroke="currentColor"
									stroke-width="1.75"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							Get in touch
						</a>
					</div>
				</div>

				<div class="flex w-full justify-center lg:justify-end">
					<div
						class="aspect-square w-full max-w-[260px] overflow-hidden rounded-[2rem] bg-zinc-300/80 shadow-[0_28px_56px_-16px_rgba(0,0,0,0.14)] ring-1 ring-black/[0.06] sm:max-w-[300px] md:max-w-[340px] lg:max-w-[min(100%,400px)]"
						role="img"
						aria-label="Profile photo — replace with your image in static/ or as an img tag"
					>
						<div class="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-zinc-200 to-zinc-300 p-6">
							<svg
								class="h-[22%] w-[22%] min-h-[48px] min-w-[48px] text-zinc-400/90"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.25"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
								/>
							</svg>
							<span class="text-center text-xs font-medium tracking-wide text-zinc-500/90 sm:text-sm">
								Photo
							</span>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Horizontal project strip -->
		<section class="min-w-0 pb-20 sm:pb-28 md:pb-36">
			<div
				class="mx-auto w-[94%] max-w-[1800px] touch-pan-x snap-x snap-mandatory overflow-x-auto scroll-pb-4 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				<div class="flex w-max gap-4 sm:gap-5 md:gap-7 lg:gap-8">
					{#each ['https://peakflow.dev', 'https://project-two.dev', 'https://project-three.dev'] as url, i}
						<article
							class="w-[min(88vw,1100px)] shrink-0 snap-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#1e1033] via-[#120a1f] to-black shadow-[0_32px_64px_-28px_rgba(0,0,0,0.45)] ring-1 ring-black/10 sm:w-[min(92vw,1100px)] sm:rounded-[1.85rem] md:rounded-[2.25rem]"
						>
							<div class="flex h-11 items-center gap-3 border-b border-white/5 px-4">
								<div class="flex gap-1.5">
									<span class="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
									<span class="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
									<span class="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
								</div>
								<div
									class="mx-auto flex h-7 min-w-0 flex-1 max-w-md items-center justify-center rounded-lg bg-black/40 px-3 text-xs text-zinc-400"
								>
									{url}
								</div>
							</div>
							<div class="aspect-[10/11] w-full bg-gradient-to-br from-violet-950/80 to-black p-4 sm:aspect-[16/10] sm:p-6 md:p-10">
								<div class="flex h-full flex-col items-center justify-center gap-3 text-center sm:gap-4">
									{#if i === 0}
										<p
											class="px-1 text-lg font-extrabold tracking-tight text-white sm:text-2xl md:text-4xl"
										>
											Take a look inside your Next.js apps.
										</p>
										<div
											class="rounded-full bg-violet-500 px-4 py-2 text-xs font-semibold text-white shadow-lg sm:px-5 sm:text-sm"
										>
											Download the beta
										</div>
									{:else}
										<p
											class="px-1 text-lg font-extrabold tracking-tight text-white sm:text-2xl md:text-4xl"
										>
											Project showcase placeholder
										</p>
										<div class="h-2 w-32 rounded-full bg-white/10 sm:w-40" />
									{/if}
								</div>
								<div
									class="mt-4 h-32 rounded-lg border border-white/10 bg-black/40 shadow-inner sm:mt-6 sm:h-40 sm:rounded-xl md:h-48"
								/>
							</div>
						</article>
					{/each}
				</div>
			</div>
		</section>

		<!-- About + project list -->
		<section class="mx-auto w-[94%] max-w-[1800px] pb-20 sm:pb-24 md:pb-32">
			<div class="grid gap-12 sm:gap-16 lg:grid-cols-2 lg:gap-24">
				<div class="min-w-0">
					<h2
						class="text-[clamp(3rem,calc(0.25rem+5.5vw),5rem)] font-bold leading-[1.2] tracking-[-0.04em] text-[#111111]"
					>
						About me
					</h2>
					<div
						class="mt-6 space-y-5 text-2xl font-medium leading-[1.5] text-[rgba(17,17,17,0.5)] sm:mt-8 sm:space-y-6"
					>
						<p>
							I’m a design engineer focused on product craft—clarity, performance, and the small
							details that make software feel inevitable. I’ve shipped work with teams at{' '}
							<a
								class="font-medium text-[#136ef6] hover:text-[#0f5dcc]"
								href="https://example.com"
								target="_blank"
								rel="noopener noreferrer"
							>
								Example Co
							</a>
							and helped products reach broad, real-world audiences.
						</p>
						<p>
							I care about strong typography, fast interfaces, and honest communication. If that
							sounds like a fit, let’s talk.
						</p>
					</div>
				</div>
				<div class="min-w-0">
					<div class="flex items-start justify-between gap-3 sm:gap-4">
						<h2
							class="min-w-0 text-[clamp(3rem,calc(0.25rem+5.5vw),5rem)] font-bold leading-[1.2] tracking-[-0.04em] text-[#111111]"
						>
							Projects
						</h2>
						<div class="flex shrink-0 gap-2 pt-1 sm:pt-2">
							<button
								type="button"
								class="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-white shadow-sm ring-1 ring-black/5 sm:h-10 sm:w-10"
								aria-label="Previous projects"
							>
								<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
									<path
										d="M15 6l-6 6 6 6"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</button>
							<button
								type="button"
								class="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-white shadow-sm ring-1 ring-black/5 sm:h-10 sm:w-10"
								aria-label="Next projects"
							>
								<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
									<path
										d="M9 6l6 6-6 6"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</button>
						</div>
					</div>
					<ul class="mt-8 space-y-10 sm:mt-12 sm:space-y-12">
						<li class="flex gap-4 sm:gap-5">
							<div
								class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-700 text-xl font-extrabold text-white shadow-lg ring-1 ring-black/5 sm:h-[72px] sm:w-[72px] sm:rounded-2xl sm:text-2xl md:h-20 md:w-20"
							>
								P
							</div>
							<div class="min-w-0">
								<h3 class="text-[2rem] font-semibold leading-[1.5] tracking-tight text-[#111111]">
									Peakflow
								</h3>
								<p
									class="mt-1 text-2xl font-medium leading-[1.5] text-[rgba(17,17,17,0.5)] sm:mt-2"
								>
									Developer tooling that helps you understand what your app is doing—fast.
								</p>
							</div>
						</li>
						<li class="flex gap-4 sm:gap-5">
							<div
								class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#2563eb] text-lg font-extrabold tracking-tight text-white shadow-lg ring-1 ring-black/5 sm:h-[72px] sm:w-[72px] sm:rounded-2xl sm:text-xl md:h-20 md:w-20 md:text-2xl"
							>
								FM
							</div>
							<div class="min-w-0">
								<h3 class="text-[2rem] font-semibold leading-[1.5] tracking-tight text-[#111111]">
									Flitsmeister
								</h3>
								<p
									class="mt-1 text-2xl font-medium leading-[1.5] text-[rgba(17,17,17,0.5)] sm:mt-2"
								>
									A navigation companion used by millions—maps, alerts, and calm UX at scale.
								</p>
							</div>
						</li>
						<li class="flex gap-4 sm:gap-5">
							<div
								class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-zinc-900 shadow-lg ring-1 ring-black/5 sm:h-[72px] sm:w-[72px] sm:rounded-2xl md:h-20 md:w-20"
							>
								<div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563eb]/10 sm:h-12 sm:w-12">
									<div class="h-6 w-6 rounded-full bg-[#2563eb] sm:h-8 sm:w-8" />
								</div>
							</div>
							<div class="min-w-0">
								<h3 class="text-[2rem] font-semibold leading-[1.5] tracking-tight text-[#111111]">
									AllThingsAI
								</h3>
								<p
									class="mt-1 text-2xl font-medium leading-[1.5] text-[rgba(17,17,17,0.5)] sm:mt-2"
								>
									Exploring interfaces for AI workflows—simple surfaces, powerful systems underneath.
								</p>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</section>

		<!-- Service intro -->
		<section class="mx-auto w-[94%] max-w-[1800px] pb-20 sm:pb-24 md:pb-32">
			<div
				class="max-w-4xl space-y-6 text-2xl font-medium leading-[1.5] text-[rgba(17,17,17,0.5)] sm:space-y-8"
			>
				<p>
					I partner with teams to design and build interfaces that feel fast, intentional, and
					effortless. If you’re exploring something new—whether it’s a product refresh, a marketing
					site, or a complex app—
					<a
						class="font-semibold text-[#136ef6] hover:text-[#0f5dcc]"
						href="mailto:hello@example.com"
					>
						send me an email
					</a>
					or
					<a
						class="font-semibold text-[#136ef6] hover:text-[#0f5dcc]"
						href="https://x.com/"
						target="_blank"
						rel="noopener noreferrer"
					>
						DM on X
					</a>.
				</p>
			</div>
		</section>

		<!-- Alternating service rows -->
		<section
			class="mx-auto w-[94%] max-w-[1800px] space-y-16 pb-20 sm:space-y-24 md:space-y-32 md:pb-32"
		>
			<!-- Webdesign -->
			<div class="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20">
				<div class="order-2 min-w-0 lg:order-1">
					<div
						class="overflow-hidden rounded-2xl bg-zinc-900 shadow-xl ring-1 ring-black/5 sm:rounded-[1.75rem] md:rounded-[2rem]"
					>
						<div class="flex h-10 items-center gap-2 border-b border-white/10 px-3">
							<div class="flex gap-1.5">
								<span class="h-2 w-2 rounded-full bg-[#ff5f56]" />
								<span class="h-2 w-2 rounded-full bg-[#ffbd2e]" />
								<span class="h-2 w-2 rounded-full bg-[#27c93f]" />
							</div>
							<div
								class="mx-auto flex h-6 flex-1 max-w-[180px] items-center justify-center rounded-md bg-black/40 text-[10px] text-zinc-500"
							>
								example.com
							</div>
						</div>
						<div class="aspect-video bg-gradient-to-br from-zinc-800 to-zinc-950" />
					</div>
				</div>
				<div class="order-1 min-w-0 max-w-xl lg:order-2">
					<h2
						class="text-[clamp(3rem,calc(0.25rem+5.5vw),5rem)] font-bold leading-[1.2] tracking-[-0.04em] text-[#111111]"
					>
						Webdesign
					</h2>
					<p
						class="mt-4 text-2xl font-medium leading-[1.5] text-[rgba(17,17,17,0.5)] sm:mt-6"
					>
						Marketing sites and product pages with crisp hierarchy, confident typography, and
						layouts that scale from mobile to desktop without losing clarity.
					</p>
					<a
						href="mailto:hello@example.com"
						class="mt-6 inline-flex items-center gap-1 text-2xl font-medium text-[#136ef6] hover:text-[#0f5dcc] sm:mt-8"
					>
						Get in touch
						<span aria-hidden="true" class="text-2xl font-normal">&gt;</span>
					</a>
				</div>
			</div>

			<!-- App design -->
			<div class="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20">
				<div class="min-w-0 max-w-xl">
					<h2
						class="text-[clamp(3rem,calc(0.25rem+5.5vw),5rem)] font-bold leading-[1.2] tracking-[-0.04em] text-[#111111]"
					>
						App design
					</h2>
					<p
						class="mt-4 text-2xl font-medium leading-[1.5] text-[rgba(17,17,17,0.5)] sm:mt-6"
					>
						End-to-end mobile experiences—navigation models, motion that supports comprehension, and
						UI systems that stay consistent as the product grows.
					</p>
					<a
						href="mailto:hello@example.com"
						class="mt-6 inline-flex items-center gap-1 text-2xl font-medium text-[#136ef6] hover:text-[#0f5dcc] sm:mt-8"
					>
						Get in touch
						<span aria-hidden="true" class="text-2xl font-normal">&gt;</span>
					</a>
				</div>
				<div class="min-w-0">
					<div
						class="overflow-hidden rounded-2xl bg-zinc-950 shadow-xl ring-1 ring-black/5 sm:rounded-[1.75rem] md:rounded-[2rem]"
					>
						<div class="p-5 sm:p-8 md:p-10">
							<div
								class="mx-auto flex aspect-[9/16] max-w-[240px] flex-col overflow-hidden rounded-[2rem] bg-zinc-900 shadow-2xl ring-1 ring-white/10"
							>
								<div class="h-7 bg-zinc-800/80" />
								<div class="flex flex-1 flex-col gap-3 p-4">
									<div class="h-2.5 w-2/3 rounded-full bg-white/10" />
									<div class="flex-1 rounded-xl bg-white/5" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 3D design -->
			<div class="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20">
				<div class="order-2 min-w-0 lg:order-1">
					<div
						class="overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black shadow-xl ring-1 ring-black/5 sm:rounded-[1.75rem] md:rounded-[2rem]"
					>
						<div class="aspect-video w-full bg-[radial-gradient(circle_at_50%_20%,#3b3b46,transparent_55%)]" />
					</div>
				</div>
				<div class="order-1 min-w-0 max-w-xl lg:order-2">
					<h2
						class="text-[clamp(3rem,calc(0.25rem+5.5vw),5rem)] font-bold leading-[1.2] tracking-[-0.04em] text-[#111111]"
					>
						3D design
					</h2>
					<p
						class="mt-4 text-2xl font-medium leading-[1.5] text-[rgba(17,17,17,0.5)] sm:mt-6"
					>
						Product storytelling with depth—hero visuals, device mockups, and abstract 3D that stays
						on-brand and performance-aware.
					</p>
					<a
						href="mailto:hello@example.com"
						class="mt-6 inline-flex items-center gap-1 text-2xl font-medium text-[#136ef6] hover:text-[#0f5dcc] sm:mt-8"
					>
						Get in touch
						<span aria-hidden="true" class="text-2xl font-normal">&gt;</span>
					</a>
				</div>
			</div>

			<!-- React.js -->
			<div class="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20">
				<div class="min-w-0 max-w-xl">
					<h2
						class="text-[clamp(3rem,calc(0.25rem+5.5vw),5rem)] font-bold leading-[1.2] tracking-[-0.04em] text-[#111111]"
					>
						React.js
					</h2>
					<p
						class="mt-4 text-2xl font-medium leading-[1.5] text-[rgba(17,17,17,0.5)] sm:mt-6"
					>
						Interfaces built with modern React—server components where they help, client polish where
						it matters, and a focus on maintainable component architecture.
					</p>
					<a
						href="mailto:hello@example.com"
						class="mt-6 inline-flex items-center gap-1 text-2xl font-medium text-[#136ef6] hover:text-[#0f5dcc] sm:mt-8"
					>
						Get in touch
						<span aria-hidden="true" class="text-2xl font-normal">&gt;</span>
					</a>
				</div>
				<div class="min-w-0">
					<div
						class="overflow-hidden rounded-2xl bg-zinc-950 shadow-2xl ring-1 ring-black/10 sm:rounded-[1.75rem] md:rounded-[2rem]"
					>
						<div class="flex h-10 items-center gap-2 border-b border-white/10 px-3">
							<div class="flex gap-1.5">
								<span class="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
								<span class="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
								<span class="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
							</div>
							<div
								class="mx-auto flex h-7 flex-1 max-w-[220px] items-center justify-center rounded-md bg-black/40 text-[11px] text-zinc-500"
							>
								store.example.com
							</div>
						</div>
						<div class="aspect-video bg-gradient-to-b from-zinc-900 to-black p-4 sm:p-6">
							<div class="grid h-full grid-cols-3 gap-2 sm:gap-3">
								<div class="col-span-2 rounded-xl bg-white/5" />
								<div class="rounded-xl bg-white/5" />
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Framer websites -->
			<div class="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20">
				<div class="order-2 min-w-0 lg:order-1">
					<div
						class="overflow-hidden rounded-2xl bg-zinc-950 shadow-xl ring-1 ring-black/5 sm:rounded-[1.75rem] md:rounded-[2rem]"
					>
						<div class="aspect-video bg-gradient-to-br from-zinc-800 to-zinc-950 p-4 sm:p-6 md:p-8">
							<div class="grid h-full grid-cols-3 gap-3">
								<div class="rounded-lg bg-black/40" />
								<div class="col-span-2 rounded-lg bg-black/25" />
								<div class="col-span-3 rounded-lg bg-black/20" />
							</div>
						</div>
					</div>
				</div>
				<div class="order-1 min-w-0 max-w-xl lg:order-2">
					<h2
						class="text-[clamp(3rem,calc(0.25rem+5.5vw),5rem)] font-bold leading-[1.2] tracking-[-0.04em] text-[#111111]"
					>
						Framer websites
					</h2>
					<p
						class="mt-4 text-2xl font-medium leading-[1.5] text-[rgba(17,17,17,0.5)] sm:mt-6"
					>
						High-impact marketing builds in Framer—layout systems, CMS-driven sections, and motion
						that feels premium without getting in the way.
					</p>
					<a
						href="mailto:hello@example.com"
						class="mt-6 inline-flex items-center gap-1 text-2xl font-medium text-[#136ef6] hover:text-[#0f5dcc] sm:mt-8"
					>
						Get in touch
						<span aria-hidden="true" class="text-2xl font-normal">&gt;</span>
					</a>
				</div>
			</div>
		</section>

		<!-- Contact -->
		<section class="bg-[#f5f5f5] pb-20 pt-8 sm:pb-28 sm:pt-10 md:pb-36 md:pt-16">
			<div class="mx-auto w-[94%] max-w-[800px]">
				<div
					class="relative -mt-4 rounded-2xl bg-white p-6 shadow-[0_32px_90px_-36px_rgba(0,0,0,0.22)] sm:-mt-8 sm:rounded-[2rem] sm:p-10 md:rounded-[2.5rem] md:p-14 lg:p-16"
				>
					<h2 class="text-[2rem] font-semibold leading-[1.5] text-[#111111]">
						Contact
					</h2>
					<div
						class="mt-6 space-y-5 text-2xl font-medium leading-[1.5] text-[rgba(17,17,17,0.5)] sm:mt-8 sm:space-y-6"
					>
						<p>
							Tell me what you’re building, where you’re stuck, and what “great” looks like. I keep
							intake lightweight—no forms with twenty fields—just a clear conversation.
						</p>
						<p>
							If you value craft, speed, and a no-nonsense approach to product work, we’ll probably
							get along.
						</p>
						<p>
							Product intuition matters as much as pixels—if you want a partner who thinks in
							outcomes, not just deliverables, reach out.
						</p>
					</div>
					<div class="mt-8 flex justify-center sm:mt-12 md:mt-14">
						<a
							href="mailto:hello@example.com"
							class="inline-flex min-h-[52px] w-full max-w-sm items-center justify-center gap-2.5 rounded-full bg-black px-8 py-3.5 text-lg font-semibold text-white shadow-sm transition-opacity hover:opacity-90 sm:w-auto sm:max-w-none sm:px-9 sm:text-xl"
						>
							<svg class="h-[1.15em] w-[1.15em] shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<path
									d="M4 6h16v12H4V6zm2 0 6 5 6-5"
									stroke="currentColor"
									stroke-width="1.75"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							Send an email
						</a>
					</div>
				</div>
			</div>
		</section>

		<!-- Closing footer -->
		<footer class="bg-[#f5f5f5] pb-24 pt-6 sm:pb-32 sm:pt-8 md:pb-40">
			<div class="mx-auto w-[94%] max-w-[800px] text-center">
				<div class="text-3xl sm:text-4xl" aria-hidden="true">👋</div>
				<p
					class="mt-6 text-[2rem] font-semibold leading-[1.5] text-[#111111] sm:mt-8"
				>
					Thanks for checking my website
				</p>
				<div
					class="mt-6 space-y-2 text-2xl font-medium leading-[1.5] text-[rgba(17,17,17,0.5)] sm:mt-8"
				>
					<p>
						<a
							class="break-words hover:text-[#111111]"
							href="mailto:hello@example.com"
						>
							hello@example.com
						</a>
					</p>
					<p>
						<a
							class="break-words hover:text-[#111111]"
							href="https://x.com/"
							target="_blank"
							rel="noopener noreferrer"
						>
							x.com/zeddrix
						</a>
					</p>
				</div>
			</div>
		</footer>
	</main>
</div>
