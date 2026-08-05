import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ArrowRight, ShoppingBag, X } from 'lucide-react';

interface ToastData {
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
}

interface BasketToastProps {
  toast: ToastData | null;
  onClose: () => void;
  onGoToBasket: () => void;
}

export const BasketToast: React.FC<BasketToastProps> = ({
  toast,
  onClose,
  onGoToBasket,
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="pointer-events-auto max-w-sm bg-slate-900 dark:bg-slate-800 text-white p-4 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-3"
          >
            {toast.imageUrl ? (
              <img
                src={toast.imageUrl}
                alt=""
                className="w-12 h-12 object-cover rounded-xl border border-white/20 flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <h4 className="text-xs font-bold text-white truncate">{toast.title}</h4>
              </div>
              <p className="text-[0.6875rem] text-slate-300 truncate mt-0.5">{toast.subtitle}</p>

              <button
                onClick={onGoToBasket}
                className="mt-2 inline-flex items-center gap-1 text-[0.6875rem] font-bold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>Open Enquiry Basket</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 text-slate-400 hover:text-white transition-colors align-self-start"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
