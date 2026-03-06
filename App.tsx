
// import React, { useState, useEffect, useMemo } from 'react';
// import { House, SearchFilters, SortOption, AppView, GlobalFilters } from './types';
// import { db } from './services/dbService';
// import { HOUSE_STYLES } from './constants';
// import HouseCard from './components/HouseCard';
// import Filters from './components/Filters';
// import HouseDetail from './components/HouseDetail';
// import GeminiAssistant from './components/GeminiAssistant';
// import AuthModal from './components/AuthModal';
// import WishlistPage from './components/WishlistPage';
// import CartPage from './components/CartPage';
// import logo from './public/mythiclogo.png'; 

// const PROPERTY_TYPES = [
//   { id: 'Single Family', label: 'Single Family', icon: 'fa-solid fa-house-chimney' },
//   { id: 'Multi-Family', label: 'Multi-Family', icon: 'fa-solid fa-house-chimney-window' },
//   { id: 'Garages', label: 'Garages', icon: 'fa-solid fa-warehouse' },
//   { id: 'Accessory Structures', label: 'Accessory Structures', icon: 'fa-solid fa-house-user' },
// ];
// const BED_OPTIONS = [1, 2, 3, 4, 5];
// const BATH_OPTIONS = [1, 1.5, 2, 2.5, 3, 3.5, 4];
// const FLOOR_OPTIONS = [1, 2, 3];

// const InteractiveHeroImage: React.FC<{ images: string[], className?: string, alt?: string }> = ({ images, className = "", alt = "" }) => {
//   const [index, setIndex] = useState(0);
  
//   const handleClick = () => {
//     setIndex((prev) => (prev + 1) % images.length);
//   };

//   return (
//     <div className={`relative overflow-hidden group cursor-pointer ${className}`} onClick={handleClick}>
//       <img 
//         src={images[index]} 
//         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
//         alt={alt} 
//       />
//       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
//         <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm p-2 rounded-full text-white">
//           <i className="fa-solid fa-rotate"></i>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ScrollingStrip: React.FC<{ images: string[], delay: string, duration: string }> = ({ images, delay, duration }) => {
//   const displayImages = [...images, ...images, ...images];
//   return (
//     <div className="relative h-full w-full overflow-hidden">
//       <div 
//         className="flex flex-col gap-1 w-full animate-slide-up-stop"
//         style={{ 
//           animationDuration: duration,
//           animationDelay: delay,
//           animationFillMode: 'forwards'
//         }}
//       >
//         {displayImages.map((src, i) => (
//           <div key={i} className="w-full h-80 overflow-hidden flex-shrink-0">
//             <img 
//               src={src} 
//               alt="Architecture" 
//               className="w-full h-full object-cover animate-reveal-scale"
//               style={{ animationDelay: `${parseFloat(delay) + (i * 0.1)}s` }}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const App: React.FC = () => {
//   const [view, setView] = useState<AppView>({ type: 'public-list' });
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [userEmail, setUserEmail] = useState<string | null>(null);
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//   const [houses, setHouses] = useState<House[]>([]);
//   const [globalFilters, setGlobalFilters] = useState<GlobalFilters>({
//     allowedStyles: [],
//     allowedPropertyTypes: [],
//     allowedBeds: [],
//     allowedBaths: [],
//     allowedFloors: []
//   });
//   const initialFilters: SearchFilters = {
//     query: '',
//     minSqft: 0,
//     maxSqft: 10000,
//     beds: 0,
//     baths: 0,
//     style: '',
//     propertyType: ''
//   };
//   const [filters, setFilters] = useState<SearchFilters>(initialFilters);
//   const [sort, setSort] = useState<SortOption>('newest');
//   const [wishlist, setWishlist] = useState<string[]>([]);
//   const [cart, setCart] = useState<string[]>([]);

//   const refreshData = async () => {
//     try {
//       const [housesData, filtersData] = await Promise.all([
//         db.getHouses(),
//         db.getGlobalFilters()
//       ]);
//       console.log(`Data refreshed: ${housesData.length} houses found.`);
//       setHouses(housesData);
//       setGlobalFilters(filtersData);
//     } catch (err) {
//       console.error("Failed to refresh data:", err);
//     }
//   };

// useEffect(() => {
//   refreshData();
// }, []);

// useEffect(() => {
//   const savedAdmin = localStorage.getItem("isAdmin");
//   const savedEmail = localStorage.getItem("userEmail");

//   if (savedAdmin === "true") {
//     setIsAdmin(true);
//     setView({ type: "admin-list" });
//   }

//   if (savedEmail) {
//     setUserEmail(savedEmail);
//   }
// }, []);

//   const filteredHouses = useMemo(() => {
//     return houses.filter(h => {
//       if (!isAdmin && !h.published) return false;
//      if (!isAdmin) {
      
//   // Safe global visibility logic
//   if (
//     globalFilters.allowedStyles.length > 0 &&
//     !globalFilters.allowedStyles.includes(h.style)
//   ) return false;

//   if (
//     h.propertyType &&
//     globalFilters.allowedPropertyTypes.length > 0 &&
//     !globalFilters.allowedPropertyTypes.includes(h.propertyType)
//   ) return false;

//   if (
//     globalFilters.allowedBeds.length > 0 &&
//     !globalFilters.allowedBeds.includes(h.beds >= 5 ? 5 : h.beds)
//   ) return false;

//   if (
//     globalFilters.allowedBaths.length > 0 &&
//     !globalFilters.allowedBaths.includes(h.baths >= 4 ? 4 : h.baths)
//   ) return false;

//   if (
//     h.floors &&
//     globalFilters.allowedFloors.length > 0 &&
//     !globalFilters.allowedFloors.includes(h.floors >= 3 ? 3 : h.floors)
//   ) return false;
// }

