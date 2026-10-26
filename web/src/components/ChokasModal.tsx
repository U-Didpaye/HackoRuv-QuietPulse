import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, ArrowRight, Check, Command, Shield, Loader2 } from 'lucide-react';
import { useTheme, QuietPulseTheme } from '../context/ThemeContext';
import { isGeminiConfigured, askGemini } from '../data/geminiClient';

interface Message {
  id: string;
  sender: 'chokas' | 'user';
  text: string;
  actionTaken?: string;
  timestamp: string;
}

interface ChokasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  onStartFocus: (name: string, duration: number) => void;
  onClearQueue: () => void;
}

export const ChokasModal: React.FC<ChokasModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onStartFocus,
  onClearQueue,
}) => {
  const { theme, setTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init_1',
      sender: 'chokas',
      text: "Greetings. I am ChokasAI, your QuietPulse attention copilot powered by Google Gemini intelligence. How may I assist your focus or notification triage today?",
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking, isOpen]);

  if (!isOpen) return null;

  // Typo & Fuzzy Match Helper
  const fuzzyMatch = (inputStr: string, patterns: string[]): boolean => {
    const clean = inputStr.toLowerCase().replace(/[^a-z0-9 ]/g, ' ');
    return patterns.some(p => clean.includes(p));
  };

  const handleCommand = async (rawText: string) => {
    const text = rawText.trim();
    if (!text || isThinking) return;

    const userMsg: Message = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    const lower = text.toLowerCase().trim();
    let reply = '';
    let action: string | undefined;

    // 1. Direct In-App Focus Session Commands
    if (
      fuzzyMatch(lower, ['start focus', 'strt focus', 'begin focus', 'deepfocus', 'deep work', 'pomodoro', 'focus session']) ||
      (lower.includes('focus') && (lower.includes('25') || lower.includes('50') || lower.includes('minute') || lower.includes('min')))
    ) {
      let mins = 25;
      if (lower.includes('50') || lower.includes('hour')) mins = 50;
      else if (lower.includes('15')) mins = 15;
      else if (lower.includes('30')) mins = 30;
      else if (lower.includes('45')) mins = 45;

      onStartFocus(`${mins}m Session (via ChokasAI)`, mins);
      reply = `Started an active ${mins}-minute Deep Focus session. Non-urgent alerts are now buffered into FlowQueue.`;
      action = `Initiated ${mins}m Deep Focus Session`;
    }
    // 2. Clear Queue Commands
    else if (fuzzyMatch(lower, ['clear queue', 'wip queue', 'wipe queue', 'empty queue', 'clear flowqueue', 'reset queue', 'purge queue'])) {
      onClearQueue();
      reply = "FlowQueue has been cleared. All buffered notification records have been safely wiped.";
      action = "Cleared FlowQueue";
    }
    // 3. Theme Switching (3 Approved Themes: Obsidian Silver, Emerald, Pearl)
    else if (fuzzyMatch(lower, ['emerald', 'emrald', 'green', 'mint'])) {
      setTheme('emerald');
      reply = "Switched to Emerald theme (Deep forest with mint accents).";
      action = "Theme changed to Emerald";
    } else if (fuzzyMatch(lower, ['pearl', 'light theme', 'white theme', 'peral'])) {
      setTheme('pearl');
      reply = "Switched to Pearl theme (Clean architectural light with high-contrast pure black header).";
      action = "Theme changed to Pearl";
    } else if (fuzzyMatch(lower, ['obsidian', 'silver', 'black theme', 'dark theme', 'obsidien'])) {
      setTheme('obsidian');
      reply = "Switched to Obsidian Silver theme (Cinematic black & metallic silver).";
      action = "Theme changed to Obsidian Silver";
    } else if (fuzzyMatch(lower, ['help themes', 'themes', 'show themes', 'list themes'])) {
      reply = "QuietPulse supports 3 handcrafted themes:\n1. Obsidian Silver (Default metallic black)\n2. Emerald (Forest & mint)\n3. Pearl (Clean architectural light).\nType 'switch to emerald' or 'switch to pearl' to apply.";
    }
    // 4. Navigation Commands
    else if (fuzzyMatch(lower, ['open queue', 'show queue', 'go queue', 'flowqueue', 'flow queue'])) {
      onNavigate('flowqueue');
      onClose();
      return;
    } else if (fuzzyMatch(lower, ['open notify', 'notify', 'engine', 'firewall', 'go notify'])) {
      onNavigate('notify');
      onClose();
      return;
    } else if (fuzzyMatch(lower, ['deepfocus', 'open focus', 'go focus', 'focus timer'])) {
      onNavigate('deepfocus');
      onClose();
      return;
    } else if (fuzzyMatch(lower, ['pulseinsights', 'insights', 'analytics', 'stats'])) {
      onNavigate('pulseinsights');
      onClose();
      return;
    } else if (fuzzyMatch(lower, ['privacy', 'permissions', 'audit', 'security'])) {
      onNavigate('privacy');
      onClose();
      return;
    } else if (fuzzyMatch(lower, ['rules', 'context rules', 'app rules', 'settings', 'modes'])) {
      onNavigate('rules');
      onClose();
      return;
    } else if (fuzzyMatch(lower, ['contact', 'reach out', 'feedback', 'team'])) {
      onNavigate('contact');
      onClose();
      return;
    } else if (fuzzyMatch(lower, ['home', 'overview', 'main page'])) {
      onNavigate('home');
      onClose();
      return;
    }

    // Immediate execution for in-app action commands
    if (reply) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: 'reply_' + Date.now(),
            sender: 'chokas',
            text: reply,
            actionTaken: action,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 150);
      return;
    }

    // 5. Intelligent Conversational Response via Google Gemini
    if (isGeminiConfigured) {
      setIsThinking(true);
      try {
        const geminiReply = await askGemini(text, [...messages, userMsg]);
        setMessages((prev) => [
          ...prev,
          {
            id: 'reply_' + Date.now(),
            sender: 'chokas',
            text: geminiReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } catch (err) {
        console.warn('Gemini inference error, falling back:', err);
        let fallbackReply = "I am here to guide your focus, explain notification heuristics, and optimize your QuietPulse workspace. Feel free to ask about managing notification fatigue or setting deep focus intervals.";
        if (fuzzyMatch(lower, ['burst', 'storm'])) {
          fallbackReply = "A Notification Burst is when multiple notifications arrive rapidly across apps (5+ in 60s). QuietPulse quarantines bursts in FlowQueue to prevent distraction spirals.";
        } else if (fuzzyMatch(lower, ['urgency', 'relevance', 'classify', 'how it works'])) {
          fallbackReply = "NotiFy calculates two independent scores:\n• Urgency: Time-critical need (OTPs, emergency calls)\n• Relevance: Contextual value under your active Context Mode (Office, Home, or Personalized).\nHigh urgency alerts pass through immediately.";
        }
        setMessages((prev) => [
          ...prev,
          {
            id: 'reply_' + Date.now(),
            sender: 'chokas',
            text: fallbackReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } finally {
        setIsThinking(false);
      }
    } else {
      // Offline fallback
      let fallback = "I can help you navigate QuietPulse, explain triage decisions, switch themes (Obsidian Silver, Emerald, Pearl), start Deep Focus timers, or manage your FlowQueue.";
      if (fuzzyMatch(lower, ['burst', 'storm'])) {
        fallback = "A Notification Burst is when multiple notifications arrive rapidly across apps (5+ in 60s). QuietPulse quarantines bursts in FlowQueue to prevent distraction spiral.";
      } else if (fuzzyMatch(lower, ['urgency', 'relevance', 'classify', 'how it works'])) {
        fallback = "NotiFy calculates two independent scores:\n• Urgency: Time-critical need (OTPs, emergency calls)\n• Relevance: Contextual value under your active Context Mode (Office, Home, or Personalized).\nHigh urgency alerts pass through immediately.";
      }
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: 'reply_' + Date.now(),
            sender: 'chokas',
            text: fallback,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div
        className={`relative w-full max-w-xl max-h-[90vh] h-[580px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-reveal border backdrop-blur-xl ${
          theme === 'emerald'
            ? 'bg-[#061813]/95 border-emerald-500/40 shadow-[0_0_60px_rgba(20,184,166,0.18)]'
            : theme === 'pearl'
            ? 'bg-[#0c0c0e]/95 border-neutral-700/80 shadow-[0_0_60px_rgba(0,0,0,0.6)]'
            : 'bg-[#0a0a0c]/95 border-neutral-700/80 shadow-[0_0_60px_rgba(255,255,255,0.06)]'
        }`}
      >
        {/* Subtle Ambient Cosmic Background Image Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 overflow-hidden select-none">
          <img
            src="./backgrounds/bg-cosmic-rings.png"
            alt=""
            className="w-full h-full object-cover filter brightness-90 contrast-125 mix-blend-screen"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = './backgrounds/bg-violet-stream.png';
            }}
          />
        </div>

        {/* Header - Fixed Height & High Contrast */}
        <div className="relative z-10 px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-black/60 backdrop-blur-md flex-shrink-0 text-white">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-xl border flex items-center justify-center shadow-sm ${
                theme === 'emerald'
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400'
                  : 'bg-neutral-900 border-neutral-700 text-cyan-400'
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  ChokasAI Assistant
                </span>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${
                    isGeminiConfigured
                      ? 'bg-cyan-500/15 text-cyan-300 border-cyan-400/40 shadow-sm'
                      : theme === 'emerald'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                  }`}
                >
                  {isGeminiConfigured && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
                  {isGeminiConfigured ? 'GEMINI 3.5 AI' : '100% ON-DEVICE'}
                </span>
              </div>
              <p className="text-[10px] text-neutral-400">
                {isGeminiConfigured
                  ? 'Multi-turn conversational intelligence & command router'
                  : 'Natural-language command router & guide'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread - Flexible & Scrollable */}
        <div className="relative z-10 flex-1 min-h-0 p-4 overflow-y-auto space-y-3 font-sans text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'chokas' && (
                <div
                  className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 mt-0.5 shadow-sm ${
                    theme === 'emerald'
                      ? 'bg-emerald-950 border-emerald-500/40 text-emerald-400'
                      : 'bg-neutral-900 border-neutral-700 text-cyan-400'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`max-w-[85%] sm:max-w-[80%] p-3.5 rounded-xl border leading-relaxed shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-white text-black border-white/80 font-medium'
                    : 'bg-white/10 backdrop-blur-md text-neutral-100 border-white/15'
                }`}
              >
                <p className="whitespace-pre-line text-xs font-normal">{m.text}</p>
                {m.actionTaken && (
                  <div className="mt-2 pt-2 border-t border-white/15 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-bold">
                    <Check className="w-3 h-3" />
                    <span>Action: {m.actionTaken}</span>
                  </div>
                )}
                <span className="text-[9px] opacity-60 mt-1.5 block text-right font-mono">
                  {m.timestamp}
                </span>
              </div>
              {m.sender === 'user' && (
                <div className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {/* Thinking / Streaming Indicator */}
          {isThinking && (
            <div className="flex gap-2.5 justify-start animate-fade-in">
              <div
                className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 mt-0.5 shadow-sm ${
                  theme === 'emerald'
                    ? 'bg-emerald-950 border-emerald-500/40 text-emerald-400'
                    : 'bg-neutral-900 border-neutral-700 text-cyan-400'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="p-3.5 rounded-xl border leading-relaxed shadow-sm bg-white/10 backdrop-blur-md text-neutral-200 border-white/15 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] font-mono text-neutral-300 ml-1.5">ChokasAI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Action Chips - Flex-shrink-0 for mobile */}
        <div className="relative z-10 px-4 py-2 border-t border-white/10 bg-black/60 backdrop-blur-md flex items-center gap-2 overflow-x-auto text-[11px] font-mono flex-shrink-0">
          <span className="text-neutral-400 text-[10px] uppercase shrink-0 font-bold">Try:</span>
          <button
            onClick={() => handleCommand('How can I stop notification anxiety?')}
            className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/20 transition shrink-0"
          >
            Stop Notification Anxiety
          </button>
          <button
            onClick={() => handleCommand('Start 25m focus session')}
            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/15 text-neutral-200 hover:text-white hover:border-cyan-400 transition shrink-0"
          >
            Start 25m Focus
          </button>
          <button
            onClick={() => handleCommand('Switch to Emerald theme')}
            className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:border-emerald-400 transition shrink-0"
          >
            Emerald Theme
          </button>
          <button
            onClick={() => handleCommand('Switch to Pearl theme')}
            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/15 text-neutral-200 hover:text-white hover:border-white transition shrink-0"
          >
            Pearl Theme
          </button>
          <button
            onClick={() => handleCommand('What is a notification burst?')}
            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/15 text-neutral-200 hover:text-white hover:border-cyan-400 transition shrink-0"
          >
            Explain Bursts
          </button>
        </div>

        {/* Input Bar - Flex-shrink-0 so mobile keyboard never covers it */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCommand(input);
          }}
          className="relative z-10 p-3 border-t border-white/10 bg-black/70 backdrop-blur-md flex items-center gap-2 flex-shrink-0"
        >
          <input
            type="text"
            value={input}
            disabled={isThinking}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isThinking
                ? "ChokasAI is generating response..."
                : "Ask Gemini anything or type a command (e.g. 'how to focus', 'start 25m focus')..."
            }
            className="flex-1 px-3.5 py-2.5 text-xs bg-white/5 border border-white/15 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:border-cyan-400 disabled:opacity-60 transition font-sans"
          />
          <button
            type="submit"
            disabled={isThinking || !input.trim()}
            className="p-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0 shadow-md"
            title="Send Message"
          >
            {isThinking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          </button>
        </form>
      </div>
    </div>
  );
};
