'use client';

import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { formatUnits } from 'viem';
import type { WithdrawalPreview } from '@/contracts/types';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  token: `0x${string}` | '';
  amount: string;
  preview?: WithdrawalPreview;
  decimals: number;
  isPending: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  token,
  amount,
  preview,
  decimals,
  isPending
}: ConfirmationModalProps) {
  const hasPenalty = preview && preview.penalty > BigInt(0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Withdrawal" size="md">
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Token:</span>
            <span className="font-mono text-sm">
              {token ? `${token.slice(0, 6)}...${token.slice(-4)}` : '-'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-semibold">{amount} tokens</span>
          </div>

          {hasPenalty && preview && (
            <>
              <div className="h-px bg-gray-200" />
              
              <div className="flex justify-between">
                <span className="text-gray-600">Penalty:</span>
                <span className="font-semibold text-red-600">
                  - {formatUnits(preview.penalty, decimals)} tokens
                </span>
              </div>
              
              <div className="flex justify-between text-lg">
                <span className="font-medium">You will receive:</span>
                <span className="font-bold text-primary-600">
                  {formatUnits(preview.actualAmount, decimals)} tokens
                </span>
              </div>
            </>
          )}
        </div>

        {hasPenalty && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              ⚠️ This withdrawal includes an early withdrawal penalty
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant={hasPenalty ? 'danger' : 'primary'}
            size="lg"
            className="flex-1"
            onClick={onConfirm}
            isLoading={isPending}
            disabled={isPending}
          >
            {hasPenalty ? 'Withdraw Anyway' : 'Confirm'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

