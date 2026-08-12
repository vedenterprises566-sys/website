import React from 'react';
import { Phone, MapPin, Mail, Truck, Shield, Layers, Award } from 'lucide-react';
import { LogoGraphic } from './LogoGraphic';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectCategory }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <LogoGraphic size="md" showText={false} />
              <div>
                <span className="text-2xl font-black text-white font-serif tracking-tight">
                  VED <span className="text-red-500">ENTERPRISES</span>
                </span>
                <p className="text-xs text-amber-400 font-bold">
                  Yarn, Fabric & Textile Distributors • Ludhiana
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Leading national trader dealing in all qualities of Fancy Yarns, China Imported Yarns, Acrylic Cotton Blended Yarns, Polyester Blends, Jari/Zari, and Fabrics with nationwide supply across India.
            </p>

            <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 font-semibold block text-[0.625rem] uppercase">
                GSTIN Billing & Tax Status
              </span>
              <p className="text-amber-300 font-bold">GST Registered Entity • Invoices Provided</p>
            </div>
          </div>

          {/* Catalog Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Yarn Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {[
                { label: 'Fancy Yarns (Lurex, Space, Stretch)', cat: 'fancy' },
                { label: 'China Yarns (Vislon, Wooly, Hair)', cat: 'china' },
                { label: 'Chenille & Suede Yarns', cat: 'china' },
                { label: 'Finished Sweaters (Garments)', cat: 'garments' },
              ].map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => {
                      onSelectCategory(item.cat);
                      onNavigate('catalog');
                    }}
                    className="hover:text-amber-300 transition-colors text-left"
                  >
                    • {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Mill Partners */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Major Mill Brands Sourced
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {[
                'Sharman Woollen Mills Pvt Ltd',
                'Garg Acrylic Limited',
                'Sportking India Limited',
                'Paramount Syntex Pvt Ltd',
                'Jainsons Wools Combber Pvt Ltd',
                'Sumilon Group of Industries',
              ].map((partner, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onNavigate('partners')}
                    className="hover:text-amber-300 transition-colors text-left"
                  >
                    • {partner}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Head Office & Contacts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Head Office & Sales
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span># 66/2, Near Shingar Cinema, Dharampura, Ludhiana - 141008 (Punjab)</span>
              </div>

              <div className="flex items-center gap-2 pt-1 text-white font-bold">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Managing Directors</span>
              </div>

              <div className="pl-6 space-y-1 font-bold">
                <p className="text-amber-300">MD Moni Maurya: +91 7986716117</p>
                <p className="text-amber-300">MD Sandeep Maurya: +91 8556949433</p>
                <p className="text-slate-300 text-xs font-semibold">Office: +91 62803-70497</p>
                <p className="text-slate-300 text-xs font-semibold">Office: +91 80545-86030</p>
              </div>
            </div>
          </div>

        </div>

        {/* All India Distribution Network Bar */}
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Truck className="w-4 h-4" />
            <span>All India Supply Hubs:</span>
          </div>
          <div className="text-slate-400 text-center sm:text-right">
            Ludhiana • Surat • Tirupur • Ahmedabad • Mumbai • Panipat • Kolkata • Bhilwara • Kanpur • Varanasi • Delhi NCR
          </div>
        </div>

        {/* Copyright & Developer Credit */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Ved Enterprises. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Ludhiana Yarn Trading</span>
            <span className="text-slate-700">•</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-900/90 text-slate-300 px-3 py-1 rounded-full border border-slate-800 font-medium">
              <span>Crafted by</span>
              <span className="text-amber-400 font-bold tracking-wide">Untressed</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
