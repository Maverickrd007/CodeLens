import { motion } from 'framer-motion';
import { Bot, Code2, Database, Network, SearchCode, ShieldAlert, Sparkles, TerminalSquare } from 'lucide-react';

const featurePills = [
  { icon: SearchCode, text: 'Explain Files' },
  { icon: ShieldAlert, text: 'Find Bugs' },
  { icon: TerminalSquare, text: 'Generate Tests' },
  { icon: Network, text: 'Visualize Architecture' },
];

export function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="relative min-h-screen bg-[#09090b] text-slate-200 selection:bg-slate-700/50 overflow-hidden font-sans">
      
      {/* Extremely subtle background texture and top glow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-[100%] bg-blue-500/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center gap-12 px-6 py-12 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        
        {/* Left Side: Marketing & Visuals */}
        <section className="hidden lg:flex flex-col justify-center h-full pt-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-16"
          >
            <span className="grid size-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-100 shadow-sm">
              <SearchCode size={20} />
            </span>
            <div>
              <p className="text-lg font-semibold tracking-tight text-white">CodeLens</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <h1 className="text-5xl font-semibold leading-[1.15] tracking-tight text-slate-50 mb-5">
              Understand any codebase.
            </h1>
            <p className="max-w-md text-base leading-relaxed text-slate-400 mb-10 font-medium">
              Upload a repository. Ask anything. Unblock yourself instantly.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2.5 max-w-md">
              {featurePills.map((pill, i) => (
                <motion.div
                  key={pill.text}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + (i * 0.05) }}
                  className="flex items-center gap-2 rounded-md border border-white/5 bg-white/[0.02] px-3.5 py-1.5 transition-colors hover:bg-white/[0.04]"
                >
                  <pill.icon size={14} className="text-slate-400" />
                  <span className="text-xs font-medium text-slate-300">{pill.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Code Snippet / Minimal UI Element */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute right-[45%] top-[35%] pointer-events-none w-[320px] rounded-lg border border-white/5 bg-[#0c0c0e] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.02] px-4 py-2">
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-slate-700/50" />
                <div className="size-2.5 rounded-full bg-slate-700/50" />
                <div className="size-2.5 rounded-full bg-slate-700/50" />
              </div>
              <p className="text-[10px] font-medium text-slate-500 ml-2 font-mono">architecture.ts</p>
            </div>
            <div className="p-4 space-y-2">
              <div className="h-2 w-3/4 rounded-full bg-slate-800" />
              <div className="h-2 w-1/2 rounded-full bg-slate-800" />
              <div className="h-2 w-5/6 rounded-full bg-slate-800" />
            </div>
          </motion.div>
        </section>

        {/* Right Side: Auth Form */}
        <section className="relative flex justify-center lg:justify-end w-full">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full max-w-[420px]"
          >
            {/* Mobile Logo */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <span className="grid size-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-100 shadow-sm">
                <SearchCode size={20} />
              </span>
              <div>
                <p className="text-lg font-semibold tracking-tight text-white">CodeLens</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-50 mb-2">{title}</h2>
              <p className="text-sm text-slate-400">{subtitle}</p>
            </div>
            
            <div className="mt-8">{children}</div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
