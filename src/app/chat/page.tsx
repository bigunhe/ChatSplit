'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// --- Types ---
// Removed unused: type Message = {
//   from: 'user' | 'ai';
//   text: string;
//   timestamp: number;
//   aiElement?: React.ReactNode;
// };

// --- Helpers ---
// Remove unused: function formatTime(ts: number) { ... }

// --- Smarter Expense Parsing ---
// Removed unused: function smartParseExpenses(input: string) { ... }

// Remove unused: function AIResponse({ parsed, rawInput }: { parsed: ReturnType<typeof smartParseExpenses>, rawInput: string }) { ... }

// --- Enhanced AI & Parsing ---
// Removed unused: const GREETINGS = [ ... ];
// Removed unused: const COMPLAINTS = [ ... ];
// Removed unused: const CONFUSION = [ ... ];
// Removed unused: const NONSENSE = [ ... ];
// Removed unused: const THANKS = [ ... ];
// Removed unused: const EXAMPLES = [ ... ];
// Removed unused: function isLikelyExpense(input: string) { ... };
// Removed unused: function isPartialExpense(input: string) { ... };
// Removed unused: function isQuestion(input: string) { ... };
// Removed unused: function getRandom(arr: string[]) { ... };
// Remove all unused variables: AIResponse, GREETINGS, COMPLAINTS, CONFUSION, NONSENSE, THANKS, EXAMPLES, isLikelyExpense, isPartialExpense, isQuestion, getRandom, GeminiExpenseResult
// Add new function to call OpenAI API route
// Remove unused: async function callOpenAIExpenseAPI(input: string) { ... }

function renderAssistantMessage(content: string) {
  // Replace **bold** with <strong> and *italic* with <em>
  // Remove markdown lists, headings, and code blocks
  const lines = content
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/^\s*[-+*] /gm, '') // remove list markers
    .replace(/^#+\s?/gm, '') // remove headings
    .replace(/`{1,3}[^`]+`{1,3}/g, '') // remove inline code
    .replace(/\n{2,}/g, '\n') // collapse multiple newlines
    .split('\n');
  return lines.map((line, i) => (
    <p key={i} className="mb-2 last:mb-0" dangerouslySetInnerHTML={{ __html: line.trim() }} />
  ));
}

const MessageBubble = ({ message }: { message: {role: 'user' | 'assistant', content: string} }) => {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
      <div className={`max-w-[80%] px-4 py-3 mb-2 rounded-2xl shadow-sm text-base leading-relaxed break-words transition-all
        ${message.role === 'user'
          ? 'bg-blue-600 text-white rounded-br-2xl rounded-tl-2xl rounded-bl-md'
          : 'bg-white text-gray-900 border border-blue-100 rounded-bl-2xl rounded-tr-2xl rounded-br-md'}
      `}>
        {message.role === 'assistant' ? (
          <div className="prose prose-sm max-w-none text-gray-900">
            {renderAssistantMessage(message.content)}
          </div>
        ) : (
          <p>{message.content}</p>
        )}
      </div>
    </div>
  );
};

const CURRENCY_OPTIONS = [
  { code: 'USD', label: 'USD ($)' },
  { code: 'LKR', label: 'LKR (₨)' },
  { code: 'INR', label: 'INR (₹)' },
  { code: 'EUR', label: 'EUR (€)' },
  { code: 'GBP', label: 'GBP (£)' },
  { code: 'AUD', label: 'AUD (A$)' },
  { code: 'CAD', label: 'CAD (C$)' },
  // Add more as needed
];

function getInitialCurrency() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('chatsplit_currency');
    if (saved) return saved;
  }
  return '';
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [currency, setCurrency] = useState(getInitialCurrency());
  const [showCurrencyPrompt, setShowCurrencyPrompt] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currency) setShowCurrencyPrompt(true);
    else setShowCurrencyPrompt(false);
  }, [currency]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  // Save currency to localStorage
  useEffect(() => {
    if (currency) localStorage.setItem('chatsplit_currency', currency);
  }, [currency]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !currency) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat-expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, currency }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex flex-col items-center font-sans">
      {/* Header */}
      <header className="w-full max-w-3xl mx-auto px-4 py-4 flex items-center justify-between border-b border-blue-100 mb-4">
        <Link href="/" className="text-2xl font-extrabold text-blue-800 tracking-tight hover:underline focus:outline-none">ChatSplit</Link>
        <nav className="flex gap-6 text-blue-700 font-medium text-base">
          {/* Add nav links here if needed */}
        </nav>
      </header>
      <div className="w-full max-w-2xl flex flex-col h-[90vh] bg-white/90 rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
        {/* Currency Prompt Modal */}
        {showCurrencyPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xs w-full flex flex-col items-center gap-4 border border-blue-100">
              <h2 className="text-lg font-bold text-blue-900">Select your currency</h2>
              <select
                className="border border-blue-200 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-gray-900 w-full"
                value={currency}
                onChange={e => setCurrency(e.target.value)}
              >
                <option value="" disabled>Select currency...</option>
                {CURRENCY_OPTIONS.map(opt => (
                  <option key={opt.code} value={opt.code}>{opt.label}</option>
                ))}
              </select>
              <button
                className="mt-2 px-5 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50 w-full"
                disabled={!currency}
                onClick={() => setShowCurrencyPrompt(false)}
              >
                Continue
              </button>
            </div>
          </div>
        )}
        {/* Messages */}
        <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-2 bg-gradient-to-b from-blue-50 to-green-50">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p className="mb-2">👋 Hi! I can help you with:</p>
              <ul className="mt-2 text-sm">
                <li>• Calculate group expense splits</li>
                <li>• Track who owes whom</li>
                <li>• Handle complex trip expenses</li>
                <li>• Convert between currencies</li>
              </ul>
              <p className="mt-4 text-xs">Try: &quot;I paid $50 for dinner for 4 people&quot;</p>
            </div>
          )}
          {messages.map((message, i) => (
            <MessageBubble key={i} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-blue-100 p-3 rounded-2xl shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Divider */}
        <div className="h-[1px] bg-blue-100 w-full" />
        {/* Input */}
        <form onSubmit={handleSubmit} className="bg-white/95 px-4 py-3 flex items-center gap-2 sticky bottom-0 z-10 border-t border-blue-100">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your expense..."
            className="flex-1 p-3 rounded-full border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base bg-blue-50 text-gray-900 placeholder-gray-500 shadow-sm"
            disabled={isLoading || !currency}
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !currency}
            className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
      {/* Footer - simple text links */}
      <footer className="w-full max-w-3xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between border-t border-blue-100 mt-8 text-sm text-blue-700">
        <span className="font-bold text-blue-800 mb-2 md:mb-0">ChatSplit</span>
        <nav className="flex gap-6">
          <a href="/chat" className="hover:underline transition">Open Chat</a>
          <a href="#features" className="hover:underline transition">Features</a>
          <a href="#usecases" className="hover:underline transition">Use Cases</a>
          <a href="#" className="hover:underline transition">Contact</a>
        </nav>
      </footer>
    </main>
  );
}

// Add fade-in animation
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .animate-fade-in {
      animation: fadeIn 0.4s cubic-bezier(0.4,0,0.2,1);
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: none; }
    }
  `;
  if (!document.head.querySelector('style[data-chat-anim]')) {
    style.setAttribute('data-chat-anim', 'true');
    document.head.appendChild(style);
  }
} 