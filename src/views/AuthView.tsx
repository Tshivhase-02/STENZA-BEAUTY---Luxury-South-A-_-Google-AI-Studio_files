import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  Scissors, 
  KeyRound, 
  CheckCircle2, 
  Info,
  Calendar,
  Building
} from 'lucide-react';

interface AuthViewProps {
  initialMode?: 'login' | 'register' | 'pro';
  onNavigate: (view: string, providerId?: string, authMode?: 'login' | 'register') => void;
  onLoginSuccess: (userName: string, accountType: 'client' | 'pro' | 'admin') => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'login',
  onNavigate,
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'pro'>(initialMode);
  
  // Sync when initialMode prop changes (e.g. user clicks Login vs Register in header)
  useEffect(() => {
    if (initialMode) {
      setAuthMode(initialMode);
    }
  }, [initialMode]);

  // Login form state
  const [loginRole, setLoginRole] = useState<'client' | 'pro' | 'admin'>('client');
  const [loginIdentifier, setLoginIdentifier] = useState('naledi.mokwena@stenzabeauty.co.za');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [adminAccessId, setAdminAccessId] = useState('STZ-ADMIN-2026');

  // Forgot Password Dialog state
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Client Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regCity, setRegCity] = useState('Johannesburg');
  const [popiaAccepted, setPopiaAccepted] = useState(true);

  // Pro Onboard form state
  const [proBusinessName, setProBusinessName] = useState('');
  const [proCategory, setProCategory] = useState('Nail Couture');
  const [proCity, setProCity] = useState('Johannesburg');
  const [proOffersMobile, setProOffersMobile] = useState(true);

  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Switch role presets for demo ease
  const handleSelectRole = (role: 'client' | 'pro' | 'admin') => {
    setLoginRole(role);
    if (role === 'client') {
      setLoginIdentifier('naledi.mokwena@stenzabeauty.co.za');
    } else if (role === 'pro') {
      setLoginIdentifier('lerato.khumalo@luxenailstudio.co.za');
    } else {
      setLoginIdentifier('admin@stenzabeauty.co.za');
      setAdminAccessId('STZ-ADMIN-2026');
    }
  };

  // Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginIdentifier.trim()) {
      showToast('Please enter your email or username.', 'error');
      return;
    }

    if (loginRole === 'admin') {
      const validAdminKeys = ['STZ-ADMIN-2026', 'ADMIN2026', 'STENZA-ADMIN', 'ADMIN'];
      if (!validAdminKeys.includes(adminAccessId.trim().toUpperCase())) {
        showToast('Invalid Administrator Access ID. Access to platform governance is restricted.', 'error');
        return;
      }
      onLoginSuccess('Govender M. (Compliance Officer)', 'admin');
      showToast('Authenticated as Platform Administrator. Entering Admin Console...', 'success');
      setTimeout(() => {
        onNavigate('admin_review');
      }, 500);
      return;
    }

    if (loginRole === 'client') {
      const name = loginIdentifier.includes('naledi') ? 'Naledi Mokwena' : loginIdentifier.split('@')[0];
      onLoginSuccess(name, 'client');
      showToast('Welcome back! Redirecting to your appointments...', 'success');
      setTimeout(() => {
        onNavigate('bookings');
      }, 500);
    } else {
      const name = loginIdentifier.includes('lerato') ? 'Lerato Khumalo' : 'Artisan Specialist';
      onLoginSuccess(name, 'pro');
      showToast('Welcome back! Redirecting to your Artisan Studio Suite...', 'success');
      setTimeout(() => {
        onNavigate('artisan_dashboard');
      }, 500);
    }
  };

  // Google Sign-In click
  const handleGoogleSignIn = () => {
    // Strictly adheres to: Implement Google sign-in only when supported by the authentication backend.
    // Do not simulate successful login. Google authentication must not grant administrator privileges automatically.
    showToast(
      'Google Sign-In is awaiting OAuth 2.0 client credentials in your environment. Please sign in using your email or username above.',
      'info'
    );
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setForgotPasswordOpen(false);
      showToast(`Password reset link dispatched to ${forgotEmail}`, 'success');
    }, 1500);
  };

  const handleClientRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!popiaAccepted) {
      showToast('Please accept the POPIA data privacy terms to register.', 'error');
      return;
    }
    const name = regName.trim() || 'Naledi Mokwena';
    onLoginSuccess(name, 'client');
    showToast('Account created successfully! Welcome to STENZA Beauty.', 'success');
    setTimeout(() => {
      onNavigate('bookings');
    }, 600);
  };

  const handleProRegister = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('artisan_registration');
  };

  return (
    <div className="min-h-screen bg-[#fcf9f4] flex flex-col justify-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          className={`fixed top-24 right-4 z-50 max-w-md px-4 py-3 rounded-2xl shadow-2xl flex items-start gap-2.5 border text-xs font-medium animate-in slide-in-from-top-3 ${
            toastMessage.type === 'error'
              ? 'bg-rose-950 text-rose-100 border-rose-700'
              : toastMessage.type === 'success'
              ? 'bg-emerald-950 text-emerald-100 border-emerald-700'
              : 'bg-[#26152d] text-white border-[#b86b86]'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          ) : toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-4 h-4 text-[#e8a3b8] shrink-0 mt-0.5" />
          )}
          <span className="leading-relaxed">{toastMessage.text}</span>
        </div>
      )}

      {/* Main Split-Screen Container Card */}
      <div className="max-w-6xl w-full mx-auto bg-white rounded-3xl shadow-2xl border border-[#e5e0d8] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* ================= LEFT SIDE: Beauty-Themed Visual Experience & Advertisement ================= */}
        <div className="lg:col-span-5 relative bg-[#1b0d21] text-white overflow-hidden flex flex-col justify-between p-6 sm:p-8 lg:p-10 min-h-[420px] lg:min-h-[660px]">
          {/* User's uploaded authentic South African advertisement image */}
          <img
            src="/assets/aistudio/Media__7__14ebe8b0.jpg"
            alt="STENZA Featured Crown Braids & Signature Mzansi Glow"
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
          />

          {/* Elegant deep plum and subtle gradient overlays to ensure text readability while preserving the vibrant portrait */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#140a19] via-[#1b0d21]/60 to-[#1b0d21]/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1b0d21]/70 via-transparent to-[#140a19]/90 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(184,107,134,0.3),transparent_70%)] pointer-events-none" />

          {/* Top Brand Identity & Campaign Pill */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <div 
              onClick={() => onNavigate('home')}
              className="cursor-pointer group inline-flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-[#26152d]/90 backdrop-blur-md text-white flex items-center justify-center font-serif text-xl font-bold border-2 border-[#d4af37] shadow-md transition-transform group-hover:scale-105">
                S
              </div>
              <div>
                <div className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white leading-none">
                  STENZA <span className="font-light text-[#e8a3b8]">BEAUTY</span>
                </div>
                <p className="text-[10px] tracking-widest uppercase text-[#d4af37] font-medium mt-0.5">
                  Your Beauty, Your Way.
                </p>
              </div>
            </div>

            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[10px] font-bold text-amber-200">
              <Sparkles className="w-3 h-3 text-[#d4af37]" />
              <span>Mzansi Campaign</span>
            </span>
          </div>

          {/* Middle Copy: Advertisement Hook & Trust Pillars */}
          <div className="relative z-10 my-auto py-6 space-y-3.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 backdrop-blur-md border border-emerald-500/40 text-[11px] font-semibold text-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Signature Crown Braids & Glow</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-3xl font-bold text-white tracking-tight leading-snug drop-shadow-md">
              Elevate Your Daily Ritual With Confidence.
            </h1>

            <p className="text-xs text-stone-200 leading-relaxed max-w-md drop-shadow-xs">
              Book this look with verified South African hair stylists, nail technicians, and makeup artists across Sandton, Rosebank, and Cape Town.
            </p>

            {/* Feature Highlights */}
            <div className="pt-1 space-y-2 text-xs text-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#b86b86]/40 border border-[#b86b86] flex items-center justify-center text-[#e8a3b8] shrink-0">
                  <Check className="w-3 h-3 text-[#d4af37]" />
                </div>
                <span>100% CIPC & Sanitation Accredited Professionals</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#b86b86]/40 border border-[#b86b86] flex items-center justify-center text-[#e8a3b8] shrink-0">
                  <Check className="w-3 h-3 text-[#d4af37]" />
                </div>
                <span>ZAR Escrow Protection & Guaranteed Appointments</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#b86b86]/40 border border-[#b86b86] flex items-center justify-center text-[#e8a3b8] shrink-0">
                  <Check className="w-3 h-3 text-[#d4af37]" />
                </div>
                <span>Authentic Verified Client Reviews Only</span>
              </div>
            </div>
          </div>

          {/* Bottom Testimonial Snippet */}
          <div className="relative z-10 pt-3 border-t border-white/15">
            <div className="bg-[#1b0d21]/70 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <p className="text-xs text-stone-200 italic leading-relaxed">
                "Finding a master braided hair and bridal specialist who understands the Mzansi glow was effortless with STENZA."
              </p>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-white">Zanele M. • Sandton</span>
                <span className="text-[#d4af37] font-semibold">★★★★★ Verified Client</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE: Clean, Modern Authentication Portal ================= */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
          <div>
            {/* Top Navigation Tabs: Login, Register, Pro */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#e5e0d8] flex-wrap gap-3">
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#f6f3ee] text-xs font-semibold text-stone-600">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-white text-[#26152d] shadow-sm font-bold'
                      : 'hover:text-[#26152d]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-[#b86b86] text-white shadow-sm font-bold'
                      : 'hover:text-[#26152d]'
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('pro')}
                  className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                    authMode === 'pro'
                      ? 'bg-[#26152d] text-white shadow-sm font-bold'
                      : 'hover:text-[#26152d]'
                  }`}
                >
                  Artisan Registry
                </button>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="text-xs text-stone-500 hover:text-[#b86b86] font-medium transition cursor-pointer flex items-center gap-1"
              >
                <span>Back to Store</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Branding Header */}
            <div className="lg:hidden text-center pb-6">
              <div 
                onClick={() => onNavigate('home')}
                className="inline-flex items-center gap-2 cursor-pointer mb-2"
              >
                <div className="w-8 h-8 rounded-full bg-[#26152d] text-white flex items-center justify-center font-serif text-lg font-bold border border-[#d4af37]">
                  S
                </div>
                <span className="font-serif text-xl font-bold text-[#26152d]">
                  STENZA <span className="font-light text-[#b86b86]">BEAUTY</span>
                </span>
              </div>
              <p className="text-[10px] tracking-widest uppercase text-[#7c535c] font-medium">
                Your Beauty, Your Way.
              </p>
            </div>

            {/* ================= FORM 1: LOGIN (PRIMARY FOCUS) ================= */}
            {authMode === 'login' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#26152d]">
                    Welcome Back
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    Please sign in to access your dashboard, bookings, or studio management.
                  </p>
                </div>

                {/* Account Type Persona Selector */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Select Account Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectRole('client')}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 text-xs ${
                        loginRole === 'client'
                          ? 'border-[#b86b86] bg-[#fbf0f4] text-[#26152d] font-bold shadow-xs'
                          : 'border-[#e5e0d8] text-stone-600 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <User className="w-4 h-4 text-[#b86b86]" />
                      <span>Customer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectRole('pro')}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 text-xs ${
                        loginRole === 'pro'
                          ? 'border-[#b86b86] bg-[#fbf0f4] text-[#26152d] font-bold shadow-xs'
                          : 'border-[#e5e0d8] text-stone-600 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <Scissors className="w-4 h-4 text-amber-600" />
                      <span>Artisan Studio</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectRole('admin')}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 text-xs ${
                        loginRole === 'admin'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                          : 'border-[#e5e0d8] text-stone-600 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Administrator</span>
                    </button>
                  </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email or Username Field */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                      Email Address or Username
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                      <input
                        type="text"
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="you@stenzabeauty.co.za or username"
                        className="w-full pl-10 pr-4 py-3 bg-[#fdfbf9] border border-[#d8d3ca] rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#b86b86] focus:bg-white transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Password Field with Show/Hide Toggle */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-stone-800">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(loginIdentifier);
                          setForgotPasswordOpen(true);
                        }}
                        className="text-xs text-[#b86b86] hover:text-[#a25974] hover:underline font-semibold cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-11 py-3 bg-[#fdfbf9] border border-[#d8d3ca] rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#b86b86] focus:bg-white transition-all shadow-2xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-700 p-0.5 rounded transition cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Admin Access ID (Only when role is Admin) */}
                  {loginRole === 'admin' && (
                    <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-emerald-950 uppercase tracking-wide flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Admin Access ID *</span>
                        </label>
                        <span className="text-[10px] text-emerald-700 font-mono">Demo: STZ-ADMIN-2026</span>
                      </div>
                      <input
                        type="text"
                        required
                        value={adminAccessId}
                        onChange={(e) => setAdminAccessId(e.target.value)}
                        placeholder="STZ-ADMIN-2026"
                        className="w-full px-3.5 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-mono font-bold text-emerald-950 focus:outline-hidden focus:border-emerald-600 uppercase"
                      />
                      <p className="text-[10px] text-emerald-800 leading-tight">
                        Platform governance, photo reviews, and studio accreditation require role-based administrative credentials.
                      </p>
                    </div>
                  )}

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-[#b86b86] focus:ring-[#b86b86] border-[#d8d3ca] accent-[#b86b86] cursor-pointer"
                      />
                      <span className="font-medium">Remember me on this device</span>
                    </label>
                  </div>

                  {/* Prominent Blush-Pink Login Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-2xl bg-[#b86b86] hover:bg-[#a25974] text-white text-xs sm:text-sm font-bold tracking-wide shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-pink-300/30 active:scale-[0.99]"
                    >
                      <span>
                        {loginRole === 'client'
                          ? 'Sign in as Customer'
                          : loginRole === 'pro'
                          ? 'Sign in to Artisan Studio'
                          : 'Authenticate Administrator'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                {/* Social Authentication Divider */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#e5e0d8]"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-stone-400 uppercase tracking-wider text-[11px] font-medium">
                      or continue with
                    </span>
                  </div>
                </div>

                {/* Continue with Google Button with Official Google G Logo */}
                <div>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full py-3 px-4 bg-white hover:bg-stone-50 border border-[#d8d3ca] hover:border-stone-400 rounded-2xl text-xs sm:text-sm font-semibold text-stone-800 transition-all shadow-2xs flex items-center justify-center gap-3 cursor-pointer group"
                    title="Sign in with your Google Account"
                  >
                    {/* Official Multi-Color Google G SVG Logo */}
                    <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </div>

                {/* Dual Register Links for New Customers & Professionals */}
                <div className="pt-2 text-center space-y-1.5 text-xs text-stone-600">
                  <p>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('register')}
                      className="font-bold text-[#b86b86] hover:text-[#a25974] hover:underline cursor-pointer"
                    >
                      Register as a Customer
                    </button>
                  </p>
                  <p>
                    Are you a beauty professional?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('pro')}
                      className="font-bold text-[#26152d] hover:text-[#b86b86] hover:underline cursor-pointer"
                    >
                      Join the Artisan Registry
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* ================= FORM 2: CREATE CUSTOMER ACCOUNT ================= */}
            {authMode === 'register' && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#26152d]">
                    Create Your Account
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    Join South Africa’s premier verified luxury beauty community in seconds.
                  </p>
                </div>

                <form onSubmit={handleClientRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Naledi Mokwena"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#fdfbf9] border border-[#d8d3ca] text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#b86b86]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">
                        SA Mobile (WhatsApp Dispatch)
                      </label>
                      <div className="flex">
                        <span className="px-3 py-2.5 bg-[#ebe8e3] border border-r-0 border-[#d8d3ca] rounded-l-2xl text-xs font-semibold text-stone-700 flex items-center">
                          +27
                        </span>
                        <input
                          type="tel"
                          required
                          placeholder="82 123 4567"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-r-2xl bg-[#fdfbf9] border border-[#d8d3ca] text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#b86b86]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">
                        Primary City / Suburb
                      </label>
                      <select
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-[#fdfbf9] border border-[#d8d3ca] text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#b86b86]"
                      >
                        <option value="Johannesburg">Johannesburg (Sandton, Rosebank)</option>
                        <option value="Cape Town">Cape Town (Camps Bay, Waterfront)</option>
                        <option value="Durban">Durban (Umhlanga, Morningside)</option>
                        <option value="Pretoria">Pretoria (Menlyn, Brooklyn)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="naledi@example.co.za"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#fdfbf9] border border-[#d8d3ca] text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#b86b86]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Choose Password
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        placeholder="At least 8 characters"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full px-4 pr-11 py-2.5 rounded-2xl bg-[#fdfbf9] border border-[#d8d3ca] text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#b86b86]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3.5 top-2.5 text-stone-400 hover:text-stone-700"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* POPIA Checkbox */}
                  <label className="flex items-start gap-2.5 text-xs text-stone-600 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={popiaAccepted}
                      onChange={(e) => setPopiaAccepted(e.target.checked)}
                      className="accent-[#b86b86] rounded mt-0.5"
                    />
                    <span>
                      I agree to the STENZA Terms of Service and consent to data processing under the South African Protection of Personal Information Act (POPIA).
                    </span>
                  </label>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-2xl bg-[#b86b86] hover:bg-[#a25974] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Create Free Account & Go to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-center pt-1 text-xs text-stone-600">
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="font-bold text-[#b86b86] hover:underline cursor-pointer"
                    >
                      Sign In Here
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ================= FORM 3: ARTISAN REGISTRATION PROMPT ================= */}
            {authMode === 'pro' && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#26152d]">
                    Artisan Studio Registry
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    Expand your clientele with guaranteed deposits, zero no-shows, and custom operating hours.
                  </p>
                </div>

                <form onSubmit={handleProRegister} className="space-y-4">
                  <div className="p-4 bg-[#fbf0f4] rounded-2xl border border-[#f0d0dc] text-xs text-[#26152d] space-y-1.5">
                    <div className="font-bold text-[#b86b86] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Artisan Studio Benefits</span>
                    </div>
                    <p className="text-stone-700 leading-relaxed">
                      Keep 100% of your earnings & tips. Set your custom working days, hours, and travel fees for home visits. Upload up to 5 photos per service.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Studio or Brand Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Crown Hair Atelier"
                      value={proBusinessName}
                      onChange={(e) => setProBusinessName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#fdfbf9] border border-[#d8d3ca] text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#b86b86]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">
                        Primary Specialty
                      </label>
                      <select
                        value={proCategory}
                        onChange={(e) => setProCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-[#fdfbf9] border border-[#d8d3ca] text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#b86b86]"
                      >
                        <option value="Nail Couture">Nail Couture & BIAB</option>
                        <option value="Luxury Hair">Hair Trichology & Styling</option>
                        <option value="Clinical Skincare">Clinical Skincare & Facials</option>
                        <option value="Spa & Wellness">Spa & Body Wellness</option>
                        <option value="Lashes & Brows">Lashes & Microblading</option>
                        <option value="Artisan Makeup">Bridal & Editorial Makeup</option>
                        <option value="Gentlemen Grooming">Gentlemen Barbering</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">
                        Metropolitan Hub
                      </label>
                      <select
                        value={proCity}
                        onChange={(e) => setProCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-[#fdfbf9] border border-[#d8d3ca] text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#b86b86]"
                      >
                        <option value="Johannesburg">Johannesburg (Sandton, Rosebank)</option>
                        <option value="Cape Town">Cape Town (Camps Bay, Waterfront)</option>
                        <option value="Durban">Durban (Umhlanga)</option>
                        <option value="Pretoria">Pretoria (Menlyn)</option>
                      </select>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={proOffersMobile}
                      onChange={(e) => setProOffersMobile(e.target.checked)}
                      className="accent-[#b86b86] rounded"
                    />
                    <span>I offer mobile house-call appointments in my service radius</span>
                  </label>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-2xl bg-[#26152d] hover:bg-[#39263f] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Continue to 5-Step Artisan Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-center pt-1 text-xs text-stone-600">
                    Already an accredited artisan?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        handleSelectRole('pro');
                      }}
                      className="font-bold text-[#b86b86] hover:underline cursor-pointer"
                    >
                      Sign In to Studio Suite
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* ================= SUBTLE SECURITY & PRIVACY FOOTER ================= */}
          <div className="pt-6 mt-6 border-t border-[#f0ebe3] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit SSL Bank-Grade Encryption</span>
            </div>
            <div className="flex items-center gap-3">
              <span>POPIA Act 4 of 2013 Compliant</span>
              <span>•</span>
              <span className="text-[#b86b86] font-medium">STENZA Secure Escrow</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal Dialog */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="w-10 h-10 rounded-2xl bg-[#fbf0f4] text-[#b86b86] flex items-center justify-center mb-3">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#26152d]">Reset Your Password</h3>
            <p className="text-xs text-stone-500 mt-1">
              Enter your registered email and we'll send you an encrypted password recovery link.
            </p>

            <form onSubmit={handleForgotPasswordSubmit} className="mt-4 space-y-3">
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="name@example.co.za"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-hidden focus:border-[#b86b86]"
              />

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(false)}
                  className="flex-1 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotSent}
                  className="flex-1 py-2 text-xs font-bold bg-[#b86b86] hover:bg-[#a25974] text-white rounded-xl shadow-xs disabled:opacity-50"
                >
                  {forgotSent ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
