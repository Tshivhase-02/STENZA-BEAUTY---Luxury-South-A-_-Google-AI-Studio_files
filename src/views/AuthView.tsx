import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  Scissors, 
  KeyRound, 
  CheckCircle2, 
  Info,
  Sparkles
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

  // Login form state - Strictly Customer and Artisan Studio (Administrator option removed from public form)
  const [loginRole, setLoginRole] = useState<'client' | 'pro'>('client');
  const [loginIdentifier, setLoginIdentifier] = useState('naledi.mokwena@stenzabeauty.co.za');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

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

  // Switch between customer and artisan
  const handleSelectRole = (role: 'client' | 'pro') => {
    setLoginRole(role);
    if (role === 'client') {
      setLoginIdentifier('naledi.mokwena@stenzabeauty.co.za');
    } else {
      setLoginIdentifier('lerato.khumalo@luxenailstudio.co.za');
    }
  };

  // Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginIdentifier.trim()) {
      showToast('Please enter your email or username.', 'error');
      return;
    }

    if (loginRole === 'client') {
      const name = loginIdentifier.includes('naledi') ? 'Naledi Mokwena' : loginIdentifier.split('@')[0];
      onLoginSuccess(name, 'client');
      showToast('Welcome back! Taking you to your dashboard...', 'success');
      setTimeout(() => {
        onNavigate('bookings');
      }, 500);
    } else {
      const name = loginIdentifier.includes('lerato') ? 'Lerato Khumalo' : 'Artisan Specialist';
      onLoginSuccess(name, 'pro');
      showToast('Welcome back! Taking you to your studio...', 'success');
      setTimeout(() => {
        onNavigate('artisan_dashboard');
      }, 500);
    }
  };

  // Google Sign-In click
  const handleGoogleSignIn = () => {
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
      showToast(`Password reset link sent to ${forgotEmail}`, 'success');
    }, 1200);
  };

  const handleClientRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!popiaAccepted) {
      showToast('Please accept the POPIA privacy terms to register.', 'error');
      return;
    }
    const name = regName.trim() || 'Naledi Mokwena';
    onLoginSuccess(name, 'client');
    showToast('Account created! Welcome to STENZA Beauty.', 'success');
    setTimeout(() => {
      onNavigate('bookings');
    }, 500);
  };

  const handleProRegister = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('artisan_registration');
  };

  return (
    <div className="min-h-screen bg-[#fcf9f4] flex flex-col justify-center py-4 sm:py-8 px-4 sm:px-6 lg:px-8 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          className={`fixed top-20 right-4 z-50 max-w-md px-4 py-3 rounded-2xl shadow-xl flex items-start gap-2.5 border text-xs font-medium animate-in slide-in-from-top-3 ${
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
      <div className="max-w-5xl w-full mx-auto bg-white rounded-3xl shadow-xl border border-[#e5e0d8] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        
        {/* ================= LEFT SIDE: Beauty Visual Banner ================= */}
        {/* On desktop: full height column. On mobile: compact header banner so login form stays the main focus */}
        <div className="lg:col-span-5 relative bg-[#1b0d21] text-white overflow-hidden flex flex-col justify-between p-6 sm:p-8 h-48 sm:h-60 lg:h-auto lg:min-h-[580px]">
          {/* Authentic South African beauty portrait */}
          <img
            src="/assets/aistudio/Media__7__14ebe8b0.jpg"
            alt="STENZA Signature Beauty"
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
          />

          {/* Clean gradient overlay ensuring text readability without obscuring the photograph */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#140a19]/90 via-[#1b0d21]/40 to-[#1b0d21]/20 pointer-events-none" />

          {/* Top Brand Identity: Logo & Tagline */}
          <div className="relative z-10">
            <div 
              onClick={() => onNavigate('home')}
              className="cursor-pointer group inline-flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-full bg-[#26152d]/90 backdrop-blur-md text-white flex items-center justify-center font-serif text-lg font-bold border-2 border-[#d4af37] shadow-sm transition-transform group-hover:scale-105">
                S
              </div>
              <div>
                <div className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white leading-none">
                  STENZA <span className="font-light text-[#e8a3b8]">BEAUTY</span>
                </div>
                <p className="text-[10px] tracking-widest uppercase text-[#d4af37] font-medium mt-0.5">
                  Your Beauty, Your Way.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Headline & Single Supporting Sentence (Clean & uncluttered) */}
          <div className="relative z-10 pt-4">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight drop-shadow-md">
              Beauty starts here.
            </h1>
            <p className="text-xs text-stone-200 mt-1 leading-relaxed drop-shadow-xs">
              Find a studio. Choose your service. Book your visit.
            </p>
          </div>
        </div>

        {/* ================= RIGHT SIDE: Clean, Modern Authentication Portal ================= */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
          <div>
            {/* Top Navigation Switcher: Sign In vs Create Account vs Artisan Registry */}
            <div className="flex items-center justify-between pb-5 mb-5 border-b border-[#e5e0d8] flex-wrap gap-2">
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#f6f3ee] text-xs font-semibold text-stone-600">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-white text-[#26152d] shadow-xs font-bold'
                      : 'hover:text-[#26152d]'
                  }`}
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-[#b86b86] text-white shadow-xs font-bold'
                      : 'hover:text-[#26152d]'
                  }`}
                >
                  Create account
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('pro')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    authMode === 'pro'
                      ? 'bg-[#26152d] text-white shadow-xs font-bold'
                      : 'hover:text-[#26152d]'
                  }`}
                >
                  Artisan registry
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

            {/* ================= FORM 1: LOGIN (PRIMARY FOCUS) ================= */}
            {authMode === 'login' && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#26152d]">
                    Welcome back
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Sign in to access your appointments and saved studios.
                  </p>
                </div>

                {/* Account Type Selector: Strictly Customer and Artisan Studio (Administrator option removed) */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Account type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectRole('client')}
                      className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-2 text-xs ${
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
                      className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-2 text-xs ${
                        loginRole === 'pro'
                          ? 'border-[#b86b86] bg-[#fbf0f4] text-[#26152d] font-bold shadow-xs'
                          : 'border-[#e5e0d8] text-stone-600 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <Scissors className="w-4 h-4 text-[#b86b86]" />
                      <span>Artisan Studio</span>
                    </button>
                  </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-3.5">
                  {/* Email or Username Field */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Email or username
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                      <input
                        type="text"
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="you@example.co.za"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#fdfbf9] border border-[#d8d3ca] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#b86b86] focus:bg-white transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Password Field with Show/Hide Toggle */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
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
                        Forgot password?
                      </button>
                    </div>

                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-[#fdfbf9] border border-[#d8d3ca] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#b86b86] focus:bg-white transition-all shadow-2xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 p-0.5 rounded transition cursor-pointer"
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

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center justify-between pt-0.5">
                    <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-[#b86b86] focus:ring-[#b86b86] border-[#d8d3ca] accent-[#b86b86] cursor-pointer"
                      />
                      <span>Remember me</span>
                    </label>
                  </div>

                  {/* Prominent Blush-Pink Login Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      className="w-full py-3 px-6 rounded-xl bg-[#b86b86] hover:bg-[#a25974] text-white text-xs sm:text-sm font-bold tracking-wide shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                    >
                      <span>
                        {loginRole === 'client' ? 'Log in' : 'Log in to Studio'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                {/* Social Authentication Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#e5e0d8]"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-stone-400 uppercase tracking-wider text-[10px] font-medium">
                      or
                    </span>
                  </div>
                </div>

                {/* Continue with Google Button with Official Google G Logo */}
                <div>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 border border-[#d8d3ca] hover:border-stone-400 rounded-xl text-xs sm:text-sm font-semibold text-stone-800 transition-all shadow-2xs flex items-center justify-center gap-3 cursor-pointer group"
                    title="Sign in with Google"
                  >
                    <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
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

                {/* Bottom Register Links */}
                <div className="pt-2 text-center text-xs text-stone-600 flex items-center justify-center gap-3">
                  <span>Don't have an account?</span>
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className="font-bold text-[#b86b86] hover:text-[#a25974] hover:underline cursor-pointer"
                  >
                    Create account
                  </button>
                </div>
              </div>
            )}

            {/* ================= FORM 2: CREATE CUSTOMER ACCOUNT ================= */}
            {authMode === 'register' && (
              <div className="space-y-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#26152d]">
                    Create your account
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Book appointments with verified salons and beauty artists.
                  </p>
                </div>

                <form onSubmit={handleClientRegister} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Full name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Naledi Mokwena"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#fdfbf9] border border-[#d8d3ca] text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#b86b86]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">
                        Phone number
                      </label>
                      <div className="flex">
                        <span className="px-2.5 py-2 bg-[#ebe8e3] border border-r-0 border-[#d8d3ca] rounded-l-xl text-xs font-semibold text-stone-700 flex items-center">
                          +27
                        </span>
                        <input
                          type="tel"
                          required
                          placeholder="82 123 4567"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          className="w-full px-3 py-2 rounded-r-xl bg-[#fdfbf9] border border-[#d8d3ca] text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#b86b86]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">
                        City
                      </label>
                      <select
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#fdfbf9] border border-[#d8d3ca] text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#b86b86]"
                      >
                        <option value="Johannesburg">Johannesburg</option>
                        <option value="Cape Town">Cape Town</option>
                        <option value="Durban">Durban</option>
                        <option value="Pretoria">Pretoria</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Email address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.co.za"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#fdfbf9] border border-[#d8d3ca] text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#b86b86]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        placeholder="At least 8 characters"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full px-3.5 pr-10 py-2 rounded-xl bg-[#fdfbf9] border border-[#d8d3ca] text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#b86b86]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-2 text-stone-400 hover:text-stone-700"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* POPIA Checkbox */}
                  <label className="flex items-start gap-2 text-xs text-stone-600 cursor-pointer pt-0.5">
                    <input
                      type="checkbox"
                      checked={popiaAccepted}
                      onChange={(e) => setPopiaAccepted(e.target.checked)}
                      className="accent-[#b86b86] rounded mt-0.5"
                    />
                    <span>
                      I agree to the Terms of Service and POPIA privacy guidelines.
                    </span>
                  </label>

                  <div className="pt-1">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#b86b86] hover:bg-[#a25974] text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Create account</span>
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
                      Log in here
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ================= FORM 3: ARTISAN REGISTRATION PROMPT ================= */}
            {authMode === 'pro' && (
              <div className="space-y-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#26152d]">
                    Artisan studio registry
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Join South Africa's trusted network of independent beauty artists.
                  </p>
                </div>

                <form onSubmit={handleProRegister} className="space-y-3.5">
                  <div className="p-3 bg-[#fbf0f4] rounded-xl border border-[#f0d0dc] text-xs text-[#26152d] space-y-1">
                    <div className="font-bold text-[#b86b86] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Artisan benefits</span>
                    </div>
                    <p className="text-stone-700 leading-relaxed text-[11px]">
                      Manage appointments, set your prices and travel fees, and receive verified client bookings.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Business or studio name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Crown Hair Atelier"
                      value={proBusinessName}
                      onChange={(e) => setProBusinessName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#fdfbf9] border border-[#d8d3ca] text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#b86b86]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">
                        Category
                      </label>
                      <select
                        value={proCategory}
                        onChange={(e) => setProCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#fdfbf9] border border-[#d8d3ca] text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#b86b86]"
                      >
                        <option value="Nail Couture">Nail Care</option>
                        <option value="Luxury Hair">Hair & Braiding</option>
                        <option value="Clinical Skincare">Skincare & Facials</option>
                        <option value="Spa & Wellness">Spa & Massage</option>
                        <option value="Lashes & Brows">Lashes & Brows</option>
                        <option value="Artisan Makeup">Makeup</option>
                        <option value="Gentlemen Grooming">Barbering</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">
                        City
                      </label>
                      <select
                        value={proCity}
                        onChange={(e) => setProCity(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#fdfbf9] border border-[#d8d3ca] text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#b86b86]"
                      >
                        <option value="Johannesburg">Johannesburg</option>
                        <option value="Cape Town">Cape Town</option>
                        <option value="Durban">Durban</option>
                        <option value="Pretoria">Pretoria</option>
                      </select>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer pt-0.5">
                    <input
                      type="checkbox"
                      checked={proOffersMobile}
                      onChange={(e) => setProOffersMobile(e.target.checked)}
                      className="accent-[#b86b86] rounded"
                    />
                    <span>I offer house-call appointments</span>
                  </label>

                  <div className="pt-1">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#26152d] hover:bg-[#39263f] text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Register your studio</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-center pt-1 text-xs text-stone-600">
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        handleSelectRole('pro');
                      }}
                      className="font-bold text-[#b86b86] hover:underline cursor-pointer"
                    >
                      Log in to Studio
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* ================= SUBTLE SECURITY & PRIVACY FOOTER ================= */}
          <div className="pt-5 mt-5 border-t border-[#f0ebe3] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit SSL Bank-Grade Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <span>POPIA Compliant</span>
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
            <h3 className="font-serif text-lg font-bold text-[#26152d]">Reset your password</h3>
            <p className="text-xs text-stone-500 mt-1">
              Enter your registered email and we'll send you a password reset link.
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
                  className="flex-1 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotSent}
                  className="flex-1 py-2 text-xs font-bold bg-[#b86b86] hover:bg-[#a25974] text-white rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {forgotSent ? 'Sending...' : 'Send link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
