// ================================= Në main.js - shto në fillim të skedës ===============================================
console.log('🚀 RRUFE-TESLA AI System - Initializing...');

// ========================================== ✅ FUNKSION PËR AUTENTIFIKIM GLOBAL ====================================

async function initializeUserSession() {
    try {
        console.log('👤 Duke inicializuar sesionin e përdoruesit...');
        
        // Kontrollo nëse ekziston sesion aktiv
        const response = await fetch('/api/auth/status', {
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Sesioni i përdoruesit:', data);
            
            if (data.authenticated) {
                window.currentUser = data.user;
                console.log('👤 Përdorues i identifikuar:', data.user);
                return true;
            }
        }
        
        // Nëse nuk ka sesion, krijo sesion të ri
        console.log('🆕 Nuk ka sesion aktiv, duke krijuar sesion të ri...');
        const createResponse = await fetch('/api/auth/auto-create', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({
                username: 'user_' + Date.now(),
                autoCreate: true
            })
        });
        
        if (createResponse.ok) {
            const userData = await createResponse.json();
            console.log('✅ Sesion i ri u krijua:', userData);
            window.currentUser = userData.user;
            return true;
        }
        
        console.log('❌ Nuk mund të krijohet sesion i ri');
        return false;
        
    } catch (error) {
        console.error('❌ Gabim në inicializimin e sesionit:', error);
        return false;
    }
}

// ✅ INICIALIZO SESIONIN PAS NGARKIMIT
document.addEventListener('DOMContentLoaded', async function() {
    console.log('📄 DOM u ngarkua, duke inicializuar sesionin...');
    
    const sessionReady = await initializeUserSession();
    
    if (sessionReady) {
        console.log('🎯 Sesioni u inicializua, sistemi është gati!');
        // Inicializo sistemin e motorëve pas sesionit
        setTimeout(initializeAIEngineSystem, 500);
    } else {
        console.log('⚠️ Sistemi po funksionon pa sesion të plotë');
        setTimeout(initializeAIEngineSystem, 500);
    }
});

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

// =================================== 🔧 SISTEMI I BUTONAVE TË MOTORËVE ===================================

    // ✅ VARIABLA GLOBALE PËR MOTORËT
    window.aiEngineStatus = {
        gemini: true,    // Gemini aktiv si default
        openai: false    // OpenAI i çaktivizuar
    };

