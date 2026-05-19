#!/usr/bin/env node
/**
 * Upload the Off-Season Plan PDF into the Supabase Storage bucket
 * `protected-downloads`.
 *
 * Usage:
 *   1. Place the PDF at `private/off-season-plan-2026-elite.pdf`
 *   2. Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_URL)
 *      in your shell or .env.local
 *   3. Run: `node scripts/upload-off-season-pdf.mjs`
 *
 * The script is idempotent — re-running it will overwrite the existing file.
 */

import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Best-effort: load .env.local if present (without adding a dotenv dependency).
try {
  const envFile = resolve(__dirname, "..", ".env.local");
  const text = await readFile(envFile, "utf8");
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
    }
  }
} catch {
  // .env.local optional
}

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "✗ Fehlende Umgebungsvariablen: SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY müssen gesetzt sein."
  );
  process.exit(1);
}

const BUCKET = "protected-downloads";
const REMOTE_PATH = "off-season-plan-2026-elite.pdf";
const LOCAL_PATH = resolve(__dirname, "..", "private", REMOTE_PATH);

console.log(`→ Lade PDF: ${LOCAL_PATH}`);

let buffer;
try {
  buffer = await readFile(LOCAL_PATH);
} catch (err) {
  console.error(`✗ Konnte PDF nicht lesen: ${err.message}`);
  console.error(`  Erwartet unter: ${LOCAL_PATH}`);
  process.exit(1);
}

console.log(`→ Datei-Größe: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Make sure the bucket exists (idempotent).
const { error: bucketError } = await supabase.storage.createBucket(BUCKET, {
  public: false,
});

if (bucketError && !/already exists/i.test(bucketError.message ?? "")) {
  console.error(`✗ Bucket-Erstellung fehlgeschlagen: ${bucketError.message}`);
  process.exit(1);
}

console.log(`→ Bucket "${BUCKET}" bereit (privat).`);

const { error: uploadError } = await supabase.storage
  .from(BUCKET)
  .upload(REMOTE_PATH, buffer, {
    contentType: "application/pdf",
    upsert: true,
  });

if (uploadError) {
  console.error(`✗ Upload fehlgeschlagen: ${uploadError.message}`);
  process.exit(1);
}

console.log(`✓ Hochgeladen: ${BUCKET}/${REMOTE_PATH}`);
console.log("");
console.log("Test-Download (signed URL, 5 Min gültig):");

const { data: signed } = await supabase.storage
  .from(BUCKET)
  .createSignedUrl(REMOTE_PATH, 60 * 5);

console.log(signed?.signedUrl ?? "(keine URL erzeugt)");
