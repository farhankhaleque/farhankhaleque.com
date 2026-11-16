// "Make the Behr": a clicking game that walks the visitor through the making
// of a (concept) hero necklace, while a counter in the corner adds up the
// hands-on atelier hours each step takes. Built with framer-motion.
//
// Class project prototype (MKTG-UB Luxury Marketing). Hours are illustrative
// estimates, not Jennifer Behr's real production data.
import { useEffect, useMemo, useRef, useState } from "react";
import HelperLayer, { type Helper, type Kind, type Prop } from "./BehrHelpers";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";

type Step = {
  id: string;
  title: string;
  verb: string; // button label
  hours: number;
  clicks: number;
  copy: string;
  tags: string[]; // course frameworks this step demonstrates
};

const STEPS: Step[] = [
  {
    id: "sketch",
    title: "Draw it",
    verb: "Draw a line",
    hours: 6,
    clicks: 4,
    copy: "Jennifer trained as a sculptor and an art historian. Every piece starts as a pencil drawing at the studio table.",
    tags: ["ASCEND · Art", "IP & design"],
  },
  {
    id: "wax",
    title: "Carve the wax",
    verb: "Carve",
    hours: 14,
    clicks: 5,
    copy: "The bow is carved by hand in jeweler's wax, at full size, until it holds its shape from every angle.",
    tags: ["ASCEND · Design", "Skilled labor"],
  },
  {
    id: "source",
    title: "Gather the materials",
    verb: "Choose a material",
    hours: 8,
    clicks: 4,
    copy: "Gold chain from a New York maker, vintage crystal from twenty years of archive, hand-sorted brilliants. We make only what we need.",
    tags: ["ASCEND · Science", "Rare raw materials", "Controlled supply chain"],
  },
  {
    id: "cast",
    title: "Cast in brass",
    verb: "Pour",
    hours: 10,
    clicks: 4,
    copy: "The wax burns away and molten brass takes its place. The product is the result of the process.",
    tags: ["Specialized tools", "Proprietary process"],
  },
  {
    id: "set",
    title: "Set every stone",
    verb: "Set stones",
    hours: 22,
    clicks: 7,
    copy: "Each crystal is placed and its prongs pressed closed by hand, one at a time. This is the step no machine does well.",
    tags: ["Skilled labor", "Tacit knowledge"],
  },
  {
    id: "clasp",
    title: "Engineer the clasp",
    verb: "Fit the magnet",
    hours: 5,
    clicks: 3,
    copy: "A hand-finished clasp with a magnet inside, adapted from the one we engineered for our hair pieces. It closes with one hand.",
    tags: ["ASCEND · Engineering", "Proprietary process"],
  },
  {
    id: "assemble",
    title: "Assemble",
    verb: "Join",
    hours: 9,
    clicks: 3,
    copy: "The bow is joined to the collar in the Brooklyn studio, where every Jennifer Behr piece is still made.",
    tags: ["Factory at original location"],
  },
  {
    id: "sign",
    title: "Polish and sign",
    verb: "Polish",
    hours: 3,
    clicks: 3,
    copy: "A final polish and inspection, then the edition number is engraved by hand. Fifty will be made. Never more.",
    tags: ["Limited collection", "Limited inventory"],
  },
];

const TOTAL_HOURS = STEPS.reduce((a, s) => a + s.hours, 0);
const TOTAL_CLICKS = STEPS.reduce((a, s) => a + s.clicks, 0);

