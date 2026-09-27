import { NAV_LINKS, PROGRAMS, SOCIALS } from '@/data/content';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-space-950">
      <div className="container-custom py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-md border border-accent/40 bg-accent/10">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4 L12 20 L20 4" />
                  <circle cx="12" cy="5" r="1.4" fill="currentColor" stroke="none" />
                </svg>
              </span>
              <span className="font-display text-lg font-extrabold tracking-[0.2em]">
                VIET<span className="text-accent">5</span>ERS
              </span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/50">
              Discipline. Data. Direction. A collective of traders engineering financial freedom
              from Vietnam.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 font-mono text-[10px] uppercase tracking-wider text-white/50 transition-all hover:border-accent/40 hover:text-accent"
                >
                  {social.label.slice(0, 2)}
                </a>
              ))}
            </div>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">Programs</h4>
            <ul className="mt-5 space-y-3">
              {PROGRAMS.map((program) => (
                <li key={program.id}>
                  <a href="#programs" className="text-sm text-white/60 transition-colors hover:text-white">
                    {program.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Collective */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">Collective</h4>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-white/60 transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#join" className="text-sm text-accent transition-colors hover:text-accent-glow">
                  Join the Mission
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">Mission Control</h4>
            <ul className="mt-5 space-y-3 text-sm text-white/60">
              <li>
                <a href="mailto:hello@viet5ers.io" className="transition-colors hover:text-white">
                  hello@viet5ers.io
                </a>
              </li>
              <li className="font-mono text-xs text-white/40">21.0285°N — 105.8542°E</li>
              <li>Nam Định · Hà Nội, Việt Nam</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/5 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-white/40">© {year} VIET5ERS Collective. All rights reserved.</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/30">
            Trade Beyond Limits
          </p>
          <p className="text-xs text-white/30">Nothing here is financial advice.</p>
        </div>
      </div>
    </footer>
  );
}
