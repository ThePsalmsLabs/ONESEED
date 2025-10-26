#!/usr/bin/env node

/**
 * Smart Account Control Script
 * 
 * This script helps you interact with your Smart Account directly
 * using your EOA private key.
 * 
 * Usage: node scripts/smart-account-control.js
 */

import { createWalletClient, http, parseEther, formatEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Your EOA private key (add to .env.local)
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.log('❌ Please add your PRIVATE_KEY to .env.local');
  console.log('   Example: PRIVATE_KEY=0x1234...');
  process.exit(1);
}

// Your Smart Account address (deterministic)
const SMART_ACCOUNT_ADDRESS = '0x3c92e8b3AB32c6e3C0F7c8346562bf1b76638c2D';

async function main() {
  try {
    console.log('🔧 Setting up wallet client...');
    
    // Create account from private key
    const account = privateKeyToAccount(`0x${PRIVATE_KEY.replace('0x', '')}`);
    
    // Create wallet client
    const walletClient = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http()
    });

    console.log('✅ Wallet client created successfully!');
    console.log('');
    console.log('📋 Your Account Details:');
    console.log('========================');
    console.log(`EOA Address:      ${account.address}`);
    console.log(`Smart Account:    ${SMART_ACCOUNT_ADDRESS}`);
    console.log(`Chain:           ${baseSepolia.name}`);
    console.log(`Network:         ${baseSepolia.rpcUrls.default.http[0]}`);
    console.log('');
    
    // Check balances
    console.log('💰 Checking Balances...');
    
    // EOA ETH balance
    const eoaEthBalance = await walletClient.getBalance({
      address: account.address
    });
    
    // Smart Account ETH balance
    const smartAccountEthBalance = await walletClient.getBalance({
      address: SMART_ACCOUNT_ADDRESS
    });
    
    console.log(`EOA ETH Balance:      ${formatEther(eoaEthBalance)} ETH`);
    console.log(`Smart Account ETH:    ${formatEther(smartAccountEthBalance)} ETH`);
    console.log('');
    
    // Check USDC balance
    const usdcAddress = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
    
    const eoaUsdcBalance = await walletClient.readContract({
      address: usdcAddress,
      abi: [{
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: 'balance', type: 'uint256' }],
      }],
      functionName: 'balanceOf',
      args: [account.address]
    });
    
    const smartAccountUsdcBalance = await walletClient.readContract({
      address: usdcAddress,
      abi: [{
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: 'balance', type: 'uint256' }],
      }],
      functionName: 'balanceOf',
      args: [SMART_ACCOUNT_ADDRESS]
    });
    
    console.log(`EOA USDC Balance:     ${(Number(eoaUsdcBalance) / 1e6).toFixed(6)} USDC`);
    console.log(`Smart Account USDC:   ${(Number(smartAccountUsdcBalance) / 1e6).toFixed(6)} USDC`);
    console.log('');
    
    console.log('🔗 Explorer Links:');
    console.log(`EOA: https://sepolia.basescan.org/address/${account.address}`);
    console.log(`Smart Account: https://sepolia.basescan.org/address/${SMART_ACCOUNT_ADDRESS}`);
    console.log('');
    
    console.log('💡 Control Options:');
    console.log('• Your EOA private key controls the Smart Account');
    console.log('• You can send transactions from the Smart Account');
    console.log('• Use this script to interact directly with your Smart Account');
    console.log('• All tokens and balances are in the Smart Account');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