//       // Public search logic
//       const query = filters.query.toLowerCase().trim();
//       let matchQuery = true;
//       if (query) {
//         const nameMatch = h.name.toLowerCase().includes(query) || 
//                          h.id.toLowerCase().includes(query) || 
//                          h.style.toLowerCase().includes(query);
        
//         // Natural language parsing for beds/baths
//         const bedMatch = query.match(/(\d+)\s*(?:bed\s*room|bedroom|br)/i);
//         const bathMatch = query.match(/(\d+)\s*(?:bath\s*room|bathroom|ba)/i);
        
//         let nlMatch = true;
//         let hasNl = false;
//         if (bedMatch) {
//           const num = parseInt(bedMatch[1]);
//           nlMatch = nlMatch && h.beds === num;
//           hasNl = true;
//         }
//         if (bathMatch) {
//           const num = parseInt(bathMatch[1]);
//           nlMatch = nlMatch && h.baths === num;
//           hasNl = true;
//         }
        
//         matchQuery = nameMatch || (hasNl && nlMatch);
//       }
      
//       const matchStyle = !filters.style || h.style === filters.style;
//       const matchSqft = h.areaValue >= (filters.minSqft || 0) && h.areaValue <= (filters.maxSqft || 10000);
      
//       // Exact match logic for beds and baths
//       const matchBeds = filters.beds === 0 || (filters.beds === 5 ? h.beds >= 5 : h.beds === filters.beds);
//       const matchBaths = filters.baths === 0 || (filters.baths === 4 ? h.baths >= 4 : h.baths === filters.baths);
      
//       const matchProp = !filters.propertyType || h.propertyType === filters.propertyType;
      
//       return matchQuery && matchStyle && matchSqft && matchBeds && matchBaths && matchProp;
//     }).sort((a, b) => {
//       if (sort === 'price-low') return a.price - b.price;
//       if (sort === 'sqft-high') return b.areaValue - a.areaValue;
//       return b.createdAt - a.createdAt;
//     });
//   }, [houses, filters, sort, isAdmin, globalFilters]);

//   const handleCreateNew = async () => {
//     try {
//       if (!isAdmin) setIsAdmin(true);
//       const newHouse = await db.createHouse();
//       if (newHouse) {
//         // Add to local state immediately to prevent blank screen during navigation
//         setHouses(prev => [newHouse, ...prev]);
//         setView({ type: 'admin-edit', id: newHouse.id });
//         // Then sync with server to ensure everything is perfect
//         await refreshData();
//       } else {
//         alert("Failed to create a new architectural plan. The server might be busy or storage is full.");
//       }
//     } catch (err) {
//       console.error("Error creating new house:", err);
//       alert("A technical error occurred while creating the plan. Please try again.");
//     }
//   };

//   const handleUpdate = async (updated: House, originalId?: string): Promise<boolean> => {
//     try {
//       const success = await db.saveHouse(updated, originalId);
//       if (success) {
//         // Update local state immediately if ID changed to avoid navigation issues
//         if (originalId && updated.id !== originalId) {
//           setHouses(prev => prev.map(h => h.id === originalId ? updated : h));
//           if (view.type === 'admin-edit' && (view as any).id === originalId) {
//             setView({ type: 'admin-edit', id: updated.id });
//           }
//         } else {
//           setHouses(prev => prev.map(h => h.id === updated.id ? updated : h));
//         }
        
//         await refreshData();
//       }
//       return success;
//     } catch (err) {
//       console.error("Error updating house:", err);
//       return false;
//     }
//   };

//   const navigateToDetail = (house: House) => {
//     if (isAdmin) {
//       setView({ type: 'admin-edit', id: house.id });
//     } else {
//       setView({ type: 'public-detail', slug: house.slug });
//     }
//   };

//   const returnToPublic = () => {
//     setIsAdmin(false);
//     setView({ type: 'public-list' });
//   };

//   const handleAuthSuccess = (adminStatus: boolean, email: string) => {
//   setIsAdmin(adminStatus);
//   setUserEmail(email);

//   localStorage.setItem("isAdmin", String(adminStatus));
//   localStorage.setItem("userEmail", email);

//   if (adminStatus) {
//     setView({ type: 'admin-list' });
//   } else {
//     setView({ type: 'public-list' });
//   }
// };

//   const toggleWishlist = (id: string) => {
//     setWishlist(prev => {
//       const newWishlist = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
//       if (userEmail) {
//         localStorage.setItem(`wishlist_${userEmail}`, JSON.stringify(newWishlist));
//       }
//       return newWishlist;
//     });
//   };

//   const addToCart = (id: string) => {
//     if (!cart.includes(id)) {
//       setCart(prev => {
//         const newCart = [...prev, id];
//         if (userEmail) {
//           localStorage.setItem(`cart_${userEmail}`, JSON.stringify(newCart));
//         }
//         return newCart;
//       });
//       setView({ type: 'cart' });
//     }
//   };

//   const removeFromCart = (id: string) => {
//     setCart(prev => {
//       const newCart = prev.filter(i => i !== id);
//       if (userEmail) {
//         localStorage.setItem(`cart_${userEmail}`, JSON.stringify(newCart));
//       }
//       return newCart;
//     });
//   };

//   useEffect(() => {
//     if (userEmail) {
//       const savedWishlist = localStorage.getItem(`wishlist_${userEmail}`);
//       const savedCart = localStorage.getItem(`cart_${userEmail}`);
//       if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
//       else setWishlist([]);
//       if (savedCart) setCart(JSON.parse(savedCart));
//       else setCart([]);
//     } else {
//       setWishlist([]);
//       setCart([]);
//     }
//   }, [userEmail]);

//   const clearFilters = () => {
//     setFilters(initialFilters);
//   };

//   const wishlistItems = useMemo(() => houses.filter(h => wishlist.includes(h.id)), [houses, wishlist]);
//   const cartItems = useMemo(() => houses.filter(h => cart.includes(h.id)), [houses, cart]);

