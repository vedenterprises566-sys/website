import React, { useState } from 'react';
import { motion } from 'motion/react';

interface HangingYarnThreadsProps {
  className?: string;
  variant?: 'hero' | 'header' | 'banner';
}

export const HangingYarnThreads: React.FC<HangingYarnThreadsProps> = ({
  className = '',
  variant = 'hero',
}) => {
  const [hoveredThread, setHoveredThread] = useState<number | null>(null);

  // Colorful yarn speckles / neps floating in background
  const yarnNeps = [
    { x: '8%', y: '18%', r: 3, color: '#EF4444' },
    { x: '16%', y: '32%', r: 2.5, color: '#F59E0B' },
    { x: '24%', y: '12%', r: 3.5, color: '#3B82F6' },
    { x: '32%', y: '45%', r: 2, color: '#10B981' },
    { x: '42%', y: '22%', r: 3, color: '#EC4899' },
    { x: '52%', y: '38%', r: 2.5, color: '#8B5CF6' },
    { x: '62%', y: '15%', r: 3, color: '#F59E0B' },
    { x: '72%', y: '28%', r: 2, color: '#06B6D4' },
    { x: '82%', y: '10%', r: 3.5, color: '#EF4444' },
    { x: '92%', y: '35%', r: 2.5, color: '#10B981' },
    { x: '12%', y: '65%', r: 2, color: '#3B82F6' },
    { x: '28%', y: '78%', r: 3, color: '#8B5CF6' },
    { x: '48%', y: '82%', r: 2.5, color: '#F59E0B' },
    { x: '68%', y: '72%', r: 2, color: '#EF4444' },
    { x: '88%', y: '68%', r: 3, color: '#06B6D4' },
  ];

  // Vertical dangling strands
  const verticalThreads = [
    { id: 1, x: '6%', height: 80, color: '#2563EB', width: 3.5, delay: 0 },
    { id: 2, x: '18%', height: 110, color: '#DC2626', width: 3, delay: 0.3 },
    { id: 3, x: '32%', height: 65, color: '#F59E0B', width: 3.5, delay: 0.6 },
    { id: 4, x: '48%', height: 95, color: '#10B981', width: 2.5, delay: 0.2 },
    { id: 5, x: '64%', height: 120, color: '#8B5CF6', width: 4, delay: 0.5 },
    { id: 6, x: '79%', height: 75, color: '#EC4899', width: 3, delay: 0.1 },
    { id: 7, x: '92%', height: 100, color: '#2563EB', width: 3.5, delay: 0.4 },
  ];

  return (
    <div
      className={`absolute top-0 left-0 right-0 pointer-events-none z-30 overflow-hidden ${className}`}
      style={{ height: variant === 'header' ? '2.8125rem' : variant === 'hero' ? '11.25rem' : '7.5rem' }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 180"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="yarn-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#0f172a" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Scattered Colorful Fiber Neps Speckles */}
        <g className="opacity-70">
          {yarnNeps.map((nep, idx) => (
            <motion.circle
              key={idx}
              cx={nep.x}
              cy={nep.y}
              r={nep.r}
              fill={nep.color}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{
                scale: [0.8, 1.3, 0.8],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3 + (idx % 3),
                repeat: Infinity,
                ease: 'easeInOut',
                delay: idx * 0.2,
              }}
            />
          ))}
        </g>

        {/* Primary Draped / Looping Yarn Wave Line */}
        {variant === 'hero' && (
          <g filter="url(#yarn-shadow)">
            {/* Main Vibrant Royal Blue Thread Loop Wave */}
            <motion.path
              d="M 20,80 C 70,25 120,40 170,95 C 210,125 240,65 290,65 C 340,65 370,110 420,90 C 470,70 510,95 560,95 C 600,95 620,20 650,20 C 680,20 700,120 730,125 C 760,130 780,50 810,50 C 840,50 860,115 890,135 C 920,155 940,60 970,60 C 1000,60 1020,110 1060,110 C 1100,110 1140,75 1180,75"
              fill="none"
              stroke="#2563EB"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{
                d: [
                  "M 20,80 C 70,25 120,40 170,95 C 210,125 240,65 290,65 C 340,65 370,110 420,90 C 470,70 510,95 560,95 C 600,95 620,20 650,20 C 680,20 700,120 730,125 C 760,130 780,50 810,50 C 840,50 860,115 890,135 C 920,155 940,60 970,60 C 1000,60 1020,110 1060,110 C 1100,110 1140,75 1180,75",
                  "M 20,85 C 70,30 120,35 170,90 C 210,120 240,70 290,60 C 340,60 370,115 420,85 C 470,75 510,90 560,100 C 600,100 620,25 650,15 C 680,15 700,115 730,130 C 760,125 780,55 810,45 C 840,45 860,120 890,130 C 920,150 940,65 970,55 C 1000,55 1020,115 1060,105 C 1100,105 1140,80 1180,70",
                  "M 20,80 C 70,25 120,40 170,95 C 210,125 240,65 290,65 C 340,65 370,110 420,90 C 470,70 510,95 560,95 C 600,95 620,20 650,20 C 680,20 700,120 730,125 C 760,130 780,50 810,50 C 840,50 860,115 890,135 C 920,155 940,60 970,60 C 1000,60 1020,110 1060,110 C 1100,110 1140,75 1180,75",
                ],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Companion Textured Thread for Twist Effect */}
            <path
              d="M 20,82 C 70,27 120,42 170,97 C 210,127 240,67 290,67 C 340,67 370,112 420,92 C 470,72 510,97 560,97 C 600,97 620,22 650,22 C 680,22 700,122 730,127 C 760,132 780,52 810,52 C 840,52 860,117 890,137 C 920,157 940,62 970,62 C 1000,62 1020,112 1060,112 C 1100,112 1140,77 1180,77"
              fill="none"
              stroke="#60A5FA"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity="0.8"
            />

            {/* Accent Red Secondary Thread Arc */}
            <path
              d="M 50,40 Q 200,110 380,45 T 700,90 T 1100,50"
              fill="none"
              stroke="#DC2626"
              strokeWidth="2.5"
              opacity="0.75"
            />

            {/* Accent Golden Amber Thread Arc */}
            <path
              d="M 100,90 Q 300,30 550,110 T 950,40 T 1150,100"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeDasharray="3 1"
              opacity="0.7"
            />
          </g>
        )}

        {/* Interactive Vertical Dangling Threads */}
        <g>
          {verticalThreads.map((vt) => {
            const h = variant === 'header' ? Math.min(vt.height, 35) : vt.height;
            const isPlucked = hoveredThread === vt.id;

            return (
              <g
                key={vt.id}
                onMouseEnter={() => setHoveredThread(vt.id)}
                onMouseLeave={() => setHoveredThread(null)}
                className="cursor-pointer group pointer-events-auto"
              >
                {/* Knot at top */}
                <circle cx={vt.x} cy="3" r="3" fill={vt.color} />
                
                {/* Vertical strand with pluck response */}
                <motion.path
                  d={`M ${vt.x} 0 Q calc(${vt.x} + ${isPlucked ? '1.5rem' : vt.id % 2 === 0 ? '0.375rem' : '-0.375rem'}) ${h * 0.5} ${vt.x} ${h}`}
                  fill="none"
                  stroke={isPlucked ? '#F59E0B' : vt.color}
                  strokeWidth={isPlucked ? vt.width + 1.5 : vt.width}
                  strokeLinecap="round"
                  opacity={isPlucked ? 1 : 0.85}
                  animate={
                    isPlucked
                      ? {
                          d: [
                            `M ${vt.x} 0 Q calc(${vt.x} + 2rem) ${h * 0.5} ${vt.x} ${h}`,
                            `M ${vt.x} 0 Q calc(${vt.x} - 1.5rem) ${h * 0.5} ${vt.x} ${h}`,
                            `M ${vt.x} 0 Q calc(${vt.x} + 0.8rem) ${h * 0.5} ${vt.x} ${h}`,
                            `M ${vt.x} 0 Q calc(${vt.x} - 0.4rem) ${h * 0.5} ${vt.x} ${h}`,
                            `M ${vt.x} 0 Q calc(${vt.x} + 0.2rem) ${h * 0.5} ${vt.x} ${h}`,
                          ],
                        }
                      : {
                          d: [
                            `M ${vt.x} 0 Q calc(${vt.x} + ${vt.id % 2 === 0 ? '0.375rem' : '-0.375rem'}) ${h * 0.5} ${vt.x} ${h}`,
                            `M ${vt.x} 0 Q calc(${vt.x} + ${vt.id % 2 === 0 ? '-0.375rem' : '0.375rem'}) ${h * 0.5} ${vt.x} ${h}`,
                            `M ${vt.x} 0 Q calc(${vt.x} + ${vt.id % 2 === 0 ? '0.375rem' : '-0.375rem'}) ${h * 0.5} ${vt.x} ${h}`,
                          ],
                        }
                  }
                  transition={
                    isPlucked
                      ? { duration: 0.6, ease: 'easeOut' }
                      : { duration: 4 + vt.delay, repeat: Infinity, ease: 'easeInOut' }
                  }
                />
                
                {/* End Knot/Tassel with pulse on hover */}
                <motion.circle
                  cx={vt.x}
                  cy={h}
                  r={isPlucked ? vt.width * 1.6 : vt.width * 0.9}
                  fill={isPlucked ? '#F59E0B' : vt.color}
                  transition={{ type: 'spring', stiffness: 300 }}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
