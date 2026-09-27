'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  size?: 'md' | 'lg';
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  size = 'lg',
}: SectionHeadingProps) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center')}>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className={cn(
          'mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.35em] text-accent',
          align === 'center' && 'justify-center',
        )}
      >
        <span className="h-px w-8 bg-accent/60" />
        {eyebrow}
        {align === 'center' && <span className="h-px w-8 bg-accent/60" />}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className={cn(size === 'lg' ? 'heading-lg' : 'heading-md', 'text-balance')}
      >
        {title}
      </motion.h2>
      {description ? (
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="body-lg mt-6"
        >
          {description}
        </motion.p>
      ) : null}
    </div>
  );
}
