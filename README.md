# Trading Bot Execution - Technical Manual

## 🚀 Overview

The **trading-bot-execution** is the trade execution and order management service of the modular trading bot architecture, providing automated trade execution, portfolio management, and order lifecycle management. Operating on **Port 3004**, it integrates with all other services to deliver sophisticated execution capabilities with risk controls, order routing, and portfolio tracking.

### Key Capabilities
- **Automated Trade Execution** with multiple order types and execution algorithms
- **Advanced Order Management** including order routing, partial fills, and lifecycle tracking
- **Portfolio Management** with real-time position tracking and P&L calculation
- **Risk-Integrated Execution** with pre-trade risk checks and position sizing
- **Multi-Exchange Support** with intelligent order routing and arbitrage detection
- **RESTful API** for trade execution, order management, and portfolio operations
- **Real-time WebSocket** feeds for order updates and position changes

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│              TRADING-BOT-EXECUTION (Port 3004)             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│  │ OrderManager    │  │ ExecutionEngine │  │PortfolioManager ││
│  │                 │  │                 │  │                 ││
│  │ • Order Routing │  │ • Trade Exec    │  │ • Position      ││
│  │ • Lifecycle Mgmt│  │ • Fill Handling │  │   Tracking      ││
│  │ • Partial Fills │  │ • Slippage Mgmt │  │ • P&L Calc     ││
│  │ • Order Book    │  │ • Timing Algos  │  │ • Risk Limits  ││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘│
│                                 │                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│  │ExchangeConnector│  │ExecutionServer  │  │ RiskIntegration ││
│  │                 │  │                 │  │                 ││
│  │ • API Adapters  │  │ • RESTful API   │  │ • Pre-trade     ││
│  │ • Rate Limiting │  │ • WebSocket     │  │   Validation    ││
│  │ • Health Checks │  │ • Order Events  │  │ • Position Size ││
│  │ • Failover      │  │ • Real-time Feeds│ │   Optimization  ││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
                               │
                    ┌──────────┼──────────┐
                    │          │          │
          ┌─────────▼─┐  ┌─────▼─────┐  ┌─▼──────────┐
          │   Core    │  │   Risk    │  │ Dashboard  │
          │ Service   │  │ Service   │  │  Service   │
          │(Port 3000)│  │(Port 3003)│  │(Port 3005) │
          └───────────┘  └───────────┘  └────────────┘
                               │
                    ┌──────────┼──────────┐
                    │          │          │
          ┌─────────▼─┐  ┌─────▼─────┐
          │    ML     │  │ Backtest  │
          │ Service   │  │  Service  │
          │(Port 3001)│  │(Port 3002)│
          └───────────┘  └───────────┘
```

---

## 🛠️ Quick Start

### Prerequisites
- **Node.js** >= 16.0.0
- **npm** >= 8.0.0
- **trading-bot-core** running on Port 3000
- **trading-bot-risk** running on Port 3003 (optional but recommended)
- **Exchange API credentials** (Xeggex, Binance, etc.)

### Installation

1. **Clone and Setup**
```bash
git clone <repository-url>
cd trading-bot-execution
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env
# Configure exchange API credentials and service URLs
```

3. **Start the Execution Service**
```bash
npm start
```

4. **Verify Installation**
```bash
# Check execution service health
curl http://localhost:3004/api/health

# Get portfolio status
curl http://localhost:3004/api/portfolio

# Test order placement (paper trading)
curl -X POST http://localhost:3004/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "pair": "RVN_USDT",
    "side": "buy",
    "type": "market",
    "quantity": 1000,
    "paperTrade": true
  }'
```

### Verify Service Connections
```bash
# Ensure required services are running
curl http://localhost:3000/api/health  # Core service
curl http://localhost:3003/api/health  # Risk service (optional)

