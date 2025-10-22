'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useSavingsStrategy } from '@/hooks/useSavingsStrategy';
import Link from 'next/link';
import { WalletButton } from './WalletButton';
import { MobileMenu } from './MobileMenu';

export function LandingNav() {
  const { isConnected } = useAccount();
  const { hasStrategy } = useSavingsStrategy();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation links based on connection state
  const landingLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#faq', label: 'FAQ' },
  ];

  const appLinks = [
    { href: '/swap', label: 'Swap', icon: '🔄' },
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/configure', label: 'Configure', icon: '⚙️' },
    { href: '/withdraw', label: 'Withdraw', icon: '💰' },
  ];

  const links = isConnected ? appLinks : landingLinks;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-strong backdrop-blur-xl border-b border-white/20 shadow-2xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group hover-lift z-10"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:animate-pulse-glow">
                <span className="text-xl md:text-2xl">🌱</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl md:text-2xl font-black text-white group-hover:gradient-text transition-all duration-300">
                  OneSeed
                </span>
                <div className="text-xs text-gray-400 -mt-1 hidden md:block">
                  Grow your wealth
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  {link.icon && <span className="text-lg">{link.icon}</span>}
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right Side - Wallet Button + Mobile Menu */}
            <div className="flex items-center gap-3">
              {/* Wallet Button */}
              <WalletButton />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Open menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Status Indicator - Only show when connected and has strategy */}
        {isConnected && hasStrategy && (
          <div className="hidden md:block absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className="glass-subtle rounded-full px-4 py-1.5 border border-primary-400/30 shadow-lg">
              <div className="flex items-center gap-2 text-xs font-medium text-primary-300">
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
                Savings Active
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Spacer to prevent content from going under fixed nav */}
      <div className="h-16 md:h-20" />
    </>
  );
}

