import React, { useState } from 'react';
import { Booking } from '../data/beautyData';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, providerId?: string, authMode?: 'login' | 'register') => void;
  selectedCity: string;
  onOpenLocationModal: () => void;
  onOpenBookingModal: () => void;
  onOpenCart: () => void;
  cartCount: number;
  bookings: Booking[];
  isLoggedIn: boolean;
  onLogout?: () => void;
  loyaltyPoints?: number;
  onOpenLoyaltyModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  selectedCity,
  onOpenLocationModal,
  onOpenBookingModal,
  onOpenCart,
  cartCount,
  bookings,
  isLoggedIn,
  onLogout,
  loyaltyPoints = 215,
  onOpenLoyaltyModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pendingCount = bookings.filter((b) => b.status === 'pending' || b.status === 'upcoming').length;

  return (
    <header className="sticky top-0 z-40 bg-[#ffffff]/95 backdrop-blur-md border-b border-[#e5e0d8] transition-all">
      {/* Top micro-announcement bar with blush-pink, black and gold accents */}
      <div className="bg-[#26152d] text-[#fcf9f4] text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-[#d4af37] animate-pulse"></span>
            <span className="tracking-wide text-[11px] sm:text-xs">
             South Africa’s Beauty & Wellness Marketplace
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[11px] text-[#d4cfc8]">
            {isLoggedIn && onOpenLoyaltyModal ? (
              <button
                onClick={onOpenLoyaltyModal}
                className="hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold text-amber-200"
              >
                <span className="material-symbols-outlined text-[14px]">diamond</span>
                <span>Loyalty Balance: {loyaltyPoints} pts</span>
              </button>
            ) : (
              <span className="text-[#b86b86] font-semibold">✨ 100% Escrow Protected</span>
            )}
          
            <button
              onClick={() => onNavigate('admin_review')}
              className="text-stone-300 hover:text-emerald-300 transition-colors flex items-center gap-1 font-semibold hover:underline cursor-pointer bg-white/10 px-2 py-0.5 rounded"
              title="Open STENZA Administrator & Accreditation Portal"
            >
              <span className="material-symbols-outlined text-[13px] text-emerald-400">shield_person</span>
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Top-Left: STENZA Beauty Logo */}
          <div 
            onClick={() => onNavigate('home')}
            className="cursor-pointer group flex items-center gap-3 flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-full bg-[#26152d] text-[#ffffff] flex items-center justify-center font-serif text-xl font-bold border-2 border-[#d4af37] shadow-sm transition-transform group-hover:scale-105">
              S
            </div>
            <div>
              <div className="font-serif text-2xl font-bold tracking-tight text-[#26152d] group-hover:text-[#b86b86] transition-colors leading-none">
                STENZA <span className="font-light text-[#b86b86]">BEAUTY</span>
              </div>
              <p className="text-[10px] tracking-widest uppercase text-[#7c535c] mt-0.5 font-medium">
                Your Beauty, Your Way.
              </p>
            </div>
          </div>

          {/* Middle: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#26152d]">
            <button
              onClick={() => onNavigate('home')}
              className={`transition-colors hover:text-[#b86b86] relative py-1 ${
                currentView === 'home' ? 'text-[#b86b86] font-semibold' : 'text-[#26152d]'
              }`}
            >
              Home
              {currentView === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b86b86] rounded-full"></span>
              )}
            </button>

            <button
              onClick={() => onNavigate('categories')}
              className={`transition-colors hover:text-[#b86b86] relative py-1 cursor-pointer ${
                currentView === 'categories' ? 'text-[#b86b86] font-semibold' : 'text-[#26152d]'
              }`}
            >
              Categories
              {currentView === 'categories' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b86b86] rounded-full"></span>
              )}
            </button>

            <button
              onClick={() => onNavigate('discover')}
              className={`transition-colors hover:text-[#b86b86] relative py-1 ${
                currentView === 'discover' ? 'text-[#b86b86] font-semibold' : 'text-[#26152d]'
              }`}
            >
              Explore Studios
              {currentView === 'discover' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b86b86] rounded-full"></span>
              )}
            </button>

                <button
              onClick={() => onNavigate('offers')}
              className={`transition-colors hover:text-[#b86b86] relative py-1 flex items-center gap-1.5 cursor-pointer ${
                currentView === 'offers' ? 'text-[#b86b86] font-semibold' : 'text-[#26152d]'
              }`}
            >
              <span>Updates & Offers</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded-full border border-amber-300">
                Deals
              </span>
              {currentView === 'offers' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b86b86] rounded-full"></span>
              )}
            </button>

             <button
              onClick={() => onNavigate('how-it-works')}
              className={`transition-colors hover:text-[#b86b86] relative py-1 ${
                currentView === 'how-it-works' ? 'text-[#b86b86] font-semibold' : 'text-[#26152d]'
              }`}
            >
              
              <span>Your Guide to STENZA</span>
              {currentView === 'how-it-works' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b86b86] rounded-full"></span>
              )}
            </button>
          </nav>
          
           

        

          {/* Top-Right Corner: Login and Register buttons + Shopping Bag */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-[#26152d] hover:text-[#b86b86] hover:bg-[#f6f3ee] rounded-full transition-colors"
              title="Shopping Bag"
            >
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#b86b86] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* If user is logged in, show their account chip with quick sign out option */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => onNavigate('bookings')}
                  className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 bg-[#f6f3ee] hover:bg-[#ebe8e3] rounded-full cursor-pointer transition-colors border border-[#e5e0d8] shadow-2xs"
                  title="My Dashboard"
                >
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoBMuyv1m3ZJeonXSXPwSf9fXxjbLsXmfygfObrLMx9cB8CIEn-BPGAUAazFtUHgteMW0-h8xYzh1AvlcYd_Ht8n1wANl4VfUq9Qdf2gCVXKfusgS_BInruAJ2lTrInOCFiexMWfMOu4fTEQB2L5YKlWabC-Jnmvs_5wwrtmlyi2-hbSnAZA2EmQOnAV1OdT6qRdZig0y_Cn7Ui-BU741im3hnDMoJeS4IbH2z-XSG-rpKSkgP-w_r"
                    alt="Naledi Mokwena"
                    className="w-7 h-7 rounded-full object-cover border border-[#b86b86]"
                  />
                  <span className="text-xs font-semibold text-[#26152d] hidden sm:inline">Naledi M.</span>
                  {pendingCount > 0 && (
                    <span className="bg-[#b86b86] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </div>

                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="text-xs text-gray-500 hover:text-rose-600 font-medium px-2 py-1 transition-colors hidden sm:inline"
                    title="Sign Out"
                  >
                    Logout
                  </button>
                )}
              </div>
            ) : (
              /* Top-Right: Login & Register Buttons (Register is Primary CTA) */
              <div className="hidden sm:flex items-center gap-2.5">
                {/* Login Button: white background, dark text, subtle border */}
                <button
                  onClick={() => onNavigate('auth', undefined, 'login')}
                  className="px-5 py-2 rounded-full bg-white hover:bg-[#fcf9f4] text-[#26152d] border border-[#d8d3ca] hover:border-[#26152d] text-xs font-semibold tracking-wide transition-all duration-200 shadow-2xs cursor-pointer"
                >
                  Login
                </button>

                {/* Register Button: blush-pink background, white text, rounded corners (Primary CTA) */}
                <button
                  onClick={() => onNavigate('auth', undefined, 'register')}
                  className="px-5 py-2 rounded-full bg-[#b86b86] hover:bg-[#a25974] text-white text-xs font-semibold tracking-wide shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#26152d] hover:bg-[#f6f3ee] rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation with Hamburger */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#ffffff] border-b border-[#e5e0d8] px-4 pt-4 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-2">
          {/* Top of mobile drawer: Login & Register Buttons (easy to find) */}
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#f0ede6]">
            <button
              onClick={() => {
                onNavigate('auth', undefined, 'login');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-full bg-white hover:bg-[#fcf9f4] text-[#26152d] border border-[#d8d3ca] text-xs font-semibold text-center transition-all shadow-2xs"
            >
              Login
            </button>
            <button
              onClick={() => {
                onNavigate('auth', undefined, 'register');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-full bg-[#b86b86] hover:bg-[#a25974] text-white text-xs font-semibold text-center transition-all shadow-sm"
            >
              Register
            </button>
          </div>

          {/* Navigation Links in Mobile Menu */}
          <div className="space-y-1">
            <button
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-[#26152d] hover:bg-[#f6f3ee] rounded-lg transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => { onNavigate('categories'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-[#26152d] hover:bg-[#f6f3ee] rounded-lg transition-colors cursor-pointer"
            >
              Categories
            </button>
            <button
              onClick={() => { onNavigate('discover'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-[#26152d] hover:bg-[#f6f3ee] rounded-lg transition-colors"
            >
            
              Explore Studios
            </button>

            <button
              onClick={() => { onNavigate('offers'); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-[#26152d] hover:bg-[#f6f3ee] rounded-lg transition-colors"
            >
              <span>Updates & Offers</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                Deals
              </span>
            </button>

            <button
              onClick={() => { onNavigate('how-it-works'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-[#26152d] hover:bg-[#f6f3ee] rounded-lg transition-colors"
            >
             Your Guide to STENZA
            </button>
           

            {isLoggedIn && (
              <button
                onClick={() => { onNavigate('bookings'); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-[#26152d] hover:bg-[#f6f3ee] rounded-lg transition-colors"
              >
                <span>My Bookings & Profile</span>
                <span className="bg-[#b86b86] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {pendingCount} active
                </span>
              </button>
            )}
          </div>

          {/* Location Chip */}
          <button
            onClick={() => {
              onOpenLocationModal();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#f6f3ee] text-xs font-medium text-[#26152d]"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#b86b86]">location_on</span>
              <span>Location: {selectedCity}</span>
            </div>
            <span className="text-[#b86b86] font-semibold text-[11px]">Change</span>
          </button>

          {/* Dedicated Portal Options for Admins & Artisans */}
          <div className="pt-2 border-t border-[#e5e0d8] space-y-1.5">
            <button
              onClick={() => {
                onNavigate('admin_review');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer border border-emerald-200"
            >
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">shield_person</span>
                <span>Admin Accreditation Portal</span>
              </span>
              <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold">
                Admin
              </span>
            </button>
            <button
              onClick={() => {
                onNavigate('artisan_dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#7c535c] bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors cursor-pointer border border-pink-200"
            >
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#b86b86]">storefront</span>
                <span>Artisan Studio Suite</span>
              </span>
              <span className="text-[10px] bg-pink-200 text-[#7c535c] px-1.5 py-0.5 rounded font-mono font-bold">
                Artisan
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
