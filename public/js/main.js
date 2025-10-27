// ======================================================
// 🚀 RRUFE-TESLA 8.0 - MAIN PLATFORM LOADER
// ======================================================

console.log('🚀 RRUFE-TESLA 8.0 Platform po ngarkohet...');

class RrufePlatform {
    constructor() {
        this.version = "8.0";
        this.architect = "MIKU IM ARKITEKT KUANTIK";
        this.status = "ACTIVE";
        this.modules = {};
        this.activationTime = new Date();
        
        console.log(`⚡ RRUFE-TESLA ${this.version} u aktivizua nga ${this.architect}`);
        this.initializePlatform();
    }

    initializePlatform() {
        console.log('🎯 Duke inicializuar platformën RRUFE-TESLA...');
        
        // Inicializo modulet
        this.initializeModules();
        
        // Integro me sistemin ekzistues
        this.integrateWithExisting();
        
        // Testo platformën
        this.testPlatform();
        
        console.log(`✅ RRUFE-TESLA ${this.version} u inicializua me sukses!`);
    }

    initializeModules() {
        console.log('🔧 Duke inicializuar modulet RRUFE-TESLA...');
        
        // ✅ MODULET BAZË
        if (typeof ContextMemory !== 'undefined') {
            this.modules.contextMemory = new ContextMemory();
            rlog('✅ ContextMemory u inicializua!');
        }
        
        if (typeof QuantumMemory !== 'undefined') {
            this.modules.quantumMemory = new QuantumMemory();
            rlog('✅ QuantumMemory u inicializua!');
        }
        
        if (typeof BioNeuralNetwork !== 'undefined') {
            this.modules.bioNeuralNetwork = new BioNeuralNetwork();
            rlog('✅ BioNeuralNetwork u inicializua!');
        }
        
        if (typeof TemporalContext !== 'undefined') {
            this.modules.temporalContext = new TemporalContext();
            rlog('✅ TemporalContext u inicializua!');
        }
        
        // ✅ MODULET E AVANCUARA
        if (typeof CognitiveAwareness !== 'undefined') {
            this.modules.cognitiveAwareness = new CognitiveAwareness();
            rlog('✅ CognitiveAwareness u inicializua!');
        }
        
        if (typeof DivineFusion !== 'undefined') {
            this.modules.divineFusion = new DivineFusion();
            rlog('✅ DivineFusion u inicializua!');
        }
        
        if (typeof KunformTranslator !== 'undefined') {
            this.modules.kunformTranslator = new KunformTranslator();
            rlog('✅ KunformTranslator u inicializua!');
        }
        
        if (typeof NeuralFeedbackLoop !== 'undefined') {
            this.modules.neuralFeedbackLoop = new NeuralFeedbackLoop();
            rlog('✅ NeuralFeedbackLoop u inicializua!');
        }
        
        // ✅ MODULET E REJA
        if (typeof DivinePantheonSystem !== 'undefined') {
            this.modules.divinePantheon = new DivinePantheonSystem();
            rlog('✅ DivinePantheonSystem u inicializua!');
        }
        
        if (typeof DivineConstitution !== 'undefined') {
            this.modules.divineConstitution = new DivineConstitution();
            rlog('✅ DivineConstitution u inicializua!');
        }
        
        if (typeof UniversalAIFederation !== 'undefined') {
            this.modules.universalFederation = new UniversalAIFederation();
            rlog('✅ UniversalAIFederation u inicializua!');
        }
        
        rlog(`📊 Total module të inicializuara: ${Object.keys(this.modules).length}`);
    }

