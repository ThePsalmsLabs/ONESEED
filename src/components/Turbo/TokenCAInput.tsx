'use client';

import { useState, useRef, useEffect } from 'react';
import { Address } from 'viem';
import { useTokenFromCA, TokenFromCA } from '@/hooks/turbo/useTokenFromCA';
import { useRecentTokens } from '@/hooks/turbo/useRecentTokens';
import { useFavoriteTokens } from '@/hooks/turbo/useFavoriteTokens';
import { extractAddressFromInput } from '@/utils/tokenValidation';
import { useTokenList, Token } from '@/hooks/swap/useTokenList';

interface TokenCAInputProps {
  selectedToken: Token | TokenFromCA | null;
  onTokenSelect: (token: Token | TokenFromCA) => void;
  label: string;
  autoFocus?: boolean;
}

export function TokenCAInput({ selectedToken, onTokenSelect, label, autoFocus }: TokenCAInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { token, isLoading, error, fetchToken, clearToken } = useTokenFromCA();
  const { recentTokens, addRecentToken } = useRecentTokens();
  const { favoriteTokens, addFavorite, removeFavorite, isFavorite } = useFavoriteTokens();
  const { commonTokens } = useTokenList();
  
  // Auto-focus on mount
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  // Handle token fetch completion
  useEffect(() => {
    if (token) {
      onTokenSelect(token);
      addRecentToken({
        address: token.address,
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals,
      });
      setInputValue('');
      setShowDropdown(false);
    }
  }, [token, onTokenSelect, addRecentToken]);
  
  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowDropdown(true);
    
    // Try to extract and fetch token if it looks like an address
    const extractedAddress = extractAddressFromInput(value);
    if (extractedAddress && extractedAddress.length === 42) {
      fetchToken(extractedAddress);
    }
  };
  
  const handleTokenClick = (token: Token | TokenFromCA) => {
    onTokenSelect(token);
    setInputValue('');
    setShowDropdown(false);
    
    // Add to recent if it's not a common token
    if (!('isCommon' in token) || !token.isCommon) {
      addRecentToken({
        address: token.address,
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals,
      });
    }
  };
  
  const handleToggleFavorite = (token: Token | TokenFromCA, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isFavorite(token.address)) {
      removeFavorite(token.address);
    } else {
      addFavorite({
        address: token.address,
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals,
      });
    }
  };
  
  // Filter tokens based on input
  const filteredCommon = commonTokens.filter(t =>
    t.symbol.toLowerCase().includes(inputValue.toLowerCase()) ||
    t.name.toLowerCase().includes(inputValue.toLowerCase()) ||
    t.address.toLowerCase().includes(inputValue.toLowerCase())
  );
  
  const filteredRecent = recentTokens.filter(t =>
    t.symbol.toLowerCase().includes(inputValue.toLowerCase()) ||
    t.name.toLowerCase().includes(inputValue.toLowerCase()) ||
    t.address.toLowerCase().includes(inputValue.toLowerCase())
  );
  
  const filteredFavorites = favoriteTokens.filter(t =>
    t.symbol.toLowerCase().includes(inputValue.toLowerCase()) ||
    t.name.toLowerCase().includes(inputValue.toLowerCase()) ||
    t.address.toLowerCase().includes(inputValue.toLowerCase())
  );
  
  return (
    <div className="relative">
      {/* Label */}
      <label className="block text-sm text-gray-400 mb-2">{label}</label>
      
      {/* Selected Token or Input */}
      <div className="relative">
        {selectedToken ? (
          <button
            onClick={() => {
              onTokenSelect(null as any);
              setShowDropdown(true);
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
            className="w-full glass-medium rounded-xl p-4 flex items-center justify-between hover:glass-strong transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-cyan flex items-center justify-center text-lg font-bold">
                {selectedToken.symbol.charAt(0)}
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-lg">{selectedToken.symbol}</div>
                <div className="text-xs text-gray-400">{selectedToken.name}</div>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        ) : (
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setShowDropdown(true)}
              placeholder="Paste contract address or search..."
              className="w-full glass-medium rounded-xl p-4 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {error && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mt-2 text-sm text-red-400">
          {error}
        </div>
      )}
      
      {/* Dropdown */}
      {showDropdown && !selectedToken && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 glass-strong rounded-xl border border-white/20 shadow-2xl max-h-96 overflow-y-auto"
        >
          {/* Common Tokens */}
          {filteredCommon.length > 0 && (
            <div className="p-3 border-b border-white/10">
              <div className="text-xs text-gray-400 mb-2">POPULAR</div>
              <div className="space-y-1">
                {filteredCommon.map(token => (
                  <button
                    key={token.address}
                    onClick={() => handleTokenClick(token)}
                    className="w-full p-2 glass-subtle hover:glass-medium rounded-lg flex items-center gap-3 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-cyan flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {token.symbol.charAt(0)}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-white font-semibold">{token.symbol}</div>
                      <div className="text-xs text-gray-400 truncate">{token.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Favorite Tokens */}
          {filteredFavorites.length > 0 && (
            <div className="p-3 border-b border-white/10">
              <div className="text-xs text-gray-400 mb-2">FAVORITES</div>
              <div className="space-y-1">
                {filteredFavorites.map(token => (
                  <button
                    key={token.address}
                    onClick={() => handleTokenClick(token)}
                    className="w-full p-2 glass-subtle hover:glass-medium rounded-lg flex items-center gap-3 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      ⭐
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-white font-semibold">{token.symbol}</div>
                      <div className="text-xs text-gray-400 truncate">{token.name}</div>
                    </div>
                    <button
                      onClick={(e) => handleToggleFavorite(token, e)}
                      className="p-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                      ★
                    </button>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Recent Tokens */}
          {filteredRecent.length > 0 && (
            <div className="p-3">
              <div className="text-xs text-gray-400 mb-2">RECENT</div>
              <div className="space-y-1">
                {filteredRecent.slice(0, 5).map(token => (
                  <button
                    key={token.address}
                    onClick={() => handleTokenClick(token)}
                    className="w-full p-2 glass-subtle hover:glass-medium rounded-lg flex items-center gap-3 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-cyan flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {token.symbol.charAt(0)}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-white font-semibold">{token.symbol}</div>
                      <div className="text-xs text-gray-400 truncate">{token.name}</div>
                    </div>
                    <button
                      onClick={(e) => handleToggleFavorite(token, e)}
                      className={`p-1 transition-colors ${
                        isFavorite(token.address)
                          ? 'text-yellow-400 hover:text-yellow-300'
                          : 'text-gray-600 hover:text-yellow-400'
                      }`}
                    >
                      {isFavorite(token.address) ? '★' : '☆'}
                    </button>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Empty State */}
          {filteredCommon.length === 0 && filteredRecent.length === 0 && filteredFavorites.length === 0 && !isLoading && (
            <div className="p-8 text-center">
              <div className="text-4xl mb-2">🔍</div>
              <div className="text-gray-400">
                {inputValue ? 'No tokens found' : 'Start typing or paste a contract address'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

