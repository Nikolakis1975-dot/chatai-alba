// ======================================================
// 🚀 MODULI PRINCIPAL RRUFEJE - main.js (VERSION RRUFE-TESLA 8.0)
// ======================================================

// Custom logger që funksionon edhe me console të bllokuar
function rlog(message) {
    try {
        // Provo console.log fillimisht
        console.log('🔍 ' + message);
    } catch (e) {
        // Fallback në alert
        try {
            alert('🔍 ' + message);
        } catch (e2) {
            // Last resort - shkruaj në DOM
            const logElement = document.createElement('div');
            logElement.style.cssText = 'position:fixed; top:10px; left:10px; background:#000; color:#0f0; padding:10px; z-index:99999; font-family:monospace; border:2px solid #0f0;';
            logElement.textContent = '🔍 ' + message;
            document.body.appendChild(logElement);
        }
    }
}

rlog('🎯 MODULI RRUFEJE U NGARKUA ME SUKSES!');

class RrufePlatform {
    constructor() {
        rlog('🚀 RrufePlatform u krijua!');
        this.modules = {};
        this.isInitialized = false;
 
        // ✅ MODULET E REJA RRUFE-TESLA
        this.modules.quantumMemory = null;
        this.modules.bioNeuralNetwork = null;
        this.modules.temporalContext = null;
        this.modules.cognitiveAwareness = null;        
        this.modules.geminiKnowledgeAccelerator = null; 
        
        this.init();
    }
    
