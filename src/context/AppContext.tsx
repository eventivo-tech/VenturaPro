import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  EventItem, 
  Vendor, 
  PurchaseOrder, 
  VendorInvoice, 
  OrderItem, 
  SplitLedgerEntry, 
  EmailNotification, 
  UserRole,
  PaymentMethodType,
  CoworkerSeat
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_EVENTS,
  INITIAL_VENDORS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_VENDOR_INVOICES,
  INITIAL_ORDERS,
  INITIAL_SPLIT_LEDGER,
  INITIAL_EMAIL_OUTBOX
} from '../data/mockData';

interface AppContextType {
  currentUser: UserProfile;
  users: UserProfile[];
  events: EventItem[];
  vendors: Vendor[];
  purchaseOrders: PurchaseOrder[];
  invoices: VendorInvoice[];
  orders: OrderItem[];
  splitLedger: SplitLedgerEntry[];
  emails: EmailNotification[];
  platformFeeRate: number;
  activeRole: UserRole;
  
  // Actions
  switchRole: (role: UserRole) => void;
  loginAsUser: (user: UserProfile) => void;
  registerOrLoginUser: (name: string, email: string, role: UserRole, company?: string) => UserProfile;
  setPlatformFeeRate: (rate: number) => void;
  
  createEvent: (eventData: Omit<EventItem, 'id' | 'organizerId' | 'organizerName' | 'organizerEmail' | 'organizerPayoutAccount' | 'procurementSpent' | 'status'>) => EventItem;
  
  createBooking: (params: {
    eventId: string;
    tierId: string;
    buyerName: string;
    buyerEmail: string;
    buyerCompany: string;
    paymentMethod: PaymentMethodType;
    poNumber?: string;
    accountCreationChoice: 'immediately' | 'later' | 'guest';
    coworkers: {
      name: string;
      email: string;
      jobTitle: string;
      dietary?: string;
    }[];
  }) => { order: OrderItem; ledgerEntry: SplitLedgerEntry };

  createPurchaseOrder: (params: {
    eventId: string;
    vendorId: string;
    title: string;
    notes: string;
    lineItems: { description: string; quantity: number; unitPrice: number }[];
  }) => PurchaseOrder;

  approvePurchaseOrder: (poId: string) => void;

  submitVendorInvoice: (params: {
    poId: string;
    invoiceNumber: string;
    amount: number;
    dueDate: string;
    description: string;
  }) => VendorInvoice;

  approveAndPayVendorInvoice: (invoiceId: string) => void;

  claimCoworkerSeat: (token: string, confirmedDietary?: string) => boolean;

  markEmailAsRead: (emailId: string) => void;
  
