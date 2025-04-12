// src/components/wallet/WalletOverview.js
import React, { useEffect, useState } from 'react';
import walletService from '../../services/walletService';
import { formatCurrency } from '../../utils/formatters';

const WalletOverview = () => {
  const [wallet, setWallet] = useState({});
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const data = await walletService.getWalletBalance();
        setWallet(data);
      } catch (err) {
        console.error('Failed to fetch wallet:', err.message);
      }
    };

    const fetchRecent = async () => {
      try {
        const tx = await walletService.getRecentTransactions(5);
        setRecentTransactions(Array.isArray(tx) ? tx : []);
      } catch (err) {
        console.error('Failed to fetch transactions:', err.message);
      }
    };

    fetchWallet();
    fetchRecent();
  }, []);

  return (
    <div className="wallet-overview">
      <h2>Wallet Overview</h2>
      <div className="wallet-stats">
        <p><strong>Balance:</strong> {formatCurrency(wallet.balance)}</p>
        <p><strong>Total Added:</strong> {formatCurrency(wallet.totalAdded)}</p>
        <p><strong>Total Withdrawn:</strong> {formatCurrency(wallet.totalWithdrawn)}</p>
      </div>

      <h3>Recent Transactions</h3>
      {recentTransactions.length === 0 ? (
        <p>No recent transactions.</p>
      ) : (
        <ul>
          {recentTransactions.map((tx) => (
            <li key={tx.id || tx._id}>
              {tx.type.toUpperCase()} | {formatCurrency(tx.amount)} | {new Date(tx.date || tx.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WalletOverview;
