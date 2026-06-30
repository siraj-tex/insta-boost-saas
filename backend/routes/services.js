const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// GET all active services
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { active: true };
    if (type) filter.type = type;
    
    const services = await Service.find(filter).sort({ price: 1 });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single service
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
