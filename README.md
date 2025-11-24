# Zeddrix Portfolio - Advanced SvelteKit Portfolio System

A modern, highly customizable portfolio website with unprecedented visual flexibility and a powerful custom CMS.

## Overview

This is not just another portfolio—it's a sophisticated web application that showcases advanced front-end architecture, full-stack development skills, and exceptional attention to user experience.

---

## Features

### Dynamic Visual Customization (Unprecedented!)

#### Three Switchable Layouts

1. **Modern Case Study Layout** - Full-width project showcases with storytelling focus
2. **Single-Page Scrolling Layout** - Classic, smooth scroll with all sections on one page
3. **Bento Grid Layout** - Trendy, card-based with glassmorphism effects

#### Seven Color Palettes

1. **Cyber Blue** (Default) - Professional tech aesthetic with cyan and purple tones
2. **Neon Nights** - Vibrant, energetic with bright neon greens and magentas
3. **Sunset Ember** - Warm, creative with orange and golden hues
4. **Forest Zen** - Calm, natural with emerald and teal tones
5. **Monochrome Pro** - High contrast, minimal, maximum accessibility
6. **Purple Haze** - Modern, sophisticated with violet and fuchsia
7. **Ocean Deep** - Cool, professional with cyan and sky blues

#### Dark & Light Themes

- Fully functional dark mode (default)
- Beautiful light mode for all palettes
- Smooth transitions between themes

**Total Visual Combinations: 3 layouts × 7 palettes × 2 themes = 42 unique experiences!**

---

## Visitor Experience

### Real-Time Customization

- **Layout switcher** - Visitors can try all 3 layouts instantly
- **Color palette switcher** - Visitors can choose their favorite colors
- **Theme toggle** - Switch between dark and light modes
- **Preferences persist** - Choices saved in localStorage for return visits

### Smooth Animations

- Scroll-triggered fade-in animations
- Elements reveal as you scroll down
- Smooth color transitions when switching palettes
- Layout transition animations
- Staggered animations for lists and grids

### Performance Optimized

- Blazing fast load times (targeting 90+ Lighthouse scores)
- Optimized images with Cloudinary transformations
- Responsive images (WebP/AVIF with fallbacks)
- Lazy loading for images
- Mobile-first responsive design

---

## Content Sections

### About Section

- Professional bio and introduction
- Skills showcase with badges/icons
- Availability status
- Social links
- Profile photo

### Projects Showcase

- Multiple project display formats (based on layout)
- Project case studies with:
  - Challenge/Solution structure
  - Tech stack display
  - Project metrics
  - Image galleries
  - Live demo and GitHub links
- Featured projects highlighting
- Individual project detail pages

### Skills & Expertise

- Categorized skills (Programming, Frontend, Backend, DevOps, Tools)
- Proficiency indicators
- Featured skills
- Visual badges with icons
- Drag-and-drop reordering (admin)

### Experience & Certifications

- Work experience timeline
- Certifications with credentials
- Education history
- LinkedIn integration

### Contact

- Contact form with spam protection
- Email and social links
- Availability indicator

---

## Custom Admin Panel (Full Control)

### Content Management

- **Projects**: Create, edit, delete, reorder projects
- **Skills**: Manage all skills and categories
- **Profile**: Edit bio, contact info, social links
- **Certifications**: Add/edit certifications and credentials
- **Experience**: Manage work history timeline

### Site Configuration

- **Set default layout** for new visitors
- **Set default color palette** for new visitors
- **Set default theme** (dark/light)
- **Maintenance mode** toggle
- **SEO settings** (title, description)

### Rich Content Editor

- WYSIWYG editor for project descriptions
- Markdown support
- Code block formatting
- Link management

### Image Management

- Upload images directly from admin
- Integration with Cloudinary for optimization
- Gallery management for projects
- Automatic image resizing
- Profile photo upload

### Real-Time Updates

- No rebuilds required!
- Changes appear instantly on live site
- Edit deployed site on the fly

---

## Technical Stack

### Frontend

- **SvelteKit** (Svelte 4) - Lightning-fast framework
- **Tailwind CSS** - Utility-first styling
- **CSS Custom Properties** - Dynamic theming system
- **shadcn-svelte** - Beautiful UI components
- **Motion One** - Lightweight animations

### Backend

- **Supabase** - PostgreSQL database + auth + storage
- **Supabase Auth** - Secure authentication
- **Supabase Storage** - File storage with CDN

### Services

- **Cloudinary** - Image optimization and transformations
- **Vercel** - Serverless deployment

### Development

- **TypeScript** - Type safety
- **Vite** - Fast build tooling
- **Prettier** - Code formatting
- **ESLint** - Code linting

---

## Security Features

- Row Level Security (RLS) on all database tables
- Secure authentication with Supabase Auth
- Protected admin routes
- Environment variable protection
- Form validation (client + server)
- XSS protection
- HTTPS/SSL encryption

---

## SEO Optimized

- Dynamic meta tags per page
- Open Graph tags for social sharing
- Twitter Card tags
- Structured data (JSON-LD)
- SEO-friendly slugs
- Sitemap generation
- Optimized for search engines

