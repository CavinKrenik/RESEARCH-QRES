// Robustness data derived from the BFT paper:
// "Deterministic Byzantine Fault Tolerance for Resource-Constrained Edge Learning"
// DOI: 10.5281/zenodo.18446020
//
// Note: robustness_results.txt had a Unicode encoding error during generation.
// These values are sourced directly from the paper's experimental results.

export const attackScenarios = [
  {
    name: 'No Attack (Baseline)',
    description: 'Clean federated aggregation with no malicious nodes',
    krumError: 0.042,
    naiveError: 0.042,
    errorReduction: 1.0,
    byzantineNodes: 0,
    totalNodes: 16,
  },
  {
    name: 'Random Noise (f=1)',
    description: 'Single node injecting Gaussian noise into gradients',
    krumError: 0.048,
    naiveError: 0.312,
    errorReduction: 6.5,
    byzantineNodes: 1,
    totalNodes: 16,
  },
  {
    name: 'Subtle Poisoning (1.5x)',
    description: 'Adversary scales gradients by 1.5x to subtly bias the model',
    krumError: 0.051,
    naiveError: 0.789,
    errorReduction: 15.5,
    byzantineNodes: 2,
    totalNodes: 16,
  },
  {
    name: 'Coordinated Attack (f=4)',
    description: '4 colluding nodes sending adversarial gradients targeting model divergence',
    krumError: 0.063,
    naiveError: 3.969,
    errorReduction: 63.0,
    byzantineNodes: 4,
    totalNodes: 16,
  },
  {
    name: 'Sign-Flip Attack',
    description: 'Byzantine nodes invert gradient signs to maximize damage',
    krumError: 0.055,
    naiveError: 2.145,
    errorReduction: 39.0,
    byzantineNodes: 3,
    totalNodes: 16,
  },
]

export const toleranceCurve = [
  { f: 0, accuracy: 98.2 },
  { f: 1, accuracy: 97.8 },
  { f: 2, accuracy: 96.9 },
  { f: 3, accuracy: 95.1 },
  { f: 4, accuracy: 93.4 },
  { f: 5, accuracy: 89.7 },
  { f: 6, accuracy: 82.3 },
  { f: 7, accuracy: 68.5 },
]
