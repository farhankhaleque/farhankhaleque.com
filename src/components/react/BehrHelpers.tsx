// Hand-drawn animal helpers for "Make the Behr". On every click one walks in
// from the side of the screen, delivers something to the necklace, and walks off.
//
// Drawn with rough.js (github.com/rough-stuff/rough) so the ink looks hand-made,
// and "line boil" animated: each animal is redrawn a few times a second with a
// different random seed, the way traditional hand-drawn animation wobbles.
// Movement is framer-motion. The characters are original to this project.
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import rough from "roughjs";

const INK = "#2a2622";

type Op =
  | { t: "e"; x: number; y: number; w: number; h: number; f?: string; fs?: string }
  | { t: "c"; x: number; y: number; d: number; f?: string; fs?: string; s?: string; sw?: number }
  | { t: "p"; d: string; f?: string; fs?: string; s?: string; sw?: number }
  | { t: "l"; x1: number; y1: number; x2: number; y2: number; s?: string; sw?: number };

type Animal = {
  body: Op[];
  legsA: Op[];
  legsB: Op[];
  mouth: { x: number; y: number }; // where it holds things (box is 120 x 100, facing right)
};

const l = (x1: number, y1: number, x2: number, y2: number): Op => ({ t: "l", x1, y1, x2, y2 });

export type Kind = "bear" | "beaver" | "magpie" | "salamander" | "mouse" | "lobster" | "squirrel" | "owl";

