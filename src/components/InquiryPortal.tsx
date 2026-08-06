import React, { useState } from 'react';
import { ShoppingBag, Trash2, Send, CheckCircle2, MapPin, Truck, Phone, FileText, Building, Sparkles, ArrowLeft, Navigation } from 'lucide-react';
import { InquiryItem, InquiryFormData } from '../types';

interface InquiryPortalProps {
  basket: InquiryItem[];
  onUpdateQty: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearBasket: () => void;
  onOpenAi: () => void;
  onBackToCatalog?: () => void;
}

const INDIAN_STATES = [
  'Punjab',
  'Gujarat',
  'Tamil Nadu',
  'Maharashtra',
  'Haryana',
  'Rajasthan',
  'Uttar Pradesh',
  'West Bengal',
  'Delhi NCR',
  'Madhya Pradesh',
  'Karnataka',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Himachal Pradesh',
  'Jharkhand',
  'Kerala',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Sikkim',
  'Telangana',
  'Tripura',
  'Uttarakhand',
  'Andaman and Nicobar Islands (UT)',
  'Chandigarh (UT)',
  'Dadra & Nagar Haveli and Daman & Diu (UT)',
  'Jammu and Kashmir (UT)',
  'Ladakh (UT)',
  'Lakshadweep (UT)',
  'Puducherry (UT)',
];

