// public/js/live-chat.js - SISTEMI I MESAZHEVE TË GJALLA
console.log('🎬 RRUFE-TESLA: Duke ngarkuar sistemin e mesazheve të gjalla...');

class LiveChatSystem {
    constructor() {
        this.isTyping = false;
        this.messageQueue = [];
        this.isProcessing = false;
        this.initialize();
    }

    initialize() {
        console.log('🎯 LiveChatSystem: Duke inicializuar...');
        
        // Shto stilet
        this.addStyles();
        
        // Mbivendos sistemin ekzistues me metodë të sigurt
        this.integrateSafely();
        
        // Gati për përdorim
        console.log('✅ LiveChatSystem: U inicializua me sukses!');
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* TYPING INDICATOR */
            .typing-indicator {
                display: flex;
                align-items: center;
                padding: 12px 16px;
                margin: 10px;
                background: #f0f0f0;
                border-radius: 18px;
                width: fit-content;
                opacity: 0;
                animation: fadeInTyping 0.5s forwards;
            }
            
            @keyframes fadeInTyping {
                to { opacity: 0.7; }
            }
            
            @keyframes fadeOutTyping {
                to { opacity: 0; }
            }
            
            .typing-dots {
                display: flex;
                gap: 4px;
            }
            
            .typing-dot {
                width: 8px;
                height: 8px;
                background: #666;
                border-radius: 50%;
                animation: bounce 1.4s infinite;
            }
            
            .typing-dot:nth-child(2) { animation-delay: 0.2s; }
            .typing-dot:nth-child(3) { animation-delay: 0.4s; }
            
            @keyframes bounce {
                0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
                30% { transform: translateY(-6px); opacity: 1; }
            }
            
            /* ANIMACIONI I MESAZHEVE */
            .message.bot {
                animation: slideInBot 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }
            
            .message.user {
                animation: slideInUser 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }
            
            @keyframes slideInBot {
                from { 
                    opacity: 0;
                    transform: translateX(-20px) translateY(10px);
                }
                to { 
                    opacity: 1;
                    transform: translateX(0) translateY(0);
                }
            }
            
            @keyframes slideInUser {
                from { 
                    opacity: 0;
                    transform: translateX(20px) translateY(10px);
                }
                to { 
                    opacity: 1;
                    transform: translateX(0) translateY(0);
                }
            }
            
            /* TYPEWRITER EFFECT */
            .typewriter {
                display: inline-block;
                overflow: hidden;
                white-space: pre-wrap;
            }
            
            .typewriter.cursor::after {
                content: '▌';
                animation: blink 1s infinite;
                color: #4285f4;
                font-weight: bold;
            }
            
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        console.log('🎨 Stilet e animacionit u shtuan!');
    }

    integrateSafely() {
        console.log('🔗 Duke integruar me sistemin ekzistues...');
        
        // 1. KAP BUTONAT DHE INPUT PA MBIVENDOSJE
        this.setupEventListeners();
        
        // 2. MBIVENDOS addMessage PËR TË SHTUAR ANIMACIONE
        this.enhanceAddMessage();
        
        console.log('✅ Integrimi u përfundua!');
    }

    setupEventListeners() {
        const userInput = document.getElementById('user-input');
        const sendBtn = document.getElementById('send-btn');
        
        if (!userInput || !sendBtn) {
            console.log('❌ Elementet nuk u gjetën, provo përsëri...');
            setTimeout(() => this.setupEventListeners(), 1000);
            return;
        }
        
        console.log('🎯 Elementet u gjetën!');
        
        // Ruaj event listener-ët origjinalë
        const originalInputEvents = {
            keypress: userInput.onkeypress,
            input: userInput.oninput
        };
        
        const originalBtnClick = sendBtn.onclick;
        
        // Shto event listener të ri për Enter
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleUserMessage();
            }
            
