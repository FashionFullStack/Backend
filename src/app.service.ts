import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    try {
      // Test the MongoDB connection
      if (this.connection.db) {
        await this.connection.db.admin().ping();
        console.log('MongoDB Connection Test: Successfully connected to MongoDB!');
      } else {
        console.error('MongoDB Connection Test Failed: No database connection available');
      }
    } catch (error) {
      console.error('MongoDB Connection Test Failed:', error);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
