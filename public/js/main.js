// ======================================================
// 🚀 MODULI RRUFEJE - VERSION FINAL
// ======================================================

console.log('🎯🎯🎯 MODULI RRUFEJE U NGARKUA ME SUKSES! 🎯🎯🎯');

class RrufePlatform {
    constructor() {
        console.log('🚀🚀🚀 RrufePlatform u krijua! 🚀🚀🚀');
        this.modules = {};
        this.isInitialized = false;
        this.init();
    }
    
    async init() {
        try {
            console.log('🔧 Duke inicializuar Platformën RRUFEJE...');
            
            // Krijo modulet bazë
            this.modules.session = {
                sessionId: 'rrufe_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                sessionStart: new Date(),
                messageCount: 0,
                getSessionInfo: function() {
                    const duration = Math.floor((new Date() - this.sessionStart) / 1000);
                    return {
                        id: this.sessionId,
                        start: this.sessionStart,
                        duration: duration + 's',
                        messageCount: this.messageCount
                    };
                },
                incrementMessageCount: function() {
                    this.messageCount++;
                }
            };
            
            this.modules.contextMemory = {
                conversationContext: [],
                maxContextLength: 10,
                
                addToContext: function(message, sender) {
                    const contextEntry = {
                        message: message,
                        sender: sender,
                        timestamp: new Date()
                    };
                    
                    this.conversationContext.unshift(contextEntry);
                    
                    if (this.conversationContext.length > this.maxContextLength) {
                        this.conversationContext = this.conversationContext.slice(0, this.maxContextLength);
                    }
                    
                    console.log('💾 Shtova në kontekst:', message.substring(0, 30));
                    
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
                
                debugContext: function() {
                    console.log('🔍 DEBUG I KONTEKSTIT:');
                    console.log('- Mesazhe në kontekst:', this.conversationContext.length);
                    console.log('- Konteksti i fundit:', this.generateContextForResponse());
                },
                
                searchInMemory: function(query) {
                    console.log('🔍 Kërkim në memorie për:', query);
                    return this.conversationContext.filter(entry => 
                        entry.message.toLowerCase().includes(query.toLowerCase())
                    ).slice(0, 3);
                }
            };
            
            this.modules.chatObserver = {
                isObserving: false,
                lastMessageCount: 0,
                
                startObserving: function() {
                    console.log('🎯 CHAT OBSERVER: Duke filluar vëzhgimin...');
                    this.isObserving = true;
                    
                    // Setup interval observer
                    this.intervalId = setInterval(() => {
                        const messages = document.querySelectorAll('.message');
                        if (messages.length > this.lastMessageCount) {
                            const newMessages = Array.from(messages).slice(this.lastMessageCount);
                            newMessages.forEach(message => this.processNewMessage(message));
                            this.lastMessageCount = messages.length;
                        }
                    }, 1000);
                    
                    console.log('✅ CHAT OBSERVER: Vëzhgimi filloi!');
                },
                
                processNewMessage: function(messageElement) {
                    try {
                        const messageContent = messageElement.querySelector('.message-content');
                        if (!messageContent) return;

                        const text = messageContent.textContent || messageContent.innerText;
                        const sender = messageElement.classList.contains('user-message') ? 'user' : 
                                      messageElement.classList.contains('bot-message') ? 'bot' : 'system';

                        if (sender === 'system' || !text.trim()) return;

                        console.log('🔍 CHAT OBSERVER: Kapur mesazh:', sender, text.substring(0, 50));

                        // Ruaj në kontekst
                        if (window.rrufePlatform && window.rrufePlatform.modules.contextMemory) {
                            window.rrufePlatform.modules.contextMemory.addToContext(text, sender);
                        }

                    } catch (error) {
                        console.log('🔧 CHAT OBSERVER: Gabim në procesim:', error);
                    }
                },
                
                debugObserver: function() {
                    console.log('🔍 DEBUG CHAT OBSERVER:');
                    console.log('- Është duke vëzhguar:', this.isObserving);
                    console.log('- Mesazhe të kapura:', this.lastMessageCount);
                }
            };
            
            // Fillo vëzhgimin
            this.modules.chatObserver.startObserving();
            
            this.isInitialized = true;
            console.log('✅✅✅ PLATFORMA RRUFEJE U INICIALIZUA ME 3 MODULE! ✅✅✅');
            
            // Shfaq mesazhin e mirëseardhjes
            this.showWelcomeMessage();
            
        } catch (error) {
            console.error('❌ Gabim në inicializim:', error);
        }
    }
    
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
    
    debugPlatform() {
        console.log('🔍 DEBUG I PLATFORMËS RRUFEJE:');
        console.log('- Inicializuar:', this.isInitialized);
        console.log('- Modulet:', Object.keys(this.modules));
        
        if (this.modules.session) {
            console.log('- Sesioni:', this.modules.session.getSessionInfo());
        }
        
        if (this.modules.contextMemory) {
            console.log('- Context Memory:', this.modules.contextMemory.conversationContext.length + ' mesazhe');
        }
        
        if (this.modules.chatObserver) {
            console.log('- Chat Observer:', '✅ AKTIV');
        }
        
        // Debug të gjitha modulet
        if (this.modules.contextMemory) this.modules.contextMemory.debugContext();
        if (this.modules.chatObserver) this.modules.chatObserver.debugObserver();
    }
    
    testContextMemory() {
        console.log('🧪 TESTIM I KONTEKST MEMORY:');
        
        // Shto disa mesazhe testuese
        this.modules.contextMemory.addToContext("Përshëndetje bot!", "user");
        this.modules.contextMemory.addToContext("Si je sot?", "user");
        this.modules.contextMemory.addToContext("Çfarë mund të bësh për mua?", "user");
        
        // Shfaq kontekstin
        console.log('📝 Konteksti i gjeneruar:', this.modules.contextMemory.generateContextForResponse());
        
        // Testo kërkimin
        const results = this.modules.contextMemory.searchInMemory("si je");
        console.log('🔍 Rezultatet e kërkimit:', results);
        
        this.modules.contextMemory.debugContext();
    }
}

// ✅ KRIJO INSTANCËN GLOBALE
window.rrufePlatform = new RrufePlatform();

console.log('💡 Shkruaj: rrufePlatform.debugPlatform() për të testuar 3 modulet!');
console.log('💡 Shkruaj: rrufePlatform.testContextMemory() për testim të shpejtë!');
console.log('🎉🎉🎉 RRUFE PLATFORM ËSHTË GATI PËR PËRDORIM! 🎉🎉🎉');
