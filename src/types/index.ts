export type UserRole = 'attendee' | 'organiser' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  jobTitle?: string;
  avatarUrl?: string;
  connectedStripeAccount?: string;
  stripeBalance?: number;
  hasAccount: boolean; // if false, guest with invite token to set up later
}

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  soldSeats: number;
  description: string;
  perks: string[];
}

export interface EventItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  date: string;
  time: string;
  location: string;
  venueName: string;
  category: 'Enterprise & Tech' | 'Design & Innovation' | 'Procurement & Supply Chain' | 'Executive Leadership';
  bannerUrl: string;
  organizerId: string;
  organizerName: string;
  organizerEmail: string;
  organizerPayoutAccount: string;
  procurementBudget: number;
  procurementSpent: number;
  ticketTiers: TicketTier[];
  status: 'published' | 'draft' | 'completed';
}

export type PaymentMethodType = 'split_card' | 'purchase_order';

export interface CoworkerSeat {
  seatNumber: number;
  attendeeName: string;
  attendeeEmail: string;
  attendeeJobTitle: string;
  dietaryRequirements?: string;
  inviteStatus: 'claimed' | 'invite_sent' | 'pending_rsvp';
  inviteToken: string;
  qrCodeId: string;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  eventId: string;
  eventTitle: string;
  buyerId?: string;
  buyerName: string;
  buyerEmail: string;
  buyerCompany: string;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'paid' | 'pending_approval' | 'net30_invoiced' | 'refunded';
  poNumber?: string;
  tierId: string;
  tierName: string;
  seatCount: number;
  unitPrice: number;
  grossAmount: number;
  platformFeeAmount: number;
  organizerSplitAmount: number;
  platformFeeRate: number; // e.g. 0.085 for 8.5%
  createdAt: string;
  gatewayTransactionId: string;
  accountCreatedImmediately: boolean;
  coworkerSeats: CoworkerSeat[];
}

export interface POLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  eventId: string;
  eventTitle: string;
  vendorId: string;
  vendorName: string;
  vendorCategory: string;
  title: string;
  lineItems: POLineItem[];
  totalAmount: number;
  status: 'issued' | 'approved' | 'invoiced' | 'paid' | 'cancelled';
  issuedDate: string;
  approvedDate?: string;
  notes: string;
  organizerId: string;
}

export interface VendorInvoice {
  id: string;
  invoiceNumber: string;
  poId: string;
  poNumber: string;
  eventId: string;
  eventTitle: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: 'pending_review' | 'approved' | 'paid' | 'disputed';
  paymentTxId?: string;
  paidAt?: string;
  lineItems: POLineItem[];
  pdfReference: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: 'Audio/Visual & Staging' | 'Catering & Hospitality' | 'Venue Security & Access' | 'Keynote Production' | 'Badge & Printing';
  contactName: string;
  email: string;
  phone: string;
  taxId: string;
  payoutRouting: string;
  verified: boolean;
  activePOsCount: number;
  totalBilled: number;
}

export interface SplitLedgerEntry {
  id: string;
  timestamp: string;
  orderNumber: string;
  eventId: string;
  eventTitle: string;
  grossAmount: number;
  platformCut: number;
  platformRatePercent: number;
  organizerCut: number;
  organizerAccountId: string;
  gatewayTxId: string;
  payoutStatus: 'settled_instant' | 'escrow_scheduled' | 'processing';
  buyerName: string;
}

export interface EmailNotification {
  id: string;
  toEmail: string;
  toName: string;
  subject: string;
  body: string;
  timestamp: string;
  type: 'coworker_invite' | 'account_claim' | 'po_issued' | 'invoice_approved' | 'ticket_confirmation';
  actionUrl?: string;
  inviteToken?: string;
  eventId?: string;
  orderId?: string;
  seatNumber?: number;
  read: boolean;
}
