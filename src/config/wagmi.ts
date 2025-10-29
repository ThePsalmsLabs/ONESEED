import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base, baseSepolia } from '@reown/appkit/networks'
import { QueryClient } from '@tanstack/react-query'
import { createConfig, http } from 'wagmi'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'
import { 
  getActiveNetwork, 
  getActiveChain, 
  getActiveRPCUrl, 
  getRPCUrl,
  validateNetworkConfig,
  CHAIN_IDS 
} from './network'

// Validate network configuration on startup
validateNetworkConfig()

// Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!

if (!projectId) {
  throw new Error('NEXT_PUBLIC_REOWN_PROJECT_ID is not set')
}

// Get active network configuration
const activeNetwork = getActiveNetwork()
const activeChain = getActiveChain()
const activeRPCUrl = getActiveRPCUrl()

// Create query client
const queryClient = new QueryClient()

// Create wagmi config with proper connectors
const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
    metaMask({
      dappMetadata: {
        name: 'OneSeed',
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      },
    }),
    walletConnect({
      projectId,
      metadata: {
        name: 'OneSeed',
        description: 'Decentralized application for saving while transacting',
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        icons: ['https://avatars.githubusercontent.com/u/179229932']
      },
    }),
  ],
  transports: {
    [base.id]: http(getRPCUrl('base')),
    [baseSepolia.id]: http(getRPCUrl('base-sepolia')),
  },
})

// Create wagmi adapter
const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [base, baseSepolia],
})

const metadata = {
  name: 'OneSeed',
  description: 'Decentralized application for saving while transacting',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Singleton pattern to prevent multiple initializations
let appKitInstance: ReturnType<typeof createAppKit> | null = null

function initializeAppKit() {
  if (appKitInstance) {
    return appKitInstance
  }

  // Only initialize if we're in the browser
  if (typeof window === 'undefined') {
    return null
  }

  try {
    // Suppress console warnings during initialization
    const originalConsoleError = console.error
    const originalConsoleWarn = console.warn
    
    console.error = (...args) => {
      // Suppress specific Reown AppKit warnings
      const message = args.join(' ')
      if (message.includes('Restore will override') || 
          message.includes('history') ||
          message.includes('AppKit')) {
        return // Suppress these warnings
      }
      originalConsoleError.apply(console, args)
    }
    
    console.warn = (...args) => {
      // Suppress specific Reown AppKit warnings
      const message = args.join(' ')
      if (message.includes('Restore will override') || 
          message.includes('history') ||
          message.includes('AppKit')) {
        return // Suppress these warnings
      }
      originalConsoleWarn.apply(console, args)
    }

    appKitInstance = createAppKit({
      adapters: [wagmiAdapter],
      projectId,
      networks: [base, baseSepolia],
      defaultNetwork: activeChain, // Use active network from env config
      metadata,
      features: {
        analytics: true,
        email: false,
        socials: [],
        emailShowWallets: false
      },
      enableWalletConnect: true,
      enableInjected: true,
      enableCoinbase: false,
    })

    // Restore original console methods
    console.error = originalConsoleError
    console.warn = originalConsoleWarn
    
  } catch (error) {
    // Suppress initialization errors in development (hot reload issues)
    if (process.env.NODE_ENV === 'development') {
      console.warn('AppKit initialization warning:', error)
    } else {
      throw error
    }
  }

  return appKitInstance
}

// Initialize on module load
if (typeof window !== 'undefined') {
  initializeAppKit()
}

export { wagmiConfig, queryClient, initializeAppKit }