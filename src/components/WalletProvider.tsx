'use client'

import { ReactNode, useState, useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { wagmiConfig, queryClient, initializeAppKit } from '@/config/wagmi'
import { BiconomyProvider } from './BiconomyProvider'
import { clearWalletConnectExpirer } from '@/utils/walletConnect'

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Clear any stale WalletConnect data in development
    if (process.env.NODE_ENV === 'development') {
      clearWalletConnectExpirer()
    }
    
    setMounted(true)
    // Ensure AppKit is initialized
    initializeAppKit()
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading OneSeed...</p>
        </div>
      </div>
    )
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <BiconomyProvider>
          {children}
        </BiconomyProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}