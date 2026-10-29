import React from 'react';
import { X, Sparkles, Star, MapPin, Car, ExternalLink, ShieldCheck, ChevronRight } from 'lucide-react';
import { AdminStudio } from '../../types/admin';

interface LandingPagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  featuredStudios: AdminStudio[];
  onOpenStorefront?: () => void;
}

export const LandingPagePreviewModal: React.FC<LandingPagePreviewModalProps> = ({
  isOpen,
  onClose,
  featuredStudios,
  onOpenStorefront
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-[#fcf9f4] rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-stone-300 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Admin Preview Header */}
        <div className="bg-[#1b0d21] text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                LIVE STOREFRONT PREVIEW
              </span>
              <h2 className="text-base font-serif font-bold text-white mt-0.5">
                Public Landing Page • Featured Beauty Shops Showcase
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onOpenStorefront && (
              <button
                onClick={onOpenStorefront}
                className="px-3 py-1.5 bg-[#b86b86] hover:bg-[#a25974] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Go to Live Homepage</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mock Landing Page Section */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-5">
            <div>
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#fbf0f4] border border-[#f0d0dc] text-[11px] font-semibold text-[#b86b86] mb-2">
                <Sparkles className="w-3 h-3 text-[#d4af37]" />
                <span>Hand-Selected & Verified Excellence</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#26152d]">
                Featured Beauty Shops in South Africa
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Currently displaying {featuredStudios.length} approved beauty shops selected by STENZA Administrators.
              </p>
            </div>

            <div className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
              Ordered by Admin Position (1 - {featuredStudios.length})
            </div>
          </div>

          {/* Grid */}
          {featuredStudios.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
              <Sparkles className="w-10 h-10 text-stone-300 mx-auto" />
              <h4 className="font-serif text-lg font-bold text-stone-700">No Featured Beauty Shops Selected</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Toggle "Feature on Landing Page" in the Landing Page Promotions manager to highlight verified beauty shops here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStudios.map((studio, idx) => (
                <div
                  key={studio.id}
                  className="bg-white rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between group relative"
                >
                  {/* Position badge */}
                  <div className="absolute top-3 left-3 z-10 bg-[#1b0d21]/90 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 border border-amber-500/30">
                    <Sparkles className="w-3 h-3 text-[#d4af37]" />
                    <span>Position #{idx + 1}</span>
                  </div>

                  <div>
                    {/* Image */}
                    <div className="relative aspect-16/9 bg-stone-900 overflow-hidden">
                      <img
                        src={studio.coverUrl}
                        alt={studio.businessName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {studio.offersHouseCalls && (
                        <span className="absolute top-3 right-3 bg-[#26152d]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <Car className="w-3 h-3 text-[#d4af37]" />
                          <span>House Calls</span>
                        </span>
                      )}

                      <div className="absolute bottom-3 right-3 bg-white/95 text-[#26152d] px-2.5 py-1 rounded-lg text-xs font-bold shadow-xs">
                        From R350
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h4 className="font-serif text-base font-bold text-[#26152d]">
                          {studio.businessName}
                        </h4>
                        <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span>{studio.suburb}, {studio.city}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-amber-900 font-bold border border-amber-200">
                          <Star className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
                          <span>{studio.rating}</span>
                        </div>
                        <span className="text-stone-500 text-[11px]">({studio.reviewCount} verified reviews)</span>
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-2">
                        {studio.category} • Top-ranked studio with 100% CIPC & sanitation accreditation.
                      </p>
                    </div>
                  </div>

                  {/* Actions preview */}
                  <div className="px-5 pb-5 pt-3 border-t border-stone-100 flex items-center gap-2">
                    <div className="flex-1 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold text-center bg-stone-50">
                      View Profile
                    </div>
                    <div className="flex-1 py-2 rounded-xl bg-[#b86b86] text-white text-xs font-bold text-center shadow-xs">
                      Book Service
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-100 px-6 py-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
          <span>STENZA Landing Page Promotion Engine (Rule: Approved & Active Only)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl font-bold cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