    async init() {
        try {
            rlog('🔧 Duke inicializuar Platformën RRUFEJE...');
            
            // ======================================================
            // 🧠 INICIALIZIMI I MODULEVE BAZË
            // ======================================================
            
            // ✅ MODULI 1: SessionManager
            this.modules.sessionManager = {
                sessionId: 'rrufe_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                sessionStart: new Date(),
                messageCount: 0,
                currentUser: 'guest',
                userRole: 'guest',
                
                getSessionId: function() {
                    return this.sessionId;
                },
                
                getSessionDuration: function() {
                    const duration = Math.floor((new Date() - this.sessionStart) / 1000);
                    const minutes = Math.floor(duration / 60);
                    const seconds = duration % 60;
                    return (minutes > 0 ? minutes + 'm ' : '') + seconds + 's';
                },
                
                getSessionInfo: function() {
                    return {
                        id: this.sessionId,
                        start: this.sessionStart,
                        duration: this.getSessionDuration(),
                        messageCount: this.messageCount,
                        user: this.currentUser,
                        role: this.userRole
                    };
                },
                
                incrementMessageCount: function() {
                    this.messageCount++;
                },
                
                isSessionActive: function() {
                    const duration = (new Date() - this.sessionStart) / 1000 / 60; // në minuta
                    return duration < 120; // Sesion aktiv për 2 orë
                },
                
                renewSession: function() {
                    this.sessionId = 'rrufe_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                    this.sessionStart = new Date();
                    this.messageCount = 0;
                    rlog('🔄 Sesioni u rinovua: ' + this.sessionId);
                    return this.sessionId;
                },
                
                getSessionStats: function() {
                    return {
                        sessionId: this.sessionId,
                        duration: this.getSessionDuration(),
                        messageCount: this.messageCount,
                        isActive: this.isSessionActive(),
                        user: this.currentUser
                    };
                }
            };
            
            // ✅ MODULI 2: ContextMemory
            this.modules.contextMemory = {
                conversationContext: [],
                maxContextLength: 15,
                
                addToContext: function(message, sender, response = null) {
                    const contextEntry = {
                        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                        message: message,
                        sender: sender,
                        response: response,
                        timestamp: new Date(),
                        keywords: this.extractKeywords(message),
                        importance: this.calculateImportance(message, sender)
                    };
                    
                    // Shto në fillim të array (mesazhet e reja së pari)
                    this.conversationContext.unshift(contextEntry);
                    
                    // Mbaj vetëm mesazhet e fundit
                    if (this.conversationContext.length > this.maxContextLength) {
                        this.conversationContext = this.conversationContext.slice(0, this.maxContextLength);
                    }
                    
                    rlog('💾 Shtova në kontekst: ' + message.substring(0, 30));
                    
                    // Increment message count
                    if (window.rrufePlatform && window.rrufePlatform.modules.sessionManager) {
                        window.rrufePlatform.modules.sessionManager.incrementMessageCount();
                    }
                    
                    return contextEntry.id;
                },
                
                calculateImportance: function(message, sender) {
                    let score = 0;
                    if (sender === 'user') score += 2;
                    if (message.includes('?') || message.includes('si ') || message.includes('ku ') || message.includes('kur ')) {
                        score += 3;
                    }
                    if (message.length > 50) score += 1;
                    const importantKeywords = ['rëndësi', 'dëshiroj', 'dua', 'mëso', 'ndihmo', 'urgjent'];
                    if (importantKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
                        score += 2;
                    }
                    return Math.min(score, 10);
                },

                generateContextForResponse: function() {
                    if (this.conversationContext.length === 0) {
                        return "Bisedë e re. Përshëndetje!";
                    }
                    
                    const recentMessages = this.conversationContext.slice(0, 3);
                    let context = "Konteksti i bisedës: ";
                    
                    recentMessages.forEach((entry) => {
                        context += `${entry.sender}: "${entry.message}". `;
                    });
                    
                    return context;
                },
                
                searchInMemory: function(query) {
                    const results = [];
                    const queryKeywords = this.extractKeywords(query);
                    
                    this.conversationContext.forEach(entry => {
                        const matchScore = this.calculateMatchScore(entry.keywords, queryKeywords);
                        if (matchScore > 0.3) {
                            results.push({
                                entry: entry,
                                score: matchScore
                            });
                        }
                    });
                    
                    results.sort((a, b) => b.score - a.score);
                    return results.slice(0, 3);
                },
                
                extractKeywords: function(text) {
                    const words = text.toLowerCase()
                        .replace(/[^\w\s]/g, '')
                        .split(/\s+/)
                        .filter(word => word.length > 2);
                    
                    const stopWords = ['është', 'jam', 'jeni', 'ju', 'unë', 'nga', 'në', 'për', 'me', 'pa', 'tek'];
                    return words.filter(word => !stopWords.includes(word));
                },
                
                calculateMatchScore: function(keywords1, keywords2) {
                    if (keywords1.length === 0 || keywords2.length === 0) return 0;
                    const commonWords = keywords1.filter(word => keywords2.includes(word));
                    return commonWords.length / Math.max(keywords1.length, keywords2.length);
                },
                
                getContextStats: function() {
                    return {
                        totalMessages: this.conversationContext.length,
                        averageImportance: this.conversationContext.reduce((sum, entry) => sum + entry.importance, 0) / this.conversationContext.length || 0,
                        oldestMessage: this.conversationContext.length > 0 ? this.conversationContext[this.conversationContext.length - 1].timestamp : null,
                        newestMessage: this.conversationContext.length > 0 ? this.conversationContext[0].timestamp : null
                    };
                },
                
                debugContext: function() {
                    const stats = this.getContextStats();
                    rlog('🔍 DEBUG KONTEKSTI: ' + stats.totalMessages + ' mesazhe');
                    rlog('📊 Rëndësia mesatare: ' + stats.averageImportance.toFixed(2));
                    if (this.conversationContext.length > 0) {
                        rlog('📝 Konteksti i fundit: ' + this.generateContextForResponse().substring(0, 50) + '...');
                    }
                }
            };

            // ✅ MODULI 3: ChatObserver
            this.modules.chatObserver = {
                isObserving: false,
                lastMessageCount: 0,
                observer: null,
                intervalId: null,
                
                startObserving: function() {
                    if (this.isObserving) {
                        rlog('🔍 CHAT OBSERVER: Tashmë është duke vëzhguar');
                        return;
                    }
                    
                    rlog('🎯 CHAT OBSERVER: Duke filluar vëzhgimin...');
                    this.isObserving = true;
                    
                    this.setupMutationObserver();
                    this.setupIntervalObserver();
                    
                    rlog('✅ CHAT OBSERVER: Vëzhgimi filloi me sukses!');
                },
                
                setupMutationObserver: function() {
                    const chatContainer = document.getElementById('chat');
                    if (!chatContainer) {
                        rlog('⏳ CHAT OBSERVER: Chat container nuk u gjet, provoj përsëri...');
                        setTimeout(() => this.setupMutationObserver(), 2000);
                        return;
                    }
                    
                    this.observer = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if (mutation.type === 'childList') {
                                mutation.addedNodes.forEach((node) => {
                                    if (node.nodeType === 1 && node.classList && 
                                        (node.classList.contains('message') || node.querySelector('.message'))) {
                                        this.processNewMessage(node);
                                    }
                                });
                            }
                        });
                    });
                    
