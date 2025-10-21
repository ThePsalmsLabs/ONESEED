'use client';

import { useBiconomyTransaction } from './useBiconomyTransaction';
import { encodeFunctionData, type Abi, type Hash } from 'viem';

interface SmartContractWriteOptions {
  onSuccess?: (hash: Hash) => void;
  onError?: (error: Error) => void;
}

export function useSmartContractWrite() {
  const { sendTransaction, isPending, hash } = useBiconomyTransaction();

  const write = async ({
    address,
    abi,
    functionName,
    args,
    value = BigInt(0),
    options
  }: {
    address: `0x${string}`;
    abi: Abi;
    functionName: string;
    args: readonly unknown[];
    value?: bigint;
    options?: SmartContractWriteOptions;
  }): Promise<Hash> => {
    const data = encodeFunctionData({
      abi,
      functionName,
      args
    });

    return await sendTransaction(address, data, value, options);
  };

  return {
    write,
    isPending,
    hash
  };
}
