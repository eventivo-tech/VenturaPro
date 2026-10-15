import React from 'react';
import { EventItem } from '../../types';
import { X, Calendar, MapPin, Check, ArrowRight, ShieldCheck, FileText, Building2, Clock } from 'lucide-react';

interface EventDetailModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
  onProceedToBooking: (event: EventItem) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onProceedToBooking
}) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Banner */}
        <div className="relative h-64 w-full bg-slate-950 overflow-hidden">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-900/80 backdrop-blur-md rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-5 left-6 right-6">
            <div className="text-xs font-semibold text-indigo-400 mb-1 tracking-wide uppercase font-mono">
              {event.category}
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Unboxed Metadata Strip */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pb-4 border-b border-slate-800">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-400" />
              {event.date}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              {event.time}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              {event.venueName}, {event.location}
            </span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white">Event Overview & Scope</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Ticket Tiers */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Available Ticket Tiers & Invoicing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {event.ticketTiers.map((tier) => (
                <div
                  key={tier.id}
                  className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-white">{tier.name}</h4>
                      <span className="text-xs font-mono font-bold text-indigo-400 tabular-nums">
                        ${tier.price}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {tier.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    {tier.perks.slice(0, 3).map((perk, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{perk}</span>
                      </div>
                    ))}
                    <div className="text-[11px] text-slate-500 font-mono pt-1">
                      {tier.availableSeats} seats remaining
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Corporate PO & Payment Terms */}
          <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-200 font-medium">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>Corporate Invoicing & Purchase Order Terms</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Need corporate invoicing? Organizations with approved credit can register delegacy groups using internal PO numbers with net-30 settlement terms or checkout via credit card with automated live payment split disbursement.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-6 pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Organized by <span className="text-slate-200 font-medium">{event.organizerName}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onProceedToBooking(event);
              }}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <span>Select Seats & Register</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
