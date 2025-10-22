// ======================= RRUFE-MODULE-003 =======================
// 🧠 MODULI: ChatObserver (Client) - VERSION TEST I THJESHTË
// ================================================================

class ChatObserver {
    constructor(contextMemory) {
        console.log('🎯 CHAT OBSERVER TEST: Konstruktori u thirr!');
        console.log('🔍 ContextMemory në konstruktor:', contextMemory ? '✅ EKZISTON' : '❌ MUNGON');
        
        // Test: Shko direkt në window object
        this.contextMemory = contextMemory || (window.rrufePlatform && window.rrufePlatform.modules && window.rrufePlatform.modules.contextMemory);
        console.log('🔍 ContextMemory pas caktimit:', this.contextMemory ? '✅ EKZISTON' : '❌ MUNGON');
        
        this.isObserving = false;
        this.observer = null;
        this.lastMessageCount = 0;
    }

    startObserving() {
        console.log('🎯 CHAT OBSERVER TEST: StartObserving u thirr!');
        
        if (this.isObserving) {
            console.log('🔍 Tashmë po vëzhgoj');
            return;
        }

        // Test: Kontrollo përsëri contextMemory
        if (!this.contextMemory) {
            this.contextMemory = window.rrufePlatform?.modules?.contextMemory;
            console.log('🔍 ContextMemory në startObserving:', this.contextMemory ? '✅ EKZISTON' : '❌ MUNGON');
        }

        // STRATEGJIA 1: Mutation Observer
        this.setupMutationObserver();
        
        // STRATEGJIA 2: Interval Check
        this.setupIntervalObserver();
        
        this.isObserving = true;
        console.log('✅ CHAT OBSERVER TEST: Vëzhgimi filloi!');
    }

    setupMutationObserver() {
        console.log('🔍 TEST: Duke u përpjekur të gjej chat container...');
        const chatContainer = document.getElementById('chat');
        
        if (!chatContainer) {
            console.log('❌ TEST: Chat container nuk u gjet');
            setTimeout(() => this.setupMutationObserver(), 1000);
            return;
        }

        console.log('✅ TEST: Chat container u gjet!');
        
        this.observer = new MutationObserver((mutations) => {
            console.log('🔍 TEST: Mutation u kap! Numri i mutations:', mutations.length);
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.classList.contains('message')) {
                            console.log('🎯 TEST: Mesazh i ri u gjet!');
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

        console.log('✅ TEST: Mutation Observer u aktivizua!');
    }

    setupIntervalObserver() {
        console.log('🔍 TEST: Interval Observer u aktivizua!');
        
        this.intervalId = setInterval(() => {
            const messages = document.querySelectorAll('.message');
            if (messages.length > this.lastMessageCount) {
                console.log('🎯 TEST: Mesazhe të reja nga interval:', messages.length - this.lastMessageCount);
                const newMessages = Array.from(messages).slice(this.lastMessageCount);
                newMessages.forEach(message => this.processNewMessage(message));
                this.lastMessageCount = messages.length;
            }
        }, 1000);
    }

   processNewMessage(messageElement) {
    console.log('🔍 TEST: ProcessNewMessage u thirr!');
    
    try {
        // ✅ STRUKTURA E THJESHTË - TEKSTI ËSHTË DIREKT NË ELEMENT
        const text = messageElement.textContent || messageElement.innerText || '';
        console.log('🔍 TEST: Teksti i gjetur:', text.substring(0, 50));

        // ✅ GJENI SENDER-IN NGA KLASAT
        let sender = 'unknown';
        if (messageElement.classList.contains('user-message')) sender = 'user';
        else if (messageElement.classList.contains('bot-message')) sender = 'bot'; 
        else if (messageElement.classList.contains('system-message')) sender = 'system';
        
        console.log('🔍 TEST: Sender i gjetur:', sender);

        // ✅ MOS RUAJ MESAZHE SISTEMI OSE TË ZBRAZËTA
        if (sender === 'system' || !text.trim()) {
            console.log('⏭️ TEST: Mesazh sistem ose bosh - skip');
            return;
        }

        // ✅ SHTO NË KONTEKST
        if (this.contextMemory && this.contextMemory.addToContext) {
            console.log('💾 TEST: Duke shtuar në kontekst...');
            this.contextMemory.addToContext(text, sender);
            console.log('✅ TEST: Mesazh u shtua në kontekst!');
            
            // ✅ KONTROLLO NËSE PO RRIET NUMRI I MESAZHEVE
            console.log('📊 Mesazhe në kontekst:', this.contextMemory.conversationContext.length);
        } else {
            console.log('❌ TEST: ContextMemory nuk është i disponueshëm!');
        }

    } catch (error) {
        console.log('❌ TEST: Gabim në processNewMessage:', error);
    }
}

    debugObserver() {
        console.log('🔍 DEBUG TEST CHAT OBSERVER:');
        console.log('- Është duke vëzhguar:', this.isObserving);
        console.log('- Mesazhe të kapura:', this.lastMessageCount);
        console.log('- ContextMemory:', this.contextMemory ? '✅ EKZISTON' : '❌ MUNGON');
        console.log('- Observer aktiv:', this.observer ? '✅ PO' : '❌ JO');
    }
}

// ======================= ✅ EKSPORTIMI I THJESHTË =======================
// 📍 VENDOSJE: NË FUND TË SKEDARIT
// 🔧 FUNKSIONI: E bën klasën të disponueshme për import
// ========================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatObserver;
} else {
    window.ChatObserver = ChatObserver;
}
