import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Ticket, 
  FileSpreadsheet, 
  ArrowUpRight, 
  Clock, 
  Plus, 
  CreditCard,
  Building2,
  CheckCircle2,
  Layers
} from 'lucide-react';

interface OrganiserDashboardProps {
  onOpenCreateEvent: () => void;
  onOpenProcurement: () => void;
  onOpenReporting: () => void;
}

export const OrganiserDashboard: React.FC<OrganiserDashboardProps> = ({
  onOpenCreateEvent,
  onOpenProcurement,
  onOpenReporting
}) => {
  const { events, orders, purchaseOrders, invoices, currentUser, platformFeeRate } = useApp();

  // Aggregate metrics for organiser
  const totalTicketsSold = events.reduce((acc, ev) => {
    return acc + ev.ticketTiers.reduce((tAcc, t) => tAcc + t.soldSeats, 0);
  }, 0);

  const totalEventCapacity = events.reduce((acc, ev) => {
    return acc + ev.ticketTiers.reduce((tAcc, t) => tAcc + t.totalSeats, 0);
  }, 0);

  const totalGrossSales = orders.reduce((acc, ord) => acc + ord.grossAmount, 0);
  const totalNetOrganiserPayouts = orders.reduce((acc, ord) => acc + ord.organizerSplitAmount, 0);
  const totalPlatformFeesDeducted = orders.reduce((acc, ord) => acc + ord.platformFeeAmount, 0);

  const totalProcurementBudget = events.reduce((acc, ev) => acc + ev.procurementBudget, 0);
  const totalProcurementSpent = events.reduce((acc, ev) => acc + ev.procurementSpent, 0);
  const pendingInvoicesCount = invoices.filter(inv => inv.status === 'pending_review').length;

  // Coworker invitations stats
  const allCoworkerSeats = orders.flatMap(o => o.coworkerSeats);
  const claimedSeats = allCoworkerSeats.filter(s => s.inviteStatus === 'claimed').length;
  const pendingSeats = allCoworkerSeats.filter(s => s.inviteStatus !== 'claimed').length;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-indigo-400 font-semibold uppercase">
            Organiser Real-Time Operations Console
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Ticket Sales Velocity & Vendor Procurement
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Connected Stripe Account: <span className="font-mono text-slate-200">{currentUser.connectedStripeAccount || 'acct_1Nsk992X938aL891'}</span> · Split Rate: <span className="text-emerald-400 font-mono">{(100 - platformFeeRate * 100).toFixed(1)}% Net</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenReporting}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-400" />
            <span>Reporting & Audits</span>
          </button>

          <button
            onClick={onOpenProcurement}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Procurement & Invoices ({pendingInvoicesCount} pending)</span>
          </button>

          <button
            onClick={onOpenCreateEvent}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {/* KPI 4-Card Strip (Strict tabular numbers & single elevation depth) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Net Disbursed Payouts */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Net Organiser Payout</span>
            <span className="font-mono text-[11px] text-emerald-400">91.5% Split</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            ${totalNetOrganiserPayouts.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>Gross: ${totalGrossSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            <span className="text-indigo-400 font-mono">-${totalPlatformFeesDeducted.toFixed(0)} fee</span>
          </div>
        </div>

        {/* Metric 2: Tickets & Capacity */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Tickets Sold / Capacity</span>
            <Ticket className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {totalTicketsSold} <span className="text-sm font-normal text-slate-400">/ {totalEventCapacity}</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>Occupancy Rate</span>
            <span className="text-slate-300 font-mono font-medium">
              {((totalTicketsSold / Math.max(1, totalEventCapacity)) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Metric 3: Procurement Spend & Budget */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Procurement Spend</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            ${totalProcurementSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>Authorized PO Budget</span>
            <span className="text-slate-300 font-mono font-medium">
              ${totalProcurementBudget.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        {/* Metric 4: Coworker Invites Claim Rate */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Coworker RSVP Claims</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {claimedSeats} <span className="text-sm font-normal text-slate-400">claimed</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>Pending RSVP</span>
            <span className="text-amber-400 font-mono font-medium">{pendingSeats} pending</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Active Events Performance & Live Sales Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Events Ticket Velocity Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Active Events & Ticket Velocity</h3>
            <span className="text-xs text-slate-400 font-mono">{events.length} Live Summits</span>
          </div>

          <div className="space-y-4">
            {events.map((event) => {
              const eventCapacity = event.ticketTiers.reduce((acc, t) => acc + t.totalSeats, 0);
              const eventSold = event.ticketTiers.reduce((acc, t) => acc + t.soldSeats, 0);
              const percentSold = Math.round((eventSold / Math.max(1, eventCapacity)) * 100);
              const eventGross = event.ticketTiers.reduce((acc, t) => acc + (t.soldSeats * t.price), 0);

              return (
                <div
                  key={event.id}
                  className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-white">{event.title}</h4>
                      {/* Unboxed metadata */}
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span>{event.date}</span>
                        <span aria-hidden="true">·</span>
                        <span>{event.location}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-emerald-400 font-medium">
                          ${eventGross.toLocaleString('en-US', { minimumFractionDigits: 2 })} Gross Sales
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-bold text-slate-200">
                        {eventSold} / {eventCapacity} Seats Sold
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Procurement: ${event.procurementSpent.toLocaleString()} / ${event.procurementBudget.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Overall capacity bar */}
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentSold}%` }}
                    />
                  </div>

                  {/* Tier breakdown rows */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80">
                    {event.ticketTiers.map((tier) => (
                      <div
                        key={tier.id}
                        className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-slate-300 font-medium">
                          <span className="truncate">{tier.name}</span>
                          <span className="font-mono text-indigo-400 tabular-nums">${tier.price}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                          <span>{tier.soldSeats} sold</span>
                          <span className="text-slate-400">{tier.availableSeats} available</span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Column: Real-Time Ticket Orders & Live Splits Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Live Ticket Orders Feed</h3>
            <span className="text-xs text-indigo-400 font-mono">Real-Time</span>
          </div>

          <div className="rounded-xl bg-slate-900 border border-slate-800 divide-y divide-slate-800/80 max-h-[580px] overflow-y-auto">
            {orders.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">No orders recorded yet.</div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="p-4 space-y-2 hover:bg-slate-950/40 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{order.buyerName}</span>
                    <span className="font-mono font-bold text-emerald-400 tabular-nums">
                      +${order.organizerSplitAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 line-clamp-1">
                    {order.buyerCompany} · {order.seatCount} Seat{order.seatCount > 1 ? 's' : ''} ({order.tierName})
                  </div>

                  {/* Split metadata in unboxed text */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800/60">
                    <span>
                      {order.paymentMethod === 'split_card' ? 'Card Split' : `PO: ${order.poNumber}`}
                    </span>
                    <span className="text-slate-400">
                      Gross: ${order.grossAmount.toFixed(2)} · Fee: ${order.platformFeeAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
