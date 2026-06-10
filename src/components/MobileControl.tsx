/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  JewelleryRates, 
  RateTrends, 
  DisplayMode, 
  DisplayTheme, 
  DisplaySetting,
  PromoItem,
  SystemConfig
} from '../types';
import { 
  Smartphone, 
  Tv, 
  AlertTriangle, 
  RotateCw, 
  Sparkles, 
  Flame, 
  VolumeX, 
  CheckCircle,
  TrendingUp, 
  TrendingDown, 
  MessageSquare,
  Play,
  Pause,
  UploadCloud,
  Layers,
  Palette
} from 'lucide-react';
import TVDisplay from './TVDisplay';

interface MobileControlProps {
  rates: JewelleryRates;
  trends: RateTrends;
  onUpdateRates: (newRates: JewelleryRates) => void;
  onUpdateTrends: (newTrends: RateTrends) => void;
  displaySetting: DisplaySetting;
  onUpdateDisplaySetting: (settings: Partial<DisplaySetting>) => void;
  promos: PromoItem[];
  systemConfig: SystemConfig;
  onTriggerLog: (action: string, details: string) => void;
}

export default function MobileControl({
  rates,
  trends,
  onUpdateRates,
  onUpdateTrends,
  displaySetting,
  onUpdateDisplaySetting,
  promos,
  systemConfig,
  onTriggerLog
}: MobileControlProps) {
  
  // Rate edit states
  const [editRates, setEditRates] = useState<JewelleryRates>({ ...rates });
  const [rebooting, setRebooting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Local state for announcement trigger to make it snappy
  const [announcementMsg, setAnnouncementMsg] = useState<string>(displaySetting.announcementText);

  const handleRateInputChange = (key: keyof JewelleryRates, val: string) => {
    const num = parseFloat(val) || 0;
    setEditRates(prev => ({ ...prev, [key]: num }));
  };

  const publishRates = () => {
    // Generate trends dynamically based on direction of shift
    const newTrends: RateTrends = { ...trends };
    (Object.keys(rates) as Array<keyof JewelleryRates>).forEach((field) => {
      if (editRates[field] > rates[field]) {
        newTrends[field] = 'up';
      } else if (editRates[field] < rates[field]) {
        newTrends[field] = 'down';
      }
    });

    onUpdateRates({ ...editRates });
    onUpdateTrends(newTrends);
    onTriggerLog(
      'Mobile Rate Update', 
      `Instant rate push from mobile. 22K updated to ${editRates.gold22k}, Silver updated to ${editRates.silver}.`
    );

    triggerSuccess('Rates published to all TVs instantly!');
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const simulateReboot = () => {
    setRebooting(true);
    onTriggerLog('Mobile Display Force Reboot', 'Triggered display driver reload on CP and retail outlets.');
    setTimeout(() => {
      setRebooting(false);
      triggerSuccess('All showrooms TV Displays rebooted successfully!');
    }, 2500);
  };

  const toggleEmergencyBlackout = () => {
    const nextVal = !displaySetting.isBlackout;
    onUpdateDisplaySetting({ isBlackout: nextVal });
    onTriggerLog(
      'Emergency Standby Triggered', 
      `Blackout emergency mode ${nextVal ? 'ENABLED' : 'DISABLED'} from mobile node.`
    );
    triggerSuccess(nextVal ? 'Showrooms blacked out!' : 'Screens restored to standard broadcast.');
  };

  const toggleScreenPause = () => {
    const nextVal = !displaySetting.isPaused;
    onUpdateDisplaySetting({ isPaused: nextVal });
    onTriggerLog(
      'Display Broadcast Power', 
      `Showroom rate ticking ${nextVal ? 'PAUSED' : 'RESUMED'} from mobile.`
    );
    triggerSuccess(nextVal ? 'Rates locked/paused' : 'Live rates resumed.');
  };

  const handleModeAndThemeUpdate = (mode: DisplayMode, theme: DisplayTheme) => {
    onUpdateDisplaySetting({ mode, theme });
    onTriggerLog('Mobile Screen Settings', `Assigned Mode: ${mode} | Theme: ${theme}`);
    triggerSuccess(`Broadcasting in ${mode.toUpperCase()} layout (${theme.toUpperCase()} theme)`);
  };

  const updateAnnouncement = () => {
    onUpdateDisplaySetting({ 
      announcementText: announcementMsg, 
      showAnnouncement: announcementMsg.trim().length > 0 
    });
    onTriggerLog('Mobile Announcement Broadcast', `Deployed critical banner: "${announcementMsg}"`);
    triggerSuccess('Announcement updated and live on TV!');
  };

  const activePromo = promos.find(p => p.id === displaySetting.campaignId);

  return (
    <div id="mobile-control-root" className="max-w-4xl mx-auto w-full text-[#F1ECE4] flex flex-col gap-6">
        
        {/* TOP COMPACT STATUS */}
        <div className="p-4 rounded-md bg-[#15161A] border border-[#D4AF37]/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <h3 className="text-sm font-bold font-serif tracking-wider">Mobile Signage Node</h3>
              <p className="text-[10px] text-zinc-400 font-mono">AUTHORIZED SECURE DEVICE • CP_MOBILE_01</p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-mono tracking-wider px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
            Active Connected
          </span>
        </div>

        {/* FEEDBACK OVERLAYS */}
        {successMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500 text-emerald-400 text-xs font-semibold rounded flex items-center gap-2 animate-bounce">
            <CheckCircle className="w-4 h-4 ml-1" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* SECTION 1: RAPID RATE UPDATES */}
        <div className="p-5 rounded-md bg-[#15161A] border border-[#D4AF37]/10 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <h4 className="font-serif text-sm font-semibold text-[#D4AF37] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Quick Showroom Rates Entry
            </h4>
            <span className="text-[10px] text-zinc-500 font-mono">Change and press Push to publish</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5 border-b border-zinc-800 pb-1">24K Gold (10gm)</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[8px] uppercase text-zinc-500 mb-1 block">Sell Rate</span>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-xs text-zinc-500 font-mono">₹</span>
                    <input 
                      type="number" 
                      value={editRates.gold24k} 
                      onChange={(e) => handleRateInputChange('gold24k', e.target.value)}
                      className="w-full bg-[#0B0B0D] border border-zinc-800 focus:border-[#D4AF37] rounded p-1.5 pl-5 text-xs font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <span className="text-[8px] uppercase text-zinc-500 mb-1 block">Purchase Rate</span>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-xs text-zinc-500 font-mono">₹</span>
                    <input 
                      type="number" 
                      value={editRates.gold24kPurchase || ''} 
                      onChange={(e) => handleRateInputChange('gold24kPurchase', e.target.value)}
                      className="w-full bg-[#0B0B0D] border border-zinc-800 focus:border-[#D4AF37] rounded p-1.5 pl-5 text-xs font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5 border-b border-zinc-800 pb-1">22K Gold (10gm)</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[8px] uppercase text-zinc-500 mb-1 block">Sell Rate</span>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-xs text-zinc-500 font-mono">₹</span>
                    <input 
                      type="number" 
                      value={editRates.gold22k} 
                      onChange={(e) => handleRateInputChange('gold22k', e.target.value)}
                      className="w-full bg-[#0B0B0D] border border-zinc-800 focus:border-[#D4AF37] rounded p-1.5 pl-5 text-xs font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <span className="text-[8px] uppercase text-zinc-500 mb-1 block">Purchase Rate</span>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-xs text-zinc-500 font-mono">₹</span>
                    <input 
                      type="number" 
                      value={editRates.gold22kPurchase || ''} 
                      onChange={(e) => handleRateInputChange('gold22kPurchase', e.target.value)}
                      className="w-full bg-[#0B0B0D] border border-zinc-800 focus:border-[#D4AF37] rounded p-1.5 pl-5 text-xs font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5 border-b border-zinc-800 pb-1">20K Gold (10gm)</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[8px] uppercase text-zinc-500 mb-1 block">Sell Rate</span>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-xs text-zinc-500 font-mono">₹</span>
                    <input 
                      type="number" 
                      value={editRates.gold20k} 
                      onChange={(e) => handleRateInputChange('gold20k', e.target.value)}
                      className="w-full bg-[#0B0B0D] border border-zinc-800 focus:border-[#D4AF37] rounded p-1.5 pl-5 text-xs font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <span className="text-[8px] uppercase text-zinc-500 mb-1 block">Purchase Rate</span>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-xs text-zinc-500 font-mono">₹</span>
                    <input 
                      type="number" 
                      value={editRates.gold20kPurchase || ''} 
                      onChange={(e) => handleRateInputChange('gold20kPurchase', e.target.value)}
                      className="w-full bg-[#0B0B0D] border border-zinc-800 focus:border-[#D4AF37] rounded p-1.5 pl-5 text-xs font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5 border-b border-zinc-800 pb-1">18K Gold (10gm)</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[8px] uppercase text-zinc-500 mb-1 block">Sell Rate</span>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-xs text-zinc-500 font-mono">₹</span>
                    <input 
                      type="number" 
                      value={editRates.gold18k} 
                      onChange={(e) => handleRateInputChange('gold18k', e.target.value)}
                      className="w-full bg-[#0B0B0D] border border-zinc-800 focus:border-[#D4AF37] rounded p-1.5 pl-5 text-xs font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <span className="text-[8px] uppercase text-zinc-500 mb-1 block">Purchase Rate</span>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-xs text-zinc-500 font-mono">₹</span>
                    <input 
                      type="number" 
                      value={editRates.gold18kPurchase || ''} 
                      onChange={(e) => handleRateInputChange('gold18kPurchase', e.target.value)}
                      className="w-full bg-[#0B0B0D] border border-zinc-800 focus:border-[#D4AF37] rounded p-1.5 pl-5 text-xs font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5 border-b border-zinc-800 pb-1">Silver (1Kg)</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[8px] uppercase text-zinc-500 mb-1 block">Sell Rate</span>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-xs text-zinc-500 font-mono">₹</span>
                    <input 
                      type="number" 
                      step="0.01"
                      value={editRates.silver} 
                      onChange={(e) => handleRateInputChange('silver', e.target.value)}
                      className="w-full bg-[#0B0B0D] border border-zinc-800 focus:border-[#D4AF37] rounded p-1.5 pl-5 text-xs font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <span className="text-[8px] uppercase text-zinc-500 mb-1 block">Purchase Rate</span>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-xs text-zinc-500 font-mono">₹</span>
                    <input 
                      type="number" 
                      step="0.01"
                      value={editRates.silverPurchase || ''} 
                      onChange={(e) => handleRateInputChange('silverPurchase', e.target.value)}
                      className="w-full bg-[#0B0B0D] border border-zinc-800 focus:border-[#D4AF37] rounded p-1.5 pl-5 text-xs font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5 border-b border-zinc-800 pb-1">Platinum Pt950 (10gm)</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[8px] uppercase text-zinc-500 mb-1 block">Sell Rate</span>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-xs text-zinc-500 font-mono">₹</span>
                    <input 
                      type="number" 
                      value={editRates.platinum} 
                      onChange={(e) => handleRateInputChange('platinum', e.target.value)}
                      className="w-full bg-[#0B0B0D] border border-zinc-800 focus:border-[#D4AF37] rounded p-1.5 pl-5 text-xs font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <span className="text-[8px] uppercase text-zinc-500 mb-1 block">Purchase Rate</span>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-xs text-zinc-500 font-mono">₹</span>
                    <input 
                      type="number" 
                      value={editRates.platinumPurchase || ''} 
                      onChange={(e) => handleRateInputChange('platinumPurchase', e.target.value)}
                      className="w-full bg-[#0B0B0D] border border-zinc-800 focus:border-[#D4AF37] rounded p-1.5 pl-5 text-xs font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              onClick={publishRates}
              className="flex-1 bg-[#D4AF37] hover:bg-[#F4D03F] text-black font-serif font-bold text-xs py-2.5 px-4 rounded transition-colors flex items-center justify-center gap-2 shadow"
            >
              <UploadCloud className="w-4 h-4" /> PUSH LIVE PRICES TO TV SCREEN
            </button>
            <button
              onClick={() => setEditRates({ ...rates })}
              className="border border-[#D4AF37]/30 hover:border-[#D4AF37] text-xs font-serif text-[#D4AF37] py-2.5 px-4 rounded transition-colors"
            >
              Reset Inputs
            </button>
          </div>
        </div>

        {/* SECTION 2: METADATA & THEME SELECTION */}
        <div className="p-5 rounded-md bg-[#15161A] border border-[#D4AF37]/10 flex flex-col gap-4">
          <div className="border-b border-zinc-800 pb-3">
            <h4 className="font-serif text-sm font-semibold text-[#D4AF37] flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#D4AF37]" /> Core Theme & Layout Controller
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Theme Picker */}
            <div>
              <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-2">Display Theme Palette</span>
              <div className="flex flex-col gap-2">
                {[
                  { key: 'midnight_gold', label: '🌙 Midnight Gold Premium', bg: 'bg-[#0B0B0D]' },
                  { key: 'royal_emerald', label: '👑 Royal Emerald Luxury', bg: 'bg-[#041510]' },
                  { key: 'festival', label: '🎆 Festive Maroon', bg: 'bg-[#1E090F]' },
                ].map((th) => (
                  <button
                    key={th.key}
                    onClick={() => handleModeAndThemeUpdate(displaySetting.mode, th.key as DisplayTheme)}
                    className={`p-2.5 rounded border text-left text-xs font-medium flex items-center justify-between transition-colors ${
                      displaySetting.theme === th.key 
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]' 
                        : 'border-zinc-800 bg-[#0B0B0D] text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span>{th.label}</span>
                    <span className={`w-3 h-3 rounded-full ${th.bg} border border-[#D4AF37]/30`}></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Mode Picker */}
            <div>
              <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-2">TV Orientation Mode</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'standard', label: 'Standard' },
                  { key: 'premium', label: 'Premium' },
                  { key: 'festival', label: 'Festival' },
                  { key: 'portrait', label: 'Portrait (Vertical)' },
                  { key: 'landscape', label: 'Landscape' },
                ].map((m) => (
                  <button
                    key={m.key}
                    onClick={() => handleModeAndThemeUpdate(m.key as DisplayMode, displaySetting.theme)}
                    className={`p-2 rounded border text-center text-xs font-medium transition-colors ${
                      displaySetting.mode === m.key 
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]' 
                        : 'border-zinc-800 bg-[#0B0B0D] text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: SYSTEM LOGISTICS ANNOUNCEMENT */}
        <div className="p-5 rounded-md bg-[#15161A] border border-[#D4AF37]/10 flex flex-col gap-4">
          <div className="border-b border-zinc-800 pb-3">
            <h4 className="font-serif text-sm font-semibold text-[#D4AF37] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#D4AF37]" /> Showroom Urgent Banner
            </h4>
          </div>

          <div>
            <textarea 
              rows={2}
              value={announcementMsg} 
              onChange={(e) => setAnnouncementMsg(e.target.value)}
              placeholder="Enter special overlay marquee text or festival greeting..."
              className="w-full bg-[#0B0B0D] border border-zinc-800 focus:border-[#D4AF37] rounded p-2.5 text-xs text-white focus:outline-none"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={updateAnnouncement}
                className="bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/50 text-[#D4AF37] font-serif font-semibold text-xs py-2 px-4 rounded transition-colors"
                id="mobile-publish-announcement"
              >
                Publish Announcement
              </button>
              {displaySetting.showAnnouncement && (
                <button
                  onClick={() => {
                    setAnnouncementMsg('');
                    onUpdateDisplaySetting({ showAnnouncement: false, announcementText: '' });
                    triggerSuccess('Removed special announcement banner.');
                  }}
                  className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs py-2 px-4 rounded transition-colors"
                  id="mobile-clear-announcement"
                >
                  Clear Announcement
                </button>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 4: EMERGENCY COMMAND DEPLOYMENT */}
        <div className="p-5 rounded-md bg-[#1E0E0E] border border-red-900/30 flex flex-col gap-4">
          <h4 className="font-serif text-sm font-semibold text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" /> Showroom Operations Override / Emergency
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={toggleScreenPause}
              className={`p-3 rounded border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                displaySetting.isPaused
                  ? 'bg-amber-500 hover:bg-amber-400 text-black border-amber-500'
                  : 'bg-[#15161A] hover:bg-amber-500/10 text-amber-500 border-amber-500/30'
              }`}
            >
              {displaySetting.isPaused ? (
                <>
                  <Play className="w-4 h-4" /> RESUME LIVE FEED
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4" /> FREEZE RATES
                </>
              )}
            </button>

            <button
              onClick={toggleEmergencyBlackout}
              className={`p-3 rounded border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                displaySetting.isBlackout
                  ? 'bg-red-600 hover:bg-red-500 text-white border-red-600'
                  : 'bg-[#15161A] hover:bg-red-500/10 text-red-500 border-red-500/30'
              }`}
              id="mobile-blackout"
            >
              <VolumeX className="w-4 h-4" /> {displaySetting.isBlackout ? 'RESTORE DISPLAY' : 'EMERGENCY BLACKOUT'}
            </button>

            <button
              onClick={simulateReboot}
              disabled={rebooting}
              className="p-3 bg-[#15161A] hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              id="mobile-reboot"
            >
              <RotateCw className={`w-4 h-4 ${rebooting ? 'animate-spin' : ''}`} /> 
              {rebooting ? 'REBOOTING DRIVERS...' : 'REBOOT TV NODES'}
            </button>
          </div>
        </div>

    </div>
  );
}
