/**
 * STENZA BEAUTY - Category Service Layer
 * 
 * Manages category state, active/inactive overrides, search, filtering,
 * and data mapping. Prepared for future Java Spring Boot REST API integration.
 * 
 * Proposed Backend REST Contracts:
 * - GET    /api/public/categories           (Retrieve all active categories grouped)
 * - GET    /api/public/categories/{slug}    (Retrieve single category details & metadata)
 * - GET    /api/public/studios?category={slug} (Filter studios by service category slug)
 * - GET    /api/public/products?category={slug} (Filter marketplace products by product category slug)
 * - GET    /api/admin/categories            (Admin: Retrieve all categories including inactive/draft)
 * - PATCH  /api/admin/categories/{id}/status (Admin: Toggle category activation status)
 */

import { 
  StenzaCategory, 
  CategoryGroup, 
  CategoryType, 
  ALL_CATEGORIES, 
  CATEGORY_GROUPS_META,
  mapLegacyCategoryToSlug,
  getCategoryDisplayName
} from '../data/categoryData';

const STORAGE_KEY = 'stenza_categories_v1';

class CategoryService {
  private categories: StenzaCategory[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge stored flags (like isActive) with current definitions to ensure new categories are picked up
          const storedMap = new Map(parsed.map((c: StenzaCategory) => [c.id, c]));
          this.categories = ALL_CATEGORIES.map((base) => {
            const found = storedMap.get(base.id);
            if (found) {
              return {
                ...base,
                isActive: typeof found.isActive === 'boolean' ? found.isActive : base.isActive
              };
            }
            return { ...base };
          });
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to parse categories from localStorage, using defaults', e);
    }
    // Default initial
    this.categories = [...ALL_CATEGORIES];
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.categories));
    } catch (e) {
      console.warn('Failed to save categories to localStorage', e);
    }
  }

  /**
   * Get all categories (including inactive/optional ones for admin view)
   */
  public getAllCategories(): StenzaCategory[] {
    return [...this.categories];
  }

  /**
   * Get all active categories (for public consumer views)
   */
  public getActiveCategories(): StenzaCategory[] {
    return this.categories.filter((c) => c.isActive && !c.isFutureOptional);
  }

  /**
   * Get service categories (for booking and studio registrations)
   */
  public getServiceCategories(includeInactive = false): StenzaCategory[] {
    return this.categories.filter((c) => 
      c.type === 'SERVICE' && (includeInactive ? true : (c.isActive && !c.isFutureOptional))
    );
  }

  /**
   * Get product categories (for shopping apothecary & fashion drops)
   */
  public getProductCategories(includeInactive = false): StenzaCategory[] {
    return this.categories.filter((c) => 
      c.type === 'PRODUCT' && (includeInactive ? true : (c.isActive && !c.isFutureOptional))
    );
  }

  /**
   * Get categories filtered by parent group
   */
  public getCategoriesByGroup(group: CategoryGroup, includeInactive = false): StenzaCategory[] {
    return this.categories.filter((c) => 
      c.group === group && (includeInactive ? true : (c.isActive && !c.isFutureOptional))
    );
  }

  /**
   * Get category by slug or ID
   */
  public getCategoryById(id: string): StenzaCategory | undefined {
    if (!id) return undefined;
    const clean = id.toLowerCase().trim();
    return this.categories.find((c) => c.id.toLowerCase() === clean);
  }

  /**
   * Map legacy string or slug to clean category object
   */
  public resolveCategory(slugOrName: string): StenzaCategory | undefined {
    const slug = mapLegacyCategoryToSlug(slugOrName);
    return this.getCategoryById(slug) || this.categories.find((c) => c.name.toLowerCase() === slugOrName.toLowerCase());
  }

  /**
   * Toggle category active/inactive status (Admin Portal)
   */
  public toggleCategoryActive(id: string, isActive: boolean): boolean {
    const idx = this.categories.findIndex((c) => c.id === id);
    if (idx === -1) return false;

    this.categories[idx] = {
      ...this.categories[idx],
      isActive
    };
    this.persist();
    return true;
  }

  /**
   * Reset categories to factory defaults
   */
  public resetToDefaults(): void {
    this.categories = [...ALL_CATEGORIES];
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  /**
   * Get category groups metadata
   */
  public getGroupsMeta() {
    return CATEGORY_GROUPS_META;
  }

  /**
   * Compute live studio & product counts for each category
   */
  public getCategoryMetrics(studios: { category: string }[], products: { category: string }[]) {
    const studioCounts: Record<string, number> = {};
    const productCounts: Record<string, number> = {};

    studios.forEach((s) => {
      const slug = mapLegacyCategoryToSlug(s.category);
      studioCounts[slug] = (studioCounts[slug] || 0) + 1;
    });

    products.forEach((p) => {
      const slug = mapLegacyCategoryToSlug(p.category);
      productCounts[slug] = (productCounts[slug] || 0) + 1;
    });

    return { studioCounts, productCounts };
  }
}

export const categoryService = new CategoryService();
