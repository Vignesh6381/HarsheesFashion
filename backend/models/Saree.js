const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  images: [
    {
      data: Buffer,
      contentType: String,
    },
  ],
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isNewProduct: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
