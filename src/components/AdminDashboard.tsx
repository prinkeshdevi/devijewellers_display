/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  JewelleryRates, 
  ConnectedDisplay, 
  Branch, 
  PromoItem, 
  AuditLog, 
  DisplaySetting,
  DisplayMode,
  DisplayTheme,
  SystemConfig
} from '../types';
import { 
  Tv, 
  MapPin, 
  Gift, 
  Activity, 
  Calendar, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight,
  Database,
  Search,
  Palette,
  Save,
  RefreshCw,
  Sliders,
  CheckCircle,
  HelpCircle,
  Play
} from 'lucide-react';

interface AdminDashboardProps {
  rates: JewelleryRates;
  displays: ConnectedDisplay[];
  branches: Branch[];
  promos: PromoItem[];
  logs: AuditLog[];
  displaySetting: DisplaySetting;
  systemConfig: SystemConfig;
  onNavigate: (tab: string) => void;
  onUpdateDisplaySetting: (newSetting: Partial<DisplaySetting>) => void;
  onUpdateSystemConfig: (config: SystemConfig) => void;
  onTriggerLog: (action: string, details: string) => void;
}

export default function AdminDashboard({
  rates,
  displays,
  branches,
  promos,
  logs,
  displaySetting,
  systemConfig,
  onNavigate,
  onUpdateDisplaySetting,
  onUpdateSystemConfig,
  onTriggerLog
}: AdminDashboardProps) {

  // Local state for configuration inputs before saving
  const [mode, setMode] = useState<DisplayMode>(displaySetting.mode || 'standard');
  const [theme, setTheme] = useState<DisplayTheme>(displaySetting.theme || 'midnight_gold');
  const [tickerText, setTickerText] = useState<string>(displaySetting.tickerText || '');
  const [announcementText, setAnnouncementText] = useState<string>(displaySetting.announcementText || '');
  const [showAnnouncement, setShowAnnouncement] = useState<boolean>(displaySetting.showAnnouncement || false);
  const [refreshInterval, setRefreshInterval] = useState<number>(displaySetting.refreshInterval || 15);
  const [ratesDisplayDuration, setRatesDisplayDuration] = useState<number>(displaySetting.ratesDisplayDuration || 12);
  const [slideshowDisplayDuration, setSlideshowDisplayDuration] = useState<number>(displaySetting.slideshowDisplayDuration || 8);
  const [rateFontSize, setRateFontSize] = useState<number>(displaySetting.rateFontSize || 28);
  const [purchaseRateFontSize, setPurchaseRateFontSize] = useState<number>(displaySetting.purchaseRateFontSize || 28);
  const [goldFontSize, setGoldFontSize] = useState<number>(displaySetting.goldFontSize || displaySetting.rateFontSize || 28);
  const [silverFontSize, setSilverFontSize] = useState<number>(displaySetting.silverFontSize || displaySetting.rateFontSize || 28);
  const [labelFontSize, setLabelFontSize] = useState<number>(displaySetting.labelFontSize || 12);
  const [subLabelFontSize, setSubLabelFontSize] = useState<number>(displaySetting.subLabelFontSize || 10);
  const [saleTitleFontSize, setSaleTitleFontSize] = useState<number>(displaySetting.saleTitleFontSize || displaySetting.subLabelFontSize || 10);
  const [purchaseTitleFontSize, setPurchaseTitleFontSize] = useState<number>(displaySetting.purchaseTitleFontSize || displaySetting.subLabelFontSize || 10);
  const [mediaLoopEnabled, setMediaLoopEnabled] = useState<boolean>(displaySetting.mediaLoopEnabled !== false);
  const [rotateBackgroundEnabled, setRotateBackgroundEnabled] = useState<boolean>(displaySetting.rotateBackgroundEnabled || false);
  const [visibleRates, setVisibleRates] = useState<string[]>(
    displaySetting.visibleRates || ['gold24k', 'gold22k', 'gold20k', 'gold18k', 'silver', 'platinum']
  );
  
  // Local state for Color Customizations
  const [customPrimaryBg, setCustomPrimaryBg] = useState<string>(displaySetting.customPrimaryBg || '#0B0B0D');
  const [customSecondaryBg, setCustomSecondaryBg] = useState<string>(displaySetting.customSecondaryBg || '#15161A');
  const [customCardBg, setCustomCardBg] = useState<string>(displaySetting.customCardBg || '#161619');
  const [customGoldColor, setCustomGoldColor] = useState<string>(displaySetting.customGoldColor || '#D4AF37');

  // System Config states
  const [company, setCompany] = useState<string>(systemConfig?.companyName || '');
  const [contact, setContact] = useState<string>(systemConfig?.contactNumber || '');
  const [speed, setSpeed] = useState<number>(systemConfig?.tickerSpeed || 50);
  const [goldUrl, setGoldUrl] = useState<string>(systemConfig?.rateApiUrl || '');
  const [whatsapp, setWhatsapp] = useState<boolean>(systemConfig?.whatsappAlerts || false);
  const [email, setEmail] = useState<boolean>(systemConfig?.emailAlerts || false);
  const [logoImageBase64, setLogoImageBase64] = useState<string>(systemConfig?.logoImageBase64 || '');

  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Sync state if global settings are updated elsewhere
  useEffect(() => {
    setMode(displaySetting.mode || 'standard');
    setTheme(displaySetting.theme || 'midnight_gold');
    setTickerText(displaySetting.tickerText || '');
    setAnnouncementText(displaySetting.announcementText || '');
    setShowAnnouncement(displaySetting.showAnnouncement || false);
    setRefreshInterval(displaySetting.refreshInterval || 15);
    setRatesDisplayDuration(displaySetting.ratesDisplayDuration || 12);
    setSlideshowDisplayDuration(displaySetting.slideshowDisplayDuration || 8);
    setRateFontSize(displaySetting.rateFontSize || 28);
    setPurchaseRateFontSize(displaySetting.purchaseRateFontSize || 28);
    setGoldFontSize(displaySetting.goldFontSize || displaySetting.rateFontSize || 28);
    setSilverFontSize(displaySetting.silverFontSize || displaySetting.rateFontSize || 28);
    setLabelFontSize(displaySetting.labelFontSize || 12);
    setSubLabelFontSize(displaySetting.subLabelFontSize || 10);
    setSaleTitleFontSize(displaySetting.saleTitleFontSize || displaySetting.subLabelFontSize || 10);
    setPurchaseTitleFontSize(displaySetting.purchaseTitleFontSize || displaySetting.subLabelFontSize || 10);
    setMediaLoopEnabled(displaySetting.mediaLoopEnabled !== false);
    setRotateBackgroundEnabled(displaySetting.rotateBackgroundEnabled || false);
    setVisibleRates(displaySetting.visibleRates || ['gold24k', 'gold22k', 'gold20k', 'gold18k', 'silver', 'platinum']);
    setCustomPrimaryBg(displaySetting.customPrimaryBg || '#0B0B0D');
    setCustomSecondaryBg(displaySetting.customSecondaryBg || '#15161A');
    setCustomCardBg(displaySetting.customCardBg || '#161619');
    setCustomGoldColor(displaySetting.customGoldColor || '#D4AF37');
  }, [displaySetting]);

  useEffect(() => {
    if (systemConfig) {
      setCompany(systemConfig.companyName || '');
      setContact(systemConfig.contactNumber || '');
      setSpeed(systemConfig.tickerSpeed || 50);
      setGoldUrl(systemConfig.rateApiUrl || '');
      setWhatsapp(systemConfig.whatsappAlerts || false);
      setEmail(systemConfig.emailAlerts || false);
      setLogoImageBase64(systemConfig.logoImageBase64 || '');
    }
  }, [systemConfig]);

  const formatPrice = (val: number, isSilver = false) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.abs(val || 0));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const maxSize = 400;

            if (width > height) {
              if (width > maxSize) {
                height = Math.round(height * (maxSize / width));
                width = maxSize;
              }
            } else {
              if (height > maxSize) {
                width = Math.round(width * (maxSize / height));
                height = maxSize;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const dataUrl = canvas.toDataURL('image/png', 0.8);
              setLogoImageBase64(dataUrl);
            } else {
               setLogoImageBase64(event.target.result as string);
            }
          };
          img.src = event.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAllSettings = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedSystemConfig: SystemConfig = {
      companyName: company.trim().toUpperCase(),
      logoText: company.split(' ')[0] || 'DEVIJEWELLERS',
      logoImageBase64: logoImageBase64,
      contactNumber: contact.trim(),
      tickerSpeed: speed,
      rateApiUrl: goldUrl.trim(),
      whatsappAlerts: whatsapp,
      emailAlerts: email
    };

    onUpdateSystemConfig(updatedSystemConfig);

    // Call state saver callback
    onUpdateDisplaySetting({
      mode,
      theme,
      tickerText,
      announcementText,
      showAnnouncement,
      refreshInterval,
      ratesDisplayDuration,
      slideshowDisplayDuration,
      rateFontSize,
      purchaseRateFontSize,
      goldFontSize,
      silverFontSize,
      labelFontSize,
      subLabelFontSize,
      saleTitleFontSize,
      purchaseTitleFontSize,
      customPrimaryBg,
      customSecondaryBg,
      customCardBg,
      customGoldColor,
      visibleRates,
      mediaLoopEnabled,
      rotateBackgroundEnabled
    });

    // Write audit log trail
    onTriggerLog(
      'System & Aesthetics Preferences Updated',
      `Modified Global configuration, company data, and TV node parameters broadcasted successfully.`
    );

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      window.location.reload();
    }, 1500);
  };

  const handleResetToPresetTheme = (preset: DisplayTheme) => {
    setTheme(preset);
    if (preset === 'midnight_gold') {
      setCustomPrimaryBg('#0B0B0D');
      setCustomSecondaryBg('#15161A');
      setCustomCardBg('#161619');
      setCustomGoldColor('#D4AF37');
    } else if (preset === 'royal_emerald') {
      setCustomPrimaryBg('#041510');
      setCustomSecondaryBg('#06241C');
      setCustomCardBg('#0A2F25');
      setCustomGoldColor('#F4D03F');
    } else if (preset === 'festival') {
      setCustomPrimaryBg('#1E090F');
      setCustomSecondaryBg('#2B0E17');
      setCustomCardBg('#38121E');
      setCustomGoldColor('#F59E0B');
    } else if (preset === 'rose_gold_velvet') {
      setCustomPrimaryBg('#1C101A');
      setCustomSecondaryBg('#2B1425');
      setCustomCardBg('#35192E');
      setCustomGoldColor('#E0A899');
    } else if (preset === 'ocean_platinum') {
      setCustomPrimaryBg('#0B141E');
      setCustomSecondaryBg('#0F2030');
      setCustomCardBg('#142A3D');
      setCustomGoldColor('#E5E7EB');
    } else if (preset === 'sunset_amber') {
      setCustomPrimaryBg('#1B0F05');
      setCustomSecondaryBg('#2B190B');
      setCustomCardBg('#38200E');
      setCustomGoldColor('#F59E0B');
    }
  };

  const onlineDisplaysCount = displays.filter(d => d.online).length;
  const activePromoCount = promos.filter(p => p.active).length;

  return (
    <div id="admin-dashboard-root" className="flex flex-col gap-6 text-[#F1ECE4]">
      
      {/* HEADER WITH CONCISE SYSTEM STATE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#15161A] via-[#1a1b21] to-[#111216] p-5 rounded-md border border-[#D4AF37]/30 shadow-lg shadow-black/40">
        <div>
          <h2 className="text-lg md:text-xl font-serif font-black gold-gradient flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" /> OPERATIONAL COMMAND CENTER
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time branch synchronization, live rate ticker configurations, and digital TV signage nodes status.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-black/50 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/20">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#D4AF37] font-bold">
            System Live: Sync Active
          </span>
        </div>
      </div>

      {/* CORE OVERVIEW METRICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="dashboard-metric-cards">
        
        {/* Metric 1 */}
        <div 
          onClick={() => onNavigate('branch_manager')}
          className="p-4 rounded-md bg-[#15161A] border border-[#D4AF37]/25 flex flex-col justify-between hover:border-[#D4AF37]/80 hover:bg-[#D4AF37]/5 cursor-pointer transition-all shadow-sm"
        >
          <div className="flex justify-between items-start text-zinc-500 mb-2">
            <span className="text-[10px] font-mono tracking-wider uppercase text-[#D4AF37]/80">Showrooms</span>
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-lg font-bold font-mono text-white">{branches.length}</p>
            <p className="text-[9px] text-[#D4AF37] mt-1 font-mono uppercase tracking-widest font-bold">Manage Branches →</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={() => onNavigate('display_manager')}
          className="p-4 rounded-md bg-[#15161A] border border-[#D4AF37]/25 flex flex-col justify-between hover:border-[#D4AF37]/80 hover:bg-[#D4AF37]/5 cursor-pointer transition-all shadow-sm"
        >
          <div className="flex justify-between items-start text-zinc-500 mb-2">
            <span className="text-[10px] font-mono tracking-wider uppercase text-[#D4AF37]/80">TV Nodes</span>
            <Tv className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-lg font-bold font-mono text-white">{onlineDisplaysCount} / {displays.length}</p>
            <p className="text-[9px] text-zinc-500 mt-1 font-mono">Displays online</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-md bg-[#15161A] border border-[#D4AF37]/25 flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all">
          <div className="flex justify-between items-start text-zinc-500 mb-2">
            <span className="text-[10px] font-mono tracking-wider uppercase text-[#D4AF37]/80">Active Promos</span>
            <Gift className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <p className="text-lg font-bold font-mono text-white">{activePromoCount}</p>
            <p className="text-[9px] text-zinc-500 mt-1 font-mono">Running campaigns live</p>
          </div>
        </div>

        {/* Metric 6 */}
        <div className="p-4 rounded-md bg-[#15161A] border border-[#D4AF37]/25 flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all">
          <div className="flex justify-between items-start text-zinc-500 mb-2">
            <span className="text-[10px] font-mono tracking-wider uppercase text-[#D4AF37]/80">System Health</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-lg font-bold font-mono text-emerald-450">EXCELLENT</p>
            <p className="text-[9px] text-zinc-500 mt-1 font-mono">Latency &lt; 80ms • 100% OK</p>
          </div>
        </div>

      </div>

      {/* CORE FEATURE: LUXURY AESTHETICS & TIMING CONFIGURATION WITH LIVE TV PREVIEW */}
      <form onSubmit={handleSaveAllSettings} className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="digital-aesthetic-configurator">
        
        {/* Left Side (7 Cols): Customizer Controls */}
        <div className="xl:col-span-7 rounded-md bg-[#15161A] border border-[#D4AF37]/20 p-5 flex flex-col gap-6">
          
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <h3 className="font-serif text-sm font-semibold text-[#D4AF37] flex items-center gap-2">
              <Palette className="w-4 h-4" /> Signage & Brand Visual Customizer
            </h3>
            <span className="text-[9px] font-mono bg-zinc-805 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded">
              Active Control Deck
            </span>
          </div>

          {saveSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500 text-emerald-400 text-xs font-semibold rounded flex items-center gap-2.5 animate-pulse">
              <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>All TV Displays updated successfully! Branding and timing parameters broadcasted via Secure TLS.</span>
            </div>
          )}

          {/* Sub-section 0: Showroom Branded Aesthetics */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] font-semibold flex items-center gap-2 border-b border-zinc-805/50 pb-1.5">
              <span>Showroom Branded Aesthetics</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Company Atelier Name (All Caps)</label>
                <input 
                  type="text" 
                  value={company ?? ''}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-[#0B0B0D] border border-zinc-800 focus:border-[#D4AF37] rounded p-2.5 text-xs font-serif font-bold text-[#F8F5EE] focus:outline-none tracking-wide"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Atelier Desk Helpline Number</label>
                <input 
                  type="text" 
                  value={contact ?? ''}
                  onChange={(e) => setContact(e.target.value)}
                  className="bg-[#0B0B0D] border border-zinc-800 focus:border-[#D4AF37] rounded p-2.5 text-xs font-mono text-[#F8F5EE] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Showroom Brand Logo (For App & Posters)</label>
              <div className="flex items-center gap-4 mt-1">
                 {logoImageBase64 ? (
                    <img src={logoImageBase64} alt="Brand Logo" className="h-10 w-auto object-contain bg-black/40 border border-zinc-700 rounded p-1"/>
                 ) : (
                    <div className="h-10 w-24 border border-dashed border-zinc-600 rounded bg-black/30 flex items-center justify-center text-[10px] text-zinc-500 font-mono">NO LOGO</div>
                 )}
                 <label className="bg-[#15161A] border border-zinc-700 hover:border-[#D4AF37] text-zinc-300 font-mono text-[10px] py-2 px-3 rounded cursor-pointer transition-colors">
                    UPLOAD / CAPTURE LOGO
                    <input type="file" className="hidden" accept="image/*" capture="environment" onChange={handleLogoUpload} />
                 </label>
                 {logoImageBase64 && (
                   <button type="button" onClick={() => setLogoImageBase64('')} className="text-red-400 hover:text-red-300 text-[10px] font-mono tracking-widest border border-red-900/30 px-2 py-1 rounded bg-red-900/10">REMOVE</button>
                 )}
              </div>
            </div>
          </div>

          {/* Sub-section 1: Display Configuration */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] font-semibold flex items-center gap-2 border-b border-zinc-805/50 pb-1.5">
              <span>Display Configuration</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  Orientation & Display Mode
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as DisplayMode)}
                  className="bg-[#0B0B0D] border border-zinc-800 focus:border-[#D4AF37] rounded p-2.5 text-xs font-sans text-white focus:outline-none cursor-pointer"
                >
                  <option value="standard">Standard Landscape Signage</option>
                  <option value="premium">Premium Showcase Window</option>
                  <option value="festival">Festival Campaign Highlights</option>
                  <option value="portrait">9:16 Portrait Floor Totem</option>
                  <option value="landscape">Double-wide Ribbon LED</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  Active Seasonal Theme Base Preset
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {(['midnight_gold', 'royal_emerald', 'festival', 'rose_gold_velvet', 'ocean_platinum', 'sunset_amber'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleResetToPresetTheme(t)}
                      className={`text-[9.5px] font-mono py-2 px-1 rounded-sm border uppercase font-bold transition-all ${
                        theme === t 
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white' 
                          : 'border-zinc-800 bg-[#0B0B0D]/50 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/40'
                      }`}
                    >
                      {t.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 flex justify-between">
                <span>Showroom Ticker Announcement Banner</span>
                <span className="text-zinc-500 font-normal">Displayed at the footer of TV display</span>
              </label>
              <textarea
                value={tickerText}
                onChange={(e) => setTickerText(e.target.value)}
                rows={2}
                className="bg-[#0B0B0D] border border-zinc-800 focus:border-[#D4AF37] rounded p-2.5 text-xs font-sans text-[#F8F5EE] focus:outline-none resize-none leading-relaxed"
                placeholder="Enter customized ticker announcement..."
              />
            </div>

            {/* Announcement Box Controls */}
            <div className="p-3 bg-[#0B0B0D] border border-zinc-800/80 rounded flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-serif font-bold text-white">Broadcast Core Announcement Notification Alert</p>
                  <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">Flashing overlay on displays screen</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAnnouncement(!showAnnouncement)}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 cursor-pointer ${
                    showAnnouncement ? 'bg-[#D4AF37]' : 'bg-zinc-800'
                  }`}
                >
                  <span className={`w-4 h-4 bg-black rounded-full transition-transform ${showAnnouncement ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {showAnnouncement && (
                <div className="flex flex-col gap-1.5 border-t border-zinc-800/60 pt-2 bg-black/20 p-2 rounded">
                  <label className="text-[9px] font-mono uppercase text-[#D4AF37] tracking-wider">Flashing Announcement Alert Message</label>
                  <input
                    type="text"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    className="bg-[#0B0B0D] border border-zinc-800 focus:border-[#D4AF37] rounded p-2 text-xs font-sans text-white focus:outline-none"
                    placeholder="e.g. Dhanteras Booking Open! Flat 10% OFF Making Charges."
                  />
                </div>
              )}
            </div>

          </div>

          {/* Sub-section 2: Color Customization */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] font-semibold flex items-center gap-2 border-b border-zinc-805/50 pb-1.5">
              <span>Color Customization Palette</span>
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#0B0B0D] p-3 rounded border border-zinc-805/50">
              
              {/* Primary BG Selection */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-mono uppercase text-zinc-400">Canvas Base</span>
                <div className="flex items-center gap-1">
                  <input
                    type="color"
                    value={customPrimaryBg}
                    onChange={(e) => setCustomPrimaryBg(e.target.value)}
                    className="w-7 h-7 bg-transparent border-0 rounded cursor-pointer flex-shrink-0"
                  />
                  <input
                    type="text"
                    value={customPrimaryBg}
                    onChange={(e) => setCustomPrimaryBg(e.target.value)}
                    className="bg-black border border-zinc-800 rounded p-1 text-[10px] font-mono text-zinc-300 focus:outline-none uppercase w-full"
                  />
                </div>
              </div>

              {/* Secondary Selection */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-mono uppercase text-zinc-400">Secondary Base</span>
                <div className="flex items-center gap-1">
                  <input
                    type="color"
                    value={customSecondaryBg}
                    onChange={(e) => setCustomSecondaryBg(e.target.value)}
                    className="w-7 h-7 bg-transparent border-0 rounded cursor-pointer flex-shrink-0"
                  />
                  <input
                    type="text"
                    value={customSecondaryBg}
                    onChange={(e) => setCustomSecondaryBg(e.target.value)}
                    className="bg-black border border-zinc-800 rounded p-1 text-[10px] font-mono text-zinc-300 focus:outline-none uppercase w-full"
                  />
                </div>
              </div>

              {/* Card Container BG Selection */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-mono uppercase text-zinc-400">Cards Container</span>
                <div className="flex items-center gap-1">
                  <input
                    type="color"
                    value={customCardBg}
                    onChange={(e) => setCustomCardBg(e.target.value)}
                    className="w-7 h-7 bg-transparent border-0 rounded cursor-pointer flex-shrink-0"
                  />
                  <input
                    type="text"
                    value={customCardBg}
                    onChange={(e) => setCustomCardBg(e.target.value)}
                    className="bg-black border border-zinc-800 rounded p-1 text-[10px] font-mono text-zinc-300 focus:outline-none uppercase w-full"
                  />
                </div>
              </div>

              {/* Luxury Accent Gold Selection */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-mono uppercase text-zinc-400">Luxury Accent Gold</span>
                <div className="flex items-center gap-1">
                  <input
                    type="color"
                    value={customGoldColor}
                    onChange={(e) => setCustomGoldColor(e.target.value)}
                    className="w-7 h-7 bg-transparent border-0 rounded cursor-pointer flex-shrink-0"
                  />
                  <input
                    type="text"
                    value={customGoldColor}
                    onChange={(e) => setCustomGoldColor(e.target.value)}
                    className="bg-black border border-zinc-800 rounded p-1 text-[10px] font-mono text-zinc-300 focus:outline-none uppercase w-full"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Sub-section 3: Timing Configuration */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] font-semibold flex items-center gap-2 border-b border-zinc-805/50 pb-1.5">
              <span>Timing Configuration</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Refresh Interval */}
              <div className="flex flex-col gap-1.5 p-3.5 bg-[#0B0B0D] rounded border border-zinc-800/70">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider">
                  <span className="text-zinc-400">Refresh Interval (seconds)</span>
                  <span className="text-[#D4AF37] font-bold">{refreshInterval} s</span>
                </div>
                <input
                  type="number"
                  min={5}
                  max={300}
                  value={refreshInterval === 0 ? '' : refreshInterval}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value));
                    setRefreshInterval(val);
                  }}
                  className="w-full bg-[#141416] text-white border border-zinc-800/80 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none rounded px-3 py-1.5 text-sm mt-1.5 font-mono"
                  placeholder="e.g. 15"
                />
                <p className="text-[9.5px] text-zinc-500 mt-2 leading-snug">
                  How often to check for rate updates. Dynamic screens scan server API end-nodes on this interval.
                </p>
              </div>

              {/* Rates Display Duration */}
              <div className="flex flex-col gap-1.5 p-3.5 bg-[#0B0B0D] rounded border border-zinc-800/70">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider">
                  <span className="text-zinc-400">Rates Display Duration (seconds)</span>
                  <span className="text-[#D4AF37] font-bold">{ratesDisplayDuration} s</span>
                </div>
                <input
                  type="number"
                  min={1}
                  max={300}
                  value={ratesDisplayDuration === 0 ? '' : ratesDisplayDuration}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value));
                    setRatesDisplayDuration(val);
                  }}
                  className="w-full bg-[#141416] text-white border border-zinc-800/80 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none rounded px-3 py-1.5 text-sm mt-1.5 font-mono"
                  placeholder="e.g. 12"
                />
                <p className="text-[9.5px] text-zinc-500 mt-2 leading-snug">
                  How long to show rates before switching to media. Cycles price cards with active hero promotional slides.
                </p>
              </div>

              {/* Slideshow Display Duration */}
              <div className="flex flex-col gap-1.5 p-3.5 bg-[#0B0B0D] rounded border border-zinc-800/70">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider">
                  <span className="text-zinc-400">Slideshow Slide Duration (seconds)</span>
                  <span className="text-[#D4AF37] font-bold">{slideshowDisplayDuration} s</span>
                </div>
                <input
                  type="number"
                  min={1}
                  max={300}
                  value={slideshowDisplayDuration === 0 ? '' : slideshowDisplayDuration}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value));
                    setSlideshowDisplayDuration(val);
                  }}
                  className="w-full bg-[#141416] text-white border border-zinc-800/80 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none rounded px-3 py-1.5 text-sm mt-1.5 font-mono"
                  placeholder="e.g. 8"
                />
                <p className="text-[9.5px] text-zinc-500 mt-2 leading-snug">
                  How long each media promotional slide or video is displayed before moving to the next or returning to rates.
                </p>
                <div className="mt-3 pt-2.5 border-t border-zinc-900 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-zinc-400">Slideshow Status</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      mediaLoopEnabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {mediaLoopEnabled ? 'ON' : 'OFF'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setMediaLoopEnabled(!mediaLoopEnabled)}
                      className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                        mediaLoopEnabled ? 'bg-[#D4AF37]' : 'bg-zinc-800'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 bg-black rounded-full transition-transform ${mediaLoopEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Rate Numbers Font Size */}
              <div className="flex flex-col gap-1.5 p-3.5 bg-[#0B0B0D] rounded border border-zinc-800/70 md:col-span-1">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider">
                  <span className="text-zinc-400 font-semibold text-[#D4AF37]/90 flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-[#D4AF37]" /> Sale Rate Value Size
                  </span>
                  <span className="text-[#D4AF37] font-bold">{goldFontSize} px</span>
                </div>
                <input
                  type="number"
                  min={12}
                  max={120}
                  value={goldFontSize === 0 ? '' : goldFontSize}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value));
                    setGoldFontSize(val);
                    setSilverFontSize(val);
                  }}
                  className="w-full bg-[#141416] text-white border border-zinc-800/80 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none rounded px-3 py-1.5 text-sm mt-1.5 font-mono"
                  placeholder="e.g. 28"
                />
                <p className="text-[9.5px] text-zinc-500 mt-2 leading-snug">
                  Size of the SALE price figures (e.g. 7,500).
                </p>
              </div>

              {/* Purchase Rate Font Size */}
              <div className="flex flex-col gap-1.5 p-3.5 bg-[#0B0B0D] rounded border border-zinc-800/70 md:col-span-1">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider">
                  <span className="text-zinc-400 font-semibold text-[#D4AF37]/90 flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-[#D4AF37]" /> Purchase Rate Value Size
                  </span>
                  <span className="text-[#D4AF37] font-bold">{purchaseRateFontSize} px</span>
                </div>
                <input
                  type="number"
                  min={12}
                  max={120}
                  value={purchaseRateFontSize === 0 ? '' : purchaseRateFontSize}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value));
                    setPurchaseRateFontSize(val);
                  }}
                  className="w-full bg-[#141416] text-white border border-zinc-800/80 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none rounded px-3 py-1.5 text-sm mt-1.5 font-mono"
                  placeholder="e.g. 28"
                />
                <p className="text-[9.5px] text-zinc-500 mt-2 leading-snug">
                  Size of the PURCHASE price figures (e.g. 7,300).
                </p>
              </div>

              {/* Rate Label Font Size */}
              <div className="flex flex-col gap-1.5 p-3.5 bg-[#0B0B0D] rounded border border-zinc-800/70 md:col-span-1">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider">
                  <span className="text-zinc-400 font-semibold text-[#D4AF37]/90 flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-[#D4AF37]" /> Rate Label Font Size
                  </span>
                  <span className="text-[#D4AF37] font-bold">{labelFontSize} px</span>
                </div>
                <input
                  type="number"
                  min={8}
                  max={48}
                  value={labelFontSize === 0 ? '' : labelFontSize}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value));
                    setLabelFontSize(val);
                  }}
                  className="w-full bg-[#141416] text-white border border-zinc-800/80 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none rounded px-3 py-1.5 text-sm mt-1.5 font-mono"
                  placeholder="e.g. 12"
                />
                <p className="text-[9.5px] text-zinc-500 mt-2 leading-snug">
                  Size of the metal labels (e.g. GOLD 24K).
                </p>
              </div>

              {/* Sale Title Size */}
              <div className="flex flex-col gap-1.5 p-3.5 bg-[#0B0B0D] rounded border border-zinc-800/70 md:col-span-1">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider">
                  <span className="text-zinc-400 font-semibold text-[#D4AF37]/90 flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-[#D4AF37]" /> Sale Title Size
                  </span>
                  <span className="text-[#D4AF37] font-bold">{saleTitleFontSize} px</span>
                </div>
                <input
                  type="number"
                  min={5}
                  max={48}
                  value={saleTitleFontSize === 0 ? '' : saleTitleFontSize}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value));
                    setSaleTitleFontSize(val);
                  }}
                  className="w-full bg-[#141416] text-white border border-zinc-800/80 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none rounded px-3 py-1.5 text-sm mt-1.5 font-mono"
                  placeholder="e.g. 10"
                />
                <p className="text-[9.5px] text-zinc-500 mt-2 leading-snug">
                  Size of the SALE RATE text.
                </p>
              </div>

              {/* Purchase Title Size */}
              <div className="flex flex-col gap-1.5 p-3.5 bg-[#0B0B0D] rounded border border-zinc-800/70 md:col-span-1">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider">
                  <span className="text-zinc-400 font-semibold text-[#D4AF37]/90 flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-[#D4AF37]" /> Purchase Title Size
                  </span>
                  <span className="text-[#D4AF37] font-bold">{purchaseTitleFontSize} px</span>
                </div>
                <input
                  type="number"
                  min={5}
                  max={48}
                  value={purchaseTitleFontSize === 0 ? '' : purchaseTitleFontSize}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value));
                    setPurchaseTitleFontSize(val);
                  }}
                  className="w-full bg-[#141416] text-white border border-zinc-800/80 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none rounded px-3 py-1.5 text-sm mt-1.5 font-mono"
                  placeholder="e.g. 10"
                />
                <p className="text-[9.5px] text-zinc-500 mt-2 leading-snug">
                  Size of the PURCHASE RATE text.
                </p>
              </div>

              {/* Marquee Scroll Speed */}
              <div className="flex flex-col gap-1.5 p-3.5 bg-[#0B0B0D] rounded border border-zinc-800/70 md:col-span-1">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider">
                  <span className="text-zinc-400 font-semibold text-[#D4AF37]/90 flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-[#D4AF37]" /> Marquee Scroll Duration
                  </span>
                  <span className="text-[#D4AF37] font-bold">{speed} s</span>
                </div>
                <input 
                  type="range" 
                  min={15}
                  max={90}
                  value={speed ?? 50} 
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  className="w-full accent-[#D4AF37] bg-zinc-800 h-1.5 rounded-lg outline-none mt-2"
                />
                <p className="text-[9.5px] text-zinc-500 mt-2 leading-snug">
                  Tuning scroll duration alters the speed of running tickers on active showroom screens.
                </p>
              </div>

              {/* Holistic Media Signage Slideshow Loop Toggle */}
              <div className="flex flex-col gap-1.5 p-3.5 bg-[#0B0B0D] border border-[#D4AF37]/25 rounded md:col-span-2">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider">
                  <span className="text-[#D4AF37] font-semibold flex items-center gap-1.5">
                    <Tv className="w-4 h-4 text-[#D4AF37]" /> Global Signage Slideshow Loop Integration
                  </span>
                  <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded ${
                    mediaLoopEnabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {mediaLoopEnabled ? 'ENABLED' : 'MUTED'}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 bg-zinc-900/50 p-2.5 rounded border border-zinc-800/40">
                  <div className="max-w-md">
                    <p className="text-xs font-serif font-black text-[#F8F5EE] uppercase">Automatic TV Signage Alternating Engine</p>
                    <p className="text-[9.5px] text-zinc-500 font-mono mt-0.5">
                      Check to automatically loop through enabled digital image & video catalogs on showroom display screens. Uncheck to lock the screen to precious metal rates permanently.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMediaLoopEnabled(!mediaLoopEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 cursor-pointer ${
                      mediaLoopEnabled ? 'bg-[#D4AF37]' : 'bg-zinc-805'
                    }`}
                  >
                    <span className={`w-4 h-4 bg-black rounded-full transition-transform ${mediaLoopEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              {/* Rotating Background Image Toggle */}
              <div className="flex flex-col gap-1.5 p-3.5 bg-[#0B0B0D] border border-[#D4AF37]/25 rounded md:col-span-1">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider">
                  <span className="text-[#D4AF37] font-semibold flex items-center gap-1.5">
                    <Tv className="w-4 h-4 text-[#D4AF37]" /> Background Rotation
                  </span>
                  <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded ${
                    rotateBackgroundEnabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {rotateBackgroundEnabled ? 'ENABLED' : 'MUTED'}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 bg-zinc-900/50 p-2.5 rounded border border-zinc-800/40">
                  <div className="max-w-md">
                    <p className="text-xs font-serif font-black text-[#F8F5EE] uppercase">Rates Slideshow BG</p>
                    <p className="text-[9.5px] text-zinc-500 font-mono mt-0.5">
                      Display media images as rotating backgrounds every 10s on the Rates screen.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRotateBackgroundEnabled(!rotateBackgroundEnabled)}
                    className={`shrink-0 w-12 h-6 rounded-full transition-colors relative flex items-center p-1 cursor-pointer ${
                      rotateBackgroundEnabled ? 'bg-[#D4AF37]' : 'bg-zinc-805'
                    }`}
                  >
                    <span className={`w-4 h-4 bg-black rounded-full transition-transform ${rotateBackgroundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Sub-section 4: Rate Cards Grid Visibility Settings */}
          <div className="flex flex-col gap-4 mt-2">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] font-semibold flex items-center gap-2 border-b border-zinc-805/50 pb-1.5">
              <span>Rate Cards Grid Visibility (Signage Screen)</span>
            </h4>

            <p className="text-[9.5px] text-zinc-400 font-mono tracking-wide leading-relaxed">
              Choose which precious metals and purity ratios to display or hide on your live showrooms television terminals (at least one must stay active):
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { key: 'gold24k', label: '24K gold', desc: '99.9% Pure' },
                { key: 'gold22k', label: '22K gold', desc: '91.6% Standard' },
                { key: 'gold20k', label: '20K gold', desc: '83.3% Alloy' },
                { key: 'gold18k', label: '18K gold', desc: '75.0% Alloy' },
                { key: 'silver', label: 'Silver', desc: '99.9% Bullion' },
                { key: 'platinum', label: 'Platinum', desc: '95.0% Pure Pt950' },
              ].map((r) => {
                const isChecked = visibleRates.includes(r.key);
                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => {
                      if (isChecked) {
                        if (visibleRates.length > 1) {
                          setVisibleRates(visibleRates.filter((v) => v !== r.key));
                        }
                      } else {
                        setVisibleRates([...visibleRates, r.key]);
                      }
                    }}
                    className={`flex flex-col gap-1 items-start text-left p-3 rounded border transition-all relative select-none cursor-pointer ${
                      isChecked 
                        ? 'bg-zinc-900 border-[#D4AF37]/80 text-white shadow-md shadow-black/40' 
                        : 'bg-black/45 border-zinc-800/70 text-zinc-500 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex w-full justify-between items-center mb-0.5">
                      <span className={`text-[10px] font-mono tracking-wider uppercase font-bold ${isChecked ? 'text-[#D4AF37]' : 'text-zinc-500'}`}>
                        {r.label}
                      </span>
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${isChecked ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-zinc-750 bg-transparent'}`}>
                        {isChecked && (
                          <svg className="w-2 h-2 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 mt-0.5 block leading-none">
                      {r.desc}
                    </span>
                    <span className={`text-[8.5px] font-semibold font-mono tracking-wider mt-2.5 px-1.5 py-0.5 rounded ${
                      isChecked ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'bg-zinc-900/40 text-zinc-600'
                    }`}>
                      {isChecked ? '● SHOWING' : '○ HIDDEN'}
                    </span>
                  </button>
                );
              })}
            </div>
            
            {visibleRates.length <= 1 && (
              <p className="text-[9.5px] text-amber-500/90 font-mono flex items-center gap-1 mt-0.5 animate-pulse">
                ⚠️ System safeguard: At least one active metal price module must remain visible to maintain showrooms service availability.
              </p>
            )}
          </div>

          {/* Sub-section 5: Automated Communications & Alerts */}
          <div className="flex flex-col gap-4 mt-2">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] font-semibold flex items-center gap-2 border-b border-zinc-805/50 pb-1.5">
              <span>Automated Communications & Alerts</span>
            </h4>

            <div className="flex flex-col md:flex-row gap-4">
              {/* WhatsApp alerts switch */}
              <button
                type="button"
                onClick={() => setWhatsapp(!whatsapp)}
                className={`flex-1 text-left p-3.5 rounded border flex items-center justify-between transition-colors ${
                  whatsapp 
                    ? 'border-[#D4AF37]/45 bg-[#D4AF37]/5 text-white' 
                    : 'border-zinc-800 bg-black/20 text-zinc-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded flex items-center justify-center border border-zinc-800 text-emerald-400 font-bold block bg-zinc-900 shadow">W</div>
                  <div>
                    <h4 className="text-xs font-bold">WhatsApp Rate Alerts</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Pushes rate alerts daily directly to VIP client registers.</p>
                  </div>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full border ${whatsapp ? 'bg-[#D4AF37] border-white' : 'bg-transparent border-zinc-700'}`}></div>
              </button>

              {/* Email alerts switch */}
              <button
                type="button"
                onClick={() => setEmail(!email)}
                className={`flex-1 text-left p-3.5 rounded border flex items-center justify-between transition-colors ${
                  email 
                    ? 'border-[#D4AF37]/45 bg-[#D4AF37]/5 text-white' 
                    : 'border-zinc-800 bg-black/20 text-zinc-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded flex items-center justify-center border border-zinc-800 text-sky-400 font-bold block bg-zinc-900 shadow">@</div>
                  <div>
                    <h4 className="text-xs font-bold">Showroom Head Email Reports</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Mails daily rates variations PDF directly to store logs.</p>
                  </div>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full border ${email ? 'bg-[#D4AF37] border-white' : 'bg-transparent border-zinc-700'}`}></div>
              </button>
            </div>
          </div>

          {/* Sub-section 6: Metal API Servers Mappings */}
          <div className="flex flex-col gap-4 mt-2">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] font-semibold flex items-center gap-2 border-b border-zinc-805/50 pb-1.5">
              <span>Metal API Servers Mappings</span>
            </h4>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Gold/Silver Global API Endpoint</label>
              <input 
                type="text" 
                value={goldUrl ?? ''}
                onChange={(e) => setGoldUrl(e.target.value)}
                className="bg-[#0B0B0D] border border-zinc-800 rounded p-2 text-[10px] font-mono text-zinc-300 focus:outline-none focus:border-[#D4AF37] transition-colors"
                placeholder="https://api.metals.live/v1/spot"
              />
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="pt-3 border-t border-zinc-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black hover:brightness-110 active:brightness-95 font-serif font-black text-xs tracking-widest uppercase flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-black/30"
            >
              <Save className="w-4 h-4 text-black" /> Save All Settings
            </button>
          </div>

        </div>

        {/* Right Side (5 Cols): Live TV Display Preview */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          <div className="rounded-md bg-[#15161A] border border-[#D4AF37]/20 p-5 flex flex-col gap-4">
            
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-sm font-semibold text-[#D4AF37] flex items-center gap-2">
                <Tv className="w-4 h-4 text-[#D4AF37]" /> Signage Live View Mockup
              </h3>
              <span className="text-[8px] font-mono uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Real-time
              </span>
            </div>

            <p className="text-[11px] text-zinc-400 leading-snug">
              Scaled-down model representing the physical signage television display in showrooms. Reflects customized metrics and corporate design parameters in real-time.
            </p>

            {/* LIVE TV PREVIEW CONTAINER MOCK */}
            <div className="border-4 border-[#101014] rounded-lg shadow-2xl overflow-hidden relative shadow-black/80">
              
              {/* Scaled Render of Signage UI */}
              <div 
                className="w-full text-white p-4 select-none relative overflow-hidden transition-all duration-300"
                style={{ backgroundColor: customPrimaryBg, minHeight: '380px' }}
              >
                
                {/* Simulated art-deco star field overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:12px_12px]"></div>
                
                {/* Outer decorative line boundary */}
                <div 
                  className="absolute inset-2 pointer-events-none border border-double border-white/5 rounded-sm"
                  style={{ borderColor: `${customGoldColor}15` }}
                ></div>

                {/* Simulated TV Frame Glass Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.04] to-white/0 pointer-events-none"></div>

                {/* Render Micro Header */}
                <div className="flex justify-between items-center border-b pb-1.5 mb-2 relative z-10" style={{ borderColor: `${customGoldColor}30` }}>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" style={{ color: customGoldColor }} />
                    <div className="text-left leading-none">
                      <span className="text-[10px] font-serif font-bold tracking-widest uppercase block" style={{ color: customGoldColor }}>
                        DEVIJEWELLERS
                      </span>
                      <span className="text-[5px] text-zinc-500 tracking-wider">EXCLUSIVE ATELIER INC.</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span 
                      className="text-[6px] font-mono font-bold tracking-widest uppercase block mb-0.5" 
                      style={{ color: customGoldColor }}
                    >
                      LIVE TIME (IST)
                    </span>
                    <span className="text-[8px] font-mono font-bold text-zinc-300">
                      {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                  </div>
                </div>

                {/* Simulated Announcement Alerts Overlay */}
                {showAnnouncement && (
                  <div 
                    className="w-full py-1 mb-2 text-center text-[7px] font-mono uppercase tracking-widest border-y items-center justify-center animate-pulse relative z-10"
                    style={{ 
                      backgroundColor: `${customGoldColor}10`,
                      borderColor: customGoldColor,
                      color: customGoldColor
                    }}
                  >
                    🔔 ATELIER BULLETIN: {announcementText || 'Special Swarna Festive offer initiated.'}
                  </div>
                )}

                {/* Micro Rates Display Carousel Grid */}
                <div className="grid grid-cols-2 gap-2 mt-2" id="preview-rate-grid">
                  {[
                    { key: 'gold24k', label: '24K Gold', value: rates.gold24k, sub: '99.9% Hallmark' },
                    { key: 'gold22k', label: '22K Gold', value: rates.gold22k, sub: '91.6% Fine' },
                    { key: 'silver', label: 'Silver', value: rates.silver, sub: '99% Pure Bullion' },
                    { key: 'platinum', label: 'Platinum Pt950', value: rates.platinum, sub: '95% Pure' },
                  ].filter((x) => visibleRates.includes(x.key)).map((x) => (
                    <div 
                      key={x.label}
                      className="p-1.5 rounded border relative flex flex-col justify-between"
                      style={{ 
                        backgroundColor: customCardBg, 
                        borderColor: `${customGoldColor}30` 
                      }}
                    >
                      {/* Accent strip */}
                      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: customGoldColor }} />

                      <div className="text-left">
                        <span className="text-[7.5px] font-bold block" style={{ color: customGoldColor }}>
                          {x.label}
                        </span>
                        <span className="text-[5px] text-zinc-500 block leading-none">
                          {x.sub}
                        </span>
                      </div>

                      <div className="flex justify-between items-end mt-1">
                        <span 
                          className="font-mono text-white font-bold block"
                          style={{ 
                            fontSize: x.key.startsWith('gold') 
                              ? `${goldFontSize * 0.35}px` 
                              : `${silverFontSize * 0.35}px` 
                          }}
                        >
                          {formatPrice(x.value, x.label.includes('Silver'))}
                        </span>
                        <span className="text-[5.5px] text-emerald-400 font-mono tracking-tighter block flex items-center gap-0.5">
                          ▲ up
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Simulated Media Advertisement Slider Overlay */}
                <div 
                  className="mt-2 text-left p-1.5 rounded border border-dashed flex items-center gap-2"
                  style={{ 
                    backgroundColor: `${customCardBg}bb`, 
                    borderColor: `${customGoldColor}30` 
                  }}
                >
                  <div className="w-8 h-8 rounded bg-zinc-800 border overflow-hidden flex-shrink-0 flex items-center justify-center relative border-zinc-700">
                    <Play className="w-3 h-3 text-zinc-500 animate-pulse" />
                  </div>
                  <div className="leading-tight">
                    <span className="text-[6.5px] font-bold tracking-wider block" style={{ color: customGoldColor }}>
                      PROMOTION DISPLAY SHIFT SLIDESHOW
                    </span>
                    <span className="text-[6px] text-zinc-400 block font-light">
                      Loops every {ratesDisplayDuration} seconds to showcase active catalog media assets.
                    </span>
                  </div>
                </div>

                {/* Micro Ticker Footer */}
                <div className="mt-2.5 border-t pt-2" style={{ borderColor: `${customGoldColor}20` }}>
                  <div className="bg-black/90 border rounded-sm p-1 flex items-center relative overflow-hidden" style={{ borderColor: `${customGoldColor}28` }}>
                    <div 
                      className="text-[6px] font-bold px-1 py-0.5 font-serif mr-1.5 uppercase flex-shrink-0 rounded"
                      style={{ backgroundColor: customGoldColor, color: '#000000' }}
                    >
                      OFFICIAL BULLETIN
                    </div>
                    
                    <marquee className="text-[7.5px] font-sans font-light tracking-wide text-zinc-300 w-full" scrollamount="1.5">
                      {tickerText || '✨ Welcome to Devijewellers Atelier • Broadcaster Hub Online ✨'}
                    </marquee>
                  </div>
                </div>

              </div>

              {/* Physical Bezel Bottom Label */}
              <div className="bg-[#101014] text-[#D4AF37]/50 text-[7px] font-mono py-1 text-center font-bold tracking-[0.25em] border-t border-zinc-900 flex justify-center items-center gap-1">
                <span>Devijewellers Signage Terminal IP_192.168.1.33</span>
              </div>

            </div>

            {/* Presets shortcut help info */}
            <div className="text-[10px] text-zinc-500 font-mono leading-relaxed bg-[#0B0B0D] p-2.5 rounded border border-zinc-800">
              💡 <span className="text-[#D4AF37]">Design Tip:</span> Try selecting a Seasonal Theme preset (e.g. Royal Emerald or Festival purple-pink) to automatically sync custom matching backdrop hex codes, then fine-tune!
            </div>

          </div>
        </div>

      </form>

      {/* RECENT AUDIT ACTIVITY & SHORTCUTS DUAL BLOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side (7 Cols): Recent Activities list */}
        <div className="lg:col-span-12 xl:col-span-12 rounded-md bg-[#15161A] border border-[#D4AF37]/20 p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-[#D4AF37]/20 pb-3">
            <h3 className="font-serif text-sm font-semibold text-[#D4AF37] flex items-center gap-2">
              <Clock className="w-4 h-4" /> Live Operational Audit Logs
            </h3>
            <button 
              onClick={() => onNavigate('rate_sync')} 
              className="text-[11px] font-serif text-[#D4AF37] flex items-center gap-1 hover:underline"
            >
              Sync Records <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
            {logs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-3 rounded bg-[#0B0B0D] border border-zinc-800/50 flex flex-col gap-1 hover:border-zinc-700 transition-colors">
                <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono">
                  <span className="text-[#D4AF37]">{log.userEmail}</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString() || '04:00 PM'}</span>
                </div>
                <div className="flex justify-between items-start gap-2 mt-1">
                  <span className="text-xs font-semibold text-white tracking-wide">
                    {log.action}
                  </span>
                  <span className="text-[9px] bg-zinc-800 text-zinc-300 font-mono px-1.5 py-0.5 rounded uppercase">
                    Core Security Verified
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-light font-sans leading-relaxed mt-0.5">
                  {log.details}
                </p>
              </div>
            ))}
          </div>
        </div>
        
      </div>

    </div>
  );
}
