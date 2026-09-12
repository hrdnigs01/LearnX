import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  BookOpen,
  PenTool,
  GraduationCap,
  FileSpreadsheet,
  FileText,
  Phone,
  Mail,
  MapPin,
  Tag,
  Search,
  MessageCircle,
  Sparkles,
  ArrowRightLeft,
  Trash2,
  CreditCard,
} from 'lucide-react';
import { MarketplaceItem, MarketplaceCategory, User } from '../types';
import { playChime } from '../utils/audio';

interface MarketplaceViewProps {
  currentUser: User;
  classLevel: number;
  items: MarketplaceItem[];
  onAddItem: (item: Partial<MarketplaceItem>) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onBuyItem?: (item: MarketplaceItem) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  currentUser,
  classLevel,
  items,
  onAddItem,
  onDeleteItem,
  onBuyItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MarketplaceCategory>('Used Books');
  const [price, setPrice] = useState(150);
  const [isExchange, setIsExchange] = useState(false);
  const [condition, setCondition] = useState<'Brand New' | 'Like New' | 'Good' | 'Fair'>('Good');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('Science');
  const [contactPhone, setContactPhone] = useState(currentUser.phone || '+91 98765 43210');
  const [contactEmail, setContactEmail] = useState(currentUser.email || 'student@learnx.in');
  const [location, setLocation] = useState('Delhi NCR');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'All', label: 'All Listings', icon: ShoppingBag },
    { id: 'Used Books', label: '📚 Used Books', icon: BookOpen },
    { id: 'Stationery', label: '✏️ Stationery', icon: PenTool },
    { id: 'Peer Tutoring', label: '🎓 Peer Tutoring', icon: GraduationCap },
    { id: 'Presentations & Charts', label: '📊 PPTs & Charts', icon: FileSpreadsheet },
    { id: 'Study Notes', label: '📝 Topper Notes', icon: FileText },
  ];

  const filteredItems = items.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddItem({
        title,
        category,
        price: isExchange ? 0 : Number(price),
        isExchange,
        condition,
        description,
        classLevel,
        subject,
        contactPhone,
        contactEmail,
        location,
        tags: [category, `Class ${classLevel}`, subject],
      });

      playChime('success');
      setShowAddModal(false);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Create listing error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#4A4A3A] tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#5A634E]" />
            <span>Student Marketplace & Exchange</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8B8374]">
            Buy, sell, or exchange used textbooks, topper revision notes, diagram charts, and peer tutoring.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-full bg-[#5A634E] hover:bg-[#484F3E] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post Item or Service</span>
        </button>
      </div>

      {/* Search & Category Tabs */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#8B8374] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search NCERT books, handwritten notes, PPT templates, geometry kits..."
            className="w-full pl-9 pr-3 py-2.5 rounded-full bg-white border border-[#E5E0D8] text-xs sm:text-sm text-[#4A4A3A] placeholder-[#8B8374] focus:outline-none focus:border-[#5A634E] shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
                selectedCategory === cat.id
                  ? 'bg-[#5A634E] text-white border-[#5A634E] shadow-xs'
                  : 'bg-white text-[#7A7468] border-[#E5E0D8] hover:bg-[#F5F2ED]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
        {filteredItems.length === 0 ? (
          <div className="col-span-full p-12 rounded-3xl bg-white border border-[#E5E0D8] text-center text-[#8B8374] text-xs">
            No items listed in this category yet. Be the first to post!
          </div>
        ) : (
          filteredItems.map((item) => {
            const isOwner = item.sellerId === currentUser.id;

            return (
              <div
                key={item.id}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5E0D8] hover:border-[#5A634E]/50 hover:shadow-md transition-all flex flex-col justify-between shadow-sm group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-[#F5F2ED] text-[#7A7468] border border-[#E5E0D8]">
                      {item.category}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                        item.isExchange
                          ? 'bg-[#EDF0E9] text-[#5A634E] border border-[#D8DFD2]'
                          : 'bg-[#F5F2ED] text-[#7A7468] border border-[#E5E0D8]'
                      }`}
                    >
                      {item.isExchange ? 'Exchange Available' : `${item.condition} Condition`}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-serif font-bold text-[#4A4A3A] group-hover:text-[#5A634E] transition">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#8B8374] flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#8B8374]" />
                      <span>{item.location}</span>
                      {item.classLevel && <span>• Class {item.classLevel}</span>}
                    </p>
                  </div>

                  <p className="text-xs text-[#7A7468] line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[#F5F2ED] text-[#8B8374]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Bar: Price & Contact */}
                <div className="mt-4 pt-3 border-t border-[#E5E0D8] flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] text-[#8B8374]">Price</div>
                    <div className="text-base font-serif font-bold text-[#5A634E]">
                      {item.isExchange ? (
                        <span className="flex items-center gap-1 text-[#5A634E] text-xs">
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                          <span>Exchange</span>
                        </span>
                      ) : (
                        `₹${item.price.toLocaleString('en-IN')}`
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isOwner ? (
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-2 rounded-full bg-[#FADBD8] hover:bg-[#F5B7B1] text-[#922B21] text-xs font-semibold transition flex items-center gap-1"
                        title="Delete your listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    ) : (
                      <>
                        <a
                          href={`tel:${item.contactPhone}`}
                          className="p-2 rounded-full bg-[#F5F2ED] hover:bg-[#EBE7DF] border border-[#E5E0D8] text-[#4A4A3A] transition"
                          title="Call Seller"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/${item.contactPhone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(item.sellerName)},%20I%20am%20interested%20in%20your%20listing:%20${encodeURIComponent(item.title)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-full bg-[#F5F2ED] hover:bg-[#EBE7DF] border border-[#E5E0D8] text-[#4A4A3A] transition"
                          title="Chat with Seller on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                        {!item.isExchange && item.price > 0 && onBuyItem && (
                          <button
                            onClick={() => onBuyItem(item)}
                            className="px-3.5 py-1.5 rounded-full bg-[#5A634E] hover:bg-[#484F3E] text-white text-xs font-semibold transition flex items-center gap-1 shadow-xs"
                            title="Buy via Instant UPI & receive verified receipt"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay UPI</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Post Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white border border-[#E5E0D8] rounded-[32px] shadow-2xl p-6 sm:p-7 space-y-4 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-start justify-between border-b border-[#E5E0D8] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#5A634E] uppercase">Peer Store</span>
                <h3 className="text-base font-serif font-bold text-[#4A4A3A]">Post Item or Study Service</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#8B8374] hover:text-[#4A4A3A] p-1 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#4A4A3A] font-semibold mb-1">Listing Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. NCERT Science Class 10 with solved exemplar"
                  className="w-full p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] placeholder-[#8B8374] focus:outline-none focus:border-[#5A634E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#4A4A3A] font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as MarketplaceCategory)}
                    className="w-full p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] focus:outline-none focus:border-[#5A634E]"
                  >
                    <option value="Used Books">📚 Used Books</option>
                    <option value="Stationery">✏️ Stationery</option>
                    <option value="Peer Tutoring">🎓 Peer Tutoring</option>
                    <option value="Presentations & Charts">📊 PPTs & Charts</option>
                    <option value="Study Notes">📝 Study Notes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#4A4A3A] font-semibold mb-1">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] focus:outline-none focus:border-[#5A634E]"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#4A4A3A]">Open to Exchange?</div>
                  <div className="text-[11px] text-[#8B8374]">Swap with other student books/notes</div>
                </div>
                <input
                  type="checkbox"
                  checked={isExchange}
                  onChange={(e) => setIsExchange(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#5A634E]"
                />
              </div>

              {!isExchange && (
                <div>
                  <label className="block text-[#4A4A3A] font-semibold mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] focus:outline-none focus:border-[#5A634E]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[#4A4A3A] font-semibold mb-1">Description & Details</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mention markings, edition year, or what you are offering..."
                  className="w-full p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] placeholder-[#8B8374] focus:outline-none focus:border-[#5A634E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#4A4A3A] font-semibold mb-1">Location / City Area</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] focus:outline-none focus:border-[#5A634E]"
                  />
                </div>
                <div>
                  <label className="block text-[#4A4A3A] font-semibold mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] focus:outline-none focus:border-[#5A634E]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full bg-[#F5F2ED] text-[#7A7468] font-semibold hover:bg-[#EBE7DF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-full bg-[#5A634E] hover:bg-[#484F3E] text-white font-bold transition shadow-sm"
                >
                  {isSubmitting ? 'Posting...' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
