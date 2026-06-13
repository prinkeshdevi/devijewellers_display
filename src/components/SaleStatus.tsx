/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { SaleStatusItem, Branch, JewelleryRates, SystemConfig } from '../types';
import { 
  CheckCircle, 
  PlusCircle, 
  X, 
  MapPin, 
  Activity, 
  Tag, 
  Sparkles, 
  Download, 
  Share2, 
  Printer, 
  Smartphone, 
  Palette, 
  Check, 
  Layers, 
  Copy, 
  Clock, 
  Send,
  Building,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface SaleStatusProps {
  rates: JewelleryRates;
  saleStatuses: SaleStatusItem[];
  branches: Branch[];
  systemConfig: SystemConfig;
  onUpdateSaleStatuses: (newStatuses: SaleStatusItem[]) => void;
  onTriggerLog: (action: string, details: string) => void;
}

export default function SaleStatus({
  rates,
  saleStatuses,
  branches,
  systemConfig,
  onUpdateSaleStatuses,
  onTriggerLog
}: SaleStatusProps) {
  
  // Navigation tabs of Section
  const [activeSubTab, setActiveSubTab] = useState<'poster_studio' | 'campaign_tags'>('poster_studio');

  // --- TAB 1: POSTER STUDIO CONFIGURATION STATES ---
  const [activeTheme, setActiveTheme] = useState<'midnight_gold' | 'festival_gold' | 'wedding_gold' | 'premium_black'>('midnight_gold');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5' | '9:16'>('1:1');
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branches[0]?.id || 'b1');
  const [headerTitle, setHeaderTitle] = useState<string>('DAILY RATES');
  const [greetingText, setGreetingText] = useState<string>('A Legacy of Purity & Timeless Trust');
  const [show24k, setShow24k] = useState<boolean>(true);
  const [show22k, setShow22k] = useState<boolean>(true);
  const [show18k, setShow18k] = useState<boolean>(true);
  const [showSilver, setShowSilver] = useState<boolean>(true);
  const [showPlatinum, setShowPlatinum] = useState<boolean>(false);
  const [customRatesNote, setCustomRatesNote] = useState<string>('* Rates are subject to market fluctuations. Verify at billing desk.');
  const [currentTime, setCurrentTime] = useState<string>('');

  // Social share dialog states
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [sharePlatform, setSharePlatform] = useState<'whatsapp' | 'instagram'>('whatsapp');
  const [copiedText, setCopiedText] = useState<boolean>(false);

  // --- TAB 2: CAMPAIGN STATUS DESK FIELDS ---
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newTag, setNewTag] = useState<'New Collection' | 'Gold Offer' | 'Diamond Offer' | 'Exchange Offer'>('Gold Offer');
  const [newStatus, setNewStatus] = useState<'active' | 'upcoming' | 'expired'>('active');
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);

  // Update clock live on load
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeBranch = branches.find(b => b.id === selectedBranchId) || branches[0];
  const activeBranchName = activeBranch ? activeBranch.name : 'DEVIJEWELLERS EXCLUSIVE SHOWROOM';
  const activeBranchAddress = activeBranch ? activeBranch.address : '';
  const activeBranchContact = activeBranch ? activeBranch.contact : '';

  // Currency Formatter
  const formatINR = (val: number, isSilver = false) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.abs(val || 0));
  };

  // Generate Social Sharing Text
  const getShareableText = () => {
    const divider = '━━━━━━━━━━━━━━━━━━━━';
    const timeStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    let text = `👑 *${headerTitle}* 👑\n📍 _${activeBranchName.toUpperCase()}_\n📅 ${timeStr}\n${divider}\n`;
    if (show24k) text += `✨ *24K Gold:* ₹${rates.gold24k}/10g\n`;
    if (show22k) text += `🏆 *22K Gold:* ₹${rates.gold22k}/10g\n`;
    if (show18k) text += `💎 *18K Gold:* ₹${rates.gold18k}/10g\n`;
    if (showSilver) text += `🪙 *Silver:* ₹${rates.silver}/kg\n`;
    if (showPlatinum) text += `💍 *Platinum pt950:* ₹${rates.platinum}/10g\n`;
    text += `${divider}\n💬 _${greetingText}_\n📞 Contact: ${activeBranchContact}\n🏛️ ${customRatesNote}`;
    return text;
  };

  const copyShareableText = () => {
    navigator.clipboard.writeText(getShareableText());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // HTML CANVAS - PIXEL-PERFECT PNG GENERATION
  const drawPosterCanvas = async (): Promise<HTMLCanvasElement | null> => {
    const canvas = document.createElement('canvas');
    let cWidth = 1200;
    let cHeight = 1200;
    if (aspectRatio === '4:5') cHeight = 1500;
    if (aspectRatio === '9:16') cHeight = 2133;
    
    canvas.width = cWidth;
    canvas.height = cHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Determine colors based on activeTheme
    let bgColor = '#0B0B0D';
    let cardBg = '#15161A';
    let accentColor = '#D4AF37'; // gold
    let headerText = '#F8F5EE';
    let textColor = '#FFFFFF';
    let mutedTextColor = '#9CA3AF';
    let borderStyle: 'double' | 'solid' | 'ornament' = 'double';

    if (activeTheme === 'midnight_gold') {
      bgColor = '#0B0B0D';
      cardBg = '#15161A';
      accentColor = '#D4AF37';
      borderStyle = 'double';
    } else if (activeTheme === 'festival_gold') {
      bgColor = '#23040A'; // deep wine red
      cardBg = '#3D0A14';
      accentColor = '#F4D03F'; // warm champagne gold
      borderStyle = 'ornament';
    } else if (activeTheme === 'wedding_gold') {
      bgColor = '#331005'; // amber chocolate
      cardBg = '#4F1E0F';
      accentColor = '#FFD700'; // rich gold
      borderStyle = 'solid';
    } else if (activeTheme === 'premium_black') {
      bgColor = '#000000';
      cardBg = '#111111';
      accentColor = '#D4AF37';
      borderStyle = 'solid';
    }

    // 1. Fill outer background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, cWidth, cHeight);

    // 2. Draw luxury borders
    ctx.lineWidth = 3;
    ctx.strokeStyle = accentColor;
    ctx.strokeRect(30, 30, cWidth - 60, cHeight - 60);

    ctx.lineWidth = 1;
    ctx.strokeStyle = `${accentColor}80`;
    ctx.strokeRect(40, 40, cWidth - 80, cHeight - 80);

    if (borderStyle === 'double') {
      // Midnight gold double border
      ctx.lineWidth = 2;
      ctx.strokeStyle = `${accentColor}44`;
      ctx.strokeRect(55, 55, cWidth - 110, cHeight - 110);
    } else if (borderStyle === 'ornament') {
      // Draw luxury outer corner squares or stars
      ctx.fillStyle = accentColor;
      const cornerSize = 15;
      const xOffsets = [60, cWidth - 60];
      const yOffsets = [60, cHeight - 60];
      xOffsets.forEach(x => {
        yOffsets.forEach(y => {
          ctx.beginPath();
          ctx.arc(x, y, cornerSize, 0, Math.PI * 2);
          ctx.fill();
        });
      });
    }

    // Now, push all the following content down by an offset to center vertically.
    const verticalOffset = (cHeight - 1200) / 2;
    ctx.translate(0, verticalOffset);

    // 3. Draw Inner Panel Card
    ctx.fillStyle = cardBg;
    ctx.beginPath();
    ctx.roundRect(80, 80, 1040, 1040, 16);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = `${accentColor}40`;
    ctx.stroke();

    // 4. Logo element
    const logoImg = new Image();
    logoImg.src = systemConfig.logoImageBase64 ? systemConfig.logoImageBase64 : '/logo.png';
    logoImg.crossOrigin = 'anonymous';

    await new Promise((resolve) => {
      logoImg.onload = resolve;
      logoImg.onerror = resolve; // Continue if drawing fails
    });

    if (logoImg.complete && logoImg.naturalWidth) {
      const targetHeight = 160;
      const targetWidth = logoImg.width * (targetHeight / logoImg.height);
      ctx.drawImage(logoImg, 600 - targetWidth / 2, 160, targetWidth, targetHeight);
    } else if (!logoImg.complete || !logoImg.naturalWidth) {
      if (systemConfig.logoText) {
          ctx.fillStyle = accentColor;
          ctx.font = "bold 56px 'Poppins', sans-serif";
          ctx.textAlign = 'center';
          ctx.letterSpacing = "4px";
          ctx.fillText(systemConfig.logoText, 600, 240);
      }
    }

    // 5. Time and Address Block
    ctx.textAlign = 'center';
    ctx.fillStyle = mutedTextColor;
    ctx.font = "bold 20px 'Poppins', Sans-serif";
    ctx.letterSpacing = "2px";
    ctx.fillText(`${currentTime ? currentTime.split(',')[0] : new Date().toDateString()}`, 600, 390);

    // Decorative Line Separator
    ctx.strokeStyle = `${accentColor}60`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(350, 440);
    ctx.lineTo(850, 440);
    ctx.stroke();

    // 8. Rates Table Header Block
    ctx.fillStyle = `${accentColor}15`;
    ctx.fillRect(150, 500, 900, 50);
    ctx.lineWidth = 1;
    ctx.strokeStyle = `${accentColor}50`;
    ctx.strokeRect(150, 500, 900, 50);

    ctx.fillStyle = accentColor;
    ctx.font = "bold 18px 'Poppins', Sans-Serif";
    ctx.textAlign = 'left';
    ctx.fillText("METAL PURITY CATEGORY", 190, 532);
    ctx.textAlign = 'right';
    ctx.fillText("LIVE RATE (INR)", 1010, 532);

    // 9. Map eligible items
    const displayItems: { label: string; sub: string; val: string }[] = [];
    if (show24k) displayItems.push({ label: '24K GOLD RATE', sub: '10gm', val: formatINR(rates.gold24k) });
    if (show22k) displayItems.push({ label: '22K GOLD RATE', sub: '10gm', val: formatINR(rates.gold22k) });
    if (show18k) displayItems.push({ label: '18K GOLD RATE', sub: '10gm', val: formatINR(rates.gold18k) });
    if (showSilver) displayItems.push({ label: 'SILVER RATE', sub: '1 kg', val: formatINR(rates.silver) });
    if (showPlatinum) displayItems.push({ label: 'PLATINUM PT950', sub: '10gm', val: formatINR(rates.platinum) });

    let currentY = 600;
    displayItems.forEach((item, index) => {
      // Row divider
      if (index > 0) {
        ctx.strokeStyle = `${accentColor}20`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(150, currentY - 20);
        ctx.lineTo(1050, currentY - 20);
        ctx.stroke();
      }

      // Label & Sub labels
      ctx.fillStyle = textColor;
      ctx.font = "bold 40px 'Playfair Display', Serif";
      ctx.textAlign = 'left';
      ctx.fillText(item.label, 170, currentY + 10);

      ctx.fillStyle = mutedTextColor;
      ctx.font = "24px 'Poppins', Sans-serif";
      ctx.fillText(item.sub, 170, currentY + 44);

      // Value column
      const valGrad = ctx.createLinearGradient(800, 0, 1050, 0);
      valGrad.addColorStop(0, '#FFFFFF');
      valGrad.addColorStop(1, accentColor);
      ctx.fillStyle = valGrad;
      ctx.font = "900 46px 'JetBrains Mono', Monospace";
      ctx.textAlign = 'right';
      ctx.fillText(item.val, 1030, currentY + 22);

      currentY += 92;
    });

    // 10. Footer info
    ctx.strokeStyle = `${accentColor}40`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(150, 1020);
    ctx.lineTo(1050, 1020);
    ctx.stroke();

    ctx.fillStyle = accentColor;
    ctx.font = "16px 'Poppins', Sans-Serif";
    ctx.textAlign = 'center';
    ctx.fillText(`Contact: ${activeBranchContact}`, 600, 1060);

    ctx.fillStyle = mutedTextColor;
    ctx.font = "italic 15px 'Poppins', Sans-Serif";
    ctx.fillText(customRatesNote, 600, 1095);

    return canvas;
  }

  const drawAndDownloadCanvas = async () => {
    const canvas = await drawPosterCanvas();
    if (!canvas) return;

    // Save logic
    const link = document.createElement('a');
    link.download = `Devijewellers_Rates_${activeTheme}_${activeBranchName.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    // Trigger logs
    const dimText = aspectRatio === '1:1' ? '1200x1200px square' : aspectRatio === '4:5' ? '1200x1500px portrait' : '1200x2133px story format';
    onTriggerLog(
      'Export Rate Poster Image', 
      `Generated and downloaded a ${dimText} digital rate poster in ${activeTheme.toUpperCase()} theme for ${activeBranchName}.`
    );
  };

  const sharePoster = async (platform: string) => {
    const canvas = await drawPosterCanvas();
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `Devijewellers_Rates_${activeTheme}_${activeBranchName.replace(/\s+/g, '_')}.png`, { type: 'image/png' });
      
      const shareData = {
        title: 'Today\'s Premium Rates',
        text: `Devijewellers - ${activeBranchName}\nLive rates for ${new Date().toDateString()}`,
        files: [file]
      };

      try {
        // Android WebView Native share intercept
        if ((window as any).AndroidNative && (window as any).AndroidNative.shareImage) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            const targetPkg = platform === 'whatsapp' ? 'com.whatsapp' : (platform === 'instagram' ? 'com.instagram.android' : '');
            (window as any).AndroidNative.shareImage(base64data, shareData.title, shareData.text, targetPkg);
            onTriggerLog('Share Rate Poster', `Native Android App Share triggered for ${platform} - Branch: ${activeBranchName}.`);
          };
          reader.readAsDataURL(blob);
          return;
        }

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share(shareData);
          onTriggerLog('Share Rate Poster', `Successfully requested OS Native Share for ${platform} - Branch: ${activeBranchName}.`);
        } else {
          // Fallback if can't share native
          setSharePlatform(platform as 'whatsapp' | 'instagram'); 
          setShowShareModal(true);
        }
      } catch (err) {
        console.error("Error sharing poster:", err);
      }
    }, 'image/png');
  };

  const triggerPrintWindow = () => {
    onTriggerLog('Print Rate Poster', `Initiated printing job for branch: ${activeBranchName} rate card.`);
    window.print();
  };

  // --- TAB 2: REGISTER STOCK CAMPAIGNS & OFFERS ---
  const handleBranchSelect = (branchId: string) => {
    if (branchId === 'all') {
      setSelectedBranches(['all']);
    } else {
      let filtered = selectedBranches.filter(b => b !== 'all');
      if (filtered.includes(branchId)) {
        filtered = filtered.filter(b => b !== branchId);
        if (filtered.length === 0) filtered = ['all'];
      } else {
        filtered.push(branchId);
      }
      setSelectedBranches(filtered);
    }
  };

  const toggleStatusState = (id: string) => {
    const updated = saleStatuses.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'active' ? 'expired' : 'active';
        onTriggerLog('Offer Status Toggled', `Switched seasonal target label "${s.name}" to ${nextStatus.toUpperCase()}.`);
        return { ...s, status: nextStatus as any };
      }
      return s;
    });
    onUpdateSaleStatuses(updated);
  };

  const deleteStatus = (id: string) => {
    const target = saleStatuses.find(s => s.id === id);
    if (target) {
      onTriggerLog('Offer Status Removed', `Archived promotional offer listing: "${target.name}"`);
    }
    const updated = saleStatuses.filter(s => s.id !== id);
    onUpdateSaleStatuses(updated);
  };

  const submitNewOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const newItem: SaleStatusItem = {
      id: 's_' + Date.now(),
      name: newName,
      tag: newTag,
      status: newStatus,
      branches: selectedBranches
    };

    onUpdateSaleStatuses([newItem, ...saleStatuses]);
    onTriggerLog('Offer Status Created', `Registered new showroom status loop: "${newName}" mapped to tag [${newTag}].`);

    // Reset Form
    setNewName('');
    setSelectedBranches(['all']);
    setShowAddForm(false);
  };

  // Theme card colors for rendering html preview card live
  const getHtmlThemeStyles = () => {
    switch (activeTheme) {
      case 'midnight_gold':
        return {
          wrapper: 'bg-[#0B0B0D] border-double border-4 border-[#D4AF37]/50',
          card: 'bg-[#15161A] border border-[#D4AF37]/20 text-[#F8F5EE]',
          accent: 'text-[#D4AF37]',
          divider: 'border-[#D4AF37]/35',
          tableHeader: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30',
          priceText: 'text-[#D4AF37] font-bold font-mono',
        };
      case 'festival_gold':
        return {
          wrapper: 'bg-gradient-to-br from-[#23040A] to-[#120005] border-4 border-[#F4D03F]/60 rounded-lg shadow-[0_0_25px_rgba(244,208,63,0.15)]',
          card: 'bg-[#3D0A14] border border-[#F4D03F]/30 text-[#FFFBF0]',
          accent: 'text-[#F4D03F]',
          divider: 'border-[#F4D03F]/30',
          tableHeader: 'bg-[#F4D03F]/15 text-[#F4D03F] border-[#F4D03F]/25',
          priceText: 'text-[#FFF] font-black tracking-tight font-mono',
        };
      case 'wedding_gold':
        return {
          wrapper: 'bg-gradient-to-br from-[#330C00] to-[#1D0500] border-4 border-[#FFD700]/70 rounded-lg',
          card: 'bg-[#4F1E0F]/90 border border-[#FFD700]/20 text-white',
          accent: 'text-[#FFD700]',
          divider: 'border-[#FFD700]/20',
          tableHeader: 'bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/20',
          priceText: 'text-[#FFD700] font-bold font-mono',
        };
      case 'premium_black':
        return {
          wrapper: 'bg-black border-4 border-[#D4AF37]/45 rounded-lg',
          card: 'bg-[#111111]/95 border border-zinc-850 text-zinc-100',
          accent: 'text-zinc-100',
          divider: 'border-zinc-800',
          tableHeader: 'bg-[#111111] text-[#D4AF37] border-zinc-800',
          priceText: 'text-white font-extrabold font-mono',
        };
    }
  };

  const previewStyles = getHtmlThemeStyles();

  return (
    <div id="sale-status-desktop-root" className="flex flex-col gap-6 text-[#F1ECE4]">
      
      {/* ELITE PAGE BAR WITH INNER NAVIGATION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#15161A] p-5 rounded-md border border-[#D4AF37]/20 shadow-lg">
        <div>
          <h2 className="text-xl font-serif font-black gold-gradient flex items-center gap-2 uppercase tracking-widest">
            <Activity className="w-5 h-5 text-[#D4AF37]" strokeWidth={2.5} /> Showroom Graphics & Tags
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Instantly render downloadable digital rate posters for social networks or publish seasonal branch tag lists.
          </p>
        </div>

        {/* Dynamic Dual Tab Selector */}
        <div className="flex bg-[#0B0B0D] p-1 rounded-lg border border-zinc-800 shrink-0">
          <button
            onClick={() => setActiveSubTab('poster_studio')}
            className={`px-4 py-2 text-xs font-serif font-bold tracking-wider uppercase rounded transition-all ${
              activeSubTab === 'poster_studio' 
                ? 'bg-[#D4AF37] text-black shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            ⚜️ Elite Poster Studio
          </button>
          <button
            onClick={() => setActiveSubTab('campaign_tags')}
            className={`px-4 py-2 text-xs font-serif font-bold tracking-wider uppercase rounded transition-all ${
              activeSubTab === 'campaign_tags'
                ? 'bg-[#D4AF37] text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            🏷️ Campaign Stock Highlighters
          </button>
        </div>
      </div>

      {activeSubTab === 'poster_studio' ? (
        /* --- VIEW 1: ELITE POSTER STUDIO --- */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="poster-studio-arena">
          
          {/* CONFIGURATION SIDEBAR: LEFT (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            
            <div className="bg-[#15161A] border border-[#D4AF37]/20 p-5 rounded-md flex flex-col gap-4">
              <h3 className="font-serif text-sm font-semibold text-[#D4AF37] border-b border-zinc-800/80 pb-2.5 flex items-center gap-2 uppercase tracking-wider">
                <Palette className="w-4 h-4 text-[#D4AF37]" /> Poster Configuration
              </h3>

              {/* Theme selectors */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-semibold">Select Canvas Theme Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'midnight_gold', label: 'Midnight Gold', class: 'bg-[#0B0B0D] border-double border-2 border-[#D4AF37]' },
                    { id: 'festival_gold', label: 'Festival Saffron', class: 'bg-[#23040A] border border-[#F4D03F] text-amber-300' },
                    { id: 'wedding_gold', label: 'Wedding Maroon', class: 'bg-[#331005] border border-orange-500 text-orange-200' },
                    { id: 'premium_black', label: 'Premium Black', class: 'bg-black border border-zinc-700 text-white' }
                  ].map((x) => (
                    <button
                      key={x.id}
                      onClick={() => setActiveTheme(x.id as any)}
                      className={`p-3 rounded text-left relative flex flex-col justify-end min-h-[55px] cursor-pointer hover:scale-[1.02] transition-all overflow-hidden ${x.class} ${
                        activeTheme === x.id ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-black' : 'opacity-85'
                      }`}
                    >
                      <span className="text-[11px] font-serif font-black tracking-wider uppercase leading-none">{x.label}</span>
                      {activeTheme === x.id && (
                        <span className="absolute top-1.5 right-1.5 p-0.5 bg-emerald-500 text-black rounded-full">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio selector */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-semibold">Select Aspect Ratio</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '1:1', label: 'Square (1:1)' },
                    { id: '4:5', label: 'Portrait (4:5)' },
                    { id: '9:16', label: 'Story (9:16)' }
                  ].map((x) => (
                    <button
                      key={x.id}
                      onClick={() => setAspectRatio(x.id as any)}
                      className={`p-2 rounded text-center border font-mono transition-all overflow-hidden ${
                        aspectRatio === x.id 
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]' 
                          : 'border-zinc-800 bg-[#0B0B0D] text-zinc-500 hover:border-zinc-600'
                      }`}
                    >
                      <span className="text-[10px] tracking-widest uppercase font-bold">{x.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Branch Locations mapping */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Select Showroom Branch</label>
                <select
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  className="bg-[#0B0B0D] border border-zinc-800 text-xs p-2.5 rounded focus:border-[#D4AF37] focus:outline-none focus:ring-0 text-white"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              {/* Title Header text  */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Heading Title</label>
                <input
                  type="text"
                  value={headerTitle}
                  onChange={(e) => setHeaderTitle(e.target.value)}
                  className="bg-[#0B0B0D] border border-zinc-800 text-xs p-2.5 rounded focus:border-[#D4AF37] font-serif tracking-wider font-bold text-white focus:outline-none"
                />
              </div>

              {/* Custom Greetings */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Subtitle Greeting or Tagline</label>
                <input
                  type="text"
                  value={greetingText}
                  onChange={(e) => setGreetingText(e.target.value)}
                  className="bg-[#0B0B0D] border border-zinc-800 text-xs p-2.5 rounded focus:border-[#D4AF37] text-white focus:outline-none"
                  placeholder="Insert custom showroom tagline"
                />
              </div>

              {/* Toggles items */}
              <div className="flex flex-col gap-2.5 bg-black/45 p-3 rounded border border-zinc-800/80">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">Purity Rows Selection</label>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300">24K Pure Gold (99.9% Per 10g)</span>
                  <input
                    type="checkbox"
                    checked={show24k}
                    onChange={(e) => setShow24k(e.target.checked)}
                    className="accent-[#D4AF37] h-4 w-4 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300">22K Standard Gold (91.6% Per 10g)</span>
                  <input
                    type="checkbox"
                    checked={show22k}
                    onChange={(e) => setShow22k(e.target.checked)}
                    className="accent-[#D4AF37] h-4 w-4 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300">18K Luxury Gold (75.0% Per 10g)</span>
                  <input
                    type="checkbox"
                    checked={show18k}
                    onChange={(e) => setShow18k(e.target.checked)}
                    className="accent-[#D4AF37] h-4 w-4 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300">Silver Bullion (99.9% Per KG)</span>
                  <input
                    type="checkbox"
                    checked={showSilver}
                    onChange={(e) => setShowSilver(e.target.checked)}
                    className="accent-[#D4AF37] h-4 w-4 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300">Platinum Pt950 (Per 10g)</span>
                  <input
                    type="checkbox"
                    checked={showPlatinum}
                    onChange={(e) => setShowPlatinum(e.target.checked)}
                    className="accent-[#D4AF37] h-4 w-4 cursor-pointer"
                  />
                </div>
              </div>

              {/* Notes Disclaimer text */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Footer Disclaimer note</label>
                <input
                  type="text"
                  value={customRatesNote}
                  onChange={(e) => setCustomRatesNote(e.target.value)}
                  className="bg-[#0B0B0D] border border-zinc-800 text-[10px] p-2 rounded text-zinc-400 focus:outline-none"
                />
              </div>

            </div>

            {/* ACTION TRIGGERS DRAWER */}
            <div className="bg-[#15161A] border border-zinc-800 p-4 rounded-md flex flex-col gap-2.5">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1">Production Desk Exports</h4>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={drawAndDownloadCanvas}
                  className="bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black font-serif font-black text-xs py-2.5 px-3 rounded hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5 shadow"
                  title="Generate high-quality PNG mockup card"
                >
                  <Download className="w-4 h-4" /> DOWNLOAD PNG
                </button>

                <button
                  onClick={triggerPrintWindow}
                  className="border border-[#D4AF37]/50 hover:border-[#D4AF37] text-white font-serif font-medium text-xs py-2.5 px-3 rounded transition-colors flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-[#D4AF37]" /> PRINT POSTER
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => sharePoster('whatsapp')}
                  className="bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 font-medium text-xs py-2 px-3 rounded hover:bg-[#25D366]/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" /> SHARE WHATSAPP
                </button>

                <button
                  onClick={() => sharePoster('instagram')}
                  className="bg-[#E1306C]/10 text-[#E1306C] border border-[#E1306C]/30 font-medium text-xs py-2 px-3 rounded hover:bg-[#E1306C]/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" /> INSTAGRAM HD
                </button>
              </div>
            </div>

          </div>

          {/* DYNAMIC HIGH-FIDELITY LIVE PREVIEW: RIGHT (7 COLS) */}
          <div className="lg:col-span-7 flex flex-col justify-start items-center">
            
            {/* Visual Header Stage info */}
            <div className="w-full flex justify-between items-center px-2 mb-2 font-mono text-[10px] text-zinc-500">
              <span className="flex items-center gap-1">
                <Layers className="w-3 h-3 text-[#D4AF37]" /> 
                LIVE PREVIEW ({aspectRatio} ASPECT RATIO)
              </span>
              <span>1200 x {aspectRatio === '1:1' ? '1200' : aspectRatio === '4:5' ? '1500' : '2133'} PX CANVAS</span>
            </div>

            {/* LIVE POSTER FRAME RENDERING IN HIGH ACCURACY */}
            <div 
              className={`w-full max-w-[550px] ${aspectRatio === '1:1' ? 'aspect-square' : aspectRatio === '4:5' ? 'aspect-[4/5]' : 'aspect-[9/16]'} rounded-xl p-6 md:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-500 ${previewStyles.wrapper}`}
              id="live-poster-visual-frame"
            >
              {/* Corner decorative circles of theme for premium looks */}
              <div className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-[#D4AF37]/50"></div>
              <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#D4AF37]/50"></div>
              <div className="absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full bg-[#D4AF37]/50"></div>
              <div className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-[#D4AF37]/50"></div>

              {/* INNER BOX OVERLAY FOR CONTRAST */}
              <div className={`w-full h-full rounded-lg p-5 flex flex-col justify-between border ${previewStyles.card}`}>
                
                {/* Branding Brand Banner */}
                <div className="text-center flex flex-col items-center justify-center">
                  <img src="/logo.png" alt="Devijewellers Logo" className="h-[90px] object-contain mb-3" />
                  
                  {/* Subtitle location details */}
                  <h1 className="text-xl md:text-2xl font-serif font-black tracking-widest uppercase leading-snug gold-gradient hidden">
                    {headerTitle || 'BULLION RATES'}
                  </h1>
                  
                  <p className="text-[9px] text-zinc-500 font-mono italic mt-0.5 mb-2">
                    Timestamp: {currentTime || new Date().toLocaleString()}
                  </p>
                  <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent mx-auto"></div>
                </div>

                {/* Grid holding the rate rows */}
                <div className="flex flex-col gap-2.5 my-2">
                  <div className={`flex justify-between items-center text-[10px] font-mono p-1 rounded uppercase tracking-wider border-b ${previewStyles.tableHeader}`}>
                    <span className="pl-1">Purity Grade Specifications</span>
                    <span className="pr-1 text-right">Today's Rate</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {show24k && (
                      <div className="flex justify-between items-center pb-1.5 border-b border-zinc-800/40 text-xs">
                        <div>
                          <p className="font-serif font-black text-white text-[20px] tracking-wider flex items-center gap-1">24K Gold Rate <Sparkles className="w-3 h-3 text-[#D4AF37]" /></p>
                          <p className="text-[14px] text-[#D4AF37] font-semibold uppercase font-mono mt-0.5">10gm</p>
                        </div>
                        <span className={`text-[20px] font-bold ${previewStyles.priceText}`}>
                          {formatINR(rates.gold24k)}
                        </span>
                      </div>
                    )}

                    {show22k && (
                      <div className="flex justify-between items-center pb-1.5 border-b border-zinc-800/40 text-xs">
                        <div>
                          <p className="font-serif font-black text-white text-[20px] tracking-wider">22K Gold Rate</p>
                          <p className="text-[14px] text-zinc-300 font-mono mt-0.5 uppercase">10gm</p>
                        </div>
                        <span className={`text-[20px] font-bold ${previewStyles.priceText}`}>
                          {formatINR(rates.gold22k)}
                        </span>
                      </div>
                    )}

                    {show18k && (
                      <div className="flex justify-between items-center pb-1.5 border-b border-zinc-800/40 text-xs">
                        <div>
                          <p className="font-serif font-black text-white text-[20px] tracking-wider">18K Gold Rate</p>
                          <p className="text-[14px] text-zinc-300 font-mono mt-0.5 uppercase">10gm</p>
                        </div>
                        <span className={`text-[20px] font-bold ${previewStyles.priceText}`}>
                          {formatINR(rates.gold18k)}
                        </span>
                      </div>
                    )}

                    {showSilver && (
                      <div className="flex justify-between items-center pb-1.5 border-b border-zinc-800/40 text-xs">
                        <div>
                          <p className="font-serif font-black text-white text-[20px] tracking-wider">Silver</p>
                          <p className="text-[14px] text-zinc-300 font-mono mt-0.5 uppercase">1 kg</p>
                        </div>
                        <span className={`text-[20px] font-bold ${previewStyles.priceText}`}>
                          {formatINR(rates.silver)}
                        </span>
                      </div>
                    )}

                    {showPlatinum && (
                      <div className="flex justify-between items-center pb-1.5 border-b border-zinc-800/40 text-xs">
                        <div>
                          <p className="font-serif font-black text-white text-[20px] tracking-wider">Platinum Pt950</p>
                          <p className="text-[14px] text-zinc-300 font-mono mt-0.5 uppercase">10gm</p>
                        </div>
                        <span className={`text-[20px] font-bold ${previewStyles.priceText}`}>
                          {formatINR(rates.platinum)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer notes element */}
                <div className="border-t border-zinc-800/60 pt-2.5 text-center flex flex-col gap-1">
                  <p className="text-[8px] text-[#D4AF37] font-semibold italic">
                    {customRatesNote}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      ) : (
        /* --- VIEW 2: ORIGINAL SHOWROOM CAMPAIGN TAGS --- */
        <div className="flex flex-col gap-6" id="showroom-campaign-panel">
          
          <div className="bg-[#15161A] p-4 rounded border border-zinc-800 flex justify-between items-center">
            <div className="text-zinc-300 text-xs">
              <span className="font-serif font-bold text-[#D4AF37]">Active Highlight Registry:</span> Setup seasonal tag highlights that run across showroom visual boards.
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-[#D4AF37] hover:bg-[#F4D03F] text-black font-serif font-bold text-xs py-2 px-4 rounded transition-all flex items-center gap-1.5 shadow"
            >
              <PlusCircle className="w-4 h-4" /> CREATE CAMPAIGN HIGH-LIGHTER
            </button>
          </div>

          {/* NEW OFFER REG_FORM */}
          {showAddForm && (
            <div className="p-5 rounded-md bg-[#15161A] border-2 border-[#D4AF37]/45 flex flex-col gap-4 relative animate-fade-in">
              <button 
                onClick={() => setShowAddForm(false)} 
                className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="font-serif text-sm font-semibold text-[#D4AF37] border-b border-zinc-800 pb-2">
                Register New Stock Launch / Seasonal Highlighter
              </h3>

              <form onSubmit={submitNewOffer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Offer or Collection Highlight Name</label>
                  <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g., Temple Kundan Bangle Showcase Gala"
                    required
                    className="bg-[#0B0B0D] border border-zinc-800 text-xs p-2.5 rounded focus:border-[#D4AF37] focus:outline-none text-white font-serif"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Sub-tag Identifier</label>
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value as any)}
                    className="bg-[#0B0B0D] border border-zinc-800 text-xs p-2.5 mt-1 rounded focus:outline-none text-zinc-300"
                  >
                    <option value="New Collection">💎 New Collection Arrivals</option>
                    <option value="Gold Offer">✨ Gold Offer Bonus</option>
                    <option value="Diamond Offer">💍 Diamond Offer Series</option>
                    <option value="Exchange Offer">🔄 Old-Gold Exchange Offer</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-semibold">Campaign Status State</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="bg-[#0B0B0D] border border-zinc-800 text-xs p-2.5 mt-1 rounded focus:outline-none text-zinc-300"
                  >
                    <option value="active">Active (Broadcasting)</option>
                    <option value="upcoming">Upcoming Schedule (Queued)</option>
                    <option value="expired">Expired (Historical Record)</option>
                  </select>
                </div>

                {/* Branch Assignment Select */}
                <div className="md:col-span-2 flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5">Apply to Selected Showrooms</label>
                  <div className="flex flex-wrap gap-2.5 bg-black/30 p-3 rounded border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => handleBranchSelect('all')}
                      className={`px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-1.5 ${
                        selectedBranches.includes('all')
                          ? 'bg-[#D4AF37] text-black font-semibold'
                          : 'bg-[#15161A] text-zinc-400 border border-zinc-800'
                      }`}
                    >
                      <Building className="w-3.5 h-3.5" /> All Branches
                    </button>

                    {branches.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => handleBranchSelect(b.id)}
                        className={`px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-1.5 ${
                          selectedBranches.includes(b.id)
                            ? 'bg-[#D4AF37]/15 border border-[#D4AF37] text-[#D4AF37] font-semibold'
                            : 'bg-[#15161A] text-zinc-400 border border-zinc-800'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" /> {b.name.replace('Showroom -', '').replace('Boutique', '')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 flex gap-2 justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="border border-zinc-850 hover:border-zinc-800 text-xs font-serif px-4 py-2 rounded transition-colors text-zinc-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#D4AF37] hover:bg-[#F4D03F] text-black font-serif font-bold text-xs px-4 py-2 rounded shadow"
                  >
                    Deploy Offer Highlighting
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* OFFERS LISTING TABLE */}
          <div className="bg-[#15161A] border border-[#D4AF37]/20 rounded-md overflow-hidden p-5 flex flex-col gap-4">
            
            <div className="border-b border-zinc-800 pb-3 flex justify-between items-center">
              <h3 className="font-serif text-sm font-semibold text-[#D4AF37] flex items-center gap-2">
                <Tag className="w-4 h-4" /> Live Showroom Stock Allocations
              </h3>
              <span className="text-[10px] text-zinc-500 font-mono">Toggling statuses updates screens instantly</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" id="sale-status-table">
                <thead>
                  <tr className="border-b border-zinc-800/80 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    <th className="pb-3 pt-1 pl-2">Collection Highlights</th>
                    <th className="pb-3 pt-1">Offer Tag</th>
                    <th className="pb-3 pt-1">Active Showrooms</th>
                    <th className="pb-3 pt-1">Broadcasting Status</th>
                    <th className="pb-3 pt-1 text-center font-bold">Manual Switch</th>
                    <th className="pb-3 pt-1 text-right">Settings</th>
                  </tr>
                </thead>
                <tbody>
                  {saleStatuses.map((s, idx) => {
                    
                    let tagColor = 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400';
                    if (s.tag === 'New Collection') tagColor = 'bg-purple-500/10 border-purple-500/30 text-purple-400';
                    else if (s.tag === 'Exchange Offer') tagColor = 'bg-amber-500/10 border-amber-500/30 text-[#D4AF37]';
                    else if (s.tag === 'Diamond Offer') tagColor = 'text-sky-400 bg-sky-500/10 border-sky-500/20';

                    return (
                      <tr key={s.id} className="border-b border-zinc-800/50 hover:bg-black/25 transition-colors text-xs">
                        
                        {/* Collection Title */}
                        <td className="py-3.5 pl-2 font-serif font-semibold text-white tracking-wide">
                          {s.name}
                        </td>

                        {/* Tag badge */}
                        <td className="py-3.5">
                          <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${tagColor}`}>
                            {s.tag}
                          </span>
                        </td>

                        {/* Showrooms mapped */}
                        <td className="py-3.5 text-zinc-400 max-w-[200px]">
                          {s.branches.includes('all') ? (
                            <span className="font-mono text-[10px] text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded flex items-center gap-1 w-max border border-zinc-700">
                              <Building className="w-3 h-3 text-[#D4AF37]" /> ALL BRANCHES
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {s.branches.map((bId) => {
                                const b = branches.find(branch => branch.id === bId);
                                return (
                                  <span key={bId} className="text-[9px] font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-[#D4AF37] border border-zinc-750">
                                    {b ? b.name.replace('Showroom - ', '').replace('Boutique', '').trim() : bId}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </td>

                        {/* Active State text */}
                        <td className="py-3.5">
                          {s.status === 'active' ? (
                            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-mono px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 w-max">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Broadcasting
                            </span>
                          ) : s.status === 'upcoming' ? (
                            <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 font-mono px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 w-max">
                              Upcoming Queue
                            </span>
                          ) : (
                            <span className="text-[9px] bg-red-400/10 text-red-400 border border-red-500/15 font-mono px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 w-max">
                              Expired
                            </span>
                          )}
                        </td>

                        {/* Active Switch toggler */}
                        <td className="py-3.5 text-center">
                          <button
                            onClick={() => toggleStatusState(s.id)}
                            className="text-zinc-400 hover:text-white transition-colors"
                            title="Toggle broadcast status"
                          >
                            {s.status === 'active' ? (
                              <ToggleRight className="w-7 h-7 text-[#D4AF37] mx-auto cursor-pointer" />
                            ) : (
                              <ToggleLeft className="w-7 h-7 text-zinc-600 mx-auto cursor-pointer" />
                            )}
                          </button>
                        </td>

                        {/* Action buttons */}
                        <td className="py-3.5 text-right pr-2">
                          <button
                            onClick={() => deleteStatus(s.id)}
                            className="text-red-400/70 hover:text-red-400 p-1.5 rounded transition-colors hover:bg-red-500/10 inline-block"
                            id={`delete-status-${s.id}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* --- SOCIAL SHARE MODAL DIALOG MOCKUP --- */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#15161A] border-2 border-[#D4AF37] rounded-lg max-w-lg w-full p-6 relative flex flex-col gap-4">
            
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-base font-bold text-[#D4AF37] border-b border-zinc-800 pb-2.5 uppercase tracking-wider flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#D4AF37]" /> Export & Share Hub
            </h3>

            {sharePlatform === 'whatsapp' ? (
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20">
                  ✅ <strong>WhatsApp Business Broadcasting Enabled</strong>: Send real-time daily jewellery rate cards to your showroom's subscriber broadcast lists.
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Pre-formatted Message Preview:</span>
                  <pre className="bg-[#0b0b0d] p-3 rounded border border-zinc-800 text-[11px] text-zinc-200 font-mono whitespace-pre-wrap max-h-52 overflow-y-auto">
                    {getShareableText()}
                  </pre>
                </div>

                <div className="flex gap-2.5 mt-2">
                  <button
                    onClick={copyShareableText}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-serif font-bold text-xs py-2.5 rounded transition-colors flex items-center justify-center gap-1.5"
                  >
                    {copiedText ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" /> COPIED TO CLIPBOARD
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" /> COPY RAW RATES TEXT
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      const encoded = encodeURIComponent(getShareableText());
                      window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
                    }}
                    className="flex-1 bg-[#25D366] hover:bg-[#20ba56] text-black font-serif font-extrabold text-xs py-2.5 rounded transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-4 h-4" /> PUSH TO WHATSAPP
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-fuchsia-500/10 text-fuchsia-400 text-xs rounded border border-fuchsia-500/20">
                  📸 <strong>Instagram High-Resolution Feed Ready</strong>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  To publish high-performance graphics on Instagram:
                </p>
                
                <ol className="text-xs text-zinc-400 list-decimal list-inside flex flex-col gap-1.5 bg-black/25 p-3 rounded">
                  <li>Click <strong>Download PNG</strong> inside the control desk to save the high-res {aspectRatio === '1:1' ? '1200x1200px' : aspectRatio === '4:5' ? '1200x1500px' : '1200x2133px'} rating slide graphics.</li>
                  <li>Copy the optimized Instagram hashtags & description below.</li>
                  <li>Upload directly to Instagram Feed, Stories, or broadcast channel highlights.</li>
                </ol>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">Optimized Caption:</span>
                  <div className="bg-[#0b0b0d] p-3 rounded border border-zinc-800 text-[11px] text-zinc-200 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                    👑 Rates updated live for {activeBranchName}! ✨
                    {"\n\n"}
                    Purity Guaranteed. Hallmarked. 
                    🎨 Theme Style: {activeTheme.replace('_', ' ').toUpperCase()}
                    {"\n\n"}
                    #devijewellers #goldrates #silverrate #jewelryshop #weddingjewelry #bridal #luxuryjewellery
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`Today's rate sheet for ${activeBranchName}. Purity Guaranteed.\n#devijewellers #goldrates #luxury`);
                    setCopiedText(true);
                    setTimeout(() => setCopiedText(false), 2000);
                  }}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-serif font-bold text-xs py-2.5 rounded transition-colors flex items-center justify-center gap-1.5"
                >
                  {copiedText ? (
                    <><Check className="w-4 h-4 text-emerald-400" /> COPIED CAPTION</>
                  ) : (
                    <><Copy className="w-4 h-4" /> COPY INSTAGRAM CAPTION</>
                  )}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
