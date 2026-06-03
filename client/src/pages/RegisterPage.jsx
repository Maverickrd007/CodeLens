import { Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Name</span>
          <input
            name="name"
            value={form.name}
            onChange={updateField}
            autoComplete="name"
            className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            autoComplete="email"
            required
            className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <div className="mt-2 flex rounded-md border border-slate-300 bg-white focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-100">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={updateField}
              autoComplete="new-password"
              required
              minLength={8}
              className="min-w-0 flex-1 rounded-md border-0 bg-transparent px-3 py-2.5 text-sm outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="inline-flex size-10 items-center justify-center text-slate-500 transition hover:text-slate-950"
              title={showPassword ? 'Hide password' : 'Show password'}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </label>
        {error ? (
          <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 size={17} className="animate-spin" /> : <UserPlus size={17} />}
          Create account
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link
          className="font-semibold text-slate-950 underline-offset-4 hover:underline"
          to="/login"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
