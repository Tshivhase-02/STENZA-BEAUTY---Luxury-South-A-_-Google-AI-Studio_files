import React, { useState, useRef } from 'react';
import { StudioProfile, StudioService } from '../../data/artisanWorkflowData';
import { 
  Scissors, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  ArrowLeft, 
  Eye, 
  Power, 
  Sparkles, 
  Clock, 
  Tag, 
  AlertCircle,
  CheckCircle2,
  DollarSign,
  UploadCloud,
  Image as ImageIcon,
  Star,
  RotateCw,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { 
  STANDARD_SERVICES_CATALOG, 
  StandardServiceItem 
} from '../../data/servicesCatalogData';

interface ServicesManagementViewProps {
  studio: StudioProfile;
  onUpdateServices: (services: StudioService[]) => void;
  onNavigate: (view: string) => void;
}

// Maximum image configuration
const MAX_IMAGES_PER_SERVICE = 5;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];

// Curated high-res presets for quick testing of multi-photo galleries
const PRESET_SAMPLE_PHOTOS: Record<string, string[]> = {
  'braids': [
    'https://images.unsplash.com/photo-1584297091622-af8e5bd9cbf9?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=600&q=80',
  ],
  'nails': [
    'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=600&q=80',
  ],
  'facials': [
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1512290900672-1f5518b62c05?auto=format&fit=crop&w=600&q=80',
  ]
};

