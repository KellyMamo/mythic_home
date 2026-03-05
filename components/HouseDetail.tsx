
import React, { useState, useMemo, useEffect } from 'react';
import { House } from '../types';
import EditableField from './Admin/EditableField';
import FilePicker from './Admin/FilePicker';
import { getDesignConsultation } from '../services/geminiService';
import { db } from '../services/dbService';
import { HOUSE_STYLES } from '../constants';

const PROPERTY_TYPES = [
  { id: 'Single Family', label: 'Single Family', icon: 'fa-solid fa-house-chimney' },
  { id: 'Multi-Family', label: 'Multi-Family', icon: 'fa-solid fa-house-chimney-window' },
  { id: 'Garages', label: 'Garages', icon: 'fa-solid fa-warehouse' },
  { id: 'Accessory Structures', label: 'Accessory Structures', icon: 'fa-solid fa-house-user' },
];
const BED_OPTIONS = [1, 2, 3, 4, 5];
const BATH_OPTIONS = [1, 1.5, 2, 2.5, 3, 3.5, 4];
const FLOOR_OPTIONS = [1, 2, 3];

interface HouseDetailProps {
  house: House;
  onClose: () => void;
  isEditing?: boolean;
  onUpdate?: (updated: House, originalId?: string) => Promise<boolean>;
  onReturnHome?: () => void;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
  isInCart?: boolean;
  onAddToCart?: () => void;
}

