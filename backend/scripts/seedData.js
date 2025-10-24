const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Category = require('../models/Category');
const Saree = require('../models/Saree'); // updated name

const seedData = async () => {
  try {
    // ✅ Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/harshees-fashion');
    console.log('✅ Connected to MongoDB');

    // ✅ Clear old data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Saree.deleteMany({})
    ]);
    console.log('🧹 Existing collections cleared');

    // ✅ Create Admin User
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@harsheesfashion.com',
      password: 'admin123',
      phone: '9876543210',
      role: 'admin',
      avatar: {
        url: 'https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=fff&size=200'
      }
    });
    await adminUser.save();

    // ✅ Create Demo User
    const demoUser = new User({
      name: 'Demo User',
      email: 'demo@harsheesfashion.com',
      password: 'password',
      phone: '9876543211',
      avatar: {
        url: 'https://ui-avatars.com/api/?name=Demo+User&background=10b981&color=fff&size=200'
      }
    });
    await demoUser.save();

    console.log('👤 Users created successfully');

    // ✅ Create Categories
    const categories = [
      {
        name: 'Cotton Sarees',
        slug: 'cotton-sarees',
        description: 'Soft and breathable cotton sarees perfect for daily wear.',
        image: {
          public_id: 'cat-cotton',
          url: 'https://images.unsplash.com/photo-1609743522656-046eb3d72b6c?w=400&h=400&fit=crop'
        },
        isActive: true,
        sortOrder: 1,
        seoTitle: 'Cotton Sarees - Harshees Fashion',
        seoDescription: 'Explore beautiful and comfortable cotton sarees for daily wear.',
        metaTags: ['cotton sarees', 'handloom', 'daily wear']
      },
      {
        name: 'Silk Sarees',
        slug: 'silk-sarees',
        description: 'Luxurious silk sarees for weddings and festive occasions.',
        image: {
          public_id: 'cat-silk',
          url: 'https://images.unsplash.com/photo-1593032457869-cb22a5e8c9d8?w=400&h=400&fit=crop'
        },
        isActive: true,
        sortOrder: 2,
        seoTitle: 'Silk Sarees - Harshees Fashion',
        seoDescription: 'Shop elegant silk sarees for weddings and festivals.',
        metaTags: ['silk sarees', 'wedding saree', 'bridal wear']
      },
      {
        name: 'Designer Sarees',
        slug: 'designer-sarees',
        description: 'Trendy and stylish sarees designed for modern fashion lovers.',
        image: {
          public_id: 'cat-designer',
          url: 'https://images.unsplash.com/photo-1609947012493-593d0f1cbb43?w=400&h=400&fit=crop'
        },
        isActive: true,
        sortOrder: 3,
        seoTitle: 'Designer Sarees - Harshees Fashion',
        seoDescription: 'Discover unique designer sarees for parties and events.',
        metaTags: ['designer sarees', 'fashion sarees', 'party wear']
      }
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log('📂 Categories created successfully');

    // ✅ Get category ObjectIds for products
    const cottonCat = createdCategories.find(c => c.slug === 'cotton-sarees');
    const silkCat = createdCategories.find(c => c.slug === 'silk-sarees');
    const designerCat = createdCategories.find(c => c.slug === 'designer-sarees');

    // ✅ Create Saree Products with category ObjectId
    const sarees = [
      {
        name: 'Cotton Handloom Saree',
        description: 'Lightweight and comfortable cotton handloom saree for daily wear.',
        price: 1499,
        stock: 40,
        category: cottonCat._id,
        images: [
          'https://images.unsplash.com/photo-1621784563330-9b8b9e621f94?w=600&h=800&fit=crop'
        ],
        isFeatured: true,
        isActive: true,
        isNewProduct: true
      },
      {
        name: 'Banarasi Silk Saree',
        description: 'Traditional Banarasi silk saree with rich zari work and elegant patterns.',
        price: 5999,
        stock: 20,
        category: silkCat._id,
        images: [
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop'
        ],
        isFeatured: true,
        isActive: true,
        isNewProduct: false
      },
      {
        name: 'Designer Party Saree',
        description: 'Trendy designer saree with sequin embellishments and modern draping style.',
        price: 2999,
        stock: 25,
        category: designerCat._id,
        images: [
          'https://images.unsplash.com/photo-1609743522656-046eb3d72b6c?w=600&h=800&fit=crop'
        ],
        isFeatured: true,
        isActive: true,
        isNewProduct: true
      }
    ];

    await Saree.insertMany(sarees);
    console.log('👗 Saree products created successfully');

    console.log('\n✅ Database seeding completed successfully!');
    console.log('------------------------------------------------');
    console.log('Admin Login: admin@harsheesfashion.com / admin123');
    console.log('Demo Login: demo@harsheesfashion.com / password');
    console.log('Categories: 3 | Sarees: 3');
    console.log('------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();