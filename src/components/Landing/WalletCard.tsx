'use client';

import { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useBiconomy } from '@/components/BiconomyProvider';
import { Button } from '@/components/ui/Button';

interface WalletCardProps {
  onClose?: () => void;
}

export function WalletCard({ onClose }: WalletCardProps) {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { smartAccountAddress, isLoading } = useBiconomy();
  const [copiedAddress, setCopiedAddress] = useState<'smart' | 'eoa' | null>(null);

  const handleCopy = async (addr: string, type: 'smart' | 'eoa') => {
    try {
      await navigator.clipboard.writeText(addr);
      setCopiedAddress(type);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    onClose?.();
  };

  if (!address) return null;

  return (
    <div className="w-80 glass-strong rounded-2xl overflow-hidden shadow-2xl border border-white/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500/10 to-accent-cyan/10 p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-xl">
            🌱
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Your OneSeed Account</h3>
            <p className="text-gray-300 text-xs">Connected & Ready</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Smart Account Section - Emphasized */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-cyan/20 rounded-xl blur-xl" />
          <div className="relative glass-neon rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">⚡</span>
                  <span className="text-white font-bold">Smart Account</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-primary-500/20 text-primary-300 rounded-full text-xs font-medium">
                  <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse" />
                  Gasless enabled
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <div className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                Setting up...
              </div>
            ) : smartAccountAddress ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-black/20 rounded-lg px-3 py-2">
                  <code className="text-white font-mono text-sm">
                    {`${smartAccountAddress.slice(0, 10)}...${smartAccountAddress.slice(-8)}`}
                  </code>
                  <button
                    onClick={() => handleCopy(smartAccountAddress, 'smart')}
                    className="ml-2 px-2 py-1 text-xs text-primary-300 hover:text-primary-200 transition-colors"
                  >
                    {copiedAddress === 'smart' ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs text-gray-300 flex items-center gap-1">
                  <span>✓</span> All transactions are gasless
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-300">Not available</p>
            )}
          </div>
        </div>

        {/* EOA Section - Secondary */}
        <div className="glass-subtle rounded-xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">👛</span>
                <span className="text-gray-300 font-semibold">Your Wallet</span>
              </div>
              <p className="text-xs text-gray-500">EOA (Externally Owned)</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between bg-black/20 rounded-lg px-3 py-2">
              <code className="text-gray-300 font-mono text-sm">
                {`${address.slice(0, 10)}...${address.slice(-8)}`}
              </code>
              <button
                onClick={() => handleCopy(address, 'eoa')}
                className="ml-2 px-2 py-1 text-xs text-gray-400 hover:text-gray-200 transition-colors"
              >
                {copiedAddress === 'eoa' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span>🔵</span> Connected to Base
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <a
            href="/dashboard"
            className="text-center px-3 py-2 glass-subtle hover:glass-medium rounded-lg text-sm text-gray-300 hover:text-white transition-all duration-200 hover-lift"
          >
            📊 Dashboard
          </a>
          <a
            href="/configure"
            className="text-center px-3 py-2 glass-subtle hover:glass-medium rounded-lg text-sm text-gray-300 hover:text-white transition-all duration-200 hover-lift"
          >
            ⚙️ Configure
          </a>
        </div>

        {/* Disconnect Button */}
        <div className="pt-2 border-t border-white/10">
          <Button
            onClick={handleDisconnect}
            variant="ghost"
            size="sm"
            className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/30"
          >
            Disconnect Wallet
          </Button>
        </div>
      </div>
    </div>
  );
}

