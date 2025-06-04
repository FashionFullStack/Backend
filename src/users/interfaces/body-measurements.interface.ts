export interface BodyMeasurements {
  height: number;
  weight: number;
  chest: number;
  waist: number;
  hips: number;
  inseam: number;
  shoulder: number;
  neck?: number;
  bicep?: number;
  forearm?: number;
  wrist?: number;
  thigh?: number;
  calf?: number;
  ankle?: number;
  units: {
    height: 'cm' | 'in';
    weight: 'kg' | 'lb';
    measurements: 'cm' | 'in';
  };
} 