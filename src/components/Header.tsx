'use client';

import { useAccount } from 'wagmi';
import { NetworkIndicator } from './NetworkIndicator';
import Link from 'next/link';

export function Header() {
  const { isConnected } = useAccount();

  return (
    <header className="sticky top-0 z-50 glass-elevated-dark backdrop-blur-lg border-b border-border shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group hover-lift">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:animate-pulse-glow">
              <span className="text-white font-bold text-xl">🌱</span>
            </div>
            <div>
              <span className="text-2xl font-black text-text-primary group-hover:gradient-text transition-all duration-300">
                OneSeed
              </span>
              <div className="text-xs text-text-muted -mt-1">Grow your wealth</div>
            </div>
          </Link>

          {/* Center Navigation - Desktop Only */}
          {isConnected && (
            <nav className="hidden md:flex items-center gap-2">
              {[
                { href: '/dashboard', icon: '📊', label: 'Dashboard' },
                { href: '/configure', icon: '⚙️', label: 'Configure' },
                { href: '/withdraw', icon: '💰', label: 'Withdraw' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:bg-bg-tertiary hover:text-primary-400 transition-all duration-200 hover-lift"
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isConnected && (
              <div className="hidden sm:block">
                <NetworkIndicator />
              </div>
            )}

            {/* Quick Stats Badge - Only show if connected */}
            {isConnected && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-primary-400/10 text-primary-400 rounded-full text-sm font-medium border border-primary-400/20">
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
                Savings Active
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}