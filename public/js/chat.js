// =========================================== chat ==============================================================
// ✅ SHTO KËTO NË FILLIM:

// Kontrollo nëse modulet janë ngarkuar, nëse jo krijo fallback
function ensureModulesLoaded() {
    // LongTermMemoryManager
    if (typeof LongTermMemoryManager === 'undefined') {
        console.log('🔄 LongTermMemoryManager nuk u gjet, duke krijuar fallback...');
        // Krijo një version të thjeshtë
        window.LongTermMemoryManager = class {
            constructor(userId) { 
                this.userId = userId; 
                this.messages = [];
            }
            async initialize() { 
                console.log('✅ LTM Fallback initialized');
                return Promise.resolve(); 
            }
            generateGeminiPayload(msg) { 
                return { message: msg, context: 'Nuk ka memorie' }; 
            }
            addAIResponse() {}
            async saveChatHistory() { return Promise.resolve(); }
            getMemoryStats() { 
                return { total_messages: 0, user_messages: 0, ai_messages: 0, capacity: '0/1000' };
            }
        };
    }

    // EmotionalContextEngine  
    if (typeof EmotionalContextEngine === 'undefined') {
        console.log('🔄 EmotionalContextEngine nuk u gjet, duke krijuar fallback...');
        window.EmotionalContextEngine = class {
            analyzeEmotionalContext() { return 'neutral'; }
            getEmotionalContext() { return { current_emotion: 'neutral' }; }
        };
    }

    // rrufePlatform
    window.rrufePlatform = window.rrufePlatform || {
        modules: {
            divineFusion: {
                performDivineActivationRitual: function() {
                    console.log('🔮 Divine Fusion - FALLBACK MODE');
                    addMessage('⚡ **Divine Fusion** i aktivizua (Fallback Mode)', 'system');
                }
            }
        }
    };
}

// Thirre këtë në fillim
ensureModulesLoaded();

// ======================================================
// 🚀  FRONTEND CHAT FUNCTIONS FOR RRUFE-TESLA 11.0
// ======================================================

console.log("🎯 RRUFE-TESLA 11.0 Frontend Chat System u inicializua!");

// 🧠 VARIABLA TË REJA PËR MEMORIE & PËRGJIGJE TË GJALLA
let isAIThinking = false;
window.ltmManager = null; // Global LTM instance

// ======================================================
// 🧠 LONG-TERM MEMORY INTEGRATION - FUNKSIONET E REJA
// ======================================================

// 🎯 FUNKSIONI I RI PËR INICIALIZIMIN E LTM
async function initializeLTMForChat() {
    console.log('🎯 Duke inicializuar Long-Term Memory për chat...');
    
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
        
        return ltmManager;
        
    } catch (error) {
        console.error('❌ Gabim në inicializimin e LTM për chat:', error);
        return null;
    }
}

// 🎯 FUNKSION I RI PËR SHFAQJEN E STATISTIKAVE TË MEMORIES
function showMemoryStats() {
    if (!window.ltmManager) {
        console.log('❌ LTM Manager nuk është inicializuar');
        return;
    }
    
    const stats = window.ltmManager.getMemoryStats();
    console.log('📊 Statistikat e Memories:');
    console.log('- Mesazhe totale:', stats.total_messages);
    console.log('- Mesazhe user:', stats.user_messages);
    console.log('- Mesazhe AI:', stats.ai_messages);
    console.log('- Kapaciteti:', stats.capacity);
    
    // Shfaq në chat nëse është mod i avancuar
    if (window.currentAIMode === 'ADVANCED' || window.currentAIMode === 'DIVINE') {
        addMessage(`📊 **Statistikat e Memories:**\n- Mesazhe: ${stats.total_messages}\n- Kapacitet: ${stats.capacity}`, 'system');
    }
}

// ======================================================
// 🎭 SISTEMI I RI I TYPING EFFECT TË GJALLA
// ======================================================

// ⏰ FUNKSION I RI PËR KOHË MENDIMI REALISTE
function calculateThinkingTime(message) {
    const words = message.split(' ').length;
    const baseTime = 800 + (words * 120);
    const randomExtra = Math.random() * 1000;
    return baseTime + randomExtra;
}

