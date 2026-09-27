'use client';

import { motion } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading';
import { MISSIONS } from '@/data/content';
import { cn } from '@/lib/utils';

const STATUS_META = {
  completed: { label: 'Completed', pill: 'border-accent/30 bg-accent/10 text-accent', dot: 'bg-accent' },
  active: { label: 'In flight', pill: 'border-gold/30 bg-gold/10 text-gold', dot: 'bg-gold' },
  upcoming: { label: 'Upcoming', pill: 'border-white/15 bg-white/5 text-white/50', dot: 'bg-white/40' },
} as const;

export default function Missions() {
  return (
    <section id="missions" className="section scroll-mt-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(0,212,170,0.05),transparent_55%)]" />

      <div className="container-custom relative">
        <SectionHeading
          eyebrow="Flight log"
          title="Every cohort is a mission."
          description="From five traders in a co-working room to a network in orbit. Here is the trajectory so far — and what launches next."
        />

        <ol className="relative ml-2 mt-16 space-y-12 border-l border-white/10 pl-8 md:ml-8 md:mt-24 md:space-y-16 md:pl-12">
          {MISSIONS.map((mission, i) => {
            const status = STATUS_META[mission.status];
            return (
              <motion.li
                key={mission.title}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                {/* Node */}
                <span
                  className={cn(
                    'absolute -left-[41px] top-2 grid h-5 w-5 place-items-center rounded-full border border-white/15 bg-space-950 md:-left-[57px]',
                    mission.status === 'active' && 'border-gold/50',
                  )}
                >
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      status.dot,
                      mission.status === 'active' && 'animate-pulse',
                    )}
                  />
                </span>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">
                    {mission.quarter}
                  </span>
                  <span
                    className={cn(
                      'rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em]',
                      status.pill,
                    )}
                  >
                    {status.label}
                  </span>
                </div>

                <h3 className="heading-sm mt-3">{mission.title}</h3>
                <p className="body-md mt-3 max-w-2xl">{mission.description}</p>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
