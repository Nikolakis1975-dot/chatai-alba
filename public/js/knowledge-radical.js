// public/js/knowledge-radical.js
// Sistem i veçantë për integrimin e njohurive radikale

console.log('🧠 Knowledge Radical Integration loading...');

// ✅ FUNKSIONI PËR KONTROLLIMIN E NJOHURIVE
async function checkKnowledgeRadical(message) {
    try {
        console.log('💾 [KNOWLEDGE-RADICAL] Duke kërkuar për:', message);
        
        // Provo të marrësh currentUser nga window
        let currentUser = window.currentUser;
        
        if (!currentUser || !currentUser.id) {
            console.log('❌ Nuk ka user për kërkim');
            return false;
        }
        
        const userId = currentUser.id;
        const searchQuery = message.toLowerCase().trim();
        
        console.log('👤 User ID për kërkim:', userId);
        
        // ✅ PËRDOR SISTEMIN RADIKAL
        const apiUrl = `/api/radical/radical-search/${userId}/${encodeURIComponent(searchQuery)}`;
        
        const response = await fetch(apiUrl, {
            credentials: 'include'
        });
        
        console.log('📡 Response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.success && data.found && data.answer) {
                console.log('✅✅✅ Knowledge Radical: GJETËM PËRGJIGJE TË RUAJTUR!');
                
                // SHFAQ PËRGJIGJEN
                if (typeof addMessage === 'function') {
                    addMessage(`💾 **Përgjigje e ruajtur:** ${data.answer}`, 'bot');
                }
                return true;
            }
        }
        
    } catch (error) {
        console.log('ℹ️ Knowledge Radical check failed:', error.message);
    }
    
    return false;
}

// ✅ FUNKSIONI PËR RUAJTJEN E NJOHURIVE
async function saveKnowledgeRadical(question, answer) {
    try {
        console.log('💾 [SAVE-KNOWLEDGE-RADICAL] Duke ruajtur:', { question, answer });
        
        let currentUser = window.currentUser;
        
        if (!currentUser || !currentUser.id) {
            console.log('❌ Nuk ka user për ruajtje');
            return { success: false, error: 'Nuk jeni i loguar' };
        }
        
        const response = await fetch('/api/radical/radical-learn', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({
                userId: currentUser.id,
                question: question,
                answer: answer
            })
        });
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('❌ Gabim në ruajtje:', error);
        return { success: false, error: error.message };
    }
}

// ✅ EKSPORTO FUNKSIONET
window.checkKnowledgeRadical = checkKnowledgeRadical;
window.saveKnowledgeRadical = saveKnowledgeRadical;

console.log('✅ Knowledge Radical Integration loaded!');
