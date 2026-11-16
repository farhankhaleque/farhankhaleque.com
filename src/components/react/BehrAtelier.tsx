// "Make the Behr": a clicking game that walks the visitor through the making
// of a (concept) hero necklace, while a counter in the corner adds up the
// hands-on atelier hours each step takes. Built with framer-motion.
//
// Class project prototype (MKTG-UB Luxury Marketing). Hours are illustrative
// estimates, not Jennifer Behr's real production data.
import { useEffect, useMemo, useRef, useState } from "react";
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
    copy: "Reclaimed brass from a New York foundry, vintage crystal from twenty years of archive. We make only what we need.",
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
    copy: "The clasp borrows the magnet we engineered for our hair pieces: it closes with one hand and doesn't let go.",
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

// ---------- geometry ----------
const P0 = { x: 110, y: 90 };
const C = { x: 300, y: 390 };
const P2 = { x: 490, y: 90 };
const bez = (t: number) => ({
  x: (1 - t) ** 2 * P0.x + 2 * (1 - t) * t * C.x + t ** 2 * P2.x,
  y: (1 - t) ** 2 * P0.y + 2 * (1 - t) * t * C.y + t ** 2 * P2.y,
});
const COLLAR = `M${P0.x},${P0.y} Q${C.x},${C.y} ${P2.x},${P2.y}`;

const COLLAR_STONES = Array.from({ length: 21 }, (_, i) => {
  const t = 0.14 + (i / 20) * 0.72;
  const near = 1 - Math.abs(t - 0.5) * 2; // 1 at the centre
  return { ...bez(t), r: 3.6 + 4.2 * near ** 1.4 };
}).filter((_, i) => i !== 10); // centre is where the bow hangs

// Bow, centred at (300, 300).
const BOW = {
  left: "M300,300 C268,256 212,252 212,290 C212,326 268,320 300,300 Z",
  right: "M300,300 C332,256 388,252 388,290 C388,326 332,320 300,300 Z",
  tailL: "M295,307 C284,336 268,366 254,398 L273,394 L281,408 C290,374 298,340 303,309 Z",
  tailR: "M305,307 C316,336 332,366 346,398 L327,394 L319,408 C310,374 302,340 297,309 Z",
};
const PAVE = (() => {
  const pts: { x: number; y: number; r: number }[] = [];
  for (const cx of [252, 348]) {
    for (let i = 0; i < 11; i++) {
      const a = (i / 11) * Math.PI * 2;
      pts.push({ x: cx + Math.cos(a) * 24, y: 289 + Math.sin(a) * 12, r: 2.4 });
    }
    pts.push({ x: cx + (cx < 300 ? -2 : 2), y: 289, r: 3.4 });
  }
  pts.push({ x: 300, y: 296, r: 3 }, { x: 300, y: 306, r: 3 });
  return pts;
})();
const STONES = [...COLLAR_STONES.map((s) => ({ ...s, kind: "collar" })), ...PAVE.map((s) => ({ ...s, kind: "pave" }))];
// Set stones from the centre outwards, alternating sides, pavé last.
const SET_ORDER = (() => {
  const collar = COLLAR_STONES.map((s, i) => ({ i, d: Math.abs(s.x - 300) })).sort((a, b) => a.d - b.d).map((o) => o.i);
  return [...collar, ...PAVE.map((_, j) => COLLAR_STONES.length + j)];
})();
const STONE_COUNT = STONES.length;

