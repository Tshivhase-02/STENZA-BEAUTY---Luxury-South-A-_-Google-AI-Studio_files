import React from 'react';
import { ArtisanApplication } from '../../data/artisanWorkflowData';
import { 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  PhoneCall, 
  Eye, 
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
  FileCheck
} from 'lucide-react';

interface ApplicationSubmittedViewProps {
  application: ArtisanApplication;
  onNavigate: (view: string) => void;
  onOpenAdminReview: () => void;
}

export const ApplicationSubmittedView: React.FC<ApplicationSubmittedViewProps> = ({
  application,
  onNavigate,
  onOpenAdminReview,
}) => {
  return (
    <div className="min-h-screen bg-[#faf7f5] pb-24">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-[#26152d] via-[#3a1d3a] to-[#26152d] text-white py-14 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-18 h-18 rounded-full bg-[#b86b86]/30 border-2 border-[#b86b86] text-[#e8a3b8] mb-5 shadow-lg">
            <CheckCircle2 className="w-10 h-10 text-[#d4af37]" />
          </div>

          <div className="inline-block px-3 py-1 bg-[#b86b86]/20 border border-[#b86b86]/40 rounded-full text-xs font-semibold tracking-wider uppercase text-pink-200 mb-3">
            Application Received • Verification In Progress
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">
            Welcome to the STENZA Collective
          </h1>
          <p className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Thank you, <span className="font-semibold text-white">{application.applicantName}</span>. Your artisan accreditation request for{' '}
            <span className="font-semibold text-[#f5d0b5]">{application.businessName}</span> has been logged into our South African compliance queue.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        {/* Reference & Status Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200/80 p-6 sm:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-stone-100">
            {/* Reference */}
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
                Application Reference ID
              </span>
              <div className="font-mono text-xl font-bold text-[#26152d] flex items-center gap-2">
                {application.id}
              </div>
              <p className="text-xs text-stone-500">Keep this reference for all inquiries</p>
            </div>

            {/* Status */}
            <div className="space-y-1 md:pl-6 pt-4 md:pt-0">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
                Current Workflow Status
              </span>
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  <Clock className="w-3.5 h-3.5 animate-pulse text-amber-600" />
                  Pending Admin Approval
                </span>
              </div>
              <p className="text-xs text-stone-500">Assigned to STENZA Compliance Team</p>
            </div>

            {/* Submission Date */}
            <div className="space-y-1 md:pl-6 pt-4 md:pt-0">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
                Submission Timestamp
              </span>
              <div className="text-sm font-semibold text-stone-800">
                {application.submissionDate || 'Just now (SAST)'}
              </div>
              <p className="text-xs text-stone-500">Expected SLA: 24–48 Business Hours</p>
            </div>
          </div>
        </div>

        {/* Workflow Pipeline Rule Callout */}
        <div className="bg-linear-to-r from-amber-50 to-orange-50/60 border-l-4 border-amber-500 rounded-r-xl p-5 mb-8 shadow-xs">
          <div className="flex items-start gap-3.5">
            <ShieldCheck className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wide">
                Strict Quality & Safety Policy Notice
              </h3>
              <p className="text-xs sm:text-sm text-amber-800 mt-1 leading-relaxed">
                In accordance with STENZA Beauty Marketplace standards and South African municipal hygiene regulations, 
                <strong className="font-semibold text-stone-900"> pending artisan studios cannot be published to the public catalog</strong> until an administrator verifies your CIPC registration, trade qualifications, and identity document.
              </p>
            </div>
          </div>
        </div>

        {/* What Happens Next Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200/80 p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-serif font-bold text-[#26152d] mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#b86b86]" />
            What Happens Next in Your Approval Workflow
          </h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-full bg-[#b86b86]/10 text-[#b86b86] font-bold flex items-center justify-center shrink-0 border border-[#b86b86]/30 text-sm">
                1
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">Document & Accreditation Audit (Within 24 Hours)</h4>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                  Our verification officers inspect your uploaded trade diplomas ({application.documents.length} documents attached), CIPC company active status, and municipal hygiene certificates.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-full bg-[#b86b86]/10 text-[#b86b86] font-bold flex items-center justify-center shrink-0 border border-[#b86b86]/30 text-sm">
                2
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">Telephone / WhatsApp Studio Onboarding Call</h4>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                  A STENZA Artisan Concierge may reach out via <span className="font-medium text-stone-800">{application.phone}</span> to confirm your house-call boundaries ({application.serviceRadius}) and service pricing.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-full bg-[#b86b86]/10 text-[#b86b86] font-bold flex items-center justify-center shrink-0 border border-[#b86b86]/30 text-sm">
                3
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">Full Studio Marketplace Activation</h4>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                  Once your status changes to <span className="text-emerald-700 font-semibold">Approved</span>, your Studio Profile editor unlocks the <span className="font-medium text-stone-800">"Publish Studio"</span> toggle, welcoming clients from Sandton, Rosebank, and Pretoria.
                </p>
              </div>
            </div>
          </div>

          {/* Uploaded Documents Summary */}
          <div className="mt-8 pt-6 border-t border-stone-100">
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
              Submitted Credentials ({application.documents.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {application.documents.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <FileText className="w-5 h-5 text-stone-500 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-stone-800 truncate">{doc.title}</p>
                    <p className="text-[11px] text-stone-500">{doc.type} • {doc.fileSize}</p>
                  </div>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                    Queued
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('artisan_dashboard')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#26152d] text-white rounded-xl font-medium text-sm hover:bg-[#3a1d3a] transition-all shadow-md group cursor-pointer"
            >
              <span>Go to Artisan Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('studio_preview')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-stone-100 text-stone-800 rounded-xl font-medium text-sm hover:bg-stone-200 transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4 text-stone-600" />
              <span>Preview Studio (Draft)</span>
            </button>
          </div>

          {/* Quick Simulation Trigger for Evaluators / Admins */}
          <button
            onClick={onOpenAdminReview}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-pink-50 text-[#b86b86] hover:bg-pink-100 border border-[#b86b86]/30 rounded-xl font-medium text-xs transition-all cursor-pointer w-full sm:w-auto"
            title="Demonstration shortcut to simulate administrative decision making"
          >
            <ShieldCheck className="w-4 h-4 text-[#b86b86]" />
            <span>Open Admin Review (Demo Action)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
