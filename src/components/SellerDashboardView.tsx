import React, { useState, useEffect } from 'react';
import {
  Store,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  TrendingUp,
  Percent,
  Wallet,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  AlertCircle,
  FileText,
  Building,
  CreditCard,
  X,
  Sparkles,
} from 'lucide-react';
import { User, MarketplaceItem, MarketplaceOrder, PayoutRecord } from '../types';
import { safeFetchJson } from '../utils/api';

interface SellerDashboardViewProps {
  currentUser: User;
  onRefreshUser: () => void;
  onOpenStorePreview?: () => void;
}

export const SellerDashboardView: React.FC<SellerDashboardViewProps> = ({
  currentUser,
  onRefreshUser,
  onOpenStorePreview,
}) => {
  const [loading, setLoading] = useState(true);
  const [sellerData, setSellerData] = useState<{
    seller: any;
    stats: any;
    items: MarketplaceItem[];
    orders: MarketplaceOrder[];
    payouts: PayoutRecord[];
  } | null>(null);

  // Modals
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // New Product Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Book' | 'Notes' | 'Sample Papers' | 'Stationery'>('Book');
  const [newPrice, setNewPrice] = useState('');
  const [newCondition, setNewCondition] = useState('Like New');
  const [newDesc, setNewDesc] = useState('');
  const [newClassLevel, setNewClassLevel] = useState('10');
  const [newSubject, setNewSubject] = useState('Science');

  // KYC Form
  const [panNumber, setPanNumber] = useState(currentUser.kycDetails?.panNumber || '');
  const [aadhaarLast4, setAadhaarLast4] = useState(currentUser.kycDetails?.aadhaarLast4 || '');
  const [businessName, setBusinessName] = useState(currentUser.kycDetails?.businessName || currentUser.name);
  const [bankAccountNo, setBankAccountNo] = useState(currentUser.kycDetails?.bankAccountNo || '');
  const [ifscCode, setIfscCode] = useState(currentUser.kycDetails?.ifscCode || '');
  const [upiVpa, setUpiVpa] = useState(currentUser.kycDetails?.upiVpa || '');

  // Withdrawal Form
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawDest, setWithdrawDest] = useState<'bank_account' | 'upi'>('bank_account');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const fetchSellerDashboard = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('learnx_token');
      const data = await safeFetchJson<any>('/api/seller/dashboard', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (data?.success) {
        setSellerData(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerDashboard();
  }, [currentUser]);

  // Update order delivery status
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/seller/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingNumber: `LX-EXP-${Date.now().toString().slice(-6)}` }),
      });
      const data = await res.json();
      if (data.success) {
        fetchSellerDashboard();
        setStatusNotice(`Order #${orderId} status updated to ${status}.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add new marketplace listing
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('learnx_token');
      const res = await fetch('/api/marketplace/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          price: Number(newPrice),
          condition: newCondition,
          description: newDesc,
          classLevel: Number(newClassLevel),
          subject: newSubject,
          location: 'Student Hub / Express Dispatch',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddProductModal(false);
        setNewTitle('');
        setNewPrice('');
        setNewDesc('');
        fetchSellerDashboard();
        setStatusNotice('Product listing published successfully!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit KYC for seller verification
  const handleSubmitKyc = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('learnx_token');
      const res = await fetch('/api/payouts/submit-kyc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          panNumber,
          aadhaarLast4,
          businessName,
          bankAccountNo,
          ifscCode,
          upiVpa,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowKycModal(false);
        onRefreshUser();
        fetchSellerDashboard();
        setStatusNotice('Bank & KYC submitted! Pending automatic verification.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Request payout withdrawal
  const handleWithdrawPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('learnx_token');
      const res = await fetch('/api/payouts/request-withdrawal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          amount: Number(withdrawAmount),
          destinationType: withdrawDest,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        onRefreshUser();
        fetchSellerDashboard();
        setStatusNotice(`Payout of ₹${data.payout.netPayoutAmount.toLocaleString('en-IN')} initiated! UTR: ${data.payout.utr}`);
      } else {
        setStatusNotice(`Withdrawal error: ${data.message || 'Request failed'}`);
      }
    } catch (err: any) {
      console.error(err);
      setStatusNotice(`Withdrawal error: ${err?.message || 'Failed to process withdrawal'}`);
    }
  };

  const payoutBalance = currentUser.payoutBalance || sellerData?.seller?.payoutBalance || 4250;
  const totalEarned = currentUser.totalEarned || sellerData?.seller?.totalEarned || 18500;
  const totalWithdrawn = currentUser.totalWithdrawn || sellerData?.seller?.totalWithdrawn || 14250;
  const kycStatus = currentUser.kycStatus || sellerData?.seller?.kycStatus || 'verified';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Notice */}
      {statusNotice && (
        <div className="p-3.5 rounded-2xl bg-[#EDF0E9] border border-[#D8DFD2] text-xs font-semibold text-[#5A634E] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{statusNotice}</span>
          </div>
          <button onClick={() => setStatusNotice(null)} className="text-[#8B8374] hover:text-[#4A4A3A]">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Profile & Quick Actions */}
      <div className="p-6 rounded-[32px] bg-white border border-[#E5E0D8] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FDEBD0] text-[#AF601A] flex items-center justify-center flex-shrink-0 border border-[#FAD7A0]">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#4A4A3A]">
                {currentUser.kycDetails?.businessName || currentUser.name}
              </h1>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  kycStatus === 'verified'
                    ? 'bg-[#D5F5E3] text-[#1D8348] border-[#ABEBC6]'
                    : kycStatus === 'pending_verification'
                    ? 'bg-[#FEF9E7] text-[#B7950B] border-[#F9E79F]'
                    : 'bg-[#F9EBEA] text-[#922B21] border-[#F5B7B1]'
                }`}
              >
                {kycStatus === 'verified' ? '✓ Verified Seller' : 'KYC Pending'}
              </span>
            </div>
            <p className="text-xs text-[#8B8374] mt-0.5">
              Merchant ID: LX-SELL-{currentUser.id.slice(-6)} • 15% Platform Commission Tier
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => setShowAddProductModal(true)}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-2xl bg-[#5A634E] text-white text-xs font-bold shadow-xs hover:bg-[#484F3E] transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>List New Book / Item</span>
          </button>

          <button
            onClick={() => setShowKycModal(true)}
            className="px-3.5 py-2.5 rounded-2xl border border-[#E5E0D8] bg-[#F5F2ED] text-[#4A4A3A] hover:bg-[#EBE7DF] text-xs font-semibold transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-[#5A634E]" />
            <span>KYC & Bank</span>
          </button>
        </div>
      </div>

      {/* Financial Metrics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Payout Balance */}
        <div className="p-5 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8B8374]">Available Balance</span>
            <div className="p-2 rounded-xl bg-[#EDF0E9] text-[#5A634E]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#4A4A3A]">
              ₹{payoutBalance.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-[#5A634E] font-medium mt-1 flex items-center gap-1">
              <span>Ready for settlement</span>
            </div>
          </div>
          <button
            onClick={() => setShowWithdrawModal(true)}
            disabled={payoutBalance <= 0}
            className="mt-4 w-full py-2 rounded-xl bg-[#5A634E] hover:bg-[#484F3E] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            <span>Withdraw Payout</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total Gross Sales */}
        <div className="p-5 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8B8374]">Gross Sales (GMV)</span>
            <div className="p-2 rounded-xl bg-[#F5F2ED] text-[#7A7468]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#4A4A3A]">
              ₹{totalEarned.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[#8B8374] mt-1">Total student textbook volume</p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E5E0D8] text-[11px] text-[#7A7468]">
            Lifetime Payouts: ₹{totalWithdrawn.toLocaleString('en-IN')}
          </div>
        </div>

        {/* 15% Platform Commission Breakdown */}
        <div className="p-5 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8B8374]">LearnX Fee (15%)</span>
            <div className="p-2 rounded-xl bg-[#FDEBD0] text-[#AF601A]">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#AF601A]">
              15% Flat
            </div>
            <p className="text-[11px] text-[#8B8374] mt-1">
              Deducted automatically on order delivery
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E5E0D8] text-[11px] text-[#5A634E] font-medium">
            You keep 85% net take-home earnings
          </div>
        </div>

        {/* Order Fulfillment Health */}
        <div className="p-5 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8B8374]">Active Orders</span>
            <div className="p-2 rounded-xl bg-[#D5F5E3] text-[#1D8348]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#4A4A3A]">
              {sellerData?.orders?.length || 2} Orders
            </div>
            <p className="text-[11px] text-[#8B8374] mt-1">
              Active student orders waiting fulfillment
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E5E0D8] text-[11px] text-[#1D8348] font-medium">
            {sellerData?.items?.length || 4} Active Catalog Listings
          </div>
        </div>
      </div>

      {/* Active Orders Table */}
      <div className="p-6 rounded-[32px] bg-white border border-[#E5E0D8] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A4A3A]">
              Student Orders & Fulfillment
            </h2>
            <p className="text-xs text-[#8B8374]">
              Manage order status, dispatch parcels, and verify automatic 85% payouts
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F5F2ED] text-[#5A634E]">
            {sellerData?.orders?.length || 0} Total Orders
          </span>
        </div>

        {sellerData?.orders && sellerData.orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E5E0D8] text-[#8B8374] uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Item Details</th>
                  <th className="py-3 px-3">Student Buyer</th>
                  <th className="py-3 px-3">Gross</th>
                  <th className="py-3 px-3">15% Fee</th>
                  <th className="py-3 px-3">Your Net (85%)</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D8]/60">
                {sellerData.orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FDFBF7] transition">
                    <td className="py-3.5 px-3 font-mono font-bold text-[#4A4A3A]">{ord.id}</td>
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-[#4A4A3A]">{ord.itemTitle}</div>
                      <span className="text-[10px] text-[#8B8374]">{ord.itemCategory}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-[#4A4A3A]">{ord.buyerName}</div>
                      <div className="text-[10px] text-[#8B8374]">{ord.buyerPhone || 'Delhi NCR'}</div>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-[#4A4A3A]">
                      ₹{ord.grossAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 text-red-600 font-medium">
                      -₹{ord.learnxCommission.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#1D8348]">
                      +₹{ord.sellerPayoutAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          ord.status === 'Delivered'
                            ? 'bg-[#D5F5E3] text-[#1D8348] border-[#ABEBC6]'
                            : ord.status === 'Dispatched'
                            ? 'bg-[#FEF9E7] text-[#B7950B] border-[#F9E79F]'
                            : 'bg-[#EDF0E9] text-[#5A634E] border-[#D8DFD2]'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {ord.status === 'Confirmed' ? (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'Dispatched')}
                          className="px-3 py-1 rounded-xl bg-[#5A634E] text-white text-[11px] font-semibold hover:bg-[#484F3E]"
                        >
                          Mark Dispatched
                        </button>
                      ) : ord.status === 'Dispatched' ? (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'Delivered')}
                          className="px-3 py-1 rounded-xl bg-[#1D8348] text-white text-[11px] font-semibold hover:bg-[#196F3D]"
                        >
                          Mark Delivered
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#8B8374]">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed border-[#E5E0D8] rounded-2xl bg-[#FDFBF7]">
            <Package className="w-8 h-8 text-[#8B8374] mx-auto mb-2" />
            <div className="text-sm font-semibold text-[#4A4A3A]">No orders received yet</div>
            <p className="text-xs text-[#8B8374] max-w-sm mx-auto mt-1">
              Add popular NCERT textbooks and stationery items to start getting student orders.
            </p>
          </div>
        )}
      </div>

      {/* Active Catalog & Inventory */}
      <div className="p-6 rounded-[32px] bg-white border border-[#E5E0D8] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A4A3A]">
              My Active Store Catalog
            </h2>
            <p className="text-xs text-[#8B8374]">Products currently visible to Class 6–12 students</p>
          </div>
          <button
            onClick={() => setShowAddProductModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EDF0E9] hover:bg-[#E2E7DC] text-xs font-semibold text-[#5A634E]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {sellerData?.items && sellerData.items.length > 0 ? (
            sellerData.items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-[#E5E0D8] bg-[#FDFBF7] hover:border-[#5A634E]/50 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white text-[#7A7468] border border-[#E5E0D8]">
                      {item.category}
                    </span>
                    <span className="text-xs font-bold text-[#1D8348]">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-[#4A4A3A] mt-2 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#7A7468] line-clamp-2 mt-1">{item.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5E0D8] flex items-center justify-between text-[11px] text-[#8B8374]">
                  <span>Condition: {item.condition}</span>
                  <span className="font-semibold text-[#5A634E]">
                    Net Payout: ₹{Math.round(item.price * 0.85)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-xs text-[#8B8374]">
              No products listed yet. Click 'List New Book / Item' to get started.
            </div>
          )}
        </div>
      </div>

      {/* Payout & Settlement History */}
      <div className="p-6 rounded-[32px] bg-white border border-[#E5E0D8] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A4A3A]">
              Payout Settlement History
            </h2>
            <p className="text-xs text-[#8B8374]">
              Transfers to verified bank account (IMPS / NEFT) and UPI
            </p>
          </div>
          <span className="text-xs text-[#5A634E] font-medium">85% Net Dispatched</span>
        </div>

        {sellerData?.payouts && sellerData.payouts.length > 0 ? (
          <div className="divide-y divide-[#E5E0D8]/60">
            {sellerData.payouts.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-mono font-bold text-[#4A4A3A]">{p.id}</div>
                  <div className="text-[11px] text-[#8B8374]">
                    Destination: {p.destinationDetail} • UTR: {p.utr}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#1D8348]">
                    +₹{p.netPayoutAmount.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] font-bold text-[#1D8348] uppercase tracking-wider">
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-[#8B8374] text-center py-4">
            No withdrawal requests logged yet. Use 'Withdraw Payout' to transfer funds.
          </div>
        )}
      </div>

      {/* MODAL 1: Add Product */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#FDFBF7] border border-[#E5E0D8] rounded-[32px] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#4A4A3A]">List New Product</h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="p-1.5 rounded-full bg-[#F5F2ED] text-[#7A7468]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">Product Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. NCERT Science Class 10 (Updated 2026)"
                  required
                  className="w-full px-3.5 py-2 rounded-2xl border border-[#E5E0D8] bg-white text-xs focus:outline-none focus:border-[#5A634E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-2xl border border-[#E5E0D8] bg-white text-xs focus:outline-none focus:border-[#5A634E]"
                  >
                    <option value="Book">Textbook</option>
                    <option value="Notes">Topper Notes</option>
                    <option value="Sample Papers">Sample Papers</option>
                    <option value="Stationery">Stationery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="e.g. 240"
                    required
                    className="w-full px-3.5 py-2 rounded-2xl border border-[#E5E0D8] bg-white text-xs focus:outline-none focus:border-[#5A634E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">Class</label>
                  <select
                    value={newClassLevel}
                    onChange={(e) => setNewClassLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-2xl border border-[#E5E0D8] bg-white text-xs"
                  >
                    {[6, 7, 8, 9, 10, 11, 12].map((lvl) => (
                      <option key={lvl} value={lvl}>Class {lvl}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">Condition</label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    className="w-full px-3 py-2 rounded-2xl border border-[#E5E0D8] bg-white text-xs"
                  >
                    <option value="New / Sealed">Brand New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good Condition">Good</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Details regarding edition, marks, condition, solutions..."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-2xl border border-[#E5E0D8] bg-white text-xs focus:outline-none focus:border-[#5A634E]"
                />
              </div>

              <div className="p-3 rounded-2xl bg-[#EDF0E9] border border-[#D8DFD2] text-[11px] text-[#5A634E]">
                <span>Payout breakdown: Price ₹{newPrice || 0} • LearnX 15% fee: ₹{Math.round((Number(newPrice) || 0) * 0.15)} • Your Net: ₹{Math.round((Number(newPrice) || 0) * 0.85)}</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#5A634E] text-white text-xs font-bold shadow-xs hover:bg-[#484F3E]"
              >
                Publish Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: KYC & Bank Details */}
      {showKycModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#FDFBF7] border border-[#E5E0D8] rounded-[32px] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#4A4A3A]">Seller KYC & Bank Account</h3>
                <p className="text-xs text-[#8B8374]">Required for automated 85% payouts</p>
              </div>
              <button onClick={() => setShowKycModal(false)} className="p-1.5 rounded-full bg-[#F5F2ED]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitKyc} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">Business / Store Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-2xl border border-[#E5E0D8] bg-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">PAN Number</label>
                  <input
                    type="text"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    required
                    className="w-full px-3.5 py-2 rounded-2xl border border-[#E5E0D8] bg-white text-xs uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">Aadhaar (Last 4 digits)</label>
                  <input
                    type="text"
                    value={aadhaarLast4}
                    onChange={(e) => setAadhaarLast4(e.target.value.slice(0, 4))}
                    placeholder="8821"
                    maxLength={4}
                    className="w-full px-3.5 py-2 rounded-2xl border border-[#E5E0D8] bg-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">Bank Account Number</label>
                <input
                  type="text"
                  value={bankAccountNo}
                  onChange={(e) => setBankAccountNo(e.target.value)}
                  placeholder="Enter Bank Account"
                  required
                  className="w-full px-3.5 py-2 rounded-2xl border border-[#E5E0D8] bg-white text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    placeholder="HDFC0000123"
                    required
                    className="w-full px-3.5 py-2 rounded-2xl border border-[#E5E0D8] bg-white text-xs uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">UPI VPA (Optional)</label>
                  <input
                    type="text"
                    value={upiVpa}
                    onChange={(e) => setUpiVpa(e.target.value)}
                    placeholder="seller@okhdfcbank"
                    className="w-full px-3.5 py-2 rounded-2xl border border-[#E5E0D8] bg-white text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#5A634E] text-white text-xs font-bold hover:bg-[#484F3E]"
              >
                Submit Bank & KYC Verification
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Withdraw Payout */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FDFBF7] border border-[#E5E0D8] rounded-[32px] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#4A4A3A]">Withdraw Payout Earnings</h3>
              <button onClick={() => setShowWithdrawModal(false)} className="p-1.5 rounded-full bg-[#F5F2ED]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleWithdrawPayout} className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-[#E5E0D8]">
                <div className="text-xs text-[#8B8374]">Available Payout Balance</div>
                <div className="text-2xl font-serif font-bold text-[#5A634E] mt-1">
                  ₹{payoutBalance.toLocaleString('en-IN')}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">Withdrawal Amount (₹)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  max={payoutBalance}
                  placeholder={`Max ₹${payoutBalance}`}
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E5E0D8] bg-white text-sm font-bold text-[#4A4A3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A4A3A] mb-1.5">Settlement Method</label>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setWithdrawDest('bank_account')}
                    className={`py-2 px-3 rounded-xl border text-center transition ${
                      withdrawDest === 'bank_account'
                        ? 'bg-[#5A634E] text-white border-[#5A634E]'
                        : 'bg-white border-[#E5E0D8] text-[#4A4A3A]'
                    }`}
                  >
                    Bank IMPS / NEFT
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawDest('upi')}
                    className={`py-2 px-3 rounded-xl border text-center transition ${
                      withdrawDest === 'upi'
                        ? 'bg-[#5A634E] text-white border-[#5A634E]'
                        : 'bg-white border-[#E5E0D8] text-[#4A4A3A]'
                    }`}
                  >
                    Instant UPI
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#5A634E] text-white text-xs font-bold hover:bg-[#484F3E]"
              >
                Confirm Instant Transfer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
