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
    
    // ✅ KORRIJGJIMI: KONTROLLO PARASESH NËSE DIVINEFUSION EKZISTON
    if (window.rrufePlatform && window.rrufePlatform.modules.divineFusion) {
        try {
            window.rrufePlatform.modules.divineFusion.performDivineActivationRitual();
            rlog('🌌 RRUFE-TESLA u aktivizua!');
        } catch (error) {
            rlog('❌ Gabim në DivineFusion:', error.message);
            rlog('🌌 Duke aktivizuar RRUFE-TESLA pa DivineFusion...');
        }
    } else {
        rlog('🌌 Duke aktivizuar RRUFE-TESLA (DivineFusion nuk është i disponueshëm)');
    }
    
    if (window.addMessage) {
        window.addMessage('🌌 **RRUFE-TESLA 8.0 i aktivizuar** - Modaliteti i avancuar është aktiv!', 'system');
    }
}

function activateDivineAI() {
    window.currentAIMode = 'DIVINE';
    rlog('⚡ AI Hyjnor i aktivizuar - Divine Fusion aktiv');
    
    // Ndrysho styling e butonave
    updateAIButtonStyles('DIVINE');
    
    // ✅ KORRIJGJIMI: KONTROLLO PARASESH NËSE MODULET EKZISTOJNË
    if (window.rrufePlatform && window.rrufePlatform.modules.divineFusion) {
        try {
            window.rrufePlatform.modules.divineFusion.performDivineActivationRitual();
            rlog('⚡ Divine Fusion u aktivizua!');
        } catch (error) {
            rlog('❌ Gabim në DivineFusion ritual:', error.message);
        }
    }
    
    // Kontrollo nëse testAdvancedModules ekziston para se ta thirrësh
    if (window.rrufePlatform && typeof window.rrufePlatform.testAdvancedModules === 'function') {
        try {
            window.rrufePlatform.testAdvancedModules();
        } catch (error) {
            rlog('❌ Gabim në testAdvancedModules:', error.message);
        }
    }
    
    if (window.addMessage) {
        window.addMessage('⚡ **Divine Fusion i aktivizuar** - Modaliteti hyjnor është aktiv!', 'system');
    }
}
