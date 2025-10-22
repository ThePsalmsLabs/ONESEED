'use client';

import { useEffect, useState } from 'react';

export function ProductDemo() {
  const [savingsAmount, setSavingsAmount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setSavingsAmount(prev => prev + Math.random() * 50 + 10);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Animated background circles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-accent-cyan/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main demo visualization */}
      <div className="relative z-10 w-full max-w-md">
        {/* Transaction Flow */}
        <div className="space-y-8">
          {/* Swap Card */}
          <div className={`glass-medium rounded-2xl p-6 transition-all duration-500 ${isAnimating ? 'scale-105 glass-neon' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                  $
                </div>
                <div>
                  <div className="text-sm text-gray-400">Swap Amount</div>
                  <div className="text-xl font-bold text-white">1,000 USDC</div>
                </div>
              </div>
              <div className="text-3xl">🔄</div>
            </div>
            
            {/* Animated split indicator */}
            <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`absolute left-0 top-0 h-full bg-gradient-to-r from-primary-500 to-accent-cyan rounded-full transition-all duration-1000 ${isAnimating ? 'w-[10%]' : 'w-0'}`}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>Swap: 95%</span>
              <span className="text-primary-400 font-semibold">Save: 5%</span>
            </div>
          </div>

          {/* Arrow indicator */}
          <div className="flex justify-center">
            <div className={`transition-transform duration-500 ${isAnimating ? 'translate-y-2' : ''}`}>
              <svg className="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>

          {/* Savings Card */}
          <div className="glass-neon rounded-2xl p-6 relative overflow-hidden">
            {/* Shimmer effect on animation */}
            {isAnimating && (
              <div className="absolute inset-0 animate-shimmer" />
            )}
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-2xl animate-pulse-glow">
                    🌱
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Your Savings</div>
                    <div className="text-2xl font-bold text-white">
                      ${savingsAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-primary-400 text-sm font-semibold">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  +18% growth
                </div>
              </div>

              {/* Mini chart */}
              <div className="flex items-end gap-1 h-16">
                {[40, 55, 45, 70, 65, 80, 75, 90, 85, 100].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-primary-500/50 to-primary-400/80 rounded-t transition-all duration-300"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary-400/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

