'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { useSavingsStrategy } from '@/hooks/swap/useSavingsStrategy';
import { toast } from 'sonner';

interface SavingsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip?: () => void;
}

const PRESET_PERCENTAGES = [1, 2, 5, 10, 15, 20];

export function SavingsConfigModal({ isOpen, onClose, onSkip }: SavingsConfigModalProps) {
  const { setStrategy, isSettingStrategy } = useSavingsStrategy();
  const [selectedPercentage, setSelectedPercentage] = useState(5);
  const [tokenType, setTokenType] = useState<0 | 1>(0); // 0 = INPUT, 1 = OUTPUT
  const [saveAsDefault, setSaveAsDefault] = useState(true);
  
  const handleConfigure = async () => {
    const result = await setStrategy({
      percentage: selectedPercentage,
      tokenType,
      roundUpSavings: false,
      autoIncrement: 0,
      maxPercentage: 100,
    });
    
    if (result.success) {
      onClose();
    }
  };
  
  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
    onClose();
  };
  
  // Calculate estimated savings
  const estimatedSavings = (tradeValue: number) => {
    return (tradeValue * selectedPercentage) / 100;
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-strong rounded-3xl p-8 max-w-2xl w-full border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">
                    <span className="gradient-text">Configure</span> Your Savings
                  </h2>
                  <p className="text-gray-300 text-sm">
                    Set how much you want to save automatically with every swap
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Percentage Selector */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-white font-semibold">Savings Percentage</label>
                  <div className="text-3xl font-bold text-primary-400">
                    {selectedPercentage}%
                  </div>
                </div>
                
                {/* Slider */}
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={selectedPercentage}
                  onChange={(e) => setSelectedPercentage(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
                
                {/* Preset Buttons */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {PRESET_PERCENTAGES.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setSelectedPercentage(preset)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedPercentage === preset
                          ? 'bg-gradient-to-r from-primary-500 to-accent-cyan text-white shadow-lg scale-105'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {preset}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Token Type Selection */}
              <div className="mb-8">
                <label className="text-white font-semibold mb-3 block">Save Which Token?</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTokenType(0)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      tokenType === 0
                        ? 'border-primary-400 bg-primary-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <div className="text-2xl mb-2">💰</div>
                    <div className="font-semibold">Input Token</div>
                    <div className="text-xs mt-1">Save what you spend</div>
                  </button>
                  
                  <button
                    onClick={() => setTokenType(1)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      tokenType === 1
                        ? 'border-primary-400 bg-primary-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <div className="text-2xl mb-2">🎁</div>
                    <div className="font-semibold">Output Token</div>
                    <div className="text-xs mt-1">Save what you receive</div>
                  </button>
                </div>
              </div>

              {/* Estimated Savings Preview */}
              <div className="glass-neon rounded-2xl p-6 mb-6 border border-primary-400/30">
                <div className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  Estimated Savings Impact
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary-400">
                      ${estimatedSavings(100).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">On $100 swap</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary-400">
                      ${estimatedSavings(1000).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">On $1,000 swap</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary-400">
                      ${estimatedSavings(10000).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">On $10,000 swap</div>
                  </div>
                </div>
              </div>

              {/* Save as Default Checkbox */}
              <label className="flex items-center gap-3 mb-6 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={saveAsDefault}
                  onChange={(e) => setSaveAsDefault(e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-white/20 bg-white/5 checked:bg-primary-500 checked:border-primary-500 transition-all"
                />
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  Save as my default strategy for all future swaps
                </span>
              </label>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleConfigure}
                  disabled={isSettingStrategy || selectedPercentage === 0}
                  variant="primary"
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-primary-500 to-accent-cyan hover:from-primary-600 hover:to-accent-cyan/90 shadow-lg"
                >
                  {isSettingStrategy ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Configuring...
                    </span>
                  ) : (
                    `✓ Save ${selectedPercentage}% Per Swap`
                  )}
                </Button>
                
                <Button
                  onClick={handleSkip}
                  variant="ghost"
                  size="lg"
                  className="px-6 glass-subtle hover:glass-medium text-white border-0"
                >
                  Skip for Now
                </Button>
              </div>

              {/* Info Note */}
              <div className="mt-6 text-xs text-gray-500 text-center">
                You can change your savings settings anytime in the dashboard
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

