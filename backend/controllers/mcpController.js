const User = require('../models/User');
const PickupPartner = require('../models/PickupPartner');
const Order = require('../models/Order');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

// @desc    Get MCP dashboard data
// @route   GET /api/mcp/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    // Get wallet balance
    const wallet = await Wallet.findOne({
      owner: req.user._id,
      ownerModel: 'User',
    });

    // Partner statistics
    const totalPartners = await PickupPartner.countDocuments({ mcp: req.user._id });
    const activePartners = await PickupPartner.countDocuments({
      mcp: req.user._id,
      status: 'active',
    });

    // Order statistics
    const totalOrders = await Order.countDocuments({ mcp: req.user._id });
    const completedOrders = await Order.countDocuments({
      mcp: req.user._id,
      status: 'completed',
    });
    const pendingOrders = await Order.countDocuments({
      mcp: req.user._id,
      status: { $in: ['pending', 'in-progress'] },
    });

    // Recent activity (orders and transactions)
    const recentOrders = await Order.find({ mcp: req.user._id })
      .populate('pickupPartner', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentTransactions = await Transaction.find({
      $or: [
        { 'from.id': req.user._id },
        { 'to.id': req.user._id },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get monthly order statistics for chart
    const monthlyStats = await getMonthlyOrderStats(req.user._id);

    res.json({
      walletBalance: wallet ? wallet.balance : 0,
      partnerStats: {
        total: totalPartners,
        active: activePartners,
        inactive: totalPartners - activePartners,
      },
      orderStats: {
        total: totalOrders,
        completed: completedOrders,
        pending: pendingOrders,
        completionRate: totalOrders > 0 ? (completedOrders / totalOrders * 100).toFixed(2) : 0,
      },
      recentOrders,
      recentTransactions,
      monthlyStats,
    });
  } catch (error) {
    console.error(`Error in getDashboardData: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to get monthly order statistics
const getMonthlyOrderStats = async (mcpId) => {
  const currentDate = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(currentDate.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  
  // Create a pipeline to aggregate orders by month
  const pipeline = [
    {
      $match: {
        mcp: mcpId,
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        totalOrders: { $sum: 1 },
        completedOrders: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0],
          },
        },
      },
    },
    {
      $sort: {
        '_id.year': 1,
        '_id.month': 1,
      },
    },
  ];

  const monthlyData = await Order.aggregate(pipeline);
  
  // Format data for chart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const result = [];

  // Get the last 6 months
  for (let i = 0; i < 6; i++) {
    const targetMonth = new Date();
    targetMonth.setMonth(currentDate.getMonth() - 5 + i);
    
    const year = targetMonth.getFullYear();
    const month = targetMonth.getMonth() + 1;
    
    const monthData = monthlyData.find(
      (item) => item._id.year === year && item._id.month === month
    );
    
    result.push({
      month: months[month - 1],
      totalOrders: monthData ? monthData.totalOrders : 0,
      completedOrders: monthData ? monthData.completedOrders : 0,
    });
  }

  return result;
};

module.exports = {
  getDashboardData,
};