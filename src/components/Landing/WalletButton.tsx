'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppKit } from '@reown/appkit/react';
import { useAccount } from 'wagmi';
import { useBiconomy } from '@/components/BiconomyProvider';
import { WalletCard } from './WalletCard';

export function WalletButton() {
  const { open } = useAppKit();
  const { isConnected } = useAccount();
  const { smartAccountAddress, isLoading } = useBiconomy();
  const [showCard, setShowCard] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Close card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cardRef.current &&
        !cardRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowCard(false);
      }
    };

    if (showCard) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCard]);

  // Not connected - show connect button
  if (!isConnected) {
    return (
      <button
        onClick={() => open()}
        className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-accent-cyan text-white font-semibold rounded-xl hover:from-primary-600 hover:to-accent-cyan/90 shadow-lg hover-lift transition-all duration-200 animate-neon-pulse"
      >
        <span className="flex items-center gap-2">
          <span className="text-lg">🔗</span>
          <span className="hidden sm:inline">Connect Wallet</span>
          <span className="sm:hidden">Connect</span>
        </span>
      </button>
    );
  }

  // Connected - show smart account button
  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setShowCard(!showCard)}
        className="group flex items-center gap-3 px-4 py-2.5 glass-medium hover:glass-strong rounded-xl border border-white/20 hover:border-primary-400/50 transition-all duration-200 hover-lift"
      >
        {/* Smart Account Indicator */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-cyan rounded-lg flex items-center justify-center">
              <span className="text-lg">⚡</span>
            </div>
            {isLoading && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
            )}
          </div>

          {/* Address Display - Desktop Only */}
          <div className="hidden md:block text-left">
            <div className="text-xs text-gray-400 leading-tight">Smart Account</div>
            {smartAccountAddress ? (
              <code className="text-sm text-white font-mono">
                {`${smartAccountAddress.slice(0, 6)}...${smartAccountAddress.slice(-4)}`}
              </code>
            ) : (
              <span className="text-sm text-gray-400">Setting up...</span>
            )}
          </div>
        </div>

        {/* Dropdown Arrow */}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            showCard ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Wallet Card Dropdown */}
      {showCard && (
        <div
          ref={cardRef}
          className="absolute top-full right-0 mt-2 z-50 animate-fade-in-up"
        >
          <WalletCard onClose={() => setShowCard(false)} />
        </div>
      )}
    </div>
  );
}

