import { BigInt, ethereum, log } from "@graphprotocol/graph-ts"
import {
  User,
  Strategy,
  StrategyExecution,
  SavingsEvent,
  DCAEvent,
  WithdrawalEvent,
  Pool,
  PoolTransaction,
  Token,
  TokenPrice,
  ProtocolStats,
  DailyStats,
  HourlyStats
} from "../generated/schema"

// Event handlers for SpendSaveStorage contract
export function handleSavingsIncreased(event: ethereum.Event): void {
  let user = getUser(event.params[0].toHexString())
  let token = getToken(event.params[1].toHexString())
  
  // Update user statistics
  user.totalSaved = user.totalSaved.plus(event.params[2].toBigInt())
  user.lastActivity = event.block.timestamp
  user.save()
  
  // Create savings event
  let savingsEvent = new SavingsEvent(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  )
  savingsEvent.user = user.id
  savingsEvent.timestamp = event.block.timestamp
  savingsEvent.blockNumber = event.block.number
  savingsEvent.transactionHash = event.transaction.hash.toHexString()
  savingsEvent.token = token.id
  savingsEvent.amount = event.params[2].toBigInt()
  savingsEvent.balance = event.params[3].toBigInt()
  savingsEvent.eventType = "SavingsIncreased"
  savingsEvent.from = event.transaction.from.toHexString()
  savingsEvent.to = event.transaction.to!.toHexString()
  savingsEvent.save()
  
  // Update daily stats
  updateDailyStats(event.block.timestamp, "savings_increased", event.params[2].toBigInt())
}

export function handleSavingsDecreased(event: ethereum.Event): void {
  let user = getUser(event.params[0].toHexString())
  let token = getToken(event.params[1].toHexString())
  
  // Update user statistics
  user.totalSaved = user.totalSaved.minus(event.params[2].toBigInt())
  user.lastActivity = event.block.timestamp
  user.save()
  
  // Create savings event
  let savingsEvent = new SavingsEvent(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  )
  savingsEvent.user = user.id
  savingsEvent.timestamp = event.block.timestamp
  savingsEvent.blockNumber = event.block.number
  savingsEvent.transactionHash = event.transaction.hash.toHexString()
  savingsEvent.token = token.id
  savingsEvent.amount = event.params[2].toBigInt()
  savingsEvent.balance = event.params[3].toBigInt()
  savingsEvent.eventType = "SavingsDecreased"
  savingsEvent.from = event.transaction.from.toHexString()
  savingsEvent.to = event.transaction.to!.toHexString()
  savingsEvent.save()
  
  // Update daily stats
  updateDailyStats(event.block.timestamp, "savings_decreased", event.params[2].toBigInt())
}

export function handleSavingsWithdrawn(event: ethereum.Event): void {
  let user = getUser(event.params[0].toHexString())
  let token = getToken(event.params[1].toHexString())
  
  // Update user statistics
  user.totalWithdrawn = user.totalWithdrawn.plus(event.params[2].toBigInt())
  user.lastActivity = event.block.timestamp
  user.save()
  
  // Create withdrawal event
  let withdrawalEvent = new WithdrawalEvent(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  )
  withdrawalEvent.user = user.id
  withdrawalEvent.timestamp = event.block.timestamp
  withdrawalEvent.blockNumber = event.block.number
  withdrawalEvent.transactionHash = event.transaction.hash.toHexString()
  withdrawalEvent.token = token.id
  withdrawalEvent.amount = event.params[2].toBigInt()
  withdrawalEvent.balance = event.params[3].toBigInt()
  withdrawalEvent.withdrawalType = "partial" // Would need to determine from event data
  withdrawalEvent.from = event.transaction.from.toHexString()
  withdrawalEvent.to = event.transaction.to!.toHexString()
  withdrawalEvent.save()
  
  // Update daily stats
  updateDailyStats(event.block.timestamp, "savings_withdrawn", event.params[2].toBigInt())
}

