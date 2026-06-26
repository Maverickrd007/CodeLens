import { motion } from 'framer-motion';
import { Bot, Bug, Code2, FlaskConical, Network, SearchCode, ShieldAlert, Sparkles, TerminalSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    <main className="relative min-h-screen bg-[#09090b] text-slate-200 selection:bg-cyan-500/30 overflow-hidden font-sans">
      
      {/* 3D Animated Gradient Mesh Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-blue-600/20 blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            rotate: [0, -90, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-purple-600/20 blur-[120px]" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Top Navigation */}
      <header className="relative z-20 mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <nav className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="grid w-8 h-8 place-items-center rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 shadow-lg text-cyan-400 font-bold text-sm">
              C
            </span>
            <span className="text-base font-bold text-white tracking-tight">CodeLens</span>
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
      <section className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 pt-24 pb-32 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm font-medium text-cyan-400 backdrop-blur-md"
        >
          <Sparkles size={16} />
          <span>CodeLens AI 2.0 is now available</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="max-w-4xl text-5xl font-bold leading-[1.1] tracking-tighter text-white sm:text-7xl mb-8"
        >
          Understand any <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
            codebase instantly.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl text-lg leading-relaxed text-slate-400 mb-10"
        >
          Upload a repository, folder, or zip file. CodeLens analyzes your entire architecture, explains files, finds bugs, and generates tests in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            to="/register"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-black transition-all hover:bg-slate-200 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] w-full sm:w-auto"
          >
            Start Exploring for Free
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/10 w-full sm:w-auto"
          >
            See how it works
          </a>
        </motion.div>

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

      {/* Floating Elements (Decorative) */}
      <div className="absolute left-[10%] top-[30%] pointer-events-none hidden lg:block">
        <motion.div
          animate={floatingAnimation}
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl shadow-2xl"
        >
          <Bot className="text-purple-400" size={24} />
          <div>
            <div className="h-2 w-24 rounded-full bg-slate-700 mb-2"></div>
            <div className="h-2 w-16 rounded-full bg-slate-700"></div>
          </div>
        </motion.div>
      </div>
      
      <div className="absolute right-[15%] top-[50%] pointer-events-none hidden lg:block">
        <motion.div
          animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1 } }}
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl shadow-2xl"
        >
          <Code2 className="text-blue-400" size={24} />
          <div>
            <div className="h-2 w-20 rounded-full bg-slate-700 mb-2"></div>
            <div className="h-2 w-28 rounded-full bg-slate-700"></div>
          </div>
        </motion.div>
      </div>

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
