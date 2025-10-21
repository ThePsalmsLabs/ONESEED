/**
 * Slippage Control Module Contract ABI
 * TypeScript Definition
 * Manages slippage tolerance and protection for swaps
 */

export const SlippageControlABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AlreadyInitialized",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyTreasury",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyUserOrHook",
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
        internalType: "uint256",
        name: "received",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expected",
        type: "uint256",
      },
    ],
    name: "SlippageToleranceExceeded",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "provided",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "max",
        type: "uint256",
      },
    ],
    name: "SlippageToleranceTooHigh",
    type: "error",
  },
  {
    inputs: [],
    name: "Unauthorized",
    type: "error",
  },
  {
    inputs: [],
    name: "UnauthorizedCaller",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "basisPoints",
        type: "uint256",
      },
    ],
    name: "DefaultSlippageToleranceSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "storage_",
        type: "address",
      },
    ],
    name: "ModuleInitialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "ModuleReferencesSet",
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
        indexed: false,
        internalType: "enum SpendSaveStorage.SlippageAction",
        name: "action",
        type: "uint8",
      },
    ],
    name: "SlippageActionSet",
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
        name: "fromAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "actualToAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "expectedMinimum",
        type: "uint256",
      },
    ],
    name: "SlippageExceeded",
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
        indexed: false,
        internalType: "uint256",
        name: "basisPoints",
        type: "uint256",
      },
    ],
    name: "SlippageToleranceSet",
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
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "basisPoints",
        type: "uint256",
      },
    ],
    name: "TokenSlippageToleranceSet",
    type: "event",
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
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "customSlippageTolerance",
        type: "uint256",
      },
    ],
    name: "getMinimumAmountOut",
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
        name: "fromAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "receivedAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expectedMinimum",
        type: "uint256",
      },
    ],
    name: "handleSlippageExceeded",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract SpendSaveStorage",
        name: "_storage",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "basisPoints",
        type: "uint256",
      },
    ],
    name: "setDefaultSlippageTolerance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "savingStrategy",
        type: "address",
      },
      {
        internalType: "address",
        name: "savings",
        type: "address",
      },
      {
        internalType: "address",
        name: "dca",
        type: "address",
      },
      {
        internalType: "address",
        name: "slippage",
        type: "address",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "dailySavings",
        type: "address",
      },
    ],
    name: "setModuleReferences",
    outputs: [],
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
        internalType: "enum SpendSaveStorage.SlippageAction",
        name: "action",
        type: "uint8",
      },
    ],
    name: "setSlippageAction",
    outputs: [],
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
        internalType: "uint256",
        name: "basisPoints",
        type: "uint256",
      },
    ],
    name: "setSlippageTolerance",
    outputs: [],
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
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "basisPoints",
        type: "uint256",
      },
    ],
    name: "setTokenSlippageTolerance",
    outputs: [],
    stateMutability: "nonpayable",
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
] as const;

// Enum for SlippageAction (from SpendSaveStorage)
export enum SlippageAction {
  REVERT = 0,
  SKIP_SWAP = 1,
  CONTINUE_ANYWAY = 2,
  RETRY_WITH_HIGHER_TOLERANCE = 3,
}

// Type definitions

export interface SlippageConfig {
  tolerance: number; // basis points (100 = 1%)
  action: SlippageAction;
}

export interface TokenSlippageConfig {
  user: string;
  token: string;
  tolerance: number; // basis points
}

export interface SlippageExceededEvent {
  user: string;
  fromToken: string;
  toToken: string;
  fromAmount: bigint;
  actualToAmount: bigint;
  expectedMinimum: bigint;
  slippagePercent: number;
}

export interface MinimumAmountOutParams {
  user: string;
  fromToken: string;
  toToken: string;
  amountIn: bigint;
  customSlippageTolerance?: number; // optional override
}

// Helper types
export type Address = `0x${string}`;
export type BasisPoints = number; // 1 basis point = 0.01%

// Common slippage tolerances in basis points
export const SLIPPAGE_PRESETS = {
  VERY_LOW: 10, // 0.1%
  LOW: 50, // 0.5%
  MEDIUM: 100, // 1%
  HIGH: 300, // 3%
  VERY_HIGH: 500, // 5%
} as const;

// Helper functions for basis points conversion
export const bpsToPercent = (bps: number): number => bps / 100;
export const percentToBps = (percent: number): number => Math.round(percent * 100);

// Calculate slippage percentage from amounts
export const calculateSlippage = (
  expected: bigint,
  actual: bigint
): number => {
  if (expected === BigInt(0)) return 0;
  const diff = expected - actual;
  return Number((diff * BigInt(10000)) / expected) / 100; // returns percentage
};

