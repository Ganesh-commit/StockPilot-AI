const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    destination: { type: String, required: true },
    category: { type: String, required: true },
    units: { type: Number, required: true },
    cost: { type: Number, required: true },
    price: { type: Number, required: true },
    totalCommitted: { type: Number, required: true },
    expectedRevenue: { type: Number, required: true },
    expectedProfit: { type: Number, required: true },
    status: { type: String, default: 'ACTIVE' },
    committedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);