export const InquiryPortal: React.FC<InquiryPortalProps> = ({
  basket,
  onUpdateQty,
  onRemoveItem,
  onClearBasket,
  onOpenAi,
  onBackToCatalog,
}) => {
  const [formData, setFormData] = useState<InquiryFormData>({
    fullName: '',
    companyName: '',
    address: '',
    pincode: '',
    city: '',
    state: 'Punjab',
    phone: '',
    email: '',
    yarnRequirement: '',
    quantityTonsOrKg: '100 Kg',
    comments: '',
    requestSample: true,
    items: [],
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string>('');
  const [submittedResponse, setSubmittedResponse] = useState<any>(null);

  // Optional GPS Location Fetcher
  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Locating your position...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocationStatus('Fetching address & city details...');
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          
          const addr = data.address || {};
          const detectedCity = addr.city || addr.town || addr.village || addr.county || addr.suburb || '';
          const detectedState = addr.state || '';
          const detectedPostcode = addr.postcode || '';
          const detectedRoad = [addr.road, addr.suburb, addr.neighbourhood].filter(Boolean).join(', ');

          setFormData(prev => ({
            ...prev,
            city: detectedCity || prev.city,
            pincode: detectedPostcode ? detectedPostcode.replace(/\D/g, '').slice(0, 6) : prev.pincode,
            address: detectedRoad ? `${detectedRoad}${detectedCity ? ', ' + detectedCity : ''}` : prev.address,
          }));

          if (detectedState) {
            const matchedState = INDIAN_STATES.find(s => s.toLowerCase().includes(detectedState.toLowerCase()));
            if (matchedState) {
              setFormData(prev => ({ ...prev, state: matchedState }));
            }
          }

          setLocationStatus('📍 Location detected & filled!');
          setTimeout(() => setLocationStatus(''), 4000);
        } catch (err) {
          setLocationStatus('📍 Position retrieved.');
          setTimeout(() => setLocationStatus(''), 3000);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        setLocationStatus('');
        alert('Unable to retrieve current location. Please type your city and address manually.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Generate WhatsApp Message text for direct chat
  const generateWhatsAppText = (itemsList = basket) => {
    let text = `*NEW YARN INQUIRY - VED ENTERPRISES*\n`;
    text += `*Name:* ${formData.fullName || 'Customer'}\n`;
    if (formData.companyName) text += `*Firm:* ${formData.companyName}\n`;
    text += `*Phone:* ${formData.phone}\n`;
    if (formData.email) text += `*Email:* ${formData.email}\n`;
    if (formData.address) text += `*Delivery Address:* ${formData.address}\n`;
    if (formData.pincode) text += `*Pincode:* ${formData.pincode}\n`;
    text += `*Location:* ${formData.city}, ${formData.state}\n`;
    if (formData.requestSample) text += `*Sample Requested:* YES\n`;

    const currentItems = (submittedResponse?.items && submittedResponse.items.length > 0) ? submittedResponse.items : itemsList;
    if (currentItems && currentItems.length > 0) {
      text += `\n*Selected Products / Yarns:* \n`;
      currentItems.forEach((item: any, i: number) => {
        text += `${i + 1}. *${item.product?.name || 'Yarn'}* (${item.product?.countOrDenier || 'Specs'}) - ${item.quantityKg} Kg\n`;
      });
    } else {
      text += `\n*Selected Products:* General Wholesale Inquiry\n`;
    }

    if (formData.comments) text += `\n*Note:* ${formData.comments}\n`;

    return encodeURIComponent(text);
  };

  // Generate Mailto URL for vedenterprises566@gmail.com
  const generateMailtoHref = (itemsList = basket) => {
    const subject = encodeURIComponent(`[VED INQUIRY] Wholesale Yarn Requirement - ${formData.fullName || 'Customer'}`);
    let body = `NEW YARN INQUIRY - VED ENTERPRISES\n\n`;
    body += `Name: ${formData.fullName}\n`;
    if (formData.companyName) body += `Company: ${formData.companyName}\n`;
    body += `Phone: ${formData.phone}\n`;
    if (formData.email) body += `Email: ${formData.email}\n`;
    if (formData.address) body += `Delivery Address: ${formData.address}\n`;
    if (formData.pincode) body += `Pincode: ${formData.pincode}\n`;
    body += `Location: ${formData.city}, ${formData.state}\n`;
    body += `Sample Requested: ${formData.requestSample ? 'YES' : 'NO'}\n\n`;

    const currentItems = (submittedResponse?.items && submittedResponse.items.length > 0) ? submittedResponse.items : itemsList;
    if (currentItems && currentItems.length > 0) {
      body += `Selected Products / Yarns:\n`;
      currentItems.forEach((item: any, i: number) => {
        body += `${i + 1}. ${item.product?.name || 'Yarn'} (${item.product?.countOrDenier || ''}) - ${item.quantityKg} Kg\n`;
      });
      body += `\n`;
    } else {
      body += `Selected Products: General Wholesale Inquiry\n\n`;
    }

    if (formData.comments) body += `Notes / Requirements:\n${formData.comments}\n`;

    return `mailto:vedenterprises566@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert('Please enter your name and phone number to submit an inquiry.');
      return;
    }

    if (formData.phone.length !== 10) {
      alert('Please enter a valid 10-digit mobile number (e.g. 9876543210).');
      return;
    }

    setLoading(true);
    try {
      const savedBasket = [...basket];
      const payload = {
        ...formData,
        items: savedBasket,
      };

      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setSubmittedResponse({
        ...data,
        items: savedBasket,
      });

      // Direct Web3Forms Email Submission (Access Key: 2d09f16a-31b3-45bd-85f7-48ed312ff640)
      try {
        const web3FormData = new FormData();
        web3FormData.append('access_key', '2d09f16a-31b3-45bd-85f7-48ed312ff640');
        web3FormData.append('name', formData.fullName || 'Customer');
        web3FormData.append('email', formData.email || 'vedenterprises566@gmail.com');
        web3FormData.append('phone', formData.phone || '');
        web3FormData.append('city', formData.city || '');
        web3FormData.append('state', formData.state || '');
        web3FormData.append('subject', `[VED INQUIRY ${data.referenceId || 'NEW'}] ${formData.fullName || 'Customer'} - ${formData.city || 'India'}`);
        web3FormData.append('message', decodeURIComponent(generateWhatsAppText(savedBasket)).replace(/\*/g, ''));
        web3FormData.append('from_name', 'Ved Enterprises Website');

        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: web3FormData,
        }).then(r => r.json()).then(w3res => {
          console.log('[WEB3FORMS RESULT]', w3res);
        }).catch(() => {});
      } catch (w3e) {}

      // Auto open WhatsApp chat in a new tab with selected product names
      const waUrl = `https://wa.me/917986716117?text=${generateWhatsAppText(savedBasket)}`;
      window.open(waUrl, '_blank');

      onClearBasket();
      
    } catch (err) {
      alert('Failed to submit inquiry. Please call +91 7986716117 directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="inquiry-section" className="py-16 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 m-4 sm:m-[2.5rem] rounded-3xl shadow-sm min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Back Navigation Bar */}
        {onBackToCatalog && (
          <div className="flex items-center justify-between pb-2">
            <button
              onClick={onBackToCatalog}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl transition-all shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-red-600" />
              <span>Back to Product Catalog</span>
            </button>
            <span className="text-xs font-semibold text-slate-500">
              Enquiry Basket Page
            </span>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center mb-1">
              <span className="w-1 h-5 bg-slate-900 dark:bg-red-600 mr-2 rounded-full inline-block"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200">
                Dedicated Inquiry & Quotation Portal
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
              Enquiry Basket & Direct Quotation
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
              Request factory rates, mill shade cards, and sample hanks delivered directly to your textile hub.
            </p>
          </div>

          <button
            onClick={onOpenAi}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-red-600 dark:hover:bg-red-700 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Need advice on count selection? Ask AI</span>
          </button>
        </div>

        {submittedResponse ? (
          /* Confirmation State */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-emerald-500/40 shadow-2xl max-w-2xl mx-auto text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block">Inquiry Registered & Dispatched</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-serif mt-1">
                Ref ID: {submittedResponse.referenceId}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                {submittedResponse.message}
              </p>
            </div>

            {/* Selected Products Box in Confirmation Screen */}
            {submittedResponse.items && submittedResponse.items.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white text-xs border-b border-slate-200 dark:border-slate-700 pb-2">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Selected Products Included in Inquiry:</span>
                  </div>
                  <span className="text-[0.6875rem] text-red-600 dark:text-red-400 font-extrabold">
                    {submittedResponse.items.length} {submittedResponse.items.length === 1 ? 'Item' : 'Items'}
                  </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-48 overflow-y-auto pr-1">
                  {submittedResponse.items.map((item: any, idx: number) => (
                    <div key={idx} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{item.product?.name || 'Yarn Product'}</span>
                        <span className="text-[0.6875rem] text-red-600 dark:text-red-400 font-semibold">{item.product?.countOrDenier || 'Standard Specs'}</span>
                      </div>
                      <div className="bg-slate-200 dark:bg-slate-700 px-2.5 py-1 rounded-lg text-slate-900 dark:text-white font-extrabold text-[0.6875rem]">
                        {item.quantityKg} Kg
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dual Destination Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {/* Email Status */}
              <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs">
                  <FileText className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Email Notification</span>
                </div>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold text-[0.75rem]">
                  vedenterprises566@gmail.com
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[0.6875rem]">
                  {submittedResponse.emailStatusMessage || 'Dispatched via Web3Forms'}
                </p>
              </div>

              {/* WhatsApp Status */}
              <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>WhatsApp Notification</span>
                </div>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold text-[0.75rem]">
                  Moni: 7986716117 | Sandeep: 8556949433
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[0.6875rem]">
                  Message pre-formatted & ready for WhatsApp dispatch.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1">
              <p className="font-bold text-slate-900 dark:text-white text-xs">Managing Directors:</p>
              <p className="text-red-600 dark:text-red-400 font-bold">Moni Maurya (MD: 7986716117) & Sandeep Maurya (MD: 8556949433)</p>
              <p className="text-slate-500 dark:text-slate-400 text-[0.6875rem]">Address: # 66/2, Near Shingar Cinema, Dharampura, Ludhiana-141008</p>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={`https://wa.me/917986716117?text=${generateWhatsAppText()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-3 rounded-2xl text-xs transition-all shadow flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp MD Moni Maurya</span>
                </a>

                <a
                  href={`https://wa.me/918556949433?text=${generateWhatsAppText()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-3 rounded-2xl text-xs transition-all shadow flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp MD Sandeep Maurya</span>
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={generateMailtoHref()}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-3 rounded-2xl text-xs transition-all shadow flex items-center justify-center gap-2 border border-slate-700"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Send Email to vedenterprises566@gmail.com</span>
                </a>

                <button
                  onClick={() => setSubmittedResponse(null)}
                  className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold px-4 py-3 rounded-2xl text-xs transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Main Inquiry Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Selected Basket Items */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-red-600" />
                    <h3 className="font-bold text-slate-900 dark:text-white text-base font-serif">
                      Your Selected Yarns ({basket.length})
                    </h3>
                  </div>
                  {basket.length > 0 && (
                    <button
                      onClick={onClearBasket}
                      className="text-xs text-red-600 dark:text-red-400 hover:underline font-semibold"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {basket.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 dark:text-slate-400 space-y-3">
                    <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Your enquiry basket is empty.</p>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                      Browse the catalog and click "+ Inquire" to add yarns to your quotation request.
                    </p>
                    {onBackToCatalog && (
                      <div className="pt-2">
                        <button
                          onClick={onBackToCatalog}
                          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all shadow-xs"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Browse Yarn Catalog</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 my-4 max-h-[26.25rem] overflow-y-auto pr-1">
                    {basket.map((item) => (
                      <div key={item.product.id} className="py-3.5 flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.product.name}
                          </h4>
                          <span className="text-[0.6875rem] font-extrabold text-red-600 dark:text-red-400">
                            {item.product.countOrDenier}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={10}
                            step={10}
                            value={item.quantityKg}
                            onChange={(e) =>
                              onUpdateQty(item.product.id, Math.max(10, parseInt(e.target.value) || 10))
                            }
                            className="w-20 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold px-2 py-1 text-center"
                          />
                          <span className="text-[0.6875rem] text-slate-500 font-medium">Kg</span>

                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pan India Fast Shipping Note */}
              <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <MapPin className="w-4 h-4 text-red-600" /> Dispatching All Over India
                </div>
                <p className="text-[0.6875rem] leading-relaxed">
                  Ludhiana • Surat • Tirupur • Ahmedabad • Mumbai • Panipat • Kolkata • Bhilwara • Kanpur • Delhi
                </p>
              </div>
            </div>

            {/* Right Column: Customer Details Form */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-serif mb-6 pb-2 border-b border-slate-200 dark:border-slate-800">
                Customer & Destination Details
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Firm / Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Sharma Knitwear Pvt Ltd"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>Mobile / WhatsApp Number *</span>
                      <span className="text-[0.625rem] text-slate-400 font-semibold">{formData.phone.length}/10 Digits</span>
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      placeholder="10-digit number e.g. 9876543210"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                    />
                    {formData.phone.length > 0 && formData.phone.length < 10 && (
                      <p className="text-[0.65rem] text-red-500 font-semibold mt-1">
                        ⚠️ Please enter complete 10-digit mobile number ({10 - formData.phone.length} digits remaining)
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>Gmail / Email Address</span>
                      <span className="text-[0.625rem] text-slate-400 font-normal">Optional</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. yourname@gmail.com"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                </div>

                {/* Delivery & Factory Address Section */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Factory / Warehouse Delivery Address
                    </label>
                    <button
                      type="button"
                      onClick={handleFetchLocation}
                      disabled={isLocating}
                      className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[0.6875rem] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                    >
                      <Navigation className={`w-3 h-3 text-red-600 ${isLocating ? 'animate-spin' : ''}`} />
                      <span>{isLocating ? 'Detecting Location...' : '📍 Fetch Location (GPS)'}</span>
                    </button>
                  </div>

                  {locationStatus && (
                    <p className="text-[0.6875rem] text-emerald-600 dark:text-emerald-400 font-semibold">
                      {locationStatus}
                    </p>
                  )}

                  <div>
                    <input
                      type="text"
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Shop / Unit / Plot No., Industrial Area, Street Name..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[0.6875rem] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Pincode (6-Digits)
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={formData.pincode || ''}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                        placeholder="e.g. 141008"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[0.6875rem] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        City / Textile Hub *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Ludhiana / Surat"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[0.6875rem] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        State / Region *
                      </label>
                      <select
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Specific Requirement & Application Notes
                  </label>
                  <textarea
                    rows={3}
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    placeholder="Mention gauge requirements, shade preferences, or target delivery timelines..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="sample-check"
                    checked={formData.requestSample}
                    onChange={(e) => setFormData({ ...formData, requestSample: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                  />
                  <label htmlFor="sample-check" className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Request Physical Sample Hanks / Shade Card Dispatch to Address
                  </label>
                </div>

                {/* Submit Actions */}
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3.5 px-6 rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    id="submit-inquiry-btn"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'Submitting...' : 'Submit Wholesale Inquiry'}</span>
                  </button>

                  <a
                    href={`https://wa.me/917986716117?text=${generateWhatsAppText()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Phone className="w-4 h-4" />
                    <span>WhatsApp MD Moni Maurya</span>
                  </a>
                </div>

              </form>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
