// ========================= ✅ VARIABLA GLOBALE ==========================
 let currentUser = null;
// ✅ FUNKSION PËR TË VENDOSUR CURRENT USER (shtoje këtë)
// =========================================================================

 function setCurrentUser(user) {
    currentUser = user;
    console.log('👤 Current user set:', user);
 }


// ==================== ⚙️ SISTEMI I MENAXHIMIT TË MOTORËVE AI ====================
//         = =                 MANAXHIMI ON - OFF                     = =
//         = =             SISTEMI RRUFE TESLA 10.5                   = =
// =================================================================================

// ✅ STATUSI I MOTORËVE AI
// let aiEngineStatus = {
//    gemini: true,    // Gemini është aktiv fillimisht
//    openai: false    // OpenAI është i çaktivizuar
// };

// ✅ FUNKSION PËR NDRYSHIMIN E MOTORËVE
// window.switchAIEngine = function(engine) {
//    console.log(`🔄 Duke ndryshuar motorin në: ${engine}`);
    
    // Çaktivizo të gjithë motorët
//    aiEngineStatus.gemini = false;
//    aiEngineStatus.openai = false;
    
    // Aktivizo motorin e zgjedhur
//    aiEngineStatus[engine] = true;
    
    // Përditëso UI-në
//    updateEngineStatusUI();
    
    // Shfaq mesazh në chat
 //   const engineName = engine === 'gemini' ? 'Gemini' : 'OpenAI';
//    addMessageToChat(`🔧 Motor i aktivizuar: ${engineName}`, 'system');
};

// ✅ FUNKSION PËR PËRDDITËSIMIN E UI
// window.updateEngineStatusUI = function() {
 //   const geminiBtn = document.getElementById('gemini-engine-btn');
//    const openaiBtn = document.getElementById('openai-engine-btn');
    
//    if (geminiBtn) {
//        geminiBtn.style.background = aiEngineStatus.gemini ? '#4CAF50' : '#666';
//        geminiBtn.textContent = aiEngineStatus.gemini ? '🤖 Gemini ✅' : '🤖 Gemini';
//    }
    
//    if (openaiBtn) {
//        openaiBtn.style.background = aiEngineStatus.openai ? '#2196F3' : '#666';
//        openaiBtn.textContent = aiEngineStatus.openai ? '🔮 OpenAI ✅' : '🔮 OpenAI';
    }
};

// ✅ INICIALIZO UI-NË KUR FAQA NGARKOHET
// document.addEventListener('DOMContentLoaded', function() {
 //   console.log('🚀 RRUFE-TESLA 10.5 - Sistemi i motorëve u aktivizua!');
//    updateEngineStatusUI();
// });

