# trading-bot-execution - Development Guide

**Repository**: https://github.com/makoshark2001/trading-bot-execution  
**Port**: 3004  
**Priority**: 5 (Depends on core + ML + risk services)

## 🎯 Service Purpose

Trade execution and order management service providing automated trade execution, portfolio management, and order lifecycle management. Integrates with all other services to deliver sophisticated execution capabilities with risk controls.

## 💬 Chat Instructions for Claude

```
I'm building the trade execution service that handles actual trading operations. This integrates with all other services to execute trades based on signals from core, ML predictions, and risk management validation.

Key requirements:
- Automated trade execution with multiple order types
- Order management system with lifecycle tracking
- Portfolio tracking and P&L calculation
- Exchange connectivity (Xeggex integration)
- Integration with core (port 3000), ML (port 3001), and risk (port 3003) services
- RESTful API on port 3004
- Paper trading mode for testing
- Real-time position and portfolio management

All other services are running. I need to build the execution engine that puts it all together.
```

## 📋 Implementation To-Do List

### ✅ Phase 5A: Project Setup & Service Integration

- [ ] **Project Infrastructure**
  - [ ] Initialize Node.js project: `npm init -y`
  - [ ] Install dependencies:
    ```bash
    npm install express axios lodash winston cors dotenv
    npm install --save-dev jest nodemon
    ```
  - [ ] Create folder structure:
    ```
    src/
    ├── server/
    ├── execution/
    ├── orders/
    ├── portfolio/
    ├── exchange/
    ├── services/
    ├── routes/
    └── utils/
    config/
    logs/
    tests/
    ```

- [ ] **Service Integration Layer**
  - [ ] File: `src/services/ServiceIntegration.js` - All service clients
  - [ ] Core service integration (market data + signals)
  - [ ] ML service integration (predictions)
  - [ ] Risk service integration (position sizing + validation)
  - [ ] Health monitoring for all dependencies
  - [ ] Fallback mechanisms for service outages

### ✅ Phase 5B: Order Management System

- [ ] **Order Types & Lifecycle**
  - [ ] File: `src/orders/OrderManager.js` - Complete order management
  - [ ] **Order Types**:
    - Market orders (immediate execution)
    - Limit orders (price-specified execution)
    - Stop-loss orders (risk management)
    - Take-profit orders (profit realization)
    - Bracket orders (combined entry + exit)
  - [ ] **Order Lifecycle**:
    - Order validation and risk checks
    - Order submission to exchange
    - Fill tracking and partial fills
    - Order cancellation and modification
    - Order history and audit trail

- [ ] **Order Routing & Execution**
  - [ ] File: `src/execution/ExecutionEngine.js` - Trade execution logic
  - [ ] Intelligent order routing
  - [ ] Execution algorithms (TWAP, VWAP for large orders)
  - [ ] Slippage management and monitoring
  - [ ] Commission calculation and tracking
  - [ ] Real-time execution reporting

### ✅ Phase 5C: Portfolio Management

- [ ] **Position Tracking**
  - [ ] File: `src/portfolio/PortfolioManager.js` - Portfolio state management
  - [ ] Real-time position tracking (long/short)
  - [ ] Average price calculation for position building
  - [ ] Unrealized P&L calculation
  - [ ] Realized P&L tracking
  - [ ] Position sizing and risk exposure monitoring

- [ ] **P&L Calculation Engine**
  - [ ] File: `src/portfolio/PnLCalculator.js` - Profit/loss calculations
  - [ ] Mark-to-market P&L
  - [ ] Realized vs unrealized P&L separation
  - [ ] Commission and fee tracking
  - [ ] Performance metrics (daily, weekly, monthly returns)
  - [ ] Drawdown calculation and monitoring

### ✅ Phase 5D: Exchange Integration

- [ ] **Exchange Connectivity**
  - [ ] File: `src/exchange/ExchangeManager.js` - Multi-exchange support
  - [ ] Xeggex trading API integration
  - [ ] Order placement and management
  - [ ] Real-time balance updates
  - [ ] Trade confirmation handling
  - [ ] Exchange health monitoring

