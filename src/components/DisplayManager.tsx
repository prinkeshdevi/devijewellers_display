/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ConnectedDisplay, Branch, DisplayMode, DisplayTheme } from '../types';
import { 
  Tv, 
  MapPin, 
  RefreshCw, 
  Settings, 
  CheckCircle, 
  X, 
  Layers, 
  AlertTriangle,
  RotateCw,
  Building,
  Radio,
  Plus
} from 'lucide-react';

interface DisplayManagerProps {
  displays: ConnectedDisplay[];
  branches: Branch[];
  onUpdateDisplays: (newDisplays: ConnectedDisplay[]) => void;
  onTriggerLog: (action: string, details: string) => void;
}

export default function DisplayManager({
  displays,
  branches,
  onUpdateDisplays,
  onTriggerLog
}: DisplayManagerProps) {
  
  const [rebootingId, setRebootingId] = useState<string | null>(null);
  const [selectedDisplay, setSelectedDisplay] = useState<ConnectedDisplay | null>(null);
  const [successMsg, setSuccessMsg] = useState<string>('');

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const remoteReboot = (id: string, name: string) => {
    setRebootingId(id);
    onTriggerLog('Remote Display Reboot', `Pushed hardware reload packet to "${name}" terminal.`);
    setTimeout(() => {
      setRebootingId(null);
      triggerSuccess(`Display node "${name}" loaded firmware successfully!`);
    }, 2000);
  };

  const handleUpdateDisplaySettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDisplay) return;

    const updated = displays.map(d => d.id === selectedDisplay.id ? selectedDisplay : d);
    onUpdateDisplays(updated);
    
    onTriggerLog(
      'Display Ref Configured', 
      `Assigned layout ${selectedDisplay.assignedMode.toUpperCase()} | Theme ${selectedDisplay.assignedTheme.toUpperCase()} to node: ${selectedDisplay.name}.`
    );

    setSelectedDisplay(null);
    triggerSuccess('Over-the-air display config updated!');
  };

  const toggleDisplayOnline = (id: string) => {
    const updated = displays.map(d => {
      if (d.id === id) {
        const nextState = !d.online;
        onTriggerLog('Signage Ping Toggled', `Manually toggled network connectivity of "${d.name}" to ${nextState ? 'ONLINE' : 'OFFLINE'}.`);
        return { ...d, online: nextState };
      }
      return d;
    });
    onUpdateDisplays(updated);
  };

  return (
    <div id="display-manager-root" className="flex flex-col gap-6 text-[#F1ECE4]">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#15161A] p-5 rounded-md border border-zinc-800">
        <div>
          <h2 className="text-lg md:text-xl font-serif font-bold text-[#D4AF37] flex items-center gap-2">
            <Tv className="w-5 h-5 text-[#D4AF37]" /> Connected Signage Terminals (OTAs)
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Track and configure live TV/LED setups playing the rate charts across retail showrooms. Push settings over the air.
          </p>
        </div>
        
        <div className="text-[10px] bg-[#D4AF37]/5 px-3 py-1 text-[#D4AF37] border border-[#D4AF37]/20 rounded font-mono flex items-center gap-2 uppercase font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Broadcast Hub
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500 text-emerald-400 text-xs font-semibold rounded flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* CORE TERMINALS PANEL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Terminals list (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="p-4 bg-[#15161A] border border-zinc-800 rounded-md">
            
            <div className="border-b border-zinc-800 pb-3 mb-4 flex justify-between items-center text-xs font-serif font-bold text-[#D4AF37]">
              <span>Active IoT Screen Monitors</span>
              <span className="text-[10px] font-mono text-zinc-500">Toggling online status is simulated</span>
            </div>

            <div className="flex flex-col gap-3">
              {displays.map((disp) => {
                
                const b = branches.find(branch => branch.id === disp.branchId);

                return (
                  <div key={disp.id} className="p-4 rounded-md bg-[#0B0B0D] border border-zinc-800 hover:border-[#D4AF37]/25 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    
                    {/* Device naming and Branch info */}
                    <div className="flex gap-3">
                      <div className={`p-2.5 rounded-full flex items-center justify-center border ${
                        disp.online 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                          : 'bg-red-500/10 border-red-500/30 text-red-400'
                      }`}>
                        <Tv className="w-5 h-5" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-serif font-bold text-white tracking-wide uppercase">
                            {disp.name}
                          </h4>
                          <button 
                            type="button"
                            onClick={() => toggleDisplayOnline(disp.id)}
                            className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded cursor-pointer ${
                              disp.online 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' 
                                : 'bg-red-500/10 text-red-400 border border-red-500/25'
                            }`}
                          >
                            {disp.online ? 'Online' : 'Offline'}
                          </button>
                        </div>

                        <p className="text-[10px] text-zinc-400 font-mono mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#D4AF37]" /> Showroom: {b?.name || 'CP Main'} • Pin Code Mapped
                        </p>
                      </div>
                    </div>

                    {/* Display modes badges */}
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-wider">
                      <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700/80">
                        {disp.assignedMode}
                      </span>
                      <span className="bg-zinc-800 text-[#D4AF37] px-2 py-0.5 rounded border border-[#D4AF37]/15">
                        {disp.assignedTheme.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Controls row */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedDisplay(disp)}
                        className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-xs py-1.5 px-3 rounded font-serif transition-colors"
                      >
                        Configure
                      </button>

                      <button
                        onClick={() => remoteReboot(disp.id, disp.name)}
                        disabled={rebootingId === disp.id}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded transition-colors disabled:opacity-50"
                        title="Force reload driver"
                      >
                        <RotateCw className={`w-3.5 h-3.5 ${rebootingId === disp.id ? 'animate-spin' : ''}`} />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Configure Selected Display Sidebar (4 cols) */}
        <div className="lg:col-span-4">
          {selectedDisplay ? (
            <form onSubmit={handleUpdateDisplaySettings} className="bg-[#15161A] p-5 rounded-md border border-[#D4AF37]/30 flex flex-col gap-4 animate-fade-in">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <h3 className="font-serif text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1">
                  <Settings className="w-4 h-4" /> Air-Config Node
                </h3>
                <button type="button" onClick={() => setSelectedDisplay(null)} className="text-zinc-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <p className="text-[10px] text-zinc-400 font-mono">Modifying terminal:</p>
                <p className="text-xs font-bold text-white uppercase mt-0.5">{selectedDisplay.name}</p>
              </div>

              {/* Adjust Layout Mode */}
              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Assigned Layout Mode</label>
                <select
                  value={selectedDisplay.assignedMode}
                  onChange={(e) => setSelectedDisplay({ ...selectedDisplay, assignedMode: e.target.value as DisplayMode })}
                  className="bg-[#0B0B0D] border border-zinc-800 text-xs p-2 rounded focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="standard">Standard Grid</option>
                  <option value="premium">Premium Rolex Elegance</option>
                  <option value="festival">Festival Saffron</option>
                  <option value="portrait">Portrait Signage (Col)</option>
                  <option value="landscape">Landscape Panoramic</option>
                </select>
              </div>

              {/* Adjust Theme */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Branded Display Theme</label>
                <select
                  value={selectedDisplay.assignedTheme}
                  onChange={(e) => setSelectedDisplay({ ...selectedDisplay, assignedTheme: e.target.value as DisplayTheme })}
                  className="bg-[#0B0B0D] border border-zinc-800 text-xs p-2 rounded focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="midnight_gold">Midnight Gold Luxury</option>
                  <option value="royal_emerald">Royal Emerald</option>
                  <option value="festival">Festive Crimson</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDisplay(null)}
                  className="border border-zinc-800 text-xs font-serif px-3 py-1.5 rounded"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-[#D4AF37] hover:bg-[#F4D03F] text-black font-serif font-bold text-xs px-4 py-1.5 rounded shadow"
                >
                  Push OTA Layout
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-[#15161A] p-6 rounded-md border border-zinc-800 text-center flex flex-col items-center justify-center gap-3">
              <div className="p-3 bg-zinc-800/50 rounded-full text-zinc-600">
                <Settings className="w-6 h-6" />
              </div>
              <p className="text-xs font-serif text-zinc-300">OTA Signage Settings</p>
              <p className="text-[10px] text-zinc-500 font-sans leading-relaxed">
                Click <strong>"Configure"</strong> next to any of the showroom TV devices listed on the left to push layout modes and color themes over the air instantly, without downtime.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
