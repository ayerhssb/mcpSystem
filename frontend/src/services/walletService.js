// src/services/walletService.js
// Mock wallet service

// Get wallet balance
export const getWalletBalance = async () => {
    // Return mock data
    return Promise.resolve({ balance: 25000.00 });
  };
  
  // Get all transactions
  export const getTransactions = async () => {
    // Return mock data
    const mockTransactions = [
      { id: 1, amount: 500, type: 'CREDIT', description: 'Added funds', date: new Date() },
      { id: 2, amount: 150, type: 'DEBIT', description: 'Transfer to Partner A', date: new Date(Date.now() - 86400000) },
      { id: 3, amount: 1000, type: 'CREDIT', description: 'Added funds', date: new Date(Date.now() - 172800000) },
      { id: 4, amount: 350, type: 'DEBIT', description: 'Transfer to Partner B', date: new Date(Date.now() - 259200000) }
    ];
    return Promise.resolve({ transactions: mockTransactions });
  };
  
  // Get recent transactions
  export const getRecentTransactions = async (limit = 5) => {
    const mockTransactions = [
      { id: 1, amount: 500, type: 'CREDIT', description: 'Added funds', date: new Date() },
      { id: 2, amount: 150, type: 'DEBIT', description: 'Transfer to Partner A', date: new Date(Date.now() - 86400000) }
    ];
    return Promise.resolve({ transactions: mockTransactions.slice(0, limit) });
  };
  
  // Add funds to wallet
  export const addFunds = async (amount) => {
    return Promise.resolve({ success: true, message: 'Funds added successfully', amount });
  };
  
  // Transfer funds to partner
  export const transferFunds = async (partnerId, amount) => {
    return Promise.resolve({ 
      success: true, 
      message: 'Funds transferred successfully', 
      transaction: {
        id: Math.floor(Math.random() * 1000),
        amount,
        type: 'DEBIT',
        description: `Transfer to partner ID: ${partnerId}`,
        date: new Date()
      }
    });
  };
  
  export default {
    getWalletBalance,
    getTransactions,
    getRecentTransactions,
    addFunds,
    transferFunds
  };