# Check execution service connectivity
curl http://localhost:3004/api/health | jq '.services'
```

---

## 🔌 API Reference

### Base URL
```
http://localhost:3004
```

### Core Endpoints

#### 1. **GET /api/health**
Execution service health check with exchange connectivity status.

**Response:**
```json
{
  "status": "healthy",
  "service": "trading-bot-execution",
  "timestamp": 1704067200000,
  "uptime": "03:15:42",
  "exchanges": {
    "xeggex": {
      "status": "connected",
      "lastPing": 1704067195000,
      "rateLimit": {
        "remaining": 95,
        "resetTime": 1704067260000
      }
    },
    "binance": {
      "status": "connected",
      "lastPing": 1704067190000,
      "rateLimit": {
        "remaining": 1180,
        "resetTime": 1704067320000
      }
    }
  },
  "services": {
    "core": {
      "status": "healthy",
      "lastCheck": 1704067185000
    },
    "risk": {
      "status": "healthy",
      "lastCheck": 1704067180000
    }
  },
  "executionEngine": {
    "status": "operational",
    "ordersProcessed": 1247,
    "successRate": 98.4,
    "averageExecutionTime": "1.2s"
  }
}
```

#### 2. **GET /api/portfolio**
Current portfolio status with positions and balances.

**Response:**
```json
{
  "timestamp": 1704067200000,
  "summary": {
    "totalValue": 52450.75,
    "totalCash": 8920.50,
    "totalPositions": 43530.25,
    "unrealizedPnL": 1247.30,
    "unrealizedPnLPercent": 2.44,
    "dayPnL": 342.75,
    "dayPnLPercent": 0.66
  },
  "positions": [
    {
      "id": "POS_001",
      "pair": "XMR_USDT",
      "side": "long",
      "quantity": 125.50,
      "averagePrice": 158.45,
      "currentPrice": 162.30,
      "marketValue": 20368.65,
      "unrealizedPnL": 483.25,
      "unrealizedPnLPercent": 2.42,
      "dayPnL": 125.50,
      "dayPnLPercent": 0.62,
      "openDate": 1704034800000,
      "exchange": "xeggex",
      "riskMetrics": {
        "positionSize": 0.39,
        "leverage": 1.0,
        "marginUsed": 0,
        "liquidationPrice": null
      }
    }
  ],
  "balances": [
    {
      "currency": "USDT",
      "total": 8920.50,
      "available": 8420.50,
      "locked": 500.00,
      "exchange": "xeggex"
    }
  ],
  "performance": {
    "totalReturn": 2.44,
    "dayReturn": 0.66,
    "weekReturn": 5.23,
    "monthReturn": 12.45,
    "maxDrawdown": 3.45,
    "sharpeRatio": 1.87,
    "winRate": 68.5
  }
}
```

#### 3. **POST /api/orders**
Place a new order with optional risk validation.

**Request Body:**
```json
{
  "pair": "RVN_USDT",
  "side": "buy",
  "type": "market",
  "quantity": 5000,
  "price": 0.0245,
  "stopLoss": 0.0233,
  "takeProfit": 0.0270,
  "timeInForce": "GTC",
  "exchange": "xeggex",
  "paperTrade": false,
  "riskCheck": true,
  "signalData": {
    "source": "technical_analysis",
    "confidence": 0.78,
    "strategy": "macd_crossover"
  }
}
```

**Response:**
```json
{
  "orderId": "ORD_20250101_001247",
  "clientOrderId": "CLIENT_001",
  "status": "submitted",
  "pair": "RVN_USDT",
  "side": "buy",
  "type": "market",
  "quantity": 5000,
  "price": null,
  "filledQuantity": 0,
  "averagePrice": null,
  "exchange": "xeggex",
  "timestamp": 1704067200000,
  "timeInForce": "GTC",
  "riskValidation": {
    "passed": true,
    "positionSizeCheck": "approved",
    "portfolioRiskCheck": "approved",
    "recommendedSize": 5000,
    "maxRisk": 122.50
  },
  "estimatedCost": 122.50,
  "estimatedFees": 0.12,
  "linkedOrders": {
    "stopLoss": "ORD_20250101_001248",
    "takeProfit": "ORD_20250101_001249"
  }
}
```

#### 4. **GET /api/orders**
Get order history and status.

**Query Parameters:**
- `status`: filter by order status (open, filled, cancelled, rejected)
- `pair`: filter by trading pair
- `limit`: number of orders to return (default: 50)
- `since`: orders after timestamp

**Response:**
```json
{
  "timestamp": 1704067200000,
  "orders": [
    {
      "orderId": "ORD_20250101_001247",
      "clientOrderId": "CLIENT_001",
      "status": "filled",
      "pair": "RVN_USDT",
      "side": "buy",
      "type": "market",
      "quantity": 5000,
      "filledQuantity": 5000,
      "averagePrice": 0.02451,
      "totalCost": 122.55,
      "fees": 0.12,
      "exchange": "xeggex",
      "submitTime": 1704067200000,
      "fillTime": 1704067203000,
      "executionTime": 3000,
      "fills": [
        {
          "fillId": "FILL_001",
          "quantity": 5000,
          "price": 0.02451,
          "timestamp": 1704067203000,
          "fee": 0.12,
          "feeCurrency": "USDT"
        }
      ]
    }
  ],
  "pagination": {
    "total": 127,
    "page": 1,
    "limit": 50,
    "hasMore": true
  }
}
```

#### 5. **POST /api/signals/execute**
Execute trading signal from core or ML service.

**Request Body:**
```json
{
  "pair": "BEL_USDT",
  "signal": "BUY",
  "confidence": 0.82,
  "source": "ml_prediction",
  "strategy": "ensemble_model",
  "entryPrice": 0.5640,
  "stopLoss": 0.5358,
  "takeProfit": 0.6204,
  "riskParameters": {
    "maxRiskPercent": 0.02,
    "positionSizeMethod": "kelly"
  }
}
```

**Response:**
```json
{
  "signalId": "SIG_20250101_001",
  "status": "executed",
  "orders": [
    {
      "orderId": "ORD_20250101_001252",
      "type": "market",
      "side": "buy",
      "quantity": 2180,
      "status": "submitted"
    },
    {
      "orderId": "ORD_20250101_001253",
      "type": "stop_loss", 
      "price": 0.5358,
      "status": "pending"
    },
    {
      "orderId": "ORD_20250101_001254",
      "type": "take_profit",
      "price": 0.6204,
      "status": "pending"
    }
  ],
  "positionSizing": {
    "recommendedSize": 2180,
    "riskAmount": 61.52,
    "method": "kelly_criterion",
    "riskPercent": 0.019
  },
  "timestamp": 1704067200000
}
```

---

## 🔄 Order Management System

### Order Types and Execution

#### 1. **Market Orders**
Immediate execution at current market prices.

**Implementation:**
```javascript
class MarketOrderExecutor {
  async executeMarketOrder(order) {
    const orderBook = await this.getOrderBook(order.pair);
    const executionPlan = this.createExecutionPlan(order, orderBook);
    
    return await this.executeOrderPlan(executionPlan);
  }
  
