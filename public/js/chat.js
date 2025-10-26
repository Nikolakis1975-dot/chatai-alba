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
                userId: 1 // Ose merre nga sessioni
            })
        });

        if (!response.ok) throw new Error('Gabim në server');

        const data = await response.json();
        
        if (data.success) {
            // 3. SHTO PËRGJIGJEN NË CHAT
            addMessage(data.response, 'bot');

            // 4. KAP NJOHURI TË REJA (bëhet automatikisht nga main.js)
            if (window.rrufePlatform.modules.geminiKnowledgeAccelerator) {
                window.rrufePlatform.captureGeminiKnowledgeAutomatically(data.response, message);
            }
        } else {
            throw new Error(data.response || 'Gabim në përgjigje');
        }

    } catch (error) {
        console.error('Gabim në procesimin e mesazhit:', error);
        
        // Përgjigje fallback
        const fallbackResponse = "Më vjen keq, kam vështirësi teknike. Ju lutem provoni përsëri.";
        addMessage(fallbackResponse, 'bot');
    }
}

// Funksioni për shtimin e mesazheve në chat
function addMessage(content, sender, showInConsole = true) {
    const chat = document.getElementById('chat');
    const messageElement = document.createElement('div');
    
    messageElement.className = `message ${sender}-message`;
    messageElement.innerHTML = `
        <div class="message-content">${content}</div>
        <div class="message-sender">${sender === 'user' ? '👤 Ti' : '⚡ RRUFE-TESLA'}</div>
    `;
    
    chat.appendChild(messageElement);
    chat.scrollTop = chat.scrollHeight;
    
    if (showInConsole) {
        console.log(`💬 ${sender.toUpperCase()}: ${content.substring(0, 50)}...`);
    }
}

// ======================================================
// 🎯 FUNKSIONET E TESTIMIT DHE KONTROLLIT
// ======================================================

// Testo të gjithë sistemin RRUFE-TESLA
function testRrufeSystem() {
    if (window.rrufePlatform) {
        console.log("🧪 TESTIMI I SISTEMIT RRUFE-TESLA 8.0:");
        rrufePlatform.systemHealthCheck();
        rrufePlatform.debugRrufeTesla();
        
        // Testo modulet e reja
        setTimeout(() => {
            if (rrufePlatform.modules.divineFusion) {
                rrufePlatform.modules.divineFusion.performDivineActivationRitual();
            }
            
            if (rrufePlatform.modules.kunformTranslator) {
                rrufePlatform.modules.kunformTranslator.debugKunformTranslator();
            }
            
            if (rrufePlatform.modules.neuralFeedbackLoop) {
                rrufePlatform.modules.neuralFeedbackLoop.debugNeuralFeedbackLoop();
            }
        }, 1000);
        
        addMessage("🧪 Testimi i sistemit u ekzekutua. Shiko konzolën për detaje.", 'system');
    } else {
        console.log("❌ rrufePlatform nuk është inicializuar!");
        addMessage("❌ Sistemi RRUFE-TESLA nuk është inicializuar. Kontrollo konzolën për detaje.", 'system');
    }
}

// Shfaq informacionin e sistemit
function showSystemInfo() {
    const systemInfo = document.getElementById('system-info');
    systemInfo.classList.toggle('hidden');
    
    if (window.rrufePlatform) {
        const health = rrufePlatform.systemHealthCheck();
        systemInfo.innerHTML = `
            <h3>🏥 RRUFE-TESLA 8.0 SYSTEM INFO</h3>
            <p><strong>Status:</strong> ${health.status}</p>
            <p><strong>Module Operacionale:</strong> ${health.operationalModules}/9</p>
            <p><strong>Session ID:</strong> ${rrufePlatform.modules.sessionManager.getSessionId()}</p>
            <div class="module-status">
                ${Object.entries(health.healthReport).map(([module, status]) => 
                    `<div class="module-item ${status === '🟢 HEALTHY' ? 'healthy' : 'offline'}">${module}: ${status}</div>`
                ).join('')}
            </div>
        `;
    } else {
        systemInfo.innerHTML = `
            <h3>❌ SISTEMI NUK ËSHTË INICIALIZUAR</h3>
            <p>Kontrollo nëse të gjitha modulet janë ngarkuar në konzolë.</p>
        `;
    }
}

