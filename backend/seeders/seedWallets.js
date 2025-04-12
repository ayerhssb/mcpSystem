const Wallet = require('../models/Wallet');

const seedMcpWallet = async (mcpId) => {
  const wallet = await Wallet.create({
    owner: mcpId,
    ownerModel: 'User',
    balance: 5000,
  });

  return wallet;
};

module.exports = seedMcpWallet;
