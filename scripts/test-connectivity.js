const axios = require('axios');

const services = {
  'trading-bot-execution': 'http://localhost:3004',
  'trading-bot-core': 'http://localhost:3000',
  'trading-bot-risk': 'http://localhost:3003',
  'trading-bot-ml': 'http://localhost:3001',
  'trading-bot-dashboard': 'http://localhost:3005'
};

async function testServiceConnectivity() {
  console.log('🔍 Testing execution service connectivity...\n');
  
  for (const [name, url] of Object.entries(services)) {
    try {
      const response = await axios.get(`${url}/api/health`, { timeout: 5000 });
      console.log(`✅ ${name}: ${response.data.status} (${response.status})`);
    } catch (error) {
      console.log(`❌ ${name}: ${error.message}`);
    }
  }
  
  console.log('\n📊 Testing execution API endpoints...');
  
  try {
    const portfolio = await axios.get('http://localhost:3004/api/portfolio');
    console.log('✅ Portfolio endpoint responding');
    
    const orders = await axios.get('http://localhost:3004/api/orders');
    console.log('✅ Orders endpoint responding');
    
  } catch (error) {
    console.log(`❌ Execution API: ${error.message}`);
  }
}

testServiceConnectivity().catch(console.error);