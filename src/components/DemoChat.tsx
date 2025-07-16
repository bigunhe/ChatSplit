"use client";
import React, { useState, useRef, useEffect } from "react";

const demoCurrency = 'USD';
const userFull = 'We ordered pizza for $32 (I paid), Priya bought movie tickets for $48 for all four of us, Jordan paid $12 for snacks, and I paid $8 for parking. Sam gave me $16 for pizza, and Jordan gave me $10 back. How should we split everything?';
const aiFull = `🍕 <strong>Expense Summary:</strong>
Pizza: $32 (paid by you)
Movie tickets: $48 (paid by Priya)
Snacks: $12 (paid by Jordan)
Parking: $8 (paid by you)

Total group expense: $100 for 4 people = $25 each

👥 <strong>Who owes what:</strong>
<strong>You:</strong> Paid $40 (pizza + parking), should get $15 back
<strong>Priya:</strong> Paid $48, should get $23 back
<strong>Jordan:</strong> Paid $12, owes $13
<strong>Sam:</strong> Paid $0, owes $25

💸 <strong>Settlements:</strong>
Sam should pay you $15 and Priya $10
Jordan should pay Priya $13
You already received $16 from Sam and $10 from Jordan, so Sam owes you $0 and Jordan owes Priya $3

✅ <strong>Summary:</strong>
All expenses are split! Let me know if you need help with another scenario 😊`;

