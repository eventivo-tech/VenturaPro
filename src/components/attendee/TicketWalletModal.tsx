import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderItem, CoworkerSeat } from '../../types';
import { X, QrCode, Ticket, Mail, Calendar, MapPin, CheckCircle, Clock, Download, Printer } from 'lucide-react';

interface TicketWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEmailInbox: () => void;
  highlightOrderId?: string;
}

export const TicketWalletModal: React.FC<TicketWalletModalProps> = ({
  isOpen,
  onClose,
  onOpenEmailInbox,
  highlightOrderId
}) => {
  const { orders, currentUser } = useApp();
  const [selectedSeat, setSelectedSeat] = useState<{ order: OrderItem; seat: CoworkerSeat } | null>(null);

  if (!isOpen) return null;

  // Filter orders relevant to current user or all attendee orders
  const displayOrders = orders;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl my-6 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Attendee Ticket Wallet & Team Credentials</h2>
              <p className="text-xs text-slate-400">View personal passes, check-in QR codes, and coworker invite statuses</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {displayOrders.length === 0 ? (
            <div className="text-center py-12 border border-slate-800 rounded-xl bg-slate-950/40 p-6">
              <p className="text-sm text-slate-400">No ticket orders found in your wallet yet.</p>
              <button
                onClick={onClose}
                className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg"
              >
                Explore Events to Book
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {displayOrders.map((order) => (
                <div
                  key={order.id}
                  className={`rounded-xl border p-5 transition-all ${
                    highlightOrderId === order.id
                      ? 'border-indigo-500 bg-indigo-950/20'
                      : 'border-slate-800 bg-slate-950/50'
                  }`}
                >
                  {/* Order summary bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{order.eventTitle}</span>
                        <span className="text-[11px] font-mono text-slate-400">#{order.orderNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span>Tier: <strong className="text-slate-200">{order.tierName}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>{order.seatCount} Seat{order.seatCount > 1 ? 's' : ''}</span>
                        <span aria-hidden="true">·</span>
                        <span>Method: <strong className="text-slate-200">{order.paymentMethod === 'split_card' ? 'Credit Card (Live Split)' : `Corporate PO (${order.poNumber})`}</strong></span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                        ${order.grossAmount.toFixed(2)} Total
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {order.createdAt}
                      </div>
                    </div>
                  </div>

                  {/* Individual Seat Passes Grid */}
                  <div className="mt-4 space-y-2">
                    <div className="text-xs font-semibold text-slate-300">
                      Assigned Delegate Passes & Coworker RSVP Status:
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {order.coworkerSeats.map((seat) => (
                        <div
                          key={seat.seatNumber}
                          className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-[10px] font-mono text-indigo-400 uppercase">
                                  Seat #{seat.seatNumber}
                                </span>
                                <h4 className="text-xs font-bold text-white leading-snug">{seat.attendeeName}</h4>
                                <p className="text-[11px] text-slate-400 truncate">{seat.attendeeEmail}</p>
                              </div>
                              
                              {/* QR Preview Mini */}
                              <div className="w-10 h-10 bg-white p-1 rounded border border-slate-700 flex items-center justify-center shrink-0">
                                <QrCode className="w-8 h-8 text-slate-900" />
                              </div>
                            </div>

                            <div className="text-[11px] text-slate-400 mt-2 space-y-0.5">
                              <div>Role: <span className="text-slate-300">{seat.attendeeJobTitle}</span></div>
                              <div>Dietary: <span className="text-slate-300">{seat.dietaryRequirements}</span></div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                            {seat.inviteStatus === 'claimed' ? (
                              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Confirmed & Claimed
                              </span>
                            ) : (
                              <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                Invite Sent (Pending)
                              </span>
                            )}

                            <button
                              onClick={() => setSelectedSeat({ order, seat })}
                              className="px-2.5 py-1 text-[11px] font-semibold text-indigo-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                            >
                              View Pass
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Need to simulate a coworker opening their invite?</span>
            <button
              onClick={() => {
                onClose();
                onOpenEmailInbox();
              }}
              className="text-indigo-400 hover:text-indigo-300 underline font-medium flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Open Email Outbox Simulator</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors"
          >
            Close
          </button>
        </div>

      </div>

      {/* Individual Digital Pass Card Popover */}
      {selectedSeat && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-300">
            {/* Ticket Header */}
            <div className="bg-slate-900 text-white p-5 text-center relative">
              <button
                onClick={() => setSelectedSeat(null)}
                className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-[11px] font-mono tracking-widest text-indigo-400 uppercase font-semibold">
                Official Delegate Credential
              </div>
              <h3 className="text-base font-bold text-white mt-1 leading-snug">
                {selectedSeat.order.eventTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{selectedSeat.order.tierName}</p>
            </div>

            {/* Ticket Cutout styling */}
            <div className="relative border-b-2 border-dashed border-slate-300 my-1">
              <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-black/85" />
              <div className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-black/85" />
            </div>

            {/* Ticket Body */}
            <div className="p-6 text-center space-y-4">
              <div>
                <div className="text-lg font-bold text-slate-900">{selectedSeat.seat.attendeeName}</div>
                <div className="text-xs text-slate-500 font-medium">{selectedSeat.seat.attendeeJobTitle}</div>
                <div className="text-xs text-slate-400">{selectedSeat.seat.attendeeEmail}</div>
              </div>

              {/* QR Code */}
              <div className="w-36 h-36 bg-slate-100 border border-slate-300 rounded-xl mx-auto p-3 flex flex-col items-center justify-center shadow-inner">
                <QrCode className="w-28 h-28 text-slate-900" />
              </div>

              <div className="text-[11px] font-mono text-slate-500">
                PASS CODE: {selectedSeat.seat.qrCodeId} · SEAT #{selectedSeat.seat.seatNumber}
              </div>

              <div className="pt-2 text-xs text-slate-500 flex justify-between border-t border-slate-200">
                <span>Dietary: {selectedSeat.seat.dietaryRequirements}</span>
                <span className="font-semibold text-emerald-600">
                  {selectedSeat.seat.inviteStatus === 'claimed' ? 'Status: Active' : 'Status: Invited'}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => alert(`Simulated downloading PDF Badge for ${selectedSeat.seat.attendeeName}`)}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Pass</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors"
                  title="Print Pass"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