  createExecutionPlan(order, orderBook) {
    const { quantity, side } = order;
    const book = side === 'buy' ? orderBook.asks : orderBook.bids;
    
    let remainingQuantity = quantity;
    const executionSlices = [];
    
    for (const level of book) {
      if (remainingQuantity <= 0) break;
      
      const sliceQuantity = Math.min(remainingQuantity, level.quantity);
      executionSlices.push({
        price: level.price,
        quantity: sliceQuantity,
        exchange: level.exchange
      });
      
      remainingQuantity -= sliceQuantity;
    }
    
    return {
      orderId: order.orderId,
      slices: executionSlices,
      estimatedSlippage: this.calculateSlippage(executionSlices, order),
      estimatedCost: this.calculateTotalCost(executionSlices)
    };
  }
}
```

#### 2. **Limit Orders**
Orders executed at specified price or better.

**Implementation:**
```javascript
class LimitOrderManager {
  constructor() {
    this.openOrders = new Map();
    this.priceWatchers = new Map();
  }
  
  async placeLimitOrder(order) {
    // Validate order
    this.validateLimitOrder(order);
    
    // Submit to exchange
    const exchangeOrder = await this.submitToExchange(order);
    
    // Track order
    this.openOrders.set(order.orderId, {
      ...order,
      exchangeOrderId: exchangeOrder.id,
      status: 'open',
      submitTime: Date.now()
    });
    
    // Set up price monitoring
    this.setupPriceMonitoring(order);
    
    return exchangeOrder;
  }
  
  setupPriceMonitoring(order) {
    const watcher = setInterval(async () => {
      const currentPrice = await this.getCurrentPrice(order.pair);
      
      if (this.shouldModifyOrder(order, currentPrice)) {
        await this.modifyOrder(order, currentPrice);
      }
    }, 5000); // Check every 5 seconds
    
    this.priceWatchers.set(order.orderId, watcher);
  }
}
```

#### 3. **Stop Orders**
Risk management orders triggered by price movements.

**Implementation:**
```javascript
class StopOrderManager {
  constructor() {
    this.stopOrders = new Map();
    this.priceMonitor = null;
  }
  
  async placeStopOrder(order) {
    this.stopOrders.set(order.orderId, {
      ...order,
      status: 'pending',
      createTime: Date.now()
    });
    
    this.startPriceMonitoring();
    return order;
  }
  
  async checkStopTriggers() {
    const currentPrices = await this.getCurrentPrices();
    
    for (const [orderId, stopOrder] of this.stopOrders) {
      const currentPrice = currentPrices[stopOrder.pair];
      
      if (this.isStopTriggered(stopOrder, currentPrice)) {
        await this.triggerStopOrder(stopOrder);
      }
    }
  }
  
  isStopTriggered(stopOrder, currentPrice) {
    if (stopOrder.side === 'sell') {
      // Stop loss for long position
      return currentPrice <= stopOrder.stopPrice;
    } else {
      // Stop loss for short position
      return currentPrice >= stopOrder.stopPrice;
    }
  }
}
```

---

## 💼 Portfolio Management

### Position Tracking and P&L Calculation

```javascript
class PortfolioManager {
  constructor() {
    this.positions = new Map();
    this.balances = new Map();
    this.pnlCalculator = new PnLCalculator();
    this.riskManager = new PortfolioRiskManager();
  }
  
  async updatePosition(trade) {
    const positionKey = `${trade.pair}_${trade.side}`;
    const existingPosition = this.positions.get(positionKey);
    
    if (existingPosition) {
      await this.updateExistingPosition(existingPosition, trade);
    } else {
      await this.createNewPosition(trade);
    }
    
    // Update portfolio-level metrics
    await this.updatePortfolioMetrics();
  }
  
  async calculatePortfolioValue() {
    let totalValue = 0;
    
    // Add cash balances
    for (const [currency, balance] of this.balances) {
      const usdValue = await this.convertToUSD(currency, balance.available);
      totalValue += usdValue;
    }
    
    // Add position market values
    for (const [key, position] of this.positions) {
      const currentPrice = await this.getCurrentPrice(position.pair);
      const marketValue = position.quantity * currentPrice;
      totalValue += marketValue;
    }
    
    return totalValue;
  }
}

class PnLCalculator {
  calculateRealisedPnL(position, closingTrade, quantity) {
    const costBasis = position.averagePrice * quantity;
    const proceeds = closingTrade.price * quantity;
    
    if (position.side === 'long') {
      return proceeds - costBasis;
    } else {
      return costBasis - proceeds;
    }
  }
  
  calculateUnrealisedPnL(position, currentPrice) {
    const costBasis = position.averagePrice * position.quantity;
    const marketValue = currentPrice * position.quantity;
    
    if (position.side === 'long') {
      return marketValue - costBasis;
    } else {
      return costBasis - marketValue;
    }
  }
}
```

### Risk Management Integration

```javascript
class ExecutionRiskManager {
  constructor(riskServiceUrl = 'http://localhost:3003') {
    this.riskService = axios.create({ baseURL: riskServiceUrl });
  }
  
