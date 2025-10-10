import { type Hash } from 'viem';

export interface TransactionState {
  status: 'idle' | 'pending' | 'confirming' | 'success' | 'error';
  hash?: Hash;
  error?: Error;
}

export function getExplorerUrl(chainId: number, hash: Hash): string {
  const explorers: Record<number, string> = {
    84532: 'https://sepolia.basescan.org', // Base Sepolia
    8453: 'https://basescan.org', // Base Mainnet
    1: 'https://etherscan.io', // Ethereum Mainnet
    31337: 'http://localhost:8545', // Localhost
  };

  const baseUrl = explorers[chainId] || explorers[1];
  return `${baseUrl}/tx/${hash}`;
}

export function shortenHash(hash: string, chars = 4): string {
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

