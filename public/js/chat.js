// ======================================================
// 🚀 chat.js - RRUFE-TESLA 10.5 - VERSION I PLOTË
// ======================================================

console.log("🎯 chat.js - RRUFE-TESLA 10.5 po ngarkohet...");

// ======================================================
// 📊 VARIABLA GLOBALE
// ======================================================

let currentUser = null;
let chatHistory = [];
let isTyping = false;
window.currentAIMode = 'SIMPLE'; // SIMPLE, ADVANCED, DIVINE

// ======================================================
// 🧠 LOCAL CHAT INTELLIGENCE SYSTEM
// ======================================================

class LocalChatIntelligence {
    constructor() {
        this.knowledgeBase = {
            greetings: {
                patterns: ['pershendetje', 'hello', 'hi', 'tung', 'ciao', 'mirëmëngjes', 'mirëdita', 'mirëmbrëma', 'çkemi'],
                responses: [
                    'Përshëndetje! 😊 Mirë se ju gjetëm në RRUFE-TESLA!',
                    'Hello! Si mund t\'ju ndihmoj sot?',
                    'Tungjatjeta! Gëzohem që ju shoh!',
                    'Përshëndetje! Çfarë mund të bëj për ju?',
                    'Mirë se vini! Unë jam RRUFE-TESLA 10.5'
                ]
            },
            farewells: {
                patterns: ['mirupafshim', 'bye', 'lamtumirë', 'shëndet', 'flm', 'faleminderit', 'thanks'],
                responses: [
                    'Mirupafshim! 😊 Ishte kënaqësi të flisja me ju!',
                    'Lamtumirë! Shpresoj të flasim sërish!',
                    'Faleminderit! Ju uroj një ditë të mbarë!',
                    'Shëndet! Mos u largoni shumë!'
                ]
            },
            help: {
                patterns: ['ndihmo', 'help', 'komanda', 'si punon', 'çfarë mund të bësh', '/ndihmo'],
                responses: [
                    `🧠 **RRUFE-TESLA 10.5 - SISTEMI I KOMANDAVE**

📋 **KOMANDAT BAZE:**
• /ndihmo - Shfaq këtë listë
• /wiki [kerko] - Kërko në Wikipedia
• /perkthim [gjuha] [tekst] - Përkthim tekst
• /moti [qyteti] - Informacion moti
• /llogarit [shprehje] - Llogarit matematikë

🎯 **MODALITETET AI:**
• 🔹 Normal - AI i thjeshtë dhe i shpejtë
• 🌌 RRUFE - Sistemi i avancuar me memorie
• ⚡ Divine - Fuqi e plotë hyjnore

💡 **SHEMBUJ:**
• /wiki Shqipëria
• /perkthim anglisht "Mirëdita"
• /moti Tiranë
• /llogarit 2+2*3

🚀 **Funksionalitete:**
• Memorie afatgjatë
• Përpunim zëri
• Multi-modalitet
• Integrim divine`
                ]
            },
            math: {
                patterns: ['+', '-', '*', '/', '^', 'llogarit', 'sa është', '='],
                responses: []
            },
            rrufe: {
                patterns: ['rrufe', 'tesla', 'rrufe-tesla', '10.5', 'sistemi'],
                responses: [
                    '⚡ **RRUFE-TESLA 10.5** - Sistemi i avancuar i inteligjencës artificiale me memorie afatgjatë dhe integrim divine!',
                    '🏔️ Unë jam RRUFE-TESLA 10.5 - Asistenti juar inteligjent me teknologji të avancuar!',
                    '🌌 RRUFE-TESLA 10.5 është aktiv! Kam memorie afatgjatë dhe mundësi të pafundme!'
                ]
            },
            time: {
                patterns: ['sa është ora', 'ora', 'koha', 'data', 'datë'],
                responses: []
            }
        };
    }

    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // Kontrollo komanda speciale
        if (this.isSpecialCommand(message)) {
            return this.processSpecialCommand(message);
        }
        
