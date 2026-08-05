import React, { useState, useEffect } from 'react';
import { Clock, Sparkles, Phone, ShieldCheck, ArrowRight, Eye } from 'lucide-react';
import { LogoGraphic } from './LogoGraphic';

interface LaunchCountdownProps {
  onBypass?: () => void;
}

export const LaunchCountdown: React.FC<LaunchCountdownProps> = ({ onBypass }) => {
  // Target Launch Date: 7 August 2026 00:00:00 IST
  const targetDate = new Date('2026-08-07T00:00:00+05:30').getTime();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isLaunched: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isLaunched: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isLaunched: true });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isLaunched: false });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-red-600 selection:text-white">
      {/* Background Animated Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/20 blur-3xl rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 blur-3xl rounded-full pointer-events-none"></div>

      {/* Top Header Bar */}
      <header className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between py-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <LogoGraphic className="w-10 h-10 shadow-lg rounded-xl" />
          <div>
            <h1 className="font-serif font-bold text-lg tracking-wider text-white">VED ENTERPRISES</h1>
            <p className="text-[0.65rem] text-slate-400 font-semibold tracking-widest uppercase">Ludhiana Textile & Yarn Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full text-xs text-amber-400 font-semibold shadow-inner">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Official Launch Countdown</span>
        </div>
      </header>

      {/* Main Countdown Center Card */}
      <main className="relative z-10 max-w-4xl w-full mx-auto my-auto py-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-red-950/80 border border-red-500/30 text-red-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest animate-bounce shadow-lg">
          <Clock className="w-4 h-4" />
          <span>Launch Date: 7 August 2026 • 00:00 Midnight IST</span>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-serif tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
            Something Extraordinary <br /> Is Spinning Into Reality.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto font-light">
            Northern India's premier wholesale yarn catalog, mill shade cards, and instant quotation engine launching officially on <span className="text-red-400 font-bold">August 7 at 00:00 IST</span>.
          </p>
        </div>

        {/* Countdown Digits Grid */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-2xl mx-auto pt-4">
          {/* Days */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-6 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center group hover:border-red-500/50 transition-all">
            <span className="text-3xl sm:text-6xl font-black font-mono text-white tracking-tight group-hover:scale-105 transition-transform">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-[0.65rem] sm:text-xs font-extrabold uppercase tracking-widest text-red-500 mt-1 sm:mt-2">
              Days
            </span>
          </div>

          {/* Hours */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-6 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center group hover:border-red-500/50 transition-all">
            <span className="text-3xl sm:text-6xl font-black font-mono text-white tracking-tight group-hover:scale-105 transition-transform">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[0.65rem] sm:text-xs font-extrabold uppercase tracking-widest text-red-500 mt-1 sm:mt-2">
              Hours
            </span>
          </div>

          {/* Minutes */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-6 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center group hover:border-red-500/50 transition-all">
            <span className="text-3xl sm:text-6xl font-black font-mono text-white tracking-tight group-hover:scale-105 transition-transform">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[0.65rem] sm:text-xs font-extrabold uppercase tracking-widest text-red-500 mt-1 sm:mt-2">
              Minutes
            </span>
          </div>

          {/* Seconds */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-6 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center group hover:border-red-500/50 transition-all">
            <span className="text-3xl sm:text-6xl font-black font-mono text-red-500 tracking-tight animate-pulse group-hover:scale-105 transition-transform">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[0.65rem] sm:text-xs font-extrabold uppercase tracking-widest text-slate-400 mt-1 sm:mt-2">
              Seconds
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <a
            href="https://wa.me/917986716117?text=Hello%20Ved%20Enterprises,%20I%20want%20early%20wholesale%20yarn%20quotation"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm transition-all shadow-xl hover:shadow-emerald-600/30 flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Early Wholesale WhatsApp Inquiry</span>
          </a>

          {onBypass && (
            <button
              onClick={onBypass}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm transition-all shadow-md flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Preview Website Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </main>

      {/* Footer Info Bar */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>MD Moni Maurya: <strong>+91 7986716117</strong> | MD Sandeep Maurya: <strong>+91 8556949433</strong></span>
        </div>
        <p className="text-[0.7rem] text-slate-500">
          Ved Enterprises • Dharampura, Ludhiana-141008
        </p>
      </footer>
    </div>
  );
};
