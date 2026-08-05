import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Check } from 'lucide-react';

export interface FlyingItem {
  id: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  imageUrl?: string;
  name: string;
}

interface FlyToBasketAnimationProps {
  flyingItems: FlyingItem[];
  onAnimationComplete: (id: string) => void;
}

export const FlyToBasketAnimation: React.FC<FlyToBasketAnimationProps> = ({
  flyingItems,
  onAnimationComplete,
}) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {flyingItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{
              x: item.startX,
              y: item.startY,
              scale: 5.0,
              opacity: 1,
              rotate: 0,
            }}
            animate={{
              x: [item.startX, (item.startX + item.targetX) / 2 - 40, item.targetX],
              y: [item.startY, Math.min(item.startY, item.targetY) - 90, item.targetY],
              scale: [1.8, 1.25, 1.2],
              opacity: [1, 1, 0.9],
              rotate: [0, -20, 20],
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 0.75,
              ease: [0.25, 1, 0.5, 1],
            }}
            onAnimationComplete={() => onAnimationComplete(item.id)}
            className="fixed top-0 left-0 -ml-6 -mt-6 z-50"
          >
            <div className="relative flex items-center justify-center bg-red-600 text-white rounded-2xl p-1.5 shadow-2xl border-2 border-amber-300 ring-4 ring-red-500/30">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-10 h-10 object-cover rounded-xl border border-white/40"
                />
              ) : (
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-amber-300" />
                </div>
              )}
              <div className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 font-black text-[0.625rem] px-1.5 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
