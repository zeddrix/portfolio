/**
 * Layout type definitions matching database schema
 */
export type LayoutType = 'case_study' | 'single_page' | 'bento_grid';

/**
 * Layout display names for UI
 */
export const LAYOUT_NAMES: Record<LayoutType, string> = {
	case_study: 'Case Study',
	single_page: 'Single Page',
	bento_grid: 'Bento Grid'
};

/**
 * Layout descriptions for tooltips
 */
export const LAYOUT_DESCRIPTIONS: Record<LayoutType, string> = {
	case_study: 'Full-width case studies with detailed project breakdowns',
	single_page: 'Traditional single-page scrolling portfolio',
	bento_grid: 'Modern grid layout with interactive cards'
};

/**
 * Default layout fallback
 */
export const DEFAULT_LAYOUT: LayoutType = 'case_study';
