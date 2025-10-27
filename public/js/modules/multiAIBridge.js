// ======================================================
// 🚀 FUNKSIONE TË REJA PËR MULTI-AI BRIDGE
// ======================================================

// ✅ 1. SISTEMI I MONITORIMIT LIVE
window.bridgeMonitor = {
  performanceStats: {
    totalRequests: 0,
    successfulRoutes: 0,
    fallbackUsed: 0,
    averageResponseTime: 0
  },
  
  startMonitoring: function() {
    console.log('📊 Monitorimi Live i Multi-AI Bridge u aktivizua');
    this.monitoringInterval = setInterval(() => {
      this.updatePerformanceStats();
      this.logSystemHealth();
    }, 30000); // Çdo 30 sekonda
  },
  
  updatePerformanceStats: function() {
    const status = window.multiAIBridge.getBridgeStatus();
    console.log('📈 Stats Live:', {
      requests: this.performanceStats.totalRequests,
      successRate: ((this.performanceStats.successfulRoutes / this.performanceStats.totalRequests) * 100).toFixed(1) + '%',
      queue: status.queueSize,
      activeAIs: status.activeAIs
    });
  },
  
  logSystemHealth: function() {
    const status = window.multiAIBridge.getBridgeStatus();
    const health = status.activeAIs >= 2 ? '✅ SHËNDETSHËM' : '⚠️ PROBLEM';
    console.log(`🏥 Sistemi: ${health} | AI aktive: ${status.activeAIs}`);
  },
  
  stopMonitoring: function() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      console.log('🛑 Monitorimi u ndal');
    }
  }
};

// ✅ 2. SISTEMI I MËSUIT TË MAKINËS (MACHINE LEARNING)
window.bridgeLearning = {
  preferenceHistory: [],
  contextPatterns: {},
  
  learnFromInteraction: function(aiName, context, confidence) {
    // Regjistro preferencat
    this.preferenceHistory.push({
      ai: aiName,
      context: context,
      confidence: confidence,
      timestamp: new Date().toISOString()
    });
    
    // Përditëso pattern-et e kontekstit
    if (!this.contextPatterns[context]) {
      this.contextPatterns[context] = {};
    }
    if (!this.contextPatterns[context][aiName]) {
      this.contextPatterns[context][aiName] = 0;
    }
    this.contextPatterns[context][aiName]++;
    
    console.log(`🧠 Mësuar: ${aiName} → ${context} (Confidence: ${confidence})`);
  },
  
  getBestAIForContext: function(context) {
    const patterns = this.contextPatterns[context];
    if (!patterns) return null;
    
    // Gjej AI-n me më shumë suksese për këtë kontekst
    const bestAI = Object.keys(patterns).reduce((a, b) => 
      patterns[a] > patterns[b] ? a : b
    );
    
    return bestAI;
  },
  
  getLearningStats: function() {
    return {
      totalInteractions: this.preferenceHistory.length,
      contextsLearned: Object.keys(this.contextPatterns).length,
      patterns: this.contextPatterns
    };
  }
};

// ✅ 3. SISTEMI I CACHE PËR PERFORMANCË
window.bridgeCache = {
  responseCache: new Map(),
  cacheHits: 0,
  cacheMisses: 0,
  
  set: function(key, response, ttl = 60000) { // 60 sekonda cache
    this.responseCache.set(key, {
      response: response,
      expiry: Date.now() + ttl
    });
  },
  
  get: function(key) {
    const cached = this.responseCache.get(key);
    if (!cached) {
      this.cacheMisses++;
      return null;
    }
    
    if (Date.now() > cached.expiry) {
      this.responseCache.delete(key);
      this.cacheMisses++;
      return null;
    }
    
    this.cacheHits++;
    return cached.response;
  },
  
  getCacheStats: function() {
    const hitRate = this.cacheHits / (this.cacheHits + this.cacheMisses) || 0;
    return {
      size: this.responseCache.size,
      hits: this.cacheHits,
      misses: this.cacheMisses,
      hitRate: (hitRate * 100).toFixed(1) + '%'
    };
  },
  
  clear: function() {
    this.responseCache.clear();
    console.log('🗑️ Cache u pastrua');
  }
};

// ✅ 4. API E RE PËR INTEGRIME TË JASHTME
window.bridgeAPI = {
  // Regjistro AI të jashtme
  registerExternalAI: function(aiName, endpoint, config = {}) {
    window.multiAIBridge.registerAI(aiName, {
      domain: config.domain || 'external',
      energy: config.energy || 'api_powered',
      priority: config.priority || 6,
      endpoint: endpoint,
      isExternal: true
    });
    console.log(`🌐 AI e jashtme u regjistrua: ${aiName}`);
  },
  
  // Dërgo kërkesë te AI e jashtme
  callExternalAI: async function(aiName, input, context) {
    const aiConfig = window.multiAIBridge.connectedAIs.get(aiName);
    if (!aiConfig || !aiConfig.endpoint) {
      throw new Error(`AI ${aiName} nuk ka endpoint të konfiguruar`);
    }
    
    try {
      // Simulim API call (në praktikë do të jetë fetch)
      console.log(`🌍 Duke dërguar kërkesë te ${aiName} API...`);
      
      return {
        ai: aiName,
        response: `🔗 [${aiName}-API] Përpunova: "${input}"`,
        confidence: 0.85,
        timestamp: new Date().toISOString(),
        source: 'external'
      };
    } catch (error) {
      console.error(`❌ Gabim në ${aiName} API:`, error);
      throw error;
    }
  },
  
  // Eksporto të dhënat e bridge
  exportBridgeData: function() {
    const status = window.multiAIBridge.getBridgeStatus();
    const learningStats = window.bridgeLearning.getLearningStats();
    const cacheStats = window.bridgeCache.getCacheStats();
    
    return {
      bridgeStatus: status,
      learning: learningStats,
      cache: cacheStats,
      exportTime: new Date().toISOString(),
      version: 'RRUFE-TESLA-8.0-MultiAI'
    };
  }
};

