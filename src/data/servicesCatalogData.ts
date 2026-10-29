/**
 * STENZA BEAUTY - Services Catalog & Popular Services Taxonomy
 * Standardized service templates for artisan selection and customer filtering.
 */

export interface StandardServiceTemplate {
  id: string;
  name: string;
  category: string;
  defaultPrice: number; // in ZAR
  defaultDuration: string; // e.g. "60 min"
  durationMinutes: number;
  description: string;
  isPopularShortcut?: boolean;
  shortcutTag?: string; // e.g. "Braids", "Haircuts", "Nails", etc.
  iconName?: string;
}

export const POPULAR_SERVICE_SHORTCUTS = [
  { id: 'braids', name: 'Braids', label: 'Braids & Knotless', icon: 'sparkles', query: 'braid' },
  { id: 'haircuts', name: 'Haircuts', label: 'Haircuts & Styling', icon: 'scissors', query: 'haircut' },
  { id: 'nails', name: 'Nails', label: 'Nails & Gel/Acrylic', icon: 'brush', query: 'nail' },
  { id: 'eyelash-extensions', name: 'Eyelash Extensions', label: 'Lashes & Brows', icon: 'eye', query: 'lash' },
  { id: 'makeup', name: 'Makeup', label: 'Makeup Application', icon: 'palette', query: 'makeup' },
  { id: 'wig-installation', name: 'Wig Installation', label: 'Wig Installation', icon: 'crown', query: 'wig' },
  { id: 'pedicure', name: 'Pedicure', label: 'Pedicures', icon: 'footprints', query: 'pedicure' },
  { id: 'barbering', name: 'Barbering', label: 'Barbering & Fades', icon: 'zap', query: 'barber' }
] as const;

export type PopularServiceShortcut = (typeof POPULAR_SERVICE_SHORTCUTS)[number];
export type StandardServiceItem = StandardServiceTemplate;

