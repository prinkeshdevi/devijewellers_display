/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from './lib/firebase';
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
} from './types';
import { 
  INITIAL_RATES, 
  INITIAL_TRENDS, 
  INITIAL_BRANCHES, 
  INITIAL_DISPLAY_SETTING, 
  INITIAL_MEDIA, 
  INITIAL_PROMOS, 
  INITIAL_SALE_STATUS, 
  INITIAL_DISPLAYS, 
  INITIAL_LOGS, 
  INITIAL_USERS, 
  INITIAL_SYSTEM_CONFIG,
  INITIAL_HISTORY
} from './data/initialData';

// Component Imports
import AdminDashboard from './components/AdminDashboard';
import TVDisplay from './components/TVDisplay';
import MobileControl from './components/MobileControl';
import MediaManager from './components/MediaManager';
import PromoManager from './components/PromoManager';
import SaleStatus from './components/SaleStatus';
import RateSync from './components/RateSync';
import DisplayManager from './components/DisplayManager';
import ReportsAnalytics from './components/ReportsAnalytics';
import BranchManager from './components/BranchManager';
import SettingsComponent from './components/Settings';

// Icons
import { 
  Tv, 
  Smartphone, 
  LayoutDashboard, 
  Video, 
  Gift, 
  Activity, 
  RefreshCw, 
  Settings as SettingsIcon, 
  BarChart4, 
  Building2, 
  Users, 
  Sparkles,
  BookOpen,
  Menu,
  X,
  Radio,
  FileCheck2,
  LockKeyhole
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('admin_dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState<boolean>(true);

  // Auto-hide desktop sidebar when entering TV Display mode
  useEffect(() => {
    if (activeTab === 'tv_display') {
      setDesktopSidebarOpen(false);
    } else {
      setDesktopSidebarOpen(true);
    }
  }, [activeTab]);

  // Core persistent states
  const [rates, setRates] = useState<JewelleryRates>(INITIAL_RATES);
  const [trends, setTrends] = useState<RateTrends>(INITIAL_TRENDS);
  const [displaySetting, setDisplaySetting] = useState<DisplaySetting>(INITIAL_DISPLAY_SETTING);
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [media, setMedia] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [promos, setPromos] = useState<PromoItem[]>(INITIAL_PROMOS);
  const [saleStatuses, setSaleStatuses] = useState<SaleStatusItem[]>(INITIAL_SALE_STATUS);
  const [displays, setDisplays] = useState<ConnectedDisplay[]>(INITIAL_DISPLAYS);
  const [logs, setLogs] = useState<AuditLog[]>(INITIAL_LOGS);
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(INITIAL_SYSTEM_CONFIG);
  const [history, setHistory] = useState<RateHistoryEntry[]>(INITIAL_HISTORY);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // 1. Load initial states from localStorage if they exist, or seed them
  useEffect(() => {
    const getStored = <T,>(key: string, backup: T): T => {
      try {
        const item = localStorage.getItem(`asm_${key}`);
        return item ? JSON.parse(item) : backup;
      } catch (err) {
        return backup;
      }
    };

    setRates(getStored('rates', INITIAL_RATES));
    setTrends(getStored('trends', INITIAL_TRENDS));
    setDisplaySetting(getStored('displaySetting', INITIAL_DISPLAY_SETTING));
    setBranches(getStored('branches', INITIAL_BRANCHES));
    setMedia(getStored('media', INITIAL_MEDIA));
    setPromos(getStored('promos', INITIAL_PROMOS));
    setSaleStatuses(getStored('saleStatuses', INITIAL_SALE_STATUS));
    setDisplays(getStored('displays', INITIAL_DISPLAYS));
    setLogs(getStored('logs', INITIAL_LOGS));
    setUsers(getStored('users', INITIAL_USERS));
    setSystemConfig(getStored('systemConfig', {
      ...INITIAL_SYSTEM_CONFIG,
      companyName: 'Devi Jewellers',
      logoText: 'DEVI JEWELLERS',
    }));
    setHistory(getStored('history', INITIAL_HISTORY));
    const savedSync = localStorage.getItem('asm_lastSyncTime');
    if (savedSync) setLastSyncTime(JSON.parse(savedSync));
  }, []);

  // Auto-sync rates periodically based on API
  useEffect(() => {
    if (!systemConfig?.rateApiUrl) return;

    const fetchRates = async () => {
      try {
        const res = await fetch('/api/rates?url=' + encodeURIComponent(systemConfig.rateApiUrl));
        if (!res.ok) return;
        const data = await res.json();
        
        const new24k = typeof data['24K Gold'] === 'number' ? data['24K Gold'] : parseFloat(data['24K Gold']);
        let newSilver = typeof data['Silver'] === 'number' ? data['Silver'] : parseFloat(data['Silver']);
        
        if (!isNaN(newSilver)) {
          newSilver = newSilver * 100;
        }

        const savedCalc = localStorage.getItem('calcSettings');
        const calcSettings = savedCalc ? JSON.parse(savedCalc) : {
          gold24kPurPct: 0.985,
          gold22kSalePct: 0.92,
          gold22kPurPct: 0.90,
          gold18kSalePct: 0.86,
          gold18kPurPct: 0.80,
          silverOffset: -5000,
          platinumOffset: -4000
        };

        if (!isNaN(new24k) && !isNaN(newSilver)) {
          const calculatedRates = {
            gold24k: Math.round(new24k),
            gold24kPurchase: Math.round(new24k * calcSettings.gold24kPurPct),
            gold22k: Math.round(new24k * calcSettings.gold22kSalePct),
            gold22kPurchase: Math.round(new24k * calcSettings.gold22kPurPct),
            gold20k: Math.round(new24k * 0.833),
            gold20kPurchase: Math.round(new24k * 0.833) - 200, 
            gold18k: Math.round(new24k * calcSettings.gold18kSalePct),
            gold18kPurchase: Math.round(new24k * calcSettings.gold18kPurPct),
            silver: Math.round(newSilver),
            silverPurchase: Math.round(newSilver + calcSettings.silverOffset),
          };

          const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          setLastSyncTime(nowStr);
          saveToStorage('lastSyncTime', nowStr);

          setRates((prev: JewelleryRates) => {
            if (prev.gold24k !== calculatedRates.gold24k || prev.silver !== calculatedRates.silver) {
              const nextRates = { ...prev, ...calculatedRates };
              saveToStorage('rates', nextRates);
              // Save to Firestore
              setDoc(doc(db, "system", "rates"), { 
                ...nextRates, 
                updatedAt: new Date().toISOString() 
              }, { merge: true }).catch(err => console.error("Firebase write error:", err));
              return nextRates;
            }
            return prev;
          });
        }
      } catch (err) {
        console.error("Auto Sync failed", err);
      }
    };

    // Auto update every 1 minute (60000 ms)
    const interval = setInterval(fetchRates, 60000);
    // Trigger immediately
    fetchRates();

    return () => clearInterval(interval);
  }, [systemConfig?.rateApiUrl]);

  // Listen to Firestore for real-time rates from other clients
  useEffect(() => {
    const unsubscribeRates = onSnapshot(doc(db, "system", "rates"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as JewelleryRates & { updatedAt?: string };
        const { updatedAt, ...ratesData } = data;
        setRates((prev) => {
          // Prevent unnecessary state updates if values are same
          if (JSON.stringify(prev) !== JSON.stringify(ratesData)) {
            saveToStorage('rates', ratesData);
            return ratesData as JewelleryRates;
          }
          return prev;
        });
      }
    });

    const unsubscribeHistory = onSnapshot(doc(db, "system", "history"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.entries && Array.isArray(data.entries)) {
          setHistory(data.entries);
          saveToStorage('history', data.entries);
        }
      }
    });

    return () => {
      unsubscribeRates();
      unsubscribeHistory();
    };
  }, []);

  // Sync to database triggers (localstorage helper)
  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(`asm_${key}`, JSON.stringify(data));
  };


  // State update proxies to keep storage aligned
  const handleUpdateRates = (newRates: JewelleryRates) => {
    setRates(newRates);
    saveToStorage('rates', newRates);
    setDoc(doc(db, "system", "rates"), { 
      ...newRates, 
      updatedAt: new Date().toISOString() 
    }, { merge: true }).catch(err => console.error("Firebase write error:", err));
  };

  const handleUpdateTrends = (newTrends: RateTrends) => {
    setTrends(newTrends);
    saveToStorage('trends', newTrends);
  };

  const handleUpdateDisplaySetting = (newSetting: Partial<DisplaySetting>) => {
    const next = { ...displaySetting, ...newSetting };
    setDisplaySetting(next);
    saveToStorage('displaySetting', next);
  };

  const handleUpdateBranches = (newBranches: Branch[]) => {
    setBranches(newBranches);
    saveToStorage('branches', newBranches);
  };

  const handleUpdateMedia = (newMedia: MediaItem[]) => {
    setMedia(newMedia);
    saveToStorage('media', newMedia);
  };

  const handleUpdatePromos = (newPromos: PromoItem[]) => {
    setPromos(newPromos);
    saveToStorage('promos', newPromos);
  };

  const handleUpdateSaleStatuses = (newStatuses: SaleStatusItem[]) => {
    setSaleStatuses(newStatuses);
    saveToStorage('saleStatuses', newStatuses);
  };

  const handleUpdateDisplays = (newDisplays: ConnectedDisplay[]) => {
    setDisplays(newDisplays);
    saveToStorage('displays', newDisplays);
  };

  const handleUpdateLogs = (newLogs: AuditLog[]) => {
    setLogs(newLogs);
    saveToStorage('logs', newLogs);
  };

  const handleUpdateUsers = (newUsers: UserAccount[]) => {
    setUsers(newUsers);
    saveToStorage('users', newUsers);
  };

  const handleUpdateSystemConfig = (newConfig: SystemConfig) => {
    setSystemConfig(newConfig);
    saveToStorage('systemConfig', newConfig);
  };

  const handleUpdateHistory = (newHistory: RateHistoryEntry[]) => {
    setHistory(newHistory);
    saveToStorage('history', newHistory);
    setDoc(doc(db, "system", "history"), { 
      entries: newHistory,
      updatedAt: new Date().toISOString() 
    }, { merge: true }).catch(err => console.error("Firebase write error:", err));
  };

  // Register dynamic log audits
  const triggerLogRecord = (action: string, details: string) => {
    const newLogEntry: AuditLog = {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString(),
      userEmail: 'someshai1702@gmail.com', // Active session user from workspace metadata
      action,
      details
    };
    const nextLogs = [newLogEntry, ...logs];
    setLogs(nextLogs);
    saveToStorage('logs', nextLogs);
  };

  // 2. Multi-Tab Real-time Auto-synchronization observer
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key || !e.newValue) return;
      
      const parsedData = JSON.parse(e.newValue);
      switch (e.key) {
        case 'asm_rates':
          setRates(parsedData);
          break;
        case 'asm_trends':
          setTrends(parsedData);
          break;
        case 'asm_displaySetting':
          setDisplaySetting(parsedData);
          break;
        case 'asm_promos':
          setPromos(parsedData);
          break;
        case 'asm_systemConfig':
          setSystemConfig(parsedData);
          break;
        default:
          break;
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Determine active promotions
  const activePromoObj = promos.find(p => p.id === displaySetting.campaignId);

  // Sidebar mapping
  const menuItems = [
    { id: 'admin_dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'tv_display', label: 'TV Display Screen', icon: Tv, accent: 'text-[#D4AF37]' },
    { id: 'mobile_control', label: 'Mobile Controller', icon: Smartphone },
    { id: 'rate_sync', label: 'Rate Sync Master', icon: RefreshCw },
    { id: 'media_manager', label: 'Media Signage Desk', icon: Video },
    { id: 'promo_manager', label: 'Campaigns & Offers', icon: Gift },
    { id: 'sale_status', label: 'Seasonal Status Tags', icon: Activity },
    { id: 'branch_manager', label: 'Branch Management', icon: Building2 },
    { id: 'settings', label: 'Global Settings Desk', icon: SettingsIcon }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'admin_dashboard':
        return (
          <AdminDashboard 
            rates={rates}
            displays={displays}
            branches={branches}
            promos={promos}
            logs={logs}
            displaySetting={displaySetting}
            onNavigate={(tab) => setActiveTab(tab)}
            onUpdateDisplaySetting={handleUpdateDisplaySetting}
            onTriggerLog={triggerLogRecord}
          />
        );
      case 'tv_display':
        return (
          <div className="rounded-xl border border-[#D4AF37]/35 overflow-hidden shadow-2xl relative">
            <TVDisplay 
              rates={rates}
              trends={trends}
              mode={displaySetting.mode}
              theme={displaySetting.theme}
              tickerText={displaySetting.tickerText}
              announcementText={displaySetting.announcementText}
              showAnnouncement={displaySetting.showAnnouncement}
              isBlackout={displaySetting.isBlackout}
              isPaused={displaySetting.isPaused}
              companyConfig={systemConfig}
              activePromo={activePromoObj}
              customPrimaryBg={displaySetting.customPrimaryBg}
              customSecondaryBg={displaySetting.customSecondaryBg}
              customCardBg={displaySetting.customCardBg}
              customGoldColor={displaySetting.customGoldColor}
              rateFontSize={displaySetting.rateFontSize}
              goldFontSize={displaySetting.goldFontSize}
              silverFontSize={displaySetting.silverFontSize}
              labelFontSize={displaySetting.labelFontSize}
              visibleRates={displaySetting.visibleRates}
              media={media}
              mediaLoopEnabled={displaySetting.mediaLoopEnabled !== false}
              rotateBackgroundEnabled={displaySetting.rotateBackgroundEnabled}
              ratesDisplayDuration={displaySetting.ratesDisplayDuration}
              slideshowDisplayDuration={displaySetting.slideshowDisplayDuration}
            />
          </div>
        );
      case 'mobile_control':
        return (
          <MobileControl 
            rates={rates}
            trends={trends}
            onUpdateRates={handleUpdateRates}
            onUpdateTrends={handleUpdateTrends}
            displaySetting={displaySetting}
            onUpdateDisplaySetting={handleUpdateDisplaySetting}
            promos={promos}
            systemConfig={systemConfig}
            onTriggerLog={triggerLogRecord}
          />
        );
      case 'media_manager':
        return (
          <MediaManager 
            media={media}
            onUpdateMedia={handleUpdateMedia}
            onTriggerLog={triggerLogRecord}
            displaySetting={displaySetting}
            onUpdateDisplaySetting={handleUpdateDisplaySetting}
          />
        );
      case 'promo_manager':
        return (
          <PromoManager 
            promos={promos}
            onUpdatePromos={handleUpdatePromos}
            onTriggerLog={triggerLogRecord}
          />
        );
      case 'sale_status':
        return (
          <SaleStatus 
            rates={rates}
            saleStatuses={saleStatuses}
            branches={branches}
            onUpdateSaleStatuses={handleUpdateSaleStatuses}
            onTriggerLog={triggerLogRecord}
          />
        );
      case 'rate_sync':
        return (
          <RateSync 
            rates={rates}
            trends={trends}
            history={history}
            systemConfig={systemConfig}
            lastSyncTime={lastSyncTime}
            onUpdateRates={handleUpdateRates}
            onUpdateTrends={handleUpdateTrends}
            onUpdateHistory={handleUpdateHistory}
            onUpdateSystemConfig={handleUpdateSystemConfig}
            onTriggerLog={triggerLogRecord}
          />
        );
      case 'display_manager':
        return (
          <DisplayManager 
            displays={displays}
            branches={branches}
            onUpdateDisplays={handleUpdateDisplays}
            onTriggerLog={triggerLogRecord}
          />
        );
      case 'reports_analytics':
        return (
          <ReportsAnalytics 
            history={history}
            rates={rates}
          />
        );
      case 'branch_manager':
        return (
          <BranchManager 
            branches={branches}
            onUpdateBranches={handleUpdateBranches}
            onTriggerLog={triggerLogRecord}
          />
        );
      case 'settings':
        return (
          <SettingsComponent 
            systemConfig={systemConfig}
            onUpdateSystemConfig={handleUpdateSystemConfig}
            onTriggerLog={triggerLogRecord}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div id="app-workspace-container" className="min-h-screen bg-[#0B0B0D] text-[#F8F5EE] flex font-sans select-none antialiased">
      
      {/* SIDEBAR NAVIGATION WORKSPACE */}
      {/* Desktop Sidebar */}
      {desktopSidebarOpen && (
        <aside className="hidden lg:flex flex-col w-64 bg-[#111216] border-r border-[#D4AF37]/15 leading-relaxed p-4 h-screen sticky top-0 justify-between select-none shrink-0 transition-transform">
          
          <div>
            {/* Branded Logo Column */}
            <div className="flex items-center gap-3 px-2 py-4 border-b border-zinc-800/80 mb-5 select-none">
              <div className="w-10 h-10 rounded-full border border-[#D4AF37] flex items-center justify-center shadow-md bg-[#D4AF37]/5 shrink-0">
                <Sparkles className="w-5 h-5 text-[#D4AF37] animate-pulse" />
              </div>
              <div>
                <h1 className="text-sm font-black font-serif tracking-[0.15em] gold-gradient uppercase" id="app-brand-title">
                  {systemConfig.logoText || 'DEVIJEWELLERS'}
                </h1>
                <p className="text-[9px] text-[#D4AF37]/70 font-mono uppercase tracking-[0.2em] leading-none mt-0.5 font-bold">PRESTIGE ATELIER</p>
              </div>
            </div>

            <nav className="flex flex-col gap-1 overflow-y-auto max-h-[80vh] pr-1">
              {menuItems.map((item) => {
                const IconComp = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    id={`sidebar-item-${item.id}`}
                    className={`flex items-center gap-3 px-3 py-2 rounded text-xs transition-all tracking-wider text-left ${
                      isActive 
                        ? 'bg-[#D4AF37]/15 text-[#D4AF37] font-semibold border-l-2 border-[#D4AF37]' 
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                    }`}
                  >
                    <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#D4AF37]' : 'text-zinc-500'}`} />
                    <span className="font-serif uppercase tracking-wide">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Footer info Super Admin */}
          <div className="border-t border-zinc-850 pt-3 flex flex-col gap-1 pl-2 select-none">
            <div className="flex items-center gap-2">
              <LockKeyhole className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[10px] font-mono font-bold text-zinc-300">someshai1702@gmail.com</span>
            </div>
            <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Atelier Master Key • v4.5</p>
          </div>

        </aside>
      )}

      {/* Mobile / Toggle drawer menus */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex">
          <div className="w-64 bg-[#111216] border-r border-[#D4AF37]/30 p-4 shrink-0 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center bg-black/40 p-2 rounded mb-4">
                <span className="text-xs font-bold font-serif text-[#D4AF37]">Signage Menu</span>
                <button onClick={() => setSidebarOpen(false)} className="text-zinc-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-1 max-h-[70vh] overflow-y-auto">
                {menuItems.map((item) => {
                  const IconComp = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                      className={`flex items-center gap-3 px-3 py-2 rounded text-xs transition-all tracking-wider text-left ${
                        isActive 
                          ? 'bg-[#D4AF37]/15 text-[#D4AF37] font-semibold' 
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                      <span className="font-serif uppercase tracking-wide">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-[9px] font-mono text-zinc-600 uppercase">
              Auth: someshai1702
            </div>
          </div>
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* CORE FRAME CONTAINER */}
      <div className="flex-1 flex flex-col relative w-full h-screen overflow-hidden">
        
        {/* Floating Hamburger icon for Desktop TV Display mode */}
        {!desktopSidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(true)}
            className="hidden lg:flex fixed top-4 left-4 z-[9999] p-3 bg-black/80 backdrop-blur border border-[#D4AF37] rounded-lg text-[#D4AF37] shadow-xl hover:bg-zinc-800 transition-all opacity-60 hover:opacity-100"
            title="Open Menu"
          >
            <Menu className="w-7 h-7" />
          </button>
        )}

        {/* MOBILE CONTROL TOP BAR (Hide in TV mode) */}
        {activeTab !== 'tv_display' && (
          <header className="flex lg:hidden justify-between items-center bg-[#111216] border-b border-zinc-850 px-4 py-3 sticky top-0 z-40 select-none">
            <div className="flex items-center gap-2">
              <button onClick={() => setSidebarOpen(true)} className="p-1.5 text-zinc-400 hover:text-white">
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xs font-bold font-serif tracking-[0.2em] text-[#D4AF37]">
                {systemConfig.logoText || 'DEVIJEWELLERS'}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[9px] font-mono text-zinc-400">ACTIVE SYNC</span>
            </div>
          </header>
        )}

        {/* WORK SURFACE SCROLLER */}
        <main className={`flex-1 overflow-y-auto ${activeTab === 'tv_display' ? 'pb-0' : 'pb-16'}`}>
          <div className="w-full mx-auto animate-fade-in h-full relative">
            {renderActiveComponent()}
          </div>
        </main>

      </div>

    </div>
  );
}
