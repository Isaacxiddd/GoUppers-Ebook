import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Server-only Supabase access using the SERVICE ROLE key. This key bypasses
 *  RLS and MUST never reach the browser (MAPA.md — client/server boundary).
 *
 *  Instantiated LAZILY so the production build does not require env at build
 *  time (see DEPLOY.md). */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

let _supabase: SupabaseClient | null = null;
function getSupabaseAdmin(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(
      requireEnv("SUPABASE_URL"),
      requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
  }
  return _supabase;
}

/** Signed, expiring download URL for the private eBook (NEGOCIO.md #3).
 *  The bucket is private; the PDF is never publicly accessible. */
export async function createEbookDownloadUrl(expiresInSeconds = 60 * 30) {
  const bucket = process.env.SUPABASE_EBOOK_BUCKET ?? "ebooks";
  const path = process.env.SUPABASE_EBOOK_PATH ?? "guia-propietarios.pdf";

  const { data, error } = await getSupabaseAdmin()
    .storage.from(bucket)
    .createSignedUrl(path, expiresInSeconds);

  if (error || !data?.signedUrl) {
    throw new Error(`Could not create signed URL: ${error?.message ?? "unknown"}`);
  }
  return data.signedUrl;
}
