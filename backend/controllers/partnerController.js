const PickupPartner = require('../models/PickupPartner');
const Wallet = require('../models/Wallet');
const Order = require('../models/Order');

// @desc    Get all partners for an MCP
// @route   GET /api/partners
// @access  Private
const getPartners = async (req, res) => {
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

    // Search by name or phone if provided
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { phone: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const total = await PickupPartner.countDocuments(filter);
    const partners = await PickupPartner.find(filter)
      .populate('wallet', 'balance')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.json({
      partners,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    
    console.error(`Error in getPartners: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get partner by ID
// @route   GET /api/partners/:id
// @access  Private
const getPartnerById = async (req, res) => {
  try {
    const partner = await PickupPartner.findOne({
      _id: req.params.id,
      mcp: req.user._id,
    }).populate('wallet', 'balance totalAdded totalWithdrawn');

    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    // Get order statistics
    const completedOrders = await Order.countDocuments({
      pickupPartner: partner._id,
      status: 'completed',
    });

    const pendingOrders = await Order.countDocuments({
      pickupPartner: partner._id,
      status: { $in: ['pending', 'in-progress'] },
    });

    const totalOrders = completedOrders + pendingOrders;

    // Get recent orders
    const recentOrders = await Order.find({
      pickupPartner: partner._id,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      partner,
      statistics: {
        completedOrders,
        pendingOrders,
        totalOrders,
      },
      recentOrders,
    });
  } catch (error) {
    console.error(`Error in getPartnerById: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new partner
// @route   POST /api/partners
// @access  Private
const createPartner = async (req, res) => {
  try {
    const { name, phone, email, address, paymentType, paymentAmount } = req.body;

    // Validate required fields
    if (!name || !phone || !email || !address || !paymentType || !paymentAmount) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if partner with same email or phone already exists
    const partnerExists = await PickupPartner.findOne({
      mcp: req.user._id,
      $or: [{ email }, { phone }],
    });

    if (partnerExists) {
      return res.status(400).json({ message: 'Partner with this email or phone already exists' });
    }

    // Create new partner
    const partner = await PickupPartner.create({
      name,
      phone,
      email,
      address,
      paymentType,
      paymentAmount,
      mcp: req.user._id,
      status: 'active',
    });

    // Create wallet for the partner
    const wallet = await Wallet.create({
      owner: partner._id,
      ownerModel: 'PickupPartner',
      balance: 0,
    });

    // Link wallet to partner
    partner.wallet = wallet._id;
    await partner.save();

    res.status(201).json({
      message: 'Partner created successfully',
      partner: {
        _id: partner._id,
        name: partner.name,
        phone: partner.phone,
        email: partner.email,
        status: partner.status,
        paymentType: partner.paymentType,
        paymentAmount: partner.paymentAmount,
      },
    });
  } catch (error) {
    console.error(`Error in createPartner: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update partner
// @route   PUT /api/partners/:id
// @access  Private
const updatePartner = async (req, res) => {
  try {
    const partner = await PickupPartner.findOne({
      _id: req.params.id,
      mcp: req.user._id,
    });

    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    // Update fields
    partner.name = req.body.name || partner.name;
    partner.phone = req.body.phone || partner.phone;
    partner.email = req.body.email || partner.email;
    partner.address = req.body.address || partner.address;
    partner.status = req.body.status || partner.status;
    partner.paymentType = req.body.paymentType || partner.paymentType;
    partner.paymentAmount = req.body.paymentAmount || partner.paymentAmount;

    // Save updated partner
    const updatedPartner = await partner.save();

    res.json({
      message: 'Partner updated successfully',
      partner: updatedPartner,
    });
  } catch (error) {
    console.error(`Error in updatePartner: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete partner
// @route   DELETE /api/partners/:id
// @access  Private
const deletePartner = async (req, res) => {
  try {
    const partner = await PickupPartner.findOne({
      _id: req.params.id,
      mcp: req.user._id,
    });

    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    // Check if partner has active orders
    const activeOrders = await Order.countDocuments({
      pickupPartner: partner._id,
      status: { $in: ['pending', 'in-progress'] },
    });

    if (activeOrders > 0) {
      return res.status(400).json({
        message: 'Cannot delete partner with active orders. Please reassign or complete these orders first.',
      });
    }

    // Delete partner's wallet
    if (partner.wallet) {
      await Wallet.findByIdAndDelete(partner.wallet);
    }

    // Delete partner
    await partner.remove();

    res.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    console.error(`Error in deletePartner: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get partner statistics
// @route   GET /api/partners/statistics
// @access  Private
const getPartnerStatistics = async (req, res) => {
  try {
    // Count total partners
    const totalPartners = await PickupPartner.countDocuments({ mcp: req.user._id });
    
    // Count active partners
    const activePartners = await PickupPartner.countDocuments({
      mcp: req.user._id,
      status: 'active',
    });
    
    // Count inactive partners
    const inactivePartners = await PickupPartner.countDocuments({
      mcp: req.user._id,
      status: 'inactive',
    });

    // Get top performing partners (by completed orders)
    const topPartners = await PickupPartner.find({ mcp: req.user._id })
      .sort({ completedOrders: -1 })
      .limit(5);

    res.json({
      totalPartners,
      activePartners,
      inactivePartners,
      topPartners,
    });
  } catch (error) {
    console.error(`Error in getPartnerStatistics: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
  getPartnerStatistics,
};