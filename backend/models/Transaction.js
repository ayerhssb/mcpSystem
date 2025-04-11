const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['deposit', 'withdrawal', 'transfer', 'payment', 'refund'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    from: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'from.model',
      },
      model: {
        type: String,
        enum: ['User', 'PickupPartner', 'System'],
      },
      name: String,
    },
    to: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'to.model',
      },
      model: {
        type: String,
        enum: ['User', 'PickupPartner', 'System'],
      },
      name: String,
    },
    description: String,
    relatedOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  },
  {
    timestamps: true,
  }
);

// Generate a unique transaction ID before saving
transactionSchema.pre('save', async function (next) {
  if (!this.transactionId) {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.transactionId = `TXN-${year}${month}${day}-${random}`;
  }
  next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;