import { createSmartAccountClient, BiconomySmartAccountV2, Transaction } from '@biconomy/account'
import { http, WalletClient } from 'viem'
import { base, baseSepolia } from 'viem/chains'

// Base network configuration
const BASE_MAINNET_CHAIN_ID = 8453
const BASE_TESTNET_CHAIN_ID = 84532

// Environment detection
const isProduction = process.env.NODE_ENV === 'production'
const chainId = isProduction ? BASE_MAINNET_CHAIN_ID : BASE_TESTNET_CHAIN_ID

// Biconomy configuration for Base
const PAYMASTER_API_KEY = process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY!
const BUNDLER_URL = process.env.NEXT_PUBLIC_BICONOMY_BUNDLER_URL || 
  `https://bundler.biconomy.io/api/v2/${chainId}`

// Base RPC URLs
const BASE_RPC_URLS = {
  [BASE_MAINNET_CHAIN_ID]: 'https://mainnet.base.org',
  [BASE_TESTNET_CHAIN_ID]: 'https://sepolia.base.org'
}

if (!PAYMASTER_API_KEY) {
  console.warn('NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY is not set')
}

export const createBiconomySmartAccount = async (walletClient: WalletClient): Promise<BiconomySmartAccountV2> => {
  try {
    const smartAccount = await createSmartAccountClient({
      signer: walletClient,
      bundlerUrl: BUNDLER_URL,
      biconomyPaymasterApiKey: PAYMASTER_API_KEY,
      rpcUrl: BASE_RPC_URLS[chainId],
    })

    console.log(`Smart account created on Base ${isProduction ? 'Mainnet' : 'Testnet'} (Chain ID: ${chainId})`)
    return smartAccount
  } catch (error) {
    console.error('Error creating Biconomy smart account:', error)
    throw error
  }
}

export const sendGaslessTransaction = async (smartAccount: BiconomySmartAccountV2, transaction: Transaction) => {
  try {
    const transactionHash = await smartAccount.sendTransaction(transaction)
    console.log('Transaction Hash:', transactionHash)

    return { transactionHash }
  } catch (error) {
    console.error('Error sending gasless transaction:', error)
    throw error
  }
}