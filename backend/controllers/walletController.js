const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const PickupPartner = require('../models/PickupPartner');

// @desc    Get wallet balance
// @route   GET /api/wallet/balance
// @access  Private
const getWalletBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({
      owner: req.user._id,
      ownerModel: 'User',
    });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    res.json({
      balance: wallet.balance,
      totalAdded: wallet.totalAdded,
      totalWithdrawn: wallet.totalWithdrawn,
      currency: wallet.currency,
    });
  } catch (error) {
    console.error(`Error in getWalletBalance: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add funds to wallet
// @route   POST /api/wallet/add-funds
// @access  Private
const addFunds = async (req, res) => {
  try {
    const { amount, paymentMethod, paymentDetails } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const wallet = await Wallet.findOne({
      owner: req.user._id,
      ownerModel: 'User',
    });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    // Update wallet balance
    wallet.balance += Number(amount);
    wallet.totalAdded += Number(amount);
    await wallet.save();

    // Create transaction record
    const transaction = await Transaction.create({
      amount: Number(amount),
      type: 'deposit',
      status: 'completed',
      from: {
        model: 'System',
        name: paymentMethod || 'Bank Transfer',
      },
      to: {
        id: req.user._id,
        model: 'User',
        name: req.user.name,
      },
      description: `Funds added via ${paymentMethod || 'Bank Transfer'}`,
    });

    res.status(201).json({
      message: 'Funds added successfully',
      newBalance: wallet.balance,
      transaction: {
        id: transaction.transactionId,
        amount: transaction.amount,
        status: transaction.status,
        date: transaction.createdAt,
      },
    });
  } catch (error) {
    console.error(`Error in addFunds: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Transfer funds to partner
// @route   POST /api/wallet/transfer-to-partner
// @access  Private
const transferToPartner = async (req, res) => {
  try {
    const { partnerId, amount, description } = req.body;

    if (!partnerId || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    // Find partner
    const partner = await PickupPartner.findOne({
      _id: partnerId,
      mcp: req.user._id,
    }).populate('wallet');

    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    // Find MCP wallet
    const mcpWallet = await Wallet.findOne({
      owner: req.user._id,
      ownerModel: 'User',
    });

    if (!mcpWallet) {
      return res.status(404).json({ message: 'MCP wallet not found' });
    }

    // Check if MCP has enough balance
    if (mcpWallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // If partner doesn't have a wallet yet, create one
    if (!partner.wallet) {
      const newWallet = await Wallet.create({
        owner: partner._id,
        ownerModel: 'PickupPartner',
        balance: 0,
      });
      partner.wallet = newWallet._id;
      await partner.save();
      partner.wallet = newWallet;
    }

    // Update wallets
    mcpWallet.balance -= Number(amount);
    await mcpWallet.save();

    partner.wallet.balance += Number(amount);
    await partner.wallet.save();

    // Create transaction record
    const transaction = await Transaction.create({
      amount: Number(amount),
      type: 'transfer',
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
      description: description || `Funds transferred to partner ${partner.name}`,
    });

    res.status(200).json({
      message: 'Funds transferred successfully',
      newMcpBalance: mcpWallet.balance,
      newPartnerBalance: partner.wallet.balance,
      transaction: {
        id: transaction.transactionId,
        amount: transaction.amount,
        status: transaction.status,
        date: transaction.createdAt,
      },
    });
  } catch (error) {
    console.error(`Error in transferToPartner: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get transaction history
// @route   GET /api/wallet/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    // Prepare filter for transactions related to the MCP
    const filter = {
      $or: [
        { 'from.id': req.user._id },
        { 'to.id': req.user._id },
      ],
    };

    // Apply date filter if provided
    if (req.query.startDate && req.query.endDate) {
      filter.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    // Apply type filter if provided
    if (req.query.type) {
      filter.type = req.query.type;
    }

    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.json({
      transactions,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error(`Error in getTransactions: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Withdraw funds
// @route   POST /api/wallet/withdraw
// @access  Private
const withdrawFunds = async (req, res) => {
  try {
    const { amount, bankDetails, description } = req.body;

    if (!amount || amount <= 0 || !bankDetails) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const wallet = await Wallet.findOne({
      owner: req.user._id,
      ownerModel: 'User',
    });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    // Check if user has enough balance
    if (wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // Update wallet balance
    wallet.balance -= Number(amount);
    wallet.totalWithdrawn += Number(amount);
    await wallet.save();

    // Create transaction record
    const transaction = await Transaction.create({
      amount: Number(amount),
      type: 'withdrawal',
      status: 'completed',
      from: {
        id: req.user._id,
        model: 'User',
        name: req.user.name,
      },
      to: {
        model: 'System',
        name: 'Bank Account',
      },
      description: description || `Withdrawal to bank account`,
    });

    res.status(200).json({
      message: 'Withdrawal successful',
      newBalance: wallet.balance,
      transaction: {
        id: transaction.transactionId,
        amount: transaction.amount,
        status: transaction.status,
        date: transaction.createdAt,
      },
    });
  } catch (error) {
    console.error(`Error in withdrawFunds: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getWalletBalance,
  addFunds,
  transferToPartner,
  getTransactions,
  withdrawFunds,
};