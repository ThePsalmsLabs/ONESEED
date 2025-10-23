'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface PercentageSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
  description?: string;
}

export function PercentageSlider({
  value,
  onChange,
  min = 0,
  max = 5000,
  step = 10,
  label,
  description,
}: PercentageSliderProps) {
  const [isFocused, setIsFocused] = useState(false);
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-4">
      {/* Label */}
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-1">
          {label}
        </label>
        {description && (
          <p className="text-xs text-text-muted">{description}</p>
        )}
      </div>

      {/* Value Display */}
      <motion.div
        className="glass-solid-dark rounded-xl p-4 border border-border text-center"
        animate={{
          borderColor: isFocused ? 'rgb(var(--primary-400))' : 'rgb(var(--border))',
          boxShadow: isFocused
            ? '0 0 20px rgb(var(--primary-400) / 0.2)'
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.span
          key={value}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="text-3xl font-bold text-primary-400"
        >
          {(value / 100).toFixed(2)}%
        </motion.span>
      </motion.div>

      {/* Slider */}
      <div className="relative">
        {/* Track */}
        <div className="h-3 bg-bg-tertiary rounded-full overflow-hidden">
          {/* Progress */}
          <motion.div
            className="h-full bg-gradient-to-r from-primary-400 to-accent-cyan rounded-full"
            style={{ width: `${percentage}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Slider Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {/* Thumb Indicator */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-primary-400 pointer-events-none"
          style={{ left: `calc(${percentage}% - 12px)` }}
          animate={{
            scale: isFocused ? 1.2 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Min/Max Labels */}
      <div className="flex justify-between text-xs text-text-muted">
        <span>{(min / 100).toFixed(2)}%</span>
        <span>{(max / 100).toFixed(2)}%</span>
      </div>

      {/* Quick Presets */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: '1%', value: 100 },
          { label: '5%', value: 500 },
          { label: '10%', value: 1000 },
          { label: '20%', value: 2000 },
        ].map((preset) => (
          <motion.button
            key={preset.value}
            onClick={() => onChange(preset.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              value === preset.value
                ? 'bg-primary-400 text-white'
                : 'bg-bg-tertiary text-text-muted hover:bg-bg-tertiary/70 hover:text-text-primary'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {preset.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
