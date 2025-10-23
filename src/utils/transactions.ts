import { type Hash } from 'viem';
import { getBlockExplorerUrl, getNetworkFromChainId } from '@/config/network';

export interface TransactionState {
  status: 'idle' | 'pending' | 'confirming' | 'success' | 'error';
  hash?: Hash;
  error?: Error;
}

export function getExplorerUrl(chainId: number, hash: Hash): string {
  const network = getNetworkFromChainId(chainId);
  const baseUrl = network ? getBlockExplorerUrl(network) : 'https://basescan.org';
  return `${baseUrl}/tx/${hash}`;
}

export function shortenHash(hash: string, chars = 4): string {
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

