// ======================================================
// 🚀 chat.js - RRUFE-TESLA 10.5 - VERSION I THJESHTË & I SIGURT
// ======================================================

console.log("✅ chat.js - Duke u ngarkuar...");

// Variabla globale
window.chatHistory = window.chatHistory || [];
window.isTyping = window.isTyping || false;
window.currentAIMode = window.currentAIMode || 'SIMPLE';

// Funksioni kryesor i shtimit të mesazheve
function addMessage(text, sender) {
    try {
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
                <span class="message-text">${text}</span>
                <span class="message-time">${timestamp}</span>
            </div>
        `;
        
        chat.appendChild(messageDiv);
        chat.scrollTop = chat.scrollHeight;
        
        // Ruaj në historinë lokale
        window.chatHistory.push({ text, sender, timestamp: new Date().toISOString() });
        
        console.log(`✅ Mesazh i shtuar: ${sender} - ${text.substring(0, 50)}`);
    } catch (error) {
        console.error('❌ Gabim në addMessage:', error);
    }
}

// Funksioni kryesor i dërgimit
async function sendMessage() {
    try {
        const input = document.getElementById('user-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        console.log('🔍 chat.js - Duke dërguar mesazh:', message);
        
        input.value = '';
        
        // Shto mesazhin e përdoruesit
        addMessage(message, 'user');
        
        // Trego se po shtypet
        const chat = document.getElementById('chat');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'message bot typing';
        typingDiv.innerHTML = `
            <div class="message-content">
                <span class="message-text">Po shkruaj...</span>
            </div>
        `;
        chat.appendChild(typingDiv);
        chat.scrollTop = chat.scrollHeight;
        
        // Simulo përgjigje
        setTimeout(() => {
            // Fshi treguesin e shtypjes
            const typingIndicator = document.getElementById('typing-indicator');
            if (typingIndicator) typingIndicator.remove();
            
            // Përgjigje e thjeshtë
            let response = "E kuptoj! Si mund të ndihmoj?";
            
            if (message.toLowerCase().includes('pershendetje') || message.toLowerCase().includes('hello')) {
                response = "Përshëndetje! 😊 Si mund t'ju ndihmoj sot?";
            } else if (message.toLowerCase().includes('/ndihmo')) {
                response = "🧠 **SISTEMI I KOMANDAVE**\n• /ndihmo - Shfaq këtë listë\n• /moti [qyteti] - Informacion moti\n• /wiki [temë] - Kërko në Wikipedia";
            } else if (message.toLowerCase().includes('/moti')) {
                response = "🌤️ **Moti:** +18°C ☀️ Diell\n*Sistemi aktual i motit do të implementohet më vonë*";
            }
            
            // Shto përgjigjen
            addMessage(response, 'bot');
            
            // Ruaj në memorie nëse ekziston
            if (window.ltmManager) {
                window.ltmManager.addUserMessage(message);
                window.ltmManager.addAIResponse(response);
                
                // Update memory display
                setTimeout(() => {
                    if (typeof updateMemoryDisplay !== 'undefined') {
                        updateMemoryDisplay();
                    }
                }, 100);
            }
            
        }, 1500);
        
    } catch (error) {
        console.error('❌ Gabim në sendMessage:', error);
        addMessage('❌ Gabim në sistem. Provo përsëri.', 'system');
    }
}

// Funksionet e tjera themelore
function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('❌ Ju lutem plotësoni të dy fushat!');
        return;
    }

    window.currentUser = { username: username, isAdmin: username.toLowerCase() === 'admin' };
    localStorage.setItem('currentUser', JSON.stringify(window.currentUser));
    
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('chat-screen').style.display = 'block';
    
    addMessage(`👑 Mirë se erdhe ${username}! RRUFE-TESLA është gati.`, 'bot');
}

function logout() {
    window.currentUser = null;
    localStorage.removeItem('currentUser');
    window.chatHistory = [];
    
    document.getElementById('chat-screen').style.display = 'none';
    document.getElementById('login-screen').style.display = 'block';
    
    const chat = document.getElementById('chat');
    if (chat) chat.innerHTML = '';
}

// Eksporto funksionet globale
window.sendMessage = sendMessage;
window.addMessage = addMessage;
window.login = login;
window.logout = logout;

console.log("✅ chat.js u ngarkua me sukses!");
