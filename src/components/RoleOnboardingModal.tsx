import React, { useState } from 'react';
import {
  GraduationCap,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  BookOpen,
  Store,
  Briefcase,
} from 'lucide-react';
import { User, UserRole } from '../types';

interface RoleOnboardingModalProps {
  isOpen: boolean;
  onRoleSelected: (role: UserRole) => void;
  currentUser: User;
}

export const RoleOnboardingModal: React.FC<RoleOnboardingModalProps> = ({
  isOpen,
  onRoleSelected,
  currentUser,
}) => {
  if (!isOpen) return null;

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [submitting, setSubmitting] = useState(false);

  const roles = [
    {
      id: 'student' as UserRole,
      title: 'Student',
      emoji: '🎓',
      tagline: 'Learn, solve doubts, find tuition and buy products/services',
      icon: GraduationCap,
      color: 'border-[#5A634E] bg-[#EDF0E9]/60',
      badge: 'Classes 6–12',
      features: [
        'Complete NCERT syllabus with quizzes & AI explanations',
        '24/7 AI Doubt Solver (summaries & revision guidance)',
        'Personal Study Planner with streak tracking & alarms',
        'Verified Tuition Finder (Home, Online & Tuition Centres)',
        'Student Book Marketplace with secure UPI payments',
      ],
    },
    {
      id: 'seller' as UserRole,
      title: 'Seller',
      emoji: '🛍️',
      tagline: 'Sell books, stationery and other allowed academic products',
      icon: Store,
      color: 'border-[#AF601A] bg-[#FDEBD0]/40',
      badge: 'Bookstore & Depot',
      features: [
        'List textbook editions, sample papers, notes & stationery',
        'Direct student orders with live order status management',
        '85% net earnings paid out to your verified Bank or UPI',
        'LearnX keeps 15% platform commission on confirmed orders',
        'Instant payout withdrawals & KYC verification badge',
      ],
    },
    {
      id: 'service_provider' as UserRole,
      title: 'Service Provider',
      emoji: '🧑‍🏫',
      tagline: 'Offer tutoring, PPT/design, project guidance and other services',
      icon: Briefcase,
      color: 'border-[#1D8348] bg-[#D5F5E3]/40',
      badge: 'Educator & Mentor',
      features: [
        'Create Home, Online, or Coaching Centre batches',
        'Offer customized PPT design, project & assignment guidance',
        'Manage student admissions & track enrolled student roster',
        '15% LearnX admission fee charged ONLY ONCE on enrollment (never recurring)',
        'Direct bank/UPI settlements for all consultation & tuition fees',
      ],
    },
  ];

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('learnx_token');
      const res = await fetch('/api/auth/select-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ role: selectedRole }),
      });
      const data = await res.json();
      if (data.success) {
        onRoleSelected(selectedRole);
      }
    } catch (err) {
      console.error('Error setting initial role:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#FDFBF7] border border-[#E5E0D8] rounded-[36px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Onboarding Header */}
        <div className="p-6 sm:p-8 text-center border-b border-[#E5E0D8] bg-white">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF0E9] border border-[#D8DFD2] text-xs font-bold text-[#5A634E] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to LearnX, {currentUser.name}!</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#4A4A3A]">
            What do you want to use LearnX as?
          </h2>
          <p className="text-xs sm:text-sm text-[#7A7468] max-w-lg mx-auto mt-1.5">
            Select your primary role. Each role receives a dedicated, customized dashboard with its own tools and profile.
          </p>
        </div>

        {/* 3 Separate Role Options */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-3.5">
          {roles.map((r) => {
            const isSelected = selectedRole === r.id;
            return (
              <div
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className={`p-4 sm:p-5 rounded-3xl border-2 cursor-pointer transition-all duration-200 relative ${
                  isSelected
                    ? `${r.color} shadow-md scale-[1.01]`
                    : 'border-[#E5E0D8] bg-white hover:border-[#C8C2B5] hover:bg-[#FAF8F4]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl sm:text-4xl p-2 rounded-2xl bg-white/80 border border-[#E5E0D8] shadow-xs">
                      {r.emoji}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-serif font-bold text-[#4A4A3A]">
                          {r.title}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#5A634E] border border-[#E5E0D8]">
                          {r.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#5A634E] font-medium mt-0.5">{r.tagline}</p>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
                      isSelected
                        ? 'border-[#5A634E] bg-[#5A634E] text-white'
                        : 'border-[#C8C2B5] bg-white'
                    }`}
                  >
                    {isSelected && <CheckCircle className="w-4 h-4" />}
                  </div>
                </div>

                {/* Role Feature Highlights */}
                <div className="mt-3.5 pt-3 border-t border-[#E5E0D8]/60 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {r.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] text-[#7A7468]">
                      <span className="text-[#5A634E] font-bold">•</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Confirmation */}
        <div className="p-5 sm:p-6 bg-white border-t border-[#E5E0D8] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-[#8B8374] text-center sm:text-left">
            <span>You can change your role later anytime in Account Settings.</span>
          </div>

          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-[#5A634E] hover:bg-[#484F3E] text-white text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2"
          >
            <span>Confirm & Open Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
