const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 }, // percentage
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Fashion', 'Home Essentials', 'Gadgets', 'Beauty', 'Sports', 'Books'],
    },
    subcategory: { type: String, default: '' },
    brand: { type: String, default: '' },
    images: [{ type: String }],
    stock: { type: Number, required: true, default: 100 },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    seller: { type: String, default: 'Treandspot' },
    specifications: { type: Map, of: String },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
