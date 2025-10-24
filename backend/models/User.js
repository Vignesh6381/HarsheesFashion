const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[6-9]\d{9}$/, 'Please enter a valid phone number']
  },
  avatar: {
    public_id: String,
    url: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },

  // ✅ Addresses (Optional)
  addresses: [{
    name: String,
    phone: String,
    street: String,
    apartment: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: 'India'
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  }],

  // ✅ Wishlist Support
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product' // or 'Saree' depending on your naming
  }],

  // ✅ Cart Support
  cart: [{
    saree: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // or 'Saree'
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // ✅ Reset Tokens
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerificationExpire: Date

}, {
  timestamps: true
});


// 🔐 Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


// 🔑 Compare Password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


// 🎟️ Generate JWT Token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { userId: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET || 'harshees-fashion-secret',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

module.exports = mongoose.model('User', userSchema);
