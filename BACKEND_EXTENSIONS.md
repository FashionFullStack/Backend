# Backend Extensions Implementation Guide

## 1. Enhanced Authentication & Authorization

### Role-Based Guards Implementation
```typescript
// guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user?.role);
  }
}
```

### Profile Management
```typescript
// users/dto/update-profile.dto.ts
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsObject()
  bodyMeasurements: {
    height: number;
    weight: number;
    chest: number;
    waist: number;
    hips: number;
    inseam: number;
    shoulder: number;
  };

  @IsOptional()
  @IsString()
  avatar: string; // Base64 or URL
}
```

## 2. 3D/Visual Data Integration

### Virtual Try-On Service
```typescript
// visualization/virtual-tryon.service.ts
@Injectable()
export class VirtualTryOnService {
  async generateTryOn(productId: string, userMeasurements: any): Promise<string> {
    // Integration with 3D rendering service
    // Return URL of rendered image/3D model
  }
}
```

## 3. Payment Integration

### QR Code Payment Service
```typescript
// payments/qr-payment.service.ts
@Injectable()
export class QRPaymentService {
  async generateQRCode(orderId: string, amount: number): Promise<string> {
    // Generate QR code for eSewa payment
    return qrCode;
  }
}
```

## 4. Order Management System

### Order Status Management
```typescript
// orders/order-status.service.ts
@Injectable()
export class OrderStatusService {
  async updateStatus(
    orderId: string, 
    newStatus: OrderStatus, 
    adminId: string
  ): Promise<Order> {
    // Validate status transition
    // Update order status
    // Send notifications
  }

  async processRefund(
    orderId: string, 
    amount: number, 
    reason: string
  ): Promise<Refund> {
    // Process refund
    // Update order status
    // Send notifications
  }
}
```

## 5. Store Management

### Analytics Service
```typescript
// analytics/store-analytics.service.ts
@Injectable()
export class StoreAnalyticsService {
  async getSalesAnalytics(
    storeId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<Analytics> {
    // Aggregate sales data
    // Calculate metrics
    // Generate reports
  }
}
```

### Product Upload
```typescript
// products/dto/create-product.dto.ts
export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsObject()
  sizeGuide: {
    measurements: Record<string, number>;
    recommendations: string[];
  };

  @IsArray()
  @IsString({ each: true })
  materials: string[];

  @IsArray()
  @Type(() => ProductImageDto)
  images: ProductImageDto[];

  @IsOptional()
  @IsString()
  modelFile?: string; // 3D model file URL
}
```

## 6. AI Fashion Assistant

### Fashion Recommendation Service
```typescript
// ai/fashion-recommendation.service.ts
@Injectable()
export class FashionRecommendationService {
  constructor(
    private readonly openaiService: OpenAIService,
    private readonly productsService: ProductsService,
  ) {}

  async getPersonalizedRecommendations(
    userId: string,
    preferences: any
  ): Promise<Product[]> {
    // Get user style preferences
    // Generate AI recommendations
    // Filter available products
    return recommendations;
  }
}
```

## Implementation Steps

1. **Database Schema Updates**
```typescript
// Add new schemas for:
- UserProfile (extended user data)
- VirtualTryOn (3D model data)
- Refund
- Analytics
- SizeGuide
```

2. **New API Endpoints**

### Profile Management
```
PUT /users/profile - Update user profile
GET /users/profile - Get user profile
POST /users/avatar - Upload avatar
```

### Virtual Try-On
```
POST /visualization/try-on
GET /visualization/wardrobe
```

### Payments
```
POST /payments/generate-qr
POST /payments/verify
```

### Order Management
```
PATCH /orders/:id/status
POST /orders/:id/refund
GET /orders/analytics
```

### Store Management
```
POST /products/bulk-upload
GET /store/analytics
GET /store/inventory
```

### AI Fashion Assistant
```
POST /ai/recommendations
POST /ai/style-analysis
```

3. **Security Implementation**

```typescript
// Implement guards for each role
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
```

4. **Middleware & Interceptors**

```typescript
// Add interceptors for:
- Request logging
- Response transformation
- Error handling
- Performance monitoring
```

## Environment Setup

Add these variables to .env:
```
# AI Services
OPENAI_API_KEY=your_openai_key
VIRTUAL_TRYON_API_KEY=your_3d_service_key

# Payment Integration
ESEWA_MERCHANT_ID=your_merchant_id
ESEWA_SECRET_KEY=your_secret_key

# Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Testing

Create integration tests for:
1. Role-based access control
2. Order status transitions
3. Payment processing
4. AI recommendations
5. Virtual try-on flow

## Deployment Considerations

1. Set up separate environments (dev/staging/prod)
2. Configure proper CORS settings
3. Implement rate limiting
4. Set up monitoring and logging
5. Configure backup strategy for MongoDB

## API Documentation Updates

Update Swagger documentation with new endpoints:
```typescript
@ApiTags('Virtual Try-On')
@ApiOperation({ summary: 'Generate virtual try-on image' })
@ApiResponse({ status: 201, description: 'Returns URL of rendered image' })
```

## Error Handling

Implement custom exception filters:
```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const error = exception.getResponse();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
      error,
    });
  }
}
```

## Performance Optimization

1. Implement caching for:
   - Product listings
   - User preferences
   - Analytics data

2. Use database indexing for:
   - Product search
   - Order queries
   - Analytics aggregation

3. Implement pagination for all list endpoints

## Monitoring & Logging

1. Set up Winston logger
2. Implement request tracking
3. Monitor performance metrics
4. Set up error alerting

## Next Steps

1. Implement each module one by one
2. Write comprehensive tests
3. Set up CI/CD pipeline
4. Create deployment documentation
5. Plan scaling strategy 