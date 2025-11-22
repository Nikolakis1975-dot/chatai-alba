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
        
        // Krijo chat container nëse nuk ekziston
        this.ensureChatContainer();
        
        this.initialized = true;
        console.log("✅ ChatSystem u inicializua me sukses!");
        
    } catch (error) {
        console.error("❌ Gabim në inicializimin e ChatSystem:", error);
        // 🔄 PROVO RITRY
        setTimeout(() => this.initialize(), 3000);
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
                    userInput.focus();
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
                        userInput.focus();
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
        console.log("❌ Mesazhi është bosh");
        return;
    }
    
    console.log(`💬 Duke procesuar mesazhin: "${message}"`);
    
    // ✅ KONTIROLLO NËSE JEMI INITIALIZUAR
    if (!this.initialized) {
        console.log("🔄 ChatSystem nuk është inicializuar, duke u përpjekur...");
        await this.initialize();
        if (!this.initialized) {
            this.addMessageToChat("Sistemi po inicializohet, provoni përsëri pas 2 sekondash.", 'bot');
            return;
        }
    }
    
    // Shto mesazhin e përdoruesit në chat
    this.addMessageToChat(message, 'user');
    
    // Shfaq "po mendon..." nëse ekziston
    this.showThinkingIndicator();
    
    try {
        let response;
        
        // 🎯 PRIORITET I PARË: SMART RESPONSE ROUTER
        if (this.smartRouterEnabled && window.smartResponseRouter && window.smartResponseRouter.initialized) {
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
            console.log("🔄 Duke përdorur fallback te serveri...");
            response = await this.sendToServer(message);
        }
        
        // Fshi "po mendon..."
        this.hideThinkingIndicator();
        
        // ✅ KONTIROLLO NËSE KA PËRGJIGJE
        if (response && response.trim() !== '') {
            // Shto përgjigjen në chat
            this.addMessageToChat(response, 'bot');
            
            // 🧠 MËSO NGA INTERAKSIONI
            await this.learnFromInteraction(message, response);
        } else {
            console.error("❌ Përgjigja është bosh");
            this.addMessageToChat("Më falni, nuk mora asnjë përgjigje nga sistemi. Provo përsëri.", 'bot');
        }
        
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

   // ================================ FUKSIONI learnFromInteraction =====================
   async learnFromInteraction(question, answer, metadata = {}) {
    console.log("🎓 Duke u përpjekur të mësoj nga interaksioni...");
    
    try {
        // ✅ RREGULLIMI I RI: Ruaj të GJITHA përgjigjet nga Gemini
        if (answer && answer.length > 10) { // Sigurohu që përgjigja ka përmbajtje
            const knowledgeKey = this.generateKnowledgeKey(question);
            
            // 🎯 PROVO KNOWLEDGEDISTILLER PARË
            if (window.knowledgeDistiller && typeof window.knowledgeDistiller.addKnowledge === 'function') {
                await window.knowledgeDistiller.addKnowledge(knowledgeKey, {
                    question: question,
                    answer: answer,
                    learnedAt: new Date().toISOString(),
                    source: metadata.source || 'chat_system',
                    category: this.detectCategory(question),
                    usageCount: 0
                }, 'gemini_learned');
                
                console.log("💾 U ruajt në KnowledgeDistiller:", knowledgeKey);
                return;
            }
            
            // 🔄 PROVO KNOWLEDGEINTEGRATION SI FALLBACK
            else if (window.knowledgeIntegration && typeof window.knowledgeIntegration.learnFromInteraction === 'function') {
                await window.knowledgeIntegration.learnFromInteraction(question, answer, {
                    category: 'gemini_learned',
                    timestamp: new Date().toISOString(),
                    source: 'gemini_api'
                });
                console.log("💾 U ruajt në KnowledgeIntegration");
                return;
            }
            
            // 🆘 PROVO LOCALSTORAGE SI EMERGJENCY
            else {
                this.saveToLocalStorage(question, answer);
                console.log("💾 U ruajt në LocalStorage (fallback)");
            }
        } else {
            console.log("ℹ️ Përgjigja shumë e shkurtër për tu ruajtur");
        }
    } catch (error) {
        console.error("❌ Gabim në mësimin nga interaksioni:", error);
    }
},

// ✅ FUNKSION I RI: Gjenero çelës unik për njohuri
generateKnowledgeKey(question) {
    return question
        .toLowerCase()
        .substring(0, 30)
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '_') + '_' + Date.now();
},