const HouseDetail: React.FC<HouseDetailProps> = ({ 
  house, 
  onClose, 
  isEditing = false, 
  onUpdate, 
  onReturnHome,
  isWishlisted,
  onToggleWishlist,
  isInCart,
  onAddToCart
}) => {
  const [currentHouse, setCurrentHouse] = useState<House>(house);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    setCurrentHouse(house);
    setCurrentImgIndex(0);
  }, [house.id]);

  // Derive the combined list for the UI viewer
  const allImages = useMemo(() => {
    const floorplanUrls = (currentHouse.floorplanUrls || []).map(fp => typeof fp === 'string' ? fp : fp.url);
    const list = [
      currentHouse.imageUrl,
      ...(currentHouse.galleryUrls || []),
      ...floorplanUrls
    ].filter(url => !!url);
    return list.length > 0 ? list : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'];
  }, [currentHouse.imageUrl, currentHouse.galleryUrls, currentHouse.floorplanUrls]);

  const updateField = (field: keyof House, value: any) => {
    setCurrentHouse(prev => ({ ...prev, [field]: value }));
  };

  const handlePrimaryImageUpdate = (url: string) => {
    setCurrentHouse(prev => {
      // If we already have a primary, move it to gallery so it's not lost
      const newGallery = prev.imageUrl && prev.imageUrl !== url 
        ? [prev.imageUrl, ...(prev.galleryUrls || [])] 
        : (prev.galleryUrls || []);
      
      return {
        ...prev,
        imageUrl: url,
        galleryUrls: newGallery.filter(u => u !== url) // Ensure no duplicates
      };
    });
    setCurrentImgIndex(0);
  };

  const addFloorplan = (url: string) => {
    setCurrentHouse(prev => {
      const currentFPs = prev.floorplanUrls || [];
      const newFP = { url, label: `Floor Plan ${currentFPs.length + 1}` };
      return {
        ...prev,
        floorplanUrls: [...currentFPs, newFP]
      };
    });
    // Switch to the new floorplan image
    setCurrentImgIndex(allImages.length);
  };

  const updateFloorplanLabel = (index: number, label: string) => {
    setCurrentHouse(prev => {
      const newFPs = [...(prev.floorplanUrls || [])];
      const current = newFPs[index];
      if (typeof current === 'string') {
        newFPs[index] = { url: current, label };
      } else {
        newFPs[index] = { ...current, label };
      }
      return { ...prev, floorplanUrls: newFPs };
    });
  };

  const deleteFloorplan = (index: number) => {
    setCurrentHouse(prev => ({
      ...prev,
      floorplanUrls: (prev.floorplanUrls || []).filter((_, i) => i !== index)
    }));
  };

  const addGalleryImage = (url: string) => {
    setCurrentHouse(prev => ({
      ...prev,
      galleryUrls: [...(prev.galleryUrls || []), url]
    }));
    // Switch to the new gallery image
    setCurrentImgIndex(1 + (currentHouse.galleryUrls?.length || 0));
  };

  const setAsPrimary = (url: string) => {
    setCurrentHouse(prev => {
      const oldPrimary = prev.imageUrl;
      const newGallery = (prev.galleryUrls || []).filter(u => u !== url);
      const newFloorplans = (prev.floorplanUrls || []).filter(u => u !== url);
      
      const updatedGallery = oldPrimary && oldPrimary !== url 
        ? [oldPrimary, ...newGallery] 
        : newGallery;
      
      return {
        ...prev,
        imageUrl: url,
        galleryUrls: updatedGallery,
        floorplanUrls: newFloorplans
      };
    });
    setCurrentImgIndex(0);
  };

  const deleteImage = (url: string) => {
    if (url === currentHouse.imageUrl) {
      alert("Primary photo cannot be deleted. Please upload or promote a different photo to primary first.");
      return;
    }

    setCurrentHouse(prev => ({
      ...prev,
      galleryUrls: (prev.galleryUrls || []).filter(u => u !== url),
      floorplanUrls: (prev.floorplanUrls || []).filter(u => {
        if (typeof u === 'string') return u !== url;
        return u.url !== url;
      })
    }));
    
    if (currentImgIndex >= allImages.length - 1) {
      setCurrentImgIndex(Math.max(0, allImages.length - 2));
    }
  };

  const handleSaveAndPublish = async () => {
    if (onUpdate) {
      setIsSaving(true);
      const finalHouse = { ...currentHouse, published: true, updatedAt: Date.now() };
      const success = await onUpdate(finalHouse, house.id);
      setIsSaving(false);
      if (success) {
        onClose();
      } else {
        alert("Failed to publish changes. The architectural plan might be too large or there was a server error.");
      }
    }
  };

  const handleSaveDraft = async () => {
    if (onUpdate) {
      setIsSaving(true);
      const finalHouse = { ...currentHouse, published: false, updatedAt: Date.now() };
      const success = await onUpdate(finalHouse, house.id);
      setIsSaving(false);
      if (success) {
        onClose();
      } else {
        alert("Failed to save draft. Please check your connection or try again.");
      }
    }
  };

  const handleDeletePlan = async () => {
    if (window.confirm('Delete this entire architectural project? This cannot be undone.')) {
      await db.deleteHouse(currentHouse.id);
      onClose();
    }
  };

  const handleAiDescribe = async () => {
    setIsAiLoading(true);
    const prompt = `Write a high-end architectural description for a ${currentHouse.style} home. Focus on the ${currentHouse.areaValue} sq ft layout, ${currentHouse.beds} bedrooms, and premium design features.`;
    const result = await getDesignConsultation(prompt);
    updateField('description', result);
    setIsAiLoading(false);
  };

  return (
    <div className="bg-white min-h-screen pb-20 relative">
      
      {isEditing && (
        <div className="sticky top-0 z-[60] bg-[#0e2a47] text-white px-6 py-4 flex items-center justify-between shadow-2xl border-b border-white/10">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Blueprint Editor</span>
              <div className={`flex items-center gap-2 mt-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${currentHouse.published ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                {currentHouse.published ? 'Publicly Visible' : 'Project Draft'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={handleDeletePlan} disabled={isSaving} className="text-xs font-bold text-red-400 hover:text-red-300 px-4 py-2 uppercase tracking-widest transition-colors mr-4 disabled:opacity-50">Delete Project</button>
            <button onClick={onClose} disabled={isSaving} className="bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50">Cancel</button>
            <button onClick={handleSaveDraft} disabled={isSaving} className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-lg disabled:opacity-50 flex items-center gap-2">
              {isSaving && <i className="fa-solid fa-circle-notch animate-spin"></i>}
              Save Draft
            </button>
            <button onClick={handleSaveAndPublish} disabled={isSaving} className="bg-[#f15a24] hover:bg-[#d1491a] text-white px-8 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-[#f15a24]/30 disabled:opacity-50 flex items-center gap-2">
              {isSaving && <i className="fa-solid fa-circle-notch animate-spin"></i>}
              Publish Changes
            </button>
          </div>
        </div>
      )}

      {/* Primary Gallery & Hero */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[700px]">
            {/* Hero Main View */}
            <div 
              className="flex-1 bg-[#0e2a47] rounded-3xl overflow-hidden relative shadow-2xl group aspect-[4/3] lg:aspect-auto border border-white/5 cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}
            >
              <img 
                src={allImages[currentImgIndex]} 
                alt="Main Architectural View" 
                className="w-full h-full object-contain transition-all duration-700"
              />
              
              {isEditing && currentImgIndex === 0 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-64">
                    <FilePicker label="Replace Primary Photo" onSelect={handlePrimaryImageUpdate} />
                   </div>
                </div>
              )}

              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-6 pointer-events-none">
                <button onClick={(e) => { e.stopPropagation(); setCurrentImgIndex(prev => (prev - 1 + allImages.length) % allImages.length); }} className="w-14 h-14 rounded-full bg-white/90 shadow-xl flex items-center justify-center text-slate-900 pointer-events-auto hover:scale-110 transition-transform"><i className="fa-solid fa-chevron-left"></i></button>
                <button onClick={(e) => { e.stopPropagation(); setCurrentImgIndex(prev => (prev + 1) % allImages.length); }} className="w-14 h-14 rounded-full bg-white/90 shadow-xl flex items-center justify-center text-slate-900 pointer-events-auto hover:scale-110 transition-transform"><i className="fa-solid fa-chevron-right"></i></button>
              </div>

              <div className="absolute bottom-8 right-8 bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl text-white text-xs font-bold uppercase tracking-[0.3em]">
                {currentImgIndex + 1} <span className="text-white/40 mx-2">/</span> {allImages.length}
              </div>
            </div>

            {/* Thumbnail Manager */}
            <div className="w-full lg:w-72 flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto no-scrollbar pb-4 lg:pb-0">
              {allImages.map((url, i) => (
                <div key={i} className="relative group shrink-0 w-40 md:w-48 lg:w-full">
                  <div 
                    onClick={() => setCurrentImgIndex(i)}
                    className={`relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border-4 transition-all duration-300 ${i === currentImgIndex ? 'border-[#f15a24] shadow-xl scale-[0.98]' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={url} className="w-full h-full object-cover" alt="" />
                    {url === currentHouse.imageUrl && (
                      <div className="absolute top-2 right-2 bg-[#f15a24] text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                        <i className="fa-solid fa-star text-[10px]"></i>
                      </div>
                    )}
                  </div>
                  
                  {isEditing && (
                    <div className="flex gap-2 mt-2 px-1">
                      {url !== currentHouse.imageUrl && (
                        <button 
                          onClick={() => setAsPrimary(url)}
                          className="flex-1 bg-slate-900 text-white py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-amber-500 transition-colors"
                        >
                          Make Primary
                        </button>
                      )}
                      {url !== currentHouse.imageUrl && (
                        <button 
                          onClick={() => deleteImage(url)}
                          className="bg-slate-100 text-red-500 w-10 py-2 rounded-lg text-[10px] hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {isEditing && (
                <div className="shrink-0 w-48 lg:w-full">
                  <FilePicker label="Add Gallery Photo" onSelect={addGalleryImage} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-40">
        <div className="bg-white p-12">
          <div className="flex flex-col lg:flex-row justify-between gap-16">
            <div className="flex-1">
              <div className="mb-4">
                 <h1 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                    <EditableField value={currentHouse.name} onSave={(val) => updateField('name', val)} label="Plan Name" isEditing={isEditing} />
                 </h1>
                  
                  {isEditing ? (
                    <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-200">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Categorization</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-widest ml-1">Architectural Style</label>
                          <select 
                            value={currentHouse.style} 
                            onChange={(e) => updateField('style', e.target.value)}
                            className="w-full h-14 px-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-[#f15a24]/10"
                          >
                            {HOUSE_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div className="space-y-3">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-widest ml-1">Property Category</label>
                          <div className="flex flex-wrap gap-2">
                             {PROPERTY_TYPES.map(cat => (
                               <button
                                 key={cat.id}
                                 onClick={() => updateField('propertyType', cat.id)}
                                 className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${currentHouse.propertyType === cat.id ? 'bg-[#0e2a47] border-[#0e2a47] text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                               >
                                 <i className={cat.icon}></i>
                                 {cat.label}
                               </button>
                             ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <span className="bg-[#f15a24]/10 text-[#f15a24] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">{currentHouse.style}</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">{currentHouse.propertyType || 'Single Family'}</span>
                    </div>
                  )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-8 border-y border-slate-100">
                <div className="space-y-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Total Area</p>
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-ruler-combined text-slate-300 text-xl"></i>
                    <p className="text-3xl font-bold text-slate-900 flex items-baseline gap-2">
                      <EditableField value={currentHouse.areaValue} onSave={(val) => updateField('areaValue', val)} type="number" label="Area" isEditing={isEditing} />
                      <span className="text-xs font-medium text-slate-400">SQ FT</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Bedrooms</p>
                  {isEditing ? (
                    <div className="flex flex-wrap gap-1.5">
                      {BED_OPTIONS.map(n => (
                        <button key={n} onClick={() => updateField('beds', n)} className={`w-10 h-10 rounded-xl text-xs font-black border-2 transition-all ${currentHouse.beds === n ? 'bg-[#0e2a47] text-white border-[#0e2a47]' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}>{n}{n === 5 ? '+' : ''}</button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-bed text-slate-300 text-xl"></i>
                      <p className="text-3xl font-bold text-slate-900">{currentHouse.beds} <span className="text-xs text-slate-400 ml-1 uppercase">Beds</span></p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Bathrooms</p>
                  {isEditing ? (
                    <div className="flex flex-wrap gap-1.5">
                      {BATH_OPTIONS.map(n => (
                        <button key={n} onClick={() => updateField('baths', n)} className={`px-2 h-10 rounded-xl text-[10px] font-black border-2 transition-all ${currentHouse.baths === n ? 'bg-[#0e2a47] text-white border-[#0e2a47]' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}>{n}{n === 4 ? '+' : ''}</button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-bath text-slate-300 text-xl"></i>
                      <p className="text-3xl font-bold text-slate-900">{currentHouse.baths} <span className="text-xs text-slate-400 ml-1 uppercase">Baths</span></p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Total Floors</p>
                  {isEditing ? (
                    <div className="flex flex-wrap gap-1.5">
                      {FLOOR_OPTIONS.map(n => (
                        <button key={n} onClick={() => updateField('floors', n)} className={`w-10 h-10 rounded-xl text-xs font-black border-2 transition-all ${currentHouse.floors === n ? 'bg-[#0e2a47] text-white border-[#0e2a47]' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}>{n}{n === 3 ? '+' : ''}</button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-layer-group text-slate-300 text-xl"></i>
                      <p className="text-3xl font-bold text-slate-900">{currentHouse.floors || 1} <span className="text-xs text-slate-400 ml-1 uppercase">Story</span></p>
                    </div>
                  )}
                </div>
              </div>

              

               

               

              

               
              {/* Floor Plans Section */}
              <div className="mt-16">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-bold text-slate-900">Floor Plans</h3>
                  {isEditing && (
                    <div className="w-48">
                      <FilePicker label="Add Floor Plan" onSelect={addFloorplan} />
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 gap-12">
                  {(currentHouse.floorplanUrls || []).length > 0 ? (
                    currentHouse.floorplanUrls.map((fp, i) => {
                      const url = typeof fp === 'string' ? fp : fp.url;
                      const label = typeof fp === 'string' ? `Floor Plan ${i + 1}` : fp.label;
                      return (
                        <div key={i} className="relative group">
                          <div className="absolute top-4 left-4 z-10">
                            {isEditing ? (
                              <input 
                                type="text" 
                                value={label} 
                                onChange={(e) => updateFloorplanLabel(i, e.target.value)}
                                className="bg-white/90 backdrop-blur-sm border border-slate-200 px-3 py-1 rounded text-[10px] font-bold text-slate-500 uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-[#f15a24]"
                              />
                            ) : (
                              <span className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                {label}
                              </span>
                            )}
                          </div>
                          
                          {isEditing && (
                            <button 
                              onClick={() => deleteFloorplan(i)}
                              className="absolute top-4 right-4 z-10 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              <i className="fa-solid fa-trash-can text-xs"></i>
                            </button>
                          )}

                          <div className="bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm">
                            <img src={url} alt={label} className="w-full h-auto object-contain max-h-[800px] mx-auto" />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                      <i className="fa-solid fa-map-location-dot text-4xl mb-4 opacity-20"></i>
                      <p className="text-xs font-bold uppercase tracking-widest">No Floor Plans Uploaded</p>
                      {isEditing && <p className="text-[10px] mt-2">Use the button above to add architectural drawings</p>}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-16">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-bold text-slate-900">Project Details</h3>
                  {isEditing && (
                    <button onClick={handleAiDescribe} disabled={isAiLoading} className="bg-[#f15a24]/5 text-[#f15a24] px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-[#f15a24]/10 disabled:opacity-50 flex items-center gap-3 transition-all">
                      {isAiLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                      {isAiLoading ? 'Synthesizing...' : 'Draft with AI Architect'}
                    </button>
                  )}
                </div>
                <div className="text-slate-600 leading-[2] text-xl font-serif italic opacity-80">
                  <EditableField value={currentHouse.description} onSave={(val) => updateField('description', val)} type="textarea" label="Description" isEditing={isEditing} />
                </div>
              </div>
            </div>

            <div className="lg:w-[400px]">
              <div className="bg-[#0e2a47] rounded-[2rem] p-8 text-white sticky top-40 shadow-2xl">
                <div className="mb-8">
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Starting at</p>
                    <button className="text-[10px] font-bold underline text-white/70 hover:text-white">What's included?</button>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black">$</span>
                    <span className="text-5xl font-black tracking-tighter">
                      <EditableField value={currentHouse.price} onSave={(val) => updateField('price', val)} type="number" label="Price" isEditing={isEditing} />
                    </span>
                  </div>
                </div>
                
                <div className="space-y-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/50 flex items-center gap-2">
                      Plan Set <i className="fa-solid fa-circle-info"></i>
                    </label>
                    <select className="w-full h-12 px-4 bg-white/10 border border-white/20 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#f15a24]">
                      <option className="text-slate-900">PDF - Single-Build - ${currentHouse.price}</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/50 flex items-center gap-2">
                      Foundation <i className="fa-solid fa-circle-info"></i>
                    </label>
                    <select className="w-full h-12 px-4 bg-white/10 border border-white/20 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#f15a24]">
                      <option className="text-slate-900">Monolithic Slab - +$0</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/50 flex items-center gap-2">
                      Options <i className="fa-solid fa-circle-info"></i>
                    </label>
                    <select className="w-full h-12 px-4 bg-white/10 border border-white/20 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#f15a24]">
                      <option className="text-slate-900">Optional Add-Ons - +$0</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={onAddToCart}
                    disabled={isInCart}
                    className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-4 ${isInCart ? 'bg-white/10 text-white/40 cursor-default' : 'bg-[#f15a24] hover:bg-[#d1491a] text-white shadow-[#f15a24]/30'}`}
                  >
                    <i className={`fa-solid ${isInCart ? 'fa-check' : 'fa-cart-shopping'}`}></i>
                    {isInCart ? 'In Your Cart' : 'Add to Cart'}
                  </button>
                  
                  <div className="flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/50">
                    <i className="fa-solid fa-shield-halved"></i>
                    Price Match Guarantee
                  </div>
                </div>

                {/* Cost to Build Report */}
                <div className="mt-10 pt-8 border-t border-white/10">
                  <h5 className="text-xs font-black uppercase tracking-widest mb-2">Cost to Build Report</h5>
                  <p className="text-[10px] text-white/60 mb-4 leading-relaxed">Still deciding? Calculate the cost to build this house in your area.</p>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Start with your Postal Code"
                      className="w-full h-12 px-4 bg-white rounded-xl text-slate-900 text-sm font-bold focus:outline-none"
                    />
                    <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors border border-white/10">
                      Order a Cost to Build Report
                    </button>
                  </div>
                </div>

                {/* Customize This Plan */}
                <div className="mt-8 pt-8 border-t border-white/10">
                  <h5 className="text-xs font-black uppercase tracking-widest mb-2">Customize This Plan</h5>
                  <p className="text-[10px] text-white/60 mb-4 leading-relaxed">Need to make changes? We will get you a free price quote within 1 to 3 business days.</p>
                  <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors border border-white/10">
                    Modify This Plan
                  </button>
                </div>

                {/* Cost to Furnish Report */}
                <div className="mt-8 pt-8 border-t border-white/10">
                  <h5 className="text-xs font-black uppercase tracking-widest mb-2">Cost to Furnish Report</h5>
                  <p className="text-[10px] text-white/60 mb-4 leading-relaxed">Instant room-by-room estimates for your entire furniture & home decor plan, matched to your budget.</p>
                  <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors border border-white/10">
                    Get your Cost to Furnish Report
                  </button>
                </div>
              </div>

              {/* Square Footage Breakdown */}
              <div className="mt-8 bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                <h5 className="text-xs font-black uppercase tracking-widest mb-6">Square Footage Breakdown</h5>
                <div className="space-y-3">
                  {(currentHouse.sqftBreakdown || [
                    { label: "Total Heated Area", value: "1,290 sq. ft." },
                    { label: "1st Floor", value: "1,290 sq. ft." },
                    { label: "Porch, Front", value: "112 sq. ft." },
                    { label: "Porch, Rear", value: "114 sq. ft." },
                    { label: "Porch, Combined", value: "226 sq. ft." }
                  ]).map((item, i) => (
                    <div key={i} className={`flex justify-between items-center py-2 ${i === 0 ? 'font-bold text-slate-900' : 'text-slate-600'} border-b border-slate-200`}>
                      <span className="text-xs">{item.label}</span>
                      <span className="text-xs font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Beds/Baths Summary */}
              <div className="mt-8 bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                <h5 className="text-xs font-black uppercase tracking-widest mb-6">Beds/Baths</h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-xs text-slate-600">Bedrooms</span>
                    <span className="text-xs font-bold text-slate-900">{currentHouse.beds}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-xs text-slate-600">Full bathrooms</span>
                    <span className="text-xs font-bold text-slate-900">{currentHouse.baths}</span>
                  </div>
                </div>
              </div>

              {/* Foundation Type */}
              <div className="mt-8 bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                <h5 className="text-xs font-black uppercase tracking-widest mb-6">Foundation Type</h5>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-xs text-slate-600 shrink-0">Standard Foundations:</span>
                    <span className="text-xs font-bold text-slate-900 text-right">{currentHouse.foundationType?.standard || "Monolithic Slab, Slab"}</span>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-xs text-slate-600 shrink-0">Optional Foundations:</span>
                    <span className="text-xs font-bold text-slate-900 text-right">{currentHouse.foundationType?.optional || "Crawl"}</span>
                  </div>
                </div>
                <button className="w-full bg-[#0e2a47]/10 hover:bg-[#0e2a47]/20 text-[#0e2a47] py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">
                  Request a different foundation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 lg:p-10 animate-in fade-in duration-300">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-8 right-8 text-white/60 hover:text-white text-4xl transition-colors z-[110]"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          <div className="relative w-full h-full flex items-center justify-center">
            <button 
              onClick={(e) => { e.stopPropagation(); setCurrentImgIndex(prev => (prev - 1 + allImages.length) % allImages.length); }}
              className="absolute left-4 lg:left-10 w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-2xl transition-all z-[110]"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            <img 
              src={allImages[currentImgIndex]} 
              className="max-w-full max-h-full object-contain shadow-2xl animate-in zoom-in-95 duration-500"
              alt="Full Size View"
            />

            <button 
              onClick={(e) => { e.stopPropagation(); setCurrentImgIndex(prev => (prev + 1) % allImages.length); }}
              className="absolute right-4 lg:right-10 w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-2xl transition-all z-[110]"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          <div className="absolute bottom-10 bg-white/10 backdrop-blur-md px-8 py-4 rounded-3xl text-white text-sm font-bold uppercase tracking-[0.4em]">
            {currentImgIndex + 1} <span className="text-white/40 mx-4">/</span> {allImages.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseDetail;