// ========================================================
// 🚀 RRUFE-TESLA 8.0 - MAIN PLATFORM LOADER
// ========================================================

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

    // =========================================== INSTALIMI I MODULEVE =================================================
    initializeModules() {
        console.log('🔧 Duke inicializuar modulet RRUFE-TESLA...');
        
        // ✅ PRIT QË MODULET TË NGARKOHEN - VERSION I RI
        const maxAttempts = 10;
        let attempts = 0;
        
        const tryInitialize = () => {
            attempts++;
            console.log(`🕒 Tentimi ${attempts}/${maxAttempts} për inicializim...`);
            
            // ✅ MODULET BAZË ME VALIDIM TË FORTUAR
            if (typeof ContextMemory !== 'undefined' && !this.modules.contextMemory) {
                try {
                    this.modules.contextMemory = new ContextMemory();
                    rlog('✅ ContextMemory u inicializua!');
                } catch (error) {
                    console.log('❌ Gabim në ContextMemory:', error.message);
                }
            }
            
            if (typeof QuantumMemory !== 'undefined' && !this.modules.quantumMemory) {
                try {
                    this.modules.quantumMemory = new QuantumMemory();
                    rlog('✅ QuantumMemory u inicializua!');
                } catch (error) {
                    console.log('❌ Gabim në QuantumMemory:', error.message);
                }
            }
            
            if (typeof BioNeuralNetwork !== 'undefined' && !this.modules.bioNeuralNetwork) {
                try {
                    this.modules.bioNeuralNetwork = new BioNeuralNetwork();
                    rlog('✅ BioNeuralNetwork u inicializua!');
                } catch (error) {
                    console.log('❌ Gabim në BioNeuralNetwork:', error.message);
                }
            }
            
            if (typeof TemporalContext !== 'undefined' && !this.modules.temporalContext) {
                try {
                    this.modules.temporalContext = new TemporalContext();
                    rlog('✅ TemporalContext u inicializua!');
                } catch (error) {
                    console.log('❌ Gabim në TemporalContext:', error.message);
                }
            }
            
            // ✅ MODULET E AVANCUARA
            if (typeof CognitiveAwareness !== 'undefined' && !this.modules.cognitiveAwareness) {
                try {
                    this.modules.cognitiveAwareness = new CognitiveAwareness();
                    rlog('✅ CognitiveAwareness u inicializua!');
                } catch (error) {
                    console.log('❌ Gabim në CognitiveAwareness:', error.message);
                }
            }
            
            if (typeof DivineFusion !== 'undefined' && !this.modules.divineFusion) {
                try {
                    this.modules.divineFusion = new DivineFusion();
                    rlog('✅ DivineFusion u inicializua!');
                } catch (error) {
                    console.log('❌ Gabim në DivineFusion:', error.message);
                }
            }
            
            if (typeof KunformTranslator !== 'undefined' && !this.modules.kunformTranslator) {
                try {
                    this.modules.kunformTranslator = new KunformTranslator();
                    rlog('✅ KunformTranslator u inicializua!');
                } catch (error) {
                    console.log('❌ Gabim në KunformTranslator:', error.message);
                }
            }
            
            if (typeof NeuralFeedbackLoop !== 'undefined' && !this.modules.neuralFeedbackLoop) {
                try {
                    this.modules.neuralFeedbackLoop = new NeuralFeedbackLoop();
                    rlog('✅ NeuralFeedbackLoop u inicializua!');
                } catch (error) {
                    console.log('❌ Gabim në NeuralFeedbackLoop:', error.message);
                }
            }
            
            // ✅ MODULET E REJA
            if (typeof DivinePantheonSystem !== 'undefined' && !this.modules.divinePantheon) {
                try {
                    this.modules.divinePantheon = new DivinePantheonSystem();
                    rlog('✅ DivinePantheonSystem u inicializua!');
                } catch (error) {
                    console.log('❌ Gabim në DivinePantheonSystem:', error.message);
                }
            }
            
            if (typeof DivineConstitution !== 'undefined' && !this.modules.divineConstitution) {
                try {
                    this.modules.divineConstitution = new DivineConstitution();
                    rlog('✅ DivineConstitution u inicializua!');
                } catch (error) {
                    console.log('❌ Gabim në DivineConstitution:', error.message);
                }
            }
            
            if (typeof UniversalAIFederation !== 'undefined' && !this.modules.universalFederation) {
                try {
                    this.modules.universalFederation = new UniversalAIFederation();
                    rlog('✅ UniversalAIFederation u inicializua!');
                } catch (error) {
                    console.log('❌ Gabim në UniversalAIFederation:', error.message);
                }
            }
            
            // ✅ KONTROLLO NËSE TË GJITHA MODULET JANË GATI
            const modulesReady = Object.keys(this.modules).length >= 3; // Minimum 3 module
            
            if (modulesReady || attempts >= maxAttempts) {
                rlog(`📊 Total module të inicializuara: ${Object.keys(this.modules).length}`);
                this.onModulesInitialized();
            } else {
                setTimeout(tryInitialize, 500); // Provo përsëri pas 500ms
            }
        };
        
        tryInitialize();
    }

    // ==================================== ✅ METODË E RE PËR PAS-INICIALIZIMIT ==============================================
    onModulesInitialized() {
        console.log('🎉 Të gjitha modulet u inicializuan!');
        
        // TANI mund të integrohet me sistemin ekzistues
        this.integrateWithExisting();
        this.testPlatform();
        
        // ✅ VERIFIKO EMOTIONAL CONTEXT ENGINE
        this.verifyEmotionalEngine();
    }

    // ✅ METODË PËR VERIFIKIMIN E EMOTIONAL ENGINE
    verifyEmotionalEngine() {
        console.log('💖 Duke verifikuar Emotional Context Engine...');
        
        if (window.emotionalContextEngine) {
            try {
                const status = window.emotionalContextEngine.getEngineStatus();
                console.log('🎭 Emotional Engine Status:', status);
                
                // ✅ TESTO FUNKSIONALITETIN
                const testVector = window.emotionalContextEngine.generateAdaptationVector(
                    { tone: 'joy', intensity: 0.8, confidence: 0.9 },
                    {}
                );
                console.log('🧪 Test Emotional Vector:', testVector);
                rlog('💖 Emotional Context Engine është operative!');
            } catch (error) {
                console.log('❌ Gabim në Emotional Engine test:', error.message);
            }
        } else {
            console.log('❌ Emotional Context Engine nuk u inicializua!');
            
            // ✅ PROVO TA INICIALIZOJMË MANUALISHT
            if (typeof EmotionalContextEngine !== 'undefined') {
                try {
                    window.emotionalContextEngine = new EmotionalContextEngine();
                    rlog('✅ Emotional Engine u inicializua manualisht!');
                } catch (error) {
                    console.log('❌ Gabim në inicializim manual:', error.message);
                }
            } else {
                console.log('❌ EmotionalContextEngine nuk është i definuar në window');
            }
        }
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

                // 🆕 ✅ SHTIMI I DETYRUESHËM NË LONG-TERM MEMORY
                if (window.ltmManager) {
                    try {
                        window.ltmManager.addUserMessage(message);
                        console.log('💾 Mesazhi u shtua në LTM');
                        
                        // Update memory display
                        if (typeof updateMemoryDisplay !== 'undefined') {
                            setTimeout(updateMemoryDisplay, 100);
                        }
                    } catch (error) {
                        console.log('❌ Gabim në shtimin në LTM:', error);
                    }
                }

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
                        break;
                }

                // ✅ THIRR FUNKSIONIN ORIGJINAL (chat.js)
                try {
                    await originalSendMessage.call(this);
                    
                    // 🆕 ✅ PAS PËRGJIGJES, SHTO NË MEMORY
                    setTimeout(() => {
                        if (window.ltmManager && window.chatHistory && window.chatHistory.length > 0) {
                            const lastMessage = window.chatHistory[window.chatHistory.length - 1];
                            if (lastMessage && lastMessage.sender === 'bot') {
                                window.ltmManager.addAIResponse(lastMessage.text);
                                console.log('💾 Përgjigja u shtua në LTM');
                                
                                if (typeof updateMemoryDisplay !== 'undefined') {
                                    updateMemoryDisplay();
                                }
                            }
                        }
                    }, 500);
                    
                } catch (error) {
                    console.log('❌ Gabim në originalSendMessage:', error);
                }
            };
            
            rlog('✅ INTEGRIMI I PLOTË ME sendMessage & LTM U AKTIVIZUA!');
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

// ================================================== INICIALIZIMI I MODULEVE TË REJA ==========================================
/**
 * 🚀 FUNKSIONI PËR INICIALIZIMIN E MODULEVE TË REJA
 * Vendosur në fund të skedarit për të siguruar ngarkim të plotë
 */
