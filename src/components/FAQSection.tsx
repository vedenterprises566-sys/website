import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { generateFAQSchema } from '../utils/seoUtils';
import { SEOHead } from './SEOHead';

export const FAQ_DATA = [
  {
    question: 'Who is VED Enterprises?',
    answer: 'VED Enterprises is a B2B yarn trader and bulk yarn supplier based in Ludhiana, Punjab, India. Managed by Moni Maurya and Sandeep Maurya, we distribute premium mill yarns, imported China yarns, and fancy yarns to textile manufacturers across India.',
  },
  {
    question: 'What types of yarn does VED Enterprises supply?',
    answer: 'We supply premium Fancy Yarns, Imported Yarns, Acrylic, Wool, Nylon, Polyester, MX Lurex, Embroidery Threads & Jari/Zari, also dealing in Fabrics and Winter Garments.',
  },
  {
    question: 'Does VED Enterprises supply yarn in bulk?',
    answer: 'Yes, VED Enterprises specializes exclusively in B2B wholesale and bulk yarn supply for sweater manufacturers, hosiery units, weaving mills, and garment factories.',
  },
  {
    question: 'Where does VED Enterprises supply yarn?',
    answer: 'We supply yarn nationwide across India. Our main dispatch center is in Ludhiana (Punjab), shipping regularly to Surat, Ahmedabad, Tirupur, Kolkata, Panipat, Bhilwara, Mumbai, Kanpur, and Delhi NCR.',
  },
  {
    question: 'How can I request a quotation?',
    answer: 'You can browse our online Yarn Catalog, select items into your Enquiry Basket, and submit your quote request directly. Alternatively, you can call or WhatsApp Managing Director Moni Maurya at +91 7986716117 for immediate wholesale pricing.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqSchema = generateFAQSchema();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq-section" className="py-12 sm:py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <SEOHead jsonLd={faqSchema} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-700 dark:text-red-400 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-slate-900 dark:text-white">
            About VED Enterprises & Bulk Supply
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            Find quick answers to common questions about our B2B yarn trading services, product specifications, and nationwide India supply network.
          </p>
        </div>

        {/* Accordion FAQ Items */}
        <div className="space-y-4">
          {FAQ_DATA.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-serif">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-red-600 dark:text-red-400' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-700/60">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