export function handleDCAExecuted(event: ethereum.Event): void {
  let user = getUser(event.params[0].toHexString())
  let fromToken = getToken(event.params[1].toHexString())
  let toToken = getToken(event.params[2].toHexString())
  
  // Update user statistics
  user.totalDCA = user.totalDCA.plus(event.params[3].toBigInt())
  user.dcaExecutions = user.dcaExecutions.plus(BigInt.fromI32(1))
  user.lastActivity = event.block.timestamp
  user.save()
  
  // Create DCA event
  let dcaEvent = new DCAEvent(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  )
  dcaEvent.user = user.id
  dcaEvent.timestamp = event.block.timestamp
  dcaEvent.blockNumber = event.block.number
  dcaEvent.transactionHash = event.transaction.hash.toHexString()
  dcaEvent.fromToken = fromToken.id
  dcaEvent.toToken = toToken.id
  dcaEvent.amountIn = event.params[3].toBigInt()
  dcaEvent.amountOut = event.params[4].toBigInt()
  dcaEvent.executedPrice = event.params[5].toBigInt()
  dcaEvent.slippage = event.params[6].toBigInt()
  dcaEvent.success = true
  dcaEvent.poolAddress = event.transaction.to!.toHexString()
  dcaEvent.poolFee = BigInt.fromI32(3000) // Default fee
  dcaEvent.save()
  
  // Update daily stats
  updateDailyStats(event.block.timestamp, "dca_executed", event.params[3].toBigInt())
}

export function handleStrategyCreated(event: ethereum.Event): void {
  let user = getUser(event.params[0].toHexString())
  let strategyId = event.params[1].toBigInt()
  
  // Create strategy
  let strategy = new Strategy(
    user.id + "-" + strategyId.toString()
  )
  strategy.user = user.id
  strategy.name = event.params[2].toString()
  strategy.description = event.params[3].toString()
  strategy.isActive = true
  strategy.createdAt = event.block.timestamp
  strategy.updatedAt = event.block.timestamp
  strategy.totalExecutions = BigInt.fromI32(0)
  strategy.successfulExecutions = BigInt.fromI32(0)
  strategy.totalVolume = BigInt.fromI32(0)
  strategy.averageExecutionPrice = BigInt.fromI32(0)
  strategy.totalFees = BigInt.fromI32(0)
  strategy.save()
  
  // Update daily stats
  updateDailyStats(event.block.timestamp, "strategy_created", BigInt.fromI32(1))
}

export function handleStrategyUpdated(event: ethereum.Event): void {
  let user = getUser(event.params[0].toHexString())
  let strategyId = event.params[1].toBigInt()
  let strategy = Strategy.load(user.id + "-" + strategyId.toString())
  
  if (strategy) {
    strategy.name = event.params[2].toString()
    strategy.description = event.params[3].toString()
    strategy.updatedAt = event.block.timestamp
    strategy.save()
  }
}

export function handleStrategyDeactivated(event: ethereum.Event): void {
  let user = getUser(event.params[0].toHexString())
  let strategyId = event.params[1].toBigInt()
  let strategy = Strategy.load(user.id + "-" + strategyId.toString())
  
  if (strategy) {
    strategy.isActive = false
    strategy.updatedAt = event.block.timestamp
    strategy.save()
  }
}

// Event handlers for Uniswap V4 Pool Manager
export function handlePoolInitialized(event: ethereum.Event): void {
  let poolAddress = event.params[0].toHexString()
  let token0 = getToken(event.params[1].toHexString())
  let token1 = getToken(event.params[2].toHexString())
  
  // Create pool
  let pool = new Pool(poolAddress)
  pool.token0 = token0.id
  pool.token1 = token1.id
  pool.fee = event.params[3].toBigInt()
  pool.tickSpacing = event.params[4].toBigInt()
  pool.liquidity = BigInt.fromI32(0)
  pool.sqrtPriceX96 = BigInt.fromI32(0)
  pool.tick = BigInt.fromI32(0)
  pool.totalVolume = BigInt.fromI32(0)
  pool.totalFees = BigInt.fromI32(0)
  pool.totalTransactions = BigInt.fromI32(0)
  pool.averageSlippage = BigInt.fromI32(0)
  pool.save()
}

export function handleSwap(event: ethereum.Event): void {
  let poolAddress = event.params[0].toHexString()
  let pool = Pool.load(poolAddress)
  
  if (pool) {
    // Update pool statistics
    pool.totalTransactions = pool.totalTransactions.plus(BigInt.fromI32(1))
    pool.totalVolume = pool.totalVolume.plus(event.params[3].toBigInt().abs())
    pool.totalFees = pool.totalFees.plus(event.params[4].toBigInt())
    pool.save()
    
    // Create pool transaction
    let poolTransaction = new PoolTransaction(
      event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
    )
    poolTransaction.pool = pool.id
    poolTransaction.timestamp = event.block.timestamp
    poolTransaction.blockNumber = event.block.number
    poolTransaction.transactionHash = event.transaction.hash.toHexString()
    poolTransaction.user = event.transaction.from.toHexString()
    poolTransaction.amount0In = event.params[1].toBigInt()
    poolTransaction.amount1In = event.params[2].toBigInt()
    poolTransaction.amount0Out = event.params[3].toBigInt()
    poolTransaction.amount1Out = event.params[4].toBigInt()
    poolTransaction.price = event.params[5].toBigInt()
    poolTransaction.slippage = event.params[6].toBigInt()
    poolTransaction.transactionType = "swap"
    poolTransaction.save()
  }
}

