/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  JewelleryRates, 
  RateTrends, 
  Branch, 
  DisplaySetting, 
  MediaItem, 
  PromoItem, 
  SaleStatusItem, 
  ConnectedDisplay, 
  AuditLog, 
  UserAccount, 
  SystemConfig,
  RateHistoryEntry
} from '../types';

export const INITIAL_RATES: JewelleryRates = {
  gold24k: 7245,
  gold24kPurchase: 7045,
  gold22k: 6645,
  gold22kPurchase: 6445,
  gold20k: 6040,
  gold20kPurchase: 5840,
  gold18k: 5435,
  gold18kPurchase: 5235,
  silver: 92500,
  silverPurchase: 90500,
  platinum: 3450,
  platinumPurchase: 3250
};

export const INITIAL_TRENDS: RateTrends = {
  gold24k: 'up',
  gold22k: 'up',
  gold20k: 'stable',
  gold18k: 'down',
  silver: 'up',
  platinum: 'down'
};

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'b1',
    name: 'Flagship Showroom - New Delhi',
    address: 'A-24, Connaught Place, Inner Circle, New Delhi 110001',
    contact: '+91 11 4325 8800',
    manager: 'Rajesh Sharma'
  },
  {
    id: 'b2',
    name: 'South Extension Boutique',
    address: 'G-12, Main Market, South Extension Part II, New Delhi 110049',
    contact: '+91 11 4164 1222',
    manager: 'Anjali Singhal'
  },
  {
    id: 'b3',
    name: 'Mumbai Galleria',
    address: 'Shop No 4, Ground Floor, Charni Road, Mumbai 400004',
    contact: '+91 22 6677 8899',
    manager: 'Vikram Mehta'
  },
  {
    id: 'b4',
    name: 'Bengaluru Palace Road',
    address: '102, Palace Cross Road, Vasanth Nagar, Bengaluru 560052',
    contact: '+91 80 2234 4321',
    manager: 'Kalyan Raman'
  }
];

export const INITIAL_DISPLAY_SETTING: DisplaySetting = {
  mode: 'standard',
  theme: 'midnight_gold',
  campaignId: 'p2',
  tickerText: '✨ Special Exchange Offer: Get 100% Value on Old Gold Exchange. Flat 15% OFF on Making Charges on Premium Collections! ✨ Book your consultation today.',
  refreshInterval: 15,
  ratesDisplayDuration: 12,
  slideshowDisplayDuration: 8,
  rateFontSize: 72,
  goldFontSize: 72,
  silverFontSize: 72,
  labelFontSize: 36,
  animationSpeed: 5,
  showAnnouncement: false,
  announcementText: '🔔 Dhanteras Bookings Open! Block your gold rate with only 10% advance payment. Visit nearest counter for details.',
  isBlackout: false,
  isPaused: false,
  customPrimaryBg: '#0B0B0D',
  customSecondaryBg: '#15161A',
  customCardBg: '#161619',
  customGoldColor: '#D4AF37',
  visibleRates: ['gold24k', 'gold22k', 'gold20k', 'gold18k', 'silver', 'platinum'],
  mediaLoopEnabled: true,
  showDate: true
};

export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'm1',
    title: 'Imperial Bridal Collection Hero Banner',
    type: 'banner',
    url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200',
    startDate: '2026-06-01',
    endDate: '2026-06-30',
    active: true,
    displayDuration: 6
  },
  {
    id: 'm2',
    title: 'Traditional Gold Bangles Showcase',
    type: 'banner',
    url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=1200',
    startDate: '2026-06-01',
    endDate: '2026-06-25',
    active: true,
    displayDuration: 8
  },
  {
    id: 'm3',
    title: 'Flawless Diamond Solitaire Rings',
    type: 'gallery',
    url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1200',
    startDate: '2026-05-15',
    endDate: '2026-07-15',
    active: true,
    displayDuration: 7
  },
  {
    id: 'm4',
    title: 'Kundan Antique Choker Series',
    type: 'gallery',
    url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200',
    startDate: '2026-06-05',
    endDate: '2026-06-20',
    active: true,
    displayDuration: 10
  }
];

