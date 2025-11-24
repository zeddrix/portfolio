<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import Underline from '@tiptap/extension-underline';
	import Placeholder from '@tiptap/extension-placeholder';

	// Props
	export let value: string = '';
	export let placeholder: string = 'Start typing...';
	export let editorClass: string = '';
	export let minHeight: string = '200px';

	let editor: Editor | undefined = undefined;
	let editorElement: HTMLDivElement;

	// Create editor instance
	onMount(() => {
		editor = new Editor({
			element: editorElement,
			extensions: [
				StarterKit.configure({
					heading: {
						levels: [2, 3, 4]
					}
				}),
				Link.configure({
					openOnClick: false,
					HTMLAttributes: {
						class: 'text-primary underline'
					}
				}),
				Underline,
				Placeholder.configure({
					placeholder
				})
			],
			content: value,
			editorProps: {
				attributes: {
					class: `prose prose-sm max-w-none focus:outline-none ${editorClass}`
				}
			},
			onUpdate: ({ editor }) => {
				value = editor.getHTML();
			}
		});
	});

	// Cleanup on destroy
	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	// Update editor content when value prop changes externally
	$: if (editor && value !== editor.getHTML()) {
		editor.commands.setContent(value);
	}

	// Toolbar action functions
	function toggleBold() {
		editor?.chain().focus().toggleBold().run();
	}

	function toggleItalic() {
		editor?.chain().focus().toggleItalic().run();
	}

	function toggleUnderline() {
		editor?.chain().focus().toggleUnderline().run();
	}

	function toggleStrike() {
		editor?.chain().focus().toggleStrike().run();
	}

	function toggleCode() {
		editor?.chain().focus().toggleCode().run();
	}

	function toggleHeading(level: 2 | 3 | 4) {
		editor?.chain().focus().toggleHeading({ level }).run();
	}

	function toggleBulletList() {
		editor?.chain().focus().toggleBulletList().run();
	}

	function toggleOrderedList() {
		editor?.chain().focus().toggleOrderedList().run();
	}

	function toggleCodeBlock() {
		editor?.chain().focus().toggleCodeBlock().run();
	}

	function toggleBlockquote() {
		editor?.chain().focus().toggleBlockquote().run();
	}

	function setLink() {
		const url = window.prompt('Enter URL:');
		if (url) {
			editor?.chain().focus().setLink({ href: url }).run();
		}
	}

	function unsetLink() {
		editor?.chain().focus().unsetLink().run();
	}

	function undo() {
		editor?.chain().focus().undo().run();
	}

	function redo() {
		editor?.chain().focus().redo().run();
	}

	// Check if commands are active
	$: isBold = editor?.isActive('bold') ?? false;
	$: isItalic = editor?.isActive('italic') ?? false;
	$: isUnderline = editor?.isActive('underline') ?? false;
	$: isStrike = editor?.isActive('strike') ?? false;
	$: isCode = editor?.isActive('code') ?? false;
	$: isH2 = editor?.isActive('heading', { level: 2 }) ?? false;
	$: isH3 = editor?.isActive('heading', { level: 3 }) ?? false;
	$: isH4 = editor?.isActive('heading', { level: 4 }) ?? false;
	$: isBulletList = editor?.isActive('bulletList') ?? false;
	$: isOrderedList = editor?.isActive('orderedList') ?? false;
	$: isCodeBlock = editor?.isActive('codeBlock') ?? false;
	$: isBlockquote = editor?.isActive('blockquote') ?? false;
	$: isLink = editor?.isActive('link') ?? false;
</script>