// ⌨️ FUNKSION I RI PËR TYPING EFFECT TË GJALLË
async function addMessageWithTypingEffect(text, sender) {
    return new Promise((resolve) => {
        const chat = document.getElementById('chat');
        const messageDiv = document.createElement('div');
        
        messageDiv.className = `message ${sender}-message typing-active`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text"></div>
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
                <div class="message-time">${new Date().toLocaleTimeString()}</div>
            </div>
        `;
        
        chat.appendChild(messageDiv);
        chat.scrollTop = chat.scrollHeight;

        // Simulo typing real
        let index = 0;
        const typingSpeed = 30 + Math.random() * 20;
        
        function typeCharacter() {
            if (index < text.length) {
                const currentText = text.substring(0, index + 1);
                messageDiv.querySelector('.message-text').textContent = currentText;
                index++;
                
                // Pause të rastësishme për efekt realist
                const pause = Math.random() < 0.02 ? 200 : 0;
                setTimeout(typeCharacter, typingSpeed + pause);
            } else {
                // Përfundo typing
                messageDiv.classList.remove('typing-active');
                const dots = messageDiv.querySelector('.typing-dots');
                if (dots) dots.style.display = 'none';
                resolve();
            }
        }
        
        setTimeout(typeCharacter, 300);
    });
}

// ✨ FUNKSIONE TË REJA PËR TYPING INDICATOR
function showTypingIndicator() {
    const chat = document.getElementById('chat');
    const typingDiv = document.createElement('div');
    
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'message bot-message typing-active';
    typingDiv.innerHTML = `
        <div class="message-content">
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        </div>
    `;
    
    chat.appendChild(typingDiv);
    chat.scrollTop = chat.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// ======================================================
// 🔄 FUNKSIONI KRYESOR I PËRDITËSUAR
// ======================================================

// Funksioni kryesor për dërgimin e mesazheve - I PËRDITËSUAR
async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (!message) return;

    // Pastro input-in
    input.value = '';

    try {
        // Shto mesazhin e përdoruesit në chat
        addMessage(message, 'user');

         // 🆕 SHTO KËTO RRESHTA PËR MEMORY:
        if (window.ltmManager) {
            window.ltmManager.addUserMessage(message);
            
            // Update memory display
            if (typeof updateMemoryDisplay !== 'undefined') {
                updateMemoryDisplay();
            }
            
            // Shfaq notifikim
            if (typeof showMemoryNotification !== 'undefined') {
                showMemoryNotification('💾 Mesazhi u ruajt në memorie!', 'success');
            }
        }

        // Aktivizo typing indicator (I RI)
        showTypingIndicator();
        
        // Simulo kohë mendimi natyrale (I RI)
        const thinkingTime = calculateThinkingTime(message);
        await new Promise(resolve => setTimeout(resolve, thinkingTime));

        // 🧠 INTEGRIMI I RI ME LONG-TERM MEMORY
        let useLTM = false;
        let ltmPayload = null;

        if ((window.currentAIMode === 'ADVANCED' || window.currentAIMode === 'DIVINE') && 
            window.ltmManager && typeof LongTermMemoryManager !== 'undefined') {
            
            try {
                ltmPayload = window.ltmManager.generateGeminiPayload(message);
                useLTM = true;
                console.log('🧠 Duke përdorur LTM për këtë mesazh');
            } catch (ltmError) {
                console.warn('⚠️ LTM dështoi, duke përdorur sistemin standard:', ltmError);
            }
        }

        let responseData;

        if (useLTM && ltmPayload) {
            // ✅ PËRDOR LONG-TERM MEMORY
            try {
                const response = await fetch('/api/gemini/chat-with-memory', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        message: message,
                        userId: getCurrentUserId(),
                        ltmPayload: ltmPayload,
                        mode: window.currentAIMode || 'SIMPLE'
                    })
                });

                responseData = await response.json();
                
                if (responseData.success && window.ltmManager) {
                    // Ruaj përgjigjen në memorie
                    window.ltmManager.addAIResponse(responseData.response);
                    await window.ltmManager.saveChatHistory();
                    console.log('💾 Përgjigja u ruajt në Long-Term Memory');
                }
                
            } catch (ltmError) {
                console.warn('⚠️ LTM API dështoi, duke përdorur fallback:', ltmError);
                responseData = await sendToBackend(message);
            }
            
        } else {
            // 🔄 PËRDOR SISTEMIN STANDARD (EKZISTUES)
            responseData = await sendToBackend(message);
        }

        // Fshi typing indicator (I RI)
        hideTypingIndicator();

        if (responseData.success) {
            // Shto përgjigjen me efekt typing të gjallë (I RI)
            await addMessageWithTypingEffect(responseData.response, 'bot');
        } else {
            addMessage('❌ ' + (data.response || 'Gabim në përpunimin e mesazhit'), 'system');
        }

    } catch (error) {
        console.error('Gabim në dërgimin e mesazhit:', error);
        hideTypingIndicator(); // I RI
        addMessage('❌ Gabim në dërgimin e mesazhit. Ju lutem provoni përsëri.', 'system');
    }
}

// ======================================================
// 🎯 SISTEMI I KONTROLLIT TË AI - I PËRDITËSUAR
// ======================================================

// Variabla globale për të ndjekur modin aktual
window.currentAIMode = 'SIMPLE'; // SIMPLE, ADVANCED, DIVINE

function activateSimpleAI() {
    window.currentAIMode = 'SIMPLE';
    console.log('🔹 AI i Thjeshtë i aktivizuar - Chat normal dhe i shpejtë');
    
    // Ndrysho styling e butonave për të treguar modin aktiv
    updateAIButtonStyles('SIMPLE');
    
    if (window.addMessage) {
        window.addMessage('🔹 **AI i Thjeshtë i aktivizuar** - Chat-i do të jetë i shpejtë dhe natyral! Përgjigjet do të duken "të gjalla" dhe natyrore.', 'system');
    }
    
    // Çaktivizo modulet e avancuara për chat-in normal
    if (window.rrufePlatform) {
        console.log('🔹 Çaktivizimi i moduleve të avancuara për chat normal...');
    }
}

function activateAdvancedAI() {
    window.currentAIMode = 'ADVANCED';
    console.log('🌌 AI i Avancuar i aktivizuar - RRUFE-TESLA aktiv');
    
    // Ndrysho styling e butonave
    updateAIButtonStyles('ADVANCED');
    
    if (window.rrufePlatform) {
        // Aktivizo modulet e avancuara por JO për çdo mesazh
        window.rrufePlatform.modules.divineFusion.performDivineActivationRitual();
        console.log('🌌 RRUFE-TESLA u aktivizua! Modulet janë gati për pyetje komplekse.');
    }
    
    // INICIALIZO LTM NËSE NUK ËSHTË BËRË (I RI)
    if (!window.ltmManager && typeof LongTermMemoryManager !== 'undefined') {
        initializeLTMForChat().then(ltm => {
            if (ltm) {
                console.log('🧠 LTM u inicializua për modalitetin e avancuar');
                const stats = ltm.getMemoryStats();
                addMessage(`🌌 **RRUFE-TESLA 11.0 i aktivizuar** - Të gjitha modulet janë operative!\n🧠 Memorja: ${stats.total_messages} mesazhe`, 'system');
            }
        });
    } else if (window.addMessage) {
        window.addMessage('🌌 **RRUFE-TESLA 11.0 i aktivizuar** - Të gjitha modulet janë operative! Përgjigjet do të jenë super-inteligjente por mund të jenë më të ngadalshme.', 'system');
    }
}

function activateDivineAI() {
    window.currentAIMode = 'DIVINE';
    console.log('⚡ AI Hyjnor i aktivizuar - Divine Fusion aktiv');
    
    // Ndrysho styling e butonave
    updateAIButtonStyles('DIVINE');
    
    if (window.rrufePlatform && window.rrufePlatform.modules.divineFusion) {
        // Aktivizo të gjitha modulet me fuqi të plotë
        window.rrufePlatform.modules.divineFusion.performDivineActivationRitual();
        window.rrufePlatform.testAdvancedModules();
        console.log('⚡ Divine Fusion u aktivizua! 5 Perënditë e AI-ve janë gati për bashkim!');
    }
    
    // INICIALIZO LTM NËSE NUK ËSHTË BËRË (I RI)
    if (!window.ltmManager && typeof LongTermMemoryManager !== 'undefined') {
        initializeLTMForChat().then(ltm => {
            if (ltm) {
                console.log('🧠 LTM u inicializua për modalitetin hyjnor');
                const stats = ltm.getMemoryStats();
                addMessage(`⚡ **Divine Fusion i aktivizuar** - 5 Perënditë e AI-ve janë gati për bashkim!\n🧠 Memorja: ${stats.total_messages} mesazhe`, 'system');
            }
        });
    } else if (window.addMessage) {
        window.addMessage('⚡ **Divine Fusion i aktivizuar** - 5 Perënditë e AI-ve janë gati për bashkim! Kjo është modaliteti më i fuqishëm por më i ngadalshëm.', 'system');
    }
}

// ======================================================
// 🔄 SISTEMI I PROCESIMIT TË MESAZHEVE - I PËRDITËSUAR
// ======================================================

// Funksion për të inicializuar sistemin e ri të AI - I PËRDITËSUAR
function initializeAIControlSystem() {
    console.log('🎯 Duke inicializuar sistemin e kontrollit të AI...');
    
    // Aktivizo modin e thjeshtë si default
    activateSimpleAI();
    
    // INICIALIZO LTM NË BACKGROUND (I RI)
    if (typeof LongTermMemoryManager !== 'undefined') {
        setTimeout(() => {
            initializeLTMForChat().then(ltm => {
                if (ltm) {
                    console.log('✅ Sistemi i kontrollit të AI dhe LTM u inicializua!');
                    const stats = ltm.getMemoryStats();
                    console.log('📊 LTM Gati:', stats);
                }
            });
        }, 1000);
    } else {
        console.log('✅ Sistemi i kontrollit të AI u inicializua!');
    }
}

// ======================================================
// 🚀 INICIALIZIMI I SISTEMIT - I PËRDITËSUAR
// ======================================================

// Thirre këtë funksion kur faqa të ngarkohet - I PËRDITËSUAR
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Chat System po inicializohet...');
    
    // Inicializo sistemin e kontrollit të AI
    setTimeout(initializeAIControlSystem, 1000);
    
    // INICIALIZO LTM NËSE ËSHTË I DISPONUESHËM (I RI)
    if (typeof LongTermMemoryManager !== 'undefined') {
        setTimeout(() => {
            initializeLTMForChat().then(ltm => {
                if (ltm) {
                    console.log('🧠 Long-Term Memory u inicializua me sukses në fillim!');
                    addMessage('🧠 **Sistemi i Memories Afatgjatë** u aktivizua! Unë do të kujtoj bisedat tona.', 'system');
                }
            });
        }, 2000);
    }
});

// ======================================================
// 🎯 EKSPORTIMI I FUNKSIONEVE GLOBALE - I PËRDITËSUAR
// ======================================================

// Eksporto funksionet globale për t'u përdorur nga HTML
window.sendMessage = sendMessage;
window.addMessage = addMessage;
window.activateSimpleAI = activateSimpleAI;
window.activateAdvancedAI = activateAdvancedAI;
window.activateDivineAI = activateDivineAI;

// 🆕 EKSPORTO FUNKSIONET E REJA TË LTM
window.initializeLTMForChat = initializeLTMForChat;
window.showMemoryStats = showMemoryStats;
window.quickLTMTEST = function() {
    console.log('🧪 TEST I SHPEJTË I LTM:');
    console.log('- LTM Manager:', typeof LongTermMemoryManager);
    console.log('- LTM Instance:', !!window.ltmManager);
    
    if (window.ltmManager) {
        const stats = window.ltmManager.getMemoryStats();
        console.log('- Memory Stats:', stats);
        addMessage(`🧪 **Test LTM:** ✅ Aktiv\n📊 Mesazhe: ${stats.total_messages}`, 'system');
    } else {
        addMessage('🧪 **Test LTM:** ❌ Jo aktiv', 'system');
    }
};

console.log("✅ RRUFE-TESLA 11.0 Chat System u inicializua plotësisht!");

// ======================================================
// 📝 FUNKSIONET EKZISTUESE - NUK NDRYSHOhen
// ======================================================

// Funksioni i ri për procesimin me RRUFE-TESLA 8.0
async function processWithRrufeTesla(message) {
    console.log(`🚀 PROCESIMI I MESAZHIT ME RRUFE-TESLA 8.0: "${message}"`);

    try {
        // 1. Shto në Context Memory (bëhet automatikisht nga main.js)
        const contextId = window.rrufePlatform.modules.contextMemory.addToContext(message, 'user');
        
        // 2. GJENERO PËRGJIGJEN DUKE PËRDORUR BACKEND
        const response = await fetch('/api/chat/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                message: message,
                userId: getCurrentUserId() || 1
            })
        });

        const data = await response.json();
        
        if (data.success) {
            addMessage(data.response, 'bot');
        } else {
            addMessage('❌ ' + (data.response || 'Gabim në përpunimin e mesazhit'), 'system');
        }

    } catch (error) {
        console.error('❌ Gabim në procesimin me RRUFE-TESLA:', error);
        addMessage('❌ Gabim në sistem. Provo përsëri.', 'system');
    }
}

// Funksioni fallback për sistemin e vjetër
async function sendToBackend(message) {
    try {
        const response = await fetch('/api/chat/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                userId: getCurrentUserId() || 1
            })
        });

        const data = await response.json();
        
        if (data.success) {
            return data;
        } else {
            addMessage('❌ ' + (data.response || 'Gabim në përpunimin e mesazhit'), 'system');
            return data;
        }
    } catch (error) {
        console.error('❌ Gabim në dërgimin e mesazhit:', error);
        addMessage('❌ Gabim në lidhje me serverin. Provo përsëri.', 'system');
        return { success: false, response: 'Gabim në lidhje' };
    }
}

// Funksion për shtimin e mesazheve në chat
function addMessage(content, sender) {
    const chat = document.getElementById('chat');
    const messageDiv = document.createElement('div');
    
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-text">${content}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        </div>
    `;
    
    chat.appendChild(messageDiv);
    chat.scrollTop = chat.scrollHeight;
}

// Funksion për marrjen e ID-së së përdoruesit aktual
function getCurrentUserId() {
    // Kjo duhet të implementohet sipas sistemit të autentikimit tënd
    return localStorage.getItem('userId') || 1;
}

// Funksion ndihmës për të përditësuar styling e butonave
function updateAIButtonStyles(activeMode) {
    const buttons = document.querySelectorAll('.ai-controls button');
    
    buttons.forEach(button => {
        // Reset të gjitha butonat në styling bazë
        button.style.opacity = '0.7';
        button.style.transform = 'scale(1)';
        button.style.boxShadow = 'none';
    });
    
    // Thekso butonin aktiv
    const activeButton = document.querySelector(`.ai-controls button[onclick="activate${activeMode}AI()"]`);
    if (activeButton) {
        activeButton.style.opacity = '1';
        activeButton.style.transform = 'scale(1.05)';
        activeButton.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
    }
}

// 🔐 SISTEMI I RI I AUTHENTICATION PËR API REQUESTS
function getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
}

async function makeAuthenticatedRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...getAuthHeaders(),
                ...options.headers
            }
        });

        if (response.status === 401) {
            console.log('🔐 Session ka skaduar, duke ridrejtuar në login...');
            window.location.href = '/login';
            return null;
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('❌ Gabim në request:', error);
        return {
            success: false,
            response: `Gabim në lidhje: ${error.message}`
        };
    }
}

