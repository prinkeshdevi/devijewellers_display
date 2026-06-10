/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  JewelleryRates, 
  RateTrends, 
  DisplayMode, 
  DisplayTheme, 
  PromoItem, 
  SystemConfig,
  MediaItem
} from '../types';
import { 
  Sparkles, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  PhoneCall, 
  MapPin, 
  Calendar,
  Gift,
  Play,
  Volume2,
  VolumeX,
  FileImage
} from 'lucide-react';

interface TVDisplayProps {
  rates: JewelleryRates;
  trends: RateTrends;
  mode?: DisplayMode;
  theme?: DisplayTheme;
  tickerText?: string;
  announcementText?: string;
  showAnnouncement?: boolean;
  isBlackout?: boolean;
  isPaused?: boolean;
  companyConfig?: SystemConfig;
  activePromo?: PromoItem;
  customPrimaryBg?: string;
  customSecondaryBg?: string;
  customCardBg?: string;
  customGoldColor?: string;
  rateFontSize?: number;
  goldFontSize?: number;
  silverFontSize?: number;
  labelFontSize?: number;
  visibleRates?: string[];
  media?: MediaItem[];
  mediaLoopEnabled?: boolean;
  rotateBackgroundEnabled?: boolean;
  ratesDisplayDuration?: number;
  slideshowDisplayDuration?: number;
}

