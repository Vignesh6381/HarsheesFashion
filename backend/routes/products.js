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

module.exports = router;
