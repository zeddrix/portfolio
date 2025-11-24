import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 3212
	},
	build: {
		// Minification settings
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true, // Remove console.logs in production
				drop_debugger: true,
				pure_funcs: ['console.log', 'console.debug', 'console.info']
			}
		},
		// Chunk size warnings
		chunkSizeWarningLimit: 1000,
		// Enable CSS code splitting
		cssCodeSplit: true,
		// Rollup options for better tree-shaking
		rollupOptions: {
			output: {
				// Manual chunks for better code splitting
				manualChunks: (id) => {
					// Vendor chunks
					if (id.includes('node_modules')) {
						// Supabase in its own chunk
						if (id.includes('@supabase')) {
							return 'vendor-supabase';
						}
						// Motion/animation libraries
						if (id.includes('motion') || id.includes('animate')) {
							return 'vendor-animation';
						}
						// Cloudinary
						if (id.includes('cloudinary')) {
							return 'vendor-cloudinary';
						}
						// Rich text editor and heavy components
						if (id.includes('tiptap') || id.includes('prosemirror') || id.includes('codemirror')) {
							return 'vendor-editor';
						}
						// Everything else
						return 'vendor';
					}
				}
			}
		},
		// Source maps for production (can be disabled for smaller builds)
		sourcemap: false
	},
	optimizeDeps: {
		// Include dependencies that need pre-bundling
		include: ['motion'],
		// Exclude large dependencies from pre-bundling
		exclude: []
	}
});