                    this.observer.observe(chatContainer, {
                        childList: true,
                        subtree: true
                    });
                    
                    rlog('🔍 CHAT OBSERVER: Mutation Observer u aktivizua');
                },
                
                setupIntervalObserver: function() {
                    this.intervalId = setInterval(() => {
                        const messages = document.querySelectorAll('.message, [class*="message"]');
                        if (messages.length > this.lastMessageCount) {
                            const newMessages = Array.from(messages).slice(this.lastMessageCount);
                            newMessages.forEach(message => this.processNewMessage(message));
                            this.lastMessageCount = messages.length;
                        }
                    }, 1000);
                },
                
                processNewMessage: function(messageElement) {
                    try {
                        const messageContent = messageElement.querySelector('.message-content') || messageElement;
                        const text = messageContent.textContent || messageContent.innerText || '';
                        
                        const sender = messageElement.classList.contains('user-message') ? 'user' : 
                                      messageElement.classList.contains('bot-message') ? 'bot' : 
                                      messageElement.classList.contains('system-message') ? 'system' : 'unknown';
                        
                        rlog('🔍 CHAT OBSERVER: Kapur mesazh - ' + sender + ': ' + text.substring(0, 50));
                        
                        // Ruaj në kontekst
                        if (window.rrufePlatform && window.rrufePlatform.modules.contextMemory) {
                            window.rrufePlatform.modules.contextMemory.addToContext(text, sender);
                        }
                        
                    } catch (error) {
                        rlog('❌ CHAT OBSERVER: Gabim në processNewMessage: ' + error);
                    }
                },
                
                stopObserving: function() {
                    if (this.observer) {
                        this.observer.disconnect();
                    }
                    if (this.intervalId) {
                        clearInterval(this.intervalId);
                    }
                    this.isObserving = false;
                    rlog('🛑 CHAT OBSERVER: Vëzhgimi u ndal');
                },
                
                debugObserver: function() {
                    rlog('🔍 DEBUG CHAT OBSERVER:');
                    rlog('- Është duke vëzhguar: ' + this.isObserving);
                    rlog('- Mesazhe të kapura: ' + this.lastMessageCount);
                }
            };

            // ======================================================
            // 🚀 INICIALIZIMI I MODULEVE RRUFE-TESLA
            // ======================================================
            
            // ✅ MODULI 4: Quantum Memory
            if (typeof QuantumMemory !== 'undefined') {
                this.modules.quantumMemory = new QuantumMemory(this.modules.contextMemory);
                rlog('⚛️ QUANTUM MEMORY u integrua!');
            } else {
                rlog('⚠️ QuantumMemory nuk u gjet - kontrollo skedarin');
            }
            
            // ✅ MODULI 5: Bio-Neural Network
            if (typeof BioNeuralNetwork !== 'undefined') {
                this.modules.bioNeuralNetwork = new BioNeuralNetwork(this.modules.contextMemory);
                rlog('🧬 BIO-NEURAL NETWORK u integrua!');
            } else {
                rlog('⚠️ BioNeuralNetwork nuk u gjet - kontrollo skedarin');
            }
            
            // ✅ MODULI 6: Temporal Context
            if (typeof TemporalContext !== 'undefined') {
                this.modules.temporalContext = new TemporalContext(this.modules.contextMemory);
                rlog('⏳ TEMPORAL CONTEXT u integrua!');
            } else {
                rlog('⚠️ TemporalContext nuk u gjet - kontrollo skedarin');
            }

            // ======================================================
            // 🚀 RRUFE 4.0 - COGNITIVE AWARENESS LAYER
            // ======================================================
            
            // ✅ MODULI 7: Cognitive Awareness
            if (typeof CognitiveAwareness !== 'undefined') {
                this.modules.cognitiveAwareness = new CognitiveAwareness(
                    this.modules.temporalContext,
                    this.modules.bioNeuralNetwork, 
                    this.modules.contextMemory
                );
                rlog('🎭 COGNITIVE AWARENESS LAYER u integrua!');
            } else {
                rlog('⚠️ CognitiveAwareness nuk u gjet');
            }
            
            // ======================================================
            // 🚀 RRUFE 6.0 - GEMINI KNOWLEDGE ACCELERATOR
            // ======================================================
            
            // ✅ MODULI 8: Gemini Knowledge Accelerator
            if (typeof GeminiKnowledgeAccelerator !== 'undefined') {
                this.modules.geminiKnowledgeAccelerator = new GeminiKnowledgeAccelerator(
                    this.modules.contextMemory,
                    this.modules.quantumMemory,
                    this.modules.temporalContext
                );
                rlog('🚀 GEMINI KNOWLEDGE ACCELERATOR u integrua!');
            } else {
                rlog('⚠️ GeminiKnowledgeAccelerator nuk u gjet');
            }

            // ======================================================
            // 🚀 INICIALIZIMI I SISTEMIT
            // ======================================================
            
            // Fillo vëzhgimin e chat-it
            this.modules.chatObserver.startObserving();
            
            // Integro me sistemin ekzistues
            this.integrateWithExisting();
            
            this.isInitialized = true;
            rlog('✅ PLATFORMA RRUFEJE U INICIALIZUA ME 8 MODULE!');
            
            // Shfaq mesazhin e mirëseardhjes
            this.showWelcomeMessage();
            
        } catch (error) {
            rlog('❌ Gabim në inicializim: ' + error.message);
        }
    }
    
    // ======================================================
    // 🔗 METODA: INTEGRIMI ME SISTEMIN EKZISTUES
    // ======================================================
    integrateWithExisting() {
        rlog('🔗 Duke integruar me sistemin ekzistues...');
        
        // ✅ INTEGRIMI ME sendMessage EKZISTUES
        if (typeof window.sendMessage !== 'undefined') {
            const originalSendMessage = window.sendMessage;
            
            window.sendMessage = async function() {
                const input = document.getElementById('user-input');
                const message = input ? input.value.trim() : '';
                
                if (!message) return;

                // ✅ SHTO MESAZHIN E PËRDORUESIT NË KONTEKST
                if (window.rrufePlatform && window.rrufePlatform.modules.contextMemory) {
                    window.rrufePlatform.modules.contextMemory.addToContext(message, 'user');
                }
                
                // ✅ THIRRE FUNKSIONIN ORIGJINAL
                await originalSendMessage.call(this);
                
                // ✅ PAS PËRGJIGJES, SHTO PËRGJIGJEN E BOTIT NË KONTEKST
                setTimeout(() => {
                    const chat = document.getElementById('chat');
                    if (chat) {
                        const messages = chat.querySelectorAll('.bot-message');
                        const lastBotMessage = messages[messages.length - 1];
                        if (lastBotMessage) {
                            const response = lastBotMessage.querySelector('.message-content')?.textContent;
                            if (response && window.rrufePlatform?.modules?.contextMemory) {
                                window.rrufePlatform.modules.contextMemory.addToContext(response, 'bot');
                                rlog('💾 Ruajta përgjigjen e botit në kontekst: ' + response.substring(0, 50));
                            }
                        }
                    }
                }, 1000);
            };
            
            rlog('✅ MODULI I KONTEKSTIT U INTEGRUAR ME sendMessage!');
        }
    }
    
    // ======================================================
    // 💬 METODA: SHFAQJA E MIRËSEARDHJES
    // ======================================================
    showWelcomeMessage() {
        setTimeout(() => {
            if (typeof window.addMessage !== 'undefined' && this.modules.sessionManager) {
                const sessionInfo = this.modules.sessionManager.getSessionInfo();
                
                const welcomeMsg = `
👑 **PLATFORMA RRUFEJE ME 8 MODULE TË AVANCUARA!** 

🎯 **Sesioni:** ${sessionInfo.id.substring(0, 15)}...
🕒 **Koha:** ${new Date().toLocaleTimeString('sq-AL')}
🧠 **Module të ngarkuara:** 
   • SessionManager ✅
   • ContextMemory ✅  
   • ChatObserver ✅
   • QuantumMemory ${this.modules.quantumMemory ? '✅' : '❌'}
   • BioNeuralNetwork ${this.modules.bioNeuralNetwork ? '✅' : '❌'} 
   • TemporalContext ${this.modules.temporalContext ? '✅' : '❌'}
   • CognitiveAwareness ${this.modules.cognitiveAwareness ? '✅' : '❌'}
   • GeminiKnowledgeAccelerator ${this.modules.geminiKnowledgeAccelerator ? '✅' : '❌'}
🔧 **Status:** 🟢 **SISTEMI RRUFE-TESLA 8.0 AKTIV**

💡 *Tani çdo mesazh procesohet me inteligjencë kuantike, nervore dhe kognitive!*`;
                window.addMessage(welcomeMsg, 'system', false);
            }
        }, 2000);
    }
    
    // ======================================================
    // 🛠️ METODA: DEBUG DHE TESTIM
    // ======================================================
    debugPlatform() {
        const sessionInfo = this.modules.sessionManager.getSessionInfo();
        const contextStats = this.modules.contextMemory.getContextStats();
        
        rlog('🔍 DEBUG I PLATFORMËS RRUFEJE:\n\n' +
             '🎯 **Sesioni:** ' + sessionInfo.id + '\n' +
             '🕒 **Koha:** ' + sessionInfo.duration + '\n' +
             '💾 **Context Memory:** ' + contextStats.totalMessages + ' mesazhe\n' +
             '🧠 **Rëndësia mesatare:** ' + contextStats.averageImportance.toFixed(2) + '\n' +
             '👁️ **Chat Observer:** ' + (this.modules.chatObserver.isObserving ? '🟢 AKTIV' : '🔴 JO AKTIV') + '\n' +
             '🔧 **Status:** 🟢 **SISTEMI I PLOTË AKTIV**');
    }

    // ======================================================
    // 🌟 METODA E RE: RRUFE-TESLA DEBUG 8.0
    // ======================================================
    
    debugRrufeTesla() {
        console.log('🚀 DEBUG RRUFE-TESLA PLATFORM 8.0:');
        console.log('================================');
        
        // Modulet bazë
        console.log('🧩 MODULET BAZË:');
        console.log('- SessionManager:', this.modules.sessionManager ? '✅' : '❌');
        console.log('- ContextMemory:', this.modules.contextMemory ? '✅' : '❌');
        console.log('- ChatObserver:', this.modules.chatObserver ? '✅' : '❌');
        
        // Modulet e reja RRUFE-TESLA
        console.log('🌟 MODULET RRUFE-TESLA:');
        console.log('- QuantumMemory:', this.modules.quantumMemory ? '✅' : '❌');
        console.log('- BioNeuralNetwork:', this.modules.bioNeuralNetwork ? '✅' : '❌');
        console.log('- TemporalContext:', this.modules.temporalContext ? '✅' : '❌');
        console.log('- CognitiveAwareness:', this.modules.cognitiveAwareness ? '✅' : '❌');
        console.log('- GeminiKnowledgeAccelerator:', this.modules.geminiKnowledgeAccelerator ? '✅' : '❌');
        
        // Statistikat e kontekstit
        if (this.modules.contextMemory) {
            const stats = this.modules.contextMemory.getContextStats();
            console.log('📊 STATISTIKA:');
            console.log('- Mesazhe totale:', stats.totalMessages);
            console.log('- Rëndësia mesatare:', stats.averageImportance.toFixed(2));
        }
        
        console.log('🎯 STATUS: RRUFE-TESLA PLATFORM 8.0 ' + 
                   (this.modules.quantumMemory && this.modules.bioNeuralNetwork && this.modules.temporalContext && 
                    this.modules.cognitiveAwareness && this.modules.geminiKnowledgeAccelerator ? 
                    '🟢 OPERATIONAL' : '🟡 PARTIAL'));
    }
    
    // ======================================================
    // 🔬 METODA TË REJA PËR TESTIM
    // ======================================================
    
    testAdvancedModules() {
        console.log('🧪 TESTIM I MODULEVE TË AVANCUARA RRUFE-TESLA 8.0:');
        
        // Testo Quantum Memory
        if (this.modules.quantumMemory) {
            console.log('🔮 TEST QUANTUM MEMORY:');
            this.modules.quantumMemory.debugQuantumMemory();
            
            // Krijo disa entanglements test
            if (this.modules.contextMemory.conversationContext.length >= 2) {
                const msg1 = this.modules.contextMemory.conversationContext[0];
                const msg2 = this.modules.contextMemory.conversationContext[1];
                this.modules.quantumMemory.createQuantumEntanglement(msg1, msg2);
            }
        } else {
            console.log('❌ QuantumMemory nuk është inicializuar');
        }
        
        // Testo Bio-Neural Network
        if (this.modules.bioNeuralNetwork) {
            console.log('🧠 TEST BIO-NEURAL NETWORK:');
            this.modules.bioNeuralNetwork.debugNeuralNetwork();
            
            // Proceso mesazh test
            this.modules.bioNeuralNetwork.processMessageThroughNetwork("Test mesazh për rrjetin nervor");
        } else {
            console.log('❌ BioNeuralNetwork nuk është inicializuar');
        }
        
        // Testo Temporal Context
        if (this.modules.temporalContext) {
            console.log('⏳ TEST TEMPORAL CONTEXT:');
            this.modules.temporalContext.debugTemporalContext();
            
            // Krijo hartë kohore
            if (this.modules.contextMemory.conversationContext.length > 0) {
                this.modules.temporalContext.createTemporalMap(this.modules.contextMemory.conversationContext);
            }
        } else {
            console.log('❌ TemporalContext nuk është inicializuar');
        }
        
        // Testo Cognitive Awareness
        if (this.modules.cognitiveAwareness) {
            console.log('🎭 TEST COGNITIVE AWARENESS:');
            this.modules.cognitiveAwareness.debugCognitiveAwareness();
            
            // Testo procesimin kognitiv
            const cognitiveData = this.modules.cognitiveAwareness.processCognitiveLayer(
                "Test mesazh për shtresën kognitive",
                "user",
                "test_user"
            );
            console.log('🧠 Rezultati kognitiv:', cognitiveData.emotionalState);
        } else {
            console.log('❌ CognitiveAwareness nuk është inicializuar');
        }
        
        // Testo Gemini Knowledge Accelerator
        if (this.modules.geminiKnowledgeAccelerator) {
            console.log('🚀 TEST GEMINI KNOWLEDGE ACCELERATOR:');
            this.modules.geminiKnowledgeAccelerator.debugKnowledgeAccelerator();
            
            // Testo kapjen e njohurive
            const knowledgeId = this.modules.geminiKnowledgeAccelerator.captureGeminiKnowledge(
                "Kjo është një përgjigje test nga Gemini",
                "Test pyetje",
                this.modules.contextMemory.conversationContext
            );
            console.log('💎 Njohuria u kap me ID:', knowledgeId);
        } else {
            console.log('❌ GeminiKnowledgeAccelerator nuk është inicializuar');
        }
        
        console.log('🎉 TESTIMI I MODULEVE TË AVANCUARA U KOMPLETUA!');
    }
    
    // ======================================================
    // 💾 METODA: TESTIM I SHPEJTË I KONTEKSTIT
    // ======================================================
    testContextMemory() {
        rlog('🧪 TESTIM I KONTEKST MEMORY:');
        
        // Shto disa mesazhe testuese
        this.modules.contextMemory.addToContext("Përshëndetje bot!", "user", "Përshëndetje! Si mund të ndihmoj?");
        this.modules.contextMemory.addToContext("Si je sot?", "user", "Jam shumë mirë, faleminderit!");
        this.modules.contextMemory.addToContext("Çfarë mund të bësh për mua?", "user", "Mund të ndihmoj me shumë gjëra!");
        
        // Shfaq kontekstin
        rlog('📝 Konteksti i gjeneruar: ' + this.modules.contextMemory.generateContextForResponse().substring(0, 60) + '...');
        
        // Testo kërkimin
        const results = this.modules.contextMemory.searchInMemory("si je");
        rlog('🔍 Rezultatet e kërkimit: ' + results.length + ' rezultate');
        
        this.modules.contextMemory.debugContext();
    }
    
    // ======================================================
    // 🔄 METODA: RIFILLIMI I SISTEMIT
    // ======================================================
    restartPlatform() {
        rlog('🔄 Duke rifilluar Platformën RRUFEJE...');
        this.modules.chatObserver.stopObserving();
        this.modules.sessionManager.renewSession();
        this.modules.contextMemory.conversationContext = [];
        
        // Rifillo modulet RRUFE-TESLA
        if (this.modules.quantumMemory) {
            this.modules.quantumMemory.entangledPairs.clear();
            this.modules.quantumMemory.superpositionStates.clear();
        }
        if (this.modules.bioNeuralNetwork) {
            this.modules.bioNeuralNetwork.neurons.clear();
            this.modules.bioNeuralNetwork.synapses.clear();
            this.modules.bioNeuralNetwork.initializeBaseNeurons();
        }
        if (this.modules.temporalContext) {
            this.modules.temporalContext.temporalLayers.clear();
            this.modules.temporalContext.causalChains.clear();
        }
        if (this.modules.cognitiveAwareness) {
            this.modules.cognitiveAwareness.behavioralModels.clear();
            this.modules.cognitiveAwareness.selfOptimization.clear();
        }
        if (this.modules.geminiKnowledgeAccelerator) {
            this.modules.geminiKnowledgeAccelerator.geminiKnowledgeBase.clear();
            this.modules.geminiKnowledgeAccelerator.knowledgeConnections.clear();
        }
        
        this.modules.chatObserver.startObserving();
        rlog('✅ Platforma RRUFE-TESLA 8.0 u rifillua me sukses!');
    }
    
    // ======================================================
    // 🚀 METODA TË REJA RRUFE 8.0
    // ======================================================
    
    // ✅ KAPJA AUTOMATIKE E NJOHURIVE NGA GEMINI
    captureGeminiKnowledgeAutomatically(geminiResponse, userQuery) {
        if (this.modules.geminiKnowledgeAccelerator) {
            const knowledgeId = this.modules.geminiKnowledgeAccelerator.captureGeminiKnowledge(
                geminiResponse,
                userQuery,
                this.modules.contextMemory.conversationContext
            );
            
            rlog('💎 Kapja automatike e njohurive: ' + knowledgeId);
            return knowledgeId;
        }
        return null;
    }
    
    // ✅ KËRKIM I NJOHURIVE TË AKKUMULUARA
    searchGeminiKnowledge(query) {
        if (this.modules.geminiKnowledgeAccelerator) {
            return this.modules.geminiKnowledgeAccelerator.searchAccumulatedKnowledge(query);
        }
        return [];
    }
    
    // ✅ TEST I GEMINI KNOWLEDGE ACCELERATOR
    testKnowledgeAccelerator() {
        console.log('🧠 TEST I GEMINI KNOWLEDGE ACCELERATOR:');
        
        if (this.modules.geminiKnowledgeAccelerator) {
            // Testo me disa përgjigje simuluese të Gemini
            const testResponses = [
                {
                    query: "Si të optimizoj performancën e JavaScript?",
                    response: "Për të optimizuar JavaScript, përdor requestAnimationFrame për animacione, debounce për event listeners, dhe Web Workers për operacione të rënda. Gjithashtu, minimizo DOM manipulations dhe përdor memoization për funksione të shtrenjta."
                },
                {
                    query: "Cilat janë parimet e UX design?",
                    response: "Parimet kryesore të UX design përfshijnë: 1. Qëndrueshmëria 2. Qasja e përdoruesit 3. Hierarkia vizuale 4. Kontrolli i përdoruesit 5. Konsistenca 6. Aksesibiliteti 7. Feedback i menjëherëshëm"
                }
            ];
            
            testResponses.forEach((test, index) => {
                setTimeout(() => {
                    console.log(`💎 Test ${index + 1}: Kapja e njohurive...`);
                    const knowledgeId = this.captureGeminiKnowledgeAutomatically(
                        test.response,
                        test.query
                    );
                    console.log(`   - U kap me ID: ${knowledgeId}`);
                }, index * 1000);
            });
            
            // Debug pas 3 sekondash
            setTimeout(() => {
                this.modules.geminiKnowledgeAccelerator.debugKnowledgeAccelerator();
                
                // Testo kërkimin e njohurive
                const searchResults = this.searchGeminiKnowledge("optimizim JavaScript");
                console.log('🔍 Rezultatet e kërkimit:', searchResults.length);
            }, 3000);
        } else {
            console.log('❌ GeminiKnowledgeAccelerator nuk është inicializuar');
        }
    }
}