- [ ] **Paper Trading Mode**
  - [ ] File: `src/execution/PaperTrading.js` - Simulated trading
  - [ ] Virtual portfolio management
  - [ ] Realistic execution simulation
  - [ ] Paper trading P&L tracking
  - [ ] Easy toggle between paper and live trading

### ✅ Phase 5E: Signal Execution & API

- [ ] **Signal Processing Engine**
  - [ ] File: `src/execution/SignalProcessor.js` - Automated signal execution
  - [ ] Signal aggregation from core + ML services
  - [ ] Risk validation through risk service
  - [ ] Position sizing optimization
  - [ ] Automated trade execution based on signals
  - [ ] Signal confidence filtering

- [ ] **Execution API**
  - [ ] File: `src/routes/` - Complete API endpoints
    - `health.js` - GET /api/health (service + exchange status)
    - `portfolio.js` - GET /api/portfolio (current portfolio status)
    - `orders.js` - POST /api/orders (place new order)
    - `orders.js` - GET /api/orders (order history and status)
    - `signals.js` - POST /api/signals/execute (execute trading signal)

## 📊 Key API Endpoints to Implement

```javascript
// Service health check
GET /api/health
Response: {
  status: "healthy",
  service: "trading-bot-execution",
  exchanges: {
    xeggex: {
      status: "connected",
      lastPing: 1704067195000,
      rateLimit: { remaining: 95, resetTime: 1704067260000 }
    }
  },
  services: {
    core: { status: "healthy", lastCheck: 1704067185000 },
    ml: { status: "healthy", lastCheck: 1704067180000 },
    risk: { status: "healthy", lastCheck: 1704067175000 }
  },
  executionEngine: {
    status: "operational",
    ordersProcessed: 1247,
    successRate: 98.4
  }
}

// Portfolio status
GET /api/portfolio
Response: {
  summary: {
    totalValue: 52450.75,
    totalCash: 8920.50,
    totalPositions: 43530.25,
    unrealizedPnL: 1247.30,
    dayPnL: 342.75
  },
  positions: [
    {
      id: "POS_001",
      pair: "XMR_USDT",
      side: "long",
      quantity: 125.50,
      averagePrice: 158.45,
      currentPrice: 162.30,
      marketValue: 20368.65,
      unrealizedPnL: 483.25,
      dayPnL: 125.50,
      riskMetrics: {
        positionSize: 0.39,
        leverage: 1.0,
        liquidationPrice: null
      }
    }
  ],
  balances: [
    {
      currency: "USDT",
      total: 8920.50,
      available: 8420.50,
      locked: 500.00
    }
  ]
}

// Place order
POST /api/orders
Body: {
  pair: "RVN_USDT",
  side: "buy",
  type: "market",
  quantity: 5000,
  price: 0.0245,
  stopLoss: 0.0233,
  takeProfit: 0.0270,
  paperTrade: false,
  riskCheck: true
}
Response: {
  orderId: "ORD_20250101_001247",
  status: "submitted",
  pair: "RVN_USDT",
  side: "buy",
  type: "market",
  quantity: 5000,
  riskValidation: {
    passed: true,
    recommendedSize: 5000,
    maxRisk: 122.50
  },
  estimatedCost: 122.50,
  linkedOrders: {
    stopLoss: "ORD_20250101_001248",
    takeProfit: "ORD_20250101_001249"
  }
}

// Execute trading signal
POST /api/signals/execute
Body: {
  pair: "BEL_USDT",
  signal: "BUY",
  confidence: 0.82,
  source: "ml_prediction",
  strategy: "ensemble_model",
  riskParameters: {
    maxRiskPercent: 0.02,
    positionSizeMethod: "kelly"
  }
}
Response: {
  signalId: "SIG_20250101_001",
  status: "executed",
  orders: [
    {
      orderId: "ORD_20250101_001252",
      type: "market",
      side: "buy",
      quantity: 2180,
      status: "submitted"
    }
  ],
  positionSizing: {
    recommendedSize: 2180,
    riskAmount: 61.52,
    method: "kelly_criterion"
  }
}

// Order history
GET /api/orders?status=filled&limit=50
Response: {
  orders: [
    {
      orderId: "ORD_20250101_001247",
      status: "filled",
      pair: "RVN_USDT",
      side: "buy",
      quantity: 5000,
      filledQuantity: 5000,
      averagePrice: 0.02451,
      totalCost: 122.55,
      fees: 0.12,
      executionTime: 3000,
      fills: [
        {
          fillId: "FILL_001",
          quantity: 5000,
          price: 0.02451,
          timestamp: 1704067203000,
          fee: 0.12
        }
      ]
    }
  ]
}
```

