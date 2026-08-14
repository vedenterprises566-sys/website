import React from 'react';
import { Phone, MapPin, Mail, Truck, Globe, ArrowUpRight, Building2, ShieldCheck } from 'lucide-react';
import { LogoGraphic } from './LogoGraphic';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectCategory }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-36 sm:pb-20 md:pb-12 border-t border-slate-800 relative overflow-hidden">
      {/* Subtle top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-red-600/40 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Profile — 4 columns on desktop */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <LogoGraphic size="md" showText={false} />
              <div>
                <span className="text-2xl font-black text-white font-serif tracking-tight">
                  VED <span className="text-red-500">ENTERPRISES</span>
                </span>
                <p className="text-xs text-amber-400 font-bold tracking-wide">
                  Wholesale Yarn & Textile Traders • Ludhiana
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Established national yarn trading house based in Ludhiana, Punjab. Supplying premium Fancy Yarns, Imported Yarns, Acrylic, Wool, Nylon, Polyester, MX Lurex, Embroidery Threads & Jari/Zari, also dealing in Fabrics and Winter Garments. We supply nationwide.
            </p>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800/80 text-xs space-y-1.5 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>GST Registered & Compliant Entity</span>
              </div>
              <p className="text-[0.6875rem] text-slate-400 leading-normal pl-6">
                Tax invoices provided for all B2B wholesale orders across India.
              </p>
            </div>
          </div>

          {/* Quick Navigation — 2 columns on desktop */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-slate-800 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {[
                { label: 'Home Page', id: 'hero' },
                { label: 'Yarn Catalog', id: 'catalog' },
                { label: 'Garments Showcase', id: 'garments' },
                { label: 'Inquiry Portal', id: 'inquiry' },
                { label: 'Digital Business Card', id: 'card' },
              ].map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5 group"
                  >
                    <span className="text-slate-600 group-hover:text-amber-400 transition-colors">›</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Yarn Categories — 3 columns on desktop */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-slate-800 pb-2">
              Yarn Specialties
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {[
                { label: 'Fancy Yarns (MX Lurex, Space, Stretch)', cat: 'fancy' },
                { label: 'China Yarns (Vislon 2/48, Wooly, Hair)', cat: 'china' },
                { label: 'Chenille (13 & 18 NM) & Suede (0.9 & 0.7)', cat: 'china' },
                { label: 'Acrylic Blends (Daffodil, Rainbow, Hazel)', cat: 'acrylic-blends' },
                { label: 'Knitted Sweaters & Outerwear', cat: 'garments' },
              ].map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => {
                      onSelectCategory(item.cat);
                      onNavigate('catalog');
                    }}
                    className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5 group"
                  >
                    <span className="text-slate-600 group-hover:text-amber-400 transition-colors">›</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Head Office Contact — 3 columns on desktop */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-slate-800 pb-2">
              Ludhiana Head Office
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed"># 66/2, Near Shingar Cinema, Dharampura, Ludhiana — 141008 (Punjab)</span>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-white font-bold">
                  <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Managing Directors</span>
                </div>
                <div className="space-y-1 text-xs">
                  <a href="tel:7986716117" className="block text-amber-300 font-bold hover:underline">
                    MD Moni Maurya: +91 7986716117
                  </a>
                  <a href="tel:8556949433" className="block text-amber-300 font-bold hover:underline">
                    MD Sandeep Maurya: +91 8556949433
                  </a>
                  <div className="pt-1 text-[0.6875rem] text-slate-400 space-y-0.5 font-medium border-t border-slate-800/80">
                    <p>Office Lines: 62803-70497 • 80545-86030</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href="mailto:vedenterprises566@gmail.com" className="text-slate-300 hover:text-amber-400 transition-colors truncate">
                  vedenterprises566@gmail.com
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* All India Distribution Supply Bar */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-inner">
          <div className="flex items-center gap-2 text-amber-400 font-bold shrink-0">
            <Truck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>All India Direct Dispatch Hubs:</span>
          </div>
          <div className="text-slate-400 text-center sm:text-right text-[0.6875rem] sm:text-xs leading-normal">
            Ludhiana • Surat • Tirupur • Ahmedabad • Mumbai • Panipat • Kolkata • Bhilwara • Kanpur • Varanasi • Delhi NCR
          </div>
        </div>

        {/* Copyright & Untressed Developer Credit Line */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center sm:text-left text-slate-400">
            © {new Date().getFullYear()} Ved Enterprises. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 text-xs">
            <span className="text-slate-500">Ludhiana Textile Directory</span>
            <span className="text-slate-700 hidden xs:inline">•</span>
            <a
              href="https://untressed.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors group font-medium"
            >
              <span>Crafted by</span>
              <span className="text-amber-400 font-bold tracking-wide group-hover:underline">Untressed</span>
              <ArrowUpRight className="w-3 h-3 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
