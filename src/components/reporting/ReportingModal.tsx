import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Printer, Download, FileText, Calendar, Building, DollarSign, TrendingUp, Ticket } from 'lucide-react';

interface ReportingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportingModal: React.FC<ReportingModalProps> = ({ isOpen, onClose }) => {
  const { events, orders, splitLedger, purchaseOrders, invoices, platformFeeRate } = useApp();
  const [reportType, setReportType] = useState<'financial' | 'procurement' | 'attendees'>('financial');

  if (!isOpen) return null;

  // Key totals
  const totalGMV = orders.reduce((acc, o) => acc + o.grossAmount, 0);
  const totalAdminTake = orders.reduce((acc, o) => acc + o.platformFeeAmount, 0);
  const totalOrganiserNet = orders.reduce((acc, o) => acc + o.organizerSplitAmount, 0);
  const totalTicketsSold = orders.reduce((acc, o) => acc + o.seatCount, 0);
  const totalPOVolume = purchaseOrders.reduce((acc, p) => acc + p.totalAmount, 0);
  const totalInvoiced = invoices.reduce((acc, i) => acc + i.amount, 0);
  const totalPaidInvoices = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csv = "data:text/csv;charset=utf-8,";
    if (reportType === 'financial') {
      csv += "Metric,Value\n";
      csv += `"Gross Merchandise Value (GMV)",${totalGMV}\n`;
      csv += `"Platform Fee Revenue",${totalAdminTake}\n`;
      csv += `"Organiser Net Payouts",${totalOrganiserNet}\n`;
      csv += `"Total Tickets Sold",${totalTicketsSold}\n`;
      csv += `"Split Rate (Admin %)",${platformFeeRate * 100}%\n`;
    } else if (reportType === 'procurement') {
      csv += "PO_Number,Vendor,Event,Amount,Status,Issued_Date\n";
      purchaseOrders.forEach(p => {
        csv += `"${p.poNumber}","${p.vendorName}","${p.eventTitle}",${p.totalAmount},"${p.status}","${p.issuedDate}"\n`;
      });
    } else {
      csv += "Order_Number,Buyer,Coworker_Name,Email,Seat,Invite_Status\n";
      orders.forEach(o => {
        o.coworkerSeats.forEach(s => {
          csv += `"${o.orderNumber}","${o.buyerName}","${s.attendeeName}","${s.attendeeEmail}",${s.seatNumber},"${s.inviteStatus}"\n`;
        });
      });
    }

