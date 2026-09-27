'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading';
import { PROGRAMS } from '@/data/content';
import { cn, scrollToId } from '@/lib/utils';

/** Decorative orbital visual — pure CSS, themed per program. */
function ProgramVisual({
  index,
  tagline,
  glow,
  delay,
}: {
  index: string;
  tagline: string;
  glow: string;
  delay: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-space-850 via-space-900 to-space-950">
      <div className="grid-bg absolute inset-0 opacity-50" />
      {/* Glow orb */}
      <motion.div
        animate={mounted ? { y: [0, -14, 0] } : undefined}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay }}
        className="absolute left-1/2 top-1/2 h-46 w-46 -translate-x-1/2 -translate-y-1/2 md:h-56 md:w-56"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${glow}55, ${glow}11 55%, transparent 72%)`,
          borderRadius: '9999px',
          filter: 'blur(2px)',
        }}
      />
      {/* Orbital rings */}
      <div
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rotate-[28deg] rounded-full border md:h-80 md:w-80"
        style={{ borderColor: `${glow}2e` }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rotate-[64deg] rounded-full border border-dashed opacity-60 md:h-96 md:w-96"
        style={{ borderColor: `${glow}1f` }}
      />
      {/* Index + tag, echoes SpaceX spec sheets */}
      <span className="pointer-events-none absolute -bottom-7 right-3 select-none font-display text-[10rem] font-extrabold leading-none text-white/[0.05] md:text-[12rem]">
        {index}
      </span>
      <div className="absolute left-5 top-5 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: `${glow}cc` }}>
        {tagline}
      </div>
      <div className="absolute bottom-5 left-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-white/35">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: glow }} />
        Vehicle {index}
      </div>
    </div>
  );
}

export default function Programs() {
  return (
    <section id="programs" className="section scroll-mt-24">
      <div className="container-custom">
        <SectionHeading
          eyebrow="The fleet"
          title="Three programs. One trajectory."
          description="Education to get you ready, capital to get you started, and a network to keep you rising. Every vehicle is engineered in-house."
        />

        <ol className="mt-16 space-y-20 md:mt-24 md:space-y-32">
          {PROGRAMS.map((program, i) => (
            <motion.li
              key={program.id}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <div className={cn('order-1', i % 2 === 1 && 'lg:order-2')}>
                <ProgramVisual
                  index={program.index}
                  tagline={program.tagline}
                  glow={program.glow}
                  delay={i * 0.8}
                />
              </div>

              <div className={cn('order-2', i % 2 === 1 && 'lg:order-1')}>
                <p
                  className="mb-3 font-mono text-xs uppercase tracking-[0.35em]"
                  style={{ color: `${program.glow}b3` }}
                >
                  {program.index} — {program.tagline}
                </p>
                <h3 className="heading-md">{program.name}</h3>
                <p className="body-md mt-5 max-w-xl">{program.description}</p>

                <dl className="mt-8 max-w-xl space-y-3">
                  {program.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-baseline justify-between gap-6 border-b border-dotted border-white/15 pb-3"
                    >
                      <dt className="font-mono text-xs uppercase tracking-[0.22em] text-white/45">
                        {spec.label}
                      </dt>
                      <dd className="text-base font-semibold text-white">{spec.value}</dd>
                    </div>
                  ))}
                </dl>

                <button onClick={() => scrollToId('#join')} className="btn-secondary mt-10 !px-6 !py-3 text-sm">
                  Request briefing
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </button>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
