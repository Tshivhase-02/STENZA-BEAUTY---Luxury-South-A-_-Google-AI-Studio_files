import React, { useState, useMemo, useEffect } from 'react';
import { PROVIDERS, Provider, CURATED_PRODUCTS, BeautyProduct } from '../data/beautyData';
import { adminService } from '../services/adminService';
import { categoryService } from '../services/categoryService';
import { 
  StenzaCategory, 
  CategoryGroup, 
  mapLegacyCategoryToSlug, 
  getCategoryDisplayName 
} from '../data/categoryData';
import { 
  Scissors, 
  ShoppingBag, 
  Search, 
  RotateCcw, 
  SlidersHorizontal, 
  Grid, 
  List, 
  Check, 
  Sparkles, 
  Star, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ShoppingBasket 
} from 'lucide-react';

interface DiscoverViewProps {
  onNavigate: (
    view: string, 
    providerId?: string, 
    authMode?: 'login' | 'register', 
    categoryId?: string, 
    type?: 'SERVICE' | 'PRODUCT'
  ) => void;
  onOpenBookingModal: (providerId?: string) => void;
  selectedCity: string;
  onOpenLocationModal: () => void;
  initialCategory?: string;
  initialTab?: 'services' | 'products';
  onAddToCart?: (product: BeautyProduct) => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  onNavigate,
  onOpenBookingModal,
  selectedCity,
  onOpenLocationModal,
  initialCategory,
  initialTab = 'services',
  onAddToCart
}) => {
  // Discovery Mode: 'services' (Studios/Artisans) or 'products' (Physical items/collections)
  const [activeTab, setActiveTab] = useState<'services' | 'products'>(initialTab);

  // Group Filter
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  // Service Category Selection (slug or 'all')
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string>(
    initialTab === 'services' && initialCategory ? initialCategory : 'all'
  );

  // Product Category Selection (slug or 'all')
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>(
    initialTab === 'products' && initialCategory ? initialCategory : 'all'
  );

  // Sync when initialCategory or initialTab changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
    if (initialCategory) {
      if (initialTab === 'products') {
        setSelectedProductCategory(initialCategory);
      } else {
        setSelectedServiceCategory(initialCategory);
      }
    }
  }, [initialCategory, initialTab]);

  // General Filter States
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedProviderType, setSelectedProviderType] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(activeTab === 'services' ? 2500 : 5000);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyMobile, setOnlyMobile] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'rating' | 'popular' | 'price-asc' | 'price-desc'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Active categories from service layer
  const serviceCategories = useMemo(() => categoryService.getServiceCategories(), []);
  const productCategories = useMemo(() => categoryService.getProductCategories(), []);

  // Filtered Providers (Book Services)
  const filteredProviders = useMemo(() => {
    return PROVIDERS.filter((pro) => {
      // Exclude suspended, disabled, or deleted studios from public search
      const adminRecord = adminService.getStudioById(pro.id);
      if (
        adminRecord &&
        (adminRecord.isDeleted ||
          adminRecord.operationalStatus === 'suspended' ||
          adminRecord.operationalStatus === 'disabled' ||
          adminRecord.approvalStatus === 'rejected')
      ) {
        return false;
      }

      // Group filter
      if (selectedGroup !== 'all') {
        const matchesGroup = pro.categories.some((c) => {
          const catObj = categoryService.resolveCategory(c);
          return catObj && catObj.group === selectedGroup;
        });
        if (!matchesGroup) return false;
      }

      // Service Category filter (supports slug and legacy text)
      if (selectedServiceCategory !== 'all') {
        const matchesCat =
          pro.categories.some((c) => {
            const slug = mapLegacyCategoryToSlug(c);
            return (
              slug === selectedServiceCategory ||
              c.toLowerCase().includes(selectedServiceCategory.toLowerCase())
            );
          }) ||
          pro.services.some(
            (s) =>
              mapLegacyCategoryToSlug(s.category) === selectedServiceCategory ||
              s.category.toLowerCase().includes(selectedServiceCategory.toLowerCase())
          );

        if (!matchesCat) return false;
      }

      // Provider type
      if (selectedProviderType !== 'All' && pro.providerType !== selectedProviderType) {
        return false;
      }

      // Mobile filter
      if (onlyMobile && !pro.offersMobile) {
        return false;
      }

      // Max price
      if (pro.startingPrice > maxPrice) {
        return false;
      }

      // Min rating
      if (pro.rating < minRating) {
        return false;
      }

      // Keyword
      if (searchKeyword.trim() !== '') {
        const q = searchKeyword.toLowerCase();
        const matchesName = pro.name.toLowerCase().includes(q);
        const matchesFounder = pro.founder.toLowerCase().includes(q);
        const matchesSuburb = pro.suburb.toLowerCase().includes(q);
        const matchesService = pro.services.some((s) => s.name.toLowerCase().includes(q));
        if (!matchesName && !matchesFounder && !matchesSuburb && !matchesService) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'popular') return b.completedBookings - a.completedBookings;
      if (sortBy === 'price-asc') return a.startingPrice - b.startingPrice;
      if (sortBy === 'price-desc') return b.startingPrice - a.startingPrice;
      return 0;
    });
  }, [
    selectedGroup,
    selectedServiceCategory,
    selectedProviderType,
    onlyMobile,
    maxPrice,
    minRating,
    sortBy,
    searchKeyword
  ]);

  // Filtered Products (Shop Products & Fashion)
  const filteredProducts = useMemo(() => {
    return CURATED_PRODUCTS.filter((prod) => {
      // Group filter
      if (selectedGroup !== 'all') {
        const catObj = categoryService.resolveCategory(prod.category);
        if (catObj && catObj.group !== selectedGroup) {
          return false;
        }
      }

      // Product category filter
      if (selectedProductCategory !== 'all') {
        const prodCatSlug = mapLegacyCategoryToSlug(prod.category);
        if (prodCatSlug !== selectedProductCategory) {
          return false;
        }
      }

      // Max price
      if (prod.price > maxPrice) {
        return false;
      }

      // Min rating
      if (prod.rating < minRating) {
        return false;
      }

      // Keyword search
      if (searchKeyword.trim() !== '') {
        const q = searchKeyword.toLowerCase();
        const matchName = prod.name.toLowerCase().includes(q);
        const matchBrand = prod.brand.toLowerCase().includes(q);
        const matchDesc = prod.description.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchDesc) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'popular') return b.reviewsCount - a.reviewsCount;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });
  }, [
    selectedGroup,
    selectedProductCategory,
    maxPrice,
    minRating,
    sortBy,
    searchKeyword
  ]);

  const resetFilters = () => {
    setSelectedGroup('all');
    setSelectedServiceCategory('all');
    setSelectedProductCategory('all');
    setSelectedProviderType('All');
    setMaxPrice(activeTab === 'services' ? 2500 : 5000);
    setMinRating(0);
    setOnlyMobile(false);
    setSearchKeyword('');
    setSortBy('rating');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Page Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#e5e0d8]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#7c535c] mb-1 font-medium">
            <button onClick={() => onNavigate('home')} className="hover:underline">Home</button>
            <span>/</span>
            <span>Marketplace</span>
            <span>/</span>
            <span className="text-[#26152d] font-semibold">
              {activeTab === 'services' ? 'Services Directory' : 'Products & Collections'}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#26152d]">
            {activeTab === 'services'
              ? 'Discover Verified Beauty Artisans & Studios'
              : 'Shop Curated Beauty, Wellness & Fashion'}
          </h1>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl">
            {activeTab === 'services'
              ? `Browse accredited beauty professionals in ${selectedCity} with live availability and transparent South African Rand rates.`
              : 'Authentic South African botanical apothecary, clinical formulas, raw wigs, and local designer fashion drops.'}
          </p>
        </div>

        {/* Change City Button (primarily for services) */}
        {activeTab === 'services' && (
          <button
            onClick={onOpenLocationModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#d8d3ca] hover:border-[#695684] text-xs font-semibold text-[#26152d] shadow-2xs transition-colors self-start md:self-auto cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#695684]">location_on</span>
            <span>{selectedCity}</span>
            <span className="text-stone-400 text-[11px] underline">Change</span>
          </button>
        )}
      </div>

      {/* Main Switcher: Services (Book Online) vs Products (Shop Now) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-2.5 rounded-2xl border border-[#e5e0d8] shadow-2xs">
        <div className="flex items-center bg-[#f6f3ee] p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => {
              setActiveTab('services');
              setSelectedGroup('all');
              setMaxPrice(2500);
            }}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'services'
                ? 'bg-[#26152d] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Scissors className="w-4 h-4 text-emerald-300" />
            <span>Book Services ({PROVIDERS.length} Studios)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('products');
              setSelectedGroup('all');
              setMaxPrice(5000);
            }}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#695684] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-pink-200" />
            <span>Shop Products ({CURATED_PRODUCTS.length} Items)</span>
          </button>
        </div>

        {/* Group Quick Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedGroup('all')}
            className={`px-3 py-1.5 rounded-lg border text-xs whitespace-nowrap transition cursor-pointer ${
              selectedGroup === 'all'
                ? 'bg-stone-900 text-white border-stone-900 font-semibold'
                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            All Groups
          </button>
          {(activeTab === 'services'
            ? ['Hair & Styling', 'Beauty Services']
            : ['Beauty & Personal Care Products', 'Fashion & Accessories']
          ).map((grp) => (
            <button
              key={grp}
              onClick={() => setSelectedGroup(grp)}
              className={`px-3 py-1.5 rounded-lg border text-xs whitespace-nowrap transition cursor-pointer ${
                selectedGroup === grp
                  ? 'bg-[#695684] text-white border-[#695684] font-semibold shadow-2xs'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              {grp}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-[#e5e0d8] shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ede6]">
              <span className="font-serif font-bold text-sm text-[#26152d] flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-[#695684]" />
                <span>Filter {activeTab === 'services' ? 'Services' : 'Products'}</span>
              </span>
              <button
                onClick={resetFilters}
                className="text-[11px] text-[#695684] hover:underline font-medium flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-semibold text-[#26152d] mb-1.5">
                {activeTab === 'services' ? 'Keyword, Specialist or Suburb' : 'Search Products or Brands'}
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder={activeTab === 'services' ? 'e.g. Silk press, BIAB, Sandton...' : 'e.g. Marula, lace wig, leggings...'}
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#f6f3ee] border border-transparent focus:border-[#695684] rounded-xl outline-none"
                />
              </div>
            </div>

            {/* Category selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-[#26152d]">
                  {activeTab === 'services' ? 'Service Category' : 'Product Category'}
                </label>
                {(activeTab === 'services' ? selectedServiceCategory : selectedProductCategory) !== 'all' && (
                  <button
                    onClick={() =>
                      activeTab === 'services'
                        ? setSelectedServiceCategory('all')
                        : setSelectedProductCategory('all')
                    }
                    className="text-[10px] text-[#695684] hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                <button
                  onClick={() =>
                    activeTab === 'services'
                      ? setSelectedServiceCategory('all')
                      : setSelectedProductCategory('all')
                  }
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                    (activeTab === 'services' ? selectedServiceCategory : selectedProductCategory) === 'all'
                      ? 'bg-[#26152d] text-white shadow-2xs font-bold'
                      : 'text-stone-600 hover:bg-[#f6f3ee]'
                  }`}
                >
                  <span>All Categories</span>
                  {(activeTab === 'services' ? selectedServiceCategory : selectedProductCategory) === 'all' && (
                    <Check className="w-3.5 h-3.5" />
                  )}
                </button>

                {(activeTab === 'services' ? serviceCategories : productCategories)
                  .filter((cat) => selectedGroup === 'all' || cat.group === selectedGroup)
                  .map((cat) => {
                    const isSelected =
                      (activeTab === 'services' ? selectedServiceCategory : selectedProductCategory) === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() =>
                          activeTab === 'services'
                            ? setSelectedServiceCategory(cat.id)
                            : setSelectedProductCategory(cat.id)
                        }
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#695684] text-white shadow-2xs font-bold'
                            : 'text-stone-600 hover:bg-[#f6f3ee]'
                        }`}
                      >
                        <span className="truncate mr-2">{cat.name}</span>
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 flex-shrink-0" />
                        ) : (
                          <span className="text-[10px] text-stone-400 font-normal">
                            {cat.itemCountText.split('+')[0]}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Maximum Starting Price Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-[#26152d] mb-1.5">
                <span>{activeTab === 'services' ? 'Max Starting Price' : 'Max Item Price'}</span>
                <span className="text-[#695684] font-bold">R{maxPrice}</span>
              </div>
              <input
                type="range"
                min={activeTab === 'services' ? 200 : 150}
                max={activeTab === 'services' ? 2500 : 5000}
                step={activeTab === 'services' ? 50 : 100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#695684] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>R{activeTab === 'services' ? '200' : '150'}</span>
                <span>R{activeTab === 'services' ? '2,500+' : '5,000+'}</span>
              </div>
            </div>

            {/* Service-specific filter: Mobile setup */}
            {activeTab === 'services' && (
              <div>
                <label className="block text-xs font-semibold text-[#26152d] mb-2">
                  Service Setup
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyMobile}
                      onChange={(e) => setOnlyMobile(e.target.checked)}
                      className="accent-[#695684] rounded"
                    />
                    <span>Mobile / House Call Available</span>
                  </label>

                  <div className="pt-2">
                    <span className="text-[11px] text-stone-500 block mb-1">Venue Type</span>
                    <select
                      value={selectedProviderType}
                      onChange={(e) => setSelectedProviderType(e.target.value)}
                      className="w-full p-2 bg-[#f6f3ee] border border-[#d8d3ca] rounded-lg text-xs font-medium text-[#26152d] outline-none"
                    >
                      <option value="All">All Venue Setups</option>
                      <option value="Salon">Luxury Salon Suite</option>
                      <option value="Independent">Independent Studio</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Minimum Rating */}
            <div>
              <label className="block text-xs font-semibold text-[#26152d] mb-2">
                Client Rating
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[
                  { label: 'Any', value: 0 },
                  { label: '★ 4.8+', value: 4.8 },
                  { label: '★ 4.9+', value: 4.9 },
                ].map((r) => (
                  <button
                    key={r.label}
                    onClick={() => setMinRating(r.value)}
                    className={`py-1.5 px-2 rounded-lg border text-center font-medium transition-all cursor-pointer ${
                      minRating === r.value
                        ? 'border-[#695684] bg-[#695684] text-white shadow-2xs'
                        : 'border-[#e5e0d8] bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#e5e0d8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="text-xs font-medium text-stone-600">
              Showing{' '}
              <strong className="text-[#26152d] font-bold">
                {activeTab === 'services' ? filteredProviders.length : filteredProducts.length}
              </strong>{' '}
              {activeTab === 'services' ? 'verified studios' : 'curated products'}
              {activeTab === 'services' && selectedServiceCategory !== 'all' && (
                <span>
                  {' '}in <strong>{getCategoryDisplayName(selectedServiceCategory)}</strong>
                </span>
              )}
              {activeTab === 'products' && selectedProductCategory !== 'all' && (
                <span>
                  {' '}in <strong>{getCategoryDisplayName(selectedProductCategory)}</strong>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Sort by dropdown */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-stone-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="p-1.5 bg-[#f6f3ee] border border-[#d8d3ca] rounded-lg font-medium text-[#26152d] outline-none"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Most Booked / Reviewed</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

              {/* View mode toggle (services only) */}
              {activeTab === 'services' && (
                <div className="flex items-center bg-[#f6f3ee] p-0.5 rounded-lg border border-[#e5e0d8]">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                      viewMode === 'grid' ? 'bg-white shadow-2xs text-[#26152d]' : 'text-stone-500'
                    }`}
                    title="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                      viewMode === 'list' ? 'bg-white shadow-2xs text-[#26152d]' : 'text-stone-500'
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ================= TAB 1: SERVICES VIEW ================= */}
          {activeTab === 'services' && (
            <>
              {filteredProviders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#e5e0d8] p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                    <span className="material-symbols-outlined text-[32px]">search_off</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#26152d]">
                    No verified studios match these criteria
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Try clearing your category filter or adjusting your starting price to view more available artisans.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#26152d] text-white text-xs font-semibold hover:bg-[#3d2348] transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProviders.map((pro) => (
                    <div
                      key={pro.id}
                      className="bg-white rounded-3xl border border-[#e5e0d8] overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col group"
                    >
                      {/* Studio Cover & Badges */}
                      <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                        <img
                          src={pro.coverImage}
                          alt={pro.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="text-[10px] font-bold bg-[#1b0d21]/80 backdrop-blur-md text-white px-2 py-0.5 rounded-full">
                            {pro.badge}
                          </span>
                          {pro.offersMobile && (
                            <span className="text-[10px] font-bold bg-emerald-700/90 backdrop-blur-md text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">directions_car</span>
                              Mobile House Call
                            </span>
                          )}
                        </div>

                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-[#26152d] flex items-center gap-1 shadow-2xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span>{pro.rating}</span>
                          <span className="text-stone-400 text-[10px]">({pro.reviewCount})</span>
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-[16px] text-[#695684]">location_on</span>
                            <span className="text-xs text-stone-500">{pro.suburb}, {pro.city}</span>
                          </div>

                          <h3
                            onClick={() => onNavigate('profile', pro.id)}
                            className="font-serif text-xl font-bold text-[#26152d] hover:text-[#695684] cursor-pointer transition-colors"
                          >
                            {pro.name}
                          </h3>

                          <p className="text-xs text-stone-600 line-clamp-2 mt-1">
                            {pro.headline}
                          </p>

                          {/* Categories Pills */}
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {pro.categories.map((c) => (
                              <span
                                key={c}
                                className="text-[10px] font-semibold bg-[#f6f3ee] text-[#26152d] px-2 py-0.5 rounded-md"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Footer: Price & Buttons */}
                        <div className="pt-3 border-t border-[#f0ede6] flex items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-stone-400 block">Starting from</span>
                            <span className="font-serif text-lg font-bold text-[#695684]">
                              R{pro.startingPrice}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onNavigate('profile', pro.id)}
                              className="py-2 px-3.5 rounded-xl border border-[#d8d3ca] hover:border-[#695684] text-xs font-semibold text-[#26152d] transition cursor-pointer"
                            >
                              Studio
                            </button>
                            <button
                              onClick={() => onOpenBookingModal(pro.id)}
                              className="py-2 px-4 rounded-xl bg-[#26152d] hover:bg-[#3d2348] text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                              <span>Book</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="space-y-4">
                  {filteredProviders.map((pro) => (
                    <div
                      key={pro.id}
                      className="bg-white rounded-2xl border border-[#e5e0d8] p-5 shadow-2xs hover:shadow-lg transition-all flex flex-col sm:flex-row gap-5 items-center group"
                    >
                      <img
                        src={pro.avatar}
                        alt={pro.name}
                        className="w-24 h-24 rounded-2xl object-cover border border-[#e5e0d8] flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                          <h3
                            onClick={() => onNavigate('profile', pro.id)}
                            className="font-serif text-lg font-bold text-[#26152d] cursor-pointer hover:text-[#695684]"
                          >
                            {pro.name}
                          </h3>
                          <span className="text-[10px] font-bold bg-[#f6d9fb]/60 text-[#39263f] px-2 py-0.5 rounded">
                            {pro.badge}
                          </span>
                        </div>

                        <p className="text-xs text-stone-500">{pro.founder} • {pro.suburb}, {pro.city}</p>
                        <p className="text-xs text-stone-600 line-clamp-1 mt-1">{pro.headline}</p>

                        <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-xs">
                          <span className="font-bold text-amber-600">★ {pro.rating} ({pro.reviewCount} reviews)</span>
                          <span>•</span>
                          <span className="text-stone-500">From <strong className="text-[#695684]">R{pro.startingPrice}</strong></span>
                          {pro.offersMobile && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-700 font-medium">Mobile available</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => onNavigate('profile', pro.id)}
                          className="py-2.5 px-4 rounded-xl border border-[#d8d3ca] hover:border-[#695684] text-xs font-semibold text-[#26152d] transition-colors cursor-pointer"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => onOpenBookingModal(pro.id)}
                          className="py-2.5 px-4 rounded-xl bg-[#26152d] hover:bg-[#3d2348] text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                          Book
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ================= TAB 2: PRODUCTS VIEW ================= */}
          {activeTab === 'products' && (
            <>
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#e5e0d8] p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#26152d]">
                    No marketplace products match these filters
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Try adjusting your price range or exploring another product collection.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#695684] text-white text-xs font-semibold hover:bg-[#584572] transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Product Filters</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((prod) => {
                    const catObj = categoryService.resolveCategory(prod.category);
                    return (
                      <div
                        key={prod.id}
                        className="bg-white rounded-3xl border border-[#e5e0d8] overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group"
                      >
                        {/* Product Image & Badges */}
                        <div className="relative aspect-square overflow-hidden bg-stone-100">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 flex flex-col gap-1">
                            {prod.badge && (
                              <span className="text-[10px] font-bold bg-[#695684] text-white px-2 py-0.5 rounded-full shadow-2xs">
                                {prod.badge}
                              </span>
                            )}
                            <span className="text-[9px] font-bold bg-white/90 backdrop-blur-md text-stone-800 px-2 py-0.5 rounded-full">
                              {catObj ? catObj.name : 'Curated'}
                            </span>
                          </div>

                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] font-bold text-[#26152d] flex items-center gap-1 shadow-2xs">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                            <span>{prod.rating}</span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                              {prod.brand}
                            </span>
                            <h3 className="font-serif text-base font-bold text-[#26152d] mt-0.5 line-clamp-1 group-hover:text-[#695684] transition-colors">
                              {prod.name}
                            </h3>
                            <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
                              {prod.description}
                            </p>
                          </div>

                          {/* Price & Add to Bag */}
                          <div className="pt-3 border-t border-[#f0ede6] flex items-center justify-between gap-3">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-stone-400 block">Price</span>
                              <span className="font-serif text-lg font-bold text-[#26152d]">
                                R{prod.price}
                              </span>
                            </div>

                            <button
                              onClick={() => onAddToCart && onAddToCart(prod)}
                              className="py-2 px-3.5 rounded-xl bg-[#695684] hover:bg-[#584572] text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <ShoppingBasket className="w-4 h-4" />
                              <span>Add to Bag</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