//   useEffect(() => { window.scrollTo(0, 0); }, [view]);

//   const stripData = useMemo(() => {
//     const mainImages = houses.map(h => h.imageUrl).filter(img => !!img);
//     let pool = mainImages.length > 0 ? [...mainImages] : ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800'];
//     let shuffled = [...pool].sort(() => 0.5 - Math.random());
//     while (shuffled.length < 12) shuffled = [...shuffled, ...pool];
//     return {
//       set1: shuffled.slice(0, 4),
//       set2: shuffled.slice(4, 8),
//       set3: shuffled.slice(8, 12),
//     };
//   }, [houses]);

//   const logo = "mythiclogo.png";

//   return (
//     <div className="min-h-screen flex flex-col bg-white overflow-x-hidden font-sans">
//       <AuthModal 
//         isOpen={isAuthModalOpen} 
//         onClose={() => setIsAuthModalOpen(false)} 
//         onSuccess={handleAuthSuccess}
//       />
      
//       <header className="relative bg-[#0e2a47] text-white z-50">
//         <div className="max-w-[1400px] mx-auto px-6 py-6 relative z-30">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-4">
//             <div className="flex flex-col items-center cursor-pointer group" onClick={() => setView({ type: 'public-list' })}>
              
//               <div className="h-14 w-auto overflow-hidden">
//                 <img 
//                   src={logo} 
//                   className="h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity brightness-0 invert" 
//                   alt="Mythic Engineering Logo"
//                 />
//               </div>
//             </div>

//             <div className="flex-1 max-w-2xl w-full flex">
//               <div className="relative flex-1">
//                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
//                   <i className="fa-solid fa-magnifying-glass"></i>
//                 </span>
//                 <input 
//                   type="text" 
//                   placeholder="Search for your dream home"
//                   className="w-full h-12 pl-11 pr-4 rounded-l bg-[#0a1e33] text-white placeholder:text-white/40 border border-white/10 focus:border-white/30 focus:outline-none transition-all"
//                   value={filters.query}
//                   onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
//                 />
//               </div>
//               <button className="bg-[#f15a24] hover:bg-[#d1491a] px-8 h-12 rounded-r font-bold text-sm transition-colors uppercase tracking-widest text-white">
//                 SEARCH
//               </button>
//             </div>

//             <div className="flex items-center gap-6">
//               <button 
//                 onClick={() => { 
//                   if (isAdmin || userEmail) {
//                     setIsAdmin(false);
//                     setUserEmail(null);
//                     setView({ type: 'public-list' });
//                   } else {
//                     setIsAuthModalOpen(true);
//                   }
//                 }}
//                 className="text-[10px] border border-white/20 px-3 py-1 rounded uppercase font-bold tracking-widest hover:bg-white/10 text-white"
//               >
//                 {isAdmin ? 'ADMIN ACTIVE' : userEmail ? `LOGOUT (${userEmail.split('@')[0]})` : 'SIGN IN'}
//               </button>
//               <div className="flex gap-4 text-xl text-white">
//                 <div className="relative group" onClick={() => setView({ type: 'wishlist' })}>
//                   <i className={`fa-${wishlist.length > 0 ? 'solid' : 'regular'} fa-heart cursor-pointer hover:text-[#f15a24] transition-colors ${view.type === 'wishlist' ? 'text-[#f15a24]' : ''}`}></i>
//                   {wishlist.length > 0 && (
//                     <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
//                       {wishlist.length}
//                     </span>
//                   )}
//                 </div>
//                 <div className="relative group" onClick={() => setView({ type: 'cart' })}>
//                   <i className={`fa-solid fa-cart-shopping cursor-pointer hover:text-[#f15a24] transition-colors ${view.type === 'cart' ? 'text-[#f15a24]' : ''}`}></i>
//                   {cart.length > 0 && (
//                     <span className="absolute -top-2 -right-2 bg-[#f15a24] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
//                       {cart.length}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 py-4 border-t border-white/10">
//             {['All Plans', 'New Arrivals', 'Styles', 'Collections', 'Cost to Build', 'Multi-Family', 'Garages'].map(link => (
//               <a key={link} href="#" className="text-[11px] font-bold uppercase tracking-wider text-white hover:text-slate-300 transition-colors">{link}</a>
//             ))}
//           </div>
//         </div>
//       </header>

//       {view.type === 'public-list' && (
//         <>
//           <section className="relative bg-[#0e2a47] text-white overflow-hidden">
//             <div className="grid grid-cols-2 md:grid-cols-5 h-auto md:h-[500px] lg:h-[700px]">
//               {/* Row 1, Col 1-2: Large Image */}
//               <InteractiveHeroImage 
//                 images={stripData.set1} 
//                 className="col-span-2 row-span-1 md:row-span-2 h-[300px] md:h-auto" 
//                 alt="Featured Home" 
//               />

//               {/* Row 1, Col 3: Modify Block */}
//               <div className="bg-[#0e2a47] flex flex-col justify-center p-6 md:p-8 border-l border-b md:border-b-0 border-white/5 h-[150px] md:h-auto">
//                 <h3 className="text-xl md:text-3xl font-bold mb-1 text-white">Modify</h3>
//                 <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
//                   Your Plan <i className="fa-solid fa-arrow-right text-[10px]"></i>
//                 </p>
//               </div>

//               {/* Row 1, Col 4: Image */}
//               <InteractiveHeroImage 
//                 images={stripData.set2} 
//                 className="h-[150px] md:h-auto"
//                 alt="Architectural Detail" 
//               />

//               {/* Row 1, Col 5: 25,000+ Block */}
//               <div className="bg-[#0e2a47] flex flex-col justify-center p-6 md:p-8 border-l border-b md:border-b-0 border-white/5 h-[150px] md:h-auto">
//                 <h3 className="text-xl md:text-3xl font-bold mb-1 text-white">25,000+</h3>
//                 <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
//                   Curated Plans <i className="fa-solid fa-arrow-right text-[10px]"></i>
//                 </p>
//               </div>