const ANIMALS: Record<Kind, Animal> = {
  // Draw: the Behr bear, with a pencil
  bear: {
    body: [
      { t: "c", x: 16, y: 56, d: 9, f: "#c79f78" },
      { t: "e", x: 52, y: 62, w: 72, h: 46, f: "#c79f78" },
      { t: "c", x: 82, y: 27, d: 12, f: "#c79f78" },
      { t: "c", x: 102, y: 26, d: 12, f: "#c79f78" },
      { t: "c", x: 92, y: 42, d: 34, f: "#c79f78" },
      { t: "e", x: 106, y: 47, w: 16, h: 11, f: "#ecd8c2" },
      { t: "c", x: 113, y: 45, d: 5, f: INK },
      { t: "c", x: 96, y: 37, d: 3.5, f: INK },
    ],
    legsA: [l(30, 78, 26, 95), l(44, 82, 48, 95), l(66, 82, 62, 95), l(78, 76, 84, 94)],
    legsB: [l(30, 78, 36, 95), l(44, 82, 40, 95), l(66, 82, 72, 95), l(78, 76, 74, 94)],
    mouth: { x: 114, y: 52 },
  },
  // Carve: a beaver (it carves for a living)
  beaver: {
    body: [
      { t: "e", x: 14, y: 80, w: 30, h: 12, f: "#5d4430", fs: "cross-hatch" },
      { t: "e", x: 50, y: 68, w: 64, h: 40, f: "#9b6b45" },
      { t: "c", x: 78, y: 43, d: 8, f: "#9b6b45" },
      { t: "c", x: 86, y: 56, d: 30, f: "#9b6b45" },
      { t: "c", x: 92, y: 51, d: 3.5, f: INK },
      { t: "c", x: 101, y: 55, d: 5, f: INK },
      { t: "p", d: "M96 64 L101 64 L101 71 L96 71 Z", f: "#fffaf0" },
      l(99, 58, 112, 55),
    ],
    legsA: [l(34, 84, 30, 96), l(66, 84, 70, 96)],
    legsB: [l(34, 84, 38, 96), l(66, 84, 62, 96)],
    mouth: { x: 104, y: 66 },
  },
  // Gather: a magpie, which collects shiny things
  magpie: {
    body: [
      { t: "p", d: "M32 52 L2 44 L4 52 L30 58 Z", f: INK },
      { t: "e", x: 54, y: 56, w: 52, h: 30, f: INK },
      { t: "e", x: 60, y: 62, w: 30, h: 14, f: "#fbfaf7" },
      { t: "p", d: "M38 50 Q58 42 72 54 Q56 59 38 56 Z", f: "#43547a" },
      { t: "c", x: 82, y: 42, d: 22, f: INK },
      { t: "c", x: 86, y: 40, d: 4, f: "#fbfaf7" },
      { t: "p", d: "M92 41 L106 44 L92 47 Z", f: INK },
    ],
    legsA: [l(52, 70, 47, 93), l(60, 70, 65, 93), l(47, 93, 42, 94), l(65, 93, 70, 94)],
    legsB: [l(52, 70, 55, 93), l(60, 70, 58, 93), l(55, 93, 60, 94), l(58, 93, 63, 94)],
    mouth: { x: 106, y: 45 },
  },
  // Cast: a salamander, the creature that lives in fire
  salamander: {
    body: [
      { t: "p", d: "M34 76 Q14 70 2 82 Q16 77 34 83 Z", f: "#e8743b" },
      { t: "e", x: 62, y: 79, w: 62, h: 16, f: "#e8743b" },
      { t: "e", x: 102, y: 76, w: 26, h: 15, f: "#e8743b" },
      { t: "c", x: 106, y: 72, d: 3.5, f: INK },
      { t: "c", x: 52, y: 76, d: 5, f: INK },
      { t: "c", x: 66, y: 81, d: 4, f: INK },
      { t: "c", x: 80, y: 76, d: 4, f: INK },
    ],
    legsA: [l(46, 85, 38, 95), l(78, 85, 86, 95), l(54, 86, 58, 95), l(70, 86, 66, 95)],
    legsB: [l(46, 85, 52, 95), l(78, 85, 72, 95), l(54, 86, 48, 95), l(70, 86, 76, 95)],
    mouth: { x: 114, y: 76 },
  },
  // Set stones: a mouse, for the small precise work
  mouse: {
    body: [
      { t: "p", d: "M30 78 Q10 70 6 84 Q4 93 15 90" },
      { t: "e", x: 52, y: 74, w: 48, h: 32, f: "#bfb7ae" },
      { t: "c", x: 75, y: 56, d: 16, f: "#e9b8b0" },
      { t: "e", x: 82, y: 70, w: 30, h: 22, f: "#bfb7ae" },
      { t: "c", x: 88, y: 66, d: 3, f: INK },
      { t: "c", x: 97, y: 71, d: 4, f: "#d9827a" },
      l(94, 73, 106, 70),
    ],
    legsA: [l(40, 86, 36, 96), l(62, 86, 66, 96)],
    legsB: [l(40, 86, 44, 96), l(62, 86, 58, 96)],
    mouth: { x: 100, y: 68 },
  },
  // Clasp: a lobster (it is a lobster clasp, after all)
  lobster: {
    body: [
      { t: "e", x: 20, y: 76, w: 18, h: 14, f: "#d9534f" },
      { t: "e", x: 34, y: 74, w: 18, h: 16, f: "#d9534f" },
      { t: "e", x: 56, y: 72, w: 38, h: 24, f: "#d9534f" },
      l(70, 66, 86, 52),
      { t: "c", x: 92, y: 46, d: 17, f: "#d9534f" },
      { t: "p", d: "M94 39 L107 33 L100 44 Z", f: "#d9534f" },
      l(70, 78, 88, 82),
      { t: "c", x: 94, y: 83, d: 14, f: "#d9534f" },
      l(68, 63, 74, 53),
      { t: "c", x: 74, y: 52, d: 4, f: INK },
      { t: "p", d: "M72 60 Q96 28 118 32" },
    ],
    legsA: [l(46, 82, 40, 95), l(56, 84, 56, 96), l(64, 82, 70, 95)],
    legsB: [l(46, 82, 50, 95), l(56, 84, 52, 96), l(64, 82, 60, 95)],
    mouth: { x: 104, y: 38 },
  },
  // Assemble: a squirrel, carrying the jump ring
  squirrel: {
    body: [
      { t: "p", d: "M30 74 Q2 70 6 42 Q10 18 30 26 Q22 40 34 52 Q40 62 30 74 Z", f: "#c47a3c" },
      { t: "e", x: 52, y: 72, w: 40, h: 34, f: "#c47a3c" },
      { t: "e", x: 57, y: 76, w: 18, h: 20, f: "#ecd2b4" },
      { t: "p", d: "M71 46 L74 34 L80 45 Z", f: "#c47a3c" },
      { t: "c", x: 76, y: 56, d: 24, f: "#c47a3c" },
      { t: "c", x: 80, y: 53, d: 3.5, f: INK },
      { t: "c", x: 88, y: 58, d: 3, f: INK },
    ],
    legsA: [l(42, 86, 38, 96), l(60, 86, 64, 96)],
    legsB: [l(42, 86, 46, 96), l(60, 86, 56, 96)],
    mouth: { x: 90, y: 61 },
  },
  // Polish and sign: an owl, inspecting through a monocle
  owl: {
    body: [
      { t: "p", d: "M42 37 L46 25 L53 36 Z", f: "#b49a72" },
      { t: "p", d: "M69 36 L76 25 L80 37 Z", f: "#b49a72" },
      { t: "e", x: 61, y: 63, w: 46, h: 58, f: "#b49a72" },
      { t: "e", x: 62, y: 71, w: 28, h: 34, f: "#e7d8be", fs: "hachure" },
      { t: "c", x: 52, y: 45, d: 14, f: "#fbfaf7" },
      { t: "c", x: 70, y: 45, d: 14, f: "#fbfaf7" },
      { t: "c", x: 53, y: 45, d: 5, f: INK },
      { t: "c", x: 71, y: 45, d: 5, f: INK },
      { t: "c", x: 70, y: 45, d: 19, s: "#a8853b", sw: 1.8 },
      l(79, 49, 82, 62),
      { t: "p", d: "M59 50 L65 50 L62 56 Z", f: "#e2a33b" },
      { t: "p", d: "M40 56 Q33 72 46 85" },
    ],
    legsA: [l(54, 91, 50, 96), l(68, 91, 72, 96)],
    legsB: [l(54, 91, 56, 96), l(68, 91, 66, 96)],
    mouth: { x: 86, y: 54 },
  },
};

