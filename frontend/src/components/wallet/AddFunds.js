// src/components/wallet/AddFunds.js
import React, { useState } from 'react';
// import { addFunds } from '../../services/walletService';
import walletService from '../../services/walletService';

import { useNavigate } from 'react-router-dom';
import { validateAmount } from '../../utils/validators';
import Alert from '../common/Alert';

const AddFunds = () => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAmount(amount)) {
      setError('Enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      await walletService.addFunds({
        amount: parseFloat(amount),
        paymentMethod
      });
      navigate('/wallet');
    } catch (err) {
      setError('Failed to add funds');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-funds">
      <h2>Add Funds</h2>
      {error && <Alert type="error" message={error} />}
      <form onSubmit={handleSubmit}>
        <label>Amount</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <label>Payment Method</label>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="credit_card">Credit Card</option>
          <option value="paypal">PayPal</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Add Funds'}
        </button>
      </form>
    </div>
  );
};

export default AddFunds;