// ✅ FUNKSION I RI: Zbuloni kategorinë automatikisht
detectCategory(question) {
    const lowerQ = question.toLowerCase();
    if (lowerQ.includes('ai') || lowerQ.includes('teknologji') || lowerQ.includes('programim')) {
        return 'technology';
    } else if (lowerQ.includes('shkenc') || lowerQ.includes('fizik') || lowerQ.includes('kim')) {
        return 'science';
    } else if (lowerQ.includes('libër') || lowerQ.includes('edukim') || lowerQ.includes('shkoll')) {
        return 'education';
    } else {
        return 'general';
    }
},

// ✅ FUNKSION I RI: Ruaj në localStorage si fallback
saveToLocalStorage(question, answer) {
    try {
        const key = 'rrufe_knowledge_' + this.generateKnowledgeKey(question);
        const knowledge = {
            question: question,
            answer: answer,
            timestamp: new Date().toISOString(),
            category: this.detectCategory(question)
        };
        localStorage.setItem(key, JSON.stringify(knowledge));
    } catch (e) {
        console.error("❌ Gabim në localStorage:", e);
    }
}

  // ===================================== addMessageToChat ===============================

    addMessageToChat(message, sender) {
    console.log(`📝 Duke shtuar mesazh nga ${sender}...`);
    
    // ✅ PËRDOR TË NJËJTIN SISTEM SI KOMANDA /NDIHMO
    if (typeof addMessage === 'function') {
        console.log("✅ Duke përdorur addMessage ekzistuese...");
        addMessage(message, sender);
        return;
    }
    
    // ✅ ALTERNATIVE: PËRDOR TË NJËJTIN LOGJIKË SI addMessage
    console.log("🔄 Duke përdorur sistemin alternative...");
    
    // Gjej chat container ekzistues (i njëjti që përdor /ndihmo)
    let chatContainer = document.getElementById('chat');
    
    // Nëse nuk gjendet, kërko container të tjerë
    if (!chatContainer) {
        chatContainer = document.querySelector('.chat-messages, .messages, .conversation, [class*="message"]');
    }
    
    // Nëse përsëri nuk gjendet, krijo një të ri
    if (!chatContainer) {
        console.log("🏗️ Duke krijuar chat container të ri...");
        chatContainer = this.createChatContainerLikeHelp();
    }
    
    // Krijo elementin e mesazhit (i njëjti stil si /ndihmo)
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    messageElement.innerHTML = `
        <div class="message-content">
            ${this.formatMessage(message)}
        </div>
        <div class="message-time">${new Date().toLocaleTimeString()}</div>
    `;
    
    // Shto mesazhin në container
    chatContainer.appendChild(messageElement);
    
    // Scroll në fund
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    console.log(`✅ U shtua mesazh nga ${sender}: ${message.substring(0, 50)}...`);
}

