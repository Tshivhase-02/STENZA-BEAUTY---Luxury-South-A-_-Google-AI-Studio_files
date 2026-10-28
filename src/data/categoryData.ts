/**
 * STENZA BEAUTY - Central Category Configuration & Data Models
 * Supports Services (bookable) and Products (shopping/discovery).
 * Prepared for Java Spring Boot REST API (/api/public/categories) & MySQL.
 */

export type CategoryGroup = 
  | 'Hair & Styling'
  | 'Beauty Services'
  | 'Beauty & Personal Care Products'
  | 'Fashion & Accessories';

export type CategoryType = 'SERVICE' | 'PRODUCT';

export interface StenzaCategory {
  id: string; // Stable slug e.g. 'hair-styling'
  name: string; // Clear display name
  shortDescription: string;
  group: CategoryGroup;
  type: CategoryType;
  icon: string; // Material Symbol name
  image: string;
  isActive: boolean;
  itemCountText: string;
  keywords: string[];
  isFutureOptional?: boolean;
}

export const CATEGORY_GROUPS_META: { 
  group: CategoryGroup; 
  type: CategoryType; 
  description: string;
  icon: string;
}[] = [
  {
    group: 'Hair & Styling',
    type: 'SERVICE',
    description: 'Expert hair stylists, cuts, colorists, and protective braid specialists across South Africa.',
    icon: 'content_cut'
  },
  {
    group: 'Beauty Services',
    type: 'SERVICE',
    description: 'Accredited nails, lash, brow, facial, glam makeup, waxing and luxury spa treatments.',
    icon: 'spa'
  },
  {
    group: 'Beauty & Personal Care Products',
    type: 'PRODUCT',
    description: 'Curated skincare, cosmetics, hair wellness, pure fragrances, extensions and beauty tools.',
    icon: 'shopping_bag'
  },
  {
    group: 'Fashion & Accessories',
    type: 'PRODUCT',
    description: 'South African designer activewear, footwear, fashion accessories, clothing and lingerie.',
    icon: 'checkroom'
  }
];

