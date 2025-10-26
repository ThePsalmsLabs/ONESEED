# SpendSave Protocol Subgraph

This subgraph indexes the SpendSave Protocol smart contracts on Base Sepolia and provides GraphQL APIs for querying protocol data.

## Overview

The SpendSave Protocol subgraph tracks:
- User savings and DCA activities
- Strategy executions and performance
- Pool statistics and transactions
- Token prices and metadata
- Protocol-wide analytics

## Entities

### Core Entities
- **User**: User profiles and statistics
- **Strategy**: User-defined DCA strategies
- **StrategyExecution**: Individual strategy executions
- **SavingsEvent**: Savings deposit/withdrawal events
- **DCAEvent**: DCA execution events
- **WithdrawalEvent**: Withdrawal events

### Pool & Token Entities
- **Pool**: Uniswap V4 pool information
- **PoolTransaction**: Pool swap transactions
- **Token**: Token metadata and statistics
- **TokenPrice**: Historical token prices

### Analytics Entities
- **ProtocolStats**: Protocol-wide statistics
- **DailyStats**: Daily aggregated statistics
- **HourlyStats**: Hourly aggregated statistics

## Setup

1. Install dependencies:
```bash
npm install
```

2. Generate code:
```bash
npm run codegen
```

3. Build the subgraph:
```bash
npm run build
```

## Deployment

### Local Deployment
1. Start a local Graph node:
```bash
graph node --ipfs http://localhost:5001 --http-port 8020 --ws-port 8030 --admin-port 8040
```

2. Create the subgraph:
```bash
npm run create-local
```

3. Deploy the subgraph:
```bash
npm run deploy-local
```

### Production Deployment
1. Deploy to The Graph Network:
```bash
npm run deploy
```

## Configuration

Update the following in `subgraph.yaml`:
- Contract addresses
- Start blocks
- Network configuration

## Queries

### User Queries
```graphql
query GetUserPortfolio($userAddress: String!) {
  user(id: $userAddress) {
    totalSaved
    totalDCA
    netGrowth
    strategies {
      name
      isActive
      totalExecutions
    }
  }
}
```

### Protocol Queries
```graphql
query GetProtocolStats {
  protocolStats(id: "protocol") {
    totalUsers
    totalVolume
    successRate
  }
}
```

### Historical Data
```graphql
query GetDailyStats {
  dailyStats(orderBy: date, orderDirection: desc, first: 30) {
    date
    totalUsers
    totalVolume
    successRate
  }
}
```

## Testing

Run tests:
```bash
npm test
```

## Monitoring

Monitor the subgraph health and performance through:
- The Graph Explorer
- Subgraph logs
- Query performance metrics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License
