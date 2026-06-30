const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['followers', 'views', 'likes'],
    required: true
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  description: { type: String },
  features: [{ type: String }],
  popular: { type: Boolean, default: false },
  deliveryTime: { type: String, default: '24-48 hours' },
  icon: { type: String },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
