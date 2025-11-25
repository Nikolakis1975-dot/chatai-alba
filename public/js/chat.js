
// ==================== 🧠 CHAT AI SYSTEM ME OPENAI FALLBACK ====================

class ChatAISystem {
    constructor() {
        this.isProcessing = false;
        this.init();
    }

    init() {
        console.log('🤖 Chat AI System u inicializua');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Event listener për butonin send
        const sendBtn = document.getElementById('send-btn');
        const userInput = document.getElementById('user-input');

        if (sendBtn && userInput) {
            sendBtn.addEventListener('click', () => this.sendMessage());
            
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        console.log('✅ Chat event listeners u aktivizuan');
    }

    // ✅ FUNKSIONI KRYESOR PËR DËRGIM MESAZHESH
    async sendMessage() {
        if (this.isProcessing) return;
        
        const userInput = document.getElementById('user-input');
        const message = userInput.value.trim();
        
        if (!message) return;

        this.isProcessing = true;
        this.addMessageToChat(message, 'user');
        userInput.value = '';

        try {
            // Shfaq loading indicator
            this.showLoadingIndicator();

            // Përdor sistemin e ri me OpenAI fallback
            const result = await this.handleChatMessage(message);
            
            if (result.success) {
                this.addMessageToChat(result.response, 'bot', result.source);
            } else {
                this.addMessageToChat('❌ ' + (result.error || 'Gabim i panjohur'), 'bot', 'error');
            }
            
        } catch (error) {
            console.error('❌ Gabim në sendMessage:', error);
            this.addMessageToChat('❌ Gabim në server. Provoni përsëri.', 'bot', 'error');
        } finally {
            this.isProcessing = false;
            this.hideLoadingIndicator();
        }
    }

// ============================== ✅ SISTEM I PËRMBYLLUR ME OPENAI FALLBACK ==================================
    // ✅ SISTEM I PËRMBYLLUR ME OPENAI SI PRIMARY
async handleChatMessage(message) {
    try {
        console.log('💬 Duke përpunuar mesazhin:', message.substring(0, 50));
        
        // 1. PROVO SË PARI ME OPENAI (primary)
        console.log('🔮 Duke përdorur OpenAI si primary...');
        const openaiResult = await this.sendToOpenAI(message);
        
        if (openaiResult.success) {
            return openaiResult;
        }
        
        // 2. Nëse OpenAI dështon, provo me Gemini (fallback)
        console.log('🔄 OpenAI dështoi, duke provuar Gemini...');
        const geminiResult = await this.sendToGemini(message);
        
        if (geminiResult.success) {
            return geminiResult;
        }
        
        // 3. Nëse të dy dështojnë, kthe mesazh default
        return {
            success: false,
            response: '❌ Asnjë shërbim AI nuk është i disponueshëm. Ju lutem kontrolloni konfigurimin e API Keys.',
            source: 'error'
        };
        
    } catch (error) {
        console.error('❌ Gabim në handleChatMessage:', error);
        return {
            success: false,
            response: '❌ Gabim në server. Ju lutem provoni përsëri.',
            source: 'error'
        };
    }
}

// ================================================ ✅ DËRGO TE GEMINI ==========================================
    async sendToGemini(message) {
        try {
            const response = await fetch('/api/gemini/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ message })
            });
            
            const data = await response.json();
            
            if (data.success) {
                return {
                    success: true,
                    response: data.response,
                    source: 'gemini'
                };
            } else {
                return {
                    success: false,
                    error: data.error,
                    source: 'gemini',
                    fallback: true
                };
            }
        } catch (error) {
            console.error('❌ Gabim në Gemini:', error);
            return {
                success: false,
                error: error.message,
                source: 'gemini',
                fallback: true
            };
        }
    }

