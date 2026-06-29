# LinkedIn profile manual — Zeddrix Fabian

Complete copy-paste guide for building your LinkedIn profile from portfolio source data.

**Source of truth:** `src/lib/data/profile.ts`, `resume-engagements.ts`, `portfolio.ts`, `certificates.ts`, `toolStripGroups` in `portfolio.ts`.

**Regenerate local files before you start:**

```bash
pnpm generate:resume
```

That produces `resume/complete/Zeddrix-Fabian-Resume.pdf`, `resume/optimized/Zeddrix-Fabian-Resume.pdf`, `exports/linkedin-certificates.md`, and `resume/resume.md`.

**Related docs:** `[career-profile-manual-checklist.md](career-profile-manual-checklist.md)` (deploy, GitHub README, job-application PDF).

---

## Important: resume upload vs manual entry

LinkedIn’s **Add to profile** screen may show **“Upload a recent resume… with the help of AI.”** You can try that as a draft, but **always verify and fix every section manually** — parsers miss projects, dates, and skills.

Manual paths that always work:

| What you want             | Where in LinkedIn                                          |
| ------------------------- | ---------------------------------------------------------- |
| **Jobs / engagements**    | **Add to profile** → **Core** → **Add position**           |
| **Portfolio products**    | **Add to profile** → **Recommended** → **Add projects**    |
| **Certs**                 | **Recommended** → **Add licenses & certifications**        |
| **Resume PDF on profile** | **Recommended** → **Add featured** → Add media             |
| **Skills list**           | **Core** → **Add skills**, or pencil on **Skills** section |
| **Languages**             | **Additional** → **Add languages**                         |

Uploading a resume PDF (without the AI flow) only stores it for **Easy Apply** or **Featured** — it does not reliably fill Experience or Projects.

Everything below is **manual copy-paste**. Plan 2–4 hours for a first pass, plus cleanup of outdated entries.

---

## Pre-flight cleanup (do this first)

Before adding new content, remove or fix stale items on your current profile.

| Action     | Details                                                                                                                                             |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Delete** | **Udemy Alumni / MCA** under Education — it reads like a formal degree. Use Licenses & Certifications instead (see §8).                             |
| **Delete** | Duplicate experience entries (same role/company/dates listed twice).                                                                                |
| **Delete** | Outdated **Projects** with wrong dates or marketing fluff (e.g. ArticuLearn / TrulyHappy showing “Present” with old product copy — replace per §7). |
| **Verify** | Portfolio is live at `https://zeddrix.com` so certificate verify URLs work.                                                                         |

---

## Execution order

Work top-to-bottom on LinkedIn. Check off each section as you go.

