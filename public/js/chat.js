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
        const chatScreen = document.getElementById('chat-screen');
        
        if (userInput && sendBtn) {
            // Event për butonin Send
            sendBtn.addEventListener('click', () => {
                this.handleUserMessage(userInput.value.trim());
                userInput.value = '';
            });
            
            // Event për Enter key
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleUserMessage(userInput.value.trim());
                    userInput.value = '';
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
            
            // Shto përgjigjen në chat
            this.addMessageToChat(response, 'bot');
            
            // 🧠 MËSO NGA INTERAKSIONI
            await this.learnFromInteraction(message, response);
            
        } catch (error) {
            console.error("❌ Gabim në procesimin e mesazhit:", error);
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

// ==================== TESTIM ====================

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

// ==================== OVERRIDE I FORTË - KAPËRCE TË GJITHA ====================

console.log("🚀 Duke aplikuar override të fortë...");

// 🎯 KAPËRCE KOMPLET SENDMESSAGE
if (typeof sendMessage !== 'undefined') {
    console.log("🔧 Duke ZËVENDËSUAR plotësisht sendMessage...");
    
    window.sendMessage = async function() {
        const input = document.getElementById("user-input");
        const message = input ? input.value.trim() : "";
        
        if (!message) {
            console.log("❌ Mesazh bosh");
            return;
        }
        
        console.log("🎯 OVERRIDE I FORTË - Mesazhi:", message);
        
        // Pastro input menjëherë
        if (input) input.value = "";
        
        // Shto mesazhin e përdoruesit
        if (typeof addMessage === 'function') {
            addMessage(message, 'user');
        }
        
        // 🎯 PRIORITET I PARË DHE I VETËM: SMART RESPONSE ROUTER
        if (window.smartResponseRouter && window.smartResponseRouter.initialized) {
            try {
                console.log("🎯 Duke përdorur EKSKLUZIVISHT SmartResponseRouter...");
                const response = await window.smartResponseRouter.processUserMessage(message);
                
                console.log("✅ Përgjigja e SmartResponseRouter:", response.substring(0, 80));
                
                // Shto përgjigjen në chat
                if (typeof addMessage === 'function') {
                    addMessage(response, 'bot');
                }
                
                // 🧠 MËSO NGA INTERAKSIONI
                if (window.knowledgeDistiller) {
                    try {
                        await window.knowledgeDistiller.addKnowledge(
                            'chat_' + Date.now(),
                            { question: message, answer: response, timestamp: new Date().toISOString() },
                            'conversation'
                        );
                        console.log("🎓 U mësua nga interaksioni!");
                    } catch (learnError) {
                        console.log("ℹ️ Gabim i vogël në mësim:", learnError.message);
                    }
                }
                
                return; // ✅ DIL KËTU - MOS PËRDOR SISTEMIN E VJETËR!
                
            } catch (error) {
                console.error("❌ Gabim kritik në SmartResponseRouter:", error);
            }
        }
        
        // 🚨 NËSE SMART ROUTER DËSHTON, SHKO TE SERVERI
        console.log("🚨 SmartRouter dështoi, duke përdorur serverin...");
        try {
            const response = await fetch('/api/chat/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message, userId: 1 })
            });
            
            const data = await response.json();
            
            if (data.success && data.response && typeof addMessage === 'function') {
                addMessage(data.response, 'bot');
            }
        } catch (fetchError) {
            console.error("❌ Gabim në server:", fetchError);
            if (typeof addMessage === 'function') {
                addMessage("Më falni, pati një gabim në sistem.", 'bot');
            }
        }
    };
    
    console.log("✅ OVERRIDE I FORTË u aplikua! Tani çdo mesazh do të përdorë SmartResponseRouter!");
}

// 🎯 KAPËRCE EDHE ENTER KEY
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('user-input');
    if (input) {
        // Fshi event listeners e vjetra
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);
        
        // Shto event listener të ri
        newInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
        
        console.log("✅ Event listener i ri u konfigurua!");
    }
});

console.log("🎉 OVERRIDE I FORTË U AKTIVIZUA! Tani RRUFE-TESLA do të përdorë sistemin e ri!");
