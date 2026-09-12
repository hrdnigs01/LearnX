import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Building2,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Cpu,
  Terminal,
  Activity,
  Play,
  Loader2,
} from 'lucide-react';
import { User, TuitionProfile, AdmissionRequest, PaymentTransaction, MarketplaceItem, AiDiagnosticStatus } from '../types';
import { playChime } from '../utils/audio';
import { safeFetchJson } from '../utils/api';
import { AdminFeedbackDashboard } from './AdminFeedbackDashboard';

interface AdminPanelViewProps {
  currentUser: User;
  onRefreshAll: () => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({ currentUser, onRefreshAll }) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'feedback' | 'ai-status' | 'admissions' | 'tuitions' | 'marketplace' | 'transactions'>('overview');
  const [admissions, setAdmissions] = useState<AdmissionRequest[]>([]);
  const [tuitions, setTuitions] = useState<TuitionProfile[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [marketplace, setMarketplace] = useState<MarketplaceItem[]>([]);
  const [aiStatus, setAiStatus] = useState<AiDiagnosticStatus | null>(null);
  const [aiProbeResult, setAiProbeResult] = useState<any>(null);
  const [isProbing, setIsProbing] = useState(false);
  const [testQuestionRunning, setTestQuestionRunning] = useState<string | null>(null);
  const [testQuestionAnswer, setTestQuestionAnswer] = useState<{ q: string; a: string; sources?: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refundModalTx, setRefundModalTx] = useState<PaymentTransaction | null>(null);
  const [refundReason, setRefundReason] = useState('Parent requested cancellation');
  const [deleteMarketplaceId, setDeleteMarketplaceId] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [mRes, aRes, tRes, txRes, mkRes, aiRes] = await Promise.all([
        safeFetchJson<any>('/api/admin/metrics'),
        safeFetchJson<any>('/api/tuition/admissions/list'),
        safeFetchJson<any>('/api/tuition/all'),
        safeFetchJson<any>('/api/payments/transactions'),
        safeFetchJson<any>('/api/marketplace/items'),
        safeFetchJson<any>('/api/admin/ai-status'),
      ]);

      if (mRes?.success) setMetrics(mRes.metrics);
      if (aRes?.success) setAdmissions(aRes.admissions);
      if (tRes?.success) setTuitions(tRes.tuitions);
      if (txRes?.success) setTransactions(txRes.payments);
      if (mkRes?.success) setMarketplace(mkRes.items);
      if (aiRes?.success) setAiStatus(aiRes.status);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunAiProbe = async () => {
    setIsProbing(true);
    setAiProbeResult(null);
    try {
      const res = await fetch('/api/admin/ai-test', { method: 'POST' });
      const data = await res.json();
      setAiProbeResult(data);
      if (data.result?.diagnostics) {
        setAiStatus(data.result.diagnostics);
      }
      playChime('click');
    } catch (err: any) {
      setAiProbeResult({ success: false, error: err.message || String(err) });
    } finally {
      setIsProbing(false);
    }
  };

  const handleRunQuestionTest = async (q: string) => {
    setTestQuestionRunning(q);
    setTestQuestionAnswer(null);
    try {
      const res = await fetch('/api/ai/doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, classLevel: 8 }),
      });
      const data = await res.json();
      if (data.success) {
        setTestQuestionAnswer({ q, a: data.answer, sources: data.sources });
      } else {
        setTestQuestionAnswer({ q, a: `Error: ${data.message || 'Failed to generate answer'}` });
      }
      // Refresh AI status to get latest counts
      const statusRes = await safeFetchJson<any>('/api/admin/ai-status');
      if (statusRes?.success) setAiStatus(statusRes.status);
    } catch (err: any) {
      setTestQuestionAnswer({ q, a: `Network Exception: ${err.message || String(err)}` });
    } finally {
      setTestQuestionRunning(null);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateAdmission = async (id: string, status: 'Accepted' | 'Rejected' | 'Enrolled') => {
    try {
      await fetch(`/api/tuition/admissions/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      playChime('click');
      fetchAdminData();
      onRefreshAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefundTransaction = async (id: string, reason: string) => {
    if (!reason.trim()) return;

    try {
      const token = localStorage.getItem('learnx_token');
      await fetch('/api/payments/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ transactionId: id, reason }),
      });
      playChime('badge');
      setRefundModalTx(null);
      fetchAdminData();
      onRefreshAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMarketplace = async (id: string) => {
    try {
      const token = localStorage.getItem('learnx_token');
      await fetch(`/api/marketplace/items/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      playChime('click');
      setDeleteMarketplaceId(null);
      fetchAdminData();
      onRefreshAll();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#4A4A3A] tracking-tight flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#5A634E]" />
            <span>LearnX Central Platform Administration</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8B8374]">
            Real-time control over users, admissions, 15% platform commission pool, and marketplace.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2 rounded-full bg-[#F5F2ED] hover:bg-[#EBE7DF] border border-[#E5E0D8] text-[#4A4A3A] text-xs font-semibold transition flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#5A634E]" />
          <span>Sync Real Data</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      {metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-5 rounded-3xl bg-white border border-[#E5E0D8] space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#8B8374]">
              <span>Platform Revenue</span>
              <DollarSign className="w-4 h-4 text-[#5A634E]" />
            </div>
            <div className="text-xl sm:text-2xl font-serif font-bold text-[#4A4A3A]">
              ₹{metrics.totalRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-[#5A634E] font-semibold">
              ₹{metrics.totalCommissions.toLocaleString('en-IN')} (15% Commission Pool)
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#E5E0D8] space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#8B8374]">
              <span>Admissions</span>
              <TrendingUp className="w-4 h-4 text-[#5A634E]" />
            </div>
            <div className="text-xl sm:text-2xl font-serif font-bold text-[#4A4A3A]">
              {metrics.totalAdmissions} Total
            </div>
            <div className="text-[11px] text-[#5A634E] font-semibold">
              {metrics.enrolledAdmissions} Paid & Enrolled
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#E5E0D8] space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#8B8374]">
              <span>Tutors & Centres</span>
              <Building2 className="w-4 h-4 text-[#5A634E]" />
            </div>
            <div className="text-xl sm:text-2xl font-serif font-bold text-[#4A4A3A]">
              {metrics.totalCentres + metrics.totalTutors} Active
            </div>
            <div className="text-[11px] text-[#7A7468] font-semibold">
              {metrics.totalCentres} Coaching Hubs • {metrics.totalTutors} Tutors
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#E5E0D8] space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#8B8374]">
              <span>Active Students</span>
              <Users className="w-4 h-4 text-[#5A634E]" />
            </div>
            <div className="text-xl sm:text-2xl font-serif font-bold text-[#4A4A3A]">
              {metrics.totalStudents}
            </div>
            <div className="text-[11px] text-[#7A7468] font-semibold">
              {metrics.marketplaceListings} Marketplace Listings
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'overview', label: 'Admissions Oversight' },
          { id: 'feedback', label: 'Feedback & Issue Reports' },
          { id: 'ai-status', label: 'AI System & Diagnostics' },
          { id: 'tuitions', label: 'Tutors & Centres' },
          { id: 'transactions', label: 'UPI Payments & Refunds' },
          { id: 'marketplace', label: 'Marketplace Moderation' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition border flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-[#5A634E] text-white border-[#5A634E] shadow-xs'
                : 'bg-white text-[#7A7468] border-[#E5E0D8] hover:bg-[#F5F2ED]'
            }`}
          >
            {tab.id === 'ai-status' && <Cpu className="w-3.5 h-3.5" />}
            {tab.id === 'feedback' && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab: User Feedback & Content Issues */}
      {activeTab === 'feedback' && (
        <AdminFeedbackDashboard />
      )}

      {/* Tab 1: Admissions Oversight */}
      {activeTab === 'overview' && (
        <div className="space-y-3">
          <h3 className="text-sm font-serif font-bold text-[#4A4A3A]">All Platform Admission Applications</h3>
          <div className="space-y-2">
            {admissions.map((adm) => (
              <div
                key={adm.id}
                className="p-4 rounded-2xl bg-white border border-[#E5E0D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#5A634E]">{adm.id}</span>
                    <span className="text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full bg-[#F5F2ED] text-[#7A7468] border border-[#E5E0D8]">
                      {adm.status}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-serif font-bold text-[#4A4A3A] mt-1">
                    {adm.studentName} → {adm.tuitionName}
                  </h4>
                  <div className="text-[11px] text-[#8B8374]">
                    Phone: {adm.studentPhone} • Fee: ₹{adm.feeAmount} • 15% Comm: ₹{adm.commissionAmount}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateAdmission(adm.id, 'Accepted')}
                    className="px-3 py-1 rounded-full bg-[#EDF0E9] hover:bg-[#D8DFD2] text-[#5A634E] text-xs font-semibold"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleUpdateAdmission(adm.id, 'Rejected')}
                    className="px-3 py-1 rounded-full bg-[#FADBD8] hover:bg-[#F5B7B1] text-[#922B21] text-xs font-semibold"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleUpdateAdmission(adm.id, 'Enrolled')}
                    className="px-3 py-1 rounded-full bg-[#5A634E] hover:bg-[#484F3E] text-white text-xs font-semibold shadow-xs"
                  >
                    Mark Enrolled
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Tuitions */}
      {activeTab === 'tuitions' && (
        <div className="space-y-3">
          <h3 className="text-sm font-serif font-bold text-[#4A4A3A]">Registered Tutors & Coaching Centres</h3>
          <div className="space-y-2">
            {tuitions.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-white border border-[#E5E0D8] flex items-center justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-serif font-bold text-[#4A4A3A]">{t.name}</span>
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F5F2ED] text-[#7A7468] uppercase border border-[#E5E0D8]">
                      {t.type}
                    </span>
                    {t.verified && (
                      <span className="text-[10px] text-[#5A634E] font-semibold bg-[#EDF0E9] border border-[#D8DFD2] px-2.5 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#8B8374] mt-0.5">
                    {t.location} • ₹{t.fees}/mo • {t.availableSeats} of {t.totalSeats} seats available
                  </div>
                </div>
                <div className="text-xs font-bold text-[#5A634E]">★ {t.rating}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Transactions */}
      {activeTab === 'transactions' && (
        <div className="space-y-3">
          <h3 className="text-sm font-serif font-bold text-[#4A4A3A]">All Platform Transactions & Refund Control</h3>
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 rounded-2xl bg-white border border-[#E5E0D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#4A4A3A]">{tx.id}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        tx.status === 'Paid'
                          ? 'bg-[#EDF0E9] text-[#5A634E] border border-[#D8DFD2]'
                          : tx.status === 'Refunded'
                          ? 'bg-[#F5EEF8] text-[#7D3C98]'
                          : 'bg-[#FADBD8] text-[#922B21]'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                  <div className="text-xs font-serif font-bold text-[#4A4A3A] mt-1">{tx.description}</div>
                  <div className="text-[11px] text-[#8B8374]">
                    Paid by: {tx.userName} ({tx.vpa}) • Total: ₹{tx.amount} (Net: ₹{tx.netAmount}, 15% Comm: ₹{tx.commissionAmount})
                  </div>
                </div>

                {tx.status === 'Paid' && (
                  <button
                    onClick={() => {
                      setRefundModalTx(tx);
                      setRefundReason('Parent requested cancellation');
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-[#F5EEF8] hover:bg-[#EBDEF0] text-[#7D3C98] text-xs font-semibold transition"
                  >
                    Issue Refund
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Marketplace */}
      {activeTab === 'marketplace' && (
        <div className="space-y-3">
          <h3 className="text-sm font-serif font-bold text-[#4A4A3A]">Marketplace Content Moderation</h3>
          <div className="space-y-2">
            {marketplace.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-white border border-[#E5E0D8] flex items-center justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="text-xs sm:text-sm font-serif font-bold text-[#4A4A3A]">{m.title}</div>
                  <div className="text-[11px] text-[#8B8374]">
                    Category: {m.category} • Seller: {m.sellerName} • Price: {m.isExchange ? 'Exchange' : `₹${m.price}`}
                  </div>
                </div>

                {deleteMarketplaceId === m.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteMarketplace(m.id)}
                      className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                    >
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setDeleteMarketplaceId(null)}
                      className="px-2.5 py-1 rounded-full border border-gray-300 text-gray-600 text-xs hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteMarketplaceId(m.id)}
                    className="px-3.5 py-1.5 rounded-full bg-[#FADBD8] hover:bg-[#F5B7B1] text-[#922B21] text-xs font-semibold"
                  >
                    Remove Listing
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {refundModalTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#E5E0D8] shadow-xl space-y-4">
            <h3 className="text-base font-serif font-bold text-[#4A4A3A]">Issue Refund: {refundModalTx.id}</h3>
            <p className="text-xs text-[#8B8374]">
              Transaction for <strong className="text-[#4A4A3A]">{refundModalTx.description}</strong> (₹{refundModalTx.amount}) by {refundModalTx.userName}.
            </p>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#4A4A3A]">Refund Reason</label>
              <input
                type="text"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Reason for refund..."
                className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E5E0D8] text-xs focus:outline-hidden focus:border-[#5A634E]"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleRefundTransaction(refundModalTx.id, refundReason)}
                className="flex-1 py-2 rounded-full bg-[#7D3C98] hover:bg-[#6C3483] text-white text-xs font-bold transition"
              >
                Confirm Refund
              </button>
              <button
                type="button"
                onClick={() => setRefundModalTx(null)}
                className="px-4 py-2 rounded-full border border-[#E5E0D8] text-[#7A7468] hover:bg-[#F5F2ED] text-xs font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
