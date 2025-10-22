export const CONTRACT_ADDRESSES = {
  // Base (mainnet)
  8453: {
    // Core Contracts
    SpendSaveStorage: '0x0000000000000000000000000000000000000000', // TODO: Add after deployment
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
    
    // Uniswap V4 Infrastructure (Official Deployments)
    UniswapV4PoolManager: '0x498581fF718922c3f8e6A244956aF099B2652b2b',
    UniswapV4PositionManager: '0x4d09a65b1c52ab5f6db91cc31e4c88e0d36e05f5',
    UniswapV4Quoter: '0xd5ae3adf52bb033c3f1eced2d6e1f603e1e22acb',
    UniswapV4StateView: '0x26e557e6b8f7b41af9f4aa7ec5d7e79ab9c26e8e',
    Permit2: '0x000000000022D473030F116dDEE9F6B43aC78BA3'
  },
  // Base Sepolia (testnet)
  84532: {
    // Core Contracts
    SpendSaveStorage: '0xdde1c884771c8b88ce6edbbd645a8c7824071cec',
    SpendSaveHook: '0x91b72dcd27d3662b4b75a529155c28402b2000cc',
    StateView: '0x7c03ee7e3cc8d6e7fe569c4c05a12eed368e663e',
    Analytics: '0x504cf105be3a693ffb48b8ecd006d805776a449b',
    
    // Core Modules
    SavingStrategy: '0xe08734a40f350749a5d0a4496b4977fbe899f361',
    Savings: '0x2cfde4f4ef0c4621c3dda10e018c3bc60b90777e',
    DCA: '0x0e4a2848044c5cf757af1b6ba4234cb56ad59edd',
    Token: '0xfa55fa298b26e1eaa6266f735f0513d7bdc73718',
    SlippageControl: '0x7811cb44056fa561cc8f1b27bc89464e039ebc64',
    DailySavings: '0x1d377a681b086ba005673c25bae047f273df4034',
    
    // Phase 2 Enhancement Contracts
    DCARouter: '0x522d35fc6691ba245d3d412b30066dd9592e155a',
    LiquidityManager: '0x93294ceb32858889c1d014db0040eeacceab64dc',
    ModuleRegistry: '0x94351040476e90ea398fbc85e31c2edde164fe14',
    Multicall: '0x8629d41d7c10b441a8cb48609c89737bfe2d4c80',
    Quoter: '0x1dfa9ca86523d42e76dba957abf2f27491f388c5',
    SlippageEnhanced: '0xcb32326ba4dc186f99a6eddef124964d1728b0cb',
    
    // Uniswap V4 Infrastructure (Official Deployments)
    UniswapV4PoolManager: '0x7Da1D65F8B249183667cdE74C5CBD46dD38AA829',
    UniswapV4PositionManager: '0xB433cdd61b61Aab1C47390e3f26EFe89cBB6d8C5',
    UniswapV4Quoter: '0x4f8D0Ce172D0558b76e3bDC0B5Cc9E84f3f12193',
    UniswapV4StateView: '0xd0A10A7Ed3f63E3C61a6f1B8fa0341Cf3AE44E0b',
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