// Helper functions
function getUser(address: string): User {
  let user = User.load(address)
  if (!user) {
    user = new User(address)
    user.totalSaved = BigInt.fromI32(0)
    user.totalDCA = BigInt.fromI32(0)
    user.totalWithdrawn = BigInt.fromI32(0)
    user.netGrowth = BigInt.fromI32(0)
    user.averageDailySave = BigInt.fromI32(0)
    user.dcaExecutions = BigInt.fromI32(0)
    user.successRate = BigInt.fromI32(0)
    user.averageSlippage = BigInt.fromI32(0)
    user.totalFees = BigInt.fromI32(0)
    user.roi = BigInt.fromI32(0)
    user.createdAt = BigInt.fromI32(0)
    user.lastActivity = BigInt.fromI32(0)
    user.save()
  }
  return user
}

function getToken(address: string): Token {
  let token = Token.load(address)
  if (!token) {
    token = new Token(address)
    token.symbol = "UNKNOWN"
    token.name = "Unknown Token"
    token.decimals = BigInt.fromI32(18)
    token.totalSupply = BigInt.fromI32(0)
    token.totalVolume = BigInt.fromI32(0)
    token.totalTransactions = BigInt.fromI32(0)
    token.averagePrice = BigInt.fromI32(0)
    token.save()
  }
  return token
}

function updateDailyStats(timestamp: BigInt, eventType: string, amount: BigInt): void {
  let date = new Date(timestamp.toI32() * 1000)
  let dateString = date.toISOString().split('T')[0]
  
  let dailyStats = DailyStats.load(dateString)
  if (!dailyStats) {
    dailyStats = new DailyStats(dateString)
    dailyStats.date = dateString
    dailyStats.totalUsers = BigInt.fromI32(0)
    dailyStats.newUsers = BigInt.fromI32(0)
    dailyStats.totalStrategies = BigInt.fromI32(0)
    dailyStats.activeStrategies = BigInt.fromI32(0)
    dailyStats.totalExecutions = BigInt.fromI32(0)
    dailyStats.successfulExecutions = BigInt.fromI32(0)
    dailyStats.totalVolume = BigInt.fromI32(0)
    dailyStats.totalFees = BigInt.fromI32(0)
    dailyStats.totalGasSaved = BigInt.fromI32(0)
    dailyStats.averageSlippage = BigInt.fromI32(0)
    dailyStats.successRate = BigInt.fromI32(0)
  }
  
  // Update based on event type
  if (eventType == "savings_increased") {
    dailyStats.totalVolume = dailyStats.totalVolume.plus(amount)
  } else if (eventType == "dca_executed") {
    dailyStats.totalExecutions = dailyStats.totalExecutions.plus(BigInt.fromI32(1))
    dailyStats.totalVolume = dailyStats.totalVolume.plus(amount)
  } else if (eventType == "strategy_created") {
    dailyStats.totalStrategies = dailyStats.totalStrategies.plus(BigInt.fromI32(1))
  }
  
  dailyStats.save()
}

export function handleBlock(block: ethereum.Block): void {
  // Update protocol stats periodically
  if (block.number.mod(BigInt.fromI32(100)).equals(BigInt.fromI32(0))) {
    let protocolStats = ProtocolStats.load("protocol")
    if (!protocolStats) {
      protocolStats = new ProtocolStats("protocol")
      protocolStats.totalUsers = BigInt.fromI32(0)
      protocolStats.totalStrategies = BigInt.fromI32(0)
      protocolStats.totalExecutions = BigInt.fromI32(0)
      protocolStats.totalVolume = BigInt.fromI32(0)
      protocolStats.totalFees = BigInt.fromI32(0)
      protocolStats.totalGasSaved = BigInt.fromI32(0)
      protocolStats.averageSlippage = BigInt.fromI32(0)
      protocolStats.successRate = BigInt.fromI32(0)
    }
    
    protocolStats.lastUpdated = block.timestamp
    protocolStats.save()
  }
}
