const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    type: { type: String, default: 'INFO' }, // ALERT, SUCCESS, INFO
    title: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: String, default: 'Just now' },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
