import { Injectable, BadRequestException } from '@nestjs/common';
import OpenAI from 'openai';
import axios from 'axios';
import { FashionRecommendation } from './interfaces/fashion-recommendation.interface';
import { OpenAIVisionRequest } from './interfaces/openai-vision.interface';

interface StylePreference {
  occasion: string;
  style: string;
  colors: string[];
  budget: {
    min: number;
    max: number;
  };
  seasonality: string[];
}

@Injectable()
export class FashionAssistantService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getPersonalizedRecommendations(
    userId: string,
    preferences: StylePreference,
  ): Promise<FashionRecommendation> {
    try {
      // 1. Generate personalized recommendations using GPT-4
      const prompt = this.buildRecommendationPrompt(preferences);
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'You are a professional fashion stylist with expertise in personal styling and fashion trends.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const aiSuggestions = completion.choices[0].message?.content;
      if (!aiSuggestions) {
        throw new Error('No recommendations generated');
      }

      // 2. Parse AI suggestions and match with actual products
      const recommendations = await this.matchProductsWithSuggestions(
        aiSuggestions,
        preferences,
      );

      return recommendations;
    } catch (error) {
      throw new BadRequestException(
        'Error generating fashion recommendations: ' + error.message,
      );
    }
  }

  async getStyleAnalysis(imageUrl: string): Promise<string> {
    try {
      // Use GPT-4 Vision API to analyze the style
      const request: OpenAIVisionRequest = {
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'system',
            content:
              'You are a fashion expert analyzing clothing styles and providing detailed feedback.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this outfit and provide style feedback:',
              },
              {
                type: 'image',
                image_url: { url: imageUrl },
              },
            ],
          },
        ],
        max_tokens: 500,
      };

      const response = await this.openai.chat.completions.create(request as any);
      return response.choices[0].message?.content || 'No analysis available';
    } catch (error) {
      throw new BadRequestException(
        'Error analyzing style: ' + error.message,
      );
    }
  }

  async getTrendPredictions(): Promise<string[]> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'You are a fashion trend forecaster with deep knowledge of upcoming fashion trends.',
          },
          {
            role: 'user',
            content:
              'What are the top fashion trends predicted for the next season?',
          },
        ],
      });

      const trends = completion.choices[0].message?.content?.split('\n') || [];
      return trends.filter((trend: string) => trend.trim().length > 0);
    } catch (error) {
      throw new BadRequestException(
        'Error predicting trends: ' + error.message,
      );
    }
  }

  private buildRecommendationPrompt(preferences: StylePreference): string {
    return `Please recommend fashion items and outfits based on the following preferences:
      - Occasion: ${preferences.occasion}
      - Style: ${preferences.style}
      - Colors: ${preferences.colors.join(', ')}
      - Budget Range: $${preferences.budget.min} - $${preferences.budget.max}
      - Seasons: ${preferences.seasonality.join(', ')}

      Please provide:
      1. Specific product recommendations
      2. Complete outfit suggestions
      3. Styling tips and combinations`;
  }

  private async matchProductsWithSuggestions(
    aiSuggestions: string,
    preferences: StylePreference,
  ): Promise<FashionRecommendation> {
    // This would typically involve:
    // 1. Parsing the AI suggestions
    // 2. Querying your product database
    // 3. Matching products with suggestions
    // 4. Filtering based on preferences

    // For now, return a mock response
    return {
      products: [
        {
          id: '1',
          name: 'Classic White Shirt',
          description: 'Versatile white cotton shirt',
          price: 49.99,
          imageUrl: 'https://example.com/shirt.jpg',
          confidence: 0.95,
          reasonForRecommendation:
            'Essential piece that matches your style preferences',
        },
      ],
      outfitSuggestions: [
        {
          items: ['Classic White Shirt', 'Black Slim-fit Pants', 'Brown Loafers'],
          description: 'Business casual outfit',
          occasion: 'Office',
          styleNotes: 'Perfect for a professional setting',
        },
      ],
      stylingTips: [
        'Layer with a blazer for formal occasions',
        'Roll up sleeves for a casual look',
      ],
    };
  }
} 