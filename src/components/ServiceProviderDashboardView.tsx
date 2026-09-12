import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  GraduationCap,
  Users,
  Calendar,
  Clock,
  TrendingUp,
  Percent,
  Wallet,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Layers,
  Sparkles,
  X,
  Phone,
  Mail,
  MapPin,
  Check,
} from 'lucide-react';
import { User, AdmissionRequest, PayoutRecord } from '../types';
import { safeFetchJson } from '../utils/api';

interface ServiceProviderDashboardViewProps {
  currentUser: User;
  onRefreshUser: () => void;
}

export const ServiceProviderDashboardView: React.FC<ServiceProviderDashboardViewProps> = ({
  currentUser,
  onRefreshUser,
}) => {
  const [loading, setLoading] = useState(true);
  const [providerData, setProviderData] = useState<{
    provider: any;
    stats: any;
    services: any[];
    admissions: AdmissionRequest[];
    payouts: PayoutRecord[];
  } | null>(null);

  // Modals
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // New Service Form
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceType, setServiceType] = useState('tutoring');
  const [serviceFee, setServiceFee] = useState('');
  const [serviceSubject, setServiceSubject] = useState('Mathematics');
  const [serviceClass, setServiceClass] = useState('10');
  const [serviceDesc, setServiceDesc] = useState('');

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

  const fetchProviderDashboard = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('learnx_token');
      const data = await safeFetchJson<any>('/api/provider/dashboard', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (data?.success) {
        setProviderData(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderDashboard();
  }, [currentUser]);

  // Handle student admission status update
  const handleUpdateAdmissionStatus = async (admissionId: string, status: string) => {
    try {
      const res = await fetch(`/api/tuition/admissions/${admissionId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        fetchProviderDashboard();
        setStatusNotice(`Admission #${admissionId} status updated to ${status}.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add new service / tutoring batch
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('learnx_token');
      const res = await fetch('/api/provider/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: serviceTitle,
          type: serviceType,
          subject: serviceSubject,
          classLevel: Number(serviceClass),
          fee: Number(serviceFee),
          description: serviceDesc,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddServiceModal(false);
        setServiceTitle('');
        setServiceFee('');
        setServiceDesc('');
        fetchProviderDashboard();
        setStatusNotice('Service offering published successfully!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit KYC for verification
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
        fetchProviderDashboard();
        setStatusNotice('Bank details & KYC submitted for verification!');
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
        fetchProviderDashboard();
        setStatusNotice(`Payout of ₹${data.payout.netPayoutAmount.toLocaleString('en-IN')} initiated! UTR: ${data.payout.utr}`);
      } else {
        setStatusNotice(`Withdrawal error: ${data.message || 'Request failed'}`);
      }
    } catch (err: any) {
      console.error(err);
      setStatusNotice(`Withdrawal error: ${err?.message || 'Failed to process withdrawal'}`);
    }
  };

  const payoutBalance = currentUser.payoutBalance || providerData?.provider?.payoutBalance || 7225;
  const totalEarned = currentUser.totalEarned || providerData?.provider?.totalEarned || 24000;
  const totalWithdrawn = currentUser.totalWithdrawn || providerData?.provider?.totalWithdrawn || 16775;
  const kycStatus = currentUser.kycStatus || providerData?.provider?.kycStatus || 'verified';

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
          <div className="w-14 h-14 rounded-2xl bg-[#D5F5E3] text-[#1D8348] flex items-center justify-center flex-shrink-0 border border-[#ABEBC6]">
            <Briefcase className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#4A4A3A]">
                {currentUser.name}
              </h1>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  kycStatus === 'verified'
                    ? 'bg-[#D5F5E3] text-[#1D8348] border-[#ABEBC6]'
                    : 'bg-[#FEF9E7] text-[#B7950B] border-[#F9E79F]'
                }`}
              >
                {kycStatus === 'verified' ? '✓ Verified Educator & Provider' : 'KYC Pending'}
              </span>
            </div>
            <p className="text-xs text-[#8B8374] mt-0.5">
              Service ID: LX-PROV-{currentUser.id.slice(-6)} • 15% One-Time Commission on Admissions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => setShowAddServiceModal(true)}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-2xl bg-[#5A634E] text-white text-xs font-bold shadow-xs hover:bg-[#484F3E] transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Offering</span>
          </button>

          <button
            onClick={() => setShowKycModal(true)}
            className="px-3.5 py-2.5 rounded-2xl border border-[#E5E0D8] bg-[#F5F2ED] text-[#4A4A3A] hover:bg-[#EBE7DF] text-xs font-semibold transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-[#5A634E]" />
            <span>Bank & KYC</span>
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
            <p className="text-[11px] text-[#5A634E] font-medium mt-1">Available for bank withdrawal</p>
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

        {/* Total Earned */}
        <div className="p-5 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8B8374]">Gross Tuition & Fees</span>
            <div className="p-2 rounded-xl bg-[#F5F2ED] text-[#7A7468]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#4A4A3A]">
              ₹{totalEarned.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[#8B8374] mt-1">From tuition & academic guidance</p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E5E0D8] text-[11px] text-[#7A7468]">
            Lifetime Settled: ₹{totalWithdrawn.toLocaleString('en-IN')}
          </div>
        </div>

        {/* 15% One-Time Commission Policy */}
        <div className="p-5 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8B8374]">Admission Commission</span>
            <div className="p-2 rounded-xl bg-[#D5F5E3] text-[#1D8348]">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1D8348]">
              15% One-Time
            </div>
            <p className="text-[11px] text-[#8B8374] mt-1">
              Charged strictly ONCE upon admission
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E5E0D8] text-[11px] text-[#1D8348] font-medium">
            Never recurring! Subsequent fees are 100% yours
          </div>
        </div>

        {/* Enrolled Students & Inquiries */}
        <div className="p-5 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8B8374]">Active Enrollees</span>
            <div className="p-2 rounded-xl bg-[#EDF0E9] text-[#5A634E]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#4A4A3A]">
              {providerData?.admissions?.length || 3} Students
            </div>
            <p className="text-[11px] text-[#8B8374] mt-1">Inquiries and confirmed seats</p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E5E0D8] text-[11px] text-[#5A634E] font-medium">
            {providerData?.services?.length || 3} Active Offerings
          </div>
        </div>
      </div>

      {/* Student Admissions & Booking Inquiries */}
      <div className="p-6 rounded-[32px] bg-white border border-[#E5E0D8] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A4A3A]">
              Student Admission Requests & Inquiries
            </h2>
            <p className="text-xs text-[#8B8374]">
              Review student applications, approve admissions, and verify UPI payments
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#EDF0E9] text-[#5A634E]">
            {providerData?.admissions?.length || 0} Total Requests
          </span>
        </div>

        {providerData?.admissions && providerData.admissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E5E0D8] text-[#8B8374] uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-3">Admission ID</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Batch / Service</th>
                  <th className="py-3 px-3">Monthly Fee</th>
                  <th className="py-3 px-3">15% LearnX (One-Time)</th>
                  <th className="py-3 px-3">Your Net (85%)</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D8]/60">
                {providerData.admissions.map((adm) => (
                  <tr key={adm.id} className="hover:bg-[#FDFBF7] transition">
                    <td className="py-3.5 px-3 font-mono font-bold text-[#4A4A3A]">{adm.id}</td>
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-[#4A4A3A]">{adm.studentName}</div>
                      <div className="text-[10px] text-[#8B8374]">
                        Class {adm.studentClass || 10} • {adm.studentPhone || '+91 98765 43210'}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-[#4A4A3A]">{adm.tuitionName}</div>
                      <span className="text-[10px] text-[#8B8374]">Applied: {adm.createdAt?.split('T')[0] || adm.createdAt}</span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-[#4A4A3A]">
                      ₹{(adm.feeAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 text-red-600 font-medium">
                      -₹{Math.round((adm.feeAmount || 0) * 0.15).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#1D8348]">
                      +₹{Math.round((adm.feeAmount || 0) * 0.85).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          adm.status === 'Enrolled' || adm.status === 'Paid'
                            ? 'bg-[#D5F5E3] text-[#1D8348] border-[#ABEBC6]'
                            : adm.status === 'Accepted'
                            ? 'bg-[#FEF9E7] text-[#B7950B] border-[#F9E79F]'
                            : 'bg-[#EDF0E9] text-[#5A634E] border-[#D8DFD2]'
                        }`}
                      >
                        {adm.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {adm.status === 'Submitted' || adm.status === 'Under Review' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleUpdateAdmissionStatus(adm.id, 'Accepted')}
                            className="px-3 py-1 rounded-xl bg-[#5A634E] text-white text-[11px] font-semibold hover:bg-[#484F3E]"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateAdmissionStatus(adm.id, 'Rejected')}
                            className="px-2 py-1 rounded-xl text-red-600 hover:bg-red-50 text-[11px]"
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#8B8374]">Confirmed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed border-[#E5E0D8] rounded-2xl bg-[#FDFBF7]">
            <Users className="w-8 h-8 text-[#8B8374] mx-auto mb-2" />
            <div className="text-sm font-semibold text-[#4A4A3A]">No student inquiries yet</div>
            <p className="text-xs text-[#8B8374] max-w-sm mx-auto mt-1">
              Create and publish tutoring batches or project guidance services to receive student inquiries.
            </p>
          </div>
        )}
      </div>

      {/* Services & Guidance Offerings */}
      <div className="p-6 rounded-[32px] bg-white border border-[#E5E0D8] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A4A3A]">
              My Service Offerings & Batches
            </h2>
            <p className="text-xs text-[#8B8374]">
              Tutoring batches, PPT design, and assignment guidance published on LearnX
            </p>
          </div>
          <button
            onClick={() => setShowAddServiceModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EDF0E9] hover:bg-[#E2E7DC] text-xs font-semibold text-[#5A634E]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Service</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {providerData?.services && providerData.services.length > 0 ? (
            providerData.services.map((svc) => (
              <div
                key={svc.id}
                className="p-4 rounded-2xl border border-[#E5E0D8] bg-[#FDFBF7] hover:border-[#5A634E]/50 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white text-[#5A634E] border border-[#E5E0D8]">
                      {svc.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold text-[#1D8348]">
                      ₹{svc.fee.toLocaleString('en-IN')}{svc.type === 'tutoring' ? '/mo' : ' per project'}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-[#4A4A3A] mt-2 line-clamp-1">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-[#7A7468] line-clamp-2 mt-1">{svc.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5E0D8] flex items-center justify-between text-[11px] text-[#8B8374]">
                  <span>Class {svc.classLevel} • {svc.subject}</span>
                  <span className="font-semibold text-[#5A634E]">
                    Net: ₹{Math.round(svc.fee * 0.85)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-xs text-[#8B8374]">
              No service offerings added yet.
            </div>
          )}
        </div>
      </div>

      {/* Payout & Bank Settlement History */}
      <div className="p-6 rounded-[32px] bg-white border border-[#E5E0D8] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A4A3A]">
              Bank Payout Settlements
            </h2>
            <p className="text-xs text-[#8B8374]">Direct transfers to verified Bank Account / UPI</p>
          </div>
          <span className="text-xs text-[#1D8348] font-medium">85% Net Dispatched</span>
        </div>

        {providerData?.payouts && providerData.payouts.length > 0 ? (
          <div className="divide-y divide-[#E5E0D8]/60">
            {providerData.payouts.map((p) => (
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
            No withdrawal settlements requested yet.
          </div>
        )}
      </div>

      {/* MODAL 1: Add Service Offering */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#FDFBF7] border border-[#E5E0D8] rounded-[32px] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#4A4A3A]">Add Service Offering</h3>
              <button onClick={() => setShowAddServiceModal(false)} className="p-1.5 rounded-full bg-[#F5F2ED]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddService} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">Service Title</label>
                <input
                  type="text"
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  placeholder="e.g. CBSE Class 10 Board Maths Mastery Batch"
                  required
                  className="w-full px-3.5 py-2 rounded-2xl border border-[#E5E0D8] bg-white text-xs focus:outline-none focus:border-[#5A634E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">Service Type</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full px-3 py-2 rounded-2xl border border-[#E5E0D8] bg-white text-xs"
                  >
                    <option value="tutoring">Tutoring Batch</option>
                    <option value="ppt_design">PPT & Presentation Design</option>
                    <option value="project_guidance">Science & Academic Project Guidance</option>
                    <option value="doubt_session">1-on-1 Doubt Mentorship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">Fee (₹)</label>
                  <input
                    type="number"
                    value={serviceFee}
                    onChange={(e) => setServiceFee(e.target.value)}
                    placeholder="e.g. 1500"
                    required
                    className="w-full px-3.5 py-2 rounded-2xl border border-[#E5E0D8] bg-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">Target Class</label>
                  <select
                    value={serviceClass}
                    onChange={(e) => setServiceClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-2xl border border-[#E5E0D8] bg-white text-xs"
                  >
                    {[6, 7, 8, 9, 10, 11, 12].map((lvl) => (
                      <option key={lvl} value={lvl}>Class {lvl}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">Subject</label>
                  <input
                    type="text"
                    value={serviceSubject}
                    onChange={(e) => setServiceSubject(e.target.value)}
                    placeholder="e.g. Physics / Mathematics"
                    required
                    className="w-full px-3.5 py-2 rounded-2xl border border-[#E5E0D8] bg-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">Description</label>
                <textarea
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                  placeholder="Outline syllabus coverage, timings, doubt assistance, and deliverables..."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-2xl border border-[#E5E0D8] bg-white text-xs"
                />
              </div>

              <div className="p-3 rounded-2xl bg-[#D5F5E3] border border-[#ABEBC6] text-[11px] text-[#1D8348]">
                <span>Policy: LearnX charges 15% admission commission strictly ONCE upon student admission. Net: ₹{Math.round((Number(serviceFee) || 0) * 0.85)}.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#5A634E] text-white text-xs font-bold hover:bg-[#484F3E]"
              >
                Publish Service Offering
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
                <h3 className="font-serif font-bold text-lg text-[#4A4A3A]">Service Provider KYC & Bank</h3>
                <p className="text-xs text-[#8B8374]">Verified for direct tuition & fee disbursements</p>
              </div>
              <button onClick={() => setShowKycModal(false)} className="p-1.5 rounded-full bg-[#F5F2ED]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitKyc} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">Full Legal Name / Centre Name</label>
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
                    placeholder="7742"
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
                    placeholder="SBIN0001234"
                    required
                    className="w-full px-3.5 py-2 rounded-2xl border border-[#E5E0D8] bg-white text-xs uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A4A3A] mb-1">UPI VPA</label>
                  <input
                    type="text"
                    value={upiVpa}
                    onChange={(e) => setUpiVpa(e.target.value)}
                    placeholder="educator@okaxis"
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
              <h3 className="font-serif font-bold text-lg text-[#4A4A3A]">Withdraw Net Tuition Earnings</h3>
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
