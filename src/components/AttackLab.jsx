import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, AlertTriangle, Crosshair } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line,
} from 'recharts'
import { attackScenarios, toleranceCurve } from '@/data/robustnessData'

import krumImg from '@/assets/krum_defense.png'
import toleranceImg from '@/assets/tolerance_curve.png'

export default function AttackLab() {
  const [selected, setSelected] = useState(3) // default to Coordinated Attack

  const chartData = attackScenarios.map((s) => ({
    name: s.name.split('(')[0].trim(),
    Krum: s.krumError,
    Naive: s.naiveError,
  }))

  return (
    <section id="attack-lab" className="py-24 px-6 bg-void">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-text mb-2">
            Attack Lab
          </h2>
          <p className="text-text-dim text-sm mb-10">
            Krum robustness verification — data from BFT paper (DOI: 10.5281/zenodo.18446020)
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Error comparison chart */}
          <div className="bg-panel border border-border rounded-lg p-6">
            <h3 className="text-sm text-text-dim uppercase tracking-wider mb-4">
              Error Rate: Krum vs Naive Aggregation
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#888' }} angle={-15} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 10, fill: '#888' }} />
                <Tooltip contentStyle={{ background: '#0a0a1a', border: '1px solid #222', fontSize: 12 }} />
                <Bar dataKey="Krum" fill="#00ffcc" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Naive" fill="#ff4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            {/* 63x callout */}
            <div className="mt-4 p-4 bg-void border border-accent/30 rounded-lg flex items-center gap-4">
              <Shield className="text-accent shrink-0" size={32} />
              <div>
                <div className="text-2xl font-bold text-accent">63x</div>
                <div className="text-xs text-text-dim">
                  Error reduction under coordinated attack (f=4) — Krum: 0.063 vs Naive: 3.969
                </div>
              </div>
            </div>
          </div>

          {/* Scenario selector */}
          <div className="bg-panel border border-border rounded-lg p-6">
            <h3 className="text-sm text-text-dim uppercase tracking-wider mb-4">
              Attack Scenarios
            </h3>
            <div className="flex flex-col gap-2 mb-6">
              {attackScenarios.map((scenario, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`text-left p-3 rounded-lg border transition-all ${
                    i === selected
                      ? 'border-accent bg-accent/5'
                      : 'border-border hover:border-border/80'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {scenario.byzantineNodes === 0 ? (
                      <Shield size={14} className="text-accent" />
                    ) : scenario.byzantineNodes >= 4 ? (
                      <AlertTriangle size={14} className="text-danger" />
                    ) : (
                      <Crosshair size={14} className="text-warn" />
                    )}
                    <span className="text-sm font-semibold text-text">{scenario.name}</span>
                  </div>
                  <p className="text-xs text-text-dim pl-6">{scenario.description}</p>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-void border border-border rounded-lg p-4"
              >
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-accent">
                      {attackScenarios[selected].krumError}
                    </div>
                    <div className="text-[10px] text-text-dim">Krum Error</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-danger">
                      {attackScenarios[selected].naiveError}
                    </div>
                    <div className="text-[10px] text-text-dim">Naive Error</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-warn">
                      {attackScenarios[selected].errorReduction}x
                    </div>
                    <div className="text-[10px] text-text-dim">Reduction</div>
                  </div>
                </div>
                <div className="mt-3 text-center text-xs text-text-dim">
                  Byzantine nodes: {attackScenarios[selected].byzantineNodes} / {attackScenarios[selected].totalNodes}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Tolerance curve */}
        <div className="mt-8 bg-panel border border-border rounded-lg p-6">
          <h3 className="text-sm text-text-dim uppercase tracking-wider mb-4">
            Byzantine Tolerance Curve (Accuracy vs f)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={toleranceCurve}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis
                dataKey="f"
                tick={{ fontSize: 10, fill: '#888' }}
                label={{ value: 'Byzantine nodes (f)', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#888' }}
              />
              <YAxis
                domain={[60, 100]}
                tick={{ fontSize: 10, fill: '#888' }}
                label={{ value: 'Accuracy %', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#888' }}
              />
              <Tooltip contentStyle={{ background: '#0a0a1a', border: '1px solid #222', fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#00ffcc"
                strokeWidth={2}
                dot={{ fill: '#00ffcc', r: 4 }}
                activeDot={{ r: 6, stroke: '#00ffcc', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
