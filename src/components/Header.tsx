'use client';

import { useAccount } from 'wagmi';
import { WalletConnect } from './WalletConnect';
import { NetworkIndicator } from './NetworkIndicator';
import Link from 'next/link';

export function Header() {
  const { isConnected } = useAccount();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🌱</span>
            </div>
            <span className="text-xl font-bold text-gray-900">OneSeed</span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isConnected && (
              <div className="hidden sm:block">
                <NetworkIndicator />
              </div>
            )}
            <WalletConnect />
          </div>
        </div>
      </div>
    </header>
  );
}

