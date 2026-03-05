
import React, { useState } from 'react';

interface FilePickerProps {
  onSelect: (url: string) => void;
  label: string;
}

// Drastically reduced for localStorage compatibility
// 1024px is plenty for web preview while keeping file size small (~40-60KB per image)
const MAX_WIDTH = 1024; 
const QUALITY = 0.4; 

const FilePicker: React.FC<FilePickerProps> = ({ onSelect, label }) => {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const compressAndResize = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onerror = () => reject(new Error("File reading failed"));
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onerror = () => reject(new Error("Image loading failed"));
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Aggressive resizing to stay within localStorage limits
          if (width > MAX_WIDTH || height > MAX_WIDTH) {
            if (width > height) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            } else {
              width = Math.round((width * MAX_WIDTH) / height);
              height = MAX_WIDTH;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error("Canvas context failed"));
            return;
          }
          
          // Use low quality setting to minimize base64 string length
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', QUALITY);
          resolve(dataUrl);
        };
      };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    // Fix: Explicitly cast to File[] to resolve TypeScript error where 'file' is inferred as 'unknown'.
    const fileArray = Array.from(files) as File[];
    
    for (const file of fileArray) {
      try {
        const processedUrl = await compressAndResize(file);
        onSelect(processedUrl);
      } catch (err) {
        console.error("Image processing failed", err);
        alert("Failed to process one of your images. It might be too large or an unsupported format.");
      }
    }
    
    setIsProcessing(false);
    // Reset input so the same file can be selected again if needed
    e.target.value = '';
  };

  return (
    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-slate-400 transition-colors">
      <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">{label}</p>
      
      {!showUrlInput ? (
        <div className="flex flex-col gap-2">
          <label className={`bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 ${isProcessing ? 'opacity-50 cursor-wait' : ''}`}>
            {isProcessing ? (
              <i className="fa-solid fa-circle-notch animate-spin"></i>
            ) : (
              <i className="fa-solid fa-cloud-arrow-up"></i>
            )}
            {isProcessing ? 'Processing...' : 'Upload Files'}
            <input 
              type="file" 
              className="hidden" 
              onChange={handleFileUpload} 
              multiple 
              accept="image/*"
              disabled={isProcessing}
            />
          </label>
          {!isProcessing && (
            <button 
              onClick={() => setShowUrlInput(true)}
              className="text-slate-600 text-[10px] font-bold underline hover:text-[#f15a24]"
            >
              Or paste cloud URL
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Paste URL here..."
              className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (url) { onSelect(url); setShowUrlInput(false); setUrl(''); }
                }
              }}
            />
            <button 
              onClick={() => { if (url) { onSelect(url); setShowUrlInput(false); setUrl(''); } }}
              className="bg-slate-900 text-white px-3 rounded-lg hover:bg-slate-800"
            >
              <i className="fa-solid fa-check text-xs"></i>
            </button>
          </div>
          <button onClick={() => setShowUrlInput(false)} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600">
             Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default FilePicker;
