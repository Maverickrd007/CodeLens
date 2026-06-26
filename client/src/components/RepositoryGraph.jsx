import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Html, Line, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

const NODES = [
  { id: 'src', label: 'src', type: 'folder', position: [0, 0, 0] },
  { id: 'components', label: 'components', type: 'folder', position: [-2.5, 1.5, -1] },
  { id: 'hooks', label: 'hooks', type: 'folder', position: [2.5, 1.5, -1] },
  { id: 'middleware', label: 'middleware', type: 'folder', position: [-3, -1, 1.5] },
  { id: 'services', label: 'services', type: 'folder', position: [3, -1, 1.5] },
  { id: 'controllers', label: 'controllers', type: 'folder', position: [0, -2.5, 0] },
  { id: 'auth.ts', label: 'auth.ts', type: 'file', position: [1.5, -3.5, 1.5] },
  { id: 'login.ts', label: 'login.ts', type: 'file', position: [-1.5, -3.5, 1.5] },
  { id: 'jwt.ts', label: 'jwt.ts', type: 'file', position: [-4, -2.5, 2] },
  { id: 'database.ts', label: 'database.ts', type: 'file', position: [4, -2.5, 0] },
  { id: 'api.ts', label: 'api.ts', type: 'file', position: [4.5, 0, 1] },
  { id: 'types.ts', label: 'types.ts', type: 'file', position: [0, 2.5, 1.5] },
  { id: 'package.json', label: 'package.json', type: 'file', position: [-2, 3.5, 0] },
  { id: 'README.md', label: 'README.md', type: 'file', position: [2, 3.5, 0] },
];

const EDGES = [
  ['src', 'components'],
  ['src', 'hooks'],
  ['src', 'middleware'],
  ['src', 'services'],
  ['src', 'controllers'],
  ['controllers', 'auth.ts'],
  ['controllers', 'login.ts'],
  ['middleware', 'jwt.ts'],
  ['services', 'database.ts'],
  ['services', 'api.ts'],
  ['src', 'types.ts'],
  ['src', 'package.json'],
  ['src', 'README.md'],
  ['auth.ts', 'jwt.ts'],
  ['login.ts', 'auth.ts'],
];

const AI_SCENARIOS = [
  {
    question: "Where is authentication handled?",
    highlights: ['auth.ts', 'login.ts', 'jwt.ts', 'middleware'],
    response: "I found 3 files and 1 middleware handling authentication.",
    confidence: "98%",
    time: "1.2s",
  },
  {
    question: "How does the database connect?",
    highlights: ['database.ts', 'services', 'api.ts'],
    response: "Database connections are initialized in services/database.ts.",
    confidence: "95%",
    time: "0.8s",
  },
  {
    question: "Are there any circular dependencies?",
    highlights: ['auth.ts', 'jwt.ts'],
    response: "No circular dependencies found. auth.ts properly imports jwt.ts.",
    confidence: "100%",
    time: "2.1s",
  }
];

function GraphNode({ node, isHighlighted, isDimmed }) {
  const [hovered, setHovered] = useState(false);
  const isFolder = node.type === 'folder';
  
  // Base colors
  const baseColor = isFolder ? '#3b82f6' : '#8b5cf6'; // Blue for folders, Purple for files
  const highlightColor = '#22d3ee'; // Cyan for AI highlight
  
  const currentColor = isHighlighted ? highlightColor : baseColor;
  const currentOpacity = isDimmed ? 0.1 : (isHighlighted ? 1 : (hovered ? 0.9 : 0.6));
  const scale = hovered || isHighlighted ? 1.3 : 1;
  const size = isFolder ? 0.3 : 0.15;

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} position={node.position}>
      <mesh 
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
        scale={scale}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={currentColor} 
          emissive={currentColor}
          emissiveIntensity={isHighlighted ? 2 : (hovered ? 1 : 0.5)}
          transparent
          opacity={currentOpacity}
        />
        <Html distanceFactor={15} center zIndexRange={[100, 0]}>
          <div className={`
            px-2 py-1 rounded-md text-[10px] font-mono font-medium tracking-wide backdrop-blur-md
            transition-all duration-300 pointer-events-none whitespace-nowrap
            ${isHighlighted 
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.4)]' 
              : hovered
                ? 'bg-white/10 text-white border border-white/20'
                : isDimmed
                  ? 'opacity-0'
                  : 'bg-black/40 text-slate-400 border border-white/5'
            }
          `}>
            {node.label}
          </div>
        </Html>
      </mesh>
    </Float>
  );
}

