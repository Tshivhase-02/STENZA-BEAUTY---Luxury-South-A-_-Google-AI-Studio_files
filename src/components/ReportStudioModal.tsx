import React, { useState, useEffect } from 'react';
import { 
  Flag, 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Upload, 
  FileText, 
  Info, 
  Paperclip, 
  Trash2, 
  Lock, 
  ArrowRight,
  ExternalLink,
  CalendarCheck
} from 'lucide-react';
import { ReportCategory, StudioReport } from '../types/admin';
import { adminService } from '../services/adminService';

interface ReportStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  studioId: string;
  studioName: string;
  bookingRefInitial?: string;
  isLoggedIn?: boolean;
  currentUserName?: string;
  currentUserEmail?: string;
  currentUserId?: string;
  onRequireLogin?: () => void;
  onViewMyReports?: () => void;
  onSuccess?: (report: StudioReport) => void;
}

const REPORT_REASONS: { category: ReportCategory; label: string; desc: string }[] = [
  {
    category: 'scam_fraud',
    label: 'Scam or fraud',
    desc: 'Unverified payments, suspicious links, deposit theft, or identity deception.'
  },
  {
    category: 'harassment',
    label: 'Mistreated or harassed',
    desc: 'Verbal, discriminatory, threatening, or hostile conduct toward clients.'
  },
  {
    category: 'misleading_pricing',
    label: 'Misleading prices or services',
    desc: 'Discrepancy between advertised price on STENZA and unexpected in-studio surcharges.'
  },
  {
    category: 'unsafe_conduct',
    label: 'Unsafe or unprofessional behaviour',
    desc: 'Unsanitary tools, health hazards, negligence, lack of hygiene, or physical discomfort.'
  },
  {
    category: 'fake_studio',
    label: 'Fake studio or suspicious activity',
    desc: 'Studio does not physically exist, stolen imagery, or duplicate unverified listing.'
  },
  {
    category: 'other',
    label: 'Other',
    desc: 'Other serious breach of STENZA marketplace conduct or municipal standards.'
  }
];