export const ALL_CATEGORIES: StenzaCategory[] = [
  // ================= GROUP A: Hair & Styling (SERVICES) =================
  {
    id: 'hair-styling',
    name: 'Hair & Styling',
    shortDescription: 'Cuts, blowouts, treatments, silk presses, colouring and bespoke styling.',
    group: 'Hair & Styling',
    type: 'SERVICE',
    icon: 'content_cut',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
    isActive: true,
    itemCountText: '840+ Stylists',
    keywords: ['haircut', 'blowout', 'color', 'silk press', 'treatment', 'salon', 'wash', 'curls']
  },
  {
    id: 'braids-protective-styles',
    name: 'Braids & Protective Styles',
    shortDescription: 'Knotless braids, cornrows, twists, loc maintenance and faux locs.',
    group: 'Hair & Styling',
    type: 'SERVICE',
    icon: 'face_3',
    image: '/assets/aistudio/Media__7__14ebe8b0.jpg',
    isActive: true,
    itemCountText: '620+ Braiders',
    keywords: ['braids', 'knotless', 'cornrows', 'twists', 'locs', 'dreadlocks', 'protective style', 'tribal']
  },

  // ================= GROUP B: Beauty Services (SERVICES) =================
  {
    id: 'nails',
    name: 'Nails',
    shortDescription: 'Manicures, pedicures, gel extensions, acrylic sculpting and nail art.',
    group: 'Beauty Services',
    type: 'SERVICE',
    icon: 'brush',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
    isActive: true,
    itemCountText: '980+ Studios',
    keywords: ['nails', 'manicure', 'pedicure', 'gel', 'acrylic', 'nail art', 'russian manicure', 'tips']
  },
  {
    id: 'lashes-brows',
    name: 'Lashes & Brows',
    shortDescription: 'Lash extensions, lash lifts, brow lamination, threading and tinting.',
    group: 'Beauty Services',
    type: 'SERVICE',
    icon: 'visibility',
    image: 'https://images.unsplash.com/photo-1512290900672-1f4a9c8f2b74?auto=format&fit=crop&w=600&q=80',
    isActive: true,
    itemCountText: '710+ Artists',
    keywords: ['lashes', 'eyelash extensions', 'brows', 'brow lamination', 'microblading', 'threading', 'tint']
  },
  {
    id: 'skincare-facials',
    name: 'Skincare & Facials',
    shortDescription: 'Hydra-facials, chemical peels, dermaplaning and clinical skin rejuvenation.',
    group: 'Beauty Services',
    type: 'SERVICE',
    icon: 'spa',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    isActive: true,
    itemCountText: '540+ Clinics',
    keywords: ['facial', 'skincare', 'peel', 'dermaplaning', 'hydrafacial', 'skin glow', 'acne', 'anti-aging']
  },
  {
    id: 'makeup-glam',
    name: 'Makeup & Glam',
    shortDescription: 'Editorial glam, soft glam, bridal makeup, photoshoots and evening beauty.',
    group: 'Beauty Services',
    type: 'SERVICE',
    icon: 'palette',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
    isActive: true,
    itemCountText: '490+ MUAs',
    keywords: ['makeup', 'bridal', 'glam', 'photoshoot', 'soft glam', 'contour', 'artist', 'prom']
  },
  {
    id: 'waxing-hair-removal',
    name: 'Waxing & Hair Removal',
    shortDescription: 'Body waxing, Brazilian waxing, threading and laser hair reduction.',
    group: 'Beauty Services',
    type: 'SERVICE',
    icon: 'auto_fix_high',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
    isActive: true,
    itemCountText: '380+ Studios',
    keywords: ['waxing', 'hair removal', 'brazilian', 'threading', 'laser', 'smooth skin', 'bikini']
  },
  {
    id: 'spa-body-treatments',
    name: 'Spa & Body Treatments',
    shortDescription: 'Full body massages, scrubs, sauna therapy and holistic wellness rituals.',
    group: 'Beauty Services',
    type: 'SERVICE',
    icon: 'self_improvement',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
    isActive: true,
    itemCountText: '420+ Spas',
    keywords: ['spa', 'massage', 'body scrub', 'wellness', 'hot stone', 'relaxation', 'aromatherapy']
  },

  // ================= GROUP C: Beauty & Personal Care Products (PRODUCTS) =================
  {
    id: 'skincare-products',
    name: 'Skincare Products',
    shortDescription: 'Cleansers, serums, sunscreens, hydrators and botanical skin treatments.',
    group: 'Beauty & Personal Care Products',
    type: 'PRODUCT',
    icon: 'sanitizer',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    isActive: true,
    itemCountText: '180+ Products',
    keywords: ['serum', 'cream', 'moisturizer', 'sunscreen', 'cleanser', 'toner', 'botanical']
  },
  {
    id: 'makeup-cosmetics',
    name: 'Makeup & Cosmetics',
    shortDescription: 'Foundations, concealers, lip glazes, eyeshadow palettes and setting sprays.',
    group: 'Beauty & Personal Care Products',
    type: 'PRODUCT',
    icon: 'colorize',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    isActive: true,
    itemCountText: '140+ Products',
    keywords: ['foundation', 'lipstick', 'lipgloss', 'eyeshadow', 'blush', 'powder', 'setting spray']
  },
  {
    id: 'hair-care-products',
    name: 'Hair Care Products',
    shortDescription: 'Shampoos, deep conditioners, hair oils, curl custards and scalp elixirs.',
    group: 'Beauty & Personal Care Products',
    type: 'PRODUCT',
    icon: 'shower',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
    isActive: true,
    itemCountText: '120+ Products',
    keywords: ['shampoo', 'conditioner', 'hair oil', 'curl cream', 'scalp oil', 'treatment mask']
  },
  {
    id: 'wigs-hair-extensions',
    name: 'Wigs & Hair Extensions',
    shortDescription: 'Human hair lace frontals, bundles, closures, clips and premium synthetic wigs.',
    group: 'Beauty & Personal Care Products',
    type: 'PRODUCT',
    icon: 'style',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80',
    isActive: true,
    itemCountText: '95+ Products',
    keywords: ['wigs', 'bundles', 'lace frontal', 'hair extensions', 'virgin hair', 'hd lace']
  },
  {
    id: 'fragrances-body-care',
    name: 'Fragrances & Body Care',
    shortDescription: 'Artisan perfumes, body butters, shimmering oils and scented mist.',
    group: 'Beauty & Personal Care Products',
    type: 'PRODUCT',
    icon: 'water_drop',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
    isActive: true,
    itemCountText: '85+ Scents',
    keywords: ['perfume', 'fragrance', 'body butter', 'body wash', 'lotion', 'scent', 'cologne']
  },
  {
    id: 'beauty-tools-equipment',
    name: 'Beauty Tools & Equipment',
    shortDescription: 'Styling irons, hair dryers, UV nail lamps, lash tweezers and makeup brushes.',
    group: 'Beauty & Personal Care Products',
    type: 'PRODUCT',
    icon: 'construction',
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=600&q=80',
    isActive: true,
    itemCountText: '60+ Tools',
    keywords: ['brushes', 'hair dryer', 'straightener', 'uv lamp', 'tweezers', 'sponges', 'mirror']
  },

  // ================= GROUP D: Fashion & Accessories (PRODUCTS) =================
  {
    id: 'activewear-gym-wear',
    name: 'Activewear & Gym Wear',
    shortDescription: 'Sculpt leggings, sports bras, seamless sets and luxury athleisure.',
    group: 'Fashion & Accessories',
    type: 'PRODUCT',
    icon: 'fitness_center',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    isActive: true,
    itemCountText: '70+ Styles',
    keywords: ['leggings', 'sports bra', 'gym wear', 'athleisure', 'activewear', 'workout']
  },
  {
    id: 'fashion-accessories',
    name: 'Fashion Accessories',
    shortDescription: 'Earrings, necklaces, designer handbags, sunglasses and silk hair scarves.',
    group: 'Fashion & Accessories',
    type: 'PRODUCT',
    icon: 'diamond',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    isActive: true,
    itemCountText: '110+ Pieces',
    keywords: ['handbag', 'earrings', 'jewelry', 'scarf', 'sunglasses', 'accessories', 'gold']
  },
  {
    id: 'shoes-footwear',
    name: 'Shoes & Footwear',
    shortDescription: 'Statement heels, sandals, designer mules and chic casual sneakers.',
    group: 'Fashion & Accessories',
    type: 'PRODUCT',
    icon: 'roller_skating',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
    isActive: true,
    itemCountText: '50+ Styles',
    keywords: ['shoes', 'heels', 'sandals', 'sneakers', 'boots', 'footwear', 'mules']
  },
  {
    id: 'clothing-fashion',
    name: 'Clothing & Fashion',
    shortDescription: 'Cocktail dresses, matching co-ord sets, tailored blazers and lounge robes.',
    group: 'Fashion & Accessories',
    type: 'PRODUCT',
    icon: 'checkroom',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
    isActive: true,
    itemCountText: '90+ Outfits',
    keywords: ['dress', 'blazer', 'co-ord', 'jumpsuit', 'clothing', 'fashion', 'robe']
  },
  {
    id: 'shapewear-lingerie',
    name: 'Shapewear & Lingerie',
    shortDescription: 'Seamless body shapers, waist sculptors, lace bralettes and satin sleepwear.',
    group: 'Fashion & Accessories',
    type: 'PRODUCT',
    icon: 'accessibility_new',
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80',
    isActive: true,
    itemCountText: '45+ Pieces',
    keywords: ['shapewear', 'lingerie', 'waist trainer', 'bralette', 'seamless', 'bodysuit']
  },

  // ================= OPTIONAL FUTURE CATEGORIES (INACTIVE) =================
  {
    id: 'tattoo-piercing',
    name: 'Tattoo & Piercing',
    shortDescription: 'Custom fine-line tattoos, ear curation and sterile body piercings.',
    group: 'Beauty Services',
    type: 'SERVICE',
    icon: 'draw',
    image: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=600&q=80',
    isActive: false,
    itemCountText: 'Coming Soon',
    keywords: ['tattoo', 'piercing'],
    isFutureOptional: true
  },
  {
    id: 'bridal-special-occasion',
    name: 'Bridal & Special Occasion',
    shortDescription: 'Bridal party packages, matric dance glams and milestone event preparation.',
    group: 'Beauty Services',
    type: 'SERVICE',
    icon: 'celebration',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    isActive: false,
    itemCountText: 'Coming Soon',
    keywords: ['bridal', 'wedding', 'event'],
    isFutureOptional: true
  },
  {
    id: 'teeth-whitening',
    name: 'Teeth Whitening & Smile Care',
    shortDescription: 'Laser teeth brightening, cosmetic smile gems and dental hygiene checks.',
    group: 'Beauty Services',
    type: 'SERVICE',
    icon: 'sentiment_very_satisfied',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
    isActive: false,
    itemCountText: 'Coming Soon',
    keywords: ['teeth', 'whitening', 'smile'],
    isFutureOptional: true
  }
];

