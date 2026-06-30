const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    default: () => 'ORD' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase()
  },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  instagramHandle: { type: String, required: true },
  postUrl: { type: String },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  serviceSnapshot: {
    name: String,
    type: { type: String },
    quantity: Number,
    price: Number
  },
  amount: { type: Number, required: true },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  adminNotes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
