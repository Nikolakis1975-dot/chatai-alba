// ======================================================
// 🧠 chat - RRUFE-TESLA 10.5 - SISTEM I RI I PLOTË
// ======================================================
// INTEGRIM I PLOTË ME SMART RESPONSE ROUTER & KNOWLEDGE DISTILLER
// ======================================================

console.log("🚀 Duke ngarkuar chat.js (Version i Ri)...");

class ChatSystem {
    constructor() {
        this.name = "ChatSystem-RRUFE-TESLA";
        this.version = "10.5-smart";
        this.initialized = false;
        this.smartRouterEnabled = true;
        
        console.log(`🎯 ${this.name} v${this.version} u instancua`);
        this.initialize();
    }

    async initialize() {
        console.log("🔄 Duke inicializuar sistemin e ri të chat-it...");
        
        try {
            // Prit deri të jenë të gatshëm të gjitha modulet
            await this.waitForModules();
            
            // Konfiguro event listeners
            this.setupEventListeners();
            
            this.initialized = true;
            console.log("✅ ChatSystem u inicializua me sukses!");
            
        } catch (error) {
            console.error("❌ Gabim në inicializimin e ChatSystem:", error);
        }
    }

    async waitForModules() {
        return new Promise((resolve) => {
            const checkModules = () => {
                const modulesReady = 
                    window.smartResponseRouter && 
                    window.smartResponseRouter.initialized &&
                    window.knowledgeDistiller &&
                    window.knowledgeDistiller.initialized;
                
                if (modulesReady) {
                    console.log("✅ Të gjitha modulet janë gati!");
                    resolve(true);
                } else {
                    console.log("⏳ Duke pritur module...");
                    setTimeout(checkModules, 1000);
                }
            };
            checkModules();
        });
    }

