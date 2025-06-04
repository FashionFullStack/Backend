import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { AdminModule } from './admin/admin.module';
import { StoreModule } from './store/store.module';
import { ConsumerModule } from './consumer/consumer.module';
import { VisualizationModule } from './visualization/visualization.module';
import { ChatModule } from './chat/chat.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { Error } from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = 'mongodb+srv://Krishna:Krishna%40123@krishna.vkyypfp.mongodb.net/?retryWrites=true&w=majority&appName=Krishna';
        return {
          uri,
          connectionFactory: (connection) => {
            connection.on('connected', () => {
              console.log('MongoDB connection established successfully');
            });
            connection.on('error', (error: Error) => {
              console.error('MongoDB connection error:', error);
            });
            return connection;
          },
          serverApi: {
            version: '1',
            strict: true,
            deprecationErrors: true
          }
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    CartModule,
    WishlistModule,
    AdminModule,
    StoreModule,
    ConsumerModule,
    VisualizationModule,
    ChatModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
