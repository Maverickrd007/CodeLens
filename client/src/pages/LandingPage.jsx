import { motion } from 'framer-motion';
import { Bot, Bug, Code2, FlaskConical, Network, SearchCode, ShieldAlert, Sparkles, TerminalSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { BackgroundPaths } from '../components/ui/background-paths.jsx';

const floatingAnimation = {
  y: ['-10px', '10px'],
  transition: {
    duration: 4,
    repeat: Infinity,
    repeatType: 'reverse',
    ease: 'easeInOut',
  },
};

const featurePills = [
  { icon: SearchCode, text: 'Explain Files' },
  { icon: ShieldAlert, text: 'Find Bugs' },
  { icon: TerminalSquare, text: 'Generate Tests' },
  { icon: Network, text: 'Visualize Architecture' },
];

export function LandingPage() {
  return (
    <main className="relative min-h-screen bg-transparent text-slate-200 selection:bg-cyan-500/30 overflow-hidden font-sans">


      {/* Top Navigation */}
      <header className="relative z-20 mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <nav className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="CodeLens Logo" className="w-8 h-8 rounded-lg shadow-lg" />
            <span className="text-xl font-bold text-white tracking-tight">CodeLens</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/login"
              className="text-sm font-medium text-slate-300 hover:text-white transition"
            >
              Log in
            </Link>
            <Link 
              to="/register"
              className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90 shadow-lg shadow-white/10"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 pt-16 pb-32 text-center lg:px-8">

        <BackgroundPaths title="Understand any codebase instantly." />

        {/* Feature Pills */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 flex flex-wrap justify-center gap-4"
        >
          {featurePills.map((pill, i) => (
            <div
              key={pill.text}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md shadow-sm"
            >
              <pill.icon size={16} className="text-cyan-400" />
              <span className="text-sm font-medium text-slate-200">{pill.text}</span>
            </div>
          ))}
        </motion.div>
      </section>



      {/* Bento Grid Features */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 pb-32 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Everything you need to ship faster.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md hover:bg-white/[0.04] transition-colors">
            <div className="grid w-12 h-12 place-items-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 mb-6">
              <Network size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Architectural Clarity</h3>
            <p className="text-slate-400 leading-relaxed">
              Instantly understand how thousands of files connect. CodeLens maps out dependencies, data flows, and structural patterns automatically.
            </p>
          </div>
          
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md hover:bg-white/[0.04] transition-colors">
            <div className="grid w-12 h-12 place-items-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400 mb-6">
              <Bug size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Bug Detection</h3>
            <p className="text-slate-400 leading-relaxed">
              Find deeply hidden logical errors and security flaws before they hit production.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md hover:bg-white/[0.04] transition-colors">
            <div className="grid w-12 h-12 place-items-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 mb-6">
              <FlaskConical size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Instant Tests</h3>
            <p className="text-slate-400 leading-relaxed">
              Generate comprehensive unit and integration tests with a single click.
            </p>
          </div>

          <div className="md:col-span-2 rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md hover:bg-white/[0.04] transition-colors overflow-hidden relative">
            <div className="grid w-12 h-12 place-items-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 mb-6 relative z-10">
              <TerminalSquare size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Chat with your codebase</h3>
            <p className="text-slate-400 leading-relaxed relative z-10 max-w-lg">
              Stop context switching. Ask natural language questions right in your workspace and get precise, contextual answers backed by your own code.
            </p>
            {/* Decorative background element for the large card */}
            <div className="absolute right-0 bottom-0 top-0 w-1/2 bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-sm text-slate-500 relative z-10">
        <p>© 2026 CodeLens. Built for the modern developer.</p>
      </footer>
    </main>
  );
}
