const express = require('express');
const Category = require('../models/Category');

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all saree categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 */
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get single category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *       404:
 *         description: Category not found
 */
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
