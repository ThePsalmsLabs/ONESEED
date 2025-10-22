'use client';

import { Address, formatUnits } from 'viem';

export interface SwapQuote {
  outputAmount: bigint;
  priceImpact: number;
  route: Address[];
  fee: bigint;
  gas: bigint;
  minOutputAmount: bigint;
}

/**
 * Calculate minimum output amount based on slippage tolerance
 * @param outputAmount - Expected output amount
 * @param slippageBps - Slippage tolerance in basis points (e.g., 50 = 0.5%)
 */
export function calculateMinOutput(outputAmount: bigint, slippageBps: number): bigint {
  const slippageFactor = BigInt(10000) - BigInt(slippageBps);
  return (outputAmount * slippageFactor) / BigInt(10000);
}

/**
 * Calculate price impact percentage
 * @param inputAmount - Input amount
 * @param outputAmount - Output amount  
 * @param inputPrice - Price of input token in USD
 * @param outputPrice - Price of output token in USD
 */
export function calculatePriceImpact(
  inputAmount: bigint,
  outputAmount: bigint,
  inputDecimals: number,
  outputDecimals: number,
  inputPrice: number,
  outputPrice: number
): number {
  const inputValue = parseFloat(formatUnits(inputAmount, inputDecimals)) * inputPrice;
  const outputValue = parseFloat(formatUnits(outputAmount, outputDecimals)) * outputPrice;
  
  if (inputValue === 0) return 0;
  
  const impact = ((inputValue - outputValue) / inputValue) * 100;
  return Math.abs(impact);
}

/**
 * Format price impact as a percentage string
 */
export function formatPriceImpact(impact: number): string {
  return `${impact.toFixed(2)}%`;
}

/**
 * Get price impact warning level
 */
export function getPriceImpactLevel(impact: number): 'low' | 'medium' | 'high' | 'critical' {
  if (impact < 1) return 'low';
  if (impact < 3) return 'medium';
  if (impact < 5) return 'high';
  return 'critical';
}

/**
 * Estimate gas cost for a swap (rough estimate)
 */
export function estimateSwapGas(hasApproval: boolean): bigint {
  // Base swap: ~150k gas
  // With approval: +50k gas
  return BigInt(hasApproval ? 150000 : 200000);
}