// ======================================================
// 🧠 LONG-TERM MEMORY INTEGRATION - FUNKSIONET E REJA
// ======================================================

// 🎯 FUNKSIONI I RI PËR INICIALIZIMIN E LTM
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
        
        return ltmManager;
        
    } catch (error) {
        console.error('❌ Gabim në inicializimin e LTM për chat:', error);
        return null;
    }
}

// 🎯 FUNKSIONI I RI PËR SHFAQJEN E STATISTIKAVE TË MEMORIES
function showMemoryStats() {
    if (!window.ltmManager) {
        console.log('❌ LTM Manager nuk është inicializuar');
        return;
    }
    
    const stats = window.ltmManager.getMemoryStats();
    console.log('📊 Statistikat e Memories:');
    console.log('- Mesazhe totale:', stats.total_messages);
    console.log('- Mesazhe user:', stats.user_messages);
    console.log('- Mesazhe AI:', stats.ai_messages);
    console.log('- Kapaciteti:', stats.capacity);
    
    // Shfaq në chat nëse është mod i avancuar
    if (window.currentAIMode === 'ADVANCED' || window.currentAIMode === 'DIVINE') {
        addMessage(`📊 **Statistikat e Memories:**\n- Mesazhe: ${stats.total_messages}\n- Kapacitet: ${stats.capacity}`, 'system');
    }
}

