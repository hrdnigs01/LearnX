import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Smartphone, Download, CheckCircle2 } from 'lucide-react';
import { AndroidInstallModal } from './AndroidInstallModal';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'compact';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If already installed, don't show prompt in header
  if (isInstalled && variant === 'header') {
    return null;
  }

  const handleClick = async () => {
    // If native install prompt is primed, invoke it directly
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  if (variant === 'compact') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5A634E] hover:bg-[#4A533E] text-white text-xs font-bold transition shadow-xs ${className}`}
          title="Install Android App / APK"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Android APK</span>
        </button>

        <AndroidInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  if (variant === 'banner') {
    return (
      <>
        <div className={`p-4 rounded-2xl bg-gradient-to-r from-[#5A634E] to-[#434B39] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white flex-shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Install LearnX Android App</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.2 rounded-full font-extrabold uppercase">
                  Native APK
                </span>
              </h4>
              <p className="text-xs text-white/80">
                1-tap WebAPK install, offline learning access & instant full-screen mode.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleClick}
              className="px-4 py-2 rounded-xl bg-white text-[#434B39] hover:bg-[#FDFBF7] font-bold text-xs flex items-center gap-1.5 transition shadow-xs whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-[#5A634E]" />
              <span>Get Android App</span>
            </button>
          </div>
        </div>

        <AndroidInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  // Default header variant
  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#5A634E]/10 hover:bg-[#5A634E]/20 text-[#5A634E] font-bold text-xs border border-[#5A634E]/30 transition ${className}`}
        title="Get Android APK & Install App"
      >
        <Smartphone className="w-3.5 h-3.5 text-[#5A634E]" />
        <span className="hidden sm:inline">Get Android APK</span>
        <span className="sm:hidden">App APK</span>
      </button>

      <AndroidInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
