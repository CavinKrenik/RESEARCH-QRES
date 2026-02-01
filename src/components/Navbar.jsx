import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Github, FileText, ExternalLink } from 'lucide-react'

const navLinks = [
  { label: 'Research', href: '#research' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Attack Lab', href: '#attack-lab' },
  { label: 'Benchmarks', href: '#benchmarks' },
  { label: 'Cite', href: '#cite' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-void/90 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 text-accent font-bold tracking-wider">
          <Terminal size={18} />
          <span className="font-[family-name:var(--font-display)]">QRES</span>
          <span className="text-text-dim text-xs ml-1">v18</span>
        </a>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-text-dim text-sm hover:text-accent transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com/CavinKrenik/QRES"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-dim hover:text-accent transition-colors"
          >
            <Github size={16} />
          </a>
        </div>
      </div>
    </motion.nav>
  )
}
