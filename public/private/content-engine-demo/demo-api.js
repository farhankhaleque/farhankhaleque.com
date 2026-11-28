// Content Engine, web demo.
// The real app is a small Python server (gui.py) that calls Claude and Nova Canvas on
// Amazon Bedrock. This file stands in for that server inside the browser, the same way
// `python gui.py --demo` does: sample copy instead of Claude, tinted copies of your
// photo instead of Nova Canvas. The voice check, dash autofix and exports are ports of
// engine/voice.py and engine/export.py, so those behave exactly like the real thing.
(() => {
  const SAMPLE = {"product_title": "Boxy Loopback Hoodie", "short_description": "A heavyweight hoodie cut boxy and cropped, made by hand in a run of 15.", "product_description": "I cut this one wide in the body and short in the length, so it sits right at the waist instead of hanging. The shoulder drops about two inches, which is what gives it that square shape on the hanger and on you.\n\nIt's heavy cotton loopback — the kind that holds its shape after a hundred washes. Rib at the cuffs and hem is 1x1 and cut tight so the sleeves stack.\n\nThere are 15 of these. When they're gone, they're gone.", "details": ["Heavy cotton loopback, weight to confirm", "Boxy, cropped body with a dropped shoulder", "1x1 rib cuffs and hem", "Double needle stitching throughout", "Handmade in New York, 15 pieces"], "fit_notes": "Runs wide and short on purpose. Take your usual size for the intended fit, or size up if you want more length.", "care_instructions": ["Wash cold, inside out", "Hang dry or tumble low", "Don't iron the print"], "seo": {"meta_title": "Boxy Loopback Hoodie | Aurangzeb", "meta_description": "Heavyweight boxy hoodie, cropped with a dropped shoulder. Handmade in New York, only 15 made.", "url_handle": "boxy-loopback-hoodie-black", "keywords": ["boxy hoodie", "cropped hoodie men", "heavyweight hoodie", "handmade streetwear", "limited streetwear drop", "loopback hoodie"], "image_alt_text": ["Black boxy cropped hoodie, front view on a hanger", "Back view of the black hoodie showing the dropped shoulder"]}, "instagram_captions": [{"angle": "craft", "caption": "Cut this pattern three times before the shoulder sat right.\n\n15 made. Drop 5, Friday 7pm.", "hashtags": ["#streetwear", "#handmade", "#boxyfit", "#nycstreetwear", "#smallbatch", "#patternmaking", "#hoodie", "#aurangzeb"]}, {"angle": "fit", "caption": "Wide body, short length, sleeves that stack. This is the fit I kept wanting and couldn't find.", "hashtags": ["#boxyhoodie", "#croppedhoodie", "#fitcheck", "#streetwear", "#nyc", "#menswear", "#smallbrand", "#aurangzeb"]}, {"angle": "drop", "caption": "Drop 5 – Friday, 7pm. 15 pieces. Link in bio.", "hashtags": ["#drop", "#limited", "#streetwear", "#aurangzeb", "#nyc", "#handmade", "#newdrop", "#smallbatch"]}], "drop_announcement": "Drop 5 is Friday at 7pm.\nThe boxy hoodie, 15 made by hand.\nNo restock.", "tech_pack": {"style_name": "Boxy Loopback Hoodie", "category": "Knit top / Hoodie", "silhouette": "Boxy, cropped to high hip, dropped shoulder approx 2 in, two piece hood", "fabric_suggestions": ["100% cotton loopback terry, 400 to 450 GSM", "Cotton/poly 80/20 fleece-back, 380 GSM as a cost option"], "trims": ["Flat cotton drawcord with metal aglets", "Metal eyelets, 10 mm", "Woven neck label", "Care label at left side seam"], "construction_details": ["Overlock seams with coverstitch topstitch", "1x1 rib cuff and hem, 3 in finished", "Kangaroo pocket, bartacked at openings", "Double needle armhole"], "measurement_points": ["Body length HPS to hem", "Chest width 1 in below armhole", "Shoulder drop", "Sleeve length from CB neck", "Hem rib height", "Hood height and width"], "colorways": ["Black (shown)", "Bone", "Washed charcoal"], "open_questions": ["Confirm fabric GSM", "Garment dyed or piece dyed?", "Print or embroidery placement, if any"]}, "needs_confirmation": ["Fabric weight and composition", "Care instructions depend on fabric", "Whether it is garment dyed"]};
  const SCENES = {"Brooklyn street": "on a cobblestone street in DUMBO Brooklyn under the Manhattan Bridge, overcast daylight, editorial streetwear photo", "Concrete studio": "in a minimal dark concrete studio, single hard light from the left, deep shadows, black and grey tones", "Rooftop at dusk": "on a New York rooftop at dusk, city lights soft in the background, cinematic but natural", "Workshop table": "laid on a worn wooden cutting table in a small tailoring workshop with pattern paper, chalk and shears nearby", "Flat lay": "flat lay on textured black paper, shot from directly above, soft even light"};
  let VOICE = "# Aurangzeb brand voice\n\nEdit this file to change how every piece of copy sounds. The app reads it on each run.\n\n## Who we are\nAurangzeb is a small streetwear label out of New York, run by Farhan Khaleque.\nEvery piece is designed and handmade by him: his own patterns, his own fits.\nDrops are tiny, usually 10 to 20 pieces per style, and they don't come back.\nPrices sit around $70 to $130.\n\nFarhan has worked every layer of the garment: pattern making and construction,\nfabric sourcing, production, buying and e-commerce, across New York, Dhaka and\nMadrid. The copy can lean on that. It's someone who actually knows how clothes\nare made talking about a thing he made.\n\n## How it sounds\n- Semi informal and direct. Like Farhan explaining a piece to a friend who asked about it.\n- Confident without hype. Let the construction and the numbers do the selling.\n- Specific over pretty. \"12 oz loopback, cut boxy, double needle hems\" beats \"premium comfort.\"\n- Short sentences mixed with a few longer ones. Paragraphs end when the point is made.\n- Contractions are fine. First person (\"I cut this...\") works on Instagram, sparingly on the product page.\n\n## What to lean on\n- Handmade, low quantity, numbered or limited when true.\n- Fit decisions and why they were made.\n- Fabric and construction details a customer can feel.\n\n## What to avoid\n- Luxury clichés, fake urgency, \"must have,\" \"elevate your wardrobe.\"\n- Emoji walls. One or two on Instagram at most, none on the product page.\n- Hyphens and dashes of any kind in customer facing copy.\n\n## Instagram\n- First line has to work on its own, because that's all people see before \"more.\"\n- Tell one thing: how it was made, how it fits, or when it drops. Not all three.\n- End with the practical bit: drop date, link in bio, size run.\n";
  const state = {
    demo: true,
    region: "us-east-1",
    profile: "",
    text_model_id: "us.anthropic.claude-sonnet-4-6",
    image_model_id: "amazon.nova-canvas-v1:0",
    voice_path: "brand/voice.md",
    output_dir: "outputs",
  };
  try { VOICE = localStorage.getItem("ce-demo-voice") || VOICE; } catch (_) {}

  // ---------------------------------------------------------------- voice (engine/voice.py)
  const BANNED = [
    "delve", "tapestry", "testament to", "navigate", "landscape", "realm", "pivotal",
    "crucial", "multifaceted", "nuanced", "robust", "seamless", "leverage", "foster",
    "underscore", "showcase", "embark", "journey", "vibrant", "intricate", "bustling",
    "ever evolving", "fast paced world", "it's important to note", "it's worth noting",
    "at the end of the day", "in conclusion", "ultimately", "moreover", "furthermore",
    "elevate", "elevated", "game changer", "must have", "effortless", "timeless",
    "unleash", "curated",
  ];
  const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  function customerFields(c) {
    const out = {
      product_title: c.product_title,
      short_description: c.short_description,
      product_description: c.product_description,
      fit_notes: c.fit_notes,
      drop_announcement: c.drop_announcement,
      "seo.meta_title": c.seo.meta_title,
      "seo.meta_description": c.seo.meta_description,
    };
    c.details.forEach((t, i) => (out[`details[${i}]`] = t));
    c.care_instructions.forEach((t, i) => (out[`care_instructions[${i}]`] = t));
    c.seo.image_alt_text.forEach((t, i) => (out[`seo.image_alt_text[${i}]`] = t));
    c.instagram_captions.forEach((cap, i) => (out[`instagram_captions[${i}].caption`] = cap.caption));
    return out;
  }
  function around(text, idx, span = 30) {
    const start = Math.max(0, idx - span), end = Math.min(text.length, idx + span);
    return (start ? "..." : "") + text.slice(start, end).replace(/\n/g, " ") + (end < text.length ? "..." : "");
  }
  function check(c) {
    const issues = [];
    for (const [field, text] of Object.entries(customerFields(c))) {
      for (const m of text.matchAll(/[-–—]/g)) issues.push({ field, problem: "dash", snippet: around(text, m.index) });
      const lower = text.toLowerCase();
      for (const word of BANNED) {
        for (const m of lower.matchAll(new RegExp(`\\b${reEsc(word)}\\b`, "g")))
          issues.push({ field, problem: `banned word '${word}'`, snippet: around(text, m.index) });
      }
    }
    const s = c.seo;
    if (s.meta_title.length > 60) issues.push({ field: "seo.meta_title", problem: `${s.meta_title.length} chars (keep under 60)`, snippet: s.meta_title });
    if (s.meta_description.length > 155)
      issues.push({ field: "seo.meta_description", problem: `${s.meta_description.length} chars (keep under 155)`, snippet: s.meta_description.slice(0, 80) + "..." });
    return issues;
  }
  function fixDashes(t) {
    t = t.replace(/(\d)\s*[–—-]\s*(\d)/g, "$1 to $2");
    t = t.replace(/\s*[–—]\s*/g, ", ");
    t = t.replace(/\s+-\s+/g, ", ");
    t = t.replace(/\b([Tt])-shirt/g, (_, T) => (T === "T" ? "Tee" : "tee"));
    t = t.replace(/(?<=[A-Za-z])-(?=[A-Za-z])/g, " ");
    t = t.replace(/,\s*,/g, ",");
    t = t.replace(/,\s*([.!?])/g, "$1");
    return t;
  }
  function autofix(c) {
    const d = structuredClone(c);
    for (const k of ["product_title", "short_description", "product_description", "fit_notes", "drop_announcement"]) d[k] = fixDashes(d[k]);
    d.details = d.details.map(fixDashes);
    d.care_instructions = d.care_instructions.map(fixDashes);
    d.seo.meta_title = fixDashes(d.seo.meta_title);
    d.seo.meta_description = fixDashes(d.seo.meta_description);
    d.seo.image_alt_text = d.seo.image_alt_text.map(fixDashes);
    d.instagram_captions.forEach((cap) => (cap.caption = fixDashes(cap.caption)));
    return d;
  }

  // ---------------------------------------------------------------- export (engine/export.py)
  function toMarkdown(c) {
    const L = [`# ${c.product_title}`, "", `_${c.short_description}_`, "", "## Product page", "", c.product_description, ""];
    L.push("### Details", ...c.details.map((d) => `- ${d}`), "");
    L.push("### Fit", c.fit_notes, "", "### Care", ...c.care_instructions.map((d) => `- ${d}`), "");
    const s = c.seo;
    L.push(
      "## SEO", `- **Meta title** (${s.meta_title.length}): ${s.meta_title}`,
      `- **Meta description** (${s.meta_description.length}): ${s.meta_description}`,
      `- **URL handle:** ${s.url_handle}`, `- **Keywords:** ${s.keywords.join(", ")}`,
      ...s.image_alt_text.map((a, i) => `- **Alt text ${i + 1}:** ${a}`), "",
    );
    L.push("## Instagram", "");
    for (const cap of c.instagram_captions) L.push(`### ${cap.angle}`, cap.caption, "", cap.hashtags.join(" "), "");
    L.push("## Drop announcement", "", c.drop_announcement, "");
    const t = c.tech_pack;
    L.push("## Tech pack (draft)", `**Style:** ${t.style_name}  `, `**Category:** ${t.category}  `, `**Silhouette:** ${t.silhouette}`, "");
    for (const [title, items] of [
      ["Fabric", t.fabric_suggestions], ["Trims", t.trims], ["Construction", t.construction_details],
      ["Points of measure", t.measurement_points], ["Colorways", t.colorways], ["Open questions", t.open_questions],
    ]) L.push(`### ${title}`, ...items.map((i) => `- ${i}`), "");
    L.push("## Check before publishing", ...c.needs_confirmation.map((n) => `- [ ] ${n}`), "");
    return L.join("\n");
  }
  const htmlEsc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  const csvCell = (v) => (/[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  function toShopifyCsv(c, price = "", vendor = "Aurangzeb") {
    let body = c.product_description.split("\n\n").filter((p) => p.trim()).map((p) => `<p>${htmlEsc(p.trim())}</p>`).join("");
    body += "<ul>" + c.details.map((d) => `<li>${htmlEsc(d)}</li>`).join("") + "</ul>";
    const row = {
      Handle: c.seo.url_handle,
      Title: c.product_title,
      "Body (HTML)": body,
      Vendor: vendor,
      Type: c.tech_pack.category.split("/").pop().trim(),
      Tags: c.seo.keywords.slice(0, 8).join(", "),
      Published: "FALSE",
      "Variant Price": String(price).replace(/[^\d.]/g, ""),
      "Image Alt Text": c.seo.image_alt_text[0] || "",
      "SEO Title": c.seo.meta_title,
      "SEO Description": c.seo.meta_description,
      Status: "draft",
    };
    const cols = Object.keys(row);
    return cols.map(csvCell).join(",") + "\r\n" + cols.map((k) => csvCell(row[k])).join(",") + "\r\n";
  }

  // ---------------------------------------------------------------- images (DemoClient.invoke_model)
  const TINT = { cutout: [240, 240, 240], scene: [60, 90, 140], colorway: [150, 90, 40] };
  const LABEL = { cutout: () => "Clean cutout", scene: (v) => `Scene: ${v}`, colorway: (v) => `Colorway: ${v}` };
  async function demoImage(dataUrl, kind) {
    const img = await new Promise((ok, bad) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => bad(new Error("Couldn't read that photo")); i.src = dataUrl; });
    const scale = Math.min(1, 1024 / Math.max(img.width, img.height));
    const cv = document.createElement("canvas");
    cv.width = Math.round(img.width * scale); cv.height = Math.round(img.height * scale);
    const ctx = cv.getContext("2d");
    ctx.drawImage(img, 0, 0, cv.width, cv.height);
    const px = ctx.getImageData(0, 0, cv.width, cv.height), d = px.data, [r, g, b] = TINT[kind];
    for (let i = 0; i < d.length; i += 4) {
      const y = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      d[i] = y * 0.65 + r * 0.35; d[i + 1] = y * 0.65 + g * 0.35; d[i + 2] = y * 0.65 + b * 0.35;
    }
    ctx.putImageData(px, 0, 0);
    return cv.toDataURL("image/png").split(",")[1];
  }

  // ---------------------------------------------------------------- zip (stored, no compression)
  const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  const crc32 = (u8) => { let c = 0xffffffff; for (const b of u8) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  function zip(files) {
    const enc = new TextEncoder(), parts = [], central = [];
    let offset = 0;
    for (const f of files) {
      const name = enc.encode(f.name), data = typeof f.data === "string" ? enc.encode(f.data) : f.data, crc = crc32(data);
      const h = new DataView(new ArrayBuffer(30));
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint32(14, crc, true);
      h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, name.length, true);
      parts.push(new Uint8Array(h.buffer), name, data);
      const c = new DataView(new ArrayBuffer(46));
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint32(16, crc, true);
      c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, name.length, true); c.setUint32(42, offset, true);
      central.push(new Uint8Array(c.buffer), name);
      offset += 30 + name.length + data.length;
    }
    const size = central.reduce((n, p) => n + p.length, 0);
    const e = new DataView(new ArrayBuffer(22));
    e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true);
    e.setUint32(12, size, true); e.setUint32(16, offset, true);
    return new Blob([...parts, ...central, new Uint8Array(e.buffer)], { type: "application/zip" });
  }
  const b64bytes = (s) => Uint8Array.from(atob(s.includes(",") ? s.split(",")[1] : s), (ch) => ch.charCodeAt(0));

  // ---------------------------------------------------------------- routes (gui.py ROUTES)
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const garmentPhrase = (category, title) => ((category ? category.split("/").pop() : title).trim().toLowerCase() || "garment");
  const pkg = (content, autoFix) => {
    const c = autoFix ? autofix(content) : content;
    return { content: c, issues: check(c), usage: { inputTokens: 0, outputTokens: 0 }, garment: garmentPhrase(c.tech_pack.category, c.product_title) };
  };
  const fullState = () => ({ ...state, voice: VOICE, scenes: SCENES });
  const ROUTES = {
    "/api/state": () => fullState(),
    "/api/settings": (b) => {
      for (const k of ["region", "text_model_id", "image_model_id"]) if ((b[k] || "").trim()) state[k] = b[k].trim();
      state.profile = (b.profile || "").trim();
      return fullState();
    },
    "/api/voice": (b) => { VOICE = b.voice || ""; try { localStorage.setItem("ce-demo-voice", VOICE); } catch (_) {} return { saved: "this browser (demo)" }; },
    "/api/check": () => ({ claude: "Demo mode, no call made", canvas: "Demo mode, no call made", ok: true }),
    "/api/models": () => ({ text: ["us.anthropic.claude-sonnet-4-6 (demo)"], image: ["amazon.nova-canvas-v1:0"] }),
    "/api/normalize": () => { throw new Error("This browser can't preview HEIC photos. Use a JPEG or PNG in the web demo (the local app converts HEIC for you)."); },
    "/api/generate": async (b) => { await wait(1400); return pkg(structuredClone(SAMPLE), b.auto_fix !== false); },
    "/api/revise": async (b) => {
      if (!(b.feedback || "").trim()) throw new Error("Write some notes for the rewrite first.");
      await wait(1200);
      return pkg(structuredClone(SAMPLE), b.auto_fix !== false);
    },
    "/api/voice-check": (b) => { const c = b.fix ? autofix(b.content) : b.content; return { content: c, issues: check(c) }; },
    "/api/image": async (b) => {
      if (!LABEL[b.kind]) throw new Error(`Unknown image job '${b.kind}'`);
      await wait(700);
      return { label: LABEL[b.kind](b.value || ""), png: await demoImage(b.photo, b.kind) };
    },
    "/api/exports": (b) => ({
      markdown: toMarkdown(b.content), csv: toShopifyCsv(b.content, b.price || ""),
      json: JSON.stringify(b.content, null, 2), handle: b.content.seo.url_handle || "product",
    }),
    "/api/save": () => { throw new Error("The web demo can't write to your disk. Use Download .zip instead."); },
  };
  function zipRoute(b) {
    const files = [
      { name: "content.json", data: JSON.stringify(b.content, null, 2) },
      { name: "content.md", data: toMarkdown(b.content) },
      { name: "shopify_import.csv", data: toShopifyCsv(b.content, b.price || "") },
    ];
    (b.images || []).forEach((img, i) =>
      files.push({ name: `${String(i + 1).padStart(2, "0")}-${img.label.replace(/:/g, "").replace(/ /g, "-").toLowerCase()}.png`, data: b64bytes(img.png) }),
    );
    return zip(files);
  }

  const json = (status, obj) => new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
  const realFetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const path = new URL(typeof input === "string" ? input : input.url, location.href).pathname;
    const m = path.match(/\/api\/[a-z-]+$/);
    if (!m) return realFetch(input, init);
    const route = m[0];
    let body = {};
    try { body = init.body ? JSON.parse(init.body) : {}; } catch (_) { return json(400, { error: "Bad JSON" }); }
    try {
      if (route === "/api/zip") return new Response(zipRoute(body), { status: 200, headers: { "Content-Type": "application/zip" } });
      const fn = ROUTES[route];
      if (!fn) return json(404, { error: "Not found" });
      return json(200, await fn(body));
    } catch (e) {
      return json(400, { error: e.message || String(e) });
    }
  };
})();
