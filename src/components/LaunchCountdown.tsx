import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LogoGraphic } from './LogoGraphic';

interface LaunchCountdownProps {
  onPreviewLaunch?: () => void;
}

export const LaunchCountdown: React.FC<LaunchCountdownProps> = ({ onPreviewLaunch }) => {
  // Target Launch Date: 7 August 2026 00:00:00 IST
  const targetDate = new Date('2026-08-07T00:00:00+05:30').getTime();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.08,
        filter: 'blur(16px)',
        transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
      }}
      className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-center p-4 font-sans select-none overflow-hidden"
    >
      {/* Subtle Ambient Red Glow */}
      <div className="absolute w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>

      <main className="relative z-10 text-center space-y-8 max-w-3xl mx-auto px-4">
        {/* Brand Logo & Name */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col items-center gap-4"
        >
          <LogoGraphic className="w-16 h-16 shadow-2xl rounded-2xl border border-white/10" />
          <div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-widest uppercase text-white">
              VED ENTERPRISES
            </h1>
            <p className="text-xs sm:text-sm text-red-500 font-semibold tracking-[0.3em] uppercase mt-1">
              Official Website Launching Soon
            </p>
          </div>
        </motion.div>

        {/* Minimalist Full Screen Countdown Timer */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-4 gap-3 sm:gap-6 py-6"
        >
          {/* Days */}
          <div className="flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur-md">
            <span className="text-4xl sm:text-7xl md:text-8xl font-black font-mono tracking-tight text-white">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-[0.65rem] sm:text-xs font-bold uppercase tracking-[0.25em] text-red-400 mt-2">
              Days
            </span>
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur-md">
            <span className="text-4xl sm:text-7xl md:text-8xl font-black font-mono tracking-tight text-white">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[0.65rem] sm:text-xs font-bold uppercase tracking-[0.25em] text-red-400 mt-2">
              Hours
            </span>
          </div>

          {/* Minutes */}
          <div className="flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur-md">
            <span className="text-4xl sm:text-7xl md:text-8xl font-black font-mono tracking-tight text-white">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[0.65rem] sm:text-xs font-bold uppercase tracking-[0.25em] text-red-400 mt-2">
              Minutes
            </span>
          </div>

          {/* Seconds */}
          <div className="flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur-md border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
            <span className="text-4xl sm:text-7xl md:text-8xl font-black font-mono tracking-tight text-red-500 animate-pulse">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[0.65rem] sm:text-xs font-bold uppercase tracking-[0.25em] text-slate-400 mt-2">
              Seconds
            </span>
          </div>
        </motion.div>

        {/* Clean Date Target & Preview Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-widest uppercase">
            7 August 2026 • 00:00 Midnight IST
          </p>

          {onPreviewLaunch && (
            <button
              onClick={onPreviewLaunch}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-2.5 rounded-full text-xs border border-white/20 transition-all shadow-lg cursor-pointer backdrop-blur-md hover:scale-105 active:scale-95"
            >
              <span>✨ Preview Launch Transition Animation</span>
            </button>
          )}
        </motion.div>
      </main>
    </motion.div>
  );
};
