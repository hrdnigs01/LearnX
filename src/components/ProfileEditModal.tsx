import React, { useState, useEffect } from 'react';
import {
  X,
  User as UserIcon,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  MapPin,
  Check,
  Sparkles,
  Camera,
  Flame,
  Zap,
  Award,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Compass,
} from 'lucide-react';
import { User } from '../types';
import { playChime } from '../utils/audio';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onProfileUpdated: (updatedUser: User) => void;
}

// Curated high-quality, student-friendly avatar presets
export const AVATAR_PRESETS = [
  {
    id: 'avatar_1',
    label: 'Aarav (Default)',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=250&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar_2',
    label: 'Ananya (Science)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar_3',
    label: 'Rohan (Maths)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar_4',
    label: 'Diya (Topper)',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar_5',
    label: 'Kabir (Scholar)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar_6',
    label: 'Isha (Commerce)',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar_7',
    label: 'Dev (Quizzer)',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=250&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar_8',
    label: 'Sneha (Biology)',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&auto=format&fit=crop&q=80',
  },
];

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onProfileUpdated,
}) => {
  const [name, setName] = useState(currentUser.name || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || AVATAR_PRESETS[0].url);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showCustomAvatarInput, setShowCustomAvatarInput] = useState(false);
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [classLevel, setClassLevel] = useState<number>(currentUser.classLevel || 10);
  const [stream, setStream] = useState<'Science' | 'Commerce' | 'Arts'>(currentUser.stream || 'Science');
  const [schoolName, setSchoolName] = useState(currentUser.schoolName || '');
  const [city, setCity] = useState(currentUser.city || '');
  const [locality, setLocality] = useState(currentUser.locality || '');

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync state whenever modal opens or currentUser changes
  useEffect(() => {
    if (isOpen) {
      setName(currentUser.name || '');
      setAvatar(currentUser.avatar || AVATAR_PRESETS[0].url);
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setClassLevel(currentUser.classLevel || 10);
      setStream(currentUser.stream || 'Science');
      setSchoolName(currentUser.schoolName || '');
      setCity(currentUser.city || '');
      setLocality(currentUser.locality || '');
      setErrorMessage(null);
      setSuccessMessage(null);
      setShowCustomAvatarInput(false);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSelectPreset = (url: string) => {
    setAvatar(url);
    setShowCustomAvatarInput(false);
    playChime('click');
  };

  const handleApplyCustomAvatar = () => {
    if (customAvatarUrl.trim()) {
      setAvatar(customAvatarUrl.trim());
      setShowCustomAvatarInput(false);
      playChime('click');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem('learnx_token');
      const payload = {
        name: name.trim(),
        avatar,
        email: email.trim(),
        phone: phone.trim(),
        classLevel: Number(classLevel),
        stream: classLevel >= 11 ? stream : undefined,
        schoolName: schoolName.trim(),
        city: city.trim(),
        locality: locality.trim(),
      };

      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.user) {
        const updated: User = {
          ...currentUser,
          ...data.user,
        };

        // Cache in local storage for offline & persistent backup
        localStorage.setItem(`learnx_profile_${updated.id}`, JSON.stringify(updated));
        localStorage.setItem('learnx_active_user_data', JSON.stringify(updated));

        playChime('badge');
        setSuccessMessage('Profile updated successfully!');
        onProfileUpdated(updated);

        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setErrorMessage(data.message || 'Failed to update profile. Please try again.');
      }
    } catch (err) {
      // Fallback: update client state & local storage gracefully even if offline
      const offlineUpdated: User = {
        ...currentUser,
        name: name.trim(),
        avatar,
        email: email.trim(),
        phone: phone.trim(),
        classLevel: Number(classLevel),
        stream: classLevel >= 11 ? stream : undefined,
        schoolName: schoolName.trim(),
        city: city.trim(),
        locality: locality.trim(),
      };
      localStorage.setItem(`learnx_profile_${offlineUpdated.id}`, JSON.stringify(offlineUpdated));
      localStorage.setItem('learnx_active_user_data', JSON.stringify(offlineUpdated));
      playChime('badge');
      setSuccessMessage('Profile saved to local storage!');
      onProfileUpdated(offlineUpdated);
      setTimeout(() => {
        onClose();
      }, 800);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div
        className="w-full max-w-2xl bg-[#FDFBF7] border border-[#E5E0D8] rounded-[32px] shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip */}
        <div className="p-4 sm:p-6 bg-[#5A634E] text-white flex items-center justify-between relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-xs">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider mb-0.5">
                <Sparkles className="w-3 h-3" />
                <span>Student Customization</span>
              </div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-white tracking-tight">
                Edit Student Profile
              </h2>
              <p className="text-[11px] sm:text-xs text-white/80">
                Personalize your scholar identity, grade, school & location
              </p>
            </div>
          </div>

          <button
            id="close-profile-modal-btn"
            onClick={onClose}
            className="relative z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Status Feedback Banners */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          {/* Section 1: Avatar Customization */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E5E0D8] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-serif font-bold text-[#4A4A3A] flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#5A634E]" />
                  <span>Profile Avatar</span>
                </label>
                <p className="text-[11px] text-[#8B8374]">
                  Choose from scholar presets or enter a custom image URL
                </p>
              </div>

              {/* Active Avatar Preview */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={avatar}
                    alt="Current Avatar"
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-[#5A634E] shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#5A634E] text-white flex items-center justify-center text-[10px]">
                    <Check className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-2.5 pt-1">
              {AVATAR_PRESETS.map((p) => {
                const isSelected = avatar === p.url;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPreset(p.url)}
                    className={`relative p-1 rounded-2xl border-2 transition-all flex flex-col items-center group ${
                      isSelected
                        ? 'border-[#5A634E] bg-[#5A634E]/10 scale-105 shadow-xs'
                        : 'border-[#E5E0D8] hover:border-[#5A634E]/50 bg-[#FDFBF7]'
                    }`}
                    title={p.label}
                  >
                    <img
                      src={p.url}
                      alt={p.label}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <span className="text-[9px] text-[#7A7468] truncate w-full text-center mt-1 font-medium">
                      {p.label.split(' ')[0]}
                    </span>
                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#5A634E] text-white flex items-center justify-center text-[8px] font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom URL Input Toggle */}
            <div className="pt-2 border-t border-[#E5E0D8]/60 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setShowCustomAvatarInput(!showCustomAvatarInput)}
                className="text-[#5A634E] hover:underline font-semibold flex items-center gap-1"
              >
                <span>{showCustomAvatarInput ? 'Hide Custom URL' : 'Use Custom Avatar URL...'}</span>
              </button>
              <span className="text-[11px] text-[#8B8374]">Unsplash, Gravatar or photo URL</span>
            </div>

            {showCustomAvatarInput && (
              <div className="flex gap-2 pt-1 animate-in fade-in">
                <input
                  type="url"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] text-[#4A4A3A] focus:outline-hidden focus:border-[#5A634E]"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomAvatar}
                  className="px-4 py-2 rounded-xl bg-[#5A634E] text-white text-xs font-bold hover:bg-[#484F3E] transition flex-shrink-0"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Section 2: Personal & Contact Information */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E5E0D8] space-y-4">
            <h3 className="text-xs font-serif font-bold text-[#4A4A3A] uppercase tracking-wider flex items-center gap-1.5">
              <UserIcon className="w-4 h-4 text-[#5A634E]" />
              <span>Personal & Contact Info</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4A4A3A]">
                  Full Student Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#8B8374] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl border border-[#E5E0D8] bg-[#FDFBF7] text-xs font-semibold text-[#4A4A3A] focus:outline-hidden focus:border-[#5A634E]"
                  />
                </div>
              </div>

              {/* Mobile Phone */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4A4A3A]">
                  Mobile Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8B8374] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl border border-[#E5E0D8] bg-[#FDFBF7] text-xs font-medium text-[#4A4A3A] focus:outline-hidden focus:border-[#5A634E]"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-[#4A4A3A]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8B8374] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aarav.sharma@learnx.in"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl border border-[#E5E0D8] bg-[#FDFBF7] text-xs font-medium text-[#4A4A3A] focus:outline-hidden focus:border-[#5A634E]"
                  />
                </div>
                <p className="text-[11px] text-[#8B8374]">
                  Used for account recovery, test score reports & payment invoices
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Academic Details (Class, Stream, School) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E5E0D8] space-y-4">
            <h3 className="text-xs font-serif font-bold text-[#4A4A3A] uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#5A634E]" />
              <span>Academic Details</span>
            </h3>

            {/* Class/Grade Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#4A4A3A]">
                  Target Class / Standard
                </label>
                <span className="text-[11px] text-[#5A634E] font-bold">
                  Class {classLevel} NCERT Syllabus
                </span>
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {[6, 7, 8, 9, 10, 11, 12].map((lvl) => {
                  const isSelected = classLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => {
                        setClassLevel(lvl);
                        playChime('click');
                      }}
                      className={`py-2 text-xs font-bold rounded-xl transition ${
                        isSelected
                          ? 'bg-[#5A634E] text-white shadow-xs'
                          : 'bg-[#F5F2ED] border border-[#E5E0D8] text-[#7A7468] hover:bg-[#EBE7DF]'
                      }`}
                    >
                      {lvl}th
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stream Selector (Class 11 & 12 only) */}
            {classLevel >= 11 && (
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] animate-in fade-in">
                <label className="text-xs font-semibold text-[#4A4A3A]">
                  Senior Secondary Stream
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Science', 'Commerce', 'Arts'] as const).map((s) => {
                    const isSelected = stream === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setStream(s);
                          playChime('click');
                        }}
                        className={`py-2 text-xs font-bold rounded-xl transition ${
                          isSelected
                            ? 'bg-[#5A634E] text-white shadow-xs'
                            : 'bg-white border border-[#E5E0D8] text-[#7A7468] hover:bg-[#EBE7DF]'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* School Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A4A3A]">
                School / Institution Name
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-[#8B8374] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="e.g. Delhi Public School, R.K. Puram"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl border border-[#E5E0D8] bg-[#FDFBF7] text-xs font-medium text-[#4A4A3A] focus:outline-hidden focus:border-[#5A634E]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Location & Locality (City & Area) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E5E0D8] space-y-4">
            <h3 className="text-xs font-serif font-bold text-[#4A4A3A] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#5A634E]" />
              <span>Location & Tuition Area</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* City */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4A4A3A]">
                  City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#8B8374] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. New Delhi, Bengaluru, Lucknow"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl border border-[#E5E0D8] bg-[#FDFBF7] text-xs font-medium text-[#4A4A3A] focus:outline-hidden focus:border-[#5A634E]"
                  />
                </div>
              </div>

              {/* Area / Locality */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4A4A3A]">
                  Area / Locality
                </label>
                <div className="relative">
                  <Compass className="w-4 h-4 text-[#8B8374] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Vasant Kunj, Indiranagar, Gomti Nagar"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl border border-[#E5E0D8] bg-[#FDFBF7] text-xs font-medium text-[#4A4A3A] focus:outline-hidden focus:border-[#5A634E]"
                  />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-[#8B8374]">
              Used to match you with verified home tutors, coaching centres & book exchanges in your neighborhood.
            </p>
          </div>

          {/* Gamification Stats Strip */}
          <div className="p-3.5 rounded-2xl bg-[#EDF0E9] border border-[#D8DFD2] flex items-center justify-around text-center text-xs">
            <div className="flex items-center gap-1.5 text-[#AF601A]">
              <Flame className="w-4 h-4 fill-[#AF601A]" />
              <span className="font-bold">{currentUser.streakDays}d Streak</span>
            </div>
            <div className="h-4 w-px bg-[#D8DFD2]" />
            <div className="flex items-center gap-1.5 text-[#1D8348]">
              <Zap className="w-4 h-4" />
              <span className="font-bold">{currentUser.xp} XP</span>
            </div>
            <div className="h-4 w-px bg-[#D8DFD2]" />
            <div className="flex items-center gap-1.5 text-[#5A634E]">
              <Award className="w-4 h-4" />
              <span className="font-bold">Level {currentUser.level} Scholar</span>
            </div>
          </div>

          {/* Bottom Sticky Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-2xl border border-[#E5E0D8] bg-white text-xs font-semibold text-[#7A7468] hover:bg-[#F5F2ED] transition"
            >
              Cancel
            </button>
            <button
              id="save-student-profile-btn"
              type="submit"
              disabled={isSaving}
              className="flex-[2] py-3 px-4 rounded-2xl bg-[#5A634E] text-white text-xs font-bold shadow-md hover:bg-[#484F3E] transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
