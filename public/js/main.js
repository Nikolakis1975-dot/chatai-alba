// ======================================================
// 🚀 MODULI PRINCIPAL RRUFEJE - main.js (VERSION RRUFE-TESLA)
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
            // 🚀 INICIALIZIMI I SISTEMIT
            // ======================================================
            
            // Fillo vëzhgimin e chat-it
            this.modules.chatObserver.startObserving();
            
            // Integro me sistemin ekzistues
            this.integrateWithExisting();
            
            this.isInitialized = true;
            rlog('✅ PLATFORMA RRUFEJE U INICIALIZUA ME 6 MODULE!');
            
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
👑 **PLATFORMA RRUFEJE ME 6 MODULE TË AVANCUARA!** 

🎯 **Sesioni:** ${sessionInfo.id.substring(0, 15)}...
🕒 **Koha:** ${new Date().toLocaleTimeString('sq-AL')}
🧠 **Module të ngarkuara:** 
   • SessionManager ✅
   • ContextMemory ✅  
   • ChatObserver ✅
   • QuantumMemory ${this.modules.quantumMemory ? '✅' : '❌'}
   • BioNeuralNetwork ${this.modules.bioNeuralNetwork ? '✅' : '❌'} 
   • TemporalContext ${this.modules.temporalContext ? '✅' : '❌'}
🔧 **Status:** 🟢 **SISTEMI RRUFE-TESLA AKTIV**

💡 *Tani çdo mesazh procesohet me inteligjencë kuantike dhe nervore!*`;
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
    // 🌟 METODA E RE: RRUFE-TESLA DEBUG
    // ======================================================
    
    debugRrufeTesla() {
        console.log('🚀 DEBUG RRUFE-TESLA PLATFORM:');
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
        
        // Statistikat e kontekstit
        if (this.modules.contextMemory) {
            const stats = this.modules.contextMemory.getContextStats();
            console.log('📊 STATISTIKA:');
            console.log('- Mesazhe totale:', stats.totalMessages);
            console.log('- Rëndësia mesatare:', stats.averageImportance.toFixed(2));
        }
        
        console.log('🎯 STATUS: RRUFE-TESLA PLATFORM ' + 
                   (this.modules.quantumMemory && this.modules.bioNeuralNetwork && this.modules.temporalContext ? 
                    '🟢 OPERATIONAL' : '🟡 PARTIAL'));
    }
    
    // ======================================================
    // 🔬 METODA TË REJA PËR TESTIM
    // ======================================================
    
    testAdvancedModules() {
        console.log('🧪 TESTIM I MODULEVE TË AVANCUARA RRUFE-TESLA:');
        
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
        
        this.modules.chatObserver.startObserving();
        rlog('✅ Platforma RRUFE-TESLA u rifillua me sukses!');
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
rlog('💡 Shkruaj: rrufePlatform.debugRrufeTesla() për të testuar të gjitha modulet!');
rlog('💡 Shkruaj: rrufePlatform.testAdvancedModules() për testim të avancuar!');
rlog('💡 Shkruaj: rrufePlatform.testContextMemory() për testim të shpejtë!');
rlog('💡 Shkruaj: rrufePlatform.restartPlatform() për të rifilluar sistemin!');
rlog('🎉🎉🎉 RRUFE-TESLA PLATFORM ËSHTË GATI! 🎉🎉🎉');

// ======================================================
// 🌐 EKSPORTIMI PËR PËRDORIM GLOBAL
// ======================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RrufePlatform, rrufePlatform: window.rrufePlatform };
}
