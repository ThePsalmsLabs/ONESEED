import { createSmartAccountClient, BiconomySmartAccountV2, Transaction } from '@biconomy/account'
import { http, WalletClient } from 'viem'
import { getActiveChainId, getActiveRPCUrl, isSupportedChainId, CHAIN_IDS } from './network'

// Biconomy configuration - Network-aware bundler URLs
// Falls back to legacy env vars if network-specific ones aren't set
const BUNDLER_URLS: Record<number, string> = {
  [CHAIN_IDS.BASE_MAINNET]: process.env.NEXT_PUBLIC_BICONOMY_BUNDLER_URL_BASE || process.env.NEXT_PUBLIC_BICONOMY_BUNDLER_URL || 'https://bundler.biconomy.io/api/v2/8453',
  [CHAIN_IDS.BASE_SEPOLIA]: process.env.NEXT_PUBLIC_BICONOMY_BUNDLER_URL_BASE_SEPOLIA || process.env.NEXT_PUBLIC_BICONOMY_BUNDLER_URL || 'https://bundler.biconomy.io/api/v2/84532',
}

// Paymaster API keys - Network-aware (use separate keys for mainnet/testnet)
// Falls back to legacy env var if network-specific ones aren't set
const PAYMASTER_API_KEYS: Record<number, string | undefined> = {
  [CHAIN_IDS.BASE_MAINNET]: process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY_BASE || process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY,
  [CHAIN_IDS.BASE_SEPOLIA]: process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY_BASE_SEPOLIA || process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY,
}

const getBundlerUrl = (chainId: number): string => {
  const url = BUNDLER_URLS[chainId]
  if (!url) {
    throw new Error(`No Biconomy bundler URL configured for chain ID: ${chainId}`)
  }
  return url
}

const getPaymasterApiKey = (chainId: number): string => {
  const apiKey = PAYMASTER_API_KEYS[chainId]
  if (!apiKey || apiKey === 'your_biconomy_paymaster_api_key_here') {
    throw new Error(`Please set NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY${chainId === CHAIN_IDS.BASE_MAINNET ? '_BASE' : '_BASE_SEPOLIA'} in your .env.local file with a valid Biconomy API key`)
  }
  return apiKey
}

export const createBiconomySmartAccount = async (
  walletClient: WalletClient,
  chainId?: number
): Promise<BiconomySmartAccountV2> => {
  // Use provided chainId or get from environment
  const activeChainId = chainId || getActiveChainId()

  // Validate chain ID
  if (!isSupportedChainId(activeChainId)) {
    throw new Error(`Unsupported chain ID: ${activeChainId}. Only Base mainnet (8453) and Base Sepolia (84532) are supported.`)
  }

  // Get network-specific configuration
  const bundlerUrl = getBundlerUrl(activeChainId)
  const paymasterApiKey = getPaymasterApiKey(activeChainId)

  try {
    const networkName = activeChainId === CHAIN_IDS.BASE_MAINNET ? 'Base Mainnet' : 'Base Sepolia'
    console.log(`🔧 Creating Biconomy smart account for ${networkName} (Chain ID: ${activeChainId})`)
    console.log(`📡 Bundler URL: ${bundlerUrl}`)
    console.log(`🔑 Paymaster API Key: ${paymasterApiKey.substring(0, 10)}...`)

    const smartAccount = await createSmartAccountClient({
      signer: walletClient,
      bundlerUrl,
      biconomyPaymasterApiKey: paymasterApiKey,
      rpcUrl: getActiveRPCUrl(),
      chainId: activeChainId,
    })

    console.log(`✅ Smart account created successfully on ${networkName}`)
    return smartAccount
  } catch (error) {
    console.error('❌ Error creating Biconomy smart account:', error)
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