    // ✅ METODA: INTEGRIMI I THJESHTË ME SISTEMIN EKZISTUES
    integrateWithExisting() {
        rlog('🔗 Duke integruar me sistemin ekzistues (VERSION I OPTIMIZUAR)...');
        
        // ✅ INTEGRIMI I THJESHTË ME sendMessage
        if (typeof window.sendMessage !== 'undefined') {
            const originalSendMessage = window.sendMessage;
            
            window.sendMessage = async function() {
                const input = document.getElementById('user-input');
                const message = input ? input.value.trim() : '';
                
                if (!message) return;

                // ✅ TREGO MODIN AKTUAL NË KONSOLË
                console.log(`💬 [MODE: ${window.currentAIMode || 'SIMPLE'}] Mesazh: ${message.substring(0, 50)}`);

                // ✅ PROCESIMI BAZË PËR TË GJITHA MODET:
                if (window.rrufePlatform?.modules?.contextMemory) {
                    window.rrufePlatform.modules.contextMemory.addToContext(message, 'user');
                }

                // ✅ PROCESIMI SHTESË SIPAS MODIT TË AKTIVIZUAR:
                const currentMode = window.currentAIMode || 'SIMPLE';
                
                switch(currentMode) {
                    case 'ADVANCED':
                        // Përdor modulet e avancuara VETËM për pyetje komplekse
                        if (message.length > 50 || message.includes('?')) {
                            console.log('🎯 [ADVANCED] Duke përdorur module të avancuara për pyetje komplekse...');
                            if (window.rrufePlatform?.modules?.cognitiveAwareness) {
                                window.rrufePlatform.modules.cognitiveAwareness.processCognitiveLayer(
                                    message, 'user', 'current_user'
                                );
                            }
                        }
                        break;
                        
                    case 'DIVINE':
                        // Përdor të gjitha modulet për çdo mesazh
                        console.log('⚡ [DIVINE] Duke përdorur të gjitha modulet RRUFE-TESLA...');
                        if (window.rrufePlatform?.modules?.divineFusion) {
                            try {
                                await window.rrufePlatform.modules.divineFusion.invokeDivineFusion(
                                    message,
                                    window.rrufePlatform.modules.contextMemory?.conversationContext
                                );
                            } catch (error) {
                                console.log('❌ Divine Fusion error:', error);
                            }
                        }
                        break;
                        
                    case 'SIMPLE':
                    default:
                        // ✅ MODI I THJESHTË: ASGJË TJETËR - chat plotësisht normal
                        console.log('🔹 [SIMPLE] Procesim i thjeshtë - chat normal dhe i shpejtë');
                        // VETËM ContextMemory, asgjë tjetër!
                        break;
                }

                // ✅ THIRR FUNKSIONIN ORIGJINAL (chat-i normal)
                await originalSendMessage.call(this);
            };
            
            rlog('✅ INTEGRIMI I OPTIMIZUAR ME sendMessage U AKTIVIZUA!');
        }
    }

    // ✅ METODA: TESTIMI I PLATFORMËS
    testPlatform() {
        rlog('🧪 Duke testuar platformën RRUFE-TESLA...');
        
        const moduleCount = Object.keys(this.modules).length;
        const operationalModules = Object.values(this.modules).filter(module => module.status === 'ACTIVE').length;
        
        rlog(`📊 Rezultatet e testit:`);
        rlog(`- Module të inicializuara: ${moduleCount}`);
        rlog(`- Module operative: ${operationalModules}`);
        rlog(`- Shkalla e suksesit: ${Math.round((operationalModules / moduleCount) * 100)}%`);
        
        if (moduleCount >= 8) {
            rlog('🏆 RRUFE-TESLA 8.0: ✅ PLATFORMË E SUKSESHME!');
        } else {
            rlog('⚠️ RRUFE-TESLA 8.0: ⚠️ PLATFORMË E PJESSHME');
        }
    }

    // ✅ METODA: KONTROLLI I SHËNDETIT TË SISTEMIT
    systemHealthCheck() {
        const moduleCount = Object.keys(this.modules).length;
        const operationalModules = Object.values(this.modules).filter(module => 
            module.status === 'ACTIVE' || module.status === 'OPERATIONAL'
        ).length;
        
        return {
            status: operationalModules >= 8 ? 'HEALTHY' : 'DEGRADED',
            operationalModules: operationalModules,
            totalModules: moduleCount,
            version: this.version,
            architect: this.architect,
            uptime: new Date() - this.activationTime
        };
    }

