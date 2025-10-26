export const CONTRACT_ADDRESSES = {
  // Base (mainnet)
  8453: {
    // Core Contracts
    SpendSaveStorage: '0xcd52e874af4a9896977536b05a53d84a0204e365',
    SpendSaveHook: '0x0eeb66c3164b11b77fff1371c6fd25a1833440cc',
    StateView: '0xa121c949f788b1a4c2710bbaa1bfc70779a2b9fe',
    Analytics: '0x1e831512a36b461255ceff736dc4b60bf5dfadae',
    
    // Core Modules
    SavingStrategy: '0x3b0febb47f1c2edc4a5ef9525579f557f2a2486d',
    Savings: '0xa0d6a783e91cd7a99724a55462590128ab66eb07',
    DCA: '0x6018a8f0a5b9f9ca137bdf062167ddffbcddb678',
    Token: '0x9e602e54c4a7406bc7011f8c2fc05ecca7621965',
    SlippageControl: '0x35af14f9ccd83333dd5284bbc7ef97798679a4fd',
    DailySavings: '0x4fc47944b267047ec1dc3cc07826d00fcc0fbe32',
    
    // Phase 2 Enhancement Contracts
    DCARouter: '0x8775a668923e77d01e9c12497fd8a2ae7e2236e2',
    LiquidityManager: '0xd2b98c3b818ab71c2c34af5a9791fdf45db9da04',
    ModuleRegistry: '0xd9e411b4b13e6e8da253ee2bfcec045a51942e99',
    Multicall: '0xb34ce801c1e49e661484e3312d642e5254db6d28',
    Quoter: '0x331489d3896731ff6cdcd0fbc6bb7785c9a79376',
    SlippageEnhanced: '0x017846ad6d199ec0e6c65acc18d6f2b79c802ead',
    
    // Uniswap V4 Infrastructure (Official Deployments)
    UniswapV4PoolManager: '0x498581fF718922c3f8e6A244956aF099B2652b2b',
    UniswapV4PositionManager: '0x4d09a65b1c52ab5f6db91cc31e4c88e0d36e05f5',
    UniswapV4Quoter: '0xd5ae3adf52bb033c3f1eced2d6e1f603e1e22acb',
    UniswapV4StateView: '0x26e557e6b8f7b41af9f4aa7ec5d7e79ab9c26e8e',
    SwapRouter: '0x0000000000000000000000000000000000000000', // TODO: Deploy for mainnet
    Permit2: '0x000000000022D473030F116dDEE9F6B43aC78BA3'
  },
  // Base Sepolia (testnet)
  84532: {
    // Core Contracts
    SpendSaveStorage: '0xc95a40d1b2914a72319735db73c14183bc641fa2',
    SpendSaveHook: '0xc4abf9a7bf8300086bbad164b4c47b1afbbf00cc',
    StateView: '0xd4686dbfc2f08967c17652673a1b4a931269e5dd',
    Analytics: '0x38f85face60b04d8fcf325ea7af3f1830e09e1cd',
    
    // Core Modules
    SavingStrategy: '0x871cf56efa79ebe9332e49143927b5e91b047253',
    Savings: '0xf5b264234b88e1a1c9fa7fc8d27022b0b7670ddc',
    DCA: '0xcabdb0a0a6a95c98234827bdbcb2fca290c0b78c',
    Token: '0x5d2ae47d4a173d134d927888a94e9508c43c89d1',
    SlippageControl: '0x870737d0585596530fe95a5c2a1dbb988567d2b7',
    DailySavings: '0x2acca4cef714da8414900c43076a4c1983d8c0a2',
    
    // Phase 2 Enhancement Contracts
    DCARouter: '0x6b1392f055c468c414740fe3abd7bdaa03d243f1',
    LiquidityManager: '0x5b1a90c2454d1e5ee65ebe9d6f48cc42915f47f9',
    ModuleRegistry: '0xef44e773fd3eaadbee5328c5d8b6d4bdf515aa33',
    Multicall: '0x177939095edf5fb0370789b88168912f290a1ab5',
    Quoter: '0xd1511a9cb4ca886a6585c806650e3b6e174bbb62',
    SlippageEnhanced: '0xabc9fd600cfa0777679b8c567fd2f03d5ef5d48a',
    
    // Uniswap V4 Infrastructure (Official Deployments)
    UniswapV4PoolManager: '0x05e73354cfdd6745c338b50bcfdfa3aa6fa03408',
    UniswapV4PositionManager: '0xB433cdd61b61Aab1C47390e3f26EFe89cBB6d8C5',
    UniswapV4Quoter: '0x4f8D0Ce172D0558b76e3bDC0B5Cc9E84f3f12193',
    UniswapV4StateView: '0xd0A10A7Ed3f63E3C61a6f1B8fa0341Cf3AE44E0b',
    SwapRouter: '0xd8cdc1aa311650af388111f36d5b85c3ef44789b', // PoolSwapTest router for swaps
    Permit2: '0x000000000022D473030F116dDEE9F6B43aC78BA3'
  },
  // Localhost (for testing)
  31337: {
    // Core Contracts
    SpendSaveStorage: '0x0000000000000000000000000000000000000000',
    SpendSaveHook: '0x0000000000000000000000000000000000000000',
    StateView: '0x0000000000000000000000000000000000000000',
    Analytics: '0x0000000000000000000000000000000000000000',
    
    // Core Modules
    SavingStrategy: '0x0000000000000000000000000000000000000000',
    Savings: '0x0000000000000000000000000000000000000000',
    DCA: '0x0000000000000000000000000000000000000000',
    Token: '0x0000000000000000000000000000000000000000',
    SlippageControl: '0x0000000000000000000000000000000000000000',
    DailySavings: '0x0000000000000000000000000000000000000000',
    
    // Phase 2 Enhancement Contracts
    DCARouter: '0x0000000000000000000000000000000000000000',
    LiquidityManager: '0x0000000000000000000000000000000000000000',
    ModuleRegistry: '0x0000000000000000000000000000000000000000',
    Multicall: '0x0000000000000000000000000000000000000000',
    Quoter: '0x0000000000000000000000000000000000000000',
    SlippageEnhanced: '0x0000000000000000000000000000000000000000',
    
    // Uniswap V4 Infrastructure
    UniswapV4PoolManager: '0x0000000000000000000000000000000000000000',
    UniswapV4PositionManager: '0x0000000000000000000000000000000000000000',
    UniswapV4Quoter: '0x0000000000000000000000000000000000000000',
    UniswapV4StateView: '0x0000000000000000000000000000000000000000',
    SwapRouter: '0x0000000000000000000000000000000000000000',
    Permit2: '0x000000000022D473030F116dDEE9F6B43aC78BA3'
  }
} as const;

export type ContractName = keyof typeof CONTRACT_ADDRESSES[84532];
export type SupportedChainId = keyof typeof CONTRACT_ADDRESSES;

export function getContractAddress(chainId: number, contractName: ContractName): `0x${string}` {
  const addresses = CONTRACT_ADDRESSES[chainId as SupportedChainId];
  if (!addresses) {
    const supportedChains = Object.keys(CONTRACT_ADDRESSES).join(', ');
    throw new Error(
      `Unsupported chain ID: ${chainId}. ` +
      `Supported chains: ${supportedChains}. ` +
      `Please check your network configuration.`
    );
  }
  
  const address = addresses[contractName] as `0x${string}`;
  
  // Check if address is zero address (not deployed)
  if (address === '0x0000000000000000000000000000000000000000') {
    const networkName = chainId === 8453 ? 'Base Mainnet' : chainId === 84532 ? 'Base Sepolia' : `Chain ${chainId}`;
    console.warn(
      `Contract ${contractName} is not deployed on ${networkName} (Chain ID: ${chainId}). ` +
      `Address: ${address}. This may cause transaction failures.`
    );
  }
  
  console.log(`Using ${contractName} contract on chain ${chainId}: ${address}`);
  return address;
}

