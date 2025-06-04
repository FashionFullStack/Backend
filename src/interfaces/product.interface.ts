export enum ProductCategory {
  MENS_CLOTHING = 'mens_clothing',
  WOMENS_CLOTHING = 'womens_clothing',
  KIDS_CLOTHING = 'kids_clothing',
  TRADITIONAL = 'traditional',
  ACCESSORIES = 'accessories'
}

export enum ProductSubCategory {
  // Men's & Women's
  SHIRTS = 'shirts',
  TSHIRTS = 't_shirts',
  PANTS = 'pants',
  JEANS = 'jeans',
  JACKETS = 'jackets',
  SUITS = 'suits',
  
  // Traditional
  KURTA = 'kurta',
  SAREE = 'saree',
  DHOTI = 'dhoti',
  LEHENGA = 'lehenga',
  
  // Accessories
  BELTS = 'belts',
  SCARVES = 'scarves',
  JEWELRY = 'jewelry',
  BAGS = 'bags'
}

export interface IProduct {
  _id?: string;
  name: string;
  description: string;
  category: ProductCategory;
  subCategory: ProductSubCategory;
  price: {
    regular: number;  // In NPR
    sale?: number;    // Sale price in NPR
    wholesale?: number; // B2B price for stores in NPR
  };
  sizes: string[];
  colors: string[];
  images: string[];
  virtualTryOnEnabled: boolean;
  stockQuantity: number;
  manufacturer: string;
  material: string;
  careInstructions: string[];
  tags: string[];
  ratings: {
    average: number;
    count: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
} 