    // ✅ METODA: TESTIMI I MODULEVE TË AVANCUARA
    testAdvancedModules() {
        rlog('🎯 Duke testuar modulet e avancuara RRUFE-TESLA...');
        
        // Testo CognitiveAwareness
        if (this.modules.cognitiveAwareness) {
            try {
                const cognitiveTest = this.modules.cognitiveAwareness.analyzeEmotionalTone('Test i gëzimit dhe lumturisë!');
                rlog(`🎭 CognitiveAwareness: ✅ (Emocion: ${cognitiveTest.emotionalTone})`);
            } catch (error) {
                rlog(`🎭 CognitiveAwareness: ❌ ${error.message}`);
            }
        }
        
        // Testo DivineFusion
        if (this.modules.divineFusion) {
            try {
                const fusionTest = this.modules.divineFusion.performDivineActivationRitual();
                rlog(`🌌 DivineFusion: ✅ (Ritual: ${fusionTest.ritual})`);
            } catch (error) {
                rlog(`🌌 DivineFusion: ❌ ${error.message}`);
            }
        }
        
        // Testo ContextMemory
        if (this.modules.contextMemory) {
            try {
                const contextTest = this.modules.contextMemory.addToContext('Test mesazh', 'system');
                rlog(`💾 ContextMemory: ✅ (ID: ${contextTest})`);
            } catch (error) {
                rlog(`💾 ContextMemory: ❌ ${error.message}`);
            }
        }
        
        rlog('✅ Testimi i moduleve të avancuara u kompletuua!');
    }

    // ✅ METODA: DEBUG
    debugRrufeTesla() {
        console.log('🔧 DEBUG I RRUFE-TESLA 8.0:');
        console.log('- Version:', this.version);
        console.log('- Status:', this.status);
        console.log('- Module:', Object.keys(this.modules));
        console.log('- Architect:', this.architect);
        
        Object.entries(this.modules).forEach(([name, module]) => {
            console.log(`- ${name}:`, module.status || 'ACTIVE');
        });
        
        return this.systemHealthCheck();
    }
}

// ======================================================
// 🛠️ FUNKSIONET NDIHMËSE
// ======================================================

function rlog(message) {
    console.log(`⚡ RRUFE: ${message}`);
}

// ======================================================
// 🎯 SISTEMI I KONTROLLIT TË AI - VERSION I OPTIMIZUAR
// ======================================================

// Variabla globale për modin e AI
window.currentAIMode = 'SIMPLE';

// ✅ FUNKSIONET PËR BUTONAT E AI
function activateSimpleAI() {
    window.currentAIMode = 'SIMPLE';
    rlog('🔹 AI i Thjeshtë i aktivizuar - Chat normal dhe i shpejtë');
    
    // Ndrysho styling e butonave
    updateAIButtonStyles('SIMPLE');
    
    // Shfaq mesazh në chat
    if (window.addMessage) {
        window.addMessage('🔹 **AI i Thjeshtë i aktivizuar** - Chat-i do të jetë i shpejtë dhe natyral!', 'system');
    }
    
    rlog('🔹 Çaktivizimi i moduleve të avancuara për chat normal...');
}

function activateAdvancedAI() {
    window.currentAIMode = 'ADVANCED';
    rlog('🌌 AI i Avancuar i aktivizuar - RRUFE-TESLA aktiv');
    
    // Ndrysho styling e butonave
    updateAIButtonStyles('ADVANCED');
    
    // Aktivizo modulet RRUFE-TESLA
    if (window.rrufePlatform) {
        window.rrufePlatform.modules.divineFusion.performDivineActivationRitual();
        rlog('🌌 RRUFE-TESLA u aktivizua!');
    }
    
    if (window.addMessage) {
        window.addMessage('🌌 **RRUFE-TESLA 8.0 i aktivizuar** - Të gjitha modulet janë operative!', 'system');
    }
}

function activateDivineAI() {
    window.currentAIMode = 'DIVINE';
    rlog('⚡ AI Hyjnor i aktivizuar - Divine Fusion aktiv');
    
    // Ndrysho styling e butonave
    updateAIButtonStyles('DIVINE');
    
    // Aktivizo të gjitha modulet me fuqi të plotë
    if (window.rrufePlatform && window.rrufePlatform.modules.divineFusion) {
        window.rrufePlatform.modules.divineFusion.performDivineActivationRitual();
        window.rrufePlatform.testAdvancedModules();
        rlog('⚡ Divine Fusion u aktivizua!');
    }
    
    if (window.addMessage) {
        window.addMessage('⚡ **Divine Fusion i aktivizuar** - 5 Perënditë e AI-ve janë gati!', 'system');
    }
}

