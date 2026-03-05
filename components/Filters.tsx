
import React from 'react';
import { SearchFilters } from '../types';

interface FiltersProps {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  onClear: () => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, setFilters, onClear }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value === '' ? 0 : Number(value)
    }));
  };

  const handleToggle = (key: keyof SearchFilters, val: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === val ? (typeof val === 'number' ? 0 : '') : val
    }));
  };

  const categories = [
    { id: 'Single Family', label: 'Single Family', icon: 'fa-solid fa-house-chimney' },
    { id: 'Multi-Family', label: 'Multi-Family', icon: 'fa-solid fa-house-chimney-window' },
    { id: 'Garages', label: 'Garages', icon: 'fa-solid fa-warehouse' },
    { id: 'Accessory Structures', label: 'Accessory Structures', icon: 'fa-solid fa-house-user' },
  ];

  const bedOptions = [1, 2, 3, 4, '5+'];
  const bathOptions = [1, 1.5, 2, 2.5, 3, 3.5, '4+'];
  const floorOptions = [1, 2, '3+'];

  return (
    <div className="w-full bg-[#e9ecef] pt-4 pb-12 border-b border-slate-300">
      <div className="max-w-7xl mx-auto px-4">
        {/* Category Row - Moved from Hero back into Filter Section */}
        <div className="flex flex-col items-center justify-center mb-8 mt-4 relative">
          <div className="xl:absolute xl:left-0 xl:top-1/2 xl:-translate-y-1/2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-4 xl:mb-0">
            Filter By
          </div>
          
          <div className="flex justify-center gap-10 md:gap-16">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleToggle('propertyType', cat.id)}
                className={`flex flex-col items-center group transition-all relative pb-2 ${
                  filters.propertyType === cat.id ? 'text-[#0e2a47]' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <div className={`text-2xl mb-1.5 transition-transform group-hover:scale-110 ${
                  filters.propertyType === cat.id ? 'text-[#0e2a47]' : 'text-slate-400'
                }`}>
                  <i className={cat.icon}></i>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-tight">
                  {cat.label}
                </span>
                {filters.propertyType === cat.id && (
                  <div className="absolute bottom-0 w-full h-0.5 bg-[#0e2a47]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Filter White Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-white p-6 flex flex-wrap lg:flex-nowrap items-center gap-6">
          
          {/* Bedrooms */}
          <div className="flex flex-col items-center flex-1 min-w-[150px]">
            <div className="flex gap-1 mb-2">
              {bedOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleToggle('beds', typeof opt === 'string' ? 5 : opt)}
                  className={`w-9 h-9 flex items-center justify-center rounded border transition-all text-xs font-medium ${
                    (filters.beds === opt || (opt === '5+' && (filters.beds || 0) >= 5))
                      ? 'bg-[#0e2a47] text-white border-[#0e2a47]'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <i className="fa-solid fa-bed text-[10px]"></i> Bedrooms
            </div>
          </div>

          <div className="h-10 w-px bg-slate-100 hidden lg:block" />

          {/* Bathrooms */}
          <div className="flex flex-col items-center flex-1 min-w-[150px]">
            <div className="flex gap-1 mb-2">
              {bathOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleToggle('baths', typeof opt === 'string' ? 4 : opt)}
                  className={`px-1.5 h-9 flex items-center justify-center rounded border transition-all text-[10px] font-medium min-w-[30px] ${
                    (filters.baths === opt || (opt === '4+' && (filters.baths || 0) >= 4))
                      ? 'bg-[#0e2a47] text-white border-[#0e2a47]'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <i className="fa-solid fa-bath text-[10px]"></i> Bathrooms
            </div>
          </div>

          <div className="h-10 w-px bg-slate-100 hidden lg:block" />

          {/* Heated Sq. Ft. */}
          <div className="flex flex-col items-center flex-1 min-w-[180px]">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="number"
                name="minSqft"
                placeholder="Min"
                value={filters.minSqft === 0 ? '' : filters.minSqft}
                onChange={handleInputChange}
                className="w-24 h-9 bg-white border border-slate-200 rounded px-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0e2a47] focus:border-[#0e2a47]"
              />
              <span className="text-slate-300">—</span>
              <input
                type="number"
                name="maxSqft"
                placeholder="Max"
                value={filters.maxSqft === 10000 ? '' : filters.maxSqft}
                onChange={handleInputChange}
                className="w-24 h-9 bg-white border border-slate-200 rounded px-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0e2a47] focus:border-[#0e2a47]"
              />
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <i className="fa-solid fa-ruler-combined text-[10px]"></i> Heated Sq. Ft.
            </div>
          </div>

          <div className="h-10 w-px bg-slate-100 hidden lg:block" />

          {/* Clear Filter Button */}
          <div className="ml-auto lg:ml-4">
            <button 
              onClick={onClear}
              className="bg-[#f15a24] hover:bg-[#d1491a] text-white px-8 h-11 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center uppercase text-xs tracking-widest"
            >
              Clear Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
