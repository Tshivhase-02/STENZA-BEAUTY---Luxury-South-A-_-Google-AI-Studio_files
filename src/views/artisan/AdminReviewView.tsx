import React, { useState } from 'react';
import { ArtisanApplication, ArtisanDocument, ApplicationStatus } from '../../data/artisanWorkflowData';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  FileText, 
  ExternalLink, 
  Eye, 
  Check, 
  X, 
  MessageSquare, 
  Building, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Car, 
  Calendar,
  Lock,
  ChevronRight,
  Info,
  ArrowLeft,
  Home,
  LogOut,
  Sliders
} from 'lucide-react';

interface AdminReviewViewProps {
  applications: ArtisanApplication[];
  onUpdateApplicationStatus: (
    appId: string, 
    newStatus: ApplicationStatus, 
    reason: string,
    reviewedBy: string
  ) => void;
  onNavigate: (view: string) => void;
  currentStudioId?: string;
  onSelectArtisanPreset?: (appId: string, studioId: string) => void;
  onLogoutAdmin?: () => void;
}

export const AdminReviewView: React.FC<AdminReviewViewProps> = ({
  applications,
  onUpdateApplicationStatus,
  onNavigate,
  currentStudioId,
  onSelectArtisanPreset,
  onLogoutAdmin,
}) => {
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Decision Modal State
  const [modalAction, setModalAction] = useState<'approve' | 'reject' | 'changes' | null>(null);
  const [decisionReason, setDecisionReason] = useState<string>('');
  const [modalError, setModalError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Document Viewer Preview Modal
  const [previewDoc, setPreviewDoc] = useState<ArtisanDocument | null>(null);

  const selectedApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  // Filtering
  const filteredApps = applications.filter((app) => {
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      case 'changes_requested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5" /> Changes Requested
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3.5 h-3.5" /> Pending Review
          </span>
        );
    }
  };

  const handleOpenActionModal = (action: 'approve' | 'reject' | 'changes') => {
    setModalAction(action);
    setModalError('');
    if (action === 'approve') {
      setDecisionReason(
        'Verified trade credentials, valid CIPC registration, and confirmed health & safety hygiene standard adherence.'
      );
    } else if (action === 'changes') {
      setDecisionReason(
        'Please upload a clearer certified copy of your South African National ID document and provide your physical premises certificate.'
      );
    } else {
      setDecisionReason('Unable to verify required beauty trade qualifications or commercial business presence.');
    }
  };

  const handleConfirmDecision = () => {
    if (!decisionReason.trim()) {
      setModalError('A decision reason is mandatory for auditing and artisan feedback.');
      return;
    }

    if (!selectedApp) return;

    setIsSubmitting(true);
    let newStatus: ApplicationStatus = 'pending';
    if (modalAction === 'approve') newStatus = 'approved';
    if (modalAction === 'reject') newStatus = 'rejected';
    if (modalAction === 'changes') newStatus = 'changes_requested';

    setTimeout(() => {
      onUpdateApplicationStatus(selectedApp.id, newStatus, decisionReason, 'Admin (Compliance Desk)');
      setIsSubmitting(false);
      setModalAction(null);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-between">
      <div>
        {/* Dedicated Admin Top Header Bar */}
        <header className="bg-[#1b0d21] text-white border-b border-stone-800 shadow-md sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Left: Branding & Role */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#d4af37]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-widest uppercase bg-emerald-700 text-white px-2 py-0.5 rounded shadow-2xs">
                    ADMIN PORTAL
                  </span>
                  <span className="text-[11px] text-stone-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Officer: Govender M. (Compliance Desk)
                  </span>
                </div>
                <h1 className="text-base sm:text-lg font-serif font-bold text-white tracking-tight">
                  Artisan Accreditation & Studio Governance
                </h1>
              </div>
            </div>

            {/* Center: Test Application Preset Quick Switcher */}
            {onSelectArtisanPreset && (
              <div className="hidden xl:flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
                <span className="text-[10px] uppercase font-bold text-stone-400 px-2 flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-[#d4af37]" />
                  Test Scenario:
                </span>
                <button
                  onClick={() => onSelectArtisanPreset('STZ-APP-2026-8812', 'studio-nompu-dermal')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    currentStudioId === 'studio-nompu-dermal'
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-400/50 font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                  title="Test evaluating a pending application"
                >
                  Pending App (Nompu Dermal)
                </button>
                <button
                  onClick={() => onSelectArtisanPreset('STZ-APP-2026-7540', 'luxe-nail-studio')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    currentStudioId === 'luxe-nail-studio'
                      ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/50 font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                  title="Test an already approved and accredited studio"
                >
                  Approved Studio (Luxe Nail)
                </button>
              </div>
            )}

            {/* Right: Actions & Return to User Page */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={() => onNavigate('artisan_dashboard')}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
                title="View Artisan Studio Dashboard"
              >
                <span>Artisan Suite</span>
              </button>

              {onLogoutAdmin && (
                <button
                  onClick={onLogoutAdmin}
                  className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-700/50 text-rose-200 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
                  title="Lock admin session and require Access ID to re-enter"
                >
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span>Lock Console</span>
                </button>
              )}

              {/* High-visibility primary action: Exit Admin and return to User Page */}
              <button
                onClick={() => onNavigate('home')}
                className="px-4 py-2 bg-[#b86b86] hover:bg-[#a25974] text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer border border-pink-300/30"
                title="Exit Administrator Portal and return to Client Marketplace"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to User Page</span>
              </button>
            </div>
          </div>
        </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Metric Summary Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">Total Submissions</p>
            <p className="text-2xl font-bold text-stone-900 mt-1">{applications.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/20 shadow-2xs">
            <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">Pending Action</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              {applications.filter((a) => a.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-2xs">
            <p className="text-xs font-medium text-amber-700 uppercase tracking-wide">Changes Requested</p>
            <p className="text-2xl font-bold text-amber-900 mt-1">
              {applications.filter((a) => a.status === 'changes_requested').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
            <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Approved Studios</p>
            <p className="text-2xl font-bold text-emerald-900 mt-1">
              {applications.filter((a) => a.status === 'approved').length}
            </p>
          </div>
        </div>

        {/* Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Applications List (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4">
              {/* Search */}
              <div className="relative mb-3">
                <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search applicant, studio or ref..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:border-[#b86b86]"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex gap-1 overflow-x-auto pb-1 mb-3 text-[11px] font-medium text-stone-600">
                {['all', 'pending', 'changes_requested', 'approved', 'rejected'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2.5 py-1 rounded-md shrink-0 capitalize cursor-pointer transition ${
                      filterStatus === st
                        ? 'bg-[#26152d] text-white font-semibold'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    {st === 'changes_requested' ? 'Changes' : st}
                  </button>
                ))}
              </div>

              {/* Applications List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {filteredApps.length === 0 ? (
                  <div className="text-center py-8 text-stone-400 text-xs">
                    No applications match current filters.
                  </div>
                ) : (
                  filteredApps.map((app) => {
                    const isSelected = app.id === selectedApp?.id;
                    return (
                      <div
                        key={app.id}
                        onClick={() => setSelectedAppId(app.id)}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-pink-50/60 border-[#b86b86] shadow-xs'
                            : 'bg-white hover:bg-stone-50 border-stone-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="font-mono text-[10px] text-stone-500 font-bold">{app.id}</span>
                          {getStatusBadge(app.status)}
                        </div>
                        <h4 className="text-sm font-bold text-stone-900 truncate">{app.businessName}</h4>
                        <p className="text-xs text-stone-600">{app.applicantName} • {app.category}</p>
                        <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2 pt-2 border-t border-stone-100">
                          <span>{app.city}</span>
                          <span>{app.documents.length} docs</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Review & Actions (8 cols) */}
          <div className="lg:col-span-8">
            {selectedApp ? (
              <div className="space-y-6">
                {/* Header & Main Status */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-[#b86b86] bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                          {selectedApp.id}
                        </span>
                        <span className="text-xs text-stone-500">Submitted: {selectedApp.submissionDate}</span>
                      </div>
                      <h2 className="text-2xl font-serif font-bold text-[#26152d]">
                        {selectedApp.businessName}
                      </h2>
                      <p className="text-sm text-stone-600">
                        Applicant: <strong className="text-stone-900">{selectedApp.applicantName}</strong> • {selectedApp.category} ({selectedApp.experienceYears} Years Exp.)
                      </p>
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-1">
                      <span className="text-xs uppercase font-semibold text-stone-400">Current Status</span>
                      {getStatusBadge(selectedApp.status)}
                    </div>
                  </div>

                  {/* Previous Admin Review Notes (if already decided or changes requested) */}
                  {selectedApp.adminDecisionReason && (
                    <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
                      <div className="flex items-center gap-2 text-xs font-bold text-stone-700 uppercase mb-1">
                        <MessageSquare className="w-3.5 h-3.5 text-[#b86b86]" />
                        Official Decision Log • {selectedApp.reviewedBy || 'Admin Desk'} ({selectedApp.reviewedAt})
                      </div>
                      <p className="text-xs sm:text-sm text-stone-800 italic">
                        "{selectedApp.adminDecisionReason}"
                      </p>
                    </div>
                  )}

                  {/* Applicant Detail Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-xs sm:text-sm">
                    {/* Column 1 */}
                    <div className="space-y-3 bg-stone-50/60 p-4 rounded-xl border border-stone-100">
                      <h4 className="font-bold text-stone-800 uppercase tracking-wider text-xs flex items-center gap-1.5">
                        <User className="w-4 h-4 text-stone-500" />
                        Identity & Contact Verification
                      </h4>
                      <div>
                        <span className="text-stone-500 text-xs block">South African ID Number</span>
                        <span className="font-mono font-semibold text-stone-900">{selectedApp.idNumber}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 text-xs block">Contact Phone / WhatsApp</span>
                        <span className="font-semibold text-stone-900">{selectedApp.phone}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 text-xs block">Email Address</span>
                        <span className="font-semibold text-stone-900">{selectedApp.email}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 text-xs block">Social / Portfolio Handle</span>
                        <span className="font-semibold text-[#b86b86]">{selectedApp.instagram}</span>
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-3 bg-stone-50/60 p-4 rounded-xl border border-stone-100">
                      <h4 className="font-bold text-stone-800 uppercase tracking-wider text-xs flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-stone-500" />
                        Studio Location & House Calls
                      </h4>
                      <div>
                        <span className="text-stone-500 text-xs block">Physical Studio Address</span>
                        <span className="font-semibold text-stone-900 leading-tight block">{selectedApp.address}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 text-xs block">House Calls / Mobile Option</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                          {selectedApp.offersHouseCalls ? '✓ Yes, Mobile Service Enabled' : 'No (Studio Only)'}
                        </span>
                      </div>
                      {selectedApp.offersHouseCalls && (
                        <div>
                          <span className="text-stone-500 text-xs block">Mobile Radius & Base Travel Fee</span>
                          <span className="font-semibold text-stone-900">
                            {selectedApp.serviceRadius} • <strong className="text-stone-900">R{selectedApp.travelFee}</strong> base
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-stone-500 text-xs block">Terms & POPIA Consent</span>
                        <span className="font-medium text-emerald-800">
                          ✓ Confirmed & Legally Bound (POPIA SA Act 4 of 2013)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                      Professional Statement / Bio
                    </span>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      {selectedApp.bio}
                    </p>
                  </div>

                  {/* Submitted Working Schedule Audit */}
                  {selectedApp.workingHours && selectedApp.workingHours.length > 0 && (
                    <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#b86b86]" />
                          Submitted Weekly Operating Schedule ({selectedApp.workingHours.filter(d => d.isOpen).length} Working Days)
                        </span>
                        <span className="text-[11px] text-stone-500 font-mono">
                          South Africa Standard Time (SAST)
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
                        {selectedApp.workingHours.map((d) => (
                          <div
                            key={d.day}
                            className={`p-2 rounded-lg border text-center ${
                              d.isOpen
                                ? 'bg-white border-stone-200'
                                : 'bg-stone-100/70 border-stone-200/50 text-stone-400'
                            }`}
                          >
                            <span className="font-bold text-stone-900 block text-[11px]">{d.day.slice(0, 3)}</span>
                            {d.isOpen ? (
                              <div>
                                <span className="font-mono text-[10px] text-stone-700 font-semibold block mt-0.5">
                                  {d.openTime}–{d.closeTime}
                                </span>
                                {d.hasBreak && d.breakStartTime && (
                                  <span className="text-[9px] text-purple-700 block mt-0.5 font-medium">
                                    Brk {d.breakStartTime}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[10px] italic text-stone-400 mt-1 block">Off</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Verification Documents Review */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-[#26152d] flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#b86b86]" />
                      Uploaded Documents for Accreditation ({selectedApp.documents.length})
                    </h3>
                    <span className="text-xs text-stone-500">Click document to preview or audit</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedApp.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0">
                          <span className="inline-block text-[10px] font-semibold uppercase tracking-wider bg-stone-200 text-stone-700 px-2 py-0.5 rounded">
                            {doc.type}
                          </span>
                          <h5 className="text-xs font-bold text-stone-900 truncate">{doc.title}</h5>
                          <p className="text-[11px] text-stone-500 font-mono">
                            {doc.fileName} • {doc.fileSize}
                          </p>
                        </div>

                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="px-2.5 py-1.5 bg-white border border-stone-200 hover:border-stone-400 text-stone-700 text-xs rounded-lg font-medium flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-stone-500" />
                          <span>Audit</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Administrator Action Bar */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-[#26152d]">Administrative Decision</h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Enforce marketplace standards. Approving grants the artisan full capability to publish their studio profile.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Request Changes */}
                      <button
                        onClick={() => handleOpenActionModal('changes')}
                        className="px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <AlertCircle className="w-4 h-4 text-amber-700" />
                        <span>Request Changes</span>
                      </button>

                      {/* Reject */}
                      <button
                        onClick={() => handleOpenActionModal('reject')}
                        className="px-4 py-2.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <X className="w-4 h-4 text-rose-700" />
                        <span>Reject</span>
                      </button>

                      {/* Approve */}
                      <button
                        onClick={() => handleOpenActionModal('approve')}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve Application</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
                Select an artisan application from the list to review details.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation & Decision Reason Dialog */}
      {modalAction && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                {modalAction === 'approve' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                {modalAction === 'reject' && <XCircle className="w-5 h-5 text-rose-600" />}
                {modalAction === 'changes' && <AlertCircle className="w-5 h-5 text-amber-600" />}
                <h3 className="text-base font-bold text-stone-900 capitalize">
                  Confirm Decision: {modalAction === 'changes' ? 'Request Changes' : modalAction}
                </h3>
              </div>
              <button
                onClick={() => setModalAction(null)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 mb-4">
              You are about to modify the accreditation status for{' '}
              <strong className="text-stone-900">{selectedApp?.businessName}</strong>. This action will be logged in the permanent audit trail and sent to the artisan.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Decision Note & Justification <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={decisionReason}
                onChange={(e) => setDecisionReason(e.target.value)}
                placeholder="Specify the reason or feedback for this decision..."
                className="w-full text-xs p-3 border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
              />
              {modalError && (
                <p className="text-xs text-rose-600 font-medium mt-1">{modalError}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                onClick={() => setModalAction(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecision}
                disabled={isSubmitting}
                className={`px-5 py-2 text-xs font-bold rounded-xl text-white transition cursor-pointer ${
                  modalAction === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : modalAction === 'reject'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {isSubmitting ? 'Recording Decision...' : 'Confirm & Notify Artisan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Audit Inspection Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                  {previewDoc.type}
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-1">{previewDoc.title}</h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document simulated preview */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 text-center mb-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-stone-200/70 flex items-center justify-center text-stone-500 mb-3">
                <FileText className="w-8 h-8" />
              </div>
              <p className="font-mono text-xs font-bold text-stone-800">{previewDoc.fileName}</p>
              <p className="text-xs text-stone-500 mt-1">
                File Size: {previewDoc.fileSize} • Uploaded: {previewDoc.uploadDate}
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-stone-200 text-stone-700 rounded-lg text-xs font-medium">
                <span>South African Verified PDF Container</span>
              </div>
            </div>

            <div className="text-xs text-stone-500 bg-amber-50 border border-amber-200 p-3 rounded-lg mb-4 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                Compliance officers must inspect for official municipal seals, valid CIPC registration stamps, and matching ID numbers before approving.
              </span>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-[#26152d] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Dedicated Admin Portal Footer */}
      <footer className="mt-16 border-t border-stone-800 bg-[#140a19] text-stone-400 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-stone-300">
              STENZA Beauty Administrative Engine & Accreditation Gateway • Version 2.4.0 (Enterprise RBAC)
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-400 flex-wrap">
            <span className="flex items-center gap-1 text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              POPIA Act 4 of 2013 Audited
            </span>
            <span className="text-stone-600">|</span>
            <span>RSA CIPC Business Register</span>
            <span className="text-stone-600">|</span>
            <button 
              onClick={() => onNavigate('home')} 
              className="text-pink-300 hover:text-white font-semibold underline cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Return to User Marketplace</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