    setupEventListeners() {
        console.log("🎧 Duke konfiguruar event listeners...");
        
        // Gjej elementët e chat-it
        const userInput = document.getElementById('user-input');
        const sendBtn = document.getElementById('send-btn');
        
        if (userInput && sendBtn) {
            // Event për butonin Send
            sendBtn.addEventListener('click', () => {
                const message = userInput.value.trim();
                if (message) {
                    this.handleUserMessage(message);
                    userInput.value = '';
                }
            });
            
            // Event për Enter key - VERSIONI I RI I KORIGJUAR
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault(); // ✅ PARANDALO REFRESH-IN E FAQES
                    const message = userInput.value.trim();
                    if (message) {
                        this.handleUserMessage(message);
                        userInput.value = '';
                    }
                }
            });
            
            console.log("✅ Event listeners u konfiguruan");
        } else {
            console.log("⏳ Elementët e chat-it nuk janë gati ende");
            setTimeout(() => this.setupEventListeners(), 2000);
        }
    }

    async handleUserMessage(message) {
        if (!message || message.trim() === '') {
            return;
        }
        
        console.log(`💬 Duke procesuar mesazhin: "${message}"`);
        
        // Shto mesazhin e përdoruesit në chat
        this.addMessageToChat(message, 'user');
        
        // Shfaq "po mendon..." nëse ekziston
        this.showThinkingIndicator();
        
        try {
            let response;
            
            // 🎯 PRIORITET I PARË: SMART RESPONSE ROUTER
            if (this.smartRouterEnabled && window.smartResponseRouter) {
                console.log("🎯 Duke përdorur SmartResponseRouter...");
                response = await window.smartResponseRouter.processUserMessage(message);
                
                // Nëse SmartRouter dha përgjigje të mirë
                if (response && !this.isGenericResponse(response)) {
                    console.log("✅ SmartResponseRouter dha përgjigje të mirë");
                } else {
                    console.log("🔄 SmartResponseRouter dha përgjigje gjenerike, duke provuar serverin...");
                    response = await this.sendToServer(message);
                }
            } else {
                // 🔄 FALLBACK: Dërgo te serveri
                response = await this.sendToServer(message);
            }
            
            // Fshi "po mendon..."
            this.hideThinkingIndicator();
            
            // Shto përgjigjen në chat
            this.addMessageToChat(response, 'bot');
            
            // 🧠 MËSO NGA INTERAKSIONI
            await this.learnFromInteraction(message, response);
            
        } catch (error) {
            console.error("❌ Gabim në procesimin e mesazhit:", error);
            
            // Fshi "po mendon..."
            this.hideThinkingIndicator();
            
            this.addMessageToChat("Më falni, pati një gabim në sistem. Provo përsëri.", 'bot');
        }
    }

    async sendToServer(message) {
        try {
            console.log("🌐 Duke dërguar mesazhin te serveri...");
            
            const response = await fetch('/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    userId: this.getCurrentUserId() || 1
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.response) {
                return data.response;
            } else {
                throw new Error('Përgjigje e pavlefshme nga serveri');
            }
            
        } catch (error) {
            console.error("❌ Gabim në komunikimin me serverin:", error);
            return "Më falni, nuk mund të lidhem me serverin. Provo përsëri më vonë.";
        }
    }

    async learnFromInteraction(question, answer) {
        try {
            // 🎯 PROVO KNOWLEDGEINTEGRATION PARË
            if (window.knowledgeIntegration && typeof window.knowledgeIntegration.learnFromInteraction === 'function') {
                await window.knowledgeIntegration.learnFromInteraction(question, answer, {
                    category: 'conversation',
                    timestamp: new Date().toISOString(),
                    source: 'chat_system'
                });
                console.log("🎓 U mësua nga interaksioni!");
            }
            // 🎯 PROVO KNOWLEDGEDISTILLER SI FALLBACK
            else if (window.knowledgeDistiller && typeof window.knowledgeDistiller.learnFromInteraction === 'function') {
                await window.knowledgeDistiller.learnFromInteraction(question, answer, {
                    category: 'conversation'
                });
                console.log("🎓 U mësua nga interaksioni (fallback)!");
            }
            // 🔄 PROVO ADDKNOWLEDGE SI FALLBACK EMERGJENT
            else if (window.knowledgeDistiller && typeof window.knowledgeDistiller.addKnowledge === 'function') {
                const knowledgeKey = question.substring(0, 30).replace(/[^\w]/g, '_');
                await window.knowledgeDistiller.addKnowledge(knowledgeKey, {
                    question: question,
                    answer: answer,
                    learnedAt: new Date().toISOString()
                }, 'conversation');
                console.log("🎓 U mësua nga interaksioni (emergjent)!");
            }
            else {
                console.log("ℹ️ Nuk ka sistem mësimi të disponueshëm");
            }
        } catch (error) {
            console.error("❌ Gabim në mësimin nga interaksioni:", error);
        }
    }

    addMessageToChat(message, sender) {
        const chatScreen = document.getElementById('chat-screen');
        if (!chatScreen) {
            console.error("❌ Chat screen nuk u gjet");
            return;
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        messageElement.innerHTML = `
            <div class="message-content">
                ${this.formatMessage(message)}
            </div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;
        
        chatScreen.appendChild(messageElement);
        chatScreen.scrollTop = chatScreen.scrollHeight;
        
        console.log(`📝 U shtua mesazh nga ${sender}: ${message.substring(0, 50)}...`);
    }

    formatMessage(message) {
        // Formatimi bazë i mesazhit
        return message
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    showThinkingIndicator() {
        const thinkingElement = document.getElementById('thinking');
        if (thinkingElement) {
            thinkingElement.style.display = 'block';
        }
        
        // Krijo element nëse nuk ekziston
        const chatScreen = document.getElementById('chat-screen');
        if (chatScreen && !document.getElementById('thinking')) {
            const thinkingDiv = document.createElement('div');
            thinkingDiv.id = 'thinking';
            thinkingDiv.className = 'thinking-indicator';
            thinkingDiv.innerHTML = `
                <div class="thinking-content">
                    <span class="thinking-text">RRUFE-TESLA po mendon...</span>
                    <div class="thinking-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `;
            thinkingDiv.style.display = 'block';
            chatScreen.appendChild(thinkingDiv);
            chatScreen.scrollTop = chatScreen.scrollHeight;
        }
    }

    hideThinkingIndicator() {
        const thinkingElement = document.getElementById('thinking');
        if (thinkingElement) {
            thinkingElement.style.display = 'none';
        }
    }

    isGenericResponse(response) {
        const genericPatterns = [
            'e kuptoj',
            'përdorni /ndihmo',
            'nuk kuptova',
            'mund të përsërisni',
            'nuk jam i sigurt'
        ];
        
        return genericPatterns.some(pattern => 
            response.toLowerCase().includes(pattern)
        );
    }

    getCurrentUserId() {
        try {
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                const user = JSON.parse(savedUser);
                return user.username || user.id || 'anonymous';
            }
        } catch (e) {
            console.error('Gabim në marrjen e user ID:', e);
        }
        return 'anonymous';
    }

    getStats() {
        return {
            name: this.name,
            version: this.version,
            initialized: this.initialized,
            smartRouterEnabled: this.smartRouterEnabled,
            modules: {
                smartResponseRouter: !!window.smartResponseRouter,
                knowledgeDistiller: !!window.knowledgeDistiller,
                knowledgeIntegration: !!window.knowledgeIntegration
            }
        };
    }
}

