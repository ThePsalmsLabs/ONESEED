'use client';

import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useSavingsStrategy } from '@/hooks/useSavingsStrategy';
import Link from 'next/link';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { isConnected } = useAccount();
  const { hasStrategy } = useSavingsStrategy();

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Links when NOT connected - landing page sections
  const landingLinks = [
    { href: '#hero', label: 'Home', icon: '🏠' },
    { href: '#features', label: 'Features', icon: '✨' },
    { href: '#how-it-works', label: 'How It Works', icon: '🔄' },
    { href: '#faq', label: 'FAQ', icon: '❓' },
  ];

  // Links when connected - app pages
  const appLinks = [
    { href: '/swap', label: 'Swap', icon: '🔄' },
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/configure', label: 'Configure', icon: '⚙️' },
    { href: '/withdraw', label: 'Withdraw', icon: '💰' },
  ];

  const links = isConnected ? appLinks : landingLinks;

  const handleLinkClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in-up"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm z-50 glass-strong border-l border-white/20 shadow-2xl animate-fade-in-right">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-xl">
                🌱
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">OneSeed</h2>
                <p className="text-gray-300 text-xs">
                  {isConnected ? 'Connected' : 'Grow your wealth'}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-6">
            <div className="space-y-2">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-4 py-3 glass-subtle hover:glass-medium rounded-xl text-white transition-all duration-200 hover-lift group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {link.icon}
                  </span>
                  <span className="font-medium">{link.label}</span>
                </a>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-white/10">
            {isConnected && hasStrategy ? (
              <div className="glass-subtle rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 text-primary-400 mb-2">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Strategy Active</span>
                </div>
                <p className="text-xs text-gray-300">
                  Your savings are growing automatically
                </p>
              </div>
            ) : null}

            <div className="text-center text-xs text-gray-500">
              <p>Built with Uniswap V4 & Biconomy</p>
              <p className="mt-1">© 2025 OneSeed</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

