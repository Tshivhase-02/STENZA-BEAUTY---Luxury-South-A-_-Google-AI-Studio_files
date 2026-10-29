import React, { useState, useRef, useEffect } from 'react';
import { ArtisanApplication, ArtisanDocument, OperatingDay, DEFAULT_WEEKLY_SCHEDULE } from '../../data/artisanWorkflowData';
import { categoryService } from '../../services/categoryService';
import { validateSouthAfricanId, validatePassport } from '../../utils/idValidation';
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
  Plus,
  MapPin,
  ShieldCheck,
  Building,
  Navigation,
  Camera,
  RefreshCw,
  Video,
  VideoOff,
  UserCheck,
  Store,
  Sparkles
} from 'lucide-react';
import { 
  SOUTH_AFRICAN_PROVINCES, 
  getTownsForProvince, 
  getSuburbsForTown, 
  formatStudioDisplayLocation 
} from '../../data/saLocationsData';

interface ArtisanRegistrationViewProps {
  onApplicationSubmitted: (app: ArtisanApplication) => void;
  onNavigate: (view: string) => void;
}

export const BEAUTY_SHOP_TYPES = [
  'Physical salon or beauty shop',
  'Home-based beauty business',
  'Mobile or house-call service provider',
  'Independent beauty professional',
  'Beauty products seller',
] as const;

