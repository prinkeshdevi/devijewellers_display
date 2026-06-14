import React, { useState, useEffect } from 'react';
import { JewelleryRates, RateTrends, RateHistoryEntry, SystemConfig } from '../types';
import { 
  RefreshCw, Sparkles, CheckCircle, TrendingUp, TrendingDown,
  Database, Zap, Settings, History, Activity, Save, RefreshCcw, Download,
  Link, Percent, ShieldCheck, Cpu, DownloadCloud
} from 'lucide-react';

interface RateSyncProps {
  rates: JewelleryRates;
  trends: RateTrends;
  history: RateHistoryEntry[];
  systemConfig: SystemConfig;
  lastSyncTime: string | null;
  onUpdateRates: (newRates: JewelleryRates) => void;
  onUpdateTrends: (newTrends: RateTrends) => void;
  onUpdateHistory: (newHistory: RateHistoryEntry[]) => void;
  onUpdateSystemConfig: (newConfig: SystemConfig) => void;
  onTriggerLog: (action: string, details: string) => void;
}

export default function RateSync({
  rates,
  trends,
  history,
  systemConfig,
  lastSyncTime,
  onUpdateRates,
  onUpdateTrends,
  onUpdateHistory,
  onUpdateSystemConfig,
  onTriggerLog
}: RateSyncProps) {
  const [loadingApi, setLoadingApi] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // API Fetched State (Base Rates) - initialized with current rates
  const [baseGold24k, setBaseGold24k] = useState<number>(rates.gold24k);
  const [baseSilver, setBaseSilver] = useState<number>(rates.silver);
  const [basePlatinum, setBasePlatinum] = useState<number>(rates.platinum);

  // Calculation Settings
  const [calcSettings, setCalcSettings] = useState({
    syncIntervalMinutes: 1,
    silverPurchaseOffset: 5000,
    platinumPurchaseOffset: 4000,
    enableAutoSync: true,
    storeRatesInDb: true
  });

  // Load calculation settings from backend
  useEffect(() => {
    fetch('/api/settings')
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return res.json();
        } else {
          return {}; // Silently return empty object
        }
      })
      .then(data => {
        if (data && !data.error) {
          setCalcSettings({
            syncIntervalMinutes: data.syncIntervalMinutes || 1,
            silverPurchaseOffset: data.silverPurchaseOffset || 5000,
            platinumPurchaseOffset: data.platinumPurchaseOffset || 4000,
            enableAutoSync: data.enableAutoSync !== false,
            storeRatesInDb: data.storeRatesInDb !== false
          });
        }
      })
      .catch(console.error);
  }, []);

  const saveSettings = async () => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(calcSettings)
      });
      triggerSuccess('Calculation & Sync Settings Saved Successfully');
      if (calcSettings.enableAutoSync) {
        await syncMarketsApi(); // force a sync to apply
      }
      setTimeout(() => window.location.reload(), 1000);
    } catch (e: any) {
      triggerError('Failed to save settings: ' + e.message);
    }
  };

  const [apiUrl, setApiUrl] = useState(systemConfig.rateApiUrl || '');

  const saveApiSettings = () => {
    onUpdateSystemConfig({ ...systemConfig, rateApiUrl: apiUrl });
    triggerSuccess('API Settings Saved Successfully');
    setTimeout(() => window.location.reload(), 1000);
  };
  
  const resetSettings = () => {
    const defaults = {
      syncIntervalMinutes: 1,
      silverPurchaseOffset: 5000,
      platinumPurchaseOffset: 4000
    };
    setCalcSettings(defaults);
    triggerSuccess('Formulas reset to defaults');
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 5000);
  };

  const syncMarketsApi = async () => {
    setLoadingApi(true);
    
    try {
      const res = await fetch('/api/rates/sync', { method: 'POST' });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error ${res.status}`);
      }
      
      onTriggerLog('Live API Sync', `Forced sync from master API successfully.`);
      triggerSuccess('Live API Data Fetched and Updated Successfully.');
    } catch (err: any) {
      console.error('Fetch failed', err);
      onTriggerLog('Live API Sync Error', `Failed to fetch rates from API: ${err.message}`);
      triggerError(`Failed to fetch API: ${err.message}`);
    }
    setLoadingApi(false);
  };

  const formatPrice = (val: number, isSilver = false) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.abs(val || 0));
  };

  return (
    <div className="flex flex-col gap-6 text-[#F8F5EE] bg-[#0B0B0D] min-h-full p-2 lg:p-6 pb-20 fade-in">
      
      {/* PAGE TITLE */}
      <div className="mb-2 border-b border-zinc-800 pb-4">
        <h1 className="text-2xl md:text-3xl font-serif font-black text-[#D4AF37] uppercase tracking-wider flex items-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#D4AF37]" />
          Rate Sync & Calculation Engine
        </h1>
        <p className="text-zinc-400 mt-2 font-mono text-sm max-w-3xl">
          Manage API rate synchronization and automatic jewellery rate calculations. Fetch LIVE pricing for core metals, and automatically cast to all display screens with customized showroom formulas.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 text-sm font-bold font-mono tracking-wide rounded-lg flex items-center gap-3 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-400 text-sm font-bold font-mono tracking-wide rounded-lg flex items-center gap-3 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
          <span>{errorMsg}</span>
        </div>
      )}

      {/* SECTION 1: LIVE API RATES */}
      <div className="bg-[#15161A] border border-[#D4AF37]/30 rounded-xl p-6 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-transform group-hover:scale-110 duration-1000"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#D4AF37]/20 pb-4 mb-6 relative z-10">
          <h2 className="text-xl font-serif font-black text-[#F8F5EE] uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#D4AF37]" /> Live Market Rates
          </h2>
          <div className="flex flex-col items-end gap-1 mt-4 md:mt-0">
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Connected
              </div>
              <button 
                onClick={syncMarketsApi} 
                disabled={loadingApi}
                className="bg-[#D4AF37] hover:bg-[#F4D03F] disabled:opacity-60 text-black font-serif font-bold text-sm px-5 py-2.5 rounded shadow-[0_4px_14px_rgba(212,175,55,0.25)] flex items-center gap-2 transition-all"
              >
                <RefreshCcw className={`w-4 h-4 ${loadingApi ? 'animate-spin' : ''}`} />
                {loadingApi ? 'FETCHING...' : 'FETCH LATEST RATES'}
              </button>
              <button 
                onClick={syncMarketsApi} 
                disabled={loadingApi}
                className="bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-serif font-bold text-sm px-5 py-2.5 rounded transition-all"
              >
                FORCE SYNC
              </button>
            </div>
            {lastSyncTime && (
              <div className="text-[10px] sm:text-xs font-mono text-zinc-400 mr-2">
                Last updated: {lastSyncTime}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div className="bg-[#0B0B0D] border border-[#D4AF37]/20 p-6 rounded-lg flex flex-col justify-center items-center text-center shadow-inner relative overflow-hidden">
            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
            <span className="text-[#D4AF37] font-mono text-xs tracking-widest uppercase mb-2">24K Gold Rate</span>
            <input 
              type="number"
              value={baseGold24k}
              onChange={(e) => setBaseGold24k(parseFloat(e.target.value) || 0)}
              className="w-full text-center bg-transparent text-4xl font-serif font-black text-white focus:outline-none focus:text-[#D4AF37] transition-colors"
            />
            <div className="flex items-center gap-2 mt-3 text-[10px] text-zinc-500 font-mono uppercase">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              <span>Base Benchmark</span>
            </div>
          </div>

          <div className="bg-[#0B0B0D] border border-zinc-800 p-6 rounded-lg flex flex-col justify-center items-center text-center shadow-inner relative overflow-hidden">
            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-zinc-400/50 to-transparent"></div>
            <span className="text-zinc-300 font-mono text-xs tracking-widest uppercase mb-2">Silver Rate</span>
            <input 
              type="number"
              step="0.01"
              value={baseSilver}
              onChange={(e) => setBaseSilver(parseFloat(e.target.value) || 0)}
              className="w-full text-center bg-transparent text-3xl md:text-4xl font-serif font-black text-white focus:outline-none focus:text-zinc-300 transition-colors"
            />
            <div className="flex items-center gap-2 mt-3 text-[10px] text-zinc-500 font-mono uppercase">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              <span>Auto-Fetched</span>
            </div>
          </div>

          <div className="bg-[#0B0B0D] border border-zinc-800 p-6 rounded-lg flex flex-col justify-center items-center text-center shadow-inner relative overflow-hidden">
            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-zinc-500/50 to-transparent"></div>
            <span className="text-zinc-400 font-mono text-xs tracking-widest uppercase mb-2">Platinum Rate</span>
            <input 
              type="number"
              value={basePlatinum}
              onChange={(e) => setBasePlatinum(parseFloat(e.target.value) || 0)}
              className="w-full text-center bg-transparent text-3xl md:text-4xl font-serif font-black text-white focus:outline-none focus:text-zinc-400 transition-colors"
            />
            <div className="flex items-center gap-2 mt-3 text-[10px] text-zinc-500 font-mono uppercase">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              <span>Auto-Fetched</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SECTION 2: CALCULATION SETTINGS */}
        <div className="bg-[#15161A] border border-zinc-800 hover:border-[#D4AF37]/30 transition-colors duration-500 rounded-xl p-6 shadow-xl relative">
          <h2 className="text-xl font-serif font-black text-[#F8F5EE] uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-4 mb-6">
            <Cpu className="w-5 h-5 text-[#D4AF37]" /> Calculation Engine
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-zinc-300 uppercase tracking-widest mb-1.5 flex justify-between items-center">
                  <span>Silver Pur. Offset</span>
                  <span className="text-zinc-600 font-normal">flat</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-zinc-500 font-mono text-sm">+</span>
                  <input 
                    type="number" 
                    value={calcSettings.silverPurchaseOffset}
                    onChange={(e)=>setCalcSettings({...calcSettings, silverPurchaseOffset: parseInt(e.target.value)})}
                    className="w-full bg-[#0B0B0D] border border-zinc-700 focus:border-[#D4AF37] rounded p-2.5 pl-7 font-mono text-white text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5 flex justify-between items-center">
                  <span>Plat. Pur. Offset</span>
                  <span className="text-zinc-600 font-normal">flat</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-zinc-500 font-mono text-sm">+</span>
                  <input 
                    type="number" 
                    value={calcSettings.platinumPurchaseOffset}
                    onChange={(e)=>setCalcSettings({...calcSettings, platinumPurchaseOffset: parseInt(e.target.value)})}
                    className="w-full bg-[#0B0B0D] border border-zinc-700 focus:border-[#D4AF37] rounded p-2.5 pl-7 font-mono text-white text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6 border-t border-zinc-800 pt-6">
              <button 
                onClick={saveSettings} 
                className="bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold font-serif text-sm px-6 py-2.5 rounded transition-all flex items-center gap-2 tracking-wide uppercase"
              >
                <Save className="w-4 h-4"/> Save Settings
              </button>
              <button onClick={resetSettings} className="text-zinc-400 hover:text-white font-mono text-[11px] uppercase tracking-widest border-b border-transparent hover:border-zinc-400 transition-colors pb-0.5">
                Reset Defaults
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 3: LIVE CALCULATION PREVIEW */}
        <div className="bg-[#15161A] border border-[#D4AF37]/30 rounded-xl p-6 shadow-[0_0_30px_rgba(212,175,55,0.04)] relative flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent pointer-events-none rounded-xl"></div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#D4AF37]/20 pb-4 mb-6 relative z-10 gap-4">
            <h2 className="text-xl font-serif font-black text-[#F8F5EE] uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#D4AF37]" /> Current Rates
            </h2>
            <button 
              onClick={syncMarketsApi} 
              className="bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(34,197,94,0.3)] font-mono text-xs font-bold py-2 px-5 rounded transition-all tracking-widest uppercase flex items-center gap-2"
            >
              Force Sync API
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 flex-1 relative z-10">
            {/* ROW 1 */}
            <div className="bg-[#0B0B0D] border border-zinc-800 p-3.5 rounded flex justify-between items-center group hover:border-[#D4AF37]/50 transition-colors">
              <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">24K Sale</span>
              <span className="font-serif font-black text-lg text-[#D4AF37]">{formatPrice(rates.gold24k)}</span>
            </div>
            <div className="bg-[#0B0B0D] border border-zinc-800 p-3.5 rounded flex justify-between items-center group hover:border-zinc-500 transition-colors">
              <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">24K Purchase</span>
              <span className="font-serif font-bold text-base text-zinc-300">{formatPrice(rates.gold24kPurchase || 0)}</span>
            </div>

            {/* ROW 2 */}
            <div className="bg-[#0B0B0D] border border-zinc-800 p-3.5 rounded flex justify-between items-center group hover:border-[#D4AF37]/50 transition-colors">
              <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">22K Sale</span>
              <span className="font-serif font-black text-lg text-[#D4AF37]">{formatPrice(rates.gold22k)}</span>
            </div>
            <div className="bg-[#0B0B0D] border border-zinc-800 p-3.5 rounded flex justify-between items-center group hover:border-zinc-500 transition-colors">
              <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">22K Purchase</span>
              <span className="font-serif font-bold text-base text-zinc-300">{formatPrice(rates.gold22kPurchase || 0)}</span>
            </div>

            {/* ROW 3 */}
            <div className="bg-[#0B0B0D] border border-zinc-800 p-3.5 rounded flex justify-between items-center group hover:border-[#D4AF37]/50 transition-colors">
              <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">18K Sale</span>
              <span className="font-serif font-black text-lg text-[#D4AF37]">{formatPrice(rates.gold18k)}</span>
            </div>
            <div className="bg-[#0B0B0D] border border-zinc-800 p-3.5 rounded flex justify-between items-center group hover:border-zinc-500 transition-colors">
              <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">18K Purchase</span>
              <span className="font-serif font-bold text-base text-zinc-300">{formatPrice(rates.gold18kPurchase || 0)}</span>
            </div>

            {/* ROW 4 */}
            <div className="bg-[#0B0B0D] border border-zinc-800 p-3.5 rounded flex justify-between items-center group hover:border-zinc-400 transition-colors">
              <span className="font-mono text-[11px] text-zinc-400 uppercase tracking-widest">Silver Sale</span>
              <span className="font-serif font-black text-lg text-zinc-200">{formatPrice(rates.silver, true)}</span>
            </div>
            <div className="bg-[#0B0B0D] border border-zinc-800 p-3.5 rounded flex justify-between items-center group hover:border-zinc-500 transition-colors">
              <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest">Silver Purchase</span>
              <span className="font-serif font-bold text-base text-zinc-400">{formatPrice(rates.silverPurchase || 0, true)}</span>
            </div>

            {/* ROW 5 */}
            <div className="bg-[#0B0B0D] border border-zinc-800 p-3.5 rounded flex justify-between items-center group hover:border-zinc-400 transition-colors">
              <span className="font-mono text-[11px] text-zinc-400 uppercase tracking-widest">Plat. Sale</span>
              <span className="font-serif font-black text-lg text-zinc-300">{formatPrice(rates.platinum)}</span>
            </div>
            <div className="bg-[#0B0B0D] border border-zinc-800 p-3.5 rounded flex justify-between items-center group hover:border-zinc-500 transition-colors">
              <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest">Plat. Purchase</span>
              <span className="font-serif font-bold text-base text-zinc-400">{formatPrice(rates.platinumPurchase || 0)}</span>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* SECTION 4: AUTO SYNC SETTINGS */}
        <div className="bg-[#15161A] border border-zinc-800 hover:border-zinc-700 transition-colors rounded-xl p-6 shadow-xl relative">
          <h2 className="text-xl font-serif font-black text-[#F8F5EE] uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-4 mb-6">
            <RefreshCw className="w-5 h-5 text-[#D4AF37]" /> Automatic Synchronization
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-mono text-[#D4AF37] uppercase tracking-widest mb-3">Auto Sync Interval (Minutes)</label>
              <select 
                 value={calcSettings.syncIntervalMinutes}
                 onChange={(e) => setCalcSettings({...calcSettings, syncIntervalMinutes: parseInt(e.target.value)})}
                 className="w-full bg-[#0B0B0D] border border-zinc-700 focus:border-[#D4AF37] rounded-lg p-3 font-mono text-zinc-300 text-sm outline-none transition-colors">
                <option value={1}>1 Minute</option>
                <option value={5}>5 Minutes</option>
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={60}>60 Minutes</option>
                <option value={9999999}>Manual Only</option>
              </select>
            </div>

            <div className="flex flex-col gap-4 bg-[#0B0B0D] p-5 rounded-lg border border-zinc-800">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-[13px] font-mono text-zinc-300 uppercase tracking-wider group-hover:text-white transition-colors">Enable Auto Sync</span>
                <input 
                  type="checkbox" 
                  checked={calcSettings.enableAutoSync} 
                  onChange={(e) => setCalcSettings({...calcSettings, enableAutoSync: e.target.checked})}
                  className="w-4 h-4 accent-[#D4AF37] cursor-pointer" 
                />
              </label>
              <div className="w-full h-px bg-zinc-800/60"></div>
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-[13px] font-mono text-zinc-300 uppercase tracking-wider group-hover:text-white transition-colors">Store Rates in Database</span>
                <input 
                  type="checkbox" 
                  checked={calcSettings.storeRatesInDb} 
                  onChange={(e) => setCalcSettings({...calcSettings, storeRatesInDb: e.target.checked})}
                  className="w-4 h-4 accent-[#D4AF37] cursor-pointer" 
                />
              </label>
              <div className="w-full h-px bg-zinc-800/60"></div>
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-[13px] font-mono text-zinc-300 uppercase tracking-wider group-hover:text-white transition-colors">Enable WebSocket Push</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#D4AF37] cursor-pointer" />
              </label>
              <div className="w-full h-px bg-zinc-800/60"></div>
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-[13px] font-mono text-zinc-300 uppercase tracking-wider group-hover:text-white transition-colors">Enable Branch Sync</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#D4AF37] cursor-pointer" />
              </label>
            </div>

            <div className="mt-4 pt-2">
              <button onClick={saveSettings} className="w-full sm:w-auto bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-serif font-bold text-sm px-6 py-3 rounded transition-all uppercase tracking-wide">
                Save Sync Settings
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 7: API CONFIGURATION */}
        <div className="bg-[#15161A] border border-zinc-800 hover:border-zinc-700 transition-colors rounded-xl p-6 shadow-xl relative">
          <h2 className="text-xl font-serif font-black text-[#F8F5EE] uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-4 mb-6">
            <Link className="w-5 h-5 text-[#D4AF37]" /> API Configuration
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Rate API URL</label>
              <input 
                type="text" 
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="w-full bg-[#0B0B0D] border border-zinc-700 focus:border-[#D4AF37] rounded p-2.5 font-mono text-zinc-300 text-sm" 
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">API Key</label>
                <input type="password" defaultValue="str_test_12345" className="w-full bg-[#0B0B0D] border border-zinc-700 focus:border-[#D4AF37] rounded p-2.5 font-mono text-zinc-300 text-[18px] tracking-widest" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Timeout</label>
                  <input type="number" defaultValue="5000" className="w-full bg-[#0B0B0D] border border-zinc-700 focus:border-[#D4AF37] rounded p-2.5 font-mono text-zinc-300 text-sm" />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Retries</label>
                  <input type="number" defaultValue="3" className="w-full bg-[#0B0B0D] border border-zinc-700 focus:border-[#D4AF37] rounded p-2.5 font-mono text-zinc-300 text-sm" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 border-t border-zinc-800 pt-6">
              <button onClick={saveApiSettings} className="w-full sm:w-auto bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-serif font-bold text-sm px-6 py-2.5 rounded transition-all uppercase tracking-wide">
                Save API Settings
              </button>
              <button className="text-zinc-400 hover:text-emerald-400 font-mono text-xs flex items-center gap-1.5 outline-none tracking-wider uppercase transition-colors">
                <ShieldCheck className="w-4 h-4"/> Test Connection
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: CURRENT STORED RATES */}
      <div className="bg-[#15161A] border border-[#D4AF37]/20 rounded-xl p-6 shadow-xl relative mt-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none"></div>
        <h2 className="text-xl font-serif font-black text-[#F8F5EE] uppercase tracking-wider flex items-center gap-2 border-b border-[#D4AF37]/20 pb-4 mb-6 relative z-10">
          <Database className="w-5 h-5 text-[#D4AF37]" /> Current Stored Rates
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 relative z-10">
          {[
            { label: '24K Gold', value: rates.gold24k, pur: rates.gold24kPurchase },
            { label: '22K Gold', value: rates.gold22k, pur: rates.gold22kPurchase },
            { label: '18K Gold', value: rates.gold18k, pur: rates.gold18kPurchase },
            { label: 'Silver', value: rates.silver, pur: rates.silverPurchase },
            { label: 'Platinum', value: rates.platinum, pur: rates.platinumPurchase },
          ].map((item, idx) => (
            <div key={idx} className="bg-[#0B0B0D] border border-zinc-800 p-4 xl:p-5 rounded-lg flex flex-col gap-2 relative overflow-hidden group hover:border-[#D4AF37]/40 transition-colors">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#D4AF37]/5 rounded-bl-full pointer-events-none group-hover:bg-[#D4AF37]/10 transition-colors"></div>
              <span className="font-mono text-xs text-[#D4AF37] uppercase font-bold tracking-widest">{item.label}</span>
              <div className="flex flex-col mt-1">
                <span className="font-serif font-black text-2xl text-white drop-shadow-md">{formatPrice(item.value, item.label==='Silver')}</span>
                <span className="font-mono text-xs text-zinc-500 mt-1 uppercase">Pur: {formatPrice(item.pur || 0, item.label==='Silver')}</span>
              </div>
              <div className="flex items-center justify-between w-full border-t border-zinc-800/80 pt-2 mt-2">
                <span className="text-[9px] text-zinc-600 font-mono">Updated: Just now</span>
                <span className="text-[9px] text-emerald-500 font-mono font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse block"></span> LIVE</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: RATE HISTORY */}
      <div className="bg-[#15161A] border border-zinc-800 hover:border-[#D4AF37]/20 transition-colors rounded-xl p-6 shadow-xl relative mt-4 overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-800 pb-4 mb-6 gap-4">
          <h2 className="text-xl font-serif font-black text-[#F8F5EE] uppercase tracking-wider flex items-center gap-2">
            <History className="w-5 h-5 text-[#D4AF37]" /> Rate History Log
          </h2>
          <div className="flex shrink-0 gap-2">
            <button className="bg-[#0B0B0D] border border-zinc-700 hover:border-[#D4AF37] text-zinc-300 hover:text-[#D4AF37] font-mono text-[10px] uppercase font-bold px-3 py-2 rounded flex items-center gap-2 transition-all">
              <DownloadCloud className="w-3.5 h-3.5"/> Export Excel
            </button>
            <button className="bg-[#0B0B0D] border border-zinc-700 hover:border-[#D4AF37] text-zinc-300 hover:text-[#D4AF37] font-mono text-[10px] uppercase font-bold px-3 py-2 rounded flex items-center gap-2 transition-all">
              <DownloadCloud className="w-3.5 h-3.5"/> Export CSV
            </button>
            <button className="bg-[#0B0B0D] border border-zinc-700 hover:border-[#D4AF37] text-zinc-300 hover:text-[#D4AF37] font-mono text-[10px] uppercase font-bold px-3 py-2 rounded flex items-center gap-2 transition-all">
              <DownloadCloud className="w-3.5 h-3.5"/> Export PDF
            </button>
          </div>
        </div>
        <div className="w-full overflow-x-auto mb-10">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-zinc-800 bg-[#0B0B0D]/50">
                <th className="p-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Date</th>
                <th className="p-4 text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold">24K Gold</th>
                <th className="p-4 text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold">22K Gold</th>
                <th className="p-4 text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold">18K Gold</th>
                <th className="p-4 text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Silver</th>
                <th className="p-4 text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Platinum</th>
                <th className="p-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Updated By</th>
                <th className="p-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold text-center">Source</th>
                <th className="p-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(history || []).slice(-10).reverse().map((h, i) => (
                <tr key={i} className="border-b border-zinc-800/50 hover:bg-[#D4AF37]/5 transition-colors group">
                  <td className="p-4 text-[11px] font-mono text-zinc-400">{h.date}</td>
                  <td className="p-4 text-sm font-serif font-black text-white group-hover:text-[#D4AF37] transition-colors">{formatPrice(h.rates.gold24k)}</td>
                  <td className="p-4 text-sm font-serif font-bold text-white">{formatPrice(h.rates.gold22k)}</td>
                  <td className="p-4 text-sm font-serif font-bold text-white">{formatPrice(h.rates.gold18k)}</td>
                  <td className="p-4 text-sm font-serif font-bold text-zinc-300">{formatPrice(h.rates.silver, true)}</td>
                  <td className="p-4 text-sm font-serif font-bold text-zinc-300">{formatPrice(h.rates.platinum)}</td>
                  <td className="p-4 text-[11px] font-mono text-zinc-400 uppercase">System Sync</td>
                  <td className="p-4 text-[10px] font-mono text-emerald-400 uppercase font-bold text-center bg-emerald-500/5 mx-auto">Calc Engine</td>
                  <td className="p-4 text-center">
                    <button className="text-zinc-500 hover:text-[#D4AF37] text-[10px] font-mono uppercase underline underline-offset-2">View</button>
                  </td>
                </tr>
              ))}
              {(!history || history.length === 0) && (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-zinc-500 font-mono text-sm tracking-wide uppercase">No historical data logs recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* SECTION 7: API CONNECTION DIAGNOSTICS & LOGS */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-800 pt-8 pb-4 mb-6 gap-4">
          <h2 className="text-xl font-serif font-black text-[#F8F5EE] uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#D4AF37]" /> System Sync Logs
          </h2>
          <button 
             onClick={syncMarketsApi}
             className="bg-[#0B0B0D] border border-zinc-700 hover:border-[#D4AF37] text-zinc-300 hover:text-[#D4AF37] font-mono text-[10px] uppercase font-bold px-3 py-2 rounded flex items-center gap-2 transition-all">
            <RefreshCw className="w-3.5 h-3.5"/> Refresh Logs
          </button>
        </div>
        <div className="w-full overflow-x-auto mb-10">
          <SystemSyncLogs />
        </div>

        {/* SECTION 8: EXTERNAL CRON / SYNOLOGY NAS */}
        <div className="border border-zinc-800 rounded bg-[#0B0B0D] p-6 mb-6">
          <h2 className="text-lg font-serif font-black text-[#F8F5EE] uppercase tracking-wider mb-2">Synology NAS Task Scheduler Setup</h2>
          <p className="text-zinc-400 text-sm mb-4">You can use your Synology NAS to run a scheduled task that securely pulls and formulates the latest rates at your desired interval.</p>
          
          <div className="bg-[#15161A] border border-zinc-800 rounded p-4 relative mb-6">
            <div className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-widest mb-2 font-bold bg-[#15161A]">Run Command / User-defined script</div>
            <code className="block text-xs font-mono text-zinc-300 select-all break-all pr-12 bg-black/50 p-3 rounded mt-2 border border-zinc-800">
              curl -X GET {window.location.origin}/api/rates/sync
            </code>
          </div>

          <div className="space-y-3">
            <h3 className="text-[11px] font-mono text-zinc-300 uppercase tracking-widest font-bold">Step-by-Step Instructions</h3>
            <ol className="list-decimal pl-4 space-y-2 text-sm text-zinc-400 font-sans">
              <li>Log into your Synology NAS (DSM).</li>
              <li>Open <strong>Control Panel</strong> and navigate to <strong>Task Scheduler</strong>.</li>
              <li>Click <strong>Create</strong> &gt; <strong>Scheduled Task</strong> &gt; <strong>User-defined script</strong>.</li>
              <li>On the <strong>General</strong> tab, enter a Task name (e.g., "Gold Rate Sync"). Set the user to your username.</li>
              <li>On the <strong>Schedule</strong> tab, choose how frequently you want this to run (e.g., daily, or every 10 minutes).</li>
              <li>On the <strong>Task Settings</strong> tab, under "Run command" or "User-defined script", paste the curl command shown above.</li>
              <li>Click <strong>OK</strong> to save. The NAS will now manage the automatic updates on your schedule!</li>
            </ol>
          </div>
        </div>
      </div>

    </div>
  );
}

function SystemSyncLogs() {
  const [logs, setLogs] = useState<any[]>([]);

  const fetchLogs = () => {
    fetch('/api/logs')
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return res.json();
        } else {
          return [];
        }
      })
      .then(data => {
        if (Array.isArray(data)) {
          setLogs(data);
        } else {
          console.error("Failed to fetch logs:", data);
          setLogs([]);
        }
      })
      .catch(err => {
        console.error("Fetch logs error:", err);
        setLogs([]);
      });
  };

  useEffect(() => {
    fetchLogs();
    const int = setInterval(fetchLogs, 60000);
    return () => clearInterval(int);
  }, []);

  return (
    <table className="w-full text-left border-collapse min-w-[600px]">
      <thead>
        <tr className="border-b border-zinc-800 bg-[#0B0B0D]/50">
          <th className="p-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Timestamp</th>
          <th className="p-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Status</th>
          <th className="p-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Details</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log: any, i: number) => (
          <tr key={i} className="border-b border-zinc-800/50 hover:bg-[#D4AF37]/5 transition-colors group">
            <td className="p-4 text-[11px] font-mono text-zinc-400">{new Date(log.createdAt).toLocaleString()}</td>
            <td className="p-4">
              <span className={`text-[10px] font-bold px-2 py-1 rounded bg-opacity-10 ${log.status === 'success' ? 'text-emerald-500 bg-emerald-500' : 'text-red-500 bg-red-500'} uppercase font-mono`}>
                {log.status}
              </span>
            </td>
            <td className="p-4 text-[11px] font-mono text-zinc-500">
              {log.status === 'success' ? 'Rates fetched and calculated successfully' : log.errorMessage}
            </td>
          </tr>
        ))}
        {logs.length === 0 && (
          <tr>
            <td colSpan={3} className="p-12 text-center text-zinc-500 font-mono text-sm tracking-wide uppercase">No sync logs available.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