  async validateTradeRisk(order) {
    try {
      // Get position sizing recommendation from risk service
      const sizeResponse = await this.riskService.post('/api/risk/position-size', {
        pair: order.pair,
        signal: order.side.toUpperCase(),
        confidence: order.signalData?.confidence || 0.5,
        entryPrice: order.price,
        stopLoss: order.stopLoss,
        takeProfit: order.takeProfit
      });
      
      const recommendedSize = sizeResponse.data.recommendations.recommended;
      
      // Check if order size exceeds recommendation
      if (order.quantity > recommendedSize.positionSize) {
        return {
          approved: false,
          reason: 'Position size exceeds risk management limits',
          recommendedSize: recommendedSize.positionSize,
          requestedSize: order.quantity,
          adjustedOrder: {
            ...order,
            quantity: recommendedSize.positionSize
          }
        };
      }
      
      return {
        approved: true,
        riskAssessment: recommendedSize,
        portfolioImpact: null
      };
      
    } catch (error) {
      console.warn('Risk service unavailable, applying conservative limits:', error.message);
      return this.applyConservativeRisk(order);
    }
  }
  
  applyConservativeRisk(order) {
    // Fallback risk limits when risk service is unavailable
    const conservativeSize = order.quantity * 0.5; // 50% of requested size
    
    return {
      approved: true,
      adjustedOrder: {
        ...order,
        quantity: conservativeSize
      },
      reason: 'Applied conservative sizing due to risk service unavailability',
      fallback: true
    };
  }
}
```

---

## 🔗 Exchange Integration

### Multi-Exchange Adapter Pattern

```javascript
class ExchangeManager {
  constructor() {
    this.exchanges = new Map();
    this.primaryExchange = null;
    this.routingRules = new Map();
  }
  
  addExchange(name, adapter) {
    this.exchanges.set(name, {
      adapter: adapter,
      status: 'disconnected',
      lastHealthCheck: null,
      rateLimit: adapter.getRateLimit(),
      capabilities: adapter.getCapabilities()
    });
  }
  
  async routeOrder(order) {
    // Intelligent order routing based on:
    // - Order size
    // - Liquidity
    // - Fees
    // - Exchange status
    
    const routingDecision = await this.determineOptimalExchange(order);
    
    if (!routingDecision.exchange) {
      throw new Error('No suitable exchange available for order');
    }
    
    return await this.executeOnExchange(order, routingDecision.exchange);
  }
  
  async scoreExchange(exchangeName, order) {
    const exchange = this.exchanges.get(exchangeName);
    let score = 0;
    
    // Liquidity score (40% weight)
    const liquidity = await this.getLiquidity(exchangeName, order.pair);
    score += liquidity.score * 0.4;
    
    // Fee score (30% weight)
    const fees = await this.getFees(exchangeName, order);
    score += fees.score * 0.3;
    
    // Reliability score (20% weight)
    const reliability = this.getReliabilityScore(exchangeName);
    score += reliability * 0.2;
    
    // Speed score (10% weight)
    const speed = this.getSpeedScore(exchangeName);
    score += speed * 0.1;
    
    return score;
  }
}

// Xeggex adapter implementation
class XeggexAdapter extends BaseExchangeAdapter {
  constructor(config) {
    super(config);
    this.client = axios.create({
      baseURL: 'https://api.xeggex.com/api/v2',
      headers: {
        'X-API-KEY': config.apiKey,
        'X-API-SECRET': config.apiSecret
      }
    });
  }
  
  async placeOrder(order) {
    await this.rateLimiter.checkLimit();
    
    const xeggexOrder = this.convertToXeggexFormat(order);
    
    try {
      const response = await this.client.post('/trade/create', xeggexOrder);
      return this.convertFromXeggexFormat(response.data);
    } catch (error) {
      this.handleExchangeError(error);
    }
  }
  
  convertToXeggexFormat(order) {
    return {
      symbol: order.pair,
      side: order.side,
      type: order.type,
      quantity: order.quantity.toString(),
      price: order.price?.toString(),
      timeInForce: order.timeInForce || 'GTC'
    };
  }
  
  getCapabilities() {
    return {
      orderTypes: ['market', 'limit', 'stop_loss', 'take_profit'],
      timeInForce: ['GTC', 'IOC'],
      marginTrading: false,
      websocket: true,
      pairs: ['XMR_USDT', 'RVN_USDT', 'BEL_USDT', 'DOGE_USDT', 'KAS_USDT', 'SAL_USDT']
    };
  }
}
```

---

## 🧪 Testing & Validation

### Available Test Scripts
```bash
# Test execution service connectivity
npm run test:connectivity

# Test order management system
npm run test:orders

# Test portfolio management
npm run test:portfolio

# Test exchange integrations
npm run test:exchanges

# Test paper trading mode
npm run test:paper-trading

# Run comprehensive execution tests
npm run test:all
```

### Paper Trading Mode
```bash
# Enable paper trading for testing
export PAPER_TRADING=true
npm start

# Test order placement in paper mode
curl -X POST http://localhost:3004/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "pair": "RVN_USDT",
    "side": "buy", 
    "type": "market",
    "quantity": 1000,
    "paperTrade": true
  }' | jq '.'
```

### Common Issues & Solutions

#### 1. **Exchange Connectivity Issues**
```bash
# Check exchange API credentials
echo $XEGGEX_API_KEY | cut -c1-8  # Show first 8 chars only

# Test exchange connectivity directly
curl -H "X-API-KEY: $XEGGEX_API_KEY" https://api.xeggex.com/api/v2/market/getlist

# Check rate limiting
curl http://localhost:3004/api/health | jq '.exchanges.xeggex.rateLimit'

# Common solutions:
# - Verify API credentials are correct
# - Check IP whitelist on exchange
# - Ensure rate limits are not exceeded
# - Check exchange status/maintenance
```

#### 2. **Order Execution Failures**
```bash
# Check order validation
curl -X POST http://localhost:3004/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "pair": "INVALID_PAIR",
    "side": "buy",
    "type": "market", 
    "quantity": 1000
  }'

