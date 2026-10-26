import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, Cloud } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { isSupabaseConfigured, signInWithEmail, signUpWithEmail, signInWithGoogle, supabase } from '../data/supabaseClient';

interface LoginPageProps {
  onLoginSuccess: (email: string) => void;
  onNavigateHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const { theme } = useTheme();
  const isPearl = theme === 'pearl';
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Form validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      if (isSupabaseConfigured) {
        if (isSignUp) {
          const { user, session, error } = await signUpWithEmail(trimmedEmail, password);
          if (error) {
            setErrorMessage(error.message);
            setIsLoading(false);
            return;
          }

          if (rememberMe) {
            localStorage.setItem('quietpulse_user', trimmedEmail);
          } else {
            sessionStorage.setItem('quietpulse_user', trimmedEmail);
          }

          if (session && user) {
            setSuccessMessage('Account created and verified! Entering QuietPulse...');
            setTimeout(() => {
              onLoginSuccess(user.email || trimmedEmail);
            }, 600);
          } else {
            setSuccessMessage('Registration submitted! Please check your email inbox for a verification link to activate your account.');
            setIsLoading(false);
          }
        } else {
          const { user, error } = await signInWithEmail(trimmedEmail, password);
          if (error) {
            setErrorMessage(error.message);
            setIsLoading(false);
            return;
          }

          if (rememberMe) {
            localStorage.setItem('quietpulse_user', trimmedEmail);
          } else {
            sessionStorage.setItem('quietpulse_user', trimmedEmail);
          }

          setSuccessMessage('Welcome back! Entering QuietPulse...');
          setTimeout(() => {
            onLoginSuccess(user?.email || trimmedEmail);
          }, 600);
        }
      } else {
        // Fallback: Local sovereign simulation if Supabase is not configured
        setTimeout(() => {
          setIsLoading(false);
          if (rememberMe) {
            localStorage.setItem('quietpulse_user', trimmedEmail);
          } else {
            sessionStorage.setItem('quietpulse_user', trimmedEmail);
          }
          setSuccessMessage(isSignUp ? 'Account created locally! Entering QuietPulse...' : 'Welcome back! Entering QuietPulse...');
          setTimeout(() => {
            onLoginSuccess(trimmedEmail);
          }, 700);
        }, 800);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred during authentication.');
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setErrorMessage('Please enter your email address in the field above to receive a password reset link.');
      return;
    }

