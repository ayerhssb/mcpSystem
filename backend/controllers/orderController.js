const Order = require('../models/Order');
const PickupPartner = require('../models/PickupPartner');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

// @desc    Get all orders for an MCP
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    // Build filter object
    const filter = { mcp: req.user._id };
    
    // Add status filter if provided
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Add partner filter if provided
    if (req.query.partner) {
      filter.pickupPartner = req.query.partner;
    }

    // Add date range filter if provided
    if (req.query.startDate && req.query.endDate) {
      filter.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('pickupPartner', 'name phone')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.json({
      orders,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error(`Error in getOrders: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      mcp: req.user._id,
    }).populate('pickupPartner', 'name phone email status');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error(`Error in getOrderById: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      customer,
      paymentAmount,
      description,
      pickupLocation,
      dropLocation,
      pickupPartnerId,
    } = req.body;

    // Validate required fields
    if (!customer || !customer.name || !customer.phone || !customer.address || !paymentAmount) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Create new order
    const order = await Order.create({
      customer,
      paymentAmount,
      description,
      pickupLocation,
      dropLocation,
      mcp: req.user._id,
      status: 'pending',
    });

    // If pickup partner is specified, assign the order
    if (pickupPartnerId) {
      const partner = await PickupPartner.findOne({
        _id: pickupPartnerId,
        mcp: req.user._id,
      });

      if (!partner) {
        return res.status(404).json({ message: 'Pickup partner not found' });
      }

      order.pickupPartner = partner._id;
      order.assignedAt = new Date();
      await order.save();

      // Update partner's order counts
      partner.pendingOrders += 1;
      partner.totalOrders += 1;
      await partner.save();
    }

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error(`Error in createOrder: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      mcp: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update fields
    order.customer = req.body.customer || order.customer;
    order.paymentAmount = req.body.paymentAmount || order.paymentAmount;
    order.description = req.body.description || order.description;
    order.pickupLocation = req.body.pickupLocation || order.pickupLocation;
    order.dropLocation = req.body.dropLocation || order.dropLocation;
    
    // Only update status if provided and different
    if (req.body.status && req.body.status !== order.status) {
      const previousStatus = order.status;
      order.status = req.body.status;
      
      // If order is completed
      if (order.status === 'completed' && previousStatus !== 'completed') {
        order.completedAt = new Date();
        
        // Update partner's order counts if partner exists
        if (order.pickupPartner) {
          const partner = await PickupPartner.findById(order.pickupPartner);
          if (partner) {
            partner.completedOrders += 1;
            partner.pendingOrders -= 1;
            await partner.save();
            
            // Process payment to partner based on payment type
            const partnerWallet = await Wallet.findOne({
              owner: partner._id,
              ownerModel: 'PickupPartner',
            });
            
            if (partnerWallet) {
              const paymentAmount = partner.paymentType === 'fixed' 
                ? partner.paymentAmount 
                : (order.paymentAmount * partner.paymentAmount / 100);
              
              // Check if MCP wallet has enough balance
              const mcpWallet = await Wallet.findOne({
                owner: req.user._id,
                ownerModel: 'User',
              });
              
              if (mcpWallet && mcpWallet.balance >= paymentAmount) {
                // Deduct from MCP wallet
                mcpWallet.balance -= paymentAmount;
                await mcpWallet.save();
                
                // Add to partner wallet
                partnerWallet.balance += paymentAmount;
                await partnerWallet.save();
                
                // Create transaction record
                await Transaction.create({
                  amount: paymentAmount,
                  type: 'payment',
                  status: 'completed',
                  from: {
                    id: req.user._id,
                    model: 'User',
                    name: req.user.name,
                  },
                  to: {
                    id: partner._id,
                    model: 'PickupPartner',
                    name: partner.name,
                  },
                  description: `Payment for order #${order.orderNumber}`,
                  relatedOrder: order._id,
                });
              } else {
                // If MCP doesn't have enough balance, create a pending transaction
                await Transaction.create({
                  amount: paymentAmount,
                  type: 'payment',
                  status: 'pending',
                  from: {
                    id: req.user._id,
                    model: 'User',
                    name: req.user.name,
                  },
                  to: {
                    id: partner._id,
                    model: 'PickupPartner',
                    name: partner.name,
                  },
                  description: `Payment for order #${order.orderNumber} (Pending due to insufficient funds)`,
                  relatedOrder: order._id,
                });
              }
            }
          }
        }
      }
    }

    // Save updated order
    const updatedOrder = await order.save();

    res.json({
      message: 'Order updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.error(`Error in updateOrder: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Assign order to pickup partner
// @route   PUT /api/orders/:id/assign
// @access  Private
const assignOrder = async (req, res) => {
  try {
    const { partnerId } = req.body;

    if (!partnerId) {
      return res.status(400).json({ message: 'Partner ID is required' });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      mcp: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order is already completed
    if (order.status === 'completed') {
      return res.status(400).json({ message: 'Cannot reassign completed order' });
    }

    // Get partner
    const partner = await PickupPartner.findOne({
      _id: partnerId,
      mcp: req.user._id,
    });

    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    // If order was previously assigned to a different partner, update that partner's stats
    if (order.pickupPartner && !order.pickupPartner.equals(partner._id)) {
      const previousPartner = await PickupPartner.findById(order.pickupPartner);
      if (previousPartner) {
        previousPartner.pendingOrders -= 1;
        await previousPartner.save();
      }
    }

    // Assign order to new partner
    order.pickupPartner = partner._id;
    order.assignedAt = new Date();
    await order.save();

    // Update partner's order counts if not already assigned to this partner
    if (!order.pickupPartner || !order.pickupPartner.equals(partner._id)) {
      partner.pendingOrders += 1;
      partner.totalOrders += 1;
      await partner.save();
    }

    res.json({
      message: 'Order assigned successfully',
      order,
    });
  } catch (error) {
    console.error(`Error in assignOrder: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get order statistics
// @route   GET /api/orders/statistics
// @access  Private
const getOrderStatistics = async (req, res) => {
  try {
    // Count total orders
    const totalOrders = await Order.countDocuments({ mcp: req.user._id });
    
    // Count orders by status
    const pendingOrders = await Order.countDocuments({
      mcp: req.user._id,
      status: 'pending',
    });
    
    const inProgressOrders = await Order.countDocuments({
      mcp: req.user._id,
      status: 'in-progress',
    });
    
    const completedOrders = await Order.countDocuments({
      mcp: req.user._id,
      status: 'completed',
    });
    
    const cancelledOrders = await Order.countDocuments({
      mcp: req.user._id,
      status: 'cancelled',
    });

    // Get recent orders
    const recentOrders = await Order.find({ mcp: req.user._id })
      .populate('pickupPartner', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalOrders,
      pendingOrders,
      inProgressOrders,
      completedOrders,
      cancelledOrders,
      recentOrders,
    });
  } catch (error) {
    console.error(`Error in getOrderStatistics: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  assignOrder,
  getOrderStatistics,
};