# Check insufficient balance
curl http://localhost:3004/api/portfolio | jq '.balances'

# Monitor failed orders
grep "ORDER_FAILED" logs/execution-error.log

# Common issues:
# - Invalid trading pair
# - Insufficient balance
# - Below minimum order size
# - Market closed/suspended
```

#### 3. **Portfolio Synchronization Issues**
```bash
# Force portfolio refresh
curl -X POST http://localhost:3004/api/portfolio/refresh

# Check position tracking
curl http://localhost:3004/api/portfolio | jq '.positions'

# Verify P&L calculations
curl http://localhost:3004/api/portfolio | jq '.summary'

# Common problems:
# - Delayed position updates
# - Incorrect P&L calculations
# - Missing trade records
# - Exchange data sync issues
```

---

## 🚀 Performance Optimization

### Order Execution Optimization
```javascript
// Batch order processing
class BatchOrderProcessor {
  constructor() {
    this.orderQueue = [];
    this.batchSize = 10;
    this.batchInterval = 1000; // 1 second
  }
  
  addOrder(order) {
    this.orderQueue.push(order);
    
    if (this.orderQueue.length >= this.batchSize) {
      this.processBatch();
    }
  }
  
  async processBatch() {
    if (this.orderQueue.length === 0) return;
    
    const batch = this.orderQueue.splice(0, this.batchSize);
    
    // Process orders concurrently within exchange rate limits
    const promises = batch.map(order => this.processOrder(order));
    const results = await Promise.allSettled(promises);
    
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Order ${batch[index].orderId} failed:`, result.reason);
      }
    });
  }
}

// Incremental portfolio updates
class IncrementalPortfolioCalculator {
  constructor() {
    this.lastCalculation = null;
    this.pendingUpdates = [];
  }
  
  addPositionUpdate(positionUpdate) {
    this.pendingUpdates.push(positionUpdate);
    
    // Batch updates for efficiency
    if (this.pendingUpdates.length >= 5) {
      this.processUpdates();
    }
  }
  
  async processUpdates() {
    if (this.pendingUpdates.length === 0) return;
    
    const updates = this.pendingUpdates.splice(0);
    
    // Apply incremental changes instead of full recalculation
    for (const update of updates) {
      this.applyIncrementalUpdate(update);
    }
    
    this.lastCalculation.timestamp = Date.now();
  }
}
```

### Memory Management
```javascript
// Efficient order and trade history management
class HistoryManager {
  constructor(config) {
    this.maxOrders = config.maxOrders || 10000;
    this.maxTrades = config.maxTrades || 50000;
    this.cleanupInterval = config.cleanupInterval || 3600000; // 1 hour
    
    this.orders = new Map();
    this.trades = new Map();
    
    this.startCleanup();
  }
  
  addOrder(order) {
    this.orders.set(order.orderId, order);
    
    if (this.orders.size > this.maxOrders) {
      this.cleanupOldOrders();
    }
  }
  
  cleanupOldOrders() {
    const orderArray = Array.from(this.orders.entries());
    const sortedOrders = orderArray.sort((a, b) => a[1].submitTime - b[1].submitTime);
    
    // Remove oldest 20% of orders
    const removeCount = Math.floor(this.orders.size * 0.2);
    for (let i = 0; i < removeCount; i++) {
      this.orders.delete(sortedOrders[i][0]);
    }
  }
  
  performMaintenance() {
    // Archive old data, cleanup memory, optimize data structures
    this.archiveOldData();
    this.optimizeDataStructures();
    
    if (global.gc) {
      global.gc(); // Force garbage collection if available
    }
  }
}
```

---

## 🔒 Security & Production Considerations

### API Security
```javascript
// Secure API key management
class SecureCredentialManager {
  constructor() {
    this.credentials = new Map();
    this.encryption = new CredentialEncryption();
  }
  
  addCredentials(exchange, apiKey, apiSecret) {
    const encryptedKey = this.encryption.encrypt(apiKey);
    const encryptedSecret = this.encryption.encrypt(apiSecret);
    
    this.credentials.set(exchange, {
      apiKey: encryptedKey,
      apiSecret: encryptedSecret,
      lastUsed: Date.now()
    });
  }
  
  getCredentials(exchange) {
    const creds = this.credentials.get(exchange);
    if (!creds) return null;
    
    return {
      apiKey: this.encryption.decrypt(creds.apiKey),
      apiSecret: this.encryption.decrypt(creds.apiSecret)
    };
  }
}

// Request validation and sanitization
class RequestValidator {
  validateOrderRequest(req) {
    const errors = [];
    
    // Validate required fields
    if (!req.body.pair || !/^[A-Z]+_[A-Z]+$/.test(req.body.pair)) {
      errors.push('Invalid trading pair format');
    }
    
    if (!['buy', 'sell'].includes(req.body.side)) {
      errors.push('Invalid order side');
    }
    
    if (!req.body.quantity || req.body.quantity <= 0) {
      errors.push('Invalid quantity');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitizedRequest: this.sanitizeRequest(req.body)
    };
  }
  
  sanitizeRequest(body) {
    return {
      pair: body.pair?.toUpperCase().replace(/[^A-Z_]/g, ''),
      side: body.side?.toLowerCase(),
      type: body.type?.toLowerCase(),
      quantity: Math.max(0, Math.min(parseFloat(body.quantity) || 0, 10000000)),
      price: body.price ? Math.max(0, Math.min(parseFloat(body.price), 1000000)) : undefined,
      timeInForce: body.timeInForce || 'GTC',
      paperTrade: Boolean(body.paperTrade)
    };
  }
}
```

### Production Deployment
```bash
# Production environment setup
NODE_ENV=production npm start

# Process management with PM2
pm2 start src/main.js --name trading-bot-execution --instances 2

# Monitor execution service
pm2 monit trading-bot-execution

# Configure log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 100M
pm2 set pm2-logrotate:retain 30

# Set up SSL/TLS for API endpoints
# Configure reverse proxy with nginx
server {
    listen 443 ssl;
    server_name execution-api.yourdomain.com;
    
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/private.key;
    
    location /api/ {
        proxy_pass http://localhost:3004;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 📚 Best Practices & Guidelines

### Trading Best Practices
```javascript
// Position sizing best practices
const positionSizingGuidelines = {
  maxPositionSize: 0.25,        // No position > 25% of portfolio
  maxRiskPerTrade: 0.02,        // Risk max 2% per trade
  maxDailyRisk: 0.06,           // Risk max 6% per day
  maxCorrelatedRisk: 0.40,      // Max 40% in correlated positions
  
  sizingMethods: {
    conservative: 'fixed_fraction', // Fixed % of portfolio
    moderate: 'volatility_adjusted', // Adjusted for asset volatility
    aggressive: 'kelly_criterion'    // Optimal growth sizing
  },
  
  riskManagement: {
    stopLoss: 'always_required',
    takeProfit: 'recommended',
    trailingStops: 'for_trending_markets',
    positionReview: 'daily'
  }
};

// Order management best practices
const orderManagementGuidelines = {
  orderTypes: {
    market: 'immediate_execution_priority',
    limit: 'price_improvement_seeking', 
    stop: 'risk_management_required',
    iceberg: 'large_orders_stealth'
  },
  
  timeInForce: {
    GTC: 'default_for_limit_orders',
    IOC: 'partial_fill_acceptable',
    FOK: 'all_or_nothing_required'
  },
  
  orderRouting: {
    primary: 'best_execution_exchange',
    fallback: 'backup_exchange_available',
    arbitrage: 'cross_exchange_opportunities'
  }
};
```

### Error Handling Patterns
```javascript
class RobustOrderExecutor {
  async executeOrderWithRetry(order, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.executeOrder(order);
      } catch (error) {
        lastError = error;
        
        if (this.isRetryableError(error) && attempt < maxRetries) {
          const delay = this.calculateBackoffDelay(attempt);
          await this.sleep(delay);
          continue;
        }
        
        throw error;
      }
    }
    
    throw lastError;
  }
  