//               {/* Row 2, Col 1: Image (Hidden on mobile to keep grid clean, or just let it flow) */}
//               <InteractiveHeroImage 
//                 images={stripData.set3} 
//                 className="h-[150px] md:h-auto"
//                 alt="Modern Design" 
//               />

//               {/* Row 2, Col 2: Trending Block */}
//               <div className="bg-[#0e2a47] flex flex-col justify-center p-6 md:p-8 border-l border-white/5 h-[150px] md:h-auto">
//                 <h3 className="text-xl md:text-3xl font-bold mb-1 text-white">Trending</h3>
//                 <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
//                   House Plans <i className="fa-solid fa-arrow-right text-[10px]"></i>
//                 </p>
//               </div>

//               {/* Row 2, Col 3: Image */}
//               <InteractiveHeroImage 
//                 images={[...stripData.set1].reverse()} 
//                 className="h-[150px] md:h-auto"
//                 alt="Interior View" 
//               />

//               {/* Row 2, Col 4: Image */}
//               <InteractiveHeroImage 
//                 images={[...stripData.set2].reverse()} 
//                 className="h-[150px] md:h-auto"
//                 alt="Exterior View" 
//               />

//               {/* Row 2, Col 5: Image */}
//               <InteractiveHeroImage 
//                 images={[...stripData.set3].reverse()} 
//                 className="h-[150px] md:h-auto"
//                 alt="Luxury Home" 
//               />
//             </div>
//           </section>

//           <div className="relative z-40 flex justify-center -mt-8 bg-transparent">
//             <div className="bg-white px-16 py-5 rounded-t-[2.5rem] shadow-[0_-15px_45px_rgba(255,255,255,0.9)] border-t border-x border-slate-100 flex items-center justify-center animate-glow transition-all">
//               <span className="text-slate-900 font-black uppercase tracking-[0.5em] text-[14px] whitespace-nowrap">
//                 Explore Featured Homes
//               </span>
//             </div>
//           </div>
//         </>
//       )}

//       <main className="flex-1 flex flex-col">
//         {view.type === 'public-list' || view.type === 'admin-list' ? (
//           <div className="flex-1">
//             <Filters filters={filters} setFilters={setFilters} onClear={clearFilters} />
//             <div className="max-w-7xl mx-auto px-4 py-16">
//               <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 pb-4 border-b border-slate-100 gap-6">
//                 <div className="flex items-center gap-6">
//                   <h2 className="text-3xl font-bold text-slate-900">
//                     {isAdmin ? 'Listing Management' : 'Exclusive Home Designs'}
//                   </h2>
//                   {isAdmin && (
//                     <button 
//                       onClick={returnToPublic}
//                       className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold transition-all border border-slate-200"
//                     >
//                       <i className="fa-solid fa-house"></i>
//                       Return to Public Site
//                     </button>
//                   )}
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Sort By</span>
//                   <select 
//                     value={sort} 
//                     onChange={(e) => setSort(e.target.value as SortOption)}
//                     className="bg-white border-b border-slate-300 px-2 py-1 text-sm font-bold focus:outline-none focus:border-[#f15a24]"
//                   >
//                     <option value="newest">Latest First</option>
//                     <option value="price-low">Price: Low to High</option>
//                     <option value="sqft-high">Area: Large to Small</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//                 {isAdmin && (
//                   <button 
//                     onClick={handleCreateNew}
//                     className="relative group bg-slate-50 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-dashed border-slate-200 hover:border-[#0e2a47] flex flex-col items-center justify-center min-h-[400px]"
//                   >
//                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 group-hover:bg-[#0e2a47] transition-all duration-500 shadow group-hover:text-white">
//                       <i className="fa-solid fa-plus text-2xl"></i>
//                     </div>
//                     <div className="text-center px-6">
//                       <h3 className="text-xl font-bold text-slate-400 group-hover:text-[#0e2a47] transition-colors mb-2">
//                         New Architectural Plan
//                       </h3>
//                       <p className="text-sm text-slate-400 font-medium">
//                         Start a new drafting project
//                       </p>
//                     </div>
//                   </button>
//                 )}

//                 {filteredHouses.map(h => (
//                   <div key={h.id} className="relative group">
//                     <HouseCard 
//                       plan={{...h, sqft: h.areaValue, garages: h.garageCars}} 
//                       onClick={() => navigateToDetail(h)} 
//                       isWishlisted={wishlist.includes(h.id)}
//                       onToggleWishlist={(e) => { e.stopPropagation(); toggleWishlist(h.id); }}
//                     />
//                     {isAdmin && !h.published && (
//                       <span className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Draft</span>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               {filteredHouses.length === 0 && (
//                 <div className="text-center py-20">
//                   <div className="text-5xl text-slate-200 mb-4"><i className="fa-solid fa-house-circle-xmark"></i></div>
//                   <h3 className="text-xl font-bold text-slate-800">No matches found</h3>
//                   <p className="text-slate-500 mt-2">The current search parameters did not return any results.</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : view.type === 'public-detail' ? (
//           (() => {
//             const house = houses.find(h => h.slug === view.slug);
//             if (!house) return null;
//             return (
//               <HouseDetail 
//                 house={house} 
//                 onClose={() => setView({ type: 'public-list' })} 
//                 isWishlisted={wishlist.includes(house.id)}
//                 onToggleWishlist={() => toggleWishlist(house.id)}
//                 isInCart={cart.includes(house.id)}
//                 onAddToCart={() => addToCart(house.id)}
//               />
//             );
//           })()
//         ) : view.type === 'wishlist' ? (
//           <WishlistPage 
//             items={wishlistItems}
//             onRemove={toggleWishlist}
//             onViewDetail={navigateToDetail}
//             onContinue={() => setView({ type: 'public-list' })}
//           />
//         ) : view.type === 'cart' ? (
//           <CartPage 
//             items={cartItems}
//             onRemove={removeFromCart}
//             onCheckout={() => alert('Checkout functionality coming soon!')}
//             onContinue={() => setView({ type: 'public-list' })}
//           />
//         ) : (
//           (() => {
//             const house = houses.find(h => h.id === (view as any).id);
//             if (!house) return null;
//             return (
//               <HouseDetail 
//                 house={house} 
//                 onClose={() => setView({ type: isAdmin ? 'admin-list' : 'public-list' })} 
//                 isEditing={true}
//                 onUpdate={handleUpdate}
//                 onReturnHome={returnToPublic}
//               />
//             );
//           })()
//         )}
//       </main>

