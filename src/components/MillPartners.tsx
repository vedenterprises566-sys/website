import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Shield, Factory } from 'lucide-react';
import { PARTNER_MILLS } from '../data/partners';

interface MillPartnersProps {
  onSelectPartnerYarns?: (partnerName: string) => void;
}

export const MillPartners: React.FC<MillPartnersProps> = () => {
  return (
    <section id="partners-section" className="py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 m-4 sm:m-[2.5rem] rounded-3xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-3"
        >
          <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
            <Factory className="w-3.5 h-3.5 text-red-600" /> Authorised Trade Relationships
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
            Spinning Mill Partners
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
            Ved Enterprises represents India’s premier textile mills, bringing direct factory pricing, guaranteed lot consistency, and rapid dispatch across India.
          </p>
        </motion.div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PARTNER_MILLS.map((mill, idx) => (
            <motion.div
              key={mill.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 transition-shadow shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Mill Number & Name */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <span className="text-[0.6875rem] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-600 uppercase tracking-wider">
                    {mill.location}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                  {mill.name}
                </h3>

                <p className="text-xs font-bold text-red-600 dark:text-red-400 mt-1">
                  Specialty: {mill.specialty}
                </p>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                  {mill.description}
                </p>

                {/* Key Product Specialties */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-[0.625rem] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Primary Manufactured Qualities
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {mill.keyProducts.map((prod, i) => (
                      <span
                        key={i}
                        className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-[0.6875rem] font-medium px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {prod}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Quality Assurance Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4" /> Direct Mill Warranty & Quality Verification
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif">
              Original Packaging, Factory Invoices & GST Compliant Billing
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              All yarn bales and cones supplied by Ved Enterprises carry original mill tags, certified counts, and standard weight guarantees.
            </p>
          </div>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://wa.me/916280370497?text=Hello%20Ved%20Enterprises,%20I%20would%20like%20to%20know%20mill%20rate%20lists%20and%20minimum%20order%20quantities."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl transition-all shadow-md flex-shrink-0"
          >
            Get Mill Rate Cards
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
};

