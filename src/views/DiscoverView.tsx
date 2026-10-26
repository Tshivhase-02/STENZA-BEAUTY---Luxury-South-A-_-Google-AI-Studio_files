import React, { useState, useMemo } from 'react';
import { PROVIDERS, Provider, CATEGORIES } from '../data/beautyData';

interface DiscoverViewProps {
  onNavigate: (view: string, providerId?: string) => void;
  onOpenBookingModal: (providerId?: string) => void;
  selectedCity: string;
  onOpenLocationModal: () => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  onNavigate,
  onOpenBookingModal,
  selectedCity,
  onOpenLocationModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProviderType, setSelectedProviderType] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(2500);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyMobile, setOnlyMobile] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'rating' | 'popular' | 'price-asc' | 'price-desc'>('rating');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProviders = useMemo(() => {
    return PROVIDERS.filter((pro) => {
      // Category filter
      if (selectedCategory !== 'All') {
        const matchesCat = pro.categories.some((c) =>
          c.toLowerCase().includes(selectedCategory.toLowerCase())
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
  }, [selectedCategory, selectedProviderType, onlyMobile, maxPrice, minRating, sortBy, searchKeyword]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedProviderType('All');
    setMaxPrice(2500);
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
            <span>Directory</span>
            <span>/</span>
            <span className="text-[#26152d] font-semibold">{selectedCity}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#26152d]">
            Discover Verified Artisans & Studios
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Browse verified beauty professionals in {selectedCity} with live availability and transparent ZAR rates.
          </p>
        </div>

        {/* Change City Button */}
        <button
          onClick={onOpenLocationModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#d8d3ca] hover:border-[#695684] text-xs font-semibold text-[#26152d] shadow-2xs transition-colors self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-[18px] text-[#695684]">location_on</span>
          <span>{selectedCity}</span>
          <span className="text-gray-400 text-[11px] underline">Change</span>
        </button>
      </div>

      {/* Main Grid: Sidebar Filters + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-[#e5e0d8] shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ede6]">
              <span className="font-serif font-bold text-sm text-[#26152d]">Filter Directory</span>
              <button
                onClick={resetFilters}
                className="text-[11px] text-[#695684] hover:underline font-medium"
              >
                Reset All
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-semibold text-[#26152d] mb-1.5">
                Keyword or Service
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="e.g. Russian, BIAB, Silk..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#f6f3ee] border border-transparent focus:border-[#695684] rounded-xl outline-none"
                />
              </div>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-semibold text-[#26152d] mb-2">
                Treatment Category
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {['All', 'Nails', 'Hair', 'Clinical Skincare', 'Spa & Wellness', 'Lashes & Brows', 'Gentlemen Grooming'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      selectedCategory === cat
                        ? 'bg-[#695684] text-white shadow-2xs'
                        : 'text-gray-600 hover:bg-[#f6f3ee]'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && (
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Maximum Starting Price Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-[#26152d] mb-1.5">
                <span>Max Starting Price</span>
                <span className="text-[#695684] font-bold">R{maxPrice}</span>
              </div>
              <input
                type="range"
                min="200"
                max="2500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#695684] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>R200</span>
                <span>R2,500+</span>
              </div>
            </div>

            {/* Venue & Mobile Setup */}
            <div>
              <label className="block text-xs font-semibold text-[#26152d] mb-2">
                Service Setup
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyMobile}
                    onChange={(e) => setOnlyMobile(e.target.checked)}
                    className="accent-[#695684] rounded"
                  />
                  <span>Mobile / House Call Available</span>
                </label>

                <div className="pt-2">
                  <span className="text-[11px] text-gray-500 block mb-1">Venue Type</span>
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
                    className={`py-1.5 px-2 rounded-lg border text-center font-medium transition-all ${
                      minRating === r.value
                        ? 'border-[#695684] bg-[#695684] text-white shadow-2xs'
                        : 'border-[#e5e0d8] bg-white text-gray-700 hover:border-gray-400'
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
            <div className="text-xs font-medium text-gray-600">
              Showing <strong className="text-[#26152d] font-bold">{filteredProviders.length}</strong> verified artisans
              {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
            </div>

            <div className="flex items-center gap-3">
              {/* Sort by dropdown */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-gray-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#f6f3ee] border border-[#d8d3ca] rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#26152d] outline-none"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Most Booked</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center border border-[#e5e0d8] rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 ${viewMode === 'grid' ? 'bg-[#695684] text-white' : 'bg-white text-gray-500 hover:text-black'}`}
                  title="Grid View"
                >
                  <span className="material-symbols-outlined text-[16px]">grid_view</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 ${viewMode === 'list' ? 'bg-[#695684] text-white' : 'bg-white text-gray-500 hover:text-black'}`}
                  title="List View"
                >
                  <span className="material-symbols-outlined text-[16px]">view_list</span>
                </button>
              </div>
            </div>
          </div>

          {/* Providers List / Grid */}
          {filteredProviders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#e5e0d8] space-y-4">
              <span className="material-symbols-outlined text-gray-300 text-[48px]">
                search_off
              </span>
              <h3 className="font-serif text-lg font-bold text-[#26152d]">
                No artisans match your criteria
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try widening your price range, toggling off filters, or searching for other suburbs.
              </p>
              <button
                onClick={resetFilters}
                className="py-2.5 px-5 rounded-xl bg-[#695684] text-white text-xs font-semibold hover:bg-[#584572] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProviders.map((pro) => (
                <div
                  key={pro.id}
                  className="bg-white rounded-2xl border border-[#e5e0d8] overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Image header */}
                  <div className="relative h-48 overflow-hidden bg-stone-200">
                    <img
                      src={pro.coverImage}
                      alt={pro.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-bold text-[#695684] shadow-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px] text-emerald-500">verified</span>
                      <span>{pro.badge}</span>
                    </div>

                    {pro.offersMobile && (
                      <div className="absolute top-3 right-3 bg-[#26152d]/90 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">directions_car</span>
                        <span>Mobile</span>
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg bg-black/60 text-white backdrop-blur-xs text-[11px] font-medium">
                        {pro.suburb}, {pro.city}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div 
                          onClick={() => onNavigate('profile', pro.id)}
                          className="cursor-pointer"
                        >
                          <h3 className="font-serif text-lg font-bold text-[#26152d] group-hover:text-[#695684] transition-colors">
                            {pro.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">{pro.founder} • {pro.founderTitle}</p>
                        </div>

                        <div className="flex items-center gap-1 bg-[#fcf9f4] px-2 py-1 rounded-lg border border-[#e5e0d8] text-xs font-bold text-amber-600">
                          <span>★ {pro.rating}</span>
                          <span className="text-gray-400 text-[10px] font-normal">({pro.reviewCount})</span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-2 mt-2 leading-relaxed">
                        {pro.headline}
                      </p>

                      {/* Services preview */}
                      <div className="mt-3 pt-3 border-t border-[#f0ede6] space-y-1">
                        {pro.services.slice(0, 2).map((srv) => (
                          <div key={srv.id} className="flex justify-between text-[11px] text-gray-700">
                            <span className="truncate pr-2">• {srv.name}</span>
                            <span className="font-semibold text-[#695684]">R{srv.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-[#f0ede6] flex items-center justify-between gap-2">
                      <button
                        onClick={() => onNavigate('profile', pro.id)}
                        className="flex-1 py-2 px-3 rounded-xl border border-[#d8d3ca] hover:border-[#695684] text-xs font-semibold text-[#26152d] transition-colors text-center"
                      >
                        View Studio
                      </button>

                      <button
                        onClick={() => onOpenBookingModal(pro.id)}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#695684] hover:bg-[#584572] text-white text-xs font-semibold shadow-xs transition-colors text-center flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                        Book Now
                      </button>
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

                    <p className="text-xs text-gray-500">{pro.founder} • {pro.suburb}, {pro.city}</p>
                    <p className="text-xs text-gray-600 line-clamp-1 mt-1">{pro.headline}</p>

                    <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-xs">
                      <span className="font-bold text-amber-600">★ {pro.rating} ({pro.reviewCount} reviews)</span>
                      <span>•</span>
                      <span className="text-gray-500">From <strong className="text-[#695684]">R{pro.startingPrice}</strong></span>
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
                      className="py-2.5 px-4 rounded-xl border border-[#d8d3ca] hover:border-[#695684] text-xs font-semibold text-[#26152d] transition-colors"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => onOpenBookingModal(pro.id)}
                      className="py-2.5 px-4 rounded-xl bg-[#695684] hover:bg-[#584572] text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                      Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
