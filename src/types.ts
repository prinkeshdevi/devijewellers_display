/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface JewelleryRates {
  gold24k: number;
  gold24kPurchase?: number;
  gold22k: number;
  gold22kPurchase?: number;
  gold20k: number;
  gold20kPurchase?: number;
  gold18k: number;
  gold18kPurchase?: number;
  silver: number;
  silverPurchase?: number;
  platinum: number;
  platinumPurchase?: number;
}

export type RateTrend = 'up' | 'down' | 'stable';

export interface RateTrends {
  gold24k: RateTrend;
  gold22k: RateTrend;
  gold20k: RateTrend;
  gold18k: RateTrend;
  silver: RateTrend;
  platinum: RateTrend;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  contact: string;
  manager: string;
}

export type DisplayMode = 'standard' | 'premium' | 'festival' | 'portrait' | 'landscape';
export type DisplayTheme = 'midnight_gold' | 'royal_emerald' | 'festival' | 'rose_gold_velvet' | 'ocean_platinum' | 'sunset_amber';

export interface DisplaySetting {
  mode: DisplayMode;
  theme: DisplayTheme;
  campaignId: string;
  tickerText: string;
  refreshInterval: number; // How often to check for rate updates
  ratesDisplayDuration?: number; // How long to show rates before switching to media
  slideshowDisplayDuration?: number; // How long the slide show should remain on screen
  rateFontSize?: number; // Rate Numbers Font Size in px
  goldFontSize?: number; // Gold rate numbers font size
  silverFontSize?: number; // Silver and other metal rate numbers font size
  labelFontSize?: number; // Display labels font size
  animationSpeed: number;
  showAnnouncement: boolean;
  announcementText: string;
  isBlackout: boolean;
  isPaused: boolean;
  customPrimaryBg?: string;
  customSecondaryBg?: string;
  customCardBg?: string;
  customGoldColor?: string;
  visibleRates?: string[]; // list of rates to display (e.g. ['gold24k', 'gold22k', 'silver'])
  mediaLoopEnabled?: boolean; // toggle slideshow display globally
  rotateBackgroundEnabled?: boolean; // toggle rotation of background images from media
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'banner' | 'video' | 'gallery';
  url: string;
  startDate: string;
  endDate: string;
  active: boolean;
  displayDuration?: number; // Custom display duration in seconds
}

export interface PromoItem {
  id: string;
  title: string;
  code: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: 'high' | 'medium' | 'low';
  active: boolean;
  displayOnTV: boolean;
  displayOnMobile: boolean;
  displayOnWeb: boolean;
}

export interface SaleStatusItem {
  id: string;
  name: string;
  tag: 'New Collection' | 'Gold Offer' | 'Diamond Offer' | 'Exchange Offer';
  status: 'active' | 'upcoming' | 'expired';
  branches: string[]; // branch IDs, or 'all'
}

export interface ConnectedDisplay {
  id: string;
  name: string;
  branchId: string;
  online: boolean;
  lastActive: string;
  assignedMode: DisplayMode;
  assignedTheme: DisplayTheme;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  action: string;
  details: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Branch Manager' | 'Operator';
  active: boolean;
  lastLogin: string;
}

export interface SystemConfig {
  companyName: string;
  logoText: string;
  logoImageBase64?: string;
  contactNumber: string;
  tickerSpeed: number;
  rateApiUrl: string;
  whatsappAlerts: boolean;
  emailAlerts: boolean;
}

export interface RateHistoryEntry {
  date: string;
  rates: JewelleryRates;
}
