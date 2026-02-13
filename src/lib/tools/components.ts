import type { Component } from 'svelte';

export const toolComponents: Record<string, () => Promise<{ default: Component }>> = {
	// Converters
	'json-yaml': () => import('./converters/json-yaml/json-yaml.svelte'),
	'number-base': () => import('./converters/number-base/number-base-converter.svelte'),
	'timestamp': () => import('./converters/timestamp/timestamp-converter.svelte'),
	'cron-parser': () => import('./converters/cron-parser/cron-parser.svelte'),

	// Encoders / Decoders
	'base64-text': () => import('./encoders-decoders/base64-text/base64-text.svelte'),
	'base64-image': () => import('./encoders-decoders/base64-image/base64-image.svelte'),
	'url-encoder': () => import('./encoders-decoders/url/url-encoder.svelte'),
	'html-encoder': () => import('./encoders-decoders/html/html-encoder.svelte'),
	'jwt-decoder': () => import('./encoders-decoders/jwt/jwt-decoder.svelte'),
	'gzip': () => import('./encoders-decoders/gzip/gzip.svelte'),

	// Formatters
	'json-formatter': () => import('./formatters/json/json-formatter.svelte'),
	'xml-formatter': () => import('./formatters/xml/xml-formatter.svelte'),
	'sql-formatter': () => import('./formatters/sql/sql-formatter.svelte'),

	// Generators
	'uuid-generator': () => import('./generators/uuid/uuid-generator.svelte'),
	'hash-generator': () => import('./generators/hash/hash-generator.svelte'),
	'password-generator': () => import('./generators/password/password-generator.svelte'),
	'lorem-ipsum': () => import('./generators/lorem-ipsum/lorem-ipsum.svelte'),
	'checksum': () => import('./generators/checksum/checksum.svelte'),

	// Graphic Tools
	'color-picker': () => import('./graphic-tools/color-picker/color-picker.svelte'),

	// Text Tools
	'string-utilities': () => import('./text-tools/string-utilities/string-utilities.svelte'),
	'regex-tester': () => import('./text-tools/regex-tester/regex-tester.svelte'),
	'text-diff': () => import('./text-tools/text-diff/text-diff.svelte'),
	'markdown-preview': () => import('./text-tools/markdown-preview/markdown-preview.svelte'),
	'xml-validator': () => import('./text-tools/xml-validator/xml-validator.svelte'),
	'json-path': () => import('./text-tools/json-path/json-path.svelte'),
	'escape-unescape': () => import('./text-tools/escape-unescape/escape-unescape.svelte'),
	'text-inspector': () => import('./text-tools/text-inspector/text-inspector.svelte'),
	'list-comparer': () => import('./text-tools/list-comparer/list-comparer.svelte')
};
