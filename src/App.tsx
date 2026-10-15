/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { RoleQuickSwitcher } from './components/RoleQuickSwitcher';
import { EventCatalog } from './components/attendee/EventCatalog';
import { EventDetailModal } from './components/attendee/EventDetailModal';
import { BookingModal } from './components/attendee/BookingModal';
import { TicketWalletModal } from './components/attendee/TicketWalletModal';
import { EmailInboxModal } from './components/attendee/EmailInboxModal';
import { OrganiserDashboard } from './components/organiser/OrganiserDashboard';
import { ProcurementManager } from './components/organiser/ProcurementManager';
import { CreateEventModal } from './components/organiser/CreateEventModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { ReportingModal } from './components/reporting/ReportingModal';
import { EventItem } from './types';

function MainApp() {
  const { activeRole, switchRole } = useApp();

  const [currentTab, setCurrentTab] = useState<string>('explore');
  
  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEmailInboxOpen, setIsEmailInboxOpen] = useState(false);
  const [isTicketWalletOpen, setIsTicketWalletOpen] = useState(false);
  const [isReportingOpen, setIsReportingOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<EventItem | null>(null);
  const [selectedEventForBooking, setSelectedEventForBooking] = useState<EventItem | null>(null);
  const [highlightOrderId, setHighlightOrderId] = useState<string | undefined>(undefined);

  // Sync tab when role switched
  const handleRoleSwitched = () => {
    if (activeRole === 'organiser') {
      setCurrentTab('organiser_sales');
    } else if (activeRole === 'admin') {
      setCurrentTab('admin_splits');
    } else {
      setCurrentTab('explore');
    }
  };

  const handleBookingSuccess = (orderId: string) => {
    setHighlightOrderId(orderId);
    setIsTicketWalletOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* 1. Header with strict 3-Zone Top Bar Contract */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenEmailInbox={() => setIsEmailInboxOpen(true)}
        onOpenTicketWallet={() => setIsTicketWalletOpen(true)}
      />

      {/* 2. Interactive Role Switcher & Context Strip */}
      <RoleQuickSwitcher onRoleSwitched={handleRoleSwitched} />

      {/* 3. Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        
        {/* Attendee Catalog View (default or when attendee selected) */}
        {currentTab === 'explore' && (
          <EventCatalog
            onSelectEvent={(evt) => setSelectedEventForDetail(evt)}
            onBookEvent={(evt) => setSelectedEventForBooking(evt)}
          />
        )}

        {/* Organiser: Sales Velocity & Analytics */}
        {currentTab === 'organiser_sales' && (
          <OrganiserDashboard
            onOpenCreateEvent={() => setIsCreateEventOpen(true)}
            onOpenProcurement={() => setCurrentTab('organiser_procurement')}
            onOpenReporting={() => setIsReportingOpen(true)}
          />
        )}

        {/* Organiser / Admin: Procurement, POs & Vendor Invoices */}
        {(currentTab === 'organiser_procurement' || currentTab === 'admin_procurement_audit') && (
          <ProcurementManager
            onBackToSales={() => setCurrentTab(activeRole === 'admin' ? 'admin_splits' : 'organiser_sales')}
          />
        )}

        {/* Admin: Live Split Gateway & Platform Fee Ledger */}
        {currentTab === 'admin_splits' && (
          <AdminDashboard
            onOpenReporting={() => setIsReportingOpen(true)}
          />
        )}

      </main>

      {/* 4. Footer with clean copyright and domain trust */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">VenturePro Events & Procurement Platform</span>
            <span aria-hidden="true">·</span>
            <span>Live Split Transfers Enabled</span>
            <span aria-hidden="true">·</span>
            <span>Enterprise B2B Purchase Orders</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setIsReportingOpen(true)} className="hover:text-white transition-colors">
              Platform Audits
            </button>
            <button onClick={() => setIsEmailInboxOpen(true)} className="hover:text-white transition-colors">
              Email Dispatch Simulator
            </button>
            <button onClick={() => setIsAuthOpen(true)} className="hover:text-white transition-colors">
              Portals
            </button>
          </div>
        </div>
      </footer>

      {/* 5. Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <EventDetailModal
        event={selectedEventForDetail}
        isOpen={!!selectedEventForDetail}
        onClose={() => setSelectedEventForDetail(null)}
        onProceedToBooking={(evt) => {
          setSelectedEventForDetail(null);
          setSelectedEventForBooking(evt);
        }}
      />

      <BookingModal
        event={selectedEventForBooking}
        isOpen={!!selectedEventForBooking}
        onClose={() => setSelectedEventForBooking(null)}
        onBookingSuccess={handleBookingSuccess}
        onOpenEmailInbox={() => setIsEmailInboxOpen(true)}
      />

      <TicketWalletModal
        isOpen={isTicketWalletOpen}
        onClose={() => {
          setIsTicketWalletOpen(false);
          setHighlightOrderId(undefined);
        }}
        onOpenEmailInbox={() => setIsEmailInboxOpen(true)}
        highlightOrderId={highlightOrderId}
      />

      <EmailInboxModal
        isOpen={isEmailInboxOpen}
        onClose={() => setIsEmailInboxOpen(false)}
        onOpenTicketWallet={() => setIsTicketWalletOpen(true)}
      />

      <CreateEventModal
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onCreated={(id) => setCurrentTab('organiser_sales')}
      />

      <ReportingModal
        isOpen={isReportingOpen}
        onClose={() => setIsReportingOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