## 🏗️ Execution Engine Architecture

### Core Components:

#### 1. **Order Management Flow**
```javascript
// Order processing pipeline
class OrderManager {
  async processOrder(order) {
    // 1. Validate order parameters
    const validation = await this.validateOrder(order);
    
    // 2. Risk check through risk service
    if (order.riskCheck) {
      const riskResult = await this.riskService.validateTrade(order);
      if (!riskResult.approved) {
        throw new Error(`Risk check failed: ${riskResult.reason}`);
      }
      order.quantity = riskResult.recommendedSize;
    }
    
    // 3. Submit to exchange
    const exchangeOrder = await this.exchange.placeOrder(order);
    
    // 4. Track order lifecycle
    await this.trackOrder(exchangeOrder);
    
    // 5. Update portfolio on fills
    await this.updatePortfolioOnFill(exchangeOrder);
    
    return exchangeOrder;
  }
}
```

#### 2. **Signal Execution Flow**
```javascript
// Automated signal execution
class SignalProcessor {
  async executeSignal(signal) {
    // 1. Get position sizing from risk service
    const sizeRecommendation = await this.riskService.calculatePositionSize({
      pair: signal.pair,
      signal: signal.signal,
      confidence: signal.confidence
    });
    
    // 2. Create order based on signal
    const order = {
      pair: signal.pair,
      side: signal.signal.toLowerCase(),
      type: 'market',
      quantity: sizeRecommendation.recommendedSize,
      source: signal.source,
      confidence: signal.confidence
    };
    
    // 3. Execute order
    const result = await this.orderManager.processOrder(order);
    
    // 4. Set up risk management orders
    if (result.status === 'filled') {
      await this.setupRiskManagementOrders(result, signal);
    }
    
    return result;
  }
}
```

#### 3. **Portfolio Management**
```javascript
// Real-time portfolio tracking
class PortfolioManager {
  async updatePosition(trade) {
    const positionKey = `${trade.pair}_${trade.side}`;
    const existingPosition = this.positions.get(positionKey);
    
    if (existingPosition) {
      // Update existing position
      await this.updateExistingPosition(existingPosition, trade);
    } else {
      // Create new position
      await this.createNewPosition(trade);
    }
    
    // Recalculate portfolio metrics
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
```

## ⚙️ Configuration Requirements

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

# Service URLs
CORE_SERVICE_URL=http://localhost:3000
ML_SERVICE_URL=http://localhost:3001
RISK_SERVICE_URL=http://localhost:3003

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
```

## 🔧 Order Types Implementation

### 1. **Market Orders**
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
        quantity: sliceQuantity
      });
      
      remainingQuantity -= sliceQuantity;
    }
    
    return { slices: executionSlices };
  }
}
```

### 2. **Risk Management Orders**
```javascript
class RiskManagementOrders {
  async setupStopLossAndTakeProfit(position, stopLossPercent, takeProfitPercent) {
    const stopLossPrice = position.side === 'long' 
      ? position.entryPrice * (1 - stopLossPercent)
      : position.entryPrice * (1 + stopLossPercent);
      
    const takeProfitPrice = position.side === 'long'
      ? position.entryPrice * (1 + takeProfitPercent)
      : position.entryPrice * (1 - takeProfitPercent);
    
    // Place stop-loss order
    const stopLossOrder = await this.orderManager.placeOrder({
      pair: position.pair,
      side: position.side === 'long' ? 'sell' : 'buy',
      type: 'stop_loss',
      quantity: position.quantity,
      stopPrice: stopLossPrice,
      linkedPosition: position.id
    });
    
    // Place take-profit order
    const takeProfitOrder = await this.orderManager.placeOrder({
      pair: position.pair,
      side: position.side === 'long' ? 'sell' : 'buy',
      type: 'take_profit',
      quantity: position.quantity,
      price: takeProfitPrice,
      linkedPosition: position.id
    });
    
    return { stopLossOrder, takeProfitOrder };
  }
}
```

