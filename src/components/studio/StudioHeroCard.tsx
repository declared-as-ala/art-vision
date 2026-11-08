"use client";

import React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Clock, ShieldCheck, Sparkles } from "lucide-react";
import StudioCardPreview from "./StudioCardPreview";
import type { StudioDesign } from "./studioTypes";

/** Floating 3D business card with pointer-driven tilt and a moving light reflection. */
export default function StudioHeroCard({ design }: { design: StudioDesign }) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 140, damping: 16, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 140, damping: 16, mass: 0.6 });

  const rotateY = useTransform(sx, [0, 1], [-16, 16]);
  const rotateX = useTransform(sy, [0, 1], [12, -12]);
  const gx = useTransform(sx, (v) => v * 100);
  const gy = useTransform(sy, (v) => v * 100);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.08) 30%, transparent 58%)`;
  const shadowX = useTransform(sx, [0, 1], [30, -30]);
  const shadow = useMotionTemplate`${shadowX}px 40px 70px -20px rgba(108,43,217,0.65)`;
  const backX = useTransform(sx, [0, 1], [10, -10]);
  const backY = useTransform(sy, [0, 1], [8, -8]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative mx-auto w-full max-w-[520px] aspect-[4/3.1] flex items-center justify-center"
      style={{ perspective: 1200 }}
    >
      {/* ambient glow */}
      <div className="absolute inset-[8%] rounded-full bg-gradient-to-br from-av-violet/50 via-av-magenta/30 to-av-orange/20 blur-[70px]" />

      <motion.div
        animate={reduce ? undefined : { y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-[82%]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div className="relative w-full" style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
          {/* back card (verso) */}
          <motion.div
            className="absolute inset-0"
            style={{ x: backX, y: backY, translateZ: -50, rotate: -7, transformStyle: "preserve-3d" }}
          >
            <StudioCardPreview
              side={design.verso}
              widthMm={design.widthMm}
              heightMm={design.heightMm}
              paper
              className="w-full !rounded-xl opacity-90"
            />
            <div className="absolute inset-0 rounded-xl bg-black/25" />
          </motion.div>

          {/* front card (recto) */}
          <motion.div
            className="relative rounded-xl"
            style={{ translateZ: 30, boxShadow: shadow, transformStyle: "preserve-3d" }}
          >
            <StudioCardPreview
              side={design.recto}
              widthMm={design.widthMm}
              heightMm={design.heightMm}
              className="w-full !rounded-xl ring-1 ring-white/20"
            />
            {/* light reflection */}
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-xl mix-blend-soft-light"
              style={{ background: glare }}
            />
            {/* paper edge highlight */}
            <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/25" />
          </motion.div>

          {/* floating chips */}
          <motion.div
            style={{ translateZ: 90 }}
            className="absolute -top-5 -right-4 sm:-right-8 flex items-center gap-1.5 rounded-full bg-[#120c28]/90 backdrop-blur-xl border border-white/15 px-3 py-1.5 text-[11px] font-bold text-white shadow-xl"
          >
            <Clock size={12} className="text-av-orange" /> BAT sous 24h
          </motion.div>
          <motion.div
            style={{ translateZ: 70 }}
            className="absolute -bottom-5 -left-3 sm:-left-8 flex items-center gap-1.5 rounded-full bg-[#120c28]/90 backdrop-blur-xl border border-white/15 px-3 py-1.5 text-[11px] font-bold text-white shadow-xl"
          >
            <ShieldCheck size={12} className="text-emerald-400" /> Fichier 300 DPI
          </motion.div>
          <motion.div
            style={{ translateZ: 110 }}
            className="absolute top-1/2 -left-6 sm:-left-12 hidden sm:flex items-center gap-1.5 rounded-full bg-gradient-to-r from-av-violet to-av-magenta px-3 py-1.5 text-[11px] font-bold text-white shadow-xl shadow-av-magenta/30"
          >
            <Sparkles size={12} /> 100 % personnalisable
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