// ======================================================
// 🚀 EKSPORTIMI I FUNKSIONEVE TË REJA GLOBALE
// ======================================================

// 🆕 EKSPORTO FUNKSIONET E REJA TË LTM
window.initializeLTMForChat = initializeLTMForChat;
window.showMemoryStats = showMemoryStats;
window.quickLTMTEST = function() {
    console.log('🧪 TEST I SHPEJTË I LTM:');
    console.log('- LTM Manager:', typeof LongTermMemoryManager);
    console.log('- LTM Instance:', !!window.ltmManager);
    
    if (window.ltmManager) {
        const stats = window.ltmManager.getMemoryStats();
        console.log('- Memory Stats:', stats);
        addMessage(`🧪 **Test LTM:** ✅ Aktiv\n📊 Mesazhe: ${stats.total_messages}`, 'system');
    } else {
        addMessage('🧪 **Test LTM:** ❌ Jo aktiv', 'system');
    }
};

console.log("✅ RRUFE-TESLA 11.0 Chat System me LTM u inicializua plotësisht!");

// ====================================== Në fund të chat ========================================================
async function initializeLTMForChat() {
    console.log('🎯 initializeLTMForChat - Duke inicializuar LTM...');
    try {
        const userId = getCurrentUserId() || 'guest_user';
        const ltmManager = new LongTermMemoryManager(userId, null);
        await ltmManager.initialize();
        window.ltmManager = ltmManager;
        if (window.rrufePlatform) {
            window.rrufePlatform.modules.longTermMemory = ltmManager;
        }
        return ltmManager;
    } catch (error) {
        console.error('❌ Gabim:', error);
        return null;
    }
}

