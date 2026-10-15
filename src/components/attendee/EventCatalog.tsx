import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EventItem } from '../../types';
import { Search, MapPin, Calendar, Users, ArrowRight, ShieldCheck, FileSpreadsheet, Building2 } from 'lucide-react';

interface EventCatalogProps {
  onSelectEvent: (event: EventItem) => void;
  onBookEvent: (event: EventItem) => void;
}

export const EventCatalog: React.FC<EventCatalogProps> = ({ onSelectEvent, onBookEvent }) => {
  const { events } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Procurement & Supply Chain', 'Enterprise & Tech', 'Design & Innovation'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Presentation */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-8 sm:p-12">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-400">
            <span>Enterprise Event Infrastructure</span>
            <span aria-hidden="true">·</span>
            <span>B2B Purchase Orders</span>
            <span aria-hidden="true">·</span>
            <span>Live Split Gateways</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight text-balance">
            Next-generation event management with integrated procurement and live split payouts.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Register individual delegates or multi-seat corporate teams with automated coworker invitation workflows. Settle ticket purchases instantly via live payment gateway splits or enterprise Purchase Order net-30 billing.
          </p>

          {/* Value props in unboxed text row */}
          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Multi-seat coworker bookings with email RSVPs</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Direct 91.5% Organiser / 8.5% Admin split transfers</span>
            </div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <span>Vendor RFPs, PO matching & invoice payments</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Interactive Filter Bar */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search summits, locations, or technical topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
          </input>
        </div>

        {/* Interactive Segmented Filter Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </section>

      {/* Events Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const minPrice = Math.min(...event.ticketTiers.map(t => t.price));
          const maxPrice = Math.max(...event.ticketTiers.map(t => t.price));
          const totalCapacity = event.ticketTiers.reduce((acc, t) => acc + t.totalSeats, 0);
          const totalSold = event.ticketTiers.reduce((acc, t) => acc + t.soldSeats, 0);
          const seatsAvailable = totalCapacity - totalSold;

          return (
            <div
              key={event.id}
              className="group bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                {/* Event Banner with zero-broken fallback */}
                <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                  <img
                    src={event.bannerUrl}
                    alt={event.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback gracefully
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                  
                  {/* Category text kicker */}
                  <div className="absolute top-3 left-3 text-[11px] font-medium text-slate-300 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded border border-slate-700">
                    {event.category}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <h3 className="text-base font-bold text-white leading-snug group-hover:text-indigo-300 transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {event.tagline}
                  </p>

                  {/* Unboxed Metadata with typographic separators */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {event.date}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {event.location}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums text-emerald-400">
                      {seatsAvailable} seats remaining
                    </span>
                  </div>

                  {/* Organizer & Procurement Budget info */}
                  <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between border-t border-slate-800/80">
                    <span className="truncate">By {event.organizerName}</span>
                    <span className="text-slate-400">PO Accepted</span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Pricing & Action CTA */}
              <div className="p-5 pt-0 border-t border-slate-800/60 mt-2 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">From</div>
                  <div className="text-lg font-bold font-mono text-white tabular-nums">
                    ${minPrice} <span className="text-xs font-normal text-slate-400">/ pass</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectEvent(event)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                  >
                    Details
                  </button>

                  <button
                    onClick={() => onBookEvent(event)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <span>Book Seats</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </section>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12 border border-slate-800 rounded-xl bg-slate-900/40 p-8">
          <p className="text-sm text-slate-400">No events matched your search filters.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="mt-3 px-4 py-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 rounded-md"
          >
            Clear Filters
          </button>
        </div>
      )}

    </div>
  );
};