//       <footer className="bg-[#0e2a47] text-white pt-24 pb-12 mt-auto">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-white/10">
//             <div className="md:col-span-2">
//               <div className="flex flex-col items-start gap-2 mb-6">
               
//                 <div className="h-16 w-auto">
//                    <img src={logo} className="h-full object-contain" alt="Footer Logo" />
//                 </div>
//               </div>
//               <p className="text-slate-400 max-w-sm leading-relaxed">
//                 Curating the world's most sophisticated architectural plans. Designed for living, built for legacy.
//               </p>
//             </div>
//             <div>
//               <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-slate-300">EXPLORE</h4>
//               <ul className="space-y-3 text-sm text-slate-400 font-medium">
//                 <li><a href="#" className="hover:text-white transition-colors">Popular Collections</a></li>
//                 <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
//                 <li><a href="#" className="hover:text-white transition-colors">Find a Builder</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-slate-300">FOLLOW US</h4>
//               <div className="flex gap-4 text-xl text-slate-400">
//                 <i className="fa-brands fa-instagram cursor-pointer hover:text-white"></i>
//                 <i className="fa-brands fa-pinterest cursor-pointer hover:text-white"></i>
//               </div>
//             </div>
//           </div>
//           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-8">© 2024 Mythic Homes. Premium Architectural Solutions.</p>
//         </div>
//       </footer>

//      {import.meta.env.DEV && <GeminiAssistant />}

//       <style>{`
//         @keyframes slideUpStop {
//           0% { transform: translateY(0); opacity: 0; }
//           15% { opacity: 1; }
//           100% { transform: translateY(-33.33%); opacity: 1; }
//         }
//         @keyframes revealScale {
//           0% { transform: scale(1.15); filter: blur(5px); }
//           100% { transform: scale(1); filter: blur(0); }
//         }
//         @keyframes glowPulse {
//           0%, 100% { box-shadow: 0 -10px 30px rgba(255,255,255,0.7); transform: scale(1); }
//           50% { box-shadow: 0 -20px 60px rgba(255,255,255,1); transform: scale(1.02); }
//         }
//         .animate-slide-up-stop { animation: slideUpStop cubic-bezier(0.22, 1, 0.36, 1) both; }
//         .animate-reveal-scale { animation: revealScale 2.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
//         .animate-glow { animation: glowPulse 2.5s ease-in-out infinite; }
//       `}</style>
//     </div>
//   );
// };

// export default App;
import React, { useState, useEffect, useMemo } from 'react';
import { House, SearchFilters, SortOption, AppView, GlobalFilters } from './types';
import { db } from './services/dbService';
import HouseCard from './components/HouseCard';
import Filters from './components/Filters';
import HouseDetail from './components/HouseDetail';
import GeminiAssistant from './components/GeminiAssistant';
import AuthModal from './components/AuthModal';
import WishlistPage from './components/WishlistPage';
import CartPage from './components/CartPage';