function GraphEdges({ nodes, edges, activeHighlights }) {
  const nodeMap = useMemo(() => {
    const map = {};
    nodes.forEach(n => map[n.id] = n);
    return map;
  }, [nodes]);

  return (
    <group>
      {edges.map((edge, idx) => {
        const source = nodeMap[edge[0]];
        const target = nodeMap[edge[1]];
        if (!source || !target) return null;

        const isHighlighted = activeHighlights.includes(source.id) && activeHighlights.includes(target.id);
        const isDimmed = activeHighlights.length > 0 && !isHighlighted;

        return (
          <Line
            key={idx}
            points={[source.position, target.position]}
            color={isHighlighted ? '#22d3ee' : '#334155'}
            lineWidth={isHighlighted ? 2 : 1}
            transparent
            opacity={isDimmed ? 0.05 : (isHighlighted ? 0.8 : 0.2)}
          />
        );
      })}
    </group>
  );
}

function Scene({ activeHighlights }) {
  const groupRef = useRef();

  // Slow idle rotation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001; // 0.5 deg / sec approx
    }
  });

  return (
    <group ref={groupRef}>
      <GraphEdges nodes={NODES} edges={EDGES} activeHighlights={activeHighlights} />
      {NODES.map((node) => {
        const isHighlighted = activeHighlights.includes(node.id);
        const isDimmed = activeHighlights.length > 0 && !isHighlighted;
        return (
          <GraphNode 
            key={node.id} 
            node={node} 
            isHighlighted={isHighlighted}
            isDimmed={isDimmed}
          />
        );
      })}
    </group>
  );
}

export function RepositoryGraph() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [phase, setPhase] = useState('idle'); // idle -> asking -> highlighting -> idle

  useEffect(() => {
    // Sequence logic
    let timeout1, timeout2, timeout3;

    const runSequence = () => {
      setPhase('asking');
      
      timeout1 = setTimeout(() => {
        setPhase('highlighting');
      }, 2000); // show question for 2s

      timeout2 = setTimeout(() => {
        setPhase('idle');
      }, 7000); // highlight for 5s

      timeout3 = setTimeout(() => {
        setScenarioIdx((prev) => (prev + 1) % AI_SCENARIOS.length);
        runSequence();
      }, 8000); // 1s idle between loops
    };

    runSequence();

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, []);

  const currentScenario = AI_SCENARIOS[scenarioIdx];
  const isHighlighting = phase === 'highlighting';
  const activeHighlights = isHighlighting ? currentScenario.highlights : [];

  return (
    <div className="relative w-full h-full bg-transparent">
      {/* 3D Canvas */}
      <div className="absolute inset-0 cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Scene activeHighlights={activeHighlights} />
          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            minDistance={4} 
            maxDistance={15}
            autoRotate={false} 
          />
        </Canvas>
      </div>

      {/* AI Interaction Overlay (HTML) */}
      <div className="absolute top-1/2 -translate-y-1/2 right-8 flex flex-col items-end pointer-events-none w-full max-w-sm z-50">
        <AnimatePresence mode="wait">
          {(phase === 'asking' || phase === 'highlighting') && (
            <motion.div
              key="question"
              initial={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
              transition={{ duration: 0.5 }}
              className="mb-4 rounded-2xl rounded-tr-sm border border-white/10 bg-[#0c0c0e]/80 backdrop-blur-md px-5 py-3 shadow-2xl"
            >
              <p className="text-[13px] font-medium text-slate-200">
                <span className="text-purple-400 mr-2 font-semibold">User:</span>
                {currentScenario.question}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === 'highlighting' && (
            <motion.div
              key="answer"
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full rounded-2xl rounded-tr-sm border border-cyan-500/30 bg-cyan-950/40 backdrop-blur-xl p-5 shadow-[0_0_40px_rgba(34,211,238,0.1)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
              <p className="text-[13px] font-medium text-cyan-50 leading-relaxed mb-4">
                {currentScenario.response}
              </p>
              <div className="flex items-center gap-4 border-t border-cyan-500/20 pt-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-cyan-500/70 font-semibold">Confidence</span>
                  <span className="text-xs font-mono text-cyan-300">{currentScenario.confidence}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-cyan-500/70 font-semibold">Time</span>
                  <span className="text-xs font-mono text-cyan-300">{currentScenario.time}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
