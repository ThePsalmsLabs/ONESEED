'use client';

import { useState, useCallback, useEffect } from 'react';
import { Address } from 'viem';

export interface FavoriteToken {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  addedAt: number;
}

const FAVORITE_TOKENS_KEY = 'oneseed_favorite_tokens';

/**
 * Hook to manage favorite tokens
 */
export function useFavoriteTokens() {
  const [favoriteTokens, setFavoriteTokens] = useState<FavoriteToken[]>([]);
  
  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(FAVORITE_TOKENS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as FavoriteToken[];
        setFavoriteTokens(parsed);
      }
    } catch (error) {
      console.error('Error loading favorite tokens:', error);
    }
  }, []);
  
  const addFavorite = useCallback((token: Omit<FavoriteToken, 'addedAt'>) => {
    setFavoriteTokens(prev => {
      // Check if already exists
      const exists = prev.some(
        t => t.address.toLowerCase() === token.address.toLowerCase()
      );
      
      if (exists) return prev;
      
      const updated = [...prev, { ...token, addedAt: Date.now() }];
      
      // Save to localStorage
      try {
        localStorage.setItem(FAVORITE_TOKENS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving favorite tokens:', error);
      }
      
      return updated;
    });
  }, []);
  
  const removeFavorite = useCallback((address: Address) => {
    setFavoriteTokens(prev => {
      const updated = prev.filter(
        t => t.address.toLowerCase() !== address.toLowerCase()
      );
      
      // Save to localStorage
      try {
        localStorage.setItem(FAVORITE_TOKENS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving favorite tokens:', error);
      }
      
      return updated;
    });
  }, []);
  
  const isFavorite = useCallback((address: Address): boolean => {
    return favoriteTokens.some(
      t => t.address.toLowerCase() === address.toLowerCase()
    );
  }, [favoriteTokens]);
  
  const clearFavorites = useCallback(() => {
    setFavoriteTokens([]);
    try {
      localStorage.removeItem(FAVORITE_TOKENS_KEY);
    } catch (error) {
      console.error('Error clearing favorite tokens:', error);
    }
  }, []);
  
  return {
    favoriteTokens,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
  };
}