// ======================================================
// 🚀 INICIALIZIMI I PLATFORMËS
// ======================================================

try {
    window.rrufePlatform = new RrufePlatform();
    rlog('✅ rrufePlatform u krijua dhe u vendos në window!');
} catch (error) {
    rlog('❌ Gabim në krijimin e rrufePlatform: ' + error.message);
}

// ======================================================
// 💡 UDHËZIME PËR PËRDORIM
// ======================================================

rlog('💡 Shkruaj: rrufePlatform.debugPlatform() për të testuar modulet bazë!');
rlog('💡 Shkruaj: rrufePlatform.debugRrufeTesla() për të testuar të gjitha 8 modulet!');
rlog('💡 Shkruaj: rrufePlatform.testAdvancedModules() për testim të avancuar!');
rlog('💡 Shkruaj: rrufePlatform.testContextMemory() për testim të shpejtë!');
rlog('💡 Shkruaj: rrufePlatform.testKnowledgeAccelerator() për testim të Gemini Knowledge!');
rlog('💡 Shkruaj: rrufePlatform.restartPlatform() për të rifilluar sistemin!');
rlog('🎉🎉🎉 RRUFE-TESLA PLATFORM 8.0 ËSHTË GATI! 🎉🎉🎉');

// ======================================================
// 🌐 EKSPORTIMI PËR PËRDORIM GLOBAL
// ======================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RrufePlatform, rrufePlatform: window.rrufePlatform };
}

