import type { Component } from 'svelte';

// Tool icons
import FileJsonIcon from '@lucide/svelte/icons/file-json';
import HashIcon from '@lucide/svelte/icons/hash';
import ClockIcon from '@lucide/svelte/icons/clock';
import TimerIcon from '@lucide/svelte/icons/timer';
import FileTextIcon from '@lucide/svelte/icons/file-text';
import ImageIcon from '@lucide/svelte/icons/image';
import LinkIcon from '@lucide/svelte/icons/link';
import CodeIcon from '@lucide/svelte/icons/code';
import KeyRoundIcon from '@lucide/svelte/icons/key-round';
import ArchiveIcon from '@lucide/svelte/icons/archive';
import BracesIcon from '@lucide/svelte/icons/braces';
import FileCodeIcon from '@lucide/svelte/icons/file-code';
import DatabaseIcon from '@lucide/svelte/icons/database';
import FingerprintIcon from '@lucide/svelte/icons/fingerprint';
import ShieldCheckIcon from '@lucide/svelte/icons/shield-check';
import LockIcon from '@lucide/svelte/icons/lock';
import TextIcon from '@lucide/svelte/icons/text';
import FileCheckIcon from '@lucide/svelte/icons/file-check';
import PaletteIcon from '@lucide/svelte/icons/palette';
import EyeIcon from '@lucide/svelte/icons/eye';
import Minimize2Icon from '@lucide/svelte/icons/minimize-2';
import FileImageIcon from '@lucide/svelte/icons/file-image';
import CaseSensitiveIcon from '@lucide/svelte/icons/case-sensitive';
import RegexIcon from '@lucide/svelte/icons/regex';
import DiffIcon from '@lucide/svelte/icons/diff';
import FileCode2Icon from '@lucide/svelte/icons/file-code-2';
import SearchCodeIcon from '@lucide/svelte/icons/search-code';
import ShieldIcon from '@lucide/svelte/icons/shield';
import ScanTextIcon from '@lucide/svelte/icons/scan-text';
import ListChecksIcon from '@lucide/svelte/icons/list-checks';

export type ToolCategory =
	| 'converters'
	| 'encoders-decoders'
	| 'formatters'
	| 'generators'
	| 'graphic-tools'
	| 'text-tools';

export interface ToolDefinition {
	slug: string;
	name: string;
	description: string;
	category: ToolCategory;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon: Component<any>;
	keywords: string[];
	implemented: boolean;
}

export interface CategoryDefinition {
	slug: ToolCategory;
	name: string;
}

export const categories: CategoryDefinition[] = [
	{ slug: 'converters', name: 'Converters' },
	{ slug: 'encoders-decoders', name: 'Encoders / Decoders' },
	{ slug: 'formatters', name: 'Formatters' },
	{ slug: 'generators', name: 'Generators' },
	{ slug: 'graphic-tools', name: 'Graphic Tools' },
	{ slug: 'text-tools', name: 'Text Tools' }
];

