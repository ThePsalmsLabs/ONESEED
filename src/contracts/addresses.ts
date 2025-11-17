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
    UniswapV4PoolSwapTest: '0x0000000000000000000000000000000000000000', // Not available on mainnet
    UniswapV4PoolModifyLiquidityTest: '0x0000000000000000000000000000000000000000', // Not available on mainnet
    UniversalRouter: '0x0000000000000000000000000000000000000000', // TODO: Deploy for mainnet
    Permit2: '0x000000000022D473030F116dDEE9F6B43aC78BA3'
  },
  // Base Sepolia (testnet)
  84532: {
    // Core Contracts
    SpendSaveStorage: '0x12256e69595E5949E05ba48Ab0926032e1e85484',
    SpendSaveHook: '0xB149651E7C60E561148AbD5a31a6ad6ba25c40cc',
    StateView: '0xf6a15a395cc62477f37ebfefac71dd7224296482',
    Analytics: '0xD718d5A27a29FF1cD22403426084bA0d479869a0',
    
    // Core Modules
    SavingStrategy: '0x023EaC31560eBdD6304d6EB5d3D95994c8256d04',
    Savings: '0x8339b29c63563E2Da73f3F4238b9C602F9aaE14F',
    DCA: '0x7d40bf9338dfbf71be85ed10bcef18da8944df44',
    Token: '0x445e062d21b2c9c8f95501cdb5235b7c5c2dba1e',
    SlippageControl: '0x6843c57c75ef9408ddabf744d8e7e9fae849b92e',
    DailySavings: '0xfeeec143f5fe25c076c588981d91b1e8622361b9',
    
    // Phase 2 Enhancement Contracts
    DCARouter: '0x8ae02ee0f17a5c1db1672164b20162a24be28b9a',
    LiquidityManager: '0x58f397f42c8a73714c9a55067c6abad73b8f4af4',
    ModuleRegistry: '0xe3333ee0952dcefd24e0eea2b8bb840041f8f27b',
    Multicall: '0xe1b2d1ad4a1ea6d036a0873a83c7065f123f53be',
    Quoter: '0xc29712bff80eea6136c4c51058ef8567c812a5aa',
    SlippageEnhanced: '0x1dd10dde3e77313bb58530f31d36ecbbcbaad311',
    
    // Uniswap V4 Infrastructure (Official Deployments)
    UniswapV4PoolManager: '0x05e73354cfdd6745c338b50bcfdfa3aa6fa03408',
    UniswapV4PositionManager: '0x4b2c77d209d3405f41a037ec6c77f7f5b8e2ca80',
    UniswapV4Quoter: '0x4A6513c898fe1B2d0E78d3b0e0A4a151589B1cBa',
    UniswapV4StateView: '0x571291b572ed32ce6751a2cb2486ebee8defb9b4',
    UniswapV4PoolSwapTest: '0x8b5bcc363dde2614281ad875bad385e0a785d3b9',
    UniswapV4PoolModifyLiquidityTest: '0x37429cd17cb1454c34e7f50b09725202fd533039',
    UniversalRouter: '0x492e6456d9528771018deb9e87ef7750ef184104', 
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
    UniswapV4PoolSwapTest: '0x0000000000000000000000000000000000000000',
    UniswapV4PoolModifyLiquidityTest: '0x0000000000000000000000000000000000000000',
    UniversalRouter: '0x0000000000000000000000000000000000000000',
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

