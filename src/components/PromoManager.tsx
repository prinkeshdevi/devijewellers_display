/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PromoItem } from '../types';
import { 
  Gift, 
  PlusCircle, 
  X, 
  CheckSquare, 
  Square, 
  Calendar, 
  AlertCircle, 
  Trash2,
  Tv,
  Smartphone,
  Globe
} from 'lucide-react';

interface PromoManagerProps {
  promos: PromoItem[];
  onUpdatePromos: (newPromos: PromoItem[]) => void;
  onTriggerLog: (action: string, details: string) => void;
}

export default function PromoManager({
  promos,
  onUpdatePromos,
  onTriggerLog
}: PromoManagerProps) {
  
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCode, setNewCode] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newStart, setNewStart] = useState<string>('2026-06-09');
  const [newEnd, setNewEnd] = useState<string>('2026-06-30');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [targetTV, setTargetTV] = useState<boolean>(true);
  const [targetMobile, setTargetMobile] = useState<boolean>(true);
  const [targetWeb, setTargetWeb] = useState<boolean>(false);

  const togglePromoActive = (id: string) => {
    const updated = promos.map(p => {
      if (p.id === id) {
        onTriggerLog('Promo Campaign Shift', `Shifted promotional active status for ${p.title} to ${!p.active ? 'ACTIVE' : 'INACTIVE'}.`);
        return { ...p, active: !p.active };
      }
      return p;
    });
    onUpdatePromos(updated);
  };

  const deletePromo = (id: string) => {
    const target = promos.find(p => p.id === id);
    if (target) {
      onTriggerLog('Campaign Voided', `Terminated campaign code: "${target.code}"`);
    }
    const updated = promos.filter(p => p.id !== id);
    onUpdatePromos(updated);
  };

  const createCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCode || !newDesc) return;

    const newItem: PromoItem = {
      id: 'p_' + Date.now(),
      title: newTitle,
      code: newCode.toUpperCase().replace(/\s+/g, ''),
      description: newDesc,
      startDate: newStart,
      endDate: newEnd,
      priority: newPriority,
      active: true,
      displayOnTV: targetTV,
      displayOnMobile: targetMobile,
      displayOnWeb: targetWeb
    };

    onUpdatePromos([newItem, ...promos]);
    onTriggerLog('Campaign Published', `Launched campaign: "${newTitle}" [${newItem.code}]`);

    // Reset Form
    setNewTitle('');
    setNewCode('');
    setNewDesc('');
    setNewPriority('medium');
    setShowAddForm(false);
  };

  return (
    <div id="promo-manager-root" className="flex flex-col gap-6 text-[#F1ECE4]">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#15161A] p-5 rounded-md border border-zinc-800">
        <div>
          <h2 className="text-lg md:text-xl font-serif font-bold text-[#D4AF37] flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#D4AF37]" /> Active Campaign & Offers Manager
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Program festival discounts, gold making-charge reductions, and exclusive bridal preview schemes on retail display loops.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="bg-[#D4AF37] hover:bg-[#F4D03F] text-black font-serif font-bold text-xs py-2 px-4 rounded transition-all flex items-center gap-2 shadow"
        >
          <PlusCircle className="w-4 h-4" /> CREATE CAMPAIGN
        </button>
      </div>

      {/* NEW CAMPAIGN DIALOG */}
      {showAddForm && (
        <div className="p-5 rounded-md bg-[#15161A] border-2 border-[#D4AF37]/45 flex flex-col gap-4 relative animate-fade-in">
          <button 
            onClick={() => setShowAddForm(false)} 
            className="absolute top-4 right-4 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h3 className="font-serif text-sm font-semibold text-[#D4AF37] border-b border-zinc-800 pb-2">
            Draft New Showroom Offer Campaign
          </h3>

          <form onSubmit={createCampaign} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Campaign Accent Title</label>
              <input 
                type="text" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Diwali Shubh Labh Offer"
                required
                className="bg-[#0B0B0D] border border-zinc-800 text-xs p-2 rounded focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-semibold">Promotion Code</label>
              <input 
                type="text" 
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="e.g., DIWALI15"
                required
                className="bg-[#0B0B0D] border border-zinc-800 text-xs p-2 rounded focus:border-[#D4AF37] font-mono tracking-widest text-white uppercase focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Offer Core Description</label>
              <textarea 
                rows={2}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Describe details: e.g., Flat 15% discount on making charges for certified gold chains and temple sets..."
                required
                className="bg-[#0B0B0D] border border-zinc-800 text-xs p-2.5 rounded focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Launch Date</label>
              <input 
                type="date" 
                value={newStart}
                onChange={(e) => setNewStart(e.target.value)}
                className="bg-[#0B0B0D] border border-zinc-800 text-xs p-2 rounded focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Expiration Close Date</label>
              <input 
                type="date" 
                value={newEnd}
                onChange={(e) => setNewEnd(e.target.value)}
                className="bg-[#0B0B0D] border border-zinc-800 text-xs p-2 rounded focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Showroom Output Target</label>
              <div className="flex flex-wrap gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setTargetTV(!targetTV)}
                  className="flex items-center gap-1.5 text-xs text-zinc-300"
                >
                  {targetTV ? <CheckSquare className="w-4 h-4 text-[#D4AF37]" /> : <Square className="w-4 h-4 text-zinc-600" />}
                  <span>TV Signage Panels</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTargetMobile(!targetMobile)}
                  className="flex items-center gap-1.5 text-xs text-zinc-300"
                >
                  {targetMobile ? <CheckSquare className="w-4 h-4 text-[#D4AF37]" /> : <Square className="w-4 h-4 text-zinc-600" />}
                  <span>Staff Mobile App</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTargetWeb(!targetWeb)}
                  className="flex items-center gap-1.5 text-xs text-zinc-300"
                >
                  {targetWeb ? <CheckSquare className="w-4 h-4 text-[#D4AF37]" /> : <Square className="w-4 h-4 text-zinc-600" />}
                  <span>Web Portal Showcase</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Priority Weight</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="bg-[#0B0B0D] border border-[#d4af37]/20 text-xs p-2 mt-1 rounded focus:outline-none"
              >
                <option value="high">🔴 High Priority (Immediate overlay loop)</option>
                <option value="medium">🟡 Medium Priority (Auto-rotate list)</option>
                <option value="low">🟢 Low Priority (Ticker queue)</option>
              </select>
            </div>

            <div className="md:col-span-2 flex gap-2 justify-end mt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="border border-zinc-800 hover:border-zinc-700 text-xs font-serif px-4 py-2 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#D4AF37] hover:bg-[#F4D03F] text-black font-serif font-bold text-xs px-4 py-2 rounded shadow"
              >
                Launch Live Campaign
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CAMPAIGNS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="campaigns-grid">
        {promos.map((p) => {
          
          let priorityBadge = '';
          if (p.priority === 'high') priorityBadge = 'bg-red-500/10 border-red-500/30 text-red-400';
          else if (p.priority === 'medium') priorityBadge = 'bg-amber-500/10 border-amber-500/30 text-amber-500';
          else priorityBadge = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';

          return (
            <div key={p.id} className="bg-[#15161A] border border-zinc-800 rounded-md p-5 flex flex-col justify-between gap-4 hover:border-[#D4AF37]/35 transition-all relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-amber-600 opacity-60"></div>
              
              <div>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-serif text-sm font-semibold text-white uppercase tracking-wider">
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] font-mono bg-zinc-800 text-[#D4AF37] tracking-widest px-2 py-0.5 rounded uppercase font-bold">
                        CODE: {p.code}
                      </span>
                      <span className={`text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded border ${priorityBadge}`}>
                        {p.priority} Priority
                      </span>
                    </div>
                  </div>
                  
                  {p.active ? (
                    <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping"></span> Active
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
                      Paused
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-400 font-light mt-3 leading-relaxed">
                  {p.description}
                </p>
              </div>

              {/* Targets and dates info */}
              <div className="border-t border-zinc-800/80 pt-3 flex flex-col gap-2.5">
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#D4AF37]" /> Schedules Duration:</span>
                  <span className="text-[#F1ECE4]">{p.startDate} - {p.endDate}</span>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                  <span>Display Outputs:</span>
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1 ${p.displayOnTV ? 'text-[#D4AF37]' : 'text-zinc-600'}`} title="TV Showroom display">
                      <Tv className="w-3.5 h-3.5" /> TV
                    </span>
                    <span className={`flex items-center gap-1 ${p.displayOnMobile ? 'text-[#D4AF37]' : 'text-zinc-600'}`} title="Mobile catalogue app">
                      <Smartphone className="w-3.5 h-3.5" /> App
                    </span>
                    <span className={`flex items-center gap-1 ${p.displayOnWeb ? 'text-[#D4AF37]' : 'text-zinc-600'}`} title="Showroom public web">
                      <Globe className="w-3.5 h-3.5" /> Web
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => togglePromoActive(p.id)}
                    className={`flex-1 text-center text-[11px] font-serif py-1 rounded transition-colors ${
                      p.active 
                        ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' 
                        : 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/35 hover:bg-[#D4AF37]/30'
                    }`}
                  >
                    {p.active ? 'Pause Campaign' : 'Publish Loop'}
                  </button>

                  <button
                    onClick={() => deletePromo(p.id)}
                    className="bg-red-500/15 hover:bg-red-500/25 border border-red-500/20 text-red-400 px-3 py-1 rounded transition-colors flex items-center justify-center"
                    id={`delete-promo-${p.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
