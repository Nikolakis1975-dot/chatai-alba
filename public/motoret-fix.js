// motoret-fix.js - SISTEM I PAVARUR PËR MOTORËT
console.log('🚀 motoret-fix.js po ngarkohet...');

// ✅ VARIABLA GLOBALE
window.aiEngineStatus = {
    gemini: true,
    openai: false
};

// ✅ FUNKSIONET GLOBALE
window.switchAIEngine = function(engine) {
    console.log('🔄 BUTONI I SHTYPUR: Duke ndryshuar motorin në:', engine);
    
    // Çaktivizo të gjithë motorët
    window.aiEngineStatus.gemini = false;
    window.aiEngineStatus.openai = false;
    
    // Aktivizo motorin e zgjedhur
    window.aiEngineStatus[engine] = true;
    
    console.log('✅ Statusi i ri:', window.aiEngineStatus);
    
    // Përditëso butonat
    updateAIButtons();
    
    // Shfaq mesazh në chat
    const engineName = engine === 'gemini' ? '🤖 Gemini' : '🔮 OpenAI';
    if (typeof addMessageToChat !== 'undefined') {
        addMessageToChat(`🔧 Motor i aktivizuar: ${engineName}`, 'system');
    }
};

// ✅ FUNKSION PËR PËRDDITËSIMIN E BUTONAVE
function updateAIButtons() {
    console.log('🎨 Duke përditësuar butonat...');
    
    const geminiBtn = document.getElementById('gemini-engine-btn');
    const openaiBtn = document.getElementById('openai-engine-btn');
    
    console.log('🔍 Butona të gjetur:', !!geminiBtn, !!openaiBtn);
    
    if (geminiBtn) {
        geminiBtn.style.background = window.aiEngineStatus.gemini ? '#4CAF50' : '#666';
        geminiBtn.textContent = window.aiEngineStatus.gemini ? '🤖 Gemini ✅' : '🤖 Gemini';
    }
    
    if (openaiBtn) {
        openaiBtn.style.background = window.aiEngineStatus.openai ? '#2196F3' : '#666';
        openaiBtn.textContent = window.aiEngineStatus.openai ? '🔮 OpenAI ✅' : '🔮 OpenAI';
    }
}

// ✅ INICIALIZO BUTONAT
function initializeMotorButtons() {
    console.log('🚀 Duke inicializuar butonat e motorëve...');
    
    const geminiBtn = document.getElementById('gemini-engine-btn');
    const openaiBtn = document.getElementById('openai-engine-btn');
    
    if (geminiBtn) {
        geminiBtn.onclick = function() {
            console.log('🎯 Gemini u klikua!');
            window.switchAIEngine('gemini');
        };
    }
    
    if (openaiBtn) {
        openaiBtn.onclick = function() {
            console.log('🎯 OpenAI u klikua!');
            window.switchAIEngine('openai');
        };
    }
    
    // Përditëso pamjen fillestare
    updateAIButtons();
    
    console.log('✅ Butonat e motorëve u inicializuan!');
}

// ✅ EKZEKUTO KUR FAQJA NGARKOHET
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMotorButtons);
} else {
    setTimeout(initializeMotorButtons, 1000);
}

console.log('✅ motoret-fix.js u ngarkua me sukses!');