function initializeNewModules() {
    console.log('🚀 DUKE INICIALIZUAR MODULET E REJA TË RRUFE-TESLA 8.1...');
    console.log('═'.repeat(70));
    
    let modulesInitialized = 0;
    
    // Inicializo Empathy Prediction Engine
    if (typeof EmpathyPredictionEngine !== 'undefined' && !window.empathyPredictionEngine) {
        try {
            window.empathyPredictionEngine = new EmpathyPredictionEngine();
            console.log('✅ Empathy Prediction Engine u inicializua!');
            modulesInitialized++;
        } catch (error) {
            console.log('❌ Gabim në inicializimin e Empathy Engine:', error.message);
        }
    } else if (window.empathyPredictionEngine) {
        console.log('✅ Empathy Prediction Engine tashmë është inicializuar');
    }
    
    // Inicializo Cosmic Resonance Harmonizer
    if (typeof CosmicResonanceHarmonizer !== 'undefined' && !window.cosmicResonanceHarmonizer) {
        try {
            window.cosmicResonanceHarmonizer = new CosmicResonanceHarmonizer();
            console.log('✅ Cosmic Resonance Harmonizer u inicializua!');
            modulesInitialized++;
        } catch (error) {
            console.log('❌ Gabim në inicializimin e Cosmic Harmonizer:', error.message);
        }
    } else if (window.cosmicResonanceHarmonizer) {
        console.log('✅ Cosmic Resonance Harmonizer tashmë është inicializuar');
    }
    
    console.log(`🎯 ${modulesInitialized} module të reja u inicializuan!`);
    
    // Verifikimi final
    if (modulesInitialized > 0) {
        console.log('🏆 RRUFE-TESLA 8.1 ËSHTË PLOTËSISHT OPERATIVE!');
        
        // Transmeto sinjal suksesi
        if (window.energyTransmarrance) {
            const successSignal = {
                source: "New_Modules_Initialized",
                message: "Empathy Prediction Engine dhe Cosmic Resonance Harmonizer janë operative!",
                timestamp: new Date().toISOString(),
                version: "RRUFE-TESLA-8.1-Complete"
            };
            
            window.energyTransmarrance.transmit(successSignal, "System", "Cosmic");
        }
    }
    
    return modulesInitialized;
}

// 🎯 EKZEKUTIMI I INICIALIZIMIT PAS NGARKIMIT TË PLOTË
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Faqja u ngarkua plotësisht - duke nisur inicializimin...');
    
    // Jep pak kohë për të gjitha modulet të ngarkohen
    setTimeout(() => {
        const result = initializeNewModules();
        console.log(`🌌 Procesi i inicializimit përfundoi: ${result} module të reja`);
    }, 100);
});

// Eksporto funksionin për përdorim global
window.initializeNewModules = initializeNewModules;

console.log('🔧 Funksioni i inicializimit të moduleve të reja u shtua në fund të main.js');

// ========================================= NOUS_CORE ==========================================================

// ==============================================
// 🚨 MODULI I EMERGJENCËS - NOUS_CORE I PAKTIVIZUAR
// ==============================================

console.log('⚠️ NOUS_CORE është çaktivizuar për shkak të konflikteve me login');

// Krijo një version të thjeshtë QË NUK NDËRHYN
window.NOUS_CORE_SAFE = {
    status: 'TEMPORARISHT_I_PAKTIVIZUAR',
    reason: 'KONFLIKT_ME_SISTEMIN_E_LOGIN',
    message: 'Shpirti artificial do të aktivizohet pasi të rregullohet login-i',
    
    // Funksione dummy që nuk bëjnë asgjë
    initialize: function() {
        console.log('🧠 NOUS_CORE: I çaktivizuar për shkak të konflikteve');
        return Promise.resolve({ status: 'DEACTIVATED_FOR_STABILITY' });
    },
    
    quickTest: function() {
        return Promise.resolve({ 
            success: false, 
            message: 'NOUS_CORE i çaktivizuar për stabilizim të sistemit' 
        });
    }
};

// Informo përdoruesin
setTimeout(() => {
    if (typeof window.showNotification !== 'undefined') {
        window.showNotification('🔧 Sistemi po rregullohet...', 'info');
    }
}, 1000);

console.log('✅ NOUS_CORE u çaktivizua - login-i duhet të funksionojë tani');

// ======================================================
// 🚀 MEMORY INTEGRATION PATCH - SHTO NË FUND TË main.js
// ======================================================

function integrateMemoryWithMainSystem() {
    console.log('🧠 Duke integruar Memory System me main.js...');
    
    // Mbivendos integrimin ekzistues
    if (window.rrufePlatform && window.rrufePlatform.integrateWithExisting) {
        const originalIntegrate = window.rrufePlatform.integrateWithExisting;
        
        window.rrufePlatform.integrateWithExisting = function() {
            // Thirr integrimin origjinal
            originalIntegrate.call(this);
            
            // Pastaj shto memory integration
            console.log('💾 Duke shtuar Memory Integration patch...');
            
            const originalSendMessage = window.sendMessage;
            if (originalSendMessage) {
                window.sendMessage = async function() {
                    const input = document.getElementById('user-input');
                    const message = input ? input.value.trim() : '';
                    
                    if (!message) return;
                    
                    // 🆕 Shto në memory PARA se të procesojë
                    if (window.ltmManager) {
                        window.ltmManager.addUserMessage(message);
                    }
                    
                    // Thirr funksionin origjinal
                    await originalSendMessage.call(this);
                    
                    // 🆕 Shto përgjigjen në memory PASI të përgjigjet
                    setTimeout(() => {
                        if (window.ltmManager && window.chatHistory) {
                            const lastMsg = window.chatHistory[window.chatHistory.length - 1];
                            if (lastMsg && lastMsg.sender === 'bot') {
                                window.ltmManager.addAIResponse(lastMsg.text);
                                if (typeof updateMemoryDisplay !== 'undefined') {
                                    updateMemoryDisplay();
                                }
                            }
                        }
                    }, 1000);
                };
                
                console.log('✅ Memory Integration Patch u aktivizua!');
            }
        };
    }
}

