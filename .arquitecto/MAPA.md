# MAPA — GoUppers eBook Landing Page

> Memoria del arquitecto. Leer antes de cualquier cambio. Toda afirmación con `archivo:línea`.

## Status: POBLADO (FASE 1) — 2026-07-24

## Stack (verificado en `package.json`)
- **Framework:** Next.js `16.2.11` (App Router, Turbopack) — `package.json`
- **UI:** React `19.2.4`, Tailwind CSS `v4` (`@tailwindcss/postcss`)
- **Animación:** `motion` `^12.42` (Framer Motion, API `motion/react`)
- **Pagos:** `stripe` `^22.3` (server SDK) + `@stripe/stripe-js` `^9.12` (client)
- **Storage:** `@supabase/supabase-js` `^2.110` (entrega del PDF)
- **Iconos:** `@phosphor-icons/react` `^2.1`
- **TS:** `^5`, alias `@/*` → `src/*` (`tsconfig.json`)

## Estructura (objetivo, poblada en FASE 2–3)
```
src/
├── app/
│   ├── layout.tsx        # raíz (existe, scaffold)
│   ├── page.tsx          # landing (existe, scaffold → reemplaza FASE 2)
│   ├── globals.css       # tokens Tailwind v4 + paleta cliente
│   ├── success/page.tsx  # confirmación + descarga (FASE 3)
│   └── api/
│       ├── checkout/route.ts   # crea Checkout Session (server)
│       ├── webhook/route.ts     # verifica firma Stripe, entrega (server)
│       └── session/route.ts     # estado de sesión + link descarga (server)
├── components/           # hero, features, testimonials, pricing-cta, footer, ui/*
└── lib/
    ├── stripe.ts         # cliente Stripe server-only
    └── supabase.ts       # cliente Supabase (service role, server-only)
```

## Frontera cliente ↔ servidor (CRÍTICA)
- **Server-only:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_PRICE_ID`.
  Solo se usan en `src/lib/*` y `src/app/api/*` (Route Handlers = server).
- **Client-safe (NEXT_PUBLIC_):** solo `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_APP_URL`.
- **Regla:** el precio NUNCA se computa ni se envía desde el cliente. El cliente solo dispara `POST /api/checkout`; el servidor resuelve el precio desde `STRIPE_PRICE_ID`.

## Flujo de compra (fuente de verdad = Stripe + webhook)
1. Cliente click CTA → `POST /api/checkout` → servidor crea Checkout Session con `price` fijo de env → devuelve `session.url`.
2. Redirect a Stripe Checkout (hosted). Pago ocurre en Stripe.
3. Stripe → `POST /api/webhook` (`checkout.session.completed`): verificar firma HMAC, marcar cumplido (idempotente).
4. Redirect a `/success?session_id=...` → `GET /api/session` verifica `payment_status=paid` server-side → genera **signed URL** de Supabase (expira) → botón descarga.

## Convenciones
- Route Handlers bajo `src/app/api/**/route.ts`, `export async function POST/GET`.
- Clientes de servicios externos aislados en `src/lib/` (no instanciar Stripe/Supabase en componentes).
- Env accedida solo server-side salvo prefijo `NEXT_PUBLIC_`.

---
*Creado: 2026-07-24 · Última actualización: 2026-07-24 (FASE 1)*
