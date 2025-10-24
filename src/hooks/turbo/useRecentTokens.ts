'use client';

import { useState, useCallback, useEffect } from 'react';
import { Address } from 'viem';

export interface RecentToken {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  lastUsed: number;
}

const RECENT_TOKENS_KEY = 'oneseed_recent_tokens';
const MAX_RECENT_TOKENS = 20;

/**
 * Hook to manage recently used tokens
 */
export function useRecentTokens() {
  const [recentTokens, setRecentTokens] = useState<RecentToken[]>([]);
  
  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(RECENT_TOKENS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as RecentToken[];
        // Sort by most recent
        setRecentTokens(parsed.sort((a, b) => b.lastUsed - a.lastUsed));
      }
    } catch (error) {
      console.error('Error loading recent tokens:', error);
    }
  }, []);
  
  const addRecentToken = useCallback((token: Omit<RecentToken, 'lastUsed'>) => {
    setRecentTokens(prev => {
      // Remove if already exists
      const filtered = prev.filter(
        t => t.address.toLowerCase() !== token.address.toLowerCase()
      );
      
      // Add to front with current timestamp
      const updated = [
        { ...token, lastUsed: Date.now() },
        ...filtered,
      ].slice(0, MAX_RECENT_TOKENS); // Keep only latest N tokens
      
      // Save to localStorage
      try {
        localStorage.setItem(RECENT_TOKENS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving recent tokens:', error);
      }
      
      return updated;
    });
  }, []);
  
  const clearRecentTokens = useCallback(() => {
    setRecentTokens([]);
    try {
      localStorage.removeItem(RECENT_TOKENS_KEY);
    } catch (error) {
      console.error('Error clearing recent tokens:', error);
    }
  }, []);
  
  return {
    recentTokens,
    addRecentToken,
    clearRecentTokens,
  };
}