// ✅ FUNKSION I RI QË KRIJON CHAT CONTAINER SI AI I /NDIHMO
createChatContainerLikeHelp() {
    console.log("📍 Duke krijuar chat container si /ndihmo...");
    
    // Krijo container të ri
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chat';
    chatContainer.className = 'chat-messages';
    chatContainer.style.cssText = `
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        background: #f8fafc;
        display: flex;
        flex-direction: column;
        gap: 15px;
        max-height: 500px;
        border-bottom: 1px solid #e2e8f0;
    `;
    
    // ✅ GJENI POZICIONIN E SAKTË (të njëjtin ku shfaqet /ndihmo)
    const existingChat = document.querySelector('#chat, .chat-messages, .messages');
    if (existingChat) {
        // Zëvendëso ekzistuesin
        existingChat.parentNode.replaceChild(chatContainer, existingChat);
        console.log("✅ U zëvendësua chat container ekzistues!");
    } else {
        // Vendos në pozicionin e duhur
        const mainContent = document.querySelector('main') || 
                           document.querySelector('.container') || 
                           document.querySelector('.app-content') || 
                           document.body;
        
        // Gjej input container për të vendosur përpara tij
        const inputContainer = document.querySelector('.input-container') || 
                              document.getElementById('user-input')?.parentElement;
        
        if (inputContainer && inputContainer.parentElement) {
            inputContainer.parentElement.insertBefore(chatContainer, inputContainer);
            console.log("✅ Chat container u vendos para input field!");
        } else {
            // Vendos në fillim të main content
            mainContent.prepend(chatContainer);
            console.log("✅ Chat container u vendos në fillim të main content!");
        }
    }
    
    return chatContainer;
}

    // ✅ FUNKSION I RI PËR TË SIGURUAR CHAT CONTAINER
    ensureChatContainer() {
        if (!document.getElementById('chat-screen')) {
            console.log("🔧 Duke siguruar chat container...");
            this.createProperChatContainer();
        }
    }

    // ✅ FUNKSION PËR TË SHTUAR STILET E CHAT-IT
    addChatStyles() {
        if (!document.getElementById('chat-fix-styles')) {
            const style = document.createElement('style');
            style.id = 'chat-fix-styles';
            style.textContent = `
                /* CHAT CONTAINER FIX */
                #chat-screen {
                    flex: 1;
                    overflow-y: auto;
                    padding: 15px;
                    background: #f8fafc;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    max-height: 400px;
                    border-bottom: 1px solid #e2e8f0;
                    margin-bottom: 10px;
                }
                
                /* MESAZHET E USERIT */
                .user-message {
                    align-self: flex-end;
                    background: #3B82F6;
                    color: white;
                    padding: 10px 14px;
                    border-radius: 18px 18px 4px 18px;
                    max-width: 70%;
                    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
                }
                
                /* MESAZHET E BOTIT */
                .bot-message {
                    align-self: flex-start;
                    background: white;
                    color: #1f2937;
                    padding: 10px 14px;
                    border-radius: 18px 18px 18px 4px;
                    max-width: 70%;
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }
                
                .message-content {
                    font-size: 14px;
                    line-height: 1.4;
                }
                
                .message-time {
                    font-size: 11px;
                    opacity: 0.7;
                    margin-top: 4px;
                    text-align: right;
                }
                
                /* THINKING INDICATOR */
                .thinking-indicator {
                    align-self: flex-start;
                    padding: 10px 15px;
                    margin: 5px 0;
                    background: rgba(147, 51, 234, 0.1);
                    border-radius: 15px;
                    border: 1px solid rgba(147, 51, 234, 0.2);
                    max-width: 70%;
                }
                
                .thinking-content {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
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
            console.log("✅ Stilet e chat-it u shtuan!");
        }
    }

    formatMessage(message) {
        // Formatimi bazë i mesazhit
        return message
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    showThinkingIndicator() {
    console.log("🤔 Duke shfaqur thinking indicator...");
    
    // ✅ PËRDOR TË NJËJTIN CHAT CONTAINER
    let chatContainer = document.getElementById('chat');
    if (!chatContainer) {
        chatContainer = document.querySelector('.chat-messages, .messages, .conversation');
    }
    
    if (!chatContainer) {
        console.log("❌ Nuk u gjet chat container, duke krijuar...");
        chatContainer = this.createChatContainerLikeHelp();
    }
    
    // Krijo ose shfaq thinking indicator
    let thinkingElement = document.getElementById('thinking');
    if (!thinkingElement) {
        thinkingElement = document.createElement('div');
        thinkingElement.id = 'thinking';
        thinkingElement.className = 'thinking-indicator';
        thinkingElement.innerHTML = `
            <div class="thinking-content">
                <span class="thinking-text">RRUFE-TESLA po mendon...</span>
                <div class="thinking-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatContainer.appendChild(thinkingElement);
    }
    
    thinkingElement.style.display = 'block';
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    console.log("✅ Thinking indicator u shfaq!");
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

// ==================== FUNKSIONE TESTIMI & DIAGNOSTIKIM ====================

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

// ==================== DIAGNOSTIKIM I CHAT CONTAINER ====================

window.debugChatContainer = function() {
    console.log("🔍 DIAGNOSTIKIM I CHAT CONTAINER:");
    
    const elements = {
        'chat-screen': document.getElementById('chat-screen'),
        'chat': document.getElementById('chat'),
        'user-input': document.getElementById('user-input'),
        'send-btn': document.getElementById('send-btn'),
        '.message': document.querySelectorAll('.message'),
        '.input-container': document.querySelector('.input-container')
    };
    
    Object.entries(elements).forEach(([name, element]) => {
        if (element) {
            if (name === '.message') {
                console.log(`✅ ${name}: ${element.length} elementë`);
            } else {
                console.log(`✅ ${name}: EKZISTON`, element);
            }
        } else {
            console.log(`❌ ${name}: NUK EKZISTON`);
        }
    });
    
    // Gjej të gjitha elementet që përmbajnë 'chat'
    const allChatElements = document.querySelectorAll('[id*="chat"], [class*="chat"]');
    console.log(`🔍 Të gjitha elementet me 'chat': ${allChatElements.length}`);
    allChatElements.forEach(el => {
        console.log(`   - ${el.id || el.className}: ${el.tagName}`);
    });
};

// ==================== FORCE FIX PËR CHAT CONTAINER ====================

window.forceFixChatContainer = function() {
    console.log("🔧 FORCE FIX PËR CHAT CONTAINER...");
    
    // Fshi chat container ekzistues nëse ka
    const oldChat = document.getElementById('chat-screen');
    if (oldChat) {
        oldChat.remove();
        console.log("🗑️ U fshi chat container i vjetër");
    }
    
    // Krijo të ri duke përdorur metodën e klasës
    window.chatSystem.createProperChatContainer();
    console.log("✅ Force fix u aplikua!");
};

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
                    newInput.focus();
                }
            }
        });
        
        console.log("🔧 Enter key u rregullua manualisht!");
        return true;
    }
    return false;
};