export const ReportStudioModal: React.FC<ReportStudioModalProps> = ({
  isOpen,
  onClose,
  studioId,
  studioName,
  bookingRefInitial,
  isLoggedIn = false,
  currentUserName = 'Naledi Mokwena',
  currentUserEmail = 'naledi.mokwena@stenzabeauty.co.za',
  currentUserId = 'usr-client-01',
  onRequireLogin,
  onViewMyReports,
  onSuccess,
}) => {
  const [category, setCategory] = useState<ReportCategory>('misleading_pricing');
  const [description, setDescription] = useState('');
  const [bookedThroughStenza, setBookedThroughStenza] = useState(true);
  const [bookingRef, setBookingRef] = useState(bookingRefInitial || '');
  
  // Evidence attachments state
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; previewUrl: string } | null>(null);
  
  // Confirmation & validation
  const [confirmedTruthful, setConfirmedTruthful] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Success state with unique server reference
  const [submittedReport, setSubmittedReport] = useState<StudioReport | null>(null);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setSubmittedReport(null);
      setValidationError(null);
      setIsSubmitting(false);
      if (bookingRefInitial) {
        setBookingRef(bookingRefInitial);
        setBookedThroughStenza(true);
      }
    }
  }, [isOpen, bookingRefInitial]);

  if (!isOpen) return null;

  // Handle mock file selection (e.g. receipts or screenshots)
  const handleSimulateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const mockSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      const preview = URL.createObjectURL(file);
      setAttachedFile({
        name: file.name,
        size: mockSize,
        previewUrl: preview
      });
      setEvidenceUrl('');
    }
  };

  const handleRemoveAttachedFile = () => {
    setAttachedFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!isLoggedIn) {
      setValidationError('You must be signed in to submit a verification report.');
      return;
    }

    if (!category) {
      setValidationError('Please select a reason for your report.');
      return;
    }

    if (description.trim().length < 20) {
      setValidationError('Please provide a description of at least 20 characters explaining the issue.');
      return;
    }

    if (description.trim().length > 1000) {
      setValidationError('Description exceeds the maximum limit of 1000 characters.');
      return;
    }

    if (!confirmedTruthful) {
      setValidationError('Please confirm that your report is submitted in good faith and accurate.');
      return;
    }

    setIsSubmitting(true);

    // Call dedicated report API service (prepared for POST /api/studios/{studioId}/reports)
    setTimeout(() => {
      try {
        const newReport = adminService.submitCustomerReport({
          studioId,
          studioName,
          reporterUserId: currentUserId,
          reporterName: currentUserName,
          reporterEmail: currentUserEmail,
          category,
          description: description.trim(),
          bookedThroughStenza,
          bookingRef: bookedThroughStenza && bookingRef.trim() ? bookingRef.trim() : undefined,
          evidenceUrl: attachedFile?.previewUrl || evidenceUrl.trim() || undefined,
          evidenceFileName: attachedFile?.name
        });

        setIsSubmitting(false);
        setSubmittedReport(newReport);
        onSuccess?.(newReport);
      } catch (err) {
        setIsSubmitting(false);
        setValidationError('Failed to transmit report. Please try again.');
      }
    }, 600);
  };

  const handleResetAndClose = () => {
    setSubmittedReport(null);
    setDescription('');
    setBookingRef('');
    setEvidenceUrl('');
    setAttachedFile(null);
    setConfirmedTruthful(false);
    setValidationError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-[#1b0d21] text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold tracking-widest uppercase bg-rose-900/90 text-rose-200 px-2 py-0.5 rounded border border-rose-700/50">
              TRUST & SAFETY DESK
            </span>
            <span className="text-xs text-stone-400">POPIA Act 4 of 2013 Audited</span>
          </div>

          <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
            <Flag className="w-5 h-5 text-rose-400" />
            <span>Report Studio or Safety Concern</span>
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            Target Studio: <strong className="text-white">{studioName}</strong>
          </p>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1 space-y-5">
          
          {/* STEP 1: If User is Not Logged In, enforce authentication */}
          {!isLoggedIn ? (
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Authentication Required
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto mt-1">
                  To protect our accredited beauty artisans against unverified spam and false claims, reports must be submitted by an authenticated STENZA account holder.
                </p>
              </div>

              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-left text-xs text-stone-600 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-stone-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Your Privacy is Guaranteed</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Your identity is protected under the South African Protection of Personal Information Act (POPIA). Your contact details are never exposed to the reported salon without your explicit consent.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onRequireLogin) onRequireLogin();
                  }}
                  className="w-full py-3 bg-[#b86b86] hover:bg-[#a25974] text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Sign In or Register to Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full py-2.5 text-xs text-stone-500 hover:text-stone-800 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>

          ) : submittedReport ? (
            /* STEP 2: Submission Success Screen */
            <div className="text-center space-y-4 py-4 animate-in fade-in duration-200">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Transmitted to STENZA Compliance Desk
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mt-2">
                  Report Successfully Logged
                </h3>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-left space-y-2">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-200">
                  <span className="text-stone-500 font-semibold">Report Reference:</span>
                  <span className="font-mono font-bold text-base text-[#b86b86]">{submittedReport.id}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Reported Studio:</span>
                  <span className="font-semibold text-stone-800">{submittedReport.studioName}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Reason Category:</span>
                  <span className="font-semibold text-stone-800">{submittedReport.categoryLabel}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Date Logged:</span>
                  <span className="font-semibold text-stone-800">{submittedReport.dateSubmitted}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Investigation Status:</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    OPEN (Under Queue Review)
                  </span>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                Thank you for helping keep the STENZA luxury beauty community verified and honest. A compliance officer will review your report, audit the studio's pricing/records, and notify you of findings.
              </p>

              <div className="pt-2 space-y-2">
                {onViewMyReports && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onViewMyReports();
                    }}
                    className="w-full py-3 bg-[#26152d] hover:bg-[#39263f] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <FileText className="w-4 h-4 text-[#d4af37]" />
                    <span>View My Submitted Reports & Status</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Return to Studio Profile
                </button>
              </div>
            </div>

          ) : (
            /* STEP 3: Report Intake Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Authenticated Reporter Identity Pill */}
              <div className="p-3 bg-purple-50/70 border border-purple-200/80 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#695684] text-white flex items-center justify-center text-xs font-bold">
                    {currentUserName.charAt(0)}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#695684] block">Reporting as Client</span>
                    <span className="font-semibold text-stone-900">{currentUserName}</span>
                    <span className="text-stone-500 text-[11px] ml-1.5">({currentUserEmail})</span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Verified Client
                </span>
              </div>

              {/* Validation Error banner */}
              {validationError && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* 1. Reason Selection */}
              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                  Select a Reason for this Report <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {REPORT_REASONS.map((r) => {
                    const isSelected = category === r.category;
                    return (
                      <label
                        key={r.category}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition text-xs ${
                          isSelected
                            ? 'border-[#b86b86] bg-pink-50/40 text-stone-900 shadow-2xs'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="report_reason"
                          value={r.category}
                          checked={isSelected}
                          onChange={() => setCategory(r.category)}
                          className="mt-0.5 accent-[#b86b86]"
                        />
                        <div>
                          <div className="font-bold text-stone-900">{r.label}</div>
                          <div className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">{r.desc}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 2. Indication of Booking Through STENZA */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5">
                <label className="flex items-center gap-2.5 text-xs text-stone-800 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bookedThroughStenza}
                    onChange={(e) => setBookedThroughStenza(e.target.checked)}
                    className="accent-[#b86b86] rounded w-4 h-4"
                  />
                  <span>I booked or paid for an appointment with this studio through STENZA BEAUTY</span>
                </label>

                {bookedThroughStenza && (
                  <div className="pl-6 pt-1">
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Booking Reference or Treatment Details (Optional)
                    </label>
                    <input
                      type="text"
                      value={bookingRef}
                      onChange={(e) => setBookingRef(e.target.value)}
                      placeholder="e.g. STZ-BK-9812 or Gel Manicure on 24 Oct"
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-hidden focus:border-[#b86b86]"
                    />
                  </div>
                )}
              </div>

              {/* 3. Detailed Description with Live Character Count */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                    Description of What Happened <span className="text-rose-500">*</span>
                  </label>
                  <span className={`text-[10px] font-mono ${
                    description.length < 20 ? 'text-amber-600 font-bold' : description.length > 900 ? 'text-rose-600' : 'text-stone-400'
                  }`}>
                    {description.length} / 1000 (min 20)
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe what occurred in detail: what prices were quoted, conduct experienced, dates, or communication with the studio..."
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:border-[#b86b86] focus:bg-white transition"
                />
                {description.length > 0 && description.length < 20 && (
                  <p className="text-[11px] text-amber-700 mt-1">
                    Please provide at least {20 - description.length} more characters so our compliance desk can investigate effectively.
                  </p>
                )}
              </div>

              {/* 4. Optional Evidence Attachments */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Supporting Evidence / Attachments (Optional)
                </label>
                
                {/* File Attachment Pill */}
                {attachedFile ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                      <div className="truncate">
                        <span className="font-semibold text-stone-900 block truncate">{attachedFile.name}</span>
                        <span className="text-[10px] text-stone-500 font-mono">{attachedFile.size}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveAttachedFile}
                      className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded-md transition cursor-pointer"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <label className="border border-dashed border-stone-300 hover:border-[#b86b86] p-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer bg-stone-50 hover:bg-white transition text-xs text-stone-600">
                      <Upload className="w-3.5 h-3.5 text-stone-500" />
                      <span>Upload Photo / Receipt</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleSimulateFileUpload}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="url"
                      value={evidenceUrl}
                      onChange={(e) => setEvidenceUrl(e.target.value)}
                      placeholder="Or paste screenshot link"
                      className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-hidden focus:border-[#b86b86]"
                    />
                  </div>
                )}
                <p className="text-[10px] text-stone-400">
                  Screenshots of bank transfers, WhatsApp chats, or invoices help expedite investigation.
                </p>
              </div>

              {/* 5. Privacy Notice & Truthfulness Confirmation */}
              <div className="space-y-3 pt-1">
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-[11px] text-stone-600 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>South Africa POPIA Act Notice:</strong> Your identity is kept strictly confidential. The reported studio is never given your private contact details without your consent.
                  </span>
                </div>

                <label className="flex items-start gap-2 text-xs text-stone-800 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={confirmedTruthful}
                    onChange={(e) => setConfirmedTruthful(e.target.checked)}
                    className="mt-0.5 accent-[#b86b86] rounded"
                  />
                  <span className="leading-tight">
                    I confirm that this report is submitted in good faith and represents an accurate account of what occurred. <span className="text-rose-500">*</span>
                  </span>
                </label>
              </div>

              {/* 6. Form Submission Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !confirmedTruthful || description.length < 20}
                  className="flex-2 py-3 bg-rose-700 hover:bg-rose-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Submitting to Compliance Desk...</span>
                    </>
                  ) : (
                    <>
                      <Flag className="w-3.5 h-3.5" />
                      <span>Submit Verification Report</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="bg-stone-50 border-t border-stone-200 px-6 py-2.5 text-[10px] text-stone-500 flex items-center justify-between shrink-0">
          <span>STENZA Trust, Safety & Ethics Portal</span>
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            256-Bit SSL Encrypted Intake
          </span>
        </div>
      </div>
    </div>
  );
};