        // Kontrollo nëse është matematikë
        if (this.isMathExpression(message)) {
            return this.solveMath(message);
        }
        
        // Kontrollo kohën
        if (lowerMessage.includes('ora') || lowerMessage.includes('koha') || lowerMessage.includes('data')) {
            return this.getCurrentTime();
        }
        
        // Kontrollo kategori të tjera
        for (let category in this.knowledgeBase) {
            for (let pattern of this.knowledgeBase[category].patterns) {
                if (lowerMessage.includes(pattern)) {
                    const responses = this.knowledgeBase[category].responses;
                    if (responses.length > 0) {
                        return responses[Math.floor(Math.random() * responses.length)];
                    }
                }
            }
        }
        
        // Përgjigje default
        return this.getDefaultResponse();
    }

    isSpecialCommand(message) {
        const commands = ['/ndihmo', '/wiki', '/perkthim', '/moti', '/llogarit', '/google'];
        return commands.some(cmd => message.toLowerCase().startsWith(cmd));
    }

    processSpecialCommand(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.startsWith('/wiki')) {
            const query = message.substring(6).trim();
            return query ? `🌐 Duke kërkuar në Wikipedia për: "${query}"` : '📝 Shkruani: /wiki [temë]';
        }
        
        if (lowerMessage.startsWith('/perkthim')) {
            const rest = message.substring(10).trim();
            return rest ? `🔤 Duke përkthyer: "${rest}"` : '🌐 Shkruani: /perkthim [gjuha] [tekst]';
        }
        
        if (lowerMessage.startsWith('/moti')) {
            const city = message.substring(6).trim();
            return city ? `🌤️ Duke kontrolluar motin për: ${city}` : '🏙️ Shkruani: /moti [qyteti]';
        }
        
        if (lowerMessage.startsWith('/llogarit')) {
            const expr = message.substring(10).trim();
            return expr ? this.solveMath(expr) : '🧮 Shkruani: /llogarit [shprehje matematikore]';
        }
        
        if (lowerMessage.startsWith('/google')) {
            const query = message.substring(8).trim();
            return query ? `🔍 Duke kërkuar në Google për: "${query}"` : '📝 Shkruani: /google [kërkim]';
        }
        
        return this.getDefaultResponse();
    }

    isMathExpression(text) {
        // Kontrollo nëse është shprehje matematikore
        const cleanText = text.replace(/\s/g, '');
        const mathRegex = /^[\d+\-*/().^]+$/;
        return mathRegex.test(cleanText) || text.toLowerCase().includes('llogarit');
    }

    solveMath(expression) {
        try {
            // Nxjerr shprehjen nga komanda
            let mathExpr = expression;
            if (mathExpr.toLowerCase().startsWith('/llogarit')) {
                mathExpr = mathExpr.substring(10).trim();
            }
            
            // Pastro dhe siguro shprehjen
            let cleanExpr = mathExpr.replace(/[^0-9+\-*/().^]/g, '');
            
            // Zëvendëso ^ me ** për fuqi
            cleanExpr = cleanExpr.replace(/\^/g, '**');
            
            // Përdor Function constructor për llogaritje të sigurt
            const result = Function(`"use strict"; return (${cleanExpr})`)();
            
            return `🧮 **${mathExpr}** = **${result}**`;
        } catch (error) {
            return '❌ Nuk mund ta llogaris shprehjen matematikore. Kontrolloni sintaksën.';
        }
    }

    getCurrentTime() {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        };
        return `🕒 **Data dhe ora:** ${now.toLocaleDateString('sq-AL', options)}`;
    }

    getDefaultResponse() {
        const defaultResponses = [
            'Interesante! Çfarë mendoni ju për këtë?',
            'E kuptoj! A keni ndonjë pyetje tjetër?',
            'Faleminderit për këtë informacion!',
            'Po dëgjoj... vazhdoni ju lutem!',
            'Kjo është shumë interesante!',
            'Mund të më tregoni më shumë për këtë?',
            'Shkëlqyeshëm! Si mund të vazhdojmë?'
        ];
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
}