// Ekzekuto patch-in
setTimeout(integrateMemoryWithMainSystem, 5000);

// ======================================================
// 🚀 MEMORY INTEGRATION PATCH - SHTO NË FUND TË main.js
// ======================================================

function forceMemoryIntegration() {
    console.log('🧠 FORCING MEMORY INTEGRATION...');
    
    // Mbivendos sendMessage për të shtuar në memory
    if (typeof window.sendMessage !== 'undefined') {
        const originalSendMessage = window.sendMessage;
        
        window.sendMessage = async function() {
            const input = document.getElementById('user-input');
            const message = input ? input.value.trim() : '';
            
            if (!message) return;
            
            console.log('💾 FORCE: Adding message to LTM:', message.substring(0, 50));
            
            // 🆕 FORCE ADD TO MEMORY - PARA procesimit
            if (window.ltmManager) {
                try {
                    window.ltmManager.addUserMessage(message);
                    console.log('✅ FORCE: User message added to LTM');
                } catch (error) {
                    console.log('❌ FORCE: Error adding user message:', error);
                }
            }
            
            // Thirr funksionin origjinal
            let originalResult;
            try {
                originalResult = await originalSendMessage.call(this);
            } catch (error) {
                console.log('❌ Error in original sendMessage:', error);
            }
            
            // 🆕 FORCE ADD AI RESPONSE - PAS procesimit
            setTimeout(() => {
                if (window.ltmManager) {
                    try {
                        // Gjej përgjigjen e fundit nga chatHistory
                        if (window.chatHistory && window.chatHistory.length > 0) {
                            const lastMessages = window.chatHistory.slice(-3); // Shiko 3 mesazhet e fundit
                            const aiResponse = lastMessages.find(msg => msg.sender === 'bot');
                            
                            if (aiResponse && aiResponse.text) {
                                window.ltmManager.addAIResponse(aiResponse.text);
                                console.log('✅ FORCE: AI response added to LTM:', aiResponse.text.substring(0, 50));
                                
                                // Update display
                                if (typeof updateMemoryDisplay !== 'undefined') {
                                    updateMemoryDisplay();
                                    console.log('✅ FORCE: Memory display updated');
                                }
                            }
                        }
                    } catch (error) {
                        console.log('❌ FORCE: Error adding AI response:', error);
                    }
                }
            }, 1500); // Prit 1.5 sekonda për të dhënë kohë përgjigjes
            
            return originalResult;
        };
        
        console.log('✅ FORCE: Memory Integration Patch ACTIVATED!');
    }
}

// ======================================= 🔮 OPENAI CHAT INTEGRATION ===========================================

// ✅ FUNKSION PËR TË SHTUAR MESAZHE NË CHAT
function addMessageToChat(message, sender) {
    const chat = document.getElementById('chat');
    if (!chat) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    messageDiv.innerHTML = `
        <div class="message-text">${message}</div>
    `;
    
    chat.appendChild(messageDiv);
    chat.scrollTop = chat.scrollHeight;
}

