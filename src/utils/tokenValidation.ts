import { Address, isAddress } from 'viem';

/**
 * Validate if a string is a valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return isAddress(address);
}

/**
 * Validate and normalize an address
 */
export function validateAndNormalizeAddress(address: string): Address | null {
  if (!address) return null;
  
  const trimmed = address.trim();
  
  if (!isAddress(trimmed)) {
    return null;
  }
  
  return trimmed as Address;
}

/**
 * Check if address looks like it could be an ERC20 token
 * This is a basic check - actual verification happens on-chain
 */
export function looksLikeERC20Address(address: string): boolean {
  // Basic checks
  if (!isValidAddress(address)) return false;
  
  // Not a common system address
  const lowerAddress = address.toLowerCase();
  if (lowerAddress === '0x0000000000000000000000000000000000000000') return false;
  if (lowerAddress === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') return false; // Native ETH placeholder
  
  return true;
}

/**
 * Format address for display
 */
export function formatAddress(address: string, startChars = 6, endChars = 4): string {
  if (!address || address.length < startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Extract potential token address from user input
 * Handles pasted data that might include extra text
 */
export function extractAddressFromInput(input: string): string | null {
  const trimmed = input.trim();
  
  // Check if it's already a clean address
  if (isAddress(trimmed)) {
    return trimmed;
  }
  
  // Try to find an address in the input using regex
  const addressPattern = /0x[a-fA-F0-9]{40}/;
  const match = trimmed.match(addressPattern);
  
  if (match) {
    return match[0];
  }
  
  return null;
}

