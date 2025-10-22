'use client';

import { useState, useEffect, useRef } from 'react';
import { Token, useTokenList } from '@/hooks/swap/useTokenList';

interface TokenSelectorProps {
  onSelect: (token: Token) => void;
  onClose: () => void;
  selectedToken: Token | null;
}

export function TokenSelector({ onSelect, onClose, selectedToken }: TokenSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { tokens, commonTokens } = useTokenList();
  const modalRef = useRef<HTMLDivElement>(null);

  // Filter tokens based on search
  const filteredTokens = tokens.filter(token =>
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
      <div
        ref={modalRef}
        className="w-full max-w-md glass-strong rounded-3xl border border-white/20 shadow-2xl animate-scale-in overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Select a token</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, symbol, or address"
              className="w-full px-4 py-3 pl-10 glass-medium rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Common Tokens */}
        {!searchQuery && (
          <div className="p-4 border-b border-white/10">
            <div className="text-xs text-gray-400 mb-3">COMMON TOKENS</div>
            <div className="flex flex-wrap gap-2">
              {commonTokens.map(token => (
                <button
                  key={token.address}
                  onClick={() => onSelect(token)}
                  disabled={selectedToken?.address === token.address}
                  className="px-3 py-2 glass-subtle hover:glass-medium rounded-lg flex items-center gap-2 transition-all duration-200 hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-400 to-accent-cyan flex items-center justify-center text-xs font-bold">
                    {token.symbol.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-white">{token.symbol}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Token List */}
        <div className="max-h-96 overflow-y-auto p-4">
          {filteredTokens.length > 0 ? (
            <div className="space-y-1">
              {filteredTokens.map(token => (
                <button
                  key={token.address}
                  onClick={() => onSelect(token)}
                  disabled={selectedToken?.address === token.address}
                  className="w-full p-3 glass-subtle hover:glass-medium rounded-xl flex items-center gap-3 transition-all duration-200 hover-lift text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-cyan flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {token.symbol.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-semibold">{token.symbol}</div>
                    <div className="text-xs text-gray-400 truncate">{token.name}</div>
                  </div>
                  {selectedToken?.address === token.address && (
                    <div className="text-primary-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🔍</div>
              <div className="text-gray-400">No tokens found</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

