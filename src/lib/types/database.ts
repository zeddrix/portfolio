/**
 * Database types generated from Supabase schema
 * These types match the tables defined in scripts/db/migrations/
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Enum types
export type PaletteType =
	| 'cyber_blue'
	| 'neon_nights'
	| 'sunset_ember'
	| 'forest_zen'
	| 'monochrome_pro'
	| 'purple_haze'
	| 'ocean_deep';

export type ThemeModeType = 'dark' | 'light';
export type SkillCategoryType = 'programming' | 'frontend' | 'backend' | 'devops' | 'tools';
export type AdminRoleType = 'admin' | 'editor';

// New enum types from UI overhaul
export type HeroAnimationType = 'fade_up' | 'typewriter' | 'slide_in';
export type ButtonTextModeType = 'predefined' | 'custom' | 'category';
export type StatsDisplayModeType = 'counters' | 'icons' | 'categories' | 'hybrid';

export interface GalleryImage {
	url: string;
	cloudinary_id: string;
	media_type: 'image' | 'video' | 'gif';
}

// New table types from UI overhaul
export interface ColorPaletteRow {
	id: string;
	name: string;
	display_name: string;
	description: string | null;
	is_system: boolean;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface ColorCombination {
	id: string;
	palette_id: string;
	name: string;
	is_default: boolean;
	primary_color: string;
	secondary_color: string;
	accent_color: string;
	background_dark: string;
	background_light: string;
	surface_dark: string;
	surface_light: string;
	text_primary_dark: string;
	text_primary_light: string;
	text_secondary_dark: string;
	text_secondary_light: string;
	border_dark: string;
	border_light: string;
	display_order: number;
	created_at: string;
	updated_at: string;
}

export interface ProjectCategory {
	id: string;
	name: string;
	display_name: string;
	default_button_text: string;
	display_order: number;
	created_at: string;
}

export interface ButtonTextPreset {
	id: string;
	text: string;
	category_id: string | null;
	is_active: boolean;
	display_order: number;
	created_at: string;
}

export interface StatsCounter {
	id: string;
	label: string;
	value: string;
	suffix: string | null;
	icon: string | null;
	is_visible: boolean;
	display_order: number;
	created_at: string;
	updated_at: string;
}

export interface DevelopmentProcessStep {
	id: string;
	title: string;
	description: string;
	icon: string | null;
	is_visible: boolean;
	display_order: number;
	created_at: string;
	updated_at: string;
}

export interface ProjectDeliverable {
	id: string;
	title: string;
	description: string;
	icon: string | null;
	is_visible: boolean;
	display_order: number;
	created_at: string;
	updated_at: string;
}

export interface AITool {
	id: string;
	name: string;
	description: string | null;
	icon_url: string | null;
	website_url: string | null;
	is_visible: boolean;
	display_order: number;
	created_at: string;
	updated_at: string;
}

export interface AIProductivityStat {
	id: string;
	label: string;
	value: string;
	description: string | null;
	is_visible: boolean;
	display_order: number;
	created_at: string;
	updated_at: string;
}

export interface Database {
	public: {
		Tables: {
			site_settings: {
				Row: {
					id: string;
					active_palette: PaletteType;
					theme_mode: ThemeModeType;
					maintenance_mode: boolean;
					// New hero settings
					hero_animation_type: HeroAnimationType;
					hero_intro_duration: number;
					hero_video_duration: number;
					// Profile picture locations
					profile_picture_locations: string[];
					// Stats settings
					stats_display_mode: StatsDisplayModeType;
					stats_counters_enabled: boolean;
					stats_icons_enabled: boolean;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					active_palette?: PaletteType;
					theme_mode?: ThemeModeType;
					maintenance_mode?: boolean;
					hero_animation_type?: HeroAnimationType;
					hero_intro_duration?: number;
					hero_video_duration?: number;
					profile_picture_locations?: string[];
					stats_display_mode?: StatsDisplayModeType;
					stats_counters_enabled?: boolean;
					stats_icons_enabled?: boolean;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					active_palette?: PaletteType;
					theme_mode?: ThemeModeType;
					maintenance_mode?: boolean;
					hero_animation_type?: HeroAnimationType;
					hero_intro_duration?: number;
					hero_video_duration?: number;
					profile_picture_locations?: string[];
					stats_display_mode?: StatsDisplayModeType;
					stats_counters_enabled?: boolean;
					stats_icons_enabled?: boolean;
					created_at?: string;
					updated_at?: string;
				};
			};
			profile: {
				Row: {
					id: string;
					full_name: string;
					tagline: string;
					bio: string;
					email: string;
					phone: string | null;
					linkedin_url: string | null;
					github_url: string | null;
					website_url: string | null;
					profile_image_url: string | null;
					profile_image_cloudinary_id: string | null;
					location: string | null;
					available_for_work: boolean;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					full_name: string;
					tagline: string;
					bio: string;
					email: string;
					phone?: string | null;
					linkedin_url?: string | null;
					github_url?: string | null;
					website_url?: string | null;
					profile_image_url?: string | null;
					profile_image_cloudinary_id?: string | null;
					location?: string | null;
					available_for_work?: boolean;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					full_name?: string;
					tagline?: string;
					bio?: string;
					email?: string;
					phone?: string | null;
					linkedin_url?: string | null;
					github_url?: string | null;
					website_url?: string | null;
					profile_image_url?: string | null;
					profile_image_cloudinary_id?: string | null;
					location?: string | null;
					available_for_work?: boolean;
					created_at?: string;
					updated_at?: string;
				};
			};
			skills: {
				Row: {
					id: string;
					category: SkillCategoryType;
					name: string;
					icon_url: string | null;
					badge_url: string | null;
					proficiency_level: number;
					display_order: number;
					is_featured: boolean;
					created_at: string;
				};
				Insert: {
					id?: string;
					category: SkillCategoryType;
					name: string;
					icon_url?: string | null;
					badge_url?: string | null;
					proficiency_level: number;
					display_order?: number;
					is_featured?: boolean;
					created_at?: string;
				};
				Update: {
					id?: string;
					category?: SkillCategoryType;
					name?: string;
					icon_url?: string | null;
					badge_url?: string | null;
					proficiency_level?: number;
					display_order?: number;
					is_featured?: boolean;
					created_at?: string;
				};
			};
			projects: {
				Row: {
					id: string;
					title: string;
					slug: string;
					short_description: string;
					full_description: string;
					challenge: string | null;
					solution: string | null;
					tech_stack: string[];
					project_url: string | null;
					github_url: string | null;
					featured_image_url: string;
					featured_image_cloudinary_id: string;
					gallery_images: GalleryImage[];
					demo_video_url: string | null;
					demo_video_cloudinary_id: string | null;
					is_featured: boolean;
					display_order: number;
					metrics: Json | null;
					published: boolean;
					// New fields from UI overhaul
					video_preview_start: number;
					video_preview_end: number;
					button_text: string | null;
					button_text_mode: ButtonTextModeType;
					project_category_id: string | null;
					show_in_hero_carousel: boolean;
					hero_display_order: number;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					title: string;
					slug: string;
					short_description: string;
					full_description: string;
					challenge?: string | null;
					solution?: string | null;
					tech_stack?: string[];
					project_url?: string | null;
					github_url?: string | null;
					featured_image_url: string;
					featured_image_cloudinary_id: string;
					gallery_images?: GalleryImage[];
					demo_video_url?: string | null;
					demo_video_cloudinary_id?: string | null;
					is_featured?: boolean;
					display_order?: number;
					metrics?: Json | null;
					published?: boolean;
					video_preview_start?: number;
					video_preview_end?: number;
					button_text?: string | null;
					button_text_mode?: ButtonTextModeType;
					project_category_id?: string | null;
					show_in_hero_carousel?: boolean;
					hero_display_order?: number;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					title?: string;
					slug?: string;
					short_description?: string;
					full_description?: string;
					challenge?: string | null;
					solution?: string | null;
					tech_stack?: string[];
					project_url?: string | null;
					github_url?: string | null;
					featured_image_url?: string;
					featured_image_cloudinary_id?: string;
					gallery_images?: GalleryImage[];
					demo_video_url?: string | null;
					demo_video_cloudinary_id?: string | null;
					is_featured?: boolean;
					display_order?: number;
					metrics?: Json | null;
					published?: boolean;
					video_preview_start?: number;
					video_preview_end?: number;
					button_text?: string | null;
					button_text_mode?: ButtonTextModeType;
					project_category_id?: string | null;
					show_in_hero_carousel?: boolean;
					hero_display_order?: number;
					created_at?: string;
					updated_at?: string;
				};
			};
			certifications: {
				Row: {
					id: string;
					title: string;
					issuer: string;
					issue_date: string;
					expiry_date: string | null;
					credential_url: string | null;
					credential_id: string | null;
					display_order: number;
					created_at: string;
				};
				Insert: {
					id?: string;
					title: string;
					issuer: string;
					issue_date: string;
					expiry_date?: string | null;
					credential_url?: string | null;
					credential_id?: string | null;
					display_order?: number;
					created_at?: string;
				};
				Update: {
					id?: string;
					title?: string;
					issuer?: string;
					issue_date?: string;
					expiry_date?: string | null;
					credential_url?: string | null;
					credential_id?: string | null;
					display_order?: number;
					created_at?: string;
				};
			};
			experiences: {
				Row: {
					id: string;
					company: string;
					position: string;
					description: string;
					start_date: string;
					end_date: string | null;
					is_current: boolean;
					location: string | null;
					display_order: number;
					created_at: string;
				};
				Insert: {
					id?: string;
					company: string;
					position: string;
					description: string;
					start_date: string;
					end_date?: string | null;
					is_current?: boolean;
					location?: string | null;
					display_order?: number;
					created_at?: string;
				};
				Update: {
					id?: string;
					company?: string;
					position?: string;
					description?: string;
					start_date?: string;
					end_date?: string | null;
					is_current?: boolean;
					location?: string | null;
					display_order?: number;
					created_at?: string;
				};
			};
			social_links: {
				Row: {
					id: string;
					platform: string;
					url: string;
					icon_name: string;
					display_order: number;
					is_visible: boolean;
					created_at: string;
				};
				Insert: {
					id?: string;
					platform: string;
					url: string;
					icon_name: string;
					display_order?: number;
					is_visible?: boolean;
					created_at?: string;
				};
				Update: {
					id?: string;
					platform?: string;
					url?: string;
					icon_name?: string;
					display_order?: number;
					is_visible?: boolean;
					created_at?: string;
				};
			};
			admin_users: {
				Row: {
					id: string;
					email: string;
					role: AdminRoleType;
					created_at: string;
				};
				Insert: {
					id: string;
					email: string;
					role?: AdminRoleType;
					created_at?: string;
				};
				Update: {
					id?: string;
					email?: string;
					role?: AdminRoleType;
					created_at?: string;
				};
			};
			// New tables from UI overhaul
			color_palettes: {
				Row: ColorPaletteRow;
				Insert: Partial<ColorPaletteRow> & { name: string; display_name: string };
				Update: Partial<ColorPaletteRow>;
			};
			color_combinations: {
				Row: ColorCombination;
				Insert: Partial<ColorCombination> & {
					palette_id: string;
					name: string;
					primary_color: string;
					secondary_color: string;
					accent_color: string;
					background_dark: string;
					background_light: string;
					surface_dark: string;
					surface_light: string;
					text_primary_dark: string;
					text_primary_light: string;
					text_secondary_dark: string;
					text_secondary_light: string;
					border_dark: string;
					border_light: string;
				};
				Update: Partial<ColorCombination>;
			};
			project_categories: {
				Row: ProjectCategory;
				Insert: Partial<ProjectCategory> & {
					name: string;
					display_name: string;
					default_button_text: string;
				};
				Update: Partial<ProjectCategory>;
			};
			button_text_presets: {
				Row: ButtonTextPreset;
				Insert: Partial<ButtonTextPreset> & { text: string };
				Update: Partial<ButtonTextPreset>;
			};
			stats_counters: {
				Row: StatsCounter;
				Insert: Partial<StatsCounter> & { label: string; value: string };
				Update: Partial<StatsCounter>;
			};
			development_process_steps: {
				Row: DevelopmentProcessStep;
				Insert: Partial<DevelopmentProcessStep> & { title: string; description: string };
				Update: Partial<DevelopmentProcessStep>;
			};
			project_deliverables: {
				Row: ProjectDeliverable;
				Insert: Partial<ProjectDeliverable> & { title: string; description: string };
				Update: Partial<ProjectDeliverable>;
			};
			ai_tools: {
				Row: AITool;
				Insert: Partial<AITool> & { name: string };
				Update: Partial<AITool>;
			};
			ai_productivity_stats: {
				Row: AIProductivityStat;
				Insert: Partial<AIProductivityStat> & { label: string; value: string };
				Update: Partial<AIProductivityStat>;
			};
		};
	};
}

// Convenience type exports for common use
export type SiteSettings = Database['public']['Tables']['site_settings']['Row'];
export type Profile = Database['public']['Tables']['profile']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Skill = Database['public']['Tables']['skills']['Row'];
export type Certification = Database['public']['Tables']['certifications']['Row'];
export type Experience = Database['public']['Tables']['experiences']['Row'];
export type SocialLink = Database['public']['Tables']['social_links']['Row'];
