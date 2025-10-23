// ======================================================
// 🚀 MODULI PRINCIPAL RRUFEJE - main.js (VERSION FINAL)
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
            this.modules.session = {
                sessionId: 'rrufe_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                sessionStart: new Date(),
                messageCount: 0,
                
                getSessionInfo: function() {
                    const duration = Math.floor((new Date() - this.sessionStart) / 1000);
                    const minutes = Math.floor(duration / 60);
                    const seconds = duration % 60;
                    return {
                        id: this.sessionId,
                        start: this.sessionStart,
                        duration: (minutes > 0 ? minutes + 'm ' : '') + seconds + 's',
                        messageCount: this.messageCount
                    };
                },
                
                incrementMessageCount: function() {
                    this.messageCount++;
                },
                
                renewSession: function() {
                    this.sessionId = 'rrufe_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                    this.sessionStart = new Date();
                    this.messageCount = 0;
                    return this.sessionId;
                }
            };
            
            // ✅ MODULI 2: ContextMemory
            this.modules.contextMemory = {
                conversationContext: [],
                maxContextLength: 10,
                
                addToContext: function(message, sender, response = null) {
                    const contextEntry = {
                        message: message,
                        sender: sender,
                        response: response,
                        timestamp: new Date(),
                        keywords: this.extractKeywords(message)
                    };
                    
                    // Shto në fillim të array (mesazhet e reja së pari)
                    this.conversationContext.unshift(contextEntry);
                    
                    // Mbaj vetëm mesazhet e fundit
                    if (this.conversationContext.length > this.maxContextLength) {
                        this.conversationContext = this.conversationContext.slice(0, this.maxContextLength);
                    }
                    
                    rlog('💾 Shtova në kontekst: ' + message.substring(0, 30));
                    
                    // Increment message count
                    if (window.rrufePlatform && window.rrufePlatform.modules.session) {
                        window.rrufePlatform.modules.session.incrementMessageCount();
                    }
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
                
                debugContext: function() {
                    rlog('🔍 DEBUG KONTEKSTI: ' + this.conversationContext.length + ' mesazhe');
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
                    
                    // ✅ STRATEGJIA 1: MUTATION OBSERVER
                    this.setupMutationObserver();
                    
                    // ✅ STRATEGJIA 2: INTERVAL CHECK (FALLBACK)
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
                                    if (node.nodeType === 1 && node.classList && node.classList.contains('message')) {
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
                        const messages = document.querySelectorAll('.message');
                        if (messages.length > this.lastMessageCount) {
                            const newMessages = Array.from(messages).slice(this.lastMessageCount);
                            newMessages.forEach(message => this.processNewMessage(message));
                            this.lastMessageCount = messages.length;
                        }
                    }, 1000);
                },
                
                processNewMessage: function(messageElement) {
                    try {
                        const messageContent = messageElement.querySelector('.message-content');
                        if (!messageContent) return;
                        
                        const text = messageContent.textContent || messageContent.innerText;
                        const sender = messageElement.classList.contains('user-message') ? 'user' : 
                                      messageElement.classList.contains('bot-message') ? 'bot' : 'system';
                        
                        // Mos ruaj mesazhe sistemi ose të zbrazëta
                        if (sender === 'system' || !text.trim()) return;
                        
                        rlog('🔍 CHAT OBSERVER: Kapur mesazh - ' + sender + ': ' + text.substring(0, 50));
                        
                        // Ruaj në kontekst
                        if (window.rrufePlatform && window.rrufePlatform.modules.contextMemory) {
                            window.rrufePlatform.modules.contextMemory.addToContext(text, sender);
                        }
                        
                    } catch (error) {
                        rlog('🔧 CHAT OBSERVER: Gabim në procesim');
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
            // 🚀 INICIALIZIMI I SISTEMIT
            // ======================================================
            
            // Fillo vëzhgimin e chat-it
            this.modules.chatObserver.startObserving();
            
            this.isInitialized = true;
            rlog('✅ PLATFORMA RRUFEJE U INICIALIZUA ME 3 MODULE!');
            
            // Shfaq mesazhin e mirëseardhjes
            this.showWelcomeMessage();
            
        } catch (error) {
            rlog('❌ Gabim në inicializim: ' + error.message);
        }
    }
    
    // ======================================================
    // 💬 METODA: SHFAQJA E MIRËSEARDHJES
    // ======================================================
    showWelcomeMessage() {
        setTimeout(() => {
            if (typeof window.addMessage !== 'undefined' && this.modules.session) {
                const sessionInfo = this.modules.session.getSessionInfo();
                const welcomeMsg = `
👑 **PLATFORMA RRUFEJE ME 3 MODULE TË REJA!** 

🎯 **Sesioni:** ${sessionInfo.id.substring(0, 15)}...
🕒 **Koha:** ${new Date().toLocaleTimeString('sq-AL')}
🧠 **Module të ngarkuara:** 
   • SessionManager ✅
   • ContextMemory ✅  
   • ChatObserver ✅
🔧 **Status:** 🟢 **SISTEMI I VËZHGIMIT AKTIV**

💡 *Tani çdo mesazh vëzhgohet automatikisht!*`;
                window.addMessage(welcomeMsg, 'system', false);
            }
        }, 2000);
    }
    
    // ======================================================
    // 🛠️ METODA: DEBUG DHE TESTIM
    // ======================================================
    debugPlatform() {
        const sessionInfo = this.modules.session.getSessionInfo();
        rlog('🔍 DEBUG I PLATFORMËS RRUFEJE:\n\n' +
             '🎯 **Sesioni:** ' + sessionInfo.id + '\n' +
             '🕒 **Koha:** ' + sessionInfo.duration + '\n' +
             '💾 **Context Memory:** ' + this.modules.contextMemory.conversationContext.length + ' mesazhe\n' +
             '👁️ **Chat Observer:** ' + (this.modules.chatObserver.isObserving ? '🟢 AKTIV' : '🔴 JO AKTIV') + '\n' +
             '🔧 **Status:** 🟢 **SISTEMI I PLOTË AKTIV**');
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
        this.modules.session.renewSession();
        this.modules.contextMemory.conversationContext = [];
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

rlog('💡 Shkruaj: rrufePlatform.debugPlatform() për të testuar 3 modulet!');
rlog('💡 Shkruaj: rrufePlatform.testContextMemory() për testim të shpejtë!');
rlog('💡 Shkruaj: rrufePlatform.restartPlatform() për të rifilluar sistemin!');
rlog('🎉🎉🎉 RRUFE PLATFORM ËSHTË GATI PËR PËRDORIM! 🎉🎉🎉');

// ======================================================
// 🌐 EKSPORTIMI PËR PËRDORIM GLOBAL
// ======================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RrufePlatform, rrufePlatform: window.rrufePlatform };
}
