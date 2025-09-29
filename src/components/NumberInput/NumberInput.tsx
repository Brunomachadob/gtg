import React from 'react';
import { Minus, Plus } from 'lucide-react';
import './NumberInput.css';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function NumberInput({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  placeholder,
  className = '',
  disabled = false
}: NumberInputProps) {
  const handleDecrement = () => {
    const newValue = value - step;
    if (newValue >= min) {
      onChange(newValue);
    }
  };

  const handleIncrement = () => {
    const newValue = value + step;
    if (max === undefined || newValue <= max) {
      onChange(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    if (newValue >= min && (max === undefined || newValue <= max)) {
      onChange(newValue);
    }
  };

  const canDecrement = !disabled && value > min;
  const canIncrement = !disabled && (max === undefined || value < max);

  return (
    <div className={`number-input ${className}`}>
      <button
        type="button"
        className="number-input-button decrement"
        onClick={handleDecrement}
        disabled={!canDecrement}
        aria-label="Decrease value"
      >
        <Minus size={18} />
      </button>

      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className="number-input-field"
        disabled={disabled}
      />

      <button
        type="button"
        className="number-input-button increment"
        onClick={handleIncrement}
        disabled={!canIncrement}
        aria-label="Increase value"
      >
        <Plus size={18} />
      </button>
    </div>
  );
}