// ======================================================
// 💬 FUNKSIONET KRYESORE TË CHAT
// ======================================================

function addMessage(text, sender) {
    const chat = document.getElementById('chat');
    if (!chat) {
        console.error('❌ Elementi #chat nuk u gjet!');
        return;
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const timestamp = new Date().toLocaleTimeString('sq-AL', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <span class="message-text">${formatMessage(text)}</span>
            <span class="message-time">${timestamp}</span>
        </div>
    `;
    
    chat.appendChild(messageDiv);
    chat.scrollTop = chat.scrollHeight;
    
    // Ruaj në historinë lokale
    chatHistory.push({ text, sender, timestamp: new Date().toISOString() });
}

function formatMessage(text) {
    // Formatimi i thjeshtë i tekstit
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>')
        .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
}

function showTypingIndicator() {
    if (isTyping) return;
    
    const chat = document.getElementById('chat');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'message bot typing';
    typingDiv.innerHTML = `
        <div class="message-content">
            <span class="message-text">
                <span class="typing-dots">
                    <span>.</span><span>.</span><span>.</span>
                </span>
            </span>
        </div>
    `;
    
    chat.appendChild(typingDiv);
    chat.scrollTop = chat.scrollHeight;
    isTyping = true;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    isTyping = false;
}

// ======================================================
// 🎯 FUNKSIONI KRYESOR I DËRGIMIT TË MESAZHEVE
// ======================================================

async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    input.value = '';
    hideEmojiPanel();

    try {
        // Shto mesazhin e përdoruesit
        addMessage(message, 'user');
        showTypingIndicator();

        // 🆗 KONTROLLO STATUSIN E API KEY
        const hasApiKey = await checkApiKeyStatus();
        
        let response;
        
        if (hasApiKey && window.currentAIMode !== 'SIMPLE') {
            // 🎯 PËRDOR GEMINI (PLOTË FUNKSIONALITET)
            console.log('🚀 Duke përdorur Gemini AI...');
            response = await processWithGeminiAI(message);
        } else {
            // 🧠 PËRDOR SISTEMIN LOKAL (BACKUP MODE)
            console.log('🧠 Duke përdorur sistemin lokal...');
            const localAI = new LocalChatIntelligence();
            response = localAI.processMessage(message);
            
            // Simuloj një vonesë të vogël
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Shfaq notifikim për backup mode
            if (typeof showMemoryNotification !== 'undefined') {
                showMemoryNotification('🧠 Duke përdorur sistemin lokal', 'info');
            }
        }

        hideTypingIndicator();
        addMessage(response, 'bot');

        // 💾 RUAJ NË MEMORIE PAVARËSISHT
        if (window.ltmManager) {
            window.ltmManager.addUserMessage(message);
            window.ltmManager.addAIResponse(response);
            
            // Update memory display
            if (typeof updateMemoryDisplay !== 'undefined') {
                updateMemoryDisplay();
            }
            
            // Shfaq notifikim
            if (typeof showMemoryNotification !== 'undefined') {
                showMemoryNotification('💾 Mesazhi u ruajt në memorie!', 'success');
            }
        }

    } catch (error) {
        console.error('❌ Gabim në sendMessage:', error);
        hideTypingIndicator();
        addMessage('❌ Gabim në sistem. Provo përsëri.', 'system');
    }
}

// ======================================================
// 🔗 INTEGRIMI ME GEMINI AI
// ======================================================

async function processWithGeminiAI(message) {
    try {
        // Përdor Long-Term Memory nëse ekziston
        let payload;
        if (window.ltmManager) {
            payload = window.ltmManager.generateGeminiPayload(message);
        } else {
            payload = {
                contents: [{
                    role: 'user',
                    parts: [{ text: message }]
                }]
            };
        }

        const response = await fetch('/api/chat/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Serveri ktheu ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.response) {
            return data.response;
        } else {
            throw new Error(data.message || 'Përgjigje e papritur nga serveri');
        }

    } catch (error) {
        console.error('❌ Gabim në processWithGeminiAI:', error);
        
        // Fallback në sistemin lokal
        const localAI = new LocalChatIntelligence();
        return localAI.processMessage(message);
    }
}

// ======================================================
// 🔧 FUNKSIONE NDIHMËSE
// ======================================================

async function checkApiKeyStatus() {
    try {
        const response = await fetch('/api/api-keys/status/gemini', {
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.success && data.hasApiKey;
        }
        return false;
    } catch (error) {
        console.error('❌ Gabim në kontrollimin e API Key:', error);
        return false;
    }
}

function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('❌ Ju lutem plotësoni të dy fushat!');
        return;
    }

    // Simulim i login-it
    currentUser = {
        username: username,
        isAdmin: username.toLowerCase() === 'admin'
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Shfaq chat screen
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('chat-screen').style.display = 'block';
    
    // Update profile
    updateUserProfile();
    
    // Shto mesazh mirëseardhjeje
    addMessage(`👑 Mirë se erdhe ${username}! Si mund të ndihmoj sot?`, 'bot');
    
    // Inicializo LTM nëse ekziston
    if (typeof initializeLTMForChat !== 'undefined') {
        initializeLTMForChat();
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    chatHistory = [];
    
    document.getElementById('chat-screen').style.display = 'none';
    document.getElementById('login-screen').style.display = 'block';
    
    // Pastro chat
    const chat = document.getElementById('chat');
    if (chat) {
        chat.innerHTML = '';
    }
}

function updateUserProfile() {
    const profileName = document.getElementById('profile-name');
    const profilePic = document.getElementById('profile-pic');
    
    if (profileName && currentUser) {
        profileName.textContent = currentUser.username;
        if (currentUser.isAdmin) {
            profileName.innerHTML = '👑 ' + currentUser.username;
        }
    }
}

// ======================================================
// 🎭 SISTEMI I MODALITETEVE TË AI
// ======================================================

function activateSimpleAI() {
    window.currentAIMode = 'SIMPLE';
    addMessage('🔹 **AI i Thjeshtë i aktivizuar** - Chat-i do të jetë i shpejtë dhe natyral!', 'system');
    
    // Update UI
    updateAIModeButtons();
}

function activateAdvancedAI() {
    window.currentAIMode = 'ADVANCED';
    addMessage('🌌 **RRUFE-TESLA i avancuar i aktivizuar** - Tani kam akses në memorie dhe fuqi të shtuar!', 'system');
    
    // Update UI
    updateAIModeButtons();
    
    // Aktivizo modulet e avancuara
    if (window.rrufePlatform) {
        window.rrufePlatform.activateAdvancedModules();
    }
}

function activateDivineAI() {
    window.currentAIMode = 'DIVINE';
    addMessage('⚡ **AI Hyjnor i aktivizuar** - Divine Fusion aktiv! Të gjitha modulet janë operative!', 'system');
    
    // Update UI
    updateAIModeButtons();
    
    // Aktivizo Divine Fusion
    if (typeof activateDivineFusion !== 'undefined') {
        activateDivineFusion();
    }
}

function updateAIModeButtons() {
    // Kjo funksion do të implementohet në UI
    console.log(`🎭 Modaliteti aktual i AI: ${window.currentAIMode}`);
}

// ======================================================
// 😊 SISTEMI I EMOJIVE
// ======================================================

function toggleEmojiPanel() {
    const panel = document.getElementById('emoji-panel');
    if (panel) {
        panel.classList.toggle('hidden');
    }
}

function hideEmojiPanel() {
    const panel = document.getElementById('emoji-panel');
    if (panel) {
        panel.classList.add('hidden');
    }
}

function addEmoji(emoji) {
    const input = document.getElementById('user-input');
    if (input) {
        input.value += emoji;
        input.focus();
    }
    hideEmojiPanel();
}

// ======================================================
// 📁 MENAXHIMI I HISTORISË
// ======================================================

function downloadHistory() {
    if (chatHistory.length === 0) {
        alert('❌ Nuk ka histori për të shkarkuar!');
        return;
    }

    const dataStr = JSON.stringify(chatHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `rrufe-tesla-chat-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    addMessage('💾 Historia u eksportua në formatin JSON!', 'system');
}

function clearHistory() {
    if (confirm('⚠️ Jeni i sigurt që dëshironi të fshini të gjithë historinë?')) {
        chatHistory = [];
        const chat = document.getElementById('chat');
        if (chat) {
            chat.innerHTML = '';
        }
        addMessage('🗑️ E gjithë historia u fshi!', 'system');
    }
}

// ======================================================
// 🧠 LONG-TERM MEMORY INTEGRATION - FUNKSIONET E REJA
// ======================================================

async function initializeLTMForChat() {
    console.log('🎯 initializeLTMForChat - Duke inicializuar Long-Term Memory...');
    
    try {
        // Kontrollo nëse LTM Manager ekziston
        if (typeof LongTermMemoryManager === 'undefined') {
            console.warn('⚠️ LongTermMemoryManager nuk është i ngarkuar');
            return null;
        }

        const userId = getCurrentUserId() || 'guest_user';
        
        // Krijo instancën e LTM
        const ltmManager = new LongTermMemoryManager(userId, null);
        await ltmManager.initialize();
        
        console.log('✅ Long-Term Memory u inicializua për chat!');
        
        // Ruaj në variabël globale
        window.ltmManager = ltmManager;
        
        // Shto në platformën RRUFE-TESLA nëse ekziston
        if (window.rrufePlatform) {
            window.rrufePlatform.modules.longTermMemory = ltmManager;
            console.log('✅ LTM u shtua në modulet e RRUFE-TESLA');
        }
        
        // Inicializo memory interface
        if (typeof initializeMemoryInterface !== 'undefined') {
            initializeMemoryInterface();
        }
        
        return ltmManager;
        
    } catch (error) {
        console.error('❌ Gabim në inicializimin e LTM për chat:', error);
        return null;
    }
}

function getCurrentUserId() {
    if (currentUser && currentUser.username) {
        return currentUser.username;
    }
    
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            return user.username || 'user_' + Date.now();
        } catch (e) {
            return 'user_' + Date.now();
        }
    }
    
    return 'user_' + Date.now();
}