export const ServicesManagementView: React.FC<ServicesManagementViewProps> = ({
  studio,
  onUpdateServices,
  onNavigate,
}) => {
  const [services, setServices] = useState<StudioService[]>(studio.services || []);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Modals state
  const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'manage_photos' | 'delete_confirm' | 'catalog' | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<StudioService | null>(null);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState('all');

  const handleSelectCatalogItem = (item: StandardServiceItem) => {
    setFormName(item.name);
    setFormCategory(item.category);
    setFormDescription(item.description);
    setFormPrice(item.defaultPrice);
    setFormDiscountedPrice('');
    setFormDuration(item.defaultDuration);
    setFormImages([
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80'
    ]);
    setFormCoverIndex(0);
    setFormIsActive(true);
    setFormIsPopular(false);
    setFormError('');
    setImageErrorMessage(null);
    setImageUploadProgress(null);
    setEditingServiceId(null);
    setReplaceTargetIndex(null);
    setActiveModal('add');
    showToast(`Loaded "${item.name}" from catalog into new service form.`);
  };

  // Form states for Add / Edit
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState(studio.category);
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState<number>(550);
  const [formDiscountedPrice, setFormDiscountedPrice] = useState<string>('');
  const [formDuration, setFormDuration] = useState('60 min');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formIsPopular, setFormIsPopular] = useState(false);
  const [formError, setFormError] = useState('');

  // Service Images Manager State
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formCoverIndex, setFormCoverIndex] = useState<number>(0);
  const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(null);
  const [imageErrorMessage, setImageErrorMessage] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [replaceTargetIndex, setReplaceTargetIndex] = useState<number | null>(null);

  // Quick URL Add Input
  const [customImageUrlInput, setCustomImageUrlInput] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAddModal = () => {
    setFormName('');
    setFormCategory(studio.category || 'Specialized Treatments');
    setFormDescription('');
    setFormPrice(600);
    setFormDiscountedPrice('');
    setFormDuration('60 min');
    setFormImages([
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80'
    ]);
    setFormCoverIndex(0);
    setFormIsActive(true);
    setFormIsPopular(false);
    setFormError('');
    setImageErrorMessage(null);
    setImageUploadProgress(null);
    setEditingServiceId(null);
    setReplaceTargetIndex(null);
    setActiveModal('add');
  };

  const handleOpenEditModal = (service: StudioService) => {
    setFormName(service.name);
    setFormCategory(service.category);
    setFormDescription(service.description);
    setFormPrice(service.price);
    setFormDiscountedPrice(service.discountedPrice ? String(service.discountedPrice) : '');
    setFormDuration(service.duration);
    
    // Ensure images array is properly populated
    const serviceImages = service.images && service.images.length > 0 
      ? service.images 
      : (service.imageUrl ? [service.imageUrl] : []);
    
    setFormImages(serviceImages);
    setFormCoverIndex(service.coverImageIndex || 0);
    setFormIsActive(service.isActive);
    setFormIsPopular(service.popular || false);
    setFormError('');
    setImageErrorMessage(null);
    setImageUploadProgress(null);
    setEditingServiceId(service.id);
    setReplaceTargetIndex(null);
    setActiveModal('edit');
  };

  const handleOpenManagePhotosModal = (service: StudioService) => {
    handleOpenEditModal(service);
    setActiveModal('manage_photos');
  };

  // Image upload handler with validation
  const processFiles = (files: FileList | File[]) => {
    setImageErrorMessage(null);

    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    // Check count limit
    const availableSlots = MAX_IMAGES_PER_SERVICE - (replaceTargetIndex !== null ? formImages.length - 1 : formImages.length);
    if (fileArray.length > availableSlots && replaceTargetIndex === null) {
      setImageErrorMessage(
        `Exceeds maximum limit of ${MAX_IMAGES_PER_SERVICE} photos per service. You can only add ${availableSlots} more.`
      );
      return;
    }

    // Validate format & size
    for (const file of fileArray) {
      if (!ACCEPTED_FORMATS.includes(file.type)) {
        setImageErrorMessage(`Unsupported format: "${file.name}". Accepted formats: JPG, JPEG, PNG, WebP.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        setImageErrorMessage(`File "${file.name}" is ${sizeMb} MB. Maximum allowed size is 5 MB.`);
        return;
      }
    }

    // Simulate upload progress
    setImageUploadProgress(20);
    const timer1 = setTimeout(() => setImageUploadProgress(65), 180);
    const timer2 = setTimeout(() => {
      setImageUploadProgress(100);

      // Convert files to object URLs for realistic preview
      const newUrls = fileArray.map((file) => URL.createObjectURL(file));

      if (replaceTargetIndex !== null) {
        setFormImages((prev) => {
          const clone = [...prev];
          clone[replaceTargetIndex] = newUrls[0];
          return clone;
        });
        setReplaceTargetIndex(null);
        showToast('Service photo replaced successfully.');
      } else {
        setFormImages((prev) => [...prev, ...newUrls].slice(0, MAX_IMAGES_PER_SERVICE));
        showToast(`Uploaded ${fileArray.length} photo(s) to this service.`);
      }

      setTimeout(() => setImageUploadProgress(null), 600);
    }, 400);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleAddCustomUrl = () => {
    if (!customImageUrlInput.trim()) return;
    if (formImages.length >= MAX_IMAGES_PER_SERVICE) {
      setImageErrorMessage(`Cannot add more than ${MAX_IMAGES_PER_SERVICE} images to this service.`);
      return;
    }
    setFormImages((prev) => [...prev, customImageUrlInput.trim()]);
    setCustomImageUrlInput('');
    showToast('Photo added to service gallery.');
  };

  const handleAddPreset = (categoryKey: string) => {
    const sample = PRESET_SAMPLE_PHOTOS[categoryKey];
    if (!sample) return;
    const remaining = MAX_IMAGES_PER_SERVICE - formImages.length;
    if (remaining <= 0) {
      setImageErrorMessage('Maximum 5 images reached.');
      return;
    }
    setFormImages((prev) => [...prev, ...sample.slice(0, remaining)]);
    showToast(`Added sample ${categoryKey} photos.`);
  };

  const handleRemoveImage = (index: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== index));
    if (formCoverIndex === index) {
      setFormCoverIndex(0);
    } else if (formCoverIndex > index) {
      setFormCoverIndex((prev) => prev - 1);
    }
  };

  const handleSetCover = (index: number) => {
    setFormCoverIndex(index);
    showToast(`Photo #${index + 1} set as service cover image.`);
  };

  const handleTriggerReplace = (index: number) => {
    setReplaceTargetIndex(index);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Form submit handler
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Service name is required.');
      return;
    }
    if (formPrice <= 0) {
      setFormError('Please enter a valid price in ZAR.');
      return;
    }

    const discountNum = formDiscountedPrice ? Number(formDiscountedPrice) : undefined;
    if (discountNum !== undefined && discountNum >= formPrice) {
      setFormError('Discounted price must be less than the regular price.');
      return;
    }

    const coverUrl = formImages.length > 0 ? formImages[formCoverIndex] || formImages[0] : undefined;

    if (activeModal === 'add') {
      const newService: StudioService = {
        id: `srv-${Date.now()}`,
        name: formName.trim(),
        category: formCategory.trim() || 'Signature Treatments',
        description: formDescription.trim(),
        price: formPrice,
        discountedPrice: discountNum,
        duration: formDuration.trim() || '60 min',
        imageUrl: coverUrl,
        images: formImages,
        coverImageIndex: formCoverIndex,
        isActive: formIsActive,
        popular: formIsPopular,
      };

      const updated = [newService, ...services];
      setServices(updated);
      onUpdateServices(updated);
      showToast(`Service "${newService.name}" created with ${formImages.length} photo(s).`);
    } else if ((activeModal === 'edit' || activeModal === 'manage_photos') && editingServiceId) {
      const updated = services.map((s) => {
        if (s.id === editingServiceId) {
          return {
            ...s,
            name: formName.trim(),
            category: formCategory.trim(),
            description: formDescription.trim(),
            price: formPrice,
            discountedPrice: discountNum,
            duration: formDuration.trim(),
            imageUrl: coverUrl,
            images: formImages,
            coverImageIndex: formCoverIndex,
            isActive: formIsActive,
            popular: formIsPopular,
          };
        }
        return s;
      });
      setServices(updated);
      onUpdateServices(updated);
      showToast(`Service "${formName}" updated successfully.`);
    }

    setActiveModal(null);
  };

  const handleToggleActive = (serviceId: string) => {
    const updated = services.map((s) => {
      if (s.id === serviceId) {
        const nextState = !s.isActive;
        showToast(`Service "${s.name}" is now ${nextState ? 'Active' : 'Deactivated'}.`);
        return { ...s, isActive: nextState };
      }
      return s;
    });
    setServices(updated);
    onUpdateServices(updated);
  };

  // Open Delete Confirmation Dialog
  const handlePromptDelete = (service: StudioService) => {
    setDeleteConfirmTarget(service);
    setActiveModal('delete_confirm');
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmTarget) return;
    const targetId = deleteConfirmTarget.id;
    const targetName = deleteConfirmTarget.name;

    const updated = services.filter((s) => s.id !== targetId);
    setServices(updated);
    onUpdateServices(updated);
    setActiveModal(null);
    setDeleteConfirmTarget(null);
    showToast(`Service "${targetName}" has been removed.`);
  };

  const uniqueCategories = ['all', ...Array.from(new Set(services.map((s) => s.category)))];

  const filteredServices = services.filter((s) => {
    if (filterCategory === 'all') return true;
    return s.category === filterCategory;
  });

  return (
    <div className="min-h-screen bg-[#faf7f5] pb-24">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Top Header */}
      <div className="bg-[#26152d] text-white py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('artisan_dashboard')}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#e8a3b8]">
                  Menu & Treatment Galleries
                </span>
                <span className="text-xs text-stone-400">Total Services: {services.length}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Service Management & Photo Uploads
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => onNavigate('studio_preview')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Eye className="w-4 h-4 text-pink-300" />
              <span>Beauty Shop Preview</span>
            </button>
            <button
              onClick={() => setActiveModal('catalog')}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-pink-300" />
              <span>Standard Catalog</span>
            </button>
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 bg-[#b86b86] hover:bg-[#a25974] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Service</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-3">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5 shadow-xs animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-sm font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* Filter and stats bar */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Tag className="w-4 h-4 text-stone-400 ml-1" />
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider mr-2">Category:</span>
            {uniqueCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs capitalize font-medium transition cursor-pointer shrink-0 ${
                  filterCategory === cat
                    ? 'bg-[#26152d] text-white font-bold'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-stone-500 pr-2">
            <span>
              Active: <strong className="text-emerald-700">{services.filter((s) => s.isActive).length}</strong>
            </span>
            <span>
              Deactivated: <strong className="text-stone-500">{services.filter((s) => !s.isActive).length}</strong>
            </span>
          </div>
        </div>

        {/* Services List / Cards */}
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-xs">
            <Scissors className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800">No services found</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Start building your menu by adding signature treatments, durations, multi-photo galleries, and South African Rand pricing.
            </p>
            <button
              onClick={handleOpenAddModal}
              className="mt-4 px-5 py-2.5 bg-[#b86b86] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 hover:bg-[#a25974] transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Service</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredServices.map((service) => {
              const photoCount = service.images?.length || (service.imageUrl ? 1 : 0);
              const coverImg = service.images?.[service.coverImageIndex || 0] || service.imageUrl;

              return (
                <div
                  key={service.id}
                  className={`bg-white rounded-2xl border transition-all shadow-xs p-5 flex flex-col justify-between ${
                    service.isActive
                      ? 'border-stone-200 hover:border-stone-300'
                      : 'border-stone-200/60 bg-stone-50/70 opacity-75'
                  }`}
                >
                  <div>
                    {/* Top Row: Category, Popular tag, Status badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                          {service.category}
                        </span>
                        {service.popular && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-100 text-[#b86b86] border border-pink-200 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#b86b86]" /> Popular
                          </span>
                        )}
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          service.isActive 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                            : 'bg-stone-100 text-stone-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${service.isActive ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      {/* Photo counter badge */}
                      <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-stone-500" />
                        <span>{photoCount} {photoCount === 1 ? 'photo' : 'photos'}</span>
                      </span>
                    </div>

                    {/* Middle: Cover Photo, Title, Description, Price & Duration */}
                    <div className="flex gap-4">
                      {coverImg ? (
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-stone-200 bg-stone-100">
                          <img
                            src={coverImg}
                            alt={service.name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 left-1 bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                            Cover
                          </span>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-xl border border-dashed border-stone-300 bg-stone-50 flex flex-col items-center justify-center text-stone-400 shrink-0 text-center p-1">
                          <ImageIcon className="w-6 h-6 mb-1 text-stone-300" />
                          <span className="text-[9px]">No photos</span>
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h4 className="text-base font-bold text-[#26152d] leading-snug">{service.name}</h4>
                        <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
                          {service.description || 'No detailed description provided.'}
                        </p>
                        
                        <div className="flex items-center gap-3 mt-3 text-xs">
                          {/* Price & Optional Discount */}
                          <div className="flex items-baseline gap-1.5">
                            {service.discountedPrice ? (
                              <>
                                <span className="font-bold text-[#b86b86] text-base">
                                  R{service.discountedPrice}
                                </span>
                                <span className="text-stone-400 line-through text-xs">
                                  R{service.price}
                                </span>
                              </>
                            ) : (
                              <span className="font-bold text-[#26152d] text-base">
                                R{service.price}
                              </span>
                            )}
                          </div>

                          <span className="flex items-center gap-1 text-stone-500 font-medium">
                            <Clock className="w-3.5 h-3.5 text-stone-400" /> {service.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Toolbar */}
                  <div className="mt-5 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    {/* Left: Activate / Deactivate Toggle */}
                    <button
                      onClick={() => handleToggleActive(service.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                        service.isActive
                          ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                      title={service.isActive ? 'Deactivate this service' : 'Activate this service'}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{service.isActive ? 'Deactivate' : 'Activate'}</span>
                    </button>

                    {/* Right: Manage Photos, Edit, Delete */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenManagePhotosModal(service)}
                        className="px-2.5 py-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 text-[#b86b86] border border-pink-200 font-semibold flex items-center gap-1 cursor-pointer transition text-xs"
                        title="Manage photos for this service"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Manage Photos ({photoCount})</span>
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(service)}
                        className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 font-semibold flex items-center gap-1 cursor-pointer transition text-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handlePromptDelete(service)}
                        className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 cursor-pointer transition"
                        title="Delete service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Service Modal (Includes Full Service Details & Image Uploader) */}
      {(activeModal === 'add' || activeModal === 'edit' || activeModal === 'manage_photos') && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-[#b86b86]" />
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  {activeModal === 'add' 
                    ? 'Add New Treatment Service' 
                    : activeModal === 'manage_photos'
                    ? `Manage Service Photos • ${formName}`
                    : 'Edit Service Details & Photos'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveModal} className="space-y-5 text-xs sm:text-sm">
              {/* Only show text fields if in 'add' or 'edit' mode */}
              {activeModal !== 'manage_photos' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Service Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Knotless Goddess Braids (Mid-Back)"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-stone-300 rounded-xl focus:border-[#b86b86] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Service Category *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Braids & Trichology"
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-stone-300 rounded-xl focus:border-[#b86b86] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Estimated Duration *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 180 min or 3 hrs"
                        value={formDuration}
                        onChange={(e) => setFormDuration(e.target.value)}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-stone-300 rounded-xl focus:border-[#b86b86] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Regular Price in ZAR (R) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 font-bold text-stone-500 text-xs">R</span>
                        <input
                          type="number"
                          min={0}
                          required
                          value={formPrice}
                          onChange={(e) => setFormPrice(Number(e.target.value))}
                          className="w-full pl-8 pr-3.5 py-2.5 text-xs sm:text-sm font-bold border border-stone-300 rounded-xl focus:border-[#b86b86] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Optional Promotional / Discounted Price (R)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 font-bold text-[#b86b86] text-xs">R</span>
                        <input
                          type="number"
                          min={0}
                          placeholder="e.g. 480 (Leave blank if none)"
                          value={formDiscountedPrice}
                          onChange={(e) => setFormDiscountedPrice(e.target.value)}
                          className="w-full pl-8 pr-3.5 py-2.5 text-xs sm:text-sm font-bold border border-stone-300 rounded-xl focus:border-[#b86b86] outline-none"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Service Description & Preparation Notes *
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Detail the technique, client hair prep requirements, included wash or styling products..."
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:border-[#b86b86] outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* DEDICATED SERVICE IMAGE UPLOADER SECTION */}
              <div className="pt-2 border-t border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#b86b86]" />
                      Service Photos Gallery
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Showcase up to 5 high-resolution examples specifically for this treatment.
                    </p>
                  </div>

                  {/* Counter: e.g. "2 of 5 images uploaded" */}
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    formImages.length >= MAX_IMAGES_PER_SERVICE
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-pink-50 text-[#b86b86] border border-pink-200'
                  }`}>
                    {formImages.length} of {MAX_IMAGES_PER_SERVICE} images uploaded
                  </span>
                </div>

                {/* Error message */}
                {imageErrorMessage && (
                  <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{imageErrorMessage}</span>
                  </div>
                )}

                {/* Upload Progress Bar */}
                {imageUploadProgress !== null && (
                  <div className="mb-3 p-3 rounded-xl bg-pink-50 border border-pink-200 space-y-1.5">
                    <div className="flex justify-between text-[11px] font-semibold text-[#b86b86]">
                      <span>Uploading service image...</span>
                      <span>{imageUploadProgress}%</span>
                    </div>
                    <div className="w-full bg-pink-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#b86b86] h-2 transition-all duration-300"
                        style={{ width: `${imageUploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Drag and Drop Zone (Desktop) + Mobile File Picker */}
                {formImages.length < MAX_IMAGES_PER_SERVICE && (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                    onDragLeave={() => setIsDraggingOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-6 rounded-2xl border-2 border-dashed text-center transition cursor-pointer mb-4 ${
                      isDraggingOver
                        ? 'border-[#b86b86] bg-pink-50/50'
                        : 'border-stone-300 hover:border-[#b86b86] bg-stone-50/60'
                    }`}
                  >
                    <UploadCloud className="w-8 h-8 text-[#b86b86] mx-auto mb-2" />
                    <p className="text-xs font-bold text-stone-800">
                      Drag & drop photos here, or <span className="text-[#b86b86] underline">browse file picker</span>
                    </p>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Accepted: JPG, JPEG, PNG, WebP • Max 5 MB per photo • Up to {MAX_IMAGES_PER_SERVICE - formImages.length} more
                    </p>
                  </div>
                )}

                {/* Optional sample preset shortcut */}
                {formImages.length < MAX_IMAGES_PER_SERVICE && (
                  <div className="flex flex-wrap items-center gap-2 mb-4 p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                    <span className="text-[11px] text-stone-500 font-semibold">Test Presets:</span>
                    <button
                      type="button"
                      onClick={() => handleAddPreset('braids')}
                      className="px-2 py-0.5 rounded bg-white border border-stone-200 hover:border-stone-400 text-stone-700 text-[11px] cursor-pointer"
                    >
                      + Knotless Braids
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddPreset('nails')}
                      className="px-2 py-0.5 rounded bg-white border border-stone-200 hover:border-stone-400 text-stone-700 text-[11px] cursor-pointer"
                    >
                      + Nail Art
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddPreset('facials')}
                      className="px-2 py-0.5 rounded bg-white border border-stone-200 hover:border-stone-400 text-stone-700 text-[11px] cursor-pointer"
                    >
                      + Clinical Skincare
                    </button>
                  </div>
                )}

                {/* Image Previews Grid */}
                {formImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {formImages.map((imgUrl, idx) => {
                      const isCover = formCoverIndex === idx;

                      return (
                        <div
                          key={idx}
                          className={`relative rounded-xl overflow-hidden border-2 transition group aspect-square bg-stone-100 ${
                            isCover ? 'border-[#b86b86] shadow-sm' : 'border-stone-200'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Service sample ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Cover Badge */}
                          {isCover ? (
                            <span className="absolute top-1.5 left-1.5 bg-[#b86b86] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 fill-white" /> Cover
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetCover(idx)}
                              className="absolute top-1.5 left-1.5 bg-black/60 hover:bg-[#b86b86] text-white text-[9px] font-semibold px-1.5 py-0.5 rounded transition opacity-0 group-hover:opacity-100 cursor-pointer"
                              title="Set as cover photo"
                            >
                              Set Cover
                            </button>
                          )}

                          {/* Action Overlay buttons */}
                          <div className="absolute bottom-1 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                            <button
                              type="button"
                              onClick={() => handleTriggerReplace(idx)}
                              className="p-1 rounded bg-black/70 hover:bg-black text-white text-[10px] cursor-pointer"
                              title="Replace photo"
                            >
                              <RotateCw className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1 rounded bg-rose-600/90 hover:bg-rose-700 text-white text-[10px] cursor-pointer"
                              title="Remove photo"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-stone-50 text-center text-xs text-stone-500">
                    No images uploaded yet. Upload up to 5 photos showing client results.
                  </div>
                )}
              </div>

              {/* Toggles (Only in Add / Edit) */}
              {activeModal !== 'manage_photos' && (
                <div className="pt-3 flex flex-col sm:flex-row gap-4 border-t border-stone-100">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-[#b86b86] focus:ring-[#b86b86]"
                    />
                    <span className="text-xs font-semibold text-stone-800">
                      Active (Available for customer appointments)
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsPopular}
                      onChange={(e) => setFormIsPopular(e.target.checked)}
                      className="w-4 h-4 rounded text-[#b86b86] focus:ring-[#b86b86]"
                    />
                    <span className="text-xs font-semibold text-stone-800">
                      Feature as "Popular / Signature"
                    </span>
                  </label>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#b86b86] hover:bg-[#a25974] text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md"
                >
                  {activeModal === 'add' ? 'Create Service & Gallery' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {activeModal === 'delete_confirm' && deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-serif font-bold text-center text-stone-900 mb-2">
              Confirm Service Removal
            </h3>
            
            <p className="text-xs text-stone-600 text-center leading-relaxed mb-4">
              Are you sure you want to remove <strong className="text-stone-900 font-bold">"{deleteConfirmTarget.name}"</strong>? This will remove its pricing, description, and its {deleteConfirmTarget.images?.length || 0} associated photo(s) from your studio menu.
            </p>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs mb-5 flex items-center justify-between">
              <span className="text-stone-600">Investment:</span>
              <span className="font-bold text-stone-900">R{deleteConfirmTarget.price} ({deleteConfirmTarget.duration})</span>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => { setActiveModal(null); setDeleteConfirmTarget(null); }}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition cursor-pointer"
              >
                Keep Service
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
              >
                Delete Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Standard Service Catalog Modal */}
      {activeModal === 'catalog' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-[10px] font-bold text-[#b86b86] uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Marketplace Verified Catalog</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-[#26152d]">
                  Add from Standard Services Catalog
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Select a standardized service template. All pricing, durations, and details can be tailored to your studio.
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter and Search */}
            <div className="p-4 bg-stone-50/70 border-b border-stone-200 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search standard services (e.g. Braids, Nails, Barbering)..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                className="flex-1 text-xs px-3.5 py-2 bg-white border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
              />
              <div className="flex items-center gap-1 overflow-x-auto">
                {['all', 'Hair Styling & Braids', 'Nail Care & Art', 'Lashes & Brows', 'Makeup & Aesthetics', 'Skincare & Facials', 'Barbering & Grooming'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCatalogCategoryFilter(cat)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] whitespace-nowrap cursor-pointer transition ${
                      catalogCategoryFilter === cat
                        ? 'bg-[#26152d] text-white font-bold'
                        : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {cat === 'all' ? 'All Categories' : cat.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog List */}
            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              {STANDARD_SERVICES_CATALOG
                .filter((item) => {
                  const matchesCat = catalogCategoryFilter === 'all' || item.category === catalogCategoryFilter;
                  const matchesSearch = !catalogSearch.trim() || 
                    item.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                    item.description.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                    item.category.toLowerCase().includes(catalogSearch.toLowerCase());
                  return matchesCat && matchesSearch;
                })
                .map((item) => {
                  const alreadyAdded = services.some((s) => s.name.toLowerCase() === item.name.toLowerCase());
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-stone-200 hover:border-[#b86b86] bg-white transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:shadow-xs"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="text-sm font-bold text-stone-900">{item.name}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 font-semibold text-stone-600">
                            {item.category}
                          </span>
                          {alreadyAdded && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                              Already on your menu
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-stone-700">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            Typical: {item.defaultDuration}
                          </span>
                          <span className="text-[#b86b86] font-bold">
                            Avg. Investment: R{item.defaultPrice}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectCatalogItem(item)}
                          className="px-4 py-2 bg-[#26152d] hover:bg-[#382142] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5 text-pink-300" />
                          <span>Use Template</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
              <span className="text-xs text-stone-500">
                Services in standard catalog directly sync with customer filters and search tags.
              </span>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200/60 rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
