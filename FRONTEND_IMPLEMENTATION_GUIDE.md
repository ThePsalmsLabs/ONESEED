# OneSeed Frontend Implementation Guide

## Overview

The frontend has been structured as an MVP with three core pages: Dashboard, Configure, and Withdraw. All components are built with a polished UI/UX using Tailwind CSS and integrate with the smart contracts via wagmi hooks.

## Architecture

### File Structure

```
src/
├── app/                         # Next.js App Router pages
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Landing page
│   ├── dashboard/page.tsx       # Savings dashboard
│   ├── configure/page.tsx       # Strategy configuration
│   └── withdraw/page.tsx        # Withdrawal interface
│
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── Button.tsx          # Button with variants
│   │   ├── Card.tsx            # Card container
│   │   ├── Input.tsx           # Form input
│   │   ├── Modal.tsx           # Modal dialog
│   │   ├── Toast.tsx           # Toast notifications
│   │   ├── Skeleton.tsx        # Loading skeletons
│   │   ├── EmptyState.tsx      # Empty state component
│   │   ├── Badge.tsx           # Badge/label component
│   │   └── Loading.tsx         # Loading spinner
│   │
│   ├── Dashboard/              # Dashboard-specific components
│   │   ├── SavingsOverview.tsx # Stats overview
│   │   ├── TokenBalanceCard.tsx# Token balance card
│   │   ├── GoalProgress.tsx    # Goal progress bar
│   │   └── RecentActivity.tsx  # Activity feed
│   │
│   ├── Configure/              # Configuration components
│   │   ├── StrategyForm.tsx    # Main strategy form
│   │   ├── TokenTypeSelector.tsx # Token type picker
│   │   ├── PercentageSlider.tsx # Percentage slider
│   │   ├── PreviewCard.tsx     # Savings preview
│   │   └── AdvancedSettings.tsx# Advanced options
│   │
│   ├── Withdraw/               # Withdrawal components
│   │   ├── WithdrawForm.tsx    # Withdrawal form
│   │   ├── TimelockWarning.tsx # Penalty warning
│   │   └── ConfirmationModal.tsx# Confirm dialog
│   │
│   ├── Layout.tsx               # App layout wrapper
│   ├── Header.tsx               # App header
│   ├── Navigation.tsx           # Navigation menu
│   ├── NetworkIndicator.tsx     # Network badge
│   ├── WalletConnect.tsx        # Wallet connection (existing)
│   ├── BiconomyProvider.tsx     # Biconomy setup (existing)
│   └── WalletProvider.tsx       # Wagmi provider (existing)
│
├── contracts/
│   ├── abis/                    # Contract ABIs
│   │   ├── SavingStrategy.ts
│   │   ├── Savings.ts
│   │   ├── Token.ts
│   │   └── index.ts
│   ├── addresses.ts             # Contract addresses
│   └── types.ts                 # TypeScript types
│
├── hooks/
│   ├── useSpendSaveContracts.ts # Contract instances
│   ├── useSavingsStrategy.ts    # Strategy hooks
│   ├── useSavingsBalance.ts     # Balance hooks
│   ├── useWithdraw.ts           # Withdrawal hooks
│   └── useBiconomyTransaction.ts# Biconomy integration
│
├── queries/
│   ├── savings.ts               # TanStack Query for savings
│   └── strategy.ts              # TanStack Query for strategy
│
├── utils/
│   ├── transactions.ts          # Transaction helpers
│   ├── format.ts                # Formatting utilities
│   ├── validation.ts            # Validation functions
│   └── constants.ts             # App constants
│
├── styles/
│   └── tokens.ts                # Design tokens
│
└── config/
    ├── biconomy.ts              # Biconomy config (existing)
    └── wagmi.ts                 # Wagmi config (existing)
```

## Key Features Implemented

### 1. Contract Integration
- **ABIs**: Minimal ABIs for SavingStrategy, Savings, and Token (ERC6909) contracts
- **Addresses**: Multi-network support (Base Sepolia, Base, Localhost)
- **Types**: TypeScript types matching Solidity structs
- **Hooks**: Typed wagmi hooks for all contract interactions

### 2. User Flow

#### Landing Page (`/`)
- Hero section with branding
- Feature highlights
- Wallet connection
- Auto-redirect to dashboard if strategy configured

#### Dashboard (`/dashboard`)
- Savings overview with stats
- Token balance cards showing each saved token
- Goal progress tracker
- Recent activity feed (ready for events)
- Quick withdraw buttons

#### Configure (`/configure`)
- Percentage slider (0-100%)
- Token type selector (INPUT/OUTPUT/SPECIFIC)
- Preview card showing savings calculation
- Advanced settings (auto-increment, max cap, round-up, goals)
- First-time user guidance

#### Withdraw (`/withdraw`)
- Token selector dropdown
- Amount input with "Max" button
- Timelock warning with penalty calculation
- Confirmation modal
- Information about withdrawal rules

### 3. Design System

#### UI Components
- **Button**: 4 variants (primary, secondary, danger, ghost), 3 sizes
- **Card**: Flexible container with header, content, footer
- **Input**: Form input with label, error, helper text
- **Modal**: Portal-based modal with backdrop
- **Toast**: Notification system with 4 types
- **Skeleton**: Loading placeholders
- **Badge**: Status indicators
- **EmptyState**: Empty state templates
- **Loading**: Spinner component