// Debug i të gjitha moduleve
function debugAllModules() {
    if (window.rrufePlatform) {
        console.log("🔧 DEBUG I TË GJITHA MODULEVE:");
        rrufePlatform.testAdvancedModules();
        rrufePlatform.testKnowledgeAccelerator();
        addMessage("🔧 Debug i moduleve u ekzekutua. Shiko konzolën për detaje.", 'system');
    } else {
        addMessage("❌ Sistemi nuk është inicializuar për debug.", 'system');
    }
}

// Rifillo sistemin RRUFE-TESLA
function restartRrufeSystem() {
    if (window.rrufePlatform) {
        rrufePlatform.restartPlatform();
        console.log("🔄 Sistemi u rifillua me sukses!");
        addMessage("🔄 Sistemi RRUFE-TESLA u rifillua me sukses!", 'system');
    } else {
        addMessage("❌ Nuk mund të rifillohet sistemi. Nuk është inicializuar.", 'system');
    }
}

// Aktivizo Fusion Hyjnor
function activateDivineFusion() {
    if (window.rrufePlatform && window.rrufePlatform.modules.divineFusion) {
        const userInput = document.getElementById('user-input').value;
        if (userInput) {
            addMessage("🌌 Aktivizimi i Fusion Hyjnor...", 'system');
            rrufePlatform.modules.divineFusion.invokeDivineFusion(userInput)
                .then(result => {
                    console.log("🌌 REZULTATI I FUSIONIT HYJNOR:", result);
                    addMessage(result.content, 'system');
                })
                .catch(error => {
                    console.error("❌ Gabim në Fusion Hyjnor:", error);
                    addMessage("❌ Gabim në aktivizimin e Fusion Hyjnor.", 'system');
                });
        } else {
            addMessage("❌ Shkruaj një pyetje për të aktivizuar Fusion Hyjnor!", 'system');
        }
    } else {
        addMessage("❌ Fusion Hyjnor nuk është i disponueshëm.", 'system');
    }
}

// Testo përkthimin Kunform
function testKunformTranslation() {
    if (window.rrufePlatform && window.rrufePlatform.modules.kunformTranslator) {
        const testText = "Dashuria dhe dituria janë fuqitë më të mëdha të universit";
        const translation = rrufePlatform.modules.kunformTranslator.translateToKunform(testText);
        console.log("🔮 PËRKTHIMI KUNFORM:", translation);
        
        addMessage(`🔮 Përkthimi Kunform: ${translation.kunform}`, 'system');
    } else {
        addMessage("❌ Kunform Translator nuk është i disponueshëm.", 'system');
    }
}

// ======================================================
// 🚀 INICIALIZIMI I SISTEMIT
// ======================================================

// Inicializimi i sistemit kur faqa ngarkohet
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 RRUFE-TESLA 8.0 - Sistemi po inicializohet...");
    
    // Kontrollo nëse rrufePlatform është inicializuar
    setTimeout(() => {
        if (window.rrufePlatform) {
            console.log("✅ RRUFE-TESLA 8.0 u inicializua me sukses!");
            
            // Shto mesazh mirëseardhjeje
            addMessage(
                "👑 Mirë se erdhe në RRUFE-TESLA 8.0! " +
                "Tani çdo mesazh procesohet me 9 module inteligjence: " +
                "kuantike, nervore, kognitive, kohore, njohurish, fusion hyjnor, " +
                "përkthim kunform dhe feedback loop! 🚀", 
                'system',
                false
            );
        } else {
            console.log("⚠️ RRUFE-TESLA 8.0 nuk u inicializua. Kontrollo modulet.");
            addMessage(
                "⚡ Sistemi RRUFE-TESLA po inicializohet... " +
                "Ju lutem prisni pak momente.", 
                'system',
                false
            );
        }
    }, 2000);
});

// Fallback function për sistemin e vjetër
async function sendToBackend(message) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });

        if (!response.ok) throw new Error('Gabim në server');

        const data = await response.json();
        addMessage(data.reply, 'bot');

    } catch (error) {
        console.error('Gabim në backend:', error);
        addMessage('❌ Gabim në lidhje me serverin. Ju lutem provoni përsëri.', 'system');
    }
}

// Funksion për të lejuar shtypjen e Enter për dërgim
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('user-input');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});

// ============================ MESAGE VECORI ============================================
// ======================================================
// 🎯 SISTEMI I RI I KONTROLLIT TË AI - RRUFE-TESLA 8.0
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
    setTimeout(initializeAIControlSystem, 3000);
});
