import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EventItem, TicketTier, PaymentMethodType } from '../../types';
import { 
  X, 
  Users, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  Mail, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Plus, 
  Trash2,
  Lock,
  Sparkles
} from 'lucide-react';

interface BookingModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (orderId: string) => void;
  onOpenEmailInbox: () => void;
}

interface CoworkerInput {
  name: string;
  email: string;
  jobTitle: string;
  dietary: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  event,
  isOpen,
  onClose,
  onBookingSuccess,
  onOpenEmailInbox
}) => {
  const { currentUser, platformFeeRate, createBooking } = useApp();

  const [selectedTierId, setSelectedTierId] = useState<string>('');
  const [buyerName, setBuyerName] = useState<string>(currentUser.name || '');
  const [buyerEmail, setBuyerEmail] = useState<string>(currentUser.email || '');
  const [buyerCompany, setBuyerCompany] = useState<string>(currentUser.company || 'Enterprise Systems');
  
  // Coworkers list (seat 1 is lead buyer)
  const [coworkers, setCoworkers] = useState<CoworkerInput[]>([
    {
      name: currentUser.name || 'Marcus Chen',
      email: currentUser.email || 'marcus.chen@enterpriseflow.corp',
      jobTitle: currentUser.jobTitle || 'Lead Delegate',
      dietary: 'Standard'
    }
  ]);

  // Payment method & PO fields
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('split_card');
  const [poNumber, setPoNumber] = useState<string>('PO-2026-CORP-481');
  const [apEmail, setApEmail] = useState<string>('ap-invoicing@enterpriseflow.corp');
  const [vatId, setVatId] = useState<string>('US84-91029481');

  // Account creation choice (Immediate vs Later vs Guest)
  const [accountChoice, setAccountChoice] = useState<'immediately' | 'later' | 'guest'>('immediately');
  const [accountPassword, setAccountPassword] = useState<string>('corp-secure-2026');

  // Card fields
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvc, setCardCvc] = useState<string>('842');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // Initialize tier if none selected
  React.useEffect(() => {
    if (event && event.ticketTiers.length > 0 && !selectedTierId) {
      setSelectedTierId(event.ticketTiers[0].id);
    }
  }, [event, selectedTierId]);

  if (!isOpen || !event) return null;

  const currentTier = event.ticketTiers.find(t => t.id === selectedTierId) || event.ticketTiers[0];
  const seatCount = coworkers.length;
  const unitPrice = currentTier ? currentTier.price : 0;
  const grossTotal = seatCount * unitPrice;
  const platformFee = parseFloat((grossTotal * platformFeeRate).toFixed(2));
  const organizerCut = parseFloat((grossTotal - platformFee).toFixed(2));

  // Add coworker seat
  const handleAddSeat = () => {
    if (coworkers.length >= 8) return;
    setCoworkers(prev => [
      ...prev,
      {
        name: '',
        email: '',
        jobTitle: '',
        dietary: 'Standard'
      }
    ]);
  };

  // Remove coworker seat
  const handleRemoveSeat = (index: number) => {
    if (coworkers.length <= 1) return;
    setCoworkers(prev => prev.filter((_, i) => i !== index));
  };

  // Update coworker seat input
  const handleUpdateCoworker = (index: number, field: keyof CoworkerInput, value: string) => {
    setCoworkers(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c));
  };

  // Quick fill sample data for coworkers
  const handleAutoFillCoworkers = () => {
    setCoworkers([
      {
        name: buyerName || 'Marcus Chen',
        email: buyerEmail || 'marcus.chen@enterpriseflow.corp',
        jobTitle: 'Head of Strategic Procurement',
        dietary: 'Standard'
      },
      {
        name: 'Sarah Lin',
        email: 'sarah.lin@enterpriseflow.corp',
        jobTitle: 'Senior Operations Lead',
        dietary: 'Vegetarian'
      },
      {
        name: 'Carlos Mendez',
        email: 'c.mendez@enterpriseflow.corp',
        jobTitle: 'Vendor Management Specialist',
        dietary: 'Gluten-Free'
      }
    ]);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate coworkers
      const validCoworkers = coworkers.map((c, idx) => ({
        name: c.name.trim() || `Team Delegate ${idx + 1}`,
        email: c.email.trim() || `coworker${idx + 1}@${buyerEmail.split('@')[1] || 'enterprise.com'}`,
        jobTitle: c.jobTitle.trim() || 'Attendee',
        dietary: c.dietary
      }));

      const result = createBooking({
        eventId: event.id,
        tierId: selectedTierId,
        buyerName: buyerName.trim() || 'Marcus Chen',
        buyerEmail: buyerEmail.trim() || 'marcus.chen@enterpriseflow.corp',
        buyerCompany: buyerCompany.trim() || 'Enterprise Org',
        paymentMethod,
        poNumber: paymentMethod === 'purchase_order' ? poNumber : undefined,
        accountCreationChoice: accountChoice,
        coworkers: validCoworkers
      });

      setCompletedOrder(result.order);
      setIsSubmitting(false);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl my-6 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div>
            <div className="text-xs font-semibold text-indigo-400 font-mono">
              EVENT RESERVATION & PROCUREMENT CHECKOUT
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">{event.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Confirmation Screen */}
        {completedOrder ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Order Confirmed & Split Disbursed!</h3>
              <p className="text-xs text-slate-400 font-mono">
                Order #{completedOrder.orderNumber} · Gateway Reference: {completedOrder.gatewayTransactionId}
              </p>
            </div>

            {/* Split breakdown confirmation banner */}
            <div className="max-w-xl mx-auto p-4 rounded-lg bg-slate-950 border border-slate-800 text-left text-xs space-y-2">
              <div className="font-semibold text-slate-300 flex items-center justify-between pb-2 border-b border-slate-800">
                <span>Payment Settlement Summary</span>
                <span className="font-mono text-emerald-400 font-bold tabular-nums">
                  ${completedOrder.grossAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Disbursed to Organiser Connected Account ({event.organizerPayoutAccount}):</span>
                <span className="font-mono text-slate-200 tabular-nums font-semibold">
                  ${completedOrder.organizerSplitAmount.toFixed(2)} ({(100 - platformFeeRate * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Disbursed to Admin Platform Fee Vault:</span>
                <span className="font-mono text-indigo-400 tabular-nums font-semibold">
                  ${completedOrder.platformFeeAmount.toFixed(2)} ({(platformFeeRate * 100).toFixed(1)}%)
                </span>
              </div>
              {completedOrder.paymentMethod === 'purchase_order' && (
                <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-400">
                  PO Invoicing: Approved for Net-30 settlement under PO #{completedOrder.poNumber}.
                </div>
              )}
            </div>

            {/* Coworker invitations notice */}
            <div className="max-w-xl mx-auto p-4 rounded-lg bg-indigo-950/30 border border-indigo-900/50 text-left text-xs space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>{completedOrder.coworkerSeats.length} Coworker Invitations Dispatched</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Automated email invitations with personal RSVP token links have been delivered to your coworkers' inboxes. They can claim their ticket and view the event agenda immediately.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={() => {
                  onClose();
                  onOpenEmailInbox();
                }}
                className="px-4 py-2 text-xs font-semibold text-indigo-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Mail className="w-4 h-4" />
                <span>View Dispatched Email Outbox</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onBookingSuccess(completedOrder.id);
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>Open Ticket Passes & Wallet</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        ) : (
          /* Main Booking Form */
          <form onSubmit={handleSubmitOrder} className="p-6 space-y-6 text-xs">
            
            {/* Step 1: Select Tier */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-200">1. Select Ticket Tier</label>
                <span className="text-[11px] text-slate-400">All passes include full venue credentials</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {event.ticketTiers.map((tier) => (
                  <button
                    type="button"
                    key={tier.id}
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`text-left p-3 rounded-lg border transition-all ${
                      selectedTierId === tier.id
                        ? 'border-indigo-500 bg-indigo-950/40 text-white shadow-sm'
                        : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs">{tier.name}</span>
                      <span className="font-mono font-bold text-indigo-400 tabular-nums">${tier.price}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{tier.description}</p>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">{tier.availableSeats} seats left</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Primary Buyer & Account Option */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">2. Primary Buyer & Enterprise Billing Info</label>
                <span className="text-[11px] text-slate-400">Will receive master invoice & booking receipt</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. Marcus Chen"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="marcus.chen@company.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    required
                    value={buyerCompany}
                    onChange={(e) => setBuyerCompany(e.target.value)}
                    placeholder="EnterpriseFlow Corp"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Account Creation Choice (Immediate vs Later vs Guest) */}
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="font-semibold text-slate-300 text-xs">
                  Account Onboarding Preference:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className={`p-2.5 rounded-md border flex items-start gap-2.5 cursor-pointer transition-colors ${
                    accountChoice === 'immediately' ? 'border-indigo-500 bg-indigo-950/30' : 'border-slate-800 hover:bg-slate-900'
                  }`}>
                    <input
                      type="radio"
                      name="accountChoice"
                      checked={accountChoice === 'immediately'}
                      onChange={() => setAccountChoice('immediately')}
                      className="mt-0.5 text-indigo-600 focus:ring-0"
                    />
                    <div>
                      <div className="font-medium text-white">Create Account Immediately</div>
                      <div className="text-[11px] text-slate-400">Set password now to instantly manage all team passes in your portal.</div>
                    </div>
                  </label>

                  <label className={`p-2.5 rounded-md border flex items-start gap-2.5 cursor-pointer transition-colors ${
                    accountChoice === 'later' ? 'border-indigo-500 bg-indigo-950/30' : 'border-slate-800 hover:bg-slate-900'
                  }`}>
                    <input
                      type="radio"
                      name="accountChoice"
                      checked={accountChoice === 'later'}
                      onChange={() => setAccountChoice('later')}
                      className="mt-0.5 text-indigo-600 focus:ring-0"
                    />
                    <div>
                      <div className="font-medium text-white">Create Account Later (Via Email)</div>
                      <div className="text-[11px] text-slate-400">Checkout as guest. We will email you a secure activation claim link to set password anytime.</div>
                    </div>
                  </label>
                </div>

                {accountChoice === 'immediately' && (
                  <div className="pt-2 flex items-center gap-3">
                    <div className="text-[11px] text-slate-400">Password for new account:</div>
                    <div className="relative max-w-xs flex-1">
                      <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
                      <input
                        type="password"
                        value={accountPassword}
                        onChange={(e) => setAccountPassword(e.target.value)}
                        placeholder="Choose password"
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 pl-7 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Multi-Seat Coworker Booking & Invitations */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-200">
                      3. Coworker Seats ({coworkers.length} Seat{coworkers.length > 1 ? 's' : ''})
                    </label>
                    <span className="text-xs text-indigo-400 font-mono font-medium">
                      Total: ${grossTotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Assign each coworker their seat. An automated email invite with an RSVP token will be sent to them.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutoFillCoworkers}
                    className="px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 rounded border border-slate-700 transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Fill 3 Team Seats</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAddSeat}
                    disabled={coworkers.length >= 8}
                    className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors flex items-center gap-1 disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Seat</span>
                  </button>
                </div>
              </div>

              {/* Coworker Seats list */}
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {coworkers.map((coworker, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-indigo-400 shrink-0">
                      #{index + 1}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 flex-1">
                      <input
                        type="text"
                        required
                        placeholder="Coworker Full Name"
                        value={coworker.name}
                        onChange={(e) => handleUpdateCoworker(index, 'name', e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Work Email (for RSVP invite)"
                        value={coworker.email}
                        onChange={(e) => handleUpdateCoworker(index, 'email', e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="Job Title"
                        value={coworker.jobTitle}
                        onChange={(e) => handleUpdateCoworker(index, 'jobTitle', e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                      <select
                        value={coworker.dietary}
                        onChange={(e) => handleUpdateCoworker(index, 'dietary', e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Standard">Dietary: Standard</option>
                        <option value="Vegetarian">Dietary: Vegetarian</option>
                        <option value="Vegan">Dietary: Vegan</option>
                        <option value="Gluten-Free">Dietary: Gluten-Free</option>
                        <option value="Halal / Kosher">Dietary: Halal / Kosher</option>
                      </select>
                    </div>

                    {coworkers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSeat(index)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors self-end sm:self-center"
                        title="Remove seat"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 4: Payment Gateway & Live Split vs Corporate PO */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">
                  4. Payment & Procurement Settlement
                </label>
                <span className="text-[11px] text-slate-400">Instant gateway split or net-30 PO terms</span>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('split_card')}
                  className={`p-3 rounded-lg border text-left transition-all flex items-start gap-3 ${
                    paymentMethod === 'split_card'
                      ? 'border-indigo-500 bg-indigo-950/30 text-white'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-xs text-slate-200">Live Split Payment Gateway</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Credit / Debit card processed with immediate split transfer between Organiser and Platform.
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('purchase_order')}
                  className={`p-3 rounded-lg border text-left transition-all flex items-start gap-3 ${
                    paymentMethod === 'purchase_order'
                      ? 'border-indigo-500 bg-indigo-950/30 text-white'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <FileText className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-xs text-slate-200">Corporate Purchase Order (PO)</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Enter your company PO number for net-30 electronic invoicing & corporate credit settlement.
                    </div>
                  </div>
                </button>
              </div>

              {/* Live Payment Split Transparency Card */}
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                  <span className="font-semibold text-white">Live Split Transfer Breakdown</span>
                  <span className="font-mono text-slate-400 text-[11px]">Dynamic Gateway Engine</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                    <div className="text-[11px] text-slate-400">Total Ticket Gross</div>
                    <div className="text-base font-bold font-mono text-white tabular-nums mt-0.5">
                      ${grossTotal.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-500">{seatCount} x ${unitPrice}</div>
                  </div>

                  <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                    <div className="text-[11px] text-indigo-400">Platform Admin Fee ({(platformFeeRate * 100).toFixed(1)}%)</div>
                    <div className="text-base font-bold font-mono text-indigo-300 tabular-nums mt-0.5">
                      ${platformFee.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-500">Transferred to Master Admin</div>
                  </div>

                  <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                    <div className="text-[11px] text-emerald-400">Organiser Net Payout ({(100 - platformFeeRate * 100).toFixed(1)}%)</div>
                    <div className="text-base font-bold font-mono text-emerald-400 tabular-nums mt-0.5">
                      ${organizerCut.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">Account: {event.organizerPayoutAccount}</div>
                  </div>
                </div>
              </div>

              {/* Method specific inputs */}
              {paymentMethod === 'split_card' ? (
                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Encrypted Split Gateway Checkout
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCardNumber('4242 4242 4242 4242');
                        setCardExpiry('08/29');
                        setCardCvc('912');
                      }}
                      className="text-indigo-400 hover:text-indigo-300 underline font-mono"
                    >
                      Fill Demo Card
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-slate-400 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 font-mono text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Expiry & CVC</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-1/2 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 font-mono text-slate-200 text-xs text-center focus:outline-none focus:border-indigo-500"
                        />
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-1/2 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 font-mono text-slate-200 text-xs text-center focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="text-[11px] text-amber-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Purchase Order & Electronic Invoicing Details (Net-30)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">PO Reference Number</label>
                      <input
                        type="text"
                        required
                        value={poNumber}
                        onChange={(e) => setPoNumber(e.target.value)}
                        placeholder="PO-2026-9041"
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 font-mono text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Accounts Payable Email</label>
                      <input
                        type="email"
                        required
                        value={apEmail}
                        onChange={(e) => setApEmail(e.target.value)}
                        placeholder="ap@company.com"
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Tax / VAT ID</label>
                      <input
                        type="text"
                        value={vatId}
                        onChange={(e) => setVatId(e.target.value)}
                        placeholder="VAT / Tax ID"
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 font-mono text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div className="text-xs">
                <span className="text-slate-400">Total payable: </span>
                <span className="font-mono font-bold text-white text-sm tabular-nums">${grossTotal.toFixed(2)}</span>
                <span className="text-slate-500 text-[11px]"> ({seatCount} seat{seatCount > 1 ? 's' : ''})</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Processing Live Split...</span>
                  ) : (
                    <>
                      <span>
                        {paymentMethod === 'split_card' 
                          ? `Authorize & Split Disburse $${grossTotal.toFixed(2)}` 
                          : `Issue PO Reservation (${seatCount} Seats)`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
