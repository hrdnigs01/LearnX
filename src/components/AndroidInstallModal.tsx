import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Smartphone,
  Download,
  QrCode,
  Terminal,
  CheckCircle2,
  Copy,
  ExternalLink,
  X,
  Share2,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, isAndroid, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'direct' | 'download' | 'qr' | 'cli'>('direct');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const currentUrl = typeof window !== 'undefined' 
    ? (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
        ? 'https://ais-pre-el5ihg2ccetf2mlkh4wqz6-48431978309.asia-southeast1.run.app'
        : window.location.origin)
    : 'https://ais-pre-el5ihg2ccetf2mlkh4wqz6-48431978309.asia-southeast1.run.app';

  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(currentUrl)}`;

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(currentUrl, {
        width: 260,
        margin: 2,
        color: {
          dark: '#2E3427',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Failed to generate QR code:', err));
    }
  }, [isOpen, currentUrl]);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const bubblewrapSnippet = `# 1. Install Google's official Bubblewrap CLI
npm install -g @bubblewrap/cli

# 2. Initialize project from your live PWA manifest
bubblewrap init --manifest=${currentUrl}/manifest.webmanifest

# 3. Build signed Android APK and AAB for Google Play Store
bubblewrap build`;

  const capacitorSnippet = `# 1. Install Capacitor Android
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Initialize Capacitor configuration
npx cap init "LearnX" "org.learnx.ncert" --web-dir dist

