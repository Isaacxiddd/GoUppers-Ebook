import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createEbookDownloadUrl } from "@/lib/supabase";

export const runtime = "nodejs";

/** Verifies a checkout session server-side against Stripe and, ONLY if paid,
 *  returns a fresh signed download URL. The success page must not trust the
 *  browser redirect (NEGOCIO.md #2). */
export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "missing_session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ status: "unpaid" }, { status: 402 });
    }

    // Paid → mint a short-lived signed URL to the private PDF (NEGOCIO.md #3).
    const downloadUrl = await createEbookDownloadUrl();
    return NextResponse.json({
      status: "paid",
      downloadUrl,
      email: session.customer_details?.email ?? null,
    });
  } catch (err) {
    console.error("[session] failed:", err);
    return NextResponse.json({ error: "session_lookup_failed" }, { status: 500 });
  }
}
