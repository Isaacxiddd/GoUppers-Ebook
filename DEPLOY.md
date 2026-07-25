# Deploy en Vercel — GoUppers eBook

Cuenta Vercel logueada: `isaacjosegarciamarquez-8791` (`vercel whoami`).
Framework: Next.js 16 (auto-detectado). Región: `gru1` (São Paulo) — ver `vercel.json`.

> El orden importa: **primero se despliega para tener la URL**, luego se registra
> el webhook de Stripe (de ahí sale su secret), luego se inyectan las claves y se
> redespliega. La landing funciona sin claves; **solo el checkout** queda inactivo
> hasta el paso 4.

---

## 1) Asociar la carpeta al proyecto Vercel (una vez)

```powershell
vercel link
```

## 2) Primer deploy (para obtener el dominio)

```powershell
vercel --prod
```

Anotá el dominio que devuelve, p. ej. `https://gouppers-ebook.vercel.app`.

## 3) Crear las claves reales

**Stripe** (dashboard de GoUppers):
- Producto + **Price** único (rango USD 19–27) → copiar `price_...` → `STRIPE_PRICE_ID`.
- `Developers > API keys` → `sk_live_...` (o `sk_test_...` para probar) → `STRIPE_SECRET_KEY`.
- `Developers > Webhooks > Add endpoint`:
  - URL: `https://TU-DOMINIO/api/webhook`
  - Evento: `checkout.session.completed`
  - Copiar el **Signing secret** `whsec_...` → `STRIPE_WEBHOOK_SECRET`.

**Supabase**:
- Crear bucket **privado** (no público), p. ej. `ebooks`.
- Subir el PDF, p. ej. `guia-propietarios.pdf` → define `SUPABASE_EBOOK_BUCKET` / `SUPABASE_EBOOK_PATH`.
- `Project Settings > API`: `Project URL` → `SUPABASE_URL`; `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`.

## 4) Inyectar las claves en Vercel

Copiá `.env.example` a `.env.production.local`, completá los valores reales, y:

```powershell
./scripts/set-vercel-env.ps1
```

Variables que setea (production):

| Variable | Tipo | Origen |
|---|---|---|
| `STRIPE_SECRET_KEY` | server | Stripe API keys |
| `STRIPE_WEBHOOK_SECRET` | server | Stripe webhook endpoint |
| `STRIPE_PRICE_ID` | server | Stripe Price |
| `SUPABASE_URL` | server | Supabase API |
| `SUPABASE_SERVICE_ROLE_KEY` | server | Supabase API (service_role) |
| `SUPABASE_EBOOK_BUCKET` | server | nombre del bucket privado |
| `SUPABASE_EBOOK_PATH` | server | ruta del PDF en el bucket |
| `NEXT_PUBLIC_APP_URL` | público | dominio final de Vercel |

> Nunca pongas las keys de Stripe/Supabase con prefijo `NEXT_PUBLIC_`: eso las
> filtra al navegador. Solo `NEXT_PUBLIC_APP_URL` es pública.

## 5) Redeploy con las claves

```powershell
vercel --prod
```

## 6) Prueba end-to-end

1. Abrí el dominio, click **Comprar ahora** → redirige a Stripe Checkout.
2. Pagá con tarjeta de test `4242 4242 4242 4242` (si usás `sk_test_`).
3. Volvés a `/success?session_id=...` → aparece el botón **Descargar el ebook**.
4. Verificá en Stripe que llegó el evento `checkout.session.completed` (200).

---

## Notas
- `.env.local` y `.env.production.local` están gitignored: nunca se commitean.
- Si cambiás el dominio, actualizá `NEXT_PUBLIC_APP_URL` y la URL del webhook en Stripe.
- Deuda técnica y decisiones: ver `.arquitecto/DEUDA.md`.
