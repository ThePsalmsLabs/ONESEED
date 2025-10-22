'use client';

import { useState, useCallback } from 'react';
import { useBiconomy } from '@/components/BiconomyProvider';
import { useToast } from '@/components/ui/Toast';
import { encodeFunctionData } from 'viem';
import { CONTRACT_ADDRESSES } from '@/contracts/addresses';
import { SavingsStrategyABI } from '@/contracts/abis/SavingStrategy';
import { DCAABI } from '@/contracts/abis/DCA';
import { DailySavingsABI } from '@/contracts/abis/DailySavings';
import { SavingsModuleABI } from '@/contracts/abis/Savings';
import { SavingsTokenType } from '@/contracts/types';

interface BatchSavingsSetupParams {
  percentage: bigint;
  autoIncrement: bigint;
  maxPercentage: bigint;
  roundUpSavings: boolean;
  savingsTokenType: SavingsTokenType;
  specificSavingsToken?: `0x${string}`;
  enableDCA?: boolean;
  dcaTarget?: `0x${string}`;
  dcaMinAmount?: string;
  dcaMaxSlippage?: number;
  enableDailySavings?: boolean;
  dailyToken?: `0x${string}`;
  dailyAmount?: string;
  goalAmount?: string;
  penaltyBps?: number;
}

interface BatchWithdrawParams {
  tokens: `0x${string}`[];
  amounts: bigint[];
  force?: boolean;
}

