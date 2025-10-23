'use client';

import { useAccount } from 'wagmi';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { CHAIN_NAMES } from '@/utils/constants';
import { Badge } from './ui/Badge';

export function NetworkIndicator() {
  const { isConnected } = useAccount();
  const chainId = useActiveChainId();

  if (!isConnected) return null;

  const chainName = CHAIN_NAMES[chainId] || 'Unknown Network';
  const isTestnet = chainId === 84532 || chainId === 31337;

  return (
    <Badge variant={isTestnet ? 'warning' : 'success'}>
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${isTestnet ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`} />
        {chainName}
      </div>
    </Badge>
  );
}

