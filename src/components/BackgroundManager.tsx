/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MediaItem, DisplaySetting } from '../types';
import { 
  Upload, 
  Trash2, 
  FileImage, 
  Video, 
  Sparkles, 
  Calendar, 
  CheckCircle, 
  X,
  PlusCircle,
  Eye,
  Settings,
  Tv,
  Power,
  Sliders,
  Clock
} from 'lucide-react';

interface BackgroundManagerProps {
  media: MediaItem[];
  onUpdateMedia: (newMedia: MediaItem[]) => void;
  onTriggerLog: (action: string, details: string) => void;
  displaySetting: DisplaySetting;
  onUpdateDisplaySetting: (newSetting: Partial<DisplaySetting>) => void;
}

export default function BackgroundManager({
  media,
  onUpdateMedia,
  onTriggerLog,
  displaySetting,
  onUpdateDisplaySetting
}: BackgroundManagerProps) {
  
  // New Item modal / Form state
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newType, setNewType] = useState<string>('background');
  const [newUrl, setNewUrl] = useState<string>('');
  const [enableDates, setEnableDates] = useState<boolean>(false);
  const [newStart, setNewStart] = useState<string>('2026-06-09');
  const [newEnd, setNewEnd] = useState<string>('2026-07-09');
  const [newDuration, setNewDuration] = useState<number>(8); // Custom slide duration option
  
  // Direct file upload state
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('');
  
  // Filter
  const [filterType, setFilterType] = useState<string>('all');
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  const toggleMediaActive = (id: string) => {
    const updated = media.map(m => {
      if (m.id === id) {
        onTriggerLog('Media Status Adjusted', `Toggled broadcast status of "${m.title}" to ${!m.active ? 'ACTIVE' : 'INACTIVE'}.`);
        return { ...m, active: !m.active };
      }
      return m;
    });
    onUpdateMedia(updated);
  };

  const deleteMediaItem = (id: string) => {
    const target = media.find(m => m.id === id);
    if (target) {
      onTriggerLog('Media Deleted', `Removed media resource: "${target.title}"`);
    }
    const updated = media.filter(m => m.id !== id);
    onUpdateMedia(updated);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file) return;

    // Keep newType as 'background' for Background Manager
    setNewType('background');

    // Auto-fill title if empty
    if (!newTitle) {
      const fileNameNoExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setNewTitle(fileNameNoExt);
    }

    setUploadedFileName(file.name);
    const sizeInMB = file.size / (1024 * 1024);
    setUploadedFileSize(sizeInMB.toFixed(2) + ' MB');

    // Convert file to Base64
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setNewUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearUploadedFile = () => {
    setNewUrl('');
    setUploadedFileName('');
    setUploadedFileSize('');
  };

  const addNewMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    const newItem: MediaItem = {
      id: 'm_' + Date.now(),
      title: newTitle,
      type: newType as any,
      url: newUrl,
      startDate: enableDates ? newStart : '',
      endDate: enableDates ? newEnd : '',
      active: true,
      displayDuration: newDuration
    };

    onUpdateMedia([newItem, ...media]);
    onTriggerLog(
      'Media Registered', 
      `Published new digital loop asset: "${newTitle}" (${newType}) ${uploadMode === 'file' ? '(via local file upload)' : '(via URL link)'}.`
    );
    
    // reset
    setNewTitle('');
    setNewUrl('');
    setEnableDates(false);
    setUploadedFileName('');
    setUploadedFileSize('');
    setShowAddForm(false);
  };

  // Seed options for quick luxury catalog images
  const PRESET_MOCK_ASSETS = [
    { title: 'Royal Kundan Neckpiece', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200' },
    { title: 'Fine Solitaire Cut Rings', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1200' },
    { title: 'Rose Gold Shimmer Bangles', url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=1200' },
    { title: 'Heritage Golden Choker', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200' }
  ];

  const filteredMedia = media.filter(m => m.type === 'background');

  return (
    <div id="media-manager-root" className="flex flex-col gap-6 text-[#F1ECE4]">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#15161A] p-5 rounded-md border border-zinc-800">
        <div>
          <h2 className="text-lg md:text-xl font-serif font-bold text-[#D4AF37] flex items-center gap-2">
            <Video className="w-5 h-5 text-[#D4AF37]" /> Dynamic Background Images
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Publish high-fidelity banners, brand videos, and gold heritage collections onto active retail display loops.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="bg-[#D4AF37] hover:bg-[#F4D03F] text-black font-serif font-bold text-xs py-2 px-4 rounded transition-colors flex items-center gap-2 shadow"
        >
          <PlusCircle className="w-4 h-4" /> ADD DIGITAL RESOURCE
        </button>
      </div>

      {/* GLOBAL SLIDESHOW BROADCAST TOGGLE PANEL */}
      <div id="media-loop-panel" className="bg-[#1C1D24]/90 p-5 rounded-md border border-[#D4AF37]/35 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#D4AF37]/5 to-transparent pointer-events-none" />
        
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-md flex items-center justify-center border transition-all ${
            displaySetting?.rotateBackgroundEnabled 
              ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)]' 
              : 'bg-zinc-900 border-zinc-700 text-zinc-500'
          }`}>
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-serif font-black uppercase text-[#F8F5EE] tracking-wide flex items-center gap-2">
              SHOWROOM HOLISTIC MEDIA SIGNAGE LOOP
              {displaySetting?.rotateBackgroundEnabled ? (
                <span className="text-[9px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded uppercase font-bold">
                  Active
                </span>
              ) : (
                <span className="text-[9px] font-mono bg-red-500/15 border border-red-500/30 text-red-400 px-2 py-0.5 rounded uppercase font-bold">
                  Inactive / Muted
                </span>
              )}
            </h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              When toggled <strong className="text-[#D4AF37]">ON</strong>, the television screens will automatically alternate between active Gold Metal Rates and your active Media Resources. When toggled <strong className="text-zinc-300">OFF</strong>, standard live commodity price indexes will display permanently.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            const nextVal = !displaySetting?.rotateBackgroundEnabled;
            onUpdateDisplaySetting({ rotateBackgroundEnabled: nextVal });
            onTriggerLog(
              'Global Media Loop Configuration Toggled', 
              `Holistic TV slideshow loops switched ${nextVal ? 'ON' : 'OFF'} by admin panel controller.`
            );
          }}
          className={`px-5 py-2.5 rounded font-serif font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer select-none ${
            displaySetting?.rotateBackgroundEnabled 
              ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30' 
              : 'bg-[#D4AF37] hover:bg-[#F4D03F] text-black shadow-md'
          }`}
        >
          <Power className="w-4 h-4" />
          {displaySetting?.rotateBackgroundEnabled ? 'SUSPEND WHOLE SIGNAGE' : 'ACTIVATE SIGNAGE LOOP'}
        </button>
      </div>

      {/* FILTER BUTTONS ROW REMOVED */}

      {/* ADD NEW MEDIA DIALOG/FORM */}
      {showAddForm && (
        <div className="p-5 rounded-md bg-[#15161A] border-2 border-[#D4AF37]/40 flex flex-col gap-4 relative animate-fade-in">
          <button 
            onClick={() => setShowAddForm(false)} 
            className="absolute top-4 right-4 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h3 className="font-serif text-sm font-semibold text-[#D4AF37] border-b border-zinc-800 pb-2">
            Register New Showroom Digital Wall Asset
          </h3>

          <form onSubmit={addNewMedia} className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Media Title Name</label>
              <input 
                type="text" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Vivah Wedding Collection Slide"
                required
                className="bg-[#0B0B0D] border border-zinc-800 text-xs p-2 rounded focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1 hidden">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Category Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="bg-[#0B0B0D] border border-zinc-800 text-xs p-2 rounded focus:outline-none"
              >
                <option value="background">Background Image</option>
              </select>
            </div>

            <div className="flex flex-col gap-2.5  bg-black/10 p-3 rounded-lg border border-zinc-800/60">
              {/* Source Mode Tabs */}
              <div className="flex border-b border-zinc-800 gap-4 pb-1">
                <button
                  type="button"
                  onClick={() => {
                    setUploadMode('url');
                    clearUploadedFile();
                  }}
                  className={`pb-1.5 text-xs font-mono uppercase tracking-widest font-bold transition-all relative flex items-center gap-1.5 ${
                    uploadMode === 'url' 
                      ? 'text-[#D4AF37]' 
                      : 'text-zinc-500 hover:text-zinc-350'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> 🌐 Press Web link URL
                  {uploadMode === 'url' && <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#D4AF37]" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUploadMode('file');
                    setNewUrl('');
                  }}
                  className={`pb-1.5 text-xs font-mono uppercase tracking-widest font-bold transition-all relative flex items-center gap-1.5 ${
                    uploadMode === 'file' 
                      ? 'text-[#D4AF37]' 
                      : 'text-zinc-500 hover:text-zinc-350'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 📁 Upload Directly (Picture/Video)
                  {uploadMode === 'file' && <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#D4AF37]" />}
                </button>
              </div>

              {/* Mode 1: Web Link URL */}
              {uploadMode === 'url' && (
                <div className="flex flex-col gap-1.5 pt-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">Direct Resource Link URL</label>
                  <input 
                    type="url" 
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="e.g., https://images.unsplash.com/... or cloud video URL"
                    required={uploadMode === 'url'}
                    className="bg-[#0B0B0D] border border-zinc-800 text-xs p-2.5 rounded focus:border-[#D4AF37] focus:outline-none w-full"
                  />
                  
                  {/* Presets shortcut */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">Jewellery Assets Presets:</span>
                    {PRESET_MOCK_ASSETS.map((p, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => {
                          setNewTitle(p.title);
                          setNewUrl(p.url);
                        }}
                        className="text-[9px] bg-zinc-800/80 hover:bg-[#D4AF37]/15 border border-zinc-700 hover:border-[#D4AF37]/50 px-2 py-1 rounded tracking-wide font-sans transition-all text-zinc-300"
                      >
                        {p.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mode 2: Direct File Upload Zone */}
              {uploadMode === 'file' && (
                <div className="flex flex-col gap-2 pt-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block">Drag & Drop Digital Master File</span>
                  
                  <label
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    htmlFor="direct-file-input"
                    className={`border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center text-center transition-all cursor-pointer block w-full ${
                      dragActive 
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10' 
                        : newUrl 
                          ? 'border-emerald-500/40 bg-emerald-500/5' 
                          : 'border-zinc-800 hover:border-zinc-700 bg-black/25'
                    }`}
                  >
                    <input
                      id="direct-file-input"
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {!newUrl ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-3 bg-zinc-900 rounded-full border border-zinc-800 text-zinc-400 group-hover:text-white transition-colors">
                          <Upload className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                        <div>
                          <p className="text-xs font-serif font-semibold text-white">Drag or Click to upload picture or video</p>
                          <p className="text-[9px] text-zinc-500 font-mono uppercase mt-1">Supports High Resolution JPG/PNG images and MP4/WebM videos</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row items-center gap-4 w-full p-2">
                        {/* Thumbnail preview */}
                        <div className="w-24 h-16 rounded overflow-hidden border border-zinc-800 flex-shrink-0 bg-black flex items-center justify-center relative">
                          {newUrl.match(/\.(mp4|webm|mov)$/i) || newUrl.startsWith('data:video') ? (
                            <video src={newUrl} className="w-full h-full object-cover" muted playsInline />
                          ) : (
                            <img src={newUrl} alt="Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          )}
                          <div className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[8px] font-mono text-zinc-400">
                            {newUrl.match(/\.(mp4|webm|mov)$/i) || newUrl.startsWith('data:video') ? 'VIDEO' : 'IMAGE'}
                          </div>
                        </div>

                        <div className="text-left flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#D4AF37] truncate leading-tight">{uploadedFileName || 'Source File Active'}</p>
                          <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Asset size: {uploadedFileSize || 'Processing...'}</p>
                          <p className="text-[9px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-400" /> Loaded as secure local data vector
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearUploadedFile();
                          }}
                          className="px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded border border-red-500/25 transition-colors self-end md:self-center"
                        >
                          Change File
                        </button>
                      </div>
                    )}
                  </label>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 bg-black/20 p-3 rounded-lg border border-zinc-800/50 mt-1">
              <label className="flex items-center gap-3 cursor-pointer w-fit group">
                <input 
                  type="checkbox" 
                  checked={enableDates}
                  onChange={(e) => setEnableDates(e.target.checked)}
                  className="w-4 h-4 rounded appearance-none border border-zinc-600 checked:bg-[#D4AF37] checked:border-[#D4AF37] flex-shrink-0 relative after:content-[''] after:absolute after:hidden checked:after:block after:left-[4px] after:top-[1px] after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-black after:rotate-45"
                />
                <span className="text-xs font-serif font-bold text-[#D4AF37] tracking-wider group-hover:text-[#F4D03F] transition-colors mt-0.5">
                  Enable Broadcast Dates
                </span>
              </label>

              {enableDates && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-zinc-800/60">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Broadcast Start Date</label>
                    <input 
                      type="date" 
                      value={newStart}
                      onChange={(e) => setNewStart(e.target.value)}
                      className="bg-[#0B0B0D] border border-zinc-800 text-xs p-2 rounded focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Expirational End Date</label>
                    <input 
                      type="date" 
                      value={newEnd}
                      onChange={(e) => setNewEnd(e.target.value)}
                      className="bg-[#0B0B0D] border border-zinc-800 text-xs p-2 rounded focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className=" bg-[#1A1B20]/40 p-3 rounded-md border border-zinc-800/80 mt-2 flex flex-col gap-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Custom Slideshow Time Interval (Duration)</span>
              </label>
              <p className="text-[9.5px] text-zinc-500 font-mono">
                Duration (seconds) this specific media asset will display before transitions.
              </p>
              <input 
                type="number" 
                min="2"
                max="300"
                value={newDuration}
                onChange={(e) => setNewDuration(Math.max(2, parseInt(e.target.value) || 8))}
                className="bg-black border border-zinc-800 text-xs p-2 rounded text-[#D4AF37] font-mono w-28 mt-1 focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div className=" flex gap-2 justify-end mt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="border border-zinc-800 hover:border-zinc-700 text-xs font-serif px-4 py-2 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#D4AF37] hover:bg-[#F4D03F] text-black font-serif font-bold text-xs px-4 py-2 rounded transition-all"
              >
                Publish Loops
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MEDIA ASSETS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" id="media-assets-grid">
        {filteredMedia.map((item) => (
          <div key={item.id} className="bg-[#15161A] border border-zinc-800 rounded-md overflow-hidden flex flex-col justify-between hover:border-[#D4AF37]/25 transition-all">
            
            {/* Asset Image Container */}
            <div className="h-40 bg-[#0B0B0D] relative group overflow-hidden flex items-center justify-center">
              {item.type === 'video' || item.url.match(/\.(mp4|webm|mov)$/i) || item.url.startsWith('data:video') ? (
                <video 
                  src={item.url} 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500 bg-black"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img 
                  src={item.url} 
                  alt={item.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D]/90 via-transparent to-transparent"></div>
              
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span className="text-[9px] font-mono uppercase tracking-widest bg-emerald-700/80 text-white px-2 py-0.5 rounded">
                  Background
                </span>
              </div>

              {item.active && (
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] px-2 py-0.5 rounded backdrop-blur">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Active on TV
                </div>
              )}
            </div>

            <div className="p-4 flex flex-col gap-3">
              <div>
                <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider line-clamp-1">
                  {item.title}
                </h4>
                
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono mt-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono mt-2 bg-black/40 px-2.5 py-1.5 rounded border border-zinc-800/50">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="font-semibold text-zinc-500">Loop Delay:</span>
                  <input 
                    type="number"
                    min="2"
                    max="300"
                    value={item.displayDuration || 8}
                    onChange={(e) => {
                      const val = Math.max(2, parseInt(e.target.value) || 8);
                      const updated = media.map(m => m.id === item.id ? { ...m, displayDuration: val } : m);
                      onUpdateMedia(updated);
                    }}
                    className="w-14 bg-[#15161A] border border-zinc-800 text-center font-mono rounded text-[#D4AF37] px-1 py-0.5 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-0"
                  />
                  <span className="text-[10px] text-zinc-550">sec</span>
                </div>
              </div>

              <div className="flex gap-2 border-t border-zinc-800/80 pt-3">
                <button
                  onClick={() => toggleMediaActive(item.id)}
                  className={`flex-1 text-center text-[11px] font-serif py-1 rounded transition-colors ${
                    item.active 
                      ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' 
                      : 'bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/25'
                  }`}
                >
                  {item.active ? 'Mute Broadcast' : 'Deploy Live'}
                </button>

                <button
                  onClick={() => setPreviewItem(item)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 p-1 rounded transition-colors flex items-center justify-center w-8"
                  title="Expand preview"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteMediaItem(item.id)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 p-1 rounded transition-colors flex items-center justify-center w-8"
                  id={`delete-media-${item.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* FULL EXPANDED VIEW DIALOG */}
      {previewItem && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 animate-fade-in select-none">
          <div className="bg-[#15161A] rounded-xl border border-[#D4AF37]/40 overflow-hidden max-w-2xl w-full flex flex-col relative shadow-2xl">
            <button 
              onClick={() => setPreviewItem(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/90 text-zinc-300 p-2 rounded-full border border-zinc-700 hover:border-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {previewItem.type === 'video' || previewItem.url.match(/\.(mp4|webm|mov)$/i) || previewItem.url.startsWith('data:video') ? (
              <video 
                src={previewItem.url} 
                controls
                autoPlay
                loop
                className="w-full h-85 max-h-96 object-contain border-b border-[#D4AF37]/10 bg-black"
              />
            ) : (
              <img 
                src={previewItem.url} 
                alt={previewItem.title} 
                referrerPolicy="no-referrer"
                className="w-full h-85 max-h-96 object-cover border-b border-[#D4AF37]/10 bg-zinc-950"
              />
            )}

            <div className="p-5">
              <span className="text-[10px] bg-[#D4AF37] text-black font-extrabold font-mono px-2 py-0.5 rounded uppercase font-bold tracking-widest">
                {previewItem.type} Ref Loop
              </span>
              <h3 className="font-serif text-lg font-bold text-[#F8F5EE] mt-2 tracking-wide uppercase">
                {previewItem.title}
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-1.5 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D4AF37]" /> Active Schedule Duration: {previewItem.startDate} up to {previewItem.endDate}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
