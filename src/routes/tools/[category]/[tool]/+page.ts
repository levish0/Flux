import { toolBySlug, categoryBySlug } from '$lib/tools/registry';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const { category, tool } = params;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const categoryDef = categoryBySlug.get(category as any);
	if (!categoryDef) {
		error(404, `Category "${category}" not found`);
	}

	const toolDef = toolBySlug.get(tool);
	if (!toolDef || toolDef.category !== category) {
		error(404, `Tool "${tool}" not found in category "${category}"`);
	}

	return {
		tool: toolDef,
		category: categoryDef
	};
};
