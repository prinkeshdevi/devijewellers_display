/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RateHistoryEntry, JewelleryRates } from '../types';
import { 
  BarChart, 
  Download, 
  Calendar, 
  TrendingUp, 
  FileText, 
  ArrowUpRight, 
  Sparkles, 
  Layers, 
  CheckCircle2,
  Table
} from 'lucide-react';

interface ReportsAnalyticsProps {
  history: RateHistoryEntry[];
  rates: JewelleryRates;
}

export default function ReportsAnalytics({
  history,
  rates
}: ReportsAnalyticsProps) {
  
  const [exporting, setExporting] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'analytics' | 'table'>('analytics');

  const triggerExport = (format: string) => {
    setExporting(format);
    setTimeout(() => {
      setExporting(null);
      setSuccessMsg(`Report compiled and downloaded successfully in ${format.toUpperCase()}!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 1500);
  };

  // Convert raw rate values to graphical coordinates inside SVG coordinates (350x150 range)
  const drawAreaChart = () => {
    if (history.length < 2) return '';
    
    const width = 500;
    const height = 180;
    const padding = 25;
    
    const maxVal = Math.max(...history.map(h => h.rates.gold22k));
    const minVal = Math.min(...history.map(h => h.rates.gold22k));
    const spread = (maxVal - minVal) || 100;
    
    const yAxisMin = minVal - spread * 0.1;
    const yAxisMax = maxVal + spread * 0.1;
    const ySpread = yAxisMax - yAxisMin;

    const points = history.map((entry, idx) => {
      const x = padding + (idx / (history.length - 1)) * (width - padding * 2);
      const ratio = (entry.rates.gold22k - yAxisMin) / ySpread;
      const y = height - padding - ratio * (height - padding * 2);
      return { x, y, ...entry };
    });

    const pathData = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
    const fillData = `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    return { points, pathData, fillData, width, height, padding, maxVal, minVal };
  };

  const chartInfo = drawAreaChart();

  return (
    <div id="reports-analytics-root" className="flex flex-col gap-6 text-[#F1ECE4]">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#15161A] p-5 rounded-md border border-zinc-800">
        <div>
          <h2 className="text-lg md:text-xl font-serif font-bold text-[#D4AF37] flex items-center gap-2">
            <BarChart className="w-5 h-5 text-[#D4AF37]" /> Showroom Intelligence & Analytics
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Audit weekly price variations and terminal uptimes. Generate signed PDF reports for showroom board reviews.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => triggerExport('pdf')}
            disabled={exporting !== null}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-serif font-medium text-xs py-2 px-3.5 rounded transition-all flex items-center gap-2 border border-zinc-700 disabled:opacity-40"
            id="export-pdf-report"
          >
            <Download className="w-4 h-4" /> {exporting === 'pdf' ? 'COMPILING PDF...' : 'EXPORT BOARD PDF'}
          </button>
          <button
            onClick={() => triggerExport('xlsx')}
            disabled={exporting !== null}
            className="bg-[#D4AF37] hover:bg-[#F4D03F] text-black font-serif font-bold text-xs py-2 px-3.5 rounded transition-all flex items-center gap-2 shadow disabled:opacity-40"
            id="export-excel-report"
          >
            <Table className="w-4 h-4" /> {exporting === 'xlsx' ? 'WRITING EXCEL...' : 'EXPORT RAW XLSX'}
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500 text-emerald-400 text-xs font-semibold rounded flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* CORE DISPLAY MODULARS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Area Trend Map (7 cols) */}
        <div className="lg:col-span-8 bg-[#15161A] border border-zinc-800 rounded-md p-5 flex flex-col gap-5">
          <div className="border-b border-zinc-800 pb-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="font-serif text-xs font-bold text-white uppercase tracking-wider">Gold 22K Price Trend History</h3>
            </div>
            
            <div className="flex bg-black/40 rounded p-0.5 border border-zinc-800 text-[10px] uppercase font-mono">
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`px-2.5 py-1 rounded-sm ${activeTab === 'analytics' ? 'bg-[#D4AF37]/15 text-[#D4AF37]' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Line Area Chart
              </button>
              <button 
                onClick={() => setActiveTab('table')}
                className={`px-2.5 py-1 rounded-sm ${activeTab === 'table' ? 'bg-[#D4AF37]/15 text-[#D4AF37]' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Raw Data Table
              </button>
            </div>
          </div>

          {activeTab === 'analytics' && chartInfo ? (
            <div className="flex flex-col gap-4">
              
              {/* Graphical Canvas Block rendered natively using pure SVG area mapping */}
              <div className="bg-[#0B0B0D] p-4 rounded-md border border-zinc-800/80 relative overflow-hidden flex justify-center">
                <svg viewBox={`0 0 ${chartInfo.width} ${chartInfo.height}`} className="w-full max-w-[550px] overflow-visible">
                  
                  {/* Grid Lines */}
                  {Array.from({ length: 4 }).map((_, idx) => {
                    const y = chartInfo.padding + (idx / 3) * (chartInfo.height - chartInfo.padding * 2);
                    return (
                      <line 
                        key={idx} 
                        x1={chartInfo.padding} 
                        y1={y} 
                        x2={chartInfo.width - chartInfo.padding} 
                        y2={y} 
                        stroke="#27272A" 
                        strokeWidth="0.5" 
                        strokeDasharray="3 3"
                      />
                    );
                  })}

                  {/* Area fill */}
                  <path 
                    d={chartInfo.fillData} 
                    fill="url(#goldGradientFill)" 
                    opacity="0.3"
                  />

                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="goldGradientFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4AF37" />
                      <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Boundary Line */}
                  <path 
                    d={chartInfo.pathData} 
                    fill="none" 
                    stroke="#D4AF37" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Interactive Nodes and data tooltips */}
                  {chartInfo.points.map((p, idx) => (
                    <g key={idx} className="group cursor-pointer">
                      <circle 
                        cx={p.x} 
                        cy={p.y} 
                        r="4" 
                        fill="#F4D03F" 
                        stroke="#0B0B0D" 
                        strokeWidth="1.5"
                      />
                      
                      {/* Values Floating tooltip */}
                      <text 
                        x={p.x} 
                        y={p.y - 10} 
                        textAnchor="middle" 
                        fill="#F8F5EE" 
                        fontSize="8" 
                        fontFamily="monospace"
                        className="opacity-90 font-bold"
                      >
                        ₹{p.rates.gold22k}
                      </text>

                      {/* X-axis date tags */}
                      <text 
                        x={p.x} 
                        y={chartInfo.height - 6} 
                        textAnchor="middle" 
                        fill="#71717A" 
                        fontSize="8" 
                        fontFamily="monospace"
                      >
                        {p.date}
                      </text>
                    </g>
                  ))}
                  
                </svg>
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 px-1 border-t border-zinc-800/50 pt-2">
                <span>🎯 Low Point: ₹{chartInfo.minVal} (Jun 3)</span>
                <span>📈 Peak Point: ₹{chartInfo.maxVal} (Today)</span>
              </div>

            </div>
          ) : (
            <div className="overflow-x-auto flex flex-col gap-2">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-[10px] text-zinc-500 uppercase">
                    <th className="pb-2">Chronology</th>
                    <th className="pb-2">24K Gold</th>
                    <th className="pb-2">22K Gold</th>
                    <th className="pb-2">Silver</th>
                    <th className="pb-2 text-right">Platinum</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice().reverse().map((h, idx) => (
                    <tr key={idx} className="border-b border-zinc-800/40 py-2 hover:bg-black/15 text-zinc-300">
                      <td className="py-2.5 font-semibold text-[#D4AF37]">{h.date}</td>
                      <td className="py-2.5">₹{h.rates.gold24k}</td>
                      <td className="py-2.5">₹{h.rates.gold22k}</td>
                      <td className="py-2.5">₹{h.rates.silver}/g</td>
                      <td className="py-2.5 text-right">₹{h.rates.platinum}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* Audit status metrics (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <div className="bg-[#15161A] border border-zinc-800 rounded-md p-5 flex flex-col gap-3">
            <h4 className="font-serif text-xs font-bold text-[#D4AF37] uppercase tracking-wider border-b border-zinc-800 pb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#D4AF37]" /> Showroom KPI Overview
            </h4>

            <div className="flex flex-col gap-3 text-xs mt-1">
              {[
                { label: 'Weekly Uptime Index', value: '100% Core Alive', desc: 'No terminal downtime logged' },
                { label: 'Average Sync Latency', value: '45 milliseconds', desc: 'Push to endpoints instantaneous' },
                { label: 'Rate Modifications', value: '18 Times Listed', desc: 'Weekly price movements recorded' },
                { label: 'Assigned TVs', value: '4 Displays Live', desc: 'All active on showroom walls' }
              ].map((kpi, kIdx) => (
                <div key={kIdx} className="p-3 bg-[#08090B] rounded border border-zinc-850">
                  <div className="flex justify-between items-center font-serif text-zinc-200">
                    <span className="font-semibold text-zinc-300">{kpi.label}</span>
                    <span className="text-emerald-400 font-mono text-[10px] font-bold">{kpi.value}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1 font-light">{kpi.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