  isRetryableError(error) {
    const retryableErrors = [
      'NETWORK_ERROR',
      'TIMEOUT',
      'RATE_LIMIT_EXCEEDED',
      'TEMPORARY_UNAVAILABLE'
    ];
    
    return retryableErrors.includes(error.code);
  }
  
  calculateBackoffDelay(attempt) {
    // Exponential backoff with jitter
    const baseDelay = 1000; // 1 second
    const backoffMultiplier = Math.pow(2, attempt - 1);
    const jitter = Math.random() * 0.5; // Up to 50% jitter
    
    return baseDelay * backoffMultiplier * (1 + jitter);
  }
}
```

---

## 📋 API Usage Examples

### Complete Trading Bot Integration
```javascript
const axios = require('axios');

class CompleteTradingBot {
  constructor() {
    this.executionService = axios.create({ 
      baseURL: 'http://localhost:3004',
      timeout: 30000 
    });
    
    this.coreService = axios.create({ baseURL: 'http://localhost:3000' });
    this.riskService = axios.create({ baseURL: 'http://localhost:3003' });
    this.mlService = axios.create({ baseURL: 'http://localhost:3001' });
    
    this.tradingState = {
      isActive: false,
      positions: new Map(),
      orders: new Map(),
      portfolio: null
    };
  }
  
  async initializeTradingBot() {
    try {
      // Check all services
      const healthChecks = await Promise.all([
        this.executionService.get('/api/health'),
        this.coreService.get('/api/health'),
        this.riskService.get('/api/health'),
        this.mlService.get('/api/health')
      ]);
      
      console.log('All services online, initializing trading bot...');
      
      // Get initial portfolio state
      this.tradingState.portfolio = await this.getPortfolio();
      
      // Start trading loop
      this.startTradingLoop();
      
      return {
        status: 'initialized',
        portfolio: this.tradingState.portfolio,
        services: healthChecks.map(h => h.data.status)
      };
      
    } catch (error) {
      console.error('Trading bot initialization failed:', error);
      throw error;
    }
  }
  
  async startTradingLoop() {
    this.tradingState.isActive = true;
    
    console.log('Starting automated trading loop...');
    
    // Main trading loop - runs every 30 seconds
    this.tradingInterval = setInterval(async () => {
      try {
        await this.executeTradingCycle();
      } catch (error) {
        console.error('Trading cycle error:', error);
      }
    }, 30000);
  }
  
  async executeTradingCycle() {
    // 1. Get market data and signals
    const marketData = await this.coreService.get('/api/data');
    const pairs = marketData.data.pairs;
    
    // 2. Process each trading pair
    for (const pair of pairs) {
      await this.processTradingPair(pair);
    }
    
    // 3. Update portfolio and risk metrics
    await this.updatePortfolioState();
    
    // 4. Check for risk management actions
    await this.performRiskManagement();
  }
  
