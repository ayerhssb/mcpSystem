// AddFunds.js
import React, { useState } from 'react';
import { addFunds } from '../../services/walletService';
import { useNavigate } from 'react-router-dom';
import { validateAmount } from '../../utils/validators';
import Alert from '../common/Loader';

const AddFunds = () => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!validateAmount(amount)) {
      setError('Please enter a valid amount (minimum $10)');
      return;
    }

    try {
      setLoading(true);
      await addFunds({
        amount: parseFloat(amount),
        paymentMethod
      });
      
      // Redirect to wallet overview on success
      navigate('/wallet');
    } catch (err) {
      setError('Failed to process payment. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-funds-container">
      <h2>Add Funds to Wallet</h2>
      
      {error && <Alert type="error" message={error} />}
      
      <form onSubmit={handleSubmit} className="add-funds-form">
        <div className="form-group">
          <label htmlFor="amount">Amount ($)</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="10"
            step="0.01"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="paymentMethod">Payment Method</label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          >
            <option value="credit_card">Credit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>
        
        {paymentMethod === 'credit_card' && (
          <div className="payment-details">
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" required />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiry">Expiry Date</label>
                <input type="text" id="expiry" placeholder="MM/YY" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input type="text" id="cvv" placeholder="123" required />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="cardName">Name on Card</label>
              <input type="text" id="cardName" required />
            </div>
          </div>
        )}
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Processing...' : 'Add Funds'}
        </button>
      </form>
    </div>
  );
};

export default AddFunds;

