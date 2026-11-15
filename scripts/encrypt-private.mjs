// Encrypts private/content.html into src/data/private.enc.json for the
// password-protected /private page. Only the ciphertext is committed; the
// plaintext file is gitignored, so the content never sits in the public repo.
//
// Usage:  npm run encrypt-private -- "your password"
//    or:  PRIVATE_PASSWORD="your password" npm run encrypt-private
import { readFileSync, writeFileSync } from "node:fs";
import { webcrypto as crypto } from "node:crypto";

const password = process.argv[2] || process.env.PRIVATE_PASSWORD;
if (!password) {
  console.error('Give a password: npm run encrypt-private -- "your password"');
  process.exit(1);
}

const SRC = "private/content.html";
let html;
try {
  html = readFileSync(SRC, "utf8");
} catch {
  console.error(`Missing ${SRC}. Copy private/content.example.html to ${SRC} and edit it.`);
  process.exit(1);
}

const ITERATIONS = 600000;
const enc = new TextEncoder();
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const baseKey = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
const key = await crypto.subtle.deriveKey(
  { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
  baseKey,
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt"],
);
const data = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(html)));
const b64 = (u8) => Buffer.from(u8).toString("base64");

writeFileSync(
  "src/data/private.enc.json",
  JSON.stringify({ iterations: ITERATIONS, salt: b64(salt), iv: b64(iv), data: b64(data) }, null, 2) + "\n",
);
console.log("Wrote src/data/private.enc.json. Commit it and push to publish.");