// ✅ VERSIONI I PLOTË PËRFUNDIMTAR
window.switchAIEngine = function(engine) {
    console.log('🔄 Duke ndryshuar motorin në:', engine);
    
    if (engine !== 'gemini' && engine !== 'openai') {
        console.error('❌ Motor i pavlefshëm:', engine);
        return;
    }
    
    // Çaktivizo të gjithë motorët
    window.aiEngineStatus.gemini = false;
    window.aiEngineStatus.openai = false;
    
    // Aktivizo motorin e zgjedhur
    window.aiEngineStatus[engine] = true;
    
    console.log('✅ Statusi i ri:', window.aiEngineStatus);
    
    // Përditëso butonat
    updateAIButtons();
    
    // ✅ SHFAQ MESAZH NË CHAT PËR AKTIVIZIM
    const engineName = engine === 'gemini' ? '🤖 Gemini' : '🔮 OpenAI';
    const activationMessage = `🔧 **Motor i aktivizuar:** ${engineName} është tani motori aktiv!`;
    
    // Përdor funksionin e vërtetë addMessage
    addMessage(activationMessage, 'system');
    
    // ✅ FOKUSO NË INPUT FIELD PAS NDRYSHIMIT
    const userInput = document.getElementById('user-input');
    if (userInput) {
        userInput.focus();
        userInput.placeholder = `Shkruaj mesazhin këtu... (${engineName} aktiv)`;
    }
    
    console.log(`🎯 ${engineName} u aktivizua me sukses!`);
    
    // ✅ MBYL OPENAI PANEL NËSE ËSHTË I HAPUR
    if (engine === 'gemini') {
        const openaiModal = document.getElementById('openai-modal');
        if (openaiModal) {
            openaiModal.style.display = 'none';
        }
    }
};

    // ✅ FUNKSIONI PËR PËRDDITËSIMIN E BUTONAVE
    function updateAIButtons() {
        const geminiBtn = document.getElementById('gemini-engine-btn');
        const openaiBtn = document.getElementById('openai-engine-btn');
        
        console.log('🎨 Duke përditësuar butonat...');
        
        if (geminiBtn) {
            if (window.aiEngineStatus.gemini) {
                geminiBtn.style.background = '#4CAF50';
                geminiBtn.style.color = 'white';
                geminiBtn.style.border = '2px solid #45a049';
                geminiBtn.textContent = '🤖 Gemini ✅';
                geminiBtn.title = 'Gemini është aktiv';
            } else {
                geminiBtn.style.background = '#666';
                geminiBtn.style.color = '#ccc';
                geminiBtn.style.border = '2px solid #555';
                geminiBtn.textContent = '🤖 Gemini';
                geminiBtn.title = 'Kliko për të aktivizuar Gemini';
            }
        }
        
        if (openaiBtn) {
            if (window.aiEngineStatus.openai) {
                openaiBtn.style.background = '#2196F3';
                openaiBtn.style.color = 'white';
                openaiBtn.style.border = '2px solid #1976D2';
                openaiBtn.textContent = '🔮 OpenAI ✅';
                openaiBtn.title = 'OpenAI është aktiv';
            } else {
                openaiBtn.style.background = '#666';
                openaiBtn.style.color = '#ccc';
                openaiBtn.style.border = '2px solid #555';
                openaiBtn.textContent = '🔮 OpenAI';
                openaiBtn.title = 'Kliko për të aktivizuar OpenAI';
            }
        }
        
        console.log('✅ Butonat u përditësuan:', window.aiEngineStatus);
    }

    // ✅ SHTO EVENT LISTENERS PËR BUTONAT
    function attachButtonListeners() {
        const geminiBtn = document.getElementById('gemini-engine-btn');
        const openaiBtn = document.getElementById('openai-engine-btn');
        
        console.log('🔗 Duke shtuar event listeners...');
        
        if (geminiBtn) {
            geminiBtn.onclick = function() {
                console.log('🎯 Gemini butoni u klikua');
                window.switchAIEngine('gemini');
            };
            console.log('✅ Gemini event listener u shtua');
        }
        
        if (openaiBtn) {
            openaiBtn.onclick = function() {
                console.log('🎯 OpenAI butoni u klikua');
                window.switchAIEngine('openai');
            };
            console.log('✅ OpenAI event listener u shtua');
        }
    }

    // ✅ INICIALIZO BUTONAT
    function initializeAIEngineSystem() {
        console.log('🚀 Duke inicializuar sistemin e motorëve...');
        attachButtonListeners();
        updateAIButtons();
        console.log('✅ Sistemi i motorëve u inicializua!');
    }

    // ✅ INICIALIZIMI
    setTimeout(initializeAIEngineSystem, 1000);

    // =============================✅  OpenAI PANEL ====================================================

   function showOpenAIPanel() {
    console.log('🔮 Duke hapur panelin OpenAI...');
    document.getElementById('openai-modal').style.display = 'block';
    
    // ✅ PËRDOR VERSIONIN E RI TË UPDATE
    updateOpenAIPanelEnhanced();
    
    // ✅ SHTO BUTONA SHTESË
    setTimeout(() => {
        const panel = document.querySelector('.openai-panel');
        if (panel) {
            // Butoni për status të detajuar
            const detailedBtn = document.createElement('button');
            detailedBtn.textContent = '🔍 Status i Detajuar';
            detailedBtn.onclick = checkOpenAIDetailedStatus;
            detailedBtn.style.margin = '5px';
            detailedBtn.style.background = '#2196F3';
            
            // Butoni për force init
            const forceBtn = document.createElement('button');
            forceBtn.textContent = '🔄 Force Init';
            forceBtn.onclick = forceOpenAIInit;
            forceBtn.style.margin = '5px';
            forceBtn.style.background = '#FF9800';
            
            panel.appendChild(detailedBtn);
            panel.appendChild(forceBtn);
        }
    }, 100);
}

    // ✅ Ruaj OpenAI Key në server
    async function saveOpenAIKey() {
        const apiKey = document.getElementById('openai-key-input').value.trim();
        const statusDiv = document.getElementById('openai-key-status');
        
        if (!apiKey) {
            statusDiv.textContent = '❌ Ju lutem vendosni OpenAI API Key';
            statusDiv.className = 'api-status invalid';
            return;
        }
        
        try {
            statusDiv.textContent = '🔄 Duke ruajtur në database...';
            statusDiv.className = 'api-status';
            
            const response = await fetch('/api/openai-enhanced/save-key', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({ apiKey })
            });
            
            const data = await response.json();
            console.log('📥 Përgjigja nga serveri:', data);
            
            if (data.success) {
                statusDiv.textContent = '✅ ' + data.message;
                statusDiv.className = 'api-status valid';
                
                // Mbylle modalin pas 2 sekondash
                setTimeout(() => {
                    document.getElementById('openai-modal').style.display = 'none';
                }, 2000);
                
            } else {
                statusDiv.textContent = '❌ ' + data.message;
                statusDiv.className = 'api-status invalid';
            }
        } catch (error) {
            console.error('❌ Gabim në ruajtjen e OpenAI Key:', error);
            statusDiv.textContent = '❌ Gabim në server: ' + error.message;
            statusDiv.className = 'api-status invalid';
        }
    }

    // ✅ Fshi OpenAI Key nga serveri
    async function deleteOpenAIKey() {
        const statusDiv = document.getElementById('openai-key-status');
        
        try {
            statusDiv.textContent = '🔄 Duke fshirë nga database...';
            statusDiv.className = 'api-status';
            
            const response = await fetch('/api/openai-enhanced/delete-key', {
                method: 'DELETE',
                credentials: 'include'
            });
            
            const data = await response.json();
            console.log('📥 Përgjigja e fshirjes:', data);
            
            if (data.success) {
                statusDiv.textContent = '✅ ' + data.message;
                statusDiv.className = 'api-status valid';
                document.getElementById('openai-key-input').value = '';
            } else {
                statusDiv.textContent = '❌ ' + data.message;
                statusDiv.className = 'api-status invalid';
            }
        } catch (error) {
            console.error('❌ Gabim në fshirjen e OpenAI Key:', error);
            statusDiv.textContent = '❌ Gabim në server: ' + error.message;
            statusDiv.className = 'api-status invalid';
        }
    }

    // ✅ Kontrollo statusin e OpenAI Key
    async function updateOpenAIStatus() {
        const statusDiv = document.getElementById('openai-key-status');
        
        try {
            statusDiv.textContent = '🔄 Duke kontrolluar statusin...';
            statusDiv.className = 'api-status';
            
            const response = await fetch('/api/openai-enhanced/status', {
                credentials: 'include'
            });
            
            const data = await response.json();
            console.log('📊 Statusi i OpenAI:', data);
            
            if (data.success && data.hasApiKey) {
                statusDiv.textContent = '✅ OpenAI është i konfiguruar dhe aktiv';
                statusDiv.className = 'api-status valid';
                document.getElementById('openai-key-input').value = '••••••••••••••••';
            } else {
                statusDiv.textContent = '❌ OpenAI nuk është i konfiguruar';
                statusDiv.className = 'api-status invalid';
                document.getElementById('openai-key-input').value = '';
            }
        } catch (error) {
            console.error('❌ Gabim në kontrollimin e statusit:', error);
            statusDiv.textContent = '❌ Gabim në kontrollim: ' + error.message;
            statusDiv.className = 'api-status invalid';
        }
    }

