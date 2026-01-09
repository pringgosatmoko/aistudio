
export enum AppRoute {
  DASHBOARD = 'dashboard',
  IMAGE_TO_VIDEO = 'image-to-video',
  TEXT_TO_IMAGE = 'text-to-image',
  HISTORY = 'history',
  PROFILE = 'profile',
  ADMIN = 'admin',
  LOGIN = 'login',
  REGISTER = 'register'
}

export enum UserStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface User {
  id: string | number;
  name: string;
  phone: string;
  password_hash: string;
  status: UserStatus;
  role: 'user' | 'admin';
  expired_at?: string;
  created_at: string;
}

export interface GenerationRecord {
  id: number;
  user_id: string | number;
  type: 'video' | 'image';
  prompt: string;
  result_url: string;
  created_at: string;
  params: Record<string, any>;
}

export interface CharacterParams {
  name: string;
  features: string;
  outfit: string;
}

export interface VideoParams {
  duration: '3s' | '6s' | '8s';
  aspectRatio: '16:9' | '9:16';
  style: string;
  cameraAngle: string;
  audioOn: boolean;
  scene?: string;
  dialogue?: string;
  character?: CharacterParams;
}

export interface ImageParams {
  aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
  style: string;
  colorGrading: string;
  referenceImages?: string[]; 
}