// ---------- the piece, assembled from photographs ----------
// Everything sits in a 600 x 560 box. Positions were measured from the cut-out photos
// (see public/behr/CREDITS.md for sources).
const CHAIN = { x: 176.3, y: 18, w: 247.4, h: 400 };
const BOW = { x: 225, y: 378, w: 150, h: 175.7 };
const CLASP_AT = { x: 294.8, y: 27.1 };
// Pencil line traced along the chain photo, for the drawing step.
const CHAIN_SKETCH = "M256.5,397.3 C255.9,396.1 254.5,392.4 253.2,390.0 C251.9,387.6 250.4,385.1 248.6,382.7 C246.8,380.3 244.4,377.8 242.4,375.4 C240.4,373.0 238.5,370.6 236.6,368.2 C234.7,365.8 232.8,363.3 231.0,360.9 C229.2,358.5 227.4,356.0 225.6,353.6 C223.8,351.2 222.1,348.7 220.4,346.3 C218.7,343.9 217.1,341.4 215.5,339.0 C213.9,336.6 212.3,334.1 210.8,331.7 C209.3,329.3 207.9,326.8 206.5,324.4 C205.1,322.0 203.8,319.5 202.6,317.1 C201.3,314.7 200.2,312.2 199.0,309.8 C197.8,307.4 196.7,304.9 195.7,302.5 C194.7,300.1 193.8,297.6 192.9,295.2 C192.0,292.8 191.1,290.3 190.3,287.9 C189.5,285.5 188.8,283.0 188.1,280.6 C187.4,278.2 186.8,275.7 186.2,273.3 C185.6,270.9 185.1,268.4 184.6,266.0 C184.1,263.6 183.8,261.1 183.4,258.7 C183.1,256.3 182.7,253.8 182.5,251.4 C182.3,249.0 182.2,246.5 182.1,244.1 C182.0,241.7 181.9,239.2 181.9,236.8 C181.9,234.4 181.9,232.0 181.9,229.6 C181.9,227.2 182.0,224.7 182.0,222.3 C182.0,219.9 182.1,217.4 182.1,215.0 C182.1,212.6 182.2,210.1 182.2,207.7 C182.2,205.3 182.2,202.8 182.2,200.4 C182.2,198.0 182.3,195.5 182.3,193.1 C182.3,190.7 182.3,188.2 182.4,185.8 C182.5,183.4 182.6,180.9 182.8,178.5 C183.0,176.1 183.2,173.6 183.5,171.2 C183.8,168.8 184.1,166.3 184.5,163.9 C184.9,161.5 185.4,159.0 186.0,156.6 C186.6,154.2 187.2,151.7 187.9,149.3 C188.6,146.9 189.4,144.4 190.3,142.0 C191.2,139.6 192.1,137.1 193.1,134.7 C194.1,132.3 195.2,129.8 196.2,127.4 C197.2,125.0 198.3,122.5 199.3,120.1 C200.3,117.7 201.3,115.2 202.3,112.8 C203.3,110.4 204.2,107.9 205.3,105.5 C206.4,103.1 207.4,100.6 208.6,98.2 C209.8,95.8 211.1,93.3 212.4,90.9 C213.8,88.5 215.2,86.1 216.7,83.7 C218.2,81.3 219.8,78.8 221.6,76.4 C223.3,74.0 225.1,71.5 227.2,69.1 C229.3,66.7 231.5,64.2 234.0,61.8 C236.5,59.4 238.7,56.9 242.0,54.5 C245.3,52.1 250.2,49.6 253.9,47.2 C257.6,44.8 261.0,42.3 264.0,39.9 C267.0,37.5 266.7,35.2 271.8,32.6 C276.9,30.0 288.3,24.1 294.8,24.1 C301.3,24.1 306.9,30.0 310.7,32.6 C314.5,35.2 314.9,37.5 317.5,39.9 C320.1,42.3 323.0,44.8 326.3,47.2 C329.6,49.6 334.0,52.1 337.4,54.5 C340.8,56.9 343.8,59.4 346.7,61.8 C349.6,64.2 352.2,66.7 354.7,69.1 C357.2,71.5 359.4,74.0 361.6,76.4 C363.8,78.8 366.0,81.3 368.0,83.7 C370.0,86.1 371.9,88.5 373.8,90.9 C375.7,93.3 377.4,95.8 379.1,98.2 C380.8,100.6 382.4,103.1 384.0,105.5 C385.6,107.9 387.1,110.4 388.5,112.8 C389.9,115.2 391.3,117.7 392.6,120.1 C393.9,122.5 395.2,125.0 396.3,127.4 C397.4,129.8 398.5,132.3 399.5,134.7 C400.5,137.1 401.5,139.6 402.4,142.0 C403.3,144.4 404.2,146.9 405.0,149.3 C405.8,151.7 406.6,154.2 407.3,156.6 C408.0,159.0 408.7,161.5 409.3,163.9 C409.9,166.3 410.6,168.8 411.1,171.2 C411.7,173.6 412.1,176.1 412.6,178.5 C413.1,180.9 413.5,183.4 413.9,185.8 C414.3,188.2 414.7,190.7 415.0,193.1 C415.3,195.5 415.6,198.0 415.9,200.4 C416.1,202.8 416.3,205.3 416.5,207.7 C416.7,210.1 416.9,212.6 417.0,215.0 C417.1,217.4 417.3,219.9 417.4,222.3 C417.5,224.7 417.4,227.2 417.4,229.6 C417.4,232.0 417.5,234.4 417.4,236.8 C417.3,239.2 417.2,241.7 417.0,244.1 C416.8,246.5 416.6,249.0 416.4,251.4 C416.2,253.8 415.9,256.3 415.6,258.7 C415.3,261.1 414.9,263.6 414.5,266.0 C414.1,268.4 413.8,270.9 413.4,273.3 C413.0,275.7 412.5,278.2 411.9,280.6 C411.3,283.0 410.6,285.5 410.0,287.9 C409.4,290.3 408.7,292.8 408.0,295.2 C407.3,297.6 406.6,300.1 405.8,302.5 C405.0,304.9 404.2,307.4 403.3,309.8 C402.4,312.2 401.5,314.7 400.5,317.1 C399.5,319.5 398.6,322.0 397.5,324.4 C396.4,326.8 395.3,329.3 394.2,331.7 C393.1,334.1 391.9,336.6 390.7,339.0 C389.5,341.4 388.2,343.9 386.9,346.3 C385.6,348.7 384.1,351.2 382.7,353.6 C381.3,356.0 379.9,358.5 378.4,360.9 C376.9,363.3 375.3,365.8 373.7,368.2 C372.1,370.6 370.4,373.0 368.6,375.4 C366.8,377.8 364.9,380.3 362.8,382.7 C360.8,385.1 358.6,387.6 356.3,390.0 C354.0,392.4 351.2,394.9 348.9,397.3 C346.6,399.7 344.4,402.2 342.7,404.6 C341.0,407.0 339.2,410.7 338.5,411.9";
// Crystals sit on the chain's real curve, growing toward the bow.
const STONES = [{"x": 186.7, "y": 149.3, "r": 6.0}, {"x": 182.8, "y": 176.8, "r": 6.6}, {"x": 182.2, "y": 204.6, "r": 7.2}, {"x": 181.9, "y": 232.3, "r": 7.8}, {"x": 183.5, "y": 260.0, "r": 8.4}, {"x": 189.9, "y": 287.0, "r": 9.1}, {"x": 200.3, "y": 312.8, "r": 9.7}, {"x": 214.1, "y": 336.9, "r": 10.3}, {"x": 230.0, "y": 359.6, "r": 10.9}, {"x": 245.0, "y": 382.7, "r": 11.5}, {"x": 406.4, "y": 149.3, "r": 6.0}, {"x": 412.1, "y": 175.9, "r": 6.6}, {"x": 416.1, "y": 202.9, "r": 7.2}, {"x": 417.5, "y": 230.1, "r": 7.8}, {"x": 415.8, "y": 257.3, "r": 8.4}, {"x": 411.1, "y": 284.1, "r": 9.1}, {"x": 403.2, "y": 310.2, "r": 9.7}, {"x": 392.5, "y": 335.3, "r": 10.3}, {"x": 379.4, "y": 359.2, "r": 10.9}, {"x": 366.1, "y": 382.7, "r": 11.5}].map((st, i) => ({ ...st, img: `stone-${"abc"[i % 3]}.webp` }));
// Set from the bow outwards, alternating sides.
const SET_ORDER = STONES.map((st, i) => ({ i, d: -st.y })).sort((p, q) => p.d - q.d).map((o) => o.i);
const STONE_COUNT = STONES.length;

