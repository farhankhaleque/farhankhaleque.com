// Password-protected pages under /private.
//
// Each private/<name>.html (gitignored plaintext) is encrypted into
// src/data/private/<name>.enc.json, which is what gets committed and shipped.
// index.html becomes /private, anything else becomes /private/<name>.
//
//   npm run encrypt-private -- "password"   plaintext -> ciphertext
//   npm run decrypt-private -- "password"   ciphertext -> plaintext (to edit on a fresh checkout)
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync } from "node:fs";
import { webcrypto as crypto } from "node:crypto";

const decrypt = process.argv.includes("--decrypt");
const password = process.argv.filter((a) => a !== "--decrypt")[2] || process.env.PRIVATE_PASSWORD;
if (!password) {
  console.error(`Give a password: npm run ${decrypt ? "decrypt" : "encrypt"}-private -- "your password"`);
  process.exit(1);
}

const SRC = "private";
const OUT = "src/data/private";
const ITERATIONS = 600000;
const enc = new TextEncoder();
const b64 = (u8) => Buffer.from(u8).toString("base64");
const unb64 = (s) => new Uint8Array(Buffer.from(s, "base64"));

async function keyFor(salt, usage) {
  const base = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    [usage],
  );
}

mkdirSync(SRC, { recursive: true });
mkdirSync(OUT, { recursive: true });

if (decrypt) {
  for (const f of readdirSync(OUT).filter((f) => f.endsWith(".enc.json"))) {
    const p = JSON.parse(readFileSync(`${OUT}/${f}`, "utf8"));
    const key = await keyFor(unb64(p.salt), "decrypt");
    let plain;
    try {
      plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(p.iv) }, key, unb64(p.data));
    } catch {
      console.error(`Wrong password for ${f}.`);
      process.exit(1);
    }
    const name = f.replace(/\.enc\.json$/, "");
    writeFileSync(`${SRC}/${name}.html`, Buffer.from(plain));
    console.log(`Wrote ${SRC}/${name}.html`);
  }
} else {
  const pages = readdirSync(SRC).filter((f) => f.endsWith(".html"));
  if (!pages.includes("index.html")) {
    console.error(`Missing ${SRC}/index.html. Run npm run decrypt-private -- "password" first.`);
    process.exit(1);
  }
  // Drop ciphertext for pages that no longer exist.
  for (const f of readdirSync(OUT)) {
    if (!pages.includes(f.replace(/\.enc\.json$/, ".html"))) rmSync(`${OUT}/${f}`);
  }
  for (const f of pages) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await keyFor(salt, "encrypt");
    const data = new Uint8Array(
      await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(readFileSync(`${SRC}/${f}`, "utf8"))),
    );
    const name = f.replace(/\.html$/, "");
    writeFileSync(
      `${OUT}/${name}.enc.json`,
      JSON.stringify({ iterations: ITERATIONS, salt: b64(salt), iv: b64(iv), data: b64(data) }, null, 2) + "\n",
    );
    console.log(`Encrypted ${SRC}/${f} -> /private${name === "index" ? "" : "/" + name}`);
  }
}