export const STANDARD_SERVICES_CATALOG: StandardServiceTemplate[] = [
  // 1. Braids & Protective Styles
  {
    id: 'srv-braids-knotless',
    name: 'Braids (Knotless & Box Braids)',
    category: 'Hair and Hairstyles',
    defaultPrice: 650,
    defaultDuration: '180 min',
    durationMinutes: 180,
    description: 'Tension-free lightweight knotless box braids with seamless scalp finish and featherlight movement.',
    isPopularShortcut: true,
    shortcutTag: 'Braids'
  },
  {
    id: 'srv-cornrows-tribal',
    name: 'Cornrows & Protective Styles',
    category: 'Hair and Hairstyles',
    defaultPrice: 480,
    defaultDuration: '120 min',
    durationMinutes: 120,
    description: 'Precision straight-back or stitch cornrows designed for healthy scalp nourishment and long wear.',
    isPopularShortcut: true,
    shortcutTag: 'Braids'
  },

  // 2. Haircut & Hair Styling
  {
    id: 'srv-haircut',
    name: 'Haircut',
    category: 'Hair and Hairstyles',
    defaultPrice: 350,
    defaultDuration: '45 min',
    durationMinutes: 45,
    description: 'Precision scissor or clipper shaping, customized layering, wash and professional finish.',
    isPopularShortcut: true,
    shortcutTag: 'Haircuts'
  },
  {
    id: 'srv-hair-styling',
    name: 'Hair Styling',
    category: 'Hair and Hairstyles',
    defaultPrice: 550,
    defaultDuration: '75 min',
    durationMinutes: 75,
    description: 'Signature silk press, curling, thermal blowout or bespoke occasion updo styling.',
    isPopularShortcut: true,
    shortcutTag: 'Haircuts'
  },
  {
    id: 'srv-hair-treatment',
    name: 'Hair Treatment',
    category: 'Hair and Hairstyles',
    defaultPrice: 490,
    defaultDuration: '60 min',
    durationMinutes: 60,
    description: 'Intense moisture therapy, protein repair mask, and steam scalp hydration for damage reversal.'
  },

  // 3. Wigs & Extensions
  {
    id: 'srv-wig-installation',
    name: 'Wig Installation',
    category: 'Hair and Hairstyles',
    defaultPrice: 750,
    defaultDuration: '120 min',
    durationMinutes: 120,
    description: 'HD lace melting, braid down, customized bleached knots, baby hair sculpting, and styling.',
    isPopularShortcut: true,
    shortcutTag: 'Wig Installation'
  },

  // 4. Nails & Pedicures
  {
    id: 'srv-manicure',
    name: 'Manicure',
    category: 'Nails',
    defaultPrice: 380,
    defaultDuration: '50 min',
    durationMinutes: 50,
    description: 'Gentle cuticle care, nail shaping, hand exfoliation scrub, massage, and strengthening treatment.',
    isPopularShortcut: true,
    shortcutTag: 'Nails'
  },
  {
    id: 'srv-pedicure',
    name: 'Pedicure',
    category: 'Nails',
    defaultPrice: 450,
    defaultDuration: '60 min',
    durationMinutes: 60,
    description: 'Aromatherapy foot soak, callus peel smoothing, exfoliating scrub, massage, and long-wear polish.',
    isPopularShortcut: true,
    shortcutTag: 'Pedicure'
  },
  {
    id: 'srv-gel-nails',
    name: 'Gel Nails',
    category: 'Nails',
    defaultPrice: 420,
    defaultDuration: '60 min',
    durationMinutes: 60,
    description: 'Dry machine e-file prep with multi-week chip-free high-gloss soak-off gel color finish.',
    isPopularShortcut: true,
    shortcutTag: 'Nails'
  },
  {
    id: 'srv-acrylic-nails',
    name: 'Acrylic Nails',
    category: 'Nails',
    defaultPrice: 550,
    defaultDuration: '90 min',
    durationMinutes: 90,
    description: 'Full sculpted acrylic set or tips with balanced apex architecture, custom shape and polish.',
    isPopularShortcut: true,
    shortcutTag: 'Nails'
  },
  {
    id: 'srv-nail-art',
    name: 'Nail Art',
    category: 'Nails',
    defaultPrice: 200,
    defaultDuration: '30 min',
    durationMinutes: 30,
    description: 'Bespoke hand-painted designs, French tips, chrome glazes, 3D gems, or abstract motifs.',
    isPopularShortcut: true,
    shortcutTag: 'Nails'
  },

  // 5. Lashes & Brows
  {
    id: 'srv-eyelash-extensions',
    name: 'Eyelash Extensions',
    category: 'Lashes and Brows',
    defaultPrice: 680,
    defaultDuration: '105 min',
    durationMinutes: 105,
    description: 'Custom hybrid, classic, or Russian volume extensions tailored to your eye morphology.',
    isPopularShortcut: true,
    shortcutTag: 'Eyelash Extensions'
  },
  {
    id: 'srv-lash-lifts',
    name: 'Lash Lifts',
    category: 'Lashes and Brows',
    defaultPrice: 450,
    defaultDuration: '50 min',
    durationMinutes: 50,
    description: 'Keratin lash infusion giving natural lashes upward curl, dark tinting, and mascara-like definition.'
  },
  {
    id: 'srv-eyebrow-shaping',
    name: 'Eyebrow Shaping',
    category: 'Lashes and Brows',
    defaultPrice: 220,
    defaultDuration: '30 min',
    durationMinutes: 30,
    description: 'Precision mapping, threading or waxing, trimming, and custom hybrid brow tinting.'
  },

  // 6. Makeup Artistry
  {
    id: 'srv-makeup-application',
    name: 'Makeup Application',
    category: 'Makeup',
    defaultPrice: 580,
    defaultDuration: '60 min',
    durationMinutes: 60,
    description: 'Flawless camera-ready glam with skin prep, contouring, neutral/glam eyeshadow, and lashes.',
    isPopularShortcut: true,
    shortcutTag: 'Makeup'
  },
  {
    id: 'srv-bridal-makeup',
    name: 'Bridal Makeup',
    category: 'Makeup',
    defaultPrice: 1200,
    defaultDuration: '90 min',
    durationMinutes: 90,
    description: 'Long-lasting luxury wedding makeup with waterproof setting, premium mink lashes, and touch-up kit.',
    isPopularShortcut: true,
    shortcutTag: 'Makeup'
  },

  // 7. Skincare & Facials
  {
    id: 'srv-facials',
    name: 'Facials',
    category: 'Skincare and Facials',
    defaultPrice: 650,
    defaultDuration: '60 min',
    durationMinutes: 60,
    description: 'Deep pore cleansing, enzymatic exfoliation, extractions, hydrating botanical mask, and facial massage.'
  },
  {
    id: 'srv-skincare-treatments',
    name: 'Skincare Treatments',
    category: 'Skincare and Facials',
    defaultPrice: 850,
    defaultDuration: '75 min',
    durationMinutes: 75,
    description: 'Advanced clinical dermal therapies including chemical peels, dermaplaning, or LED canopy rejuvenation.'
  },

  // 8. Waxing & Hair Removal
  {
    id: 'srv-waxing',
    name: 'Waxing',
    category: 'Waxing and Hair Removal',
    defaultPrice: 320,
    defaultDuration: '40 min',
    durationMinutes: 40,
    description: 'Hypoallergenic warm or hot wax hair removal for face, brows, legs, underarms or Brazilian.'
  },

  // 9. Barbering & Grooming
  {
    id: 'srv-barbering',
    name: 'Barbering',
    category: 'Barbering',
    defaultPrice: 280,
    defaultDuration: '40 min',
    durationMinutes: 40,
    description: 'Master razor skin fade, taper, Caesar cut, or classic gentleman shaping with hairline detailing.',
    isPopularShortcut: true,
    shortcutTag: 'Barbering'
  },
  {
    id: 'srv-beard-grooming',
    name: 'Beard Grooming',
    category: 'Barbering',
    defaultPrice: 190,
    defaultDuration: '30 min',
    durationMinutes: 30,
    description: 'Precision beard sculpting, hot towel compress, straight razor outline, and conditioning beard oils.',
    isPopularShortcut: true,
    shortcutTag: 'Barbering'
  }
];

/**
 * Filter catalog by category
 */
export function getCatalogServicesByCategory(category: string): StandardServiceTemplate[] {
  if (!category || category === 'all') return STANDARD_SERVICES_CATALOG;
  return STANDARD_SERVICES_CATALOG.filter((s) => s.category.toLowerCase().includes(category.toLowerCase()));
}