// ================================= 🎯 SIMULIM I MENÇUR - KAPJE E MESAZHEVE ================================

// ✅ 1. KAP FUNKSIONIN EKZISTUES TË DËRGIMIT
function initializeMessageInterceptor() {
    console.log('🎯 Duke inicializuar intercept për mesazhe...');
    
    // Gjej butonin e dërgimit
    const sendButton = document.querySelector('button[onclick*="send"], button[onclick*="Send"]');
    const userInput = document.getElementById('user-input');
    
    if (!sendButton || !userInput) {
        console.log('❌ Elementët e dërgimit nuk u gjetën');
        return;
    }
    
    console.log('✅ Elementët u gjetën:', { sendButton, userInput });
    
    // ✅ 2. KAP KLIKIMIN E BUTONIT
    const originalOnClick = sendButton.onclick;
    sendButton.onclick = function() {
        console.log('🔧 Intercept: Butoni u klikua');
        simulateMessageSend();
    };
    
    // ✅ 3. KAP ENTER KEY
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            console.log('🔧 Intercept: Enter u shtyp');
            simulateMessageSend();
        }
    });
    
    console.log('✅ Intercept u inicializua!');
}

// ✅ 4. FUNKSIONI I RI PËR DËRGIM SIMULUAR
// ✅ 4. FUNKSIONI I RI PËR DËRGIM SIMULUAR
async function simulateMessageSend() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (!message) return;
    
    console.log('🎯 simulateMessageSend - Motor aktiv:', window.aiEngineStatus);
    
    // ✅ TREGO SIMULIM NË UI
    addMessage(message, 'user');
    userInput.value = '';
    
    try {
        // ✅ SIMULIM LOADING
        const chat = document.getElementById('chat');
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'simulate-loading';
        loadingDiv.className = 'message bot';
        loadingDiv.innerHTML = '<div class="message-text">🔧 SIMULIM: Po dërgoj me motorin e zgjedhur...</div>';
        chat.appendChild(loadingDiv);
        chat.scrollTop = chat.scrollHeight;
        
        // ✅ DËRGO ME MOTORIN E ZGJEDHUR - VERSIONI I RI
        const activeEngine = window.aiEngineStatus?.openai ? 'openai' : 'gemini';
        console.log('🔧 [SIMULIM] Duke dërguar me motor:', activeEngine);
        
        let response;
        let result;
        
        if (activeEngine === 'openai') {
            // Përdor route-in e OpenAI
            response = await fetch('/api/openai-enhanced/chat', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({ 
                    message: message,
                    userId: window.currentUser?.id || 1
                })
            });
        } else {
            // Përdor route-in e Gemini
            response = await fetch('/api/chat/message', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({ 
                    message: message,
                    engine: 'gemini'
                })
            });
        }
        
        result = await response.json();
        
        // ✅ HIQ LOADING DHE SHFAQ REZULTATIN
        document.getElementById('simulate-loading')?.remove();
        
        if (result.success) {
            addMessage(`🔧 **SIMULIM SUKSESS** (Motor: ${activeEngine})\n\n${result.response}`, 'bot');
        } else {
            addMessage(`❌ **SIMULIM GABIM**: ${result.error}`, 'bot');
        }
        
    } catch (error) {
        console.error('❌ Gabim në simulim:', error);
        document.getElementById('simulate-loading')?.remove();
        addMessage('❌ Gabim në server gjatë simulimit.', 'bot');
    }
}

// ✅ 5. INICIALIZO SIMULIMIN
setTimeout(initializeMessageInterceptor, 2000);

// ==================================== ✅ FIX FINAL PËR BUTONIN E DËRGIMIT ==========================================

function fixSendButton() {
    console.log('🔧 Duke rregulluar butonin e dërgimit...');
    
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    
    if (!sendBtn) {
        console.log('❌ Send button nuk u gjet!');
        return;
    }
    
    // ✅ FSHI ÇDO EVENT LISTENER TË VJETËR
    sendBtn.replaceWith(sendBtn.cloneNode(true));
    
    // ✅ MER BUTONIN E RI
    const newSendBtn = document.getElementById('send-btn');
    
    if (newSendBtn && window.sendMessage) {
        // ✅ LIDH DIRECT ME FUNKSIONIN
        newSendBtn.onclick = window.sendMessage;
        console.log('✅ Send button u lidh me window.sendMessage');
    }
    
    // ✅ LIDH ENTER KEY
    if (userInput) {
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                window.sendMessage();
            }
        });
        console.log('✅ Enter key u lidh');
    }
    
    console.log('✅ Butoni i dërgimit u rregullua!');
}

