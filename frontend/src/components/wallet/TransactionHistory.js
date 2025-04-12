// src/components/wallet/TransactionHistory.js
import React, { useState, useEffect } from 'react';
import walletService from '../../services/walletService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Loader from '../common/Loader';
import Alert from '../common/Alert';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    dateFrom: '',
    dateTo: '',
    status: 'all'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  useEffect(() => {
    fetchTransactions();
  }, [pagination.page, filters]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const { transactions, total } = await walletService.getTransactions({
        page: pagination.page,
        limit: pagination.limit,
        type: filters.type,
        startDate: filters.dateFrom,
        endDate: filters.dateTo,
      });

      setTransactions(transactions || []);
      setPagination(prev => ({ ...prev, total }));
    } catch (err) {
      setError('Failed to load transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="transaction-history-container">
      <h2>Transaction History</h2>

      {error && <Alert type="error" message={error} />}

      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposits</option>
            <option value="transfer">Transfers</option>
            <option value="withdrawal">Withdrawals</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="dateFrom">From Date</label>
          <input
            type="date"
            id="dateFrom"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="dateTo">To Date</label>
          <input
            type="date"
            id="dateTo"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : transactions.length === 0 ? (
        <div className="no-results">
          <p>No transactions found.</p>
        </div>
      ) : (
        <>
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Txn ID</th>
                <th>Description</th>
                <th>Amount</th>
                <th>From</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id}>
                  <td>{formatDate(tx.createdAt)}</td>
                  <td>{tx.transactionId || tx._id}</td>
                  <td>{tx.description}</td>
                  <td className={tx.type === 'deposit' ? 'amount-positive' : 'amount-negative'}>
                    {tx.type === 'deposit' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </td>
                  <td>{tx.from?.name || '-'}</td>
                  <td>{tx.to?.name || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {pagination.page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionHistory;