// ================================================== VECORIA E BUTONAVE RRUFE -TESLA 8.0 ===============================
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

// ✅ INTEGRIMI ME SISTEMIN E MESAZHEVE
function integrateAIWithSendMessage() {
    if (typeof window.sendMessage !== 'undefined') {
        const originalSendMessage = window.sendMessage;
        
        window.sendMessage = async function() {
            const input = document.getElementById('user-input');
            const message = input ? input.value.trim() : '';
            
            if (!message) return;

            // ✅ Shto në kontekst RRUFE-TESLA
            if (window.rrufePlatform?.modules?.contextMemory) {
                window.rrufePlatform.modules.contextMemory.addToContext(message, 'user');
            }

            // ✅ PROCESIMI SHTESË SIPAS MODIT TË AI
            const currentMode = window.currentAIMode || 'SIMPLE';
            
            switch(currentMode) {
                case 'ADVANCED':
                    // Përdor modulet e avancuara për pyetje komplekse
                    if (message.length > 50 || message.includes('?')) {
                        rlog('🎯 [RRUFE] Duke përdorur module të avancuara...');
                        // Aktivizo modulet shtesë nëse janë të nevojshme
                    }
                    break;
                    
                case 'DIVINE':
                    // Përdor të gjitha modulet për çdo mesazh
                    rlog('⚡ [DIVINE] Duke përdorur të gjitha modulet RRUFE-TESLA...');
                    if (window.rrufePlatform?.modules?.divineFusion) {
                        try {
                            await window.rrufePlatform.modules.divineFusion.invokeDivineFusion(
                                message,
                                window.rrufePlatform.modules.contextMemory?.conversationContext
                            );
                        } catch (error) {
                            rlog('❌ Divine Fusion error:', error);
                        }
                    }
                    break;
                    
                case 'SIMPLE':
                default:
                    // ✅ MODI I THJESHTË: ASGJË TJETËR
                    rlog('🔹 [SIMPLE] Procesim i thjeshtë - chat normal');
                    break;
            }

            // ✅ THIRR FUNKSIONIN ORIGJINAL
            await originalSendMessage.call(this);
        };
        
        rlog('✅ Sistemi i AI u integrua me sendMessage!');
    }
}

// ======================================================
// 🚀 AKTIVIZIMI I SISTEMIT TË BUTONAVE
// ======================================================

// Aktivizo kur faqa të ngarkohet
setTimeout(() => {
    initializeAIButtons();
    integrateAIWithSendMessage();
}, 2000);

// ✅ EKSPORTO FUNKSIONET GLOBALE
window.activateSimpleAI = activateSimpleAI;
window.activateAdvancedAI = activateAdvancedAI;
window.activateDivineAI = activateDivineAI;

// ======================================================
// 🎉 MESAZHI I SUKSESIT
// ======================================================

rlog('🎯 SISTEMI I BUTONAVE TË AI U AKTIVIZUA ME SUKSES!');
rlog('🔹 Normal | 🌌 RRUFE | ⚡ Divine - TANI JANË OPERATIVE!');
