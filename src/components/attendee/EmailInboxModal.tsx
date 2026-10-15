import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EmailNotification } from '../../types';
import { 
  X, 
  Mail, 
  Check, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  ExternalLink, 
  Calendar, 
  Ticket, 
  Lock,
  Sparkles
} from 'lucide-react';

interface EmailInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTicketWallet?: () => void;
}

export const EmailInboxModal: React.FC<EmailInboxModalProps> = ({
  isOpen,
  onClose,
  onOpenTicketWallet
}) => {
  const { emails, markEmailAsRead, claimCoworkerSeat, registerOrLoginUser } = useApp();
  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(emails[0] || null);
  const [rsvpFeedback, setRsvpFeedback] = useState<string | null>(null);
  const [accountClaimSuccess, setAccountClaimSuccess] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('secure-pwd-2026');

  if (!isOpen) return null;

  const handleSelectEmail = (email: EmailNotification) => {
    setSelectedEmail(email);
    markEmailAsRead(email.id);
    setRsvpFeedback(null);
    setAccountClaimSuccess(false);
  };

  const handleClaimRSVP = (token?: string) => {
    if (!token) return;
    const success = claimCoworkerSeat(token);
    if (success) {
      setRsvpFeedback('Your seat attendance has been confirmed and verified! You can now view your digital QR check-in credential.');
    } else {
      setRsvpFeedback('Seat has already been claimed or verified.');
    }
  };

  const handleActivateAccount = (emailAddress: string, name: string) => {
    registerOrLoginUser(name, emailAddress, 'attendee');
    setAccountClaimSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl my-6 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl text-slate-100 overflow-hidden flex flex-col h-[750px] max-h-[90vh]">
        
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Enterprise Email Outbox & Coworker Invitation Simulator</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-1.5 py-0.5 rounded">
                  Live Dispatch Active
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Inspect simulated automated invitation emails delivered to coworkers and test the RSVP ticket claim workflow.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Two-pane layout: Email List (Left) and Email Reader (Right) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Email List Sidebar */}
          <div className="w-full md:w-80 border-r border-slate-800 bg-slate-950/50 flex flex-col overflow-y-auto">
            <div className="p-3 border-b border-slate-800/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Dispatched Outbox ({emails.length})</span>
              <span className="font-mono text-indigo-400">SMTP Simulator</span>
            </div>

            <div className="divide-y divide-slate-800/60">
              {emails.map((email) => {
                const isSelected = selectedEmail?.id === email.id;
                return (
                  <button
                    key={email.id}
                    onClick={() => handleSelectEmail(email)}
                    className={`w-full text-left p-3.5 transition-all flex flex-col gap-1 ${
                      isSelected 
                        ? 'bg-indigo-950/40 border-l-2 border-indigo-500' 
                        : 'hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200 truncate max-w-[170px]">
                        To: {email.toName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {email.timestamp.split(' ')[1] || 'Just now'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 font-medium line-clamp-1">
                      {email.subject}
                    </div>

                    <div className="text-[11px] text-slate-500 truncate">
                      {email.toEmail}
                    </div>

                    <div className="mt-1 flex items-center gap-1.5 text-[10px]">
                      {email.type === 'coworker_invite' && (
                        <span className="text-indigo-400 font-mono">Coworker Invitation</span>
                      )}
                      {email.type === 'ticket_confirmation' && (
                        <span className="text-emerald-400 font-mono">Order Confirmation</span>
                      )}
                      {email.type === 'account_claim' && (
                        <span className="text-amber-400 font-mono">Account Claim</span>
                      )}
                      {email.type === 'po_issued' && (
                        <span className="text-blue-400 font-mono">Vendor PO</span>
                      )}
                      {email.type === 'invoice_approved' && (
                        <span className="text-purple-400 font-mono">Payment Remittance</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Email Reader Pane */}
          <div className="flex-1 bg-slate-900 flex flex-col overflow-y-auto">
            {selectedEmail ? (
              <div className="p-6 space-y-6">
                
                {/* Email Meta Card */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-base font-bold text-white leading-snug">
                      {selectedEmail.subject}
                    </h3>
                    <span className="text-xs font-mono text-slate-500 shrink-0">
                      {selectedEmail.timestamp}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 space-y-0.5 pt-1 border-t border-slate-800/80">
                    <div>
                      <strong className="text-slate-300">From: </strong>
                      <span>VenturePro Events Dispatcher &lt;notifications@venturepro.events&gt;</span>
                    </div>
                    <div>
                      <strong className="text-slate-300">To: </strong>
                      <span className="text-white font-medium">{selectedEmail.toName}</span> &lt;{selectedEmail.toEmail}&gt;
                    </div>
                  </div>
                </div>

                {/* Email HTML Body Frame */}
                <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4 text-xs leading-relaxed text-slate-200">
                  <div className="whitespace-pre-line font-sans text-slate-200 text-xs leading-relaxed">
                    {selectedEmail.body}
                  </div>

                  {/* Interactive Action Area inside Coworker Invitation */}
                  {selectedEmail.type === 'coworker_invite' && selectedEmail.inviteToken && (
                    <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-3">
                      <div className="p-4 rounded-lg bg-indigo-950/30 border border-indigo-900/50 space-y-2.5">
                        <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs">
                          <Ticket className="w-4 h-4 text-indigo-400" />
                          <span>Simulate Coworker Interaction (RSVP Token: {selectedEmail.inviteToken})</span>
                        </div>
                        <p className="text-[11px] text-slate-300">
                          As <strong className="text-white">{selectedEmail.toName}</strong>, click below to confirm attendance, claim your assigned seat #{selectedEmail.seatNumber}, and issue your personal check-in pass.
                        </p>

                        <div className="pt-2 flex flex-wrap items-center gap-3">
                          <button
                            onClick={() => handleClaimRSVP(selectedEmail.inviteToken)}
                            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
                          >
                            <Check className="w-4 h-4" />
                            <span>Claim Seat & Confirm Attendance (RSVP)</span>
                          </button>

                          {onOpenTicketWallet && (
                            <button
                              onClick={() => {
                                onClose();
                                onOpenTicketWallet();
                              }}
                              className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1.5"
                            >
                              <Ticket className="w-3.5 h-3.5" />
                              <span>View in Ticket Wallet</span>
                            </button>
                          )}
                        </div>

                        {rsvpFeedback && (
                          <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-800/50 text-[11px] text-emerald-300 flex items-center gap-2 mt-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>{rsvpFeedback}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Interactive Action Area for Account Claim Later */}
                  {selectedEmail.type === 'account_claim' && (
                    <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-3">
                      <div className="p-4 rounded-lg bg-indigo-950/30 border border-indigo-900/50 space-y-2.5">
                        <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs">
                          <Lock className="w-4 h-4 text-indigo-400" />
                          <span>Activate Your Account Now (Delayed Onboarding Flow)</span>
                        </div>
                        <p className="text-[11px] text-slate-300">
                          Since you selected "Create Account Later" during checkout, set your password below to activate full portal access:
                        </p>

                        {accountClaimSuccess ? (
                          <div className="p-3 rounded bg-emerald-950/60 border border-emerald-800/50 text-xs text-emerald-300 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Account successfully activated for {selectedEmail.toEmail}! You are now signed in.</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 pt-2">
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Create account password"
                              className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 max-w-xs"
                            />
                            <button
                              onClick={() => handleActivateAccount(selectedEmail.toEmail, selectedEmail.toName)}
                              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
                            >
                              Activate Account
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Ticket confirmation quick jump */}
                  {selectedEmail.type === 'ticket_confirmation' && onOpenTicketWallet && (
                    <div className="pt-3">
                      <button
                        onClick={() => {
                          onClose();
                          onOpenTicketWallet();
                        }}
                        className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors flex items-center gap-2"
                      >
                        <Ticket className="w-4 h-4" />
                        <span>Open My Digital Ticket Wallet</span>
                      </button>
                    </div>
                  )}

                </div>

                {/* Footer Notice */}
                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Cryptographic DKIM Signature: valid (venturepro.events)</span>
                  <span className="font-mono">Message-ID: &lt;{selectedEmail.id}@mail.venturepro&gt;</span>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-slate-500 text-xs">
                Select an email from the left outbox to inspect contents.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