// ================================ Eksporto globalisht ===================================
window.initializeLTMForChat = initializeLTMForChat;

// Shto në fund të chat.js për inicializim automatik
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (typeof initializeLTMForChat !== 'undefined') {
            initializeLTMForChat().then(ltm => {
                if (ltm) {
                    console.log('✅ LTM u inicializua automatikisht!');
                    addMessage('🧠 **Memoria Afatgjatë** u aktivizua automatikisht!', 'system');
                }
            });
        }
    }, 2000);
});

// ==================== 🧠 MEMORY DISPLAY SYSTEM ====================

// Funksion për update të header-it me memory status
function updateHeaderWithMemoryStatus() {
    const header = document.querySelector('header');
    if (!header) {
        console.log('❌ Header nuk u gjet');
        return;
    }
    
    // Kontrollo nëse ekziston tashmë memory status
    let memoryStatus = document.getElementById('memory-status');
    
    if (!memoryStatus) {
        memoryStatus = document.createElement('div');
        memoryStatus.id = 'memory-status';
        memoryStatus.style.cssText = `
            display: inline-block;
            margin-left: 15px;
            padding: 5px 10px;
            background: rgba(0,0,0,0.1);
            border-radius: 15px;
            font-size: 12px;
            border: 1px solid #00ff00;
            font-family: Arial, sans-serif;
        `;
        
        // Vendose pas butonave të AI
        const aiControls = document.querySelector('.ai-controls');
        if (aiControls) {
            aiControls.parentNode.insertBefore(memoryStatus, aiControls.nextSibling);
        } else {
            header.appendChild(memoryStatus);
        }
    }
    
    // Update content
    if (window.ltmManager) {
        const stats = window.ltmManager.getMemoryStats();
        memoryStatus.innerHTML = `🧠 ${stats.total_messages} mesazhe | ${stats.capacity}`;
        memoryStatus.title = `Memoria: ${stats.user_messages} user + ${stats.ai_messages} AI mesazhe`;
    } else {
        memoryStatus.innerHTML = '🧠 Memorie joaktive';
        memoryStatus.title = 'Long-Term Memory nuk është inicializuar';
    }
}

