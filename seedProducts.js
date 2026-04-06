const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const Product = require('../models/Product');

const categories = ['Electronics', 'Fashion', 'Home Essentials', 'Gadgets', 'Beauty', 'Sports', 'Books'];

const productTemplates = {
  Electronics: [
    { name: 'Wireless Bluetooth Earbuds', price: 999, orig: 1999, img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400' },
    { name: 'Smart LED Desk Lamp', price: 799, orig: 1499, img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400' },
    { name: 'USB-C Fast Charger 65W', price: 599, orig: 999, img: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400' },
    { name: 'Mechanical Keyboard RGB', price: 2499, orig: 3999, img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400' },
    { name: 'Portable Power Bank 20000mAh', price: 1299, orig: 2499, img: 'https://images.unsplash.com/photo-1609592806596-b8d4a5b4a8e1?w=400' },
    { name: 'Noise Cancelling Headphones', price: 3499, orig: 5999, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
    { name: 'Smart Watch Fitness Band', price: 1999, orig: 3499, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
    { name: 'Webcam 1080p HD', price: 1499, orig: 2499, img: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400' },
    { name: 'Wireless Mouse Ergonomic', price: 699, orig: 1299, img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400' },
    { name: 'Mini Bluetooth Speaker', price: 899, orig: 1799, img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400' },
  ],
  Fashion: [
    { name: 'Oversized Cotton T-Shirt', price: 399, orig: 799, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
    { name: 'Slim Fit Denim Jeans', price: 1299, orig: 2499, img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400' },
    { name: 'Casual Sneakers White', price: 1499, orig: 2999, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
    { name: 'Floral Summer Dress', price: 899, orig: 1799, img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400' },
    { name: 'Leather Wallet Slim', price: 499, orig: 999, img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400' },
    { name: 'Hooded Sweatshirt Unisex', price: 799, orig: 1499, img: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400' },
    { name: 'Formal Shirt Men', price: 699, orig: 1299, img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400' },
    { name: 'Sports Leggings Women', price: 599, orig: 1199, img: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400' },
    { name: 'Canvas Backpack 30L', price: 999, orig: 1999, img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
    { name: 'Aviator Sunglasses', price: 399, orig: 799, img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400' },
  ],
  'Home Essentials': [
    { name: 'Stainless Steel Water Bottle', price: 399, orig: 799, img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400' },
    { name: 'Non-Stick Frying Pan', price: 699, orig: 1299, img: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400' },
    { name: 'Bamboo Cutting Board', price: 299, orig: 599, img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' },
    { name: 'LED Fairy String Lights', price: 199, orig: 399, img: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400' },
    { name: 'Ceramic Coffee Mug Set', price: 499, orig: 999, img: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400' },
    { name: 'Microfiber Bed Sheet Set', price: 799, orig: 1599, img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400' },
    { name: 'Aroma Diffuser Humidifier', price: 999, orig: 1999, img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400' },
    { name: 'Wall Clock Modern Design', price: 599, orig: 1199, img: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400' },
    { name: 'Vacuum Storage Bags 6-Pack', price: 349, orig: 699, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
    { name: 'Portable Air Purifier', price: 2499, orig: 4499, img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400' },
  ],
  Gadgets: [
    { name: 'Smart Plug WiFi Enabled', price: 499, orig: 999, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
    { name: 'Mini Drone with Camera', price: 3999, orig: 6999, img: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400' },
    { name: 'Digital Kitchen Scale', price: 399, orig: 799, img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' },
    { name: 'Laser Pointer Presenter', price: 299, orig: 599, img: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400' },
    { name: 'Portable LED Projector', price: 4999, orig: 8999, img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400' },
    { name: 'Smart Door Lock', price: 3499, orig: 5999, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
    { name: 'Wireless Charging Pad', price: 699, orig: 1299, img: 'https://images.unsplash.com/photo-1609592806596-b8d4a5b4a8e1?w=400' },
    { name: 'Action Camera 4K', price: 4499, orig: 7999, img: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400' },
    { name: 'Smart LED Bulb RGB', price: 299, orig: 599, img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400' },
    { name: 'Fingerprint USB Drive 64GB', price: 1299, orig: 2499, img: 'https://images.unsplash.com/photo-1609592806596-b8d4a5b4a8e1?w=400' },
  ],
  Beauty: [
    { name: 'Vitamin C Face Serum', price: 399, orig: 799, img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400' },
    { name: 'Charcoal Face Wash', price: 199, orig: 399, img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400' },
    { name: 'Hair Growth Oil 100ml', price: 299, orig: 599, img: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400' },
    { name: 'Matte Lipstick Set 6 Shades', price: 499, orig: 999, img: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2f9d?w=400' },
    { name: 'Sunscreen SPF 50+ 100ml', price: 249, orig: 499, img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400' },
    { name: 'Electric Face Massager', price: 799, orig: 1599, img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400' },
    { name: 'Perfume Floral 50ml', price: 699, orig: 1399, img: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400' },
    { name: 'Nail Art Kit Complete', price: 349, orig: 699, img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400' },
    { name: 'Aloe Vera Gel 200ml', price: 149, orig: 299, img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400' },
    { name: 'Hair Straightener Ceramic', price: 1299, orig: 2499, img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400' },
  ],
  Sports: [
    { name: 'Yoga Mat Anti-Slip 6mm', price: 599, orig: 1199, img: 'https://images.unsplash.com/photo-1601925228008-f5e4c5e5e5e5?w=400' },
    { name: 'Resistance Bands Set 5pc', price: 399, orig: 799, img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
    { name: 'Adjustable Dumbbell 10kg', price: 1499, orig: 2999, img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400' },
    { name: 'Running Shoes Lightweight', price: 1999, orig: 3999, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
    { name: 'Cycling Helmet Safety', price: 899, orig: 1799, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
    { name: 'Jump Rope Speed Cable', price: 299, orig: 599, img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
    { name: 'Sports Water Bottle 1L', price: 349, orig: 699, img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400' },
    { name: 'Foam Roller Massage', price: 499, orig: 999, img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
    { name: 'Badminton Racket Set', price: 799, orig: 1599, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
    { name: 'Gym Gloves Padded', price: 299, orig: 599, img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400' },
  ],
  Books: [
    { name: 'Atomic Habits - James Clear', price: 299, orig: 499, img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
    { name: 'The Psychology of Money', price: 249, orig: 399, img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
    { name: 'Rich Dad Poor Dad', price: 199, orig: 349, img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
    { name: 'Deep Work - Cal Newport', price: 279, orig: 449, img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
    { name: 'The Alchemist - Paulo Coelho', price: 149, orig: 299, img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
    { name: 'Zero to One - Peter Thiel', price: 299, orig: 499, img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
    { name: 'Think and Grow Rich', price: 179, orig: 299, img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
    { name: 'The 4-Hour Workweek', price: 249, orig: 399, img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
    { name: 'Sapiens - Yuval Noah Harari', price: 349, orig: 599, img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
    { name: 'The Lean Startup', price: 279, orig: 449, img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
  ],
};

const descriptions = {
  Electronics: 'High-quality electronic product with premium build and latest technology. Perfect for everyday use.',
  Fashion: 'Trendy and comfortable fashion item crafted with premium materials for a stylish look.',
  'Home Essentials': 'Essential home product designed for durability and everyday convenience.',
  Gadgets: 'Innovative gadget with smart features to make your life easier and more productive.',
  Beauty: 'Premium beauty product formulated with natural ingredients for best results.',
  Sports: 'Professional-grade sports equipment for fitness enthusiasts and athletes.',
  Books: 'Bestselling book that will transform your mindset and help you achieve your goals.',
};

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/treandspot');
  await Product.deleteMany({});

  const products = [];
  let count = 0;

  for (const [category, items] of Object.entries(productTemplates)) {
    items.forEach((item, i) => {
      const discount = Math.round(((item.orig - item.price) / item.orig) * 100);
      products.push({
        name: item.name,
        description: descriptions[category],
        price: item.price,
        originalPrice: item.orig,
        discount,
        category,
        images: [item.img, item.img],
        stock: Math.floor(Math.random() * 200) + 50,
        ratings: (3.5 + Math.random() * 1.5).toFixed(1),
        numReviews: Math.floor(Math.random() * 500) + 10,
        isFeatured: i < 3,
        isTrending: i % 2 === 0,
        tags: [category.toLowerCase(), 'trending', 'affordable'],
      });
      count++;
    });
  }

  // Add more products to reach 200+
  for (let extra = 0; extra < 130; extra++) {
    const cat = categories[extra % categories.length];
    const baseItems = productTemplates[cat];
    const base = baseItems[extra % baseItems.length];
    const priceVariant = base.price + Math.floor(Math.random() * 500);
    const origVariant = base.orig + Math.floor(Math.random() * 800);
    const discount = Math.round(((origVariant - priceVariant) / origVariant) * 100);
    products.push({
      name: `${base.name} - Premium Edition ${extra + 1}`,
      description: descriptions[cat],
      price: Math.min(priceVariant, 4999),
      originalPrice: Math.min(origVariant, 7999),
      discount,
      category: cat,
      images: [base.img, base.img],
      stock: Math.floor(Math.random() * 150) + 20,
      ratings: (3 + Math.random() * 2).toFixed(1),
      numReviews: Math.floor(Math.random() * 300) + 5,
      isFeatured: extra % 10 === 0,
      isTrending: extra % 3 === 0,
      tags: [cat.toLowerCase(), 'new arrival'],
    });
    count++;
  }

  await Product.insertMany(products);
  console.log(`✅ Seeded ${count} products successfully!`);
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
