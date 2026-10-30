import React, { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  groundingChunks?: any[];
  timestamp: string;
}

interface ConciergeChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
}

export const ConciergeChatModal: React.FC<ConciergeChatModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Dumelang! Welcome to the STENZA Mzansi Beauty Concierge. I am your personal beauty and wellness advisor for South Africa. How can I assist you with discovering verified beauty shops in ${selectedCity}, finding treatments, or requesting appointments today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/concierge/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userLocation: {
            latitude: -26.1467,
            longitude: 28.0436,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMsg = data.message || 'Apologies, our concierge is temporarily unavailable.';
        if (data.error === 'API_KEY_NOT_CONFIGURED') {
          errorMsg = 'Please add your GEMINI_API_KEY in the Settings > Secrets panel to enable live AI responses and Google Maps grounding.';
        }
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: errorMsg,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.text,
            groundingChunks: data.groundingChunks || [],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I had trouble connecting to the network. Please verify your connection or try again shortly.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    'How do I request an appointment with a verified beauty shop?',
    `Find top beauty salons & nail shops in ${selectedCity}`,
    'What is the difference between Russian Manicure & BIAB?',
    'How does South African escrow payment protection work?',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="relative bg-[#fcf9f4] w-full max-w-lg h-[92vh] sm:h-[650px] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#e5e0d8] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#26152d] text-white flex items-center justify-between border-b border-[#39263f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#695684] flex items-center justify-center text-white shadow-md relative">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#26152d]"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base font-bold">STENZA AI Concierge</h3>
                <span className="text-[9px] bg-[#695684] text-[#f6d9fb] px-1.5 py-0.2 rounded font-semibold">
                  gemini-3.8-flash
                </span>
              </div>
              <p className="text-[10px] text-[#cfc7bc]">
                Powered by Gemini & Google Maps Grounding • {selectedCity}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setMessages([
                  {
                    role: 'assistant',
                    content: `Hello again! How can I assist you with your beauty routine today?`,
                    timestamp: 'Just now',
                  },
                ])
              }
              title="Clear conversation"
              className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 text-xs flex items-center"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Chat Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((m, index) => (
            <div
              key={index}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-2xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#695684] text-white rounded-br-none'
                    : 'bg-white text-[#26152d] border border-[#e5e0d8] rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                {/* Google Maps Grounding Links */}
                {m.groundingChunks && m.groundingChunks.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-[#f0ede6] space-y-2">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-[#695684]">
                      <span className="material-symbols-outlined text-[14px] text-rose-500">location_on</span>
                      <span>Verified Google Maps Places:</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {m.groundingChunks.map((chunk: any, i: number) => {
                        const mapData = chunk.maps || chunk.web;
                        if (!mapData) return null;
                        const title = mapData.title || mapData.name || 'View on Google Maps';
                        const uri = mapData.uri || '#';
                        return (
                          <a
                            key={i}
                            href={uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-between p-2 rounded-xl bg-[#f6f3ee] hover:bg-[#ebe8e3] border border-[#e5e0d8] text-[11px] font-semibold text-[#26152d] transition-colors"
                          >
                            <span className="truncate pr-2">{title}</span>
                            <span className="material-symbols-outlined text-[14px] text-gray-500">open_in_new</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[9px] text-gray-400 mt-1 px-1">{m.timestamp}</span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-[#e5e0d8] max-w-[60%] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#695684] animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-[#695684] animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-[#695684] animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[11px] text-gray-500 italic ml-1">Consulting Gemini & Maps...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Prompts */}
        <div className="px-4 py-2 border-t border-[#f0ede6] bg-[#fcf9f4] flex gap-1.5 overflow-x-auto text-[11px]">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              disabled={isLoading}
              className="flex-shrink-0 px-2.5 py-1 rounded-full bg-white border border-[#e5e0d8] text-gray-700 hover:border-[#695684] hover:text-[#695684] transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#e5e0d8]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about beauty shops, appointments, or treatments..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              disabled={isLoading}
              className="flex-1 p-2.5 rounded-xl bg-[#f6f3ee] border border-[#d8d3ca] text-xs text-[#26152d] outline-none focus:border-[#695684] focus:ring-1 focus:ring-[#695684]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="p-2.5 rounded-xl bg-[#695684] hover:bg-[#584572] disabled:opacity-50 text-white flex items-center justify-center transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