// ✅ EKZEKUTO MENJËHERË
setTimeout(fixSendButton, 1000);

// ✅ EKZEKUTO EDHE KUR DOM ËSHTË GATI
document.addEventListener('DOMContentLoaded', fixSendButton);

// ✅ ALTERNATIVË - MODIFIKO DIRECT NË HTML
function forceButtonFix() {
    const sendBtn = document.getElementById('send-btn');
    if (sendBtn) {
        // ✅ METODË EKSTREME - NDRYSHO HTML DIRECT
        sendBtn.setAttribute('onclick', 'window.sendMessage()');
        console.log('✅ Butoni u modifikua direkt në HTML');
    }
}

// ✅ PROVO TË DYJA METODAT
setTimeout(() => {
    fixSendButton();
    setTimeout(forceButtonFix, 500);
}, 1500);

// ========================================== ✅ FIX FINAL PËR BUTONIN E DËRGIMIT =======================================

// ✅ FUNKSIONI KRYESOR PËR DËRGIM MESAZHESH
window.sendMessage = async function() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (!message) return;

    console.log('🚀 [SEND-MESSAGE] Duke dërguar mesazh:', message);

    try {
        // ✅ TREGO MESAZHIN E USER-IT
        addMessage(message, 'user');
        userInput.value = '';

        // ✅ TREGO LOADING
        const chat = document.getElementById('chat');
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-message';
        loadingDiv.className = 'message bot';
        loadingDiv.innerHTML = '<div class="message-text">⏳ Po procesoj...</div>';
        chat.appendChild(loadingDiv);
        chat.scrollTop = chat.scrollHeight;

        // ✅ MER MOTORIN AKTIV
        const activeEngine = window.aiEngineStatus?.openai ? 'openai' : 'gemini';
        console.log('🎯 [SEND-MESSAGE] Motor aktiv:', activeEngine);

        // ✅ DËRGO NË SERVER
        const response = await fetch('/api/chat/message', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({
                message: message,
                engine: activeEngine
            })
        });

        // ✅ HIQ LOADING
        document.getElementById('loading-message')?.remove();

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('📥 [SEND-MESSAGE] Përgjigja:', data);

        if (data.success) {
            addMessage(data.response, 'bot');
        } else {
            addMessage(`❌ Gabim: ${data.error || 'Gabim në server'}`, 'bot');
        }

    } catch (error) {
        console.error('❌ [SEND-MESSAGE] Gabim:', error);
        document.getElementById('loading-message')?.remove();
        addMessage('❌ Gabim në lidhje me serverin. Provo përsëri.', 'bot');
    }
};

// ✅ FUNKSIONI addMessage NËSE NUK EKZISTON
if (typeof window.addMessage === 'undefined') {
    window.addMessage = function(text, sender) {
        const chat = document.getElementById('chat');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = `<div class="message-text">${text}</div>`;
        chat.appendChild(messageDiv);
        chat.scrollTop = chat.scrollHeight;
    };
}

// ✅ FIX DEFINITIV PËR BUTONIN
function finalButtonFix() {
    console.log('🔧 FINAL FIX: Duke lidhur butonin...');
    
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    
    if (sendBtn) {
        // ✅ METODË E RE - FSHI DHE RIKRIJO BUTONIN
        const newSendBtn = sendBtn.cloneNode(true);
        sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);
        
        // ✅ LIDH BUTONIN E RI
        document.getElementById('send-btn').onclick = window.sendMessage;
        console.log('✅ Butoni u lidh me sendMessage');
    }
    
    if (userInput) {
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                window.sendMessage();
            }
        });
        console.log('✅ Enter key u lidh');
    }
}

// ✅ INICIALIZO KUR FAQJA ËSHTË GATI
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 DOM u ngarkua - duke inicializuar sistemin...');
    
    // Jep kohë për të gjitha modulet të ngarkohen
    setTimeout(() => {
        finalButtonFix();
        
        // Kontrollo nëse funksionon
        console.log('🧪 Testi i funksioneve:');
        console.log('- window.sendMessage:', typeof window.sendMessage);
        console.log('- window.addMessage:', typeof window.addMessage);
        console.log('- Butoni onclick:', document.getElementById('send-btn')?.onclick);
        
        // Aktivizo motorin default
        if (!window.aiEngineStatus) {
            window.aiEngineStatus = { gemini: true, openai: false };
        }
        
        console.log('✅ Sistemi u inicializua plotësisht!');
    }, 1000);
});

// ✅ EKZEKUTO EDHE PAS NGARKIMIT
setTimeout(finalButtonFix, 2000);

// ======================================== ✅ FIX FINAL - VERSION I KORRIGJUAR ===================================

console.log('🔧 Duke aktivizuar sistemin përfundimtar...');

// ✅ MBIVENDOS FUNKSIONIN sendMessage PËR TRAJTIMIN E TË GJITHA MESAZHEVE
const originalSendMessage = window.sendMessage;

