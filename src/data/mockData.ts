import { EventItem, Vendor, PurchaseOrder, VendorInvoice, OrderItem, SplitLedgerEntry, UserProfile, EmailNotification } from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user_organiser_1',
    name: 'Elena Vance',
    email: 'elena.vance@apexevents.io',
    role: 'organiser',
    company: 'Apex Event Operations Ltd',
    jobTitle: 'VP Global Event Operations',
    avatarUrl: '/src/assets/images/avatar_organizer_profile_1792061252181.jpg',
    connectedStripeAccount: 'acct_1Nsk992X938aL891',
    stripeBalance: 84650.00,
    hasAccount: true
  },
  {
    id: 'user_attendee_1',
    name: 'Marcus Chen',
    email: 'marcus.chen@enterpriseflow.corp',
    role: 'attendee',
    company: 'EnterpriseFlow Systems',
    jobTitle: 'Head of Strategic Procurement',
    avatarUrl: '',
    hasAccount: true
  },
  {
    id: 'user_admin_1',
    name: 'Sarah Sterling',
    email: 'admin@venturepro.events',
    role: 'admin',
    company: 'VenturePro Platform Ops',
    jobTitle: 'Global Settlement Administrator',
    avatarUrl: '',
    connectedStripeAccount: 'platform_master_vault_01',
    stripeBalance: 24720.00,
    hasAccount: true
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt_procurement_summit_2026',
    title: 'Global Procurement & Enterprise Operations Summit 2026',
    tagline: 'Leading the future of autonomous supply chains, B2B purchasing, and enterprise vendor orchestration.',
    description: 'The premier annual summit bringing together 1,200+ global Chief Procurement Officers, enterprise operations leads, and vendor partners. 3 full days of keynotes, closed-door procurement workshops, interactive RFP labs, and executive networking receptions in London.',
    date: 'Nov 12 - 14, 2026',
    time: '08:30 AM - 06:00 PM GMT',
    location: 'London, UK',
    venueName: 'The Shard International Convention Centre, Hall A',
    category: 'Procurement & Supply Chain',
    bannerUrl: '/src/assets/images/event_procurement_forum_1792061252006.jpg',
    organizerId: 'user_organiser_1',
    organizerName: 'Elena Vance (Apex Events)',
    organizerEmail: 'elena.vance@apexevents.io',
    organizerPayoutAccount: 'acct_1Nsk992X938aL891',
    procurementBudget: 95000.00,
    procurementSpent: 53200.00,
    status: 'published',
    ticketTiers: [
      {
        id: 'tier_proc_exec',
        name: 'Executive All-Access Pass',
        price: 850.00,
        totalSeats: 300,
        availableSeats: 64,
        soldSeats: 236,
        description: 'Full 3-day access including C-suite roundtable dinners, VIP networking lounge, and procurement strategy masterclasses.',
        perks: ['VIP Lounge & Private Dining', 'Masterclass Certification', 'RFP Workshop Access', 'Priority Fast-track Checkin']
      },
      {
        id: 'tier_proc_standard',
        name: 'Standard Delegate Pass',
        price: 495.00,
        totalSeats: 600,
        availableSeats: 142,
        soldSeats: 458,
        description: 'Access to all mainstage keynote sessions, technology breakout rooms, exhibition floor, and evening cocktail receptions.',
        perks: ['Mainstage Keynotes Access', 'Vendor Exhibition Pavilion', 'Buffet Lunch & Coffee Breaks', 'Digital Session Recordings']
      },
      {
        id: 'tier_proc_virtual',
        name: 'Corporate Virtual Pass',
        price: 180.00,
        totalSeats: 500,
        availableSeats: 210,
        soldSeats: 290,
        description: 'Interactive live-streamed keynotes, digital QA, virtual 1:1 vendor networking, and downloadable slide decks.',
        perks: ['HD Live Stream Access', 'On-Demand Keynote Replays', 'Virtual Speed Networking', 'Attendee Directory Chat']
      }
    ]
  },
  {
    id: 'evt_tech_pulse_2026',
    title: 'TechPulse Worldwide Infrastructure & AI Expo',
    tagline: 'High-throughput computing, cloud architecture, and mission-critical enterprise systems.',
    description: 'Immerse your engineering and product leadership teams in deep architectural teardowns, distributed systems engineering, and scalable enterprise computing. Featuring hands-on workshops, live hardware displays, and infrastructure hackathons.',
    date: 'Dec 03 - 05, 2026',
    time: '09:00 AM - 05:30 PM PST',
    location: 'San Francisco, CA',
    venueName: 'Moscone West Convention Center, Levels 2 & 3',
    category: 'Enterprise & Tech',
    bannerUrl: '/src/assets/images/event_tech_summit_1792061251395.jpg',
    organizerId: 'user_organiser_1',
    organizerName: 'Elena Vance (Apex Events)',
    organizerEmail: 'elena.vance@apexevents.io',
    organizerPayoutAccount: 'acct_1Nsk992X938aL891',
    procurementBudget: 120000.00,
    procurementSpent: 68400.00,
    status: 'published',
    ticketTiers: [
      {
        id: 'tier_tech_vip',
        name: 'Architect VIP Pass',
        price: 980.00,
        totalSeats: 400,
        availableSeats: 88,
        soldSeats: 312,
        description: 'Direct access to keynote speakers, engineering deep-dive salon sessions, hardware prototype test track, and private lounge.',
        perks: ['Hardware Lab Pass', 'Speaker Dinner Admission', 'Private Meeting Pods', 'Exclusive Swag & Hardware Kit']
      },
      {
        id: 'tier_tech_team',
        name: 'Full Conference Pass',
        price: 520.00,
        totalSeats: 800,
        availableSeats: 215,
        soldSeats: 585,
        description: 'Standard access for developers, platform engineers, and engineering managers across all technical tracks.',
        perks: ['All Technical Tracks', 'Interactive Workshops', 'Lunch & Barista Stations', 'Expo Floor Access']
      }
    ]
  },
  {
    id: 'evt_design_gala_2026',
    title: 'Nordic Architectural & Industrial Design Gala',
    tagline: 'Exploring sustainable materiality, urban biomimicry, and physical-digital brand experiences.',
    description: 'An intimate gathering of 500 elite industrial designers, spatial architects, and creative directors exploring the intersection of sustainable urban development, bespoke materials, and spatial computation.',
    date: 'Jan 22 - 24, 2027',
    time: '10:00 AM - 07:00 PM CET',
    location: 'Stockholm, Sweden',
    venueName: 'Kulturhuset Stadsteatern, Exhibition Atrium',
    category: 'Design & Innovation',
    bannerUrl: '/src/assets/images/event_design_gala_1792061251151.jpg',
    organizerId: 'user_organiser_1',
    organizerName: 'Elena Vance (Apex Events)',
    organizerEmail: 'elena.vance@apexevents.io',
    organizerPayoutAccount: 'acct_1Nsk992X938aL891',
    procurementBudget: 65000.00,
    procurementSpent: 28500.00,
    status: 'published',
    ticketTiers: [
      {
        id: 'tier_design_full',
        name: 'Design Leader Pass',
        price: 640.00,
        totalSeats: 250,
        availableSeats: 52,
        soldSeats: 198,
        description: 'Full pass covering exhibition tours, material archive access, and 3-course gala dinner with design laureates.',
        perks: ['Gala Dinner Admission', 'Material Archive Access', 'Curated Studio Visits', 'Limited Edition Monograph']
      },
      {
        id: 'tier_design_expo',
        name: 'Exhibition & Talk Pass',
        price: 310.00,
        totalSeats: 300,
        availableSeats: 94,
        soldSeats: 206,
        description: 'Standard access to daily keynote presentations and gallery exhibition installations.',
        perks: ['Exhibition Hall Admission', 'Afternoon Keynotes', 'Coffee & Networking', 'Digital Showcase Access']
      }
    ]
  }
];

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'vend_av_prime',
    name: 'Acoustica Stage & 4K LED Rigging Ltd',
    category: 'Audio/Visual & Staging',
    contactName: 'Dominic Ward',
    email: 'contracts@acousticastage.co.uk',
    phone: '+44 20 7946 0912',
    taxId: 'GB982341902',
    payoutRouting: 'GB44BARC20000049281729',
    verified: true,
    activePOsCount: 2,
    totalBilled: 38500.00
  },
  {
    id: 'vend_catering_luxe',
    name: 'Sovereign Gourmet Catering & Barista Group',
    category: 'Catering & Hospitality',
    contactName: 'Camilla Rossi',
    email: 'events@sovereigngourmet.com',
    phone: '+44 20 7946 0833',
    taxId: 'GB882193847',
    payoutRouting: 'GB82HSBC40000091823746',
    verified: true,
    activePOsCount: 1,
    totalBilled: 26400.00
  },
  {
    id: 'vend_venue_security',
    name: 'Vanguard K9 & Executive Protective Security',
    category: 'Venue Security & Access',
    contactName: 'Marcus Sterling',
    email: 'ops@vanguardsec.co.uk',
    phone: '+44 20 7946 0541',
    taxId: 'GB774910294',
    payoutRouting: 'GB11LLOY30000010928374',
    verified: true,
    activePOsCount: 1,
    totalBilled: 14200.00
  },
  {
    id: 'vend_badges_rfid',
    name: 'SmartPass RFID Credentials & Onsite Kiosks',
    category: 'Badge & Printing',
    contactName: 'Chloe Dupont',
    email: 'orders@smartpassrfid.eu',
    phone: '+33 1 42 68 55 00',
    taxId: 'FR3948102948',
    payoutRouting: 'FR76BNPA30004012948201',
    verified: true,
    activePOsCount: 1,
    totalBilled: 8900.00
  }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po_2026_081',
    poNumber: 'PO-2026-081',
    eventId: 'evt_procurement_summit_2026',
    eventTitle: 'Global Procurement & Enterprise Operations Summit 2026',
    vendorId: 'vend_av_prime',
    vendorName: 'Acoustica Stage & 4K LED Rigging Ltd',
    vendorCategory: 'Audio/Visual & Staging',
    title: 'Main Auditorium Curved LED Wall & Surround Audio Rig',
    totalAmount: 28500.00,
    status: 'approved',
    issuedDate: '2026-10-01',
    approvedDate: '2026-10-03',
    organizerId: 'user_organiser_1',
    notes: 'Approved under Procurement Ops Budget code #GB-SUMMIT-AV01.',
    lineItems: [
      { id: 'li_1', description: 'Curved 4K Unilumin LED Video Wall (18m x 5m)', quantity: 1, unitPrice: 18000.00, total: 18000.00 },
      { id: 'li_2', description: 'Line Array Audio Towers & Digital Shure Wireless Mic Pods', quantity: 1, unitPrice: 6500.00, total: 6500.00 },
      { id: 'li_3', description: 'Certified Stage Audio Engineers & Riggers (3 days onsite)', quantity: 4, unitPrice: 1000.00, total: 4000.00 }
    ]
  },
  {
    id: 'po_2026_082',
    poNumber: 'PO-2026-082',
    eventId: 'evt_procurement_summit_2026',
    eventTitle: 'Global Procurement & Enterprise Operations Summit 2026',
    vendorId: 'vend_catering_luxe',
    vendorName: 'Sovereign Gourmet Catering & Barista Group',
    vendorCategory: 'Catering & Hospitality',
    title: 'Executive Delegate Luncheons & Specialty Barista Service',
    totalAmount: 18400.00,
    status: 'invoiced',
    issuedDate: '2026-10-04',
    approvedDate: '2026-10-05',
    organizerId: 'user_organiser_1',
    notes: 'Full organic sourcing, dairy-free and gluten-free dietary quotas included.',
    lineItems: [
      { id: 'li_4', description: '3-Course Plated VIP Executive Luncheon (Days 1 & 2)', quantity: 240, unitPrice: 45.00, total: 10800.00 },
      { id: 'li_5', description: 'Continuous Artisan Espresso & Matcha Bar Stations', quantity: 3, unitPrice: 1800.00, total: 5400.00 },
      { id: 'li_6', description: 'Networking Evening Canapés & Sommelier Wine Flight', quantity: 220, unitPrice: 10.00, total: 2200.00 }
    ]
  },
  {
    id: 'po_2026_083',
    poNumber: 'PO-2026-083',
    eventId: 'evt_tech_pulse_2026',
    eventTitle: 'TechPulse Worldwide Infrastructure & AI Expo',
    vendorId: 'vend_venue_security',
    vendorName: 'Vanguard K9 & Executive Protective Security',
    vendorCategory: 'Venue Security & Access',
    title: 'Perimeter Access Control, VIP Close Protection & Bag Screening',
    totalAmount: 12500.00,
    status: 'paid',
    issuedDate: '2026-09-20',
    approvedDate: '2026-09-22',
    organizerId: 'user_organiser_1',
    notes: 'Includes 24-hour hardware exhibition overnight security patrol.',
    lineItems: [
      { id: 'li_7', description: 'SIA Licensed Static Security Officers (Day & Night)', quantity: 12, unitPrice: 650.00, total: 7800.00 },
      { id: 'li_8', description: 'Walk-through Metal Detectors & X-Ray Screening Stations', quantity: 4, unitPrice: 900.00, total: 3600.00 },
      { id: 'li_9', description: 'VIP Speaker Green Room Close Escort Team', quantity: 2, unitPrice: 550.00, total: 1100.00 }
    ]
  }
];

