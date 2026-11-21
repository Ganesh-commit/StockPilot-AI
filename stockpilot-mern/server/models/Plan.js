const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    budget: { type: Number, required: true },
    lambda: { type: Number, default: 0.4 },
    kpis: { type: Object, required: true },
    rows: { type: Array, default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Plan', planSchema);
