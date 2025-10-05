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
const PAYMASTER_API_KEY = process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY

// Base RPC URLs
const BASE_RPC_URLS = {
  [BASE_MAINNET_CHAIN_ID]: 'https://mainnet.base.org',
  [BASE_TESTNET_CHAIN_ID]: 'https://sepolia.base.org'
}

export const createBiconomySmartAccount = async (walletClient: WalletClient): Promise<BiconomySmartAccountV2> => {
  // Validate required environment variables
  if (!PAYMASTER_API_KEY || PAYMASTER_API_KEY === 'your_biconomy_paymaster_api_key_here') {
    throw new Error('Please set NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY in your .env.local file with a valid Biconomy API key')
  }

  try {
    // Ensure proper bundler URL format with explicit chain ID
    const bundlerUrl = `https://bundler.biconomy.io/api/v2/${chainId}`
    
    console.log(`Creating smart account for chain ${chainId} with bundler: ${bundlerUrl}`)
    
    const smartAccount = await createSmartAccountClient({
      signer: walletClient,
      bundlerUrl: bundlerUrl,
      biconomyPaymasterApiKey: PAYMASTER_API_KEY,
      rpcUrl: BASE_RPC_URLS[chainId],
      chainId: chainId,
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