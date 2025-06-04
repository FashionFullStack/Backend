export interface TryOnResult {
  renderedImageUrl: string;
  previewUrl: string;
  modelData: {
    height: number;
    weight: number;
    measurements: {
      chest: number;
      waist: number;
      hips: number;
      inseam: number;
      shoulder: number;
    };
  };
} 