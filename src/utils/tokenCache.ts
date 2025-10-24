import { Address } from 'viem';

export interface CachedToken {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  timestamp: number;
  logoURI?: string;
}

const CACHE_KEY = 'oneseed_token_cache';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Get token from cache
 */
export function getCachedToken(address: Address): CachedToken | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cache = localStorage.getItem(CACHE_KEY);
    if (!cache) return null;
    
    const parsed = JSON.parse(cache) as Record<string, CachedToken>;
    const token = parsed[address.toLowerCase()];
    
    if (!token) return null;
    
    // Check if cache is expired
    const now = Date.now();
    if (now - token.timestamp > CACHE_EXPIRY) {
      return null;
    }
    
    return token;
  } catch (error) {
    console.error('Error reading token cache:', error);
    return null;
  }
}

/**
 * Save token to cache
 */
export function cacheToken(token: Omit<CachedToken, 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const cache = localStorage.getItem(CACHE_KEY);
    const parsed = cache ? JSON.parse(cache) : {};
    
    parsed[token.address.toLowerCase()] = {
      ...token,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(parsed));
  } catch (error) {
    console.error('Error saving token to cache:', error);
  }
}

/**
 * Clear expired tokens from cache
 */
export function cleanTokenCache(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const cache = localStorage.getItem(CACHE_KEY);
    if (!cache) return;
    
    const parsed = JSON.parse(cache) as Record<string, CachedToken>;
    const now = Date.now();
    const cleaned: Record<string, CachedToken> = {};
    
    Object.entries(parsed).forEach(([address, token]) => {
      if (now - token.timestamp <= CACHE_EXPIRY) {
        cleaned[address] = token;
      }
    });
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(cleaned));
  } catch (error) {
    console.error('Error cleaning token cache:', error);
  }
}

/**
 * Get all cached tokens
 */
export function getAllCachedTokens(): CachedToken[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const cache = localStorage.getItem(CACHE_KEY);
    if (!cache) return [];
    
    const parsed = JSON.parse(cache) as Record<string, CachedToken>;
    const now = Date.now();
    
    return Object.values(parsed).filter(
      token => now - token.timestamp <= CACHE_EXPIRY
    );
  } catch (error) {
    console.error('Error reading cached tokens:', error);
    return [];
  }
}

/**
 * Clear all cached tokens
 */
export function clearTokenCache(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.error('Error clearing token cache:', error);
  }
}