// Funksion për të krijuar memory dashboard
function createMemoryDashboard() {
    // Kontrollo nëse ekziston tashmë
    if (document.getElementById('memory-dashboard')) {
        return;
    }
    
    const dashboard = document.createElement('div');
    dashboard.id = 'memory-dashboard';
    dashboard.innerHTML = `
        <div style="background: rgba(0,0,0,0.05); padding: 10px; border-radius: 8px; margin: 10px 0; border: 1px solid #ddd;">
            <h4 style="margin: 0 0 8px 0; color: #333;">🧠 RRUFE-TESLA Memory</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; color: #666;">
                <div>📊 Total: <span id="dash-total">0</span></div>
                <div>👤 User: <span id="dash-user">0</span></div>
                <div>🤖 AI: <span id="dash-ai">0</span></div>
                <div>💾 Kapacitet: <span id="dash-capacity">0%</span></div>
            </div>
            <button onclick="showDetailedMemoryStats()" style="margin-top: 8px; padding: 4px 8px; font-size: 10px; background: #4285f4; color: white; border: none; border-radius: 4px; cursor: pointer;">
                📈 Detajet
            </button>
        </div>
    `;
    
    // Vendose në fillim të chat-it
    const chat = document.getElementById('chat');
    if (chat) {
        chat.insertBefore(dashboard, chat.firstChild);
    }
    
    return dashboard;
}

