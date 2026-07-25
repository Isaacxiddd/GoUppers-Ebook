# PIPELINE: GoUppers eBook Landing Page

> Orchestrated skill execution for building a Stripe-integrated ebook sales page.
> Each phase MUST complete before the next begins. No skipping.

---

## Project Context

- **Client:** GoUppers (vacation rental management company)
- **Product:** eBook for property owners ("Guia para propietarios")
- **Price:** TBD ($19-$27 range)
- **Commission:** 25% to builder per sale
- **Stripe:** Account exists (GoUppers owns it)
- **Timeline:** 3 days
- **Stack:** Next.js + Tailwind v4 + Motion + Stripe Checkout + Supabase Storage

---

## Color Palette (Client-Provided)

| Token | HEX | Usage |
|-------|-----|-------|
| `--bg-hero` | `#181818` | Hero section background (Negro Antracita) |
| `--accent-red` | `#FF3B30` | CTA buttons ("Quiero el ebook"), text highlights, GoUppers logo, ebook cover |
| `--accent-gold` | `#E5C042` | Secondary text highlights ("tambien."), ebook top stripe ("Guia para propietarios") |
| `--green-dark` | `#1A3D36` | Badge background ("GUÍA DEFINITIVA...") |
| `--green-light` | `#4ECCA3` | Badge text and border |
| `--white` | `#FFFFFF` | Header background, main text ("Tu propiedad ya es buena...") |

---

## Design Dials

| Dial | Value | Reason |
|------|-------|--------|
| DESIGN_VARIANCE | 7 | Split hero, asymmetric layout, conversion-focused |
| MOTION_INTENSITY | 5 | CTA pulse, scroll reveals, hover physics |
| VISUAL_DENSITY | 4 | Airy, premium, whitespace-heavy |

---

## Execution Pipeline

### FASE 0: SETUP (No skill - manual)

**Goal:** Create project skeleton before any skill runs.

**Steps:**
1. `npx create-next-app@latest gouppers-ebook --typescript --tailwind --app --src-dir`
2. Install dependencies:
   ```bash
   npm install motion @stripe/stripe-js stripe @supabase/supabase-js
   npm install @phosphor-icons/react
   ```
