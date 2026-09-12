import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  LogOut,
  Trash2,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { User, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onAuthSuccess: (user: User, token?: string) => void;
  onRequestRoleChange?: (newRole: UserRole) => void;
  initialMode?: 'login' | 'signup' | 'account';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  onRequestRoleChange,
  initialMode = 'login',
}) => {
  if (!isOpen) return null;

  const [activeMethod, setActiveMethod] = useState<'phone' | 'google' | 'email' | 'account'>(
    initialMode === 'account' ? 'account' : 'phone'
  );
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');

  // Phone + OTP State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [demoOtpNotice, setDemoOtpNotice] = useState<string | null>(null);

  // Email + Password State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Reset State
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState<1 | 2>(1);

  // Role change modal inside account
  const [roleChangeSelection, setRoleChangeSelection] = useState<UserRole>(currentUser.role);
  const [roleChangeReason, setRoleChangeReason] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 1. Phone Number + OTP Handlers
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+91 ${cleanPhone.slice(-10)}` }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setDemoOtpNotice(data.demoCode);
        setSuccessMsg(data.message);
      } else {
        setErrorMsg(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network error while requesting OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!otpCode || otpCode.length < 6) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const cleanPhone = `+91 ${phoneNumber.replace(/\D/g, '').slice(-10)}`;
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone, code: otpCode }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        if (data.token) localStorage.setItem('learnx_token', data.token);
        onAuthSuccess(data.user, data.token);
        onClose();
      } else {
        setErrorMsg(data.message || 'Invalid or expired OTP.');
      }
    } catch (err) {
      setErrorMsg('Failed to verify OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Google Authentication Handler
  const handleGoogleAuth = async (presetEmail?: string, presetName?: string) => {
    setErrorMsg(null);
    setLoading(true);

    const targetEmail = presetEmail || 'aarav.sharma@learnx.in';
    const targetName = presetName || 'Aarav Sharma';

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          name: targetName,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        if (data.token) localStorage.setItem('learnx_token', data.token);
        onAuthSuccess(data.user, data.token);
        onClose();
      } else {
        setErrorMsg(data.message || 'Google authentication failed.');
      }
    } catch (err) {
      setErrorMsg('Error connecting with Google OAuth.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Email + Password Handlers
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (isSignUp) {
      if (!name || !email || !password) {
        setErrorMsg('Please fill in all required fields.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('/api/auth/signup-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (data.success && data.user) {
          if (data.token) localStorage.setItem('learnx_token', data.token);
          onAuthSuccess(data.user, data.token);
          onClose();
        } else {
          setErrorMsg(data.message || 'Signup failed.');
        }
      } catch (err) {
        setErrorMsg('Failed to create account.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!email || !password) {
        setErrorMsg('Please enter your email and password.');
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('/api/auth/login-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (data.success && data.user) {
          if (data.token) localStorage.setItem('learnx_token', data.token);
          onAuthSuccess(data.user, data.token);
          onClose();
        } else {
          setErrorMsg(data.message || 'Invalid email or password.');
        }
      } catch (err) {
        setErrorMsg('Login failed.');
      } finally {
        setLoading(false);
      }
    }
  };

  // 4. Password Reset Handlers
  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Reset code generated! Check your email or use test code below.`);
        setDemoOtpNotice(data.demoCode);
        setResetStep(2);
      } else {
        setErrorMsg(data.message || 'Email not found.');
      }
    } catch (err) {
      setErrorMsg('Error requesting password reset.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!resetCode || !newPassword) {
      setErrorMsg('Please enter the reset code and your new password.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          codeOrToken: resetCode,
          newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Password reset successfully! You can now log in.');
        setIsResetMode(false);
        setResetStep(1);
        setIsSignUp(false);
      } else {
        setErrorMsg(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setErrorMsg('Error submitting new password.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Account Actions (Logout, Role Change, Delete)
  const handleLogout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('learnx_token');
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      localStorage.removeItem('learnx_token');
      // Fetch default student user
      const res = await fetch('/api/auth/current-user');
      const data = await res.json();
      if (data.user) onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const token = localStorage.getItem('learnx_token');
      await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      localStorage.removeItem('learnx_token');
      window.location.reload();
    } catch (err) {
      setErrorMsg('Error deleting account.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChangeSubmit = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const token = localStorage.getItem('learnx_token');
      const res = await fetch('/api/auth/request-role-change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          newRole: roleChangeSelection,
          justification: roleChangeReason,
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        onAuthSuccess(data.user);
        setSuccessMsg(`Role switched to ${roleChangeSelection.replace('_', ' ')}!`);
        if (onRequestRoleChange) onRequestRoleChange(roleChangeSelection);
        setTimeout(() => onClose(), 600);
      } else {
        setErrorMsg(data.message || 'Failed to update role.');
      }
    } catch (err) {
      setErrorMsg('Error updating role profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FDFBF7] border border-[#E5E0D8] rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#E5E0D8] flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-[#5A634E] bg-[#EDF0E9] px-2 py-0.5 rounded-full border border-[#D8DFD2]">
                LearnX Security
              </span>
              <span className="text-[11px] text-[#8B8374]">Passkey & Encrypted</span>
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#4A4A3A] mt-1">
              {activeMethod === 'account'
                ? 'Account & Role Settings'
                : isResetMode
                ? 'Reset Your Password'
                : isSignUp
                ? 'Join LearnX Community'
                : 'Welcome Back to LearnX'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#F5F2ED] hover:bg-[#EBE7DF] text-[#7A7468] hover:text-[#4A4A3A] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Auth Method Navigation Tabs */}
        {activeMethod !== 'account' && !isResetMode && (
          <div className="grid grid-cols-3 border-b border-[#E5E0D8] bg-[#F5F2ED]/80 p-1.5 gap-1 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveMethod('phone');
                setErrorMsg(null);
              }}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-2xl transition ${
                activeMethod === 'phone'
                  ? 'bg-white text-[#5A634E] shadow-xs border border-[#E5E0D8]'
                  : 'text-[#7A7468] hover:text-[#4A4A3A]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile OTP</span>
            </button>
            <button
              onClick={() => {
                setActiveMethod('google');
                setErrorMsg(null);
              }}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-2xl transition ${
                activeMethod === 'google'
                  ? 'bg-white text-[#5A634E] shadow-xs border border-[#E5E0D8]'
                  : 'text-[#7A7468] hover:text-[#4A4A3A]'
              }`}
            >
              <span className="font-bold text-[#4285F4]">G</span>
              <span>Google</span>
            </button>
            <button
              onClick={() => {
                setActiveMethod('email');
                setErrorMsg(null);
              }}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-2xl transition ${
                activeMethod === 'email'
                  ? 'bg-white text-[#5A634E] shadow-xs border border-[#E5E0D8]'
                  : 'text-[#7A7468] hover:text-[#4A4A3A]'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </button>
          </div>
        )}

        {/* Notifications & Error Alerts */}
        <div className="px-5 pt-3">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#EDF0E9] border border-[#D8DFD2] text-xs text-[#5A634E] font-medium">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* METHOD 1: Mobile OTP */}
          {activeMethod === 'phone' && (
            <div>
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A4A3A] mb-1.5">
                      Mobile Number
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-xs font-bold text-[#5A634E]">
                        🇮🇳 +91
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter 10-digit mobile"
                        maxLength={10}
                        required
                        className="flex-1 px-4 py-2.5 rounded-2xl border border-[#E5E0D8] bg-white text-xs text-[#4A4A3A] focus:outline-none focus:border-[#5A634E]"
                      />
                    </div>
                    <p className="text-[11px] text-[#8B8374] mt-1.5">
                      We'll send an official 6-digit verification OTP code via SMS.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-2xl bg-[#5A634E] text-white text-xs font-bold shadow-sm hover:bg-[#484F3E] transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
                    <span>Get Verification OTP</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-center">
                    <span className="text-xs text-[#8B8374]">OTP sent to</span>
                    <div className="text-xs font-bold text-[#5A634E]">+91 {phoneNumber}</div>
                    {demoOtpNotice && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#5A634E]/10 border border-[#5A634E]/30 text-[11px] font-mono font-bold text-[#5A634E]">
                        <span>Demo OTP:</span>
                        <span className="tracking-widest">{demoOtpNotice}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A4A3A] mb-1.5">
                      Enter 6-Digit Code
                    </label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="• • • • • •"
                      maxLength={6}
                      autoFocus
                      required
                      className="w-full tracking-widest text-center text-lg font-mono font-bold py-2.5 rounded-2xl border border-[#E5E0D8] bg-white focus:outline-none focus:border-[#5A634E]"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[#8B8374] hover:underline"
                    >
                      Change Number
                    </button>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-[#5A634E] font-semibold hover:underline"
                    >
                      Resend OTP
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length < 6}
                    className="w-full py-3 rounded-2xl bg-[#5A634E] text-white text-xs font-bold shadow-sm hover:bg-[#484F3E] transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    <span>Verify & Continue</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* METHOD 2: Google Sign-In */}
          {activeMethod === 'google' && (
            <div className="space-y-4">
              <p className="text-xs text-[#7A7468] text-center leading-relaxed">
                Connect seamlessly using your verified Google Identity. Safe, instant, and password-free.
              </p>

              {/* Primary Google Login Button */}
              <button
                onClick={() => handleGoogleAuth()}
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl border border-[#E5E0D8] bg-white hover:bg-[#F5F2ED] text-[#4A4A3A] text-xs font-bold shadow-xs transition flex items-center justify-center gap-3"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E5E0D8]" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-[#8B8374]">
                  <span className="bg-[#FDFBF7] px-2">Or Choose Test Profile</span>
                </div>
              </div>

              {/* Fast 1-click Test Accounts */}
              <div className="space-y-1.5">
                {[
                  { name: 'Aarav Sharma (Student)', email: 'aarav.sharma@learnx.in', role: 'Student' },
                  { name: 'Priya Book Depot (Seller)', email: 'priya.books@learnx.in', role: 'Seller' },
                  { name: 'Er. Rajesh Bansal (Provider)', email: 'rajesh.bansal@learnx.in', role: 'Provider' },
                ].map((acc) => (
                  <button
                    key={acc.email}
                    onClick={() => handleGoogleAuth(acc.email, acc.name.split(' (')[0])}
                    className="w-full p-2.5 rounded-xl border border-[#E5E0D8] bg-white hover:bg-[#EDF0E9] text-left text-xs transition flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-[#4A4A3A]">{acc.name}</div>
                      <div className="text-[10px] text-[#8B8374]">{acc.email}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F2ED] text-[#5A634E] font-medium border border-[#E5E0D8]">
                      {acc.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* METHOD 3: Email + Password */}
          {activeMethod === 'email' && !isResetMode && (
            <form onSubmit={handleEmailAuth} className="space-y-3">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-[#8B8374]" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Student or Business Name"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E5E0D8] bg-white text-xs text-[#4A4A3A] focus:outline-none focus:border-[#5A634E]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#8B8374]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E5E0D8] bg-white text-xs text-[#4A4A3A] focus:outline-none focus:border-[#5A634E]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#4A4A3A]">Password</label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetMode(true);
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="text-[11px] text-[#5A634E] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#8B8374]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E5E0D8] bg-white text-xs text-[#4A4A3A] focus:outline-none focus:border-[#5A634E]"
                  />
                </div>
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#8B8374]" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E5E0D8] bg-white text-xs text-[#4A4A3A] focus:outline-none focus:border-[#5A634E]"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-2xl bg-[#5A634E] text-white text-xs font-bold shadow-sm hover:bg-[#484F3E] transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>{isSignUp ? 'Create Secure Account' : 'Sign In'}</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs text-[#7A7468] hover:text-[#4A4A3A]"
                >
                  {isSignUp ? (
                    <>Already have an account? <span className="font-semibold text-[#5A634E] underline">Sign In</span></>
                  ) : (
                    <>New to LearnX? <span className="font-semibold text-[#5A634E] underline">Create an Account</span></>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Reset Password Form */}
          {isResetMode && (
            <div className="space-y-4">
              {resetStep === 1 ? (
                <form onSubmit={handleRequestPasswordReset} className="space-y-3">
                  <p className="text-xs text-[#7A7468]">
                    Enter your registered email address. We'll generate a verification code to securely reset your password.
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">Registered Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full px-4 py-2.5 rounded-2xl border border-[#E5E0D8] bg-white text-xs text-[#4A4A3A] focus:outline-none focus:border-[#5A634E]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-2xl bg-[#5A634E] text-white text-xs font-bold shadow-sm hover:bg-[#484F3E] transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                    <span>Generate Reset Code</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsResetMode(false)}
                    className="w-full py-2 text-xs text-[#8B8374] hover:underline"
                  >
                    Back to Login
                  </button>
                </form>
              ) : (
                <form onSubmit={handleCompletePasswordReset} className="space-y-3">
                  {demoOtpNotice && (
                    <div className="p-2.5 rounded-xl bg-[#EDF0E9] border border-[#D8DFD2] text-[11px] font-mono text-[#5A634E] text-center font-bold">
                      Verification Code: {demoOtpNotice}
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">Verification Code</label>
                    <input
                      type="text"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="6-digit reset code"
                      required
                      className="w-full px-4 py-2.5 rounded-2xl border border-[#E5E0D8] bg-white text-xs text-[#4A4A3A] focus:outline-none focus:border-[#5A634E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      required
                      className="w-full px-4 py-2.5 rounded-2xl border border-[#E5E0D8] bg-white text-xs text-[#4A4A3A] focus:outline-none focus:border-[#5A634E]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-2xl bg-[#5A634E] text-white text-xs font-bold shadow-sm hover:bg-[#484F3E] transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    <span>Update & Save Password</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Account Settings & Role Modification */}
          {activeMethod === 'account' && (
            <div className="space-y-4">
              {/* Profile Card */}
              <div className="p-4 rounded-2xl bg-white border border-[#E5E0D8] flex items-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#E5E0D8]"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-serif font-bold text-sm text-[#4A4A3A] truncate">{currentUser.name}</div>
                  <div className="text-[11px] text-[#8B8374] truncate">{currentUser.email}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDF0E9] text-[#5A634E] capitalize">
                      {currentUser.role.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-[#8B8374]">
                      Auth: {currentUser.authProvider || 'Verified'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Role Change Request */}
              <div className="p-4 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-[#4A4A3A]">Change Account Role</span>
                  <span className="text-[10px] text-[#8B8374]">Dedicated Dashboards</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'student', label: '🎓 Student' },
                    { id: 'seller', label: '🛍️ Seller' },
                    { id: 'service_provider', label: '🧑‍🏫 Provider' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRoleChangeSelection(r.id as UserRole)}
                      className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition ${
                        roleChangeSelection === r.id
                          ? 'bg-[#5A634E] text-white border-[#5A634E]'
                          : 'bg-white text-[#4A4A3A] border-[#E5E0D8] hover:bg-[#EBE7DF]'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>

                {roleChangeSelection !== currentUser.role && (
                  <div className="space-y-2 pt-1 animate-in fade-in">
                    <input
                      type="text"
                      value={roleChangeReason}
                      onChange={(e) => setRoleChangeReason(e.target.value)}
                      placeholder="Business / Tutoring specialty (optional)"
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] bg-white text-xs focus:outline-none focus:border-[#5A634E]"
                    />
                    <button
                      type="button"
                      onClick={handleRoleChangeSubmit}
                      disabled={loading}
                      className="w-full py-2 rounded-xl bg-[#5A634E] text-white text-xs font-bold shadow-xs hover:bg-[#484F3E]"
                    >
                      Apply & Switch Dashboard
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-[#E5E0D8]">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-2xl border border-[#E5E0D8] bg-white hover:bg-[#F5F2ED] text-[#4A4A3A] text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <LogOut className="w-4 h-4 text-[#7A7468]" />
                  <span>Log Out Securely</span>
                </button>

                {confirmDeleteOpen ? (
                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-left space-y-2">
                    <p className="text-xs font-semibold text-red-800">
                      Permanently delete your account and all associated study progress?
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleDeleteAccount}
                        disabled={loading}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition"
                      >
                        {loading ? 'Deleting...' : 'Yes, Delete Permanently'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteOpen(false)}
                        className="py-1.5 px-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteOpen(true)}
                    disabled={loading}
                    className="w-full py-2 px-4 rounded-2xl text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Account & Data</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