1. [Profile basics](#1-profile-basics) — photo, banner, custom URL, industry, location
2. [Headline](#2-headline)
3. [About](#3-about)
4. [Featured](#4-featured)
5. [Contact info](#5-contact-info)
6. [Experience](#6-experience) — 12 entries (resume-aligned)
7. [Projects](#7-projects) — 10 portfolio projects
8. [Licenses & certifications](#8-licenses--certifications) — 5 Udemy certs
9. [Skills](#9-skills) — full list + pin top 3
10. [Languages](#10-languages)
11. [Education](#11-education)
12. [Open to work & job settings](#12-open-to-work--job-settings)
13. [Final QA](#13-final-qa)

---

## 1. Profile basics

**Where:** Profile → edit pencil on intro card, or **Enhance profile**.

| Field                | Value                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| **First name**       | Zeddrix                                                                                         |
| **Last name**        | Fabian                                                                                          |
| **Pronouns**         | _(optional — your choice)_                                                                      |
| **Current position** | Full-Stack Web App Developer                                                                    |
| **Industry**         | Computer Software _(or Information Technology & Services)_                                      |
| **Location**         | Philippines                                                                                     |
| **Custom URL**       | `linkedin.com/in/zeddrix-fabian-30a18029a` _(already set — keep or shorten if LinkedIn allows)_ |

**Photo & banner:** Use a clear headshot and a simple banner (portfolio brand colors or a clean tech background). No copy required — visual only.

---

## 2. Headline

**Where:** Intro card → **Edit** → Headline (220 characters max).

**Paste:**

```
Full-Stack Web App Developer | SvelteKit, React, Angular | AI-Accelerated Delivery & ATDD | Shipping production PWAs since 2018
```

**Alternate (shorter):**

```
Full-Stack Web App Developer — SvelteKit, React, Angular · AI-accelerated workflows · ATDD · zeddrix.com
```

---

## 3. About

**Where:** Intro card → pencil on About → **Edit about**.

### 3.1 About text

**Paste** (three paragraphs — add line breaks between them):

```
Full-stack web app developer shipping production apps with AI-accelerated workflows.

I have been developing since 2018 and I enjoy turning complex requirements into simple user experiences with reliable engineering underneath.

I like to work smart, not hard. So I utilize AI tools like Cursor and Claude Code to move quickly without sacrificing quality, using the Acceptance Test-Driven Development (ATDD) approach.

I specialize in SvelteKit, React, and Angular while staying adaptable to product needs. With AI tools, I think it's not an exaggeration to say that I can work on any development project 'til shipped.

Portfolio: https://zeddrix.com
GitHub: https://github.com/zeddrix
```

### 3.2 Top 5 skills — “what you want to be known for”

In the same **Edit about** modal, under **Skills**, remove your current five and add these **in this order** (max 5):

| #   | Skill                      | Why                                                                           |
| --- | -------------------------- | ----------------------------------------------------------------------------- |
| 1   | **SvelteKit**              | Primary stack; matches headline and portfolio                                 |
| 2   | **TypeScript**             | Core language across projects                                                 |
| 3   | **React**                  | Primary stack alongside SvelteKit                                             |
| 4   | **Angular**                | Third specialization framework                                                |
| 5   | **Full-Stack Development** | Recruiter filter; covers front + back without duplicating two generic entries |

**Remove from About top 5:** MERN Stack, Front-End Development, Back-End Web Development _(too narrow or redundant — keep MERN in the main Skills list if LinkedIn has it, not in the top 5 spotlight)_.

These five also surface in your **Skills** section. They are separate from the **pin top 3** on the main Skills card (§9.1).

---

## 4. Featured

**Where:** **Add profile section** → **Recommended** → **Add featured** → **+** → **Add media** (or **Add link**).

Add these items (order: portfolio link first, then resume):

| #   | Type        | Title                      | URL / file                                         |
| --- | ----------- | -------------------------- | -------------------------------------------------- |
| 1   | Link        | Portfolio — Zeddrix Fabian | `https://zeddrix.com`                              |
| 2   | Media (PDF) | Resume — Zeddrix Fabian    | Upload `resume/complete/Zeddrix-Fabian-Resume.pdf` |
| 3   | Link        | GitHub                     | `https://github.com/zeddrix`                       |

**Optional fourth item:** link to a flagship case study, e.g. `https://zeddrix.com/projects/merns-shop`.

**Also (for Easy Apply, not Featured):** Jobs → **Application settings** → **Upload resume** → `resume/complete/Zeddrix-Fabian-Resume.pdf`. Keeps the file ready when applying; recruiters still search profile fields, not the PDF.

---

## 5. Contact info

**Where:** Intro card → **Contact info** (or Me → Settings → Visibility).

| Field        | Value                                                   | Visibility                              |
| ------------ | ------------------------------------------------------- | --------------------------------------- |
| **Email**    | `zeddrix.fabian@gmail.com`                              | Connections or Everyone _(your choice)_ |
| **Website**  | `https://zeddrix.com` — label: **Portfolio**            | Everyone                                |
| **LinkedIn** | `https://www.linkedin.com/in/zeddrix-fabian-30a18029a/` | —                                       |

---

## 6. Experience

**Where:** **Add to profile** → **Core** → **Add position** (not under Projects).

**Experience vs Projects — you need both:**

| Section        | What it is                                                    | Where to add                            |
| -------------- | ------------------------------------------------------------- | --------------------------------------- |
| **Experience** | Jobs and engagements (who you worked for, when, what you did) | **Core** → **Add position**             |
| **Projects**   | Portfolio products with URLs and screenshots                  | **Recommended** → **Add projects** (§7) |

Do **not** put job history only under Projects. Recruiters scan **Experience** first.

These **12 entries** mirror `resume/resume.md`. Enter **newest first** (LinkedIn default sort). Repeat **Add position** for each entry.

### 6.0 “Let’s start with the basics” — field mapping

LinkedIn’s **Add a role** wizard uses different labels than this doc. Map like this:

| LinkedIn field               | Maps to in this doc                                                       |
| ---------------------------- | ------------------------------------------------------------------------- |
| **Job title**                | **Title** column                                                          |
| **Organization**             | **Company** column                                                        |
| **Location**                 | City/region part of **Location** (e.g. `Philippines`)                     |
| **Location type**            | `Remote` when location ends with Remote                                   |
| **Employment type**          | **Employment type** column                                                |
| **I currently work here**    | Check when **End** is `Present`; uncheck and set end month/year otherwise |
| **Start month / Start year** | **Start** column                                                          |
| **End month / End year**     | **End** column (when not current)                                         |

On later steps (**Add a few highlights**), paste **Description** into **Highlights**, add **Skills**, and add **Media** (portfolio case study URL — required). Each §6.x block is self-contained — no scrolling needed.

### 6.0b “Add a few highlights” — quick rules

| Do                                                                                | Don’t                                                |
| --------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Add the **Skills** listed in each role block below (3–5 per role)                 | Add every skill you know on every role               |
| Use LinkedIn’s official skill names when offered                                  | Accept vague suggestions like “Visual Web Developer” |
| **Media** is required — use `https://zeddrix.com/projects/{slug}` from each block | Duplicate your About top 5 on every entry            |

Your main **Skills** section (§9) and **About top 5** (§3.2) are separate — still do those after all roles are entered.

For each entry: fill **basics** (title, company, dates, location) → **Highlights** + **Skills** + **Media** → **Save**. Repeat for all 12 blocks below.

---

### 6.1 Sole builder — Queue

| Field               | Value                                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Title**           | Sole builder — Queue                                                                                                            |
| **Company**         | Independent products                                                                                                            |
| **Employment type** | Self-employed                                                                                                                   |
| **Location**        | Philippines · Remote                                                                                                            |
| **Location type**   | Remote                                                                                                                          |
| **Start**           | January 2026                                                                                                                    |
| **End**             | Present _(check “I currently work here”)_                                                                                       |
| **Description**     | Shipped queue.place MVP+ PWA for walk-ins, bookings, operations, billing, and owner/admin tooling with Supabase and Cloudflare. |
| **Skills**          | SvelteKit, TypeScript, Supabase, Cloudflare, Progressive Web Applications                                                       |
| **Media**           | `https://zeddrix.com/projects/queue`                                                                                            |

---

### 6.2 Full-stack contributor — Manatal Cooperative (2026)

| Field               | Value                                                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Title**           | Full-stack contributor — Manatal Cooperative                                                                                                           |
| **Company**         | Codefrost                                                                                                                                              |
| **Employment type** | Contract                                                                                                                                               |
| **Location**        | Philippines · Remote                                                                                                                                   |
| **Location type**   | Remote                                                                                                                                                 |
| **Start**           | June 2026                                                                                                                                              |
| **End**             | Present _(check “I currently work here”)_                                                                                                              |
| **Description**     | Returned to extend Manatal Cooperative member PWA and Django API delivery flows for production cooperative operations. _(Client: Manatal Cooperative)_ |
| **Skills**          | Svelte, Django, PostgreSQL, Progressive Web Applications, Django REST Framework                                                                        |
| **Media**           |                                                                                                                                                        |

---

### 6.3 Sole builder — MERN's Shop (modernization)

| Field               | Value                                                                                                                                                                               |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Title**           | Sole builder — MERN's Shop (modernization)                                                                                                                                          |
| **Company**         | Independent products                                                                                                                                                                |
| **Employment type** | Self-employed                                                                                                                                                                       |
| **Location**        | Philippines · Remote                                                                                                                                                                |
| **Location type**   | Remote                                                                                                                                                                              |
| **Start**           | June 2026                                                                                                                                                                           |
| **End**             | Present _(check “I currently work here”)_                                                                                                                                           |
| **Description**     | Modernized the 2021 Udemy storefront with TypeScript, Express 5, React 19, PayPal checkout, guest/registered order flows, ATDD (Playwright/Vitest), PWA, CI, and Render deployment. |
| **Skills**          | React, TypeScript, MongoDB, Playwright, PayPal                                                                                                                                      |
| **Media**           | `https://zeddrix.com/projects/merns-shop`                                                                                                                                           |

---

### 6.4 Full-stack contributor — Adverio Tools

| Field               | Value                                                                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Title**           | Full-stack contributor — Adverio Tools                                                                                                    |
| **Company**         | Codefrost                                                                                                                                 |
| **Employment type** | Contract                                                                                                                                  |
| **Location**        | Philippines · Remote                                                                                                                      |
| **Location type**   | Remote                                                                                                                                    |
| **Start**           | August 2025                                                                                                                               |
| **End**             | May 2026                                                                                                                                  |
| **Description**     | Delivered Angular and Django tooling for Adverio client workflows with Docker, Stripe, and Redis-backed integrations. _(Client: Adverio)_ |
| **Skills**          | Angular, Django, Docker, Stripe, Redis                                                                                                    |
| **Media**           | `https://zeddrix.com/projects/adverio-tools`                                                                                              |

---

### 6.5 Full-stack contributor — Bolt to GitHub

| Field               | Value                                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| **Title**           | Full-stack contributor — Bolt to GitHub                                                               |
| **Company**         | Codefrost                                                                                             |
| **Employment type** | Full-time                                                                                             |
| **Location**        | Philippines · Remote                                                                                  |
| **Location type**   | Remote                                                                                                |
| **Start**           | September 2025                                                                                        |
| **End**             | December 2025                                                                                         |
| **Description**     | Built Bolt to GitHub automation for Codefrost product workflows alongside parallel client deliveries. |
| **Skills**          | Svelte, TypeScript, GitHub, Chrome Extensions                                                         |
| **Media**           | `https://zeddrix.com/projects/bolt-to-github`                                                         |

---

### 6.6 Full-stack contributor — AnswerIQ

| Field               | Value                                                                                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Title**           | Full-stack contributor — AnswerIQ                                                                                                                     |
| **Company**         | Independent products                                                                                                                                  |
| **Employment type** | Contract                                                                                                                                              |
| **Location**        | Philippines · Remote                                                                                                                                  |
| **Location type**   | Remote                                                                                                                                                |
| **Start**           | September 2025                                                                                                                                        |
| **End**             | October 2025                                                                                                                                          |
| **Description**     | Contributed to AnswerIQ multi-tenant SaaS: Shopify FAQ pipeline, Stripe billing, workspace RBAC, and admin audit console. _(Personal client project)_ |
| **Skills**          | React, TypeScript, PostgreSQL, Stripe, Shopify                                                                                                        |
| **Media**           | `https://zeddrix.com/projects/answeriq`                                                                                                               |

---

### 6.7 Full-stack contributor — UseDelight

| Field               | Value                                                                                                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Title**           | Full-stack contributor — UseDelight                                                                                                                                                   |
| **Company**         | Codefrost                                                                                                                                                                             |
| **Employment type** | Contract                                                                                                                                                                              |
| **Location**        | Philippines · Remote                                                                                                                                                                  |
| **Location type**   | Remote                                                                                                                                                                                |
| **Start**           | January 2025                                                                                                                                                                          |
| **End**             | July 2025                                                                                                                                                                             |
| **Description**     | Delivered SvelteKit extension and account flows with Stripe billing, plus Express API work for subscription reliability, admin stats, and content collections. _(Client: UseDelight)_ |
| **Skills**          | SvelteKit, Express, MongoDB, Stripe                                                                                                                                                   |
| **Media**           | `https://zeddrix.com/projects/usedelight`                                                                                                                                             |

---

### 6.8 Full-stack contributor — ArticuLearn

| Field               | Value                                                                                                     |
| ------------------- | --------------------------------------------------------------------------------------------------------- |
| **Title**           | Full-stack contributor — ArticuLearn                                                                      |
| **Company**         | Codefrost                                                                                                 |
| **Employment type** | Full-time                                                                                                 |
| **Location**        | Philippines · Remote                                                                                      |
| **Location type**   | Remote                                                                                                    |
| **Start**           | July 2024                                                                                                 |
| **End**             | December 2024                                                                                             |
| **Description**     | Extended ArticuLearn language-learning PWA with production features across frontend and backend surfaces. |
| **Skills**          | Angular, NestJS, Django, PostgreSQL, Progressive Web Applications                                         |
| **Media**           | `https://zeddrix.com/projects/articulearn`                                                                |

---

### 6.9 Full-stack contributor — TrulyHappy

| Field               | Value                                                                                               |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| **Title**           | Full-stack contributor — TrulyHappy                                                                 |
| **Company**         | Codefrost                                                                                           |
| **Employment type** | Full-time                                                                                           |
| **Location**        | Philippines · Remote                                                                                |
| **Location type**   | Remote                                                                                              |
| **Start**           | January 2024                                                                                        |
| **End**             | June 2024                                                                                           |
| **Description**     | Resumed production development on TrulyHappy PWA after returning from a career break in early 2024. |
| **Skills**          | Angular, NestJS, Django, PostgreSQL, Progressive Web Applications                                   |
| **Media**           | `https://zeddrix.com/projects/trulyhappy`                                                           |

---

### 6.10 Sole builder — JW Tabs

| Field               | Value                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Title**           | Sole builder — JW Tabs                                                                                           |
| **Company**         | Independent products                                                                                             |
| **Employment type** | Self-employed                                                                                                    |
| **Location**        | Philippines · Remote                                                                                             |
| **Location type**   | Remote                                                                                                           |
| **Start**           | May 2021                                                                                                         |
| **End**             | October 2021                                                                                                     |
| **Description**     | Shipped jwtabs.app MVP for guitar and ukulele tablature with community workflows, billing, and admin moderation. |
| **Skills**          | SvelteKit, TypeScript, Supabase, Progressive Web Applications                                                    |
| **Media**           | `https://zeddrix.com/projects/jw-tabs`                                                                           |

---

### 6.11 Full-stack contributor — Manatal Cooperative (2021)

| Field               | Value                                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Title**           | Full-stack contributor — Manatal Cooperative                                                                                                     |
| **Company**         | Codefrost                                                                                                                                        |
| **Employment type** | Contract                                                                                                                                         |
| **Location**        | Philippines · Remote                                                                                                                             |
| **Location type**   | Remote                                                                                                                                           |
| **Start**           | November 2021                                                                                                                                    |
| **End**             | December 2021                                                                                                                                    |
| **Description**     | Delivered Manatal Cooperative member PWA and Django API financial request flows as first production client work. _(Client: Manatal Cooperative)_ |
| **Skills**          | Svelte, Django, PostgreSQL, Progressive Web Applications                                                                                         |
| **Media**           | `https://zeddrix.com/projects/manatal-coop`                                                                                                      |

---

### 6.12 Student Web Developer

| Field               | Value                                                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Title**           | Student Web Developer                                                                                                   |
| **Company**         | Codefrost                                                                                                               |
| **Employment type** | Internship                                                                                                              |
| **Location**        | Cavite, Calabarzon, Philippines · On-site                                                                               |
| **Location type**   | On-site                                                                                                                 |
| **Start**           | March 2018                                                                                                              |
| **End**             | December 2021                                                                                                           |
| **Description**     | Grew from internship into sustained production web development across Codefrost company products and client deliveries. |
| **Skills**          | JavaScript, Web Development, Front-End Development _(or skip skills for this entry)_                                    |
| **Media**           | `https://zeddrix.com/projects` _(no single project — internship spans multiple Codefrost products)_                     |

---

## 7. Projects

**Where:** **Add to profile** → **Recommended** → **Add projects** (not under Core).

**Not the same as Experience.** Projects showcase products; Experience shows employment. Add all **10** below. **Edit or delete** existing ArticuLearn / TrulyHappy entries if dates or descriptions don’t match this doc.

**URL (required):** always `https://zeddrix.com/projects/{slug}` — portfolio case study, not the live product domain.

---

### 7.1 Queue

| Field             | Value                                                                                                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**          | Queue                                                                                                                                                                                 |
| **Dates**         | Jan 2026 – present                                                                                                                                                                    |
| **URL**           | `https://zeddrix.com/projects/queue`                                                                                                                                                  |
| **Description**   | PWA for walk-ins, bookings, and operations — unified queueing, reservations, pre-orders, event handling, billing, owner/admin dashboards, and Groq-backed support chat. Sole builder. |
| **Skills to tag** | SvelteKit, TypeScript, Supabase, Cloudflare                                                                                                                                           |

---

### 7.2 MERN's Shop

| Field             | Value                                                                                                                                                                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**          | MERN's Shop                                                                                                                                                                                                                                          |
| **Dates**         | Jun 2026 – present _(modernization; original course build Apr 2021)_                                                                                                                                                                                 |
| **URL**           | `https://zeddrix.com/projects/merns-shop`                                                                                                                                                                                                            |
| **Description**   | Live electronics e-commerce with ~170 products, PayPal checkout, admin ops, installable PWA, and 100+ automated tests. Modernized from 2021 Udemy exercise with TypeScript, Express 5, React 19, ATDD (Playwright/Vitest), CI, Render. Sole builder. |
| **Skills to tag** | React, TypeScript, MongoDB, Playwright                                                                                                                                                                                                               |

---

### 7.3 Adverio Tools

| Field             | Value                                                                                                                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**          | Adverio Tools                                                                                                                                                                      |
| **Dates**         | Aug 2025 – May 2026                                                                                                                                                                |
| **URL**           | `https://zeddrix.com/projects/adverio-tools`                                                                                                                                       |
| **Description**   | AI-assisted Amazon seller toolkit — ASIN scraper, listing/image analyzer, proposal generation, forecasting, and brand operations. Full-stack contributor at Codefrost for Adverio. |
| **Skills to tag** | Angular, Django, Stripe, Docker                                                                                                                                                    |

---

### 7.4 UseDelight

| Field             | Value                                                                                                                                                                                                                                                                       |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**          | UseDelight                                                                                                                                                                                                                                                                  |
| **Dates**         | Jan 2025 – Jul 2025                                                                                                                                                                                                                                                         |
| **URL**           | `https://zeddrix.com/projects/usedelight`                                                                                                                                                                                                                                   |
| **Description**   | Nature-video new-tab extensions (Chrome and Edge) with weather, games, and 1500+ backgrounds, plus marketing site, Stripe account portal, and admin analytics — powered by a shared SvelteKit monorepo and Express API. Full-stack contributor at Codefrost for UseDelight. |
| **Skills to tag** | SvelteKit, Express, MongoDB, Stripe                                                                                                                                                                                                                                         |

---

### 7.5 AnswerIQ

| Field             | Value                                                                                                                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**          | AnswerIQ                                                                                                                                                                                        |
| **Dates**         | Sep 2025 – Oct 2025                                                                                                                                                                             |
| **URL**           | `https://zeddrix.com/projects/answeriq`                                                                                                                                                         |
| **Description**   | Multi-tenant SaaS for Shopify merchants — SerpAPI PAA queries → GPT-generated FAQ articles → Shopify publish, Stripe billing, workspace RBAC, admin audit console. Playwright/Jest/Vitest ATDD. |
| **Skills to tag** | React, TypeScript, PostgreSQL, Stripe                                                                                                                                                           |

---

### 7.6 Manatal Coop

| Field             | Value                                                                                                                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**          | Manatal Coop                                                                                                                                                                                 |
| **Dates**         | Nov 2021 – Dec 2021 · Jun 2026 – present                                                                                                                                                     |
| **URL**           | `https://zeddrix.com/projects/manatal-coop`                                                                                                                                                  |
| **Description**   | Cooperative member banking PWA for a Philippine credit union — account dashboards, financial requests, loan applications, offline caching, push notifications. Django REST API + Svelte PWA. |
| **Skills to tag** | Svelte, Django, PostgreSQL, PWA                                                                                                                                                              |

---

### 7.7 JW Tabs

| Field             | Value                                                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Name**          | JW Tabs                                                                                                                        |
| **Dates**         | May 2021 – present _(MVP Oct 2021)_                                                                                            |
| **URL**           | `https://zeddrix.com/projects/jw-tabs`                                                                                         |
| **Description**   | Tablature platform for guitar and ukulele — rendering, community workflows, billing, moderation, admin controls. Sole builder. |
| **Skills to tag** | SvelteKit, TypeScript, Supabase                                                                                                |

---

### 7.8 TrulyHappy

| Field             | Value                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**          | TrulyHappy                                                                                                                                  |
| **Dates**         | Jan 2024 – Jun 2024                                                                                                                         |
| **URL**           | `https://zeddrix.com/projects/trulyhappy`                                                                                                   |
| **Description**   | Mental wellbeing PWA — mood tracking, guided habits, missions, Lemon Squeezy billing. Angular SSR + NestJS BFF + Django API in Nx monorepo. |
| **Skills to tag** | Angular, NestJS, Django                                                                                                                     |

---

### 7.9 Articulearn

| Field             | Value                                                                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**          | Articulearn                                                                                                                                  |
| **Dates**         | Jul 2024 – Dec 2024                                                                                                                          |
| **URL**           | `https://zeddrix.com/projects/articulearn`                                                                                                   |
| **Description**   | Language speaking practice PWA — audio shadowing, segmented sessions, library filters, Lemon Squeezy subscriptions. WaveSurfer.js waveforms. |
| **Skills to tag** | Angular, NestJS, Django                                                                                                                      |

---

### 7.10 Bolt to Github

| Field             | Value                                                                                                                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**          | Bolt to Github                                                                                                                                                                          |
| **Dates**         | Sep 2025 – Dec 2025                                                                                                                                                                     |
| **URL**           | `https://zeddrix.com/projects/bolt-to-github`                                                                                                                                           |
| **Description**   | Manifest V3 Chrome extension — intercepts Bolt.new ZIP exports, pushes to GitHub via PAT or GitHub App auth, diff preview, Supabase-backed premium tier. Published on Chrome Web Store. |
| **Skills to tag** | Svelte, TypeScript, Chrome Extension                                                                                                                                                    |

---

## 8. Licenses & certifications

**Where:** **Add profile section** → **Recommended** → **Add licenses & certifications**.

**Do not** list these under Education. Copy from `exports/linkedin-certificates.md` (regenerate with `pnpm generate:resume`).

---

### 8.1 Modern JavaScript From The Beginning

| Field                    | Value                                                                   |
| ------------------------ | ----------------------------------------------------------------------- |
| **Name**                 | Modern JavaScript From The Beginning                                    |
| **Issuing organization** | Udemy                                                                   |
| **Issue date**           | November 2020                                                           |
| **Credential URL**       | `https://zeddrix.com/certificates/modern-javascript-from-the-beginning` |
| **Skills**               | JavaScript, ES6+, DOM, OOP, Async JavaScript, Fetch API                 |

---

### 8.2 ReactJS Front to Back

| Field                    | Value                                                         |
| ------------------------ | ------------------------------------------------------------- |
| **Name**                 | ReactJS Front to Back                                         |
| **Issuing organization** | Udemy                                                         |
| **Issue date**           | January 2021                                                  |
| **Credential URL**       | `https://zeddrix.com/certificates/reactjs-front-to-back`      |
| **Skills**               | React.js, Redux, Context API, React Hooks, REST APIs, Node.js |

---

### 8.3 CSS – The Complete Guide 2021 (incl. Flexbox, Grid & Sass)

| Field                    | Value                                                       |
| ------------------------ | ----------------------------------------------------------- |
| **Name**                 | CSS – The Complete Guide 2021 (incl. Flexbox, Grid & Sass)  |
| **Issuing organization** | Udemy                                                       |
| **Issue date**           | February 2021                                               |
| **Credential URL**       | `https://zeddrix.com/certificates/css-complete-guide-2021`  |
| **Skills**               | CSS, Flexbox, CSS Grid, SASS, Responsive Design, Animations |

---

### 8.4 Node.js API Masterclass With Express & MongoDB

| Field                    | Value                                                     |
| ------------------------ | --------------------------------------------------------- |
| **Name**                 | Node.js API Masterclass With Express & MongoDB            |
| **Issuing organization** | Udemy                                                     |
| **Issue date**           | March 2021                                                |
| **Credential URL**       | `https://zeddrix.com/certificates/nodejs-api-masterclass` |
| **Skills**               | Node.js, Express.js, MongoDB, REST APIs, JWT, Mongoose    |

---

### 8.5 MERN eCommerce From Scratch

| Field                    | Value                                                          |
| ------------------------ | -------------------------------------------------------------- |
| **Name**                 | MERN eCommerce From Scratch                                    |
| **Issuing organization** | Udemy                                                          |
| **Issue date**           | April 2021                                                     |
| **Credential URL**       | `https://zeddrix.com/certificates/mern-ecommerce-from-scratch` |
| **Credential ID**        | `UC-f4253a2d-75ed-4a33-a0e1-d9c273890c15`                      |
| **Skills**               | MERN Stack, React, Node.js, Express.js, MongoDB, Redux         |

---

## 9. Skills

**Where:** **Add to profile** → **Core** → **Add skills**, or pencil on the **Skills** section.

**Two skill spotlights (different places):**

| Place                   | How many | Which skills                                                         |
| ----------------------- | -------- | -------------------------------------------------------------------- |
| **About** → “known for” | 5 max    | §3.2 — SvelteKit, TypeScript, React, Angular, Full-Stack Development |
| **Skills** section pin  | 3 max    | §9.1 — SvelteKit, TypeScript, React                                  |

### 9.1 Pin these three (Skills section card)

1. **SvelteKit**
2. **TypeScript**
3. **React**

### 9.2 Add every skill below

LinkedIn may suggest matches — pick the closest official skill name. Add in batches by category.

**AI-accelerated delivery:** Cursor IDE, Claude Code, Anthropic Claude

**Frontend frameworks:** Svelte, SvelteKit, React, React Native, Next.js, Angular, Angular SSR, Progressive Web Apps (PWA)

**Frontend libraries & patterns:** Redux, Context API, RxJS, ng-bootstrap, Chart.js

**Languages:** TypeScript, Python, JavaScript

**Backend & architecture:** Node.js, Express.js, NestJS, Django, Strapi, Firebase, Swagger, nginx

**Data & storage:** Supabase, PostgreSQL, MongoDB, MySQL, Redis, Amazon S3

**Styling & UI:** CSS, Sass, Tailwind CSS, Material UI, Bootstrap

**Testing:** Jest, Vitest, Supertest, React Testing Library, Cypress, Playwright, Storybook

**DevOps, platforms & workflow:** Cloudflare, Docker, Git, GitHub, GitHub Actions, Nx, DigitalOcean, Render, Stripe, PayPal, Amazon EC2, Lemon Squeezy, Yarn, WordPress, Namecheap

**Also add from project/certificate context:** REST APIs, GraphQL _(if used)_, Shopify, OpenAI, PayPal, MERN Stack, BFF, OAuth, Celery, Chrome Extensions

After adding, **remove** outdated skills that no longer match your stack (legacy tools you don't use).

---

## 10. Languages

**Where:** **Add profile section** → **Recommended** → **Add languages**.

| Language    | Proficiency                      |
| ----------- | -------------------------------- |
| **Tagalog** | Native or bilingual proficiency  |
| **English** | Professional working proficiency |

---

## 11. Education

**Where:** Education section.

| Action                | Details                                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Remove**            | Udemy Alumni / MCA _(if present)_                                                                                   |
| **Add formal degree** | Only if you have one not already in portfolio data — this repo does not define a degree; add manually if applicable |

Udemy courses belong in **§8 Licenses & certifications**, not Education.

---

## 12. Open to work & job settings

**Where:** Profile → **Open to** button, and Jobs → **Application settings**.

### Open to work (optional)

- **Looking for:** Full-time, Contract, or both — your choice
- **Job titles:** Full-Stack Developer, Web Developer, Software Engineer
- **Locations:** Remote, Philippines
- **Visibility:** Recruiters only _(recommended if employed)_ or All LinkedIn members

### Application settings

- Upload `resume/complete/Zeddrix-Fabian-Resume.pdf` under **Resume**
- Toggle **Share resume data with recruiters** on or off per your preference
- Keep `resume/optimized/Zeddrix-Fabian-Resume.pdf` available when a platform requests a shorter alternative upload

---

## 13. Final QA

Before you consider the profile done, verify:

- [ ] Headline, About, and Experience dates match `resume/resume.md`
- [ ] No duplicate experience or project entries
- [ ] Udemy Alumni / MCA removed from Education
- [ ] All 5 certs use `https://zeddrix.com/certificates/{slug}` verify URLs
- [ ] Featured shows portfolio link + resume PDF
- [ ] About top 5 skills: SvelteKit, TypeScript, React, Angular, Full-Stack Development
- [ ] Skills section pinned: SvelteKit, TypeScript, React
- [ ] `https://zeddrix.com` loads and certificate pages resolve
- [ ] Public profile view (View as member) looks correct on mobile and desktop

---

## Keeping LinkedIn in sync

When you change projects, experience, skills, profile copy, or certificates in this repo:

1. Run `pnpm generate:resume`
2. Update affected LinkedIn sections using this doc (or diff against `resume/resume.md`)
3. Re-upload Featured / Application-settings resume PDF if content changed
4. See `[career-profile-manual-checklist.md](career-profile-manual-checklist.md)` §9 for full career-surface sync

---

## Optional sections (skip unless you have content)

| Section             | Guidance                                                           |
| ------------------- | ------------------------------------------------------------------ |
| **Volunteering**    | Add only if relevant                                               |
| **Honors & awards** | Add only if applicable                                             |
| **Publications**    | Skip unless you publish                                            |
| **Courses**         | Skip — certs are in §8                                             |
| **Recommendations** | Request from Codefrost colleagues or clients when ready            |
| **Services**        | Optional for freelancers — Web Development, Full-Stack Development |
