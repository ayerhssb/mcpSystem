
// src/components/partners/AddPartner.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import partnerService from '../../services/partnerService';
import Alert from '../common/Alert';

const AddPartner = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '',
    paymentType: 'fixed',
    paymentAmount: '', initialBalance: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const partnerData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        paymentType: formData.paymentType,
        paymentAmount: parseFloat(formData.paymentAmount),
        initialBalance: parseFloat(formData.initialBalance || 0) // ✅ include if provided
      };

      await partnerService.createPartner(partnerData);
      navigate('/partners');
    } catch (err) {
      
      setError(err.response?.data?.message || 'Failed to create partner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Pickup Partner</h2>
      {error && <Alert type="error" message={error} />}
      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'email', 'phone', 'address', 'paymentAmount', 'initialBalance'].map((field) => (
          <div key={field}>
            <label className="block mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
            <input
              type={field.toLowerCase().includes('amount') || field === 'initialBalance' ? 'number' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required={field !== 'initialBalance'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        ))}
        <div>
          <label className="block mb-1">Payment Type</label>
          <select
            name="paymentType"
            value={formData.paymentType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="fixed">Fixed</option>
            <option value="commission">Commission</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Add Partner'}
        </button>
      </form>
    </div>
  );
};

export default AddPartner;