    // ✅ DËRGO TE OPENAI
    async sendToOpenAI(message) {
        try {
            const response = await fetch('/api/openai-enhanced/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ message })
            });
            
            const data = await response.json();
            
            if (data.success) {
                return {
                    success: true,
                    response: data.response,
                    source: 'openai'
                };
            } else {
                return {
                    success: false,
                    error: data.error,
                    source: 'openai'
                };
            }
        } catch (error) {
            console.error('❌ Gabim në OpenAI:', error);
            return {
                success: false,
                error: error.message,
                source: 'openai'
            };
        }
    }

    // ✅ VENDOS KUR TË PËRDORET OPENAI
    shouldUseOpenAIFallback(result, originalMessage) {
        // Nëse Gemini dështon, përdor OpenAI
        if (!result.success || result.fallback) return true;
        
        // Pyetje komplekse që kërkojë OpenAI
        const openaiKeywords = [
            'openai', 'gpt', 'gpt-4', 'chatgpt', 'ai avancuar', 
            'inteligjencë e përparuar', 'krijo', 'shkruaj', 
            'analizo', 'shpjego', 'kupto', 'interpret', 'kompozo',
            'propozim', 'ide', 'kreativ', 'imagjinatë'
        ];
        
        const lowerMessage = originalMessage.toLowerCase();
        const hasOpenAIKeyword = openaiKeywords.some(keyword => lowerMessage.includes(keyword));
        
        // Pyetje të gjata dhe komplekse
        const isComplexQuestion = originalMessage.length > 50 && 
                                 (lowerMessage.includes('?') || 
                                  lowerMessage.includes('si') || 
                                  lowerMessage.includes('pse'));
        
        return hasOpenAIKeyword || isComplexQuestion;
    }

    // ✅ SHFAQ MESAZH NË CHAT
    addMessageToChat(message, sender, source = 'gemini') {
        const chat = document.getElementById('chat');
        if (!chat) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        let sourceBadge = '';
        if (sender === 'bot') {
            if (source === 'openai') {
                sourceBadge = '<span class="source-badge openai-badge">🔮 OpenAI</span>';
            } else if (source === 'gemini') {
                sourceBadge = '<span class="source-badge gemini-badge">🤖 Gemini</span>';
            }
        }
        
        messageDiv.innerHTML = `
            <div class="message-text">${this.formatMessage(message)}</div>
            ${sourceBadge}
        `;
        
        chat.appendChild(messageDiv);
        chat.scrollTop = chat.scrollHeight;
    }

    // ✅ FORMAT MESAZHIN (me markdown të thjeshtë)
    formatMessage(message) {
        // Zëvendëso **tekst** me <strong>
        let formatted = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Zëvendëso *tekst* me <em>
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Zëvendëso `kod` me <code>
        formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');
        
        return formatted;
    }

    // ✅ LOADING INDICATOR
    showLoadingIndicator() {
        const chat = document.getElementById('chat');
        if (!chat) return;

        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-indicator';
        loadingDiv.className = 'message bot loading';
        loadingDiv.innerHTML = `
            <div class="message-text">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        chat.appendChild(loadingDiv);
        chat.scrollTop = chat.scrollHeight;
    }

    hideLoadingIndicator() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }

    // ✅ FSHI HISTORINË E CHAT-IT
    clearChat() {
        const chat = document.getElementById('chat');
        if (chat) {
            chat.innerHTML = '';
            console.log('🗑️ Chat history u fshi');
        }
    }

    // ✅ NGARKO HISTORINË
    loadChatHistory() {
        // Mund të implementohet më vonë për të ngarkuar historinë nga localStorage
        console.log('📖 Duke ngarkuar historinë e chat-it...');
    }
}

// ==================== STILET PËR CHAT ====================
const chatStyles = `
<style>
.message {
    margin: 10px 0;
    padding: 12px 15px;
    border-radius: 18px;
    max-width: 80%;
    word-wrap: break-word;
    animation: fadeIn 0.3s ease-in;
}

.message.user {
    background: #007bff;
    color: white;
    margin-left: auto;
    border-bottom-right-radius: 5px;
}

.message.bot {
    background: #f1f3f4;
    color: #333;
    margin-right: auto;
    border-bottom-left-radius: 5px;
}

.message.loading {
    background: #f8f9fa;
}

.source-badge {
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 10px;
    margin-left: 8px;
    font-weight: bold;
}

.openai-badge {
    background: #9C27B0;
    color: white;
}

.gemini-badge {
    background: #4285F4;
    color: white;
}

.typing-indicator {
    display: flex;
    align-items: center;
    height: 20px;
}

.typing-indicator span {
    height: 8px;
    width: 8px;
    background: #666;
    border-radius: 50%;
    display: inline-block;
    margin: 0 2px;
    animation: bounce 1.3s linear infinite;
}

.typing-indicator span:nth-child(2) {
    animation-delay: 0.15s;
}

.typing-indicator span:nth-child(3) {
    animation-delay: 0.3s;
}

@keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-5px); }
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.message-text code {
    background: #e9ecef;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Fira Code', monospace;
    font-size: 0.9em;
}

.message-text strong {
    font-weight: 600;
}

.message-text em {
    font-style: italic;
}
</style>
`;

// ==================== INICIALIZIMI I SISTEMIT ====================

// Shto stilet në document
document.head.insertAdjacentHTML('beforeend', chatStyles);

// Krijo instancën globale të sistemit të chat-it
window.chatSystem = new ChatAISystem();

// Funksione globale për akses nga HTML
window.sendMessage = () => window.chatSystem.sendMessage();
window.clearChat = () => window.chatSystem.clearChat();

console.log('🚀 Chat AI System u ngarkua me sukses!');