window.sendMessage = async function() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (!message) {
        if (originalSendMessage) return originalSendMessage.call(this);
        return;
    }

    console.log('💬 [FINAL-FIX] Mesazh:', message);

    // ✅ SHFAQ MESAZHIN E USER-IT
    addMessage(message, 'user');
    userInput.value = '';

    // ✅ 1. KONTROLLO NËSE ËSHTË KOMANDË - THIRR PROCESSCOMMAND
    if (message.startsWith('/')) {
        console.log('🎯 [FINAL-FIX] Komandë, duke thirrur processCommand...');
        
        try {
            if (typeof processCommand === 'function') {
                await processCommand(message);
            } else {
                // FALLBACK NËSE PROCESSCOMMAND NUK EKZISTON
                console.log('❌ processCommand nuk u gjet, duke dërguar te serveri...');
                await sendToAI(message);
            }
        } catch (error) {
            console.error('❌ [FINAL-FIX] Gabim në processCommand:', error);
            addMessage('❌ Gabim në ekzekutimin e komandës.', 'bot');
        }
        return;
    }

    // ✅ 2. KONTROLLO NJOHURITË E RUAJTURA
    const hasKnowledge = await checkKnowledge(message);
    if (hasKnowledge) return;

    // ✅ 3. KONTROLLO LLOGARITJE MATEMATIKE
    const hasMath = await checkMath(message);
    if (hasMath) return;

    // ✅ 4. NËSE NUK GJETËM GJË, DËRGO TE SERVERI
    console.log('🔄 [FINAL-FIX] Mesazh normal, duke dërguar te serveri...');
    await sendToAI(message);
};

// ✅ FUNKSIONI PËR KONTROLLIMIN E NJOHURIVE
async function checkKnowledge(message) {
    try {
        console.log('💾 [FINAL-FIX] Duke kërkuar njohuri për:', message);
        
        if (window.currentUser && window.currentUser.id) {
            const response = await fetch(`/api/chat/knowledge/${window.currentUser.id}/${encodeURIComponent(message.toLowerCase())}`, {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('📊 [FINAL-FIX] Përgjigja e njohurive:', data);
                
                if (data.answer && data.answer !== 'null') {
                    console.log('✅ [FINAL-FIX] Gjetëm përgjigje të ruajtur!');
                    addMessage(`💾 **Përgjigje e ruajtur:** ${data.answer}`, 'bot');
                    return true;
                }
            }
        }
    } catch (error) {
        console.log('ℹ️ [FINAL-FIX] Nuk ka përgjigje të ruajtur:', error.message);
    }
    return false;
}

// ✅ FUNKSIONI PËR KONTROLLIMIN E LLOGARITJEVE
async function checkMath(message) {
    try {
        console.log('🧮 [FINAL-FIX] Duke kontrolluar për llogaritje...');
        
        // PROVO tryCalculate NGA SCRIPT.JS
        if (typeof tryCalculate === 'function') {
            const result = tryCalculate(message);
            if (result !== null) {
                console.log('✅ [FINAL-FIX] Llogaritje e gjetur nga tryCalculate:', result);
                addMessage(`🧮 **Rezultati**: ${result}`, 'bot');
                return true;
            }
        }
        
        // FALLBACK MANUAL PËR LLOGARITJE
        const mathMatch = message.match(/^([\d\+\-\*\/\s\.\(\)]+)$/);
        if (mathMatch) {
            const expression = mathMatch[1].replace(/\s+/g, '');
            if (expression.length > 2) {
                try {
                    // KONTROLLO SIGURINË
                    if (!/^[\d\+\-\*\/\(\)\.]+$/.test(expression)) {
                        throw new Error('Shprehje e pavlefshme');
                    }
                    
                    const result = eval(expression);
                    console.log('✅ [FINAL-FIX] Llogaritja manuale u krye:', result);
                    addMessage(`🧮 **Rezultati**: ${result}`, 'bot');
                    return true;
                } catch (e) {
                    console.log('❌ [FINAL-FIX] Llogaritja dështoi:', e.message);
                }
            }
        }
    } catch (error) {
        console.log('❌ [FINAL-FIX] Gabim në llogaritje:', error);
    }
    return false;
}

// ✅ FUNKSIONI PËR DËRGIMIN TE SERVERI
// ✅ FUNKSIONI PËR DËRGIMIN TE SERVERI
async function sendToAI(message) {
    try {
        const activeEngine = window.aiEngineStatus?.openai ? 'openai' : 'gemini';
        
        console.log('🎯 Motor aktiv:', activeEngine);
        
        // ✅ PËRDOR ROUTE TË NDRYSHME PËR OPENAI VS GEMINI
        if (activeEngine === 'openai') {
            // Përdor route-in e OpenAI
            const response = await fetch('/api/openai-enhanced/chat', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    message: message,
                    userId: window.currentUser?.id || 1
                })
            });
            
            const data = await response.json();
            if (data.success) {
                addMessage(data.response, 'bot');
            } else {
                console.error('❌ OpenAI error:', data.error);
                // Fallback në Gemini
                addMessage('❌ OpenAI nuk funksionon. Duke përdorur Gemini...', 'bot');
                await sendToAIWithGemini(message);
            }
        } else {
            // Përdor route-in e Gemini
            await sendToAIWithGemini(message);
        }
    } catch (error) {
        console.error('❌ [FINAL-FIX] Gabim në dërgim:', error);
        addMessage('❌ Gabim në lidhje.', 'bot');
    }
}

