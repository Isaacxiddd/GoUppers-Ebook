import "server-only";
import Stripe from "stripe";

/** Server-only Stripe access. Secret key never reaches the browser
 *  (see MAPA.md — client/server boundary).
 *
 *  The client is instantiated LAZILY on first use, not at module load, so the
 *  production build (Vercel) does not require secrets to be present at build
 *  time — they can be injected after the first deploy (see DEPLOY.md). */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

let _stripe: Stripe | null = null;
export function getStripe(): Stripe {
  if (!_stripe) _stripe = new Stripe(requireEnv("STRIPE_SECRET_KEY"));
  return _stripe;
}

/** Authoritative price id — the client NEVER sends an amount (NEGOCIO.md #1). */
export const STRIPE_PRICE_ID = () => requireEnv("STRIPE_PRICE_ID");
export const STRIPE_WEBHOOK_SECRET = () => process.env.STRIPE_WEBHOOK_SECRET || "";

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
