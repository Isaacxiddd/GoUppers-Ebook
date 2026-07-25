import { NextResponse } from "next/server";
import { getStripe, STRIPE_PRICE_ID, APP_URL } from "@/lib/stripe";

// Stripe SDK needs the Node runtime (not edge).
export const runtime = "nodejs";

/** Creates a Stripe Checkout Session. Price is resolved server-side from
 *  STRIPE_PRICE_ID — the client sends no amount (NEGOCIO.md #1). */
export async function POST() {
  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: STRIPE_PRICE_ID(), quantity: 1 }],
      success_url: `${APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/#comprar`,
      // Collect email so GoUppers can support/resend if needed later.
      customer_creation: "always",
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return NextResponse.json({ error: "no_session_url" }, { status: 502 });
    }
    return NextResponse.json({ url: session.url });
  } catch (err) {
    // Log server-side, never leak internals to the client.
    console.error("[checkout] failed:", err);
    return NextResponse.json({ error: "checkout_failed" }, { status: 500 });
  }
}
