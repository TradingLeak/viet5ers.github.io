/**
 * Central content source for the site.
 * Edit copy, numbers and roadmap items here — components read from this file.
 */

export const NAV_LINKS = [
  { label: 'Programs', href: '#programs' },
  { label: 'Missions', href: '#missions' },
  { label: 'Results', href: '#stats' },
  { label: 'About', href: '#about' },
] as const;

export const STATS = [
  { value: 500, suffix: '+', label: 'Active Traders', hint: 'across 12 countries' },
  { value: 120, suffix: '+', label: 'Funded Accounts', hint: 'up to $200K per account' },
  { value: 1.2, prefix: '$', suffix: 'M+', decimals: 1, label: 'Trader Payouts', hint: 'since 2023' },
  { value: 5, suffix: 'K+', label: 'Community Members', hint: 'and counting' },
] as const;

export const PROGRAMS = [
  {
    id: 'academy',
    index: '01',
    name: 'VIET5ERS ACADEMY',
    tagline: 'Training Vehicle',
    description:
      'A structured eight-week curriculum that takes you from chart basics to a funded-ready strategy. Live desks, recorded modules and weekly evaluations keep the pressure honest.',
    specs: [
      { label: 'Modules', value: '12' },
      { label: 'Duration', value: '8 weeks' },
      { label: 'Format', value: 'Live + On-demand' },
      { label: 'Outcome', value: 'Funded-ready' },
    ],
    glow: '#00d4aa',
  },
  {
    id: 'funding',
    index: '02',
    name: 'FUNDING DESK',
    tagline: 'Heavy Lift',
    description:
      'Trade our capital and keep up to ninety percent of the upside. Pass the two-phase evaluation and a live account is yours within five days.',
    specs: [
      { label: 'Capital', value: 'Up to $200K' },
      { label: 'Profit split', value: '90%' },
      { label: 'Evaluation', value: '2 phases' },
      { label: 'Scaling', value: '+25% / 3 months' },
    ],
    glow: '#ffd700',
  },
  {
    id: 'community',
    index: '03',
    name: 'ORBITAL NETWORK',
    tagline: 'Constellation',
    description:
      'A private floor of five thousand traders sharing playbooks, post-mortems and daily briefs. You will never trade alone again.',
    specs: [
      { label: 'Members', value: '5,000+' },
      { label: 'Live briefings', value: 'Daily' },
      { label: 'Playbooks', value: '40+' },
      { label: 'Masterminds', value: 'Weekly' },
    ],
    glow: '#5bb0ff',
  },
] as const;

export const MISSIONS = [
  {
    quarter: 'Q1 2023',
    title: 'Genesis',
    description:
      'Five founding traders pool capital and discipline in a Nam Định co-working room. The charter is signed.',
    status: 'completed',
  },
  {
    quarter: 'Q4 2023',
    title: 'First Ignition',
    description:
      'Cohort 01 graduates. Twelve traders pass prop evaluations within sixty days.',
    status: 'completed',
  },
  {
    quarter: 'Q3 2024',
    title: 'Hundred Account Mark',
    description:
      'One hundred active funded accounts. The Funding Desk formalizes its two-phase evaluation.',
    status: 'completed',
  },
  {
    quarter: 'Q2 2025',
    title: 'Orbit Established',
    description:
      'The Orbital Network crosses 5,000 members. Daily briefings become the morning ritual.',
    status: 'completed',
  },
  {
    quarter: 'Q4 2026',
    title: 'Cohort 07 — Boarding',
    description:
      'Applications open for the next eight-week mission. Limited seats, unlimited ceilings.',
    status: 'active',
  },
  {
    quarter: '2027',
    title: 'Deep Field',
    description:
      'A dedicated quant desk and a permanent hub in Hà Nội. The trajectory continues.',
    status: 'upcoming',
  },
] as const;

export const PILLARS = [
  {
    num: '01',
    title: 'Precision',
    description: 'Every setup audited, every risk pre-defined. No vibes — only data.',
  },
  {
    num: '02',
    title: 'Discipline',
    description: 'Systems before emotions. We journal, review and iterate, relentlessly.',
  },
  {
    num: '03',
    title: 'Velocity',
    description: 'Eight weeks from zero to funded-ready. Momentum compounds.',
  },
] as const;

export const SOCIALS = [
  { label: 'X', href: '#' },
  { label: 'Telegram', href: '#' },
  { label: 'YouTube', href: '#' },
  { label: 'Discord', href: '#' },
] as const;
