/**
 * Uniswap V4 PoolManager ABI
 * Minimal interface for swap operations
 * Full ABI: https://github.com/Uniswap/v4-core/blob/main/src/PoolManager.sol
 */

export const UniswapV4PoolManagerABI = [
  {
    inputs: [
      {
        components: [
          { internalType: 'Currency', name: 'currency0', type: 'address' },
          { internalType: 'Currency', name: 'currency1', type: 'address' },
          { internalType: 'uint24', name: 'fee', type: 'uint24' },
          { internalType: 'int24', name: 'tickSpacing', type: 'int24' },
          { internalType: 'contract IHooks', name: 'hooks', type: 'address' },
        ],
        internalType: 'struct PoolKey',
        name: 'key',
        type: 'tuple',
      },
      {
        components: [
          { internalType: 'bool', name: 'zeroForOne', type: 'bool' },
          { internalType: 'int256', name: 'amountSpecified', type: 'int256' },
          { internalType: 'uint160', name: 'sqrtPriceLimitX96', type: 'uint160' },
        ],
        internalType: 'struct IPoolManager.SwapParams',
        name: 'params',
        type: 'tuple',
      },
      { internalType: 'bytes', name: 'hookData', type: 'bytes' },
    ],
    name: 'swap',
    outputs: [
      {
        components: [
          { internalType: 'int128', name: 'amount0', type: 'int128' },
          { internalType: 'int128', name: 'amount1', type: 'int128' },
        ],
        internalType: 'struct BalanceDelta',
        name: 'delta',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'Currency', name: 'currency0', type: 'address' },
          { internalType: 'Currency', name: 'currency1', type: 'address' },
          { internalType: 'uint24', name: 'fee', type: 'uint24' },
          { internalType: 'int24', name: 'tickSpacing', type: 'int24' },
          { internalType: 'contract IHooks', name: 'hooks', type: 'address' },
        ],
        internalType: 'struct PoolKey',
        name: 'key',
        type: 'tuple',
      },
      { internalType: 'uint160', name: 'sqrtPriceX96', type: 'uint160' },
    ],
    name: 'initialize',
    outputs: [{ internalType: 'int24', name: 'tick', type: 'int24' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
    name: 'unlock',
    outputs: [{ internalType: 'bytes', name: 'result', type: 'bytes' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

