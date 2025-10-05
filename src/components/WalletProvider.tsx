'use client'

import { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { wagmiConfig, queryClient } from '@/config/wagmi'
import { BiconomyProvider } from './BiconomyProvider'

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
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