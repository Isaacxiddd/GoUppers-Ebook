# DEUDA — GoUppers eBook Landing Page

> Libro de deuda técnica. Deliberada vs. accidental. Actualizado por worker y arquitecto.

## Status: ACTIVO

### Formato
`[fecha] [deliberada/accidental] descripción — interés — condición de pago`

### Entradas

- [2026-07-24] [deliberada] **Sin persistencia de órdenes (no DB de pedidos).** La entrega se apoya solo en Stripe (webhook + verificación en `/success`). — Interés: no hay registro propio de compras para soporte/reembolsos ni auditoría; si un comprador pierde el link no hay reenvío automático. — Condición de pago: agregar tabla `orders` en Supabase si aparece necesidad de reenvío/soporte/analítica de ventas.
- [2026-07-24] [deliberada] **Testimonios fabricados** (FASE 2 los genera realistas). — Interés: riesgo reputacional/legal si se presentan como reales. — Condición de pago: reemplazar por testimonios reales antes de campaña pública, o etiquetar como ilustrativos.
- [2026-07-24] [deliberada] **Sin rate limiting propio en `/api/checkout`.** — Interés: alguien puede crear muchas sesiones de checkout (spam, costo menor). Stripe absorbe la mayoría. — Condición de pago: añadir rate limit (edge/middleware) si se observa abuso.
- [2026-07-24] [deliberada] **Precio como `STRIPE_PRICE_ID` único, sin variantes.** — Interés: cambiar precio requiere nuevo Price en Stripe + env. — Condición de pago: aceptable para un solo producto; revisar si se agregan bundles.
- [2026-07-24] [deliberada] **Webhook solo loguea (sin persistencia ni email).** La entrega real ocurre en `GET /api/session` verificando `paid` contra Stripe; el webhook confirma firma y registra. — Interés: si el comprador cierra `/success` no hay reenvío automático del PDF. — Condición de pago: agregar envío de email con el link (o tabla `orders`) cuando se priorice resiliencia post-compra.
- [2026-07-24] [deliberada] **Descarga = signed URL de 30 min, sin límite de usos.** — Interés: dentro de esa ventana el link es compartible. — Condición de pago: aceptable para un ebook; si se detecta abuso, bajar expiración o mover a entrega por email con token de un solo uso.
- [2026-07-24] [accidental→aceptada] **Flujo de pago no verificado end-to-end.** Guardas de rutas y firma probados con claves placeholder; falta correr compra real. — Interés: puede haber un desajuste de config (bucket/path/Price) solo visible con credenciales vivas. — Condición de pago: prueba e2e en FASE 5 con claves de GoUppers.

---
*Creado: 2026-07-24 · Última actualización: 2026-07-24 (FASE 1)*