const MATERIALS = [
  { label: "Reclaimed brass", sub: "New York", color: "url(#gold)", shape: "bar" },
  { label: "Vintage crystal", sub: "From the archive", color: "url(#crystal)", shape: "gem" },
  { label: "Sterling wire", sub: "For the prongs", color: "#cfd3d6", shape: "wire" },
  { label: "Magnet", sub: "Our own design", color: "#3a3a3a", shape: "magnet" },
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

export default function BehrAtelier({ rsvpHref, shopHref }: { rsvpHref: string; shopHref: string }) {
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

  const bowDrop = 0;
  const waxColor = "#6d8a70";

  return (
    <div className={`jb jb--${phase}`}>
      <header className="jb-head">
        <a className="jb-mark" href={shopHref} aria-label="Jennifer Behr: shop all">
          JENNIFER BEHR
        </a>
        <span className="jb-sub">Atelier · Brooklyn · Est. 2005</span>
      </header>

      {/* Hours counter, top-right */}
      <AnimatePresence>
        {phase !== "intro" && (
          <motion.aside
            className="jb-hud"
            aria-live="polite"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="jb-hud-label">Hours by hand</div>
            <div className="jb-hud-total">{fmtHours(hoursShown)}</div>
            <div className="jb-hud-bar">
              <motion.span animate={{ scaleX: hoursShown / TOTAL_HOURS }} transition={{ duration: 0 }} />
            </div>
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
            <div className="jb-deltas" aria-hidden="true">
              <AnimatePresence>
                {deltas.map((d) => (
                  <motion.span
                    key={d.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
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

      {/* The necklace */}
      <motion.div
        className="jb-stage"
        onClick={work}
        role="presentation"
        animate={{ scale: phase === "intro" ? 0.94 : 1 }}
        transition={{ duration: 0.8 }}
      >
        <svg viewBox="0 0 600 520" className="jb-svg" aria-label="The Behr necklace, in progress" role="img">
          <defs>
            <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f6e2a8" />
              <stop offset="0.45" stopColor="#c9a24f" />
              <stop offset="1" stopColor="#8a6a2c" />
            </linearGradient>
            <radialGradient id="crystal" cx="0.35" cy="0.3" r="0.8">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.45" stopColor="#dfe9f2" />
              <stop offset="1" stopColor="#8fa6bd" />
            </radialGradient>
            <radialGradient id="heat" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#ffb347" stopOpacity="0.9" />
              <stop offset="1" stopColor="#ff6a00" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>

          {/* The finished piece, faintly, behind the intro */}
          <motion.g
            fill="none"
            stroke="#c9a24f"
            strokeWidth="1"
            animate={{ opacity: phase === "intro" ? 0.5 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <path d={COLLAR} />
            {[BOW.left, BOW.right, BOW.tailL, BOW.tailR].map((d, i) => (
              <path key={i} d={d} />
            ))}
            <rect x="287" y="287" width="26" height="28" rx="9" />
            {COLLAR_STONES.map((c, i) => (
              <circle key={i} cx={c.x} cy={c.y} r={c.r} />
            ))}
          </motion.g>

          {/* 1. Sketch */}
          <g fill="none" stroke="#9d9384" strokeWidth="1.2" strokeDasharray="0" opacity={castP > 0 ? mix(0.6, 0.12, castP) : 0.75}>
            <motion.path d={COLLAR} animate={{ pathLength: clamp01(sketchP * 2) }} transition={{ duration: 0.7 }} />
            {[BOW.left, BOW.right, BOW.tailL, BOW.tailR].map((d, i) => (
              <motion.path
                key={i}
                d={d}
                animate={{ pathLength: clamp01(sketchP * 2 - 0.5 - i * 0.12) * 1.6 }}
                transition={{ duration: 0.7 }}
              />
            ))}
          </g>

          {/* 4. Cast chain */}
          <motion.path
            d={COLLAR}
            fill="none"
            stroke="url(#gold)"
            strokeWidth="3.2"
            strokeLinecap="round"
            animate={{ pathLength: castP, opacity: castP > 0 ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          />

          {/* Bow: wax, then brass */}
          <motion.g
            key={step === 6 ? `swing-${clicks}` : "still"}
            style={{ transformOrigin: "300px 256px" }}
            animate={step === 6 && clicks > 0 && !reduce ? { rotate: [0, -5, 3.5, -1.5, 0] } : { rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {/* heat while casting */}
            <motion.ellipse
              cx="300"
              cy="320"
              rx="120"
              ry="90"
              fill="url(#heat)"
              filter="url(#soft)"
              animate={{ opacity: step === 3 && phase === "play" ? Math.sin(Math.PI * clamp01(castP)) * 0.9 + 0.1 * (castP < 1 ? 1 : 0) : 0 }}
              transition={{ duration: 0.6 }}
            />
            <g style={{ transformOrigin: "300px 300px" }}>
              {[BOW.tailL, BOW.tailR, BOW.left, BOW.right].map((d, i) => (
                <g key={i}>
                  <motion.path
                    d={d}
                    fill={waxColor}
                    animate={{ opacity: waxP * (1 - castP), scale: 0.9 + 0.1 * waxP }}
                    style={{ transformOrigin: "300px 300px" }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.path
                    d={d}
                    fill="url(#gold)"
                    stroke="#7a5c22"
                    strokeWidth="0.8"
                    animate={{ opacity: castP }}
                    transition={{ duration: 0.8 }}
                  />
                </g>
              ))}
              {/* knot */}
              <motion.rect x="287" y="287" width="26" height="28" rx="9" fill={waxColor} animate={{ opacity: waxP * (1 - castP) }} />
              <motion.rect
                x="287"
                y="287"
                width="26"
                height="28"
                rx="9"
                fill="url(#gold)"
                stroke="#7a5c22"
                strokeWidth="0.8"
                animate={{ opacity: castP }}
              />
              {/* carving shavings */}
              {step === 1 &&
                Array.from({ length: clicks }).map((_, i) => (
                  <motion.circle
                    key={i}
                    r="2"
                    fill={waxColor}
                    initial={{ cx: 300, cy: 300, opacity: 1 }}
                    animate={{ cx: 300 + (i % 2 ? 1 : -1) * (60 + i * 18), cy: 380 + i * 6, opacity: 0 }}
                    transition={{ duration: 0.9 }}
                  />
                ))}
            </g>
          </motion.g>

          {/* 7. Jump ring joining bow to collar */}
          <motion.circle
            cx="300"
            cy="256"
            r="7"
            fill="none"
            stroke="url(#gold)"
            strokeWidth="3"
            animate={{ opacity: assembleP > 0 ? 1 : 0, scale: assembleP > 0 ? 1 : 0.3 }}
            style={{ transformOrigin: "300px 256px" }}
            transition={spring}
          />

          {/* 5. Stones (bow pavé moves with the bow) */}
          {STONES.map((s, i) => {
            const on = setIds.has(i);
            const dy = s.kind === "pave" ? bowDrop : 0;
            return (
              <motion.g
                key={i}
                initial={false}
                animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.2, y: dy }}
                transition={spring}
                style={{ transformOrigin: `${s.x}px ${s.y}px` }}
              >
                <circle cx={s.x} cy={s.y} r={s.r + 1.2} fill="#b89545" />
                <circle cx={s.x} cy={s.y} r={s.r} fill="url(#crystal)" />
                <circle cx={s.x - s.r * 0.35} cy={s.y - s.r * 0.35} r={Math.max(0.8, s.r * 0.22)} fill="#fff" />
              </motion.g>
            );
          })}

          {/* 3. Materials on the bench */}
          <motion.g animate={{ opacity: step >= 2 && castP < 1 ? 1 : 0 }} transition={{ duration: 0.6 }}>
            {MATERIALS.map((m, i) => {
              const shown = sourceP * MATERIALS.length > i;
              const x = 120 + i * 120;
              const y = 462;
              return (
                <motion.g
                  key={m.label}
                  initial={false}
                  animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 12 }}
                  transition={spring}
                >
                  {m.shape === "bar" && <rect x={x - 18} y={y - 10} width="36" height="14" rx="2" fill={m.color} />}
                  {m.shape === "gem" && <polygon points={`${x},${y - 14} ${x + 12},${y - 3} ${x},${y + 6} ${x - 12},${y - 3}`} fill={m.color} />}
                  {m.shape === "wire" && (
                    <path d={`M${x - 16},${y} C${x - 8},${y - 16} ${x + 8},${y + 12} ${x + 16},${y - 4}`} stroke={m.color} strokeWidth="2" fill="none" />
                  )}
                  {m.shape === "magnet" && (
                    <path d={`M${x - 10},${y - 12} v12 a10,10 0 0 0 20,0 v-12 h-6 v12 a4,4 0 0 1 -8,0 v-12 Z`} fill="#555" />
                  )}
                  <text x={x} y={y + 24} className="jb-svg-label" textAnchor="middle">
                    {m.label}
                  </text>
                  <text x={x} y={y + 37} className="jb-svg-sub" textAnchor="middle">
                    {m.sub}
                  </text>
                </motion.g>
              );
            })}
          </motion.g>

          {/* 6. Clasp detail */}
          <motion.g animate={{ opacity: step === 5 || (step === 6 && phase === "play") ? 1 : 0 }} transition={{ duration: 0.5 }}>
            <circle cx="300" cy="460" r="44" fill="#111" stroke="#3a3a3a" />
            <motion.rect x="262" y="452" width="30" height="16" rx="8" fill="url(#gold)" animate={{ x: mix(258, 270, claspP) }} transition={spring} />
            <motion.rect x="308" y="452" width="30" height="16" rx="8" fill="url(#gold)" animate={{ x: mix(312, 300, claspP) }} transition={spring} />
            <motion.circle
              cx="300"
              cy="460"
              r="40"
              fill="none"
              stroke="#f6e2a8"
              style={{ transformOrigin: "300px 460px" }}
              initial={{ scale: 0.15, opacity: 0 }}
              animate={claspP >= 1 ? { scale: [0.15, 1], opacity: [0.9, 0] } : { scale: 0.15, opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
            <text x="300" y="518" className="jb-svg-sub" textAnchor="middle">
              the clasp, close up
            </text>
          </motion.g>

          {/* 8. Polish + edition number */}
          <motion.rect
            key={shine}
            x="-200"
            y="40"
            width="160"
            height="420"
            fill="url(#sheen)"
            style={{ mixBlendMode: "overlay" }}
            initial={{ x: -200, opacity: 0 }}
            animate={shine ? { x: 700, opacity: [0, 1, 0] } : {}}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          />
          <motion.text
            x="300"
            y="438"
            textAnchor="middle"
            className="jb-svg-edition"
            animate={{ opacity: signP >= 1 ? 1 : 0, y: signP >= 1 ? 0 : 6 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            Nº 01 of 50
          </motion.text>
        </svg>
      </motion.div>

      {/* Intro */}
      <AnimatePresence>
        {phase === "intro" && (
          <motion.section className="jb-intro" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.7 }}>
            <p className="jb-eyebrow">A new piece from the atelier</p>
            <h1 className="jb-title">Make the Behr.</h1>
            <p className="jb-lede">
              Our new hero necklace is made entirely by hand in our Brooklyn studio. Make it yourself, one step at a time, and watch the
              hours add up.
            </p>
            <button className="jb-btn" onClick={begin} autoFocus>
              Enter the atelier
            </button>
            <p className="jb-fine">About a minute of your time. {TOTAL_HOURS} hours of ours. Nothing here is for sale.</p>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Step panel */}
      <AnimatePresence mode="wait">
        {phase === "play" && (
          <motion.section
            key={cur.id}
            className="jb-panel"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45 }}
          >
            <div className="jb-steps" aria-hidden="true">
              {STEPS.map((s, i) => (
                <span key={s.id} className={i < step ? "done" : i === step ? "now" : ""} />
              ))}
            </div>
            <p className="jb-eyebrow">
              Step {String(step + 1).padStart(2, "0")} of {String(STEPS.length).padStart(2, "0")} · {cur.hours} hours
            </p>
            <h2 className="jb-step-title">{cur.title}</h2>
            <p className="jb-step-copy">{cur.copy}</p>
            <ul className="jb-tags" aria-label="Frameworks">
              {cur.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <div className="jb-action">
              <motion.button className="jb-btn" onClick={work} whileTap={reduce ? undefined : { scale: 0.96 }} autoFocus>
                {cur.id === "set" ? `${cur.verb} (${stonesSet}/${STONE_COUNT})` : cur.verb}
              </motion.button>
              <span className="jb-clicks">
                {Array.from({ length: cur.clicks }).map((_, i) => (
                  <i key={i} className={i < clicks ? "on" : ""} />
                ))}
              </span>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Finale */}
      <AnimatePresence>
        {phase === "done" && (
          <motion.section className="jb-final" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3 }}>
            <p className="jb-eyebrow">The Behr · Nº 01 of 50</p>
            <h2 className="jb-title jb-title--sm">You made it in {fmtClock(yourMs)}.</h2>
            <p className="jb-lede">
              In our studio it takes <strong>{TOTAL_HOURS} hours</strong> of skilled hands: {STONE_COUNT} stones set one by one, a bow carved in
              wax and cast in brass, a clasp we engineered ourselves. Fifty will be made.
            </p>
            <dl className="jb-stats">
              <div>
                <dt>Hours by hand</dt>
                <dd>{TOTAL_HOURS}</dd>
              </div>
              <div>
                <dt>Stones set</dt>
                <dd>{STONE_COUNT}</dd>
              </div>
              <div>
                <dt>Edition</dt>
                <dd>50</dd>
              </div>
            </dl>
            <p className="jb-lede">
              The Behr will be shown first in person, at a private exhibition in our Brooklyn studio.
            </p>
            <div className="jb-final-actions">
              <a className="jb-btn" href={rsvpHref}>
                RSVP for the first showing
              </a>
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
                    <strong>Why a game.</strong> A nod to Hermès's 2011 website game: digital craftsmanship and cultural relevance without selling
                    anything. There are no prices or carts on this page.
                  </p>
                  <p>
                    <strong>Physical rarity → perceived rarity.</strong> The production side of the Luxury Business Model is strong at Jennifer Behr
                    but invisible to the customer. Each step surfaces one element: IP and design, skilled labor, rare raw materials, a controlled
                    supply chain, specialized tools, proprietary processes, the factory at its original location, and a limited collection.
                  </p>
                  <p>
                    <strong>ASCEND.</strong> Art (the founder's sculpture training), design (the carved bow), science (materials) and engineering (the
                    hair-magnet clasp) meet in one piece.
                  </p>
                  <p>
                    <strong>AO Grid: Educate.</strong> Teaching the process moves visitors from novice toward expert. The RSVP converts that into an
                    in-person showing for the people who carry the story.
                  </p>
                  <p className="jb-fine">Hours, materials and the edition size are illustrative assumptions for this prototype.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
