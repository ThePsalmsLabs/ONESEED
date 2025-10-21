/**
 * Token Module Contract ABI
 * TypeScript Definition
 * Implements ERC-6909 multi-token standard for savings tokenization
 */

export const TokenModuleABI = [
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
    name: "ERC6909ReceiverRejected",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "requested",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "available",
        type: "uint256",
      },
    ],
    name: "InsufficientAllowance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "requested",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "available",
        type: "uint256",
      },
    ],
    name: "InsufficientBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidBatchLength",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidTokenAddress",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "NonERC6909ReceiverImplementer",
    type: "error",
  },
  {
    inputs: [],
    name: "NonERC6909ReceiverImplementerNoReason",
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
    name: "TokenNotRegistered",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferFromZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferToZeroAddress",
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
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Approval",
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
        name: "count",
        type: "uint256",
      },
    ],
    name: "BatchOperationCompleted",
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
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "OperatorSet",
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
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "SavingsTokenBurned",
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
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "SavingsTokenMinted",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokenBurned",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokenMinted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "TokenRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Transfer",
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
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TreasuryFeeCollected",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "allowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "balanceOf",
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
        internalType: "uint256[]",
        name: "tokenIds",
        type: "uint256[]",
      },
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "balances",
        type: "uint256[]",
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
        internalType: "uint256[]",
        name: "tokenIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    name: "batchBurnSavingsTokens",
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
        internalType: "uint256[]",
        name: "tokenIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    name: "batchMintSavingsTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
    ],
    name: "batchRegisterTokens",
    outputs: [
      {
        internalType: "uint256[]",
        name: "tokenIds",
        type: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "tokenIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    name: "batchTransfer",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burnSavingsToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "getTokenAddress",
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
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "getTokenId",
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
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isOperator",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "isTokenRegistered",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mintSavingsToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "registerToken",
    outputs: [
      {
        internalType: "uint256",
        name: "",
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
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransfer",
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
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
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
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setOperator",
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
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "totalSupply",
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
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
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
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
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
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
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
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// Type definitions for ERC-6909 multi-token standard

export interface TokenInfo {
  tokenId: bigint;
  tokenAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
}

export interface TokenBalance {
  tokenId: bigint;
  balance: bigint;
}

export interface BatchTransferParams {
  from: string;
  to: string;
  tokenIds: bigint[];
  amounts: bigint[];
}

export interface BatchMintParams {
  user: string;
  tokenIds: bigint[];
  amounts: bigint[];
}

export interface BatchBurnParams {
  user: string;
  tokenIds: bigint[];
  amounts: bigint[];
}

// Helper types
export type Address = `0x${string}`;
export type TokenId = bigint;

// ERC-6909 Interface IDs
export const ERC6909_INTERFACE_ID = "0x0f632fb3" as const;

// Example usage with ethers.js v6:
// import { ethers } from 'ethers';
// import { TokenModuleABI, TokenInfo } from './token-module-abi';
//
// const contract = new ethers.Contract(address, TokenModuleABI, signer);
//
// // Register a new token
// const tokenId = await contract.registerToken(usdcAddress);
// console.log('USDC registered with tokenId:', tokenId.toString());
//
// // Register multiple tokens at once
// const tokenAddresses = [usdcAddress, daiAddress, wethAddress];
// const tokenIds = await contract.batchRegisterTokens(tokenAddresses);
// console.log('Registered tokens with IDs:', tokenIds.map(id => id.toString()));
//
// // Get token ID for an address
// const usdcTokenId = await contract.getTokenId(usdcAddress);
// console.log('USDC token ID:', usdcTokenId.toString());
//
// // Get token address from ID
// const tokenAddress = await contract.getTokenAddress(usdcTokenId);
// console.log('Token address:', tokenAddress);
//
// // Check if token is registered
// const isRegistered = await contract.isTokenRegistered(usdcAddress);
// console.log('Is USDC registered?', isRegistered);
//
// // Get token metadata
// const name = await contract.name(tokenId);
// const symbol = await contract.symbol(tokenId);
// const decimals = await contract.decimals(tokenId);
// const totalSupply = await contract.totalSupply(tokenId);
//
// console.log('Token Info:');
// console.log('  Name:', name);
// console.log('  Symbol:', symbol);
// console.log('  Decimals:', decimals);
// console.log('  Total Supply:', ethers.formatUnits(totalSupply, decimals));
//
// // Mint savings tokens (typically called by SavingsModule)
// await contract.mintSavingsToken(
//   userAddress,
//   tokenId,
//   ethers.parseUnits("100", decimals)
// );
//
// // Batch mint savings tokens
// const mintParams: BatchMintParams = {
//   user: userAddress,
//   tokenIds: [tokenId1, tokenId2, tokenId3],
//   amounts: [
//     ethers.parseUnits("100", 6),
//     ethers.parseEther("50"),
//     ethers.parseEther("1"),
//   ],
// };
// await contract.batchMintSavingsTokens(
//   mintParams.user,
//   mintParams.tokenIds,
//   mintParams.amounts
// );
//
// // Check balance
// const balance = await contract.balanceOf(userAddress, tokenId);
// console.log('User balance:', ethers.formatUnits(balance, decimals));
//
// // Check multiple balances at once
// const tokenIdsToCheck = [tokenId1, tokenId2, tokenId3];
// const balances = await contract.balanceOfBatch(userAddress, tokenIdsToCheck);
// balances.forEach((bal, i) => {
//   console.log(`Token ${tokenIdsToCheck[i]}: ${ethers.formatUnits(bal, 18)}`);
// });
//
// // Approve spending
// await contract.approve(
//   spenderAddress,
//   tokenId,
//   ethers.parseUnits("50", decimals)
// );
//
// // Check allowance
// const allowance = await contract.allowance(
//   userAddress,
//   spenderAddress,
//   tokenId
// );
// console.log('Allowance:', ethers.formatUnits(allowance, decimals));
//
// // Set operator (approve all tokens)
// await contract.setOperator(operatorAddress, true);
//
// // Check operator status
// const isOperator = await contract.isOperator(userAddress, operatorAddress);
// console.log('Is operator?', isOperator);
//
// // Transfer tokens
// await contract.transfer(recipientAddress, tokenId, amount);
//
// // Transfer from (with allowance)
// await contract.transferFrom(
//   fromAddress,
//   toAddress,
//   tokenId,
//   amount
// );
//
// // Safe transfer with callback data
// await contract.safeTransfer(
//   senderAddress,
//   receiverAddress,
//   tokenId,
//   amount,
//   ethers.toUtf8Bytes("callback data")
// );
//
// // Batch transfer multiple tokens
// const batchParams: BatchTransferParams = {
//   from: userAddress,
//   to: recipientAddress,
//   tokenIds: [tokenId1, tokenId2],
//   amounts: [amount1, amount2],
// };
// await contract.batchTransfer(
//   batchParams.from,
//   batchParams.to,
//   batchParams.tokenIds,
//   batchParams.amounts
// );
//
// // Burn savings tokens (typically called by SavingsModule)
// await contract.burnSavingsToken(userAddress, tokenId, burnAmount);
//
// // Batch burn
// const burnParams: BatchBurnParams = {
//   user: userAddress,
//   tokenIds: [tokenId1, tokenId2],
//   amounts: [burn1, burn2],
// };
// await contract.batchBurnSavingsTokens(
//   burnParams.user,
//   burnParams.tokenIds,
//   burnParams.amounts
// );
//
// // Check interface support (ERC-6909)
// const supportsERC6909 = await contract.supportsInterface(ERC6909_INTERFACE_ID);
// console.log('Supports ERC-6909?', supportsERC6909);

// With viem:
// import { getContract, parseUnits } from 'viem';
// import { TokenModuleABI } from './token-module-abi';
//
// const contract = getContract({
//   address: tokenModuleAddress,
//   abi: TokenModuleABI,
//   client: publicClient,
// });
//
// // Register token
// const hash = await contract.write.registerToken([tokenAddress]);
// const receipt = await publicClient.waitForTransactionReceipt({ hash });
//
// // Get token ID
// const tokenId = await contract.read.getTokenId([tokenAddress]);
//
// // Check balance
// const balance = await contract.read.balanceOf([userAddress, tokenId]);
//
// // Transfer
// await contract.write.transfer([recipientAddress, tokenId, amount]);
//
// // Listen to transfer events
// const unwatch = contract.watchEvent.Transfer(
//   { sender: userAddress },
//   {
//     onLogs: (logs) => {
//       logs.forEach((log) => {
//         console.log('Transfer:', {
//           from: log.args.sender,
//           to: log.args.receiver,
//           tokenId: log.args.id,
//           amount: log.args.amount,
//         });
//       });
//     },
//   }
// );