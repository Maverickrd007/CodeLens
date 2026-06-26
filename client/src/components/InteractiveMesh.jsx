import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function InteractiveMesh() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#05050a]">
      
      {/* 1. Animated Glowing Orbs (The streaks of light) */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/30 blur-[130px]" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-purple-600/30 blur-[140px]" 
      />

      {/* 2. Interactive Mouse Glow */}
      <div 
        className="absolute inset-0 transition-opacity duration-300 z-10"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`,
        }}
      />

      {/* 3. The Grid (Dots) */}
      <svg className="absolute inset-0 w-full h-full z-20 opacity-[0.4]">
        <defs>
          <pattern id="dotPattern" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#64748b" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotPattern)" />
      </svg>

      {/* 4. Film Grain / Noise Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay z-30"></div>
    </div>
  );
}