export function useBatchTransactions() {
  const { smartAccount } = useBiconomy();
  const { showToast } = useToast();
  const [isPending, setIsPending] = useState(false);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const batchSavingsSetup = useCallback(async (params: BatchSavingsSetupParams) => {
    if (!smartAccount) {
      throw new Error('Smart account not initialized');
    }

    setIsPending(true);
    setHash(undefined);

    try {
      const transactions = [];

      // 1. Set savings strategy
      transactions.push({
        to: CONTRACT_ADDRESSES[84532].SavingStrategy as `0x${string}`,
        data: encodeFunctionData({
          abi: SavingsStrategyABI,
          functionName: 'setSavingStrategy',
          args: [
            await smartAccount.getAccountAddress() as `0x${string}`,
            params.percentage,
            params.autoIncrement,
            params.maxPercentage,
            params.roundUpSavings,
            params.savingsTokenType,
            params.specificSavingsToken || '0x0000000000000000000000000000000000000000'
          ]
        })
      });

      // 2. Enable DCA if requested
      if (params.enableDCA && params.dcaTarget) {
        const minAmountWei = BigInt(params.dcaMinAmount || '0');
        const maxSlippageWei = BigInt(params.dcaMaxSlippage || 0);
        
        transactions.push({
          to: CONTRACT_ADDRESSES[84532].DCA as `0x${string}`,
          data: encodeFunctionData({
            abi: DCAABI,
            functionName: 'enableDCA',
            args: [
              await smartAccount.getAccountAddress() as `0x${string}`,
              params.dcaTarget,
              minAmountWei,
              maxSlippageWei
            ]
          })
        });
      }

      // 3. Configure daily savings if requested
      if (params.enableDailySavings && params.dailyToken && params.dailyAmount) {
        const dailyAmountWei = BigInt(params.dailyAmount);
        const goalAmountWei = BigInt(params.goalAmount || '0');
        const penaltyBpsWei = BigInt(params.penaltyBps || 0);
        const endTimeWei = BigInt(Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60);

        transactions.push({
          to: CONTRACT_ADDRESSES[84532].DailySavings as `0x${string}`,
          data: encodeFunctionData({
            abi: DailySavingsABI,
            functionName: 'configureDailySavings',
            args: [
              await smartAccount.getAccountAddress() as `0x${string}`,
              params.dailyToken,
              dailyAmountWei,
              goalAmountWei,
              penaltyBpsWei,
              endTimeWei
            ]
          })
        });
      }

      // Execute ALL in ONE gasless transaction
      const userOp = await smartAccount.buildUserOp(transactions);
      const response = await smartAccount.sendUserOp(userOp);
      const txHash = await response.wait();
      
      setHash(txHash.userOpHash as `0x${string}`);
      showToast('Batch savings setup completed successfully!', 'success');
      
      return txHash.userOpHash as `0x${string}`;
    } catch (error) {
      console.error('Batch savings setup error:', error);
      showToast('Failed to complete batch savings setup', 'error');
      throw error;
    } finally {
      setIsPending(false);
    }
  }, [smartAccount, showToast]);

  const batchWithdraw = useCallback(async (params: BatchWithdrawParams) => {
    if (!smartAccount) {
      throw new Error('Smart account not initialized');
    }

    setIsPending(true);
    setHash(undefined);

    try {
      const accountAddress = await smartAccount.getAccountAddress();
      const transactions = params.tokens.map((token, i) => ({
        to: CONTRACT_ADDRESSES[84532].Savings as `0x${string}`,
        data: encodeFunctionData({
          abi: SavingsModuleABI,
          functionName: 'withdraw',
          args: [
            accountAddress,
            token,
            params.amounts[i],
            params.force || false
          ]
        })
      }));

      // Withdraw ALL tokens in ONE transaction
      const userOp = await smartAccount.buildUserOp(transactions);
      const response = await smartAccount.sendUserOp(userOp);
      const txHash = await response.wait();
      
      setHash(txHash.userOpHash as `0x${string}`);
      showToast('Batch withdrawal completed successfully!', 'success');
      
      return txHash.userOpHash as `0x${string}`;
    } catch (error) {
      console.error('Batch withdrawal error:', error);
      showToast('Failed to complete batch withdrawal', 'error');
      throw error;
    } finally {
      setIsPending(false);
    }
  }, [smartAccount, showToast]);

  const batchDCASetup = useCallback(async (params: {
    targetToken: `0x${string}`;
    minAmount: string;
    maxSlippage: number;
    lowerTick: number;
    upperTick: number;
  }) => {
    if (!smartAccount) {
      throw new Error('Smart account not initialized');
    }

    setIsPending(true);
    setHash(undefined);

    try {
      const transactions = [];

      // 1. Enable DCA
      const minAmountWei = BigInt(params.minAmount);
      const maxSlippageWei = BigInt(params.maxSlippage);
      
      transactions.push({
        to: CONTRACT_ADDRESSES[84532].DCA as `0x${string}`,
        data: encodeFunctionData({
          abi: DCAABI,
          functionName: 'enableDCA',
          args: [
            await smartAccount.getAccountAddress() as `0x${string}`,
            params.targetToken,
            minAmountWei,
            maxSlippageWei
          ]
        })
      });

      // 2. Set DCA tick strategy
      transactions.push({
        to: CONTRACT_ADDRESSES[84532].DCA as `0x${string}`,
        data: encodeFunctionData({
          abi: DCAABI,
          functionName: 'setDCATickStrategy',
          args: [
            await smartAccount.getAccountAddress() as `0x${string}`,
            params.lowerTick,
            params.upperTick
          ]
        })
      });

      // Execute DCA setup in ONE transaction
      const userOp = await smartAccount.buildUserOp(transactions);
      const response = await smartAccount.sendUserOp(userOp);
      const txHash = await response.wait();
      
      setHash(txHash.userOpHash as `0x${string}`);
      showToast('Batch DCA setup completed successfully!', 'success');
      
      return txHash.userOpHash as `0x${string}`;
    } catch (error) {
      console.error('Batch DCA setup error:', error);
      showToast('Failed to complete batch DCA setup', 'error');
      throw error;
    } finally {
      setIsPending(false);
    }
  }, [smartAccount, showToast]);

  const batchDailySavingsSetup = useCallback(async (params: {
    token: `0x${string}`;
    dailyAmount: string;
    goalAmount: string;
    penaltyBps: number;
    endTime?: number;
  }) => {
    if (!smartAccount) {
      throw new Error('Smart account not initialized');
    }

    setIsPending(true);
    setHash(undefined);

    try {
      const transactions = [];

      // 1. Configure daily savings
      const dailyAmountWei = BigInt(params.dailyAmount);
      const goalAmountWei = BigInt(params.goalAmount);
      const penaltyBpsWei = BigInt(params.penaltyBps);
      const endTimeWei = BigInt(params.endTime || Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60);

      transactions.push({
        to: CONTRACT_ADDRESSES[84532].DailySavings as `0x${string}`,
        data: encodeFunctionData({
          abi: DailySavingsABI,
          functionName: 'configureDailySavings',
          args: [
            await smartAccount.getAccountAddress() as `0x${string}`,
            params.token,
            dailyAmountWei,
            goalAmountWei,
            penaltyBpsWei,
            endTimeWei
          ]
        })
      });

      // Execute daily savings setup in ONE transaction
      const userOp = await smartAccount.buildUserOp(transactions);
      const response = await smartAccount.sendUserOp(userOp);
      const txHash = await response.wait();
      
      setHash(txHash.userOpHash as `0x${string}`);
      showToast('Batch daily savings setup completed successfully!', 'success');
      
      return txHash.userOpHash as `0x${string}`;
    } catch (error) {
      console.error('Batch daily savings setup error:', error);
      showToast('Failed to complete batch daily savings setup', 'error');
      throw error;
    } finally {
      setIsPending(false);
    }
  }, [smartAccount, showToast]);

  return {
    batchSavingsSetup,
    batchWithdraw,
    batchDCASetup,
    batchDailySavingsSetup,
    isPending,
    hash
  };
}
