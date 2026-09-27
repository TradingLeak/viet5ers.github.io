import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type LenisLike = {
  scrollTo: (target: HTMLElement | number, options?: Record<string, unknown>) => void;
};

function getLenis(): LenisLike | undefined {
  if (typeof window === 'undefined') return undefined;
  return (window as unknown as { __lenis?: LenisLike }).__lenis;
}

/** Smooth-scroll to an in-page anchor, using Lenis when available. */
export function scrollToId(hash: string) {
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, {
      offset: -72,
      duration: 1.35,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });
  } else {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/** Smooth-scroll back to the very top. */
export function scrollToTop() {
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(0, { duration: 1.2 });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}
