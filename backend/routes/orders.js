const router = require('express').Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });
      total += product.price * item.quantity;
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      user: req.user.id, items: orderItems, total, shippingAddress
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/my', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
  res.json(orders);
});

router.get('/', protect, adminOnly, async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
  res.json(orders);
});

router.put('/:id/status', protect, adminOnly, async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id, { status: req.body.status }, { new: true }
  );
  res.json(order);
});

module.exports = router;