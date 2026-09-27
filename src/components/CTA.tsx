'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CTA() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: wire to your mailing list / CRM endpoint.
    setDone(true);
  };

  return (
    <section id="join" className="section scroll-mt-24 overflow-hidden">
      {/* Decorative rings */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/10" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[880px] w-[880px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-accent/[0.07]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(0,212,170,0.10),transparent_60%)]" />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      <div className="container-custom relative">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="mb-6 font-mono text-xs uppercase tracking-[0.4em] text-accent"
          >
            Launch window — Cohort 07
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="heading-xl"
          >
            READY FOR
            <br />
            <span className="text-gradient-accent">LIFTOFF?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="body-lg mx-auto mt-8 max-w-xl"
          >
            Leave your coordinates. We will reach out before the next application window opens —
            with the briefing, the syllabus, and the seat.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-12"
          >
            {done ? (
              <div className="glass mx-auto flex max-w-md items-center gap-4 rounded-2xl px-6 py-5 text-left">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
                </span>
                <div>
                  <p className="font-semibold text-white">Transmission received.</p>
                  <p className="mt-1 text-sm text-white/55">
                    We will contact you before the window opens. Keep your charts close.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="glass flex-1 rounded-lg px-5 py-4 text-white placeholder:text-white/30 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
                <button type="submit" className="btn-primary whitespace-nowrap">
                  Request Access
                </button>
              </form>
            )}
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.3em] text-white/35">
              No spam. One briefing per quarter.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
