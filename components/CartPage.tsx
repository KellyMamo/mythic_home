
import React from 'react';
import { House } from '../types';
import { motion } from 'motion/react';

interface CartPageProps {
  items: House[];
  onRemove: (id: string) => void;
  onCheckout: () => void;
  onContinue: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ items, onRemove, onCheckout, onContinue }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.08; // Example tax
  const total = subtotal + tax;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-50 min-h-screen"
    >
      <div className="bg-white border-b border-slate-100 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-slate-900 tracking-tight">Shopping Cart</h1>
          <p className="text-slate-500 mt-4 font-medium">Review your architectural selections before checkout.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {items.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] shadow-sm border border-slate-100">
            <div className="text-7xl text-slate-100 mb-8"><i className="fa-solid fa-cart-shopping"></i></div>
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Your cart is empty</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-10">
              You haven't added any plan licenses to your cart yet.
            </p>
            <button 
              onClick={onContinue}
              className="bg-[#0e2a47] text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-[#f15a24] transition-all shadow-xl"
            >
              Explore Plans
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1 space-y-6">
              {items.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-center"
                >
                  <div className="w-full md:w-48 aspect-[4/3] rounded-2xl overflow-hidden shrink-0">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">{item.name}</h3>
                        <p className="text-xs font-bold text-[#f15a24] uppercase tracking-widest mt-1">{item.style}</p>
                      </div>
                      <p className="text-2xl font-black text-slate-900">${item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                      <span className="flex items-center gap-2"><i className="fa-solid fa-file-pdf"></i> PDF Delivery</span>
                      <span className="flex items-center gap-2"><i className="fa-solid fa-certificate"></i> Full License</span>
                      <span className="flex items-center gap-2"><i className="fa-solid fa-print"></i> Print Ready</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-4">
                      <button 
                        onClick={() => onRemove(item.id)}
                        className="text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-widest flex items-center gap-2 transition-colors"
                      >
                        <i className="fa-solid fa-trash-can"></i> Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="w-full lg:w-[400px] shrink-0">
              <div className="bg-[#0e2a47] text-white p-10 rounded-[3rem] shadow-2xl sticky top-32">
                <h3 className="text-2xl font-bold mb-8">Order Summary</h3>
                
                <div className="space-y-6 mb-10 pb-10 border-b border-white/10">
                  <div className="flex justify-between text-sm font-medium text-slate-400">
                    <span>Subtotal</span>
                    <span className="text-white">${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-slate-400">
                    <span>Estimated Tax (8%)</span>
                    <span className="text-white">${tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-slate-400">
                    <span>Processing Fee</span>
                    <span className="text-white">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-10">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-4xl font-black text-[#f15a24]">${total.toLocaleString()}</span>
                </div>

                <button 
                  onClick={onCheckout}
                  className="w-full bg-[#f15a24] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-[#0e2a47] transition-all shadow-xl shadow-[#f15a24]/20 mb-6"
                >
                  Complete Purchase
                </button>

                <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <i className="fa-solid fa-lock"></i> Secure Checkout
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CartPage;
