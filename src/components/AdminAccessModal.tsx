import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, AlertCircle, CheckCircle2, X, ArrowLeft } from 'lucide-react';

interface AdminAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const VALID_ACCESS_IDS = [
  'STZ-ADMIN-2026',
  'ADMIN2026',
  'STENZA-ADMIN',
  'ADMIN',
  'ZA-COMPLIANCE-8812'
];

export const AdminAccessModal: React.FC<AdminAccessModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [accessId, setAccessId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanId = accessId.trim().toUpperCase();
    if (!cleanId) {
      setError('Please enter a valid Administrator Access ID.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      if (VALID_ACCESS_IDS.includes(cleanId)) {
        setIsVerifying(false);
        setAccessId('');
        setPasscode('');
        onSuccess();
      } else {
        setIsVerifying(false);
        setError('Access Denied: Invalid Administrator Access ID. Please verify your credentials or use the demo master key.');
      }
    }, 600);
  };

  const handleUseDemoKey = () => {
    setAccessId('STZ-ADMIN-2026');
    setPasscode('••••••••');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-access-title"
      >
        {/* Header Banner */}
        <div className="bg-[#1b0d21] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 shadow-inner">
            <ShieldCheck className="w-7 h-7 text-[#d4af37]" />
          </div>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-widest uppercase bg-emerald-700 text-white px-2 py-0.5 rounded shadow-2xs">
              RESTRICTED ACCESS
            </span>
            <span className="text-xs text-stone-400">POPIA Act 4 of 2013</span>
          </div>

          <h2 id="admin-access-title" className="text-xl font-serif font-bold text-white tracking-tight">
            Administrator Authentication
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            Access to the STENZA Beauty accreditation and governance console requires a verified officer Access ID.
          </p>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Admin Access ID *</span>
              <button
                type="button"
                onClick={handleUseDemoKey}
                className="text-[11px] font-semibold text-[#b86b86] hover:text-[#a25974] hover:underline cursor-pointer flex items-center gap-1 normal-case"
              >
                <KeyRound className="w-3 h-3" />
                <span>Autofill Demo Key</span>
              </button>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
              <input
                type="text"
                value={accessId}
                onChange={(e) => {
                  setAccessId(e.target.value);
                  setError('');
                }}
                placeholder="e.g. STZ-ADMIN-2026"
                className="w-full pl-10 pr-3 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#b86b86] focus:bg-white font-mono uppercase font-semibold text-stone-900 transition-colors"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
              <span>Official Key:</span>
              <code className="bg-stone-100 text-stone-800 px-1.5 py-0.2 rounded font-mono font-bold text-[10px]">
                STZ-ADMIN-2026
              </code>
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Officer PIN / Security Token</span>
              <span className="text-[10px] text-stone-400 font-normal normal-case">(Optional in demo)</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#b86b86] focus:bg-white font-mono text-stone-900 transition-colors"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 bg-[#b86b86] hover:bg-[#a25974] disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying RSA Security Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate & Enter Admin Console</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Cancel & Return to Marketplace</span>
            </button>
          </div>
        </form>

        {/* Security disclaimer */}
        <div className="bg-stone-50 border-t border-stone-200 px-6 py-3 text-[11px] text-stone-500 flex items-center justify-between">
          <span>Encrypted Session • RSA CIPC Gateway</span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Active Audit Logging
          </span>
        </div>
      </div>
    </div>
  );
};
