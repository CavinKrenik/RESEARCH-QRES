import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ResearchGallery from '@/components/ResearchGallery'
import SwarmDashboard from '@/components/SwarmDashboard'
import AttackLab from '@/components/AttackLab'
import BenchmarkCharts from '@/components/BenchmarkCharts'
import CitationBlock from '@/components/CitationBlock'

export default function App() {
  return (
    <div className="min-h-screen bg-void">
      <Navbar />
      <Hero />
      <ResearchGallery />
      <SwarmDashboard />
      <AttackLab />
      <BenchmarkCharts />
      <CitationBlock />

      {/* Footer */}
      <footer className="py-12 px-6 bg-panel border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-accent font-[family-name:var(--font-display)] text-lg mb-2">QRES</div>
          <p className="text-text-dim text-xs mb-4">
            A Decentralized Operating System for Neural Swarms
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-text-muted">
            <span>Cavin Krenik, 2026</span>
            <span>·</span>
            <span>MIT / Apache-2.0</span>
            <span>·</span>
            <a
              href="https://doi.org/10.5281/zenodo.18261441"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-dim hover:text-accent transition-colors"
            >
              DOI: 10.5281/zenodo.18261441
            </a>
            <span>·</span>
            <a
              href="mailto:cavinkrenik5@icloud.com"
              className="text-text-dim hover:text-accent transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
