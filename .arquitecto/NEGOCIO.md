# NEGOCIO — GoUppers eBook Landing Page

> Reglas de negocio, invariantes y requisitos reales. Leer antes de cualquier cambio.

## Status: POBLADO (FASE 1) — 2026-07-24

## Contexto (de `PIPELINE.md`)
- **Cliente:** GoUppers (gestión de alquileres vacacionales).
- **Producto:** eBook "Guía para propietarios" (venta digital, entrega instantánea).
- **Precio:** TBD, rango USD 19–27. Debe fijarse en Stripe (un `Price` fijo), NO en código.
- **Comisión:** 25% al builder por venta (acuerdo comercial, fuera del código de la app).
- **Stripe:** cuenta la posee GoUppers.
- **Timeline:** 3 días.

## Invariantes que NO pueden romperse
1. **El precio es autoritativo del lado servidor.** Se resuelve desde `STRIPE_PRICE_ID`; el cliente jamás lo envía ni lo puede alterar.
2. **La descarga del eBook solo se entrega tras pago confirmado** (`payment_status = paid` verificado server-side contra Stripe, no confiando en el redirect del navegador).
3. **El PDF nunca es públicamente accesible.** Bucket privado en Supabase; entrega solo vía **signed URL con expiración corta**.
4. **El webhook es idempotente.** Stripe reintenta; procesar la misma `checkout.session.completed` dos veces no debe duplicar efectos ni romper.
5. **Ningún secreto en el bundle del cliente.** Solo `NEXT_PUBLIC_*` cruzan al navegador.

## Actores y permisos
- **Visitante anónimo:** ve la landing, dispara checkout. No autentica (compra sin cuenta).
- **Comprador:** tras pago, obtiene link de descarga temporal ligado a su `session_id` pagado.
- **Stripe (sistema):** único emisor confiable de `checkout.session.completed`, verificado por firma.

## Fallos a la mitad
- Pago OK pero webhook falla → Stripe reintenta (idempotencia cubre). `/success` también verifica contra Stripe como segundo camino de entrega, así que la descarga no depende solo del webhook.
- Supabase caído al generar signed URL → mostrar error claro + camino de reintento/soporte (no romper con stack trace).

## Fuera de alcance (código)
- Cálculo/pago de la comisión 25% (acuerdo comercial externo).
- Cuentas de usuario / login (compra anónima).

---
*Creado: 2026-07-24 · Última actualización: 2026-07-24 (FASE 1)*
