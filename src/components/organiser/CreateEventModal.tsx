import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Trash2, Calendar, MapPin, DollarSign, Building } from 'lucide-react';
import { TicketTier } from '../../types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (eventId: string) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, onCreated }) => {
  const { createEvent } = useApp();

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('Jan 15 - 17, 2027');
  const [time, setTime] = useState('09:00 AM - 05:00 PM EST');
  const [location, setLocation] = useState('New York, NY');
  const [venueName, setVenueName] = useState('Javits Convention Center, Hall D');
  const [category, setCategory] = useState<'Enterprise & Tech' | 'Design & Innovation' | 'Procurement & Supply Chain' | 'Executive Leadership'>('Enterprise & Tech');
  const [bannerUrl, setBannerUrl] = useState('/src/assets/images/event_tech_summit_1792061251395.jpg');
  const [procurementBudget, setProcurementBudget] = useState<number>(85000);

  const [tiers, setTiers] = useState<Omit<TicketTier, 'id' | 'soldSeats'>[]>([
    {
      name: 'Executive Delegate Pass',
      price: 650,
      totalSeats: 300,
      availableSeats: 300,
      description: 'Access to keynotes, executive lounge, and networking receptions.',
      perks: ['VIP Lounge Access', 'Session Recordings', 'Complimentary Luncheons']
    },
    {
      name: 'General Admission',
      price: 350,
      totalSeats: 500,
      availableSeats: 500,
      description: 'Full conference badge and access to exhibition pavilion.',
      perks: ['Main Stage Access', 'Exhibition Floor', 'Coffee Breaks']
    }
  ]);

  if (!isOpen) return null;

  const handleAddTier = () => {
    setTiers(prev => [
      ...prev,
      {
        name: 'Workshop Add-on Pass',
        price: 200,
        totalSeats: 100,
        availableSeats: 100,
        description: 'Hands-on technical breakout track.',
        perks: ['Interactive Lab Seat', 'Digital Certificate']
      }
    ]);
  };

  const handleRemoveTier = (index: number) => {
    if (tiers.length <= 1) return;
    setTiers(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateTier = (index: number, field: string, val: any) => {
    setTiers(prev => prev.map((t, i) => i === index ? { ...t, [field]: val } : t));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const formattedTiers: TicketTier[] = tiers.map((t, idx) => ({
      ...t,
      id: `tier_${Date.now()}_${idx}`,
      soldSeats: 0,
      availableSeats: Number(t.totalSeats)
    }));

    const newEvent = createEvent({
      title: title.trim(),
      tagline: tagline.trim() || 'Accelerating the future of enterprise technologies and leadership.',
      description: description.trim() || 'A premier gathering of industry leaders, engineers, and executives.',
      date,
      time,
      location,
      venueName,
      category,
      bannerUrl,
      procurementBudget: Number(procurementBudget) || 50000,
      ticketTiers: formattedTiers
    });

    onCreated(newEvent.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl my-6 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl text-slate-100 p-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">Create New Enterprise Event</h2>
            <p className="text-xs text-slate-400 mt-0.5">Configure event schedule, multi-tier ticketing, and supplier procurement budget</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5 text-xs">
          
          {/* Basic Info */}
          <div className="space-y-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Event Title</label>
              <input
                type="text"
                required
                placeholder="e.g. FutureStack Enterprise AI & Infrastructure Expo 2027"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="One line value proposition"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Industry Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Enterprise & Tech">Enterprise & Tech</option>
                  <option value="Procurement & Supply Chain">Procurement & Supply Chain</option>
                  <option value="Design & Innovation">Design & Innovation</option>
                  <option value="Executive Leadership">Executive Leadership</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Dates & Time</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. Feb 18 - 20, 2027"
                    className="w-1/2 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200"
                  />
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="09:00 AM - 05:00 PM"
                    className="w-1/2 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Venue & Location</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                    className="w-1/2 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200"
                  />
                  <input
                    type="text"
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    placeholder="Convention Center / Hall"
                    className="w-1/2 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Authorized Procurement & Vendor Budget ($)</label>
              <input
                type="number"
                min="5000"
                step="1000"
                value={procurementBudget}
                onChange={(e) => setProcurementBudget(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Ticket Tiers */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-xs">Ticket Tiers & Pricing</h3>
                <p className="text-[11px] text-slate-400">Configure ticket passes and capacities for online booking</p>
              </div>
              <button
                type="button"
                onClick={handleAddTier}
                className="px-2.5 py-1 text-xs font-medium text-indigo-400 hover:text-white bg-slate-800 rounded border border-slate-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tier</span>
              </button>
            </div>

            <div className="space-y-3">
              {tiers.map((tier, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-200 text-xs">Tier #{idx + 1}</span>
                    {tiers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTier(idx)}
                        className="text-slate-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Tier Name</label>
                      <input
                        type="text"
                        required
                        value={tier.name}
                        onChange={(e) => handleUpdateTier(idx, 'name', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Price ($)</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={tier.price}
                        onChange={(e) => handleUpdateTier(idx, 'price', Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Total Capacity</label>
                      <input
                        type="number"
                        min="10"
                        required
                        value={tier.totalSeats}
                        onChange={(e) => handleUpdateTier(idx, 'totalSeats', Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
            >
              Publish & Launch Event
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
