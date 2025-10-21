/**
 * DCA Router Contract ABI
 * TypeScript Definition
 * Handles Dollar Cost Averaging with optimal multi-hop routing
 */

export const DCARouterABI = [
    {
      inputs: [
        {
          internalType: "contract IPoolManager",
          name: "_poolManager",
          type: "address",
        },
        {
          internalType: "address",
          name: "_storage",
          type: "address",
        },
        {
          internalType: "address",
          name: "_quoter",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "target",
          type: "address",
        },
      ],
      name: "AddressEmptyCode",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "AddressInsufficientBalance",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "Currency",
          name: "currency",
          type: "address",
        },
      ],
      name: "DeltaNotNegative",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "Currency",
          name: "currency",
          type: "address",
        },
      ],
      name: "DeltaNotPositive",
      type: "error",
    },
    {
      inputs: [],
      name: "FailedInnerCall",
      type: "error",
    },
    {
      inputs: [],
      name: "InputLengthMismatch",
      type: "error",
    },
    {
      inputs: [],
      name: "InsufficientBalance",
      type: "error",
    },
    {
      inputs: [],
      name: "InvalidBips",
      type: "error",
    },
    {
      inputs: [],
      name: "NotPoolManager",
      type: "error",
    },
    {
      inputs: [],
      name: "ReentrancyGuardReentrantCall",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "token",
          type: "address",
        },
      ],
      name: "SafeERC20FailedOperation",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "action",
          type: "uint256",
        },
      ],
      name: "UnsupportedAction",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "minAmountOutReceived",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "amountReceived",
          type: "uint256",
        },
      ],
      name: "V4TooLittleReceived",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "maxAmountInRequested",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "amountRequested",
          type: "uint256",
        },
      ],
      name: "V4TooMuchRequested",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "batchId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "successfulExecutions",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "totalExecutions",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "totalGasUsed",
          type: "uint256",
        },
      ],
      name: "BatchDCAExecuted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "fromToken",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "toToken",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amountIn",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amountOut",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "hops",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "gasUsed",
          type: "uint256",
        },
      ],
      name: "MultiHopDCAExecuted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "fromToken",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "toToken",
          type: "address",
        },
        {
          components: [
            {
              internalType: "Currency",
              name: "intermediateCurrency",
              type: "address",
            },
            {
              internalType: "uint24",
              name: "fee",
              type: "uint24",
            },
            {
              internalType: "int24",
              name: "tickSpacing",
              type: "int24",
            },
            {
              internalType: "contract IHooks",
              name: "hooks",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "hookData",
              type: "bytes",
            },
          ],
          indexed: false,
          internalType: "struct PathKey[]",
          name: "path",
          type: "tuple[]",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "expectedOutput",
          type: "uint256",
        },
      ],
      name: "OptimalPathFound",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "fromToken",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "toToken",
          type: "address",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "pairKey",
          type: "bytes32",
        },
      ],
      name: "PathCacheCleared",
      type: "event",
    },
    {
      inputs: [],
      name: "DCA_GAS_LIMIT",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "MAX_DCA_SLIPPAGE",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "MAX_HOPS",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "MIN_PATH_IMPROVEMENT",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "PATH_CACHE_VALIDITY",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              internalType: "address",
              name: "fromToken",
              type: "address",
            },
            {
              internalType: "address",
              name: "toToken",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "minAmountOut",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "maxHops",
              type: "uint256",
            },
          ],
          internalType: "struct SpendSaveDCARouter.DCAOrder",
          name: "order",
          type: "tuple",
        },
      ],
      name: "_executeSingleDCA",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "batchCounter",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              internalType: "address",
              name: "fromToken",
              type: "address",
            },
            {
              internalType: "address",
              name: "toToken",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "minAmountOut",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "maxHops",
              type: "uint256",
            },
          ],
          internalType: "struct SpendSaveDCARouter.DCAOrder[]",
          name: "dcaOrders",
          type: "tuple[]",
        },
        {
          internalType: "uint256",
          name: "deadline",
          type: "uint256",
        },
      ],
      name: "batchExecuteDCA",
      outputs: [
        {
          internalType: "uint256",
          name: "successCount",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "fromToken",
          type: "address",
        },
        {
          internalType: "address",
          name: "toToken",
          type: "address",
        },
      ],
      name: "clearCachedPath",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "fromToken",
          type: "address",
        },
        {
          internalType: "address",
          name: "toToken",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "maxHops",
          type: "uint256",
        },
      ],
      name: "discoverOptimalPath",
      outputs: [
        {
          components: [
            {
              internalType: "Currency",
              name: "intermediateCurrency",
              type: "address",
            },
            {
              internalType: "uint24",
              name: "fee",
              type: "uint24",
            },
            {
              internalType: "int24",
              name: "tickSpacing",
              type: "int24",
            },
            {
              internalType: "contract IHooks",
              name: "hooks",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "hookData",
              type: "bytes",
            },
          ],
          internalType: "struct PathKey[]",
          name: "path",
          type: "tuple[]",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          internalType: "address",
          name: "fromToken",
          type: "address",
        },
        {
          internalType: "address",
          name: "toToken",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "minAmountOut",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "maxHops",
          type: "uint256",
        },
      ],
      name: "executeDCAWithRouting",
      outputs: [
        {
          internalType: "uint256",
          name: "amountOut",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "fromToken",
          type: "address",
        },
        {
          internalType: "address",
          name: "toToken",
          type: "address",
        },
      ],
      name: "getCachedOptimalPath",
      outputs: [
        {
          components: [
            {
              internalType: "Currency",
              name: "intermediateCurrency",
              type: "address",
            },
            {
              internalType: "uint24",
              name: "fee",
              type: "uint24",
            },
            {
              internalType: "int24",
              name: "tickSpacing",
              type: "int24",
            },
            {
              internalType: "contract IHooks",
              name: "hooks",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "hookData",
              type: "bytes",
            },
          ],
          internalType: "struct PathKey[]",
          name: "path",
          type: "tuple[]",
        },
        {
          internalType: "bool",
          name: "isValid",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "msgSender",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "optimalPaths",
      outputs: [
        {
          internalType: "Currency",
          name: "intermediateCurrency",
          type: "address",
        },
        {
          internalType: "uint24",
          name: "fee",
          type: "uint24",
        },
        {
          internalType: "int24",
          name: "tickSpacing",
          type: "int24",
        },
        {
          internalType: "contract IHooks",
          name: "hooks",
          type: "address",
        },
        {
          internalType: "bytes",
          name: "hookData",
          type: "bytes",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      name: "pathDiscoveryTime",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "poolManager",
      outputs: [
        {
          internalType: "contract IPoolManager",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "fromToken",
          type: "address",
        },
        {
          internalType: "address",
          name: "toToken",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "maxHops",
          type: "uint256",
        },
      ],
      name: "previewDCAExecution",
      outputs: [
        {
          internalType: "uint256",
          name: "expectedOutput",
          type: "uint256",
        },
        {
          components: [
            {
              internalType: "Currency",
              name: "intermediateCurrency",
              type: "address",
            },
            {
              internalType: "uint24",
              name: "fee",
              type: "uint24",
            },
            {
              internalType: "int24",
              name: "tickSpacing",
              type: "int24",
            },
            {
              internalType: "contract IHooks",
              name: "hooks",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "hookData",
              type: "bytes",
            },
          ],
          internalType: "struct PathKey[]",
          name: "path",
          type: "tuple[]",
        },
        {
          internalType: "uint256",
          name: "gasEstimate",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "quoter",
      outputs: [
        {
          internalType: "contract V4Quoter",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "storage_",
      outputs: [
        {
          internalType: "contract SpendSaveStorage",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
      ],
      name: "unlockCallback",
      outputs: [
        {
          internalType: "bytes",
          name: "",
          type: "bytes",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
  ] as const;
  
  // Type definitions for structs
  
  export interface DCAOrder {
    user: string;
    fromToken: string;
    toToken: string;
    amount: bigint;
    minAmountOut: bigint;
    maxHops: bigint;
  }
  
  export interface PathKey {
    intermediateCurrency: string;
    fee: number;
    tickSpacing: number;
    hooks: string;
    hookData: string;
  }
  
  export interface CachedPath {
    path: PathKey[];
    isValid: boolean;
  }
  
  export interface DCAPreview {
    expectedOutput: bigint;
    path: PathKey[];
    gasEstimate: bigint;
  }
  
  export interface BatchExecutionResult {
    successCount: bigint;
    batchId: bigint;
  }
  
  // Helper types
  export type SwapPath = PathKey[];
  export type Address = `0x${string}`;
  
  // Constants type helper
  export interface DCAConstants {
    DCA_GAS_LIMIT: bigint;
    MAX_DCA_SLIPPAGE: bigint;
    MAX_HOPS: bigint;
    MIN_PATH_IMPROVEMENT: bigint;
    PATH_CACHE_VALIDITY: bigint;
  }
  
  // Example usage with ethers.js v6:
  // import { ethers } from 'ethers';
  // import { DCARouterABI, DCAOrder, PathKey } from './dca-router-abi';
  //
  // const contract = new ethers.Contract(address, DCARouterABI, signer);
  //
  // // Preview a DCA execution before running it
  // const [expectedOutput, path, gasEstimate] = await contract.previewDCAExecution(
  //   usdcAddress,
  //   wethAddress,
  //   ethers.parseUnits("1000", 6), // 1000 USDC
  //   3 // max 3 hops
  // );
  //
  // console.log('Expected output:', ethers.formatEther(expectedOutput), 'WETH');
  // console.log('Path has', path.length, 'hops');
  // console.log('Estimated gas:', gasEstimate.toString());
  //
  // // Check if there's a cached optimal path
  // const [cachedPath, isValid] = await contract.getCachedOptimalPath(
  //   usdcAddress,
  //   wethAddress
  // );
  //
  // if (isValid) {
  //   console.log('Using cached path with', cachedPath.length, 'hops');
  // } else {
  //   console.log('Need to discover new path');
  // }
  //
  // // Execute a single DCA with routing
  // const minAmountOut = expectedOutput * 98n / 100n; // 2% slippage
  // const amountOut = await contract.executeDCAWithRouting(
  //   userAddress,
  //   usdcAddress,
  //   wethAddress,
  //   ethers.parseUnits("1000", 6),
  //   minAmountOut,
  //   3 // max hops
  // );
  //
  // console.log('Received:', ethers.formatEther(amountOut), 'WETH');
  //
  // // Batch execute multiple DCA orders
  // const orders: DCAOrder[] = [
  //   {
  //     user: user1Address,
  //     fromToken: usdcAddress,
  //     toToken: wethAddress,
  //     amount: ethers.parseUnits("1000", 6),
  //     minAmountOut: ethers.parseEther("0.5"),
  //     maxHops: 3n,
  //   },
  //   {
  //     user: user2Address,
  //     fromToken: daiAddress,
  //     toToken: wethAddress,
  //     amount: ethers.parseEther("1000"),
  //     minAmountOut: ethers.parseEther("0.5"),
  //     maxHops: 2n,
  //   },
  // ];
  //
  // const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour
  // const successCount = await contract.batchExecuteDCA(orders, deadline);
  // console.log(`Successfully executed ${successCount} of ${orders.length} orders`);
  //
  // // Discover optimal path manually (for analysis)
  // const optimalPath = await contract.discoverOptimalPath(
  //   usdcAddress,
  //   wethAddress,
  //   ethers.parseUnits("1000", 6),
  //   3
  // );
  //
  // console.log('Optimal path found:');
  // optimalPath.forEach((pathKey, i) => {
  //   console.log(`Hop ${i + 1}:`, pathKey.intermediateCurrency);
  //   console.log('  Fee tier:', pathKey.fee);
  //   console.log('  Tick spacing:', pathKey.tickSpacing);
  // });
  //
  // // Clear cached path if needed (e.g., after major price changes)
  // await contract.clearCachedPath(usdcAddress, wethAddress);
  //
  // // Get DCA constants
  // const dcaGasLimit = await contract.DCA_GAS_LIMIT();
  // const maxSlippage = await contract.MAX_DCA_SLIPPAGE();
  // const maxHops = await contract.MAX_HOPS();
  // const minImprovement = await contract.MIN_PATH_IMPROVEMENT();
  // const cacheValidity = await contract.PATH_CACHE_VALIDITY();
  //
  // console.log('DCA Configuration:');
  // console.log('  Gas limit:', dcaGasLimit.toString());
  // console.log('  Max slippage:', maxSlippage.toString(), 'bps');
  // console.log('  Max hops:', maxHops.toString());
  // console.log('  Min path improvement:', minImprovement.toString(), 'bps');
  // console.log('  Cache validity:', cacheValidity.toString(), 'seconds');
  
  // With viem:
  // import { getContract } from 'viem';
  // import { DCARouterABI } from './dca-router-abi';
  //
  // const contract = getContract({
  //   address: dcaRouterAddress,
  //   abi: DCARouterABI,
  //   client: publicClient,
  // });
  //
  // // Preview execution
  // const preview = await contract.read.previewDCAExecution([
  //   fromToken,
  //   toToken,
  //   amount,
  //   maxHops,
  // ]);
  //
  // // Execute with write
  // const hash = await contract.write.executeDCAWithRouting([
  //   userAddress,
  //   fromToken,
  //   toToken,
  //   amount,
  //   minAmountOut,
  //   maxHops,
  // ]);