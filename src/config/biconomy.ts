import { createSmartAccountClient, BiconomySmartAccountV2, Transaction } from '@biconomy/account'
import { http, WalletClient } from 'viem'
import { getActiveChainId, getActiveRPCUrl, isSupportedChainId } from './network'

// Biconomy configuration
const PAYMASTER_API_KEY = process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY

export const createBiconomySmartAccount = async (
  walletClient: WalletClient, 
  chainId?: number
): Promise<BiconomySmartAccountV2> => {
  // Validate required environment variables
  if (!PAYMASTER_API_KEY || PAYMASTER_API_KEY === 'your_biconomy_paymaster_api_key_here') {
    throw new Error('Please set NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY in your .env.local file with a valid Biconomy API key')
  }

  // Use provided chainId or get from environment
  const activeChainId = chainId || getActiveChainId()
  
  // Validate chain ID
  if (!isSupportedChainId(activeChainId)) {
    throw new Error(`Unsupported chain ID: ${activeChainId}. Only Base mainnet (8453) and Base Sepolia (84532) are supported.`)
  }

  try {
    // Ensure proper bundler URL format with explicit chain ID
    const bundlerUrl = `https://bundler.biconomy.io/api/v2/${activeChainId}`
    
    console.log(`Creating smart account for chain ${activeChainId} with bundler: ${bundlerUrl}`)
    
    const smartAccount = await createSmartAccountClient({
      signer: walletClient,
      bundlerUrl: bundlerUrl,
      biconomyPaymasterApiKey: PAYMASTER_API_KEY,
      rpcUrl: getActiveRPCUrl(),
      chainId: activeChainId,
    })

    const networkName = activeChainId === 8453 ? 'Base Mainnet' : 'Base Sepolia'
    console.log(`Smart account created on ${networkName} (Chain ID: ${activeChainId})`)
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