<div class="rich-text-editor border border-border rounded-lg overflow-hidden bg-surface">
	<!-- Toolbar -->
	<div
		class="toolbar flex flex-wrap gap-1 p-2 border-b border-border bg-background/50 sticky top-0 z-10"
	>
		<!-- Text formatting -->
		<div class="flex gap-1 border-r border-border pr-2">
			<button
				type="button"
				on:click={toggleBold}
				class="toolbar-btn {isBold ? 'active' : ''}"
				title="Bold (Ctrl+B)"
			>
				<span class="material-icons text-lg">format_bold</span>
			</button>
			<button
				type="button"
				on:click={toggleItalic}
				class="toolbar-btn {isItalic ? 'active' : ''}"
				title="Italic (Ctrl+I)"
			>
				<span class="material-icons text-lg">format_italic</span>
			</button>
			<button
				type="button"
				on:click={toggleUnderline}
				class="toolbar-btn {isUnderline ? 'active' : ''}"
				title="Underline (Ctrl+U)"
			>
				<span class="material-icons text-lg">format_underlined</span>
			</button>
			<button
				type="button"
				on:click={toggleStrike}
				class="toolbar-btn {isStrike ? 'active' : ''}"
				title="Strikethrough"
			>
				<span class="material-icons text-lg">strikethrough_s</span>
			</button>
			<button
				type="button"
				on:click={toggleCode}
				class="toolbar-btn {isCode ? 'active' : ''}"
				title="Inline code"
			>
				<span class="material-icons text-lg">code</span>
			</button>
		</div>

		<!-- Headings -->
		<div class="flex gap-1 border-r border-border pr-2">
			<button
				type="button"
				on:click={() => toggleHeading(2)}
				class="toolbar-btn {isH2 ? 'active' : ''}"
				title="Heading 2"
			>
				H2
			</button>
			<button
				type="button"
				on:click={() => toggleHeading(3)}
				class="toolbar-btn {isH3 ? 'active' : ''}"
				title="Heading 3"
			>
				H3
			</button>
			<button
				type="button"
				on:click={() => toggleHeading(4)}
				class="toolbar-btn {isH4 ? 'active' : ''}"
				title="Heading 4"
			>
				H4
			</button>
		</div>

		<!-- Lists -->
		<div class="flex gap-1 border-r border-border pr-2">
			<button
				type="button"
				on:click={toggleBulletList}
				class="toolbar-btn {isBulletList ? 'active' : ''}"
				title="Bullet list"
			>
				<span class="material-icons text-lg">format_list_bulleted</span>
			</button>
			<button
				type="button"
				on:click={toggleOrderedList}
				class="toolbar-btn {isOrderedList ? 'active' : ''}"
				title="Numbered list"
			>
				<span class="material-icons text-lg">format_list_numbered</span>
			</button>
		</div>

		<!-- Code block & blockquote -->
		<div class="flex gap-1 border-r border-border pr-2">
			<button
				type="button"
				on:click={toggleCodeBlock}
				class="toolbar-btn {isCodeBlock ? 'active' : ''}"
				title="Code block"
			>
				<span class="material-icons text-lg">code_blocks</span>
			</button>
			<button
				type="button"
				on:click={toggleBlockquote}
				class="toolbar-btn {isBlockquote ? 'active' : ''}"
				title="Blockquote"
			>
				<span class="material-icons text-lg">format_quote</span>
			</button>
		</div>

		<!-- Links -->
		<div class="flex gap-1 border-r border-border pr-2">
			<button
				type="button"
				on:click={setLink}
				class="toolbar-btn {isLink ? 'active' : ''}"
				title="Add link"
			>
				<span class="material-icons text-lg">link</span>
			</button>
			<button
				type="button"
				on:click={unsetLink}
				class="toolbar-btn"
				title="Remove link"
				disabled={!isLink}
			>
				<span class="material-icons text-lg">link_off</span>
			</button>
		</div>

		<!-- Undo/Redo -->
		<div class="flex gap-1">
			<button type="button" on:click={undo} class="toolbar-btn" title="Undo (Ctrl+Z)">
				<span class="material-icons text-lg">undo</span>
			</button>
			<button type="button" on:click={redo} class="toolbar-btn" title="Redo (Ctrl+Shift+Z)">
				<span class="material-icons text-lg">redo</span>
			</button>
		</div>
	</div>

	<!-- Editor content area -->
	<div
		bind:this={editorElement}
		class="editor-content p-4 bg-surface"
		style="min-height: {minHeight};"
	></div>
</div>

<style>
	.toolbar-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 4px;
		background: transparent;
		color: rgb(var(--color-text-secondary));
		border: 1px solid transparent;
		transition: all 0.2s;
		cursor: pointer;
		font-size: 14px;
		font-weight: 600;
	}

	.toolbar-btn:hover:not(:disabled) {
		background: rgb(var(--color-primary) / 0.1);
		color: rgb(var(--color-primary));
		border-color: rgb(var(--color-primary) / 0.2);
	}

	.toolbar-btn.active {
		background: rgb(var(--color-primary) / 0.15);
		color: rgb(var(--color-primary));
		border-color: rgb(var(--color-primary) / 0.3);
	}

	.toolbar-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	:global(.editor-content .ProseMirror) {
		outline: none;
		min-height: 200px;
		color: rgb(var(--color-text-primary));
	}

	:global(.editor-content .ProseMirror p.is-editor-empty:first-child::before) {
		content: attr(data-placeholder);
		float: left;
		color: rgb(var(--color-text-secondary) / 0.5);
		pointer-events: none;
		height: 0;
	}

	:global(.editor-content .ProseMirror h2) {
		font-size: 1.5em;
		font-weight: 700;
		margin-top: 1em;
		margin-bottom: 0.5em;
		color: rgb(var(--color-text-primary));
	}

	:global(.editor-content .ProseMirror h3) {
		font-size: 1.25em;
		font-weight: 600;
		margin-top: 1em;
		margin-bottom: 0.5em;
		color: rgb(var(--color-text-primary));
	}

	:global(.editor-content .ProseMirror h4) {
		font-size: 1.1em;
		font-weight: 600;
		margin-top: 1em;
		margin-bottom: 0.5em;
		color: rgb(var(--color-text-primary));
	}

	:global(.editor-content .ProseMirror ul),
	:global(.editor-content .ProseMirror ol) {
		padding-left: 1.5em;
		margin: 0.75em 0;
	}

	:global(.editor-content .ProseMirror li) {
		margin: 0.25em 0;
	}

	:global(.editor-content .ProseMirror code) {
		background: rgb(var(--color-primary) / 0.1);
		color: rgb(var(--color-primary));
		padding: 0.2em 0.4em;
		border-radius: 3px;
		font-size: 0.9em;
		font-family: 'Courier New', monospace;
	}

	:global(.editor-content .ProseMirror pre) {
		background: rgb(var(--color-background));
		border: 1px solid rgb(var(--color-border));
		border-radius: 4px;
		padding: 1em;
		overflow-x: auto;
		margin: 1em 0;
	}

	:global(.editor-content .ProseMirror pre code) {
		background: none;
		padding: 0;
		color: rgb(var(--color-text-primary));
	}

	:global(.editor-content .ProseMirror blockquote) {
		border-left: 4px solid rgb(var(--color-primary));
		padding-left: 1em;
		margin: 1em 0;
		color: rgb(var(--color-text-secondary));
		font-style: italic;
	}

	:global(.editor-content .ProseMirror a) {
		color: rgb(var(--color-primary));
		text-decoration: underline;
	}
</style>