    const encoded = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `venturepro_${reportType}_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in overflow-y-auto print:p-0 print:bg-white print:text-black">
      <div className="relative w-full max-w-4xl my-6 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl text-slate-100 overflow-hidden print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/70 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Enterprise Reporting & Audit Ledger</h2>
              <p className="text-xs text-slate-400">Exportable consolidated reconciliations for finance, procurement, and tax compliance</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 p-3 bg-slate-950/50 border-b border-slate-800 print:hidden text-xs">
          <button
            onClick={() => setReportType('financial')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              reportType === 'financial' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Financial & Split Payouts Audit
          </button>
          <button
            onClick={() => setReportType('procurement')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              reportType === 'procurement' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Procurement & Vendor PO Burn
          </button>
          <button
            onClick={() => setReportType('attendees')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              reportType === 'attendees' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Attendee Delegations & Coworker RSVPs
          </button>
        </div>

        {/* Report Document Body */}
        <div className="p-8 space-y-8 bg-slate-900 print:bg-white print:text-black print:p-4">
          
          {/* Letterhead */}
          <div className="flex items-start justify-between pb-6 border-b border-slate-800 print:border-slate-300">
            <div>
              <div className="text-lg font-bold text-white print:text-black">VENTUREPRO ENTERPRISE AUDIT REPORT</div>
              <div className="text-xs text-slate-400 print:text-slate-600 font-mono mt-0.5">
                GENERATED: {new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC
              </div>
            </div>
            <div className="text-right text-xs text-slate-400 print:text-slate-600">
              <div>Entity: VenturePro Operations Ltd</div>
              <div>Audit Scope: Production Master Ledger</div>
            </div>
          </div>

          {/* Section based on report type */}
          {reportType === 'financial' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 print:bg-slate-100 print:border-slate-300">
                  <div className="text-xs text-slate-400 print:text-slate-600 font-medium">Gross GMV</div>
                  <div className="text-xl font-bold font-mono text-white print:text-black tabular-nums mt-1">
                    ${totalGMV.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 print:bg-slate-100 print:border-slate-300">
                  <div className="text-xs text-indigo-400 print:text-indigo-600 font-medium">Platform Fee ({(platformFeeRate * 100).toFixed(1)}%)</div>
                  <div className="text-xl font-bold font-mono text-indigo-400 print:text-indigo-700 tabular-nums mt-1">
                    ${totalAdminTake.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 print:bg-slate-100 print:border-slate-300">
                  <div className="text-xs text-emerald-400 print:text-emerald-700 font-medium">Organiser Net Payout</div>
                  <div className="text-xl font-bold font-mono text-emerald-400 print:text-emerald-700 tabular-nums mt-1">
                    ${totalOrganiserNet.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 print:bg-slate-100 print:border-slate-300">
                  <div className="text-xs text-slate-400 print:text-slate-600 font-medium">Tickets Issued</div>
                  <div className="text-xl font-bold font-mono text-white print:text-black tabular-nums mt-1">
                    {totalTicketsSold}
                  </div>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white print:text-black uppercase tracking-wider font-mono">
                  Settled Dual-Split Transfer Log
                </h4>
                <div className="border border-slate-800 print:border-slate-300 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 print:bg-slate-100 font-mono text-[11px] text-slate-400 print:text-slate-700">
                      <tr>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Order</th>
                        <th className="p-2.5">Buyer</th>
                        <th className="p-2.5 text-right">Gross</th>
                        <th className="p-2.5 text-right">Platform Fee</th>
                        <th className="p-2.5 text-right">Organiser Net</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                      {splitLedger.map((s) => (
                        <tr key={s.id} className="font-mono text-xs">
                          <td className="p-2.5 text-slate-400">{s.timestamp.split(' ')[0]}</td>
                          <td className="p-2.5 text-white print:text-black font-semibold">{s.orderNumber}</td>
                          <td className="p-2.5 text-slate-300 print:text-slate-800 truncate max-w-xs">{s.buyerName}</td>
                          <td className="p-2.5 text-right text-white print:text-black tabular-nums font-bold">${s.grossAmount.toFixed(2)}</td>
                          <td className="p-2.5 text-right text-indigo-400 print:text-indigo-700 tabular-nums font-bold">${s.platformCut.toFixed(2)}</td>
                          <td className="p-2.5 text-right text-emerald-400 print:text-emerald-700 tabular-nums font-bold">${s.organizerCut.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {reportType === 'procurement' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 print:bg-slate-100 print:border-slate-300">
                  <div className="text-xs text-slate-400 print:text-slate-600 font-medium">Total Authorized POs</div>
                  <div className="text-xl font-bold font-mono text-white print:text-black tabular-nums mt-1">
                    ${totalPOVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 print:bg-slate-100 print:border-slate-300">
                  <div className="text-xs text-amber-400 print:text-amber-700 font-medium">Total Invoiced</div>
                  <div className="text-xl font-bold font-mono text-amber-400 print:text-amber-700 tabular-nums mt-1">
                    ${totalInvoiced.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 print:bg-slate-100 print:border-slate-300">
                  <div className="text-xs text-emerald-400 print:text-emerald-700 font-medium">Disbursed to Vendors</div>
                  <div className="text-xl font-bold font-mono text-emerald-400 print:text-emerald-700 tabular-nums mt-1">
                    ${totalPaidInvoices.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Purchase Orders Table */}
              <div className="border border-slate-800 print:border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 print:bg-slate-100 font-mono text-[11px] text-slate-400 print:text-slate-700">
                    <tr>
                      <th className="p-2.5">PO Number</th>
                      <th className="p-2.5">Vendor Partner</th>
                      <th className="p-2.5">Scope Description</th>
                      <th className="p-2.5 text-right">Committed Amount</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                    {purchaseOrders.map((po) => (
                      <tr key={po.id} className="text-xs">
                        <td className="p-2.5 font-mono text-white print:text-black font-semibold">{po.poNumber}</td>
                        <td className="p-2.5 text-slate-300 print:text-slate-800">{po.vendorName}</td>
                        <td className="p-2.5 text-slate-400 truncate max-w-xs">{po.title}</td>
                        <td className="p-2.5 text-right font-mono text-amber-400 print:text-amber-700 font-bold tabular-nums">
                          ${po.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-2.5 font-mono uppercase text-slate-300 print:text-slate-800">{po.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {reportType === 'attendees' && (
            <div className="space-y-4">
              <div className="border border-slate-800 print:border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 print:bg-slate-100 font-mono text-[11px] text-slate-400 print:text-slate-700">
                    <tr>
                      <th className="p-2.5">Order</th>
                      <th className="p-2.5">Seat</th>
                      <th className="p-2.5">Delegate Name</th>
                      <th className="p-2.5">Work Email</th>
                      <th className="p-2.5">Job Role</th>
                      <th className="p-2.5">Dietary</th>
                      <th className="p-2.5">RSVP Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                    {orders.flatMap(o => o.coworkerSeats.map(s => ({ order: o, seat: s }))).map(({ order, seat }, i) => (
                      <tr key={i} className="text-xs">
                        <td className="p-2.5 font-mono text-slate-400">{order.orderNumber}</td>
                        <td className="p-2.5 font-mono text-indigo-400 font-bold">#{seat.seatNumber}</td>
                        <td className="p-2.5 font-semibold text-white print:text-black">{seat.attendeeName}</td>
                        <td className="p-2.5 text-slate-400">{seat.attendeeEmail}</td>
                        <td className="p-2.5 text-slate-300 print:text-slate-800">{seat.attendeeJobTitle}</td>
                        <td className="p-2.5 text-slate-400">{seat.dietaryRequirements}</td>
                        <td className="p-2.5 font-mono text-[11px]">
                          {seat.inviteStatus === 'claimed' ? (
                            <span className="text-emerald-400 print:text-emerald-700 font-semibold">Claimed (Active)</span>
                          ) : (
                            <span className="text-amber-400 print:text-amber-700">Pending RSVP</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
