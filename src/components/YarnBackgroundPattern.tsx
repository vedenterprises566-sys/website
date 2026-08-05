import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Real yarn images from local assets
import lurexImg from '../assets/images/lurex_fancy_yarn_1785307540278.jpg';
import chenilleImg from '../assets/images/chenille_plush_yarn_1785307573790.jpg';
import vislonImg from '../assets/images/vislon_imported_yarn_1785307557035.jpg';
import fabricImg from '../assets/images/textile_fabric_rolls_1785307587188.jpg';

interface ClickRipple {
  id: number;
  x: number;
  y: number;
  color: string;
}

export const YarnBackgroundPattern: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, normX: 0.5, normY: 0.5 });
  const [ripples, setRipples] = useState<ClickRipple[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const normX = e.clientX / window.innerWidth;
      const normY = e.clientY / window.innerHeight;
      setMousePos({
        x: e.clientX,
        y: e.clientY,
        normX,
        normY,
      });
    };

    const handleClick = (e: MouseEvent) => {
      const colors = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const newRipple: ClickRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        color: randomColor,
      };

      setRipples((prev) => [...prev.slice(-8), newRipple]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const handleRippleComplete = (id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  };

  // Calculate mouse-influenced bezier control points for reactive yarn streams
  const offsetX = (mousePos.normX - 0.5) * 120;
  const offsetY = (mousePos.normY - 0.5) * 120;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-50 dark:opacity-40">
      
      {/* Interactive Click Ripples */}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.div
            key={r.id}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            onAnimationComplete={() => handleRippleComplete(r.id)}
            style={{
              left: r.x - 50,
              top: r.y - 50,
              borderColor: r.color,
            }}
            className="absolute w-24 h-24 rounded-full border-2 border-dashed shadow-lg"
          />
        ))}
      </AnimatePresence>

      {/* Floating Ambient Glowing Yarn Swatch Orbs that sway with mouse cursor */}
      <motion.div
        animate={{
          x: offsetX * 0.4,
          y: offsetY * 0.4 - 15,
          rotate: (mousePos.normX - 0.5) * 12,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        className="absolute -top-10 -left-10 w-72 h-72 sm:w-96 sm:h-96 rounded-full overflow-hidden border-4 border-amber-500/30 shadow-2xl opacity-35 blur-[1.5px]"
      >
        <img src={lurexImg} alt="Lurex Yarn Swatch" className="w-full h-full object-cover" />
      </motion.div>

      <motion.div
        animate={{
          x: -offsetX * 0.5,
          y: offsetY * 0.5 + 10,
          rotate: (0.5 - mousePos.normY) * 15,
        }}
        transition={{ type: 'spring', stiffness: 45, damping: 18 }}
        className="absolute top-1/3 -right-16 w-80 h-80 sm:w-[28rem] sm:h-[28rem] rounded-full overflow-hidden border-4 border-red-500/30 shadow-2xl opacity-30 blur-[1.5px]"
      >
        <img src={chenilleImg} alt="Chenille Yarn Swatch" className="w-full h-full object-cover" />
      </motion.div>

      <motion.div
        animate={{
          x: offsetX * 0.6,
          y: -offsetY * 0.6 - 20,
          scale: 1 + Math.abs(mousePos.normX - 0.5) * 0.08,
        }}
        transition={{ type: 'spring', stiffness: 40, damping: 22 }}
        className="absolute bottom-10 -left-20 w-80 h-80 sm:w-[30rem] sm:h-[30rem] rounded-full overflow-hidden border-4 border-blue-500/30 shadow-2xl opacity-30 blur-[2px]"
      >
        <img src={vislonImg} alt="Vislon Yarn Swatch" className="w-full h-full object-cover" />
      </motion.div>

      <motion.div
        animate={{
          x: -offsetX * 0.3,
          y: -offsetY * 0.3 + 15,
          rotate: (mousePos.normY - 0.5) * 10,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        className="absolute bottom-1/4 right-10 w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-emerald-500/30 shadow-2xl opacity-25 blur-[1.5px]"
      >
        <img src={fabricImg} alt="Textile Rolls Swatch" className="w-full h-full object-cover" />
      </motion.div>

      {/* Dynamic Mouse-Interactive Yarn Thread Streams */}
      <svg
        className="w-full h-full absolute inset-0"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
      >
        <defs>
          <linearGradient id="yarnRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#DC2626" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#7F1D1D" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="yarnGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#D97706" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#78350F" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="yarnBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#2563EB" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="yarnEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#059669" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#064E3B" stopOpacity="0.2" />
          </linearGradient>

          <filter id="yarnGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Stream 1: Crimson Red Active Yarn Wave */}
        <motion.path
          d={`M -100,150 C ${300 + offsetX},${50 + offsetY} ${600 - offsetX},${300 - offsetY} ${900 + offsetX},${100 + offsetY} C 1200,-10 1400,200 1600,120`}
          fill="none"
          stroke="url(#yarnRedGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#yarnGlow)"
          transition={{ type: 'spring', stiffness: 35, damping: 15 }}
        />

        {/* Companion Red Stitch Thread */}
        <motion.path
          d={`M -100,155 C ${300 + offsetX * 0.9},${55 + offsetY * 0.9} ${600 - offsetX * 0.9},${305 - offsetY * 0.9} ${900 + offsetX * 0.9},${105 + offsetY * 0.9} C 1200,-5 1400,205 1600,125`}
          fill="none"
          stroke="#F87171"
          strokeWidth="1.5"
          strokeDasharray="5 3"
          transition={{ type: 'spring', stiffness: 30, damping: 12 }}
        />

        {/* Stream 2: Golden Lurex Twist Metallic Thread */}
        <motion.path
          d={`M -100,350 C ${200 - offsetX},${550 + offsetY} ${500 + offsetX},${200 - offsetY} ${850 - offsetX},${450 + offsetY} C 1150,650 1350,300 1600,420`}
          fill="none"
          stroke="url(#yarnGoldGrad)"
          strokeWidth="3.5"
          strokeDasharray="8 4"
          filter="url(#yarnGlow)"
          transition={{ type: 'spring', stiffness: 40, damping: 16 }}
        />

        {/* Stream 3: Royal Blue Vislon Wave Thread */}
        <motion.path
          d={`M -100,600 C ${350 + offsetX * 1.2},${450 - offsetY * 1.2} ${700 - offsetX * 1.2},${750 + offsetY * 1.2} ${1000 + offsetX * 1.2},${550 - offsetY * 1.2} C 1250,400 1450,700 1600,650`}
          fill="none"
          stroke="url(#yarnBlueGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
          transition={{ type: 'spring', stiffness: 35, damping: 15 }}
        />

        {/* Stream 4: Emerald Green Acrylic Blend Accent Thread */}
        <motion.path
          d={`M -100,750 C ${400 - offsetX * 0.8},${650 + offsetY * 0.8} ${800 + offsetX * 0.8},${800 - offsetY * 0.8} ${1100 - offsetX * 0.8},${680 + offsetY * 0.8} C 1300,550 1500,780 1650,720`}
          fill="none"
          stroke="url(#yarnEmeraldGrad)"
          strokeWidth="3"
          strokeDasharray="4 2"
          transition={{ type: 'spring', stiffness: 45, damping: 18 }}
        />
      </svg>
    </div>
  );
};