export const INITIAL_VENDOR_INVOICES: VendorInvoice[] = [
  {
    id: 'inv_8821',
    invoiceNumber: 'INV-8821-AC',
    poId: 'po_2026_081',
    poNumber: 'PO-2026-081',
    eventId: 'evt_procurement_summit_2026',
    eventTitle: 'Global Procurement & Enterprise Operations Summit 2026',
    vendorId: 'vend_av_prime',
    vendorName: 'Acoustica Stage & 4K LED Rigging Ltd',
    amount: 14250.00,
    issueDate: '2026-10-06',
    dueDate: '2026-11-06',
    status: 'approved',
    paymentTxId: 'tx_payout_av_998124',
    paidAt: '2026-10-10',
    pdfReference: 'INV_8821_ACOUSTICA_STAGING.pdf',
    lineItems: [
      { id: 'li_inv_1', description: 'Initial 50% mobilization deposit for curved LED wall & line arrays', quantity: 1, unitPrice: 14250.00, total: 14250.00 }
    ]
  },
  {
    id: 'inv_8824',
    invoiceNumber: 'INV-8824-SOV',
    poId: 'po_2026_082',
    poNumber: 'PO-2026-082',
    eventId: 'evt_procurement_summit_2026',
    eventTitle: 'Global Procurement & Enterprise Operations Summit 2026',
    vendorId: 'vend_catering_luxe',
    vendorName: 'Sovereign Gourmet Catering & Barista Group',
    amount: 18400.00,
    issueDate: '2026-10-12',
    dueDate: '2026-11-12',
    status: 'pending_review',
    pdfReference: 'INV_8824_SOVEREIGN_HOSPITALITY.pdf',
    lineItems: [
      { id: 'li_inv_2', description: 'Final invoice for 240 VIP luncheons, artisan barista stations & reception wine flight', quantity: 1, unitPrice: 18400.00, total: 18400.00 }
    ]
  }
];

