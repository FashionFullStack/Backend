export interface OpenAIVisionMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | OpenAIVisionContent[];
}

export interface OpenAIVisionContent {
  type: 'text' | 'image';
  text?: string;
  image_url?: {
    url: string;
  };
}

export interface OpenAIVisionRequest {
  model: string;
  messages: OpenAIVisionMessage[];
  max_tokens?: number;
} 