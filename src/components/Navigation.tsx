'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NAV_LINKS } from '@/data/content';
import { cn, scrollToId, scrollToTop } from '@/lib/utils';

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="group flex items-center gap-2.5" aria-label="VIET5ERS home">
      <span className="grid h-8 w-8 place-items-center rounded-md border border-accent/40 bg-accent/10 transition-colors group-hover:bg-accent/20">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 text-accent"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4 L12 20 L20 4" />
          <circle cx="12" cy="5" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      </span>
      <span className="font-display text-lg font-extrabold tracking-[0.2em] text-white">
        VIET<span className="text-accent">5</span>ERS
      </span>
    </button>
  );
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    requestAnimationFrame(() => scrollToId(href));
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Mission window bar */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-500',
          scrolled || open ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100',
        )}
      >
        <div className="flex h-10 items-center justify-center gap-3 border-b border-white/5 bg-space-950/80 px-4 backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/60">
            Applications open — Cohort 07 · Q4 2026
          </p>
        </div>
      </div>

      {/* Main nav */}
      <nav
        className={cn(
          'border-b transition-all duration-500',
          scrolled && !open
            ? 'border-white/5 bg-space-950/70 backdrop-blur-xl'
            : 'border-transparent bg-transparent',
        )}
      >
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between md:h-20">
            <Logo onClick={() => (setOpen(false), scrollToTop())} />

            <div className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((link) => (
                <button key={link.href} onClick={() => go(link.href)} className="nav-link">
                  {link.label}
                </button>
              ))}
              <button onClick={() => go('#join')} className="btn-primary !px-6 !py-2.5 text-sm">
                Join the Mission
              </button>
            </div>

            <button
              className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <span
                className={cn(
                  'h-0.5 w-6 bg-white transition-transform duration-300',
                  open && 'translate-y-2 rotate-45',
                )}
              />
              <span className={cn('h-0.5 w-6 bg-white transition-opacity duration-300', open && 'opacity-0')} />
              <span
                className={cn(
                  'h-0.5 w-6 bg-white transition-transform duration-300',
                  open && '-translate-y-2 -rotate-45',
                )}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 -z-10 flex flex-col justify-center bg-space-950/95 px-8 backdrop-blur-2xl md:hidden"
          >
            <div className="grid-bg absolute inset-0 opacity-40" />
            <div className="relative">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ delay: 0.07 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => go(link.href)}
                  className="block w-full border-b border-white/10 py-5 text-left font-display text-3xl font-bold"
                >
                  <span className="mr-4 font-mono text-sm text-accent">0{i + 1}</span>
                  {link.label}
                </motion.button>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ delay: 0.32, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => go('#join')}
                className="btn-primary mt-10 w-full"
              >
                Join the Mission
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
