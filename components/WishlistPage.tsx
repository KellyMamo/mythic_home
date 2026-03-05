
import React from 'react';
import { House } from '../types';
import { motion } from 'motion/react';

interface WishlistPageProps {
  items: House[];
  onRemove: (id: string) => void;
  onViewDetail: (house: House) => void;
  onContinue: () => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({ items, onRemove, onViewDetail, onContinue }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white min-h-screen"
    >
      <div className="bg-[#0e2a47] text-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl md:text-8xl font-serif font-bold tracking-tight mb-6"
          >
            Wishlist
          </motion.h1>
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-[#f15a24]"></span>
            <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">
              {items.length} Curated Selections
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        {items.length === 0 ? (
          <div className="text-center py-32 bg-slate-50 rounded-[3rem] border border-slate-100">
            <div className="text-7xl text-slate-200 mb-8"><i className="fa-regular fa-heart"></i></div>
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Your collection is empty</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-10">
              Explore our architectural portfolio and save the designs that resonate with your vision.
            </p>
            <button 
              onClick={onContinue}
              className="bg-[#0e2a47] text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-[#f15a24] transition-all shadow-xl"
            >
              Browse Collections
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {items.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div 
                  className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg group-hover:shadow-2xl transition-all duration-500"
                  onClick={() => onViewDetail(item)}
                >
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-2">{item.style}</p>
                    <h3 className="text-2xl font-bold mb-4">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-black">${item.price.toLocaleString()}</p>
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                        View Details
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-between px-4">
                  <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>{item.areaValue} SQ FT</span>
                    <span>{item.beds} BEDS</span>
                  </div>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors p-2"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WishlistPage;
