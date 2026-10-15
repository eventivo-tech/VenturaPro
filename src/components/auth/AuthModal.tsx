import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile, UserRole } from '../../types';
import { X, Check, Lock, Mail, User, Building, ArrowRight } from 'lucide-react';
import { INITIAL_USERS } from '../../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, loginAsUser, registerOrLoginUser } = useApp();
  const [mode, setMode] = useState<'switch_preset' | 'custom_login' | 'register'>('switch_preset');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState<UserRole>('attendee');

  if (!isOpen) return null;

  const handleSelectPreset = (user: UserProfile) => {
    loginAsUser(user);
    onClose();
  };

  const handleRegisterOrLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    registerOrLoginUser(name.trim() || email.split('@')[0], email.trim(), role, company.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-semibold text-white">Account Authentication & Portals</h2>
            <p className="text-xs text-slate-400 mt-0.5">Switch active credentials or create a customized account</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg mt-4 text-xs font-medium">
          <button
            onClick={() => setMode('switch_preset')}
            className={`flex-1 py-1.5 rounded-md transition-colors ${
              mode === 'switch_preset' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Demo Profiles
          </button>
          <button
            onClick={() => setMode('custom_login')}
            className={`flex-1 py-1.5 rounded-md transition-colors ${
              mode === 'custom_login' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Direct Login
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-1.5 rounded-md transition-colors ${
              mode === 'register' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            New Registration
          </button>
        </div>

        {/* Content based on mode */}
        {mode === 'switch_preset' && (
          <div className="mt-5 space-y-3">
            <p className="text-xs text-slate-400">
              Select one of the pre-configured enterprise personas to test respective dashboard capabilities:
            </p>

            <div className="space-y-2.5">
              {INITIAL_USERS.map((user) => {
                const isSelected = currentUser.id === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelectPreset(user)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-center justify-between ${
                      isSelected 
                        ? 'border-indigo-500 bg-indigo-950/40 text-white' 
                        : 'border-slate-800 bg-slate-950/50 hover:bg-slate-800/60 hover:border-slate-700 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-indigo-400 shrink-0">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{user.name}</span>
                          <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 border border-indigo-500/20 px-1 rounded">
                            {user.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{user.company} · {user.email}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 shrink-0">
                        <Check className="w-4 h-4" />
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {(mode === 'custom_login' || mode === 'register') && (
          <form onSubmit={handleRegisterOrLogin} className="mt-5 space-y-3.5 text-xs">
            {mode === 'register' && (
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jordan Miller"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan.miller@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-slate-300 font-medium mb-1">Company / Organization</label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Global Inc"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-medium mb-1">Assign User Role Portal</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="attendee">Event Attendee (Browse, Book Seats, Coworker Invites)</option>
                <option value="organiser">Event Organiser (Manage Events, Sales, Procurement POs)</option>
                <option value="admin">Website Admin (Platform Revenue, Split Transfers, Audits)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  defaultValue="demo-secure-pass"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{mode === 'register' ? 'Complete Registration & Sign In' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Enterprise Single Sign-On (SSO) & PO invoicing active</span>
          <span className="font-mono text-slate-400">TLS 1.3 Verified</span>
        </div>

      </div>
    </div>
  );
};