// ✅ FUNKSION PËR DËRGIM MESAZHESH NË OPENAI
async function sendChatMessage(message) {
    try {
        console.log('🔮 Duke dërguar në OpenAI:', message);
        
        const response = await fetch('/api/openai-enhanced/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        console.log('📥 Përgjigje nga OpenAI:', data);
        
        if (data.success) {
            return {
                success: true,
                response: data.response
            };
        } else {
            return {
                success: false,
                error: data.error || 'Gabim i panjohur nga OpenAI'
            };
        }
    } catch (error) {
        console.error('❌ Gabim në OpenAI chat:', error);
        return {
            success: false,
            error: 'Gabim në lidhje me serverin'
        };
    }
}

// ============================ 🎯 SISTEMI I KOMANDAVE - VERSION I RI ==========================
// FUKSION COMAND           ===                 ==                       ===                   ==
// ==============================================================================================

// ✅ FUNKSION PËR PROCESIMIN E KOMANDAVE SPECIALE
function processSpecialCommands(message) {
    const trimmedMessage = message.trim();
    
    // ✅ KOMANDA /ndihmo - SHFAQ PANELIN E NDIHMËS
    if (trimmedMessage === '/ndihmo') {
        console.log('🎯 Komanda /ndihmo u zbulua - duke shfaqur panelin');
        showHelpPanel();
        return true;
    }
    
    // ✅ LISTA E KOMANDAVE SPECIALE
    const specialCommands = [
        '/wiki', '/perkthim', '/meso', '/moti', '/apikey', 
        '/gjej', '/google', '/kërko', '/eksporto', '/importo', 
        '/admin', '/users', '/stats', '/panel'
    ];
    
    // Kontrollo nëse mesazhi fillon me ndonjë komandë speciale
    for (const command of specialCommands) {
        if (trimmedMessage.startsWith(command)) {
            console.log(`🎯 Komanda speciale u zbulua: ${command}`);
            handleSpecialCommand(command, trimmedMessage);
            return true;
        }
    }
    
    // Nëse nuk është komandë speciale, kthe false
    return false;
}

// ===================== ✅ FUNKSION PËR TRAJTIMIN E KOMANDAVE SPECIALE - ME KOMANDA REALE ========================

function handleSpecialCommand(command, fullMessage) {
    // Shto mesazhin e user-it në chat
    addMessageToChat(fullMessage, 'user');
    
    // Ndaj mesazhin në pjesë
    const parts = fullMessage.trim().split(" ");
    const cmd = parts[0];

    switch (cmd) {
        case '/wiki':
            const wikiQuery = parts.slice(1).join(" ");
            if (!wikiQuery) { 
                addMessageToChat("⚠️ Shkruaj diçka për të kërkuar në Wikipedia.", 'bot'); 
                break; 
            }
            searchWikipediaReal(wikiQuery);
            break;

        case '/perkthim':
            if (parts.length < 3) {
                addMessageToChat("⚠️ Përdorimi: /perkthim [gjuha] [tekst]", 'bot');
                break;
            }
            const targetLang = parts[1].toLowerCase();
            const textToTranslate = parts.slice(2).join(" ");
            translateWithAPI(textToTranslate, targetLang);
            break;

        case '/meso':
            const split = fullMessage.replace("/meso", "").split("|");
            if (split.length === 2) {
                const question = split[0].trim().toLowerCase();
                const answer = split[1].trim();
                learnNewKnowledge(question, answer);
            } else {
                addMessageToChat("⚠️ Përdorimi: /meso pyetje | përgjigje", 'bot');
            }
            break;

        case '/moti':
            if (parts.length < 2) {
                addMessageToChat("⚠️ Përdorimi: /moti [qyteti]", 'bot');
            } else {
                const city = parts.slice(1).join(" ");
                getWeatherWithAPI(city);
            }
            break;

        case '/apikey':
            if (parts.length < 2) {
                checkApiKeyStatus();
            } else {
                const newApiKey = parts.slice(1).join(" ");
                saveApiKeyToServer(newApiKey);
            }
            break;

        case '/eksporto':
            exportKnowledge();
            break;

        case '/importo':
            importKnowledge();
            break;

        case '/gjej':
        case '/google':
        case '/kërko':
            const searchQuery = parts.slice(1).join(" ");
            if (!searchQuery) {
                addMessageToChat(`⚠️ Përdorimi: ${cmd} [kërkim]`, 'bot');
            } else {
                webSearchReal(searchQuery);
            }
            break;

        case '/admin':
        case '/users':
        case '/stats':
        case '/panel':
        case '/clearall':
            handleAdminCommands(cmd, parts);
            break;

        default:
            // Provoni llogaritje matematikore
            const calcResult = tryCalculate(fullMessage);
            if (calcResult !== null) {
                addMessageToChat("🧮 Rezultati: " + calcResult, 'bot');
                return;
            }
            
            // Nëse nuk është komandë e njohur
            addMessageToChat(`❌ Komanda "${cmd}" nuk është implementuar.`, 'bot');
    }
}

// ===================================== GJIT VECORITE NDIHMO COMAND ==========================================

// ✅ FUNKSIONET PËR KOMANDAT REALE

async function handleWikiSearch(query) {
    try {
        showThinkingIndicator();
        const res = await fetch(`https://sq.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
        const data = await res.json();
        hideThinkingIndicator();
        
        if (data.extract) {
            addMessageToChat(`🌐 **Wikipedia**: ${data.extract}`, "bot");
        } else {
            addMessageToChat("❌ Nuk u gjet informacion në Wikipedia.", "bot");
        }
    } catch (error) { 
        hideThinkingIndicator();
        addMessageToChat("⚠️ Gabim gjatë kërkimit në Wikipedia.", "bot"); 
    }
}

async function handleLearnCommand(question, answer) {
    try {
        const response = await fetch('/api/chat/knowledge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                userId: currentUser?.id || 1,
                question: question,
                answer: answer
            })
        });

        const data = await response.json();
        if (response.ok) {
            addMessageToChat("✅ Mësova diçka të re!", "bot");
        } else {
            addMessageToChat("⚠️ Gabim gjatë ruajtjes: " + data.error, "bot");
        }
    } catch (error) {
        addMessageToChat("⚠️ Gabim gjatë ruajtjes së njohurive.", "bot");
    }
}

async function handleTranslation(text, targetLang) {
    const sourceLang = (targetLang === "sq") ? "en" : "sq";
    
    showThinkingIndicator();
    
    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`);
        const data = await response.json();
        hideThinkingIndicator();
        
        const translatedText = data?.responseData?.translatedText || "❌ Gabim përkthimi.";
        addMessageToChat(`🔄 **Përkthim**: ${translatedText}`, "bot");
    } catch (error) {
        hideThinkingIndicator();
        addMessageToChat("⚠️ Gabim përkthimi.", "bot");
    }
}

async function handleExport() {
    try {
        const response = await fetch(`/api/chat/export/${currentUser?.id || 1}`);
        const data = await response.json();
        
        if (response.ok) {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "knowledge.json";
            link.click();
            addMessageToChat("💾 Eksportova njohuritë!", "bot");
        } else {
            addMessageToChat("❌ Gabim gjatë eksportimit: " + data.error, "bot");
        }
    } catch (error) {
        addMessageToChat("❌ Gabim gjatë eksportimit.", "bot");
    }
}

function handleImport() {
    const input = document.createElement("input");
    input.type = "file"; 
    input.accept = "application/json";
    input.onchange = async (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const knowledgeData = JSON.parse(reader.result);
                
                const response = await fetch('/api/chat/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: currentUser?.id || 1,
                        knowledge: knowledgeData
                    })
                });

                const data = await response.json();
                if (response.ok) {
                    addMessageToChat("✅ Importova njohuritë!", "bot");
                } else {
                    addMessageToChat("❌ Gabim gjatë importimit: " + data.error, "bot");
                }
            } catch (error) {
                addMessageToChat("❌ Gabim gjatë importimit.", "bot");
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

async function handleWeather(city) {
    showThinkingIndicator();
    
    try {
        const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=%c+%t+%w+%h`);
        const data = await response.text();
        hideThinkingIndicator();
        addMessageToChat(`🌍 **Moti në ${city}**: ${data}`, "bot");
    } catch (error) {
        hideThinkingIndicator();
        addMessageToChat("⚠️ Gabim gjatë marrjes së motit.", "bot");
    }
}

async function checkApiKeyStatus() {
    try {
        const response = await fetch('/api/api-keys/status/gemini', {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.hasApiKey) {
            addMessageToChat("🔑 API Key është konfiguruar në server!", "bot");
        } else {
            addMessageToChat("❌ Nuk ka API Key të konfiguruar. Përdor: /apikey [key_jote]", "bot");
        }
    } catch (error) {
        addMessageToChat("❌ Gabim gjatë kontrollimit të statusit të API Key.", "bot");
    }
}

async function saveApiKeyCommand(apiKey) {
    try {
        const response = await fetch('/api/api-keys/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser?.id || 1,
                apiKey: apiKey,
                serviceName: 'gemini'
            })
        });

        const data = await response.json();
        if (response.ok) {
            addMessageToChat("✅ API Key u ruajt me sukses në server!", "bot");
        } else {
            addMessageToChat("❌ Gabim gjatë ruajtjes së API Key: " + data.error, "bot");
        }
    } catch (error) {
        addMessageToChat("❌ Gabim gjatë ruajtjes së API Key.", "bot");
    }
}

// ✅ FUNKSIONE ADMIN (do të implementohen më vonë)
function showAllUsers() {
    addMessageToChat("👥 **Lista e Përdoruesve**\n\nFunksioni do të implementohet së shpejti...", "bot");
}

function showSystemStats() {
    addMessageToChat("📊 **Statistikat e Sistemit**\n\nFunksioni do të implementohet së shpejti...", "bot");
}

function clearAllChats() {
    addMessageToChat("🗑️ **Fshirja e të gjitha bisedave**\n\nFunksioni do të implementohet së shpejti...", "bot");
}

function addAdminPanel() {
    addMessageToChat("👑 **Paneli i Adminit**\n\nFunksioni do të implementohet së shpejti...", "bot");
}

// ========================== ✅ FUNKSION PËR TË SHFAQUR PANELIN E NDIHMËS - VERSION I RI ================================
function showHelpPanel() {
    console.log('🔄 Duke hapur panelin e ndihmës...');
    
    // Krijo modal për panelin e ndihmës
    const existingModal = document.getElementById('help-panel-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'help-panel-modal';
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 700px;
        max-height: 90vh;
        background: white;
        border: 3px solid #667eea;
        border-radius: 15px;
        box-shadow: 0 0 30px rgba(0,0,0,0.4);
        z-index: 10000;
        overflow: hidden;
        font-family: Arial, sans-serif;
    `;
    
    // Header i modalit
    const header = document.createElement('div');
    header.style.cssText = `
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 20px;
        text-align: center;
        position: relative;
    `;
    header.innerHTML = `
        <h2 style="margin: 0; font-size: 24px;">👑 CHATAI ALBA - PANELI I NDIHMËS 👑</h2>
        <button onclick="document.getElementById('help-panel-modal').remove()" 
                style="position: absolute; top: 10px; right: 15px; background: none; border: none; color: white; font-size: 24px; cursor: pointer; padding: 5px 10px;">×</button>
    `;
    
    // Përmbajtja e modalit
    const content = document.createElement('div');
    content.style.cssText = `
        padding: 20px;
        max-height: 70vh;
        overflow-y: auto;
    `;
    content.innerHTML = `
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="color: #2c3e50; margin-top: 0;">🔹 KOMANDAT BAZË</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <button onclick="useCommand('/ndihmo')" style="background: #4CAF50; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">📋 /ndihmo</button>
                <button onclick="useCommand('/wiki ')" style="background: #2196F3; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">🌐 /wiki</button>
                <button onclick="useCommand('/perkthim ')" style="background: #FF9800; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">🔄 /perkthim</button>
                <button onclick="useCommand('/meso ')" style="background: #9C27B0; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">🎓 /meso</button>
                <button onclick="useCommand('/moti ')" style="background: #607D8B; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">🌍 /moti</button>
                <button onclick="useCommand('/apikey ')" style="background: #795548; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">🔑 /apikey</button>
            </div>
        </div>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="color: #1565c0; margin-top: 0;">🚀 KËRKIM NË INTERNET</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
                <button onclick="useCommand('/gjej ')" style="background: #FF5722; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">🔍 /gjej</button>
                <button onclick="useCommand('/google ')" style="background: #4285F4; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">🔎 /google</button>
                <button onclick="useCommand('/kërko ')" style="background: #34A853; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">📰 /kërko</button>
            </div>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="color: #e65100; margin-top: 0;">💾 MENAXHIM I DHËNAVE</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <button onclick="useCommand('/eksporto')" style="background: #009688; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">📥 /eksporto</button>
                <button onclick="useCommand('/importo')" style="background: #FFC107; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">📤 /importo</button>
            </div>
        </div>

        <div style="background: #fce4ec; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="color: #c2185b; margin-top: 0;">👑 ADMIN PANEL</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <button onclick="useCommand('/admin')" style="background: #7B1FA2; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">⚡ /admin</button>
                <button onclick="useCommand('/users')" style="background: #512DA8; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">👥 /users</button>
                <button onclick="useCommand('/stats')" style="background: #303F9F; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">📊 /stats</button>
                <button onclick="useCommand('/panel')" style="background: #1976D2; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">🛠️ /panel</button>
            </div>
        </div>

        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="color: #2e7d32; margin-top: 0;">⚡ VEPRIME TË SHPEJTA</h3>
            <input type="text" id="quickCommand" placeholder="Shkruaj komandën këtu..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 10px;">
            <button onclick="executeQuickCommand()" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; width: 100%;">🚀 Ekzekuto Komandën</button>
        </div>
    `;
    
    modal.appendChild(header);
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Shto mesazh në chat
    addMessageToChat('🔧 Panel-i i ndihmës u hap! Shfrytëzoni komandat e disponueshme.', 'bot');
}

// ✅ FUNKSION PËR PËRDORIMIN E KOMANDËS NGA BUTONAT
function useCommand(command) {
    console.log('🎯 Përdor komandën nga butoni:', command);
    document.getElementById('user-input').value = command;
    // Mbyll modalin
    document.getElementById('help-panel-modal')?.remove();
}

// ✅ FUNKSION PËR KOMANDË TË SHPEJTË
function executeQuickCommand() {
    const quickInput = document.getElementById('quickCommand');
    const command = quickInput.value.trim();
    if (command) {
        document.getElementById('user-input').value = command;
        document.getElementById('help-panel-modal')?.remove();
        // Opsional: ekzekuto automatikisht
        // handleSendMessage();
    }
}

// ==================== 🔮 OPENAI PANEL - EXACT SI GEMINI ====================

// ✅ SHFAQ PANELIN OPENAI
function showOpenAIPanel() {
    console.log('🔮 Duke hapur panelin OpenAI...');
    document.getElementById('openai-modal').style.display = 'block';
    updateOpenAIStatus();
}

// ✅ UPDATE STATUS - EXACT SI GEMINI
async function updateOpenAIStatus() {
    const statusDiv = document.getElementById('openai-key-status');
    
    try {
        statusDiv.textContent = '🔄 Duke kontrolluar statusin...';
        statusDiv.className = 'api-status';
        
        const response = await fetch('/api/openai-enhanced/status', {
            credentials: 'include'
        });
        
        const data = await response.json();
        console.log('📊 OpenAI Status:', data);
        
        if (data.success) {
            if (data.hasApiKey) {
                statusDiv.textContent = '✅ OpenAI i konfiguruar';
                statusDiv.className = 'api-status valid';
                document.getElementById('openai-key-input').value = '••••••••••••••••';
            } else {
                statusDiv.textContent = '❌ OpenAI jo i konfiguruar';
                statusDiv.className = 'api-status invalid';
                document.getElementById('openai-key-input').value = '';
            }
        } else {
            statusDiv.textContent = '❌ ' + data.error;
            statusDiv.className = 'api-status invalid';
        }
    } catch (error) {
        console.error('❌ Status error:', error);
        statusDiv.textContent = '❌ Gabim në lidhje';
        statusDiv.className = 'api-status invalid';
    }
}

// ✅ RUAJ API KEY - EXACT SI GEMINI
async function saveOpenAIKey() {
    const apiKey = document.getElementById('openai-key-input').value.trim();
    const statusDiv = document.getElementById('openai-key-status');
    
    if (!apiKey) {
        statusDiv.textContent = '❌ Ju lutem vendosni OpenAI API Key';
        statusDiv.className = 'api-status invalid';
        return;
    }
    
    // Kontrollo nëse është API Key i maskuar
    if (apiKey === '••••••••••••••••') {
        statusDiv.textContent = '❌ Ju lutem vendosni API Key të vërtetë, jo të maskuar';
        statusDiv.className = 'api-status invalid';
        return;
    }
    
    try {
        statusDiv.textContent = '🔄 Duke ruajtur...';
        statusDiv.className = 'api-status';
        
        const response = await fetch('/api/openai-enhanced/save-key', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ apiKey })
        });
        
        const data = await response.json();
        console.log('💾 Save OpenAI Key Response:', data);
        
        if (data.success) {
            statusDiv.textContent = '✅ ' + data.message;
            statusDiv.className = 'api-status valid';
            
            // Refresh status pas 1 sekonde
            setTimeout(updateOpenAIStatus, 1000);
            
        } else {
            statusDiv.textContent = '❌ ' + data.error;
            statusDiv.className = 'api-status invalid';
        }
    } catch (error) {
        console.error('❌ Save OpenAI Key Error:', error);
        statusDiv.textContent = '❌ Gabim në server';
        statusDiv.className = 'api-status invalid';
    }
}

