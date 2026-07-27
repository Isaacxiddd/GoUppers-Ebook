import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";

export const runtime = "nodejs";

/** Stripe webhook. When STRIPE_WEBHOOK_SECRET is configured, verifies the HMAC
 *  signature. Without it, accepts events unsigned (dev / optional webhook). */
export async function POST(req: Request) {
  const rawBody = await req.text();
  const secret = STRIPE_WEBHOOK_SECRET();
  let event: Stripe.Event;

  if (secret) {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json({ error: "missing_signature" }, { status: 400 });
    }
    try {
      event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
    } catch (err) {
      console.error("[webhook] signature verification failed:", err);
      return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
    }
  } else {
    // No webhook secret configured — parse event directly (dev mode).
    event = JSON.parse(rawBody) as Stripe.Event;
    console.info("[webhook] no secret configured, skipping signature verification");
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.info(
      `[webhook] sale confirmed session=${session.id} email=${session.customer_details?.email ?? "n/a"}`,
    );
  }

  return NextResponse.json({ received: true });
}
