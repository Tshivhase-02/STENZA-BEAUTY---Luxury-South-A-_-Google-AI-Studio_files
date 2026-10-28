import React, { useState } from 'react';
import { ArtisanApplication, ArtisanDocument, OperatingDay, DEFAULT_WEEKLY_SCHEDULE } from '../../data/artisanWorkflowData';
import { categoryService } from '../../services/categoryService';
import { 
  Clock, 
  Calendar, 
  Copy, 
  Check, 
  AlertCircle, 
  Info, 
  Coffee, 
  ChevronRight, 
  ChevronLeft,
  FileText,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Plus
} from 'lucide-react';

interface ArtisanRegistrationViewProps {
  onApplicationSubmitted: (app: ArtisanApplication) => void;
  onNavigate: (view: string) => void;
}

const ALL_DAYS: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'> = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const ArtisanRegistrationView: React.FC<ArtisanRegistrationViewProps> = ({
  onApplicationSubmitted,
  onNavigate,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  // Step 1: Personal Info
  const [applicantName, setApplicantName] = useState('Nompumelelo Sithole');
  const [email, setEmail] = useState('nompu.sithole@dermalclinic.co.za');
  const [phone, setPhone] = useState('83 490 1284');
  const [idNumber, setIdNumber] = useState('920415 0284 08 2');

  // Step 2: Business & Specialty
  const [businessName, setBusinessName] = useState('Nompumelelo Dermal Lab & Skin Clinic');
  const [category, setCategory] = useState('Clinical Skincare');
  const [experienceYears, setExperienceYears] = useState<number>(6);
  const [bio, setBio] = useState(
    'Specialist medical aesthetician with clinical certification in non-invasive skin rejuvenation, chemical peeling, and hyperpigmentation therapy for African skin tones.'
  );
  const [instagram, setInstagram] = useState('@nompu_dermallab');
  const [website, setWebsite] = useState('https://www.nompudermal.co.za');

  // Step 3: Location & House Calls
  const [city, setCity] = useState('Johannesburg');
  const [suburb, setSuburb] = useState('Sandton Central');
  const [address, setAddress] = useState('Suite 204, Sandton City Atrium, 83 Rivonia Rd, Sandton, 2196');
  const [offersHouseCalls, setOffersHouseCalls] = useState(true);
  const [serviceRadius, setServiceRadius] = useState('Sandton, Morningside, Bryanston & Hyde Park (15km)');
  const [travelFee, setTravelFee] = useState<number>(200);

  // Step 4: Dedicated Working Days & Hours
  const [workingSchedule, setWorkingSchedule] = useState<OperatingDay[]>(DEFAULT_WEEKLY_SCHEDULE);
  const [copySourceDay, setCopySourceDay] = useState<string>('Monday');
  const [copySuccessToast, setCopySuccessToast] = useState<string | null>(null);

  // Step 5: Verification Documents
  const [documents, setDocuments] = useState<ArtisanDocument[]>([
    {
      id: 'doc-1',
      title: 'CIDESCO Diploma in Aesthetics & Skincare',
      type: 'Trade Certificate',
      fileName: 'CIDESCO_Diploma_N_Sithole.pdf',
      fileSize: '2.4 MB',
      uploadDate: 'Today',
      verified: false,
    },
    {
      id: 'doc-2',
      title: 'CIPC Company Registration Certificate',
      type: 'CIPC Registration',
      fileName: 'CIPC_CoReg_2024_981244_07.pdf',
      fileSize: '1.1 MB',
      uploadDate: 'Today',
      verified: false,
    },
    {
      id: 'doc-3',
      title: 'Certified South African National ID Document',
      type: 'South African ID',
      fileName: 'SA_ID_N_Sithole_Certified.pdf',
      fileSize: '750 KB',
      uploadDate: 'Today',
      verified: false,
    }
  ]);
  const [newDocType, setNewDocType] = useState<ArtisanDocument['type']>('Health & Hygiene Permit');
  const [newDocTitle, setNewDocTitle] = useState('');

  // Step 6: Terms & POPIA
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [popiaConsent, setPopiaConsent] = useState(true);
  const [escrowAccepted, setEscrowAccepted] = useState(true);

  // Working Hours handlers
  const handleToggleDayOpen = (dayName: string) => {
    setWorkingSchedule((prev) =>
      prev.map((item) =>
        item.day === dayName ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  const handleUpdateDayTime = (
    dayName: string,
    field: 'openTime' | 'closeTime' | 'breakStartTime' | 'breakEndTime',
    val: string
  ) => {
    setWorkingSchedule((prev) =>
      prev.map((item) =>
        item.day === dayName ? { ...item, [field]: val } : item
      )
    );
  };

  const handleToggleDayBreak = (dayName: string) => {
    setWorkingSchedule((prev) =>
      prev.map((item) =>
        item.day === dayName
          ? {
              ...item,
              hasBreak: !item.hasBreak,
              breakStartTime: item.breakStartTime || '13:00',
              breakEndTime: item.breakEndTime || '14:00',
            }
          : item
      )
    );
  };

  // Copy hours to all selected open days
  const handleCopyHoursToAll = () => {
    const source = workingSchedule.find((item) => item.day === copySourceDay);
    if (!source) return;

    setWorkingSchedule((prev) =>
      prev.map((item) => {
        // Only copy to days that are marked as available
        if (item.isOpen) {
          return {
            ...item,
            openTime: source.openTime,
            closeTime: source.closeTime,
            hasBreak: source.hasBreak,
            breakStartTime: source.breakStartTime,
            breakEndTime: source.breakEndTime,
          };
        }
        return item;
      })
    );

    setCopySuccessToast(`Copied ${copySourceDay}'s hours (${source.openTime}–${source.closeTime}) to all open working days.`);
    setTimeout(() => setCopySuccessToast(null), 3000);
  };

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!applicantName.trim()) errs.applicantName = 'Full name is required';
      if (!email.trim() || !email.includes('@')) errs.email = 'A valid email is required';
      if (!phone.trim()) errs.phone = 'Mobile number is required';
      if (!idNumber.trim()) errs.idNumber = 'South African ID or passport number is required';
    } else if (step === 2) {
      if (!businessName.trim()) errs.businessName = 'Business or studio name is required';
      if (!bio.trim() || bio.length < 20) errs.bio = 'Please provide a descriptive bio (at least 20 characters)';
    } else if (step === 3) {
      if (!address.trim()) errs.address = 'Studio physical address is required';
      if (!suburb.trim()) errs.suburb = 'Suburb is required';
    } else if (step === 4) {
      // Validate working schedule
      const anyOpen = workingSchedule.some((d) => d.isOpen);
      if (!anyOpen) {
        errs.schedule = 'Please select at least one active working day.';
      } else {
        // Validate each open day: closeTime > openTime
        for (const day of workingSchedule) {
          if (day.isOpen) {
            if (day.closeTime <= day.openTime) {
              errs.schedule = `${day.day}: Closing time (${day.closeTime}) must be later than start time (${day.openTime}).`;
              break;
            }
            if (day.hasBreak) {
              if (
                day.breakStartTime &&
                day.breakEndTime &&
                day.breakEndTime <= day.breakStartTime
              ) {
                errs.schedule = `${day.day}: Break end time must be later than break start time.`;
                break;
              }
            }
          }
        }
      }
    } else if (step === 6) {
      if (!termsAccepted) errs.terms = 'You must accept the STENZA Artisan Marketplace Agreement';
      if (!popiaConsent) errs.popia = 'POPIA Act compliance consent is required by South African law';
      if (!escrowAccepted) errs.escrow = 'Escrow deposit release terms must be acknowledged';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(6, prev + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;

    const newDoc: ArtisanDocument = {
      id: `doc-${Date.now()}`,
      title: newDocTitle.trim(),
      type: newDocType,
      fileName: `${newDocTitle.replace(/\s+/g, '_')}.pdf`,
      fileSize: '1.2 MB',
      uploadDate: 'Just now',
      verified: false,
    };

    setDocuments((prev) => [...prev, newDoc]);
    setNewDocTitle('');
  };

  const handleRemoveDoc = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(6)) return;

    const refNumber = `STZ-APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: ArtisanApplication = {
      id: refNumber,
      applicantName,
      email,
      phone: `+27 ${phone.replace(/^\+27/, '').trim()}`,
      idNumber,
      businessName,
      category,
      experienceYears,
      city,
      suburb,
      address,
      offersHouseCalls,
      serviceRadius: offersHouseCalls ? serviceRadius : '',
      travelFee: offersHouseCalls ? travelFee : 0,
      bio,
      instagram,
      website: website || undefined,
      documents,
      workingHours: workingSchedule,
      termsAccepted,
      popiaConsent,
      status: 'pending',
      submissionDate: new Date().toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' SAST',
      updatedAt: 'Just now',
      studioId: `studio-${businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    };

    onApplicationSubmitted(newApp);
  };

  const steps = [
    { num: 1, title: 'Personal Details', desc: 'Identity & contact' },
    { num: 2, title: 'Business Profile', desc: 'Specialty & bio' },
    { num: 3, title: 'Location & Mobile', desc: 'Address & house calls' },
    { num: 4, title: 'Working Schedule', desc: 'Days, hours & breaks' },
    { num: 5, title: 'Accreditation', desc: 'Certificates & permits' },
    { num: 6, title: 'Review & Terms', desc: 'POPIA & escrow terms' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <span className="inline-block px-3 py-1 rounded-full bg-[#fbf0f4] border border-[#f0d0dc] text-[11px] font-bold text-[#b86b86] uppercase tracking-wider">
          Artisan Onboarding Gateway
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#26152d]">
          Register as a Verified STENZA Artisan
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
          Join South Africa’s premier verified network of master hairstylists, nail artists, dermal clinicians, and wellness spas.
        </p>
      </div>

      {/* Multi-Step Stepper Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#e5e0d8] shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {steps.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div
                key={s.num}
                className={`p-2.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-[#b86b86] bg-[#fbf0f4] shadow-xs'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/50'
                    : 'border-transparent bg-stone-50 opacity-70'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isCurrent
                        ? 'bg-[#b86b86] text-white'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-200 text-gray-600'
                    }`}
                  >
                    {isCompleted ? '✓' : s.num}
                  </div>
                  <span className="text-[11px] font-bold text-[#26152d] truncate">
                    {s.title}
                  </span>
                </div>
                <div className="text-[10px] text-gray-500 pl-6 hidden sm:block truncate">
                  {s.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Form Container */}
      <div className="bg-white rounded-3xl border border-[#e5e0d8] shadow-md p-6 sm:p-10">
        {/* STEP 1: Personal Details */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#26152d]">
                Step 1: Personal & Legal Identity
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Your legal name and South African identity details required for artisan verification and trust escrow payouts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#26152d] mb-1">
                  Full Legal Name (as per SA ID) *
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="e.g. Nompumelelo Sithole"
                  className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] outline-none"
                />
                {errors.applicantName && (
                  <p className="text-xs text-rose-500 mt-1">{errors.applicantName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#26152d] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nompu.sithole@dermalclinic.co.za"
                  className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] outline-none"
                />
                {errors.email && (
                  <p className="text-xs text-rose-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#26152d] mb-1">
                  South African Mobile (WhatsApp Booking Dispatch) *
                </label>
                <div className="flex">
                  <span className="p-3 bg-stone-100 border border-r-0 border-stone-300 rounded-l-xl text-xs font-semibold text-gray-700">
                    +27
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="83 490 1284"
                    className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-r-xl focus:border-[#b86b86] outline-none"
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#26152d] mb-1">
                  South African National ID Number / Valid Work Permit *
                </label>
                <input
                  type="text"
                  required
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="920415 0284 08 2"
                  className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] font-mono outline-none"
                />
                {errors.idNumber && (
                  <p className="text-xs text-rose-500 mt-1">{errors.idNumber}</p>
                )}
                <p className="text-[11px] text-gray-400 mt-1">
                  Encrypted & audited strictly according to POPIA Act compliance standards.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Business Profile */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#26152d]">
                Step 2: Studio Brand & Specialty
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Tell clients about your luxury brand, mastery level, and specialized beauty techniques.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#26152d] mb-1">
                  Trading Business Name / Studio Name *
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Nompumelelo Dermal Lab & Skin Clinic"
                  className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] outline-none"
                />
                {errors.businessName && (
                  <p className="text-xs text-rose-500 mt-1">{errors.businessName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#26152d] mb-1">
                  Primary Artisan Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] bg-white outline-none"
                >
                  {categoryService.getServiceCategories().map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name} — {cat.group}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#26152d] mb-1">
                  Years of Professional Experience *
                </label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#26152d] mb-1">
                  Artisan Biography & Craft Statement *
                </label>
                <textarea
                  rows={4}
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Detail your international certifications, signature aesthetic philosophy, and client care..."
                  className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] outline-none leading-relaxed"
                />
                {errors.bio && (
                  <p className="text-xs text-rose-500 mt-1">{errors.bio}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#26152d] mb-1">
                  Instagram Portfolio Handle *
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@nompu_dermallab"
                  className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#26152d] mb-1">
                  Website / Linktree (Optional)
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.nompudermal.co.za"
                  className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Location & House Calls */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#26152d]">
                Step 3: Studio Location & Mobile House Calls
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Define where clients will visit you and whether you provide on-site treatments at residences.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#26152d] mb-1">
                  Metropolitan Hub *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] bg-white outline-none"
                >
                  <option value="Johannesburg">Johannesburg (Sandton, Rosebank, Hyde Park)</option>
                  <option value="Cape Town">Cape Town (Camps Bay, Waterfront, Constantia)</option>
                  <option value="Pretoria">Pretoria (Menlyn Maine, Brooklyn, Waterkloof)</option>
                  <option value="Durban">Durban (Umhlanga Rocks, Morningside)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#26152d] mb-1">
                  Suburb / Precinct *
                </label>
                <input
                  type="text"
                  required
                  value={suburb}
                  onChange={(e) => setSuburb(e.target.value)}
                  placeholder="e.g. Sandton Central"
                  className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] outline-none"
                />
                {errors.suburb && (
                  <p className="text-xs text-rose-500 mt-1">{errors.suburb}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#26152d] mb-1">
                  Studio Street Address & Suite *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Suite 204, Sandton City Atrium, 83 Rivonia Rd, Sandton, 2196"
                  className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] outline-none"
                />
                {errors.address && (
                  <p className="text-xs text-rose-500 mt-1">{errors.address}</p>
                )}
              </div>
            </div>

            {/* Mobile House Calls Box */}
            <div className="p-5 rounded-2xl bg-[#faf7f5] border border-stone-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#26152d]">
                    Offer Mobile House Calls & At-Home Treatments
                  </h4>
                  <p className="text-xs text-gray-500">
                    Travel to clients' residences, offices, or bridal hotels in your region.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={offersHouseCalls}
                    onChange={(e) => setOffersHouseCalls(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b86b86]"></div>
                </label>
              </div>

              {offersHouseCalls && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-200">
                  <div>
                    <label className="block text-xs font-semibold text-[#26152d] mb-1">
                      Service Radius / Covered Suburbs
                    </label>
                    <input
                      type="text"
                      value={serviceRadius}
                      onChange={(e) => setServiceRadius(e.target.value)}
                      placeholder="e.g. Sandton, Morningside, Hyde Park (15km)"
                      className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#26152d] mb-1">
                      Base Travel Fee in South African Rand (ZAR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-xs font-bold text-gray-500">R</span>
                      <input
                        type="number"
                        min={0}
                        step={10}
                        value={travelFee}
                        onChange={(e) => setTravelFee(Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-3 border border-stone-300 rounded-xl focus:border-[#b86b86] bg-white font-bold text-xs sm:text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: Dedicated Working Days & Hours */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#b86b86]" />
                  <h3 className="font-serif text-xl font-bold text-[#26152d]">
                    Step 4: Working Days & Hours Schedule
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Specify your regular weekly studio availability, operating hours, and optional break intervals.
                </p>
              </div>

              {/* Quick Copy Hours Shortcut */}
              <div className="flex items-center gap-2">
                <select
                  value={copySourceDay}
                  onChange={(e) => setCopySourceDay(e.target.value)}
                  className="text-xs px-2.5 py-1.5 border border-stone-300 rounded-lg bg-stone-50 text-stone-800 font-medium focus:border-[#b86b86] outline-none"
                  title="Select source day to copy from"
                >
                  {workingSchedule.filter(d => d.isOpen).map(d => (
                    <option key={d.day} value={d.day}>Copy from {d.day}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleCopyHoursToAll}
                  className="px-3 py-1.5 bg-[#26152d] hover:bg-[#39263f] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5 text-pink-300" />
                  <span>Copy Hours</span>
                </button>
              </div>
            </div>

            {/* Copy Success Toast Banner */}
            {copySuccessToast && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{copySuccessToast}</span>
              </div>
            )}

            {/* Explanatory Policy Notice */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <strong className="block font-semibold mb-0.5">Scheduling Transparency Notice:</strong>
                These are your studio’s standard working hours. On the customer booking calendar, appointment availability will be dynamically filtered based on existing bookings, buffer periods, and treatment duration. You can edit these hours anytime after approval in your Studio Settings.
              </div>
            </div>

            {errors.schedule && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errors.schedule}</span>
              </div>
            )}

            {/* Days Selection & Hours Configuration List */}
            <div className="space-y-3">
              {workingSchedule.map((dayItem) => (
                <div
                  key={dayItem.day}
                  className={`p-4 rounded-2xl border transition-all ${
                    dayItem.isOpen
                      ? 'bg-white border-stone-200 shadow-2xs'
                      : 'bg-stone-50 border-stone-200/60 opacity-60'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Day Name & Toggle */}
                    <div className="flex items-center gap-3 w-48">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={dayItem.isOpen}
                          onChange={() => handleToggleDayOpen(dayItem.day)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>

                      <div>
                        <span className="text-sm font-bold text-[#26152d] block">
                          {dayItem.day}
                        </span>
                        <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                          dayItem.isOpen ? 'text-emerald-700' : 'text-stone-400'
                        }`}>
                          {dayItem.isOpen ? 'Working Day' : 'Unavailable'}
                        </span>
                      </div>
                    </div>

                    {/* Time Inputs or Unavailable Badge */}
                    {dayItem.isOpen ? (
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        {/* Start & Closing Time */}
                        <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
                          <span className="text-stone-500 font-medium">Hours:</span>
                          <input
                            type="time"
                            value={dayItem.openTime}
                            onChange={(e) => handleUpdateDayTime(dayItem.day, 'openTime', e.target.value)}
                            className="text-xs px-2 py-1 rounded bg-white border border-stone-300 font-mono font-semibold text-[#26152d] focus:border-[#b86b86] outline-none"
                          />
                          <span className="text-stone-400">to</span>
                          <input
                            type="time"
                            value={dayItem.closeTime}
                            onChange={(e) => handleUpdateDayTime(dayItem.day, 'closeTime', e.target.value)}
                            className="text-xs px-2 py-1 rounded bg-white border border-stone-300 font-mono font-semibold text-[#26152d] focus:border-[#b86b86] outline-none"
                          />
                        </div>

                        {/* Optional Break Toggle */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleDayBreak(dayItem.day)}
                            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                              dayItem.hasBreak
                                ? 'bg-purple-50 text-purple-900 border-purple-200'
                                : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                            }`}
                          >
                            <Coffee className="w-3.5 h-3.5" />
                            <span>{dayItem.hasBreak ? 'Break Enabled' : '+ Add Break'}</span>
                          </button>

                          {dayItem.hasBreak && (
                            <div className="flex items-center gap-1 bg-purple-50/70 px-2 py-1 rounded-lg border border-purple-200">
                              <input
                                type="time"
                                value={dayItem.breakStartTime || '13:00'}
                                onChange={(e) => handleUpdateDayTime(dayItem.day, 'breakStartTime', e.target.value)}
                                className="text-[11px] px-1.5 py-0.5 rounded bg-white border border-purple-200 font-mono"
                              />
                              <span className="text-stone-400 text-[10px]">to</span>
                              <input
                                type="time"
                                value={dayItem.breakEndTime || '14:00'}
                                onChange={(e) => handleUpdateDayTime(dayItem.day, 'breakEndTime', e.target.value)}
                                className="text-[11px] px-1.5 py-0.5 rounded bg-white border border-purple-200 font-mono"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-stone-400 italic">
                        Marked as unavailable for client appointments
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Verification Documents */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#26152d]">
                Step 5: Professional Accreditation & Compliance Documents
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Upload your beauty trade diplomas, CIPC business registration, or municipal health clearance permits.
              </p>
            </div>

            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-5 h-5 text-[#b86b86] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-800 truncate">{doc.title}</p>
                      <p className="text-[11px] text-gray-500">
                        {doc.type} • {doc.fileSize} • Uploaded {doc.uploadDate}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(doc.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 transition"
                    title="Remove document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Document Box */}
            <div className="p-4 rounded-xl border border-dashed border-stone-300 bg-stone-50/50 space-y-3">
              <h4 className="text-xs font-bold text-[#26152d] uppercase tracking-wider flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-[#b86b86]" />
                Add Trade Certificate or Municipal Permit
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value as ArtisanDocument['type'])}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg bg-white outline-none"
                  >
                    <option value="Trade Certificate">Trade Certificate (ITEC / CIDESCO)</option>
                    <option value="CIPC Registration">CIPC Company Registration</option>
                    <option value="Health & Hygiene Permit">Municipal Health Clearance</option>
                    <option value="Liability Insurance">Liability Insurance Policy</option>
                    <option value="South African ID">South African ID Document</option>
                  </select>
                </div>

                <div className="sm:col-span-2 flex gap-2">
                  <input
                    type="text"
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    placeholder="Document title (e.g. Master Lash Tech Certification)"
                    className="flex-1 text-xs p-2.5 border border-stone-300 rounded-lg bg-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddDocument}
                    className="px-4 py-2 bg-[#26152d] hover:bg-[#39263f] text-white text-xs font-bold rounded-lg transition shrink-0 cursor-pointer"
                  >
                    Attach PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Review & Terms */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#26152d]">
                Step 6: Review Dossier & Marketplace Consent
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Please verify your registration details before submitting for STENZA administrator review.
              </p>
            </div>

            {/* Summary Review Card */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-stone-200">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Studio</span>
                  <span className="font-bold text-stone-900 text-sm">{businessName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Applicant</span>
                  <span className="font-bold text-stone-900 text-sm">{applicantName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Contact</span>
                  <span className="text-stone-800">{phone} • {email}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Location</span>
                  <span className="text-stone-800">{suburb}, {city}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">House Calls</span>
                  <span className="text-stone-800">
                    {offersHouseCalls ? `Yes (+R${travelFee} base fee)` : 'Studio visits only'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Working Days</span>
                  <span className="text-stone-800">
                    {workingSchedule.filter(d => d.isOpen).length} active days configured
                  </span>
                </div>
              </div>

              {/* Working Hours Snapshot */}
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold mb-1.5">Weekly Working Hours</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  {workingSchedule.map((d) => (
                    <div key={d.day} className="p-1.5 rounded bg-white border border-stone-200">
                      <span className="font-bold text-stone-900 block">{d.day.slice(0, 3)}:</span>
                      {d.isOpen ? (
                        <span className="text-stone-600 font-mono text-[10px]">
                          {d.openTime}–{d.closeTime}
                          {d.hasBreak && ` (Brk ${d.breakStartTime})`}
                        </span>
                      ) : (
                        <span className="text-stone-400 italic text-[10px]">Unavailable</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-2.5 text-xs text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="accent-[#b86b86] rounded mt-0.5"
                />
                <span>
                  I accept the <strong>STENZA Beauty Marketplace Agreement</strong> and confirm that all submitted trade diplomas and hygiene records are genuine.
                </span>
              </label>

              <label className="flex items-start gap-2.5 text-xs text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={popiaConsent}
                  onChange={(e) => setPopiaConsent(e.target.checked)}
                  className="accent-[#b86b86] rounded mt-0.5"
                />
                <span>
                  I consent to the collection and verification of my South African identity and business credentials under the <strong>Protection of Personal Information Act (POPIA Act 4 of 2013)</strong>.
                </span>
              </label>

              <label className="flex items-start gap-2.5 text-xs text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={escrowAccepted}
                  onChange={(e) => setEscrowAccepted(e.target.checked)}
                  className="accent-[#b86b86] rounded mt-0.5"
                />
                <span>
                  I acknowledge that client appointment payments and house-call travel fees will be securely deposited via <strong>Paystack Escrow Protection</strong> and released upon treatment completion.
                </span>
              </label>

              {errors.terms && <p className="text-xs text-rose-500">{errors.terms}</p>}
              {errors.popia && <p className="text-xs text-rose-500">{errors.popia}</p>}
              {errors.escrow && <p className="text-xs text-rose-500">{errors.escrow}</p>}
            </div>
          </div>
        )}

        {/* Form Footer Stepper Controls */}
        <div className="mt-8 pt-6 border-t border-stone-200 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="px-4 py-2 rounded-xl text-stone-500 hover:text-stone-800 text-xs font-semibold transition"
            >
              Cancel
            </button>
          )}

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-[#b86b86] hover:bg-[#a25974] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <span>Continue to Step {currentStep + 1}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-7 py-3 rounded-xl bg-[#26152d] hover:bg-[#39263f] text-white text-xs font-bold flex items-center gap-2 transition shadow-md cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              <span>Submit Application for Admin Review</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
