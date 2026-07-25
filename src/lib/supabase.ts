import "server-only";
import { createClient } from "@supabase/supabase-js";

/** Server-only Supabase client using the SERVICE ROLE key. This key bypasses
 *  RLS and MUST never reach the browser (MAPA.md — client/server boundary). */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export const supabaseAdmin = createClient(
  requireEnv("SUPABASE_URL"),
  requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const EBOOK_BUCKET = process.env.SUPABASE_EBOOK_BUCKET ?? "ebooks";
const EBOOK_PATH = process.env.SUPABASE_EBOOK_PATH ?? "guia-propietarios.pdf";

/** Signed, expiring download URL for the private eBook (NEGOCIO.md #3).
 *  The bucket is private; the PDF is never publicly accessible. */
export async function createEbookDownloadUrl(expiresInSeconds = 60 * 30) {
  const { data, error } = await supabaseAdmin.storage
    .from(EBOOK_BUCKET)
    .createSignedUrl(EBOOK_PATH, expiresInSeconds);

  if (error || !data?.signedUrl) {
    throw new Error(`Could not create signed URL: ${error?.message ?? "unknown"}`);
  }
  return data.signedUrl;
}