export const ArtisanRegistrationView: React.FC<ArtisanRegistrationViewProps> = ({
  onApplicationSubmitted,
  onNavigate,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  // Step 1: Personal Info & Identity
  const [applicantName, setApplicantName] = useState('Nompumelelo Sithole');
  const [email, setEmail] = useState('nompu.sithole@dermalclinic.co.za');
  const [phone, setPhone] = useState('83 490 1284');
  const [idDocType, setIdDocType] = useState<'SA_ID' | 'PASSPORT'>('SA_ID');
  const [idNumber, setIdNumber] = useState('920415 0284 08 0'); // Valid 13-digit SA ID
  const [passportNumber, setPassportNumber] = useState('');
  const [idValidationInfo, setIdValidationInfo] = useState<string | null>(null);

  // Step 2: Beauty Shop & Specialty
  const [shopType, setShopType] = useState<string>('Physical salon or beauty shop');
  const [businessName, setBusinessName] = useState('Nompumelelo Dermal Lab & Skin Clinic');
  const [category, setCategory] = useState('Clinical Skincare');
  const [experienceYears, setExperienceYears] = useState<number>(6);
  const [bio, setBio] = useState(
    'Specialist medical aesthetician with clinical certification in non-invasive skin rejuvenation, chemical peeling, and hyperpigmentation therapy for African skin tones.'
  );
  const [instagram, setInstagram] = useState('@nompu_dermallab');
  const [website, setWebsite] = useState('https://www.nompudermal.co.za');

  // Step 3: Location & House Calls (All 9 South African Provinces)
  const [province, setProvince] = useState<string>('Gauteng');
  const [city, setCity] = useState<string>('Johannesburg');
  const [suburb, setSuburb] = useState<string>('Sandton Central');
  const [address, setAddress] = useState<string>('Suite 204, Sandton City Atrium, 83 Rivonia Rd, Sandton, 2196');
  const [isCustomTown, setIsCustomTown] = useState<boolean>(false);
  const [isCustomSuburb, setIsCustomSuburb] = useState<boolean>(false);
  const [offersHouseCalls, setOffersHouseCalls] = useState(true);
  const [serviceRadius, setServiceRadius] = useState('Sandton, Morningside, Bryanston & Hyde Park (15km)');
  const [travelFee, setTravelFee] = useState<number>(200);

  // Cascading location handlers
  const handleProvinceSelect = (selectedProv: string) => {
    setProvince(selectedProv);
    setCity('');
    setSuburb('');
    setIsCustomTown(false);
    setIsCustomSuburb(false);
  };

  const handleCitySelect = (selectedCity: string) => {
    if (selectedCity === '__custom__') {
      setIsCustomTown(true);
      setCity('');
      setSuburb('');
      setIsCustomSuburb(true);
    } else {
      setIsCustomTown(false);
      setCity(selectedCity);
      setSuburb('');
      setIsCustomSuburb(false);
    }
  };

  const handleSuburbSelect = (selectedSub: string) => {
    if (selectedSub === '__custom__') {
      setIsCustomSuburb(true);
      setSuburb('');
    } else {
      setIsCustomSuburb(false);
      setSuburb(selectedSub);
    }
  };

  // Step 4: Dedicated Working Days & Hours
  const [workingSchedule, setWorkingSchedule] = useState<OperatingDay[]>(DEFAULT_WEEKLY_SCHEDULE);
  const [copySourceDay, setCopySourceDay] = useState<string>('Monday');
  const [copySuccessToast, setCopySuccessToast] = useState<string | null>(null);

  // Step 5: Face Verification
  const [faceConsent, setFaceConsent] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [useAlternativeVerification, setUseAlternativeVerification] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Step 6: Verification Documents (Optional)
  const [documents, setDocuments] = useState<ArtisanDocument[]>([
    {
      id: 'doc-1',
      title: 'CIDESCO Diploma in Aesthetics & Skincare',
      type: 'Trade Certificate',
      fileName: 'CIDESCO_Diploma_N_Sithole.pdf',
      fileSize: '2.4 MB',
      uploadDate: 'Today',
      verified: false,
    }
  ]);
  const [newDocType, setNewDocType] = useState<ArtisanDocument['type']>('Diploma');
  const [newDocTitle, setNewDocTitle] = useState('');

  // Step 7: Terms & POPIA
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [popiaConsent, setPopiaConsent] = useState(true);
  const [escrowAccepted, setEscrowAccepted] = useState(true);

  // Stop camera on unmount or step change
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleStartCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access unavailable:', err);
      setCameraError('Camera access was denied or is unavailable on this device. You may opt for the alternative manual verification process below.');
      setIsCameraActive(false);
    }
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedPhoto(dataUrl);
      stopCamera();
    }
  };

  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
    handleStartCamera();
  };

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

  const handleCopyHoursToAll = () => {
    const source = workingSchedule.find((item) => item.day === copySourceDay);
    if (!source) return;

    setWorkingSchedule((prev) =>
      prev.map((item) => {
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

      if (idDocType === 'SA_ID') {
        const valRes = validateSouthAfricanId(idNumber);
        if (!valRes.valid) {
          errs.idNumber = valRes.error || 'Valid South African ID required';
        } else {
          setIdValidationInfo(`Verified: ${valRes.gender}, ${valRes.citizenship}, Born ${valRes.dateOfBirthFormatted}`);
        }
      } else {
        const passRes = validatePassport(passportNumber);
        if (!passRes.valid) {
          errs.passportNumber = passRes.error || 'Valid passport number required';
        } else {
          setIdValidationInfo(`Passport: ${passRes.sanitizedValue}`);
        }
      }
    } else if (step === 2) {
      if (!businessName.trim()) errs.businessName = 'Business or Beauty Shop name is required';
      if (!bio.trim() || bio.length < 20) errs.bio = 'Please provide a descriptive bio (at least 20 characters)';
    } else if (step === 3) {
      if (!province.trim()) errs.province = 'Please select a South African province';
      if (!city.trim()) errs.city = 'Town or city is required';
      if (!suburb.trim()) errs.suburb = 'Suburb or area is required';
      // Street address is required ONLY for physical salons with in-studio visits
      if (shopType === 'Physical salon or beauty shop' && !address.trim()) {
        errs.address = 'Street address is required for a physical salon';
      }
    } else if (step === 4) {
      const anyOpen = workingSchedule.some((d) => d.isOpen);
      if (!anyOpen) {
        errs.schedule = 'Please select at least one active working day.';
      } else {
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
    } else if (step === 5) {
      // Face Verification validation
      if (!capturedPhoto && !useAlternativeVerification) {
        errs.faceVerification = 'Please complete the face verification photo capture or select the alternative manual verification option.';
      }
    } else if (step === 7) {
      if (!termsAccepted) errs.terms = 'You must accept the STENZA Marketplace Agreement';
      if (!popiaConsent) errs.popia = 'POPIA Act compliance consent is required by South African law';
      if (!escrowAccepted) errs.escrow = 'Escrow deposit release terms must be acknowledged';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      stopCamera();
      setCurrentStep((prev) => Math.min(7, prev + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    stopCamera();
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
    if (!validateStep(7)) return;

    const chosenId = idDocType === 'SA_ID' ? idNumber.replace(/\s+/g, '') : passportNumber.trim().toUpperCase();

    const newApp: ArtisanApplication = {
      id: `STZ-APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      applicantName,
      email,
      phone: `+27 ${phone.replace(/^0+/, '')}`,
      idDocType,
      idNumber: chosenId,
      shopType,
      businessName,
      category,
      experienceYears,
      province,
      city,
      suburb,
      address: address.trim(),
      offersHouseCalls,
      serviceRadius: offersHouseCalls ? serviceRadius : '',
      travelFee: offersHouseCalls ? travelFee : 0,
      bio,
      instagram,
      website: website || undefined,
      documents,
      faceVerificationMethod: useAlternativeVerification ? 'alternative_manual' : 'camera',
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
    { num: 2, title: 'Beauty Shop Profile', desc: 'Type & specialty' },
    { num: 3, title: 'Location & Mobile', desc: 'Area & house calls' },
    { num: 4, title: 'Working Schedule', desc: 'Days & hours' },
    { num: 5, title: 'Face Verification', desc: 'POPIA biometrics' },
    { num: 6, title: 'Accreditation', desc: 'Optional certificates' },
    { num: 7, title: 'Review & Terms', desc: 'POPIA & agreement' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <span className="inline-block px-3 py-1 rounded-full bg-[#fbf0f4] border border-[#f0d0dc] text-[11px] font-bold text-[#b86b86] uppercase tracking-wider">
          Beauty Shop Onboarding Gateway
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#26152d]">
          Register Your Beauty Shop on STENZA
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
          Join South Africa’s premier verified network of master hairstylists, nail artists, dermal clinicians, and wellness specialists.
        </p>
      </div>

      {/* Multi-Step Stepper Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#e5e0d8] shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {steps.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div
                key={s.num}
                className={`p-2 rounded-xl border transition-all ${
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
        {/* STEP 1: Personal Details & Identity Document */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#26152d]">
                Step 1: Personal & Legal Identity
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Your legal identity details required for verified artisan onboarding and POPIA-compliant trust payouts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#26152d] mb-1">
                  Full Legal Name *
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

              {/* Identity Document Selector (Req 5) */}
              <div className="sm:col-span-2 pt-2 border-t border-stone-100">
                <label className="block text-xs font-semibold text-[#26152d] mb-2">
                  Identity Document Type *
                </label>
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  <button
                    type="button"
                    onClick={() => {
                      setIdDocType('SA_ID');
                      setErrors((prev) => ({ ...prev, idNumber: '', passportNumber: '' }));
                    }}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer ${
                      idDocType === 'SA_ID'
                        ? 'border-[#26152d] bg-[#26152d] text-white shadow-xs'
                        : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>South African ID</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIdDocType('PASSPORT');
                      setErrors((prev) => ({ ...prev, idNumber: '', passportNumber: '' }));
                    }}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer ${
                      idDocType === 'PASSPORT'
                        ? 'border-[#26152d] bg-[#26152d] text-white shadow-xs'
                        : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>Passport</span>
                  </button>
                </div>
              </div>

              {/* Relevant Input based on Document Type */}
              {idDocType === 'SA_ID' ? (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#26152d] mb-1">
                    South African National ID Number (13 Digits) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={17}
                    value={idNumber}
                    onChange={(e) => {
                      setIdNumber(e.target.value);
                      setIdValidationInfo(null);
                    }}
                    placeholder="e.g. 920415 0284 08 0"
                    className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] font-mono outline-none"
                  />
                  {errors.idNumber && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.idNumber}</span>
                    </p>
                  )}
                  {idValidationInfo && !errors.idNumber && (
                    <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{idValidationInfo}</span>
                    </p>
                  )}
                  <p className="text-[11px] text-gray-400 mt-1">
                    Must be exactly 13 digits with valid calendar date and Luhn checksum. Protected under POPIA Act 4 of 2013.
                  </p>
                </div>
              ) : (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#26152d] mb-1">
                    Passport Number *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    value={passportNumber}
                    onChange={(e) => {
                      setPassportNumber(e.target.value);
                      setIdValidationInfo(null);
                    }}
                    placeholder="e.g. A12345678"
                    className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] font-mono uppercase outline-none"
                  />
                  {errors.passportNumber && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.passportNumber}</span>
                    </p>
                  )}
                  <p className="text-[11px] text-gray-400 mt-1">
                    Accepts international passport numbers (6–12 alphanumeric characters).
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: Beauty Shop Brand & Type (Req 8 & 9) */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#26152d]">
                Step 2: Beauty Shop Brand & Business Type
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Tell clients about your business format, luxury brand, mastery level, and specialized beauty techniques.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Beauty Shop Type Selection (Req 9) */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#26152d] mb-2">
                  Beauty Shop Business Type *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {BEAUTY_SHOP_TYPES.map((type) => (
                    <label
                      key={type}
                      className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                        shopType === type
                          ? 'border-[#26152d] bg-[#fcf9f4] shadow-xs'
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shopType"
                        value={type}
                        checked={shopType === type}
                        onChange={() => setShopType(type)}
                        className="text-[#26152d] focus:ring-[#26152d]"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-stone-900 block truncate">
                          {type}
                        </span>
                        <span className="text-[10px] text-stone-500">
                          {type === 'Physical salon or beauty shop' && 'Commercial premises with walk-in & booking salon'}
                          {type === 'Home-based beauty business' && 'Private studio suite at home with appointment privacy'}
                          {type === 'Mobile or house-call service provider' && 'On-location appointments at clients’ homes or hotels'}
                          {type === 'Independent beauty professional' && 'Solo freelance specialist or chair renter'}
                          {type === 'Beauty products seller' && 'Curated haircare, cosmetics or beauty product retailer'}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#26152d] mb-1">
                  Trading Business Name / Beauty Shop Name *
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
                  max={45}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(parseInt(e.target.value, 10) || 1)}
                  className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#26152d] mb-1">
                  Artisan Biography & Treatment Philosophy *
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Detail your experience, certifications, and high-end beauty techniques..."
                  className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] outline-none"
                />
                {errors.bio && (
                  <p className="text-xs text-rose-500 mt-1">{errors.bio}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#26152d] mb-1">
                  Instagram Portfolio Handle
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@your_beautyshop"
                  className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#26152d] mb-1">
                  Official Website (Optional)
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.yourbeauty.co.za"
                  className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Location & Service Area (Req 8 & 9) */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#26152d]">
                Step 3: Location & Service Coverage
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Configure your South African operational geography. Mobile providers and home studios are not required to display a public street address.
              </p>
            </div>

            {/* Live Location Display */}
            <div className="p-4 rounded-2xl bg-[#26152d] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#d4af37]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-stone-300 font-bold block">
                    Public Location Display
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {formatStudioDisplayLocation(province, city, suburb)}
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-stone-300 bg-white/10 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                Republic of South Africa
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. PROVINCE */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#26152d] mb-1">
                  1. Province *
                </label>
                <select
                  value={province}
                  onChange={(e) => handleProvinceSelect(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] bg-white outline-none cursor-pointer"
                >
                  <option value="">-- Select South African Province --</option>
                  {SOUTH_AFRICAN_PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
                {errors.province && (
                  <p className="text-xs text-rose-500 mt-1">{errors.province}</p>
                )}
              </div>

              {/* 2. TOWN / CITY */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#26152d]">
                    2. Town or City *
                  </label>
                  {province && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomTown(!isCustomTown);
                        if (!isCustomTown) {
                          setCity('');
                          setSuburb('');
                        }
                      }}
                      className="text-[11px] text-[#b86b86] hover:underline font-medium cursor-pointer"
                    >
                      {isCustomTown ? '← Suggested towns' : '+ Enter custom town'}
                    </button>
                  )}
                </div>

                {isCustomTown ? (
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setSuburb('');
                    }}
                    placeholder="e.g. Thohoyandou, Polokwane, Tzaneen..."
                    className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] bg-white outline-none"
                  />
                ) : (
                  <select
                    value={city}
                    onChange={(e) => handleCitySelect(e.target.value)}
                    disabled={!province}
                    className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] bg-white outline-none disabled:bg-stone-100 disabled:text-stone-400 cursor-pointer"
                  >
                    <option value="">{province ? `-- Select Town/City in ${province} --` : '-- Select province first --'}</option>
                    {getTownsForProvince(province).map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                    <option value="__custom__">+ Enter another town / city...</option>
                  </select>
                )}
                {errors.city && (
                  <p className="text-xs text-rose-500 mt-1">{errors.city}</p>
                )}
              </div>

              {/* 3. SUBURB / AREA */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#26152d]">
                    3. Suburb or Area *
                  </label>
                  {city && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomSuburb(!isCustomSuburb);
                        if (!isCustomSuburb) setSuburb('');
                      }}
                      className="text-[11px] text-[#b86b86] hover:underline font-medium cursor-pointer"
                    >
                      {isCustomSuburb ? '← Suggested suburbs' : '+ Custom suburb'}
                    </button>
                  )}
                </div>

                {isCustomSuburb || getSuburbsForTown(province, city).length === 0 ? (
                  <input
                    type="text"
                    required
                    value={suburb}
                    onChange={(e) => setSuburb(e.target.value)}
                    placeholder="e.g. Sandton Central, Rosebank, Camps Bay..."
                    className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] bg-white outline-none"
                  />
                ) : (
                  <select
                    value={suburb}
                    onChange={(e) => handleSuburbSelect(e.target.value)}
                    disabled={!city}
                    className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] bg-white outline-none disabled:bg-stone-100 disabled:text-stone-400 cursor-pointer"
                  >
                    <option value="">{city ? `-- Select Suburb in ${city} --` : '-- Select town first --'}</option>
                    {getSuburbsForTown(province, city).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                    <option value="__custom__">+ Enter another suburb / area...</option>
                  </select>
                )}
                {errors.suburb && (
                  <p className="text-xs text-rose-500 mt-1">{errors.suburb}</p>
                )}
              </div>

              {/* 4. STREET ADDRESS (Optional for mobile & home businesses) */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#26152d]">
                    4. Street Address & Suite {shopType !== 'Physical salon or beauty shop' && <span className="text-stone-400 font-normal">(Optional for mobile / home businesses)</span>}
                  </label>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Protected</span>
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={
                    shopType === 'Mobile or house-call service provider'
                      ? 'Mobile provider: Leave blank or specify depot/meeting point'
                      : 'e.g. Suite 204, Sandton City Atrium, 83 Rivonia Rd, Sandton, 2196'
                  }
                  className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] bg-white outline-none"
                />
                {errors.address && (
                  <p className="text-xs text-rose-500 mt-1">{errors.address}</p>
                )}

                <div className="mt-2 p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-2.5 text-xs text-stone-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    <strong>Privacy First:</strong> Only your town and suburb (e.g. <span className="font-semibold">{formatStudioDisplayLocation(province, city, suburb)}</span>) appear on public listing cards. Exact physical directions are only provided once a client’s booking is confirmed.
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile / House Calls Area */}
            <div className="p-5 rounded-2xl bg-[#faf7f5] border border-stone-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#26152d]">
                    Mobile House Calls & Call-Out Services
                  </h4>
                  <p className="text-xs text-gray-500">
                    Travel to clients' residences, offices, or hotel suites in your area.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={offersHouseCalls}
                    onChange={(e) => setOffersHouseCalls(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#26152d]"></div>
                </label>
              </div>

              {offersHouseCalls && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-200 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-xs font-semibold text-[#26152d] mb-1">
                      Service Area / Coverage Radius *
                    </label>
                    <input
                      type="text"
                      value={serviceRadius}
                      onChange={(e) => setServiceRadius(e.target.value)}
                      placeholder="e.g. Sandton, Rosebank & Hyde Park (15km radius)"
                      className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#26152d] mb-1">
                      Base Travel Call-Out Fee (ZAR)
                    </label>
                    <div className="flex">
                      <span className="p-3 bg-stone-100 border border-r-0 border-stone-300 rounded-l-xl text-xs font-semibold text-gray-700">
                        R
                      </span>
                      <input
                        type="number"
                        min={0}
                        step={10}
                        value={travelFee}
                        onChange={(e) => setTravelFee(parseInt(e.target.value, 10) || 0)}
                        placeholder="150"
                        className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-r-xl focus:border-[#b86b86] outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: Working Days & Hours */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#26152d]">
                Step 4: Operating Days & Trading Hours
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Configure your weekly operating hours, rest days, and lunch breaks.
              </p>
            </div>

            {errors.schedule && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errors.schedule}</span>
              </div>
            )}

            {/* Quick Bulk Copy Toolbar */}
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Copy className="w-3.5 h-3.5 text-stone-500" />
                <span className="font-semibold text-stone-700">Copy hours from:</span>
                <select
                  value={copySourceDay}
                  onChange={(e) => setCopySourceDay(e.target.value)}
                  className="p-1 border border-stone-300 rounded-lg bg-white text-xs font-medium"
                >
                  {workingSchedule.filter(d => d.isOpen).map((d) => (
                    <option key={d.day} value={d.day}>{d.day}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleCopyHoursToAll}
                className="py-1 px-3 bg-[#26152d] hover:bg-[#39263f] text-white rounded-lg font-bold text-xs transition cursor-pointer"
              >
                Apply to All Open Days
              </button>
            </div>

            {copySuccessToast && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{copySuccessToast}</span>
              </div>
            )}

            {/* Schedule List */}
            <div className="space-y-3">
              {workingSchedule.map((dayItem) => (
                <div
                  key={dayItem.day}
                  className={`p-3.5 rounded-xl border transition-all ${
                    dayItem.isOpen
                      ? 'bg-white border-stone-300 shadow-2xs'
                      : 'bg-stone-50 border-stone-200 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={dayItem.isOpen}
                          onChange={() => handleToggleDayOpen(dayItem.day)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#26152d]"></div>
                      </label>
                      <span className={`text-xs font-bold ${dayItem.isOpen ? 'text-stone-900' : 'text-stone-400'}`}>
                        {dayItem.day}
                      </span>
                      {!dayItem.isOpen && (
                        <span className="text-[10px] text-stone-400 italic">Closed</span>
                      )}
                    </div>

                    {dayItem.isOpen && (
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-stone-500 uppercase font-semibold">Open:</span>
                          <input
                            type="time"
                            value={dayItem.openTime}
                            onChange={(e) => handleUpdateDayTime(dayItem.day, 'openTime', e.target.value)}
                            className="p-1 border border-stone-300 rounded bg-white font-mono text-xs"
                          />
                        </div>
                        <span className="text-stone-400">—</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-stone-500 uppercase font-semibold">Close:</span>
                          <input
                            type="time"
                            value={dayItem.closeTime}
                            onChange={(e) => handleUpdateDayTime(dayItem.day, 'closeTime', e.target.value)}
                            className="p-1 border border-stone-300 rounded bg-white font-mono text-xs"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleDayBreak(dayItem.day)}
                          className={`ml-2 text-[11px] font-semibold flex items-center gap-1 px-2 py-1 rounded transition cursor-pointer ${
                            dayItem.hasBreak
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          <Coffee className="w-3 h-3" />
                          <span>{dayItem.hasBreak ? 'Break Active' : '+ Add Break'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Face Verification (Req 6) */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold uppercase tracking-wider">
                  POPIA Act 4 of 2013 Compliant
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#26152d] mt-1">
                Step 5: Face Verification
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Face verification confirms that the registered artisan matches the submitted South African legal profile. Your image is processed securely, encrypted in transit, and never published or shared.
              </p>
            </div>

            {errors.faceVerification && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errors.faceVerification}</span>
              </div>
            )}

            {/* POPIA Consent Notice */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#695684] shrink-0 mt-0.5" />
                <div className="text-xs text-stone-700 space-y-1">
                  <p className="font-semibold text-stone-900">
                    Informed Consent for Biometric & Identity Verification
                  </p>
                  <p className="text-[11px] leading-relaxed text-stone-600">
                    By proceeding, you grant explicit permission to capture a photograph for identity verification against your {idDocType === 'SA_ID' ? 'South African ID' : 'Passport'}. We do not sell biometric templates, and verification results are reviewed exclusively by authorized compliance personnel.
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2.5 pt-2 border-t border-stone-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={faceConsent}
                  onChange={(e) => {
                    setFaceConsent(e.target.checked);
                    if (!e.target.checked) stopCamera();
                  }}
                  className="rounded text-[#26152d] focus:ring-[#26152d]"
                />
                <span className="text-xs font-semibold text-stone-900">
                  I give explicit informed consent to face verification under POPIA regulations.
                </span>
              </label>
            </div>

            {/* Camera Interface or Captured Photo */}
            {!useAlternativeVerification && (
              <div className="p-6 rounded-2xl border border-stone-200 bg-stone-900 text-white flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
                <canvas ref={canvasRef} className="hidden" />

                {capturedPhoto ? (
                  /* Photo Preview */
                  <div className="space-y-4 flex flex-col items-center">
                    <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-emerald-400 shadow-xl bg-black">
                      <img src={capturedPhoto} alt="Captured face preview" className="w-full h-full object-cover" />
                      <div className="absolute bottom-2 inset-x-0 flex justify-center">
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <Check className="w-3 h-3" /> Captured
                        </span>
                      </div>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-xs font-semibold text-white">Face photograph ready for verification review</p>
                      <p className="text-[11px] text-stone-400">Photo will be verified by the accreditation desk upon submission.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRetakePhoto}
                      className="py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retake Photo</span>
                    </button>
                  </div>
                ) : isCameraActive ? (
                  /* Live Camera Stream */
                  <div className="space-y-4 flex flex-col items-center w-full max-w-sm">
                    <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-dashed border-[#b86b86] shadow-2xl bg-black">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 pointer-events-none border-2 border-white/30 rounded-full" />
                    </div>
                    <p className="text-xs text-stone-300 text-center">
                      Position your face within the frame. Ensure good lighting and remove sunglasses or caps.
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleCapturePhoto}
                        className="py-2.5 px-6 rounded-xl bg-[#b86b86] hover:bg-[#a25974] text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Capture Photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Start Camera Button */
                  <div className="py-8 text-center space-y-3 max-w-md">
                    <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto text-stone-300">
                      <Camera className="w-7 h-7 text-[#b86b86]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Live Camera Verification</h4>
                      <p className="text-xs text-stone-400 mt-1">
                        Compatible with laptop webcams and mobile front cameras. Camera permission will only be requested when you click start.
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={!faceConsent}
                      onClick={handleStartCamera}
                      className="py-2.5 px-6 rounded-xl bg-[#b86b86] hover:bg-[#a25974] disabled:opacity-50 text-white font-bold text-xs shadow-md flex items-center gap-2 mx-auto cursor-pointer"
                    >
                      <Video className="w-4 h-4" />
                      <span>Start Camera Verification</span>
                    </button>
                    {!faceConsent && (
                      <p className="text-[11px] text-amber-400">
                        Please check the informed consent checkbox above before activating camera.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {cameraError && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>{cameraError}</span>
              </div>
            )}

            {/* Alternative Manual Verification (Req 6) */}
            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/60 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    Cannot use face scanning or camera unavailable?
                  </h4>
                  <p className="text-[11px] text-stone-600">
                    We provide a secure alternative manual verification process. You will not be rejected for not using camera scanning.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUseAlternativeVerification(!useAlternativeVerification);
                    if (!useAlternativeVerification) {
                      stopCamera();
                      setCapturedPhoto(null);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    useAlternativeVerification
                      ? 'bg-purple-700 text-white'
                      : 'bg-white border border-purple-300 text-purple-900 hover:bg-purple-100'
                  }`}
                >
                  {useAlternativeVerification ? '✓ Manual Verification Selected' : 'Opt for Manual Review'}
                </button>
              </div>

              {useAlternativeVerification && (
                <div className="pt-2 border-t border-purple-200 text-[11px] text-purple-900 leading-relaxed">
                  ✓ <strong>Alternative Process Active:</strong> A STENZA Compliance Officer will manually review your certified identity document and arrange a secure WhatsApp video identity call before granting accreditation.
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 6: Verification Documents (Optional - Req 4) */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                  Optional Accreditation
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#26152d] mt-1">
                Step 6: Professional Accreditation & Credentials
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                CIPC company registration, trade certificates, and municipal permits are <strong className="text-stone-800">not mandatory</strong> to complete your registration. You may optionally attach any beauty diplomas, certifications, or liability insurance if available.
              </p>
            </div>

            {/* Notice clarifying legal obligations */}
            <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-[11px] text-stone-600 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <span>
                Note: Removing mandatory document uploads from this onboarding form does not exempt any business from general South African legal, tax, or local municipal health bylaws that may apply to their operations.
              </span>
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

            {/* Add Optional Document Box */}
            <div className="p-4 rounded-xl border border-dashed border-stone-300 bg-stone-50/50 space-y-3">
              <h4 className="text-xs font-bold text-[#26152d] uppercase tracking-wider flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-[#b86b86]" />
                Attach Optional Professional Credential
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value as ArtisanDocument['type'])}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg bg-white outline-none"
                  >
                    <option value="Diploma">Beauty Diploma / Certificate</option>
                    <option value="Trade Certificate">Trade Qualification (ITEC / CIDESCO)</option>
                    <option value="Liability Insurance">Liability Insurance Policy</option>
                    <option value="Other">Other Professional Accreditation</option>
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

        {/* STEP 7: Review & Terms */}
        {currentStep === 7 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#26152d]">
                Step 7: Review Dossier & Marketplace Consent
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Please verify your registration details before submitting for STENZA administrator review.
              </p>
            </div>

            {/* Summary Review Card */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-stone-200">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Beauty Shop</span>
                  <span className="font-bold text-stone-900 text-sm">{businessName}</span>
                  <span className="text-[11px] text-stone-500 block">{shopType}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Applicant & Identity</span>
                  <span className="font-bold text-stone-900 text-sm">{applicantName}</span>
                  <span className="text-[11px] text-stone-600 block">
                    {idDocType === 'SA_ID' ? `SA ID: ${idNumber}` : `Passport: ${passportNumber}`}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Contact</span>
                  <span className="text-stone-800">{phone} • {email}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Location</span>
                  <span className="text-stone-800">{suburb}, {city}, {province}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">House Calls</span>
                  <span className="text-stone-800">
                    {offersHouseCalls ? `Yes (+R${travelFee} call-out fee)` : 'Premises only'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Face Verification</span>
                  <span className="text-stone-800 font-semibold">
                    {useAlternativeVerification ? 'Manual Document Review' : 'Photo Captured'}
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
                        <span className="text-stone-400 italic text-[10px]">Closed</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legal Checks */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-[#26152d]"
                />
                <div className="text-xs">
                  <span className="font-bold text-stone-900 block">
                    STENZA Beauty Shop Marketplace Agreement *
                  </span>
                  <span className="text-stone-500 text-[11px]">
                    I agree to maintain professional South African beauty standards, transparent Rand pricing, and prompt client communication.
                  </span>
                </div>
              </label>
              {errors.terms && <p className="text-xs text-rose-500">{errors.terms}</p>}

              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={popiaConsent}
                  onChange={(e) => setPopiaConsent(e.target.checked)}
                  className="mt-0.5 rounded text-[#26152d]"
                />
                <div className="text-xs">
                  <span className="font-bold text-stone-900 block">
                    POPIA Act Compliance & Verification Consent *
                  </span>
                  <span className="text-stone-500 text-[11px]">
                    I consent to the encrypted verification of my identity document and professional credentials in accordance with the Protection of Personal Information Act.
                  </span>
                </div>
              </label>
              {errors.popia && <p className="text-xs text-rose-500">{errors.popia}</p>}

              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={escrowAccepted}
                  onChange={(e) => setEscrowAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-[#26152d]"
                />
                <div className="text-xs">
                  <span className="font-bold text-stone-900 block">
                    South African Trust Escrow Payout Terms *
                  </span>
                  <span className="text-stone-500 text-[11px]">
                    Client booking payments are held securely in escrow and released directly to your verified South African bank account upon treatment completion.
                  </span>
                </div>
              </label>
              {errors.escrow && <p className="text-xs text-rose-500">{errors.escrow}</p>}
            </div>
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 border-t border-stone-100 mt-8">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="py-2.5 px-5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-xs text-gray-500 hover:text-gray-900 font-semibold"
            >
              Cancel
            </button>
          )}

          {currentStep < 7 ? (
            <button
              type="button"
              onClick={handleNext}
              className="py-2.5 px-6 rounded-xl bg-[#26152d] hover:bg-[#39263f] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="py-3 px-8 rounded-xl bg-[#b86b86] hover:bg-[#a25974] text-white text-xs font-bold transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Registration Dossier</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
