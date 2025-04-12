require('dotenv').config();
const mongoose = require('mongoose');
const seedPartners = require('./seedPartners');
const seedOrders = require('./seedOrders');
const seedMcpWallet = require('./seedWallets');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mcp';

const mcpId = '67fa531b7a3f8d31b565e0d7'; //MCP ID of user1

const runSeed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to DB');

    const wallet = await seedMcpWallet(mcpId);
    console.log('✅ MCP Wallet Created:', wallet._id);

    const partners = await seedPartners(mcpId);
    console.log(`✅ ${partners.length} Pickup Partners Seeded`);

    const orders = await seedOrders(mcpId, partners);
    console.log(`✅ ${orders.length} Orders Seeded`);

    console.log('Seeding completed.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  }
};

runSeed();
