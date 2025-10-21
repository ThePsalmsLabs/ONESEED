/**
 * SpendSave Multicall Contract ABI
 * TypeScript Definition
 * Batch execution with gas refunds for DCA, liquidity, and savings operations
 */

export const SpendSaveMulticallABI = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_storage",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "ReentrancyGuardReentrantCall",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "executor",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "batchId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "successfulCalls",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "totalCalls",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "gasUsed",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "gasRefund",
          type: "uint256",
        },
      ],
      name: "BatchExecuted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "caller",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "reason",
          type: "string",
        },
      ],
      name: "EmergencyStop",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "recipient",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "GasRefund",
      type: "event",
    },
    {
      inputs: [],
      name: "GAS_REFUND_RATE",
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
      name: "MAX_BATCH_GAS",
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
      name: "MAX_BATCH_SIZE",
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
      name: "MIN_REFUND_BATCH_SIZE",
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
          name: "",
          type: "address",
        },
      ],
      name: "authorizedExecutors",
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
          internalType: "address[]",
          name: "users",
          type: "address[]",
        },
        {
          components: [
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
          ],
          internalType: "struct SpendSaveMulticall.DCABatchParams[]",
          name: "dcaParams",
          type: "tuple[]",
        },
      ],
      name: "batchExecuteDCA",
      outputs: [
        {
          internalType: "bytes[]",
          name: "results",
          type: "bytes[]",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "users",
          type: "address[]",
        },
        {
          components: [
            {
              internalType: "address",
              name: "token0",
              type: "address",
            },
            {
              internalType: "address",
              name: "token1",
              type: "address",
            },
            {
              internalType: "int24",
              name: "tickLower",
              type: "int24",
            },
            {
              internalType: "int24",
              name: "tickUpper",
              type: "int24",
            },
            {
              internalType: "uint256",
              name: "deadline",
              type: "uint256",
            },
            {
              internalType: "enum SpendSaveMulticall.LiquidityOperationType",
              name: "operationType",
              type: "uint8",
            },
          ],
          internalType: "struct SpendSaveMulticall.LiquidityBatchParams[]",
          name: "lpParams",
          type: "tuple[]",
        },
      ],
      name: "batchExecuteLiquidityOperations",
      outputs: [
        {
          internalType: "bytes[]",
          name: "results",
          type: "bytes[]",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "users",
          type: "address[]",
        },
        {
          components: [
            {
              internalType: "address",
              name: "token",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "enum SpendSaveMulticall.SavingsOperationType",
              name: "operationType",
              type: "uint8",
            },
          ],
          internalType: "struct SpendSaveMulticall.SavingsBatchParams[]",
          name: "savingsParams",
          type: "tuple[]",
        },
      ],
      name: "batchExecuteSavings",
      outputs: [
        {
          internalType: "bytes[]",
          name: "results",
          type: "bytes[]",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes[]",
          name: "calls",
          type: "bytes[]",
        },
        {
          internalType: "bool",
          name: "requireSuccess",
          type: "bool",
        },
      ],
      name: "batchExecuteWithRefund",
      outputs: [
        {
          internalType: "bytes[]",
          name: "results",
          type: "bytes[]",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "emergencyStop",
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
          internalType: "bytes[]",
          name: "calls",
          type: "bytes[]",
        },
      ],
      name: "estimateBatchGas",
      outputs: [
        {
          internalType: "uint256",
          name: "estimatedGas",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "fundGasRefundPool",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "gasRefundPool",
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
      name: "getGasRefundPoolBalance",
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
          name: "executor",
          type: "address",
        },
      ],
      name: "isAuthorizedExecutor",
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
          internalType: "bytes[]",
          name: "data",
          type: "bytes[]",
        },
      ],
      name: "multicall",
      outputs: [
        {
          internalType: "bytes[]",
          name: "results",
          type: "bytes[]",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "executor",
          type: "address",
        },
        {
          internalType: "bool",
          name: "authorized",
          type: "bool",
        },
      ],
      name: "setAuthorizedExecutor",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bool",
          name: "stop",
          type: "bool",
        },
        {
          internalType: "string",
          name: "reason",
          type: "string",
        },
      ],
      name: "setEmergencyStop",
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
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "withdrawFromGasRefundPool",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ] as const;
  
  // Enums for operation types
  
  export enum SavingsOperationType {
    DEPOSIT = 0,
    WITHDRAW = 1,
    PROCESS = 2,
  }
  
  export enum LiquidityOperationType {
    ADD = 0,
    REMOVE = 1,
    COLLECT_FEES = 2,
    REBALANCE = 3,
  }
  
  // Type definitions for batch operations
  
  export interface DCABatchParams {
    fromToken: string;
    toToken: string;
    amount: bigint;
    minAmountOut: bigint;
  }
  
  export interface LiquidityBatchParams {
    token0: string;
    token1: string;
    tickLower: number;
    tickUpper: number;
    deadline: bigint;
    operationType: LiquidityOperationType;
  }
  
  export interface SavingsBatchParams {
    token: string;
    amount: bigint;
    operationType: SavingsOperationType;
  }
  
  export interface BatchExecutionResult {
    results: string[]; // bytes[] returned as hex strings
    batchId: bigint;
    successfulCalls: number;
    totalCalls: number;
    gasUsed: bigint;
    gasRefund: bigint;
  }
  
  export interface GasEstimate {
    estimatedGas: bigint;
    refundAmount: bigint;
    poolBalance: bigint;
  }
  
  // Helper types
  export type Address = `0x${string}`;
  export type CallData = string; // hex encoded bytes
  
  // Multicall builder helper
  export interface MulticallConfig {
    requireSuccess?: boolean; // default: true
    maxGas?: bigint;
    gasRefund?: boolean; // default: false
  }
  
  // Example usage with ethers.js v6:
  // import { ethers } from 'ethers';
  // import {
  //   SpendSaveMulticallABI,
  //   DCABatchParams,
  //   LiquidityBatchParams,
  //   SavingsBatchParams,
  //   SavingsOperationType,
  //   LiquidityOperationType,
  // } from './multicall-abi';
  //
  // const contract = new ethers.Contract(address, SpendSaveMulticallABI, signer);
  //
  // // ===== BATCH DCA EXECUTION =====
  //
  // // Execute DCA for multiple users
  // const users = [user1Address, user2Address, user3Address];
  // const dcaParams: DCABatchParams[] = [
  //   {
  //     fromToken: usdcAddress,
  //     toToken: wethAddress,
  //     amount: ethers.parseUnits("1000", 6),
  //     minAmountOut: ethers.parseEther("0.5"),
  //   },
  //   {
  //     fromToken: daiAddress,
  //     toToken: wethAddress,
  //     amount: ethers.parseEther("1000"),
  //     minAmountOut: ethers.parseEther("0.5"),
  //   },
  //   {
  //     fromToken: usdcAddress,
  //     toToken: linkAddress,
  //     amount: ethers.parseUnits("500", 6),
  //     minAmountOut: ethers.parseUnits("30", 18),
  //   },
  // ];
  //
  // const dcaResults = await contract.batchExecuteDCA(users, dcaParams);
  // console.log(`Executed ${dcaResults.length} DCA operations`);
  //
  // // ===== BATCH LIQUIDITY OPERATIONS =====
  //
  // // Batch convert savings to LP positions
  // const lpUsers = [user1Address, user2Address];
  // const lpParams: LiquidityBatchParams[] = [
  //   {
  //     token0: usdcAddress,
  //     token1: wethAddress,
  //     tickLower: -887220, // full range
  //     tickUpper: 887220,
  //     deadline: BigInt(Math.floor(Date.now() / 1000) + 3600),
  //     operationType: LiquidityOperationType.ADD,
  //   },
  //   {
  //     token0: daiAddress,
  //     token1: wethAddress,
  //     tickLower: -443610, // concentrated
  //     tickUpper: 443610,
  //     deadline: BigInt(Math.floor(Date.now() / 1000) + 3600),
  //     operationType: LiquidityOperationType.ADD,
  //   },
  // ];
  //
  // const lpResults = await contract.batchExecuteLiquidityOperations(
  //   lpUsers,
  //   lpParams
  // );
  // console.log(`Executed ${lpResults.length} liquidity operations`);
  //
  // // ===== BATCH SAVINGS OPERATIONS =====
  //
  // // Batch process savings for multiple users/tokens
  // const savingsUsers = [user1Address, user1Address, user2Address];
  // const savingsParams: SavingsBatchParams[] = [
  //   {
  //     token: usdcAddress,
  //     amount: ethers.parseUnits("100", 6),
  //     operationType: SavingsOperationType.PROCESS,
  //   },
  //   {
  //     token: wethAddress,
  //     amount: ethers.parseEther("0.1"),
  //     operationType: SavingsOperationType.PROCESS,
  //   },
  //   {
  //     token: daiAddress,
  //     amount: ethers.parseEther("50"),
  //     operationType: SavingsOperationType.WITHDRAW,
  //   },
  // ];
  //
  // const savingsResults = await contract.batchExecuteSavings(
  //   savingsUsers,
  //   savingsParams
  // );
  // console.log(`Executed ${savingsResults.length} savings operations`);
  //
  // // ===== CUSTOM MULTICALL WITH GAS REFUND =====
  //
  // // Encode multiple contract calls
  // const anotherContract = new ethers.Contract(otherAddress, otherABI, signer);
  // const calls = [
  //   anotherContract.interface.encodeFunctionData("function1", [arg1, arg2]),
  //   anotherContract.interface.encodeFunctionData("function2", [arg3]),
  //   anotherContract.interface.encodeFunctionData("function3", [arg4, arg5]),
  // ];
  //
  // // Estimate gas first
  // const estimatedGas = await contract.estimateBatchGas(calls);
  // console.log('Estimated gas:', estimatedGas.toString());
  //
  // // Execute with gas refund
  // const results = await contract.batchExecuteWithRefund(
  //   calls,
  //   false // don't require all calls to succeed
  // );
  //
  // console.log(`Executed ${results.length} calls`);
  //
  // // ===== GAS REFUND POOL MANAGEMENT =====
  //
  // // Check gas refund pool balance
  // const poolBalance = await contract.getGasRefundPoolBalance();
  // console.log('Gas refund pool:', ethers.formatEther(poolBalance), 'ETH');
  //
  // // Fund the gas refund pool
  // await contract.fundGasRefundPool({ value: ethers.parseEther("1") });
  // console.log('Added 1 ETH to gas refund pool');
  //
  // // Get refund rate
  // const refundRate = await contract.GAS_REFUND_RATE();
  // console.log('Refund rate:', refundRate.toString(), 'basis points');
  //
  // // Get batch limits
  // const maxBatchSize = await contract.MAX_BATCH_SIZE();
  // const maxBatchGas = await contract.MAX_BATCH_GAS();
  // const minRefundSize = await contract.MIN_REFUND_BATCH_SIZE();
  //
  // console.log('Batch configuration:');
  // console.log('  Max batch size:', maxBatchSize.toString());
  // console.log('  Max batch gas:', maxBatchGas.toString());
  // console.log('  Min refund batch size:', minRefundSize.toString());
  //
  // // Withdraw from gas refund pool (admin only)
  // await contract.withdrawFromGasRefundPool(ethers.parseEther("0.5"));
  //
  // // ===== EXECUTOR AUTHORIZATION =====
  //
  // // Authorize an executor
  // await contract.setAuthorizedExecutor(executorAddress, true);
  // console.log('Executor authorized');
  //
  // // Check if executor is authorized
  // const isAuthorized = await contract.isAuthorizedExecutor(executorAddress);
  // console.log('Is authorized?', isAuthorized);
  //
  // // Revoke authorization
  // await contract.setAuthorizedExecutor(executorAddress, false);
  //
  // // ===== EMERGENCY CONTROLS =====
  //
  // // Check emergency stop status
  // const isStopped = await contract.emergencyStop();
  // console.log('Emergency stop active?', isStopped);
  //
  // // Activate emergency stop
  // await contract.setEmergencyStop(true, "Critical vulnerability detected");
  //
  // // Deactivate emergency stop
  // await contract.setEmergencyStop(false, "Issue resolved");
  //
  // // ===== EVENT MONITORING =====
  //
  // // Listen to batch execution events
  // contract.on(
  //   'BatchExecuted',
  //   (executor, batchId, successfulCalls, totalCalls, gasUsed, gasRefund) => {
  //     console.log(`Batch ${batchId} executed by ${executor}`);
  //     console.log(`  Success: ${successfulCalls}/${totalCalls}`);
  //     console.log(`  Gas used: ${gasUsed.toString()}`);
  //     console.log(`  Gas refund: ${ethers.formatEther(gasRefund)} ETH`);
  //   }
  // );
  //
  // // Listen to gas refunds
  // contract.on('GasRefund', (recipient, amount) => {
  //   console.log(
  //     `Gas refund: ${ethers.formatEther(amount)} ETH to ${recipient}`
  //   );
  // });
  //
  // // Listen to emergency stops
  // contract.on('EmergencyStop', (caller, reason) => {
  //   console.log(`⚠️ Emergency stop by ${caller}: ${reason}`);
  // });
  
  // With viem:
  // import { getContract, encodeFunctionData } from 'viem';
  // import {
  //   SpendSaveMulticallABI,
  //   DCABatchParams,
  //   SavingsOperationType,
  // } from './multicall-abi';
  //
  // const contract = getContract({
  //   address: multicallAddress,
  //   abi: SpendSaveMulticallABI,
  //   client: publicClient,
  // });
  //
  // // Batch execute DCA
  // const hash = await contract.write.batchExecuteDCA([users, dcaParams]);
  // const receipt = await publicClient.waitForTransactionReceipt({ hash });
  //
  // // Check gas refund pool
  // const poolBalance = await contract.read.getGasRefundPoolBalance();
  //
  // // Fund gas refund pool
  // await contract.write.fundGasRefundPool({ value: parseEther("1") });
  //
  // // Watch batch execution events
  // const unwatch = contract.watchEvent.BatchExecuted(
  //   {},
  //   {
  //     onLogs: (logs) => {
  //       logs.forEach((log) => {
  //         console.log('Batch executed:', {
  //           executor: log.args.executor,
  //           batchId: log.args.batchId,
  //           success: `${log.args.successfulCalls}/${log.args.totalCalls}`,
  //           gasRefund: log.args.gasRefund,
  //         });
  //       });
  //     },
  //   }
  // );
  
  // Advanced usage - Building custom multicalls
  // import { Interface } from 'ethers';
  //
  // // Create interface for target contract
  // const targetInterface = new Interface([
  //   'function setSavingStrategy(address user, uint256 percentage)',
  //   'function processSavings(address user, address token, uint256 amount)',
  //   'function withdraw(address user, address token, uint256 amount)',
  // ]);
  //
  // // Encode multiple calls
  // const calls = [
  //   targetInterface.encodeFunctionData('setSavingStrategy', [user1, 1000]),
  //   targetInterface.encodeFunctionData('processSavings', [
  //     user1,
  //     usdcAddress,
  //     ethers.parseUnits("100", 6),
  //   ]),
  //   targetInterface.encodeFunctionData('withdraw', [
  //     user2,
  //     wethAddress,
  //     ethers.parseEther("1"),
  //   ]),
  // ];
  //
  // // Execute as multicall
  // const results = await multicallContract.multicall(calls);
  //
  // // Decode results
  // results.forEach((result, i) => {
  //   try {
  //     const decoded = targetInterface.decodeFunctionResult(
  //       calls[i].slice(0, 10), // function selector
  //       result
  //     );
  //     console.log(`Call ${i} result:`, decoded);
  //   } catch (error) {
  //     console.log(`Call ${i} failed:`, error);
  //   }
  // });
  
  // Helper: Calculate expected gas refund
  export const calculateGasRefund = (
    gasUsed: bigint,
    gasPrice: bigint,
    refundRate: bigint
  ): bigint => {
    // refundRate is in basis points (e.g., 5000 = 50%)
    const gasCost = gasUsed * gasPrice;
    return (gasCost * refundRate) / BigInt(10000);
  };
  
  // Helper: Check if batch size is within limits
  export const isValidBatchSize = (
    batchSize: number,
    maxBatchSize: bigint
  ): boolean => {
    return batchSize > 0 && BigInt(batchSize) <= maxBatchSize;
  };
  
  // Helper: Operation type descriptions
  export const getSavingsOperationDescription = (
    op: SavingsOperationType
  ): string => {
    const descriptions: Record<SavingsOperationType, string> = {
      [SavingsOperationType.DEPOSIT]: "Deposit to savings",
      [SavingsOperationType.WITHDRAW]: "Withdraw from savings",
      [SavingsOperationType.PROCESS]: "Process savings",
    };
    return descriptions[op];
  };
  
  export const getLiquidityOperationDescription = (
    op: LiquidityOperationType
  ): string => {
    const descriptions: Record<LiquidityOperationType, string> = {
      [LiquidityOperationType.ADD]: "Add liquidity",
      [LiquidityOperationType.REMOVE]: "Remove liquidity",
      [LiquidityOperationType.COLLECT_FEES]: "Collect fees",
      [LiquidityOperationType.REBALANCE]: "Rebalance position",
    };
    return descriptions[op];
  };