---

## Progressive Web App Features

- Mobile-responsive on all devices
- Touch-optimized interactions
- Fast navigation
- Optimized asset loading

---

## What Makes This Portfolio Special

### Unprecedented Customization

- First portfolio with 3 switchable layouts
- 7 color palettes is unheard of
- 42 total visual combinations

### Visitor Empowerment

- Visitors control their own experience
- Great UX - people love customization
- Shows care about user preferences

### Full-Stack Showcase

- Custom CMS demonstrates backend skills
- Advanced CSS architecture
- State management expertise
- Database design knowledge

### Production-Ready Architecture

- Scalable design patterns
- Clean separation of concerns
- TypeScript for type safety
- Professional deployment pipeline

### Live Content Management

- Edit portfolio from anywhere
- No rebuilds or redeployments
- Update projects instantly
- Perfect for keeping content fresh

### Attention to Detail

- Smooth animations everywhere
- Polished UI/UX
- Accessibility considerations
- Mobile-first approach

---

## Project Stats

- **3** Unique layouts
- **7** Color palettes
- **2** Themes (dark/light)
- **42** Visual combinations
- **9** Database tables
- **~60** Svelte components
- **~20** API routes
- **14** CSS color schemes
- **100%** Custom built

---

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account
- Cloudinary account
- Vercel account (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/zeddrix/zeddrix-portfolio.git

# Navigate to project directory
cd zeddrix-portfolio

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Run development server (http://localhost:3212)
pnpm dev
```

### Environment Variables

Create a `.env` file with the following:

```env
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Development Commands

```bash
# Run dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run ALL checks (format + lint + type-check)
pnpm quality

# Format with Prettier
pnpm format

# Lint with ESLint
pnpm lint

# TypeScript type checking
pnpm check
```

---

## Code Quality Standards

### Pre-Commit Hook

A pre-commit hook automatically runs before each commit:

- Formats staged files with Prettier
- Lints staged files with ESLint
- Runs full TypeScript type checking
- **Blocks commit if any errors are found**

### Code Standards

**CRITICAL - Zero Tolerance:**

- ❌ NEVER use `any` type - Use specific types or generics
- ❌ NEVER use eslint-disable comments - Fix the underlying issue
- ✅ ALWAYS run `pnpm quality` before committing

**Type Safety:**

- TypeScript strict mode enabled
- All component props must be explicitly typed
- All function parameters and returns must be typed
- Use generics for reusable components

---

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Supabase Configuration

1. Create Supabase project
2. Run database migrations
3. Configure Row Level Security policies
4. Set up storage buckets

See [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) for detailed setup instructions.

---

## Documentation

- [Implementation Plan](IMPLEMENTATION_PLAN.md) - Comprehensive development roadmap
- [Portfolio Draft](zeddrix-portfolio-draft.md) - Original content draft
- [API Documentation](docs/api.md) - API endpoints and usage (coming soon)
- [Component Documentation](docs/components.md) - Component reference (coming soon)
- [Database Schema](docs/schema.md) - Database structure (coming soon)

---

## Why This Portfolio Stands Out

### For Recruiters/Clients

- "This developer thinks differently"
- "Advanced technical skills clearly demonstrated"
- "Attention to UX and personalization"
- "Can build complex, scalable systems"

### For Portfolio Visitors

- "I can customize this to my taste!"
- "This is so smooth and well-designed"
- "Love the attention to detail"
- "This is different from every other portfolio"

### For You

- Complete control over content
- Edit from anywhere, anytime
- No technical knowledge needed for updates
- Showcase of your best work

---

## Skills Demonstrated

This portfolio showcases proficiency in:

- **Frontend**: SvelteKit, Svelte 4, TypeScript, Tailwind CSS, Responsive Design
- **Backend**: Supabase, PostgreSQL, REST APIs, Authentication, Authorization
- **DevOps**: Vercel deployment, Environment management, CI/CD
- **Architecture**: Component design, State management, Design systems
- **UX/UI**: Accessibility, Animations, Multi-theme support, User customization
- **Security**: RLS, Authentication, Input validation, XSS protection
- **Performance**: Image optimization, Lazy loading, Code splitting, Caching

---

## License

MIT License - see [LICENSE](LICENSE) for details

---

## Contact

**Zeddrix Fabian**

- Email: zeddrix.fabian@codefrost.com
- LinkedIn: [zeddrix-fabian](https://www.linkedin.com/in/zeddrix-fabian-30a18029a/)
- Website: [zeddrix.com](https://zeddrix.com)

---

## Acknowledgments

- Built with [SvelteKit](https://kit.svelte.dev/)
- Powered by [Supabase](https://supabase.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- UI components from [shadcn-svelte](https://shadcn-svelte.com/)
- Images optimized with [Cloudinary](https://cloudinary.com/)
- Deployed on [Vercel](https://vercel.com/)

---

**This is the kind of portfolio that gets you noticed.** 🌟

---

**Owner:** Zeddrix
**Main Branch:** `main`
