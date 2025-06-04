# Fashion E-commerce Platform Backend

A modern, feature-rich backend for a fashion e-commerce platform built with NestJS. This platform includes advanced features like virtual try-on, AI-powered fashion recommendations, and secure payment processing.

## Features

### Authentication System
- JWT-based authentication
- Google OAuth integration
- Role-based access control (ADMIN, STORE, CONSUMER)
- Secure password handling
- Session management

### User Management
- Profile management with extended user information
- Body measurements storage
- Style preferences
- Purchase history
- Virtual wardrobe

### File Upload System
- Cloudinary integration for image storage
- Image optimization and processing
- Avatar management
- Secure file handling
- Automatic cleanup of old files

### Virtual Try-On System
- 2D and 3D visualization options
- Integration with external 3D rendering services
- Real-time preview capabilities
- Batch processing support

### Payment Integration
- QR code payment support
- eSewa integration
- Secure payment processing
- Refund handling
- Transaction history

### AI Fashion Assistant
- Personalized fashion recommendations
- Style analysis using GPT-4 Vision
- Trend predictions
- Outfit suggestions
- Styling tips

## Technology Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, Passport
- **File Storage**: Cloudinary
- **AI/ML**: OpenAI GPT-4
- **Payment**: eSewa, QR Code
- **Documentation**: Swagger/OpenAPI

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Cloudinary account
- OpenAI API key
- eSewa merchant account

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/fashion-ecommerce-backend.git
cd fashion-ecommerce-backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

Edit the .env file with your configuration:

\`\`\`env
# App
PORT=3000
FRONTEND_URL=http://localhost:4200

# Database
MONGODB_URI=mongodb://localhost:27017/fashion-ecommerce

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=1d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# eSewa
ESEWA_MERCHANT_ID=your-merchant-id
ESEWA_API_URL=https://uat.esewa.com.np
\`\`\`

4. Start the development server:
\`\`\`bash
npm run start:dev
\`\`\`

### API Documentation

The API documentation is available at \`http://localhost:3000/api\` when the server is running. This interactive documentation is built with Swagger/OpenAPI and provides detailed information about all available endpoints.

## API Endpoints

### Authentication
- POST /auth/register - Register a new user
- POST /auth/login - Login with email and password
- GET /auth/google - Initiate Google OAuth login
- GET /auth/google/callback - Google OAuth callback

### Users
- GET /users/profile - Get current user profile
- PUT /users/profile - Update user profile
- POST /users/avatar - Update user avatar
- POST /users/device-token - Register device token
- DELETE /users/device-token/:token - Remove device token

### Virtual Try-On
- POST /virtual-tryon/generate - Generate try-on preview
- POST /virtual-tryon/generate-batch - Generate batch try-on previews

### Payments
- POST /payments/qr/generate - Generate QR code for payment
- POST /payments/esewa/initiate - Initiate eSewa payment
- GET /payments/verify/:orderId - Verify payment status
- POST /payments/refund - Process refund

### Fashion Assistant
- POST /fashion-assistant/recommendations - Get personalized recommendations
- GET /fashion-assistant/style-analysis - Analyze outfit style
- GET /fashion-assistant/trends - Get fashion trend predictions

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@fashion-ecommerce.com or join our Slack channel.
