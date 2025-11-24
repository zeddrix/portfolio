/**
 * Database types generated from Supabase schema
 * These types match the tables defined in scripts/db/migrations/001_initial_schema.sql
 */

import type { LayoutType } from './layout';

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Re-export LayoutType for convenience
export type { LayoutType };

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

export interface GalleryImage {
	url: string;
	cloudinary_id: string;
	media_type: 'image' | 'video' | 'gif';
}

export interface Database {
	public: {
		Tables: {
			site_settings: {
				Row: {
					id: string;
					active_layout: LayoutType;
					active_palette: PaletteType;
					theme_mode: ThemeModeType;
					maintenance_mode: boolean;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					active_layout?: LayoutType;
					active_palette?: PaletteType;
					theme_mode?: ThemeModeType;
					maintenance_mode?: boolean;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					active_layout?: LayoutType;
					active_palette?: PaletteType;
					theme_mode?: ThemeModeType;
					maintenance_mode?: boolean;
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
		};
	};
}