export const ACTIVE_CATEGORIES = ALL_CATEGORIES.filter((c) => c.isActive && !c.isFutureOptional);
export const SERVICE_CATEGORIES = ACTIVE_CATEGORIES.filter((c) => c.type === 'SERVICE');
export const PRODUCT_CATEGORIES = ACTIVE_CATEGORIES.filter((c) => c.type === 'PRODUCT');

/**
 * Helper to lookup category by slug or id
 */
export function getCategoryById(id: string): StenzaCategory | undefined {
  if (!id) return undefined;
  const clean = id.toLowerCase().trim();
  return ALL_CATEGORIES.find((c) => c.id.toLowerCase() === clean);
}

/**
 * Backward-compatible mapper from legacy string values
 * e.g. 'Luxury Hair' -> 'hair-styling', 'Nail Couture' -> 'nails', 'Skincare and Facials' -> 'skincare-facials'
 */
export function mapLegacyCategoryToSlug(categoryString: string): string {
  if (!categoryString) return 'nails';
  const clean = categoryString.toLowerCase().trim();

  if (clean.includes('braid') || clean.includes('protective')) return 'braids-protective-styles';
  if (clean.includes('hair') && (clean.includes('style') || clean.includes('cut') || clean.includes('lux'))) return 'hair-styling';
  if (clean.includes('nail')) return 'nails';
  if (clean.includes('lash') || clean.includes('brow')) return 'lashes-brows';
  if (clean.includes('skin') && clean.includes('product')) return 'skincare-products';
  if (clean.includes('skin') || clean.includes('facial') || clean.includes('dermal')) return 'skincare-facials';
  if (clean.includes('makeup') && clean.includes('cosmetic')) return 'makeup-cosmetics';
  if (clean.includes('makeup') || clean.includes('glam') || clean.includes('mua')) return 'makeup-glam';
  if (clean.includes('wax') || clean.includes('removal')) return 'waxing-hair-removal';
  if (clean.includes('spa') || clean.includes('body') || clean.includes('massage') || clean.includes('wellness')) return 'spa-body-treatments';
  if (clean.includes('barber') || clean.includes('groom')) return 'hair-styling';

  const exact = ALL_CATEGORIES.find((c) => c.id === clean || c.name.toLowerCase() === clean);
  if (exact) return exact.id;

  return 'hair-styling';
}

/**
 * Get category display name from slug or fallback string
 */
export function getCategoryDisplayName(slugOrName: string): string {
  const cat = getCategoryById(slugOrName) || getCategoryById(mapLegacyCategoryToSlug(slugOrName));
  return cat ? cat.name : slugOrName;
}
