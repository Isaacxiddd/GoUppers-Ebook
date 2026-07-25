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

---
*Creado: 2026-07-24 · Última actualización: 2026-07-24 (FASE 1)*
