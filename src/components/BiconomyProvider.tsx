'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useWalletClient } from 'wagmi'
import { createBiconomySmartAccount } from '@/config/biconomy'
import { BiconomySmartAccountV2 } from '@biconomy/account'

interface BiconomyContextType {
  smartAccount: BiconomySmartAccountV2 | null
  isLoading: boolean
  error: string | null
  smartAccountAddress: string | null
}

const BiconomyContext = createContext<BiconomyContextType | undefined>(undefined)

interface BiconomyProviderProps {
  children: ReactNode
}

export function BiconomyProvider({ children }: BiconomyProviderProps) {
  const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>(null)
  
  const { data: walletClient } = useWalletClient()

  useEffect(() => {
    const initSmartAccount = async () => {
      if (!walletClient) {
        setSmartAccount(null)
        setSmartAccountAddress(null)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const account = await createBiconomySmartAccount(walletClient)
        setSmartAccount(account)
        
        const address = await account.getAccountAddress()
        setSmartAccountAddress(address)
        
        console.log('Smart Account Address:', address)
      } catch (err) {
        console.error('Failed to create smart account:', err)
        setError((err as Error).message || 'Failed to create smart account')
      } finally {
        setIsLoading(false)
      }
    }

    initSmartAccount()
  }, [walletClient])

  const value: BiconomyContextType = {
    smartAccount,
    isLoading,
    error,
    smartAccountAddress,
  }

  return (
    <BiconomyContext.Provider value={value}>
      {children}
    </BiconomyContext.Provider>
  )
}

export function useBiconomy() {
  const context = useContext(BiconomyContext)
  if (context === undefined) {
    throw new Error('useBiconomy must be used within a BiconomyProvider')
  }
  return context
}