const InteractiveHeroImage: React.FC<{ images: string[]; className?: string; alt?: string }> = ({
  images,
  className = '',
  alt = '',
}) => {
  const [index, setIndex] = useState(0);

  const handleClick = () => {
    if (!images.length) return;
    setIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className={`relative overflow-hidden group cursor-pointer ${className}`} onClick={handleClick}>
      <img
        src={images[index] || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800'}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        alt={alt}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm p-2 rounded-full text-white">
          <i className="fa-solid fa-rotate"></i>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>({ type: 'public-list' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [houses, setHouses] = useState<House[]>([]);
  const [globalFilters, setGlobalFilters] = useState<GlobalFilters>({
    allowedStyles: [],
    allowedPropertyTypes: [],
    allowedBeds: [],
    allowedBaths: [],
    allowedFloors: [],
  });

  const initialFilters: SearchFilters = {
    query: '',
    minSqft: 0,
    maxSqft: 10000,
    beds: 0,
    baths: 0,
    style: '',
    propertyType: '',
  };

  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [sort, setSort] = useState<SortOption>('newest');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);

  const refreshData = async () => {
    try {
      const [housesData, filtersData] = await Promise.all([db.getHouses(), db.getGlobalFilters()]);
      console.log(`Data refreshed: ${housesData.length} houses found.`);
      setHouses(housesData);
      setGlobalFilters(filtersData);
    } catch (err) {
      console.error('Failed to refresh data:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Restore saved login/admin state
  useEffect(() => {
    const savedAdmin = localStorage.getItem('isAdmin');
    const savedEmail = localStorage.getItem('userEmail');

    if (savedAdmin === 'true') {
      setIsAdmin(true);
      setView({ type: 'admin-list' });
    }

    if (savedEmail) {
      setUserEmail(savedEmail);
    }
  }, []);

  const filteredHouses = useMemo(() => {
    return houses
      .filter((h) => {
        if (!isAdmin && !h.published) return false;

        if (!isAdmin) {
          if (globalFilters.allowedStyles.length > 0 && !globalFilters.allowedStyles.includes(h.style)) return false;

          if (
            h.propertyType &&
            globalFilters.allowedPropertyTypes.length > 0 &&
            !globalFilters.allowedPropertyTypes.includes(h.propertyType)
          ) {
            return false;
          }

          if (
            globalFilters.allowedBeds.length > 0 &&
            !globalFilters.allowedBeds.includes(h.beds >= 5 ? 5 : h.beds)
          ) {
            return false;
          }

          if (
            globalFilters.allowedBaths.length > 0 &&
            !globalFilters.allowedBaths.includes(h.baths >= 4 ? 4 : h.baths)
          ) {
            return false;
          }

          if (
            h.floors &&
            globalFilters.allowedFloors.length > 0 &&
            !globalFilters.allowedFloors.includes(h.floors >= 3 ? 3 : h.floors)
          ) {
            return false;
          }
        }

        const query = filters.query.toLowerCase().trim();
        let matchQuery = true;

        if (query) {
          const nameMatch =
            h.name.toLowerCase().includes(query) ||
            h.id.toLowerCase().includes(query) ||
            h.style.toLowerCase().includes(query);

          const bedMatch = query.match(/(\d+)\s*(?:bed\s*room|bedroom|br)/i);
          const bathMatch = query.match(/(\d+)\s*(?:bath\s*room|bathroom|ba)/i);

          let nlMatch = true;
          let hasNl = false;

          if (bedMatch) {
            const num = parseInt(bedMatch[1]);
            nlMatch = nlMatch && h.beds === num;
            hasNl = true;
          }

          if (bathMatch) {
            const num = parseInt(bathMatch[1]);
            nlMatch = nlMatch && h.baths === num;
            hasNl = true;
          }

          matchQuery = nameMatch || (hasNl && nlMatch);
        }

        const matchStyle = !filters.style || h.style === filters.style;
        const matchSqft =
          h.areaValue >= (filters.minSqft || 0) && h.areaValue <= (filters.maxSqft || 10000);
        const matchBeds = filters.beds === 0 || (filters.beds === 5 ? h.beds >= 5 : h.beds === filters.beds);
        const matchBaths =
          filters.baths === 0 || (filters.baths === 4 ? h.baths >= 4 : h.baths === filters.baths);
        const matchProp = !filters.propertyType || h.propertyType === filters.propertyType;

        return matchQuery && matchStyle && matchSqft && matchBeds && matchBaths && matchProp;
      })
      .sort((a, b) => {
        if (sort === 'price-low') return a.price - b.price;
        if (sort === 'sqft-high') return b.areaValue - a.areaValue;
        return b.createdAt - a.createdAt;
      });
  }, [houses, filters, sort, isAdmin, globalFilters]);

  const handleCreateNew = async () => {
    try {
      if (!isAdmin) setIsAdmin(true);

      const newHouse = await db.createHouse();

      if (newHouse) {
        setHouses((prev) => [newHouse, ...prev]);
        setView({ type: 'admin-edit', id: newHouse.id });
        await refreshData();
      } else {
        alert('Failed to create a new architectural plan. The server might be busy or storage is full.');
      }
    } catch (err) {
      console.error('Error creating new house:', err);
      alert('A technical error occurred while creating the plan. Please try again.');
    }
  };

  const handleUpdate = async (updated: House, originalId?: string): Promise<boolean> => {
    try {
      const success = await db.saveHouse(updated, originalId);

      if (success) {
        if (originalId && updated.id !== originalId) {
          setHouses((prev) => prev.map((h) => (h.id === originalId ? updated : h)));
          if (view.type === 'admin-edit' && (view as any).id === originalId) {
            setView({ type: 'admin-edit', id: updated.id });
          }
        } else {
          setHouses((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
        }

        await refreshData();
      }

      return success;
    } catch (err) {
      console.error('Error updating house:', err);
      return false;
    }
  };

  const navigateToDetail = (house: House) => {
    if (isAdmin) {
      setView({ type: 'admin-edit', id: house.id });
    } else {
      setView({ type: 'public-detail', slug: house.slug });
    }
  };

  const returnToPublic = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    setView({ type: 'public-list' });
  };

  const handleAuthSuccess = (adminStatus: boolean, email: string) => {
    setIsAdmin(adminStatus);
    setUserEmail(email);

    localStorage.setItem('isAdmin', String(adminStatus));
    localStorage.setItem('userEmail', email);

    if (adminStatus) {
      setView({ type: 'admin-list' });
    } else {
      setView({ type: 'public-list' });
    }
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const newWishlist = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      if (userEmail) {
        localStorage.setItem(`wishlist_${userEmail}`, JSON.stringify(newWishlist));
      }
      return newWishlist;
    });
  };

  const addToCart = (id: string) => {
    if (!cart.includes(id)) {
      setCart((prev) => {
        const newCart = [...prev, id];
        if (userEmail) {
          localStorage.setItem(`cart_${userEmail}`, JSON.stringify(newCart));
        }
        return newCart;
      });
      setView({ type: 'cart' });
    }
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const newCart = prev.filter((i) => i !== id);
      if (userEmail) {
        localStorage.setItem(`cart_${userEmail}`, JSON.stringify(newCart));
      }
      return newCart;
    });
  };

  useEffect(() => {
    if (userEmail) {
      const savedWishlist = localStorage.getItem(`wishlist_${userEmail}`);
      const savedCart = localStorage.getItem(`cart_${userEmail}`);

      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      else setWishlist([]);

      if (savedCart) setCart(JSON.parse(savedCart));
      else setCart([]);
    } else {
      setWishlist([]);
      setCart([]);
    }
  }, [userEmail]);

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const wishlistItems = useMemo(() => houses.filter((h) => wishlist.includes(h.id)), [houses, wishlist]);
  const cartItems = useMemo(() => houses.filter((h) => cart.includes(h.id)), [houses, cart]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const stripData = useMemo(() => {
    const mainImages = houses.map((h) => h.imageUrl).filter((img) => !!img);
    const fallback = 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800';
    let pool = mainImages.length > 0 ? [...mainImages] : [fallback];
    let shuffled = [...pool].sort(() => 0.5 - Math.random());

    while (shuffled.length < 12) shuffled = [...shuffled, ...pool];

    return {
      set1: shuffled.slice(0, 4),
      set2: shuffled.slice(4, 8),
      set3: shuffled.slice(8, 12),
    };
  }, [houses]);

  const logo = '/mythiclogo.png';

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden font-sans">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <header className="relative bg-[#0e2a47] text-white z-50">
        <div className="max-w-[1400px] mx-auto px-6 py-6 relative z-30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-4">
            <div className="flex flex-col items-center cursor-pointer group" onClick={() => setView({ type: 'public-list' })}>
              <div className="h-14 w-auto overflow-hidden">
                <img
                  src={logo}
                  className="h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity brightness-0 invert"
                  alt="Mythic Engineering Logo"
                />
              </div>
            </div>

            <div className="flex-1 max-w-2xl w-full flex">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </span>
                <input
                  type="text"
                  placeholder="Search for your dream home"
                  className="w-full h-12 pl-11 pr-4 rounded-l bg-[#0a1e33] text-white placeholder:text-white/40 border border-white/10 focus:border-white/30 focus:outline-none transition-all"
                  value={filters.query}
                  onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
                />
              </div>
              <button className="bg-[#f15a24] hover:bg-[#d1491a] px-8 h-12 rounded-r font-bold text-sm transition-colors uppercase tracking-widest text-white">
                SEARCH
              </button>
            </div>

            <div className="flex items-center gap-6">
             

              <button
                onClick={() => {
                  if (isAdmin || userEmail) {
                    setIsAdmin(false);
                    setUserEmail(null);
                    localStorage.removeItem('isAdmin');
                    localStorage.removeItem('userEmail');
                    setView({ type: 'public-list' });
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                className="text-[10px] border border-white/20 px-3 py-1 rounded uppercase font-bold tracking-widest hover:bg-white/10 text-white"
              >
                {isAdmin ? 'ADMIN ACTIVE' : userEmail ? `LOGOUT (${userEmail.split('@')[0]})` : 'SIGN IN'}
              </button>

              <div className="flex gap-4 text-xl text-white">
                <div className="relative group" onClick={() => setView({ type: 'wishlist' })}>
                  <i
                    className={`fa-${wishlist.length > 0 ? 'solid' : 'regular'} fa-heart cursor-pointer hover:text-[#f15a24] transition-colors ${
                      view.type === 'wishlist' ? 'text-[#f15a24]' : ''
                    }`}
                  ></i>
                  {wishlist.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </div>

                <div className="relative group" onClick={() => setView({ type: 'cart' })}>
                  <i
                    className={`fa-solid fa-cart-shopping cursor-pointer hover:text-[#f15a24] transition-colors ${
                      view.type === 'cart' ? 'text-[#f15a24]' : ''
                    }`}
                  ></i>
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#f15a24] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 py-4 border-t border-white/10">
            {['All Plans', 'New Arrivals', 'Styles', 'Collections', 'Cost to Build', 'Multi-Family', 'Garages'].map(
              (link) => (
                <a key={link} href="#" className="text-[11px] font-bold uppercase tracking-wider text-white hover:text-slate-300 transition-colors">
                  {link}
                </a>
              )
            )}
          </div>
        </div>
      </header>

      {view.type === 'public-list' && (
        <>
          <section className="relative bg-[#0e2a47] text-white overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-5 h-auto md:h-[500px] lg:h-[700px]">
              <InteractiveHeroImage images={stripData.set1} className="col-span-2 row-span-1 md:row-span-2 h-[300px] md:h-auto" alt="Featured Home" />

              <div className="bg-[#0e2a47] flex flex-col justify-center p-6 md:p-8 border-l border-b md:border-b-0 border-white/5 h-[150px] md:h-auto">
                <h3 className="text-xl md:text-3xl font-bold mb-1 text-white">Modify</h3>
                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                  Your Plan <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </p>
              </div>

              <InteractiveHeroImage images={stripData.set2} className="h-[150px] md:h-auto" alt="Architectural Detail" />

              <div className="bg-[#0e2a47] flex flex-col justify-center p-6 md:p-8 border-l border-b md:border-b-0 border-white/5 h-[150px] md:h-auto">
                <h3 className="text-xl md:text-3xl font-bold mb-1 text-white">25,000+</h3>
                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                  Curated Plans <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </p>
              </div>

              <InteractiveHeroImage images={stripData.set3} className="h-[150px] md:h-auto" alt="Modern Design" />

              <div className="bg-[#0e2a47] flex flex-col justify-center p-6 md:p-8 border-l border-white/5 h-[150px] md:h-auto">
                <h3 className="text-xl md:text-3xl font-bold mb-1 text-white">Trending</h3>
                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                  House Plans <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </p>
              </div>

              <InteractiveHeroImage images={[...stripData.set1].reverse()} className="h-[150px] md:h-auto" alt="Interior View" />
              <InteractiveHeroImage images={[...stripData.set2].reverse()} className="h-[150px] md:h-auto" alt="Exterior View" />
              <InteractiveHeroImage images={[...stripData.set3].reverse()} className="h-[150px] md:h-auto" alt="Luxury Home" />
            </div>
          </section>

          <div className="relative z-40 flex justify-center -mt-8 bg-transparent">
            <div className="bg-white px-16 py-5 rounded-t-[2.5rem] shadow-[0_-15px_45px_rgba(255,255,255,0.9)] border-t border-x border-slate-100 flex items-center justify-center animate-glow transition-all">
              <span className="text-slate-900 font-black uppercase tracking-[0.5em] text-[14px] whitespace-nowrap">
                Explore Featured Homes
              </span>
            </div>
          </div>
        </>
      )}

      <main className="flex-1 flex flex-col">
        {view.type === 'public-list' || view.type === 'admin-list' ? (
          <div className="flex-1">
            <Filters filters={filters} setFilters={setFilters} onClear={clearFilters} />
            <div className="max-w-7xl mx-auto px-4 py-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 pb-4 border-b border-slate-100 gap-6">
                <div className="flex items-center gap-6">
                  <h2 className="text-3xl font-bold text-slate-900">
                    {isAdmin ? 'Listing Management' : 'Exclusive Home Designs'}
                  </h2>

                  {isAdmin && (
                    <button
                      onClick={returnToPublic}
                      className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold transition-all border border-slate-200"
                    >
                      <i className="fa-solid fa-house"></i>
                      Return to Public Site
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Sort By</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    className="bg-white border-b border-slate-300 px-2 py-1 text-sm font-bold focus:outline-none focus:border-[#f15a24]"
                  >
                    <option value="newest">Latest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="sqft-high">Area: Large to Small</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {isAdmin && (
                  <button
                    onClick={handleCreateNew}
                    className="relative group bg-slate-50 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-dashed border-slate-200 hover:border-[#0e2a47] flex flex-col items-center justify-center min-h-[400px]"
                  >
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 group-hover:bg-[#0e2a47] transition-all duration-500 shadow group-hover:text-white">
                      <i className="fa-solid fa-plus text-2xl"></i>
                    </div>
                    <div className="text-center px-6">
                      <h3 className="text-xl font-bold text-slate-400 group-hover:text-[#0e2a47] transition-colors mb-2">
                        New Architectural Plan
                      </h3>
                      <p className="text-sm text-slate-400 font-medium">Start a new drafting project</p>
                    </div>
                  </button>
                )}

                {filteredHouses.map((h) => (
                  <div key={h.id} className="relative group">
                    <HouseCard
                      plan={{ ...h, sqft: h.areaValue, garages: h.garageCars }}
                      onClick={() => navigateToDetail(h)}
                      isWishlisted={wishlist.includes(h.id)}
                      onToggleWishlist={(e) => {
                        e.stopPropagation();
                        toggleWishlist(h.id);
                      }}
                    />
                    {isAdmin && !h.published && (
                      <span className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Draft
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {filteredHouses.length === 0 && (
                <div className="text-center py-20">
                  <div className="text-5xl text-slate-200 mb-4">
                    <i className="fa-solid fa-house-circle-xmark"></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">No matches found</h3>
                  <p className="text-slate-500 mt-2">The current search parameters did not return any results.</p>
                </div>
              )}
            </div>
          </div>
        ) : view.type === 'public-detail' ? (
          (() => {
            const house = houses.find((h) => h.slug === view.slug);
            if (!house) return null;

            return (
              <HouseDetail
                house={house}
                onClose={() => setView({ type: 'public-list' })}
                isWishlisted={wishlist.includes(house.id)}
                onToggleWishlist={() => toggleWishlist(house.id)}
                isInCart={cart.includes(house.id)}
                onAddToCart={() => addToCart(house.id)}
              />
            );
          })()
        ) : view.type === 'wishlist' ? (
          <WishlistPage
            items={wishlistItems}
            onRemove={toggleWishlist}
            onViewDetail={navigateToDetail}
            onContinue={() => setView({ type: 'public-list' })}
          />
        ) : view.type === 'cart' ? (
          <CartPage
            items={cartItems}
            onRemove={removeFromCart}
            onCheckout={() => alert('Checkout functionality coming soon!')}
            onContinue={() => setView({ type: 'public-list' })}
          />
        ) : (
          (() => {
            const house = houses.find((h) => h.id === (view as any).id);
            if (!house) return null;

            return (
              <HouseDetail
                house={house}
                onClose={() => setView({ type: isAdmin ? 'admin-list' : 'public-list' })}
                isEditing={true}
                onUpdate={handleUpdate}
                onReturnHome={returnToPublic}
              />
            );
          })()
        )}
      </main>

      <footer className="bg-[#0e2a47] text-white pt-24 pb-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-white/10">
            <div className="md:col-span-2">
              <div className="flex flex-col items-start gap-2 mb-6">
                <div className="h-16 w-auto">
                  <img src={logo} className="h-full object-contain" alt="Footer Logo" />
                </div>
              </div>
              <p className="text-slate-400 max-w-sm leading-relaxed">
                Curating the world's most sophisticated architectural plans. Designed for living, built for legacy.
              </p>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-slate-300">EXPLORE</h4>
              <ul className="space-y-3 text-sm text-slate-400 font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Popular Collections</a></li>
                <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Find a Builder</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-slate-300">FOLLOW US</h4>
              <div className="flex gap-4 text-xl text-slate-400">
                <i className="fa-brands fa-instagram cursor-pointer hover:text-white"></i>
                <i className="fa-brands fa-pinterest cursor-pointer hover:text-white"></i>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-8">
            © 2024 Mythic Homes. Premium Architectural Solutions.
          </p>
        </div>
      </footer>

      {import.meta.env.DEV && <GeminiAssistant />}

      <style>{`
        @keyframes slideUpStop {
          0% { transform: translateY(0); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translateY(-33.33%); opacity: 1; }
        }
        @keyframes revealScale {
          0% { transform: scale(1.15); filter: blur(5px); }
          100% { transform: scale(1); filter: blur(0); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 -10px 30px rgba(255,255,255,0.7); transform: scale(1); }
          50% { box-shadow: 0 -20px 60px rgba(255,255,255,1); transform: scale(1.02); }
        }
        .animate-slide-up-stop { animation: slideUpStop cubic-bezier(0.22, 1, 0.36, 1) both; }
        .animate-reveal-scale { animation: revealScale 2.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .animate-glow { animation: glowPulse 2.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default App;