// ✅ 5. SISTEMI I AVANCUAR I ROUTING-UT
window.advancedRouting = {
  // Routing me machine learning
  smartRoute: async function(request) {
    const { input, context } = request;
    
    // Kontrollo cache fillimisht
    const cacheKey = `${context}:${input.substring(0, 50)}`;
    const cached = window.bridgeCache.get(cacheKey);
    if (cached) {
      console.log('⚡ Përgjigje e marrë nga cache!');
      return cached;
    }
    
    // Përdor mësimin e makinës për routing më të mirë
    const learnedAI = window.bridgeLearning.getBestAIForContext(context);
    let bestAI = learnedAI;
    
    // Nëse nuk ka mësuar akoma, përdor algoritmin bazë
    if (!bestAI) {
      bestAI = window.multiAIBridge.findBestAI(context);
    }
    
    if (!bestAI) {
      const fallback = window.multiAIBridge.fallbackResponse(input);
      window.bridgeMonitor.performanceStats.fallbackUsed++;
      return fallback;
    }
    
    // Merr përgjigjen
    const response = await window.multiAIBridge.sendToAI(bestAI, input, context);
    
    // Mëso nga ky ndërveprim
    window.bridgeLearning.learnFromInteraction(bestAI, context, response.confidence);
    
    // Cache përgjigjen
    window.bridgeCache.set(cacheKey, response);
    
    // Përditëso statistikat
    window.bridgeMonitor.performanceStats.totalRequests++;
    window.bridgeMonitor.performanceStats.successfulRoutes++;
    
    return response;
  },
  
  // Routing me prioritete të avancuara
  priorityRoute: async function(request, priorityRules = {}) {
    const { input, context } = request;
    
    // Zbatoni rregullat e prioritetit
    if (priorityRules.forceAI) {
      console.log(`🎯 Routing i detyruar te: ${priorityRules.forceAI}`);
      return await window.multiAIBridge.sendToAI(priorityRules.forceAI, input, context);
    }
    
    // Routing normal i inteligjentshëm
    return await this.smartRoute(request);
  }
};

// ✅ 6. MBIVENDOSJA E FUNKSIONIT routeRequest ME VERSIONIN E AVANCUAR
// Ruaj versionin origjinal
const originalRouteRequest = window.multiAIBridge.routeRequest;

// Zëvendëso me versionin e avancuar
window.multiAIBridge.routeRequest = async function(request) {
  console.log('🚀 Duke përdorur routing të avancuar...');
  return await window.advancedRouting.smartRoute(request);
};

// ✅ 7. INICIALIZIMI I SISTEMEVE TË REJA
function initializeAdvancedSystems() {
  console.log('🔧 Duke inicializuar sistemet e avancuara...');
  
  // Nis monitorimin
  window.bridgeMonitor.startMonitoring();
  
  // Regjistro disa AI të jashtme shembull
  window.bridgeAPI.registerExternalAI('OpenAI-GPT4', 'https://api.openai.com/v1/chat/completions', {
    domain: 'general_intelligence',
    priority: 9
  });
  
  window.bridgeAPI.registerExternalAI('Claude-API', 'https://api.anthropic.com/v1/messages', {
    domain: 'reasoning_ethics', 
    priority: 8
  });
  
  console.log('✅ Sistemet e avancuara u inicializuan!');
  console.log('🎯 Tani Multi-AI Bridge ka:');
  console.log('   • 🤖 Routing të inteligjentshëm me ML');
  console.log('   • 📊 Monitorim live të performancës');
  console.log('   • 🧠 Mësim të makinës për preferenca');
  console.log('   • ⚡ Sistem cache për performancë');
  console.log('   • 🌐 API për integrime të jashtme');
}

// ✅ 8. AKTIVIZIMI I SISTEMEVE TË REJA PAS 5 SEKONDASH
setTimeout(() => {
  initializeAdvancedSystems();
  
  // Testo sistemet e reja
  setTimeout(() => {
    console.log('🧪 Testimi i sistemeve të reja...');
    console.log('📊 Stats:', window.bridgeMonitor.performanceStats);
    console.log('🧠 Learning:', window.bridgeLearning.getLearningStats());
    console.log('⚡ Cache:', window.bridgeCache.getCacheStats());
  }, 2000);
  
}, 5000);

console.log('🚀 Sistemet e avancuara të Multi-AI Bridge u ngarkuan!');
console.log('⏰ Do të aktivizohen pas 5 sekondash...');
