import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import './NumberInput.css';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberInput({ value, onChange, min = 0, max = 999, step = 1 }: NumberInputProps) {
  const handleIncrement = () => {
    const newValue = value + step;
    if (newValue <= max) {
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    const newValue = value - step;
    if (newValue >= min) {
      onChange(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className="number-input-container">
      <div className="number-input-wrapper">
        <button
          className="number-input-button"
          onClick={handleDecrement}
          disabled={value <= min}
          type="button"
        >
          <ChevronDown size={20} />
        </button>

        <input
          type="number"
          className="number-input-field"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
        />

        <button
          className="number-input-button"
          onClick={handleIncrement}
          disabled={value >= max}
          type="button"
        >
          <ChevronUp size={20} />
        </button>
      </div>
    </div>
  );
}
