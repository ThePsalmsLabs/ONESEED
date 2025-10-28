'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SavingsGoalSetterProps {
  goal: number;
  onUpdate: (newGoal: number) => void;
  isLoading?: boolean;
}

export function SavingsGoalSetter({ goal, onUpdate, isLoading = false }: SavingsGoalSetterProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(goal.toString());
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    const numValue = parseFloat(inputValue);
    
    // Validate
    if (isNaN(numValue)) {
      setError('Please enter a valid number');
      return;
    }
    
    if (numValue < 100) {
      setError('Minimum goal is $100');
      return;
    }
    
    if (numValue > 1000000) {
      setError('Maximum goal is $1,000,000');
      return;
    }

    setError(null);
    onUpdate(numValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInputValue(goal.toString());
    setError(null);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="space-y-3"
      >
        <div>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError(null);
            }}
            placeholder="Enter goal"
            className="w-full px-4 py-2 rounded-lg bg-bg-tertiary border border-border focus:border-primary-400 focus:outline-none text-text-primary"
            min={100}
            max={1000000}
            step={100}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
          />
          {error && (
            <p className="mt-2 text-sm text-error">{error}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 rounded-lg bg-primary-400 text-white font-medium hover:bg-primary-500 transition-colors"
            disabled={isLoading}
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg bg-bg-tertiary text-text-secondary font-medium hover:bg-bg-secondary transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="text-sm text-text-muted">Savings Goal</span>
        <p className="text-lg font-semibold text-text-primary">${goal.toLocaleString()}</p>
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="px-3 py-1.5 rounded-lg bg-bg-tertiary text-text-secondary text-sm font-medium hover:bg-bg-secondary transition-colors"
        disabled={isLoading}
      >
        Edit
      </button>
    </div>
  );
}

