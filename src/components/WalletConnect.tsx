'use client'

import { useAppKit } from '@reown/appkit/react'
import { useAccount, useDisconnect } from 'wagmi'
import { useBiconomy } from './BiconomyProvider'

export function WalletConnect() {
  const { open } = useAppKit()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { smartAccount, isLoading, error, smartAccountAddress } = useBiconomy()

  const handleConnect = () => {
    open()
  }

  const handleDisconnect = () => {
    disconnect()
  }

  if (isConnected && address) {
    return (
      <div className="flex flex-col gap-4 p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Wallet Connected</h3>
            <p className="text-sm text-gray-600">
              EOA: {`${address.slice(0, 6)}...${address.slice(-4)}`}
            </p>
          </div>
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            Disconnect
          </button>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-2">Smart Account Status</h4>
          {isLoading ? (
            <p className="text-sm text-gray-600">Setting up smart account...</p>
          ) : error ? (
            <p className="text-sm text-red-600">Error: {error}</p>
          ) : smartAccount && smartAccountAddress ? (
            <div>
              <p className="text-sm text-green-600 mb-1">✓ Smart account ready</p>
              <p className="text-sm text-gray-600">
                Smart Account: {`${smartAccountAddress.slice(0, 6)}...${smartAccountAddress.slice(-4)}`}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-600">Smart account not available</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
    >
      Connect Wallet
    </button>
  )
}