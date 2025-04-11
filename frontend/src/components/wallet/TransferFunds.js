// TransferFunds.js
import React, { useState, useEffect } from 'react';
import { transferFunds, getWalletBalance } from '../../services/walletService';
import partnerService from '../../services/partnerService';
import { useNavigate } from 'react-router-dom';
import { validateAmount } from '../../utils/validators';
import Alert from '../common/Alert';
import Loader from '../common/Loader';

const TransferFunds = () => {
  const [amount, setAmount] = useState('');
  const [partnerId, setPartnerId] = useState('');
  const [description, setDescription] = useState('');
  const [partners, setPartners] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch wallet balance
        const balanceData = await getWalletBalance();
        setBalance(balanceData.balance);
        
        // Fetch partners separately to handle the response properly
        const partnersResponse = await partnerService.getAllPartners();
        
        // Check the structure of the response and extract partners array
        // This handles different possible response structures
        let partnersArray = [];
        if (Array.isArray(partnersResponse)) {
          partnersArray = partnersResponse;
        } else if (partnersResponse && Array.isArray(partnersResponse.partners)) {
          partnersArray = partnersResponse.partners;
        } else if (partnersResponse && typeof partnersResponse === 'object') {
          // If it's just a single partner object
          partnersArray = [partnersResponse];
        }
        
        setPartners(partnersArray);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Rest of your component remains the same...
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!validateAmount(amount)) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > balance) {
      setError('Insufficient funds in wallet');
      return;
    }

    if (!partnerId) {
      setError('Please select a partner');
      return;
    }

    try {
      setSubmitting(true);
      await transferFunds({
        amount: parseFloat(amount),
        partnerId,
        description: description || 'Fund transfer'
      });
      
      // Redirect to wallet overview on success
      navigate('/wallet');
    } catch (err) {
      setError('Failed to transfer funds. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="transfer-funds-container">
      <h2>Transfer Funds to Partner</h2>
      
      <div className="wallet-balance-info">
        <span>Available Balance:</span>
        <strong>${balance.toFixed(2)}</strong>
      </div>
      
      {error && <Alert type="error" message={error} />}
      
      <form onSubmit={handleSubmit} className="transfer-funds-form">
        <div className="form-group">
          <label htmlFor="partner">Select Partner</label>
          <select
            id="partner"
            value={partnerId}
            onChange={(e) => setPartnerId(e.target.value)}
            required
          >
            <option value="">-- Select Partner --</option>
            {partners && partners.length > 0 ? (
              partners.map(partner => (
                <option key={partner._id} value={partner._id}>
                  {partner.name} ({partner.email})
                </option>
              ))
            ) : (
              <option value="" disabled>No partners available</option>
            )}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="amount">Amount ($)</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            step="0.01"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Reason for transfer"
          />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Processing...' : 'Transfer Funds'}
        </button>
      </form>
    </div>
  );
};

export default TransferFunds;