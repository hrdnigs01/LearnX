import React, { useState } from 'react';
import {
  Building2,
  Home,
  Monitor,
  Search,
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  QrCode,
  Users,
  ChevronRight,
  Sparkles,
  CreditCard,
  CheckCircle2,
  XCircle,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import { TuitionProfile, AdmissionRequest, User } from '../types';
import { playChime } from '../utils/audio';

interface TuitionFinderViewProps {
  currentUser: User;
  classLevel: number;
  tuitions: TuitionProfile[];
  admissions: AdmissionRequest[];
  onRefreshAdmissions: () => void;
  onInitiatePayment: (admission: AdmissionRequest) => void;
}

export const TuitionFinderView: React.FC<TuitionFinderViewProps> = ({
  currentUser,
  classLevel,
  tuitions,
  admissions,
  onRefreshAdmissions,
  onInitiatePayment,
}) => {
  const [selectedType, setSelectedType] = useState<'all' | 'centre' | 'home' | 'online'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTuition, setSelectedTuition] = useState<TuitionProfile | null>(null);

  // Admission Request Modal
  const [isApplying, setIsApplying] = useState(false);
  const [studentName, setStudentName] = useState(currentUser.name);
  const [studentPhone, setStudentPhone] = useState(currentUser.phone || '+91 98765 43210');
  const [studentEmail, setStudentEmail] = useState(currentUser.email || 'student@learnx.in');
  const [studentClass, setStudentClass] = useState(classLevel);
  const [preferredTiming, setPreferredTiming] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // QR Modal
  const [activeQrModal, setActiveQrModal] = useState<AdmissionRequest | null>(null);

  const [activeTab, setActiveTab] = useState<'browse' | 'my-admissions'>('browse');

  const filteredTuitions = tuitions.filter((t) => {
    const matchesType = selectedType === 'all' || t.type === selectedType;
    const matchesClass = t.classes.includes(classLevel);
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q) ||
      t.subjects.some((s) => s.toLowerCase().includes(q));
    return matchesType && matchesClass && matchesQuery;
  });

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTuition) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const token = localStorage.getItem('learnx_token');
      const res = await fetch('/api/tuition/admission-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          tuitionId: selectedTuition.id,
          studentName,
          studentPhone,
          studentEmail,
          studentClass,
          preferredTiming: preferredTiming || selectedTuition.timings,
          message,
          referralCode: selectedTuition.referralCode,
        }),
      });

      const data = await res.json();
      if (data.success) {
        playChime('success');
        setIsApplying(false);
        setSelectedTuition(null);
        setActiveTab('my-admissions');
        onRefreshAdmissions();
        setActiveQrModal(data.admission);
      } else {
        setErrorMessage(data.message || 'Error submitting admission request');
      }
    } catch (err: any) {
      console.error('Admission submit error:', err);
      setErrorMessage(err?.message || 'Network error submitting admission request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAdmissionStatus = async (admissionId: string, status: 'Accepted' | 'Rejected' | 'Enrolled') => {
    try {
      const token = localStorage.getItem('learnx_token');
      const res = await fetch(`/api/tuition/admissions/${admissionId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        playChime('click');
        onRefreshAdmissions();
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const isTutorOrCentre = currentUser.role === 'tutor' || currentUser.role === 'centre';

  return (
    <div className="space-y-6 pb-16 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#4A4A3A] tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#5A634E]" />
            <span>Tuition Finder & Verified Admissions</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8B8374]">
            Find vetted coaching centres, home tutors, and live online batches for Class {classLevel}.
          </p>
        </div>

        {/* View switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#F5F2ED] border border-[#E5E0D8] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              activeTab === 'browse'
                ? 'bg-[#5A634E] text-white shadow-xs'
                : 'text-[#7A7468] hover:text-[#4A4A3A]'
            }`}
          >
            Explore Tutors
          </button>
          <button
            onClick={() => setActiveTab('my-admissions')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              activeTab === 'my-admissions'
                ? 'bg-[#5A634E] text-white shadow-xs'
                : 'text-[#7A7468] hover:text-[#4A4A3A]'
            }`}
          >
            <span>{isTutorOrCentre ? 'Manage Inquiries' : 'My Admissions'}</span>
            {admissions.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#E9E4DB] text-[10px] text-[#5A634E]">
                {admissions.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-rose-600 hover:text-rose-800 font-bold ml-2">
            Dismiss
          </button>
        </div>
      )}

      {activeTab === 'browse' ? (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            <div className="sm:col-span-2 relative">
              <Search className="w-4 h-4 text-[#8B8374] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by tutor, coaching centre, subject or area..."
                className="w-full pl-9 pr-3 py-2.5 rounded-full bg-white border border-[#E5E0D8] text-xs sm:text-sm text-[#4A4A3A] placeholder-[#8B8374] focus:outline-none focus:border-[#5A634E] shadow-xs"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: 'all', label: 'All Modes' },
                { id: 'centre', label: '🏫 Coaching Hub', icon: Building2 },
                { id: 'home', label: '🏠 Home Tutor', icon: Home },
                { id: 'online', label: '💻 Online Live', icon: Monitor },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id as any)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
                    selectedType === type.id
                      ? 'bg-[#5A634E] text-white border-[#5A634E] shadow-xs'
                      : 'bg-white text-[#7A7468] border-[#E5E0D8] hover:bg-[#F5F2ED]'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* 15% Platform Commission Transparency Banner */}
          <div className="p-4 rounded-2xl bg-[#EDF0E9] border border-[#D8DFD2] flex items-center justify-between text-xs text-[#5A634E] gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#5A634E] flex-shrink-0" />
              <span>
                <strong>LearnX Trust Guarantee:</strong> Zero recurring fees. Transparent 15% one-time platform admission commission with instant verified QR tracking and secure UPI protection.
              </span>
            </div>
          </div>

          {/* Tuitions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
            {filteredTuitions.map((t) => {
              return (
                <div
                  key={t.id}
                  className="rounded-3xl bg-white border border-[#E5E0D8] hover:border-[#5A634E]/50 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between shadow-sm group"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full ${
                            t.type === 'centre'
                              ? 'bg-[#FDEBD0] text-[#AF601A]'
                              : t.type === 'home'
                              ? 'bg-[#EDF0E9] text-[#5A634E]'
                              : 'bg-[#E8F8F5] text-[#117864]'
                          }`}
                        >
                          {t.type === 'centre' ? '🏫 Centre' : t.type === 'home' ? '🏠 Home Tutor' : '💻 Online'}
                        </span>
                        {t.verified && (
                          <span className="flex items-center gap-0.5 text-[10px] font-semibold text-[#1D8348] bg-[#D5F5E3] px-2 py-0.5 rounded-full border border-[#ABEBC6]">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[#AF601A] font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-[#AF601A]" />
                        <span>{t.rating}</span>
                        <span className="text-[#8B8374]">({t.reviewCount})</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-serif font-bold text-[#4A4A3A] group-hover:text-[#5A634E] transition">
                        {t.name}
                      </h3>
                      <p className="text-xs text-[#8B8374] flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#8B8374] flex-shrink-0" />
                        <span className="truncate">{t.location}</span>
                      </p>
                    </div>

                    <p className="text-xs text-[#7A7468] line-clamp-2 leading-relaxed">
                      {t.description}
                    </p>

                    {/* Subjects and Batches */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {t.subjects.map((sub, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#F5F2ED] text-[#7A7468] border border-[#E5E0D8]"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>

                    {/* Faculty highlight */}
                    {t.faculty && t.faculty.length > 0 && (
                      <div className="text-[11px] text-[#7A7468] bg-[#F5F2ED] p-2.5 rounded-xl border border-[#E5E0D8]">
                        <span className="font-semibold text-[#4A4A3A]">Lead Faculty: </span>
                        {t.faculty[0]}
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="p-4 bg-[#F5F2ED] border-t border-[#E5E0D8] flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[11px] text-[#8B8374]">Monthly Fee</div>
                      <div className="text-base font-serif font-bold text-[#5A634E]">
                        ₹{t.fees.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-[#8B8374]">
                        {t.availableSeats} of {t.totalSeats} seats left
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedTuition(t)}
                        className="px-3 py-1.5 rounded-full bg-white hover:bg-[#EBE7DF] border border-[#E5E0D8] text-[#4A4A3A] text-xs font-semibold transition"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTuition(t);
                          setIsApplying(true);
                        }}
                        className="px-4 py-1.5 rounded-full bg-[#5A634E] hover:bg-[#484F3E] text-white font-bold text-xs shadow-xs transition flex items-center gap-1"
                      >
                        <span>Apply</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* My Admissions / Applications Tab */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif font-bold text-[#4A4A3A]">
              {isTutorOrCentre ? 'Incoming Student Admission Inquiries' : 'Your Enrolled Applications'}
            </h3>
            <span className="text-xs text-[#8B8374]">15% platform commission tracked</span>
          </div>

          {admissions.length === 0 ? (
            <div className="p-10 rounded-3xl bg-white border border-[#E5E0D8] text-center text-[#8B8374] text-xs">
              No admissions submitted yet. Explore tutors and apply for your batch.
            </div>
          ) : (
            admissions.map((adm) => {
              const isPaid = adm.status === 'Paid' || adm.status === 'Enrolled';

              return (
                <div
                  key={adm.id}
                  className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5E0D8] space-y-4 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-[#5A634E]">{adm.id}</span>
                        <span
                          className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full ${
                            isPaid
                              ? 'bg-[#D5F5E3] text-[#1D8348] border border-[#ABEBC6]'
                              : adm.status === 'Accepted'
                              ? 'bg-[#EDF0E9] text-[#5A634E] border border-[#D8DFD2]'
                              : adm.status === 'Rejected'
                              ? 'bg-[#FADBD8] text-[#922B21] border border-[#F5B7B1]'
                              : 'bg-[#FDEBD0] text-[#AF601A] border border-[#FAD7A0]'
                          }`}
                        >
                          {adm.status}
                        </span>
                      </div>
                      <h4 className="text-base font-serif font-bold text-[#4A4A3A] mt-1">
                        {adm.tuitionName}
                      </h4>
                      <p className="text-xs text-[#8B8374]">
                        Student: {adm.studentName} (Class {adm.studentClass}) • Timing: {adm.preferredTiming}
                      </p>
                    </div>

                    {/* Fee & Commission Calculation */}
                    <div className="text-left sm:text-right bg-[#F5F2ED] p-3.5 rounded-2xl border border-[#E5E0D8]">
                      <div className="text-xs text-[#7A7468]">Admission Fee: ₹{adm.feeAmount.toLocaleString('en-IN')}</div>
                      <div className="text-[11px] text-[#5A634E]">
                        LearnX 15% Comm: ₹{adm.commissionAmount.toLocaleString('en-IN')} (One-time)
                      </div>
                      <div className="text-xs font-bold text-[#4A4A3A] mt-0.5">
                        Net Tutor Share: ₹{(adm.feeAmount - adm.commissionAmount).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Actions & QR Referral */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E5E0D8]">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveQrModal(adm)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F2ED] hover:bg-[#EBE7DF] border border-[#E5E0D8] text-xs font-semibold text-[#4A4A3A] transition"
                      >
                        <QrCode className="w-3.5 h-3.5 text-[#5A634E]" />
                        <span>View Referral QR</span>
                      </button>
                      <span className="text-[11px] text-[#8B8374]">
                        Ref: <span className="font-mono text-[#4A4A3A]">{adm.referralCode}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isTutorOrCentre && adm.status === 'Submitted' && (
                        <>
                          <button
                            onClick={() => handleUpdateAdmissionStatus(adm.id, 'Accepted')}
                            className="px-3.5 py-1.5 rounded-full bg-[#5A634E] hover:bg-[#484F3E] text-white text-xs font-semibold flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Accept Student</span>
                          </button>
                          <button
                            onClick={() => handleUpdateAdmissionStatus(adm.id, 'Rejected')}
                            className="px-3.5 py-1.5 rounded-full bg-[#FADBD8] hover:bg-[#F5B7B1] text-[#922B21] text-xs font-semibold"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {!isPaid && (
                        <button
                          onClick={() => onInitiatePayment(adm)}
                          className="px-5 py-2 rounded-full bg-[#5A634E] hover:bg-[#484F3E] text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pay Admission via UPI</span>
                        </button>
                      )}

                      {isPaid && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-[#1D8348] bg-[#D5F5E3] px-3 py-1.5 rounded-full border border-[#ABEBC6]">
                          <FileCheck className="w-4 h-4" />
                          <span>Paid & Enrolled • Seat Confirmed</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tuition Detail Modal */}
      {selectedTuition && !isApplying && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white border border-[#E5E0D8] rounded-[32px] shadow-2xl p-6 sm:p-7 space-y-4 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-start justify-between gap-2 border-b border-[#E5E0D8] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A634E]">
                  {selectedTuition.type} Details
                </span>
                <h3 className="text-lg font-serif font-bold text-[#4A4A3A]">{selectedTuition.name}</h3>
                <p className="text-xs text-[#8B8374]">{selectedTuition.location}</p>
              </div>
              <button
                onClick={() => setSelectedTuition(null)}
                className="text-[#8B8374] hover:text-[#4A4A3A] p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#7A7468] leading-relaxed">
              {selectedTuition.description}
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-[#F5F2ED] flex items-center justify-between">
                <span className="text-[#8B8374]">Batch Timings:</span>
                <span className="font-semibold text-[#4A4A3A]">{selectedTuition.timings}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#F5F2ED] flex items-center justify-between">
                <span className="text-[#8B8374]">Seats Capacity:</span>
                <span className="font-semibold text-[#4A4A3A]">
                  {selectedTuition.availableSeats} of {selectedTuition.totalSeats} Available
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[#F5F2ED] flex items-center justify-between">
                <span className="text-[#8B8374]">Monthly Tuition Fee:</span>
                <span className="font-serif font-bold text-[#5A634E] text-sm">
                  ₹{selectedTuition.fees.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Faculty */}
            {selectedTuition.faculty && selectedTuition.faculty.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-[#4A4A3A]">Teaching Faculty</h4>
                <div className="space-y-1.5">
                  {selectedTuition.faculty.map((facultyMember, i) => (
                    <div key={i} className="p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] flex items-center justify-between text-xs">
                      <div className="font-semibold text-[#4A4A3A]">{facultyMember}</div>
                      <span className="text-[11px] text-[#5A634E] font-semibold">Verified Faculty</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-[#E5E0D8] flex justify-end gap-2.5">
              <button
                onClick={() => setSelectedTuition(null)}
                className="px-4 py-2 rounded-full bg-[#F5F2ED] text-[#7A7468] font-semibold text-xs hover:bg-[#EBE7DF]"
              >
                Close
              </button>
              <button
                onClick={() => setIsApplying(true)}
                className="px-5 py-2 rounded-full bg-[#5A634E] hover:bg-[#484F3E] text-white font-bold text-xs"
              >
                Apply for Admission Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admission Application Form Modal */}
      {isApplying && selectedTuition && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white border border-[#E5E0D8] rounded-[32px] shadow-2xl p-6 sm:p-7 space-y-4 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-start justify-between border-b border-[#E5E0D8] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#5A634E] uppercase">Apply for Batch</span>
                <h3 className="text-base font-serif font-bold text-[#4A4A3A]">{selectedTuition.name}</h3>
              </div>
              <button
                onClick={() => setIsApplying(false)}
                className="text-[#8B8374] hover:text-[#4A4A3A] p-1 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#4A4A3A] font-semibold mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] focus:outline-none focus:border-[#5A634E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#4A4A3A] font-semibold mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    className="w-full p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] focus:outline-none focus:border-[#5A634E]"
                  />
                </div>
                <div>
                  <label className="block text-[#4A4A3A] font-semibold mb-1">Grade / Class</label>
                  <select
                    value={studentClass}
                    onChange={(e) => setStudentClass(Number(e.target.value))}
                    className="w-full p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] focus:outline-none focus:border-[#5A634E]"
                  >
                    {[6, 7, 8, 9, 10, 11, 12].map((c) => (
                      <option key={c} value={c}>
                        Class {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#4A4A3A] font-semibold mb-1">Preferred Batch Timing</label>
                <input
                  type="text"
                  value={preferredTiming}
                  onChange={(e) => setPreferredTiming(e.target.value)}
                  placeholder={selectedTuition.timings}
                  className="w-full p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] focus:outline-none focus:border-[#5A634E]"
                />
              </div>

              <div>
                <label className="block text-[#4A4A3A] font-semibold mb-1">Notes / Target Goals</label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Preparing for Class 10 Science boards, need help with Chemistry"
                  className="w-full p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] focus:outline-none focus:border-[#5A634E]"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#EDF0E9] border border-[#D8DFD2] text-[#5A634E] text-[11px] leading-relaxed">
                Fee: <strong>₹{selectedTuition.fees.toLocaleString('en-IN')}/mo</strong>. A verified admission ID and referral QR will be issued immediately upon submission.
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsApplying(false)}
                  className="px-4 py-2 rounded-full bg-[#F5F2ED] text-[#7A7468] font-semibold hover:bg-[#EBE7DF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-full bg-[#5A634E] hover:bg-[#484F3E] text-white font-bold transition shadow-sm"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm & Generate Admission QR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Referral Modal */}
      {activeQrModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-sm bg-white border border-[#E5E0D8] rounded-[32px] shadow-2xl p-6 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-2">
              <span className="text-xs font-mono font-semibold text-[#5A634E]">{activeQrModal.id}</span>
              <button
                onClick={() => setActiveQrModal(null)}
                className="text-[#8B8374] hover:text-[#4A4A3A] text-xs p-1"
              >
                ✕
              </button>
            </div>

            <h3 className="text-base font-serif font-bold text-[#4A4A3A]">Admission Referral QR</h3>
            <p className="text-xs text-[#8B8374]">
              Scan this QR code at the tuition centre reception for quick verification and badge referral benefits.
            </p>

            {activeQrModal.qrCodeDataUrl && (
              <div className="p-4 bg-[#F5F2ED] border border-[#E5E0D8] rounded-2xl inline-block shadow-sm mx-auto">
                <img
                  src={activeQrModal.qrCodeDataUrl}
                  alt="Admission QR Code"
                  className="w-48 h-48 mx-auto mix-blend-multiply"
                />
              </div>
            )}

            <div className="text-[11px] font-mono text-[#5A634E] bg-[#EDF0E9] py-1.5 px-3 rounded-full border border-[#D8DFD2]">
              Referral Code: {activeQrModal.referralCode}
            </div>

            <button
              onClick={() => setActiveQrModal(null)}
              className="w-full py-2.5 rounded-full bg-[#5A634E] hover:bg-[#484F3E] text-white font-bold text-xs shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