// ==================== AUTO-FIX & DIAGNOSTIKIM ====================

// Auto-diagnostikim pas 2 sekondash
setTimeout(() => {
    console.log("🔍 AUTO-DIAGNOSTIKIM I CHAT-IT:");
    window.debugChatContainer();
    
    // Sigurohu që chat container ekziston
    if (!document.getElementById('chat-screen')) {
        console.log("🔧 Auto-krijim i chat container...");
        window.chatSystem.ensureChatContainer();
    }
}, 2000);

// Auto-fix për Enter key pas 3 sekondash
setTimeout(() => {
    if (!window.chatSystem?.initialized) {
        window.fixEnterKeyManual();
    }
}, 3000);

// ==================== DIAGNOSTIKIM I POZICIONIT TË /NDIHMO ====================

window.findHelpMessagePosition = function() {
    console.log("🔍 DUKE KËRKUAR POZICIONIN E /NDIHMO:");
    
    // Gjej të gjitha mesazhet e /ndihmo
    const helpMessages = document.querySelectorAll('.message, .bot-message, .user-message, [class*="message"]');
    
    console.log(`📊 Gjetëm ${helpMessages.length} mesazhe:`);
    
    helpMessages.forEach((msg, index) => {
        const content = msg.textContent || msg.innerText;
        const container = msg.closest('#chat, .chat-messages, .messages, .conversation, div');
        
        console.log(`--- Mesazhi ${index + 1} ---`);
        console.log(`Përmbajtja: ${content.substring(0, 50)}...`);
        console.log(`Container: ${container?.id || container?.className || 'N/A'}`);
        console.log(`HTML: ${msg.outerHTML.substring(0, 100)}...`);
        console.log(`Parent: ${msg.parentElement?.id || msg.parentElement?.className}`);
    });
    
    // Gjej të gjitha containerët e mundshëm
    const containers = document.querySelectorAll('#chat, .chat-messages, .messages, .conversation, [id*="chat"], [class*="chat"], [class*="message"]');
    
    console.log(`🔍 Gjetëm ${containers.length} containerë të mundshëm:`);
    
    containers.forEach((container, index) => {
        console.log(`Container ${index + 1}:`);
        console.log(`  ID: ${container.id || 'N/A'}`);
        console.log(`  Class: ${container.className || 'N/A'}`);
        console.log(`  Tag: ${container.tagName}`);
        console.log(`  Children: ${container.children.length}`);
        console.log(`  Position: ${container.getBoundingClientRect().top}px from top`);
    });
};

// Auto-diagnostikim
setTimeout(() => {
    console.log("🔍 AUTO-DIAGNOSTIKIM I POZICIONIT:");
    window.findHelpMessagePosition();
}, 3000);