#### Design Tokens
- **Colors**: Primary green palette, gray scale, semantic colors
- **Typography**: Geist Sans/Mono fonts with size scale
- **Spacing**: Consistent spacing scale
- **Shadows**: Multiple shadow depths
- **Border Radius**: Consistent rounding

### 4. State Management
- **TanStack Query**: Caching and auto-refetch on blocks
- **Wagmi**: Contract state and transactions
- **Local State**: Form state with React hooks

### 5. Transaction Handling
- **Biconomy Integration**: Gasless transactions via smart accounts
- **Loading States**: Pending, confirming, success states
- **Error Handling**: User-friendly error messages
- **Transaction Links**: Explorer links for confirmation

## How to Use

### Step 1: Deploy Contracts
1. Deploy the smart contracts to Base Sepolia testnet
2. Update `src/contracts/addresses.ts` with deployed addresses

### Step 2: Run the App
```bash
npm run dev
```

### Step 3: User Journey
1. **Connect Wallet**: Click "Connect Wallet" on landing page
2. **Configure Strategy**: First-time users are guided to `/configure`
   - Set savings percentage (e.g., 5%)
   - Choose token type (INPUT recommended for beginners)
   - Optional: Enable auto-increment, set goals
   - Click "Save Strategy"
3. **View Dashboard**: Automatically redirected to `/dashboard`
   - See total savings
   - View balances per token
   - Track goal progress
4. **Withdraw**: Navigate to `/withdraw`
   - Select token to withdraw
   - Enter amount
   - Review penalty if applicable
   - Confirm withdrawal

## Contract Deployment Checklist

Before the frontend works, you need to:

- [ ] Deploy `SpendSaveStorage` contract
- [ ] Deploy `SpendSaveHook` contract
- [ ] Deploy `SavingStrategy` module
- [ ] Deploy `Savings` module
- [ ] Deploy `Token` (ERC6909) module
- [ ] Deploy `SlippageControl` module
- [ ] Initialize all modules with cross-references
- [ ] Update `src/contracts/addresses.ts` with addresses
- [ ] Test contract interactions on testnet

## Integration Points

### Biconomy Smart Account
The `useBiconomyTransaction` hook wraps all write operations:
```typescript
const { sendTransaction } = useBiconomyTransaction();
await sendTransaction(contractAddress, encodedData);
```

### Wagmi Contract Hooks
All reads use wagmi's `useReadContract`:
```typescript
const { data, isLoading } = useReadContract({
  address: contractAddress,
  abi: contractABI,
  functionName: 'getUserStrategy',
  args: [userAddress]
});
```

### Auto-Refresh on Blocks
TanStack Query automatically refetches data when new blocks are mined:
```typescript
const { data: blockNumber } = useBlockNumber({ watch: true });
```

## Customization Guide

### Change Theme Colors
Edit `src/app/globals.css`:
```css
:root {
  --color-primary-500: 34 197 94; /* Change to your brand color */
}
```

### Add New Page
1. Create page file in `src/app/[name]/page.tsx`
2. Add route to `Navigation.tsx`
3. Wrap with `<Layout>` component

### Add New Contract Function
1. Add to relevant ABI in `src/contracts/abis/`
2. Create hook in `src/hooks/`
3. Use in component

## Error Handling

### User-Facing Errors
All errors are caught and displayed via toast notifications:
- Transaction failures
- Insufficient balance
- Invalid inputs
- Network issues

### Empty States
All pages handle empty data gracefully:
- No savings yet → Empty state with guidance
- No strategy → Redirect to configure
- No wallet → Redirect to home

## Mobile Responsiveness

- **Mobile**: Bottom navigation bar
- **Tablet**: Sidebar navigation
- **Desktop**: Full sidebar with larger content area

All components are mobile-first and fully responsive.

## Accessibility

- Keyboard navigation supported
- ARIA labels on interactive elements
- Focus states on all inputs/buttons
- Screen reader friendly
- Semantic HTML

## Performance Optimizations

- Code splitting per page
- Lazy loading of modals and heavy components
- Optimized contract reads (only fetch when needed)
- Cached queries with TanStack Query
- Loading skeletons for better perceived performance

## Next Steps

### Immediate
1. Deploy contracts to testnet
2. Update contract addresses
3. Test full user flow
4. Add real token metadata (symbols, decimals, icons)

### Future Enhancements
- DCA page and functionality
- Daily savings configuration
- Analytics dashboard
- Transaction history with events
- Token price integration (CoinGecko/Uniswap)
- USD value display
- Savings charts/graphs
- Export data functionality
- Dark mode support

## Troubleshooting

### "Contract not deployed" error
- Check `src/contracts/addresses.ts` has correct addresses
- Verify you're on the correct network

### "Smart account not initialized"
- Wait for Biconomy to initialize after wallet connection
- Check Biconomy API keys in `.env.local`

### Transactions not working
- Ensure contracts are deployed and initialized
- Check user has sufficient balance
- Verify network connection
- Check browser console for detailed errors

## Development Tips

- Use `npm run dev` for hot reload
- Check browser console for contract interaction logs
- Use React DevTools to inspect component state
- Test on multiple screen sizes
- Clear localStorage if weird behavior occurs

---

**The MVP is ready to use once contracts are deployed!** 🎉