function showMemoryStats() {
    if (!window.ltmManager) {
        console.log('❌ LTM Manager nuk është inicializuar');
        addMessage('❌ Long-Term Memory nuk është aktiv!', 'system');
        return;
    }
    
    const stats = window.ltmManager.getMemoryStats();
    const message = `🧠 **Statistikat e Memories:**

📊 **Total Mesazhe:** ${stats.total_messages}
👤 **Mesazhe User:** ${stats.user_messages}
🤖 **Mesazhe AI:** ${stats.ai_messages}
💾 **Kapaciteti:** ${stats.capacity}
🕒 **Përditësuar:** ${stats.last_updated ? new Date(stats.last_updated).toLocaleTimeString() : 'N/A'}

*Memoria ruan 50 mesazhet e fundit për kontekst optimal.*`;
    
    addMessage(message, 'system');
}

function quickLTMTEST() {
    console.log('🧪 TEST I SHPEJTË I LTM:');
    console.log('- LTM Manager:', typeof LongTermMemoryManager);
    console.log('- LTM Instance:', !!window.ltmManager);
    
    if (window.ltmManager) {
        const stats = window.ltmManager.getMemoryStats();
        console.log('- Memory Stats:', stats);
        addMessage(`🧪 **Test LTM:** ✅ Aktiv\n📊 Mesazhe: ${stats.total_messages}`, 'system');
    } else {
        console.log('- ❌ LTM not active');
        addMessage('🧪 **Test LTM:** ❌ Jo aktiv', 'system');
    }
}

