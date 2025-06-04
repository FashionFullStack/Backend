# Fashion E-commerce API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

### Google OAuth Authentication
```
GET /auth/google
GET /auth/google/callback
```
- Initiates Google OAuth flow
- Callback URL must be configured in your Google Cloud Console
- Returns JWT token in HTTP-only cookie

### Logout
```
POST /auth/logout
```
- Clears authentication cookie

## Products API

### Get Products
```
GET /products
```
Query Parameters:
- `sort`: (string) Options: 'newest', 'price_low', 'price_high'
- `search`: (string) Search term
- `page`: (number) Page number
- `limit`: (number) Items per page

Response:
```json
{
  "products": [
    {
      "_id": "string",
      "name": "string",
      "description": "string",
      "category": "mens_clothing | womens_clothing | kids_clothing | traditional | accessories",
      "subCategory": "string",
      "price": {
        "regular": number,
        "sale": number,
        "wholesale": number
      },
      "sizes": ["string"],
      "colors": ["string"],
      "images": ["string"],
      "stockQuantity": number
    }
  ],
  "total": number,
  "page": number,
  "totalPages": number
}
```

### Get Single Product
```
GET /products/:id
```
Response: Single product object

## Cart API

All cart endpoints require authentication.

### Get Cart
```
GET /cart
```
Returns current user's cart

### Add to Cart
```
POST /cart/add
```
Body:
```json
{
  "productId": "string",
  "quantity": number,
  "size": "string",
  "color": "string"
}
```

### Update Cart Item
```
PATCH /cart/items/:itemId
```
Body:
```json
{
  "quantity": number
}
```

### Remove from Cart
```
DELETE /cart/items/:itemId
```

### Clear Cart
```
DELETE /cart/clear
```

## Orders API

All order endpoints require authentication.

### Create Order
```
POST /orders
```
Body:
```json
{
  "shippingAddress": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string"
  },
  "paymentMethod": "string"
}
```

### Get User Orders
```
GET /orders
```
Returns list of user's orders

### Get Single Order
```
GET /orders/:id
```

## Wishlist API

All wishlist endpoints require authentication.

### Create Wishlist
```
POST /wishlist
```
Body:
```json
{
  "name": "string",
  "description": "string",
  "isPublic": boolean
}
```

### Get User Wishlists
```
GET /wishlist
```

### Add Product to Wishlist
```
POST /wishlist/:id/products/:productId
```

### Remove Product from Wishlist
```
DELETE /wishlist/:id/products/:productId
```

## Frontend Integration Guide

### Setup Axios Instance
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,  // Important for cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // Redirect to login or refresh token
    }
    return Promise.reject(error);
  }
);
```

### Example Product Integration
```typescript
// Products Service
const getProducts = async (params: {
  sort?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await api.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// React Component Example
const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getProducts({
          sort: 'newest',
          page: 1,
          limit: 12
        });
        setProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};
```

### Error Handling
The API returns standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

Error responses include:
```json
{
  "statusCode": number,
  "message": "string",
  "error": "string"
}
```

### Authentication Flow
1. User clicks "Login with Google"
2. Redirect to `/auth/google`
3. After successful login, user is redirected back with JWT in HTTP-only cookie
4. All subsequent requests will automatically include the cookie
5. Handle 401 responses by redirecting to login

### Environment Setup
Create a `.env` file in your frontend project:
```
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Security Considerations
1. Always use HTTPS in production
2. Implement rate limiting for API calls
3. Validate all user input
4. Use HTTP-only cookies for JWT
5. Implement proper CORS settings
6. Never store sensitive data in localStorage

### Testing the API
You can use the Swagger documentation at:
```
http://localhost:3000/api
```

For local testing, use tools like:
- Postman
- curl
- Thunder Client (VS Code extension)

### Common Issues and Solutions
1. CORS errors:
   - Ensure frontend origin is allowed in backend CORS settings
   - Use `withCredentials: true` in axios

2. Authentication issues:
   - Check if cookies are being sent
   - Verify JWT token expiration
   - Clear cookies on logout

3. Data loading issues:
   - Implement proper loading states
   - Handle empty states
   - Add error boundaries in React

4. Performance:
   - Implement pagination
   - Use proper caching strategies
   - Optimize image loading 