  async processTradingPair(pair) {
    try {
      // Get technical signals
      const pairData = await this.coreService.get(`/api/pair/${pair}`);
      const signals = pairData.data.strategies;
      
      // Get ML prediction
      const mlPrediction = await this.mlService.get(`/api/predictions/${pair}`);
      
      // Combine signals for decision
      const tradingDecision = await this.makeTradingDecision(pair, signals, mlPrediction.data);
      
      if (tradingDecision.action !== 'hold') {
        await this.executeTradeDecision(pair, tradingDecision);
      }
      
    } catch (error) {
      console.error(`Error processing ${pair}:`, error.message);
    }
  }
  
  async executeTradeDecision(pair, decision) {
    try {
      // Prepare signal execution request
      const signalRequest = {
        pair: pair,
        signal: decision.action.toUpperCase(),
        confidence: decision.confidence,
        source: 'automated_trading_bot',
        strategy: 'technical_ml_ensemble',
        riskParameters: {
          maxRiskPercent: 0.02,
          positionSizeMethod: 'kelly'
        },
        metadata: {
          technicalScore: decision.reasoning.technical,
          mlScore: decision.reasoning.ml,
          combinedScore: decision.reasoning.combined
        }
      };
      
      // Execute the signal
      const executionResult = await this.executionService.post('/api/signals/execute', signalRequest);
      
      console.log(`Trade executed for ${pair}:`, {
        action: decision.action,
        confidence: decision.confidence,
        signalId: executionResult.data.signalId,
        orders: executionResult.data.orders.length
      });
      
    } catch (error) {
      console.error(`Trade execution failed for ${pair}:`, error.message);
    }
  }
  
  async getPortfolio() {
    const response = await this.executionService.get('/api/portfolio');
    return response.data;
  }
  
  getTradingStatus() {
    return {
      isActive: this.tradingState.isActive,
      portfolioValue: this.tradingState.portfolio?.summary.totalValue,
      activePositions: this.tradingState.positions.size,
      unrealizedPnL: this.tradingState.portfolio?.summary.unrealizedPnL,
      dayPnL: this.tradingState.portfolio?.summary.dayPnL
    };
  }
}

// Usage example
async function runAutomatedTradingBot() {
  const tradingBot = new CompleteTradingBot();
  
  try {
    // Initialize the bot
    const initialization = await tradingBot.initializeTradingBot();
    console.log('Trading bot initialized:', initialization);
    
    // Monitor status every minute
    const statusInterval = setInterval(() => {
      const status = tradingBot.getTradingStatus();
      console.log('Trading Status:', status);
    }, 60000);
    
    // Stop after 1 hour for this example
    setTimeout(async () => {
      clearInterval(statusInterval);
      await tradingBot.stopTradingBot();
      console.log('Demo completed');
    }, 3600000);
    
  } catch (error) {
    console.error('Trading bot failed:', error);
  }
}
```

---

## 🎯 Future Roadmap

### Planned Features

#### 1. **Advanced Order Types**
- **Algorithmic Orders**: TWAP, VWAP, implementation shortfall
- **Conditional Orders**: If-then-else order logic
- **Bracket Orders**: Combined entry, stop-loss, and take-profit
- **Trailing Orders**: Dynamic stop-loss and take-profit adjustment

#### 2. **Multi-Asset Support**
- **Traditional Assets**: Stocks, ETFs, commodities integration
- **Forex Markets**: Currency pair trading capabilities  
- **Derivatives**: Options and futures trading support
- **DeFi Integration**: Decentralized exchange connectivity

#### 3. **Advanced Execution Algorithms**
- **Smart Order Routing**: Multi-venue optimization
- **Dark Pool Access**: Hidden liquidity sourcing
- **Latency Optimization**: Ultra-low latency execution
- **Market Making**: Automated market making strategies

#### 4. **Enhanced Risk Management**
- **Real-time Margin**: Dynamic margin calculations
- **Portfolio Hedging**: Automatic hedge strategies
- **Circuit Breakers**: Automated trading halts
- **Stress Testing**: Real-time stress scenario evaluation

---

## 📚 Additional Resources

### Trading Technology References
- **"Algorithmic Trading" by Ernie Chan**: Systematic trading strategies
- **"Inside the Black Box" by Rishi Narang**: Quantitative trading systems
- **"Trading and Exchanges" by Larry Harris**: Market microstructure
- **"Optimal Trading Strategies" by Robert Kissell**: Execution algorithms

### Technical References
- **FIX Protocol**: Financial Information eXchange protocol
- **FIXML**: XML-based FIX messaging
- **Market Data Standards**: Level I/II/III data specifications
- **Order Management Systems**: Industry best practices

### Related Documentation
- **Trading-Bot-Core Integration**: See `trading-bot-core/README.md`
- **Risk Service Integration**: See `trading-bot-risk/README.md`
- **ML Service Integration**: See `trading-bot-ml/README.md`
- **Dashboard Integration**: See `trading-bot-dashboard/README.md`
- **Backtest Integration**: See `trading-bot-backtest/README.md`

---

## 📊 Version Information

- **Current Version**: 1.0.0 (Planned)
- **Node.js Compatibility**: >=16.0.0
- **Dependencies**: Express, Axios, WebSocket, Lodash, Winston
- **Last Updated**: January 2025
- **API Stability**: Development/Planning Phase

### Development Roadmap
- **Phase 1 (Q1 2025)**: Core execution engine and order management
- **Phase 2 (Q2 2025)**: Multi-exchange support and advanced order types
- **Phase 3 (Q3 2025)**: Portfolio management and risk integration
- **Phase 4 (Q4 2025)**: Advanced analytics and performance optimization

---

## 🚀 Implementation Checklist

### For Developers
- [ ] Set up development environment and dependencies
- [ ] Implement core order management system
- [ ] Build exchange adapter framework and Xeggex integration
- [ ] Create portfolio management and P&L calculation engine
- [ ] Develop risk integration and pre-trade validation
- [ ] Implement WebSocket feeds for real-time updates
- [ ] Build RESTful API with comprehensive endpoints
- [ ] Create paper trading mode for testing
- [ ] Implement comprehensive error handling and retry logic
- [ ] Add performance monitoring and logging

### For Traders
- [ ] Configure trading parameters and risk limits
- [ ] Set up exchange API credentials and permissions
- [ ] Define position sizing and risk management rules
- [ ] Test strategies in paper trading mode
- [ ] Validate execution algorithms and slippage management
- [ ] Configure stop-loss and take-profit parameters
- [ ] Set up monitoring and alerting for live trading
- [ ] Create backup and disaster recovery procedures

### For System Administrators
- [ ] Configure production environment variables
- [ ] Set up secure credential management and encryption
- [ ] Configure monitoring and logging systems
- [ ] Set up database for persistent trade storage
- [ ] Configure backup and disaster recovery procedures
- [ ] Set up security headers and access controls
- [ ] Configure process management and auto-restart
- [ ] Test system integration and failover scenarios

---

*This technical manual serves as the complete specification and development guide for the trading-bot-execution service. The execution service provides comprehensive trade execution and portfolio management capabilities, serving as the core operational engine for the entire trading bot architecture with sophisticated risk controls and multi-exchange support.*N_USDT",
    "side": "buy",
    "type": "market",
    "quantity": 1000,
    "paperTrade": true
  }'

# Verify paper portfolio
curl http://localhost:3004/api/portfolio | jq '.summary'
```

