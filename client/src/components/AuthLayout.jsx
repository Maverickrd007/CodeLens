import { motion } from 'framer-motion';
import { Bot, Code2, Database, Network, SearchCode, ShieldAlert, Sparkles, TerminalSquare } from 'lucide-react';

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

export function AuthLayout({ title, subtitle, children }) {
  const AnimatedBackground = () => (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-cyan-600/30 blur-[100px]" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          rotate: [0, -90, 0],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[30%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/30 blur-[100px]" 
      />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
    </div>
  );

  return (
    <main className="relative min-h-screen bg-[#09090b] text-slate-200 selection:bg-cyan-500/30 overflow-hidden font-sans">
      
      <AnimatedBackground />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center gap-12 px-6 py-12 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        
        {/* Left Side: Marketing & Visuals */}
        <section className="hidden lg:flex flex-col justify-center h-full pt-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-16"
          >
            <span className="grid w-12 h-12 place-items-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 shadow-lg shadow-cyan-500/20 text-cyan-400">
              <SearchCode size={24} />
            </span>
            <div>
              <p className="text-xl font-bold tracking-tight text-white">CodeLens</p>
              <p className="text-sm font-medium text-cyan-400">AI Workspace</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <h1 className="text-6xl font-bold leading-[1.1] tracking-tighter text-white mb-6">
              Understand any <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                codebase.
              </span>
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-slate-400 mb-10">
              Upload any repository. Ask anything. Understand architecture instantly.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 max-w-md">
              {featurePills.map((pill, i) => (
                <motion.div
                  key={pill.text}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md shadow-sm transition-colors hover:bg-white/10 hover:border-white/20"
                >
                  <pill.icon size={16} className="text-cyan-400" />
                  <span className="text-sm font-medium text-slate-200">{pill.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Floating Glass Elements */}
          <div className="absolute right-[45%] top-[25%] pointer-events-none">
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
          
          <div className="absolute right-[50%] bottom-[20%] pointer-events-none">
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
        </section>

        {/* Right Side: Auth Form */}
        <section className="relative flex justify-center lg:justify-end w-full">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-[440px] rounded-[24px] border border-white/10 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-2xl sm:p-10"
          >
            {/* Mobile Logo */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <span className="grid w-12 h-12 place-items-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 shadow-lg text-cyan-400">
                <SearchCode size={24} />
              </span>
              <div>
                <p className="text-xl font-bold text-white">CodeLens</p>
                <p className="text-xs font-medium text-cyan-400">AI Workspace</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">{title}</h2>
              <p className="text-sm text-slate-400">{subtitle}</p>
            </div>
            
            <div className="mt-8">{children}</div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
