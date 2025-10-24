# Harshees Fashion Backend API

A complete e-commerce backend API built with Node.js, Express, and MongoDB for the Harshees Fashion platform.

## 🚀 Features

- **User Authentication** - JWT-based auth with bcrypt password hashing
- **Product Management** - CRUD operations with advanced filtering and search
- **Order Management** - Complete order lifecycle from creation to delivery
- **Category System** - Hierarchical product categories
- **Shopping Cart** - Persistent cart functionality
- **Wishlist** - Save favorite products
- **Reviews & Ratings** - Customer feedback system
- **Admin Panel** - Admin-only routes for management
- **File Uploads** - Image handling with Cloudinary integration
- **Email Notifications** - Order confirmations and updates
- **API Documentation** - Swagger/OpenAPI documentation
- **Security** - Helmet, CORS, rate limiting, input validation
- **Performance** - Compression, database indexing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/harshees-fashion-backend.git
cd harshees-fashion-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/harshees-fashion
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod

# If using MongoDB Atlas, update MONGODB_URI in .env
```

5. **Seed Database (Optional)**
```bash
npm run seed
```

6. **Start the server**
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/api/health

## 🛣️ API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured/list` - Get featured products
- `GET /api/products/new/arrivals` - Get new arrivals
- `POST /api/products/:id/reviews` - Add product review

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/my` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id/status` - Update order status (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category

### User Account
- `POST /api/users/wishlist/:productId` - Add/remove from wishlist
- `GET /api/users/wishlist` - Get user wishlist
- `POST /api/users/cart` - Add to cart
- `GET /api/users/cart` - Get user cart
- `PATCH /api/users/cart/:itemId` - Update cart item
- `DELETE /api/users/cart/:itemId` - Remove from cart

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer your-jwt-token
```

## 📊 Database Models

### User
- Personal information (name, email, phone)
- Authentication (password, role)
- Shopping cart and wishlist
- Multiple addresses

### Product
- Basic info (name, description, price)
- Images and categories
- Inventory management (sizes, stock)
- Reviews and ratings
- SEO metadata

### Order
- Order items and pricing
- Shipping address
- Payment information
- Status tracking
- Order history

### Category
- Hierarchical structure
- SEO-friendly slugs
- Image and metadata

## 🚀 Deployment

### Using PM2 (Recommended)
```bash
npm install -g pm2
pm2 start server.js --name "harshees-api"
pm2 startup
pm2 save
```

### Using Docker
```bash
# Build image
docker build -t harshees-fashion-api .

# Run container
docker run -p 5000:5000 --env-file .env harshees-fashion-api
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/harshees-fashion
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-frontend-domain.com
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📈 Performance Optimization

- **Database Indexing**: Optimized queries with proper indexes
- **Compression**: Gzip compression for responses
- **Rate Limiting**: Prevents API abuse
- **Caching**: Redis integration for frequently accessed data
- **Image Optimization**: Cloudinary for image processing

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Express-validator for request validation
- **Password Hashing**: Bcrypt with salt rounds
- **JWT Security**: Secure token generation and validation

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@harsheefashion.com or create an issue in the repository.

## 🔄 API Versioning

Current version: `v1`
All endpoints are prefixed with `/api/`

## 📱 Frontend Integration

This backend is designed to work with the Harshees Fashion React frontend. Update the frontend API base URL to:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## 🎯 Roadmap

- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Real-time notifications with Socket.io
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Mobile app API endpoints
- [ ] Microservices architecture migration// ================================