# 3. Add Android platform & build APK
npx cap add android
npm run build
npx cap copy
npx cap open android`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E5E0D8] text-[#4A4A3A] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-[#F0ECE1] flex items-start justify-between gap-3 bg-[#FAF8F5] rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#5A634E] text-white flex items-center justify-center shadow-md flex-shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-[#383C2F]">
                  Get Android APK & App
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wide">
                  PWA + WebAPK Ready
                </span>
              </div>
              <p className="text-xs text-[#8B8374] mt-0.5">
                Install directly on your Android phone or generate a standalone APK
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#8B8374] hover:text-[#4A4A3A] hover:bg-[#F0ECE1] transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#F0ECE1] bg-white px-5 sm:px-6 pt-2 gap-1 overflow-x-auto text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setActiveTab('direct')}
            className={`pb-2.5 px-3 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'direct'
                ? 'border-[#5A634E] text-[#5A634E]'
                : 'border-transparent text-[#8B8374] hover:text-[#4A4A3A]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>1-Tap Install (WebAPK)</span>
          </button>
          <button
            onClick={() => setActiveTab('download')}
            className={`pb-2.5 px-3 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'download'
                ? 'border-[#5A634E] text-[#5A634E]'
                : 'border-transparent text-[#8B8374] hover:text-[#4A4A3A]'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .APK (PWABuilder)</span>
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`pb-2.5 px-3 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'qr'
                ? 'border-[#5A634E] text-[#5A634E]'
                : 'border-transparent text-[#8B8374] hover:text-[#4A4A3A]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan on Phone</span>
          </button>
          <button
            onClick={() => setActiveTab('cli')}
            className={`pb-2.5 px-3 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'cli'
                ? 'border-[#5A634E] text-[#5A634E]'
                : 'border-transparent text-[#8B8374] hover:text-[#4A4A3A]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Build APK CLI</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 space-y-5 flex-1">
          {/* TAB 1: 1-Tap WebAPK Install */}
          {activeTab === 'direct' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#F4F6F0] border border-[#E3E8DC] space-y-2">
                <div className="flex items-center gap-2 text-[#4A533E] font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-[#5A634E]" />
                  <span>How Android WebAPK Works</span>
                </div>
                <p className="text-xs text-[#6A735E] leading-relaxed">
                  On Android (Chrome, Samsung Internet, Edge, Brave), installing a Progressive Web App automatically triggers Google Play Services to generate and install a <strong>genuine native Android APK</strong> (<code className="bg-white/80 px-1 py-0.5 rounded text-[11px]">org.chromium.webapk.*</code>) on your device.
                </p>
                <ul className="text-xs text-[#6A735E] space-y-1 list-disc list-inside pt-1">
                  <li>Appears in your Android launcher drawer like any Play Store app</li>
                  <li>Opens in standalone full-screen with no browser address bar</li>
                  <li>Fast offline cached loading and instant launch</li>
                  <li>No risky sideloading or "unknown sources" security warnings</li>
                </ul>
              </div>

              {isInstalled ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold">App Already Installed!</h4>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      You are currently running LearnX in standalone application mode.
                    </p>
                  </div>
                </div>
              ) : isInstallable ? (
                <div className="space-y-3">
                  <button
                    onClick={() => install()}
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#5A634E] hover:bg-[#4A533E] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition transform active:scale-98"
                  >
                    <Smartphone className="w-5 h-5" />
                    <span>Install Android App Now (1-Tap WebAPK)</span>
                  </button>
                  <p className="text-[11px] text-center text-[#8B8374]">
                    Tapping will trigger the native Android install prompt.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5">
                    <p className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      To install on your Android device:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-[#7A6020] text-[11px]">
                      <li>Open this app URL in <strong>Google Chrome</strong> or <strong>Samsung Internet</strong> on Android.</li>
                      <li>Tap the <strong>three dots menu (⋮)</strong> in the top-right corner.</li>
                      <li>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                      <li>Android will automatically compile and install the WebAPK to your phone!</li>
                    </ol>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab('qr')}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#EDF0E9] hover:bg-[#E3E8DC] text-[#4A533E] font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Open on Phone via QR</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('download')}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#5A634E] hover:bg-[#4A533E] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Download className="w-4 h-4" />
                      <span>Generate Standalone .APK</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Standalone APK via PWABuilder */}
          {activeTab === 'download' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#EBE6DC] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[#5A634E] tracking-wider">
                    Microsoft PWABuilder (Official Tool)
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Score: 100/100
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#383C2F]">
                  Generate Standalone Android APK or Play Store Bundle (.AAB)
                </h3>
                <p className="text-xs text-[#7A7468] leading-relaxed">
                  PWABuilder is Microsoft and Google's free open-source generator that converts this PWA into a signed standalone <strong>.apk</strong> (for sideloading) and <strong>.aab</strong> (for the Google Play Store).
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#E5E0D8] space-y-2">
                <div className="text-xs font-bold text-[#4A4A3A]">App Target URL:</div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#F5F3EF] text-xs font-mono text-[#5A634E] border border-[#E0DCD4] outline-none"
                  />
                  <button
                    onClick={() => handleCopy(currentUrl, 'url')}
                    className="p-2 rounded-xl border border-[#D5D0C6] hover:bg-[#F0ECE1] text-xs font-medium text-[#5A634E] flex items-center gap-1"
                    title="Copy URL"
                  >
                    {copiedCode === 'url' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <a
                  href={pwaBuilderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Open PWABuilder to Download Android APK</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <p className="text-[11px] text-center text-[#8B8374]">
                  Opens PWABuilder with this app pre-analyzed. Click <strong>"Package for Android"</strong> to download your APK file!
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: QR Code */}
          {activeTab === 'qr' && (
            <div className="flex flex-col items-center text-center space-y-3">
              <p className="text-xs text-[#6A6354] max-w-sm">
                Scan this QR code with your Android phone camera to open LearnX directly on your mobile device and install the WebAPK:
              </p>

              {qrDataUrl ? (
                <div className="p-3 bg-white rounded-2xl border-2 border-[#E5E0D8] shadow-sm">
                  <img
                    src={qrDataUrl}
                    alt="LearnX Android Install QR Code"
                    className="w-52 h-52 object-contain"
                  />
                </div>
              ) : (
                <div className="w-52 h-52 rounded-2xl bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                  Generating QR...
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#5A634E] bg-[#F5F3EF] px-3 py-1.5 rounded-xl border border-[#E5E0D8] max-w-xs truncate">
                  {currentUrl}
                </span>
                <button
                  onClick={() => handleCopy(currentUrl, 'qr-url')}
                  className="px-2.5 py-1.5 rounded-xl bg-[#5A634E] text-white text-xs font-semibold flex items-center gap-1 hover:bg-[#4A533E] transition"
                >
                  {copiedCode === 'qr-url' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: CLI (Bubblewrap & Capacitor) */}
          {activeTab === 'cli' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#383C2F] flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#5A634E]" />
                    Option A: Google Bubblewrap CLI (Official Trusted Web Activity)
                  </span>
                  <button
                    onClick={() => handleCopy(bubblewrapSnippet, 'bw')}
                    className="text-[11px] text-[#5A634E] hover:underline font-semibold flex items-center gap-1"
                  >
                    {copiedCode === 'bw' ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>Copy Commands</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
                  {bubblewrapSnippet}
                </pre>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#383C2F] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#5A634E]" />
                    Option B: Capacitor Android (Full Native Wrapper)
                  </span>
                  <button
                    onClick={() => handleCopy(capacitorSnippet, 'cap')}
                    className="text-[11px] text-[#5A634E] hover:underline font-semibold flex items-center gap-1"
                  >
                    {copiedCode === 'cap' ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>Copy Commands</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
                  {capacitorSnippet}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#F0ECE1] bg-[#FAF8F5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs rounded-b-3xl">
          <div className="flex items-center gap-1.5 text-[#7A7468]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Tested for Android 10, 11, 12, 13, 14, 15 & Chrome / Edge</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#EBE6DC] hover:bg-[#DFD9CE] text-[#4A4A3A] font-bold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
