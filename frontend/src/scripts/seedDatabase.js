// src/scripts/seedDatabase.js
const mongoose = require('mongoose');
const { partnersSeed } = require('../data/seedData');
const PickupPartner = require('../models/PickupPartner');
const Wallet = require('../models/Wallet');
const config = require('../config/config');

// Connect to MongoDB
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected for seeding...'))
  .catch(err => console.error('MongoDB connection error:', err));

// Seed partners
const seedPartners = async () => {
  try {
    // Clear existing partners
    await PickupPartner.deleteMany({});
    console.log('Existing partners cleared');
    
    // Clear associated wallets
    await Wallet.deleteMany({ ownerModel: 'PickupPartner' });
    console.log('Existing partner wallets cleared');
    
    // Seed new partners
    for (const partnerData of partnersSeed) {
      // Create the partner
      const partner = await PickupPartner.create({
        ...partnerData,
        mcp: '64f9a3f7c5dc3e001f3b4c8e', // Example MCP user ID - replace with a valid user ID from your database
      });
      
      // Create wallet for the partner
      const wallet = await Wallet.create({
        owner: partner._id,
        ownerModel: 'PickupPartner',
        balance: Math.floor(Math.random() * 5000), // Random balance between 0 and 5000
        totalAdded: Math.floor(Math.random() * 10000),
        totalWithdrawn: Math.floor(Math.random() * 5000),
      });
      
      // Link wallet to partner
      partner.wallet = wallet._id;
      await partner.save();
      
      console.log(`Partner created: ${partner.name}`);
    }
    
    console.log('Partner seeding completed');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
};

// Execute seeding
seedPartners();