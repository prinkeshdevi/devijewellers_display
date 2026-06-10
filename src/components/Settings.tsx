/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SystemConfig } from '../types';
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
  Globe
} from 'lucide-react';

interface SettingsProps {
  systemConfig: SystemConfig;
  onUpdateSystemConfig: (config: SystemConfig) => void;
  onTriggerLog: (action: string, details: string) => void;
}

export default function SettingsComponent({
  systemConfig,
  onUpdateSystemConfig,
  onTriggerLog
}: SettingsProps) {
  
  const [success, setSuccess] = useState<boolean>(false);
  
  // Local config states
  const [company, setCompany] = useState<string>(systemConfig.companyName);
  const [contact, setContact] = useState<string>(systemConfig.contactNumber);
  const [speed, setSpeed] = useState<number>(systemConfig.tickerSpeed);
  const [goldUrl, setGoldUrl] = useState<string>(systemConfig.goldRateApiUrl);
  const [silverUrl, setSilverUrl] = useState<string>(systemConfig.silverRateApiUrl);
  const [whatsapp, setWhatsapp] = useState<boolean>(systemConfig.whatsappAlerts);
  const [email, setEmail] = useState<boolean>(systemConfig.emailAlerts);

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updated: SystemConfig = {
      companyName: company.trim().toUpperCase(),
      logoText: company.split(' ')[0] || 'DEVIJEWELLERS',
      contactNumber: contact.trim(),
      tickerSpeed: speed,
      goldRateApiUrl: goldUrl.trim(),
      silverRateApiUrl: silverUrl.trim(),
      whatsappAlerts: whatsapp,
      emailAlerts: email
    };

    onUpdateSystemConfig(updated);
    onTriggerLog('Settings Saved', 'Reprogrammed global branding labels, tickers speed, and Metal API end-nodes.');
    
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
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
          </div>

          {/* SECTION 2: TICKER VELOCITY */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-xs font-bold text-[#D4AF37] uppercase tracking-wider border-b border-zinc-800 pb-2">
              TV Marquee Ticker Parameters
            </h3>

            <div>
              <div className="flex justify-between text-[11px] text-zinc-400 font-mono mb-2">
                <span>Marquee Scroll Duration Speed:</span>
                <span className="text-[#D4AF37] font-bold">{speed} Seconds (Lower is faster scroller)</span>
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
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Gold API Feed Endpoint</label>
                <input 
                  type="text" 
                  value={goldUrl}
                  onChange={(e) => setGoldUrl(e.target.value)}
                  className="bg-[#0B0B0D] border border-zinc-850 rounded p-2 text-[10px] font-mono text-zinc-300 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Silver API Feed Endpoint</label>
                <input 
                  type="text" 
                  value={silverUrl}
                  onChange={(e) => setSilverUrl(e.target.value)}
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
