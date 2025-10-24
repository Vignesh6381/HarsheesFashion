const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Saree = require('../models/Saree'); 
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * 🧡 Add or Remove from Wishlist
 */
router.post('/wishlist/:sareeId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const saree = await Saree.findById(req.params.sareeId);

    if (!saree) {
      return res.status(404).json({ success: false, message: 'Saree not found' });
    }

    // Initialize wishlist if undefined
    if (!user.wishlist) user.wishlist = [];

    const index = user.wishlist.findIndex(
      id => id.toString() === req.params.sareeId
    );

    if (index !== -1) {
      // Remove from wishlist
      user.wishlist.splice(index, 1);
      await user.save();
      return res.json({ success: true, message: 'Saree removed from wishlist' });
    }

    // Add to wishlist
    user.wishlist.push(req.params.sareeId);
    await user.save();

    res.json({ success: true, message: 'Saree added to wishlist' });
  } catch (error) {
    console.error('Wishlist error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

/**
 * 🧾 Get Wishlist
 */
router.get('/wishlist', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('wishlist', 'name price images category');

    res.json({
      success: true,
      data: user?.wishlist || []
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

/**
 * 🛒 Add to Cart
 */
router.post(
  '/cart',
  auth,
  [
    body('sareeId').isMongoId().withMessage('Invalid saree ID'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { sareeId, quantity } = req.body;
      const saree = await Saree.findById(sareeId);
      if (!saree) {
        return res.status(404).json({ success: false, message: 'Saree not found' });
      }

      const user = await User.findById(req.user.userId);
      if (!user.cart) user.cart = [];

      const existingCartItem = user.cart.find(
        item => item.saree.toString() === sareeId
      );

      if (existingCartItem) {
        existingCartItem.quantity += quantity;
      } else {
        user.cart.push({ saree: sareeId, quantity });
      }

      await user.save();
      res.json({ success: true, message: 'Saree added to cart' });
    } catch (error) {
      console.error('Add to cart error:', error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
);

/**
 * 🛍️ Get Cart
 */
router.get('/cart', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('cart.saree', 'name price images stock category');

    res.json({
      success: true,
      data: user?.cart || []
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

/**
 * ✏️ Update Cart Item
 */
router.patch('/cart/:itemId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user.userId);

    const cartItem = user.cart.id(req.params.itemId);
    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    if (quantity <= 0) {
      cartItem.remove();
    } else {
      cartItem.quantity = quantity;
    }

    await user.save();
    res.json({ success: true, message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

/**
 * ❌ Remove from Cart
 */
router.delete('/cart/:itemId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const cartItem = user.cart.id(req.params.itemId);

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    cartItem.remove();
    await user.save();

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
