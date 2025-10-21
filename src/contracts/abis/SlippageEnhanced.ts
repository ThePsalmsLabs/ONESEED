/**
 * Slippage Enhanced Contract ABI
 * TypeScript Definition
 * Advanced slippage protection with dynamic adjustment based on market conditions
 */

export const SlippageEnhancedABI = [
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
      inputs: [
        {
          internalType: "uint128",
          name: "maximumAmount",
          type: "uint128",
        },
        {
          internalType: "uint128",
          name: "amountRequested",
          type: "uint128",
        },
      ],
      name: "MaximumAmountExceeded",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint128",
          name: "minimumAmount",
          type: "uint128",
        },
        {
          internalType: "uint128",
          name: "amountReceived",
          type: "uint128",
        },
      ],
      name: "MinimumAmountInsufficient",
      type: "error",
    },
    {
      inputs: [],
      name: "DEFAULT_SLIPPAGE_BPS",
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
      name: "MAX_SLIPPAGE_BPS",
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
          name: "token",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "baseSlippageBps",
          type: "uint256",
        },
      ],
      name: "calculateDynamicSlippage",
      outputs: [
        {
          internalType: "uint256",
          name: "adjustedSlippageBps",
          type: "uint256",
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
          internalType: "BalanceDelta",
          name: "delta",
          type: "int256",
        },
        {
          internalType: "uint128",
          name: "amountInMax",
          type: "uint128",
        },
        {
          internalType: "uint128",
          name: "amountOutMin",
          type: "uint128",
        },
      ],
      name: "validateSwapSlippage",
      outputs: [],
      stateMutability: "pure",
      type: "function",
    },
  ] as const;
  
  // Type definitions
  
  export interface SwapValidation {
    delta: bigint; // BalanceDelta from Uniswap V4
    amountInMax: bigint;
    amountOutMin: bigint;
  }
  
  export interface DynamicSlippageParams {
    token: string;
    amount: bigint;
    baseSlippageBps: number;
  }
  
  export interface DynamicSlippageResult {
    baseSlippage: number; // basis points
    adjustedSlippage: number; // basis points
    adjustmentFactor: number; // multiplier
    reason?: string; // why adjustment was made
  }
  
  export interface SlippageBounds {
    amountInMax: bigint;
    amountOutMin: bigint;
    slippageBps: number;
  }
  
  // Helper types
  export type Address = `0x${string}`;
  export type BasisPoints = number;
  export type BalanceDelta = bigint;
  
  // Slippage adjustment reasons
  export enum SlippageAdjustmentReason {
    VOLATILE_TOKEN = "Volatile token detected",
    LARGE_TRADE = "Large trade size",
    LOW_LIQUIDITY = "Low liquidity pool",
    HIGH_VOLATILITY = "High market volatility",
    NONE = "No adjustment needed",
  }
  
  // Helper functions
  
  /**
   * Calculate minimum amount out with slippage
   * @param expectedAmount - Expected output amount
   * @param slippageBps - Slippage tolerance in basis points
   * @returns Minimum acceptable amount
   */
  export const calculateMinAmountOut = (
    expectedAmount: bigint,
    slippageBps: number
  ): bigint => {
    return (expectedAmount * BigInt(10000 - slippageBps)) / BigInt(10000);
  };
  
  /**
   * Calculate maximum amount in with slippage
   * @param expectedAmount - Expected input amount
   * @param slippageBps - Slippage tolerance in basis points
   * @returns Maximum acceptable amount
   */
  export const calculateMaxAmountIn = (
    expectedAmount: bigint,
    slippageBps: number
  ): bigint => {
    return (expectedAmount * BigInt(10000 + slippageBps)) / BigInt(10000);
  };
  
  /**
   * Check if slippage is within acceptable range
   * @param actual - Actual amount received/paid
   * @param expected - Expected amount
   * @param maxSlippageBps - Maximum slippage in basis points
   * @returns True if within acceptable slippage
   */
  export const isWithinSlippage = (
    actual: bigint,
    expected: bigint,
    maxSlippageBps: number
  ): boolean => {
    if (expected === BigInt(0)) return false;
    const diff = actual > expected ? actual - expected : expected - actual;
    const slippageBps = (diff * BigInt(10000)) / expected;
    return slippageBps <= BigInt(maxSlippageBps);
  };
  
  /**
   * Calculate actual slippage percentage
   * @param expected - Expected amount
   * @param actual - Actual amount
   * @returns Slippage in basis points
   */
  export const calculateActualSlippage = (
    expected: bigint,
    actual: bigint
  ): number => {
    if (expected === BigInt(0)) return 0;
    const diff = expected > actual ? expected - actual : actual - expected;
    return Number((diff * BigInt(10000)) / expected);
  };
  
  /**
   * Convert basis points to percentage
   * @param bps - Basis points
   * @returns Percentage
   */
  export const bpsToPercent = (bps: number): number => bps / 100;
  
  /**
   * Convert percentage to basis points
   * @param percent - Percentage
   * @returns Basis points
   */
  export const percentToBps = (percent: number): number => Math.round(percent * 100);
  
  /**
   * Estimate dynamic slippage adjustment factor
   * @param tokenVolatility - Token volatility score (0-100)
   * @param tradeSize - Trade size as % of liquidity (0-100)
   * @returns Adjustment factor (1.0 = no change, >1.0 = increase)
   */
  export const estimateSlippageAdjustment = (
    tokenVolatility: number,
    tradeSize: number
  ): number => {
    let factor = 1.0;
    
    // Adjust for volatility
    if (tokenVolatility > 50) {
      factor += (tokenVolatility - 50) / 100; // up to +0.5x
    }
    
    // Adjust for trade size
    if (tradeSize > 10) {
      factor += (tradeSize - 10) / 50; // up to +1.8x for 100% trade
    }
    
    return Math.min(factor, 3.0); // cap at 3x adjustment
  };
  
  // Example usage with ethers.js v6:
  // import { ethers } from 'ethers';
  // import {
  //   SlippageEnhancedABI,
  //   calculateMinAmountOut,
  //   calculateMaxAmountIn,
  //   isWithinSlippage,
  //   calculateActualSlippage,
  //   bpsToPercent,
  // } from './slippage-enhanced-abi';
  //
  // const contract = new ethers.Contract(address, SlippageEnhancedABI, provider);
  //
  // // ===== GET SLIPPAGE CONSTANTS =====
  //
  // const defaultSlippage = await contract.DEFAULT_SLIPPAGE_BPS();
  // const maxSlippage = await contract.MAX_SLIPPAGE_BPS();
  //
  // console.log('Default slippage:', bpsToPercent(defaultSlippage), '%');
  // console.log('Maximum slippage:', bpsToPercent(maxSlippage), '%');
  //
  // // ===== CALCULATE DYNAMIC SLIPPAGE =====
  //
  // // Get adjusted slippage based on token, amount, and market conditions
  // const baseSlippage = 100; // 1%
  // const swapAmount = ethers.parseEther("10"); // 10 tokens
  //
  // const adjustedSlippage = await contract.calculateDynamicSlippage(
  //   wethAddress,
  //   swapAmount,
  //   baseSlippage
  // );
  //
  // console.log('\nDynamic Slippage Calculation:');
  // console.log('  Token:', wethAddress);
  // console.log('  Amount:', ethers.formatEther(swapAmount));
  // console.log('  Base slippage:', bpsToPercent(baseSlippage), '%');
  // console.log('  Adjusted slippage:', bpsToPercent(adjustedSlippage), '%');
  //
  // if (adjustedSlippage > baseSlippage) {
  //   const increase = ((adjustedSlippage - baseSlippage) * 100) / baseSlippage;
  //   console.log('  ⚠️ Slippage increased by', increase.toFixed(1), '%');
  //   console.log('  Reason: Market conditions or token characteristics');
  // }
  //
  // // ===== CALCULATE SLIPPAGE BOUNDS =====
  //
  // const expectedOutput = ethers.parseEther("1.5"); // Expect 1.5 ETH
  // const slippageBps = Number(adjustedSlippage);
  //
  // const minAmountOut = calculateMinAmountOut(expectedOutput, slippageBps);
  // console.log('\nSlippage Bounds:');
  // console.log('  Expected output:', ethers.formatEther(expectedOutput), 'ETH');
  // console.log('  Min acceptable:', ethers.formatEther(minAmountOut), 'ETH');
  // console.log('  Slippage tolerance:', bpsToPercent(slippageBps), '%');
  //
  // // For input amount
  // const expectedInput = ethers.parseUnits("1000", 6); // 1000 USDC
  // const maxAmountIn = calculateMaxAmountIn(expectedInput, slippageBps);
  // console.log('\n  Expected input:', ethers.formatUnits(expectedInput, 6), 'USDC');
  // console.log('  Max acceptable:', ethers.formatUnits(maxAmountIn, 6), 'USDC');
  //
  // // ===== VALIDATE SWAP SLIPPAGE =====
  //
  // // Create a BalanceDelta (Uniswap V4 format)
  // // Negative for amount in, positive for amount out
  // const amountIn = ethers.parseUnits("1000", 6);
  // const amountOut = ethers.parseEther("1.48"); // slightly less than expected 1.5
  //
  // // Pack delta: high 128 bits = amount0, low 128 bits = amount1
  // // For this example, assume amount0 is input (negative), amount1 is output (positive)
  // const delta = ((-amountIn) << 128n) | amountOut;
  //
  // try {
  //   await contract.validateSwapSlippage.staticCall(
  //     delta,
  //     maxAmountIn,
  //     minAmountOut
  //   );
  //   console.log('✅ Swap slippage validation passed!');
  // } catch (error: any) {
  //   if (error.message.includes('MinimumAmountInsufficient')) {
  //     console.log('❌ Received amount too low (high slippage)');
  //   } else if (error.message.includes('MaximumAmountExceeded')) {
  //     console.log('❌ Input amount too high');
  //   }
  // }
  //
  // // ===== CHECK ACTUAL SLIPPAGE =====
  //
  // const actualOutput = ethers.parseEther("1.48");
  // const expectedOut = ethers.parseEther("1.5");
  //
  // const actualSlippageBps = calculateActualSlippage(expectedOut, actualOutput);
  // console.log('\nActual Slippage Analysis:');
  // console.log('  Expected:', ethers.formatEther(expectedOut), 'ETH');
  // console.log('  Received:', ethers.formatEther(actualOutput), 'ETH');
  // console.log('  Actual slippage:', bpsToPercent(actualSlippageBps), '%');
  //
  // if (isWithinSlippage(actualOutput, expectedOut, slippageBps)) {
  //   console.log('  ✅ Within tolerance');
  // } else {
  //   console.log('  ❌ Exceeds tolerance');
  // }
  //
  // // ===== COMPARE SLIPPAGE FOR DIFFERENT TOKENS =====
  //
  // const tokens = [
  //   { name: 'WETH', address: wethAddress, volatility: 30 },
  //   { name: 'USDC', address: usdcAddress, volatility: 5 },
  //   { name: 'SHIB', address: shibAddress, volatility: 80 },
  // ];
  //
  // console.log('\nToken Slippage Comparison:');
  // for (const token of tokens) {
  //   const adjusted = await contract.calculateDynamicSlippage(
  //     token.address,
  //     ethers.parseEther("10"),
  //     baseSlippage
  //   );
  //   
  //   console.log(`\n${token.name}:`);
  //   console.log('  Base:', bpsToPercent(baseSlippage), '%');
  //   console.log('  Adjusted:', bpsToPercent(Number(adjusted)), '%');
  //   console.log('  Volatility score:', token.volatility);
  // }
  //
  // // ===== TRADE SIZE IMPACT ON SLIPPAGE =====
  //
  // const tradeSizes = [
  //   ethers.parseEther("1"),    // Small
  //   ethers.parseEther("10"),   // Medium
  //   ethers.parseEther("100"),  // Large
  //   ethers.parseEther("1000"), // Very large
  // ];
  //
  // console.log('\nTrade Size Impact:');
  // for (const size of tradeSizes) {
  //   const adjusted = await contract.calculateDynamicSlippage(
  //     wethAddress,
  //     size,
  //     baseSlippage
  //   );
  //   
  //   console.log(`${ethers.formatEther(size)} ETH:`);
  //   console.log('  Adjusted slippage:', bpsToPercent(Number(adjusted)), '%');
  //   console.log('  Min acceptable:', ethers.formatEther(
  //     calculateMinAmountOut(size, Number(adjusted))
  //   ), 'ETH');
  // }
  //
  // // ===== PROTECT AGAINST SANDWICH ATTACKS =====
  //
  // const protectSwap = async (
  //   tokenIn: string,
  //   tokenOut: string,
  //   amountIn: bigint,
  //   expectedOut: bigint
  // ) => {
  //   // Get dynamic slippage
  //   const dynamicSlippage = await contract.calculateDynamicSlippage(
  //     tokenIn,
  //     amountIn,
  //     baseSlippage
  //   );
  //   
  //   // Calculate bounds
  //   const maxIn = calculateMaxAmountIn(amountIn, Number(dynamicSlippage));
  //   const minOut = calculateMinAmountOut(expectedOut, Number(dynamicSlippage));
  //   
  //   console.log('\nSwap Protection:');
  //   console.log('  Max input:', ethers.formatUnits(maxIn, 6), 'tokens');
  //   console.log('  Min output:', ethers.formatEther(minOut), 'tokens');
  //   console.log('  Protection:', bpsToPercent(Number(dynamicSlippage)), '%');
  //   
  //   return { maxIn, minOut, slippage: dynamicSlippage };
  // };
  //
  // const protection = await protectSwap(
  //   usdcAddress,
  //   wethAddress,
  //   ethers.parseUnits("1000", 6),
  //   ethers.parseEther("1.5")
  // );
  
  // With viem:
  // import { getContract, parseEther, formatEther } from 'viem';
  // import {
  //   SlippageEnhancedABI,
  //   calculateMinAmountOut,
  //   bpsToPercent,
  // } from './slippage-enhanced-abi';
  //
  // const contract = getContract({
  //   address: slippageEnhancedAddress,
  //   abi: SlippageEnhancedABI,
  //   client: publicClient,
  // });
  //
  // // Get constants
  // const defaultSlippage = await contract.read.DEFAULT_SLIPPAGE_BPS();
  // const maxSlippage = await contract.read.MAX_SLIPPAGE_BPS();
  //
  // // Calculate dynamic slippage
  // const adjustedSlippage = await contract.read.calculateDynamicSlippage([
  //   tokenAddress,
  //   parseEther("10"),
  //   100n, // 1% base
  // ]);
  //
  // console.log('Adjusted slippage:', bpsToPercent(Number(adjustedSlippage)), '%');
  //
  // // Calculate bounds
  // const expectedOutput = parseEther("1.5");
  // const minOut = calculateMinAmountOut(expectedOutput, Number(adjustedSlippage));
  //
  // // Validate swap (will revert if validation fails)
  // try {
  //   await contract.simulate.validateSwapSlippage([
  //     delta,
  //     maxAmountIn,
  //     minAmountOut,
  //   ]);
  //   console.log('✅ Validation passed');
  // } catch (error) {
  //   console.log('❌ Validation failed:', error);
  // }
  
  // Advanced: Real-time slippage monitoring
  export class SlippageMonitor {
    private contract: any;
    private alerts: Array<(data: any) => void> = [];
  
    constructor(contract: any) {
      this.contract = contract;
    }
  
    async checkSlippage(
      token: string,
      amount: bigint,
      baseSlippage: number
    ): Promise<DynamicSlippageResult> {
      const adjusted = await this.contract.calculateDynamicSlippage(
        token,
        amount,
        baseSlippage
      );
  
      const adjustmentFactor = Number(adjusted) / baseSlippage;
      let reason = SlippageAdjustmentReason.NONE;
  
      if (adjustmentFactor > 1.5) {
        reason = SlippageAdjustmentReason.VOLATILE_TOKEN;
      } else if (adjustmentFactor > 1.2) {
        reason = SlippageAdjustmentReason.LARGE_TRADE;
      }
  
      const result: DynamicSlippageResult = {
        baseSlippage,
        adjustedSlippage: Number(adjusted),
        adjustmentFactor,
        reason,
      };
  
      // Trigger alerts if significant adjustment
      if (adjustmentFactor > 1.5) {
        this.alerts.forEach(callback => callback(result));
      }
  
      return result;
    }
  
    onHighSlippage(callback: (data: DynamicSlippageResult) => void): void {
      this.alerts.push(callback);
    }
  }
  
  // Usage:
  // const monitor = new SlippageMonitor(contract);
  //
  // monitor.onHighSlippage((data) => {
  //   console.log('⚠️ High slippage detected!');
  //   console.log('  Adjustment factor:', data.adjustmentFactor.toFixed(2), 'x');
  //   console.log('  Reason:', data.reason);
  // });
  //
  // const result = await monitor.checkSlippage(
  //   volatileTokenAddress,
  //   ethers.parseEther("100"),
  //   100 // 1% base
  // );