## 🧪 Testing & Production Features

### Testing Strategy
```bash
# Test commands to implement
npm run test:orders       # Order management tests
npm run test:portfolio    # Portfolio tracking tests
npm run test:execution    # Execution engine tests
npm run test:paper        # Paper trading tests
npm run test:integration  # Service integration tests
npm run test:all         # Comprehensive test suite

# Paper trading verification
curl -X POST http://localhost:3004/api/orders \
  -H "Content-Type: application/json" \
  -d '{"pair": "RVN_USDT", "side": "buy", "type": "market", "quantity": 1000, "paperTrade": true}'

# Portfolio check
curl http://localhost:3004/api/portfolio | jq '.summary'
```

### Paper Trading Mode
```javascript
class PaperTradingEngine {
  constructor() {
    this.paperPortfolio = {
      cash: 50000,
      positions: new Map(),
      trades: []
    };
  }
  
  async executePaperTrade(order) {
    // Simulate realistic execution
    const currentPrice = await this.getCurrentPrice(order.pair);
    const slippage = this.calculateSlippage(order);
    const executionPrice = currentPrice * (1 + slippage);
    
    // Update paper portfolio
    await this.updatePaperPortfolio(order, executionPrice);
    
    // Return realistic trade result
    return {
      orderId: `PAPER_${Date.now()}`,
      status: 'filled',
      executionPrice: executionPrice,
      commission: order.quantity * executionPrice * 0.001
    };
  }
}
```

## 📊 Performance Benchmarks

- **Order Execution Time**: <2 seconds for market orders
- **Order Management**: <100ms for order status updates
- **Portfolio Calculation**: <200ms for complete portfolio valuation
- **Risk Check**: <500ms for pre-trade risk validation
- **Exchange Connectivity**: <1 second for health checks
- **Memory Usage**: <300MB under normal trading load

## 🔗 Integration Points

**Consumes from:**
- trading-bot-core (Port 3000) - Market data and trading signals
- trading-bot-ml (Port 3001) - ML predictions for signal enhancement
- trading-bot-risk (Port 3003) - Position sizing and risk validation

**Provides to:**
- trading-bot-dashboard (Port 3005) - Portfolio data and trade history

## ✅ Success Criteria

**Phase 5A Complete When:**
- Service integrates successfully with all dependencies
- Health monitoring shows all services operational

**Phase 5B Complete When:**
- Order management system handles all order types
- Order lifecycle tracking works correctly
- Exchange integration places and manages orders

**Phase 5C Complete When:**
- Portfolio tracking accurately reflects positions
- P&L calculations are correct and real-time
- Position sizing integrates with risk management

**Phase 5D Complete When:**
- Exchange connectivity is stable and reliable
- Paper trading mode works for safe testing
- Real trading can be enabled with confidence

**Phase 5E Complete When:**
- Signal execution works end-to-end
- All API endpoints provide accurate data
- System can run automated trading strategies

## 🚨 Common Issues & Solutions

### 1. **Exchange Connectivity Issues**
```bash
# Check API credentials
echo $XEGGEX_API_KEY | cut -c1-8

# Test exchange connectivity
curl -H "X-API-KEY: $XEGGEX_API_KEY" https://api.xeggex.com/api/v2/market/getlist

# Check rate limiting
curl http://localhost:3004/api/health | jq '.exchanges.xeggex.rateLimit'
```

### 2. **Order Execution Failures**
```bash
# Check order validation
curl -X POST http://localhost:3004/api/orders \
  -H "Content-Type: application/json" \
  -d '{"pair": "INVALID_PAIR", "side": "buy", "type": "market", "quantity": 1000}'

# Monitor failed orders
grep "ORDER_FAILED" logs/execution-error.log
```

### 3. **Portfolio Synchronization**
```bash
# Force portfolio refresh
curl -X POST http://localhost:3004/api/portfolio/refresh

# Check position tracking
curl http://localhost:3004/api/portfolio | jq '.positions'
```

---

*Save this file as `DEVELOPMENT_GUIDE.md` in the trading-bot-execution repository root*