export const INITIAL_ORDERS: OrderItem[] = [
  {
    id: 'ord_9901',
    orderNumber: 'VP-ORD-9901',
    eventId: 'evt_procurement_summit_2026',
    eventTitle: 'Global Procurement & Enterprise Operations Summit 2026',
    buyerId: 'user_attendee_1',
    buyerName: 'Marcus Chen',
    buyerEmail: 'marcus.chen@enterpriseflow.corp',
    buyerCompany: 'EnterpriseFlow Systems Inc',
    paymentMethod: 'split_card',
    paymentStatus: 'paid',
    tierId: 'tier_proc_exec',
    tierName: 'Executive All-Access Pass',
    seatCount: 3,
    unitPrice: 850.00,
    grossAmount: 2550.00,
    platformFeeRate: 0.085,
    platformFeeAmount: 216.75, // 8.5%
    organizerSplitAmount: 2333.25, // 91.5%
    createdAt: '2026-10-13 14:22:10',
    gatewayTransactionId: 'ch_split_3K99L0029Xp88',
    accountCreatedImmediately: true,
    coworkerSeats: [
      {
        seatNumber: 1,
        attendeeName: 'Marcus Chen (Lead Buyer)',
        attendeeEmail: 'marcus.chen@enterpriseflow.corp',
        attendeeJobTitle: 'Head of Strategic Procurement',
        dietaryRequirements: 'None',
        inviteStatus: 'claimed',
        inviteToken: 'tok_lead_9901_1',
        qrCodeId: 'VP-QR-9901-S1'
      },
      {
        seatNumber: 2,
        attendeeName: 'Aisha Al-Mansoor',
        attendeeEmail: 'aisha.m@enterpriseflow.corp',
        attendeeJobTitle: 'Global Supplier Risk Director',
        dietaryRequirements: 'Halal / Vegetarian',
        inviteStatus: 'claimed',
        inviteToken: 'tok_cw_9901_2',
        qrCodeId: 'VP-QR-9901-S2'
      },
      {
        seatNumber: 3,
        attendeeName: 'David K. Becker',
        attendeeEmail: 'd.becker@enterpriseflow.corp',
        attendeeJobTitle: 'Category Procurement Manager',
        dietaryRequirements: 'Gluten-Free',
        inviteStatus: 'invite_sent',
        inviteToken: 'tok_cw_9901_3',
        qrCodeId: 'VP-QR-9901-S3'
      }
    ]
  },
  {
    id: 'ord_9902',
    orderNumber: 'VP-ORD-9902',
    eventId: 'evt_tech_pulse_2026',
    eventTitle: 'TechPulse Worldwide Infrastructure & AI Expo',
    buyerName: 'Dr. Aris Thorne',
    buyerEmail: 'aris.thorne@vertexcloud.de',
    buyerCompany: 'Vertex Cloud Europe GmbH',
    paymentMethod: 'purchase_order',
    paymentStatus: 'net30_invoiced',
    poNumber: 'PO-VTX-2026-901',
    tierId: 'tier_tech_vip',
    tierName: 'Architect VIP Pass',
    seatCount: 2,
    unitPrice: 980.00,
    grossAmount: 1960.00,
    platformFeeRate: 0.085,
    platformFeeAmount: 166.60,
    organizerSplitAmount: 1793.40,
    createdAt: '2026-10-14 09:15:44',
    gatewayTransactionId: 'po_split_auth_44882193',
    accountCreatedImmediately: false,
    coworkerSeats: [
      {
        seatNumber: 1,
        attendeeName: 'Dr. Aris Thorne',
        attendeeEmail: 'aris.thorne@vertexcloud.de',
        attendeeJobTitle: 'VP Infrastructure Systems',
        dietaryRequirements: 'Vegetarian',
        inviteStatus: 'claimed',
        inviteToken: 'tok_lead_9902_1',
        qrCodeId: 'VP-QR-9902-S1'
      },
      {
        seatNumber: 2,
        attendeeName: 'Lena Lindqvist',
        attendeeEmail: 'l.lindqvist@vertexcloud.de',
        attendeeJobTitle: 'Lead Distributed Systems Architect',
        dietaryRequirements: 'Vegan',
        inviteStatus: 'pending_rsvp',
        inviteToken: 'tok_cw_9902_2',
        qrCodeId: 'VP-QR-9902-S2'
      }
    ]
  }
];