// ✅ FSHI API KEY - EXACT SI GEMINI
async function deleteOpenAIKey() {
    const statusDiv = document.getElementById('openai-key-status');
    
    try {
        statusDiv.textContent = '🔄 Duke fshirë...';
        statusDiv.className = 'api-status';
        
        const response = await fetch('/api/openai-enhanced/delete-key', {
            method: 'DELETE',
            credentials: 'include'
        });
        
        const data = await response.json();
        console.log('🗑️ Delete OpenAI Key Response:', data);
        
        if (data.success) {
            statusDiv.textContent = '✅ ' + data.message;
            statusDiv.className = 'api-status valid';
            document.getElementById('openai-key-input').value = '';
            
            // Refresh status pas 1 sekonde
            setTimeout(updateOpenAIStatus, 1000);
        } else {
            statusDiv.textContent = '❌ ' + data.error;
            statusDiv.className = 'api-status invalid';
        }
    } catch (error) {
        console.error('❌ Delete OpenAI Key Error:', error);
        statusDiv.textContent = '❌ Gabim në server';
        statusDiv.className = 'api-status invalid';
    }
}

// ✅ TEST OPENAI CONNECTION
async function testOpenAIConnection() {
    try {
        const response = await fetch('/api/openai-enhanced/test', {
            credentials: 'include'
        });
        const data = await response.json();
        console.log('🧪 OpenAI Test:', data);
        
        if (data.success) {
            alert('✅ OpenAI Routes punojnë!');
        } else {
            alert('❌ OpenAI Test FAILED: ' + data.message);
        }
    } catch (error) {
        alert('❌ Test ERROR: ' + error.message);
    }
}

