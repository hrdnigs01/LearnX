import React, { useState, useRef, useEffect } from 'react';
import {
  GraduationCap,
  Flame,
  Zap,
  Bell,
  ChevronDown,
  UserCheck,
  Building2,
  Shield,
  Search,
  Check,
  Sparkles,
  Store,
  Briefcase,
  User as UserIcon,
  LogIn,
  Edit3,
  MapPin,
  Settings,
  LogOut,
  RefreshCw,
  Smartphone,
  Bookmark,
  MessageSquarePlus,
} from 'lucide-react';
import { User, NotificationItem } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentUser: User;
  classLevel: number;
  onClassChange: (level: number) => void;
  stream?: string;
  onStreamChange: (stream: string) => void;
  onOpenRoleSwitcher: () => void;
  onOpenSearch: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onOpenAuth?: (mode: 'login' | 'signup' | 'account') => void;
  onOpenEditProfile?: () => void;
  onOpenBookmarks?: () => void;
  onOpenFeedback?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  classLevel,
  onClassChange,
  stream,
  onStreamChange,
  onOpenRoleSwitcher,
  onOpenSearch,
  notifications,
  onMarkNotificationRead,
  onOpenAuth,
  onOpenEditProfile,
  onOpenBookmarks,
  onOpenFeedback,
}) => {
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleLabels: Record<string, { label: string; icon: any; color: string }> = {
    student: { label: 'Student', icon: GraduationCap, color: 'bg-[#EDF0E9] text-[#5A634E] border-[#D8DFD2]' },
    seller: { label: 'Seller Store', icon: Store, color: 'bg-[#FDEBD0] text-[#AF601A] border-[#FAD7A0]' },
    service_provider: { label: 'Provider', icon: Briefcase, color: 'bg-[#D5F5E3] text-[#1D8348] border-[#ABEBC6]' },
    tutor: { label: 'Provider', icon: Briefcase, color: 'bg-[#D5F5E3] text-[#1D8348] border-[#ABEBC6]' },
    centre: { label: 'Provider', icon: Briefcase, color: 'bg-[#D5F5E3] text-[#1D8348] border-[#ABEBC6]' },
    admin: { label: 'Admin Panel', icon: Shield, color: 'bg-[#F9EBEA] text-[#922B21] border-[#F5B7B1]' },
  };

  const currentRole = roleLabels[currentUser.role] || roleLabels.student;
  const RoleIcon = currentRole.icon;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E5E0D8] shadow-2xs">
      <div className="w-full px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-2">
        {/* Brand & Class Picker */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#5A634E] flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl sm:text-2xl text-[#5A634E] tracking-tight">
                  LearnX
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-[#F5F2ED] text-[#7A7468] border border-[#E5E0D8]">
                  NCERT 6–12
                </span>
              </div>
            </div>
          </div>

          {/* Class Dropdown Switcher */}
          <div className="relative">
            <button
              id="class-selector-btn"
              onClick={() => setShowClassDropdown(!showClassDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F2ED] hover:bg-[#EBE7DF] border border-[#E5E0D8] text-xs sm:text-sm font-semibold text-[#4A4A3A] transition"
            >
              <span>Class {classLevel}</span>
              {classLevel >= 11 && stream && (
                <span className="hidden md:inline text-[11px] text-[#5A634E] font-medium">
                  ({stream})
                </span>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-[#8B8374]" />
            </button>

            {showClassDropdown && (
              <div className="absolute top-full left-0 mt-2 w-56 p-3 rounded-2xl bg-white border border-[#E5E0D8] shadow-xl z-50 animate-in fade-in zoom-in-95">
                <div className="text-[11px] font-semibold text-[#8B8374] uppercase tracking-wider px-1 py-1">
                  Select Grade / Class
                </div>
                <div className="grid grid-cols-4 gap-1.5 my-1.5">
                  {[6, 7, 8, 9, 10, 11, 12].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        onClassChange(lvl);
                        setShowClassDropdown(false);
                      }}
                      className={`py-1.5 text-xs font-bold rounded-xl transition ${
                        classLevel === lvl
                          ? 'bg-[#5A634E] text-white shadow-sm'
                          : 'bg-[#F5F2ED] text-[#4A4A3A] hover:bg-[#EBE7DF]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>

                {classLevel >= 11 && (
                  <div className="mt-2.5 pt-2 border-t border-[#E5E0D8]">
                    <div className="text-[11px] font-semibold text-[#8B8374] uppercase tracking-wider px-1 py-1">
                      Choose Stream
                    </div>
                    <div className="grid grid-cols-3 gap-1 mt-1">
                      {['Science', 'Commerce', 'Arts'].map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            onStreamChange(s);
                            setShowClassDropdown(false);
                          }}
                          className={`py-1 text-[11px] font-semibold rounded-lg transition ${
                            stream === s
                              ? 'bg-[#5A634E] text-white'
                              : 'bg-[#F5F2ED] text-[#7A7468] hover:bg-[#EBE7DF]'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Center Search Trigger */}
        <button
          id="global-search-trigger"
          onClick={onOpenSearch}
          className="flex-1 max-w-xs hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#F5F2ED] hover:bg-[#EBE7DF] border border-[#E5E0D8] text-xs text-[#8B8374] transition"
        >
          <Search className="w-3.5 h-3.5 text-[#8B8374]" />
          <span className="truncate">Search NCERT, Tutors, Books, AI...</span>
          <kbd className="hidden lg:inline-block ml-auto text-[10px] px-2 py-0.5 rounded bg-[#E9E4DB] text-[#7A7468] font-mono">
            /
          </kbd>
        </button>

        {/* Right Stats & Profile Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Quick Search on mobile */}
          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 rounded-full bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A]"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Streak Badge */}
          <div
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#FDEBD0] border border-[#FAD7A0] text-[#AF601A] text-xs font-bold"
            title={`${currentUser.streakDays} Day Study Streak`}
          >
            <Flame className="w-3.5 h-3.5 fill-[#AF601A]" />
            <span>{currentUser.streakDays}d</span>
            <span className="hidden sm:inline">Streak</span>
          </div>

          {/* XP Badge */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D5F5E3] border border-[#ABEBC6] text-[#1D8348] text-xs font-bold"
            title={`${currentUser.xp} Experience Points (Level ${currentUser.level})`}
          >
            <Zap className="w-3.5 h-3.5 text-[#1D8348]" />
            <span>{currentUser.xp.toLocaleString()} XP</span>
          </div>

          {/* PWA / Android APK Install Button - visible on larger screens */}
          <PWAInstallButton className="hidden md:flex" />

          {/* Saved Bookmarks Button */}
          {onOpenBookmarks && (
            <button
              id="header-bookmarks-btn"
              onClick={onOpenBookmarks}
              className="relative p-2 rounded-full bg-[#F5F2ED] hover:bg-[#EBE7DF] border border-[#E5E0D8] text-[#4A4A3A] transition"
              title="Saved Bookmarks, Formulas & Notes"
            >
              <Bookmark className="w-4 h-4 text-[#5A634E]" />
            </button>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              id="notifications-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full bg-[#F5F2ED] hover:bg-[#EBE7DF] border border-[#E5E0D8] text-[#4A4A3A] transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-[#5A634E]" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#AF601A] text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 max-w-[calc(100vw-24px)] p-3 rounded-2xl bg-white border border-[#E5E0D8] shadow-2xl z-50 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-[#E5E0D8]">
                  <div className="font-serif font-bold text-sm text-[#4A4A3A] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#5A634E]" />
                    <span>Notifications</span>
                  </div>
                  <span className="text-xs text-[#8B8374]">{unreadCount} new</span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 py-2 divide-y divide-[#E5E0D8]/60">
                  {notifications.length === 0 ? (
                    <div className="text-xs text-[#8B8374] text-center py-4">No notifications yet</div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => onMarkNotificationRead(notif.id)}
                        className={`pt-2 cursor-pointer transition ${
                          notif.read ? 'opacity-60' : 'opacity-100'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-semibold text-[#4A4A3A]">{notif.title}</h4>
                          {!notif.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#5A634E] flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-[11px] text-[#7A7468] line-clamp-2 mt-0.5">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Role Pill & Switcher (desktop/tablet/mobile) */}
          <button
            id="role-switcher-btn"
            onClick={onOpenRoleSwitcher}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border text-xs font-semibold transition hover:brightness-95 ${currentRole.color}`}
            title="Switch User Role & Profile"
          >
            <RoleIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{currentRole.label}</span>
            <ChevronDown className="w-3 h-3 opacity-60 hidden sm:inline" />
          </button>

          {/* User Account / Profile Menu Button */}
          <div className="relative" ref={userMenuRef}>
            <button
              id="user-account-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-full bg-[#F5F2ED] hover:bg-[#EBE7DF] border border-[#E5E0D8] transition shadow-2xs group"
              title={`${currentUser.name} - Profile & Account`}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover border border-[#E5E0D8] group-hover:scale-105 transition"
              />
              <span className="hidden md:inline text-xs font-semibold text-[#4A4A3A]">
                {currentUser.name.split(' ')[0]}
              </span>
              <ChevronDown className={`w-3 h-3 text-[#7A7468] transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile & Account Dropdown Popover */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-24px)] bg-white border border-[#E5E0D8] rounded-3xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Profile Identity Card */}
                <div className="p-4 bg-gradient-to-br from-[#5A634E] to-[#484F3E] text-white">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-white/40 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate font-serif">
                          {currentUser.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white capitalize">
                          {currentUser.role.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-[11px] text-white/80 truncate">
                        {currentUser.email || 'Student Account'}
                      </div>
                      <div className="text-[10px] text-white/90 mt-1 flex items-center gap-2">
                        <span>Class {classLevel}{stream && stream !== 'All' ? ` (${stream})` : ''}</span>
                        {currentUser.city && (
                          <span className="flex items-center gap-0.5 truncate">
                            <MapPin className="w-2.5 h-2.5" />
                            {currentUser.city}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* School Badge if present */}
                  {currentUser.schoolName && (
                    <div className="mt-2.5 pt-2 border-t border-white/20 text-[10px] text-white/90 truncate flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{currentUser.schoolName}</span>
                    </div>
                  )}
                </div>

                {/* Actions Menu */}
                <div className="p-2 space-y-1 bg-[#FDFBF7]">
                  {/* Dedicated Edit Profile Action */}
                  <button
                    id="menu-edit-profile-btn"
                    onClick={() => {
                      setShowUserMenu(false);
                      if (onOpenEditProfile) {
                        onOpenEditProfile();
                      } else if (onOpenAuth) {
                        onOpenAuth('account');
                      }
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-[#EDF0E9] hover:bg-[#E3E8DD] text-[#5A634E] text-xs font-bold transition shadow-2xs border border-[#D8DFD2]"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-[#5A634E] text-white flex items-center justify-center">
                        <Edit3 className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left">
                        <div>Edit Student Profile</div>
                        <div className="text-[10px] text-[#7A7468] font-normal">Change Avatar, Grade, School & City</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#5A634E]">
                      Customise
                    </span>
                  </button>

                  {/* Account Security & Password */}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenAuth && onOpenAuth('account');
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-2xl hover:bg-[#F5F2ED] text-[#4A4A3A] text-xs font-semibold transition text-left"
                  >
                    <div className="w-7 h-7 rounded-xl bg-[#F5F2ED] text-[#7A7468] flex items-center justify-center border border-[#E5E0D8]">
                      <Settings className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div>Account & Security</div>
                      <div className="text-[10px] text-[#8B8374] font-normal">Credentials, Role & Password</div>
                    </div>
                  </button>

                  {/* Saved Bookmarks & Formulas */}
                  {onOpenBookmarks && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenBookmarks();
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-2xl hover:bg-[#F5F2ED] text-[#4A4A3A] text-xs font-semibold transition text-left"
                    >
                      <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                        <Bookmark className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div>Saved Bookmarks</div>
                        <div className="text-[10px] text-[#8B8374] font-normal">Formulas, concepts & notes</div>
                      </div>
                    </button>
                  )}

                  {/* Share App Feedback & Suggestions */}
                  {onOpenFeedback && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenFeedback();
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-2xl hover:bg-[#F5F2ED] text-[#4A4A3A] text-xs font-semibold transition text-left"
                    >
                      <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
                        <MessageSquarePlus className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div>Feedback & Feature Request</div>
                        <div className="text-[10px] text-[#8B8374] font-normal">Rate app or suggest ideas</div>
                      </div>
                    </button>
                  )}

                  {/* Switch Role Option */}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenRoleSwitcher();
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-2xl hover:bg-[#F5F2ED] text-[#4A4A3A] text-xs font-semibold transition text-left"
                  >
                    <div className="w-7 h-7 rounded-xl bg-[#F5F2ED] text-[#7A7468] flex items-center justify-center border border-[#E5E0D8]">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div>Switch App Role</div>
                      <div className="text-[10px] text-[#8B8374] font-normal">Student, Seller, Tutor or Admin</div>
                    </div>
                  </button>

                  {/* Sign Out / Switch Account */}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenAuth && onOpenAuth('login');
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-2xl hover:bg-rose-50 text-rose-700 text-xs font-semibold transition text-left border-t border-[#E5E0D8]/60 mt-1"
                  >
                    <div className="w-7 h-7 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                      <LogOut className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div>Sign Out / Switch User</div>
                      <div className="text-[10px] text-rose-600/80 font-normal">Change active session</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