const MATERIALS = [
  { label: "Gold chain", sub: "From a New York maker", img: "bench-chain.webp", x: 30, y: 60, w: 140, h: 125, blend: false },
  { label: "Vintage crystal", sub: "From twenty years of archive", img: "bench-stones.webp", x: 22, y: 270, w: 156, h: 126, blend: true },
  { label: "Round brilliants", sub: "Sorted by hand", img: "bench-brilliant.webp", x: 457, y: 70, w: 96, h: 96, blend: false },
  { label: "The clasp", sub: "Fitted with a magnet", img: "clasp.webp", x: 450, y: 280, w: 110, h: 110, blend: false },
];

// ---------- helpers ----------
const fmtHours = (h: number) => {
  const whole = Math.floor(h + 1e-6);
  const min = Math.round((h - whole) * 60);
  return min === 60 ? `${whole + 1} h 00 min` : `${whole} h ${String(min).padStart(2, "0")} min`;
};
const fmtClock = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

type Phase = "intro" | "play" | "done";

export default function BehrAtelier({ rsvpHref, shopHref, assets }: { rsvpHref: string; shopHref: string; assets: string }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [clicks, setClicks] = useState(0); // within current step
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [finishedMs, setFinishedMs] = useState<number | null>(null);
  const [deltas, setDeltas] = useState<{ id: number; text: string }[]>([]);
  const [shine, setShine] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const deltaId = useRef(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const helperId = useRef(0);
  const actionRef = useRef<HTMLButtonElement>(null);
  // Keep keyboard focus on the step's button without scrolling the page.
  useEffect(() => {
    if (phase !== "play") return;
    const t = setTimeout(() => actionRef.current?.focus({ preventScroll: true }), 450);
    return () => clearTimeout(t);
  }, [phase, step]);

  // Atelier hours, animated.
  const hoursTarget = useMemo(() => {
    const done = STEPS.slice(0, step).reduce((a, s) => a + s.hours, 0);
    const cur = STEPS[step] ? (STEPS[step].hours / STEPS[step].clicks) * clicks : 0;
    return phase === "done" ? TOTAL_HOURS : done + cur;
  }, [step, clicks, phase]);
  const hoursMV = useMotionValue(0);
  const [hoursShown, setHoursShown] = useState(0);
  useMotionValueEvent(hoursMV, "change", (v) => setHoursShown(v));
  useEffect(() => {
    const c = animate(hoursMV, hoursTarget, { duration: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [hoursTarget, reduce]);

  // Visitor's own time.
  useEffect(() => {
    if (phase !== "play" || startedAt === null) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [phase, startedAt]);

  const progress = (i: number) => (step > i || phase === "done" ? 1 : step === i ? clicks / STEPS[i].clicks : 0);
  const sketchP = progress(0);
  const waxP = progress(1);
  const sourceP = progress(2);
  const castP = progress(3);
  const setP = progress(4);
  const claspP = progress(5);
  const assembleP = progress(6);
  const signP = progress(7);
  const stonesSet = Math.round(setP * STONE_COUNT);
  const setIds = new Set(SET_ORDER.slice(0, stonesSet));

  function begin() {
    setPhase("play");
    setStep(0);
    setClicks(0);
    setStartedAt(null);
    setFinishedMs(null);
    hoursMV.set(0);
    // Bring the game up under the sticky header so the corner counter sits beside it.
    requestAnimationFrame(() =>
      document.querySelector(".jb-product")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }),
    );
  }

  // Which animal helps with each step, where on the necklace this click lands, and what it carries.
  const HELPER_KIND: Kind[] = ["bear", "beaver", "magpie", "salamander", "mouse", "lobster", "squirrel", "owl"];
  function helperTarget(si: number, n: number): { x: number; y: number; prop?: Prop } {
    const id = STEPS[si].id;
    if (id === "sketch") return { ...[{ x: 186, y: 230 }, { x: 414, y: 230 }, { x: 300, y: 32 }, { x: 300, y: 440 }][n - 1], prop: { kind: "pencil" } };
    if (id === "wax") return { x: n % 2 ? 262 : 338, y: 440 + (n % 3) * 18, prop: { kind: "wax" } };
    if (id === "source") {
      const m = MATERIALS[n - 1];
      return { x: m.x + m.w / 2, y: m.y + m.h / 2, prop: { kind: "img", href: assets + m.img, size: 26 } };
    }
    if (id === "cast") return { ...[{ x: 300, y: 450 }, { x: 186, y: 200 }, { x: 414, y: 200 }, { x: 300, y: 32 }][n - 1], prop: { kind: "flame" } };
    if (id === "set") {
      const count = Math.round((n / STEPS[si].clicks) * STONE_COUNT);
      const st = STONES[SET_ORDER[Math.max(0, count - 1)]];
      return { x: st.x, y: st.y, prop: { kind: "img", href: assets + st.img, size: 16 } };
    }
    if (id === "clasp") return { x: CLASP_AT.x, y: CLASP_AT.y };
    if (id === "assemble") return { x: 300, y: 392, prop: { kind: "ring" } };
    return { ...[{ x: 330, y: 470 }, { x: 236, y: 300 }, { x: 470, y: 520 }][n - 1], prop: { kind: "sparkle" } };
  }
  function sendHelper(si: number, n: number) {
    if (reduce || !svgRef.current) return;
    const r = svgRef.current.getBoundingClientRect();
    const k = Math.min(r.width / 600, r.height / 560);
    const ox = r.left + (r.width - 600 * k) / 2;
    const oy = r.top + (r.height - 560 * k) / 2;
    const t = helperTarget(si, n);
    const dir: 1 | -1 = t.x < 290 ? 1 : t.x > 310 ? -1 : n % 2 ? 1 : -1;
    const h: Helper = {
      id: ++helperId.current,
      kind: HELPER_KIND[si],
      dir,
      tx: ox + t.x * k,
      ty: oy + t.y * k,
      k: Math.max(0.62, Math.min(1.4, k * 1.25)),
      prop: t.prop,
    };
    setHelpers((list) => [...list.slice(-5), h]);
  }

  function work() {
    if (phase !== "play") return;
    const s = STEPS[step];
    const t = Date.now();
    if (startedAt === null) setStartedAt(t);
    setNow(t);
    const per = s.hours / s.clicks;
    const id = ++deltaId.current;
    setDeltas((d) => [...d.slice(-3), { id, text: `+${fmtHours(per)}` }]);
    setTimeout(() => setDeltas((d) => d.filter((x) => x.id !== id)), 1400);
    if (s.id === "sign") setShine((n) => n + 1);

    const next = clicks + 1;
    sendHelper(step, next);
    if (next < s.clicks) return setClicks(next);
    if (step < STEPS.length - 1) {
      setClicks(next);
      // Let the last click of a step land before moving on.
      setTimeout(() => {
        setStep((x) => x + 1);
        setClicks(0);
      }, reduce ? 0 : 650);
    } else {
      setClicks(next);
      setFinishedMs(t - (startedAt ?? t));
      setTimeout(() => setPhase("done"), reduce ? 0 : 1100);
    }
  }

  const cur = STEPS[step];
  const stepHoursDone = phase === "play" ? (cur.hours / cur.clicks) * clicks : 0;
  const yourMs = finishedMs ?? (startedAt ? now - startedAt : 0);
  const spring = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 260, damping: 18 };

  const waxColor = "#6d8a70";

  const stepState = (i: number) => (phase === "done" || i < step ? "done" : phase === "play" && i === step ? "now" : "");

  return (
    <div className={`jb jb--${phase}`}>
      {/* Collection header, laid out like the shop's "Shop All" page */}
      <section className="jb-coll">
        <h1 className="jb-coll-title">The Behr</h1>
        <p className="jb-coll-desc">
          Our new hero necklace: a crystal collar and a sculpted bow, carved, cast, set and signed by hand in our Brooklyn studio. Make it
          yourself, one step at a time, and watch the hours add up. Nothing here is for sale.
        </p>
      </section>

      <div className="jb-toolbar">
        <div className="jb-toolbar-left">
          <span className="jb-count">
            {phase === "intro" ? `${STEPS.length} steps` : phase === "done" ? "Complete" : `Step ${step + 1} of ${STEPS.length}`}
          </span>
          <span className="jb-toolbar-sep" />
          <span className="jb-toolbar-label">
            <span aria-hidden="true">+</span> {phase === "play" ? cur.title : "How it's made"}
          </span>
        </div>
        <div className="jb-toolbar-right">
          <span className="jb-toolbar-label">Edition:</span> <span className="jb-count">50 pieces</span>
        </div>
      </div>

      {/* Hours counter, fixed in the corner */}
      <AnimatePresence>
        {phase !== "intro" && (
          <motion.aside className="jb-hud" aria-live="polite" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="jb-hud-main">
              <div className="jb-hud-label">Hours by hand</div>
              <div className="jb-hud-total">{fmtHours(hoursShown)}</div>
            </div>
            <div className="jb-hud-bar">
              <motion.span animate={{ scaleX: hoursShown / TOTAL_HOURS }} transition={{ duration: 0 }} />
            </div>
            <div className="jb-hud-rows">
              {phase === "play" && (
                <div className="jb-hud-row">
                  <span>This step</span>
                  <span>
                    {fmtHours(stepHoursDone)} / {cur.hours} h
                  </span>
                </div>
              )}
              <div className="jb-hud-row">
                <span>Your time</span>
                <span>{fmtClock(yourMs)}</span>
              </div>
            </div>
            {phase === "play" && (
              <button className="jb-btn jb-btn--block jb-hud-action" onClick={work} aria-label={`${cur.verb} (step ${step + 1} of ${STEPS.length})`}>
                {cur.id === "set" ? `${cur.verb} (${stonesSet}/${STONE_COUNT})` : cur.verb} <span aria-hidden="true">+</span>
              </button>
            )}
            <div className="jb-deltas" aria-hidden="true">
              <AnimatePresence>
                {deltas.map((d) => (
                  <motion.span
                    key={d.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.45 }}
                  >
                    {d.text}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Product-page layout: image tile left, details right */}
      <section className="jb-product">
        <motion.div
          className="jb-stage"
          onClick={work}
          role="presentation"
          animate={{ scale: phase === "intro" ? 0.985 : 1 }}
          transition={{ duration: 0.8 }}
        >
        <svg ref={svgRef} viewBox="0 0 600 560" className="jb-svg" aria-label="The Behr necklace, in progress" role="img">
          <defs>
            <radialGradient id="heat" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#ffb347" stopOpacity="0.85" />
              <stop offset="1" stopColor="#ff6a00" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="10" />
            </filter>
            {/* the chain is revealed top to bottom as it is cast */}
            <clipPath id="castClip">
              <motion.rect x="0" y="0" width="600" initial={false} animate={{ height: castP * 560 }} transition={{ duration: 0.8 }} />
            </clipPath>
            {/* the bow drawing wipes in as it is drawn */}
            <clipPath id="sketchClip">
              <motion.rect
                x="0"
                y="0"
                width="600"
                initial={false}
                animate={{ height: phase === "intro" ? 560 : clamp01(sketchP * 1.7 - 0.5) * 560 }}
                transition={{ duration: 0.7 }}
              />
            </clipPath>
          </defs>
          {/* tile colour inside the SVG so multiplied photos blend into it */}
          <rect width="600" height="560" fill="#f6f6f6" />

          {/* 1. Pencil drawing (also the faint preview on the intro) */}
          <motion.g initial={false} animate={{ opacity: phase === "intro" ? 0.55 : castP > 0 ? mix(0.8, 0, castP) : 0.9 }} transition={{ duration: 0.6 }}>
            <motion.path
              d={CHAIN_SKETCH}
              fill="none"
              stroke="#6d675e"
              strokeWidth="1.1"
              strokeLinecap="round"
              initial={false}
              animate={{ pathLength: phase === "intro" ? 1 : clamp01(sketchP * 2) }}
              transition={{ duration: 0.7 }}
            />
            <g clipPath="url(#sketchClip)">
              <image href={assets + "bow-sketch.webp"} x={BOW.x} y={BOW.y} width={BOW.w} height={BOW.h} />
            </g>
          </motion.g>

          {/* 4. The gold chain, revealed as it is cast */}
          <g clipPath="url(#castClip)">
            <image href={assets + "chain.webp"} x={CHAIN.x} y={CHAIN.y} width={CHAIN.w} height={CHAIN.h} />
          </g>

          {/* 6. Clasp: a ring around the real clasp on the chain */}
          <motion.circle
            cx={CLASP_AT.x}
            cy={CLASP_AT.y}
            r="16"
            fill="none"
            stroke="#a8853b"
            strokeWidth="1.2"
            initial={false}
            animate={{ opacity: step === 5 && phase === "play" ? 1 : 0, scale: claspP >= 1 ? [1, 1.6, 1] : 1 }}
            style={{ transformOrigin: `${CLASP_AT.x}px ${CLASP_AT.y}px` }}
            transition={{ duration: 0.8 }}
          />

          {/* 5. Crystals, set one by one along the chain */}
          {STONES.map((st, i) => {
            const on = setIds.has(i);
            return (
              <motion.g
                key={i}
                initial={false}
                animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.2 }}
                transition={spring}
                style={{ transformOrigin: `${st.x}px ${st.y}px` }}
              >
                <circle cx={st.x} cy={st.y} r={st.r + 1.4} fill="#c3a05c" />
                <image href={assets + st.img} x={st.x - st.r} y={st.y - st.r} width={st.r * 2} height={st.r * 2} />
              </motion.g>
            );
          })}

          {/* The bow: drawn, carved in wax, cast in gold, then joined (swings) */}
          <motion.g
            key={step === 6 ? `swing-${clicks}` : "still"}
            style={{ transformOrigin: `${BOW.x + BOW.w / 2}px ${BOW.y + 10}px` }}
            animate={step === 6 && clicks > 0 && !reduce ? { rotate: [0, -5, 3.5, -1.5, 0] } : { rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <motion.ellipse
              cx={BOW.x + BOW.w / 2}
              cy={BOW.y + BOW.h / 2}
              rx="110"
              ry="90"
              fill="url(#heat)"
              filter="url(#soft)"
              initial={false}
              animate={{ opacity: step === 3 && phase === "play" ? Math.sin(Math.PI * clamp01(castP)) * 0.9 + 0.1 * (castP < 1 ? 1 : 0) : 0 }}
              transition={{ duration: 0.6 }}
            />
            <motion.image
              href={assets + "bow-wax.webp"}
              x={BOW.x}
              y={BOW.y}
              width={BOW.w}
              height={BOW.h}
              initial={false}
              animate={{ opacity: waxP * (1 - castP), scale: 0.92 + 0.08 * waxP }}
              style={{ transformOrigin: `${BOW.x + BOW.w / 2}px ${BOW.y + BOW.h / 2}px` }}
              transition={{ duration: 0.6 }}
            />
            <motion.image
              href={assets + "bow.webp"}
              x={BOW.x}
              y={BOW.y}
              width={BOW.w}
              height={BOW.h}
              initial={false}
              animate={{ opacity: castP }}
              transition={{ duration: 0.8 }}
            />
            {/* wax shavings while carving */}
            {step === 1 &&
              Array.from({ length: clicks }).map((_, i) => (
                <motion.circle
                  key={i}
                  r="2.2"
                  fill="#6f8f72"
                  initial={{ cx: 300, cy: 460, opacity: 1 }}
                  animate={{ cx: 300 + (i % 2 ? 1 : -1) * (70 + i * 16), cy: 540, opacity: 0 }}
                  transition={{ duration: 0.9 }}
                />
              ))}
          </motion.g>

          {/* 3. Materials on the bench */}
          <motion.g initial={false} animate={{ opacity: step >= 2 && castP < 1 && phase === "play" ? 1 : 0 }} transition={{ duration: 0.6 }}>
            {MATERIALS.map((m, i) => {
              const shown = sourceP * MATERIALS.length > i;
              return (
                <motion.g key={m.label} initial={false} animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 12 }} transition={spring}>
                  <image
                    href={assets + m.img}
                    x={m.x}
                    y={m.y}
                    width={m.w}
                    height={m.h}
                    preserveAspectRatio="xMidYMid meet"
                    style={m.blend ? { mixBlendMode: "multiply" } : undefined}
                  />
                  <text x={m.x + m.w / 2} y={m.y + m.h + 20} className="jb-svg-label" textAnchor="middle">
                    {m.label}
                  </text>
                  <text x={m.x + m.w / 2} y={m.y + m.h + 34} className="jb-svg-sub" textAnchor="middle">
                    {m.sub}
                  </text>
                </motion.g>
              );
            })}
          </motion.g>

          {/* 6. Clasp close-up (photo) */}
          <motion.g initial={false} animate={{ opacity: step === 5 && phase === "play" ? 1 : 0 }} transition={{ duration: 0.5 }}>
            <line x1={CLASP_AT.x + 14} y1={CLASP_AT.y + 6} x2="455" y2="95" stroke="#b9b9b9" strokeWidth="0.8" />
            <circle cx="510" cy="150" r="64" fill="#fff" stroke="#d6d6d6" />
            <image href={assets + "clasp.webp"} x="450" y="90" width="120" height="120" />
            <motion.circle
              cx="510"
              cy="150"
              r="64"
              fill="none"
              stroke="#a8853b"
              style={{ transformOrigin: "510px 150px" }}
              initial={false}
              animate={claspP >= 1 ? { scale: [1, 1.25], opacity: [0.9, 0] } : { scale: 1, opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
            <text x="510" y="236" className="jb-svg-sub" textAnchor="middle">
              the clasp, close up
            </text>
          </motion.g>

          {/* 8. Polish + edition number */}
          <motion.rect
            key={shine}
            x="-200"
            y="0"
            width="180"
            height="560"
            fill="url(#sheen)"
            style={{ mixBlendMode: "soft-light" }}
            initial={{ x: -200, opacity: 0 }}
            animate={shine ? { x: 720, opacity: [0, 1, 0] } : {}}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          />
          <motion.text
            x="574"
            y="540"
            textAnchor="end"
            className="jb-svg-edition"
            initial={false}
            animate={{ opacity: signP >= 1 ? 1 : 0, y: signP >= 1 ? 0 : 6 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            Nº 01 of 50
          </motion.text>
        </svg>
        </motion.div>

        <div className="jb-details">
          <AnimatePresence mode="wait">
            {phase === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }}>
                <p className="jb-kicker">The Behr Necklace · Nº 01–50</p>
                <h2 className="jb-display">Make the Behr.</h2>
                <p className="jb-body">
                  Eight steps, from a pencil drawing to an engraved edition number. Every click is time our atelier spends on a single piece.
                </p>
                <dl className="jb-specs">
                  <div>
                    <dt>Made in</dt>
                    <dd>Brooklyn, New York</dd>
                  </div>
                  <div>
                    <dt>Hours by hand</dt>
                    <dd>{TOTAL_HOURS}</dd>
                  </div>
                  <div>
                    <dt>Stones, set by hand</dt>
                    <dd>{STONE_COUNT}</dd>
                  </div>
                </dl>
                <button className="jb-btn" onClick={begin}>
                  Begin <span aria-hidden="true">+</span>
                </button>
                <p className="jb-fine">About a minute of your time. {TOTAL_HOURS} hours of ours.</p>
              </motion.div>
            )}

            {phase === "play" && (
              <motion.div key={cur.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
                <p className="jb-kicker">
                  Step {String(step + 1).padStart(2, "0")} · {cur.hours} hours
                </p>
                <h2 className="jb-display">{cur.title}</h2>
                <p className="jb-body">{cur.copy}</p>
                <ul className="jb-tags" aria-label="Frameworks">
                  {cur.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <div className="jb-action">
                  <motion.button ref={actionRef} className="jb-btn" onClick={work} whileTap={reduce ? undefined : { scale: 0.97 }}>
                    {cur.id === "set" ? `${cur.verb} (${stonesSet}/${STONE_COUNT})` : cur.verb} <span aria-hidden="true">+</span>
                  </motion.button>
                  <span className="jb-clicks" aria-label={`${clicks} of ${cur.clicks}`}>
                    {Array.from({ length: cur.clicks }).map((_, i) => (
                      <i key={i} className={i < clicks ? "on" : ""} />
                    ))}
                  </span>
                </div>
                <p className="jb-fine">Tip: you can also click the necklace.</p>
              </motion.div>
            )}

            {phase === "done" && (
              <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                <p className="jb-kicker">The Behr · Nº 01 of 50</p>
                <h2 className="jb-display">You made it in {fmtClock(yourMs)}.</h2>
                <p className="jb-body">
                  In our studio it takes {TOTAL_HOURS} hours of skilled hands: {STONE_COUNT} stones set one by one, a bow carved in wax and cast in
                  brass, a clasp we engineered ourselves. Fifty will be made.
                </p>
                <p className="jb-body">
                  The Behr will make its debut at a New York design museum, among pieces chosen for their craft. Afterwards, guests are
                  invited to our Brooklyn studio to see the wax models, the tools and the hands that made it.
                </p>
                <a className="jb-btn" href={rsvpHref}>
                  RSVP for the first showing <span aria-hidden="true">+</span>
                </a>
                <div className="jb-final-links">
                  <a className="jb-link" href={shopHref}>
                    Explore the collection
                  </a>
                  <button className="jb-link" onClick={begin}>
                    Make it again
                  </button>
                </div>
                <button className="jb-notes-toggle" onClick={() => setShowNotes((v) => !v)} aria-expanded={showNotes}>
                  {showNotes ? "Hide" : "Show"} the frameworks behind this page
                </button>
                <AnimatePresence>
                  {showNotes && (
                    <motion.div className="jb-notes" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <p>
                        <strong>Why a game.</strong> A nod to Hermès's 2011 website game: digital craftsmanship and cultural relevance without
                        selling anything. There are no prices or carts on this page.
                      </p>
                      <p>
                        <strong>Physical rarity → perceived rarity.</strong> The production side of the Luxury Business Model is strong at
                        Jennifer Behr but invisible to the customer. Each step surfaces one element: IP and design, skilled labor, rare raw
                        materials, a controlled supply chain, specialized tools, proprietary processes, the factory at its original location,
                        and a limited collection.
                      </p>
                      <p>
                        <strong>ASCEND.</strong> Art (the founder's sculpture training), design (the carved bow), science (materials) and
                        engineering (the hair-magnet clasp) meet in one piece.
                      </p>
                      <p>
                        <strong>AO Grid: Educate.</strong> Teaching the process moves visitors from novice toward expert. The RSVP turns that
                        into an in-person showing for the people who carry the story.
                      </p>
                      <p>
                        <strong>Borrowed cultural capital.</strong> The first showing is at a museum, not a store: the institution's cultural capital
                        transfers to the piece, as with Prada and contemporary art or Hermès × Sugimoto at Art Basel. Proposed venue: the Museum of
                        Arts and Design (MAD), with The Salon Art + Design (via a partner gallery) for collectors. Curators{"'"} selection is the{" "}
                        <em>Induct</em> step. The studio visit that follows is <em>Expertize</em>, and it keeps the factory at its original location
                        in the story. A gallery or fair rather than an auction, per the course rule on new product.
                      </p>
                      <p className="jb-fine">Hours, materials, the edition size and the venues are illustrative assumptions for this prototype, not confirmed partnerships.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* The eight steps, as a product grid */}
      <section className="jb-grid-wrap" aria-label="The making of the Behr">
        <div className="jb-toolbar jb-toolbar--grid">
          <div className="jb-toolbar-left">
            <span className="jb-count">The making</span>
          </div>
          <div className="jb-toolbar-right">
            <span className="jb-toolbar-label">Total:</span> <span className="jb-count">{TOTAL_HOURS} hours</span>
          </div>
        </div>
        <ul className="jb-grid">
          {STEPS.map((s, i) => (
            <li key={s.id} className={`jb-card ${stepState(i)}`}>
              <div className="jb-card-tile">
                <span className="jb-card-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="jb-card-status">{stepState(i) === "done" ? "Done" : stepState(i) === "now" ? "In progress" : ""}</span>
              </div>
              <p className="jb-card-name">{s.title}</p>
              <p className="jb-card-meta">
                {s.hours} hours <span>{s.tags[0]}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>
      <HelperLayer helpers={helpers} onDone={(id) => setHelpers((list) => list.filter((x) => x.id !== id))} />
    </div>
  );
}