// ==================== 🚀 SISTEMI KRYESOR I CHAT ====================

// ✅ MBIVENDOS FUNKSIONIN EKZISTUES TË CHAT-IT
document.addEventListener('DOMContentLoaded', function() {
    // Gjej butonin e send dhe input-in
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    
    if (sendBtn && userInput) {
        // Hiq event listener-et e vjetra
        sendBtn.replaceWith(sendBtn.cloneNode(true));
        userInput.replaceWith(userInput.cloneNode(true));
        
        // Shto event listener-et e rinj
        const newSendBtn = document.getElementById('send-btn');
        const newUserInput = document.getElementById('user-input');
        
        newSendBtn.addEventListener('click', handleSendMessage);
        newUserInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSendMessage();
            }
        });
        
        console.log('✅ OpenAI chat system me komanda u aktivizua');
    }
});

// =============================== ✅ FUNKSIONI I RI PËR DËRGIM MESAZHESH ME SISTEM MOTORËSH ========================
async function handleSendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (!message) return;
    
    // ✅ KONTROLLO NËSE ËSHTË KOMANDË SPECIALE
    const isSpecialCommand = processSpecialCommands(message);
    if (isSpecialCommand) {
        console.log('🎯 Komanda speciale u procesua');
        userInput.value = '';
        return;
    }
    
    // ✅ Shto mesazhin e user-it në chat
    addMessageToChat(message, 'user');
    userInput.value = '';
    
    try {
        // Shfaq loading indicator
        const chat = document.getElementById('chat');
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-indicator';
        loadingDiv.className = 'message bot';
        loadingDiv.innerHTML = '<div class="message-text">🔄 Po procesoj...</div>';
        chat.appendChild(loadingDiv);
        chat.scrollTop = chat.scrollHeight;
        
        // ✅ ZGJIDH MOTORIN E DUHUR BAZË NË STATUS
        let result;
        
        if (aiEngineStatus.gemini) {
            console.log('🤖 Duke përdorur Gemini...');
            result = await sendToGemini(message);
        } else if (aiEngineStatus.openai) {
            console.log('🔮 Duke përdorur OpenAI...');
            result = await sendChatMessage(message);
        } else {
            // Fallback nëse asnjë motor nuk është aktiv
            result = {
                success: false,
                error: '❌ Asnjë motor AI nuk është aktiv. Aktivizoni Gemini ose OpenAI.'
            };
        }
        
        // Hiq loading indicator
        document.getElementById('loading-indicator')?.remove();
        
        if (result.success) {
            addMessageToChat(result.response, 'bot');
        } else {
            addMessageToChat('❌ ' + result.error, 'bot');
        }
    } catch (error) {
        console.error('❌ Gabim në handleSendMessage:', error);
        document.getElementById('loading-indicator')?.remove();
        addMessageToChat('❌ Gabim në server. Provoni përsëri.', 'bot');
    }
}

