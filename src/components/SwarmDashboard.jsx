import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Activity, Cpu, Wifi, WifiOff, Zap, Thermometer, Battery } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const NODES = [
  { id: 'ESP32-S3', role: 'Sensor Node', ram: '320 KB', icon: Cpu },
  { id: 'Pi-4B', role: 'Aggregator', ram: '4 GB', icon: Wifi },
  { id: 'Jetson Nano', role: 'Edge AI', ram: '4 GB', icon: Zap },
]

function generatePacket(frameIndex) {
  const t = frameIndex * 0.1
  const temp = 22 + 5 * Math.sin(t * 0.3) + (Math.random() - 0.5) * 2
  const vibration = 0.05 + 0.03 * Math.sin(t * 0.7) + Math.random() * 0.01
  const battery = Math.max(10, 100 - frameIndex * 0.05 + (Math.random() - 0.5) * 3)
  const pressure = 1013 + 20 * Math.sin(t * 0.15) + (Math.random() - 0.5) * 5
  const isStorm = Math.sin(t * 0.15) > 0.7

  const rawBytes = 128 + Math.floor(Math.random() * 32)
  const ratio = 0.15 + Math.random() * 0.1
  const compressedBytes = Math.floor(rawBytes * ratio)

  return {
    timestamp: Date.now(),
    frameIndex,
    temp: +temp.toFixed(1),
    vibration: +vibration.toFixed(4),
    battery: Math.floor(battery),
    pressure_raw: +pressure.toFixed(1),
    status: isStorm ? 'LEARNING' : 'INFERRING',
    rawBytes,
    compressedBytes,
    compressionRatio: +(rawBytes / compressedBytes).toFixed(1),
  }
}