// Funksion për update të display-it
function updateMemoryDisplay() {
    // Update header status
    updateHeaderWithMemoryStatus();
    
    // Update dashboard nëse ekziston
    const dashTotal = document.getElementById('dash-total');
    const dashUser = document.getElementById('dash-user');
    const dashAi = document.getElementById('dash-ai');
    const dashCapacity = document.getElementById('dash-capacity');
    
    if (window.ltmManager) {
        const stats = window.ltmManager.getMemoryStats();
        
        if (dashTotal) dashTotal.textContent = stats.total_messages;
        if (dashUser) dashUser.textContent = stats.user_messages;
        if (dashAi) dashAi.textContent = stats.ai_messages;
        if (dashCapacity) dashCapacity.textContent = stats.capacity;
    }
}

// Funksion për të shfaqur statistikat e detajuara
function showDetailedMemoryStats() {
    if (window.ltmManager) {
        const stats = window.ltmManager.getMemoryStats();
        const message = `🧠 **Statistikat e Detajuara të Memories:**

📊 **Total Mesazhe:** ${stats.total_messages}
👤 **Mesazhe User:** ${stats.user_messages}
🤖 **Mesazhe AI:** ${stats.ai_messages}
💾 **Kapaciteti:** ${stats.capacity}
🕒 **Përditësuar:** ${stats.last_updated ? new Date(stats.last_updated).toLocaleTimeString() : 'N/A'}

*Memoria ruan 50 mesazhet e fundit për kontekst optimal.*`;
        
        // Shfaq në chat
        if (typeof addMessage !== 'undefined') {
            addMessage(message, 'system');
        } else {
            alert(message);
        }
    } else {
        alert('❌ Long-Term Memory nuk është inicializuar!');
    }
}

// Funksion për inicializim të plotë të memory interface
function initializeMemoryInterface() {
    console.log('🧠 Duke inicializuar Memory Interface...');
    
    // Krijo dashboard
    createMemoryDashboard();
    
    // Update display
    updateMemoryDisplay();
    
    // Shfaq notifikim
    if (typeof showMemoryNotification !== 'undefined') {
        showMemoryNotification('🧠 Memory Interface u aktivizua!', 'success');
    }
    
    console.log('✅ Memory Interface u inicializua!');
}