export const INITIAL_PROMOS: PromoItem[] = [
  {
    id: 'p1',
    title: 'Shubh Vivah Wedding Gala',
    code: 'VIVAH10',
    description: 'Flat 10% discount on making charges for all temple jewellery & bridal chokers.',
    startDate: '2026-06-01',
    endDate: '2026-06-30',
    priority: 'high',
    active: true,
    displayOnTV: true,
    displayOnMobile: true,
    displayOnWeb: true
  },
  {
    id: 'p2',
    title: 'Akshaya Tritiya Swarna Utsav',
    code: 'SWARNA20',
    description: 'Ensure happiness & prosperity. Get a free 24K silver coin (10gm) with purchases over ₹1,50,000.',
    startDate: '2026-06-05',
    endDate: '2026-06-20',
    priority: 'medium',
    active: true,
    displayOnTV: true,
    displayOnMobile: true,
    displayOnWeb: false
  },
  {
    id: 'p3',
    title: 'Heritage Exchange Fiesta',
    code: 'XCHANGE100',
    description: 'Upgrade old styling with modern elegance. Enjoy zero deduction on exchange of certified hallmark gold.',
    startDate: '2026-06-01',
    endDate: '2026-07-15',
    priority: 'high',
    active: true,
    displayOnTV: true,
    displayOnMobile: false,
    displayOnWeb: true
  }
];

export const INITIAL_SALE_STATUS: SaleStatusItem[] = [
  {
    id: 's1',
    name: 'Nouveau Diamond Chokers Preview',
    tag: 'Diamond Offer',
    status: 'active',
    branches: ['b1', 'b2']
  },
  {
    id: 's2',
    name: 'Royal Heritage Solitaire Rings',
    tag: 'New Collection',
    status: 'active',
    branches: ['all']
  },
  {
    id: 's3',
    name: 'Hallmarked Coin Sweepstake',
    tag: 'Gold Offer',
    status: 'upcoming',
    branches: ['b1', 'b3', 'b4']
  },
  {
    id: 's4',
    name: 'Zero Valuation Fee Gold Exchange',
    tag: 'Exchange Offer',
    status: 'active',
    branches: ['all']
  }
];

export const INITIAL_DISPLAYS: ConnectedDisplay[] = [
  {
    id: 'd1',
    name: 'Main Entrance LED (CP)',
    branchId: 'b1',
    online: true,
    lastActive: '2026-06-09T15:55:00Z',
    assignedMode: 'standard',
    assignedTheme: 'midnight_gold'
  },
  {
    id: 'd2',
    name: 'Showroom Interior Wall LED (CP)',
    branchId: 'b1',
    online: true,
    lastActive: '2026-06-09T15:58:12Z',
    assignedMode: 'premium',
    assignedTheme: 'midnight_gold'
  },
  {
    id: 'd3',
    name: 'Window Display Portrait LED',
    branchId: 'b2',
    online: true,
    lastActive: '2026-06-09T15:58:30Z',
    assignedMode: 'portrait',
    assignedTheme: 'royal_emerald'
  },
  {
    id: 'd4',
    name: 'Lounge Reception Landscape TV',
    branchId: 'b3',
    online: false,
    lastActive: '2026-06-09T14:40:00Z',
    assignedMode: 'festival',
    assignedTheme: 'festival'
  }
];

