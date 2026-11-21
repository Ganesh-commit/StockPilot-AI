const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, default: 'Hotel Rooms' },
    destination: { type: String, required: true },
    category: { type: String, default: 'Hotel Rooms' },
    cost: { type: Number, required: true },
    price: { type: Number, required: true },
    cancel: { type: Number, default: 0.12 },
    cap: { type: Number, default: 10000 },
    availableQty: { type: Number, default: 7500 },
    purchasedQty: { type: Number, default: 2500 },
    travelDate: { type: String, default: 'Q4 2026 - W12' },
    supplier: { type: String, default: 'Global Wholesale Network' },
    description: { type: String, default: '' },
    obs: { type: [Number], default: [] },
    soldOut: { type: [Boolean], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);
