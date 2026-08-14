import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, RefreshCw, Phone, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { askGemini } from '../services/geminiService';

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
          role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          text: m.text,
        }));

      const rawText = await askGemini(textToSend, history);
      
      // Clean and format text cleanly
      let formattedText = (rawText || '')
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
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'assistant',
          text: 'Thank you for your inquiry. For direct wholesale quotations and sample hank dispatch, please contact Moni Maurya (MD) at +91 7986716117.',
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
                Suggested Questions
              </span>
              <div className="flex flex-wrap gap-1.5">
                {STARTER_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="text-left text-xs bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-300 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-all shadow-2xs hover:shadow-xs"
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
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-colors shadow-xs"
              id="send-ai-chat-message-btn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[0.625rem] text-slate-400 mt-2 px-1">
            <span>Wholesale inquiries: Moni Maurya (+91 7986716117)</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">Ludhiana Textile Hub</span>
          </div>
        </div>

      </div>
    </div>
  );
};
