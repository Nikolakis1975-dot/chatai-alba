// ======================================================
// 🚀 chat.js - FRONTEND CHAT FUNCTIONS FOR RRUFE-TESLA 8.0
// ======================================================

console.log("🎯 RRUFE-TESLA 8.0 Frontend Chat System u inicializua!");

// Funksioni kryesor për dërgimin e mesazheve
async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (!message) return;

    // Pastro input-in
    input.value = '';

    try {
        // Shto mesazhin e përdoruesit në chat
        addMessage(message, 'user');

        // ✅ INTEGRIMI ME RRUFE-TESLA 8.0
        if (window.rrufePlatform) {
            await processWithRrufeTesla(message);
        } else {
            // Fallback në sistemin e vjetër
            await sendToBackend(message);
        }

    } catch (error) {
        console.error('Gabim në dërgimin e mesazhit:', error);
        addMessage('❌ Gabim në dërgimin e mesazhit. Ju lutem provoni përsëri.', 'system');
    }
}

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
            addMessage(data.response, 'bot');
        } else {
            addMessage('❌ ' + (data.response || 'Gabim në përpunimin e mesazhit'), 'system');
        }
    } catch (error) {
        console.error('❌ Gabim në dërgimin e mesazhit:', error);
        addMessage('❌ Gabim në lidhje me serverin. Provo përsëri.', 'system');
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

// ======================================================
// 🎯 SISTEMI I RI I KONTROLLIT MANUAL TË AI - RRUFE-TESLA 8.0
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
    
    if (window.addMessage) {
        window.addMessage('🌌 **RRUFE-TESLA 8.0 i aktivizuar** - Të gjitha 14 modulet janë operative! Përgjigjet do të jenë super-inteligjente por mund të jenë më të ngadalshme.', 'system');
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
    
    if (window.addMessage) {
        window.addMessage('⚡ **Divine Fusion i aktivizuar** - 5 Perënditë e AI-ve janë gati për bashkim! Kjo është modaliteti më i fuqishëm por më i ngadalshëm.', 'system');
    }
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

// ======================================================
// 🔄 SISTEMI I RI I PROCESIMIT TË MESAZHEVE
// ======================================================

// Funksion për të inicializuar sistemin e ri të AI
function initializeAIControlSystem() {
    console.log('🎯 Duke inicializuar sistemin e kontrollit të AI...');
    
    // Aktivizo modin e thjeshtë si default
    activateSimpleAI();
    
    console.log('✅ Sistemi i kontrollit të AI u inicializua!');
}

// Thirre këtë funksion kur faqa të ngarkohet
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeAIControlSystem, 2000);
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