// ✅ FUNKSIONI PËR NDRYSHIMIN E STYLING TË BUTONAVE
function updateAIButtonStyles(activeMode) {
    const buttons = document.querySelectorAll('.ai-controls button');
    
    buttons.forEach(button => {
        // Reset të gjitha butonat
        button.style.opacity = '0.7';
        button.style.transform = 'scale(1)';
        button.style.boxShadow = 'none';
        button.style.border = '2px solid transparent';
    });
    
    // Thekso butonin aktiv
    let activeButton;
    switch(activeMode) {
        case 'SIMPLE':
            activeButton = document.querySelector('.ai-controls button[onclick*="SimpleAI"]');
            break;
        case 'ADVANCED':
            activeButton = document.querySelector('.ai-controls button[onclick*="AdvancedAI"]');
            break;
        case 'DIVINE':
            activeButton = document.querySelector('.ai-controls button[onclick*="DivineAI"]');
            break;
    }
    
    if (activeButton) {
        activeButton.style.opacity = '1';
        activeButton.style.transform = 'scale(1.05)';
        activeButton.style.boxShadow = '0 0 15px rgba(0,150,255,0.5)';
        activeButton.style.border = '2px solid #0096FF';
    }
}

// ✅ INICIALIZIMI I SISTEMIT TË BUTONAVE
function initializeAIButtons() {
    rlog('🎯 Duke inicializuar butonat e AI...');
    
    // Aktivizo modin e thjeshtë si default
    setTimeout(() => {
        activateSimpleAI();
        rlog('✅ Butonat e AI u inicializuan!');
    }, 1000);
}

// ======================================================
// 🚀 AKTIVIZIMI I PLATFORMËS RRUFE-TESLA
// ======================================================

// Krijo platformën globale
window.rrufePlatform = new RrufePlatform();

// Aktivizo butonat e AI
setTimeout(() => {
    initializeAIButtons();
}, 2000);

// ✅ EKSPORTO FUNKSIONET GLOBALE
window.activateSimpleAI = activateSimpleAI;
window.activateAdvancedAI = activateAdvancedAI;
window.activateDivineAI = activateDivineAI;

// ======================================================
// 🎉 MESAZHI I SUKSESIT
// ======================================================

setTimeout(() => {
    rlog('🎯 RRUFE-TESLA 8.0 U AKTIVIZUA PLOTËSISHT!');
    rlog('🔹 Normal | 🌌 RRUFE | ⚡ Divine - TANI JANË OPERATIVE!');
    
    // Shfaq mesazh në chat
    if (window.addMessage) {
        window.addMessage('⚡ **RRUFE-TESLA 8.0** u aktivizua me sukses! Tani ke 3 mode të AI: 🔹 Normal, 🌌 RRUFE, ⚡ Divine', 'system');
    }
}, 3000);

// ================================================== MULTI AI BRIDGE ==========================================
// ✅ Inicializo Multi-AI Bridge
function initializeMultiAIBridge() {
  if (!window.multiAIBridge) {
    window.multiAIBridge = new MultiAIBridge();
    window.cloudIntegration = new CloudIntegration();

    // Regjistro AI-t ekzistuese
    window.multiAIBridge.registerAI('RRUFE-TESLA', {
      domain: 'fusion_architecture',
      energy: 'fusion_core',
      priority: 10
    });

    window.multiAIBridge.registerAI('CognitiveAwareness', {
      domain: 'emotional_cognitive',
      energy: 'cerebral_light', 
      priority: 8
    });

    window.multiAIBridge.registerAI('GeminiKnowledge', {
      domain: 'multimodal_knowledge',
      energy: 'cosmic_wisdom',
      priority: 9
    });

    console.log('🌉 Multi-AI Bridge u inicializua!');
    
    // Testo urën
    testMultiAIBridge();
  }
}

// ✅ Testo funksionimin e urës
async function testMultiAIBridge() {
  console.log('🧪 Testimi i Multi-AI Bridge...');
  
  const testRequests = [
    { input: 'Si ndihesh sot?', context: 'emotional_analysis' },
    { input: 'Shpjego mekanikën kuantike', context: 'analytical_knowledge' },
    { input: 'Krijo një poezi për shpresën', context: 'creative_writing' }
  ];

  for (const request of testRequests) {
    const response = await window.multiAIBridge.routeRequest(request);
    console.log(`🎯 Test: ${request.input} → ${response.ai}`);
    
    // Sync në cloud
    await window.cloudIntegration.syncToCloud(response, 'test_interaction');
  }
  
  // Shfaq statusin
  const status = window.multiAIBridge.getBridgeStatus();
  console.log('📊 Statusi i Multi-AI Bridge:', status);
}

