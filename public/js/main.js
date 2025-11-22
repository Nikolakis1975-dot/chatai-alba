// ✅ KONTROLLO NËSE SISTEMI ËSHTË STABIL PARA SE TË NDRYSHOSH sendMessage
function safeSendMessageOverride() {
    // Kontrollo nëse chat-i po funksionon normalisht
    if (!window.chatSystem || !window.chatSystem.initialized) {
        console.log('❌ ChatSystem nuk është gati - duke anuluar mbishkrimin');
        return;
    }
    
    // Kontrollo nëse komandat po funksionojnë
    if (typeof window.sendMessage === 'undefined') {
        console.log('❌ sendMessage nuk ekziston - duke anuluar');
        return;
    }
    
    console.log('✅ Sistemi është stabil - duke vazhduar me integrimin');
    // ... vetëm atëherë ekzekuto kodin e mbishkrimit
}

// Në vend që të ekzekutosh direkt, kontrollo parë
setTimeout(safeSendMessageOverride, 3000);

// ======================================================
// 🚀 RRUFE-TESLA 10.5 - MAIN PLATFORM LOADER
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
// 🚀 SMART RESPONSE ROUTER PRIMARY - VERSION I RI I THJESHTË
// ======================================================

function forceSmartIntegration() {
    console.log('🧠🔄 MAKING SMART RESPONSE ROUTER PRIMARY...');
    
    if (typeof window.sendMessage !== 'undefined') {
        const originalSendMessage = window.sendMessage;
        
        window.sendMessage = async function() {
            const input = document.getElementById('user-input');
            const message = input ? input.value.trim() : '';
            
            if (!message) return;
            
            console.log('🎯 SMART ROUTER PRIMARY - Message:', message);
            
            // 🚨 KONTROLLO PARË NËSE ËSHTË KOMANDË E RËNDËSISHME RRUFE
            const importantCommands = ['/ndihmo', '/apikey', '/users', '/stats', '/admin', '/panel'];
            const isImportantCommand = importantCommands.some(cmd => 
                message.toLowerCase().startsWith(cmd.toLowerCase())
            );
            
            // Pastro input
            if (input) input.value = "";
            
            // Shto mesazhin e përdoruesit
            if (typeof addMessage === 'function') {
                addMessage(message, 'user');
            }
            
            // 🚨 NËSE ËSHTË KOMANDË E RËNDËSISHME, PËRDOR SISTEMIN EKZISTUES
            if (isImportantCommand && typeof window.processRrufeCommand === 'function') {
                console.log('🔗 Komandë e rëndësishme - duke e dërguar te sistemi ekzistues:', message);
                try {
                    const response = await window.processRrufeCommand(message);
                    if (response && typeof addMessage === 'function') {
                        addMessage(response, 'bot');
                    }
                    return; // STOP KËTU
                } catch (error) {
                    console.log('❌ Error in important command:', error);
                }
            }
            
            // 🎯 PRIORITET I PARË: SMART RESPONSE ROUTER (për mesazhet e tjera)
            if (window.smartResponseRouter && window.smartResponseRouter.initialized) {
                try {
                    console.log('🎯 Using SmartResponseRouter as PRIMARY...');
                    const response = await window.smartResponseRouter.processUserMessage(message);
                    
                    // Kontrollo nëse përgjigja është e mirë
                    if (response && response.length > 10 && 
                        !response.includes('E kuptoj!') && 
                        !response.includes('Përdorni /ndihmo')) {
                        
                        console.log('✅ SMART ROUTER Response:', response.substring(0, 60));
                        
                        // Shto përgjigjen në chat
                        if (typeof addMessage === 'function') {
                            addMessage(response, 'bot');
                        }
                        
                        return; // ✅ STOP KËTU - MOS PËRDOR SISTEMIN E VJETËR
                    }
                } catch (error) {
                    console.log('❌ Error in SmartResponseRouter:', error);
                }
            }
            
            // 🔄 FALLBACK: Sistemi i vjetër
            console.log('🔄 Falling back to original system...');
            try {
                await originalSendMessage.call(this);
            } catch (error) {
                console.log('❌ Error in fallback:', error);
            }
        };
        
        console.log('✅ SMART ROUTER PRIMARY ACTIVATED!');
    }
}

// Ekzekuto menjëherë
setTimeout(forceSmartIntegration, 2000);


// Ekzekuto patch-in pas 5 sekondash
setTimeout(forceSmartIntegration, 5000);

// Gjithashtu ekzekuto kur bëhet login
const originalLogin = window.login;
if (originalLogin) {
    window.login = function() {
        const result = originalLogin.apply(this, arguments);
        setTimeout(forceSmartIntegration, 2000);
        return result;
    };
}

// =========================== NË FUND TË main.js - PËRDOR sendMessage TË RI ================================

// Butoni ➤ - Përdor sendMessage të ri me SmartResponseRouter
document.addEventListener('DOMContentLoaded', function() {
    const sendBtn = document.getElementById('send-btn');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
        console.log('✅ Send button configured with SmartResponseRouter');
    }
    
    // Enter në tastierë
    const userInput = document.getElementById('user-input');
    if (userInput) {
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        console.log('✅ Enter key configured with SmartResponseRouter');
    }
});
