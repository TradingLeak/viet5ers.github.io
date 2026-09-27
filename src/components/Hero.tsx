'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { scrollToId } from '@/lib/utils';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(0,212,170,0.07),transparent_55%)]" />
  ),
});

const lineWrapper: Variants = {
  hidden: {},
  show: (i: number) => ({
    transition: { staggerChildren: 0.02, delayChildren: 0.35 + i * 0.14 },
  }),
};

const lineInner: Variants = {
  hidden: { y: '115%' },
  show: {
    y: '0%',
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

function Telemetry() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const clock = new Date().toISOString().slice(11, 19);
  const vol = (1.18 + 0.35 * Math.sin(tick / 4)).toFixed(2);
  const spr = (0.02 + 0.015 * Math.abs(Math.sin(tick / 3))).toFixed(3);

  return (
    <div className="pointer-events-none hidden select-none flex-col items-end gap-6 font-mono text-[11px] uppercase tracking-[0.25em] text-white/40 lg:flex">
      <div className="text-right">
        <p className="mb-1 text-white/25">Mission clock</p>
        <p className="text-sm text-white/70 tabular-nums">{clock} UTC</p>
      </div>
      <div className="text-right">
        <p className="mb-1 text-white/25">Session</p>
        <p className="text-sm text-accent">London / New York</p>
      </div>
      <div className="text-right">
        <p className="mb-1 text-white/25">Volatility</p>
        <p className="text-sm text-white/70 tabular-nums">{vol} σ</p>
      </div>
      <div className="text-right">
        <p className="mb-1 text-white/25">Spread</p>
        <p className="text-sm text-white/70 tabular-nums">{spr} pip</p>
      </div>
      <div className="mt-2 border-t border-white/10 pt-4 text-right">
        <p className="text-white/25">21.0285°N — 105.8542°E</p>
      </div>
    </div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.45], [0, -90]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.1]);
  const sceneScale = useTransform(scrollYProgress, [0, 0.75], [1, 1.08]);

  return (
    <section ref={ref} id="top" className="relative flex min-h-screen items-center overflow-hidden">
      {/* 3D background */}
      <motion.div style={{ opacity: sceneOpacity, scale: sceneScale }} className="absolute inset-0">
        <HeroScene />
      </motion.div>

      {/* Readability gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.9)_0%,rgba(2,6,23,0.45)_40%,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-space-950" />
      <div className="noise-bg absolute inset-0" />

      {/* Content */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="container-custom pointer-events-none relative z-10 pb-28 pt-36 md:pt-40"
      >
        <div className="flex items-end justify-between gap-10">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.4em] text-accent"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Viet5ers Collective — Est. Hà Nội 2023
            </motion.p>

            <h1 className="heading-xl uppercase">
              {['Trade', 'Beyond', 'Limits'].map((word, i) => (
                <motion.span
                  key={word}
                  custom={i}
                  variants={lineWrapper}
                  initial="hidden"
                  animate="show"
                  className="block overflow-hidden pb-1"
                >
                  <motion.span
                    variants={lineInner}
                    className={`block ${i === 1 ? 'text-gradient-accent' : ''}`}
                  >
                    {word}
                  </motion.span>
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="body-lg mt-8 max-w-xl"
            >
              We turn disciplined traders into career professionals — institutional-grade education,
              real capital, and a community that never sleeps. Launched from Vietnam, aimed at the world.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.05 }}
              className="pointer-events-auto mt-10 flex flex-wrap items-center gap-4"
            >
              <button onClick={() => scrollToId('#join')} className="btn-primary">
                Start Your Mission
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </button>
              <button onClick={() => scrollToId('#programs')} className="btn-secondary">
                Explore Programs
              </button>
            </motion.div>
          </div>

          <Telemetry />
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        onClick={() => scrollToId('#stats')}
        style={{ opacity: contentOpacity }}
        className="pointer-events-auto absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        aria-label="Scroll to results"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-white/50 transition-colors hover:text-white"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.35em]">Scroll</span>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" />
            <path d="m6 13 6 6 6-6" />
          </svg>
        </motion.div>
      </motion.button>
    </section>
  );
}
