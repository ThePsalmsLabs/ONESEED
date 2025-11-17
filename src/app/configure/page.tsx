'use client';

import { Layout } from '@/components/Layout';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSavingsStrategy } from '@/hooks/swap/useSavingsStrategy';
import { SavingsTokenType } from '@/contracts/types';
import { ConfigPreview } from '@/components/Configure/ConfigPreview';
import { PercentageSlider } from '@/components/Configure/PercentageSlider';

export default function ConfigurePage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { strategy, setStrategy, isSettingStrategy } = useSavingsStrategy();
  
  // Debug logging
  console.log('🔍 ConfigurePage Debug:', {
    isConnected,
    strategy,
    isSettingStrategy,
    setStrategy: typeof setStrategy
  });
  
  // Form state
  const [percentage, setPercentage] = useState(
    strategy?.percentage ? Number(strategy.percentage) : 5
  );
  const [tokenType, setTokenType] = useState<SavingsTokenType>(
    strategy?.tokenType || SavingsTokenType.INPUT
  );
  const [autoIncrement, setAutoIncrement] = useState(
    strategy?.autoIncrement ? Number(strategy.autoIncrement) / 100 : 0
  );
  const [maxPercentage, setMaxPercentage] = useState(
    strategy?.maxPercentage ? Number(strategy.maxPercentage) / 100 : 2000
  );
  const [roundUp, setRoundUp] = useState(strategy?.roundUpSavings || false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Redirect to home if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return null;
  }

  const handleSave = async () => {
    console.log('🔧 Attempting to save strategy:', {
      percentage,
      tokenType,
      autoIncrement,
      maxPercentage,
      roundUp,
      isSettingStrategy,
      strategy,
      percentageType: typeof percentage,
      percentageValue: percentage
    });
    
    try {
      const result = await setStrategy({
        percentage: percentage,
        tokenType: tokenType as 0 | 1,
        specificToken: '0x0000000000000000000000000000000000000000',
        autoIncrement: autoIncrement,
        maxPercentage: maxPercentage,
        roundUpSavings: roundUp,
      });
      
      console.log('✅ Strategy saved successfully:', result);
      console.log('🔍 Result details:', {
        success: result?.success,
        txHash: result?.txHash,
        error: result?.error,
        fullResult: result
      });
      
      // Only show success if the transaction actually succeeded
      if (result && result.success) {
        console.log('🎉 Transaction succeeded, showing success message');
        setShowSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        console.log('❌ Transaction failed, throwing error');
        throw new Error(`Transaction failed: ${result?.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Failed to save strategy:', error);
      alert(`Failed to save strategy: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

    return (
    <div className="min-h-screen bg-bg-primary relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-80 h-80 bg-accent-purple/10 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <Layout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              className="text-4xl md:text-5xl font-black text-text-primary mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Configure Your <span className="gradient-text">Savings Strategy</span>
            </motion.h1>
            <motion.p
              className="text-lg text-text-secondary max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Customize how you want to save automatically with every transaction
            </motion.p>
          </div>

          {/* Split Screen Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Left Side - Form */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Savings Percentage */}
              <div className="glass-solid-dark rounded-2xl p-6 border border-border">
                <PercentageSlider
                value={percentage}
                  onChange={setPercentage}
                  min={100}
                  max={5000}
                  step={10}
                  label="Savings Rate"
                  description="The percentage of each transaction to automatically save"
                />
            </div>

              {/* Token Type Selection */}
              <div className="glass-solid-dark rounded-2xl p-6 border border-border">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Save in which token?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                type: SavingsTokenType.INPUT,
                      label: 'Input Token',
                      description: 'Save in the token you swap from',
                icon: '📥',
              },
              {
                type: SavingsTokenType.OUTPUT,
                      label: 'Output Token',
                      description: 'Save in the token you swap to',
                icon: '📤',
              },
              {
                type: SavingsTokenType.SPECIFIC,
                      label: 'Specific Token',
                      description: 'Choose a specific token',
                icon: '🎯',
                    },
            ].map((option) => (
                    <motion.button
                key={option.type}
                      onClick={() => setTokenType(option.type)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                  tokenType === option.type
                          ? 'border-primary-400 bg-primary-400/10'
                          : 'border-border bg-bg-tertiary/30 hover:border-border-bright'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-2xl mb-2">{option.icon}</div>
                      <div className="text-sm font-semibold text-text-primary mb-1">
                        {option.label}
                  </div>
                      <div className="text-xs text-text-muted">
                        {option.description}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="glass-solid-dark rounded-2xl p-6 border border-border">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Advanced Settings
                </h3>
                
                <div className="space-y-6">
                  {/* Auto Increment */}
                  <div>
                    <PercentageSlider
                      value={autoIncrement}
                      onChange={setAutoIncrement}
                      min={0}
                      max={200}
                      step={5}
                      label="Auto-Increment"
                      description="Gradually increase your savings rate over time"
                    />
                  </div>

                  {/* Max Percentage */}
                  <div>
                    <PercentageSlider
                      value={maxPercentage}
                      onChange={setMaxPercentage}
                      min={percentage}
                      max={5000}
                      step={100}
                      label="Maximum Rate"
                      description="Cap your savings rate at this percentage"
                    />
                  </div>

                  {/* Round Up Toggle */}
                  <div className="flex items-center justify-between p-4 bg-bg-tertiary/30 rounded-xl">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-text-primary mb-1">
                        Round Up Savings
                  </div>
                      <div className="text-xs text-text-muted">
                        Round your savings to the nearest whole number
                </div>
                    </div>
                    <motion.button
                      onClick={() => setRoundUp(!roundUp)}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        roundUp ? 'bg-primary-400' : 'bg-bg-tertiary'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                        animate={{
                          left: roundUp ? '32px' : '4px',
                        }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Test Button */}
              <div className="mb-4">
                <button
                  onClick={() => alert('Test button works!')}
                  className="w-full px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                >
                  TEST BUTTON - Click Me!
                </button>
              </div>
              
              {/* Reset Button (if stuck) */}
              {isSettingStrategy && (
                <div className="mb-4">
                  <button
                    onClick={() => {
                      console.log('🔄 Manual reset clicked');
                      window.location.reload();
                    }}
                    className="w-full px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors"
                  >
                    🔄 RESET (If Stuck)
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <motion.button
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={() => {
                    console.log('🔴 Save Strategy button clicked!');
                    handleSave();
                  }}
                  disabled={isSettingStrategy}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSettingStrategy ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Saving...
                    </span>
                  ) : (
                    'Save Strategy'
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Right Side - Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <ConfigPreview
                percentage={percentage}
                tokenType={tokenType}
                autoIncrement={autoIncrement}
                maxPercentage={maxPercentage}
                roundUp={roundUp}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="glass-effect-dark rounded-2xl p-8 max-w-md w-full text-center border border-primary-400/30"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-20 h-20 bg-primary-400 rounded-full flex items-center justify-center mx-auto mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-bold text-text-primary mb-2">
                  Strategy Saved!
                </h3>
                <p className="text-text-muted mb-6">
                  Your savings configuration has been updated successfully
                </p>
                <motion.div
                  className="text-sm text-text-muted"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Redirecting to dashboard...
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Layout>
    </div>
  );
}
