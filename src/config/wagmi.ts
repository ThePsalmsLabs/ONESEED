import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base, baseSepolia } from '@reown/appkit/networks'
import { QueryClient } from '@tanstack/react-query'
import { createConfig, http } from 'wagmi'

// Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!

if (!projectId) {
  throw new Error('NEXT_PUBLIC_REOWN_PROJECT_ID is not set')
}

// Create query client
const queryClient = new QueryClient()

// Create wagmi config
const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})

// Create wagmi adapter
const wagmiAdapter = new WagmiAdapter({
  networks: [base, baseSepolia],
  projectId,
  ssr: true
})

const metadata = {
  name: 'OneSeed',
  description: 'Decentralized application for saving while transacting',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Create the modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [base, baseSepolia],
  defaultNetwork: baseSepolia,
  metadata,
  features: {
    analytics: true,
    email: false,
    socials: [],
    emailShowWallets: false
  }
})

export { wagmiConfig, queryClient }