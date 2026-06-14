/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SystemConfig, DisplaySetting } from '../types';
import { 
  Settings, 
  Sparkles, 
  CheckCircle, 
  HelpCircle, 
  Volume2, 
  MessageSquare, 
  Mail, 
  ChevronRight,
  Database,
  Globe,
  Monitor,
  Eye,
  EyeOff,
  Clock,
  Type,
  Palette
} from 'lucide-react';

interface SettingsProps {
  displaySetting: DisplaySetting;
  onUpdateDisplaySetting: (setting: Partial<DisplaySetting>) => void;
  systemConfig: SystemConfig;
  onUpdateSystemConfig: (config: SystemConfig) => void;
  onTriggerLog: (action: string, details: string) => void;
}

export default function SettingsComponent({
  displaySetting,
  onUpdateDisplaySetting,
  systemConfig,
  onUpdateSystemConfig,
  onTriggerLog
}: SettingsProps) {
  
  const [success, setSuccess] = useState<boolean>(false);
  
  // Local config states
  const [company, setCompany] = useState<string>(systemConfig.companyName);
  const [contact, setContact] = useState<string>(systemConfig.contactNumber);
  const [speed, setSpeed] = useState<number>(systemConfig.tickerSpeed);
  const [goldUrl, setGoldUrl] = useState<string>(systemConfig.rateApiUrl);
  const [whatsapp, setWhatsapp] = useState<boolean>(systemConfig.whatsappAlerts);
  const [email, setEmail] = useState<boolean>(systemConfig.emailAlerts);
  const [logoImageBase64, setLogoImageBase64] = useState<string>(systemConfig.logoImageBase64 || '');

  // Local Display Settings States
  const [refreshInterval, setRefreshInterval] = useState<number>(displaySetting.refreshInterval || 15);
  const [ratesDisplayDuration, setRatesDisplayDuration] = useState<number>(displaySetting.ratesDisplayDuration || 12);
  const [slideshowDisplayDuration, setSlideshowDisplayDuration] = useState<number>(displaySetting.slideshowDisplayDuration || 8);
  const [rateFontSize, setRateFontSize] = useState<number>(displaySetting.rateFontSize || 55);
  const [labelFontSize, setLabelFontSize] = useState<number>(displaySetting.labelFontSize || 25);
  
  const [rotateBackgroundEnabled, setRotateBackgroundEnabled] = useState<boolean>(displaySetting.rotateBackgroundEnabled ?? false);
  const [mediaLoopEnabled, setMediaLoopEnabled] = useState<boolean>(displaySetting.mediaLoopEnabled ?? true);

  const [customPrimaryBg, setCustomPrimaryBg] = useState<string>(displaySetting.customPrimaryBg || '#8B8BBD');
  const [customSecondaryBg, setCustomSecondaryBg] = useState<string>(displaySetting.customSecondaryBg || '#15161A');
  const [customCardBg, setCustomCardBg] = useState<string>(displaySetting.customCardBg || '#161619');
  const [customGoldColor, setCustomGoldColor] = useState<string>(displaySetting.customGoldColor || '#D4AF37');
  
  const [visibleRates, setVisibleRates] = useState<string[]>(displaySetting.visibleRates || ['gold24k', 'gold22k', 'gold18k', 'silver']);

  const toggleRateVisibility = (rateKey: string) => {
    setVisibleRates(prev => {
      if (prev.includes(rateKey)) {
        if (prev.length <= 1) return prev; // At least one must be active
        return prev.filter(k => k !== rateKey);
      } else {
        return [...prev, rateKey];
      }
    });
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

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updated: SystemConfig = {
      companyName: company.trim().toUpperCase(),
      logoText: company.split(' ')[0] || 'DEVIJEWELLERS',
      logoImageBase64: logoImageBase64,
      contactNumber: contact.trim(),
      tickerSpeed: speed,
      rateApiUrl: goldUrl.trim(),
      whatsappAlerts: whatsapp,
      emailAlerts: email
    };

    onUpdateSystemConfig(updated);
    
    // Dispatch Display Settings
    onUpdateDisplaySetting({
      refreshInterval,
      ratesDisplayDuration,
      slideshowDisplayDuration,
      rateFontSize,
      labelFontSize,
      rotateBackgroundEnabled,
      mediaLoopEnabled,
      customPrimaryBg,
      customSecondaryBg,
      customCardBg,
      customGoldColor,
      visibleRates
    });
    
    onTriggerLog('Settings Saved', 'Reprogrammed global branding labels, tickers speed, and Metal API end-nodes.');
    
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      window.location.reload();
    }, 1000);
  };

  return (
    <div id="settings-root" className="flex flex-col gap-6 text-[#F1ECE4]">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#15161A] p-5 rounded-md border border-zinc-800 animate-fade-in">
        <div>
          <h2 className="text-lg md:text-xl font-serif font-bold text-[#D4AF37] flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#D4AF37]" /> Global Showroom Settings Panel
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Re-program digital display behaviors, alert triggers, core metals API connections, and TV brand identity templates.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500 text-emerald-400 text-xs font-semibold rounded flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4" />
          <span>System branding preferences updated and synced across TV Displays!</span>
        </div>
      )}

      <form onSubmit={saveSettings} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left main form (8 cols) */}
        <div className="lg:col-span-8 bg-[#15161A] border border-zinc-800 rounded-md p-5 flex flex-col gap-6">
          
          {/* SECTION 1: VISUAL IDENTITY BRANDING */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-xs font-bold text-[#D4AF37] uppercase tracking-wider border-b border-zinc-800 pb-2">
              Showroom Branded Aesthetics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Company Atelier Name (All Caps)</label>
                <input 
                  type="text" 
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-[#0B0B0D] border border-zinc-800 focus:border-[#D4AF37] rounded p-2.5 text-xs font-serif font-bold text-[#F8F5EE] focus:outline-none tracking-wide"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Atelier Desk Helpline Number</label>
                <input 
                  type="text" 
                  value={contact}
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

          {/* SECTION 2: TIMING CONFIGURATION */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-xs font-bold text-[#D4AF37] uppercase tracking-wider border-b border-zinc-800 pb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" /> TIMING CONFIGURATION
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Refresh Interval */}
              <div className="flex flex-col gap-2 bg-[#0B0B0D] p-3 rounded border border-zinc-800">
                <div className="flex justify-between items-center text-[10px] uppercase font-mono text-zinc-400">
                  <span>Refresh Interval</span>
                  <span className="text-[#D4AF37] font-bold">{refreshInterval} s</span>
                </div>
                <input 
                  type="range" min={5} max={60} value={refreshInterval} 
                  onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                  className="w-full accent-[#D4AF37] bg-zinc-800 h-1.5 rounded-lg outline-none"
                />
                <p className="text-[9px] text-zinc-500 leading-tight">How often to check for rate updates. Dynamic screens scan server API end-nodes on this interval.</p>
              </div>

              {/* Rates Display Duration */}
              <div className="flex flex-col gap-2 bg-[#0B0B0D] p-3 rounded border border-zinc-800">
                <div className="flex justify-between items-center text-[10px] uppercase font-mono text-zinc-400">
                  <span>Rates Display Duration</span>
                  <span className="text-[#D4AF37] font-bold">{ratesDisplayDuration} s</span>
                </div>
                <input 
                  type="range" min={5} max={60} value={ratesDisplayDuration} 
                  onChange={(e) => setRatesDisplayDuration(parseInt(e.target.value))}
                  className="w-full accent-[#D4AF37] bg-zinc-800 h-1.5 rounded-lg outline-none"
                />
                <p className="text-[9px] text-zinc-500 leading-tight">How long to show rates before switching to media. Cycles price cards with active hero promotional slides.</p>
              </div>

              {/* Slideshow Duration */}
              <div className="flex flex-col gap-2 bg-[#0B0B0D] p-3 rounded border border-zinc-800">
                <div className="flex justify-between items-center text-[10px] uppercase font-mono text-zinc-400">
                  <span>Slideshow Duration</span>
                  <span className="text-[#D4AF37] font-bold">{slideshowDisplayDuration} s</span>
                </div>
                <input 
                  type="range" min={3} max={30} value={slideshowDisplayDuration} 
                  onChange={(e) => setSlideshowDisplayDuration(parseInt(e.target.value))}
                  className="w-full accent-[#D4AF37] bg-zinc-800 h-1.5 rounded-lg outline-none"
                />
                <p className="text-[9px] text-zinc-500 leading-tight">How long each media promotional slide or video is displayed before moving to the next.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col gap-2 bg-[#0B0B0D] p-3 rounded border border-zinc-800">
                <div className="flex justify-between items-center text-[10px] uppercase font-mono text-zinc-400">
                  <span>Rate Value Font Size</span>
                  <span className="text-[#D4AF37] font-bold">{rateFontSize} px</span>
                </div>
                <input 
                  type="range" min={20} max={120} value={rateFontSize} 
                  onChange={(e) => setRateFontSize(parseInt(e.target.value))}
                  className="w-full accent-[#D4AF37] bg-zinc-800 h-1.5 rounded-lg outline-none"
                />
                <p className="text-[9px] text-zinc-500 leading-tight">Size of the price figures (e.g. 7,500).</p>
              </div>

              <div className="flex flex-col gap-2 bg-[#0B0B0D] p-3 rounded border border-zinc-800">
                <div className="flex justify-between items-center text-[10px] uppercase font-mono text-zinc-400">
                  <span>Rate Label Font Size</span>
                  <span className="text-[#D4AF37] font-bold">{labelFontSize} px</span>
                </div>
                <input 
                  type="range" min={12} max={60} value={labelFontSize} 
                  onChange={(e) => setLabelFontSize(parseInt(e.target.value))}
                  className="w-full accent-[#D4AF37] bg-zinc-800 h-1.5 rounded-lg outline-none"
                />
                <p className="text-[9px] text-zinc-500 leading-tight">Size of the metal labels (e.g. GOLD 24K).</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-zinc-400 font-mono mb-2">
                <span>Marquee Scroll Duration Speed:</span>
                <span className="text-[#D4AF37] font-bold">{speed} Seconds</span>
              </div>
              <input 
                type="range" 
                min={15}
                max={90}
                value={speed} 
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full accent-[#D4AF37] bg-zinc-800 h-1.5 rounded-lg outline-none"
              />
              <p className="text-[10px] text-zinc-500 mt-2 font-sans font-light">
                *Tuning scroll duration alters the speed of running tickers on active showroom screens. Speed is pushed OTA.
              </p>
            </div>
          </div>

          {/* SECTION: SLIDESHOW STATUS */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-xs font-bold text-[#D4AF37] uppercase tracking-wider border-b border-zinc-800 pb-2 flex items-center gap-2">
               <Monitor className="w-4 h-4" /> SLIDESHOW STATUS
            </h3>

            <div className="flex flex-col md:flex-row gap-4">
              <button
                type="button"
                onClick={() => setRotateBackgroundEnabled(!rotateBackgroundEnabled)}
                className={`flex-1 text-left p-3.5 rounded border flex items-center justify-between transition-colors ${
                  rotateBackgroundEnabled 
                    ? 'border-[#D4AF37]/45 bg-[#D4AF37]/5 text-white' 
                    : 'border-zinc-800 bg-black/20 text-zinc-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Globe className={`w-5 h-5 ${rotateBackgroundEnabled ? 'text-emerald-400' : 'text-zinc-500'}`} />
                  <div>
                    <h4 className="text-xs font-bold">BACKGROUND ROTATION</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5 max-w-[200px]">Display media images as rotating backgrounds every 10s on the Rates screen.</p>
                  </div>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full border ${rotateBackgroundEnabled ? 'bg-[#D4AF37] border-white' : 'bg-transparent border-zinc-700'}`}></div>
              </button>

              <button
                type="button"
                onClick={() => setMediaLoopEnabled(!mediaLoopEnabled)}
                className={`flex-1 text-left p-3.5 rounded border flex items-center justify-between transition-colors ${
                  mediaLoopEnabled 
                    ? 'border-[#D4AF37]/45 bg-[#D4AF37]/5 text-white' 
                    : 'border-zinc-800 bg-black/20 text-zinc-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Monitor className={`w-5 h-5 ${mediaLoopEnabled ? 'text-sky-400' : 'text-zinc-500'}`} />
                  <div>
                    <h4 className="text-xs font-bold">GLOBAL SIGNAGE LOOP</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5 max-w-[200px]">Automatically loop through digital catalogs. Uncheck to lock strictly to rates.</p>
                  </div>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full border ${mediaLoopEnabled ? 'bg-[#D4AF37] border-white' : 'bg-transparent border-zinc-700'}`}></div>
              </button>
            </div>
          </div>

          {/* SECTION: COLOR CUSTOMIZATION PALETTE */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-xs font-bold text-[#D4AF37] uppercase tracking-wider border-b border-zinc-800 pb-2 flex items-center gap-2">
               <Palette className="w-4 h-4" /> COLOR CUSTOMIZATION PALETTE
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest leading-tight">CANVAS BASE</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={customPrimaryBg} onChange={e => setCustomPrimaryBg(e.target.value)} className="w-8 h-8 rounded border-zinc-800 cursor-pointer bg-transparent" />
                    <span className="text-[10px] text-zinc-300 font-mono">{customPrimaryBg.toUpperCase()}</span>
                  </div>
               </div>
               <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest leading-tight">SECONDARY BASE</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={customSecondaryBg} onChange={e => setCustomSecondaryBg(e.target.value)} className="w-8 h-8 rounded border-zinc-800 cursor-pointer bg-transparent" />
                    <span className="text-[10px] text-zinc-300 font-mono">{customSecondaryBg.toUpperCase()}</span>
                  </div>
               </div>
               <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest leading-tight">CARDS CONTAINER</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={customCardBg} onChange={e => setCustomCardBg(e.target.value)} className="w-8 h-8 rounded border-zinc-800 cursor-pointer bg-transparent" />
                    <span className="text-[10px] text-zinc-300 font-mono">{customCardBg.toUpperCase()}</span>
                  </div>
               </div>
               <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest leading-tight">LUXURY ACCENT GOLD</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={customGoldColor} onChange={e => setCustomGoldColor(e.target.value)} className="w-8 h-8 rounded border-zinc-800 cursor-pointer bg-transparent" />
                    <span className="text-[10px] text-zinc-300 font-mono">{customGoldColor.toUpperCase()}</span>
                  </div>
               </div>
            </div>
          </div>

          {/* SECTION: RATE CARDS GRID VISIBILITY */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-xs font-bold text-[#D4AF37] uppercase tracking-wider border-b border-zinc-800 pb-2 flex items-center gap-2">
               <Eye className="w-4 h-4" /> RATE CARDS GRID VISIBILITY (SIGNAGE SCREEN)
            </h3>
            <p className="text-[10px] text-zinc-400 font-mono">Choose which metals and ratios to display or hide on your live showrooms television terminals (at least one must stay active).</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
               {[
                 { key: 'gold24k', label: 'GOLD 24K', sub: '99.9% Pure' },
                 { key: 'gold22k', label: 'GOLD 22K', sub: '91.6% Standard' },
                 { key: 'gold20k', label: 'GOLD 20K', sub: '83.3% Alloy' },
                 { key: 'gold18k', label: 'GOLD 18K', sub: '75.0% Standard' },
                 { key: 'silver', label: 'SILVER', sub: '99.9% Bullion' },
                 { key: 'platinum', label: 'PLATINUM', sub: '95.0% Pt950' }
               ].map(r => (
                  <button 
                    key={r.key} 
                    type="button" 
                    onClick={() => toggleRateVisibility(r.key)}
                    className={`flex flex-col p-3 rounded-md border text-left transition-colors ${visibleRates.includes(r.key) ? 'bg-[#D4AF37]/10 border-[#D4AF37]/50' : 'bg-black/40 border-zinc-800 hover:border-zinc-700'}`}
                  >
                     <div className="flex justify-between items-center w-full">
                       <span className={`text-xs font-bold font-serif ${visibleRates.includes(r.key) ? 'text-[#D4AF37]' : 'text-zinc-500'}`}>{r.label}</span>
                       {visibleRates.includes(r.key) ? <Eye className="w-3.5 h-3.5 text-emerald-500" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-600" />}
                     </div>
                     <span className="text-[9px] font-mono text-zinc-500 mt-1">{r.sub}</span>
                     <div className="mt-2 text-[9px] uppercase tracking-wider font-bold">
                       {visibleRates.includes(r.key) ? <span className="text-emerald-400">• SHOWING</span> : <span className="text-red-900">• HIDDEN</span>}
                     </div>
                  </button>
               ))}
            </div>
          </div>

          {/* SECTION 3: COMMUNICATIONS ALERTS */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-xs font-bold text-[#D4AF37] uppercase tracking-wider border-b border-zinc-800 pb-2">
              Automated Communications & Alerts
            </h3>

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
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h4 className="text-xs font-bold">WhatsApp Rate Alerts</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Pushes rate alters daily directly to VIP client registers.</p>
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
                  <Mail className="w-5 h-5 text-sky-400" />
                  <div>
                    <h4 className="text-xs font-bold">Showroom Head Email Reports</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Mails daily rates variations PDF directly to store logs.</p>
                  </div>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full border ${email ? 'bg-[#D4AF37] border-white' : 'bg-transparent border-zinc-700'}`}></div>
              </button>

            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#D4AF37] hover:bg-[#F4D03F] text-black font-serif font-bold text-xs py-3 rounded transition-all mt-2 shadow"
            id="save-settings-configurations"
          >
            SAVE BRAND CONFIGURATIONS
          </button>
        </div>

        {/* Info Right Sidebar (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <div className="bg-[#15161A] border border-zinc-800 rounded-md p-5 flex flex-col gap-3">
            <h4 className="font-serif text-xs font-bold text-[#D4AF37] uppercase tracking-wider border-b border-zinc-800 pb-2 flex items-center gap-1.5Mac">
              <Database className="w-4 h-4 text-[#D4AF37]" /> Metal API Servers Mappings
            </h4>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Gold/Silver Global API Endpoint</label>
                <input 
                  type="text" 
                  value={goldUrl}
                  onChange={(e) => setGoldUrl(e.target.value)}
                  className="bg-[#0B0B0D] border border-zinc-850 rounded p-2 text-[10px] font-mono text-zinc-300 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-zinc-900 to-[#15161A] p-5 rounded-md border border-zinc-800 flex flex-col gap-2">
            <h4 className="text-xs font-serif font-semibold text-[#D4AF37] flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" /> Devijewellers Signage Suite v4.5
            </h4>
            <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">
              These settings control global templates across all retail stores and showroom displays mapped to the main server cluster. API endpoints must comply with JSON returns.
            </p>
          </div>

        </div>

      </form>

    </div>
  );
}
