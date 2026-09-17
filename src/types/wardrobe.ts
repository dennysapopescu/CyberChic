export type GarmentCategory = 'top' | 'bottom' | 'shoes' | 'accessory';

export type GarmentStyle = 'School' | 'Chic' | 'Party' | 'Casual' | 'Grunge';

export type GarmentPattern = 'plaid' | 'solid' | 'argyle' | 'striped' | 'floral' | 'metallic' | 'denim';

export type GarmentSeason = 'Fall' | 'Spring' | 'Summer' | 'Winter' | 'All';

export interface Garment {
  id: string;
  name: string;
  category: GarmentCategory;
  subCategory?: string;
  color: string;
  colorName: string;
  pattern: GarmentPattern;
  style: GarmentStyle;
  season: GarmentSeason;
  suitSetId?: string;
  illustrationId?: string;
  imageUri?: string;
  description?: string;
  isCustom?: boolean;
  createdAt?: number;
}

export interface LookbookOutfit {
  id: string;
  name: string;
  top: Garment;
  bottom: Garment;
  shoes?: Garment;
  accessory?: Garment;
  score: number;
  verdictTitle: string;
  quote: string;
  createdAt: number;
}

export interface MatchVerdict {
  status: 'MATCH' | 'MISMATCH';
  score: number;
  title: string;
  quote: string;
  explanation: string;
  isIconic?: boolean;
}

export type RetroSoundType = 'click' | 'tick' | 'beep' | 'mismatch' | 'match' | 'spin';

export interface UserProfile {
  id?: string;
  name: string;
  tagline?: string;
  avatarIcon?: string;
  avatarImageUri?: string;
  themeColor?: string;
  createdAt?: number;
}

export interface UserAccount {
  id: string;
  name: string;
  email?: string;
  authProvider?: 'local' | 'google';
  tagline: string;
  avatarIcon: string;
  avatarImageUri?: string;
  themeColor: string;
  createdAt: number;
}