// ✅ FUNKSION VEÇMAS PËR GEMINI
async function sendToAIWithGemini(message) {
    try {
        const response = await fetch('/api/chat/message', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({
                message: message,
                engine: 'gemini'  // Specifiko që është Gemini
            })
        });
        
        const data = await response.json();
        if (data.success) {
            addMessage(data.response, 'bot');
        } else {
            addMessage('❌ Gabim në server.', 'bot');
        }
    } catch (error) {
        console.error('❌ Gabim Gemini:', error);
        addMessage('❌ Gabim në lidhje me serverin.', 'bot');
    }
}

// ✅ KONTROLLO FUNKSIONET
setTimeout(() => {
    console.log('🔍 [FINAL-FIX] Statusi:');
    console.log('- processCommand:', typeof processCommand);
    console.log('- tryCalculate:', typeof tryCalculate);
    console.log('- addMessage:', typeof addMessage);
    console.log('- currentUser:', window.currentUser);
}, 2000);

console.log('✅ Sistemi përfundimtar u aktivizua!');

// ========================================= ✅ DEBUG PËR NJOHURITË E RUAJTURA ========================================

console.log('🔧 Duke aktivizuar debug për njohuritë...');

// ✅ TESTO DIRECT NJOHURITË E RUAJTURA
async function debugStoredKnowledge() {
    console.log('🔍 DEBUG: Duke testuar njohuritë e ruajtura...');
    
    const testQuestion = 'si kaluat sot me festen?';
    
    try {
        if (window.currentUser && window.currentUser.id) {
            console.log('👤 User ID:', window.currentUser.id);
            
            const response = await fetch(`/api/chat/knowledge/${window.currentUser.id}/${encodeURIComponent(testQuestion.toLowerCase())}`, {
                credentials: 'include'
            });
            
            console.log('📡 Statusi i përgjigjes:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('📊 DEBUG - Përgjigja e serverit:', data);
                
                if (data.answer && data.answer !== 'null') {
                    console.log('✅ DEBUG - Gjetëm përgjigje të ruajtur:', data.answer);
                } else {
                    console.log('❌ DEBUG - Nuk ka përgjigje të ruajtur ose përgjigja është null');
                }
            } else {
                console.log('❌ DEBUG - Gabim në server:', response.status);
            }
        } else {
            console.log('❌ DEBUG - Nuk ka currentUser');
        }
    } catch (error) {
        console.log('❌ DEBUG - Gabim në fetch:', error.message);
    }
}

// ✅ TESTO PAS 3 SEKONDA
setTimeout(() => {
    debugStoredKnowledge();
}, 3000);

// ==================== ✅ TESTI I DREJTPËRDREJTË I OPENAI ====================

