import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, ArrowRight, Check, Command, Shield } from 'lucide-react';
import { useTheme, QuietPulseTheme } from '../context/ThemeContext';

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
  const { setTheme, theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init_1',
      sender: 'chokas',
      text: "Greetings. I am ChokasAI, your on-device guide to QuietPulse. How may I assist you with your focus or notification triage today?",
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  // Typo & Fuzzy Match Helper
  const fuzzyMatch = (inputStr: string, patterns: string[]): boolean => {
    const clean = inputStr.toLowerCase().replace(/[^a-z0-9 ]/g, ' ');
    return patterns.some(p => clean.includes(p));
  };

  const handleCommand = (rawText: string) => {
    const text = rawText.trim();
    if (!text) return;

    const userMsg: Message = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Process through the offline natural-language router with typo & synonym handling
    setTimeout(() => {
      const lower = text.toLowerCase().trim();
      let reply = '';
      let action: string | undefined;

      // 1. Focus Session Commands (Handles typos: "swtich focus", "strt focus", "25m", "deep work")
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
        reply = `Started an active ${mins}-minute DeepFocus session. Non-urgent alerts are now buffered into FlowQueue.`;
        action = `Initiated ${mins}m DeepFocus Session`;
      }
      // 2. Clear Queue Commands (Handles: "clear queue", "wip queue", "empty queue", "cliar")
      else if (fuzzyMatch(lower, ['clear queue', 'wip queue', 'wipe queue', 'empty queue', 'clear flowqueue', 'reset queue', 'purge queue'])) {
        onClearQueue();
        reply = "FlowQueue has been cleared. All buffered notification records have been safely wiped.";
        action = "Cleared FlowQueue";
      }
      // 3. Theme Switching (5 Official Themes: obsidian, emerald, violet, crimson, pearl)
      else if (fuzzyMatch(lower, ['emerald', 'emrald', 'green', 'mint'])) {
        setTheme('emerald');
        reply = "Switched to Emerald theme (Deep forest with mint accents).";
        action = "Theme changed to Emerald";
      } else if (fuzzyMatch(lower, ['violet', 'purple', 'voilet', 'lavender'])) {
        setTheme('violet');
        reply = "Switched to Violet theme (Dark celestial with lavender accents).";
        action = "Theme changed to Violet";
      } else if (fuzzyMatch(lower, ['crimson', 'crmison', 'red', 'rose'])) {
        setTheme('crimson');
        reply = "Switched to Crimson theme (Dark red with soft rose accents).";
        action = "Theme changed to Crimson";
      } else if (fuzzyMatch(lower, ['pearl', 'light theme', 'white theme', 'peral'])) {
        setTheme('pearl');
        reply = "Switched to Pearl theme (Clean architectural light).";
        action = "Theme changed to Pearl";
      } else if (fuzzyMatch(lower, ['obsidian', 'silver', 'black theme', 'dark theme', 'obsidien'])) {
        setTheme('obsidian');
        reply = "Switched to Obsidian Silver theme (Cinematic black & metallic silver).";
        action = "Theme changed to Obsidian Silver";
      } else if (fuzzyMatch(lower, ['help themes', 'themes', 'show themes', 'list themes'])) {
        reply = "QuietPulse supports 5 handcrafted themes:\n1. Obsidian Silver (Default black/silver)\n2. Emerald (#14B8A6 mint)\n3. Violet (#8B5CF6 lavender)\n4. Crimson (#FF4757 rose)\n5. Pearl (Architectural light).\nType 'switch to emerald' or 'switch to violet' to apply any theme.";
      }
      // 4. Navigation Commands (Strict One-Word Features: Home, NotiFy, FlowQueue, DeepFocus, PulseInsights, Contact)
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
      } else if (fuzzyMatch(lower, ['pulseinsights', 'insights', 'telemetry', 'analytics', 'stats'])) {
        onNavigate('pulseinsights');
        onClose();
        return;
      } else if (fuzzyMatch(lower, ['privacy', 'permissions', 'audit', 'security'])) {
        onNavigate('privacy');
        onClose();
        return;
      } else if (fuzzyMatch(lower, ['rules', 'context rules', 'app rules', 'settings'])) {
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
      // 5. Explanations & Knowledge Base
      else if (fuzzyMatch(lower, ['burst', 'storm', 'bursts'])) {
        reply = "A Notification Burst is when multiple notifications arrive rapidly across apps (5+ in 60 seconds) or when a single app repeatedly pings. QuietPulse detects these bursts and buffers them in FlowQueue to prevent distraction spiral.";
      } else if (fuzzyMatch(lower, ['urgency', 'relevance', 'classify', 'how it works'])) {
        reply = "NotiFy calculates two independent scores:\n• Urgency: Time-critical need (OTPs, urgent calls)\n• Relevance: Contextual importance to you.\nHigh urgency + high relevance passes instantly. High relevance with low urgency goes into FlowQueue for later review.";
      } else if (fuzzyMatch(lower, ['who are you', 'what are you', 'chokas'])) {
        reply = "I am ChokasAI, an embedded 100% on-device assistant for QuietPulse. I execute commands, manage themes, explain triage decisions, and never transmit your private data over the network.";
      } else {
        reply = "I understand. You can ask me to explain triage rules, switch themes (Obsidian, Emerald, Violet, Crimson, Pearl), start a DeepFocus timer, or navigate directly to NotiFy, FlowQueue, or PulseInsights.";
      }

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
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl h-[560px] bg-v-surface border border-v-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-reveal">
        {/* Subtle Futuristic Cosmic Texture Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 overflow-hidden select-none">
          <img
            src="./backgrounds/bg-violet-stream.png"
            alt=""
            className="w-full h-full object-cover transform scale-110 animate-ambient-drift"
          />
        </div>

        {/* Header */}
        <div className="relative z-10 px-5 py-3.5 border-b border-v-border flex items-center justify-between bg-v-secondary/90 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-v-elevated border border-v-border flex items-center justify-center text-v-text">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-v-text uppercase font-mono tracking-wider">
                  ChokasAI Assistant
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-v-surface text-v-accent border border-v-border">
                  100% ON-DEVICE
                </span>
              </div>
              <p className="text-[10px] text-v-text-muted">Natural-language command router &amp; guide</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-v-text-muted hover:text-v-text hover:bg-v-elevated">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="relative z-10 flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'chokas' && (
                <div className="w-6 h-6 rounded-md bg-v-secondary border border-v-border flex items-center justify-center text-v-accent shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-xl border leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-v-text text-v-bg border-v-text font-medium'
                    : 'bg-v-elevated text-v-text border-v-border'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                {m.actionTaken && (
                  <div className="mt-2 pt-1.5 border-t border-v-border/70 flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                    <Check className="w-3 h-3" />
                    <span>Action Executed: {m.actionTaken}</span>
                  </div>
                )}
                <span className="text-[9px] opacity-60 mt-1 block text-right font-mono">
                  {m.timestamp}
                </span>
              </div>
              {m.sender === 'user' && (
                <div className="w-6 h-6 rounded-md bg-v-text text-v-bg flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Suggested Quick Action Chips */}
        <div className="relative z-10 px-4 py-2 border-t border-v-border bg-v-secondary/80 backdrop-blur-sm flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
          <span className="text-v-text-muted text-[10px] uppercase shrink-0">Try:</span>
          <button
            onClick={() => handleCommand('Start 25m focus session')}
            className="px-2.5 py-1 rounded bg-v-surface border border-v-border text-v-text hover:border-v-accent transition shrink-0"
          >
            Start 25m Focus
          </button>
          <button
            onClick={() => handleCommand('Switch to Emerald theme')}
            className="px-2.5 py-1 rounded bg-v-surface border border-v-border text-v-text hover:border-v-accent transition shrink-0 text-emerald-300"
          >
            Emerald Theme
          </button>
          <button
            onClick={() => handleCommand('Switch to Violet theme')}
            className="px-2.5 py-1 rounded bg-v-surface border border-v-border text-v-text hover:border-v-accent transition shrink-0 text-purple-300"
          >
            Violet Theme
          </button>
          <button
            onClick={() => handleCommand('What is a notification burst?')}
            className="px-2.5 py-1 rounded bg-v-surface border border-v-border text-v-text hover:border-v-accent transition shrink-0"
          >
            Explain Bursts
          </button>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCommand(input);
          }}
          className="relative z-10 p-3 border-t border-v-border bg-v-surface/90 backdrop-blur-sm flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a command or ask a question (e.g. 'swtich emerald', 'open flowqueue')..."
            className="flex-1 px-3.5 py-2 text-xs bg-v-secondary border border-v-border rounded-xl text-v-text placeholder-v-text-muted focus:outline-none focus:border-v-accent transition font-sans"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-v-text text-v-bg hover:opacity-90 transition shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
