export const citationCFF = {
  title: 'QRES: A Decentralized Operating System for Neural Swarms',
  version: 'v18.0.0',
  doi: '10.5281/zenodo.18261441',
  dateReleased: '2026-01-15',
  author: {
    familyNames: 'Krenik',
    givenNames: 'Cavin',
    orcid: 'https://orcid.org/0009-0008-9183-1278',
  },
  repository: 'https://github.com/CavinKrenik/QRES',
  license: 'MIT OR Apache-2.0',
}

export const papers = [
  {
    title: 'QRES: A Decentralized Operating System for Neural Swarms',
    doi: '10.5281/zenodo.18261441',
    zenodoUrl: 'https://zenodo.org/records/18261441',
    year: 2026,
    type: 'software',
  },
  {
    title: 'Deterministic Byzantine Fault Tolerance for Resource-Constrained Edge Learning',
    doi: '10.5281/zenodo.18446020',
    zenodoUrl: 'https://zenodo.org/records/18446020',
    year: 2026,
    type: 'article',
  },
  {
    title: 'Deterministic Rematerialization: Convergent Evolution in Cloud Kernels and Edge Swarms',
    doi: '10.5281/zenodo.18305656',
    zenodoUrl: 'https://zenodo.org/records/18305656',
    year: 2026,
    type: 'article',
  },
]

export function toBibTeX(paper) {
  const type = paper.type === 'software' ? 'software' : 'article'
  const key = `krenik2026${paper.title.split(' ')[0].toLowerCase()}`
  return `@${type}{${key},
  author    = {Krenik, Cavin},
  title     = {${paper.title}},
  year      = {${paper.year}},
  doi       = {${paper.doi}},
  url       = {https://doi.org/${paper.doi}},
  orcid     = {0009-0008-9183-1278}
}`
}
