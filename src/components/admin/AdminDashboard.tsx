import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  DollarSign, 
  Percent, 
  ArrowRightLeft, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock, 
  Sliders, 
  CreditCard,
  Building2,
  TrendingUp,
  Search
} from 'lucide-react';

interface AdminDashboardProps {
  onOpenReporting: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenReporting }) => {
  const { 
    events, 
    orders, 
    splitLedger, 
    purchaseOrders, 
    invoices, 
    platformFeeRate, 
    setPlatformFeeRate,
    simulateLiveGatewayDisbursement
  } = useApp();

  const [feeInput, setFeeInput] = useState<number>(platformFeeRate * 100);
  const [searchLedger, setSearchLedger] = useState<string>('');

  // Financial aggregates
  const totalGMV = orders.reduce((acc, ord) => acc + ord.grossAmount, 0);
  const totalAdminPlatformRevenue = orders.reduce((acc, ord) => acc + ord.platformFeeAmount, 0);
  const totalOrganiserDisbursements = orders.reduce((acc, ord) => acc + ord.organizerSplitAmount, 0);
  const totalGlobalProcurement = purchaseOrders.reduce((acc, po) => acc + po.totalAmount, 0);
  const totalInvoicesSettled = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0);

  const handleUpdateFee = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = Math.max(1, Math.min(30, feeInput)) / 100;
    setPlatformFeeRate(rate);
  };

  const handleExportCSV = (type: 'splits' | 'orders' | 'procurement') => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (type === 'splits') {
      csvContent += "Transaction_ID,Timestamp,Order_Number,Event,Buyer,Gross_Amount,Platform_Fee,Organiser_Split,Status\n";
      splitLedger.forEach(l => {
        csvContent += `"${l.gatewayTxId}","${l.timestamp}","${l.orderNumber}","${l.eventTitle}","${l.buyerName}",${l.grossAmount},${l.platformCut},${l.organizerCut},"${l.payoutStatus}"\n`;
      });
    } else if (type === 'orders') {
      csvContent += "Order_Number,Event,Buyer_Name,Buyer_Email,Company,Payment_Method,Seats,Gross,Organiser_Net,Status\n";
      orders.forEach(o => {
        csvContent += `"${o.orderNumber}","${o.eventTitle}","${o.buyerName}","${o.buyerEmail}","${o.buyerCompany}","${o.paymentMethod}",${o.seatCount},${o.grossAmount},${o.organizerSplitAmount},"${o.paymentStatus}"\n`;
      });
    } else {
      csvContent += "Invoice_Number,PO_Number,Vendor,Event,Amount,Due_Date,Status\n";
      invoices.forEach(i => {
        csvContent += `"${i.invoiceNumber}","${i.poNumber}","${i.vendorName}","${i.eventTitle}",${i.amount},"${i.dueDate}","${i.status}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `venturepro_${type}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLedger = splitLedger.filter(item => 
    item.gatewayTxId.toLowerCase().includes(searchLedger.toLowerCase()) ||
    item.orderNumber.toLowerCase().includes(searchLedger.toLowerCase()) ||
    item.buyerName.toLowerCase().includes(searchLedger.toLowerCase()) ||
    item.eventTitle.toLowerCase().includes(searchLedger.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-indigo-400 font-semibold uppercase">
            Platform Master Console & Dual Split Gateway
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Website Administrator & Financial Split Vault
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time split routing between Organiser Connected Accounts and Admin Platform Vault.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExportCSV('splits')}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export Split Ledger (CSV)</span>
          </button>

          <button
            onClick={onOpenReporting}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Comprehensive Audits</span>
          </button>
        </div>
      </div>

      {/* KPI 4-Card Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Admin Cut */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs text-indigo-400 font-medium flex items-center justify-between">
            <span>Admin Platform Revenue</span>
            <span className="font-mono text-[11px] text-indigo-300">{(platformFeeRate * 100).toFixed(1)}% Take</span>
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-400 tabular-nums">
            ${totalAdminPlatformRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500">
            Transferred directly to platform master account
          </div>
        </div>

        {/* Metric 2: Gross GMV */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Gross Platform GMV</span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            ${totalGMV.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500">
            Total ticket volume settled through gateway
          </div>
        </div>

        {/* Metric 3: Organiser Net Disbursed */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Disbursed to Organisers</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            ${totalOrganiserDisbursements.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500">
            Directly credited to connected organizer Stripe IDs
          </div>
        </div>

        {/* Metric 4: Vendor PO Volume */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Procurement Volume</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            ${totalGlobalProcurement.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500">
            ${totalInvoicesSettled.toLocaleString()} in verified supplier invoices paid
          </div>
        </div>

      </div>

      {/* Dynamic Split Fee Configuration Engine */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Live Split Transfer Engine Configuration</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Current Split: <strong className="text-white">{(platformFeeRate * 100).toFixed(1)}% Admin</strong> / <strong className="text-emerald-400">{(100 - platformFeeRate * 100).toFixed(1)}% Organiser</strong>
          </span>
        </div>

        <form onSubmit={handleUpdateFee} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 text-xs">
          <div className="flex-1 flex items-center gap-3">
            <span className="text-slate-400 font-medium whitespace-nowrap">Platform Take Rate:</span>
            <input
              type="range"
              min="2"
              max="20"
              step="0.5"
              value={feeInput}
              onChange={(e) => setFeeInput(Number(e.target.value))}
              className="flex-1 accent-indigo-500"
            />
            <span className="font-mono font-bold text-white tabular-nums w-12 text-right">
              {feeInput.toFixed(1)}%
            </span>
          </div>

          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            Apply Live Split Rate
          </button>
        </form>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          Adjusting this rate updates real-time fee calculations on all subsequent ticket purchases. Payouts are routed directly at the gateway layer to ensure instantaneous transfer separation without escrow bottlenecks.
        </p>
      </div>

      {/* Live Split Transfer Ledger */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white">Live Split Payment Ledger</h3>
            <p className="text-xs text-slate-400">Every ticket payment dual-disbursed between Organiser and Platform</p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Tx ID, Order # or Buyer..."
              value={searchLedger}
              onChange={(e) => setSearchLedger(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-mono text-[11px]">
                <tr>
                  <th className="py-3 px-4">Gateway Tx ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Order / Event</th>
                  <th className="py-3 px-4">Buyer Account</th>
                  <th className="py-3 px-4 text-right">Gross Total</th>
                  <th className="py-3 px-4 text-right">Admin Fee</th>
                  <th className="py-3 px-4 text-right">Organiser Payout</th>
                  <th className="py-3 px-4">Split Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredLedger.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No split transactions matching search.
                    </td>
                  </tr>
                ) : (
                  filteredLedger.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-indigo-400">
                        {tx.gatewayTxId}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {tx.timestamp}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{tx.orderNumber}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{tx.eventTitle}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {tx.buyerName}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-white tabular-nums">
                        ${tx.grossAmount.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-indigo-300 tabular-nums">
                        +${tx.platformCut.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 tabular-nums">
                        +${tx.organizerCut.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        {tx.payoutStatus === 'settled_instant' ? (
                          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Settled Instant
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Escrow Scheduled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
