import { useMemo } from 'react';
import { parseUnits, formatUnits } from 'viem';
import { Token } from './useTokenList';

interface SavingsSplit {
  savingsAmount: bigint;
  swapAmount: bigint;
  savingsUSD: number;
  swapUSD: number;
  percentage: number;
}

export function useSavingsCalculation(
  inputAmount: string,
  inputToken: Token | null,
  savingsPercentage: number,
  tokenPriceUSD: number = 1
): SavingsSplit {
  return useMemo(() => {
    if (!inputAmount || !inputToken || inputAmount === '0') {
      return {
        savingsAmount: BigInt(0),
        swapAmount: BigInt(0),
        savingsUSD: 0,
        swapUSD: 0,
        percentage: savingsPercentage,
      };
    }

    try {
      const amountBigInt = parseUnits(inputAmount, inputToken.decimals);

      // Calculate amounts (savingsPercentage is 0-100, we convert to basis points for precision)
      const savingsAmount = (amountBigInt * BigInt(savingsPercentage * 100)) / BigInt(10000);
      const swapAmount = amountBigInt - savingsAmount;

      // Calculate USD values
      const inputAmountFloat = parseFloat(formatUnits(amountBigInt, inputToken.decimals));
      const savingsUSD = (inputAmountFloat * savingsPercentage / 100) * tokenPriceUSD;
      const swapUSD = (inputAmountFloat * (100 - savingsPercentage) / 100) * tokenPriceUSD;
      
      return {
        savingsAmount,
        swapAmount,
        savingsUSD,
        swapUSD,
        percentage: savingsPercentage,
      };
    } catch (error) {
      console.error('Error calculating savings split:', error);
      return {
        savingsAmount: BigInt(0),
        swapAmount: BigInt(0),
        savingsUSD: 0,
        swapUSD: 0,
        percentage: savingsPercentage,
      };
    }
  }, [inputAmount, inputToken, savingsPercentage, tokenPriceUSD]);
}

// Smart suggestions based on trade size
export function useSavingsSuggestion(tradeValueUSD: number): number {
  if (tradeValueUSD < 100) return 5;
  if (tradeValueUSD < 1000) return 10;
  return 15;
}

