import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { Briefcase, Users, ShieldCheck, ArrowRightLeft, CreditCard } from 'lucide-react';

interface RoleQuickSwitcherProps {
  onRoleSwitched?: () => void;
}

export const RoleQuickSwitcher: React.FC<RoleQuickSwitcherProps> = ({ onRoleSwitched }) => {
  const { activeRole, switchRole, currentUser, platformFeeRate } = useApp();

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    if (onRoleSwitched) onRoleSwitched();
  };

  return (
    <div className="bg-slate-950/70 border-b border-slate-800/80 px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Left: Role indicator */}
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-400" />
            Switch Active Role Portal:
          </span>
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-md p-0.5">
            <button
              onClick={() => handleRoleChange('organiser')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeRole === 'organiser'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-3 h-3" />
              <span>Event Organiser</span>
            </button>

            <button
              onClick={() => handleRoleChange('attendee')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeRole === 'attendee'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>Event Attendee</span>
            </button>

            <button
              onClick={() => handleRoleChange('admin')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeRole === 'admin'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Website Admin</span>
            </button>
          </div>
        </div>

        {/* Right: Active Role Contextual Metadata (Zero-pill text separators) */}
        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          {activeRole === 'organiser' && (
            <>
              <span className="text-slate-300">Apex Event Operations</span>
              <span aria-hidden="true">·</span>
              <span>Stripe Account: <span className="font-mono text-slate-200">{currentUser.connectedStripeAccount || 'acct_1Nsk992X'}</span></span>
              <span aria-hidden="true">·</span>
              <span>Available Net Payout: <span className="font-mono text-emerald-400 font-medium tabular-nums">${(currentUser.stripeBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></span>
            </>
          )}

          {activeRole === 'attendee' && (
            <>
              <span className="text-slate-300">{currentUser.name}</span>
              <span aria-hidden="true">·</span>
              <span>{currentUser.company || 'Enterprise Corp'}</span>
              <span aria-hidden="true">·</span>
              <span>Coworker Booking: <span className="text-indigo-400">Enabled (Multi-seat + Invites)</span></span>
            </>
          )}

          {activeRole === 'admin' && (
            <>
              <span className="text-slate-300">VenturePro Master Vault</span>
              <span aria-hidden="true">·</span>
              <span>Platform Take Rate: <span className="font-mono text-amber-400 font-medium tabular-nums">{(platformFeeRate * 100).toFixed(1)}%</span></span>
              <span aria-hidden="true">·</span>
              <span>Split Routing: <span className="font-mono text-slate-200">Live Dual-Disbursement</span></span>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