// ✅ TESTO API KEY NGA DATABASE
async function testOpenAIKey() {
    console.log('🧪 Duke testuar OpenAI API Key...');
    
    try {
        const response = await fetch('/api/openai-enhanced/test-key', {
            credentials: 'include'
        });
        
        const data = await response.json();
        console.log('📊 Test result:', data);
        
        if (data.success && data.isFunctional) {
            addMessage(`✅ **OpenAI TEST SUKSESS:** API Key funksionon! (Burimi: ${data.keySource})`, 'system');
            return true;
        } else if (data.hasKey && !data.isFunctional) {
            addMessage(`❌ **OpenAI TEST DËSHTIM:** API Key ekziston por nuk funksionon: ${data.error}`, 'system');
            return false;
        } else {
            addMessage(`⚠️ **OpenAI TEST:** Nuk ka API Key të ruajtur`, 'system');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Gabim në test:', error);
        addMessage(`❌ **Gabim në test:** ${error.message}`, 'system');
        return false;
    }
}

// ✅ KONTROLLO STATUSIN E DETAJUAR
async function checkOpenAIDetailedStatus() {
    console.log('🔍 Duke kontrolluar statusin e detajuar të OpenAI...');
    
    try {
        const response = await fetch('/api/openai-enhanced/status-detailed', {
            credentials: 'include'
        });
        
        const data = await response.json();
        console.log('📊 Detailed status:', data.status);
        
        let message = `🔍 **Statusi i OpenAI:**\n`;
        message += `- Database: ${data.status.database ? '✅' : '❌'}\n`;
        message += `- Environment: ${data.status.environment ? '✅' : '❌'}\n`;
        message += `- Funksional: ${data.status.functional ? '✅' : '❌'}\n`;
        
        if (data.status.message) {
            message += `\n${data.status.message}`;
        }
        
        if (data.status.error) {
            message += `\nGabim: ${data.status.error}`;
        }
        
        addMessage(message, 'system');
        return data.status;
        
    } catch (error) {
        console.error('❌ Gabim në kontroll:', error);
        addMessage(`❌ Gabim në kontrollin e statusit: ${error.message}`, 'system');
        return null;
    }
}

// ✅ FORCE INIT
async function forceOpenAIInit() {
    console.log('🔄 Duke forcuar inicializimin e OpenAI...');
    
    try {
        const response = await fetch('/api/openai-enhanced/force-init', {
            method: 'POST',
            credentials: 'include'
        });
        
        const data = await response.json();
        console.log('📊 Force init result:', data);
        
        if (data.success) {
            addMessage(`✅ **OpenAI u inicializua me forcë:** ${data.message}`, 'system');
            return true;
        } else {
            addMessage(`❌ **Inicializimi dështoi:** ${data.message}`, 'system');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Gabim në force init:', error);
        addMessage(`❌ Gabim: ${error.message}`, 'system');
        return false;
    }
}

// ✅ UPDATE PANEL ME INFORMACION TË RI
async function updateOpenAIPanelEnhanced() {
    const statusDiv = document.getElementById('openai-key-status');
    const testBtn = document.getElementById('openai-test-btn');
    
    if (!statusDiv) return;
    
    // Krijo butonin e testit nëse nuk ekziston
    if (!testBtn) {
        const panel = document.querySelector('.openai-panel');
        if (panel) {
            const newTestBtn = document.createElement('button');
            newTestBtn.id = 'openai-test-btn';
            newTestBtn.textContent = '🧪 Testo API Key';
            newTestBtn.onclick = testOpenAIKey;
            newTestBtn.style.margin = '5px';
            newTestBtn.style.background = '#ff9800';
            panel.appendChild(newTestBtn);
        }
    }
    
    try {
        statusDiv.textContent = '🔄 Duke testuar funksionalitetin...';
        
        const response = await fetch('/api/openai-enhanced/test-key');
        const data = await response.json();
        
        if (data.success && data.isFunctional) {
            statusDiv.innerHTML = `
                <div style="color: #4CAF50;">
                    ✅ <strong>OPENAI FUNKSIONON!</strong><br>
                    <small>Burimi: ${data.keySource}</small><br>
                    <small>Key: ${data.keyLength} karaktere</small><br>
                    <small>Test: "${data.testResponse}"</small>
                </div>
            `;
        } else if (data.hasKey && !data.isFunctional) {
            statusDiv.innerHTML = `
                <div style="color: #ff9800;">
                    ⚠️ <strong>OPENAI NUK FUNKSIONON</strong><br>
                    <small>Key ekziston por: ${data.error}</small><br>
                    <small><button onclick="forceOpenAIInit()" style="background:#ff9800;color:black;padding:3px;border:none;cursor:pointer;">🔄 Provo përsëri</button></small>
                </div>
            `;
        } else {
            statusDiv.innerHTML = `
                <div style="color: #f44336;">
                    ❌ <strong>NUK KA API KEY</strong><br>
                    <small>Vendosni API Key valid nga OpenAI Platform</small>
                </div>
            `;
        }
        
    } catch (error) {
        statusDiv.innerHTML = `
            <div style="color: #f44336;">
                ❌ <strong>GABIM NË KONTROLL</strong><br>
                <small>${error.message}</small>
            </div>
        `;
    }
}

// =============================== 🚀 RRUFE-TESLA KNOWLEDGE SYSTEM - 100% STANDALONE =================================

console.log('🧠 Duke inicializuar RRUFE-TESLA Knowledge System...');

// ✅ VARIABEL GLOBAL PËR NJOHURITË
window.rrufeKnowledge = {
    isEnabled: true,
    storage: {},
    debug: true
};

// ✅ 1. FUNKSIONI KRYESOR PËR KONTROLLIM E NJOHURIVE
async function rrufeCheckKnowledge(message) {
    if (!window.rrufeKnowledge.isEnabled) return false;
    
    console.log('🎯 [RRUFE-KNOWLEDGE] Duke kërkuar për:', message.substring(0, 50));
    
    try {
        // ✅ METODA 1: KËRKIM I DIREKT NË DATABASE
        const searchUrl = `/api/radical/radical-search/1/${encodeURIComponent(message.toLowerCase())}`;
        
        const response = await fetch(searchUrl, {
            method: 'GET',
            credentials: 'include'
        });
        
        console.log('📡 Statusi i përgjigjes:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('📊 Përgjigja:', data);
            
            if (data.success && data.found && data.answer) {
                console.log('✅✅✅ RRUFE-KNOWLEDGE: GJETËM PËRGJIGJE!');
                
                // Shfaq përgjigjen
                if (window.addMessage) {
                    window.addMessage(`💾 **Përgjigje e ruajtur:** ${data.answer}`, 'bot');
                }
                return true;
            }
        }
        
        // ✅ METODA 2: KËRKIM NË MEMORI LOKALE
        const key = message.toLowerCase();
        if (window.rrufeKnowledge.storage[key]) {
            console.log('💡 Gjetëm në memorie lokale:', window.rrufeKnowledge.storage[key]);
            
            if (window.addMessage) {
                window.addMessage(`💾 **Përgjigje e ruajtur:** ${window.rrufeKnowledge.storage[key]}`, 'bot');
            }
            return true;
        }
        
    } catch (error) {
        console.log('⚠️ Kërkimi i njohurive dështoi:', error.message);
    }
    
    return false;
}

// ✅ 2. FUNKSION PËR RUAJTJE TË NJOHURIVE
async function rrufeSaveKnowledge(question, answer) {
    if (!window.rrufeKnowledge.isEnabled) return false;
    
    console.log('💾 [RRUFE-SAVE] Duke ruajtur:', question.substring(0, 30));
    
    try {
        // ✅ RUAJ NË MEMORI LOKALE (INSTANT)
        const key = question.toLowerCase();
        window.rrufeKnowledge.storage[key] = answer;
        
        // ✅ RUAJ NË DATABASE (SISTEMI RADIKAL)
        const saveResponse = await fetch('/api/radical/radical-learn', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                userId: 1,
                question: question,
                answer: answer
            })
        });
        
        const data = await saveResponse.json();
        
        if (data.success) {
            console.log('✅✅✅ RRUFE-SAVE: U ruajt me sukses! ID:', data.id);
            
            if (window.addMessage) {
                window.addMessage(`✅ **RRUFE-TESLA mësoi:** "${question}" → "${answer}"`, 'system');
            }
            return true;
        }
        
    } catch (error) {
        console.log('❌ Ruajtja dështoi:', error.message);
    }
    
    return false;
}