3. Create `.env.local` with placeholder keys:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```
4. Create folder structure:
   ```
   src/
   ├── app/
   │   ├── layout.tsx
   │   ├── page.tsx
   │   ├── globals.css
   │   ├── success/page.tsx
   │   └── api/
   │       ├── checkout/route.ts
   │       ├── webhook/route.ts
   │       └── session/route.ts
   ├── components/
   │   ├── hero.tsx
   │   ├── features.tsx
   │   ├── testimonials.tsx
   │   ├── pricing-cta.tsx
   │   ├── footer.tsx
   │   └── ui/
   │       ├── button.tsx
   │       └── badge.tsx
   └── lib/
       ├── stripe.ts
       └── supabase.ts
   ```

**Output:** Empty Next.js project with all folders and deps installed.

---

### FASE 1: ARQUITECTO (Skill: `arquitecto`)

**Goal:** Plan architecture, define invariants, create memory files.

**Skill to load:** `arquitecto`

**What it does:**
- Creates `.arquitecto/MAPA.md` (architecture, modules, conventions)
- Creates `.arquitecto/NEGOCIO.md` (business rules, invariants)
- Creates `.arquitecto/DEUDA.md` (technical debt tracker)
- Defines client/server boundary
- Identifies security requirements

**Input:** Project context from this PIPELINE.md + existing code structure.

**Output:** `.arquitecto/` folder populated + veredicto (APROBADO / CON CONDICIONES / RECHAZADO).

**Gate:** Cannot proceed to FASE 2 unless veredicto is APROBADO or APROBADO CON CONDICIONES.

---

### FASE 2: DISEÑO VISUAL (Skill: `design-taste-frontend`)

**Goal:** Build the complete landing page视觉 (visual only, no Stripe integration yet).

**Skill to load:** `design-taste-frontend`

**What it does:**
- Runs Section 0: Brief inference + Design Read
- Sets dials (DESIGN_VARIANCE: 7, MOTION_INTENSITY: 5, VISUAL_DENSITY: 4)
- Builds all visual components:
  - Header (white, fixed, GoUppers logo)
  - Hero (dark #181818, headline, CTA rojo, ebook cover placeholder)
  - Badge strip (verde #1A3D36 + #4ECCA3)
  - Benefits section (3-4 feature cards)
  - Testimonials (fabricated, realistic)
  - Pricing CTA (precio + boton final)
  - Footer
- Applies full Pre-Flight Check (Section 14)
- Uses Motion for scroll reveals and CTA hover physics
- Responsive (mobile-first collapse)

**Input:** Color palette, dials, page sections from this PIPELINE.md.

**Output:** Complete visual landing page (page.tsx + all components). No API routes, no Stripe logic.

**Gate:** Pre-Flight Check must pass. All Section 14 checkboxes ticked.

---

### FASE 3: WORKER - STRIPE INTEGRATION (Skill: `worker`)

**Goal:** Add payment processing to the visual page.

**Skill to load:** `worker`

**What it does:**
- Reads `.arquitecto/MAPA.md` for architecture context
- Creates `src/lib/stripe.ts` (Stripe client config)
- Creates `src/app/api/checkout/route.ts`:
  - Accepts product ID
  - Creates Stripe Checkout Session
  - Returns hosted checkout URL
  - Price verified server-side
- Creates `src/app/api/webhook/route.ts`:
  - Verifies Stripe signature (HMAC-SHA256)
  - Handles `checkout.session.completed`
  - Generates signed download URL from Supabase
  - Idempotent (safe for retries)
- Creates `src/app/api/session/route.ts`:
  - Verifies session status
  - Returns download link for success page
- Creates `src/app/success/page.tsx`:
  - Shows purchase confirmation
  - Provides ebook download button
- Connects hero CTA -> checkout API -> Stripe -> success page

**Input:** Visual page from FASE 2 + `.arquitecto/MAPA.md`.

**Output:** Fully functional payment flow. CTA -> Stripe Checkout -> Payment -> Download.

**Gate:** Webhook signature verification present. No secrets in client bundle.

---

### FASE 4: ARQUITECTO RE-REVISION (Skill: `arquitecto`)

**Goal:** Security and edge case review of the integrated code.

**Skill to load:** `arquitecto`

**What it does:**
- Re-reads all code from FASE 2 + FASE 3
- Runs FASE 3 checklist (security, edge cases, client/server boundary)
- Runs FASE 4 checklist (destructive operations)
- Checks:
  - [ ] Webhook signature verification
  - [ ] Signed URLs with expiration
  - [ ] No secrets in client bundle
  - [ ] Prices verified server-side
  - [ ] Idempotency in webhook handler
  - [ ] Error handling in API routes
  - [ ] Rate limiting considerations
- Updates `.arquitecto/DEUDA.md` with any new debt

**Input:** All code from FASE 2 + FASE 3.

**Output:** Veredicto final (APROBADO / APROBADO CON CONDICIONES / RECHAZADO).

**Gate:** Must be APROBADO before deploy.

---

### FASE 5: WORKER - POLISH + DEPLOY (Skill: `worker`)

**Goal:** Final polish, testing, and deployment.

**Skill to load:** `worker`

**What it does:**
- Responsive testing (mobile, tablet, desktop)
- Dark mode verification (if applicable)
- Typography audit (no clipped descenders, proper hierarchy)
- Image optimization (next/image for ebook cover)
- SEO meta tags (title, description, OG image)
- Performance check (LCP, CLS)
- Deploy to Vercel:
  ```bash
  npx vercel --prod
  ```
- End-to-end test: click CTA -> Stripe Checkout -> pay -> success page -> download

**Input:** All code + veredicto from FASE 4.

**Output:** Live landing page accepting payments.

---

## Skill Loading Sequence

```
1. No skill (FASE 0: manual setup)
2. arquitecto (FASE 1: plan)
3. design-taste-frontend (FASE 2: visual)
4. worker (FASE 3: Stripe integration)
5. arquitecto (FASE 4: security review)
6. worker (FASE 5: polish + deploy)
```

## Anti-Patterns to Avoid

- **NEVER** skip FASE 1 (arquitecto) to "save time" — the memory files prevent re-work
- **NEVER** mix FASE 2 (visual) with FASE 3 (Stripe) — visual first, integration second
- **NEVER** deploy without FASE 4 (arquitecto re-review) — security is non-negotiable
- **NEVER** let the worker refactor during FASE 3 — diff minimum, no "while I'm here" improvements
- **NEVER** use client-side price computation — always server-verified

## Dependencies to Install (FASE 0)

```bash
# Core
npx create-next-app@latest gouppers-ebook --typescript --tailwind --app --src-dir
cd gouppers-ebook

# Animation
npm install motion

# Payments
npm install stripe @stripe/stripe-js

# Storage
npm install @supabase/supabase-js

# Icons
npm install @phosphor-icons/react
```

## Environment Variables Required

```env
# Stripe (from GoUppers Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase (create project at supabase.com)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Estimated Timeline

| Phase | Time | Owner |
|-------|------|-------|
| FASE 0: Setup | 30 min | Manual |
| FASE 1: Arquitecto | 20 min | Skill |
| FASE 2: Visual Design | 3-4 hours | Skill |
| FASE 3: Stripe Integration | 2-3 hours | Skill |
| FASE 4: Security Review | 15 min | Skill |
| FASE 5: Polish + Deploy | 1-2 hours | Skill |
| **Total** | **~7-10 hours** | |

---

*Pipeline created: 2026-07-24*
*Project: GoUppers eBook Landing Page*
*Status: READY TO EXECUTE*