export const INITIAL_SPLIT_LEDGER: SplitLedgerEntry[] = [
  {
    id: 'split_tx_001',
    timestamp: '2026-10-13 14:22:11',
    orderNumber: 'VP-ORD-9901',
    eventId: 'evt_procurement_summit_2026',
    eventTitle: 'Global Procurement & Enterprise Operations Summit 2026',
    grossAmount: 2550.00,
    platformCut: 216.75,
    platformRatePercent: 8.5,
    organizerCut: 2333.25,
    organizerAccountId: 'acct_1Nsk992X938aL891',
    gatewayTxId: 'ch_split_3K99L0029Xp88',
    payoutStatus: 'settled_instant',
    buyerName: 'Marcus Chen (EnterpriseFlow)'
  },
  {
    id: 'split_tx_002',
    timestamp: '2026-10-14 09:15:45',
    orderNumber: 'VP-ORD-9902',
    eventId: 'evt_tech_pulse_2026',
    eventTitle: 'TechPulse Worldwide Infrastructure & AI Expo',
    grossAmount: 1960.00,
    platformCut: 166.60,
    platformRatePercent: 8.5,
    organizerCut: 1793.40,
    organizerAccountId: 'acct_1Nsk992X938aL891',
    gatewayTxId: 'po_split_auth_44882193',
    payoutStatus: 'escrow_scheduled',
    buyerName: 'Dr. Aris Thorne (Vertex Cloud)'
  }
];

