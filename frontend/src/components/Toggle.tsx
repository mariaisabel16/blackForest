import { useState } from 'react';

interface ToggleProps {
  label?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function Toggle({ label, defaultChecked = false, onChange }: ToggleProps) {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="flex items-center justify-between">
      {label && (
        <span className="text-sm font-semibold text-gray-600">{label}</span>
      )}
      <button
        onClick={handleToggle}
        className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
          isChecked ? 'bg-gray-900' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
            isChecked ? 'translate-x-7' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
