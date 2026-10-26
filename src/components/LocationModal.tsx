import React, { useState } from 'react';
import { CITIES_DATA, ALL_PROVINCES } from '../data/beautyData';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [detecting, setDetecting] = useState(false);

  if (!isOpen) return null;

  const handleDetect = () => {
    setDetecting(true);
    setTimeout(() => {
      setDetecting(false);
      onSelectCity('Rosebank, Johannesburg');
      onClose();
    }, 800);
  };

  const filteredProvinces = ALL_PROVINCES.map((prov) => {
    const matchedCities = prov.cities.filter((c) =>
      c.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prov.province.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...prov, cities: matchedCities };
  }).filter((prov) => prov.cities.length > 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-[#fcf9f4] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#e5e0d8] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e5e0d8]">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#26152d]">
              Choose Your Location
            </h3>
            <p className="text-xs text-[#7c535c] mt-0.5">
              Discover top-rated beauty studios and mobile artisans across South Africa
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#ebe8e3] text-[#39263f] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Search & GPS detection */}
        <div className="mt-5 space-y-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search suburb (e.g. Sandton, Camps Bay, Umhlanga)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#ffffff] border border-[#d8d3ca] text-xs text-[#26152d] placeholder-gray-400 focus:outline-none focus:border-[#695684] focus:ring-1 focus:ring-[#695684]"
            />
          </div>

          <button
            onClick={handleDetect}
            disabled={detecting}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#f6f3ee] hover:bg-[#ebe8e3] border border-[#e5e0d8] text-xs font-semibold text-[#695684] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              {detecting ? 'sync' : 'my_location'}
            </span>
            <span>{detecting ? 'Detecting via South African GPS...' : 'Detect My Current Location (Johannesburg)'}</span>
          </button>
        </div>

        {/* Popular Metro Hubs */}
        <div className="mt-6">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Popular Mzansi Hubs
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              'Rosebank, Johannesburg',
              'Sandton, Johannesburg',
              'Camps Bay, Cape Town',
              'V&A Waterfront, Cape Town',
              'Umhlanga, Durban',
              'Menlyn, Pretoria'
            ].map((hub) => (
              <button
                key={hub}
                onClick={() => {
                  onSelectCity(hub);
                  onClose();
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCity === hub
                    ? 'bg-[#695684] text-white shadow-xs'
                    : 'bg-[#ffffff] text-[#39263f] border border-[#e5e0d8] hover:border-[#695684]'
                }`}
              >
                {hub}
              </button>
            ))}
          </div>
        </div>

        {/* Regional Province Groups */}
        <div className="mt-6 max-h-64 overflow-y-auto pr-1 space-y-4">
          {filteredProvinces.map((prov) => (
            <div key={prov.province} className="p-3 bg-[#ffffff] rounded-xl border border-[#ebe8e3]">
              <div className="text-xs font-bold text-[#26152d] flex items-center gap-1.5 mb-2">
                <span className="material-symbols-outlined text-[16px] text-[#695684]">map</span>
                {prov.province}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {prov.cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      onSelectCity(city);
                      onClose();
                    }}
                    className="text-left px-2.5 py-1.5 text-xs text-[#39263f] hover:text-[#695684] hover:bg-[#f6f3ee] rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span className="truncate">{city}</span>
                    <span className="material-symbols-outlined text-[14px] text-gray-400">chevron_right</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-3 border-t border-[#e5e0d8] flex items-center justify-between text-[11px] text-gray-500">
          <span>Active in 9 provinces across South Africa</span>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-[#695684] hover:underline"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