function NodeStatusPanel({ nodes, statuses, streaming }) {
  return (
    <div className="flex flex-col gap-2">
      {nodes.map((node, i) => {
        const Icon = node.icon
        const status = streaming ? statuses[i] : 'OFFLINE'
        const colors = {
          INFERRING: 'text-accent',
          LEARNING: 'text-warn',
          OFFLINE: 'text-text-muted',
        }
        return (
          <div key={node.id} className="flex items-center gap-3 p-2 bg-void/50 rounded border border-border">
            <Icon size={16} className={colors[status]} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-text truncate">{node.id}</div>
              <div className="text-[10px] text-text-dim">{node.role} · {node.ram}</div>
            </div>
            <span className={`text-[10px] font-bold ${colors[status]}`}>{status}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function SwarmDashboard() {
  const [streaming, setStreaming] = useState(false)
  const [packet, setPacket] = useState(null)
  const [bandwidthHistory, setBandwidthHistory] = useState([])
  const [packetCount, setPacketCount] = useState(0)
  const [nodeStatuses, setNodeStatuses] = useState(['OFFLINE', 'OFFLINE', 'OFFLINE'])
  const frameRef = useRef(0)
  const intervalRef = useRef(null)

  const tick = useCallback(() => {
    const p = generatePacket(frameRef.current++)
    setPacket(p)
    setPacketCount((c) => c + 1)
    setBandwidthHistory((h) => {
      const next = [
        ...h.slice(-99),
        { time: new Date(p.timestamp).toLocaleTimeString(), raw: p.rawBytes, compressed: p.compressedBytes },
      ]
      return next
    })
    setNodeStatuses([
      p.status === 'LEARNING' ? 'LEARNING' : 'INFERRING',
      'INFERRING',
      'INFERRING',
    ])
  }, [])

  const toggleStream = () => {
    if (streaming) {
      clearInterval(intervalRef.current)
      setNodeStatuses(['OFFLINE', 'OFFLINE', 'OFFLINE'])
    } else {
      intervalRef.current = setInterval(tick, 500)
      tick()
    }
    setStreaming(!streaming)
  }

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  return (
    <section id="dashboard" className="py-24 px-6 bg-panel">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-text mb-2">
            Swarm Dashboard
          </h2>
          <p className="text-text-dim text-sm mb-8">
            Live telemetry simulation — ported from IoTDashboard.svelte
          </p>
        </motion.div>

        {/* 3-column grid from IoTDashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr_250px] gap-4 min-h-[480px]">
          {/* Left panel: Edge Swarm */}
          <div className="bg-void border border-border rounded-lg p-4 flex flex-col gap-3">
            <h3 className="text-xs text-text-dim uppercase tracking-wider border-b border-border pb-2">
              Edge Swarm
            </h3>

            <button
              onClick={toggleStream}
              className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-bold border transition-all ${
                streaming
                  ? 'bg-danger/10 border-danger text-danger hover:bg-danger/20'
                  : 'bg-accent/10 border-accent text-accent hover:bg-accent/20'
              }`}
            >
              {streaming ? <WifiOff size={14} /> : <Wifi size={14} />}
              {streaming ? 'Disconnect' : 'Connect Swarm'}
            </button>

            <div className="h-px bg-border" />
            <NodeStatusPanel nodes={NODES} statuses={nodeStatuses} streaming={streaming} />

            {/* Debug overlay */}
            {packet && (
              <div className="mt-auto p-3 bg-void/50 rounded-lg border border-border/50 font-mono text-xs">
                <h4 className="text-green-400 mb-2">Weather Debug</h4>
                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-text-dim">Frame:</span>
                  <span className="text-text">{packet.frameIndex}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-text-dim">Pressure:</span>
                  <span className="text-text">{packet.pressure_raw} mbar</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-text-dim">Compression:</span>
                  <span className="text-text">{packet.compressionRatio}:1</span>
                </div>
              </div>
            )}
          </div>

          {/* Center panel: Bandwidth Chart */}
          <div className="bg-void border border-border rounded-lg p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs text-text-dim uppercase tracking-wider border-b border-border pb-2">
                Real-time Bandwidth Optimization
              </h3>
              <div className={`text-xs font-bold ${streaming ? 'text-danger animate-[blink_1s_infinite]' : 'text-text-muted'}`}>
                {streaming ? '● LIVE' : '○ OFFLINE'}
              </div>
            </div>

            <div className="w-full" style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={bandwidthHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#888' }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 10, fill: '#888' }} />
                  <Tooltip
                    contentStyle={{ background: '#0a0a1a', border: '1px solid #222', fontSize: 12 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="raw"
                    stroke="#ff444488"
                    fill="#ff444422"
                    name="Raw Bytes"
                  />
                  <Area
                    type="monotone"
                    dataKey="compressed"
                    stroke="#00ffcc"
                    fill="#00ffcc22"
                    name="Compressed"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Terminal log */}
            <div className="bg-black p-3 font-mono text-xs border-l-[3px] border-accent mt-auto">
              {packet ? (
                <>
                  <span className="text-text-dim mr-3">
                    [{new Date(packet.timestamp).toLocaleTimeString()}]
                  </span>
                  <span className="text-accent">
                    Temp: {packet.temp}°C | Vib: {packet.vibration}g | Bat: {packet.battery}%
                  </span>
                </>
              ) : (
                <span className="text-text-muted">Waiting for stream...</span>
              )}
            </div>
          </div>

          {/* Right panel: MetaBrain */}
          <div className="bg-void border border-border rounded-lg p-4 flex flex-col gap-3">
            <h3 className="text-xs text-text-dim uppercase tracking-wider border-b border-border pb-2">
              MetaBrain State
            </h3>

            {/* SNN Spike Visualizer placeholder */}
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-sm transition-colors duration-300 ${
                      streaming && Math.random() > 0.5
                        ? 'bg-accent shadow-[0_0_6px_#00ffcc66]'
                        : 'bg-border'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-text-dim mt-2">SNN Spike Activity</span>
            </div>

            <div className="bg-panel p-4 text-center rounded">
              <div className="text-[10px] text-text-dim uppercase tracking-wider">Packets Processed</div>
              <div className="text-3xl font-bold text-text mt-1">{packetCount}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
