export const SavingStrategyABI = [
  {
    type: "function",
    name: "getUserStrategy",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      { name: "percentage", type: "uint256" },
      { name: "autoIncrement", type: "uint256" },
      { name: "maxPercentage", type: "uint256" },
      { name: "roundUpSavings", type: "bool" },
      { name: "savingsTokenType", type: "uint8" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "setSavingStrategy",
    inputs: [
      { name: "user", type: "address" },
      { name: "percentage", type: "uint256" },
      { name: "autoIncrement", type: "uint256" },
      { name: "maxPercentage", type: "uint256" },
      { name: "roundUpSavings", type: "bool" },
      { name: "savingsTokenType", type: "uint8" },
      { name: "specificSavingsToken", type: "address" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "hasActiveStrategy",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "hasStrategy", type: "bool" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "previewSavings",
    inputs: [
      { name: "user", type: "address" },
      { name: "swapAmount", type: "uint256" }
    ],
    outputs: [
      { name: "saveAmount", type: "uint256" },
      { name: "remainingSwapAmount", type: "uint256" }
    ],
    stateMutability: "view"
  }
] as const;

