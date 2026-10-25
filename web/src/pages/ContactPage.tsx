import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Mail, MessageSquare, Terminal, HelpCircle } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product Inquiries & Feedback');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error');
      return;
    }

    setStatus('submitting');

    // Simulate verified frontend processing
    setTimeout(() => {
      // Record locally in localStorage for persistent client audit
      try {
        const existing = JSON.parse(localStorage.getItem('vyrox_contact_submissions') || '[]');
        existing.push({
          id: 'sub_' + Date.now(),
          name,
          email,
          subject,
          message,
          timestamp: new Date().toISOString(),
        });
        localStorage.setItem('vyrox_contact_submissions', JSON.stringify(existing));
      } catch (err) {
        // Safe fallback
      }

      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <ScrollReveal>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono tracking-[0.25em] uppercase text-v-accent">
            COMMUNICATION & INQUIRIES
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-v-text uppercase font-editorial mt-3">
            Contact VYROX
          </h1>
          <p className="text-sm text-v-text-muted mt-3 leading-relaxed font-sans">
            Connect with our team regarding system architecture, enterprise deployment, or feedback on our privacy-first attention engine.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delayMs={100}>
        <div className="p-8 sm:p-10 rounded-3xl bg-v-surface border border-v-border shadow-2xl">
          {status === 'success' ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-12 h-12 rounded-full bg-v-elevated border border-v-border flex items-center justify-center mx-auto text-v-accent">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-v-text font-editorial uppercase">
                Transmission Recorded
              </h3>
              <p className="text-xs text-v-text-muted max-w-md mx-auto leading-relaxed font-sans">
                Your message has been captured in the local communication register. In production environments, this endpoint integrates with an authorized secure webhook or self-hosted API.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 px-6 py-2.5 rounded-xl bg-v-secondary hover:bg-v-elevated border border-v-border text-v-text text-xs font-mono font-semibold transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === 'error' && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Please ensure all fields (Name, Email, Message) are filled correctly.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className="text-xs font-mono uppercase tracking-wider text-v-text-muted block mb-2">
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 text-xs bg-v-secondary border border-v-border rounded-xl text-v-text placeholder-v-text-muted focus:outline-none focus:border-v-accent transition"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="text-xs font-mono uppercase tracking-wider text-v-text-muted block mb-2">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 text-xs bg-v-secondary border border-v-border rounded-xl text-v-text placeholder-v-text-muted focus:outline-none focus:border-v-accent transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="text-xs font-mono uppercase tracking-wider text-v-text-muted block mb-2">
                  Inquiry Topic
                </label>
                <select
                  id="contact-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 text-xs bg-v-secondary border border-v-border rounded-xl text-v-text focus:outline-none focus:border-v-accent transition"
                >
                  <option value="Product Inquiries & Feedback">Product Inquiries &amp; Feedback</option>
                  <option value="Architecture & Privacy Verification">Architecture &amp; Privacy Verification</option>
                  <option value="Android Integration Support">Android Integration Support</option>
                  <option value="General Inquiries">General Inquiries</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="text-xs font-mono uppercase tracking-wider text-v-text-muted block mb-2">
                  Message Details
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  placeholder="Describe your inquiry or observation..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 text-xs bg-v-secondary border border-v-border rounded-xl text-v-text placeholder-v-text-muted focus:outline-none focus:border-v-accent transition resize-none font-sans"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="text-[11px] font-mono text-v-text-muted flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-v-accent" />
                  <span>Secure zero-tracking local dispatch</span>
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="px-8 py-3 rounded-xl bg-v-text text-v-bg font-bold text-xs uppercase tracking-widest font-mono hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2"
                >
                  {status === 'submitting' ? (
                    <span>Dispatching...</span>
                  ) : (
                    <>
                      <span>Transmit Message</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </ScrollReveal>

      {/* Backend Integration Architecture Callout */}
      <div className="mt-8 p-5 rounded-2xl bg-v-surface/60 border border-v-border text-xs text-v-text-muted flex items-start gap-3.5">
        <HelpCircle className="w-4 h-4 text-v-accent shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-v-text font-mono text-xs">Production Pipeline Note:</strong>
          <p className="leading-relaxed font-sans">
            This contact interface is fully structured with field validation and client-side persistence. To enable automated email routing in your self-hosted instance, bind a verified endpoint (e.g., Supabase Edge Functions or Resend API) in the configuration.
          </p>
        </div>
      </div>
    </div>
  );
};
