// openai-fix.js - SISTEM I PAVARUR PËR OPENAI
console.log('🔮 openai-fix.js po ngarkohet...');

// ✅ FUNKSIONI PËR OPENAI
window.sendToOpenAI = async function(message) {
    try {
        console.log('🔮 Duke dërguar në OpenAI:', message.substring(0, 50));
        
        const response = await fetch('/api/openai-enhanced/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ 
                message: message
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📥 Përgjigje nga OpenAI:', data);
        
        return data;
        
    } catch (error) {
        console.error('❌ Gabim në OpenAI:', error);
        return {
            success: false,
            error: 'OpenAI nuk është i disponueshëm: ' + error.message
        };
    }
};

// ✅ TESTO AUTOMATIKISHT
setTimeout(() => {
    console.log('🧪 Test automatik i OpenAI...');
    console.log('sendToOpenAI:', typeof window.sendToOpenAI);
    
    if (typeof window.sendToOpenAI === 'function') {
        window.sendToOpenAI('Test automatik nga openai-fix.js').then(result => {
            console.log('🔮 Rezultati i testit:', result);
        });
    }
}, 2000);

console.log('✅ openai-fix.js u ngarkua!');
