import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogoGraphic } from './LogoGraphic';

interface LaunchCountdownProps {
  onPreviewLaunch?: () => void;
  onLaunchComplete?: () => void;
}

export const LaunchCountdown: React.FC<LaunchCountdownProps> = ({ onPreviewLaunch, onLaunchComplete }) => {
  // Target Launch Date: 7 August 2026 00:00:00 IST
  const targetDate = new Date('2026-08-07T00:00:00+05:30').getTime();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Final 10-second dramatic countdown state
  const [finalCount, setFinalCount] = useState<number | null>(null);

  // Check main timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (finalCount === null) {
          setFinalCount(10);
        }
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
  }, [targetDate, finalCount]);

  // Handle final 10-second countdown tick
  useEffect(() => {
    if (finalCount === null) return;

    if (finalCount <= 0) {
      // Trigger launch exit transition
      if (onLaunchComplete) onLaunchComplete();
      else if (onPreviewLaunch) onPreviewLaunch();
      return;
    }

    const timer = setTimeout(() => {
      setFinalCount((prev) => (prev !== null ? prev - 1 : 0));
    }, 1000);

    return () => clearTimeout(timer);
  }, [finalCount, onLaunchComplete, onPreviewLaunch]);

  // Trigger test preview of 10s countdown
  const handleStart10sPreview = () => {
    setFinalCount(10);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.1,
        filter: 'blur(20px)',
        transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] }
      }}
      className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-center p-4 font-sans select-none overflow-hidden"
    >
      {/* Dynamic Ambient Glow */}
      <div className={`absolute w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 ${
        finalCount !== null ? 'bg-red-600/30 scale-125' : 'bg-red-600/15 animate-pulse'
      }`} />

      <main className="relative z-10 text-center space-y-8 max-w-3xl mx-auto px-4">
        {/* Brand Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-4"
        >
          <LogoGraphic size="md" showText={false} />
          <div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-widest uppercase text-white">
              VED ENTERPRISES
            </h1>
            <p className="text-xs sm:text-sm text-red-500 font-semibold tracking-[0.3em] uppercase mt-1">
              {finalCount !== null ? '🚀 WEBSITE LAUNCH IN PROGRESS' : 'Official Website Launching Soon'}
            </p>
          </div>
        </motion.div>

        {/* Conditional Rendering: Main Days/Hours/Mins OR Final 10-Second Countdown */}
        <AnimatePresence mode="wait">
          {finalCount !== null ? (
            /* DRAMATIC FINAL 10-SECOND COUNTDOWN VIEW */
            <motion.div
              key="final-10s"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.4 }}
              className="py-8 space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 border border-red-500/40 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-xs">
                <span>WEBSITE GOING LIVE IN</span>
              </div>

              {/* Pulsing 10s Number Display */}
              <div className="h-44 sm:h-56 flex items-center justify-center">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={finalCount}
                    initial={{ scale: 2.2, opacity: 0, filter: 'blur(10px)' }}
                    animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                    exit={{ scale: 0.5, opacity: 0, filter: 'blur(6px)' }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="text-8xl sm:text-[11rem] font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-red-500 via-amber-400 to-red-600 drop-shadow-[0_0_40px_rgba(239,68,68,0.6)]"
                  >
                    {finalCount}
                  </motion.span>
                </AnimatePresence>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-bold uppercase tracking-widest animate-pulse">
                Preparing Wholesale Yarn Catalog & Mill Showcase...
              </p>
            </motion.div>
          ) : (
            /* STANDARD MAIN COUNTDOWN DISPLAY (DAYS : HOURS : MINS : SECS) */
            <motion.div
              key="standard-timer"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-4 gap-3 sm:gap-6 py-4">
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
              </div>

              {/* Date Target */}
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-widest uppercase">
                  7 August 2026 • 00:00 Midnight IST
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
};