// ======================================================
// 🚀 INICIALIZIMI I SISTEMIT
// ======================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM u ngarkua - Duke inicializuar sistemin...');
    
    // Kontrollo nëse përdoruesi është loguar
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('chat-screen').style.display = 'block';
            updateUserProfile();
            
            // Shto mesazh mirëseardhjeje
            addMessage(`👑 Mirë se erdhe përsëri ${currentUser.username}! RRUFE-TESLA 10.5 është gati.`, 'bot');
            
        } catch (error) {
            console.error('❌ Gabim në loadimin e përdoruesit:', error);
        }
    }
    
    // Inicializo event listeners
    initializeEventListeners();
    
    // Inicializo LTM pas 2 sekondash
    setTimeout(() => {
        if (typeof LongTermMemoryManager !== 'undefined' && !window.ltmManager) {
            initializeLTMForChat();
        }
    }, 2000);
});

function initializeEventListeners() {
    // Butoni i dërgimit
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    
    if (sendBtn && userInput) {
        sendBtn.addEventListener('click', sendMessage);
        
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Butoni i emojive
    const emojiBtn = document.getElementById('emoji-btn');
    if (emojiBtn) {
        emojiBtn.addEventListener('click', toggleEmojiPanel);
    }
    
    // Butonat e emojive
    const emojiSpans = document.querySelectorAll('#emoji-panel span');
    emojiSpans.forEach(span => {
        span.addEventListener('click', function() {
            addEmoji(this.textContent);
        });
    });
    
    // Butonat e menaxhimit
    const downloadBtn = document.getElementById('download-history');
    const clearBtn = document.getElementById('clear-history');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadHistory);
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearHistory);
    }
}

