import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import type { Panel } from "@/data/home";
import { url } from "@/consts";

interface VerticalCarouselProps {
  panels: Panel[];
  scrollSpeed?: number; // px per step
  interval?: number; // ms per step
}

// Auto-scrolling column from the Big City template: vertical on desktop,
// horizontal on mobile. The list is doubled so the loop is seamless.
const VerticalCarousel: React.FC<VerticalCarouselProps> = ({
  panels,
  scrollSpeed = 2,
  interval = 50,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const x = useMotionValue(0);
  const [isMobile, setIsMobile] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  // Wheel scrolling while hovered: deltas queue here and ease in over a few frames.
  const pending = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    y.set(0);
    x.set(0);
  }, [isMobile, y, x]);

  // Hovering stops the auto scroll; the mouse wheel then moves the carousel
  // up or down (no scrollbar, the page itself doesn't scroll).
  useEffect(() => {
    const el = carouselRef.current;
    if (!el || reduced) return;
    const onWheel = (e: WheelEvent) => {
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? el.clientHeight : 1;
      const d = (Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * unit;
      if (!d) return;
      e.preventDefault();
      pending.current += d;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [reduced]);

  // Keep the offset inside one copy of the doubled list so the loop is seamless both ways.
  const wrap = (v: number, half: number) => {
    if (half <= 0) return v;
    v %= half;
    return v > 0 ? v - half : v;
  };

  useAnimationFrame((_, delta) => {
    const content = contentRef.current;
    if (!content || reduced || panels.length === 0) return;
    let distance = 0;
    if (!paused) distance += ((scrollSpeed * 1000) / Math.max(1, interval)) * (delta / 1000);
    if (pending.current) {
      const step = Math.abs(pending.current) < 0.5 ? pending.current : pending.current * 0.25;
      pending.current -= step;
      distance += step;
    }
    if (!distance) return;
    if (isMobile) {
      x.set(wrap(x.get() - distance, content.scrollWidth / 2));
    } else {
      y.set(wrap(y.get() - distance, content.scrollHeight / 2));
    }
  });

  const items = [...panels, ...panels];

  return (
    <div
      className="h-[56vh] md:h-screen w-full overflow-hidden relative"
      ref={carouselRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        pending.current = 0;
      }}
      aria-label="Highlights"
    >
      <motion.div
        ref={contentRef}
        style={{ y: isMobile ? 0 : y, x: isMobile ? x : 0, willChange: "transform" }}
        className="h-full md:h-auto flex flex-row md:flex-col items-center w-max md:w-full"
      >
        {items.map((p, i) => (
          <div
            key={i}
            aria-hidden={i >= panels.length}
            className="h-full md:h-auto px-6 md:px-0 md:py-14 flex justify-center w-[72vw] md:w-full"
          >
            {p.type === "image" ? (
              <img
                src={url(p.src)}
                alt={i >= panels.length ? "" : p.alt}
                width={p.width}
                height={p.height}
                loading={i < 2 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
                className="self-center block w-full max-w-[60vh] h-auto aspect-[3/4] object-cover"
              />
            ) : (
              <div
                className="w-full max-w-md aspect-[3/4] max-h-[52vh] md:max-h-none p-5 md:p-8 flex flex-col justify-between text-white select-none"
                style={{ backgroundColor: p.color }}
              >
                <p className="font-nav text-xs md:text-sm opacity-80">{p.place}</p>
                <div>
                  <p className="font-display text-5xl md:text-8xl leading-none">{p.big}</p>
                  <p className="text-base md:text-xl mt-3 md:mt-4 max-w-64">{p.small}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default VerticalCarousel;
