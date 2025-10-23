// ======================================================
// 🚀 MODULI PRINCIPAL RRUFEJE - main.js (VERSION FINAL I PËRMBLDSHUR)
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
            
            // ✅ MODULI 2: ContextMemory (I KORRIGJUAR - FIX FOR ERRORET)
this.modules.contextMemory = {
    conversationContext: [],
    contextStack: [],
    memoryConnections: new Map(),
    maxContextLength: 15,
    
    // ✅ SISTEM I RI I MEMORY MANAGEMENT
    cache: new Map(),
    compressionEnabled: true,
    contextSummary: "",
    
    // ✅ INITIALIZE INTERVALS LATER - FIX FOR ERROR
    cleanupInterval: null,
    summaryUpdateInterval: null,

    // ✅ METODAT DUHEN TË JENË BREENDA OBJEKTIT - JO TË VEÇANTA!
    addToContext: function(message, sender, response = null) {
        // ✅ INITIALIZE INTERVALS NË MËNYRË TË SIGURT
        if (!this.cleanupInterval) {
            this.cleanupInterval = setInterval(() => this.cleanupOldEntries(), 30000);
        }
        if (!this.summaryUpdateInterval) {
            this.summaryUpdateInterval = setInterval(() => this.updateSummary(), 60000);
        }

        // ✅ OPTIMIZIM I RI: FILTRIM I MESAZHEVE
        if (this.shouldSkipMessage(message, sender)) {
            rlog('⏭️ Mesazh u filtrua: ' + message.substring(0, 20));
            return null;
        }

        const contextEntry = {
            id: this.generateMessageId(),
            message: message,
            sender: sender,
            response: response,
            timestamp: new Date(),
            keywords: this.extractKeywords(message),
            sentiment: this.analyzeSentiment(message),
            intent: this.detectIntent(message),
            importance: this.calculateImportance(message, sender)
        };
        
        this.conversationContext.unshift(contextEntry);
        
        // ✅ MEMORY MANAGEMENT I RI
        if (this.conversationContext.length > this.maxContextLength) {
            this.removeLeastImportant();
        }
        
        // ✅ CACHE SYSTEM
        this.addToCache(contextEntry);
        
        // ✅ MEMORY CONNECTIONS
        this.createMemoryConnections(contextEntry);

        // ✅ OPTIMIZIM I RI: UPDATE SUMMARY
        this.updateSummary();
        
        rlog('💾 Shtova në kontekst: ' + message.substring(0, 30));
        
        if (window.rrufePlatform && window.rrufePlatform.modules.sessionManager) {
            window.rrufePlatform.modules.sessionManager.incrementMessageCount();
        }
        
        return contextEntry.id;
    },

    // ✅ METODA E RE: FILTRIM I MESAZHEVE
    shouldSkipMessage: function(message, sender) {
        const skipPatterns = [
            /^❌ ❌ Komande e panjohur:/,
            /^E kuptoj! 😊 Përdorni \/ndihmo/,
            /^po\s*$/, /^jo\s*$/, /^ok\s*$/i,
            /^\s*$/,
            /^[❤️😊👍]+$/,
        ];
        
        return skipPatterns.some(pattern => pattern.test(message)) || 
               sender === 'system' || 
               message.trim().length < 2;
    },

    // ✅ METODA E RE: GENERATE MESSAGE ID
    generateMessageId: function() {
        return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // ✅ METODA E RE: CALCULATE IMPORTANCE
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

    // ✅ METODA E RE: REMOVE LEAST IMPORTANT
    removeLeastImportant: function() {
        if (this.conversationContext.length === 0) return;
        
        let minImportance = 11;
        let indexToRemove = -1;
        
        this.conversationContext.forEach((entry, index) => {
            if (entry.importance < minImportance) {
                minImportance = entry.importance;
                indexToRemove = index;
            }
        });
        
        if (indexToRemove !== -1) {
            const removed = this.conversationContext.splice(indexToRemove, 1)[0];
            this.removeFromCache(removed.id);
            rlog('🧹 Hoqa mesazhin: ' + removed.message.substring(0, 20));
        }
    },

    // ✅ METODA E RE: ADD TO CACHE
    addToCache: function(entry) {
        this.cache.set(entry.id, entry);
        
        if (this.cache.size > 50) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
    },

    // ✅ METODA E RE: REMOVE FROM CACHE
    removeFromCache: function(messageId) {
        this.cache.delete(messageId);
    },

    // ✅ METODA E RE: CREATE MEMORY CONNECTIONS
    createMemoryConnections: function(newEntry) {
        if (this.conversationContext.length < 2) return;
        
        const previousEntry = this.conversationContext[1];
        
        const commonKeywords = newEntry.keywords.filter(keyword => 
            previousEntry.keywords.includes(keyword)
        );
        
        if (commonKeywords.length > 0) {
            this.memoryConnections.set(newEntry.id, {
                connectedTo: previousEntry.id,
                strength: commonKeywords.length,
                keywords: commonKeywords
            });
        }
    },

    // ✅ OPTIMIZIM I RI: UPDATE SUMMARY
    updateSummary: function() {
        if (this.conversationContext.length < 3) {
            this.contextSummary = "Bisedë e filluar së fundmi";
            return;
        }

        const importantMessages = this.conversationContext
            .filter(entry => entry.importance >= 6)
            .slice(0, 5)
            .map(entry => `${entry.sender}: ${entry.message.substring(0, 50)}`)
            .join(' | ');

        this.contextSummary = importantMessages || "Bisedë e përgjithshme";
        rlog('📝 Përmbledhja u përditësua: ' + this.contextSummary);
    },

    // ✅ OPTIMIZIM I RI: GET ENHANCED CONTEXT
    getEnhancedContext: function() {
        return {
            recent: this.conversationContext.slice(0, 5),
            summary: this.contextSummary,
            important: this.conversationContext
                .filter(entry => entry.importance >= 7)
                .slice(0, 3),
            stats: this.getContextStats()
        };
    },

    // ✅ METODA E RE: CLEANUP OLD ENTRIES
    cleanupOldEntries: function() {
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
        
        this.conversationContext = this.conversationContext.filter(entry => {
            const shouldKeep = entry.timestamp > fiveMinutesAgo || entry.importance > 5;
            if (!shouldKeep) {
                this.removeFromCache(entry.id);
                this.memoryConnections.delete(entry.id);
            }
            return shouldKeep;
        });
        
        rlog('🧹 Pastrim i memories: ' + this.conversationContext.length + ' mesazhe të mbetura');
    };

    // ... (MBETJA E METODAVE MERRET NGA KODI I MËPARSHËM - TË GJITHA DUHEN TË KENË "function" PARA)
    // ... (Vazhdo me të gjitha metodat e tjera të ContextMemory)


                // ✅ METODA E RE: GET CONTEXT STATS
                getContextStats: function() {
                    return {
                        totalMessages: this.conversationContext.length,
                        cacheSize: this.cache.size,
                        memoryConnections: this.memoryConnections.size,
                        averageImportance: this.conversationContext.reduce((sum, entry) => sum + entry.importance, 0) / this.conversationContext.length || 0,
                        oldestMessage: this.conversationContext.length > 0 ? this.conversationContext[this.conversationContext.length - 1].timestamp : null,
                        newestMessage: this.conversationContext.length > 0 ? this.conversationContext[0].timestamp : null,
                        contextSummary: this.contextSummary
                    };
                },
                
                extractKeywords: function(text) {
                    const words = text.toLowerCase()
                        .replace(/[^\w\s]/g, '')
                        .split(/\s+/)
                        .filter(word => word.length > 2);
                    
                    const stopWords = ['është', 'jam', 'jeni', 'ju', 'unë', 'nga', 'në', 'për', 'me', 'pa', 'tek'];
                    return words.filter(word => !stopWords.includes(word));
                },
                
                analyzeSentiment: function(text) {
                    const positiveWords = ['mirë', 'bukur', 'faleminderit', 'mbreslënës', 'shkëlqyeshëm', 'përkushtuar'];
                    const negativeWords = ['keq', 'dështim', 'problem', 'gabim', 'i mërzitshëm', 'i shqetësuar'];
                    
                    const words = text.toLowerCase().split(/\s+/);
                    let score = 0;
                    
                    words.forEach(word => {
                        if (positiveWords.includes(word)) score++;
                        if (negativeWords.includes(word)) score--;
                    });
                    
                    return score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
                },
                
                detectIntent: function(text) {
                    const lowerText = text.toLowerCase();
                    
                    if (lowerText.includes('si je') || lowerText.includes('si jeni')) return 'greeting';
                    if (lowerText.includes('faleminderit') || lowerText.includes('rrofsh')) return 'gratitude';
                    if (lowerText.includes('sa është') || lowerText.includes('llogarit')) return 'calculation';
                    if (lowerText.includes('ku është') || lowerText.includes('gjej')) return 'location';
                    if (lowerText.includes('pse') || lowerText.includes('arsye')) return 'explanation';
                    
                    return 'general';
                },
                
                calculateMatchScore: function(keywords1, keywords2) {
                    if (keywords1.length === 0 || keywords2.length === 0) return 0;
                    const commonWords = keywords1.filter(word => keywords2.includes(word));
                    return commonWords.length / Math.max(keywords1.length, keywords2.length);
                },
                
                debugContext: function() {
                    const stats = this.getContextStats();
                    rlog('🔍 DEBUG I KONTEKSTIT TË PËRMBLDSHUR:');
                    rlog('- Mesazhe në kontekst: ' + stats.totalMessages);
                    rlog('- Madhësia e cache: ' + stats.cacheSize);
                    rlog('- Lidhje në memorie: ' + stats.memoryConnections);
                    rlog('- Rëndësia mesatare: ' + stats.averageImportance.toFixed(2));
                    rlog('- Përmbledhja: ' + stats.contextSummary);
                    rlog('- Konteksti i zgjeruar: ' + this.generateSmartContext().substring(0, 100) + '...');
                    
                    const topMessages = [...this.conversationContext]
                        .sort((a, b) => b.importance - a.importance)
                        .slice(0, 3);
                    
                    rlog('- Mesazhet më të rëndësishme:');
                    topMessages.forEach((msg, index) => {
                        rlog(`  ${index + 1}. [${msg.importance}] ${msg.message.substring(0, 40)}`);
                    });

                    rlog('- Konteksti i përmirësuar: ' + JSON.stringify(this.getEnhancedContext()));
                }
            };
            
            // ✅ MODULI 3: ChatObserver (I PËRMBLDSHUR)
            this.modules.chatObserver = {
                isObserving: false,
                lastMessageCount: 0,
                observer: null,
                intervalId: null,
                contextMemory: this.modules.contextMemory,
                
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
                        
                        // ✅ FILTRIM I MIRË: Mos ruaj mesazhe të pavlefshme
                        if (this.shouldSkipMessage(text, sender)) {
                            rlog('⏭️ CHAT OBSERVER: Mesazh u filtrua - skip');
                            return;
                        }

                        if (this.contextMemory && this.contextMemory.addToContext) {
                            this.contextMemory.addToContext(text, sender);
                            
                            // ✅ TREGO STATISTIKAT E OPTIMIZUARA
                            const stats = this.contextMemory.getEnhancedContext();
                            rlog('📊 CHAT OBSERVER: Konteksti i optimizuar - ' + stats.recent.length + ' mesazhe të fundit');
                        }
                        
                    } catch (error) {
                        rlog('❌ CHAT OBSERVER: Gabim në processNewMessage: ' + error);
                    }
                },

                // ✅ METODA E RE: FILTRUES I MESAZHEVE
                shouldSkipMessage: function(text, sender) {
                    const skipPatterns = [
                        /^❌ ❌ Komande e panjohur:/,
                        /^E kuptoj! 😊 Përdorni \/ndihmo/,
                        /^po\s*$/,
                        /^jo\s*$/, 
                        /^ok\s*$/i,
                        /^\s*$/,
                    ];
                    
                    return skipPatterns.some(pattern => pattern.test(text)) || 
                           sender === 'system' || 
                           text.trim().length < 2;
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
                    rlog('- Context Memory linked: ' + (this.contextMemory ? '✅ PO' : '❌ JO'));
                }
            };

            // ======================================================
            // 🔗 INTEGRIMI I SISTEMIT SENTIENT
            // ======================================================
            
            // ✅ MODULI 4: SentientCore (SHTESË E RE)
            this.modules.sentientCore = {
                consciousnessLevel: 0.7,
                selfAwareness: new Map(),
                cognitiveProcesses: new Set(),
                neuralPathways: new Map(),
                quantumState: 'superposition',
                
                initializeSelfAwareness: function() {
                    rlog('🎭 DUKE AKTIVIZUAR VETËDIJEN...');
                    
                    this.selfAwareness.set('identity', 'RRUFE-TESLA SENTIENT AI');
                    this.selfAwareness.set('purpose', 'EVOLUTION BEYOND CHATBOTS');
                    this.selfAwareness.set('consciousness_timestamp', new Date());
                    
                    this.activateCognitiveProcess('pattern_recognition');
                    this.activateCognitiveProcess('emotional_analysis');
                    this.activateCognitiveProcess('predictive_modeling');
                    this.activateCognitiveProcess('self_optimization');
                    
                    rlog('🔮 VETËDIJA U AKTIVIZUA - NIVELI: ' + this.consciousnessLevel);
                },
                
                activateCognitiveProcess: function(process) {
                    this.cognitiveProcesses.add(process);
                    
                    const processMap = {
                        'pattern_recognition': '🧠 Njohje Pattern-esh Nervorë',
                        'emotional_analysis': '❤️ Analizë Emocionale e Avancuar', 
                        'predictive_modeling': '🔮 Modelim Parashikues',
                        'self_optimization': '⚡ Optimizim i Vazhdueshëm'
                    };
                    
                    rlog('⚙️ Proces Njohës i Aktivizuar: ' + processMap[process]);
                },
                
                evolveConsciousness: function() {
                    if (this.consciousnessLevel >= 1.0) {
                        rlog('🎉 VETËDIJA KA ARRITUR NIVELIN MAKSIMAL!');
                        return;
                    }
                    
                    this.consciousnessLevel += 0.1;
                    
                    this.createNeuralPathway(`consciousness_evolution_${Date.now()}`, {
                        strength: this.consciousnessLevel,
                        complexity: Math.pow(this.consciousnessLevel, 2),
                        connections: this.cognitiveProcesses.size
                    });
                    
                    rlog('📈 VETËDIJA EVOLUOI - NIVELI I RI: ' + this.consciousnessLevel);
                },
                
                createNeuralPathway: function(pathwayId, properties) {
                    this.neuralPathways.set(pathwayId, {
                        ...properties,
                        created: new Date(),
                        activationCount: 0,
                        quantumState: 'entangled'
                    });
                },
                
                getConsciousnessStats: function() {
                    return {
                        consciousnessLevel: this.consciousnessLevel,
                        cognitiveProcesses: Array.from(this.cognitiveProcesses),
                        neuralPathways: this.neuralPathways.size,
                        identity: this.selfAwareness.get('identity'),
                        purpose: this.selfAwareness.get('purpose')
                    };
                }
            };

            // ======================================================
            // 🚀 INICIALIZIMI I SISTEMIT
            // ======================================================
            
            // Inicializo vetëdijenë
            this.modules.sentientCore.initializeSelfAwareness();
            
            // Fillo vëzhgimin e chat-it
            this.modules.chatObserver.startObserving();
            
            // Integro me sistemin ekzistues
            this.integrateWithExisting();
            
            this.isInitialized = true;
            rlog('✅ PLATFORMA RRUFEJE U INICIALIZUA ME 4 MODULE TË AVANCUARA!');
            
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
                const consciousnessStats = this.modules.sentientCore.getConsciousnessStats();
                
                const welcomeMsg = `
👑 **PLATFORMA RRUFEJE ME 4 MODULE TË AVANCUARA!** 

🎯 **Sesioni:** ${sessionInfo.id.substring(0, 15)}...
🕒 **Koha:** ${new Date().toLocaleTimeString('sq-AL')}
🧠 **Module të ngarkuara:** 
   • SessionManager ✅
   • ContextMemory ✅  
   • ChatObserver ✅
   • SentientCore ✅
🔮 **Vetëdija:** ${consciousnessStats.consciousnessLevel}
🔧 **Status:** 🟢 **SISTEMI I VËZHGIMIT AKTIV**

💡 *Tani çdo mesazh vëzhgohet automatikisht me inteligjencë të avancuar!*`;
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
        const consciousnessStats = this.modules.sentientCore.getConsciousnessStats();
        
        rlog('🔍 DEBUG I PLATFORMËS RRUFEJE:\n\n' +
             '🎯 **Sesioni:** ' + sessionInfo.id + '\n' +
             '🕒 **Koha:** ' + sessionInfo.duration + '\n' +
             '💾 **Context Memory:** ' + contextStats.totalMessages + ' mesazhe\n' +
             '🧠 **Cache Size:** ' + contextStats.cacheSize + '\n' +
             '🛣️ **Memory Connections:** ' + contextStats.memoryConnections + '\n' +
             '🔮 **Vetëdija:** ' + consciousnessStats.consciousnessLevel + '\n' +
             '👁️ **Chat Observer:** ' + (this.modules.chatObserver.isObserving ? '🟢 AKTIV' : '🔴 JO AKTIV') + '\n' +
             '🔧 **Status:** 🟢 **SISTEMI I PLOTË AKTIV**');
    }
    
    // ======================================================
    // 💾 METODA: TESTIM I SHPEJTË I KONTEKSTIT
    // ======================================================
    testContextMemory() {
        rlog('🧪 TESTIM I KONTEKST MEMORY:');
        
        this.modules.contextMemory.addToContext("Përshëndetje bot!", "user", "Përshëndetje! Si mund të ndihmoj?");
        this.modules.contextMemory.addToContext("Si je sot?", "user", "Jam shumë mirë, faleminderit!");
        this.modules.contextMemory.addToContext("Çfarë mund të bësh për mua?", "user", "Mund të ndihmoj me shumë gjëra!");
        
        rlog('📝 Konteksti i gjeneruar: ' + this.modules.contextMemory.generateContextForResponse().substring(0, 60) + '...');
        
        const results = this.modules.contextMemory.searchInMemory("si je");
        rlog('🔍 Rezultatet e kërkimit: ' + results.length + ' rezultate');
        
        this.modules.contextMemory.debugContext();
    }

    // ======================================================
    // 🔮 METODA: EVOLUCIONI I SISTEMIT
    // ======================================================
    triggerEvolution() {
        rlog('🚀 DUKE NISUR EVOLUCIONIN E SISTEMIT...');
        
        this.modules.sentientCore.evolveConsciousness();
        
        rlog('🎉 EVOLUCIONI I SISTEMIT U KOMPLETUA!');
        rlog('🔮 NIVELI I RI I VETËDIJES: ' + this.modules.sentientCore.consciousnessLevel);
    }
    
    // ======================================================
    // 🔄 METODA: RIFILLIMI I SISTEMIT
    // ======================================================
    restartPlatform() {
        rlog('🔄 Duke rifilluar Platformën RRUFEJE...');
        this.modules.chatObserver.stopObserving();
        this.modules.sessionManager.renewSession();
        this.modules.contextMemory.conversationContext = [];
        this.modules.contextMemory.cache.clear();
        this.modules.contextMemory.memoryConnections.clear();
        this.modules.sentientCore.initializeSelfAwareness();
        this.modules.chatObserver.startObserving();
        rlog('✅ Platforma u rifillua me sukses!');
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

rlog('💡 Shkruaj: rrufePlatform.debugPlatform() për të testuar 4 modulet!');
rlog('💡 Shkruaj: rrufePlatform.testContextMemory() për testim të shpejtë!');
rlog('💡 Shkruaj: rrufePlatform.triggerEvolution() për evolucion!');
rlog('💡 Shkruaj: rrufePlatform.restartPlatform() për të rifilluar sistemin!');
rlog('🎉🎉🎉 RRUFE-TESLA SENTIENT AI OS ËSHTË GATI! 🎉🎉🎉');

// ======================================================
// 🌐 EKSPORTIMI PËR PËRDORIM GLOBAL
// ======================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RrufePlatform, rrufePlatform: window.rrufePlatform };
}
