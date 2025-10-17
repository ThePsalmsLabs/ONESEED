'use client'

import { useAppKit } from '@reown/appkit/react'
import { useAccount, useDisconnect } from 'wagmi'
import { useBiconomy } from './BiconomyProvider'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

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
      <Card className="glass bg-white/80 backdrop-blur-sm border border-white/20 shadow-2xl hover-lift max-w-md mx-auto">
        <div className="p-8">
          {/* Connection Status */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center text-3xl text-white shadow-lg mb-4 animate-pulse-glow">
              ✓
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Wallet Connected</h3>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Connected
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-4">
            {/* EOA Address */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Your Wallet</p>
                  <p className="text-lg font-mono text-gray-900">
                    {`${address.slice(0, 8)}...${address.slice(-6)}`}
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  👛
                </div>
              </div>
            </div>
            
            {/* Smart Account Status */}
            <div className={`rounded-xl p-4 ${
              smartAccount ? 'bg-green-50' : error ? 'bg-red-50' : 'bg-yellow-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-1">Smart Account</p>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-yellow-800">Setting up...</span>
                    </div>
                  ) : error ? (
                    <p className="text-sm text-red-800">{error}</p>
                  ) : smartAccount && smartAccountAddress ? (
                    <div>
                      <p className="text-lg font-mono text-green-900 mb-1">
                        {`${smartAccountAddress.slice(0, 8)}...${smartAccountAddress.slice(-6)}`}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-green-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Ready for gasless transactions</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">Not available</p>
                  )}
                </div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  smartAccount ? 'bg-green-100' : error ? 'bg-red-100' : 'bg-yellow-100'
                }`}>
                  {isLoading ? '⏳' : smartAccount ? '⚡' : error ? '❌' : '⏳'}
                </div>
              </div>
            </div>
          </div>

          {/* Disconnect Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button
              onClick={handleDisconnect}
              variant="ghost"
              size="sm"
              className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-200 hover:border-red-300"
            >
              Disconnect Wallet
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="text-center">
      <Button
        onClick={handleConnect}
        variant="primary"
        size="lg"
        className="bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 shadow-xl hover-lift px-12 py-4 text-xl font-semibold"
      >
        <span className="flex items-center gap-3">
          <div className="text-2xl">🔗</div>
          Connect Wallet
        </span>
      </Button>
      
      <p className="text-sm text-gray-400 mt-4 max-w-sm mx-auto">
        Connect your wallet to start saving automatically with every transaction
      </p>
    </div>
  )
}