// =============================================== 🎯 FINAL RRUFE-TESLA KNOWLEDGE FIX ====================================

// KODI I RI - VETËM KY DUHET TË JETË NË main.js

console.log('🔧 Duke aktivizuar RRUFE-TESLA Knowledge System v2...');

(function() {
    let isProcessing = false;
    let lastMessage = '';
    
    // ✅ 1. SETUP INPUT HANDLERS
    function setupHandlers() {
        const input = document.getElementById('user-input');
        const button = document.getElementById('send-btn');
        
        if (!input || !button) {
            setTimeout(setupHandlers, 500);
            return;
        }
        
        // ✅ FSHI EVENTE TË VJETRA
        input.removeEventListener('keypress', handleEnter);
        button.removeEventListener('click', handleClick);
        
        // ✅ SHTO EVENTE TË REJA
        input.addEventListener('keypress', handleEnter);
        button.addEventListener('click', handleClick);
        
        console.log('✅ Handlers u konfiguruan');
    }
    
    // ✅ 2. HANDLE ENTER KEY
    function handleEnter(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            processInput();
        }
    }
    
    // ✅ 3. HANDLE BUTTON CLICK
    function handleClick() {
        processInput();
    }
    
    // ✅ 4. PROCESO INPUT
    async function processInput() {
        const input = document.getElementById('user-input');
        const message = input ? input.value.trim() : '';
        
        // ✅ VALIDO
        if (!message || isProcessing || message === lastMessage) return;
        
        // ✅ BLOKO DUPLIKATET
        isProcessing = true;
        lastMessage = message;
        input.value = '';
        
        console.log('🎯 Processing:', message.substring(0, 30));
        
        // ✅ SHFAQ MESAZHIN E USER-IT
        if (window.addMessage) {
            window.addMessage(message, 'user');
        }
        
        // ✅ KONTROLLO NËSE ËSHTË /meso
        if (message.startsWith('/meso')) {
            await handleMeso(message);
        } 
        // ✅ KËRKO NJOHURI
        else {
            await handleKnowledge(message);
        }
        
        // ✅ LEJO PROCESIMIN E RI
        setTimeout(() => {
            isProcessing = false;
            lastMessage = '';
        }, 300);
    }
    
    // ✅ 5. HANDLE /meso COMMAND
    async function handleMeso(message) {
        const parts = message.substring(6).split('|');
        
        if (parts.length !== 2) {
            showMessage('❌ Format: /meso pyetja|përgjigja', 'bot');
            return;
        }
        
        const question = parts[0].trim();
        const answer = parts[1].trim();
        
        if (!question || !answer) {
            showMessage('❌ Plotëso pyetjen dhe përgjigjen', 'bot');
            return;
        }
        
        // ✅ SHFAQ KONFIRMIM
        showMessage(`💾 **Ruajtur:** "${question}"`, 'bot');
        
        // ✅ RUAJ NË BACKGROUND
        try {
            await fetch('/api/radical/radical-learn', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    userId: 1,
                    question: question,
                    answer: answer
                })
            });
        } catch (error) {
            console.error('💾 Save error:', error);
        }
    }
    
    // ✅ 6. KËRKO NJOHURI
    async function handleKnowledge(message) {
        // ✅ KËRKO NJOHURI TË RUAJTURA
        try {
            const response = await fetch(
                `/api/radical/radical-search/1/${encodeURIComponent(message.toLowerCase())}`
            );
            
            const data = await response.json();
            
            if (data.success && data.found && data.answer) {
                showMessage(`💾 **Përgjigje:** ${data.answer}`, 'bot');
                return true; // ✅ NDALO KËTU
            }
        } catch (error) {
            console.log('ℹ️ No knowledge:', error.message);
        }
        
        // ✅ NËSE NUK KA NJOHURI, DËRGO TE AI
        await sendToAI(message);
        return false;
    }
    
    // ✅ 7. DËRGO TE AI
    async function sendToAI(message) {
        try {
            const response = await fetch('/api/chat/message', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    message: message,
                    engine: 'gemini'
                })
            });
            
            const data = await response.json();
            if (data.success && data.response) {
                showMessage(data.response, 'bot');
            }
        } catch (error) {
            console.error('❌ AI error:', error);
            showMessage('❌ Gabim në server', 'bot');
        }
    }
    
    // ✅ 8. SHFAQ MESAZH
    function showMessage(text, sender) {
        if (typeof window.addMessage === 'function') {
            window.addMessage(text, sender);
        }
    }
    
    // ✅ 9. START
    setTimeout(() => {
        setupHandlers();
        console.log('✅✅✅ RRUFE-TESLA KNOWLEDGE SYSTEM READY!');
    }, 2000);
    
})();
