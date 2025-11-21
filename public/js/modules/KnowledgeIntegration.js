// ==================== 🎯 INTEGRIMI I KNOWLEDGEDISTILLER ====================

class KnowledgeIntegration {
    constructor() {
        this.initialized = false;
        this.initialize();
    }
    
    async initialize() {
        console.log("🧠 Duke inicializuar Knowledge Integration...");
        
        // Prit deri të jetë gati KnowledgeDistiller
        await this.waitForKnowledgeDistiller();
        
        // Intercept butonin e dërgimit
        this.interceptSendButton();
        
        this.initialized = true;
        console.log("✅ Knowledge Integration u inicializua!");
    }
    
    async waitForKnowledgeDistiller() {
        return new Promise((resolve) => {
            const check = () => {
                if (window.knowledgeDistiller && window.knowledgeDistiller.initialized) {
                    resolve(true);
                } else {
                    setTimeout(check, 1000);
                }
            };
            check();
        });
    }
    
    interceptSendButton() {
        console.log("🎯 Duke interceptuar butonin e dërgimit...");
        
        const sendButton = document.getElementById('send-btn');
        const userInput = document.getElementById('user-input');
        
        if (sendButton && userInput) {
            // Ruaj funksionin origjinal
            const originalOnClick = sendButton.onclick;
            
            // Zëvendëso me versionin tonë
            sendButton.onclick = async (e) => {
                const message = userInput.value.trim();
                
                if (message) {
                    // Së pari ekzekuto funksionin origjinal
                    if (originalOnClick) {
                        originalOnClick.call(sendButton, e);
                    }
                    
                    // Pastaj mëso nga interaksioni (nëse është pyetje e mirë)
                    await this.learnFromMessage(message);
                }
            };
            
            // Intercept Enter key
            userInput.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter') {
                    const message = userInput.value.trim();
                    if (message) {
                        setTimeout(async () => {
                            await this.learnFromMessage(message);
                        }, 1000);
                    }
                }
            });
            
            console.log("✅ Interceptimi u krye me sukses!");
        }
    }
    
    async learnFromMessage(message) {
        // Prit pak kohë për të marrë përgjigjen nga chat
        setTimeout(async () => {
            try {
                const lastMessage = this.getLastBotMessage();
                if (lastMessage && this.shouldLearn(message, lastMessage)) {
                    console.log("🎓 Duke mësuar nga interaksioni:", message.substring(0, 50));
                    
                    await window.knowledgeDistiller.learnFromInteraction(
                        message,
                        lastMessage,
                        {
                            category: 'conversation',
                            timestamp: new Date().toISOString(),
                            source: 'rrufe-tesla-chat',
                            quality: 'high'
                        }
                    );
                    
                    console.log("✅ U mësua nga biseda!");
                }
            } catch (error) {
                console.error("❌ Gabim në mësim:", error);
            }
        }, 2000);
    }
    
    getLastBotMessage() {
        const chat = document.getElementById('chat');
        if (!chat) return null;
        
        const messages = chat.querySelectorAll('.message.bot, .bot-message');
        if (messages.length === 0) return null;
        
        const lastMessage = messages[messages.length - 1];
        return lastMessage.textContent || lastMessage.innerText;
    }
    
    shouldLearn(question, answer) {
        // Mos mëso nga përgjigje të shkurtra
        if (!answer || answer.length < 15) return false;
        
        // Mos mëso nga komanda
        if (question.startsWith('/')) return false;
        
        // Mos mëso nga përgjigje gabimi
        const genericPatterns = [
            'nuk e kuptova',
            'mund të përsërisni',
            'nuk jam i sigurt',
            'nuk kam përgjigje',
            'më falni',
            'do të doja të ndihmoja'
        ];
        
        if (genericPatterns.some(pattern => answer.toLowerCase().includes(pattern))) {
            return false;
        }
        
        // Mëso vetëm nga pyetje dhe përgjigje të mira
        return question.length > 5 && answer.length > 20;
    }
    
    // Funksion për të kërkuar njohuri para se të dërgohet te AI
    async getKnowledgeForMessage(message) {
        if (!window.knowledgeDistiller) return null;
        
        const results = window.knowledgeDistiller.searchKnowledge(message);
        if (results.length > 0) {
            const bestMatch = results[0];
            console.log("🎯 Gjetëm njohuri ekzistuese:", bestMatch.key);
            return bestMatch.data.answer || bestMatch.data.value;
        }
        
        return null;
    }
}

// ==================== INICIALIZIMI ====================

// Krijo instancë globale
window.knowledgeIntegration = new KnowledgeIntegration();

// Buton për menaxhimin e njohurive
function showKnowledgeManager() {
    if (!window.knowledgeDistiller) {
        addMessage("🧠 KnowledgeDistiller nuk është i inicializuar!", 'system');
        return;
    }
    
    const stats = window.knowledgeDistiller.getStats();
    const searchResults = window.knowledgeDistiller.searchKnowledge('', 'conversation');
    
    let message = `🧠 **SISTEMI I NJOHURIVE - RRUFE-TESLA**\n\n`;
    message += `📊 **Statistikat:**\n`;
    message += `• Njohuri totale: ${stats.totalEntries}\n`;
    message += `• Kategori: ${stats.categories.length}\n`;
    message += `• Storage: ${stats.storage}\n`;
    message += `• Përdorime totale: ${stats.totalUsage}\n\n`;
    
    if (searchResults.length > 0) {
        message += `🔍 **Njohuritë e fundit:**\n`;
        searchResults.slice(0, 5).forEach((result, index) => {
            const question = result.data.question || result.key;
            const answer = result.data.answer || result.data.value;
            message += `${index + 1}. ${question.substring(0, 40)}...\n`;
        });
    } else {
        message += `ℹ️ **Nuk ka ende njohuri të mësuara.**\n`;
        message += `Sistemi do të fillojë të mësojë automatikisht nga bisedat tuaja!`;
    }
    
    addMessage(message, 'system');
}

// Shto butonin në header nëse nuk ekziston
function addKnowledgeButton() {
    if (document.getElementById('knowledge-btn')) return;
    
    const header = document.querySelector('header');
    if (header) {
        const button = document.createElement('button');
        button.id = 'knowledge-btn';
        button.innerHTML = '🧠 Njohuritë';
        button.style.cssText = `
            background: #9C27B0;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 20px;
            cursor: pointer;
            margin: 2px;
            font-size: 12px;
        `;
        button.onclick = showKnowledgeManager;
        
        header.appendChild(button);
        console.log("✅ Butoni i njohurive u shtua!");
    }
}

// Shto butonin kur të ngarkohet faqja
setTimeout(addKnowledgeButton, 3000);

console.log("✅ Knowledge Integration Script u ngarkua!");
