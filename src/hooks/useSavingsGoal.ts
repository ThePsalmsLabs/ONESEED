'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';

const DEFAULT_GOAL = 10000;
const MIN_GOAL = 100;
const MAX_GOAL = 1000000;

const getStorageKey = (address: string) => `savingsGoal-${address}`;

export function useSavingsGoal() {
  const { address } = useAccount();
  const [goal, setGoalState] = useState<number>(DEFAULT_GOAL);
  const [isLoading, setIsLoading] = useState(true);

  // Load goal from localStorage on mount
  useEffect(() => {
    if (!address) {
      setGoalState(DEFAULT_GOAL);
      setIsLoading(false);
      return;
    }

    try {
      const stored = localStorage.getItem(getStorageKey(address));
      if (stored) {
        const parsedGoal = parseFloat(stored);
        if (!isNaN(parsedGoal) && parsedGoal >= MIN_GOAL && parsedGoal <= MAX_GOAL) {
          setGoalState(parsedGoal);
        }
      }
    } catch (error) {
      console.error('Error loading savings goal:', error);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // Update goal
  const setSavingsGoal = useCallback((newGoal: number) => {
    if (!address) return;

    // Validate goal
    if (newGoal < MIN_GOAL) {
      throw new Error(`Minimum savings goal is $${MIN_GOAL}`);
    }
    if (newGoal > MAX_GOAL) {
      throw new Error(`Maximum savings goal is $${MAX_GOAL}`);
    }

    try {
      localStorage.setItem(getStorageKey(address), newGoal.toString());
      setGoalState(newGoal);
    } catch (error) {
      console.error('Error saving savings goal:', error);
      throw new Error('Failed to save savings goal');
    }
  }, [address]);

  return {
    goal,
    setSavingsGoal,
    isLoading,
    minGoal: MIN_GOAL,
    maxGoal: MAX_GOAL
  };
}