export const INITIAL_EMAIL_OUTBOX: EmailNotification[] = [
  {
    id: 'eml_inv_01',
    toEmail: 'd.becker@enterpriseflow.corp',
    toName: 'David K. Becker',
    subject: 'Seat Reserved: You have been invited to Global Procurement & Enterprise Operations Summit 2026',
    body: `Hello David,\n\nMarcus Chen has reserved an Executive All-Access Pass for you for the upcoming Global Procurement & Enterprise Operations Summit 2026 in London (Nov 12 - 14, 2026).\n\nYour seat allocation is confirmed. Please click below to claim your ticket, review session tracks, and download your personal attendee pass.`,
    timestamp: '2026-10-13 14:22:15',
    type: 'coworker_invite',
    actionUrl: '#claim-ticket',
    inviteToken: 'tok_cw_9901_3',
    eventId: 'evt_procurement_summit_2026',
    orderId: 'ord_9901',
    seatNumber: 3,
    read: false
  },
  {
    id: 'eml_inv_02',
    toEmail: 'l.lindqvist@vertexcloud.de',
    toName: 'Lena Lindqvist',
    subject: 'VIP Ticket Invitation: TechPulse Worldwide Infrastructure & AI Expo',
    body: `Hi Lena,\n\nDr. Aris Thorne registered you for TechPulse Worldwide Infrastructure & AI Expo (Moscone West, San Francisco).\n\nYour Architect VIP Pass is held in pending RSVP status. Click below to verify your dietary requirements and generate your badge credential.`,
    timestamp: '2026-10-14 09:15:50',
    type: 'coworker_invite',
    actionUrl: '#claim-ticket',
    inviteToken: 'tok_cw_9902_2',
    eventId: 'evt_tech_pulse_2026',
    orderId: 'ord_9902',
    seatNumber: 2,
    read: false
  }
];
