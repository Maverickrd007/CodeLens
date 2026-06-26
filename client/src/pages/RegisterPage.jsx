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
        <motion.button 
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          type="button" 
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10"
        >
          <Code2 size={18} />
          GitHub
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          type="button" 
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10"
        >
          <Mail size={18} />
          Google
        </motion.button>
      </div>
      
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-slate-900/50 px-2 text-slate-500 backdrop-blur-md">Or continue with</span>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-medium text-slate-300">Name</span>
          <input
            name="name"
            value={form.name}
            onChange={updateField}
            autoComplete="name"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-cyan-500 focus:bg-black/40 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-600"
            placeholder="Ada Lovelace"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-300">Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            autoComplete="email"
            required
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-cyan-500 focus:bg-black/40 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-600"
            placeholder="you@example.com"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-300">Password</span>
          <div className="mt-2 flex rounded-xl border border-white/10 bg-black/20 focus-within:border-cyan-500 focus-within:bg-black/40 focus-within:ring-1 focus-within:ring-cyan-500 transition">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={updateField}
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="••••••••"
              className="min-w-0 flex-1 rounded-xl border-0 bg-transparent px-4 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="inline-flex size-11 items-center justify-center text-slate-500 transition hover:text-slate-300 mr-1"
              title={showPassword ? 'Hide password' : 'Show password'}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
        
        <motion.button
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
          Create account
        </motion.button>
      </form>
      <p className="mt-8 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link
          className="font-medium text-cyan-400 underline-offset-4 hover:underline"
          to="/login"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