  simulateLiveGatewayDisbursement: (orderId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'venturepro_enterprise_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from local storage or defaults
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return currentUser.role || 'organiser';
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_events`);
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_vendors`);
    return saved ? JSON.parse(saved) : INITIAL_VENDORS;
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_pos`);
    return saved ? JSON.parse(saved) : INITIAL_PURCHASE_ORDERS;
  });

  const [invoices, setInvoices] = useState<VendorInvoice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_invoices`);
    return saved ? JSON.parse(saved) : INITIAL_VENDOR_INVOICES;
  });

  const [orders, setOrders] = useState<OrderItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_orders`);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [splitLedger, setSplitLedger] = useState<SplitLedgerEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_ledger`);
    return saved ? JSON.parse(saved) : INITIAL_SPLIT_LEDGER;
  });

  const [emails, setEmails] = useState<EmailNotification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_emails`);
    return saved ? JSON.parse(saved) : INITIAL_EMAIL_OUTBOX;
  });

  const [platformFeeRate, setPlatformFeeRate] = useState<number>(0.085); // 8.5% default platform fee

  // Sync back to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(currentUser));
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
    localStorage.setItem(`${STORAGE_KEY}_events`, JSON.stringify(events));
    localStorage.setItem(`${STORAGE_KEY}_vendors`, JSON.stringify(vendors));
    localStorage.setItem(`${STORAGE_KEY}_pos`, JSON.stringify(purchaseOrders));
    localStorage.setItem(`${STORAGE_KEY}_invoices`, JSON.stringify(invoices));
    localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(orders));
    localStorage.setItem(`${STORAGE_KEY}_ledger`, JSON.stringify(splitLedger));
    localStorage.setItem(`${STORAGE_KEY}_emails`, JSON.stringify(emails));
  }, [currentUser, users, events, vendors, purchaseOrders, invoices, orders, splitLedger, emails]);

  // Role switching
  const switchRole = (role: UserRole) => {
    setActiveRole(role);
    const existing = users.find(u => u.role === role);
    if (existing) {
      setCurrentUser(existing);
    } else {
      const newUser: UserProfile = {
        id: `user_${role}_${Date.now()}`,
        name: role === 'admin' ? 'Platform Administrator' : role === 'organiser' ? 'Executive Organiser' : 'Corporate Attendee',
        email: `${role}@venturepro.events`,
        role,
        hasAccount: true
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
    }
  };

  const loginAsUser = (user: UserProfile) => {
    setCurrentUser(user);
    setActiveRole(user.role);
  };

  const registerOrLoginUser = (name: string, email: string, role: UserRole, company?: string): UserProfile => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      setActiveRole(existing.role);
      return existing;
    }
    const newUser: UserProfile = {
      id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name,
      email,
      role,
      company: company || 'Enterprise Org',
      hasAccount: true,
      stripeBalance: role === 'organiser' ? 0 : undefined,
      connectedStripeAccount: role === 'organiser' ? `acct_${Math.random().toString(36).substring(2, 10)}` : undefined
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setActiveRole(role);
    return newUser;
  };

  // Create new event
  const createEvent = (eventData: Omit<EventItem, 'id' | 'organizerId' | 'organizerName' | 'organizerEmail' | 'organizerPayoutAccount' | 'procurementSpent' | 'status'>): EventItem => {
    const newEvent: EventItem = {
      ...eventData,
      id: `evt_${Date.now()}`,
      organizerId: currentUser.id,
      organizerName: currentUser.name,
      organizerEmail: currentUser.email,
      organizerPayoutAccount: currentUser.connectedStripeAccount || 'acct_primary_default',
      procurementSpent: 0,
      status: 'published'
    };
    setEvents(prev => [newEvent, ...prev]);
    return newEvent;
  };

  // Booking tickets (Single or Multi-Seat for Coworkers)
  const createBooking = ({
    eventId,
    tierId,
    buyerName,
    buyerEmail,
    buyerCompany,
    paymentMethod,
    poNumber,
    accountCreationChoice,
    coworkers
  }: {
    eventId: string;
    tierId: string;
    buyerName: string;
    buyerEmail: string;
    buyerCompany: string;
    paymentMethod: PaymentMethodType;
    poNumber?: string;
    accountCreationChoice: 'immediately' | 'later' | 'guest';
    coworkers: { name: string; email: string; jobTitle: string; dietary?: string }[];
  }) => {
    const targetEvent = events.find(e => e.id === eventId);
    if (!targetEvent) throw new Error('Event not found');

    const tier = targetEvent.ticketTiers.find(t => t.id === tierId);
    if (!tier) throw new Error('Tier not found');

    const seatCount = coworkers.length;
    const unitPrice = tier.price;
    const grossAmount = seatCount * unitPrice;
    
    // Live Payment Split Calculation
    const platformFeeAmount = parseFloat((grossAmount * platformFeeRate).toFixed(2));
    const organizerSplitAmount = parseFloat((grossAmount - platformFeeAmount).toFixed(2));
    const orderNumber = `VP-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const gatewayTxId = paymentMethod === 'split_card' 
      ? `ch_split_${Math.random().toString(36).substring(2, 12)}` 
      : `po_split_net30_${Math.random().toString(36).substring(2, 12)}`;

    // Build seats with invitation tokens and QR codes
    const coworkerSeats: CoworkerSeat[] = coworkers.map((c, index) => {
      const isLeadBuyer = index === 0 && (c.email.toLowerCase() === buyerEmail.toLowerCase());
      const inviteToken = `tok_${Math.random().toString(36).substring(2, 12)}`;
      return {
        seatNumber: index + 1,
        attendeeName: c.name,
        attendeeEmail: c.email,
        attendeeJobTitle: c.jobTitle || 'Team Delegate',
        dietaryRequirements: c.dietary || 'None specified',
        inviteStatus: isLeadBuyer ? 'claimed' : 'invite_sent',
        inviteToken,
        qrCodeId: `${orderNumber}-S${index + 1}`
      };
    });

    const newOrder: OrderItem = {
      id: `ord_${Date.now()}`,
      orderNumber,
      eventId,
      eventTitle: targetEvent.title,
      buyerId: currentUser.id,
      buyerName,
      buyerEmail,
      buyerCompany,
      paymentMethod,
      paymentStatus: paymentMethod === 'split_card' ? 'paid' : 'net30_invoiced',
      poNumber: poNumber || (paymentMethod === 'purchase_order' ? `PO-ENT-${Date.now().toString().slice(-4)}` : undefined),
      tierId,
      tierName: tier.name,
      seatCount,
      unitPrice,
      grossAmount,
      platformFeeRate,
      platformFeeAmount,
      organizerSplitAmount,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      gatewayTransactionId: gatewayTxId,
      accountCreatedImmediately: accountCreationChoice === 'immediately',
      coworkerSeats
    };

    // Split Ledger Entry
    const newLedgerEntry: SplitLedgerEntry = {
      id: `split_tx_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      orderNumber,
      eventId,
      eventTitle: targetEvent.title,
      grossAmount,
      platformCut: platformFeeAmount,
      platformRatePercent: platformFeeRate * 100,
      organizerCut: organizerSplitAmount,
      organizerAccountId: targetEvent.organizerPayoutAccount,
      gatewayTxId,
      payoutStatus: paymentMethod === 'split_card' ? 'settled_instant' : 'escrow_scheduled',
      buyerName: `${buyerName} (${buyerCompany || 'Corporate'})`
    };

    // Update Event Tiers (sold count)
    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;
      return {
        ...ev,
        ticketTiers: ev.ticketTiers.map(t => {
          if (t.id !== tierId) return t;
          return {
            ...t,
            soldSeats: t.soldSeats + seatCount,
            availableSeats: Math.max(0, t.availableSeats - seatCount)
          };
        })
      };
    }));

    // Generate Coworker Emails
    const generatedEmails: EmailNotification[] = [];

    coworkerSeats.forEach((seat) => {
      const isLead = seat.seatNumber === 1 && (seat.attendeeEmail.toLowerCase() === buyerEmail.toLowerCase());
      if (isLead) {
        // Confirmation email to lead buyer
        generatedEmails.push({
          id: `eml_${Date.now()}_lead`,
          toEmail: buyerEmail,
          toName: buyerName,
          subject: `Order Confirmation: ${targetEvent.title} (${seatCount} Seat${seatCount > 1 ? 's' : ''})`,
          body: `Dear ${buyerName},\n\nYour order #${orderNumber} for "${targetEvent.title}" has been successfully confirmed.\n\nTotal Paid: $${grossAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}\nPayment Method: ${paymentMethod === 'split_card' ? 'Credit Card (Stripe Split Live)' : `Corporate Purchase Order (${newOrder.poNumber})`}\n\nSeats Reserved: ${seatCount}\n${coworkerSeats.map(s => ` - Seat #${s.seatNumber}: ${s.attendeeName} (${s.attendeeEmail})`).join('\n')}\n\nInvitations have been automatically sent to your coworkers. You can view your pass or manage invitations in your Ticket Wallet.`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          type: 'ticket_confirmation',
          actionUrl: '#ticket-wallet',
          eventId,
          orderId: newOrder.id,
          seatNumber: 1,
          read: false
        });
      } else {
        // Invite email to coworker
        generatedEmails.push({
          id: `eml_${Date.now()}_cw_${seat.seatNumber}`,
          toEmail: seat.attendeeEmail,
          toName: seat.attendeeName,
          subject: `Seat Reserved: ${buyerName} invited you to ${targetEvent.title}`,
          body: `Hi ${seat.attendeeName},\n\n${buyerName} (${buyerCompany}) has booked an ${tier.name} for you at "${targetEvent.title}".\n\nEvent Dates: ${targetEvent.date}\nVenue: ${targetEvent.venueName}, ${targetEvent.location}\nYour Seat: #${seat.seatNumber}\n\nPlease click the RSVP button below to claim your ticket, confirm any dietary/accessibility requirements, and download your personal check-in pass.`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          type: 'coworker_invite',
          actionUrl: '#claim-ticket',
          inviteToken: seat.inviteToken,
          eventId,
          orderId: newOrder.id,
          seatNumber: seat.seatNumber,
          read: false
        });
      }
    });

    // If chose "later" account creation, send claim activation email
    if (accountCreationChoice === 'later') {
      generatedEmails.push({
        id: `eml_${Date.now()}_claim_act`,
        toEmail: buyerEmail,
        toName: buyerName,
        subject: `Activate your VenturePro Account for Order #${orderNumber}`,
        body: `Hello ${buyerName},\n\nYou checked out as guest for "${targetEvent.title}". When you're ready, click below to set a password and activate your full account to track orders, download invoices, and manage team seats.`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        type: 'account_claim',
        actionUrl: '#claim-account',
        read: false
      });
    }

    // Update state
    setOrders(prev => [newOrder, ...prev]);
    setSplitLedger(prev => [newLedgerEntry, ...prev]);
    setEmails(prev => [...generatedEmails, ...prev]);

    // Update balances
    setUsers(prev => prev.map(u => {
      if (u.id === targetEvent.organizerId) {
        return {
          ...u,
          stripeBalance: (u.stripeBalance || 0) + organizerSplitAmount
        };
      }
      return u;
    }));

    return { order: newOrder, ledgerEntry: newLedgerEntry };
  };

  // Create Purchase Order for Event Vendor
  const createPurchaseOrder = ({
    eventId,
    vendorId,
    title,
    notes,
    lineItems
  }: {
    eventId: string;
    vendorId: string;
    title: string;
    notes: string;
    lineItems: { description: string; quantity: number; unitPrice: number }[];
  }): PurchaseOrder => {
    const targetEvent = events.find(e => e.id === eventId);
    const targetVendor = vendors.find(v => v.id === vendorId);
    if (!targetEvent || !targetVendor) throw new Error('Event or Vendor not found');

    const totalAmount = lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const poNumber = `PO-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newPO: PurchaseOrder = {
      id: `po_${Date.now()}`,
      poNumber,
      eventId,
      eventTitle: targetEvent.title,
      vendorId,
      vendorName: targetVendor.name,
      vendorCategory: targetVendor.category,
      title,
      lineItems: lineItems.map((li, idx) => ({
        id: `li_${Date.now()}_${idx}`,
        description: li.description,
        quantity: li.quantity,
        unitPrice: li.unitPrice,
        total: li.quantity * li.unitPrice
      })),
      totalAmount,
      status: 'approved',
      issuedDate: new Date().toISOString().substring(0, 10),
      approvedDate: new Date().toISOString().substring(0, 10),
      notes,
      organizerId: currentUser.id
    };

    // Update Event Procurement Spent
    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;
      return {
        ...ev,
        procurementSpent: ev.procurementSpent + totalAmount
      };
    }));

    // Update vendor active PO count
    setVendors(prev => prev.map(v => {
      if (v.id !== vendorId) return v;
      return {
        ...v,
        activePOsCount: v.activePOsCount + 1,
        totalBilled: v.totalBilled + totalAmount
      };
    }));

    // Add email to vendor contact
    const poEmail: EmailNotification = {
      id: `eml_${Date.now()}_po`,
      toEmail: targetVendor.email,
      toName: targetVendor.contactName,
      subject: `Approved Purchase Order Issued: ${poNumber} - ${title}`,
      body: `Dear ${targetVendor.contactName},\n\nApex Events has issued Purchase Order ${poNumber} for "${targetEvent.title}".\n\nTotal Authorized: $${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}\nScope: ${title}\nNotes: ${notes}\n\nPlease proceed with milestone delivery and submit corresponding invoice matching this PO number.`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      type: 'po_issued',
      read: false
    };

    setPurchaseOrders(prev => [newPO, ...prev]);
    setEmails(prev => [poEmail, ...prev]);

    return newPO;
  };

  const approvePurchaseOrder = (poId: string) => {
    setPurchaseOrders(prev => prev.map(po => {
      if (po.id !== poId) return po;
      return {
        ...po,
        status: 'approved',
        approvedDate: new Date().toISOString().substring(0, 10)
      };
    }));
  };

  const submitVendorInvoice = ({
    poId,
    invoiceNumber,
    amount,
    dueDate,
    description
  }: {
    poId: string;
    invoiceNumber: string;
    amount: number;
    dueDate: string;
    description: string;
  }): VendorInvoice => {
    const po = purchaseOrders.find(p => p.id === poId);
    if (!po) throw new Error('Purchase order not found');

    const newInvoice: VendorInvoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber,
      poId,
      poNumber: po.poNumber,
      eventId: po.eventId,
      eventTitle: po.eventTitle,
      vendorId: po.vendorId,
      vendorName: po.vendorName,
      amount,
      issueDate: new Date().toISOString().substring(0, 10),
      dueDate,
      status: 'pending_review',
      pdfReference: `${invoiceNumber.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      lineItems: [
        { id: `li_inv_${Date.now()}`, description, quantity: 1, unitPrice: amount, total: amount }
      ]
    };

    setInvoices(prev => [newInvoice, ...prev]);
    return newInvoice;
  };

  // Approve & Pay Vendor Invoice
  const approveAndPayVendorInvoice = (invoiceId: string) => {
    const targetInvoice = invoices.find(inv => inv.id === invoiceId);
    if (!targetInvoice) return;

    const txId = `tx_disburse_${Math.random().toString(36).substring(2, 11)}`;
    const paidTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    setInvoices(prev => prev.map(inv => {
      if (inv.id !== invoiceId) return inv;
      return {
        ...inv,
        status: 'paid',
        paymentTxId: txId,
        paidAt: paidTimestamp
      };
    }));

    // Update PO status to paid if fully settled
    setPurchaseOrders(prev => prev.map(po => {
      if (po.id !== targetInvoice.poId) return po;
      return {
        ...po,
        status: 'paid'
      };
    }));

    // Email vendor
    const payEmail: EmailNotification = {
      id: `eml_${Date.now()}_pay`,
      toEmail: 'billing@vendor.partner',
      toName: targetInvoice.vendorName,
      subject: `Payment Remittance: Invoice ${targetInvoice.invoiceNumber} Paid`,
      body: `Invoice ${targetInvoice.invoiceNumber} for $${targetInvoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} has been approved and disbursed.\nReference Gateway Transaction: ${txId}. Funds transferred to registered routing coordinates.`,
      timestamp: paidTimestamp,
      type: 'invoice_approved',
      read: false
    };

    setEmails(prev => [payEmail, ...prev]);
  };

  // Claim Coworker Seat via Email RSVP token
  const claimCoworkerSeat = (token: string, confirmedDietary?: string): boolean => {
    let found = false;
    setOrders(prev => prev.map(order => {
      const seat = order.coworkerSeats.find(s => s.inviteToken === token);
      if (!seat) return order;

      found = true;
      const updatedSeats = order.coworkerSeats.map(s => {
        if (s.inviteToken !== token) return s;
        return {
          ...s,
          inviteStatus: 'claimed' as const,
          dietaryRequirements: confirmedDietary || s.dietaryRequirements
        };
      });

      return {
        ...order,
        coworkerSeats: updatedSeats
      };
    }));
    return found;
  };

  const markEmailAsRead = (emailId: string) => {
    setEmails(prev => prev.map(eml => eml.id === emailId ? { ...eml, read: true } : eml));
  };

  // Simulate live gateway instant disbursement trigger
  const simulateLiveGatewayDisbursement = (orderId: string) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id !== orderId) return ord;
      return {
        ...ord,
        paymentStatus: 'paid'
      };
    }));

    setSplitLedger(prev => prev.map(entry => {
      const order = orders.find(o => o.id === orderId);
      if (order && entry.orderNumber === order.orderNumber) {
        return {
          ...entry,
          payoutStatus: 'settled_instant'
        };
      }
      return entry;
    }));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        events,
        vendors,
        purchaseOrders,
        invoices,
        orders,
        splitLedger,
        emails,
        platformFeeRate,
        activeRole,
        switchRole,
        loginAsUser,
        registerOrLoginUser,
        setPlatformFeeRate,
        createEvent,
        createBooking,
        createPurchaseOrder,
        approvePurchaseOrder,
        submitVendorInvoice,
        approveAndPayVendorInvoice,
        claimCoworkerSeat,
        markEmailAsRead,
        simulateLiveGatewayDisbursement
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