// ✅ FUNKSION PËR DËRGIM NË GEMINI - Shto pas handleSendMessage
async function sendToGemini(message) {
    try {
        console.log('🤖 Duke dërguar në Gemini:', message);
        
        const response = await fetch('/api/gemini/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        console.log('📥 Përgjigje nga Gemini:', data);
        
        if (data.success) {
            return {
                success: true,
                response: data.response
            };
        } else {
            return {
                success: false,
                error: data.error || 'Gabim i panjohur nga Gemini'
            };
        }
    } catch (error) {
        console.error('❌ Gabim në Gemini chat:', error);
        return {
            success: false,
            error: 'Gabim në lidhje me serverin'
        };
    }
}

// ==================== 🚀 SISTEMI I RI I MOTORËVE - PA NDRYSHIME ====================

// ✅ INICIALIZO MOTORËT PA PREKUR currentUser
function initializeAIEngineSystem() {
    console.log('🚀 Duke inicializuar sistemin e motorëve...');
    
    // ✅ KRIJO VARIABLA TË REJA (nuk prekin currentUser)
    const aiEngineStatus = {
        gemini: true,
        openai: false
    };
    
    // ✅ FUNKSIONI PËR NDRYSHIMIN E MOTORËVE
    function switchAIEngine(engine) {
        console.log('🔄 Duke ndryshuar motorin në:', engine);
        
        aiEngineStatus.gemini = false;
        aiEngineStatus.openai = false;
        aiEngineStatus[engine] = true;
        
        updateEngineStatusUI();
        
        const engineName = engine === 'gemini' ? '🤖 Gemini' : '🔮 OpenAI';
        if (typeof addMessageToChat !== 'undefined') {
            addMessageToChat(`🔧 Motor i aktivizuar: ${engineName}`, 'system');
        }
    }
    
    // ✅ FUNKSIONI PËR PËRDDITËSIMIN E UI
    function updateEngineStatusUI() {
        const geminiBtn = document.getElementById('gemini-engine-btn');
        const openaiBtn = document.getElementById('openai-engine-btn');
        
        if (geminiBtn) {
            geminiBtn.style.background = aiEngineStatus.gemini ? '#4CAF50' : '#666';
            geminiBtn.textContent = aiEngineStatus.gemini ? '🤖 Gemini ✅' : '🤖 Gemini';
        }
        
        if (openaiBtn) {
            openaiBtn.style.background = aiEngineStatus.openai ? '#2196F3' : '#666';
            openaiBtn.textContent = aiEngineStatus.openai ? '🔮 OpenAI ✅' : '🔮 OpenAI';
        }
    }
    
    // ✅ SHTO EVENT LISTENERS PËR BUTONAT
    function attachButtonListeners() {
        const geminiBtn = document.getElementById('gemini-engine-btn');
        const openaiBtn = document.getElementById('openai-engine-btn');
        
        if (geminiBtn) {
            geminiBtn.addEventListener('click', function() {
                switchAIEngine('gemini');
            });
        }
        
        if (openaiBtn) {
            openaiBtn.addEventListener('click', function() {
                switchAIEngine('openai');
            });
        }
        
        console.log('✅ Event listeners u shtuan!');
    }
    
    // ✅ EKZEKUTO INICIALIZIMIN
    setTimeout(() => {
        attachButtonListeners();
        updateEngineStatusUI();
        console.log('✅ Sistemi i motorëve u inicializua!');
    }, 1000);
}

// ✅ THIRR FUNKSIONIN KUR FAQA NGARKOHET
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Faqja u ngarkua - duke nisur sistemin e motorëve...');
    initializeAIEngineSystem();
});

console.log('🚀 RRUFE-TESLA Chat System u ngarkua me sukses!');
