
import React, { useState, useEffect } from 'react';

interface EditableFieldProps {
  value: string | number;
  onSave: (val: any) => void;
  type?: 'text' | 'textarea' | 'number';
  label: string;
  isEditing: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({ value, onSave, type = 'text', label, isEditing }) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  if (!isEditing) {
    return <>{value}</>;
  }

  return (
    <div className="group relative border-b border-dashed border-slate-300 hover:border-slate-900 transition-colors py-1">
      <span className="absolute -top-4 left-0 text-[10px] uppercase font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
        {label}
      </span>
      {type === 'textarea' ? (
        <textarea
          value={internalValue}
          onChange={(e) => setInternalValue(e.target.value)}
          onBlur={() => onSave(internalValue)}
          className="w-full bg-transparent focus:outline-none resize-none"
          rows={4}
        />
      ) : (
        <input
          type={type}
          value={internalValue}
          onChange={(e) => setInternalValue(type === 'number' ? Number(e.target.value) : e.target.value)}
          onBlur={() => onSave(internalValue)}
          className="w-full bg-transparent focus:outline-none"
        />
      )}
    </div>
  );
};

export default EditableField;
