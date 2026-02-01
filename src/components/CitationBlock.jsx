import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, FileText, ExternalLink } from 'lucide-react'
import { papers, toBibTeX, citationCFF } from '../data/citation'

export default function CitationBlock() {
  const [copied, setCopied] = useState(null)
  const [selectedPaper, setSelectedPaper] = useState(0)

  const bibtex = toBibTeX(papers[selectedPaper])

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <section id="cite" className="py-24 px-6 bg-void">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-text mb-2">
            Cite QRES
          </h2>
          <p className="text-text-dim text-sm mb-8">
            ORCID: <a href={citationCFF.author.orcid} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              0009-0008-9183-1278
            </a>
          </p>
        </motion.div>

        {/* Paper selector */}
        <div className="flex flex-col gap-2 mb-6">
          {papers.map((paper, i) => (
            <button
              key={i}
              onClick={() => setSelectedPaper(i)}
              className={`text-left p-4 rounded-lg border transition-all ${
                i === selectedPaper
                  ? 'border-accent bg-accent/5'
                  : 'border-border hover:border-border/80'
              }`}
            >
              <div className="flex items-start gap-3">
                <FileText size={16} className={`mt-0.5 shrink-0 ${i === selectedPaper ? 'text-accent' : 'text-text-dim'}`} />
                <div>
                  <div className="text-sm font-semibold text-text">{paper.title}</div>
                  <div className="text-xs text-text-dim mt-1">
                    Krenik, C. ({paper.year}) · DOI: {paper.doi}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* BibTeX block */}
        <div className="bg-panel border border-border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-xs text-text-dim uppercase tracking-wider">BibTeX</span>
            <button
              onClick={() => handleCopy(bibtex, 'bibtex')}
              className="flex items-center gap-1.5 text-xs text-text-dim hover:text-accent transition-colors"
            >
              {copied === 'bibtex' ? <Check size={12} className="text-accent" /> : <Copy size={12} />}
              {copied === 'bibtex' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="p-4 text-xs text-accent/80 overflow-x-auto font-mono leading-relaxed">
            {bibtex}
          </pre>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap gap-3 mt-6">
          <a
            href={papers[selectedPaper].zenodoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-panel border border-border rounded-lg text-sm text-text-dim hover:text-accent hover:border-accent/30 transition-all"
          >
            <ExternalLink size={14} />
            View on Zenodo
          </a>
          <a
            href={citationCFF.repository}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-panel border border-border rounded-lg text-sm text-text-dim hover:text-accent hover:border-accent/30 transition-all"
          >
            <ExternalLink size={14} />
            GitHub Repository
          </a>
          <button
            onClick={() => handleCopy(
              `Krenik, C. (2026). ${papers[selectedPaper].title}. https://doi.org/${papers[selectedPaper].doi}`,
              'apa'
            )}
            className="flex items-center gap-2 px-4 py-2 bg-panel border border-border rounded-lg text-sm text-text-dim hover:text-accent hover:border-accent/30 transition-all"
          >
            {copied === 'apa' ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
            Copy APA
          </button>
        </div>
      </div>
    </section>
  )
}