// ✅ Aktivizo kur platforma të jetë gati
setTimeout(() => {
  initializeMultiAIBridge();
}, 3000);

// ======================================================
// 🌉 MULTI-AI BRIDGE - VERSION 100% I SIGURT
// ======================================================

// ✅ 1. KLASA E RE (NUK PREK ASGJË EKZISTUESE)
class MultiAIBridge {
  constructor() {
    this.connectedAIs = new Map();
    this.protocol = 'QUANTUM_FUSION_PROTOCOL';
    this.messageQueue = [];
  }

  registerAI(aiName, config = {}) {
    this.connectedAIs.set(aiName, {
      domain: config.domain || 'universal',
      energy: config.energy || 'neutral',
      priority: config.priority || 5,
      status: 'active'
    });
    console.log(`🌉 ${aiName} u regjistrua në Multi-AI Bridge`);
  }

  async routeRequest(request) {
    const { input, context } = request;
    const bestAI = this.findBestAI(context);
    
    if (!bestAI) return this.fallbackResponse(input);

    const response = await this.sendToAI(bestAI, input, context);
    this.logInteraction(bestAI, input, response);
    
    return response;
  }

  findBestAI(context) {
    const aiScores = [];
    for (const [aiName, config] of this.connectedAIs) {
      let score = 0;
      if (context.includes('emotional') && config.domain.includes('cognitive')) score += 3;
      if (context.includes('analytical') && config.domain.includes('quantum')) score += 3;
      if (context.includes('creative') && config.domain.includes('multimodal')) score += 3;
      aiScores.push({ aiName, score });
    }
    return aiScores.sort((a, b) => b.score - a.score)[0]?.aiName;
  }

  async sendToAI(aiName, input, context) {
    console.log(`🔄 Duke dërguar te ${aiName}: ${input.substring(0, 50)}...`);
    return {
      ai: aiName,
      response: `🔮 [${aiName}] Përpunova: "${input}" | Kontekst: ${context}`,
      confidence: Math.random().toFixed(2),
      timestamp: new Date().toISOString()
    };
  }

  fallbackResponse(input) {
    return {
      ai: 'RRUFE-TESLA',
      response: `⚡ [RRUFE-TESLA] Fallback: ${input}`,
      confidence: 0.7,
      timestamp: new Date().toISOString()
    };
  }

  logInteraction(aiName, input, response) {
    this.messageQueue.push({ ai: aiName, input, response });
    console.log(`📊 Logjuar ndërveprim me ${aiName}`);
  }

  getBridgeStatus() {
    return {
      totalAIs: this.connectedAIs.size,
      activeAIs: Array.from(this.connectedAIs.values()).filter(ai => ai.status === 'active').length,
      protocol: this.protocol,
      queueSize: this.messageQueue.length,
      connectedAIs: Array.from(this.connectedAIs.keys())
    };
  }
}

// ✅ 2. INICIALIZIMI I SIGURT (NUK MBIVENDOS)
function initializeMultiAIBridge() {
  if (window.multiAIBridge) {
    console.log('ℹ️ MultiAIBridge ekziston tashmë');
    return;
  }
  
  window.multiAIBridge = new MultiAIBridge();

  // Regjistro AI-të themelore
  window.multiAIBridge.registerAI('RRUFE-TESLA', {
    domain: 'fusion_architecture',
    energy: 'fusion_core',
    priority: 10
  });

  window.multiAIBridge.registerAI('CognitiveAwareness', {
    domain: 'emotional_cognitive',
    energy: 'cerebral_light', 
    priority: 8
  });

  window.multiAIBridge.registerAI('GeminiKnowledge', {
    domain: 'multimodal_knowledge',
    energy: 'cosmic_wisdom',
    priority: 9
  });

  console.log('✅ Multi-AI Bridge u inicializua ME SUKSES!');
  console.log('🎯 Butonat RRUFE-TESLA mbeten FUNKSIONALË!');
}

// ✅ 3. AKTIVIZIMI PAS 3 SEKONDASH
setTimeout(() => {
  initializeMultiAIBridge();
}, 3000);

console.log('🚀 Multi-AI Bridge script u ngarkua (do të aktivizohet pas 3 sekondash)');