// ======================================================
// 🌐 EKSPORTIMI I FUNKSIONEVE GLOBALE
// ======================================================

window.sendMessage = sendMessage;
window.addMessage = addMessage;
window.login = login;
window.logout = logout;
window.activateSimpleAI = activateSimpleAI;
window.activateAdvancedAI = activateAdvancedAI;
window.activateDivineAI = activateDivineAI;
window.downloadHistory = downloadHistory;
window.clearHistory = clearHistory;
window.toggleEmojiPanel = toggleEmojiPanel;
window.addEmoji = addEmoji;
window.initializeLTMForChat = initializeLTMForChat;
window.showMemoryStats = showMemoryStats;
window.quickLTMTEST = quickLTMTEST;

console.log("✅ chat.js - RRUFE-TESLA 10.5 u inicializua me sukses!");

// ==================== 🔄 MEMORY DISPLAY INTEGRATION ====================

// Force update memory display pas çdo mesazhi
const originalSendMessage = window.sendMessage;
window.sendMessage = async function() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (!message) return;
    input.value = '';
    hideEmojiPanel();

    try {
        addMessage(message, 'user');
        showTypingIndicator();

        // ... kodi ekzistues i sendMessage ...
        
        // PASI TË KRYHET PROCESIMI, SHTO KËTO:
        hideTypingIndicator();
        addMessage(response, 'bot');

        // 🆕 FORCE MEMORY UPDATE
        if (window.ltmManager) {
            window.ltmManager.addUserMessage(message);
            window.ltmManager.addAIResponse(response);
            
            // Update memory display me vonesë të vogël
            setTimeout(() => {
                if (typeof updateMemoryDisplay !== 'undefined') {
                    updateMemoryDisplay();
                }
                if (typeof showMemoryNotification !== 'undefined') {
                    showMemoryNotification('💾 Mesazhi u ruajt në memorie!', 'success');
                }
            }, 500);
        }

    } catch (error) {
        console.error('Gabim:', error);
        hideTypingIndicator();
        addMessage('❌ Gabim në sistem. Provo përsëri.', 'system');
    }
};

console.log("✅ Memory Display Integration u shtua në chat.js!");
