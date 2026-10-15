import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, User, Mail, Shield, Building2, Ticket } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenEmailInbox: () => void;
  onOpenTicketWallet: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAuth,
  onOpenEmailInbox,
  onOpenTicketWallet
}) => {
  const { currentUser, activeRole, emails } = useApp();
  const unreadEmails = emails.filter(e => !e.read).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#explore"
          onClick={(e) => { e.preventDefault(); onSelectTab('explore'); }}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <Calendar className="w-4 h-4" />
          </div>
          <span>VenturePro Events</span>
        </a>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectTab('explore')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              currentTab === 'explore'
                ? 'text-white border-b-2 border-indigo-500 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Explore Events
          </button>

          {activeRole === 'organiser' && (
            <>
              <button
                onClick={() => onSelectTab('organiser_sales')}
                className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                  currentTab === 'organiser_sales'
                    ? 'text-white border-b-2 border-indigo-500 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Ticket Velocity & Sales
              </button>
              <button
                onClick={() => onSelectTab('organiser_procurement')}
                className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                  currentTab === 'organiser_procurement'
                    ? 'text-white border-b-2 border-indigo-500 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Procurement & Invoices
              </button>
            </>
          )}

          {activeRole === 'admin' && (
            <>
              <button
                onClick={() => onSelectTab('admin_splits')}
                className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                  currentTab === 'admin_splits'
                    ? 'text-white border-b-2 border-indigo-500 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Live Split Ledger
              </button>
              <button
                onClick={() => onSelectTab('admin_procurement_audit')}
                className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                  currentTab === 'admin_procurement_audit'
                    ? 'text-white border-b-2 border-indigo-500 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Vendor Audits
              </button>
            </>
          )}

          {activeRole === 'attendee' && (
            <button
              onClick={onOpenTicketWallet}
              className="text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Ticket className="w-4 h-4 text-slate-400" />
              <span>My Ticket Wallet</span>
            </button>
          )}

          {/* Interactive Email Notifications outbox preview */}
          <button
            onClick={onOpenEmailInbox}
            className="text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            title="View dispatched coworker invitations and emails"
          >
            <Mail className="w-4 h-4 text-slate-400" />
            <span>Email Outbox ({emails.length})</span>
            {unreadEmails > 0 && (
              <span className="text-[11px] font-mono font-medium text-amber-400">
                ({unreadEmails} new)
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAuth}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="max-w-[140px] truncate">{currentUser.name}</span>
            <span className="text-[11px] font-mono uppercase text-indigo-400 border border-indigo-500/30 rounded px-1.5 py-0.2">
              {currentUser.role}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
