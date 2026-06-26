import { Eye, EyeOff, Loader2, UserPlus, Code2, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { AuthLayout } from '../components/AuthLayout.jsx';
import { register } from '../services/api.js';
import { setStoredAuth } from '../services/authStorage.js';

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      const auth = await register(form);
      setStoredAuth(auth);
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Create account" subtitle="Start a workspace for repository analysis.">
      
      {/* Social Logins */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button 
          type="button" 
          className="flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.02] px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/[0.04]"
        >
          <Code2 size={16} />
          GitHub
        </button>
        <button 
          type="button" 
          className="flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.02] px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/[0.04]"
        >
          <Mail size={16} />
          Google
        </button>
      </div>
      
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-medium">
          <span className="bg-[#09090b] px-3 text-slate-500">Or continue with email</span>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-[13px] font-medium text-slate-300">Name</span>
          <input
            name="name"
            value={form.name}
            onChange={updateField}
            autoComplete="name"
            className="mt-1.5 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-white/30 focus:bg-white/[0.02] placeholder:text-slate-600"
            placeholder="Ada Lovelace"
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-medium text-slate-300">Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            autoComplete="email"
            required
            className="mt-1.5 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-white/30 focus:bg-white/[0.02] placeholder:text-slate-600"
            placeholder="you@example.com"
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-medium text-slate-300">Password</span>
          <div className="mt-1.5 flex rounded-md border border-white/10 bg-black/20 focus-within:border-white/30 focus-within:bg-white/[0.02] transition">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={updateField}
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="••••••••"
              className="min-w-0 flex-1 rounded-md border-0 bg-transparent px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="inline-flex size-9 items-center justify-center text-slate-500 transition hover:text-slate-300 mr-1"
              title={showPassword ? 'Hide password' : 'Show password'}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </label>
        
        {error ? (
          <motion.p 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400"
          >
            {error}
          </motion.p>
        ) : null}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
          Create account
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link
          className="font-medium text-white underline-offset-4 hover:underline"
          to="/login"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