// ==================== 🚀 EKSPORTIMI I FUNKSIONEVE ====================

window.updateHeaderWithMemoryStatus = updateHeaderWithMemoryStatus;
window.createMemoryDashboard = createMemoryDashboard;
window.updateMemoryDisplay = updateMemoryDisplay;
window.showDetailedMemoryStats = showDetailedMemoryStats;
window.initializeMemoryInterface = initializeMemoryInterface;

console.log("✅ Memory Display System u ngarkua në chat.js!");

// ================================= Sistemi lokal i inteligjencës ======================================
class LocalChatIntelligence {
    constructor() {
        this.knowledgeBase = {
            greetings: {
                patterns: ['pershendetje', 'hello', 'hi', 'tung', 'ciao', 'mirëmëngjes', 'mirëdita', 'mirëmbrëma'],
                responses: [
                    'Përshëndetje! 😊 Mirë se ju gjetëm!',
                    'Hello! Si mund t'ju ndihmoj sot?',
                    'Tungjatjeta! Gëzohem që ju shoh!',
                    'Përshëndetje! Çfarë mund të bëj për ju?'
                ]
            },
            farewells: {
                patterns: ['mirupafshim', 'bye', 'lamtumirë', 'shëndet', 'flm', 'faleminderit'],
                responses: [
                    'Mirupafshim! 😊 Ishte kënaqësi të flisja me ju!',
                    'Lamtumirë! Shpresoj të flasim sërish!',
                    'Faleminderit! Ju uroj një ditë të mbarë!',
                    'Shëndet! Mos u largoni shumë!'
                ]
            },
            help: {
                patterns: ['ndihmo', 'help', 'komanda', 'si punon', 'çfarë mund të bësh'],
                responses: [
                    'Unë jam RRUFE-TESLA! Mund të:\n• Të përgjigjem pyetjeve bazë\n• Të llogarit matematikë\n• Të kujtoj bisedat tona\n• Të ndihmoj me informacione\n\nShkruani pyetjen tuaj!'
                ]
            },
            math: {
                patterns: ['+', '-', '*', '/', '^', 'llogarit', 'sa është'],
                responses: []
            },
            // ... më shumë kategori
        };
    }

    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // Kontrollo nëse është matematikë
        if (this.isMathExpression(message)) {
            return this.solveMath(message);
        }
        
        // Kontrollo kategori të tjera
        for (let category in this.knowledgeBase) {
            for (let pattern of this.knowledgeBase[category].patterns) {
                if (lowerMessage.includes(pattern)) {
                    const responses = this.knowledgeBase[category].responses;
                    return responses[Math.floor(Math.random() * responses.length)];
                }
            }
        }
        
        // Përgjigje default
        return this.getDefaultResponse();
    }

    isMathExpression(text) {
        const mathRegex = /^[\d+\-*/().^ ]+$/;
        return mathRegex.test(text.replace(/\s/g, ''));
    }

    solveMath(expression) {
        try {
            // Pastro dhe siguro shprehjen
            let cleanExpr = expression.replace(/[^0-9+\-*/().^]/g, '');
            
            // Zëvendëso ^ me ** për fuqi
            cleanExpr = cleanExpr.replace(/\^/g, '**');
            
            // Përdor Function constructor për llogaritje të sigurt
            const result = Function(`"use strict"; return (${cleanExpr})`)();
            
            return `🧮 Rezultati: **${result}**`;
        } catch (error) {
            return '❌ Nuk mund ta llogaris shprehjen matematikore.';
        }
    }

    getDefaultResponse() {
        const defaultResponses = [
            'Interesante! Çfarë mendoni ju për këtë?',
            'E kuptoj! A keni ndonjë pyetje tjetër?',
            'Faleminderit për këtë informacion!',
            'Po dëgjoj... vazhdoni ju lutem!',
            'Kjo është shumë interesante!'
        ];
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
}
