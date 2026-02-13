import { categoryBySlug, toolsByCategory } from '$lib/tools/registry';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const { category } = params;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const categoryDef = categoryBySlug.get(category as any);
	if (!categoryDef) {
		error(404, `Category "${category}" not found`);
	}

	const tools = toolsByCategory.get(categoryDef.slug) ?? [];

	return {
		category: categoryDef,
		tools
	};
};
