'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading';
import { PILLARS } from '@/data/content';

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <section id="about" className="section scroll-mt-24">
      <div className="container-custom">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Visual with parallax */}
          <div ref={ref} className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10">
            <motion.div style={{ y: parallaxY }} className="absolute inset-[-8%]">
              <Image
                src="/images/about.jpg"
                alt="VIET5ERS mission control — traders at work"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-space-950/20 to-transparent" />
            <div className="glass absolute bottom-5 left-5 right-5 rounded-2xl px-5 py-4 md:bottom-6 md:left-6 md:right-auto">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">HQ — Mission Control</p>
              <p className="mt-1 text-sm text-white/70">Nam Định · Hà Nội, Việt Nam</p>
              <p className="font-mono text-[11px] text-white/35">21.0285°N — 105.8542°E</p>
            </div>
          </div>

          {/* Manifesto */}
          <div>
            <SectionHeading
              eyebrow="Manifesto"
              title="Making elite trading accessible from Southeast Asia."
              description="The world's best traders don't trade alone — they run systems, share research and protect each other's downside. We built VIET5ERS so that an ambitious trader in Vietnam gets the same infrastructure as a desk in London."
            />

            <ul className="mt-10 space-y-4">
              {[
                'Audited strategies, not signals',
                'Capital pathways with transparent rules',
                'Daily accountability on a live floor',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-accent/40 bg-accent/10">
                    <svg viewBox="0 0 24 24" className="h-3 w-3 text-accent" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-white/75">{item}</span>
                </li>
              ))}
            </ul>

            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-12 border-l-2 border-accent pl-6"
            >
              <p className="font-display text-xl font-medium italic leading-relaxed text-white/90 md:text-2xl">
                “The market is the last meritocracy on Earth. We just make sure you are equipped
                for it.”
              </p>
              <footer className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-white/40">
                — Viet5ers Principle 01
              </footer>
            </motion.blockquote>
          </div>
        </div>

        {/* Pillars */}
        <div className="mt-20 grid gap-4 sm:grid-cols-3 md:mt-28">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.num}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="card"
            >
              <p className="font-mono text-xs tracking-[0.3em] text-accent">{pillar.num}</p>
              <h3 className="heading-sm mt-4">{pillar.title}</h3>
              <p className="mt-3 text-white/55">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
