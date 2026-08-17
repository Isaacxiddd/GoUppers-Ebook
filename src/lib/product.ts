/** Display metadata for the eBook. The AUTHORITATIVE price lives in Stripe
 *  (STRIPE_PRICE_ID) and is resolved server-side at checkout — see NEGOCIO.md
 *  invariant #1. These values are for presentation only. */
export const PRODUCT = {
  name: "Guía para propietarios",
  subtitle: "El sistema GoUppers para alquiler vacacional rentable",
  currency: "USD",
  // TODO(FASE 5): confirm final price with GoUppers (rango 19–27) and align with Stripe Price.
  price: 24,
  format: "Guía en PDF",
} as const;

export const priceLabel = `${PRODUCT.currency} ${PRODUCT.price}`;
