const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Saree');
const User = require('../models/User');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderItems
 *               - shippingAddress
 *               - paymentMethod
 *             properties:
 *               orderItems:
 *                 type: array
 *               shippingAddress:
 *                 type: object
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', auth, [
  body('orderItems').isArray({ min: 1 }).withMessage('Order items are required'),
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('paymentMethod').isIn(['card', 'upi', 'cod', 'wallet']).withMessage('Invalid payment method')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      couponCode
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided'
      });
    }

    // Validate and calculate prices
    let itemsPrice = 0;
    const validatedItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }

      // Check stock
      const sizeStock = product.sizes.find(s => s.size === item.size);
      if (!sizeStock || sizeStock.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name} in size ${item.size}`
        });
      }

      const orderItem = {
        product: product._id,
        name: product.name,
        image: product.images[0].url,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color
      };

      validatedItems.push(orderItem);
      itemsPrice += product.price * item.quantity;
    }

    // Calculate shipping
    const shippingPrice = itemsPrice >= 2000 ? 0 : 99;

    // Calculate tax (18% GST)
    const taxPrice = Math.round(itemsPrice * 0.18);

    // Calculate discount
    let discountAmount = 0;
    if (itemsPrice >= 3000) {
      discountAmount = Math.round(itemsPrice * 0.1); // 10% discount
    }

    const totalPrice = itemsPrice + shippingPrice + taxPrice - discountAmount;

    // Create order
    const order = new Order({
      user: req.user.userId,
      orderItems: validatedItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      discountAmount,
      totalPrice,
      couponCode,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending'
    });

    const createdOrder = await order.save();

    // Update product stock
    for (const item of orderItems) {
      await Product.findOneAndUpdate(
        { 
          _id: item.product,
          'sizes.size': item.size
        },
        {
          $inc: {
            'sizes.$.stock': -item.quantity,
            stock: -item.quantity
          }
        }
      );
    }

    // Clear user's cart
    await User.findByIdAndUpdate(req.user.userId, {
      $set: { cart: [] }
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: createdOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/orders/my:
 *   get:
 *     summary: Get current user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 */
router.get('/my', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, totalOrders] = await Promise.all([
      Order.find({ user: req.user.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Order.countDocuments({ user: req.user.userId })
    ]);

    const totalPages = Math.ceil(totalOrders / parseInt(limit));

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalOrders
        }
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get single order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       404:
 *         description: Order not found
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update order status (admin only)
router.patch('/:id/status', [auth, adminAuth], async (req, res) => {
  try {
    const { status, trackingNumber, courierService } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Add status to history
    order.statusHistory.push({
      status,
      note: `Order ${status} by admin`
    });

    order.orderStatus = status;
    
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (courierService) order.courierService = courierService;
    
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;