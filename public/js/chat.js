// ======================================================
// 🧠 chat - RRUFE-TESLA 10.5 - VERSION I THJESHTË QË FUNKSIONON
// ======================================================

console.log("🚀 Duke ngarkuar chat.js (Version i Thjeshtë)...");

class ChatSystem {
    constructor() {
        this.name = "ChatSystem-RRUFE-TESLA";
        this.version = "10.5-simple";
        this.initialized = false;
        this.messageCount = 0;
        
        console.log(`🎯 ${this.name} v${this.version} u instancua`);
        this.initialize();
    }

    initialize() {
        console.log("🔄 Duke inicializuar sistemin e chat-it...");
        
        // Konfiguro event listeners menjëherë
        this.setupEventListeners();
        
        // Krijo chat container nëse nuk ekziston
        this.ensureChatContainer();
        
        this.initialized = true;
        console.log("✅ ChatSystem u inicializua me sukses!");
    }

    setupEventListeners() {
        console.log("🎧 Duke konfiguruar event listeners...");
        
        const userInput = document.getElementById('user-input');
        const sendBtn = document.getElementById('send-btn');
        
        if (userInput && sendBtn) {
            console.log("✅ Elementët u gjetën");
            
            // Butoni Send
            sendBtn.addEventListener('click', () => {
                this.handleSendMessage();
            });
            
            // Enter key
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleSendMessage();
                }
            });
            
            console.log("✅ Event listeners u konfiguruan");
        } else {
            console.log("❌ Elementët nuk u gjetën, provo përsëri...");
            setTimeout(() => this.setupEventListeners(), 1000);
        }
    }

    handleSendMessage() {
        const userInput = document.getElementById('user-input');
        const message = userInput.value.trim();
        
        if (!message) {
            console.log("❌ Mesazhi është bosh");
            return;
        }
        
        console.log(`💬 Duke dërguar mesazh: "${message}"`);
        
        // Pastro input
        userInput.value = '';
        userInput.focus();
        
        // Shto mesazhin e përdoruesit
        this.addMessageToChat(message, 'user');
        
        // Proceso përgjigjen
        this.processMessage(message);
    }

    async processMessage(message) {
        // Shfaq "po mendon..."
        this.showThinkingIndicator();
        
        try {
            let response;
            
            // 🎯 KOMANDA /NDIHMO
            if (message.toLowerCase().trim() === '/ndihmo' || message.toLowerCase().trim() === '/help') {
                console.log("🎯 U zbulua komanda /ndihmo");
                response = this.getHelpResponse();
            }
            // 👋 PËRSHËNDETJE
            else if (this.isGreeting(message)) {
                console.log("👋 U zbulua përshëndetje");
                response = this.getGreetingResponse();
            }
            // 🧮 MATEMATIKË
            else if (this.isMathQuestion(message)) {
                console.log("🧮 U zbulua pyetje matematikore");
                response = this.solveMath(message);
            }
            // 🧠 PYETJE KOMPLEKSE
            else if (this.isComplexQuestion(message)) {
                console.log("💭 U zbulua pyetje komplekse");
                response = await this.processComplexQuestion(message);
            }
            // 🔄 PËRGJIGJE STANDARDE
            else {
                console.log("🔀 Duke përdorur përgjigje standarde");
                response = this.getStandardResponse(message);
            }
            
            console.log("📤 Përgjigja e gjeneruar:", response.substring(0, 50) + "...");
            
            // Fshi "po mendon..."
            this.hideThinkingIndicator();
            
            // Shto përgjigjen
            this.addMessageToChat(response, 'bot');
            
            // Ruaj në njohuri
            this.saveToKnowledge(message, response);
            
        } catch (error) {
            console.error("❌ Gabim në procesimin e mesazhit:", error);
            this.hideThinkingIndicator();
            this.addMessageToChat("Më falni, pati një gabim në sistem. Provo përsëri.", 'bot');
        }
    }

    // ✅ FUNKSIONET PËR PËRGJIGJET

    getHelpResponse() {
        return `🎯 **RRUFE-TESLA - KOMANDAT:**

**🔧 KOMANDAT:**
• **/ndihmo** - Shfaq këtë ndihmë
• **/stats** - Statistikat e sistemit
• **/mode** - Ndrysho modin e punës
• **/reset** - Ristejo bisedën

**💡 SHEMBUJ PYTJESH:**
• "Çfarë është AI?" - Shpjegime të detajuara
• "Si funksionon blockchain?" - Teknologji
• "Sa është 15 + 25?" - Llogaritje
• "Përshëndetje" - Përshëndetje

**🧠 Sistemi mëson automatikisht** nga çdo bisedë!`;
    }

    isGreeting(message) {
        const greetings = ['përshëndetje', 'hello', 'hi', 'mirëdita', 'ciao', 'hey', 'pershendetje'];
        return greetings.some(greet => message.toLowerCase().includes(greet));
    }

    getGreetingResponse() {
        const greetings = [
            "Përshëndetje! 😊 Si mund t'ju ndihmoj sot?",
            "Hello! 👋 Mirë se ju gjetëm!",
            "Mirëdita! ☀️ Çfarë mund të bëj për ju?",
            "Tungjatjeta! 🎯 Si mund të ndihmoj?"
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    isMathQuestion(message) {
        const mathPatterns = ['sa është', 'sa bëjnë', '+', '-', '*', '/', 'llogarit', 'kalkul'];
        return mathPatterns.some(pattern => 
            message.toLowerCase().includes(pattern)
        ) || /\d+[\+\-\*\/]\d+/.test(message);
    }

    solveMath(message) {
        try {
            console.log("🧮 Duke zgjidhur matematikën...");
            
            let expression = '';
            const lowerMsg = message.toLowerCase();
            
            // Nxjerr shprehjen matematikore
            if (lowerMsg.includes('sa është')) {
                expression = message.split('sa është')[1].replace('?', '').trim();
            } else if (lowerMsg.includes('sa bëjnë')) {
                expression = message.split('sa bëjnë')[1].replace('?', '').trim();
            } else {
                // Provoj të gjej shprehjen direkt
                expression = message.replace(/[^\d\+\-\*\/\.\(\)]/g, '').trim();
            }
            
            if (!expression) {
                return "Nuk mund ta gjej shprehjen matematikore. Provoni: 'Sa është 5 + 3?'";
            }
            
            // Sigurohu që shprehja është e sigurt
            if (!/^[\d\+\-\*\/\.\(\)\s]+$/.test(expression)) {
                return "Shprehja matematikore përmban karaktere të pasigurta.";
            }
            
            // Llogarit rezultatin
            const result = eval(expression);
            
            return `🧮 **${message}** = **${result}**`;
            
        } catch (error) {
            console.error("❌ Gabim në matematikë:", error);
            return "Nuk mund ta zgjidh këtë shprehje matematikore. Ju lutem provoni një shprehje më të thjeshtë.";
        }
    }

    isComplexQuestion(message) {
        const complexPatterns = [
            'çfarë është', 'si funksionon', 'shpjego', 
            'shpjegomë', 'detaje', 'mëso më shumë',
            'ai', 'blockchain', 'teknologji', 'shkenc'
        ];
        return complexPatterns.some(pattern => 
            message.toLowerCase().includes(pattern)
        );
    }

    async processComplexQuestion(message) {
        console.log("🌐 Duke procesuar pyetje komplekse...");
        
        // Simuloj një vonesë të vogël
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const lowerMsg = message.toLowerCase();
        
        if (lowerMsg.includes('çfarë është ai') || lowerMsg.includes('cfare eshte ai')) {
            return `🤖 **AI (Inteligjenca Artificiale)** është një fushë e shkencës kompjuterike që fokusohet në krijimin e sistemeve që mund të kryejnë detyra që normalisht kërkojnë inteligjencë njerëzore.

**Llojet kryesore:**
• **Machine Learning** - Mësimi nga të dhënat
• **Deep Learning** - Rrjetet neuronale  
• **NLP** - Përpunimi i gjuhës natyrore
• **Computer Vision** - Njohja e imazheve

💡 **RRUFE-TESLA** është një shembull i AI!`;
        }
        
        if (lowerMsg.includes('blockchain')) {
            return `⛓️ **Blockchain** është një teknologji e re që ruan të dhëna në mënyrë të decentralizuar dhe të sigurt.

**Karakteristikat kryesore:**
• **Decentralizim** - Nuk kontrollohet nga një qendër e vetme
• **Transparencë** - Të gjitha transaksionet janë publike
• **Siguri** - E pamundur të falsifikohen të dhënat
• **Imutabilitet** - Të dhënat nuk mund të ndryshohen

💰 Përdoret kryesisht për kriptomonedha si Bitcoin.`;
        }
        
        if (lowerMsg.includes('machine learning')) {
            return `🎯 **Machine Learning** është nënfusha e AI që i mëson kompjuterëve të mësojnë nga të dhënat pa qenë të programuar explicit.

**Llojet:**
• **Supervised Learning** - Mësimi me të dhëna të etiketuara
• **Unsupervised Learning** - Mësimi pa udhëzime
• **Reinforcement Learning** - Mësimi përmes shpërblimeve

🔧 Përdoret për: recommendation systems, speech recognition, image classification.`;
        }
        
        // Përgjigje e përgjithshme për pyetje komplekse
        return `🧠 **${message}**

Kjo është një pyetje shumë interesante! Për përgjigje më të detajuara dhe të përditësuara, unë rekomandoj të konsultoni burime specializuese ose të aktivizoni Gemini API.

💡 **Ndihmë:**
• Përdorni /ndihmo për më shumë komanda
• Pyetni më specifikisht për çështje teknike
• Aktivizoni Gemini për përgjigje më të avancuara`;
    }

    getStandardResponse(message) {
        const lowerMsg = message.toLowerCase();
        
        if (lowerMsg.includes('si jeni') || lowerMsg.includes('si je')) {
            return "Jam shumë mirë, faleminderit që pyetët! 😊 Si mund t'ju ndihmoj sot?";
        }
        
        if (lowerMsg.includes('faleminderit') || lowerMsg.includes('rrofsh') || lowerMsg.includes('flm')) {
            return "S'ka përse! 😊 Gjithmonë i lumtur të ndihmoj!";
        }
        
        if (lowerMsg.includes('libër') || lowerMsg.includes('libra')) {
            return "📚 Interesante! Çfarë lloj libri po kërkoni? Fiction, shkencor, historik, apo diçka tjetër?";
        }
        
        if (lowerMsg.includes('cfare') || lowerMsg.includes('çfarë') || lowerMsg.includes('cka') || lowerMsg.includes('çka')) {
            return "🤔 Mund t'ju ndihmoj me shumë çështje! Çfarë saktësisht dëshironi të dini? Teknologji, shkencë, programim, apo diçka tjetër?";
        }
        
        return "E kuptoj! 😊 Përdorni /ndihmo për të parë të gjitha komandat e mia.";
    }

    // ✅ FUNKSIONET PËR CHAT UI

    addMessageToChat(message, sender) {
        console.log(`📝 Duke shtuar mesazh nga ${sender}...`);
        
        // Gjej chat container
        let chatContainer = document.getElementById('chat-screen');
        
        // Nëse nuk ekziston, krijo
        if (!chatContainer) {
            chatContainer = this.createChatContainer();
        }
        
        // Krijo elementin e mesazhit
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        messageElement.innerHTML = `
            <div class="message-content">
                ${this.formatMessage(message)}
            </div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;
        
        // Shto mesazhin
        chatContainer.appendChild(messageElement);
        
        // Scroll në fund
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        console.log(`✅ U shtua mesazh nga ${sender}`);
    }

    createChatContainer() {
        console.log("🏗️ Duke krijuar chat container...");
        
        const chatContainer = document.createElement('div');
        chatContainer.id = 'chat-screen';
        chatContainer.className = 'chat-screen';
        
        // Gjej vendndodhjen e duhur
        const userInput = document.getElementById('user-input');
        const sendBtn = document.getElementById('send-btn');
        
        if (userInput && userInput.parentElement) {
            const inputContainer = userInput.parentElement;
            const mainContainer = inputContainer.parentElement;
            
            // Vendos para input field
            mainContainer.insertBefore(chatContainer, inputContainer);
            console.log("✅ Chat container u vendos para input field!");
        } else {
            // Fallback
            document.body.prepend(chatContainer);
            console.log("✅ Chat container u vendos në fillim të body!");
        }
        
        // Shto stilet
        this.addChatStyles();
        
        return chatContainer;
    }

    ensureChatContainer() {
        if (!document.getElementById('chat-screen')) {
            this.createChatContainer();
        }
    }

    addChatStyles() {
        if (!document.getElementById('chat-styles')) {
            const style = document.createElement('style');
            style.id = 'chat-styles';
            style.textContent = `
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
                
                .user-message {
                    align-self: flex-end;
                    background: #3B82F6;
                    color: white;
                    padding: 10px 14px;
                    border-radius: 18px 18px 4px 18px;
                    max-width: 70%;
                    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
                }
                
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
        }
    }

    formatMessage(message) {
        return message
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    showThinkingIndicator() {
        let chatContainer = document.getElementById('chat-screen');
        if (!chatContainer) {
            chatContainer = this.createChatContainer();
        }
        
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
    }

    hideThinkingIndicator() {
        const thinkingElement = document.getElementById('thinking');
        if (thinkingElement) {
            thinkingElement.style.display = 'none';
        }
    }

    saveToKnowledge(question, answer) {
        console.log("💾 Duke ruajtur njohuri...");
        // Implementim i thjeshtë - mund të shtohet më vonë
    }

    getStats() {
        return {
            name: this.name,
            version: this.version,
            initialized: this.initialized,
            messageCount: this.messageCount
        };
    }
}

// ==================== INICIALIZIM ====================

window.ChatSystem = ChatSystem;
window.chatSystem = new ChatSystem();

document.addEventListener('DOMContentLoaded', function() {
    console.log("📄 DOM u ngarkua - ChatSystem është gati!");
});

console.log("✅ chat.js (Version i Thjeshtë) u ngarkua!");

// ==================== TESTIM ====================

window.testChatSystem = function() {
    console.log("🧪 TEST I CHAT SYSTEM:");
    if (window.chatSystem) {
        window.chatSystem.processMessage("/ndihmo");
    }
};
