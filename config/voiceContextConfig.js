// ⚙️ Konfigurimet e VoiceContextService për DigitalOcean

module.exports = {
  // 🔧 KONFIGURIME THEMELORE
  service: {
    name: "VoiceContextService-RRUFE-TESLA",
    version: "8.0.1",
    environment: process.env.NODE_ENV || "production"
  },

  // 🎙️ KONFIGURIME ZANORE
  voice: {
    sampleRate: 16000,
    channels: 1,
    format: "wav",
    maxDuration: 30000, // 30 sekonda
    language: "sq", // Shqip si gjuhe primare
    supportedLanguages: ["sq", "en", "auto"]
  },

  // 🧠 KONFIGURIME NLU
  nlu: {
    provider: "rrufe-nlu-engine",
    confidenceThreshold: 0.7,
    emotionDetection: true,
    intentRecognition: true,
    contextAwareness: true
  },

  // 💾 KONFIGURIME KUJTESE
  memory: {
    maxContextSize: 100, // 100 mesazhe historike
    slidingWindow: true,
    importanceScoring: true,
    autoCleanup: true,
    cleanupInterval: 3600000 // 1 orë
  },

  // 🌐 KONFIGURIME TRANSMETIMI
  broadcast: {
    endpoints: [
      "multiAIBridge",
      "quantumMemory", 
      "divineConstitution",
      "bioNeuralNetwork",
      "universalAiFederation"
    ],
    retryAttempts: 3,
    timeout: 10000, // 10 sekonda
    fallbackEnabled: true
  },

  // 📊 KONFIGURIME MONITORIMI
  monitoring: {
    logLevel: "info",
    performanceTracking: true,
    errorReporting: true,
    healthCheckInterval: 30000 // 30 sekonda
  },

  // 🔐 KONFIGURIME SIGURIE
  security: {
    encryption: true,
    authentication: true,
    rateLimiting: true,
    maxRequestsPerMinute: 100
  }
};
