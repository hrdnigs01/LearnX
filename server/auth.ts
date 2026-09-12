import crypto from 'crypto';
import { db } from './db';
import { User, UserRole } from '../src/types';

// In-memory / file-backed security secrets
interface UserSecret {
  salt: string;
  hash: string;
}

interface SessionData {
  userId: string;
  createdAt: string;
  expiresAt: number; // timestamp
}

interface OtpData {
  code: string;
  expiresAt: number;
  attempts: number;
}

interface ResetTokenData {
  userId: string;
  email: string;
  code: string;
  expiresAt: number;
}

// In-memory stores (synced across server lifetime)
const userSecrets: Map<string, UserSecret> = new Map();
const activeSessions: Map<string, SessionData> = new Map();
const otpStore: Map<string, OtpData> = new Map();
const resetTokenStore: Map<string, ResetTokenData> = new Map();

// Seed initial user secrets with secure hashes for default accounts
(function seedDefaultSecrets() {
  const defaultAccounts = [
    { id: 'user_student_1', pass: 'student123' },
    { id: 'user_seller_1', pass: 'seller123' },
    { id: 'user_provider_1', pass: 'provider123' },
    { id: 'user_admin_1', pass: 'admin123' },
  ];

  for (const acc of defaultAccounts) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(acc.pass, salt, 100000, 64, 'sha512').toString('hex');
    userSecrets.set(acc.id, { salt, hash });
  }

  // Pre-seed a valid demo session for instant testing
  const demoStudentToken = 'demo_student_token_learnx_2026';
  activeSessions.set(demoStudentToken, {
    userId: 'user_student_1',
    createdAt: new Date().toISOString(),
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  });
})();

/**
 * Hashes password with cryptographic PBKDF2 & unique salt
 */
export function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

/**
 * Securely verifies a password using timingSafeEqual to avoid timing attacks
 */
export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  try {
    const computedHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(computedHash, 'utf8'), Buffer.from(expectedHash, 'utf8'));
  } catch (err) {
    return false;
  }
}

export function saveUserSecret(userId: string, salt: string, hash: string) {
  userSecrets.set(userId, { salt, hash });
}

export function getUserSecret(userId: string): UserSecret | undefined {
  return userSecrets.get(userId);
}

/**
 * Creates a cryptographically random session token (30 days validity)
 */
export function createSession(userId: string): string {
  const token = `lx_sess_${crypto.randomBytes(32).toString('hex')}`;
  activeSessions.set(token, {
    userId,
    createdAt: new Date().toISOString(),
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  });
  return token;
}

/**
 * Validates session token and returns the active User object (stripping secrets)
 */
export function getSessionUser(token: string | undefined): User | null {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }

  const users = db.get('users');
  const user = users.find((u) => u.id === session.userId);
  return user || null;
}

/**
 * Revokes a session token on logout
 */
export function revokeSession(token: string): boolean {
  return activeSessions.delete(token);
}

/**
 * Generates a real 6-digit OTP valid for 5 minutes
 */
export function generateOtp(phoneOrEmail: string): { code: string; expiresAt: number } {
  // Generate high-entropy 6-digit numeric OTP
  const code = Math.floor(100000 + crypto.randomInt(0, 900000)).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

  otpStore.set(phoneOrEmail, {
    code,
    expiresAt,
    attempts: 0,
  });

  console.log(`[LearnX OTP Dispatch] Delivered verification OTP to ${phoneOrEmail}: ${code}`);
  return { code, expiresAt };
}

/**
 * Verifies entered OTP with rate limit checking
 */
export function verifyOtp(phoneOrEmail: string, enteredCode: string): { valid: boolean; message?: string } {
  const data = otpStore.get(phoneOrEmail);
  if (!data) {
    return { valid: false, message: 'No OTP requested or OTP has expired. Please request a new OTP.' };
  }

  if (Date.now() > data.expiresAt) {
    otpStore.delete(phoneOrEmail);
    return { valid: false, message: 'OTP has expired. Please request a new OTP.' };
  }

  data.attempts += 1;
  if (data.attempts > 5) {
    otpStore.delete(phoneOrEmail);
    return { valid: false, message: 'Too many incorrect attempts. Please request a new OTP.' };
  }

  if (data.code !== enteredCode.trim()) {
    return { valid: false, message: 'Incorrect OTP code entered.' };
  }

  // Valid: clear OTP
  otpStore.delete(phoneOrEmail);
  return { valid: true };
}

/**
 * Generates password reset token and short 6-digit code
 */
export function createPasswordReset(email: string): { token: string; code: string } | null {
  const users = db.get('users');
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;

  const token = `lx_rst_${crypto.randomBytes(24).toString('hex')}`;
  const code = Math.floor(100000 + crypto.randomInt(0, 900000)).toString();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

  resetTokenStore.set(token, {
    userId: user.id,
    email: user.email,
    code,
    expiresAt,
  });

  console.log(`[LearnX Password Reset] Reset code for ${email}: ${code} (Token: ${token})`);
  return { token, code };
}

/**
 * Verifies reset token or code and sets new hashed password
 */
export function resetPasswordWithTokenOrCode(
  identifier: string, // token or email
  codeOrToken: string,
  newPassword: string
): { success: boolean; message?: string } {
  let targetReset: { token: string; data: ResetTokenData } | null = null;

  for (const [t, data] of resetTokenStore.entries()) {
    if (t === codeOrToken || (data.email.toLowerCase() === identifier.toLowerCase() && data.code === codeOrToken.trim())) {
      targetReset = { token: t, data };
      break;
    }
  }

  if (!targetReset) {
    return { success: false, message: 'Invalid or expired password reset link/code.' };
  }

  if (Date.now() > targetReset.data.expiresAt) {
    resetTokenStore.delete(targetReset.token);
    return { success: false, message: 'Reset link/code has expired.' };
  }

  const { salt, hash } = hashPassword(newPassword);
  userSecrets.set(targetReset.data.userId, { salt, hash });
  resetTokenStore.delete(targetReset.token);

  return { success: true };
}

/**
 * Permanently deletes user account and cleans up all sessions & records
 */
export function deleteUserAccount(userId: string): boolean {
  // Remove from users
  const users = db.get('users');
  const filteredUsers = users.filter((u) => u.id !== userId);
  db.set('users', filteredUsers);

  // Invalidate all user secrets and sessions
  userSecrets.delete(userId);

  for (const [token, sess] of activeSessions.entries()) {
    if (sess.userId === userId) {
      activeSessions.delete(token);
    }
  }

  return true;
}