### Performance Benchmarks
- **Order Execution Time**: <2 seconds for market orders
- **Order Management**: <100ms for order status updates
- **Portfolio Calculation**: <200ms for complete portfolio valuation
- **Risk Check**: <500ms for pre-trade risk validation
- **Exchange Connectivity**: <1 second for health checks
- **Memory Usage**: <300MB under normal trading load

---

## 🔧 Configuration

### Environment Variables (.env)
```bash
# Execution Service Configuration
PORT=3004
NODE_ENV=development

# Trading Mode
PAPER_TRADING=true
LIVE_TRADING=false

# Exchange Configuration
XEGGEX_API_KEY=your_xeggex_api_key
XEGGEX_API_SECRET=your_xeggex_api_secret
BINANCE_API_KEY=your_binance_api_key
BINANCE_API_SECRET=your_binance_api_secret

# Service URLs
CORE_SERVICE_URL=http://localhost:3000
RISK_SERVICE_URL=http://localhost:3003
ML_SERVICE_URL=http://localhost:3001

# Order Management
DEFAULT_ORDER_TIMEOUT=300000
MAX_SLIPPAGE_PERCENT=0.5
DEFAULT_TIME_IN_FORCE=GTC

# Risk Management
ENABLE_RISK_CHECKS=true
MAX_POSITION_SIZE=0.25
MAX_DAILY_LOSS=0.05
STOP_LOSS_ENABLED=true

# Portfolio Management
INITIAL_BALANCE=50000
BASE_CURRENCY=USDT
POSITION_UPDATE_INTERVAL=5000

# Logging
LOG_LEVEL=info
EXECUTION_LOG_FILE=logs/execution.log
TRADE_LOG_FILE=logs/trades.log
```

---

## 📊 Data Structures & Interfaces

### Order Interface
```typescript
interface Order {
  orderId: string;
  clientOrderId?: string;
  pair: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop_loss' | 'take_profit';
  quantity: number;
  price?: number;
  stopPrice?: number;
  timeInForce: 'GTC' | 'IOC' | 'FOK';
  status: 'submitted' | 'open' | 'partial' | 'filled' | 'cancelled' | 'rejected';
  exchange: string;
  paperTrade?: boolean;
  submitTime: number;
  fillTime?: number;
  filledQuantity: number;
  averagePrice?: number;
  totalCost: number;
  fees: number;
  signalData?: {
    source: string;
    confidence: number;
    strategy: string;
  };
}

interface Position {
  id: string;
  pair: string;
  side: 'long' | 'short';
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  realisedPnL: number;
  dayPnL: number;
  dayPnLPercent: number;
  openDate: number;
  exchange: string;
  riskMetrics: {
    positionSize: number;
    leverage: number;
    marginUsed: number;
    liquidationPrice?: number;
  };
}
```

---

## 🔍 Monitoring & Debugging

### Log Files
```bash
logs/
├── execution.log         # General execution service operations
├── execution-error.log   # Error-specific logs
├── trades.log           # All trade executions and fills
├── orders.log           # Order lifecycle tracking
├── portfolio.log        # Portfolio updates and P&L calculations
└── exchange.log         # Exchange connectivity and API calls
```

### Debug Commands
```bash
# Enable verbose execution logging
LOG_LEVEL=debug npm start

# Monitor trade executions in real-time
tail -f logs/trades.log | grep -E "(EXECUTED|FILLED)"

# Check order flow
tail -f logs/orders.log | grep -E "(SUBMITTED|FILLED|CANCELLED)"

# Check exchange connectivity
curl http://localhost:3004/api/health | jq '.exchanges'

# Test order placement in paper mode
curl -X POST http://localhost:3004/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "pair": "RVN"