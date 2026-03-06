
// import React, { useState } from 'react';

// interface AuthModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: (isAdmin: boolean, email: string) => void;
// }

// type AuthType = 'user' | 'admin';

// const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   if (!isOpen) return null;

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     // Simulate API call
//     setTimeout(() => {
//       // Admin check
//       if (formData.email === 'admin@mythichomes.com' && formData.password === 'admin123') {
//         onSuccess(true, formData.email);
//         onClose();
//       } 
//       // User check
//       else if (formData.email && formData.password.length >= 6) {
//         onSuccess(false, formData.email);
//         onClose();
//       } 
//       else {
//         setError('Please enter a valid email and password (min 6 chars).');
//       }
//       setIsLoading(false);
//     }, 1000);
//   };

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//       {/* Backdrop */}
//       <div 
//         className="absolute inset-0 bg-[#0e2a47]/80 backdrop-blur-sm animate-in fade-in duration-300"
//         onClick={onClose}
//       />
      
//       {/* Modal Card */}
//       <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
//         <button 
//           onClick={onClose}
//           className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors z-10"
//         >
//           <i className="fa-solid fa-xmark text-xl"></i>
//         </button>

//         <div className="p-10">
//           <div className="text-center mb-10">
//             <h2 className="text-3xl font-bold text-slate-900 mb-2 font-serif">Mythic Portal</h2>
//             <p className="text-slate-500 text-sm">Sign in to access your architectural dashboard</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
//               <input 
//                 required
//                 type="email"
//                 placeholder="your@email.com"
//                 className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#f15a24] transition-all"
//                 value={formData.email}
//                 onChange={e => setFormData({ ...formData, email: e.target.value })}
//               />
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
//               <input 
//                 required
//                 type="password"
//                 placeholder="••••••••"
//                 className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#f15a24] transition-all"
//                 value={formData.password}
//                 onChange={e => setFormData({ ...formData, password: e.target.value })}
//               />
//             </div>

//             {error && (
//               <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-1">
//                 {error}
//               </p>
//             )}

//             <button 
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-[#f15a24] hover:bg-[#d1491a] text-white h-14 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
//             >
//               {isLoading ? (
//                 <>
//                   <i className="fa-solid fa-spinner animate-spin"></i>
//                   Authenticating...
//                 </>
//               ) : (
//                 'Sign In'
//               )}
//             </button>
//           </form>

//           <p className="mt-8 text-center text-xs text-slate-400">
//             By signing in, you agree to our <span className="text-slate-900 underline cursor-pointer">Terms</span> and <span className="text-slate-900 underline cursor-pointer">Privacy Policy</span>.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthModal;
import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (isAdmin: boolean, email: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const email = formData.email.trim().toLowerCase();
      const password = formData.password;

      // Admin login
      if (email === 'admin@mythichomes.com' && password === 'admin123') {
        onSuccess(true, email);
        onClose();
      }
      // Normal user login
      else if (email && password.length >= 6) {
        onSuccess(false, email);
        onClose();
      }
      // Invalid login
      else {
        setError('Please enter a valid email and password (minimum 6 characters).');
      }

      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#0e2a47]/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors z-10"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <div className="p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 font-serif">Mythic Portal</h2>
            <p className="text-slate-500 text-sm">Sign in to access your architectural dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Email Address
              </label>
              <input
                required
                type="email"
                placeholder="your@email.com"
                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#f15a24] transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Password
              </label>
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#f15a24] transition-all"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {error && (
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#f15a24] hover:bg-[#d1491a] text-white h-14 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            <p>Admin login for testing:</p>
            <p className="mt-1 text-slate-600">admin@mythichomes.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;