export default function DemoChat() {
  const [userTyped, setUserTyped] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const [aiTyped, setAiTyped] = useState('');
  const [aiLines, setAiLines] = useState<string[]>([]);
  const [aiLineIdx, setAiLineIdx] = useState(0);
  const aiLinesRef = useRef<string[]>([]);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [hasAutoStarted, setHasAutoStarted] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const animationRef = useRef<{ user: NodeJS.Timeout | null; ai: NodeJS.Timeout | null }>({ user: null, ai: null });

  // Auto-start demo when scrolled into view (only once)
  useEffect(() => {
    if (hasAutoStarted) return;
    const node = demoRef.current;
    if (!node) return;
    observerRef.current = new window.IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setHasAutoStarted(true);
        handleStartDemo();
        observerRef.current?.disconnect();
      }
    }, { threshold: 0.5 });
    observerRef.current.observe(node);
    return () => observerRef.current?.disconnect();
  }, [hasAutoStarted]);

  // Animate user typing
  useEffect(() => {
    if (!isDemoRunning) return;
    setUserTyped('');
    setShowLoading(false);
    setAiTyped('');
    setAiLines([]);
    setAiLineIdx(0);
    let i = 0;
    animationRef.current.user = setInterval(() => {
      setUserTyped(userFull.slice(0, i + 1));
      i++;
      if (i >= userFull.length) {
        if (animationRef.current.user) clearInterval(animationRef.current.user);
        setTimeout(() => setShowLoading(true), 500);
      }
    }, 18);
    return () => {
      if (animationRef.current.user) clearInterval(animationRef.current.user);
    };
  }, [isDemoRunning]);

  // Animate AI loading and typing
  useEffect(() => {
    if (!showLoading || !isDemoRunning) return;
    setAiTyped('');
    setAiLines([]);
    setAiLineIdx(0);
    aiLinesRef.current = aiFull.split('\n');
    const loadingTimeout = setTimeout(() => {
      setShowLoading(false);
      setAiLines(['']);
      setAiLineIdx(0);
    }, 1200);
    return () => clearTimeout(loadingTimeout);
  }, [showLoading, isDemoRunning]);

  // Animate AI line-by-line typing
  useEffect(() => {
    if (!isDemoRunning || showLoading || aiLines.length === 0) return;
    if (aiLineIdx >= aiLinesRef.current.length) return;
    const line = aiLinesRef.current[aiLineIdx];
    let j = 0;
    setAiTyped('');
    function typeLine() {
      setAiTyped(line.slice(0, j + 1));
      j++;
      if (j < line.length) {
        animationRef.current.ai = setTimeout(typeLine, 8 + Math.random() * 12);
      } else {
        setTimeout(() => {
          setAiLines((prev) => [...prev, line]);
          setAiLineIdx((idx) => idx + 1);
        }, 120);
      }
    }
    if (line.length > 0) typeLine();
    else setTimeout(() => setAiLineIdx((idx) => idx + 1), 120);
    return () => {
      if (animationRef.current.ai) clearTimeout(animationRef.current.ai);
    };
    // eslint-disable-next-line
  }, [aiLineIdx, aiLines, showLoading, isDemoRunning]);

  function handleStartDemo() {
    setIsDemoRunning(false); // reset first
    setTimeout(() => setIsDemoRunning(true), 50);
  }

  function handleStopDemo() {
    setIsDemoRunning(false);
    setUserTyped('');
    setShowLoading(false);
    setAiTyped('');
    setAiLines([]);
    setAiLineIdx(0);
  }

  function renderAssistantMessage(content: string) {
    let lines = content
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/^\s*[-+*] /gm, '')
      .replace(/^#+\s?/gm, '')
      .replace(/`{1,3}[^`]+`{1,3}/g, '')
      .replace(/\n{2,}/g, '\n')
      .split('\n');
    return lines.map((line, i) => (
      <p key={i} className="mb-2 last:mb-0" dangerouslySetInnerHTML={{ __html: line.trim() }} />
    ));
  }
  const MessageBubble = ({ message, typing }: { message: { role: 'user' | 'assistant', content: string }, typing?: boolean }) => (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
      <div className={`max-w-[80%] px-4 py-3 mb-2 rounded-2xl shadow-sm text-base leading-relaxed break-words transition-all
        ${message.role === 'user'
          ? 'bg-blue-600 text-white rounded-br-2xl rounded-tl-2xl rounded-bl-md'
          : 'bg-white text-gray-900 border border-blue-100 rounded-bl-2xl rounded-tr-2xl rounded-br-md'}
      `}>
        {message.role === 'assistant' ? (
          <div className="prose prose-sm max-w-none text-gray-900">
            {typing ? <span className="animate-pulse">{renderAssistantMessage(message.content)}</span> : renderAssistantMessage(message.content)}
          </div>
        ) : (
          <p>{message.content}</p>
        )}
      </div>
    </div>
  );
  return (
    <div ref={demoRef} className="w-full bg-white/90 rounded-2xl rounded-b-2xl shadow-xl border border-blue-100 flex flex-col items-stretch" style={{maxWidth: '100%'}}>
      {/* Demo Header with static currency and controls */}
      <div className="flex items-center justify-between px-4 md:px-8 py-3 border-b border-blue-100 bg-gradient-to-r from-blue-100 to-green-100 rounded-t-2xl">
        <span className="font-semibold text-blue-900">ChatSplit Demo</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Currency:</span>
          <span className="px-2 py-1 rounded bg-blue-50 border border-blue-200 text-blue-900 text-xs font-medium">{demoCurrency}</span>
          {isDemoRunning ? (
            <button
              className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 font-medium hover:bg-red-200 transition"
              onClick={handleStopDemo}
            >
              Stop Demo
            </button>
          ) : (
            <button
              className="text-xs px-3 py-1 rounded-full bg-blue-200 text-blue-900 font-medium hover:bg-blue-300 transition"
              onClick={handleStartDemo}
            >
              Start Demo
            </button>
          )}
        </div>
      </div>
      <div className="px-4 md:px-8 py-6 space-y-2 bg-gradient-to-b from-blue-50 to-green-50 rounded-b-2xl">
        <MessageBubble message={{ role: 'user', content: userTyped }} typing={userTyped.length < userFull.length} />
        {showLoading && (
          <div className="flex justify-start w-full">
            <div className="bg-white border border-blue-100 p-3 rounded-2xl shadow-sm max-w-[60%]">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        {/* AI lines that have been typed out */}
        {aiLines.slice(1).map((line, idx) => (
          <MessageBubble key={idx} message={{ role: 'assistant', content: line }} />
        ))}
        {/* Current AI line being typed */}
        {aiLineIdx < aiFull.split('\n').length && !showLoading && aiTyped && (
          <MessageBubble message={{ role: 'assistant', content: aiTyped }} typing />
        )}
      </div>
    </div>
  );
} 