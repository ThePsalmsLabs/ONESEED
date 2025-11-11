'use client';

import { Layout } from '@/components/Layout';
import { useSavingsBalance } from '@/hooks/useSavingsBalance';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { useToken } from '@/hooks/useToken';
import { useQueryClient } from '@tanstack/react-query';
import { parseUnits, formatUnits } from 'viem';

export default function SavingsTokensPage() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { tokenBalances, isLoading } = useSavingsBalance();
  const queryClient = useQueryClient();
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const { transferToken, isPending: isTransferring, registerToken, isPending: isRegistering } = useToken();

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  if (!isConnected || isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading ERC6909 tokens...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Show all tokens with balances, including unregistered ones
  const filteredBalances = tokenBalances.filter(b => {
    // Include if has any balance (ERC6909 or storage)
    const hasERC6909Balance = b.amount > BigInt(0);
    const hasStorageBalance = b.storageBalance && b.storageBalance > BigInt(0);
    return hasERC6909Balance || hasStorageBalance || true; // Show all for debugging
  });
  const selectedBalance = selectedToken 
    ? filteredBalances.find(b => b.token === selectedToken)
    : null;

  return (
    <Layout>
      <div className="min-h-screen bg-bg-primary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <Button
                onClick={() => router.back()}
                variant="ghost"
                size="sm"
                className="text-text-secondary hover:text-text-primary"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back
              </Button>
              <div className="flex-1">
                <h1 className="text-4xl font-black text-text-primary mb-2">
                  Your <span className="gradient-text">ERC6909</span> Savings Tokens
                </h1>
                <p className="text-text-secondary text-lg">
                  View and manage your ERC6909 token portfolio
                </p>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="glass-solid-dark p-4 border border-border">
                <div className="text-sm text-text-muted mb-1">Total Tokens</div>
                <div className="text-2xl font-bold text-text-primary">
                  {filteredBalances.length}
                </div>
              </Card>
              <Card className="glass-solid-dark p-4 border border-border">
                <div className="text-sm text-text-muted mb-1">ERC6909 Compliant</div>
                <div className="text-2xl font-bold text-primary-400">
                  {filteredBalances.filter(b => b.tokenId > BigInt(0)).length}
                </div>
              </Card>
              <Card className="glass-solid-dark p-4 border border-border">
                <div className="text-sm text-text-muted mb-1">Total Value</div>
                <div className="text-2xl font-bold text-text-primary">
                  {filteredBalances.reduce((sum, b) => sum + b.amount, BigInt(0)).toString()}
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Token List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Token Cards */}
            <div className="lg:col-span-2 space-y-4">
              {filteredBalances.length === 0 ? (
                <Card className="glass-solid-dark p-12 text-center border border-border">
                  <div className="text-6xl mb-4">🪙</div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    No Saved Tokens Found
                  </h3>
                  <p className="text-text-secondary mb-4">
                    {tokenBalances.length === 0 
                      ? 'Start saving to see your ERC6909 tokens appear here'
                      : `Found ${tokenBalances.length} tokens in storage, but they may not be registered as ERC6909 tokens. Check the console for details.`
                    }
                  </p>
                  {tokenBalances.length > 0 && (
                    <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p className="text-sm text-yellow-400 mb-2">
                        ⚠️ Tokens exist but may not be ERC6909 registered
                      </p>
                      <p className="text-xs text-text-muted">
                        Debug: Check browser console for token registration status
                      </p>
                    </div>
                  )}
                  <Button
                    onClick={() => router.push('/swap')}
                    className="bg-primary-500 hover:bg-primary-600 text-white"
                  >
                    Start Swapping & Saving
                  </Button>
                </Card>
              ) : (
                filteredBalances.map((balance, index) => (
                  <motion.div
                    key={balance.token}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={`glass-solid-dark p-6 border cursor-pointer transition-all ${
                        selectedToken === balance.token 
                          ? 'border-primary-400 bg-primary-400/5' 
                          : 'border-border hover:border-primary-400/30'
                      }`}
                      onClick={() => setSelectedToken(selectedToken === balance.token ? null : balance.token)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-accent-cyan rounded-xl flex items-center justify-center text-white font-bold">
                              {balance.symbol?.charAt(0) || '?'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold text-text-primary">
                                  {balance.symbol || 'UNKNOWN'}
                                </h3>
                                {balance.tokenId > BigInt(0) ? (
                                  <span className="text-xs bg-primary-400/20 text-primary-400 px-2 py-1 rounded-full font-medium">
                                    ERC6909 #{balance.tokenId.toString()}
                                  </span>
                                ) : (
                                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full font-medium">
                                    ⚠️ Not Registered
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-text-muted">
                                {balance.name || 'Unknown Token'}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <div className="text-xs text-text-muted mb-1">ERC6909 Balance</div>
                              <div className="text-lg font-semibold text-text-primary">
                                {formatUnits(balance.amount, balance.decimals)} {balance.symbol}
                              </div>
                            </div>
                            {balance.storageBalance !== undefined && (
                              <div>
                                <div className="text-xs text-text-muted mb-1">Storage Balance</div>
                                <div className="text-sm text-text-secondary">
                                  {formatUnits(balance.storageBalance, balance.decimals)}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="mt-4 pt-4 border-t border-border">
                            <div className="flex items-center gap-2 text-xs text-text-muted">
                              <span>Token Address:</span>
                              <code className="bg-bg-tertiary px-2 py-1 rounded text-text-secondary">
                                {balance.token.slice(0, 6)}...{balance.token.slice(-4)}
                              </code>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyAddress(balance.token);
                                }}
                                className="text-primary-400 hover:text-primary-300"
                              >
                                {copiedAddress === balance.token ? (
                                  <CheckIcon className="w-4 h-4" />
                                ) : (
                                  <DocumentDuplicateIcon className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          {balance.tokenId === BigInt(0) ? (
                            <Button
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  await registerToken.mutateAsync(balance.token);
                                  // Invalidate queries to refresh
                                  queryClient.invalidateQueries({ queryKey: ['tokenBalances', address] });
                                } catch (error) {
                                  console.error('Failed to register token:', error);
                                }
                              }}
                              size="sm"
                              variant="outline"
                              disabled={isRegistering}
                              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
                            >
                              {isRegistering ? 'Registering...' : 'Register Token'}
                            </Button>
                          ) : (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedToken(balance.token);
                                setShowTransferModal(true);
                              }}
                              size="sm"
                              variant="outline"
                              className="border-primary-400 text-primary-400 hover:bg-primary-400/10"
                            >
                              <ArrowRightIcon className="w-4 h-4 mr-1" />
                              Transfer
                            </Button>
                          )}
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`https://sepolia.basescan.org/address/${balance.token}`, '_blank');
                            }}
                            size="sm"
                            variant="ghost"
                            className="text-text-muted hover:text-text-primary"
                          >
                            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>

            {/* Token Details Sidebar */}
            <div className="lg:col-span-1">
              {selectedBalance ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card className="glass-solid-dark p-6 border border-border sticky top-4">
                    <h3 className="text-lg font-bold text-text-primary mb-4">
                      Token Details
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs text-text-muted mb-1">ERC6909 Token ID</div>
                        <div className="text-lg font-semibold text-primary-400">
                          #{selectedBalance.tokenId.toString()}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-text-muted mb-1">Token Symbol</div>
                        <div className="text-lg font-semibold text-text-primary">
                          {selectedBalance.symbol}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-text-muted mb-1">Token Name</div>
                        <div className="text-sm text-text-secondary">
                          {selectedBalance.name || 'Unknown'}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-text-muted mb-1">ERC6909 Balance</div>
                        <div className="text-xl font-bold text-text-primary">
                          {formatUnits(selectedBalance.amount, selectedBalance.decimals)} {selectedBalance.symbol}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-text-muted mb-1">Decimals</div>
                        <div className="text-sm text-text-secondary">
                          {selectedBalance.decimals}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <div className="text-xs text-text-muted mb-2">Token Address</div>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-bg-tertiary px-2 py-1 rounded text-text-secondary break-all">
                            {selectedBalance.token}
                          </code>
                          <button
                            onClick={() => handleCopyAddress(selectedBalance.token)}
                            className="text-primary-400 hover:text-primary-300"
                          >
                            {copiedAddress === selectedBalance.token ? (
                              <CheckIcon className="w-4 h-4" />
                            ) : (
                              <DocumentDuplicateIcon className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <Button
                        onClick={() => {
                          setShowTransferModal(true);
                        }}
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                        disabled={selectedBalance.tokenId === BigInt(0) || isTransferring}
                      >
                        {isTransferring ? 'Transferring...' : 'Transfer Tokens'}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <Card className="glass-solid-dark p-6 border border-border text-center">
                  <p className="text-text-muted text-sm">
                    Select a token to view details
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Transfer Modal */}
        {showTransferModal && selectedBalance && (
          <TransferModal
            balance={selectedBalance}
            onClose={() => setShowTransferModal(false)}
            onSuccess={() => {
              setShowTransferModal(false);
              // Invalidate queries to refresh balances
              queryClient.invalidateQueries({ queryKey: ['tokenBalances', address] });
              queryClient.invalidateQueries({ queryKey: ['realtimeSavingsBalance', address] });
            }}
          />
        )}
      </div>
    </Layout>
  );
}

interface TransferModalProps {
  balance: {
    token: `0x${string}`;
    tokenId: bigint;
    amount: bigint;
    symbol?: string;
    decimals: number;
  };
  onClose: () => void;
  onSuccess: () => void;
}

function TransferModal({ balance, onClose, onSuccess }: TransferModalProps) {
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { transferToken, isPending } = useToken();

  const handleTransfer = async () => {
    if (!receiver || !amount) {
      setError('Please fill in all fields');
      return;
    }

    // Validate address
    if (!receiver.startsWith('0x') || receiver.length !== 42) {
      setError('Invalid receiver address');
      return;
    }

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Invalid amount');
      return;
    }

    const maxAmount = parseFloat(formatUnits(balance.amount, balance.decimals));
    if (amountNum > maxAmount) {
      setError(`Amount exceeds balance (${maxAmount} ${balance.symbol})`);
      return;
    }

    try {
      setError(null);
      
      const hash = await transferToken.mutateAsync({
        receiver: receiver as `0x${string}`,
        tokenId: balance.tokenId,
        amount: amount, // Pass as string
        decimals: balance.decimals // Include decimals for proper parsing
      });

      console.log('Transfer successful:', hash);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Transfer failed');
      console.error('Transfer error:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-solid-dark rounded-2xl p-6 border border-border max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Transfer ERC6909 Tokens
        </h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Token
            </label>
            <div className="bg-bg-tertiary px-4 py-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-text-primary font-semibold">
                  {balance.symbol} (ERC6909 #{balance.tokenId.toString()})
                </span>
                <span className="text-xs text-text-muted">
                  Balance: {formatUnits(balance.amount, balance.decimals)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Receiver Address
            </label>
            <input
              type="text"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              placeholder="0x..."
              className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Amount
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                step="any"
                max={formatUnits(balance.amount, balance.decimals)}
                className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              <button
                onClick={() => setAmount(formatUnits(balance.amount, balance.decimals))}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary-400 hover:text-primary-300 px-2 py-1"
              >
                MAX
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-border text-text-secondary hover:text-text-primary"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleTransfer}
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
            disabled={isPending || !receiver || !amount}
          >
            {isPending ? 'Transferring...' : 'Transfer'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