// ==================== INICIALIZIM I SISTEMIT ====================

// Krijo instancë globale
window.ChatSystem = ChatSystem;
window.chatSystem = new ChatSystem();

// Auto-inicializim kur DOM të jetë gati
document.addEventListener('DOMContentLoaded', function() {
    console.log("📄 DOM u ngarkua - ChatSystem është gati!");
});

console.log("✅ chat.js (Version i Ri) u ngarkua!");

// ==================== FUNKSIONE TESTIMI ====================

window.testChatSystem = function() {
    console.log("🧪 TEST I CHAT SYSTEM:");
    
    if (window.chatSystem) {
        const stats = window.chatSystem.getStats();
        console.log("📊 Chat System Stats:", stats);
        
        // Testo me një mesazh
        window.chatSystem.handleUserMessage("Test nga console - a funksionon sistemi i ri?");
    } else {
        console.log("❌ ChatSystem nuk është i disponueshëm");
    }
};

// Funksion për të treguar statusin e sistemit
window.showChatStatus = function() {
    console.log("🔍 STATUSI I SISTEMIT TË CHAT-IT:");
    console.log("ChatSystem:", window.chatSystem ? "✅ AKTIV" : "❌ JOAKTIV");
    console.log("SmartResponseRouter:", window.smartResponseRouter ? "✅ AKTIV" : "❌ JOAKTIV");
    console.log("KnowledgeDistiller:", window.knowledgeDistiller ? "✅ AKTIV" : "❌ JOAKTIV");
    
    if (window.chatSystem) {
        console.log("📊 Detajet:", window.chatSystem.getStats());
    }
};

// ==================== STYLE CSS PËR THINKING INDICATOR ====================

const addThinkingStyles = () => {
    if (!document.getElementById('chat-thinking-styles')) {
        const style = document.createElement('style');
        style.id = 'chat-thinking-styles';
        style.textContent = `
            .thinking-indicator {
                padding: 10px 15px;
                margin: 10px;
                background: rgba(147, 51, 234, 0.1);
                border-radius: 15px;
                border: 1px solid rgba(147, 51, 234, 0.2);
                text-align: center;
            }
            
            .thinking-content {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            
            .thinking-text {
                color: #9333EA;
                font-size: 14px;
                font-style: italic;
            }
            
            .thinking-dots {
                display: flex;
                gap: 4px;
            }
            
            .thinking-dots span {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #9333EA;
                animation: thinking-bounce 1.4s infinite ease-in-out;
            }
            
            .thinking-dots span:nth-child(1) { animation-delay: -0.32s; }
            .thinking-dots span:nth-child(2) { animation-delay: -0.16s; }
            
            @keyframes thinking-bounce {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
};

// Shto stilet kur të ngarkohet faqja
setTimeout(addThinkingStyles, 1000);

// ==================== FIX MANUAL PËR ENTER KEY ====================

window.fixEnterKeyManual = function() {
    const input = document.getElementById('user-input');
    if (input) {
        // Fshi event listeners të vjetër
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);
        
        // Shto event listener të ri
        newInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const message = newInput.value.trim();
                if (message && window.chatSystem) {
                    window.chatSystem.handleUserMessage(message);
                    newInput.value = '';
                }
            }
        });
        
        console.log("🔧 Enter key u rregullua manualisht!");
        return true;
    }
    return false;
};

// Auto-fix pas 3 sekondash
setTimeout(() => {
    if (!window.chatSystem?.initialized) {
        window.fixEnterKeyManual();
    }
}, 3000);
