// Simulate TASO2 user results with yliopisto recommendation
const mockResults = {
  success: true,
  cohort: 'TASO2',
  userProfile: {
    cohort: 'TASO2',
    dimensionScores: {
      interests: 75,
      values: 70,
      workstyle: 65,
      context: 60
    },
    topStrengths: ['analytical', 'technology', 'problem_solving']
  },
  topCareers: [
    {
      slug: 'ohjelmistokehittaja',
      title: 'Ohjelmistokehittaja',
      category: 'innovoija',
      overallScore: 85,
      dimensionScores: { interests: 80, values: 75, workstyle: 70, context: 65 },
      reasons: ['Sinussa on vahva teknologinen uteliaisuus'],
      confidence: 'high'
    },
    {
      slug: 'tietoturva-asiantuntija',
      title: 'Tietoturva-asiantuntija',
      category: 'innovoija',
      overallScore: 82,
      dimensionScores: { interests: 78, values: 72, workstyle: 68, context: 64 },
      reasons: ['Profiilistasi välittyy teknologinen kiinnostus'],
      confidence: 'high'
    }
  ],
  educationPath: {
    primary: 'yliopisto',
    secondary: 'amk',
    scores: { yliopisto: 75, amk: 65 },
    reasoning: 'Vastaustesi perusteella yliopisto-opinnot sopivat sinulle erittäin hyvin.',
    confidence: 'high'
  },
  cohortCopy: {
    title: 'Sinun urasuosituksesi',
    subtitle: 'Vastaustesi perusteella',
    ctaText: 'Selaa ammatteja',
    shareText: 'Katso urasuositukseni'
  }
};

console.log('Mock results created. Use this in browser console:');
console.log('localStorage.setItem("careerTestResults", JSON.stringify(' + JSON.stringify(mockResults) + '));');
console.log('Then navigate to /test/results');