    if (isSupabaseConfigured && supabase) {
      setIsLoading(true);
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/#reset` : undefined,
        });
        setIsLoading(false);
        if (error) {
          setErrorMessage(error.message);
        } else {
          setSuccessMessage(`Password recovery email dispatched to ${trimmedEmail}.`);
        }
      } catch (err: any) {
        setIsLoading(false);
        setErrorMessage(err?.message || 'Failed to dispatch password recovery email.');
      }
    } else {
      setSuccessMessage(`Password reset simulated for ${trimmedEmail}.`);
    }
  };

  const handleGoogleAuthClick = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    if (isSupabaseConfigured) {
      setIsLoading(true);
      const { error } = await signInWithGoogle();
      if (error) {
        setIsLoading(false);
        setErrorMessage(error.message);
      }
    } else {
      setErrorMessage('Google OAuth requires Supabase backend credentials to be configured in .env.local.');
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* 
        Cosmic Rings Lake Backdrop matching media_1792929865096_7ceedd07.jpg
      */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <img
          src="./backgrounds/bg-cosmic-rings.png"
          alt="Cosmic Backdrop"
          className="w-full h-full object-cover object-center filter brightness-65 contrast-110 transform scale-105 animate-subtle-float"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = './quietpulse-hero-bg.jpg';
          }}
        />
        {/* Deep vignette overlay to ensure text contrast */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.85) 85%, var(--v-bg) 100%),
              linear-gradient(to bottom, var(--v-bg) 0%, transparent 20%, transparent 80%, var(--v-bg) 100%)
            `
          }}
        />
      </div>

      {/* Login Panel */}
      <div className={`relative z-10 w-full max-w-md p-8 sm:p-10 rounded-3xl transition ${
        isPearl
          ? 'bg-[#FFFFFF] border border-[#DDE1E7] shadow-2xl'
          : 'bg-black/60 backdrop-blur-xl border border-white/20 shadow-[0_8px_40px_rgba(0,0,0,0.85)]'
      } animate-reveal`}>
        
        {/* Brand Emblem & Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-12 w-auto mb-3 flex items-center justify-center">
            <img
              src={isPearl ? "./quietpulse-logo-pearl.png" : "./quietpulse-neon-logo.png"}
              alt="QuietPulse"
              className="h-11 w-auto object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = './quietpulse-logo-pearl.png';
              }}
            />
          </div>
          <p className={`text-[11px] font-mono tracking-[0.25em] uppercase font-semibold ${
            isPearl ? 'text-[#167D68]' : 'text-neutral-300'
          }`}>
            LESS NOISE. MORE FOCUS.
          </p>
          <h2 className={`text-xl sm:text-2xl font-bold mt-4 tracking-tight ${
            isPearl ? 'text-[#17191D]' : 'text-white'
          }`}>
            {isSignUp ? 'Create Sovereign Account' : 'Welcome to QuietPulse'}
          </h2>
          <p className={`text-xs mt-1 max-w-xs ${
            isPearl ? 'text-[#525866]' : 'text-neutral-400'
          }`}>
            {isSignUp
              ? 'Join the privacy-first attention firewall and protect your cognitive focus.'
              : 'Sign in to access your attention queue and personalized focus rules.'}
          </p>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
            <span className="leading-relaxed font-medium">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className={`block text-[11px] font-mono uppercase tracking-wider mb-1.5 ${
              isPearl ? 'text-[#17191D] font-bold' : 'text-neutral-300'
            }`}>
              Email Address
            </label>
            <div className="relative">
              <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                isPearl ? 'text-[#626977]' : 'text-neutral-400'
              }`} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs transition ${
                  isPearl
                    ? 'bg-[#FFFFFF] border border-[#DDE1E7] text-[#17191D] placeholder-[#626977] focus:outline-none focus:border-[#167D68] focus:ring-1 focus:ring-[#167D68]'
                    : 'bg-black/50 border border-white/20 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                }`}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className={`block text-[11px] font-mono uppercase tracking-wider mb-1.5 ${
              isPearl ? 'text-[#17191D] font-bold' : 'text-neutral-300'
            }`}>
              Password
            </label>
            <div className="relative">
              <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                isPearl ? 'text-[#626977]' : 'text-neutral-400'
              }`} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-xs font-mono transition ${
                  isPearl
                    ? 'bg-[#FFFFFF] border border-[#DDE1E7] text-[#17191D] placeholder-[#626977] focus:outline-none focus:border-[#167D68] focus:ring-1 focus:ring-[#167D68]'
                    : 'bg-black/50 border border-white/20 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition ${
                  isPearl ? 'text-[#626977] hover:text-[#17191D]' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className={`flex items-center gap-2 cursor-pointer select-none ${
              isPearl ? 'text-[#525866]' : 'text-neutral-300'
            }`}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={`w-3.5 h-3.5 rounded ${
                  isPearl ? 'border-[#DDE1E7] text-[#167D68] focus:ring-[#167D68]' : 'border-white/20 bg-black/50 text-cyan-500 focus:ring-0'
                }`}
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className={`transition text-[11px] underline underline-offset-4 ${
                isPearl ? 'text-[#525866] hover:text-[#167D68]' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-4 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-md flex items-center justify-center gap-2 group font-mono disabled:opacity-60 ${
              isPearl
                ? 'bg-[#167D68] text-white hover:bg-[#106653]'
                : 'bg-white text-black hover:bg-neutral-200 shadow-xl'
            }`}
          >
            {isLoading ? (
              <span className="inline-block animate-spin mr-2">⟳</span>
            ) : null}
            <span>{isSignUp ? 'Create Account' : 'Log In'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${isPearl ? 'border-[#DDE1E7]' : 'border-white/10'}`} />
          </div>
          <span className={`relative px-3 text-[10px] font-mono uppercase tracking-wider ${
            isPearl ? 'bg-[#FFFFFF] text-[#626977]' : 'bg-black/60 text-neutral-400'
          }`}>
            or continue with
          </span>
        </div>

        {/* Google OAuth Option */}
        <button
          type="button"
          onClick={handleGoogleAuthClick}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-medium transition flex items-center justify-center gap-2.5 ${
            isPearl
              ? 'bg-[#F7F8FA] hover:bg-[#FFFFFF] border border-[#DDE1E7] text-[#17191D] shadow-xs'
              : 'bg-white/5 hover:bg-white/10 border border-white/15 text-white'
          }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>

        {/* Toggle Sign Up / Log In */}
        <div className={`mt-6 text-center text-xs ${isPearl ? 'text-[#525866]' : 'text-neutral-400'}`}>
          {isSignUp ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setErrorMessage(null);
                }}
                className={`font-semibold hover:underline ${isPearl ? 'text-[#167D68]' : 'text-white'}`}
              >
                Log In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setErrorMessage(null);
                }}
                className={`font-semibold hover:underline ${isPearl ? 'text-[#167D68]' : 'text-white'}`}
              >
                Sign Up
              </button>
            </span>
          )}
        </div>

        {/* Privacy & Backend Note */}
        <div className={`mt-8 pt-4 border-t flex items-center justify-between text-[10px] font-mono ${
          isPearl ? 'border-[#DDE1E7] text-[#626977]' : 'border-white/10 text-neutral-400'
        }`}>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Privacy-Preserving</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cloud className={`w-3.5 h-3.5 ${isPearl ? 'text-[#167D68]' : 'text-cyan-400'}`} />
            <span>{isSupabaseConfigured ? 'Supabase Auth' : 'Sovereign Mode'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
