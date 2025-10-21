/**
 * SpendSave Quoter Contract ABI
 * TypeScript Definition
 * Off-chain quote calculations for swaps, DCA, and savings impact
 */

export const SpendSaveQuoterABI = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_storage",
          type: "address",
        },
        {
          internalType: "address",
          name: "_quoter",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "Currency",
              name: "currency0",
              type: "address",
            },
            {
              internalType: "Currency",
              name: "currency1",
              type: "address",
            },
            {
              internalType: "uint24",
              name: "fee",
              type: "uint24",
            },
            {
              internalType: "int24",
              name: "tickSpacing",
              type: "int24",
            },
            {
              internalType: "contract IHooks",
              name: "hooks",
              type: "address",
            },
          ],
          internalType: "struct PoolKey",
          name: "poolKey",
          type: "tuple",
        },
        {
          internalType: "bool",
          name: "zeroForOne",
          type: "bool",
        },
        {
          internalType: "uint128",
          name: "amountIn",
          type: "uint128",
        },
      ],
      name: "getDCAQuote",
      outputs: [
        {
          internalType: "uint256",
          name: "amountOut",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "gasEstimate",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "Currency",
          name: "startingCurrency",
          type: "address",
        },
        {
          components: [
            {
              internalType: "Currency",
              name: "intermediateCurrency",
              type: "address",
            },
            {
              internalType: "uint24",
              name: "fee",
              type: "uint24",
            },
            {
              internalType: "int24",
              name: "tickSpacing",
              type: "int24",
            },
            {
              internalType: "contract IHooks",
              name: "hooks",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "hookData",
              type: "bytes",
            },
          ],
          internalType: "struct PathKey[]",
          name: "path",
          type: "tuple[]",
        },
        {
          internalType: "uint128",
          name: "amountIn",
          type: "uint128",
        },
      ],
      name: "previewMultiHopRouting",
      outputs: [
        {
          internalType: "uint256",
          name: "amountOut",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "gasEstimate",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "Currency",
              name: "currency0",
              type: "address",
            },
            {
              internalType: "Currency",
              name: "currency1",
              type: "address",
            },
            {
              internalType: "uint24",
              name: "fee",
              type: "uint24",
            },
            {
              internalType: "int24",
              name: "tickSpacing",
              type: "int24",
            },
            {
              internalType: "contract IHooks",
              name: "hooks",
              type: "address",
            },
          ],
          internalType: "struct PoolKey",
          name: "poolKey",
          type: "tuple",
        },
        {
          internalType: "bool",
          name: "zeroForOne",
          type: "bool",
        },
        {
          internalType: "uint128",
          name: "amountIn",
          type: "uint128",
        },
        {
          internalType: "uint256",
          name: "savingsPercentage",
          type: "uint256",
        },
      ],
      name: "previewSavingsImpact",
      outputs: [
        {
          internalType: "uint256",
          name: "swapOutput",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "savedAmount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "netOutput",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "quoter",
      outputs: [
        {
          internalType: "contract V4Quoter",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "storage_",
      outputs: [
        {
          internalType: "contract SpendSaveStorage",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ] as const;
  
  // Type definitions
  
  export interface PoolKey {
    currency0: string;
    currency1: string;
    fee: number;
    tickSpacing: number;
    hooks: string;
  }
  
  export interface PathKey {
    intermediateCurrency: string;
    fee: number;
    tickSpacing: number;
    hooks: string;
    hookData: string;
  }
  
  export interface DCAQuote {
    amountOut: bigint;
    gasEstimate: bigint;
  }
  
  export interface MultiHopQuote {
    amountOut: bigint;
    gasEstimate: bigint;
    path: PathKey[];
  }
  
  export interface SavingsImpact {
    swapOutput: bigint;
    savedAmount: bigint;
    netOutput: bigint;
    savingsPercentage: number;
    effectiveRate: number; // net output / swap output as percentage
  }
  
  export interface QuoteParams {
    poolKey: PoolKey;
    zeroForOne: boolean;
    amountIn: bigint;
  }
  
  export interface MultiHopParams {
    startingCurrency: string;
    path: PathKey[];
    amountIn: bigint;
  }
  
  export interface SavingsImpactParams {
    poolKey: PoolKey;
    zeroForOne: boolean;
    amountIn: bigint;
    savingsPercentage: number; // basis points
  }
  
  // Helper types
  export type Address = `0x${string}`;
  export type BasisPoints = number;
  
  // Helper functions
  
  /**
   * Calculate effective swap rate after savings
   * @param swapOutput - Output without savings
   * @param netOutput - Actual output received after savings
   * @returns Percentage of original output received
   */
  export const calculateEffectiveRate = (
    swapOutput: bigint,
    netOutput: bigint
  ): number => {
    if (swapOutput === BigInt(0)) return 0;
    return Number((netOutput * BigInt(10000)) / swapOutput) / 100;
  };
  
  /**
   * Calculate price impact percentage
   * @param amountIn - Input amount
   * @param amountOut - Output amount
   * @param expectedRate - Expected rate (amountOut/amountIn)
   * @returns Price impact percentage
   */
  export const calculatePriceImpact = (
    amountIn: bigint,
    amountOut: bigint,
    expectedRate: bigint
  ): number => {
    if (amountIn === BigInt(0)) return 0;
    const expectedOut = (amountIn * expectedRate) / BigInt(10) ** BigInt(18);
    if (expectedOut === BigInt(0)) return 0;
    const impact = ((expectedOut - amountOut) * BigInt(10000)) / expectedOut;
    return Number(impact) / 100;
  };
  
  /**
   * Convert basis points to percentage
   * @param bps - Basis points (100 = 1%)
   * @returns Percentage
   */
  export const bpsToPercent = (bps: number): number => bps / 100;
  
  /**
   * Calculate total gas cost in ETH
   * @param gasEstimate - Estimated gas units
   * @param gasPrice - Gas price in wei
   * @returns Gas cost in ETH (as string)
   */
  export const calculateGasCost = (
    gasEstimate: bigint,
    gasPrice: bigint
  ): string => {
    const cost = gasEstimate * gasPrice;
    return (Number(cost) / 1e18).toFixed(6);
  };
  
  /**
   * Compare quotes and find best route
   * @param quotes - Array of quotes with paths
   * @returns Best quote with highest amountOut
   */
  export const findBestQuote = (
    quotes: Array<{ amountOut: bigint; path: string; gasEstimate: bigint }>
  ): typeof quotes[0] | null => {
    if (quotes.length === 0) return null;
    return quotes.reduce((best, current) => 
      current.amountOut > best.amountOut ? current : best
    );
  };
  
  // Example usage with ethers.js v6:
  // import { ethers } from 'ethers';
  // import {
  //   SpendSaveQuoterABI,
  //   PoolKey,
  //   PathKey,
  //   calculateEffectiveRate,
  //   calculateGasCost,
  // } from './quoter-abi';
  //
  // const contract = new ethers.Contract(address, SpendSaveQuoterABI, provider);
  //
  // // ===== SINGLE POOL DCA QUOTE =====
  //
  // const poolKey: PoolKey = {
  //   currency0: usdcAddress,
  //   currency1: wethAddress,
  //   fee: 3000, // 0.3% fee tier
  //   tickSpacing: 60,
  //   hooks: hookAddress,
  // };
  //
  // // Get quote for DCA swap
  // const [amountOut, gasEstimate] = await contract.getDCAQuote(
  //   poolKey,
  //   true, // USDC -> WETH (token0 to token1)
  //   ethers.parseUnits("1000", 6) // 1000 USDC
  // );
  //
  // console.log('DCA Quote:');
  // console.log('  Input: 1000 USDC');
  // console.log('  Output:', ethers.formatEther(amountOut), 'WETH');
  // console.log('  Gas estimate:', gasEstimate.toString());
  //
  // // Calculate gas cost
  // const gasPrice = await provider.getFeeData();
  // const gasCost = calculateGasCost(gasEstimate, gasPrice.gasPrice!);
  // console.log('  Estimated gas cost:', gasCost, 'ETH');
  //
  // // ===== MULTI-HOP ROUTING QUOTE =====
  //
  // // Example: USDC -> DAI -> WETH (2-hop route)
  // const path: PathKey[] = [
  //   {
  //     intermediateCurrency: daiAddress,
  //     fee: 500, // 0.05% for USDC/DAI
  //     tickSpacing: 10,
  //     hooks: hookAddress,
  //     hookData: '0x',
  //   },
  //   {
  //     intermediateCurrency: wethAddress,
  //     fee: 3000, // 0.3% for DAI/WETH
  //     tickSpacing: 60,
  //     hooks: hookAddress,
  //     hookData: '0x',
  //   },
  // ];
  //
  // const [multiHopOut, multiHopGas] = await contract.previewMultiHopRouting(
  //   usdcAddress, // starting currency
  //   path,
  //   ethers.parseUnits("1000", 6)
  // );
  //
  // console.log('Multi-hop Quote:');
  // console.log('  Route: USDC -> DAI -> WETH');
  // console.log('  Output:', ethers.formatEther(multiHopOut), 'WETH');
  // console.log('  Gas estimate:', multiHopGas.toString());
  //
  // // Compare with direct route
  // if (multiHopOut > amountOut) {
  //   console.log('✅ Multi-hop route is better!');
  //   const improvement = ((multiHopOut - amountOut) * 10000n) / amountOut;
  //   console.log(`  ${Number(improvement) / 100}% more output`);
  // } else {
  //   console.log('✅ Direct route is better!');
  // }
  //
  // // ===== PREVIEW SAVINGS IMPACT =====
  //
  // // See how savings percentage affects output
  // const savingsPercentage = 1000; // 10% savings
  //
  // const [swapOutput, savedAmount, netOutput] = await contract.previewSavingsImpact(
  //   poolKey,
  //   true, // USDC -> WETH
  //   ethers.parseUnits("1000", 6),
  //   savingsPercentage
  // );
  //
  // console.log('Savings Impact Analysis:');
  // console.log('  Input amount: 1000 USDC');
  // console.log('  Savings rate:', bpsToPercent(savingsPercentage), '%');
  // console.log('  Full swap output:', ethers.formatEther(swapOutput), 'WETH');
  // console.log('  Amount saved:', ethers.formatUnits(savedAmount, 6), 'USDC');
  // console.log('  Net output:', ethers.formatEther(netOutput), 'WETH');
  //
  // const effectiveRate = calculateEffectiveRate(swapOutput, netOutput);
  // console.log('  Effective rate:', effectiveRate.toFixed(2), '%');
  //
  // // ===== COMPARE DIFFERENT SAVINGS RATES =====
  //
  // const savingsRates = [0, 500, 1000, 2000, 5000]; // 0%, 0.5%, 1%, 2%, 5%
  // console.log('\nSavings Rate Comparison:');
  //
  // for (const rate of savingsRates) {
  //   const [_, saved, net] = await contract.previewSavingsImpact(
  //     poolKey,
  //     true,
  //     ethers.parseUnits("1000", 6),
  //     rate
  //   );
  //   
  //   console.log(`\n${bpsToPercent(rate)}% savings rate:`);
  //   console.log('  Saved:', ethers.formatUnits(saved, 6), 'USDC');
  //   console.log('  Net output:', ethers.formatEther(net), 'WETH');
  // }
  //
  // // ===== QUOTE MULTIPLE ROUTES AND FIND BEST =====
  //
  // const routes = [
  //   { name: 'Direct', path: [] },
  //   { name: 'Via DAI', path: [{ intermediateCurrency: daiAddress, fee: 500, tickSpacing: 10, hooks: hookAddress, hookData: '0x' }] },
  //   { name: 'Via USDT', path: [{ intermediateCurrency: usdtAddress, fee: 500, tickSpacing: 10, hooks: hookAddress, hookData: '0x' }] },
  // ];
  //
  // const quotes = [];
  //
  // for (const route of routes) {
  //   if (route.path.length === 0) {
  //     // Direct route
  //     const [out, gas] = await contract.getDCAQuote(
  //       poolKey,
  //       true,
  //       ethers.parseUnits("1000", 6)
  //     );
  //     quotes.push({ name: route.name, amountOut: out, gasEstimate: gas });
  //   } else {
  //     // Multi-hop route
  //     const [out, gas] = await contract.previewMultiHopRouting(
  //       usdcAddress,
  //       route.path,
  //       ethers.parseUnits("1000", 6)
  //     );
  //     quotes.push({ name: route.name, amountOut: out, gasEstimate: gas });
  //   }
  // }
  //
  // // Find and display best route
  // console.log('\nRoute Comparison:');
  // quotes.forEach(quote => {
  //   console.log(`${quote.name}:`);
  //   console.log('  Output:', ethers.formatEther(quote.amountOut), 'WETH');
  //   console.log('  Gas:', quote.gasEstimate.toString());
  // });
  //
  // const bestQuote = quotes.reduce((best, current) => 
  //   current.amountOut > best.amountOut ? current : best
  // );
  // console.log(`\n✅ Best route: ${bestQuote.name}`);
  //
  // // ===== CALCULATE OPTIMAL SAVINGS RATE =====
  //
  // // Find savings rate that maximizes value (net output - opportunity cost)
  // const findOptimalSavingsRate = async (
  //   targetSavingsGoal: bigint,
  //   swapAmount: bigint
  // ): Promise<number> => {
  //   let optimalRate = 0;
  //   let maxValue = 0n;
  //   
  //   for (let rate = 0; rate <= 5000; rate += 100) {
  //     const [swapOut, saved, netOut] = await contract.previewSavingsImpact(
  //       poolKey,
  //       true,
  //       swapAmount,
  //       rate
  //     );
  //     
  //     // Simple value function: prioritize reaching savings goal
  //     const progressToGoal = saved * 100n / targetSavingsGoal;
  //     const value = netOut + (progressToGoal * saved);
  //     
  //     if (value > maxValue) {
  //       maxValue = value;
  //       optimalRate = rate;
  //     }
  //   }
  //   
  //   return optimalRate;
  // };
  //
  // const optimalRate = await findOptimalSavingsRate(
  //   ethers.parseUnits("10000", 6), // goal: 10k USDC saved
  //   ethers.parseUnits("1000", 6)   // swap: 1k USDC
  // );
  // console.log('Optimal savings rate:', bpsToPercent(optimalRate), '%');
  
  // With viem:
  // import { getContract, parseUnits, formatEther } from 'viem';
  // import { SpendSaveQuoterABI, calculateEffectiveRate } from './quoter-abi';
  //
  // const contract = getContract({
  //   address: quoterAddress,
  //   abi: SpendSaveQuoterABI,
  //   client: publicClient,
  // });
  //
  // // Get DCA quote
  // const [amountOut, gasEstimate] = await contract.read.getDCAQuote([
  //   poolKey,
  //   true,
  //   parseUnits("1000", 6),
  // ]);
  //
  // console.log('Output:', formatEther(amountOut), 'WETH');
  // console.log('Gas:', gasEstimate.toString());
  //
  // // Preview multi-hop
  // const [multiHopOut, multiHopGas] = await contract.read.previewMultiHopRouting([
  //   startingCurrency,
  //   path,
  //   parseUnits("1000", 6),
  // ]);
  //
  // // Preview savings impact
  // const [swapOutput, savedAmount, netOutput] = await contract.read.previewSavingsImpact([
  //   poolKey,
  //   true,
  //   parseUnits("1000", 6),
  //   1000n, // 10% savings
  // ]);
  //
  // const effectiveRate = calculateEffectiveRate(swapOutput, netOutput);
  // console.log('Effective rate after savings:', effectiveRate, '%');
  
  // UI Helper: Format quote for display
  export const formatQuote = (quote: DCAQuote, decimals: number = 18): {
    output: string;
    gas: string;
  } => {
    return {
      output: (Number(quote.amountOut) / 10 ** decimals).toFixed(6),
      gas: quote.gasEstimate.toString(),
    };
  };
  
  // UI Helper: Format savings impact for display
  export const formatSavingsImpact = (
    impact: SavingsImpact,
    inputDecimals: number = 6,
    outputDecimals: number = 18
  ): {
    saved: string;
    netOutput: string;
    effectiveRate: string;
  } => {
    return {
      saved: (Number(impact.savedAmount) / 10 ** inputDecimals).toFixed(2),
      netOutput: (Number(impact.netOutput) / 10 ** outputDecimals).toFixed(6),
      effectiveRate: impact.effectiveRate.toFixed(2) + '%',
    };
  };
  
  // Advanced: Price impact calculator
  export interface PriceImpactAnalysis {
    priceImpact: number;
    effectivePricePerToken: bigint;
    isHighImpact: boolean;
  }
  
  export const analyzePriceImpact = (
    amountIn: bigint,
    amountOut: bigint,
    spotPrice: bigint, // expected rate without impact
    highImpactThreshold: number = 1.0 // 1% threshold
  ): PriceImpactAnalysis => {
    const priceImpact = calculatePriceImpact(amountIn, amountOut, spotPrice);
    const effectivePricePerToken = (amountOut * BigInt(10) ** BigInt(18)) / amountIn;
    
    return {
      priceImpact,
      effectivePricePerToken,
      isHighImpact: Math.abs(priceImpact) > highImpactThreshold,
    };
  };