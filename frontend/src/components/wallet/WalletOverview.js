// WalletOverview.js
import React, { useEffect, useState } from 'react';
import { getWalletBalance, getRecentTransactions } from '../../services/walletService';
import Loader from '../common/Loader';
import Alert from '../common/Alert';
import { formatCurrency, formatDate } from '../../utils/formatters';

const WalletOverview = () => {
  const [walletData, setWalletData] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        const balance = await getWalletBalance();
        const transactions = await getRecentTransactions(5); // Get 5 most recent transactions
        setWalletData(balance);
        setRecentTransactions(transactions);
      } catch (err) {
        setError('Failed to load wallet data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="wallet-overview">
      <div className="card balance-card">
        <h2>Wallet Balance</h2>
        <div className="balance-amount">{formatCurrency(walletData?.balance || 0)}</div>
        <div className="balance-actions">
          <a href="/wallet/add-funds" className="btn btn-primary">Add Funds</a>
          <a href="/wallet/transfer" className="btn btn-secondary">Transfer</a>
        </div>
      </div>
      
      <div className="card recent-transactions">
        <h3>Recent Transactions</h3>
        {recentTransactions.length === 0 ? (
          <p>No recent transactions found.</p>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{formatDate(transaction.timestamp)}</td>
                  <td>{transaction.description}</td>
                  <td className={transaction.type === 'credit' ? 'amount-positive' : 'amount-negative'}>
                    {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </td>
                  <td>
                    <span className={`status status-${transaction.status.toLowerCase()}`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="view-all">
          <a href="/wallet/transactions">View All Transactions</a>
        </div>
      </div>
    </div>
  );
};

export default WalletOverview;

