import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PurchaseOrder, VendorInvoice, Vendor } from '../../types';
import { 
  Building2, 
  Plus, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  ShieldCheck, 
  ArrowRight, 
  Search,
  ExternalLink,
  Receipt,
  X
} from 'lucide-react';

interface ProcurementManagerProps {
  onBackToSales: () => void;
}

export const ProcurementManager: React.FC<ProcurementManagerProps> = ({ onBackToSales }) => {
  const { 
    events, 
    vendors, 
    purchaseOrders, 
    invoices, 
    createPurchaseOrder, 
    approveAndPayVendorInvoice, 
    submitVendorInvoice 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'invoices' | 'pos' | 'vendors'>('invoices');
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  
  // New PO modal state
  const [isCreatingPO, setIsCreatingPO] = useState(false);
  const [poTitle, setPoTitle] = useState('');
  const [poVendorId, setPoVendorId] = useState(vendors[0]?.id || '');
  const [poNotes, setPoNotes] = useState('');
  const [poLineItemDesc, setPoLineItemDesc] = useState('');
  const [poQuantity, setPoQuantity] = useState<number>(1);
  const [poUnitPrice, setPoUnitPrice] = useState<number>(5000);

  // New Invoice modal state
  const [isSubmittingInvoice, setIsSubmittingInvoice] = useState(false);
  const [invPoId, setInvPoId] = useState(purchaseOrders[0]?.id || '');
  const [invNumber, setInvNumber] = useState('');
  const [invAmount, setInvAmount] = useState<number>(5000);
  const [invDueDate, setInvDueDate] = useState('2026-11-15');
  const [invDesc, setInvDesc] = useState('');

  // Selected event object
  const currentEvent = events.find(e => e.id === selectedEventId) || events[0];

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!poTitle.trim() || !poLineItemDesc.trim()) return;

    createPurchaseOrder({
      eventId: selectedEventId,
      vendorId: poVendorId,
      title: poTitle.trim(),
      notes: poNotes.trim() || 'Procurement standard master services agreement.',
      lineItems: [
        {
          description: poLineItemDesc.trim(),
          quantity: Number(poQuantity) || 1,
          unitPrice: Number(poUnitPrice) || 1000
        }
      ]
    });

    setIsCreatingPO(false);
    setPoTitle('');
    setPoLineItemDesc('');
  };

  const handleSubmitInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invNumber.trim() || !invDesc.trim()) return;

    submitVendorInvoice({
      poId: invPoId,
      invoiceNumber: invNumber.trim(),
      amount: Number(invAmount) || 1000,
      dueDate: invDueDate,
      description: invDesc.trim()
    });

    setIsSubmittingInvoice(false);
    setInvNumber('');
    setInvDesc('');
  };

  // Filter invoices and POs by event if desired, or show all
  const filteredInvoices = invoices.filter(inv => !selectedEventId || inv.eventId === selectedEventId);
  const filteredPOs = purchaseOrders.filter(po => !selectedEventId || po.eventId === selectedEventId);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-amber-400 font-semibold uppercase">
            Procurement & Vendor Operations
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Purchase Orders & Real-Time Vendor Invoices
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automate supplier RFPs, 3-way invoice matching, and immediate remittance payouts from event budgets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSubmittingInvoice(true)}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Receipt className="w-4 h-4 text-slate-400" />
            <span>Simulate Vendor Invoice</span>
          </button>

          <button
            onClick={() => setIsCreatingPO(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Purchase Order</span>
          </button>
        </div>
      </div>

      {/* Event Budget Context Bar */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-400">Target Event Scope:</span>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>{ev.title}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400">Authorized PO Budget: </span>
              <strong className="text-white">${currentEvent?.procurementBudget.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
            </div>
            <div>
              <span className="text-slate-400">Procurement Spent: </span>
              <strong className="text-amber-400">${currentEvent?.procurementSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
            </div>
            <div>
              <span className="text-slate-400">Remaining: </span>
              <strong className="text-emerald-400">
                ${Math.max(0, (currentEvent?.procurementBudget || 0) - (currentEvent?.procurementSpent || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </strong>
            </div>
          </div>
        </div>

        {/* Budget Bar */}
        {currentEvent && (
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.round((currentEvent.procurementSpent / Math.max(1, currentEvent.procurementBudget)) * 100))}%`
              }}
            />
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`pb-2 px-3 transition-colors ${
            activeTab === 'invoices' 
              ? 'text-white border-b-2 border-amber-500 font-bold' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Vendor Invoices ({filteredInvoices.length})
        </button>

        <button
          onClick={() => setActiveTab('pos')}
          className={`pb-2 px-3 transition-colors ${
            activeTab === 'pos' 
              ? 'text-white border-b-2 border-amber-500 font-bold' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Purchase Orders ({filteredPOs.length})
        </button>

        <button
          onClick={() => setActiveTab('vendors')}
          className={`pb-2 px-3 transition-colors ${
            activeTab === 'vendors' 
              ? 'text-white border-b-2 border-amber-500 font-bold' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Approved Vendor Directory ({vendors.length})
        </button>
      </div>

      {/* Tab 1: Vendor Invoices */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-mono text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Vendor & Scope</th>
                    <th className="py-3 px-4">Matched PO #</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        No vendor invoices for this event yet.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-950/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-medium text-white">
                          {inv.invoiceNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-200">{inv.vendorName}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-xs">
                            {inv.lineItems[0]?.description || 'Milestone invoice delivery'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-indigo-400">
                          {inv.poNumber}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono">
                          {inv.dueDate}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-white tabular-nums">
                          ${inv.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4">
                          {inv.status === 'paid' && (
                            <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1 font-mono">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Paid ({inv.paymentTxId})
                            </span>
                          )}
                          {inv.status === 'approved' && (
                            <span className="text-[11px] font-medium text-indigo-400 flex items-center gap-1 font-mono">
                              <Clock className="w-3.5 h-3.5" />
                              Approved for Payout
                            </span>
                          )}
                          {inv.status === 'pending_review' && (
                            <span className="text-[11px] font-medium text-amber-400 flex items-center gap-1 font-mono">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Pending Approval
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {inv.status !== 'paid' ? (
                            <button
                              onClick={() => approveAndPayVendorInvoice(inv.id)}
                              className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded transition-colors shadow-sm"
                            >
                              Approve & Pay
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-500 font-mono">Disbursed</span>
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
      )}

      {/* Tab 2: Purchase Orders */}
      {activeTab === 'pos' && (
        <div className="space-y-4">
          <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-mono text-[11px]">
                  <tr>
                    <th className="py-3 px-4">PO Number</th>
                    <th className="py-3 px-4">Title & Scope</th>
                    <th className="py-3 px-4">Vendor Partner</th>
                    <th className="py-3 px-4">Issued Date</th>
                    <th className="py-3 px-4 text-right">Committed Value</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredPOs.map((po) => (
                    <tr key={po.id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-white">
                        {po.poNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">{po.title}</div>
                        <div className="text-[11px] text-slate-400">{po.notes}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-slate-300 font-medium">{po.vendorName}</span>
                        <div className="text-[11px] text-slate-500">{po.vendorCategory}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono">
                        {po.issuedDate}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-white tabular-nums">
                        ${po.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-mono text-slate-300 uppercase">
                          {po.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Vendors Directory */}
      {activeTab === 'vendors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{vendor.name}</h4>
                  <div className="text-xs text-indigo-400 mt-0.5">{vendor.category}</div>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/30 px-2 py-0.5 rounded">
                  Verified Supplier
                </span>
              </div>

              {/* Unboxed Metadata */}
              <div className="text-xs text-slate-400 space-y-1 pt-1 border-t border-slate-800/80">
                <div>Contact: <span className="text-slate-300">{vendor.contactName} ({vendor.email})</span></div>
                <div>Routing: <span className="font-mono text-slate-300">{vendor.payoutRouting}</span></div>
                <div className="flex items-center gap-2 pt-1 font-mono text-slate-500 text-[11px]">
                  <span>Active POs: {vendor.activePOsCount}</span>
                  <span aria-hidden="true">·</span>
                  <span>Total Billed: ${vendor.totalBilled.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setPoVendorId(vendor.id);
                    setIsCreatingPO(true);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Issue New PO to Supplier</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Issue PO Modal */}
      {isCreatingPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Issue Official Event Purchase Order (PO)</h3>
              <button
                onClick={() => setIsCreatingPO(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Target Event</label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                >
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Supplier / Vendor</label>
                <select
                  value={poVendorId}
                  onChange={(e) => setPoVendorId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                >
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">PO Title / Scope of Work</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Reception Catering & Sommelier Wine Pairing"
                  value={poTitle}
                  onChange={(e) => setPoTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Primary Deliverable Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 200 plated 3-course dinners and continuous coffee bar stations"
                  value={poLineItemDesc}
                  onChange={(e) => setPoLineItemDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={poQuantity}
                    onChange={(e) => setPoQuantity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Unit Price ($)</label>
                  <input
                    type="number"
                    min="10"
                    step="0.01"
                    required
                    value={poUnitPrice}
                    onChange={(e) => setPoUnitPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Total Authorized Amount:</span>
                <span className="text-base font-bold font-mono text-amber-400 tabular-nums">
                  ${(poQuantity * poUnitPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingPO(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors shadow-sm"
                >
                  Authorize & Issue PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Simulate Incoming Invoice Modal */}
      {isSubmittingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Simulate Incoming Vendor Invoice</h3>
              <button
                onClick={() => setIsSubmittingInvoice(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitInvoice} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Matched Purchase Order</label>
                <select
                  value={invPoId}
                  onChange={(e) => setInvPoId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                >
                  {purchaseOrders.map(p => (
                    <option key={p.id} value={p.id}>{p.poNumber} - {p.title} (${p.totalAmount.toLocaleString()})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Vendor Invoice #</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. INV-9044-SUPPLY"
                  value={invNumber}
                  onChange={(e) => setInvNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Invoice Amount ($)</label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={invAmount}
                  onChange={(e) => setInvAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={invDueDate}
                  onChange={(e) => setInvDueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Billing Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 50% milestone billing for sound reinforcement and line arrays"
                  value={invDesc}
                  onChange={(e) => setInvDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubmittingInvoice(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
                >
                  Submit Invoice to Organiser
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
