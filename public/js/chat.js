
// public/js/chat.js - SISTEMI I NJOHURIVE RRUFE-TESLA
console.log('💾 RRUFE-TESLA: Duke ngarkuar sistemin e njohurive...');

// ✅ SISTEMI I KËRKIMIT TË NJOHURIVE
class KnowledgeSystem {
    constructor() {
        this.initialized = false;
        this.init();
    }

    async init() {
        console.log('🎯 KnowledgeSystem: Duke inicializuar...');
        this.initialized = true;
        console.log('✅ KnowledgeSystem: U inicializua!');
    }

    // ✅ KËRKO NJOHURI TË RUAJTURA
    async searchKnowledge(message) {
        try {
            if (!window.currentUser || !window.currentUser.id) {
                console.log('❌ KnowledgeSystem: Nuk ka currentUser');
                return null;
            }

            const userMessage = message.toLowerCase().trim();
            const userId = window.currentUser.id;

            console.log(`🔍 KnowledgeSystem: Duke kërkuar "${userMessage}" për user ${userId}`);

            const response = await fetch(`/api/chat/knowledge/${userId}/${encodeURIComponent(userMessage)}`, {
                method: 'GET',
                credentials: 'include'
            });

            console.log('📡 KnowledgeSystem: Statusi i përgjigjes:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('📊 KnowledgeSystem: Përgjigja:', data);

                if (data.answer && data.answer !== 'null') {
                    console.log('✅✅✅ KnowledgeSystem: GJETËM PËRGJIGJE TË RUAJTUR!');
                    return data.answer;
                } else {
                    console.log('❌ KnowledgeSystem: Nuk ka përgjigje të ruajtur');
                }
            } else {
                console.log('❌ KnowledgeSystem: Gabim në server:', response.status);
            }
        } catch (error) {
            console.log('❌ KnowledgeSystem: Gabim në kërkim:', error.message);
        }
        return null;
    }
}

// ✅ INICIALIZO SISTEMIN
window.knowledgeSystem = new KnowledgeSystem();

console.log('🚀 KnowledgeSystem: Sistemi i njohurive RRUFE-TESLA u ngarkua!');

// public/js/chat.js - SISTEMI I NJOHURIVE RRUFE-TESLA
console.log('💾 RRUFE-TESLA: Duke ngarkuar sistemin e njohurive...');

// =============================================✅ FUNKSIONI KRYESOR PËR KËRKIMIN E NJOHURIVE =============================

async function checkStoredKnowledge(message) {
    try {
        console.log('🔍 [KNOWLEDGE] Duke kërkuar për:', message);
        
        if (!window.currentUser || !window.currentUser.id) {
            console.log('❌ [KNOWLEDGE] Nuk ka currentUser');
            return null;
        }

        const userMessage = message.toLowerCase().trim();
        const userId = window.currentUser.id;

        console.log(`👤 [KNOWLEDGE] User ID: ${userId}`);
        console.log(`🔍 [KNOWLEDGE] Pyetja: "${userMessage}"`);

        // ✅ KËRKO NË DATABASE PËR PËRGJIGJE TË RUAJTUR
        const response = await fetch(`/api/chat/knowledge/${userId}/${encodeURIComponent(userMessage)}`, {
            method: 'GET',
            credentials: 'include'
        });

        console.log('📡 [KNOWLEDGE] Statusi i përgjigjes:', response.status);

        if (response.ok) {
            const data = await response.json();
            console.log('📊 [KNOWLEDGE] Përgjigja e serverit:', data);

            if (data.answer && data.answer !== 'null') {
                console.log('✅✅✅ [KNOWLEDGE] GJETËM PËRGJIGJE TË RUAJTUR:', data.answer);
                return data.answer;
            } else {
                console.log('❌ [KNOWLEDGE] Nuk ka përgjigje të ruajtur për këtë pyetje');
            }
        } else {
            console.log('❌ [KNOWLEDGE] Gabim në server:', response.status);
        }
    } catch (error) {
        console.log('❌ [KNOWLEDGE] Gabim në kërkim:', error.message);
    }
    
    return null;
}

// ✅ FUNKSIONI PËR DEBUG (OPSIONAL)
async function debugKnowledgeSystem() {
    console.log('🐛 [DEBUG] Duke testuar sistemin e njohurive...');
    
    const testQuestions = [
        'si kaloni aty?',
        'si po kaloni aty?', 
        'si kalove sot me shokun?',
        'si jeni sot miku im?'
    ];
    
    for (const question of testQuestions) {
        const answer = await checkStoredKnowledge(question);
        console.log(`🧪 [DEBUG] "${question}" -> ${answer ? '✅ Gjetëm' : '❌ Nuk gjetëm'}`);
    }
}

// ✅ EKSPORTO FUNKSIONET GLOBALE
window.knowledgeSystem = {
    checkStoredKnowledge: checkStoredKnowledge,
    debug: debugKnowledgeSystem
};

// ✅ INICIALIZO DEBUG PAS 5 SEKONDA (OPSIONAL)
setTimeout(() => {
    console.log('🔍 [KNOWLEDGE] Duke kontrolluar statusin...');
    console.log('- checkStoredKnowledge:', typeof checkStoredKnowledge);
    console.log('- currentUser:', window.currentUser);
    
    // Nëse dëshiron debug automatik, hiq komentin nga rreshti vijues:
    // debugKnowledgeSystem();
}, 5000);

console.log('🚀 [KNOWLEDGE] Sistemi i njohurive RRUFE-TESLA u ngarkua!');
