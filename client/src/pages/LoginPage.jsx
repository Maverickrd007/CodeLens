import { Eye, EyeOff, Loader2, Code2, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { login } from '../services/api.js';
import { setStoredAuth } from '../services/authStorage.js';
import { InteractiveMesh } from '../components/InteractiveMesh.jsx';

export function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const auth = await login(form);
      setStoredAuth(auth);
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#05050a] text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30">
      
      {/* Moving Interactive Mesh Background */}
      <InteractiveMesh />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 w-full max-w-[420px] px-6"
      >
        
        {/* Top Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <span className="grid w-10 h-10 place-items-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 shadow-lg text-cyan-400 font-bold text-lg">
              C
            </span>
            <span className="text-2xl font-bold text-white tracking-tight">CodeLens</span>
          </div>
        </div>

        {/* Glassmorphic Login Card */}
        <div className="rounded-[24px] border border-white/10 bg-[#0c0c0e]/80 p-8 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden">
          
          {/* Very soft inner glow border effect at the top */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Welcome back</h2>
            <p className="text-sm text-slate-400">Sign in to your workspace.</p>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button 
              type="button" 
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-200 transition-all hover:bg-white/[0.08] hover:border-white/20"
            >
              <Code2 size={16} />
              GitHub
            </button>
            <button 
              type="button" 
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-200 transition-all hover:bg-white/[0.08] hover:border-white/20"
            >
              <Mail size={16} />
              Google
            </button>
          </div>
          
          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-semibold">
              <span className="bg-[#0c0c0e] px-3 text-slate-500 rounded-full">Or with email</span>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-[13px] font-medium text-slate-300">Email address</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                autoComplete="email"
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-slate-200 outline-none transition-all focus:border-cyan-500/50 focus:bg-white/[0.03] focus:ring-1 focus:ring-cyan-500/50 placeholder:text-slate-600"
                placeholder="you@example.com"
              />
            </label>
            
            <label className="block">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-slate-300">Password</span>
                <a href="#" className="text-[12px] font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="mt-2 flex rounded-xl border border-white/10 bg-black/40 focus-within:border-cyan-500/50 focus-within:bg-white/[0.03] focus-within:ring-1 focus-within:ring-cyan-500/50 transition-all">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={updateField}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="min-w-0 flex-1 rounded-xl border-0 bg-transparent px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="inline-flex size-10 items-center justify-center text-slate-500 transition hover:text-slate-300 mr-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>
            
            {error ? (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400"
              >
                {error}
              </motion.p>
            ) : null}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition-all hover:bg-slate-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:cursor-not-allowed disabled:opacity-50 mt-4"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
              Sign in to CodeLens
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-[13px] text-slate-500">
          Don't have an account?{' '}
          <Link
            className="font-medium text-slate-300 hover:text-white transition-colors"
            to="/register"
          >
            Create one now
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
