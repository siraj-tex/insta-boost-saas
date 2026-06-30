const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Service = require('../models/Service');
require('dotenv').config();

// Simple admin auth middleware
const adminAuth = (req, res, next) => {
  const { username, password } = req.headers;
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    res.json({ success: true, message: 'Login successful', token: Buffer.from(`${username}:${password}`).toString('base64') });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// GET /api/admin/stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const processingOrders = await Order.countDocuments({ orderStatus: 'processing' });
    const completedOrders = await Order.countDocuments({ orderStatus: 'completed' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'cancelled' });

    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });

    // Revenue by service type
    const revenueByType = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: '$serviceSnapshot.type', total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalOrders, pendingOrders, processingOrders,
        completedOrders, cancelledOrders,
        totalRevenue, todayOrders, revenueByType
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/admin/orders
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.orderStatus = status;
    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { instagramHandle: { $regex: search, $options: 'i' } },
        { orderId: { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({ success: true, data: orders, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/admin/orders/:id — Update order status
router.patch('/orders/:id', adminAuth, async (req, res) => {
  try {
    const { orderStatus, adminNotes } = req.body;
    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/admin/services — Manage services
router.get('/services', adminAuth, async (req, res) => {
  try {
    const services = await Service.find().sort({ type: 1, price: 1 });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/admin/services/:id — Update service
router.patch('/services/:id', adminAuth, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
