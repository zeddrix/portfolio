/**
 * Timeline item interface for experience, certifications, etc.
 */
export interface TimelineItem {
	id: string;
	title: string;
	subtitle: string;
	description: string;
	startDate: string;
	endDate: string | null;
	isCurrent?: boolean;
	url?: string | null;
}
