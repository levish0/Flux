import type { Component } from 'svelte';

export const toolComponents: Record<string, () => Promise<{ default: Component }>> = {
	'base64-text': () => import('./encoders-decoders/base64-text/base64-text.svelte'),
	'url-encoder': () => import('./encoders-decoders/url/url-encoder.svelte'),
	'html-encoder': () => import('./encoders-decoders/html/html-encoder.svelte'),
	'json-formatter': () => import('./formatters/json/json-formatter.svelte'),
	'uuid-generator': () => import('./generators/uuid/uuid-generator.svelte'),
	'hash-generator': () => import('./generators/hash/hash-generator.svelte'),
	'string-utilities': () => import('./text-tools/string-utilities/string-utilities.svelte')
};
