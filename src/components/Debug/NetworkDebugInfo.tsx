'use client';

import { useAccount, usePublicClient } from 'wagmi';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { CHAIN_IDS, BASE_SEPOLIA_TOKENS } from '@/config/network';
import { Card } from '@/components/ui/Card';

export function NetworkDebugInfo() {
  const { address, chainId: walletChainId } = useAccount();
  const activeChainId = useActiveChainId();
  const publicClient = usePublicClient();

  const isOnBaseSepolia = activeChainId === CHAIN_IDS.BASE_SEPOLIA;
  const isWalletOnBaseSepolia = walletChainId === CHAIN_IDS.BASE_SEPOLIA;

  return (
    <Card className="p-4 border-yellow-200 bg-yellow-50">
      <h3 className="font-semibold text-yellow-800 mb-3">🔍 Network Debug Info</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-yellow-700">Wallet Chain ID:</span>
          <span className={`font-mono ${isWalletOnBaseSepolia ? 'text-green-600' : 'text-red-600'}`}>
            {walletChainId} {isWalletOnBaseSepolia ? '✅' : '❌'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-yellow-700">Active Chain ID:</span>
          <span className={`font-mono ${isOnBaseSepolia ? 'text-green-600' : 'text-red-600'}`}>
            {activeChainId} {isOnBaseSepolia ? '✅' : '❌'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-yellow-700">Expected (Base Sepolia):</span>
          <span className="font-mono text-blue-600">{CHAIN_IDS.BASE_SEPOLIA}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-yellow-700">User Address:</span>
          <span className="font-mono text-gray-600">
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-yellow-700">Public Client Chain:</span>
          <span className="font-mono text-gray-600">
            {publicClient?.chain?.id || 'Unknown'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-yellow-700">Base Sepolia USDC:</span>
          <span className="font-mono text-gray-600">
            {BASE_SEPOLIA_TOKENS.USDC}
          </span>
        </div>
      </div>
      
      <div className="mt-3 p-2 bg-white/50 rounded text-xs">
        <strong>Status:</strong> {
          isOnBaseSepolia && isWalletOnBaseSepolia 
            ? '✅ Correctly on Base Sepolia' 
            : '❌ Need to switch to Base Sepolia'
        }
      </div>
    </Card>
  );
}