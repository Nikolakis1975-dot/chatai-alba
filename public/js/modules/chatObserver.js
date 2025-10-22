// ======================= RRUFE-MODULE-003 =======================
// 🧠 MODULI: ChatObserver (Client)
// 📍 VENDOSJA: /public/js/modules/chatObserver.js
// 🔧 DETYRA: Vëzhgim i çdo mesazhi pa ndërhyrë në sistemin ekzistues
// 🎯 INTEGRIM: Observon chat-in pa modifikuar kodin ekzistues
// ================================================================

class ChatObserver {
    constructor(contextMemory) {
        // =============================== ✅ LINJA KRITIKE E SHTUAR ===============================
        this.contextMemory = contextMemory;
        
        this.isObserving = false;
        this.observer = null;
        this.lastMessageCount = 0;
        console.log('🎯 CHAT OBSERVER: Sistemi u ngarkua');
    }

    // =====================✅ START OBSERVING - NUK NDAIH NË FUNKSIONIMIN EKZISTUES ==========================
    startObserving() {
        if (this.isObserving) {
            console.log('🔍 CHAT OBSERVER: Tashmë është duke vëzhguar');
            return;
        }

        console.log('🎯 CHAT OBSERVER: Duke filluar vëzhgimin...');

        // ✅ STRATEGJIA 1: OBSERVER API (MODERNE)
        this.setupMutationObserver();
        
        // ✅ STRATEGJIA 2: INTERVAL CHECK (FALLBACK)
        this.setupIntervalObserver();
        
        // ✅ STRATEGJIA 3: EVENT LISTENERS (DIRECT)
        this.setupEventListeners();

        this.isObserving = true;
        console.log('✅ CHAT OBSERVER: Vëzhgimi filloi me sukses!');
    }

    // ============================== ✅ STRATEGJIA 1: MUTATION OBSERVER (MË E MIRA) ===========================
    setupMutationObserver() {
        const chatContainer = document.getElementById('chat');
        if (!chatContainer) {
            console.log('⏳ CHAT OBSERVER: Chat container nuk u gjet, provoj përsëri...');
            setTimeout(() => this.setupMutationObserver(), 1000);
            return;
        }

        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.classList.contains('message')) {
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

        console.log('🔍 CHAT OBSERVER: Mutation Observer u aktivizua');
    }

    // ✅ STRATEGJIA 2: INTERVAL CHECK (FALLBACK)
    setupIntervalObserver() {
        this.intervalId = setInterval(() => {
            const messages = document.querySelectorAll('.message');
            if (messages.length > this.lastMessageCount) {
                const newMessages = Array.from(messages).slice(this.lastMessageCount);
                newMessages.forEach(message => this.processNewMessage(message));
                this.lastMessageCount = messages.length;
            }
        }, 500);
    }

    // ======================================= ✅ STRATEGJIA 3: EVENT LISTENERS ========================================
    setupEventListeners() {
        // Monitoro butonin send
        const sendButton = document.querySelector('#send-button, button[onclick*="send"]');
        if (sendButton) {
            sendButton.addEventListener('click', () => {
                setTimeout(() => this.captureUserMessage(), 100);
            });
        }

        // Monitoro input enter
        const userInput = document.getElementById('user-input');
        if (userInput) {
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    setTimeout(() => this.captureUserMessage(), 100);
                }
            });
        }
    }

    // ✅ PROCESO MESAZHIN E RI
    processNewMessage(messageElement) {
        try {
            const messageContent = messageElement.querySelector('.message-content');
            if (!messageContent) return;

            const text = messageContent.textContent || messageContent.innerText;
            const sender = messageElement.classList.contains('user-message') ? 'user' : 
                          messageElement.classList.contains('bot-message') ? 'bot' : 'system';

            // ✅ MOS RUAJ MESAZHE SISTEMI OSE TË ZBRAZËTA
            if (sender === 'system' || !text.trim()) return;

            console.log('🔍 CHAT OBSERVER: Kapur mesazh:', sender, text.substring(0, 50));

            // ✅ RUAJ NË KONTEKST
            if (this.contextMemory && this.contextMemory.addToContext) {
                this.contextMemory.addToContext(text, sender);
            } else {
                console.log('❌ CHAT OBSERVER: ContextMemory nuk është i disponueshëm');
            }

        } catch (error) {
            console.log('🔧 CHAT OBSERVER: Gabim në procesim:', error);
        }
    }

    // ✅ KAP MESAZHIN E PËRDORUESIT PARAPRAKISHT
    captureUserMessage() {
        const userInput = document.getElementById('user-input');
        if (userInput && userInput.value.trim()) {
            // Këtu mund të bësh diçka me mesazhin e përdoruesit para se të dërgohet
            console.log('🔍 CHAT OBSERVER: Përgatitem për mesazh:', userInput.value.substring(0, 30));
        }
    }

    // ✅ NDALO VËZHGIMIN
    stopObserving() {
        if (this.observer) {
            this.observer.disconnect();
        }
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.isObserving = false;
        console.log('🛑 CHAT OBSERVER: Vëzhgimi u ndal');
    }

    // ✅ METODA DEBUG
    debugObserver() {
        console.log('🔍 DEBUG CHAT OBSERVER:');
        console.log('- Është duke vëzhguar:', this.isObserving);
        console.log('- Mesazhe të kapura:', this.lastMessageCount);
        console.log('- Observer aktiv:', this.observer ? '✅ PO' : '❌ JO');
        console.log('- Interval aktiv:', this.intervalId ? '✅ PO' : '❌ JO');
        console.log('- ContextMemory i disponueshëm:', this.contextMemory ? '✅ PO' : '❌ JO');
    }
}

export default ChatObserver;
