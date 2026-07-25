import type { Metadata } from "next";
import { SuccessContent } from "@/components/success-content";

export const metadata: Metadata = {
  title: "Gracias por tu compra | GoUppers",
  robots: { index: false, follow: false },
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  return <SuccessContent sessionId={session_id} />;
}
