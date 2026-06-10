/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Branch } from '../types';
import { 
  Building2, 
  MapPin, 
  PhoneCall, 
  Users, 
  Trash2, 
  PlusCircle, 
  X, 
  CheckCircle,
  Edit2
} from 'lucide-react';

interface BranchManagerProps {
  branches: Branch[];
  onUpdateBranches: (newBranches: Branch[]) => void;
  onTriggerLog: (action: string, details: string) => void;
}

export default function BranchManager({
  branches,
  onUpdateBranches,
  onTriggerLog
}: BranchManagerProps) {
  
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newAddr, setNewAddr] = useState<string>('');
  const [newContact, setNewContact] = useState<string>('');
  const [newManager, setNewManager] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const deleteBranch = (id: string) => {
    const target = branches.find(b => b.id === id);
    if (target) {
      onTriggerLog('Branch Decommissioned', `De-registered physical showroom location: "${target.name}"`);
    }
    const updated = branches.filter(b => b.id !== id);
    onUpdateBranches(updated);
    triggerSuccess('Showroom removed successfully.');
  };

  const registerNewBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAddr || !newContact) return;

    const newItem: Branch = {
      id: 'b_' + Date.now(),
      name: newName,
      address: newAddr,
      contact: newContact,
      manager: newManager || 'N/A'
    };

    onUpdateBranches([...branches, newItem]);
    onTriggerLog('Branch Registered', `Created new branch reference: "${newName}" assigned to manager ${newItem.manager}.`);

    // Reset
    setNewName('');
    setNewAddr('');
    setNewContact('');
    setNewManager('');
    setShowAddForm(false);
    triggerSuccess(`Showroom "${newName}" configured on system!`);
  };

  return (
    <div id="branch-manager-root" className="flex flex-col gap-6 text-[#F1ECE4]">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#15161A] p-5 rounded-md border border-zinc-800">
        <div>
          <h2 className="text-lg md:text-xl font-serif font-bold text-[#D4AF37] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#D4AF37]" /> Retail Branches & Showroom Hub
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Configure geographic store nodes, assign local managers, and allocate local support desk contact details.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="bg-[#D4AF37] hover:bg-[#F4D03F] text-black font-serif font-bold text-xs py-2 px-4 rounded transition-all flex items-center gap-2 shadow"
        >
          <PlusCircle className="w-4 h-4" /> ADD NEW STORE
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500 text-emerald-400 text-xs font-semibold rounded flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* NEW BRANCH FORM */}
      {showAddForm && (
        <div className="p-5 rounded-md bg-[#15161A] border-2 border-[#D4AF37]/45 flex flex-col gap-4 relative animate-fade-in">
          <button 
            onClick={() => setShowAddForm(false)} 
            className="absolute top-4 right-4 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h3 className="font-serif text-sm font-semibold text-[#D4AF37] border-b border-zinc-800 pb-2">
            Register New Showroom Outlet Location
          </h3>

          <form onSubmit={registerNewBranch} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Showroom Name</label>
              <input 
                type="text" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., Koramangala Palace Suite"
                required
                className="bg-[#0B0B0D] border border-zinc-800 text-xs p-2 rounded focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Store Manager Name</label>
              <input 
                type="text" 
                value={newManager}
                onChange={(e) => setNewManager(e.target.value)}
                placeholder="e.g., Harish Deshmukh"
                className="bg-[#0B0B0D] border border-zinc-800 text-xs p-2 rounded focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Full Postal Address</label>
              <input 
                type="text" 
                value={newAddr}
                onChange={(e) => setNewAddr(e.target.value)}
                placeholder="e.g., Shop No: 12, Ground Floor, Royal Arcade, Koramangala, Bengaluru 560034"
                required
                className="bg-[#0B0B0D] border border-zinc-800 text-xs p-2 rounded focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Helpdesk Contact Number</label>
              <input 
                type="text" 
                value={newContact}
                onChange={(e) => setNewContact(e.target.value)}
                placeholder="e.g., +91 80 4321 0099"
                required
                className="bg-[#0B0B0D] border border-zinc-800 text-xs p-2 rounded focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="md:col-span-2 flex gap-2 justify-end mt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="border border-zinc-800 text-xs font-serif px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#D4AF37] hover:bg-[#F4D03F] text-black font-serif font-bold text-xs px-4 py-2 rounded shadow"
              >
                Deploy Store Node
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BRANCHES DIRECTORY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="branches-list-grid">
        {branches.map((b) => (
          <div key={b.id} className="bg-[#15161A] border border-zinc-800 rounded-md p-5 flex flex-col justify-between gap-4 hover:border-[#D4AF37]/25 transition-all relative overflow-hidden">
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#D4AF37]"></div>

            <div className="pl-2">
              <div className="flex justify-between items-start gap-2 border-b border-zinc-850 pb-2.5">
                <div>
                  <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
                    {b.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] text-zinc-500">
                    <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Manager: <strong className="text-zinc-300 font-semibold">{b.manager}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => deleteBranch(b.id)}
                  className="p-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/15 rounded transition-colors inline-block"
                  id={`delete-branch-${b.id}`}
                  title="Remove Branch Mappings"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-col gap-2.5 mt-4 text-xs font-sans text-zinc-400 leading-relaxed">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>{b.address}</span>
                </div>

                <div className="flex items-center gap-2 text-zinc-500 mt-1 font-mono text-[11px]">
                  <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Assigned Direct desk: <strong className="text-zinc-300 font-sans text-xs">{b.contact}</strong></span>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
