const express = require('express');
const multer = require('multer');
const fs = require('fs');
const Product = require('../models/Saree');
const router = express.Router();

// Store uploaded files temporarily
const upload = multer({ dest: 'uploads/' });

// POST: Add new product with image
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    // Read uploaded image
    const imageData = fs.readFileSync(req.file.path);

    // Create new product
    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      images: [
        {
          data: imageData,
          contentType: req.file.mimetype,
        },
      ],
      isFeatured: true,
      isNewProduct: true,
    });

    // Save to MongoDB
    await product.save();

    // Remove temp file
    fs.unlinkSync(req.file.path);

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Error uploading product:', error);
    res.status(500).json({ success: false, message: 'Failed to upload product', error: error.message });
  }
});

// ✅ GET: Fetch all products with pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, sort = 'newest' } = req.query;

    const products = await Product.find()
      .sort(sort === 'newest' ? { createdAt: -1 } : {})
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching products', error: error.message });
  }
});

// ✅ GET: Fetch featured products
router.get('/featured/list', async (req, res) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).limit(8);
    res.json({ success: true, featuredProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching featured products', error: error.message });
  }
});

module.exports = router;
