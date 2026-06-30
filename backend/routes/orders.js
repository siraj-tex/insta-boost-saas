const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Service = require('../models/Service');

// POST create order (after payment verification)
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, instagramHandle, postUrl, serviceId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    const order = new Order({
      customerName,
      customerEmail,
      instagramHandle,
      postUrl,
      service: serviceId,
      serviceSnapshot: {
        name: service.name,
        type: service.type,
        quantity: service.quantity,
        price: service.price
      },
      amount: service.price,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentStatus: 'paid',
      orderStatus: 'pending'
    });

    await order.save();
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single order by orderId
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId }).populate('service');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
