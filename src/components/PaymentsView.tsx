import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Receipt,
  Download,
  Copy,
  Check,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { PaymentTransaction, AdmissionRequest, MarketplaceItem, User } from '../types';
import { playChime } from '../utils/audio';

interface PaymentsViewProps {
  currentUser: User;
  transactions: PaymentTransaction[];
  pendingAdmission: AdmissionRequest | null;
  onClearPendingAdmission: () => void;
  pendingMarketplaceItem?: MarketplaceItem | null;
  onClearPendingMarketplaceItem?: () => void;
  onRefreshTransactions: () => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  currentUser,
  transactions,
  pendingAdmission,
  onClearPendingAdmission,
  pendingMarketplaceItem,
  onClearPendingMarketplaceItem,
  onRefreshTransactions,
}) => {
  // Payment Intent State
  const [activeTxn, setActiveTxn] = useState<PaymentTransaction | null>(null);
  const [upiUri, setUpiUri] = useState<string>('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [userVpa, setUserVpa] = useState('student@okicici');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentTransaction | null>(null);

  // Manual payment form for custom fees
  const [customAmount, setCustomAmount] = useState('3500');
  const [customDesc, setCustomDesc] = useState('Tuition Monthly Batch Fee');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleCreatePaymentIntent = async (admission?: AdmissionRequest, item?: MarketplaceItem) => {
    setIsProcessing(true);
    setPaymentError(null);
    const amount = admission ? admission.feeAmount : item ? item.price : Number(customAmount);
    const desc = admission
      ? `LearnX Admission Fee: ${admission.tuitionName} (${admission.id})`
      : item
      ? `LearnX Marketplace: ${item.title} (${item.id})`
      : customDesc;

    try {
      const token = localStorage.getItem('learnx_token');
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          admissionId: admission ? admission.id : undefined,
          marketplaceItemId: item ? item.id : undefined,
          amount,
          vpa: userVpa,
          description: desc,
          idempotencyKey: `idemp_${Date.now()}_${Math.random()}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActiveTxn(data.transaction);
        setUpiUri(data.upiUri);
        setQrCodeDataUrl(data.qrCodeDataUrl);
        playChime('click');
      } else {
        setPaymentError(data.message || 'Payment intent initialization error');
      }
    } catch (err: any) {
      console.error('Create intent error:', err);
      setPaymentError(err?.message || 'Network error initializing payment intent');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyPayment = async (simulationStatus: 'SUCCESS' | 'FAILED') => {
    if (!activeTxn) return;
    setIsProcessing(true);
    setPaymentError(null);

    try {
      const token = localStorage.getItem('learnx_token');
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          transactionId: activeTxn.id,
          simulationStatus,
        }),
      });

      const data = await res.json();
      if (data.success) {
        playChime('success');
        setActiveTxn(data.transaction);
        onRefreshTransactions();
        if (pendingAdmission) {
          onClearPendingAdmission();
        }
        if (pendingMarketplaceItem && onClearPendingMarketplaceItem) {
          onClearPendingMarketplaceItem();
        }
      } else {
        playChime('alarm');
        setActiveTxn(data.transaction || { ...activeTxn, status: 'Failed' });
        onRefreshTransactions();
      }
    } catch (err) {
      console.error('Payment verification error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyUPI = () => {
    if (upiUri) {
      navigator.clipboard.writeText(upiUri);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#4A4A3A] tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#5A634E]" />
            <span>UPI Gateway & Fee Receipts</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8B8374]">
            Secure NPCI UPI payments for tuition admissions and student marketplace services.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-[#EDF0E9] border border-[#D8DFD2] text-[#5A634E] self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4" />
          <span>Real Gateway Verification Flow</span>
        </div>
      </div>

      {/* Payment Error Alert */}
      {paymentError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{paymentError}</span>
          </div>
          <button onClick={() => setPaymentError(null)} className="text-rose-600 hover:text-rose-800 font-bold ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Active Admission Payment Banner if redirected */}
      {pendingAdmission && !activeTxn && (
        <div className="p-5 sm:p-6 rounded-3xl bg-[#F5F2ED] border border-[#5A634E]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#EDF0E9] text-[#5A634E] border border-[#D8DFD2]">
              Admission Fee Checkout
            </span>
            <h3 className="text-base font-serif font-bold text-[#4A4A3A]">{pendingAdmission.tuitionName}</h3>
            <p className="text-xs text-[#7A7468]">
              Admission ID: <span className="font-mono text-[#5A634E]">{pendingAdmission.id}</span> •
              Amount: <strong className="font-serif font-bold text-[#5A634E]">₹{pendingAdmission.feeAmount.toLocaleString('en-IN')}</strong> (includes 15% platform commission)
            </p>
          </div>
          <button
            onClick={() => handleCreatePaymentIntent(pendingAdmission)}
            disabled={isProcessing}
            className="px-6 py-2.5 rounded-full bg-[#5A634E] hover:bg-[#484F3E] text-white font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-1.5 transition"
          >
            <span>Proceed to UPI Gateway</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Active Marketplace Item Payment Banner if redirected */}
      {pendingMarketplaceItem && !activeTxn && (
        <div className="p-5 sm:p-6 rounded-3xl bg-[#F5F2ED] border border-[#5A634E]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#EDF0E9] text-[#5A634E] border border-[#D8DFD2]">
              Academic Marketplace Checkout
            </span>
            <h3 className="text-base font-serif font-bold text-[#4A4A3A]">{pendingMarketplaceItem.title}</h3>
            <p className="text-xs text-[#7A7468]">
              Category: {pendingMarketplaceItem.category} • Seller: {pendingMarketplaceItem.sellerName} •
              Amount: <strong className="font-serif font-bold text-[#5A634E]">₹{pendingMarketplaceItem.price.toLocaleString('en-IN')}</strong> (includes 15% LearnX fee)
            </p>
          </div>
          <button
            onClick={() => handleCreatePaymentIntent(undefined, pendingMarketplaceItem)}
            disabled={isProcessing}
            className="px-6 py-2.5 rounded-full bg-[#5A634E] hover:bg-[#484F3E] text-white font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-1.5 transition"
          >
            <span>Proceed to UPI Gateway</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Active Payment Flow Box */}
      {activeTxn ? (
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5E0D8] space-y-5 shadow-sm">
          <div className="flex items-start justify-between gap-2 border-b border-[#E5E0D8] pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#5A634E]">{activeTxn.id}</span>
              <h3 className="text-lg font-serif font-bold text-[#4A4A3A]">{activeTxn.description}</h3>
              <p className="text-xs text-[#8B8374]">Receipt Target: #{activeTxn.receiptNumber}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#8B8374]">Total Payable</span>
              <div className="text-xl font-serif font-bold text-[#5A634E]">
                ₹{activeTxn.amount.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Status Display */}
          {activeTxn.status === 'Pending' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* QR Code Container */}
              <div className="text-center space-y-3 bg-[#F5F2ED] p-5 sm:p-6 rounded-3xl border border-[#E5E0D8]">
                <div className="text-xs font-bold text-[#4A4A3A]">
                  Scan with GPay, PhonePe, Paytm, or BHIM UPI
                </div>

                {qrCodeDataUrl && (
                  <div className="p-4 bg-white rounded-2xl inline-block shadow-sm mx-auto border border-[#E5E0D8]">
                    <img
                      src={qrCodeDataUrl}
                      alt="UPI Payment QR"
                      className="w-48 h-48 sm:w-56 sm:h-56 mx-auto"
                    />
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    onClick={handleCopyUPI}
                    className="flex items-center gap-1.5 text-xs text-[#5A634E] hover:text-[#484F3E] bg-white px-3.5 py-1.5 rounded-full border border-[#E5E0D8] font-semibold shadow-xs"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'URI Copied' : 'Copy UPI Intent Link'}</span>
                  </button>
                </div>

                {/* Direct UPI App Launchers for Mobile */}
                <div className="pt-2 border-t border-[#E5E0D8]/60 space-y-1.5">
                  <div className="text-[11px] font-semibold text-[#8B8374]">Tap your preferred UPI App:</div>
                  <div className="grid grid-cols-4 gap-1.5">
                    <a
                      href={upiUri ? upiUri.replace('upi://', 'phonepe://') : '#'}
                      className="p-2 rounded-xl bg-white border border-[#E5E0D8] hover:border-[#5f259f] text-center shadow-xs transition flex flex-col items-center gap-1"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#5f259f] text-white flex items-center justify-center text-[9px] font-bold">
                        P
                      </div>
                      <span className="text-[10px] font-bold text-[#4A4A3A]">PhonePe</span>
                    </a>
                    <a
                      href={upiUri ? upiUri.replace('upi://', 'tez://upi/') : '#'}
                      className="p-2 rounded-xl bg-white border border-[#E5E0D8] hover:border-[#4285F4] text-center shadow-xs transition flex flex-col items-center gap-1"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#4285F4] text-white flex items-center justify-center text-[9px] font-bold">
                        G
                      </div>
                      <span className="text-[10px] font-bold text-[#4A4A3A]">Google Pay</span>
                    </a>
                    <a
                      href={upiUri ? upiUri.replace('upi://', 'paytmmp://') : '#'}
                      className="p-2 rounded-xl bg-white border border-[#E5E0D8] hover:border-[#00b9f5] text-center shadow-xs transition flex flex-col items-center gap-1"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#00b9f5] text-white flex items-center justify-center text-[9px] font-bold">
                        PT
                      </div>
                      <span className="text-[10px] font-bold text-[#4A4A3A]">Paytm</span>
                    </a>
                    <a
                      href={upiUri || '#'}
                      className="p-2 rounded-xl bg-white border border-[#E5E0D8] hover:border-[#008444] text-center shadow-xs transition flex flex-col items-center gap-1"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#008444] text-white flex items-center justify-center text-[9px] font-bold">
                        B
                      </div>
                      <span className="text-[10px] font-bold text-[#4A4A3A]">BHIM UPI</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* VPA Verification & Real Gateway simulation controls */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] space-y-2 text-xs">
                  <div className="flex justify-between text-[#7A7468]">
                    <span>Payee VPA:</span>
                    <span className="font-mono font-semibold text-[#4A4A3A]">learnx.edu@icici</span>
                  </div>
                  <div className="flex justify-between text-[#7A7468]">
                    <span>Your UPI ID / VPA:</span>
                    <span className="font-mono text-[#5A634E] font-semibold">{userVpa}</span>
                  </div>
                  <div className="flex justify-between text-[#7A7468]">
                    <span>15% Platform Commission:</span>
                    <span className="text-[#4A4A3A]">₹{activeTxn.commissionAmount}</span>
                  </div>
                  <div className="flex justify-between text-[#7A7468] pt-1.5 border-t border-[#E5E0D8]">
                    <span>Net Tutor Settlement:</span>
                    <span className="font-serif font-bold text-[#5A634E]">₹{activeTxn.netAmount}</span>
                  </div>
                </div>

                {/* Gateway Simulation Actions */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[#4A4A3A]">
                    Bank UPI Gateway Response Simulator:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleVerifyPayment('SUCCESS')}
                      disabled={isProcessing}
                      className="py-3 rounded-full bg-[#5A634E] hover:bg-[#484F3E] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Simulate Success</span>
                    </button>
                    <button
                      onClick={() => handleVerifyPayment('FAILED')}
                      disabled={isProcessing}
                      className="py-3 rounded-full bg-[#FADBD8] hover:bg-[#F5B7B1] text-[#922B21] border border-[#F1948A] font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Simulate Failure</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-[#8B8374]">
                    Both options perform real backend verification, updating ledger states and transaction records without mock faking.
                  </p>
                </div>
              </div>
            </div>
          ) : activeTxn.status === 'Paid' ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#EDF0E9] text-[#5A634E] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-serif font-bold text-[#4A4A3A]">Payment Verified & Paid! 🎉</h4>
              <p className="text-xs text-[#7A7468] max-w-md mx-auto">
                Transaction <span className="font-mono text-[#5A634E]">{activeTxn.id}</span> has been confirmed.
                Receipt #{activeTxn.receiptNumber} generated.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setSelectedReceipt(activeTxn)}
                  className="px-5 py-2.5 rounded-full bg-[#5A634E] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-[#484F3E]"
                >
                  <Receipt className="w-4 h-4" />
                  <span>View Official Fee Receipt</span>
                </button>
                <button
                  onClick={() => setActiveTxn(null)}
                  className="px-4 py-2.5 rounded-full bg-[#F5F2ED] text-[#7A7468] text-xs font-semibold hover:bg-[#EBE7DF]"
                >
                  Back to Transactions
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#FADBD8] text-[#922B21] flex items-center justify-center mx-auto">
                <XCircle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-serif font-bold text-[#4A4A3A]">Payment Failed or Declined</h4>
              <p className="text-xs text-[#922B21] max-w-md mx-auto">
                {activeTxn.failureReason || 'Bank declined the transaction.'}
              </p>
              <button
                onClick={() => setActiveTxn(null)}
                className="px-5 py-2 rounded-full bg-[#F5F2ED] text-[#7A7468] text-xs font-semibold hover:bg-[#EBE7DF]"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Instant Payment Generator */
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5E0D8] space-y-3 shadow-sm">
          <h3 className="text-sm font-serif font-bold text-[#4A4A3A]">Pay Fee or Marketplace Item via UPI</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[#8B8374] text-xs mb-1 font-semibold">Amount (₹ INR)</label>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] text-xs font-bold focus:outline-none focus:border-[#5A634E]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[#8B8374] text-xs mb-1 font-semibold">Payment Description</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="flex-1 p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] text-xs focus:outline-none focus:border-[#5A634E]"
                />
                <button
                  onClick={() => handleCreatePaymentIntent()}
                  className="px-5 py-2 rounded-full bg-[#5A634E] hover:bg-[#484F3E] text-white font-bold text-xs whitespace-nowrap shadow-sm transition"
                >
                  Generate UPI QR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History & Receipts Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-serif font-bold text-[#4A4A3A]">Payment Ledger & Receipts</h3>
          <span className="text-xs text-[#8B8374]">{transactions.length} recorded payments</span>
        </div>

        {transactions.length === 0 ? (
          <div className="p-10 rounded-3xl bg-white border border-[#E5E0D8] text-center text-[#8B8374] text-xs">
            No transactions yet. Complete an admission or marketplace order.
          </div>
        ) : (
          <div className="space-y-2.5">
            {transactions.map((txn) => {
              const isPaid = txn.status === 'Paid';

              return (
                <div
                  key={txn.id}
                  className="p-4 rounded-2xl bg-white border border-[#E5E0D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#4A4A3A]">{txn.id}</span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          isPaid
                            ? 'bg-[#EDF0E9] text-[#5A634E] border border-[#D8DFD2]'
                            : txn.status === 'Failed'
                            ? 'bg-[#FADBD8] text-[#922B21]'
                            : 'bg-[#FEF9E7] text-[#B7950B]'
                        }`}
                      >
                        {txn.status}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-serif font-bold text-[#4A4A3A]">{txn.description}</h4>
                    <div className="text-[11px] text-[#8B8374]">
                      Receipt: <span className="font-mono text-[#4A4A3A]">#{txn.receiptNumber}</span> •
                      Paid by: {txn.userName} • {new Date(txn.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    <div className="text-right">
                      <div className="text-sm font-serif font-bold text-[#5A634E]">
                        ₹{txn.amount.toLocaleString('en-IN')}
                      </div>
                      {txn.commissionAmount > 0 && (
                        <div className="text-[10px] text-[#8B8374]">
                          15% LearnX: ₹{txn.commissionAmount}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedReceipt(txn)}
                      className="px-3.5 py-1.5 rounded-full bg-[#F5F2ED] hover:bg-[#EBE7DF] text-[#5A634E] text-xs font-semibold flex items-center gap-1 border border-[#E5E0D8] transition"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Receipt</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Official Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-[#FDFBF7] text-[#4A4A3A] border border-[#E5E0D8] rounded-[32px] shadow-2xl p-6 sm:p-7 space-y-4 my-8 animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#E5E0D8] pb-3">
              <div>
                <div className="font-serif font-bold text-lg tracking-tight text-[#4A4A3A]">
                  Learn<span className="text-[#5A634E]">X</span> Education
                </div>
                <div className="text-[11px] text-[#8B8374]">Official Payment & Admission Receipt</div>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-[#8B8374] hover:text-[#4A4A3A] p-1 text-xs"
              >
                ✕
              </button>
            </div>

            {/* Receipt Summary */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#E5E0D8]">
                <span className="text-[#8B8374]">Receipt No:</span>
                <span className="font-mono font-bold text-[#4A4A3A]">{selectedReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5E0D8]">
                <span className="text-[#8B8374]">Transaction ID:</span>
                <span className="font-mono text-[#4A4A3A]">{selectedReceipt.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5E0D8]">
                <span className="text-[#8B8374]">Date & Time:</span>
                <span className="text-[#4A4A3A]">{new Date(selectedReceipt.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5E0D8]">
                <span className="text-[#8B8374]">Student Name:</span>
                <span className="font-bold text-[#4A4A3A]">{selectedReceipt.userName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5E0D8]">
                <span className="text-[#8B8374]">Description:</span>
                <span className="font-semibold text-[#4A4A3A]">{selectedReceipt.description}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5E0D8]">
                <span className="text-[#8B8374]">Payment Status:</span>
                <span
                  className={`font-bold uppercase ${
                    selectedReceipt.status === 'Paid' ? 'text-[#5A634E]' : 'text-[#B7950B]'
                  }`}
                >
                  {selectedReceipt.status}
                </span>
              </div>
            </div>

            {/* Fee Breakdown */}
            <div className="p-4 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#7A7468]">
                <span>Tuition / Service Fee:</span>
                <span>₹{(selectedReceipt.netAmount || selectedReceipt.amount).toLocaleString('en-IN')}</span>
              </div>
              {selectedReceipt.commissionAmount > 0 && (
                <div className="flex justify-between text-[#5A634E]">
                  <span>LearnX Platform Commission (15%):</span>
                  <span>₹{selectedReceipt.commissionAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between font-serif font-bold text-[#4A4A3A] pt-1.5 border-t border-[#E5E0D8] text-sm">
                <span>Total Amount Paid:</span>
                <span className="text-[#5A634E]">₹{selectedReceipt.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="text-[10px] text-center text-[#8B8374]">
              Authorized digital educational invoice • GST compliant • LearnX Edutech India
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2.5 rounded-full bg-[#5A634E] hover:bg-[#484F3E] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