export const INITIAL_LOGS: AuditLog[] = [
  {
    id: 'l1',
    timestamp: '2026-06-09T14:30:15Z',
    userEmail: 'operator@devijewellers.com',
    action: 'Rate Manual Entry',
    details: 'Updated 22K Gold Rate from ₹6,630 to ₹6,645. Published directly.'
  },
  {
    id: 'l2',
    timestamp: '2026-06-09T15:15:42Z',
    userEmail: 'manager.nd@devijewellers.com',
    action: 'Promo Created',
    details: 'Added "Akshaya Tritiya Swarna Utsav". Scheduled to go live.'
  },
  {
    id: 'l3',
    timestamp: '2026-06-09T15:45:00Z',
    userEmail: 'someshai1702@gmail.com',
    action: 'Settings Change',
    details: 'Updated global ticker message to reflect Akshaya Tritiya exchange terms.'
  }
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'u1',
    name: 'Somesh Rai',
    email: 'someshai1702@gmail.com',
    role: 'Super Admin',
    active: true,
    lastLogin: '2026-06-09T15:58:50Z'
  },
  {
    id: 'u2',
    name: 'Aishwarya Patil',
    email: 'aishwarya@devijewellers.com',
    role: 'Admin',
    active: true,
    lastLogin: '2026-06-09T15:10:00Z'
  },
  {
    id: 'u3',
    name: 'Rajesh Sharma',
    email: 'r.sharma@devijewellers.com',
    role: 'Branch Manager',
    active: true,
    lastLogin: '2026-06-09T09:30:00Z'
  },
  {
    id: 'u4',
    name: 'Karan Malhotra',
    email: 'karan.ope@devijewellers.com',
    role: 'Operator',
    active: false,
    lastLogin: '2026-06-08T18:45:00Z'
  }
];

export const INITIAL_SYSTEM_CONFIG: SystemConfig = {
  companyName: 'देवी ज्वेलर्स',
  logoText: 'DEVI JEWELLERS',
  contactNumber: '+91 99999 88888',
  tickerSpeed: 40,
  rateApiUrl: 'https://www.businessmantra.info/gold_rates/devi_gold_rate/api.php',
  whatsappAlerts: true,
  emailAlerts: true
};

export const INITIAL_HISTORY: RateHistoryEntry[] = [
  {
    date: 'Jun 03',
    rates: { gold24k: 7150, gold24kPurchase: 6950, gold22k: 6550, gold22kPurchase: 6350, gold20k: 5970, gold20kPurchase: 5770, gold18k: 5370, gold18kPurchase: 5170, silver: 90.0, silverPurchase: 88.0, platinum: 3380, platinumPurchase: 3180 }
  },
  {
    date: 'Jun 04',
    rates: { gold24k: 7180, gold24kPurchase: 6980, gold22k: 6580, gold22kPurchase: 6380, gold20k: 5990, gold20kPurchase: 5790, gold18k: 5390, gold18kPurchase: 5190, silver: 91.2, silverPurchase: 89.2, platinum: 3410, platinumPurchase: 3210 }
  },
  {
    date: 'Jun 05',
    rates: { gold24k: 7200, gold24kPurchase: 7000, gold22k: 6600, gold22kPurchase: 6400, gold20k: 6010, gold20kPurchase: 5810, gold18k: 5410, gold18kPurchase: 5210, silver: 91.5, silverPurchase: 89.5, platinum: 3400, platinumPurchase: 3200 }
  },
  {
    date: 'Jun 06',
    rates: { gold24k: 7210, gold24kPurchase: 7010, gold22k: 6610, gold22kPurchase: 6410, gold20k: 6015, gold20kPurchase: 5815, gold18k: 5415, gold18kPurchase: 5215, silver: 91.8, silverPurchase: 89.8, platinum: 3420, platinumPurchase: 3220 }
  },
  {
    date: 'Jun 07',
    rates: { gold24k: 7210, gold24kPurchase: 7010, gold22k: 6610, gold22kPurchase: 6410, gold20k: 6015, gold20kPurchase: 5815, gold18k: 5415, gold18kPurchase: 5215, silver: 91.8, silverPurchase: 89.8, platinum: 3420, platinumPurchase: 3220 }
  },
  {
    date: 'Jun 08',
    rates: { gold24k: 7230, gold24kPurchase: 7030, gold22k: 6630, gold22kPurchase: 6430, gold20k: 6030, gold20kPurchase: 5830, gold18k: 5425, gold18kPurchase: 5225, silver: 92.1, silverPurchase: 90.1, platinum: 3440, platinumPurchase: 3240 }
  },
  {
    date: 'Jun 09',
    rates: { gold24k: 7245, gold24kPurchase: 7045, gold22k: 6645, gold22kPurchase: 6445, gold20k: 6040, gold20kPurchase: 5840, gold18k: 5435, gold18kPurchase: 5235, silver: 92.5, silverPurchase: 90.5, platinum: 3450, platinumPurchase: 3250 }
  }
];
