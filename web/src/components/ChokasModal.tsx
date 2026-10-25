import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, ArrowRight, Check, Command, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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
  const { setTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init_1',
      sender: 'chokas',
      text: "Greetings. I am ChokasAI, your on-device guide to the VYROX Attention Firewall. How may I assist you with your focus or notification triage today?",
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

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

    // Process through the offline natural-language router
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = '';
      let action: string | undefined;

      // 1. Action: Focus
      if (lower.includes('start focus') || lower.includes('pomodoro') || lower.includes('deep work')) {
        const mins = lower.includes('50') ? 50 : 25;
        onStartFocus(`${mins}m Session (via ChokasAI)`, mins);
        reply = `Started an active ${mins}-minute focus session. Non-urgent alerts are now being buffered into your Attention Airlock.`;
        action = `Initiated ${mins}m Focus Session`;
      }
      // 2. Action: Clear Queue
      else if (lower.includes('clear queue') || lower.includes('wipe queue')) {
        onClearQueue();
        reply = "Attention Airlock queue has been cleared. All non-urgent buffer logs are wiped.";
        action = "Cleared Notification Queue";
      }
      // 3. Action: Theme Switching
      else if (lower.includes('pearl theme') || lower.includes('light theme')) {
        setTheme('pearl');
        reply = "Switched to Pearl theme (Clean architectural light).";
        action = "Theme changed to Pearl";
      } else if (lower.includes('obsidian theme') || lower.includes('dark theme')) {
        setTheme('obsidian');
        reply = "Switched to Obsidian Silver theme (Cinematic metallic black).";
        action = "Theme changed to Obsidian Silver";
      } else if (lower.includes('graphite theme')) {
        setTheme('graphite');
        reply = "Switched to Graphite theme (Sophisticated charcoal).";
        action = "Theme changed to Graphite";
      }
      // 4. Navigation commands
      else if (lower.includes('open queue') || lower.includes('show queue') || lower.includes('airlock')) {
        onNavigate('queue');
        onClose();
        return;
      } else if (lower.includes('privacy') || lower.includes('permissions') || lower.includes('security')) {
        onNavigate('privacy');
        onClose();
        return;
      } else if (lower.includes('telemetry') || lower.includes('insights') || lower.includes('analytics')) {
        onNavigate('insights');
        onClose();
        return;
      } else if (lower.includes('contact') || lower.includes('reach out')) {
        onNavigate('contact');
        onClose();
        return;
      }
      // 5. Explanations
      else if (lower.includes('burst') || lower.includes('storm')) {
        reply = "The Burst Detector monitors a rolling 60-second window. If more than 5 notifications arrive rapidly across apps, or a single app floods repetitive alerts, VYROX flags an Interruption Storm and activates the Attention Airlock to prevent distraction.";
      } else if (lower.includes('urgency') || lower.includes('relevance')) {
        reply = "VYROX evaluates two separate scoring axes: Urgency (time-critical cues like OTPs or emergency calls) and Relevance (direct messages vs broadcast channels). This prevents important but non-urgent messages from interrupting your active flow.";
      } else if (lower.includes('who are you') || lower.includes('what is chokas')) {
        reply = "I am ChokasAI, an embedded, 100% offline intelligence guide for VYROX. I run locally without transmitting your queries to third-party language models.";
      } else {
        reply = "I understand. I can help you explain features, navigate directly to any page, or execute commands like 'start a 25m focus session', 'switch to graphite theme', or 'clear queue'. What would you like to do?";
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
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl h-[560px] bg-v-surface border border-v-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-reveal">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-v-border flex items-center justify-between bg-v-secondary">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-v-elevated border border-v-border flex items-center justify-center text-v-text">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-v-text uppercase font-mono tracking-wider">
                  ChokasAI Terminal
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-v-surface text-v-accent border border-v-border">
                  OFFLINE KNOWLEDGE BASE
                </span>
              </div>
              <p className="text-[10px] text-v-text-muted">In-app guide and command router</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-v-text-muted hover:text-v-text hover:bg-v-elevated">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
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
                <p>{m.text}</p>
                {m.actionTaken && (
                  <div className="mt-2 pt-1.5 border-t border-v-border/70 flex items-center gap-1 text-[10px] font-mono text-v-accent">
                    <Check className="w-3 h-3" />
                    <span>Action: {m.actionTaken}</span>
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

        {/* Suggested Command Chips */}
        <div className="px-4 py-2 border-t border-v-border bg-v-secondary/40 flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
          <span className="text-v-text-muted text-[10px] uppercase shrink-0">Try:</span>
          <button
            onClick={() => handleCommand('Start a 25m focus session')}
            className="px-2.5 py-1 rounded bg-v-surface border border-v-border text-v-text hover:border-v-accent transition shrink-0"
          >
            Start 25m Focus
          </button>
          <button
            onClick={() => handleCommand('What is a notification burst?')}
            className="px-2.5 py-1 rounded bg-v-surface border border-v-border text-v-text hover:border-v-accent transition shrink-0"
          >
            Explain Bursts
          </button>
          <button
            onClick={() => handleCommand('Switch to Graphite theme')}
            className="px-2.5 py-1 rounded bg-v-surface border border-v-border text-v-text hover:border-v-accent transition shrink-0"
          >
            Graphite Theme
          </button>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCommand(input);
          }}
          className="p-3 border-t border-v-border bg-v-surface flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question or enter a command..."
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
