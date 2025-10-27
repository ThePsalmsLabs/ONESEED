# OneSeed 🌱

A personal savings protocol built on Uniswap V4 that automatically saves a portion of every transaction you make.

## 🎥 Video Demonstration

**For judges and reviewers:** Watch the complete protocol demonstration and walkthrough:
**[📺 OneSeed Protocol Demo Video](https://www.loom.com/share/0f10c094824945dfa45a9ae421494a1b)**

This video showcases the full functionality, user interface, and technical implementation of the OneSeed protocol.

## What is This?

OneSeed is my exploration into automated savings through DeFi. The idea is simple: **every time you swap tokens, a percentage automatically goes into savings**. No manual transfers, no forgetting to save - it just happens.

## How It Works

When you make a swap on Uniswap V4, a custom hook intercepts the transaction:
- Takes a small percentage (you configure this - could be 1%, 5%, 10%, whatever)
- Diverts it to your personal savings vault
- Tracks it as an ERC6909 token so you can see your balance
- The rest of your swap continues normally

It's like having a digital piggy bank that fills itself every time you transact.

## The Tech

### Frontend
Built with Next.js 15 and integrates **Biconomy** for account abstraction - meaning gasless transactions and a smoother Web3 experience. Uses Reown AppKit for wallet connectivity.

### Smart Contracts (The Interesting Part)

**SpendSaveHook** - The core Uniswap V4 hook that intercepts swaps
- `beforeSwap()`: Calculates how much to save
- `afterSwap()`: Processes and stores the savings
- Target: Under 50k gas overhead

**SpendSaveStorage** - Central storage using packed structs for gas optimization
- Single storage slot reads instead of multiple
- Transient storage (EIP-1153) for temporary data
- Module registry for clean architecture

**8 Specialized Modules:**
1. **Savings** - Core savings processing and withdrawals
2. **SavingStrategy** - Configure your savings percentage, auto-increment, goals
3. **DCA (Dollar-Cost Averaging)** - Automatically convert saved tokens to a target asset over time
4. **DailySavings** - Set daily savings goals with penalty-based withdrawals
5. **Token** - ERC6909 implementation (more efficient than ERC20)
6. **SlippageControl** - Protect yourself from bad prices
7. **Analytics, Quoter, Router, etc.** - Helper modules

## Features I'm Exploring

### Flexible Savings Strategies
- **Input Token Savings**: Save from what you're spending
- **Output Token Savings**: Save from what you're receiving  
- **Specific Token Savings**: Convert and save to a particular token (like USDC)
- **Round-up Savings**: Round fractional amounts up for micro-savings

### Smart DCA
Instead of just sitting there, your savings can automatically DCA into a target asset:
- Tick-based execution (execute when price moves favorably)
- Queue management for pending conversions
- Slippage protection
- Batch execution for gas efficiency

### Daily Savings Goals
Set a daily savings target with penalties for early withdrawal - gamifying the savings habit.

### Gas Optimization
Heavy focus on minimizing gas costs:
- Packed storage patterns (one storage read instead of many)
- Transient storage for temporary data
- Batch operations
- In-memory calculations

## Why Uniswap V4 Hooks?

Hooks let you inject custom logic into the swap lifecycle without forking or wrapping the protocol. Perfect for:
- Automatic savings on every swap
- No additional transactions needed
- Native integration with the DEX
- Gas efficient since it's part of the swap flow

## The Testing

30+ test suites covering everything from basic functionality to gas optimization to security. Testing DCA lifecycle, daily savings, hook integration, module communication, reentrancy protection, etc.

## Current State

This is a **personal project** and exploration. The contracts are written, tested, and optimized. Frontend is basic but functional with Biconomy integration for smoother UX.

**Not audited. Not deployed to mainnet. Experimental.**

## The Vision

The idea of "save while you spend" appeals to me - making savings automatic and unconscious. DeFi gives us programmable money, so why not program it to help us save?

OneSeed is my attempt at building:
- A non-custodial savings protocol
- With flexible strategies
- That's gas-efficient enough to use regularly
- And leverages Uniswap V4's hook system

---

Built with Uniswap V4, Biconomy, Next.js, and a lot of Solidity.

This is a learning project exploring the intersection of DeFi, automated savings, and gas optimization.
