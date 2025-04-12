const Order = require('../models/Order');

const seedOrders = async (mcpId, partnerIds = []) => {
  const orders = [];

  for (let i = 1; i <= 5; i++) {
    const assignedPartner = partnerIds[i % partnerIds.length];

    const order = await Order.create({
      orderNumber: `ORD-${i}-${Date.now()}`,
      customer: {
        name: `Customer ${i}`,
        phone: `88000000${i}`,
        address: 'Customer Street',
      },
      pickupLocation: 'Warehouse A',
      dropLocation: 'Customer Street',
      paymentAmount: 200 + i * 10,
      pickupPartner: assignedPartner?._id || null,
      status: i % 3 === 0 ? 'completed' : 'pending',
      mcp: mcpId,
    });

    orders.push(order);
  }

  return orders;
};

module.exports = seedOrders;