// Example usage with ethers.js v6:
// import { ethers } from 'ethers';
// import {
//   SlippageControlABI,
//   SlippageAction,
//   SLIPPAGE_PRESETS,
//   bpsToPercent,
//   percentToBps,
// } from './slippage-control-abi';
//
// const contract = new ethers.Contract(address, SlippageControlABI, signer);
//
// // Set default slippage tolerance (1%)
// await contract.setDefaultSlippageTolerance(SLIPPAGE_PRESETS.MEDIUM);
// console.log('Default slippage set to:', bpsToPercent(SLIPPAGE_PRESETS.MEDIUM), '%');
//
// // Set user-specific slippage tolerance
// await contract.setSlippageTolerance(
//   userAddress,
//   SLIPPAGE_PRESETS.LOW // 0.5%
// );
//
// // Set token-specific slippage tolerance
// // E.g., volatile tokens might need higher tolerance
// await contract.setTokenSlippageTolerance(
//   userAddress,
//   volatileTokenAddress,
//   SLIPPAGE_PRESETS.HIGH // 3%
// );
//
// // Set slippage action - what to do when slippage is exceeded
// await contract.setSlippageAction(
//   userAddress,
//   SlippageAction.SKIP_SWAP // Skip the swap if slippage is too high
// );
//
// // Different action options:
// // REVERT: Revert the entire transaction (default, most conservative)
// // SKIP_SWAP: Skip just the swap, continue with transaction
// // CONTINUE_ANYWAY: Proceed with swap despite high slippage
// // RETRY_WITH_HIGHER_TOLERANCE: Automatically retry with higher tolerance
//
// // Get minimum amount out for a swap
// const minAmountOut = await contract.getMinimumAmountOut(
//   userAddress,
//   usdcAddress,
//   wethAddress,
//   ethers.parseUnits("1000", 6), // 1000 USDC
//   0 // use default/configured tolerance
// );
//
// console.log('Minimum amount out:', ethers.formatEther(minAmountOut), 'WETH');
//
// // Use custom slippage tolerance for a specific swap
// const customMinAmount = await contract.getMinimumAmountOut(
//   userAddress,
//   usdcAddress,
//   wethAddress,
//   ethers.parseUnits("1000", 6),
//   SLIPPAGE_PRESETS.VERY_HIGH // 5% for this specific swap
// );
//
// // Handle slippage exceeded (typically called by the hook)
// const shouldContinue = await contract.handleSlippageExceeded(
//   userAddress,
//   usdcAddress,
//   wethAddress,
//   ethers.parseUnits("1000", 6), // input amount
//   ethers.parseEther("0.48"), // received amount
//   ethers.parseEther("0.50") // expected minimum
// );
//
// if (shouldContinue) {
//   console.log('Swap will continue despite slippage');
// } else {
//   console.log('Swap was skipped/reverted due to slippage');
// }
//
// // Listen to slippage exceeded events
// contract.on(
//   'SlippageExceeded',
//   (user, fromToken, toToken, fromAmount, actualToAmount, expectedMinimum) => {
//     const slippage = calculateSlippage(expectedMinimum, actualToAmount);
//     console.log(`⚠️ Slippage exceeded for ${user}`);
//     console.log(`  From: ${fromAmount} of ${fromToken}`);
//     console.log(`  Expected: ${expectedMinimum} of ${toToken}`);
//     console.log(`  Received: ${actualToAmount} of ${toToken}`);
//     console.log(`  Slippage: ${slippage.toFixed(2)}%`);
//   }
// );
//
// // Monitor slippage tolerance changes
// contract.on('SlippageToleranceSet', (user, basisPoints) => {
//   console.log(
//     `User ${user} set slippage tolerance to ${bpsToPercent(basisPoints)}%`
//   );
// });
//
// contract.on('TokenSlippageToleranceSet', (user, token, basisPoints) => {
//   console.log(
//     `User ${user} set ${token} slippage to ${bpsToPercent(basisPoints)}%`
//   );
// });
//
// contract.on('SlippageActionSet', (user, action) => {
//   const actionNames = ['REVERT', 'SKIP_SWAP', 'CONTINUE_ANYWAY', 'RETRY'];
//   console.log(`User ${user} set slippage action to ${actionNames[action]}`);
// });

// Advanced usage - Calculate expected vs actual slippage
// import { calculateSlippage } from './slippage-control-abi';
//
// const expectedOutput = ethers.parseEther("1.0");
// const actualOutput = ethers.parseEther("0.98");
// const slippagePercent = calculateSlippage(expectedOutput, actualOutput);
// console.log(`Actual slippage: ${slippagePercent.toFixed(2)}%`); // 2.00%
//
// // Check if slippage is within tolerance
// const toleranceBps = SLIPPAGE_PRESETS.MEDIUM; // 1% = 100 bps
// const tolerancePercent = bpsToPercent(toleranceBps);
//
// if (slippagePercent > tolerancePercent) {
//   console.log('⚠️ Slippage exceeded tolerance!');
// } else {
//   console.log('✅ Slippage within acceptable range');
// }

// With viem:
// import { getContract } from 'viem';
// import { SlippageControlABI, SlippageAction, SLIPPAGE_PRESETS } from './slippage-control-abi';
//
// const contract = getContract({
//   address: slippageControlAddress,
//   abi: SlippageControlABI,
//   client: publicClient,
// });
//
// // Set slippage tolerance
// const hash = await contract.write.setSlippageTolerance([
//   userAddress,
//   SLIPPAGE_PRESETS.MEDIUM,
// ]);
//
// // Get minimum amount out
// const minAmount = await contract.read.getMinimumAmountOut([
//   userAddress,
//   fromToken,
//   toToken,
//   amountIn,
//   0n, // use configured tolerance
// ]);
//
// // Watch for slippage exceeded events
// const unwatch = contract.watchEvent.SlippageExceeded(
//   { user: userAddress },
//   {
//     onLogs: (logs) => {
//       logs.forEach((log) => {
//         console.log('Slippage exceeded:', {
//           from: log.args.fromToken,
//           to: log.args.toToken,
//           expected: log.args.expectedMinimum,
//           actual: log.args.actualToAmount,
//         });
//       });
//     },
//   }
// );

// UI Helper: Get user-friendly slippage action description
export const getSlippageActionDescription = (action: SlippageAction): string => {
  const descriptions: Record<SlippageAction, string> = {
    [SlippageAction.REVERT]: "Revert transaction if slippage is exceeded",
    [SlippageAction.SKIP_SWAP]: "Skip swap but continue transaction",
    [SlippageAction.CONTINUE_ANYWAY]: "Continue swap regardless of slippage",
    [SlippageAction.RETRY_WITH_HIGHER_TOLERANCE]: "Retry with higher tolerance",
  };
  return descriptions[action];
};