export const tools: ToolDefinition[] = [
	// Converters
	{
		slug: 'json-yaml',
		name: 'JSON <> YAML',
		description: 'Convert JSON to YAML and vice versa',
		category: 'converters',
		icon: FileJsonIcon,
		keywords: ['json', 'yaml', 'convert', 'transform'],
		implemented: false
	},
	{
		slug: 'number-base',
		name: 'Number Base',
		description: 'Convert numbers between different bases',
		category: 'converters',
		icon: HashIcon,
		keywords: ['number', 'base', 'binary', 'hex', 'octal', 'decimal'],
		implemented: false
	},
	{
		slug: 'timestamp',
		name: 'Timestamp',
		description: 'Convert Unix timestamps to human-readable dates',
		category: 'converters',
		icon: ClockIcon,
		keywords: ['timestamp', 'unix', 'date', 'time', 'epoch'],
		implemented: false
	},
	{
		slug: 'cron-parser',
		name: 'Cron Parser',
		description: 'Parse and validate cron expressions',
		category: 'converters',
		icon: TimerIcon,
		keywords: ['cron', 'schedule', 'timer', 'parse'],
		implemented: false
	},

	// Encoders / Decoders
	{
		slug: 'base64-text',
		name: 'Base64 Text',
		description: 'Encode and decode Base64 text',
		category: 'encoders-decoders',
		icon: FileTextIcon,
		keywords: ['base64', 'encode', 'decode', 'text'],
		implemented: true
	},
	{
		slug: 'base64-image',
		name: 'Base64 Image',
		description: 'Encode and decode Base64 images',
		category: 'encoders-decoders',
		icon: ImageIcon,
		keywords: ['base64', 'image', 'encode', 'decode', 'png', 'jpg'],
		implemented: false
	},
	{
		slug: 'url-encoder',
		name: 'URL Encoder / Decoder',
		description: 'Encode and decode URL components',
		category: 'encoders-decoders',
		icon: LinkIcon,
		keywords: ['url', 'encode', 'decode', 'uri', 'percent'],
		implemented: true
	},
	{
		slug: 'html-encoder',
		name: 'HTML Encoder / Decoder',
		description: 'Encode and decode HTML entities',
		category: 'encoders-decoders',
		icon: CodeIcon,
		keywords: ['html', 'encode', 'decode', 'entities', 'escape'],
		implemented: true
	},
	{
		slug: 'jwt-decoder',
		name: 'JWT Decoder',
		description: 'Decode and inspect JWT tokens',
		category: 'encoders-decoders',
		icon: KeyRoundIcon,
		keywords: ['jwt', 'token', 'decode', 'json', 'web', 'auth'],
		implemented: false
	},
	{
		slug: 'gzip',
		name: 'GZip Compress / Decompress',
		description: 'Compress and decompress GZip data',
		category: 'encoders-decoders',
		icon: ArchiveIcon,
		keywords: ['gzip', 'compress', 'decompress', 'zip'],
		implemented: false
	},

	// Formatters
	{
		slug: 'json-formatter',
		name: 'JSON Formatter',
		description: 'Format and validate JSON data',
		category: 'formatters',
		icon: BracesIcon,
		keywords: ['json', 'format', 'beautify', 'minify', 'validate'],
		implemented: true
	},
	{
		slug: 'xml-formatter',
		name: 'XML Formatter',
		description: 'Format and validate XML data',
		category: 'formatters',
		icon: FileCodeIcon,
		keywords: ['xml', 'format', 'beautify', 'validate'],
		implemented: false
	},
	{
		slug: 'sql-formatter',
		name: 'SQL Formatter',
		description: 'Format SQL queries',
		category: 'formatters',
		icon: DatabaseIcon,
		keywords: ['sql', 'format', 'beautify', 'query'],
		implemented: false
	},

	// Generators
	{
		slug: 'uuid-generator',
		name: 'UUID Generator',
		description: 'Generate UUIDs (v4)',
		category: 'generators',
		icon: FingerprintIcon,
		keywords: ['uuid', 'guid', 'generate', 'random', 'unique'],
		implemented: true
	},
	{
		slug: 'hash-generator',
		name: 'Hash Generator',
		description: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes',
		category: 'generators',
		icon: ShieldCheckIcon,
		keywords: ['hash', 'md5', 'sha', 'sha256', 'sha512', 'checksum'],
		implemented: true
	},
	{
		slug: 'password-generator',
		name: 'Password Generator',
		description: 'Generate secure random passwords',
		category: 'generators',
		icon: LockIcon,
		keywords: ['password', 'generate', 'random', 'secure'],
		implemented: false
	},
	{
		slug: 'lorem-ipsum',
		name: 'Lorem Ipsum',
		description: 'Generate Lorem Ipsum placeholder text',
		category: 'generators',
		icon: TextIcon,
		keywords: ['lorem', 'ipsum', 'placeholder', 'text', 'dummy'],
		implemented: false
	},
	{
		slug: 'checksum',
		name: 'Checksum File',
		description: 'Calculate file checksums',
		category: 'generators',
		icon: FileCheckIcon,
		keywords: ['checksum', 'file', 'hash', 'verify', 'integrity'],
		implemented: false
	},

	// Graphic Tools
	{
		slug: 'color-picker',
		name: 'Color Picker',
		description: 'Pick colors and convert between formats',
		category: 'graphic-tools',
		icon: PaletteIcon,
		keywords: ['color', 'picker', 'hex', 'rgb', 'hsl', 'convert'],
		implemented: false
	},
	{
		slug: 'color-blindness',
		name: 'Color Blindness Simulator',
		description: 'Simulate color blindness on images',
		category: 'graphic-tools',
		icon: EyeIcon,
		keywords: ['color', 'blindness', 'simulate', 'accessibility'],
		implemented: false
	},
	{
		slug: 'image-converter',
		name: 'Image Converter',
		description: 'Convert images between formats',
		category: 'graphic-tools',
		icon: ImageIcon,
		keywords: ['image', 'convert', 'png', 'jpg', 'webp', 'gif'],
		implemented: false
	},
	{
		slug: 'image-compressor',
		name: 'Image Compressor',
		description: 'Compress images to reduce file size',
		category: 'graphic-tools',
		icon: Minimize2Icon,
		keywords: ['image', 'compress', 'optimize', 'reduce', 'size'],
		implemented: false
	},
	{
		slug: 'png-jpg-converter',
		name: 'PNG / JPG Converter',
		description: 'Convert between PNG and JPG formats',
		category: 'graphic-tools',
		icon: FileImageIcon,
		keywords: ['png', 'jpg', 'jpeg', 'convert', 'image'],
		implemented: false
	},

	// Text Tools
	{
		slug: 'string-utilities',
		name: 'String Utilities',
		description: 'Convert text case, count characters, and more',
		category: 'text-tools',
		icon: CaseSensitiveIcon,
		keywords: ['string', 'text', 'case', 'upper', 'lower', 'camel', 'snake', 'count'],
		implemented: true
	},
	{
		slug: 'regex-tester',
		name: 'Regex Tester',
		description: 'Test and debug regular expressions',
		category: 'text-tools',
		icon: RegexIcon,
		keywords: ['regex', 'regular', 'expression', 'test', 'match', 'pattern'],
		implemented: false
	},
	{
		slug: 'text-diff',
		name: 'Text Diff',
		description: 'Compare two texts and highlight differences',
		category: 'text-tools',
		icon: DiffIcon,
		keywords: ['diff', 'compare', 'text', 'difference', 'merge'],
		implemented: false
	},
	{
		slug: 'markdown-preview',
		name: 'Markdown Preview',
		description: 'Preview Markdown with live rendering',
		category: 'text-tools',
		icon: FileTextIcon,
		keywords: ['markdown', 'preview', 'render', 'md'],
		implemented: false
	},
	{
		slug: 'xml-validator',
		name: 'XML Validator',
		description: 'Validate XML syntax and structure',
		category: 'text-tools',
		icon: FileCode2Icon,
		keywords: ['xml', 'validate', 'syntax', 'check'],
		implemented: false
	},
	{
		slug: 'json-path',
		name: 'JSON Path Tester',
		description: 'Test JSONPath expressions against JSON data',
		category: 'text-tools',
		icon: SearchCodeIcon,
		keywords: ['json', 'path', 'jsonpath', 'query', 'test'],
		implemented: false
	},
	{
		slug: 'escape-unescape',
		name: 'Escape / Unescape',
		description: 'Escape and unescape strings for various languages',
		category: 'text-tools',
		icon: ShieldIcon,
		keywords: ['escape', 'unescape', 'string', 'special', 'characters'],
		implemented: false
	},
	{
		slug: 'text-inspector',
		name: 'Text Inspector',
		description: 'Inspect text encoding, line endings, and whitespace',
		category: 'text-tools',
		icon: ScanTextIcon,
		keywords: ['text', 'inspect', 'encoding', 'whitespace', 'line', 'endings'],
		implemented: false
	},
	{
		slug: 'list-comparer',
		name: 'List Comparer',
		description: 'Compare and analyze two lists',
		category: 'text-tools',
		icon: ListChecksIcon,
		keywords: ['list', 'compare', 'diff', 'intersection', 'union'],
		implemented: false
	}
];

// Derived maps
export const toolsByCategory = new Map<ToolCategory, ToolDefinition[]>();
for (const tool of tools) {
	const list = toolsByCategory.get(tool.category) ?? [];
	list.push(tool);
	toolsByCategory.set(tool.category, list);
}

export const toolBySlug = new Map<string, ToolDefinition>();
for (const tool of tools) {
	toolBySlug.set(tool.slug, tool);
}

export const categoryBySlug = new Map<ToolCategory, CategoryDefinition>();
for (const cat of categories) {
	categoryBySlug.set(cat.slug, cat);
}

export function searchTools(query: string): ToolDefinition[] {
	const q = query.toLowerCase().trim();
	if (!q) return tools;
	return tools.filter((tool) => {
		return (
			tool.name.toLowerCase().includes(q) ||
			tool.description.toLowerCase().includes(q) ||
			tool.keywords.some((kw) => kw.includes(q))
		);
	});
}
