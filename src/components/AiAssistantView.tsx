import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import {
  Brain,
  Send,
  Sparkles,
  Search,
  BookOpen,
  HelpCircle,
  FileText,
  Lightbulb,
  Globe,
  Loader2,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { User, WebSearchResult } from '../types';

interface AiAssistantViewProps {
  currentUser: User;
  classLevel: number;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  mode?: 'doubt' | 'simple' | 'summary' | 'guidance';
  timestamp: string;
  sources?: { title: string; uri: string; snippet?: string }[];
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  currentUser,
  classLevel,
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello ${currentUser.name}! I am your **LearnX AI Study Mentor** for Class ${classLevel}.\n\nI can answer questions in **English, Hindi (हिंदी), or Hinglish** across all your subjects:\n- 📐 **Maths & Formulas**: Step-by-step problem solving, algebra, fractions, geometry\n- 🔬 **Science (Physics, Chemistry, Biology)**: Clear concepts, chemical reactions, and real-life analogies\n- 🌍 **Social Science (SST), English, Hindi, Commerce**: History, civics, economics, and grammar\n- 📝 **Homework & Project Guidance**: Concept clarification and guided practice\n- 📰 **Educational Current Affairs**: Real-time CBSE/NCERT exam dates, syllabus updates, and reliable sources\n\nAsk any doubt or click one of the quick questions below to begin!`,
      timestamp: 'Just now',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<'doubt' | 'simple' | 'summary' | 'guidance'>('doubt');
  const [useGoogleSearch, setUseGoogleSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() !== '') {
      setInputQuery(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt, onClearInitialPrompt]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (overrideQuery?: string, overrideMode?: 'doubt' | 'simple' | 'summary' | 'guidance') => {
    const userText = (overrideQuery || inputQuery).trim();
    if (!userText || isLoading) return;

    const modeToUse = overrideMode || selectedMode;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: userText,
      mode: modeToUse,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      if (useGoogleSearch) {
        // Real-time search with Google Search grounding
        const res = await fetch('/api/search/web', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: userText }),
        });
        const data = await res.json();
        if (data.success && data.result) {
          const aiMsg: ChatMessage = {
            id: `ai_${Date.now()}`,
            sender: 'ai',
            text: data.result.summary,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sources: data.result.sources,
          };
          setMessages((prev) => [...prev, aiMsg]);
        }
      } else {
        // AI Study Mentor
        const res = await fetch('/api/ai/doubt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: userText,
            classLevel,
            mode: modeToUse,
          }),
        });
        const data = await res.json();
        if (data.success) {
          const aiMsg: ChatMessage = {
            id: `ai_${Date.now()}`,
            sender: 'ai',
            text: data.answer,
            mode: modeToUse,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sources: data.sources,
          };
          setMessages((prev) => [...prev, aiMsg]);
        }
      }
    } catch (err) {
      console.warn('AI chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: 'We encountered a momentary communication pause. Please check your network or try asking again.',
          timestamp: 'Now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    { label: 'Photosynthesis kya hai?', mode: 'doubt' as const },
    { label: 'Class 8 ka algebra samjhao.', mode: 'doubt' as const },
    { label: 'India ki capital kya hai?', mode: 'doubt' as const },
    { label: 'Mujhe fractions samjhao.', mode: 'simple' as const },
    { label: 'Aaj ka educational current affairs batao.', mode: 'doubt' as const },
  ];

  return (
    <div className="space-y-4 pb-12 flex flex-col h-[calc(100vh-140px)] min-h-[580px]">
      {/* Header with Mode Selectors */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E5E0D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EDF0E9] flex items-center justify-center text-[#5A634E] font-bold shadow-xs">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-serif font-bold text-[#4A4A3A] flex items-center gap-2">
              <span>LearnX AI Study Assistant</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EDF0E9] text-[#5A634E] border border-[#D8DFD2] font-mono">
                Gemini 3.8
              </span>
            </h1>
            <p className="text-[11px] text-[#8B8374]">
              Personalized mentor for Class {classLevel} NCERT syllabus
            </p>
          </div>
        </div>

        {/* Search grounding toggle & reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUseGoogleSearch(!useGoogleSearch)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition border ${
              useGoogleSearch
                ? 'bg-[#EDF0E9] text-[#5A634E] border-[#5A634E]/30 shadow-xs'
                : 'bg-[#F5F2ED] text-[#7A7468] border-[#E5E0D8] hover:bg-[#EBE7DF]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Google Web Search {useGoogleSearch ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => {
              setMessages([
                {
                  id: 'welcome_reset',
                  sender: 'ai',
                  text: `Chat reset. Ask me any doubt from your Class ${classLevel} syllabus!`,
                  timestamp: 'Just now',
                },
              ]);
            }}
            className="p-2 rounded-full bg-[#F5F2ED] hover:bg-[#EBE7DF] text-[#7A7468] border border-[#E5E0D8] transition"
            title="Clear Chat History"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mode Switcher Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-shrink-0">
        {[
          { id: 'doubt', label: 'Step-by-Step Doubt Solving', icon: HelpCircle, color: 'text-[#5A634E]' },
          { id: 'simple', label: 'Explain Simply (Like I’m 10)', icon: Lightbulb, color: 'text-[#AF601A]' },
          { id: 'summary', label: 'Revision Summary & Formulas', icon: FileText, color: 'text-[#1D8348]' },
          { id: 'guidance', label: 'Homework & Project Guidance', icon: ShieldCheck, color: 'text-[#6C3483]' },
        ].map((m) => {
          const Icon = m.icon;
          const isSelected = selectedMode === m.id && !useGoogleSearch;
          return (
            <button
              key={m.id}
              onClick={() => {
                setSelectedMode(m.id as any);
                setUseGoogleSearch(false);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition border ${
                isSelected
                  ? 'bg-[#5A634E] border-[#5A634E] text-white shadow-xs'
                  : 'bg-white border-[#E5E0D8] text-[#7A7468] hover:bg-[#F5F2ED]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : m.color}`} />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 rounded-3xl bg-[#F5F2ED] border border-[#E5E0D8] space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-[#5A634E] text-white rounded-br-none'
                  : 'bg-white border border-[#E5E0D8] text-[#4A4A3A] rounded-bl-none'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#5A634E] mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>LearnX AI Study Mentor</span>
                </div>
              )}

              <div className="markdown-body text-xs sm:text-sm leading-relaxed space-y-2">
                <Markdown>{msg.text}</Markdown>
              </div>

              {/* Verified Sources if search grounding was used */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#E5E0D8] space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A634E] block">
                    Verified Web Sources & Citations
                  </span>
                  <div className="space-y-1">
                    {msg.sources.map((src, i) => (
                      <a
                        key={i}
                        href={src.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="block p-2 rounded-xl bg-[#F5F2ED] hover:bg-[#EBE7DF] border border-[#E5E0D8] text-[11px] text-[#5A634E] truncate transition flex items-center justify-between"
                      >
                        <span className="truncate">{src.title}</span>
                        <ExternalLink className="w-3 h-3 text-[#8B8374] flex-shrink-0 ml-1" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <span className={`text-[10px] block text-right mt-1.5 ${msg.sender === 'user' ? 'text-white/70' : 'text-[#8B8374]'}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-[#E5E0D8] max-w-[200px] text-xs text-[#5A634E] shadow-xs">
            <Loader2 className="w-4 h-4 animate-spin text-[#5A634E]" />
            <span>Thinking step-by-step...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Recommended Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-shrink-0">
        <span className="text-[11px] font-semibold text-[#8B8374] uppercase flex-shrink-0">Try Asking:</span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedMode(p.mode);
              setUseGoogleSearch(false);
              handleSend(p.label, p.mode);
            }}
            disabled={isLoading}
            className="px-3 py-1 rounded-full bg-white hover:bg-[#F5F2ED] disabled:opacity-50 text-[11px] font-medium text-[#4A4A3A] border border-[#E5E0D8] flex-shrink-0 transition shadow-2xs hover:border-[#5A634E]/40"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="relative flex-shrink-0">
        <div className="p-2 sm:p-2.5 rounded-2xl bg-white border border-[#E5E0D8] focus-within:border-[#5A634E] transition shadow-sm flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={
              useGoogleSearch
                ? 'Search Google Real-Time Web with verified citations...'
                : `Ask any doubt or formula from Class ${classLevel} NCERT...`
            }
            className="flex-1 bg-transparent px-3 text-xs sm:text-sm text-[#4A4A3A] placeholder-[#8B8374] focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || isLoading}
            className="p-2.5 rounded-xl bg-[#5A634E] hover:bg-[#484F3E] disabled:opacity-40 text-white font-bold transition flex items-center justify-center flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
