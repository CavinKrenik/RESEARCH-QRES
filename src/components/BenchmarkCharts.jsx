import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Layers, Zap } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from 'recharts'
import results from '../data/v16_results.json'

const DATASETS = [...new Set(results.map((r) => r.dataset))]
const COLORS = {
  Zero: '#ff4444',
  Heuristic: '#ffaa00',
  Neural: '#00ffcc',
  Hybrid: '#8b5cf6',
}

export default function BenchmarkCharts() {
  const [selectedDataset, setSelectedDataset] = useState('ECG5000_Proxy')
  const [chartType, setChartType] = useState('compression')

  const filtered = useMemo(
    () => results.filter((r) => r.dataset === selectedDataset && r.coder === 'Huffman'),
    [selectedDataset],
  )

  const compressionData = filtered.map((r) => ({
    predictor: r.predictor,
    totalRatio: r.totalRatio,
    bitPackRatio: r.bitPackRatio,
    neuralGain: r.neuralGain,
  }))

  const speedData = filtered
    .filter((r) => r.compressSpeed !== null)
    .map((r) => ({
      predictor: r.predictor,
      compress: r.compressSpeed,
      decompress: r.decompressSpeed,
    }))

  // Cross-dataset comparison: best ratio per dataset
  const crossDataset = DATASETS.map((ds) => {
    const rows = results.filter((r) => r.dataset === ds && r.coder === 'Huffman')
    const best = rows.reduce((a, b) => (a.totalRatio > b.totalRatio ? a : b), rows[0])
    return {
      dataset: ds.replace('_Proxy', '').replace('_', ' '),
      ratio: best.totalRatio,
      neuralGain: best.neuralGain,
      rawSize: best.rawSize,
    }
  })

  return (
    <section id="benchmarks" className="py-24 px-6 bg-panel">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-text mb-2">
            v16 Benchmarks
          </h2>
          <p className="text-text-dim text-sm mb-8">
            Compression performance across 7 datasets — parsed from v16_results.csv
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-text-dim" />
            <select
              value={selectedDataset}
              onChange={(e) => setSelectedDataset(e.target.value)}
              className="bg-void border border-border rounded px-3 py-1.5 text-sm text-text"
            >
              {DATASETS.map((ds) => (
                <option key={ds} value={ds}>{ds}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-1 bg-void rounded border border-border p-0.5">
            {[
              { key: 'compression', label: 'Compression', icon: BarChart3 },
              { key: 'speed', label: 'Speed', icon: Zap },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setChartType(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-all ${
                  chartType === key
                    ? 'bg-accent/10 text-accent border border-accent/30'
                    : 'text-text-dim hover:text-text'
                }`}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main chart */}
          <div className="bg-void border border-border rounded-lg p-6">
            <h3 className="text-sm text-text-dim uppercase tracking-wider mb-4">
              {chartType === 'compression' ? 'Compression Ratios by Predictor' : 'Throughput (MB/s)'}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              {chartType === 'compression' ? (
                <BarChart data={compressionData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="predictor" tick={{ fontSize: 11, fill: '#888' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#888' }} />
                  <Tooltip contentStyle={{ background: '#0a0a1a', border: '1px solid #222', fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#888' }} />
                  <Bar dataKey="totalRatio" name="Total Ratio" radius={[4, 4, 0, 0]}>
                    {compressionData.map((entry) => (
                      <Cell key={entry.predictor} fill={COLORS[entry.predictor]} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <BarChart data={speedData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="predictor" tick={{ fontSize: 11, fill: '#888' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#888' }} label={{ value: 'MB/s', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#888' }} />
                  <Tooltip contentStyle={{ background: '#0a0a1a', border: '1px solid #222', fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#888' }} />
                  <Bar dataKey="compress" name="Compress" fill="#00ffcc" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="decompress" name="Decompress" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Cross-dataset comparison */}
          <div className="bg-void border border-border rounded-lg p-6">
            <h3 className="text-sm text-text-dim uppercase tracking-wider mb-4">
              Best Compression Ratio by Dataset
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={crossDataset} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#888' }} />
                <YAxis dataKey="dataset" type="category" tick={{ fontSize: 10, fill: '#888' }} width={120} />
                <Tooltip contentStyle={{ background: '#0a0a1a', border: '1px solid #222', fontSize: 12 }} />
                <Bar dataKey="ratio" fill="#00ffcc" radius={[0, 4, 4, 0]} name="Compression Ratio" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { label: 'Peak Ratio', value: '24.9x', sub: 'SmoothSine' },
            { label: 'Datasets', value: '7', sub: 'Tested' },
            { label: 'Predictors', value: '4', sub: 'Zero/Heuristic/Neural/Hybrid' },
            { label: 'Max Speed', value: '6.6 MB/s', sub: 'ECG5000 Neural' },
          ].map((s) => (
            <div key={s.label} className="bg-void border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-accent">{s.value}</div>
              <div className="text-xs text-text-dim mt-1">{s.label}</div>
              <div className="text-[10px] text-text-muted mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
