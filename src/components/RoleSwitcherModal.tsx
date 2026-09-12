import React from 'react';
import { X, GraduationCap, Store, Briefcase, Shield, Check, UserPlus, LogIn } from 'lucide-react';
import { User, UserRole } from '../types';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSelectRole: (role: UserRole) => void;
  onOpenAuth?: (mode: 'login' | 'signup' | 'account') => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectRole,
  onOpenAuth,
}) => {
  if (!isOpen) return null;

  const roles: {
    role: UserRole;
    name: string;
    title: string;
    icon: any;
    desc: string;
    badge: string;
    avatar: string;
    stats: string;
  }[] = [
    {
      role: 'student',
      name: 'Aarav Sharma',
      title: 'Class 10 CBSE Student',
      icon: GraduationCap,
      desc: 'Learn, solve doubts with AI, organize study planner, find tuition, and buy textbooks/services via UPI.',
      badge: 'Student',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      stats: '1,420 XP • 7-day streak',
    },
    {
      role: 'seller',
      name: 'Priya Book Depot',
      title: 'Authorized Bookstore & Academic Vendor',
      icon: Store,
      desc: 'Sell books, stationery and study supplies. Manage orders, dispatch parcels, and withdraw 85% net earnings.',
      badge: 'Seller',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
      stats: '4 Active Listings • ₹4,250 Payout',
    },
    {
      role: 'service_provider',
      name: 'Dr. Shalini Verma',
      title: 'Science & Maths Tutor / Project Guide',
      icon: Briefcase,
      desc: 'Offer tutoring, PPT/design, and project guidance. 15% commission charged only once on admission.',
      badge: 'Service Provider',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      stats: '3 Batches • ₹7,225 Payout',
    },
    {
      role: 'admin',
      name: 'LearnX Administrator',
      title: 'Central Platform Operations & Finance',
      icon: Shield,
      desc: 'Monitor transactions, audit 15% platform commission pool, review seller/provider KYC, and dispatch payouts.',
      badge: 'Super Admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      stats: 'Platform Control & UPI Treasury',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-lg bg-[#FDFBF7] border border-[#E5E0D8] rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-5 sm:p-6 border-b border-[#E5E0D8] flex items-center justify-between bg-white">
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#4A4A3A]">Switch Role Workspace</h3>
            <p className="text-xs text-[#8B8374] mt-0.5">
              Each role receives a dedicated, unmixed dashboard & profile
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#F5F2ED] hover:bg-[#EBE7DF] text-[#7A7468] hover:text-[#4A4A3A] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-2.5 max-h-[65vh] overflow-y-auto">
          {roles.map((item) => {
            const Icon = item.icon;
            const isSelected = currentUser.role === item.role;

            return (
              <div
                key={item.role}
                onClick={() => {
                  onSelectRole(item.role);
                  onClose();
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 relative ${
                  isSelected
                    ? 'bg-[#EDF0E9] border-[#5A634E] shadow-xs'
                    : 'bg-white hover:bg-[#F5F2ED] border-[#E5E0D8]'
                }`}
              >
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#E5E0D8] flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-serif font-bold text-[#4A4A3A] truncate">{item.name}</span>
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F5F2ED] text-[#7A7468] border border-[#E5E0D8]">
                        {item.badge}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#5A634E] text-white flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#5A634E] font-medium mt-0.5">{item.title}</div>
                  <p className="text-[11px] text-[#7A7468] mt-1 leading-snug">{item.desc}</p>
                  <div className="mt-2 text-[10px] font-mono text-[#8B8374] bg-[#F5F2ED] px-2.5 py-0.5 rounded-md border border-[#E5E0D8] w-fit">
                    {item.stats}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-[#F5F2ED] border-t border-[#E5E0D8] flex items-center justify-between gap-2">
          <button
            onClick={() => {
              onClose();
              if (onOpenAuth) onOpenAuth('account');
            }}
            className="text-xs text-[#5A634E] font-semibold hover:underline flex items-center gap-1"
          >
            <span>Account & Security Settings</span>
          </button>

          <button
            onClick={() => {
              onClose();
              if (onOpenAuth) onOpenAuth('login');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-[#E5E0D8] text-xs font-semibold text-[#4A4A3A] hover:bg-[#EBE7DF] transition flex items-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login Another User</span>
          </button>
        </div>
      </div>
    </div>
  );
};
