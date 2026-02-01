import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'

import fig1 from '@/assets/fig1_attack_rejection.png'
import fig2 from '@/assets/fig2_three_scenarios.png'
import fig3 from '@/assets/fig3_tolerance_curve.png'
import fig4 from '@/assets/fig4_temporal_evolution.png'

const panels = [
  {
    src: fig1,
    title: 'Attack Rejection',
    caption: 'Krum-based Byzantine detection isolating malicious gradient updates in real-time.',
  },
  {
    src: fig2,
    title: 'Three Scenarios',
    caption: 'Calm, storm, and recovery phases demonstrating swarm resilience under varying entropy.',
  },
  {
    src: fig3,
    title: 'Tolerance Curve',
    caption: 'Accuracy degradation as Byzantine fraction f/n increases — graceful decline up to f < n/3.',
  },
  {
    src: fig4,
    title: 'Temporal Evolution',
    caption: 'Consensus convergence over 200 rounds showing deterministic rematerialization.',
  },
]

export default function ResearchGallery() {
  const [active, setActive] = useState(0)
  const [expanded, setExpanded] = useState(false)

  const prev = () => setActive((a) => (a - 1 + panels.length) % panels.length)
  const next = () => setActive((a) => (a + 1) % panels.length)

  return (
    <section id="research" className="py-24 px-6 bg-void">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-text mb-2">
            Research Figures
          </h2>
          <p className="text-text-dim text-sm mb-10">
            From &quot;Deterministic BFT for Resource-Constrained Edge Learning&quot; — DOI: 10.5281/zenodo.18446020
          </p>
        </motion.div>

        {/* Main viewer */}
        <div className="relative bg-panel border border-border rounded-lg overflow-hidden mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <img
                src={panels[active].src}
                alt={panels[active].title}
                className={`w-full object-contain ${expanded ? 'max-h-[80vh]' : 'max-h-[500px]'} transition-all`}
              />
            </motion.div>
          </AnimatePresence>

          {/* Controls overlay */}
          <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
            <button
              onClick={prev}
              className="pointer-events-auto p-2 bg-void/80 rounded-full border border-border text-text-dim hover:text-accent transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="pointer-events-auto p-2 bg-void/80 rounded-full border border-border text-text-dim hover:text-accent transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Expand button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="absolute top-4 right-4 p-2 bg-void/80 rounded border border-border text-text-dim hover:text-accent transition-colors"
          >
            <Maximize2 size={14} />
          </button>

          {/* Caption bar */}
          <div className="bg-void/90 border-t border-border px-6 py-4">
            <h3 className="text-accent font-semibold text-sm">
              Fig. {active + 1}: {panels[active].title}
            </h3>
            <p className="text-text-dim text-xs mt-1">{panels[active].caption}</p>
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="grid grid-cols-4 gap-3">
          {panels.map((panel, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                i === active
                  ? 'border-accent shadow-[0_0_12px_#00ffcc33]'
                  : 'border-border opacity-60 hover:opacity-100'
              }`}
            >
              <img src={panel.src} alt={panel.title} className="w-full h-20 object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-void/80 px-2 py-1 text-[10px] text-text-dim">
                {panel.title}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
