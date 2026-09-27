'use client';

import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/AnimatedCounter';
import SectionHeading from '@/components/SectionHeading';
import { STATS } from '@/data/content';

export default function Stats() {
  return (
    <section id="stats" className="section scroll-mt-24 overflow-hidden">
      {/* Backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(0,212,170,0.06),transparent_55%)]" />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]" />

      <div className="container-custom relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            size="md"
            eyebrow="By the numbers"
            title="Results, not promises."
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-mono text-xs uppercase tracking-[0.3em] text-white/40"
          >
            Data from cohorts 01–07
          </motion.p>
        </div>

        <motion.dl
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="group relative bg-space-950 p-8 transition-colors duration-500 hover:bg-space-900 md:p-10"
            >
              <dd>
                <AnimatedCounter
                  value={stat.value}
                  decimals={'decimals' in stat ? stat.decimals : 0}
                  prefix={'prefix' in stat ? stat.prefix : ''}
                  suffix={stat.suffix ?? ''}
                  className="stat-number transition-colors duration-500 group-hover:text-accent"
                />
              </dd>
              <dt className="stat-label mt-4">{stat.label}</dt>
              <p className="mt-2 text-sm text-white/35">{stat.hint}</p>
              <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