export default function TVDisplay({
  rates,
  trends,
  mode = 'standard',
  theme = 'midnight_gold',
  tickerText,
  announcementText,
  showAnnouncement = false,
  isBlackout = false,
  isPaused = false,
  companyConfig,
  activePromo,
  customPrimaryBg,
  customSecondaryBg,
  customCardBg,
  customGoldColor,
  rateFontSize,
  goldFontSize,
  silverFontSize,
  labelFontSize,
  visibleRates,
  media = [],
  mediaLoopEnabled = true,
  rotateBackgroundEnabled = false,
  ratesDisplayDuration,
  slideshowDisplayDuration
}: TVDisplayProps) {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  
  // Keep track of rate flashes for animation when rates change
  const [prevRates, setPrevRates] = useState<JewelleryRates | null>(null);
  const [flashingFields, setFlashingFields] = useState<Record<string, 'up' | 'down' | null>>({});

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDate(now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Monitor rate changes to trigger temporary flash animations
  useEffect(() => {
    if (prevRates) {
      const newFlashes: Record<string, 'up' | 'down' | null> = {};
      let hasChanges = false;

      (Object.keys(rates) as Array<keyof JewelleryRates>).forEach((field) => {
        if (rates[field] !== prevRates[field]) {
          newFlashes[field] = rates[field] > prevRates[field] ? 'up' : 'down';
          hasChanges = true;
        }
      });

      if (hasChanges) {
        setFlashingFields(newFlashes);
        const timer = setTimeout(() => {
          setFlashingFields({});
        }, 3000); // clear flash after 3s
        return () => clearTimeout(timer);
      }
    }
    setPrevRates({ ...rates });
  }, [rates]);

  // Slideshow and alternates loop states
  const [currentSignageMode, setCurrentSignageMode] = useState<'rates' | 'media'>('rates');
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [mediaTimeRemaining, setMediaTimeRemaining] = useState<number>(0);

  // Filter active media items based on status
  const activeMediaItems = (media || []).filter(item => item.active);

  // Background rotation states for Rates mode
  const [bgMediaIndex, setBgMediaIndex] = useState<number>(0);
  
  // Rotating background logic
  useEffect(() => {
    if (!rotateBackgroundEnabled || isPaused || activeMediaItems.length === 0) return;
    
    // Switch background every 10 seconds
    const bgInterval = setInterval(() => {
      setBgMediaIndex(prev => (prev + 1) % activeMediaItems.length);
    }, 10000);
    
    return () => clearInterval(bgInterval);
  }, [rotateBackgroundEnabled, isPaused, activeMediaItems.length]);

  useEffect(() => {
    if (isPaused) return;

    if (!mediaLoopEnabled || activeMediaItems.length === 0) {
      setCurrentSignageMode('rates');
      return;
    }

    let intervalId: NodeJS.Timeout;
    
    if (currentSignageMode === 'rates') {
      const durationSeconds = ratesDisplayDuration || 12;
      setMediaTimeRemaining(durationSeconds);

      let elapsed = 0;
      intervalId = setInterval(() => {
        elapsed += 1;
        setMediaTimeRemaining(Math.max(0, durationSeconds - elapsed));
        if (elapsed >= durationSeconds) {
          setCurrentSignageMode('media');
          setActiveMediaIndex(0);
          clearInterval(intervalId);
        }
      }, 1000);
    } else {
      // currentSignageMode === 'media'
      const currentMediaItem = activeMediaItems[activeMediaIndex];
      if (!currentMediaItem) {
        setCurrentSignageMode('rates');
        return;
      }

      const durationSeconds = currentMediaItem.displayDuration || slideshowDisplayDuration || 8;
      setMediaTimeRemaining(durationSeconds);

      let elapsed = 0;
      intervalId = setInterval(() => {
        elapsed += 1;
        setMediaTimeRemaining(Math.max(0, durationSeconds - elapsed));
        if (elapsed >= durationSeconds) {
          if (activeMediaIndex + 1 < activeMediaItems.length) {
            setActiveMediaIndex(prev => prev + 1);
          } else {
            setCurrentSignageMode('rates');
          }
          clearInterval(intervalId);
        }
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [currentSignageMode, activeMediaIndex, media, mediaLoopEnabled, ratesDisplayDuration, slideshowDisplayDuration, isPaused, activeMediaItems.length]);

  if (isBlackout) {
    return (
      <div id="tv-blackout" className="w-full h-full min-h-[500px] bg-black flex items-center justify-center text-zinc-900 font-mono select-none">
        ❌ SYSTEM STANDBY / BLACKOUT
      </div>
    );
  }

  // Handle design parameters depending on the active Theme
  // midnight_gold vs royal_emerald vs festival
  let themeBg = 'bg-[#0B0B0D]';
  let themeCard = 'bg-[#15161A] border-[#D4AF37]/30 shadow-2xl';
  let accentColor = 'text-[#D4AF37]';
  let bgAccentLine = 'bg-[#D4AF37]';
  let sheenColor = 'rgba(212, 175, 55, 0.12)';
  let festivalGreeting = 'A Festival of Prosperity & Light';

  if (theme === 'royal_emerald') {
    themeBg = 'bg-[#041510]';
    themeCard = 'bg-[#06241C] border-[#10B981]/20';
    accentColor = 'text-[#F4D03F]'; // Keep gold text for elegance
    bgAccentLine = 'bg-[#10B981]';
    sheenColor = 'rgba(16, 185, 129, 0.09)';
  } else if (theme === 'festival') {
    themeBg = 'bg-[#1E090F]'; // deep red wine / maroon
    themeCard = 'bg-[#2B0E17] border-[#EA580C]/20';
    accentColor = 'text-[#F59E0B]';
    bgAccentLine = 'bg-[#EA580C]';
    sheenColor = 'rgba(234, 88, 12, 0.1)';
    festivalGreeting = '🔮 Dhanteras & Diwali Swarna Mahotsav 🔮';
  } else if (theme === 'rose_gold_velvet') {
    themeBg = 'bg-[#1C101A]';
    themeCard = 'bg-[#2B1425] border-[#E0A899]/30 shadow-2xl';
    accentColor = 'text-[#E0A899]';
    bgAccentLine = 'bg-[#E0A899]';
    sheenColor = 'rgba(224, 168, 153, 0.12)';
    festivalGreeting = '✨ Rose Gold & Diamond Masterpieces ✨';
  } else if (theme === 'ocean_platinum') {
    themeBg = 'bg-[#0B141E]';
    themeCard = 'bg-[#0F2030] border-[#E5E7EB]/20';
    accentColor = 'text-[#E5E7EB]';
    bgAccentLine = 'bg-[#3B82F6]';
    sheenColor = 'rgba(229, 231, 235, 0.1)';
    festivalGreeting = '❄️ Premium Platinum & Solitaires ❄️';
  } else if (theme === 'sunset_amber') {
    themeBg = 'bg-[#1B0F05]';
    themeCard = 'bg-[#2B190B] border-[#F59E0B]/35';
    accentColor = 'text-[#F59E0B]';
    bgAccentLine = 'bg-[#D97706]';
    sheenColor = 'rgba(245, 158, 11, 0.15)';
    festivalGreeting = '☀️ Golden Hour Exotics ☀️';
  }

  // Handle portrait or landscape structures
  // When 'portrait' mode is activated, we layout items in a tower, optimal for 9:16 displays
  const isPortrait = mode === 'portrait';

  const rateItems = [
    { key: 'gold24k', name: '24K pure gold', rating: '99.9% Purity', label: '24K Gold', value: rates.gold24k, purchaseValue: rates.gold24kPurchase, trend: trends.gold24k, unit: '/ 10 gm' },
    { key: 'gold22k', name: '22K standard gold', rating: '91.6% Hallmark (KDM)', label: '22K Gold', value: rates.gold22k, purchaseValue: rates.gold22kPurchase, trend: trends.gold22k, unit: '/ 10 gm' },
    { key: 'gold20k', name: '20K premium jewelry', rating: '83.3% Purity Alloy', label: '20K Gold', value: rates.gold20k, purchaseValue: rates.gold20kPurchase, trend: trends.gold20k, unit: '/ 10 gm' },
    { key: 'gold18k', name: '18K luxury diamond-set', rating: '75.0% Purity Alloy', label: '18K Gold', value: rates.gold18k, purchaseValue: rates.gold18kPurchase, trend: trends.gold18k, unit: '/ 10 gm' },
    { key: 'silver', name: 'Silver', rating: '99.9% Pure Sterling', label: 'Silver', value: rates.silver, purchaseValue: rates.silverPurchase, trend: trends.silver, unit: '/ 1 kg' },
    { key: 'platinum', name: 'Precious Platinum', rating: '95.0% Pure Platinum', label: 'Platinum Pt950', value: rates.platinum, purchaseValue: rates.platinumPurchase, trend: trends.platinum, unit: '/ 10 gm' },
  ].filter(item => !visibleRates || visibleRates.length === 0 || visibleRates.includes(item.key));

  const goldRateItems = rateItems.filter(item => item.key.startsWith('gold'));
  const silverRateItems = rateItems.filter(item => !item.key.startsWith('gold'));
  const colCount = goldRateItems.length > 0 ? goldRateItems.length : 4;

  const formatPrice = (val: number, isSilver: boolean) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.abs(val || 0));
  };

  const hexToRgb = (hex: string): string => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16) || 212;
    const g = parseInt(cleanHex.substring(2, 4), 16) || 175;
    const b = parseInt(cleanHex.substring(4, 6), 16) || 55;
    return `${r}, ${g}, ${b}`;
  };

  const overrideGoldRgb = customGoldColor ? hexToRgb(customGoldColor) : '212, 175, 55';
  
  const isRotatingBgActive = rotateBackgroundEnabled && activeMediaItems.length > 0;

  return (
    <div 
      id="tv-display-root"
      className={`w-full text-[#F8F5EE] select-none h-screen flex flex-col justify-between font-sans transition-all duration-700 p-2 relative overflow-hidden ${isRotatingBgActive ? 'bg-black' : themeBg}`}
      style={{ 
        backgroundColor: isRotatingBgActive ? 'transparent' : (customPrimaryBg || undefined),
        borderColor: customGoldColor ? `${customGoldColor}30` : undefined
      }}
    >
      {/* CSS Styles injection for professional dynamic visual polish */}
      <style>{`
        @keyframes metallic-sweep {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shine-effect {
          background: linear-gradient(
            110deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0) 40%,
            rgba(255,255,255,0.12) 50%,
            rgba(255,255,255,0) 60%,
            rgba(255,255,255,0) 100%
          );
          background-size: 200% 100%;
          animation: metallic-sweep 9s infinite linear;
        }
        @keyframes custom-flash-green {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(34, 197, 94, 0.15); border-color: #22c55e; }
        }
        @keyframes custom-flash-red {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(239, 68, 68, 0.15); border-color: #ef4444; }
        }
        .flash-up-anim {
          animation: custom-flash-green 1.5s ease-in-out infinite;
        }
        .flash-down-anim {
          animation: custom-flash-red 1.5s ease-in-out infinite;
        }
        @keyframes marquee-travel {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
          display: flex;
        }
        .marquee-content {
          display: inline-block;
          animation: marquee-travel ${companyConfig?.tickerSpeed || 45}s linear infinite;
        }
        .light-sparkle {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .clip-hexagon {
          clip-path: url(#hex-rounded);
        }

        ${customGoldColor ? `
          #tv-display-root .text-\\[\\#D4AF37\\] { color: ${customGoldColor} !important; }
          #tv-display-root .bg-\\[\\#D4AF37\\] { background-color: ${customGoldColor} !important; }
          #tv-display-root .border-\\[\\#D4AF37\\] { border-color: ${customGoldColor} !important; }
          #tv-display-root .border-\\[\\#D4AF37\\]\\/10 { border-color: rgba(${overrideGoldRgb}, 0.1) !important; }
          #tv-display-root .border-\\[\\#D4AF37\\]\\/15 { border-color: rgba(${overrideGoldRgb}, 0.15) !important; }
          #tv-display-root .border-\\[\\#D4AF37\\]\\/30 { border-color: rgba(${overrideGoldRgb}, 0.3) !important; }
          #tv-display-root .border-\\[\\#D4AF37\\]\\/35 { border-color: rgba(${overrideGoldRgb}, 0.35) !important; }
          #tv-display-root .border-\\[\\#D4AF37\\]\\/40 { border-color: rgba(${overrideGoldRgb}, 0.4) !important; }
          #tv-display-root .border-\\[\\#D4AF37\\]\\/45 { border-color: rgba(${overrideGoldRgb}, 0.45) !important; }
          #tv-display-root .bg-\\[\\#D4AF37\\]\\/10 { background-color: rgba(${overrideGoldRgb}, 0.1) !important; }
          #tv-display-root .bg-\\[\\#D4AF37\\]\\/5 { background-color: rgba(${overrideGoldRgb}, 0.05) !important; }
          #tv-display-root .gold-gradient {
            background: linear-gradient(to right, ${customGoldColor}, #FFFFFF, ${customGoldColor}) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
          }
        ` : ''}
        ${customCardBg ? `
          #tv-display-root .bg-\\[\\#15161A\\] { background-color: ${customCardBg} !important; }
          #tv-display-root .bg-\\[\\#06241C\\] { background-color: ${customCardBg} !important; }
          #tv-display-root .bg-\\[\\#2B0E17\\] { background-color: ${customCardBg} !important; }
          #tv-display-root .bg-\\[\\#2B1425\\] { background-color: ${customCardBg} !important; }
          #tv-display-root .bg-\\[\\#0F2030\\] { background-color: ${customCardBg} !important; }
          #tv-display-root .bg-\\[\\#2B190B\\] { background-color: ${customCardBg} !important; }
        ` : ''}
      `}</style>

      {/* SVG Clip Path for fully rounded curved organic capsule shape */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id="hex-rounded" clipPathUnits="objectBoundingBox">
            <path d="M 0.08 0 L 0.92 0 C 0.97 0, 1.0 0.35, 1.0 0.5 C 1.0 0.65, 0.97 1, 0.92 1 L 0.08 1 C 0.03 1, 0 0.65, 0 0.5 C 0 0.35, 0.03 0, 0.08 0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Dynamic Rotating Background from Media Slideshow (when enabled) */}
      {rotateBackgroundEnabled && activeMediaItems.length > 0 && activeMediaItems[bgMediaIndex] && (
        <div className="absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out pointer-events-none">
          {activeMediaItems[bgMediaIndex].type === 'video' ? (
            <video 
              key={activeMediaItems[bgMediaIndex].id}
              src={activeMediaItems[bgMediaIndex].url}
              className="w-full h-full object-cover"
              autoPlay loop muted playsInline
            />
          ) : (
            <img 
              key={activeMediaItems[bgMediaIndex].id}
              src={activeMediaItems[bgMediaIndex].url}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              alt="bg media"
            />
          )}
          {/* Soft dark gradient mask over rotating image to ensure text legibility */}
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}

      {/* Background Decorative Art Deco Elements for Premium Luxury Look */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      {/* Outer borders */}
      <div className="absolute inset-4 pointer-events-none border border-double border-[#D4AF37]/10 rounded-sm"></div>

      {/* HEADER SECTION */}
      <div id="tv-header" className="flex flex-col sm:flex-row justify-between items-center border-b border-[#D4AF37]/30 pb-1 mb-1 relative z-10 gap-2 shrink-0">
        
        {/* Dynamic Display Mode Badges (Non-obtrusive but informative branding) */}
        <div className="hidden lg:flex flex-1 justify-start">
          <div className="flex items-center gap-2 px-3 py-1 bg-black/40 rounded-full border border-[#D4AF37]/15 text-[10px] tracking-widest text-[#D4AF37] font-mono uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping"></span>
            <span>{mode} view</span>
            <span className="text-zinc-500">|</span>
            <span>{theme.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Center Logo */}
        <div className="flex flex-1 justify-center items-center">
          <img 
            src="/logo.png" 
            alt="Devi Jewellers Logo" 
            className="h-16 md:h-20 lg:h-24 max-w-[400px] object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
            onError={(e) => {
              if (e.currentTarget.src.includes('.png')) {
                e.currentTarget.src = '/logo.jpg';
              } else if (e.currentTarget.src.includes('.jpg')) {
                e.currentTarget.src = '/logo.jpeg';
              } else {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }
            }}
          />
          <div className="hidden flex items-center justify-center gap-3 px-6 py-3 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-[#D4AF37] light-sparkle" />
            <h1 className="text-xl md:text-2xl font-serif font-black tracking-[0.25em] gold-gradient uppercase whitespace-nowrap">
              {companyConfig?.companyName || 'DEVI JEWELLERS'}
            </h1>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4 text-right">
          <div className="bg-black/30 border border-zinc-800/80 px-4 py-1.5 rounded-md flex items-center gap-3">
            <div className="text-left">
              <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Showroom Date</p>
              <p className="text-xs font-semibold text-[#F1ECE4]">{date || '9 Jun 2026'}</p>
            </div>
            <span className="w-px h-6 bg-zinc-800"></span>
            <div>
              <p className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase flex items-center gap-1">
                <Clock className="w-3 h-3 animate-spin-slow text-[#D4AF37]" /> Live Time
              </p>
              <p className="text-sm font-mono font-bold text-[#F8F5EE] tracking-wider">{time || '04:00:00 PM'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* EMERGENCY ANNOUNCEMENT BANNER */}
      {showAnnouncement && announcementText && (
        <div id="tv-announcement" className="w-full mb-4 bg-[#D4AF37]/10 border-y border-[#D4AF37] py-2 px-4 flex items-center gap-3 animate-pulse relative z-10">
          <span className="bg-[#D4AF37] text-black font-extrabold text-[10px] px-2 py-0.5 rounded tracking-widest uppercase">
            ANNOUNCEMENT
          </span>
          <p className="text-xs md:text-sm text-[#F8F5EE] font-serif tracking-wide italic">
            "{announcementText}"
          </p>
        </div>
      )}

      {/* SWITCHABLE BODY CORE: MAIN RATES GRID OR ACTIVE MEDIA SLIDESHOW */}
      {currentSignageMode === 'rates' || activeMediaItems.length === 0 ? (
        <>
          {/* MAIN RATE CARDS GRID (SPLIT BY METAL GROUPS INTO SIDE-BY-SIDE VERTICAL COLUMNS) */}
          <div className={`flex-1 grid gap-2 md:gap-4 my-1 ${isPortrait ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
            {/* GOLD RATES COLUMN */}
            {goldRateItems.length > 0 && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 px-1 mb-1">
                  <span className="h-0.5 w-8 bg-[#D4AF37]"></span>
                  <span className="text-[25px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">Gold Rates <span className="text-[25px] normal-case opacity-80 font-semibold">Per 10Gms</span></span>
                </div>
                <div 
                  id="tv-gold-rate-grid" 
                  className="flex-1 flex flex-col gap-3 justify-start"
                >
                  {goldRateItems.map((item) => {
                    const isFlashing = flashingFields[item.key];
                    let flashClass = '';
                    if (isFlashing === 'up') flashClass = 'flash-up-anim';
                    else if (isFlashing === 'down') flashClass = 'flash-down-anim';

                    return (
                      <div key={item.key} className="relative w-full px-0 md:px-2 py-0 my-1 transition-all duration-500 group">
                        {/* Horizontal Connecting Line behind */}
                        <div className={`absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 opacity-50 ${bgAccentLine} z-0 rounded-full`} />
                        
                        {/* Rate Box Shape Container */}
                        <div className="relative w-full filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                          
                          {/* Border Layer (Gold/Accent) */}
                          <div className={`clip-hexagon absolute inset-0 ${bgAccentLine} flex items-center justify-center`}>
                             {/* Extra glow layer for top edge visual */}
                             <div className="absolute top-0 left-0 right-0 h-[2px] bg-white opacity-40" />
                          </div>
                          
                          {/* Inner Fill Layer */}
                          <div className={`clip-hexagon absolute inset-[1.5px] md:inset-[2px] z-0 overflow-hidden ${themeCard.split(' ')[0]}`}>
                            {/* Inner Shine Center Glow */}
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.12)_0%,transparent_70%)] pointer-events-none" />
                            {/* Animated Sweep */}
                            <div className="absolute inset-0 shine-effect opacity-30 mix-blend-screen" />
                            {flashClass && <div className={`absolute inset-0 ${flashClass}`} />}
                          </div>

                          {/* Content Layer */}
                          <div className="relative z-10 px-6 md:px-12 py-2 md:py-2.5 flex flex-col items-center justify-center text-center">
                            {/* Gold luxury sparkle top-right */}
                            {(item.key === 'gold24k' || item.key === 'gold22k') && (
                              <div className="absolute top-4 left-6 md:left-10 pointer-events-none opacity-50">
                                <Sparkles className="w-4 h-4 text-[#F4D03F]" />
                              </div>
                            )}

                            {/* Live indicator removed as requested */}

                            <div className="mb-0 mt-1">
                              <h3 
                                className="font-mono font-bold uppercase tracking-widest text-[#D4AF37]"
                                style={{ fontSize: labelFontSize ? `${labelFontSize}px` : '12px' }}
                              >
                                {item.label}
                              </h3>
                            </div>

                            {/* HUGE Rate Typography */}
                            <div className="my-0.5 flex justify-center items-stretch w-full gap-4 sm:gap-6 lg:gap-8 min-h-0 shrink">
                              <div className="flex flex-col items-center justify-center">
                                <span className="text-[20px] md:text-[25px] text-[#FFD700] font-sans mb-1 uppercase font-black tracking-[0.2em] border-b border-[#FFD700]/30 pb-1">SALE RATE</span>
                                <span 
                                  className="text-2xl md:text-3xl lg:text-4xl font-serif font-black tracking-tight leading-none gold-gradient"
                                  style={{ fontSize: goldFontSize ? `${Math.max(20, goldFontSize * 0.8)}px` : undefined }}
                                >
                                  {formatPrice(item.value, false)}
                                </span>
                              </div>
                              <div className="w-[3px] rounded-full bg-[#000000]"></div>
                              <div className="flex flex-col items-center justify-center">
                                <span className="text-[20px] md:text-[25px] text-[#E2E8F0] font-sans mb-1 uppercase font-black tracking-[0.2em] border-b border-zinc-400/30 pb-1">PURCHASE RATE</span>
                                <span 
                                  className="text-2xl md:text-3xl lg:text-4xl font-serif font-black tracking-tight leading-none text-zinc-300"
                                  style={{ fontSize: goldFontSize ? `${Math.max(20, goldFontSize * 0.8)}px` : undefined }}
                                >
                                  {formatPrice(item.purchaseValue || (item.value - 200), false)}
                                </span>
                              </div>
                            </div>

                            {/* Bottom detail row removed as requested */}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SILVER & OTHER METALS COLUMN */}
            {silverRateItems.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 px-1 mb-1">
                  <span className="h-0.5 w-8 bg-zinc-400"></span>
                  <span className="text-[25px] font-mono tracking-widest text-zinc-400 uppercase font-bold">Silver & Other Metals <span className="text-[25px] normal-case opacity-80 font-semibold">Per 1Kg</span></span>
                </div>
                <div 
                  id="tv-silver-rate-grid" 
                  className="flex-1 flex flex-col gap-3 justify-start"
                >
                  {silverRateItems.map((item) => {
                    const isSilver = item.key === 'silver';
                    const isFlashing = flashingFields[item.key];
                    let flashClass = '';
                    if (isFlashing === 'up') flashClass = 'flash-up-anim';
                    else if (isFlashing === 'down') flashClass = 'flash-down-anim';

                    return (
                      <div key={item.key} className="relative w-full px-0 md:px-2 py-0 my-1 transition-all duration-500 group">
                        {/* Horizontal Connecting Line behind */}
                        <div className={`absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 opacity-50 z-0 rounded-full ${item.key === 'silver' ? 'bg-zinc-400' : bgAccentLine}`} />
                        
                        {/* Rate Box Shape Container */}
                        <div className="relative w-full filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                          
                          {/* Border Layer (Silver/Accent) */}
                          <div className={`clip-hexagon absolute inset-0 flex items-center justify-center ${item.key === 'silver' ? 'bg-zinc-400' : bgAccentLine}`}>
                             {/* Extra glow layer for top edge visual */}
                             <div className="absolute top-0 left-0 right-0 h-[2px] bg-white opacity-50" />
                          </div>
                          
                          {/* Inner Fill Layer */}
                          <div className={`clip-hexagon absolute inset-[1.5px] md:inset-[2px] z-0 overflow-hidden ${themeCard.split(' ')[0]}`}>
                            {/* Inner Shine Center Glow */}
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.12)_0%,transparent_70%)] pointer-events-none" />
                            {/* Animated Sweep */}
                            <div className="absolute inset-0 shine-effect opacity-30 mix-blend-screen" />
                            {flashClass && <div className={`absolute inset-0 ${flashClass}`} />}
                          </div>

                          {/* Content Layer */}
                          <div className="relative z-10 px-6 md:px-12 py-2 md:py-2.5 flex flex-col items-center justify-center text-center">
                            {/* Live indicator removed as requested */}

                            <div className="mb-0 mt-1">
                              <h3 
                                className={`font-mono font-bold uppercase tracking-widest ${item.key === 'silver' ? 'text-zinc-300' : 'text-[#E5E4E2]'}`}
                                style={{ fontSize: labelFontSize ? `${labelFontSize}px` : '12px' }}
                              >
                                {item.label}
                              </h3>
                            </div>

                            {/* HUGE Rate Typography */}
                            <div className="my-0.5 flex justify-center items-stretch w-full gap-4 sm:gap-6 lg:gap-8 min-h-0 shrink">
                              <div className="flex flex-col items-center justify-center">
                                <span className="text-[20px] md:text-[25px] text-[#E5E4E2] font-sans mb-1 uppercase font-black tracking-[0.2em] border-b border-[#E5E4E2]/30 pb-1">SALE RATE</span>
                                <span 
                                  className={`text-2xl md:text-3xl lg:text-4xl font-serif font-black tracking-tight leading-none ${
                                    item.key === 'silver' 
                                      ? 'text-zinc-100' 
                                      : 'text-[#E5E4E2]'
                                  }`}
                                  style={{ fontSize: silverFontSize ? `${Math.max(20, silverFontSize * 0.8)}px` : undefined }}
                                >
                                  {formatPrice(item.value, isSilver)}
                                </span>
                              </div>
                              <div className="w-[3px] rounded-full bg-[#000000]"></div>
                              <div className="flex flex-col items-center justify-center">
                                <span className="text-[20px] md:text-[25px] text-[#E2E8F0] font-sans mb-1 uppercase font-black tracking-[0.2em] border-b border-zinc-400/30 pb-1">PURCHASE RATE</span>
                                <span 
                                  className="text-2xl md:text-3xl lg:text-4xl font-serif font-black tracking-tight leading-none text-zinc-400"
                                  style={{ fontSize: silverFontSize ? `${Math.max(20, silverFontSize * 0.8)}px` : undefined }}
                                >
                                  {formatPrice(item.purchaseValue || (item.value - 2), isSilver)}
                                </span>
                              </div>
                            </div>


                            {/* Bottom detail row removed as requested */}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* PROMOTIONAL POPUP BLOCK (FESTIVAL/PREMIUM MODES) */}
          {(mode === 'premium' || mode === 'festival') && activePromo && (
            <div id="tv-promo-board" className="mb-4 bg-gradient-to-r from-black/80 via-[#15161A]/95 to-black/85 rounded border border-[#D4AF37]/35 p-3 flex flex-col md:flex-row items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded flex items-center justify-center">
                  <Gift className="w-5 h-5 text-[#F4D03F]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-semibold text-[#F4D03F] tracking-wide">
                      {activePromo.title}
                    </span>
                    <span className="text-[10px] bg-[#D4AF37] text-black font-extrabold px-1.5 py-0.5 rounded uppercase">
                      CODE: {activePromo.code}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 mt-0.5 max-w-xl font-light">
                    {activePromo.description}
                  </p>
                </div>
              </div>
              <div className="text-[10px] text-[#D4AF37] font-mono border border-[#D4AF37]/20 px-2.5 py-1 rounded bg-[#D4AF37]/5 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#D4AF37]" /> valid till {new Date(activePromo.endDate).toLocaleDateString()}
              </div>
            </div>
          )}
        </>
      ) : (
        /* PREMIUM LUXURY MEDIA SIGNAGE SLIDESHOW PLAYGROUND (FULL COVERAGE) */
        <div 
          id="tv-media-slideshow" 
          className="absolute inset-0 w-full h-full bg-black z-50 flex flex-col overflow-hidden m-0 p-0 border-none transition-all duration-700"
        >
          {(() => {
            const currentItem = activeMediaItems[activeMediaIndex];
            if (!currentItem) return null;
            return (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-zinc-950">
                {currentItem.type === 'video' ? (
                  <video 
                    key={currentItem.id}
                    src={currentItem.url}
                    className="w-full h-full object-cover bg-black"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img 
                    key={currentItem.id}
                    src={currentItem.url}
                    alt={currentItem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-all"
                  />
                )}
                
                {/* Floating soft shade gradient overlay mask */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/60 pointer-events-none" />

                {/* Slideshow Luxury Bottom Titles and Meta */}
                <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 z-10 pointer-events-none">
                  <div className="max-w-2xl">
                    <h2 className="text-2xl md:text-3xl font-serif font-black tracking-normal text-white uppercase leading-tight">
                      {currentItem.title}
                    </h2>
                    <p className="text-[11px] text-[#D4AF37] font-mono tracking-widest leading-relaxed mt-1 uppercase font-bold">
                      ✦ Certified Fine Jewelry Exhibition & Swarna Collections ✦
                    </p>
                  </div>

                  {/* Active Indicator Dots */}
                  <div className="flex items-center gap-1.5 bg-black/60 px-3 py-2 rounded-full border border-zinc-800 backdrop-blur-md self-end md:self-auto">
                    {activeMediaItems.map((indicator, idx) => (
                      <div
                        key={indicator.id}
                        className={`transition-all rounded-full ${
                          idx === activeMediaIndex 
                            ? 'w-6 h-1.5 bg-[#D4AF37]' 
                            : 'w-1.5 h-1.5 bg-zinc-650'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}



      {/* FOOTER METADATA ZONE */}
      <div id="tv-footer" className="mt-1 flex flex-col sm:flex-row justify-between items-center text-[9px] md:text-[10px] text-zinc-500 font-mono border-t border-[#D4AF37]/30 pt-1 gap-1">
        <div className="flex items-center gap-3">
          <span>🛡️ Government Approved Hallmark</span>
          <span className="text-zinc-700">•</span>
          <span>💎 Certified Diamonds</span>
          <span className="text-zinc-700">•</span>
          <span>🔄 100% Exchange Guarantee</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <PhoneCall className="w-3 h-3 text-[#D4AF37]" />
          <span>Support Desk: {companyConfig?.contactNumber || '+91 99999 88888'}</span>
        </div>
      </div>
    </div>
  );
}
