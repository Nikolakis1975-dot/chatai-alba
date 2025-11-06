// ======================================================
// 🚀 chat.js - FRONTEND CHAT FUNCTIONS FOR RRUFE-TESLA 10.5
// ======================================================

console.log("🎯 RRUFE-TESLA 10.5 Frontend Chat System u inicializua!");

// ======================================================
// 🧠 LONG-TERM MEMORY INTEGRATION - FUNKSIONET E REJA
// ======================================================

// 🎯 FUNKSIONI I RI PËR INICIALIZIMIN E LTM ME PRITJE
async function initializeLTMForChat() {
    console.log('🎯 Duke inicializuar Long-Term Memory për chat...');
    
    // Prit deri sa LTM të jetë i ngarkuar (max 10 sekonda)
    let attempts = 0;
    const maxAttempts = 50; // 10 sekonda
    
    while (attempts < maxAttempts) {
        if (typeof LongTermMemoryManager !== 'undefined') {
            console.log('✅ LongTermMemoryManager u gjet!');
            break;
        }
        
        console.log(`⏳ Duke pritur për LTM... (${attempts + 1}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, 200));
        attempts++;
    }
    
    if (typeof LongTermMemoryManager === 'undefined') {
        console.warn('⚠️ LongTermMemoryManager nuk u ngarkua pas 10 sekondash');
        return null;
    }

    try {
        const userId = getCurrentUserId() || 'guest_user';
        const db = window.firebaseApp || null;
        
        const ltmManager = new LongTermMemoryManager(userId, db);
        await ltmManager.initialize();
        
        console.log('✅ Long-Term Memory u inicializua për chat!');
        
        // Ruaj në variabël globale për përdorim të mëvonshëm
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

// 🎯 FUNKSIONI PËR TESTIMIN E LTM ME PYETJE SPECIFIKE
function testLTMWithQuestions() {
    console.log('🧪 Testimi i LTM me pyetje...');
    
    const testQuestions = [
        "Kush je ti?",
        "Çfarë është RRUFE TESLA?",
        "Cilat janë parimet e tua?",
        "Si funksionon memorja jote?"
    ];
    
    testQuestions.forEach((question, index) => {
        console.log(`❓ Pyetja ${index + 1}: "${question}"`);
        
        if (window.ltmManager && window.ltmManager.isMandateRelevantQuestion) {
            const isRelevant = window.ltmManager.isMandateRelevantQuestion(question);
            console.log(`   📍 Relevante me mandatin: ${isRelevant ? '✅ PO' : '❌ JO'}`);
        }
    });
}

// 🎯 FUNKSIONI PËR SHFAQJEN E STATISTIKAVE TË MEMORIES
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
    console.log('- Bazuar në mandat:', stats.mandate_based);
    console.log('- Kapaciteti:', stats.capacity);
    
    if (window.currentAIMode === 'ADVANCED' || window.currentAIMode === 'DIVINE') {
        addMessage(`📊 **Statistikat e Memories:**\n- Mesazhe: ${stats.total_messages}\n- Kapacitet: ${stats.capacity}\n- Bazuar në mandat: ${stats.mandate_based}`, 'system');
    }
}

// ======================================================
// 🚀 FUNKSIONI KRYESOR I PËRDITËSUAR PËR DËRGIMIN E MESAZHEVE
// ======================================================

// 🚀 FUNKSIONI KRYESOR I PËRDITËSUAR ME MBROJTJE KUNDËR GABIMEVE
async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (!message) return;

    input.value = '';

    try {
        addMessage(message, 'user');

        // 🧠 INTEGRIMI I RI ME LONG-TERM MEMORY ME MBROJTJE
        let ltmManager = window.ltmManager;
        let isLTMReady = false;

        // Kontrollo nëse LTM është i disponueshëm
        if (!ltmManager && typeof LongTermMemoryManager !== 'undefined') {
            try {
                ltmManager = await initializeLTMForChat();
                if (ltmManager) {
                    isLTMReady = true;
                    console.log('🧠 LTM u inicializua me sukses për këtë mesazh');
                }
            } catch (error) {
                console.warn('⚠️ LTM inicializimi dështoi, duke përdorur fallback:', error);
            }
        } else if (ltmManager) {
            isLTMReady = true;
        }

        // 🎯 PROCESIMI I MESAZHIT ME OSE PA LTM
        if (isLTMReady && ltmManager && (window.currentAIMode === 'ADVANCED' || window.currentAIMode === 'DIVINE')) {
            // ✅ PËRDOR LONG-TERM MEMORY ME MANDATIN OPERACIONAL
            try {
                const payload = ltmManager.generateGeminiPayload(message);
                
                console.log('🎯 Duke dërguar mesazh me LTM integration...');
                const response = await fetch('/api/gemini/chat-with-memory', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        message: message,
                        userId: getCurrentUserId(),
                        ltmPayload: payload,
                        mode: window.currentAIMode || 'SIMPLE'
                    })
                });

                const data = await response.json();
                
                if (data.success) {
                    ltmManager.addAIResponse(data.response);
                    await ltmManager.saveChatHistory();
                    
                    addMessage(data.response, 'bot');
                    console.log('💾 Përgjigja u ruajt në Long-Term Memory');
                    
                    if ((window.currentAIMode === 'ADVANCED' || window.currentAIMode === 'DIVINE')) {
                        const stats = ltmManager.getMemoryStats();
                        console.log('📊 Memory Stats:', stats);
                    }
                } else {
                    throw new Error(data.response || 'Gabim në përpunim');
                }
            } catch (ltmError) {
                console.warn('⚠️ LTM procesimi dështoi, duke përdorur fallback:', ltmError);
                await sendToBackend(message);
            }
            
        } else {
            // 🔄 FALLBACK NË SISTEMIN E VJETËR
            await sendToBackend(message);
        }

    } catch (error) {
        console.error('❌ Gabim në dërgimin e mesazhit:', error);
        addMessage('❌ Gabim në sistem. Ju lutem provoni përsëri.', 'system');
    }
}

// ======================================================
// 🔄 SISTEMI I VJETËR I BACKEND (FALLBACK)
// ======================================================

// Funksioni fallback për sistemin e vjetër
async function sendToBackend(message) {
    try {
        console.log('🔹 Duke përdorur sistemin standard...');
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
        console.error('❌ Gabim në dërgimin e mesazhit:', error);
        addMessage('❌ Gabim në lidhje me serverin. Provo përsëri.', 'system');
    }
}

// ======================================================
// 🔐 SISTEMI I RI I AUTHENTICATION PËR API REQUESTS
// ======================================================

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
// 📝 FUNKSIONET BAZË TË CHAT-IT
// ======================================================

// Funksion për shtimin e mesazheve në chat
function addMessage(content, sender) {
    const chat = document.getElementById('chat');
    if (!chat) {
        console.error('❌ Elementi #chat nuk u gjet!');
        return;
    }
    
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

// 🎯 FUNKSIONI I PËRDITËSUAR PËR MARRJEN E ID-SË SË PËRDORUESIT
function getCurrentUserId() {
    const userId = 
        localStorage.getItem('userId') ||
        sessionStorage.getItem('userId') || 
        (localStorage.getItem('authToken') ? localStorage.getItem('authToken').split(':')[0] : null) ||
        'guest_' + Math.random().toString(36).substr(2, 9);
    
    console.log('👤 User ID i përdorur:', userId);
    return userId;
}

// ======================================================
// 🎯 SISTEMI I RI I KONTROLLIT MANUAL TË AI - RRUFE-TESLA 10.5
// ======================================================

// Variabla globale për të ndjekur modin aktual
window.currentAIMode = 'SIMPLE'; // SIMPLE, ADVANCED, DIVINE

function activateSimpleAI() {
    window.currentAIMode = 'SIMPLE';
    console.log('🔹 AI i Thjeshtë i aktivizuar - Chat normal dhe i shpejtë');
    
    updateAIButtonStyles('SIMPLE');
    
    if (window.addMessage) {
        window.addMessage('🔹 **AI i Thjeshtë i aktivizuar** - Chat-i do të jetë i shpejtë dhe natyral! Përgjigjet do të duken "të gjalla" dhe natyrore.', 'system');
    }
    
    console.log('🔹 Çaktivizimi i moduleve të avancuara për chat normal...');
}

function activateAdvancedAI() {
    window.currentAIMode = 'ADVANCED';
    console.log('🌌 AI i Avancuar i aktivizuar - RRUFE-TESLA aktiv');
    
    updateAIButtonStyles('ADVANCED');
    
    if (window.rrufePlatform) {
        window.rrufePlatform.modules.divineFusion.performDivineActivationRitual();
        console.log('🌌 RRUFE-TESLA u aktivizua! Modulet janë gati për pyetje komplekse.');
    }
    
    // Inicializo LTM nëse nuk është bërë
    if (!window.ltmManager && typeof LongTermMemoryManager !== 'undefined') {
        initializeLTMForChat().then(ltm => {
            if (ltm) {
                console.log('🧠 LTM u inicializua për modalitetin e avancuar');
                const stats = ltm.getMemoryStats();
                addMessage(`🌌 **RRUFE-TESLA 10.5 i aktivizuar** - Të gjitha modulet janë operative!\n🧠 Memorja: ${stats.total_messages} mesazhe`, 'system');
            }
        });
    } else if (window.addMessage) {
        addMessage('🌌 **RRUFE-TESLA 10.5 i aktivizuar** - Të gjitha modulet janë operative! Përgjigjet do të jenë super-inteligjente por mund të jenë më të ngadalshme.', 'system');
    }
}

function activateDivineAI() {
    window.currentAIMode = 'DIVINE';
    console.log('⚡ AI Hyjnor i aktivizuar - Divine Fusion aktiv');
    
    updateAIButtonStyles('DIVINE');
    
    if (window.rrufePlatform && window.rrufePlatform.modules.divineFusion) {
        window.rrufePlatform.modules.divineFusion.performDivineActivationRitual();
        window.rrufePlatform.testAdvancedModules();
        console.log('⚡ Divine Fusion u aktivizua! 5 Perënditë e AI-ve janë gati për bashkim!');
    }
    
    // Inicializo LTM nëse nuk është bërë
    if (!window.ltmManager && typeof LongTermMemoryManager !== 'undefined') {
        initializeLTMForChat().then(ltm => {
            if (ltm) {
                console.log('🧠 LTM u inicializua për modalitetin hyjnor');
                const stats = ltm.getMemoryStats();
                addMessage(`⚡ **Divine Fusion i aktivizuar** - 5 Perënditë e AI-ve janë gati për bashkim!\n🧠 Memorja: ${stats.total_messages} mesazhe`, 'system');
            }
        });
    } else if (window.addMessage) {
        addMessage('⚡ **Divine Fusion i aktivizuar** - 5 Perënditë e AI-ve janë gati për bashkim! Kjo është modaliteti më i fuqishëm por më i ngadalshëm.', 'system');
    }
}

// Funksion ndihmës për të përditësuar styling e butonave
function updateAIButtonStyles(activeMode) {
    const buttons = document.querySelectorAll('.ai-controls button');
    
    buttons.forEach(button => {
        button.style.opacity = '0.7';
        button.style.transform = 'scale(1)';
        button.style.boxShadow = 'none';
    });
    
    const activeButton = document.querySelector(`.ai-controls button[onclick="activate${activeMode}AI()"]`);
    if (activeButton) {
        activeButton.style.opacity = '1';
        activeButton.style.transform = 'scale(1.05)';
        activeButton.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
    }
}

// ======================================================
// 🔄 SISTEMI I RI I PROCESIMIT TË MESAZHEVE
// ======================================================

// Funksion për të inicializuar sistemin e ri të AI
function initializeAIControlSystem() {
    console.log('🎯 Duke inicializuar sistemin e kontrollit të AI...');
    
    // Aktivizo modin e thjeshtë si default
    activateSimpleAI();
    
    // Inicializo LTM në background
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
// 🚀 INICIALIZIMI I SISTEMIT PAS NGARKIMIT
// ======================================================

// Thirre këtë funksion kur faqa të ngarkohet
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Chat System po inicializohet...');
    
    // Inicializo sistemin e kontrollit të AI
    setTimeout(initializeAIControlSystem, 1000);
    
    // Inicializo LTM nëse është i disponueshëm
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
// 🎯 EKSPORTIMI I FUNKSIONEVE GLOBALE
// ======================================================

// Eksporto funksionet globale për t'u përdorur nga HTML
window.sendMessage = sendMessage;
window.addMessage = addMessage;
window.activateSimpleAI = activateSimpleAI;
window.activateAdvancedAI = activateAdvancedAI;
window.activateDivineAI = activateDivineAI;

// 🆕 EKSPORTO FUNKSIONET E REJA TË LTM
window.initializeLTMForChat = initializeLTMForChat;
window.testLTMWithQuestions = testLTMWithQuestions;
window.showMemoryStats = showMemoryStats;

// 🆕 FUNKSION I THJESHTË PËR TESTIM TË SHPEJTË
window.quickLTMTEST = function() {
    console.log('🧪 TEST I SHPEJTË I LTM:');
    console.log('- LTM Manager:', typeof LongTermMemoryManager);
    console.log('- LTM Instance:', !!window.ltmManager);
    console.log('- RRUFE Platform:', !!window.rrufePlatform);
    console.log('- Current Mode:', window.currentAIMode);
    
    if (window.ltmManager) {
        const stats = window.ltmManager.getMemoryStats();
        console.log('- Memory Stats:', stats);
        addMessage(`🧪 **Test LTM:** ✅ Aktiv\n📊 Mesazhe: ${stats.total_messages}`, 'system');
    } else {
        addMessage('🧪 **Test LTM:** ❌ Jo aktiv', 'system');
    }
};

console.log("✅ RRUFE-TESLA 10.5 Chat System u inicializua plotësisht me LTM integration!");