            // Ekzekuto edhe event-in origjinal nëse ekziston
            if (originalInputEvents.keypress) {
                originalInputEvents.keypress.call(userInput, e);
            }
        });
        
        // Shto event listener të ri për klik
        sendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleUserMessage();
            
            // Ekzekuto edhe klikun origjinal nëse ekziston
            if (originalBtnClick) {
                originalBtnClick.call(sendBtn, e);
            }
        });
        
        console.log('🎧 Event listener-ët u shtuan!');
    }

    async handleUserMessage() {
        const userInput = document.getElementById('user-input');
        const message = userInput.value.trim();
        
        if (!message) return;
        
        console.log('💬 Përdoruesi shkroi:', message);
        
        // 1. SHFAQ MESAZHIN E PËRDORUESIT (menjëherë)
        if (typeof addMessage === 'function') {
            addMessage(message, 'user');
        }
        
        // 2. PASTRO INPUT
        userInput.value = '';
        
        // 3. SHFAQ TYPING INDICATOR
        this.showTypingIndicator();
        
        // 4. DËRGO TE SERVERI (përdor sistemin ekzistues)
        if (typeof window.sendMessage === 'function') {
            // Prit 1-2 sekonda për efekt realistik
            await this.delay(1200);
            
            // Fshi typing indicator
            this.hideTypingIndicator();
            
            // Dërgo mesazhin (përdor sistemin origjinal)
            window.sendMessage();
        }
    }

    showTypingIndicator() {
        if (this.isTyping) return;
        
        const chat = document.getElementById('chat');
        if (!chat) return;
        
        this.isTyping = true;
        
        const typingDiv = document.createElement('div');
        typingDiv.id = 'live-typing-indicator';
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
            <span style="margin-left: 10px; color: #666; font-size: 14px;">Po shkruan...</span>
        `;
        
        chat.appendChild(typingDiv);
        chat.scrollTop = chat.scrollHeight;
        
        console.log('⌛ Typing indicator u shfaq');
    }

    hideTypingIndicator() {
        const typing = document.getElementById('live-typing-indicator');
        if (typing) {
            typing.style.animation = 'fadeOutTyping 0.3s forwards';
            setTimeout(() => typing.remove(), 300);
        }
        this.isTyping = false;
        console.log('✅ Typing indicator u hoq');
    }

    enhanceAddMessage() {
        if (typeof window.addMessage !== 'function') {
            console.log('❌ addMessage nuk ekziston për të përmirësuar');
            return;
        }
        
        // Ruaj versionin origjinal
        const originalAddMessage = window.addMessage;
        
        // Krijo versionin e përmirësuar
        window.addMessage = (text, sender) => {
            const chat = document.getElementById('chat');
            if (!chat) return null;
            
            // Krijo elementin e mesazhit
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}`;
            
            // Formato tekstin (mbaj formatimin ekzistues)
            const formattedText = this.formatText(text);
            
            // Shto në chat
            messageDiv.innerHTML = `<div class="message-text">${formattedText}</div>`;
            
            // Shto animacionin
            messageDiv.style.opacity = '0';
            
            chat.appendChild(messageDiv);
            
            // Trigger animacionin
            setTimeout(() => {
                messageDiv.style.opacity = '1';
            }, 10);
            
            // Auto-scroll
            chat.scrollTop = chat.scrollHeight;
            
            console.log(`💬 ${sender.toUpperCase()}: ${text.substring(0, 50)}...`);
            
            // Kthe elementin e krijuar
            return messageDiv;
        };
        
        console.log('✨ addMessage u përmirësua me animacione!');
    }

    formatText(text) {
        // Mbaj të gjitha formatimet ekzistuese
        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
        
        return formatted;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // FUNKSION PËR TESTIM
    testLiveSystem() {
        console.log('🧪 Duke testuar sistemin e gjallë...');
        
        // Test typing indicator
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.hideTypingIndicator();
            
            // Test animacion mesazhi
            if (typeof window.addMessage === 'function') {
                window.addMessage('🎬 **Test i suksesshëm!** Sistemi i mesazheve të gjalla funksionon.', 'bot');
            }
        }, 2000);
    }
}

// ✅ INICIALIZO SISTEMIN
setTimeout(() => {
    window.liveChatSystem = new LiveChatSystem();
    
    // Kontrollo statusin
    console.log('📊 STATUSI I SISTEMIT TË GJALLË:');
    console.log('- liveChatSystem:', !!window.liveChatSystem);
    console.log('- addMessage:', typeof window.addMessage);
    console.log('- sendMessage:', typeof window.sendMessage);
    console.log('- hljs:', typeof hljs);
    
    // Testo sistemin (opsionale)
    // window.liveChatSystem.testLiveSystem();
    
}, 1500);

console.log('🚀 Sistemi i mesazheve të gjalla RRUFE-TESLA u ngarkua!');
