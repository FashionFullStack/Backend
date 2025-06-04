export interface FashionRecommendation {
  products: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    confidence: number;
    reasonForRecommendation: string;
  }[];
  outfitSuggestions: {
    items: string[];
    description: string;
    occasion: string;
    styleNotes: string;
  }[];
  stylingTips: string[];
} 