import "server-only";
import Stripe from "stripe";

/** Server-only Stripe client. Secret key never reaches the browser
 *  (see MAPA.md — client/server boundary). */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export const stripe = new Stripe(requireEnv("STRIPE_SECRET_KEY"));

/** Authoritative price id — the client NEVER sends an amount (NEGOCIO.md #1). */
export const STRIPE_PRICE_ID = () => requireEnv("STRIPE_PRICE_ID");
export const STRIPE_WEBHOOK_SECRET = () => requireEnv("STRIPE_WEBHOOK_SECRET");

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
