import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, RefreshCw, Phone, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { ChatMessage } from '../types';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  onSelectYarnFromAi?: (yarnName: string) => void;
}

const STARTER_PROMPTS = [
  'What Fancy Yarns do you recommend for winter knitwear?',
  'Explain China Chenille Yarn (13 NM vs 18 NM)',
  'How do I request yarn sample hanks dispatched to Surat / Tirupur?',
  'Which mill brands do you stock for 100% Acrylic and Blended Yarns?',
  'What is the difference between 300D and 550D Space Polyester Yarn?',
];

function getClientDomainAnswer(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('300d') || q.includes('550d') || q.includes('space polyester') || q.includes('denier')) {
    return `Comparison: 300D vs 550D Space Polyester Yarn

1. 300 Denier Space Polyester:
• Thickness: Finer, lighter yarn with smooth drape and soft hand feel.
• Best Uses: Fashion sweaters, light cardigans, activewear, and lightweight accessories.
• Effect: Subtler multicolored space-dyed transitions.

2. 550 Denier Space Polyester:
• Thickness: Thicker, heavy textured yarn with superior tensile strength.
• Best Uses: Structured heavy winterwear, jacket fabrics, chunky outerwear, and upholstery.
• Effect: Bold, pronounced multicolored blocks.

Both yarns are high-bulk space-dyed polyester providing vibrant variegated colors for modern knitwear. Contact Moni Maurya at +91 7986716117 for bulk shade cards.`;
  }

  if (q.includes('13 nm') || q.includes('18 nm') || q.includes('chenille')) {
    return `Comparison: China Chenille Yarn (13 NM vs 18 NM)

1. 18 NM Chenille Yarn:
• Structure: Fine velvet pile, lightweight and silky smooth.
• Best Uses: Standard gauge sweaters (10GG/12GG), ladies fashion tops, and lightweight scarves.

2. 13 NM Chenille Yarn:
• Structure: Heavier, denser velvet pile offering maximum plush warmth.
• Best Uses: Chunky winter sweaters, cozy cardigans, baby blankets, and luxury knitwear.

Both qualities deliver a velvety, non-shedding finish with rich color absorption. Direct China import stock available at our Ludhiana warehouse.`;
  }

  if (q.includes('daffodil')) {
    return `Daffodil Yarn Specifications & Applications

• Yarn Count: 2/28 Nm (Metric Count)
• Composition: 100% High-Bulk Acrylic
• Key Characteristics: Excellent thermal insulation, pill-resistant finish, and brilliant dye vibrancy.
• Recommended Uses: Sweaters, school uniform cardigans, corporate knitwear, and winter apparel.
• Compatibility: Performs exceptionally well on 5GG to 10GG flat knitting and circular knitting machines.`;
  }

  if (q.includes('rainbow')) {
    return `Rainbow Yarn Specifications & Applications

• Yarn Count: 2/26 Nm (Metric Count)
• Composition: 82% Acrylic / 18% Shiny Soft Nylon (Polyamide)
• Key Characteristics: Lustrous soft sheen, luxurious hand feel, and high elastic recovery.
• Recommended Uses: Designer fashion sweaters, chic cardigans, boutique knitwear, and kids winterwear.
• Machine Gauges: Ideal for 7GG, 10GG, and 12GG flat knitting setups.`;
  }

  if (q.includes('hazel')) {
    return `Hazel Yarn Specifications & Applications

• Available Counts: 2/28 NM & 2/36 NM
• Composition: 75% Viscose / 25% Nylon blend
• Key Characteristics: Ultra-soft silky touch, featherlight drape, and breathable luxury comfort.
• Recommended Uses: Fine luxury cardigans, boutique knitwear, summer/winter tops, and stoles.`;
  }

  if (q.includes('vislon')) {
    return `Vislon 2/48 Imported China Yarn

• Yarn Count: 2/48 Nm
• Composition: Viscose / PBT / Nylon blend
• Key Characteristics: Cashmere-soft feel, silky lustre, high pilling resistance, and uniform twist.
• Recommended Uses: 12GG and 14GG fine gauge flat knit sweaters, ladies cardigans, and premium innerwear.`;
  }

  if (q.includes('sample') || q.includes('hank') || q.includes('dispatch') || q.includes('surat') || q.includes('tirupur') || q.includes('delhi') || q.includes('ahmedabad')) {
    return `Sample Hanks & All-India Dispatch Process

• Sample Availability: We dispatch physical sample hanks and yarn shade cards directly to textile manufacturers across India.
• Coverage: Regular dispatches to Surat, Ahmedabad, Tirupur, Kolkata, Panipat, Bhilwara, Mumbai, Kanpur, Delhi NCR, and Bangalore.
• Dispatch Center: Main distribution warehouse in Ludhiana (# 66/2 Near Shingar Cinema, Dharampura).
• How to Order Samples: Call or WhatsApp Managing Director Moni Maurya (+91 7986716117) or Sandeep Maurya (+91 8556949433) with your required quality and delivery address.`;
  }

  if (q.includes('mill') || q.includes('partner') || q.includes('brand') || q.includes('spinning')) {
    return `Stocked Spinning Mill Brands at Ved Enterprises

We stock and distribute certified yarns from India's premier spinning mills:
1. Sharman Woollen Mills Pvt Ltd
2. Garg Acrylic Limited
3. Sportking India Limited
4. Paramount Syntex Pvt Ltd
5. Jainsons Wools Combber Pvt Ltd
6. Sumilon Group of Industries (Metallic Zari)

We supply 100% Acrylic, Acrylic/Wool blends, Cotton blends, Fancy yarns, and direct China imported yarns.`;
  }

  if (q.includes('fancy') || q.includes('winter') || q.includes('lurex') || q.includes('jari') || q.includes('zari') || q.includes('swad') || q.includes('hair') || q.includes('suede')) {
    return `Fancy Yarns for Winter & Fashion Knitwear

1. MX Lurex 50/85: Metallic shimmer yarn for borders, shawls, and festive knitwear.
2. Nylon Hair Yarn / Swad (0.9 / 0.7 / 1.3cm): Ultra-fluffy eyelash fur yarn for plush coats and sweaters.
3. 0.9 & 0.7 Suede Yarns: Velvety peach-skin matte touch for luxury garments.
4. Megamix Yarn: Slub effect Acrylic/Cotton for textured designer knitwear.
5. E Nigma Yarn (550D): Heavy textured 100% polyester for outerwear.
6. Fancy Jari: Finest gauge gold and silver embroidery threads.`;
  }

  return `Welcome to Ved Enterprises (Ludhiana) — B2B Wholesale Yarn Traders

We supply premium yarns across India:
• Acrylic & Blends: Daffodil (2/28 Nm), Rainbow (2/26 Nm), Wooly (2/18 Nm & 2/48 Nm)
• Fancy Yarns: Hazel (2/28 & 2/36 Nm), Megamix Slub, E Nigma (550D), MX Lurex, Fancy Jari
• China Imported: Vislon 2/48, Chenille (13NM & 18NM), Suede (0.9 & 0.7), Nylon Hair Swad
• Mill Partners: Sharman, Garg Acrylic, Sportking, Paramount, Jainsons, Sumilon

For immediate rates, sample hanks, or shade cards, contact:
• Moni Maurya (MD): +91 7986716117
• Sandeep Maurya (MD): +91 8556949433
• Address: # 66/2 Near Shingar Cinema, Dharampura, Ludhiana - 141008`;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  initialTopic,
  onSelectYarnFromAi,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Namaste! I am the Ved Enterprises AI Yarn & Textile Specialist. How can I assist you with yarn counts, denier selection, stocked mill yarn brands, or sample dispatches today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialTopic) {
      handleSend(`Tell me more about ${initialTopic} available at Ved Enterprises.`);
    }
  }, [initialTopic]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input.trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.sender !== 'system')
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          text: m.text,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history,
        }),
      });

      let rawText = '';
      if (res.ok) {
        const data = await res.json();
        rawText = data.text || '';
      }

      if (!rawText) {
        rawText = getClientDomainAnswer(textToSend);
      }
      
      // Clean and format text cleanly
      let formattedText = rawText
        .replace(/^###\s*(.*)$/gm, '$1:')
        .replace(/^##\s*(.*)$/gm, '$1:')
        .replace(/^#\s*(.*)$/gm, '$1:')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/^\s*[\*\-]\s+/gm, '• ')
        .trim();

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        text: formattedText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const fallbackText = getClientDomainAnswer(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'assistant',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-end p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 h-[92vh] flex flex-col overflow-hidden cursor-default"
      >
        
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-red-700 via-red-800 to-slate-900 text-white flex items-center justify-between border-b border-red-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base font-serif">Ved Enterprises AI Assistant</h3>
              <p className="text-[0.6875rem] text-amber-200 flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Gemini Powered • Pan-India Yarn Expert
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
            id="close-ai-assistant-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Message List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-950/50">
          
          {/* Preset Prompts Pill Carousel */}
          {messages.length <= 2 && (
            <div className="space-y-2 mb-4">
              <span className="text-[0.6875rem] font-bold text-slate-400 uppercase tracking-wider block">
                Suggested Inquiry Topics:
              </span>
              <div className="flex flex-col gap-1.5">
                {STARTER_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="text-left text-xs bg-white dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-300 hover:text-amber-900 dark:hover:text-amber-300 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors shadow-xs font-medium"
                  >
                    💡 {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-red-600 text-white font-medium rounded-tr-none'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-tl-none'
                }`}
              >
                {msg.text}
                <span
                  className={`block text-[0.625rem] mt-1.5 text-right font-normal opacity-70 ${
                    msg.sender === 'user' ? 'text-red-100' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
              <span>Ved AI Specialist is thinking...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about yarns, counts, gauge, samples..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-red-500"
              id="ai-assistant-input"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-sm flex-shrink-0"
              id="ai-assistant-send-btn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
