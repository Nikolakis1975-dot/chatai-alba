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
            const messageContent = messageElement.querySelector('.message-content');
            if (!messageContent) {
                console.log('❌ TEST: Nuk ka message content');
                return;
            }

            const text = messageContent.textContent || messageContent.innerText;
            const sender = messageElement.classList.contains('user-message') ? 'user' : 
                          messageElement.classList.contains('bot-message') ? 'bot' : 'system';

            console.log('🔍 TEST: Kapur mesazh - Sender:', sender, 'Text:', text.substring(0, 30));

            // MOS RUAJ MESAZHE SISTEMI
            if (sender === 'system' || !text.trim()) {
                console.log('⏭️ TEST: Mesazh sistem - skip');
                return;
            }

            // TEST: Provo të shtosh në kontekst
            if (this.contextMemory && this.contextMemory.addToContext) {
                console.log('💾 TEST: Duke shtuar në kontekst...');
                this.contextMemory.addToContext(text, sender);
                console.log('✅ TEST: Mesazh u shtua në kontekst!');
            } else {
                console.log('❌ TEST: ContextMemory nuk është i disponueshëm për të shtuar mesazh!');
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

// ✅ EKSPORTIMI I THJESHTË
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatObserver;
} else {
    window.ChatObserver = ChatObserver;
}
