import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";

export const runtime = "nodejs";

/** Stripe webhook. Verifies the HMAC signature against the RAW body BEFORE
 *  trusting anything (NEGOCIO.md #5) — without this, anyone could forge a sale.
 *  Handler is idempotent: it performs no side effects that break on Stripe's
 *  retries (NEGOCIO.md #4). Delivery to the buyer happens via /api/session. */
export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      rawBody,
      signature,
      STRIPE_WEBHOOK_SECRET(),
    );
  } catch (err) {
    console.error("[webhook] signature verification failed:", err);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    // Idempotent: log only. No DB / no email in this build (DEUDA.md).
    // Safe to receive this event more than once.
    console.info(
      `[webhook] sale confirmed session=${session.id} email=${session.customer_details?.email ?? "n/a"}`,
    );
  }

  // Always 200 for handled/ignored events so Stripe stops retrying.
  return NextResponse.json({ received: true });
}
