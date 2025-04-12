const PickupPartner = require('../models/PickupPartner');
const Wallet = require('../models/Wallet');

const seedPartners = async (mcpId) => {
  const partners = [];

  for (let i = 1; i <= 3; i++) {
    const partner = await PickupPartner.create({
      name: `Partner ${i}`,
      phone: `90000000${i}`,
      email: `partner${i}@example.com`,
      address: 'Local City',
      paymentType: 'fixed',
      paymentAmount: 50,
      mcp: mcpId,
      status: 'active',
    });

    const wallet = await Wallet.create({
      owner: partner._id,
      ownerModel: 'PickupPartner',
      balance: 500,
    });

    partner.wallet = wallet._id;
    await partner.save();

    partners.push(partner);
  }

  return partners;
};

module.exports = seedPartners;