// Small things the helpers carry, drawn the same way.
export type Prop = { kind: "pencil" | "wax" | "flame" | "ring" | "sparkle" } | { kind: "img"; href: string; size: number };

const PROP_OPS: Record<Exclude<Prop["kind"], "img">, Op[]> = {
  pencil: [
    { t: "p", d: "M2 10 L26 2 L29 6 L5 14 Z", f: "#f2c94c" },
    { t: "p", d: "M26 2 L34 3 L29 6 Z", f: INK },
  ],
  wax: [{ t: "p", d: "M2 6 Q8 0 14 4 Q18 10 10 13 Q2 13 2 6 Z", f: "#7f9c80" }],
  flame: [
    { t: "p", d: "M8 22 Q0 12 6 2 Q8 10 12 8 Q16 14 14 22 Z", f: "#f6b13a" },
    { t: "p", d: "M9 21 Q6 15 9 10 Q11 16 12 21 Z", f: "#e8743b" },
  ],
  ring: [{ t: "c", x: 7, y: 7, d: 11, s: "#b8913e", sw: 2.4 }],
  sparkle: [{ t: "p", d: "M8 0 L10 6 L16 8 L10 10 L8 16 L6 10 L0 8 L6 6 Z", f: "#f6e2a8" }],
};

const gen = rough.generator();
type PathInfo = { d: string; stroke: string; strokeWidth: number; fill?: string };

function draw(ops: Op[], seed: number): PathInfo[] {
  const out: PathInfo[] = [];
  for (const op of ops) {
    const base = { seed, stroke: INK, strokeWidth: 1.5, roughness: 1.3, bowing: 1.3, hachureGap: 3.5, fillWeight: 0.9 } as any;
    if ("f" in op && op.f) Object.assign(base, { fill: op.f, fillStyle: op.fs ?? "solid" });
    if ("s" in op && op.s) base.stroke = op.s;
    if ("sw" in op && op.sw) base.strokeWidth = op.sw;
    const dr =
      op.t === "e"
        ? gen.ellipse(op.x, op.y, op.w, op.h, base)
        : op.t === "c"
          ? gen.circle(op.x, op.y, op.d, base)
          : op.t === "l"
            ? gen.line(op.x1, op.y1, op.x2, op.y2, base)
            : gen.path(op.d, base);
    for (const p of gen.toPaths(dr)) out.push(p as PathInfo);
  }
  return out;
}

const FRAMES = 4; // boil frames; even/odd frames also alternate the leg pose
const cache = new Map<string, PathInfo[][]>();
function frames(key: string, make: (f: number) => Op[]): PathInfo[][] {
  let v = cache.get(key);
  if (!v) {
    v = Array.from({ length: FRAMES }, (_, f) => draw(make(f), 11 + f * 17));
    cache.set(key, v);
  }
  return v;
}

