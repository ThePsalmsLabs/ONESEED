'use client';

import { useState, useCallback } from 'react';
import { useBiconomy } from '@/components/BiconomyProvider';
import { useToast } from '@/components/ui/Toast';
import { CONTRACT_ADDRESSES } from '@/contracts/addresses';
import { DCAABI } from '@/contracts/abis/DCA';
import { DailySavingsABI } from '@/contracts/abis/DailySavings';

interface SessionKeyConfig {
  contractAddress: `0x${string}`;
  allowedFunctions: string[];
  maxValue: bigint;
  validUntil: number; // Unix timestamp
}

export function useSessionKeys() {
  const { smartAccount } = useBiconomy();
  const { showToast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const createDCASession = useCallback(async (): Promise<string | null> => {
    if (!smartAccount) {
      showToast('Smart account not initialized', 'error');
      return null;
    }

    setIsCreating(true);
    try {
      // NOTE: This is a placeholder implementation for Biconomy v2 session keys
      // The actual Biconomy v2 session key API is not yet available in production
      // This implementation uses localStorage as a fallback for development
      
      // TODO: Replace with real Biconomy v2 session key API when available
      // const sessionKey = await biconomySessionKeyModule.createSessionKey({
      //   contractAddress: CONTRACT_ADDRESSES[84532].DCA,
      //   allowedFunctions: ['executeDCA'],
      //   maxValue: BigInt(0),
      //   validUntil: Math.floor(Date.now() / 1000) + (86400 * 30)
      // });
      
      const sessionKey = JSON.stringify({
        contractAddress: CONTRACT_ADDRESSES[84532].DCA as `0x${string}`,
        allowedFunctions: ['executeDCA'],
        maxValue: BigInt(0),
        validUntil: Math.floor(Date.now() / 1000) + (86400 * 30),
        type: 'dca',
        note: 'Mock implementation - Biconomy v2 session keys not yet available'
      });

      // Store session key in localStorage
      localStorage.setItem('dca_session_key', sessionKey);
      
      showToast('DCA session key created (mock implementation)', 'success');
      return sessionKey;
    } catch (error) {
      console.error('Error creating DCA session key:', error);
      showToast('Failed to create DCA session key', 'error');
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [smartAccount, showToast]);

  const createDailySavingsSession = useCallback(async (): Promise<string | null> => {
    if (!smartAccount) {
      showToast('Smart account not initialized', 'error');
      return null;
    }

    setIsCreating(true);
    try {
      // Create session key that can ONLY execute daily savings
      // Note: This is a mock implementation - actual Biconomy session keys would use different API
      const sessionKey = JSON.stringify({
        contractAddress: CONTRACT_ADDRESSES[84532].DailySavings as `0x${string}`,
        allowedFunctions: ['executeDailySavings', 'executeDailySavingsForToken'],
        maxValue: BigInt(0),
        validUntil: Math.floor(Date.now() / 1000) + (86400 * 365),
        type: 'daily'
      });

      // Store session key in localStorage
      localStorage.setItem('daily_savings_session_key', sessionKey);
      
      showToast('Daily savings session key created successfully!', 'success');
      return sessionKey;
    } catch (error) {
      console.error('Error creating daily savings session key:', error);
      showToast('Failed to create daily savings session key', 'error');
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [smartAccount, showToast]);

  const createBatchSession = useCallback(async (): Promise<string | null> => {
    if (!smartAccount) {
      showToast('Smart account not initialized', 'error');
      return null;
    }

    setIsCreating(true);
    try {
      // Create session key that can execute multiple operations
      // Note: This is a mock implementation - actual Biconomy session keys would use different API
      const sessionKey = JSON.stringify({
        contractAddress: CONTRACT_ADDRESSES[84532].DCA as `0x${string}`,
        allowedFunctions: [
          'executeDCA',
          'queueDCAExecution',
          'enableDCA',
          'disableDCA'
        ],
        maxValue: BigInt(0),
        validUntil: Math.floor(Date.now() / 1000) + (86400 * 30),
        type: 'batch'
      });

      // Store session key in localStorage
      localStorage.setItem('batch_session_key', sessionKey);
      
      showToast('Batch session key created successfully!', 'success');
      return sessionKey;
    } catch (error) {
      console.error('Error creating batch session key:', error);
      showToast('Failed to create batch session key', 'error');
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [smartAccount, showToast]);

  const getStoredSessionKey = useCallback((type: 'dca' | 'daily' | 'batch'): string | null => {
    const key = type === 'dca' ? 'dca_session_key' : 
                 type === 'daily' ? 'daily_savings_session_key' : 
                 'batch_session_key';
    return localStorage.getItem(key);
  }, []);

  const revokeSessionKey = useCallback(async (type: 'dca' | 'daily' | 'batch'): Promise<boolean> => {
    if (!smartAccount) {
      showToast('Smart account not initialized', 'error');
      return false;
    }

    try {
      const sessionKey = getStoredSessionKey(type);
      if (!sessionKey) {
        showToast('No session key found to revoke', 'error');
        return false;
      }

      // Note: This is a mock implementation - actual Biconomy session key revocation would use different API
      // await smartAccount.revokeSessionKey(sessionKey);
      
      // Remove from localStorage
      const key = type === 'dca' ? 'dca_session_key' : 
                   type === 'daily' ? 'daily_savings_session_key' : 
                   'batch_session_key';
      localStorage.removeItem(key);
      
      showToast('Session key revoked successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Error revoking session key:', error);
      showToast('Failed to revoke session key', 'error');
      return false;
    }
  }, [smartAccount, showToast, getStoredSessionKey]);

  const checkSessionKeyValidity = useCallback((type: 'dca' | 'daily' | 'batch'): boolean => {
    const sessionKey = getStoredSessionKey(type);
    if (!sessionKey) return false;

    try {
      // Parse session key to check expiration
      const keyData = JSON.parse(sessionKey);
      const now = Math.floor(Date.now() / 1000);
      return keyData.validUntil > now;
    } catch {
      return false;
    }
  }, [getStoredSessionKey]);

  return {
    createDCASession,
    createDailySavingsSession,
    createBatchSession,
    getStoredSessionKey,
    revokeSessionKey,
    checkSessionKeyValidity,
    isCreating
  };
}
