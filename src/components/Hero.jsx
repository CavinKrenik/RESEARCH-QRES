import { motion } from 'framer-motion'
import { ChevronDown, Cpu, Network, Shield } from 'lucide-react'
import consensusGif from '../assets/consensus_evolution.gif'

const typewriter = {
  hidden: { opacity: 0 },
  visible: (i) => ({
    opacity: 1,
    transition: { delay: i * 0.03 },
  }),
}

const tagline = '> Self-Organizing Byzantine Resistance for Edge Intelligence'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-void">
      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]">
        <div
          className="w-full h-[2px] bg-accent"
          style={{ animation: 'scanline 4s linear infinite' }}
        />
      </div>

      {/* Consensus GIF background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-15">
        <img
          src={consensusGif}
          alt="Consensus evolution"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Terminal frame */}
          <div className="bg-panel border border-border rounded-lg p-8 mb-8 text-left shadow-2xl">
            <div className="flex items-center gap-2 mb-4 border-b border-border pb-3">
              <div className="w-3 h-3 rounded-full bg-danger" />
              <div className="w-3 h-3 rounded-full bg-warn" />
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="ml-3 text-text-dim text-xs">qres@swarm:~</span>
            </div>

            <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl font-bold text-text mb-4 leading-tight">
              <span className="text-accent">QRES</span>
              <span className="text-text-dim text-2xl md:text-3xl block mt-2">
                Decentralized OS for Neural Swarms
              </span>
            </h1>

            <div className="font-mono text-sm md:text-base text-accent/80 mb-6">
              {tagline.split('').map((char, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={typewriter}
                  initial="hidden"
                  animate="visible"
                >
                  {char}
                </motion.span>
              ))}
              <span className="inline-block w-2 h-5 bg-accent ml-1 animate-[blink_1s_infinite]" />
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-text-dim">
              <span className="px-3 py-1 border border-border rounded-full flex items-center gap-1">
                <Cpu size={12} /> Deterministic Q16.16 Math
              </span>
              <span className="px-3 py-1 border border-border rounded-full flex items-center gap-1">
                <Shield size={12} /> Krum BFT Defense
              </span>
              <span className="px-3 py-1 border border-border rounded-full flex items-center gap-1">
                <Network size={12} /> 63x Error Reduction
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stat cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-12"
        >
          {[
            { label: 'Compression', value: '24.9x' },
            { label: 'BFT Tolerance', value: 'f < n/3' },
            { label: 'Papers', value: '3' },
          ].map((stat) => (
            <div key={stat.label} className="bg-panel border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-accent">{stat.value}</div>
              <div className="text-xs text-text-dim mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.a
          href="#research"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="inline-flex items-center gap-2 text-text-dim hover:text-accent transition-colors"
        >
          <span className="text-sm">Explore Research</span>
          <ChevronDown size={16} className="animate-bounce" />
        </motion.a>
      </div>
    </section>
  )
}