const Paths = ({ paths }: { paths: PathInfo[] }) => (
  <>
    {paths.map((p, i) => (
      <path
        key={i}
        d={p.d}
        stroke={p.stroke === "none" ? "none" : p.stroke}
        strokeWidth={p.strokeWidth}
        fill={p.fill ?? "none"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ))}
  </>
);

export type Helper = {
  id: number;
  kind: Kind;
  dir: 1 | -1; // 1 = walks in from the left, facing right
  tx: number; // target, in viewport px
  ty: number;
  k: number; // scale
  prop?: Prop;
};

const DURATION = 2.5;

function HelperSprite({ h, frame, onDone }: { h: Helper; frame: number; onDone: (id: number) => void }) {
  const a = ANIMALS[h.kind];
  const body = useMemo(() => frames(h.kind, (f) => [...(f % 2 ? a.legsB : a.legsA), ...a.body]), [h.kind]);
  const prop = useMemo(
    () => (h.prop && h.prop.kind !== "img" ? frames(`prop-${h.prop.kind}`, () => PROP_OPS[h.prop!.kind as keyof typeof PROP_OPS]) : null),
    [h.prop],
  );
  const W = 120 * h.k;
  const H = 100 * h.k;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
  // Put the animal's mouth (where it holds things) on the target.
  const mouthX = h.dir === 1 ? a.mouth.x : 120 - a.mouth.x;
  const arrive = h.tx - mouthX * h.k;
  const start = h.dir === 1 ? -W - 20 : vw + 20;
  const exit = h.dir === 1 ? vw + 20 : -W - 20;
  const top = h.ty - a.mouth.y * h.k;

  return (
    <motion.div
      className="jb-helper"
      style={{ width: W, height: H }}
      initial={{ x: start, y: top }}
      animate={{ x: [start, arrive, arrive, exit], y: [top, top, top - 12 * h.k, top, top] }}
      transition={{
        x: { duration: DURATION, times: [0, 0.36, 0.6, 1], ease: ["easeOut", "linear", "easeIn"] },
        y: { duration: DURATION, times: [0, 0.36, 0.45, 0.54, 1] },
      }}
      onAnimationComplete={() => onDone(h.id)}
    >
      <motion.svg
        viewBox="0 0 120 100"
        width={W}
        height={H}
        style={{ overflow: "visible", transform: h.dir === -1 ? "scaleX(-1)" : undefined }}
        animate={{ y: [0, -3 * h.k, 0] }}
        transition={{ duration: 0.32, repeat: Infinity, ease: "easeInOut" }}
      >
        <Paths paths={body[frame % FRAMES]} />
        {h.prop && (
          <motion.g
            animate={{ opacity: [1, 1, 0, 0], scale: [1, 1, 0.4, 0.4] }}
            transition={{ duration: DURATION, times: [0, 0.5, 0.6, 1] }}
            style={{ transformOrigin: `${a.mouth.x}px ${a.mouth.y}px` }}
          >
            {h.prop.kind === "img" ? (
              <image
                href={h.prop.href}
                x={a.mouth.x - h.prop.size / 2 + 4}
                y={a.mouth.y - h.prop.size / 2 - 4}
                width={h.prop.size}
                height={h.prop.size}
              />
            ) : (
              <g transform={`translate(${a.mouth.x - 6} ${a.mouth.y - 12})`}>
                <Paths paths={prop![frame % FRAMES]} />
              </g>
            )}
          </motion.g>
        )}
      </motion.svg>
    </motion.div>
  );
}

export default function HelperLayer({ helpers, onDone }: { helpers: Helper[]; onDone: (id: number) => void }) {
  const [frame, setFrame] = useState(0);
  const active = helpers.length > 0;
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setFrame((f) => f + 1), 125); // ~8 drawings a second, like hand animation "on twos/threes"
    return () => clearInterval(t);
  }, [active]);
  return (
    <div className="jb-helpers" aria-hidden="true">
      {helpers.map((h) => (
        <HelperSprite key={h.id} h={h} frame={frame} onDone={onDone} />
      ))}
    </div>
  );
}
