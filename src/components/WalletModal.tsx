import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Coins,
  ArrowUpRight,
  RefreshCw,
  X,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Zap,
  IndianRupee,
  Clock,
  ArrowDownLeft,
  Swords,
  ChevronRight,
} from 'lucide-react';
import { User, WalletTransaction, BATTLE_TIERS } from '../types';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateUser?: (updatedUser: Partial<User>) => void;
  initialTab?: 'deposit' | 'redeem' | 'history';
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  initialTab = 'deposit',
}) => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'redeem' | 'history'>('deposit');
  const [walletCash, setWalletCash] = useState<number>(currentUser.walletCash ?? 120);
  const [walletCoins, setWalletCoins] = useState<number>(currentUser.walletCoins ?? 1450);
  const [escrowCash, setEscrowCash] = useState<number>(currentUser.escrowCash ?? 0);
  const [totalEarningsCash, setTotalEarningsCash] = useState<number>(currentUser.totalEarningsCash ?? 350);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Deposit Form State
  const [depositAmount, setDepositAmount] = useState<number>(100);
  const [upiApp, setUpiApp] = useState<'GPay' | 'PhonePe' | 'Paytm' | 'BHIM'>('GPay');
  const [vpa, setVpa] = useState<string>('student@okhdfcbank');

  // Redeem Coins Form State (1000 Coins = ₹5)
  const [coinsToRedeem, setCoinsToRedeem] = useState<number>(1000);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const fetchWallet = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/wallet/balance');
      const data = await res.json();
      if (data.success) {
        setWalletCash(data.walletCash);
        setWalletCoins(data.walletCoins);
        setEscrowCash(data.escrowCash);
        setTotalEarningsCash(data.totalEarningsCash);
        setTransactions(data.transactions || []);
        if (onUpdateUser) {
          onUpdateUser({
            walletCash: data.walletCash,
            walletCoins: data.walletCoins,
            escrowCash: data.escrowCash,
            totalEarningsCash: data.totalEarningsCash,
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch wallet:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchWallet();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Instant UPI Deposit
  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount <= 0) {
      setErrorMsg('Please select or enter a valid amount.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: depositAmount, upiApp, vpa }),
      });
      const data = await res.json();
      if (data.success) {
        setWalletCash(data.walletCash);
        setWalletCoins(data.walletCoins);
        setSuccessMsg(data.message || `₹${depositAmount} added successfully!`);
        if (onUpdateUser) {
          onUpdateUser({ walletCash: data.walletCash, walletCoins: data.walletCoins });
        }
        await fetchWallet();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(data.message || 'Deposit failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error during deposit');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Coin Redemption (1000 Coins = ₹5)
  const maxRedeemableCoins = Math.floor(walletCoins / 1000) * 1000;
  const cashEquivalent = Math.floor(coinsToRedeem / 1000) * 5;

  const handleRedeemCoins = async (e: React.FormEvent) => {
    e.preventDefault();
    if (coinsToRedeem < 1000) {
      setErrorMsg('Minimum redemption amount is 1,000 Coins.');
      return;
    }
    if (coinsToRedeem > walletCoins) {
      setErrorMsg(`You only have ${walletCoins} coins available.`);
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/wallet/redeem-coins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coinsToRedeem }),
      });
      const data = await res.json();
      if (data.success) {
        setWalletCash(data.walletCash);
        setWalletCoins(data.walletCoins);
        setSuccessMsg(data.message);
        if (onUpdateUser) {
          onUpdateUser({ walletCash: data.walletCash, walletCoins: data.walletCoins });
        }
        await fetchWallet();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(data.message || 'Redemption failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error during coin redemption');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div
        id="learnx-wallet-modal"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E5E0D8] overflow-hidden flex flex-col my-auto"
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#2C3325] via-[#3E4733] to-[#5A634E] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-serif font-bold text-white">LearnX Battle Wallet</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Escrow Protected
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Secure real cash INR & virtual study coins for competitive 1v1 quiz duels.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Balances Bento Grid */}
        <div className="p-5 sm:p-6 bg-[#FDFBF7] border-b border-[#E5E0D8]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* 1. Real Cash */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#E5E0D8] shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-[#7A7468]">
                <span>Cash Balance</span>
                <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-xl sm:text-2xl font-bold font-serif text-[#2C3325]">
                ₹{walletCash.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold block">Available for Matches</span>
            </div>

            {/* 2. Virtual Coins */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#E5E0D8] shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-[#7A7468]">
                <span>Study Coins</span>
                <Coins className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="text-xl sm:text-2xl font-bold font-serif text-[#AF601A]">
                {walletCoins.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-amber-700 font-semibold block">1000 Coins = ₹5 Cash</span>
            </div>

            {/* 3. Escrow Held */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#E5E0D8] shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-[#7A7468]">
                <span>In Escrow</span>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-xl sm:text-2xl font-bold font-serif text-blue-900">
                ₹{escrowCash.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-blue-700 font-semibold block">Held in Active Duels</span>
            </div>

            {/* 4. Total Duel Earnings */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#E5E0D8] shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-[#7A7468]">
                <span>Total Won</span>
                <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <div className="text-xl sm:text-2xl font-bold font-serif text-purple-900">
                ₹{totalEarningsCash.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-purple-700 font-semibold block">All-Time Duel Prizes</span>
            </div>
          </div>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E5E0D8] px-6 pt-3 gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`pb-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'deposit'
                ? 'border-[#5A634E] text-[#5A634E]'
                : 'border-transparent text-[#7A7468] hover:text-[#4A4A3A]'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Add Cash (UPI)</span>
          </button>

          <button
            onClick={() => setActiveTab('redeem')}
            className={`pb-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'redeem'
                ? 'border-[#5A634E] text-[#5A634E]'
                : 'border-transparent text-[#7A7468] hover:text-[#4A4A3A]'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Redeem Coins (1000 = ₹5)</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'border-[#5A634E] text-[#5A634E]'
                : 'border-transparent text-[#7A7468] hover:text-[#4A4A3A]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Passbook & History</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[420px]">
          {/* TAB 1: ADD CASH */}
          {activeTab === 'deposit' && (
            <form onSubmit={handleDeposit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#4A4A3A] mb-2">
                  Select Quick Recharge Amount (₹)
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {[20, 50, 100, 200].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt)}
                      className={`py-3 rounded-2xl border font-bold text-sm transition cursor-pointer ${
                        depositAmount === amt
                          ? 'border-[#5A634E] bg-[#5A634E] text-white shadow-xs'
                          : 'border-[#E5E0D8] bg-white text-[#4A4A3A] hover:bg-[#F5F2ED]'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <label className="block text-xs font-medium text-[#7A7468] mb-1">
                  Or enter custom deposit amount (INR):
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#7A7468]">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="10"
                    max="5000"
                    value={depositAmount || ''}
                    onChange={(e) => setDepositAmount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-2xl border border-[#E5E0D8] text-sm font-bold text-[#4A4A3A] focus:outline-hidden focus:ring-2 focus:ring-[#5A634E]"
                    placeholder="Enter amount (e.g. 50)"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-medium text-[#7A7468] mb-1.5">
                  Instant UPI Provider:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['GPay', 'PhonePe', 'Paytm', 'BHIM'] as const).map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => setUpiApp(app)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition text-center cursor-pointer ${
                        upiApp === app
                          ? 'border-[#5A634E] bg-[#5A634E]/10 text-[#5A634E] ring-1 ring-[#5A634E]'
                          : 'border-[#E5E0D8] bg-white text-[#7A7468] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      {app}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tiers Overview Reference Card */}
              <div className="p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#E5E0D8] space-y-2">
                <span className="text-xs font-bold text-[#4A4A3A] flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5 text-[#5A634E]" />
                  <span>How Battle Match Tiers Work:</span>
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2 rounded-xl bg-white border border-[#E5E0D8]">
                    <div className="font-bold text-amber-900">₹20 Entry</div>
                    <div className="text-emerald-700 font-extrabold">Win ₹30</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#E5E0D8]">
                    <div className="font-bold text-slate-800">₹40 Entry</div>
                    <div className="text-emerald-700 font-extrabold">Win ₹50</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#E5E0D8]">
                    <div className="font-bold text-yellow-900">₹60 Entry</div>
                    <div className="text-emerald-700 font-extrabold">Win ₹70</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#E5E0D8]">
                    <div className="font-bold text-purple-900">₹80 Entry</div>
                    <div className="text-emerald-700 font-extrabold">Win ₹90</div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || depositAmount <= 0}
                className="w-full py-3.5 rounded-2xl bg-[#5A634E] hover:bg-[#484F3E] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Recharge ₹{depositAmount} via {upiApp}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: REDEEM COINS TO CASH */}
          {activeTab === 'redeem' && (
            <form onSubmit={handleRedeemCoins} className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Coins className="w-4 h-4 text-amber-600" />
                  <span>Official Conversion Rate: 1,000 Coins = ₹5 Real Cash</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Coins earned by completing NCERT chapter quizzes, daily study streaks, and Free Practice duels can be directly transferred into your cash wallet.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#4A4A3A] mb-1.5">
                  <span>Coins to Redeem:</span>
                  <span className="text-[#AF601A] font-serif font-bold text-sm">
                    {coinsToRedeem.toLocaleString()} Coins
                  </span>
                </div>

                <input
                  type="range"
                  min="1000"
                  max={Math.max(1000, maxRedeemableCoins)}
                  step="1000"
                  disabled={walletCoins < 1000}
                  value={coinsToRedeem}
                  onChange={(e) => setCoinsToRedeem(parseInt(e.target.value) || 1000)}
                  className="w-full accent-[#5A634E] cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-[#7A7468] mt-1">
                  <span>Min: 1,000 Coins</span>
                  <span>Available: {walletCoins.toLocaleString()}</span>
                  <span>Max: {maxRedeemableCoins.toLocaleString()} Coins</span>
                </div>
              </div>

              {/* Conversion Preview Box */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#7A7468] block">You are converting:</span>
                  <span className="text-base font-bold text-[#AF601A]">
                    {coinsToRedeem.toLocaleString()} Coins
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-[#8B8374]" />
                <div className="text-right">
                  <span className="text-xs text-[#7A7468] block">You receive in Cash Wallet:</span>
                  <span className="text-lg font-bold text-emerald-700 font-serif">
                    +₹{cashEquivalent} INR
                  </span>
                </div>
              </div>

              {walletCoins < 1000 ? (
                <div className="p-3 rounded-2xl bg-stone-100 text-stone-600 text-xs text-center font-medium">
                  You need at least 1,000 coins to redeem. Play Free Practice matches or complete chapter quizzes to earn more!
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || coinsToRedeem > walletCoins}
                  className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      <span>Convert {coinsToRedeem.toLocaleString()} Coins to ₹{cashEquivalent}</span>
                    </>
                  )}
                </button>
              )}
            </form>
          )}

          {/* TAB 3: PASSBOOK & HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#7A7468] pb-1">
                <span>Recent Wallet Transactions & Escrow Holds</span>
                <button
                  onClick={fetchWallet}
                  className="text-[#5A634E] hover:underline font-bold flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh</span>
                </button>
              </div>

              {transactions.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#7A7468] bg-[#FDFBF7] rounded-2xl border border-[#E5E0D8]">
                  No transactions yet. Complete matches or recharge your wallet to start your ledger!
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions.map((txn) => {
                    const isCredit = txn.amountCash > 0 || txn.amountCoins > 0;
                    return (
                      <div
                        key={txn.id}
                        className="p-3 rounded-2xl bg-white border border-[#E5E0D8] shadow-2xs flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${
                              txn.type === 'deposit'
                                ? 'bg-emerald-100 text-emerald-700'
                                : txn.type === 'match_payout_win'
                                ? 'bg-amber-100 text-amber-800'
                                : txn.type === 'escrow_hold'
                                ? 'bg-blue-100 text-blue-800'
                                : txn.type === 'coin_redemption'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {isCredit ? (
                              <ArrowDownLeft className="w-4 h-4" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-[#4A4A3A]">{txn.description}</div>
                            <div className="text-[10px] text-[#7A7468] flex items-center gap-2 mt-0.5">
                              <span>{new Date(txn.createdAt).toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                              <span className="capitalize px-1.5 py-0.2 rounded-sm bg-[#F5F2ED] text-[9px] font-semibold text-[#5A634E]">
                                {txn.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          {txn.amountCash !== 0 && (
                            <div
                              className={`font-bold font-serif text-sm ${
                                txn.amountCash > 0 ? 'text-emerald-600' : 'text-stone-700'
                              }`}
                            >
                              {txn.amountCash > 0 ? `+₹${txn.amountCash}` : `-₹${Math.abs(txn.amountCash)}`}
                            </div>
                          )}
                          {txn.amountCoins !== 0 && (
                            <div
                              className={`text-[11px] font-bold ${
                                txn.amountCoins > 0 ? 'text-amber-600' : 'text-stone-500'
                              }`}
                            >
                              {txn.amountCoins > 0 ? `+${txn.amountCoins} Coins` : `${txn.amountCoins} Coins`}
                            </div>
                          )}
                          <span className="text-[9px] text-[#8B8374]">
                            Bal: ₹{txn.balanceCashAfter}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F5F2ED] border-t border-[#E5E0D8] flex items-center justify-between text-xs text-[#7A7468]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>256-Bit Escrow Vault Protected</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#E5E0D8] hover:bg-[#D5D0C8] text-[#4A4A3A] font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
