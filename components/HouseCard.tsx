import React from "react";
import { HousePlan } from "../types";

interface HouseCardProps {
  plan: HousePlan;
  onClick: (plan: HousePlan) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (e: React.MouseEvent) => void;
}

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800";

const HouseCard: React.FC<HouseCardProps> = ({ plan, onClick, isWishlisted, onToggleWishlist }) => {
  // ✅ Compatibility layer (works with both old HousePlan and your Supabase House shape)
  const imageUrl = (plan as any).imageUrl || (plan as any).image || (plan as any).coverUrl || FALLBACK_IMG;
console.log("CARD imageUrl:", plan.imageUrl, plan);
  const sqft =
    (plan as any).sqft ??
    (plan as any).areaValue ??
    (plan as any).area ??
    "";

  const garages =
    (plan as any).garages ??
    (plan as any).garageCars ??
    "";

  const planNumber =
    (plan as any).planNumber ??
    (plan as any).id ??
    "";

  return (
    <div
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 cursor-pointer"
      onClick={() => onClick(plan)}
    >
      <div className="relative overflow-hidden h-64">
        
        <img
          src={imageUrl}
          alt={(plan as any).name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMG;
          }}
        />

        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            {planNumber}
          </span>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onToggleWishlist}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isWishlisted ? "bg-red-500 text-white" : "bg-white/90 text-slate-400 hover:text-red-500"
            }`}
          >
            <i className={`fa-${isWishlisted ? "solid" : "regular"} fa-heart`}></i>
          </button>
        </div>

        <div className="absolute bottom-4 right-4">
          <button className="bg-slate-900 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-slate-800 leading-tight">{(plan as any).name}</h3>
            <p className="text-sm text-slate-500 font-medium">{(plan as any).style}</p>
          </div>
          <p className="text-lg font-bold text-slate-900">
            ${Number((plan as any).price ?? 0).toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 mt-4 py-3 border-t border-slate-50">
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Sq Ft</p>
            <p className="text-sm font-semibold text-slate-700">{sqft}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Bedrooms</p>
            <p className="text-sm font-semibold text-slate-700">{(plan as any).beds}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Baths</p>
            <p className="text-sm font-semibold text-slate-700">{(plan as any).baths}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Garage</p>
            <p className="text-sm font-semibold text-slate-700">{garages}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseCard;