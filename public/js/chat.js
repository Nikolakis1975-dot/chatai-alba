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

// Funksioni kryesor i dërgimit - VERSION I PËRMIRËSUAR
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
            
            // PROCESO MESAZHIN ME SISTEM TË RI
            let response = processUserMessage(message);
            
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

// ======================================================
// 🧠 SISTEM I RI I PROCESIMIT TË MESAZHEVE
// ======================================================

function processUserMessage(message) {
    const lowerMessage = message.toLowerCase().trim();
    
    console.log('🎯 Duke procesuar mesazhin:', message);
    
    // 1. KONTROLLO KOMANDA TË QARTA
    if (isExactCommand(message)) {
        return processExactCommand(message);
    }
    
    // 2. KONTROLLO MATEMATIKË
    if (isMathExpression(message)) {
        return solveMath(message);
    }
    
    // 3. KONTROLLO PËRSHËNDETJE
    if (lowerMessage.includes('pershendetje') || lowerMessage.includes('hello') || 
        lowerMessage.includes('hi') || lowerMessage.includes('tung')) {
        return "Përshëndetje! 😊 Si mund t'ju ndihmoj sot?";
    }
    
    // 4. PËRGJIGJE DEFAULT
    return "E kuptoj! Si mund të ndihmoj?";
}

// 🎯 FUNKSIONET PËR KOMANDA
function isExactCommand(message) {
    const exactCommands = [
        '/ndihmo', '/help', 
        '/moti', '/mot', '/weather',
        '/wiki', '/wikipedia', 
        '/perkthim', '/translate',
        '/llogarit', '/calc', '/calculate',
        '/google', '/search'
    ];
    
    const firstWord = message.toLowerCase().split(' ')[0];
    return exactCommands.includes(firstWord);
}

function processExactCommand(message) {
    const parts = message.split(' ');
    const command = parts[0].toLowerCase();
    const argument = parts.slice(1).join(' ');
    
    console.log('🎯 Procesoj komandën:', command, 'me argument:', argument);
    
    switch(command) {
        case '/ndihmo':
        case '/help':
            return `🧠 **RRUFE-TESLA - SISTEMI I KOMANDAVE**

📋 **KOMANDAT BAZE:**
• /ndihmo - Shfaq këtë listë
• /wiki [temë] - Kërko në Wikipedia  
• /moti [qyteti] - Informacion moti
• /llogarit [shprehje] - Llogarit matematikë
• /perkthim [tekst] - Përkthim tekst

💡 **SHEMBUJ:**
• /wiki Shqipëria
• /moti Tirana
• /llogarit 15+25*2
• /perkthim "Mirëdita"`;

        case '/moti':
        case '/mot':
        case '/weather':
            if (argument) {
                return `🌤️ **Moti në ${argument}:** +18°C ☀️ Diell, erë e lehtë\n*Sistemi aktual i motit do të implementohet më vonë*`;
            } else {
                return '🏙️ **Shkruani:** /moti [qyteti]\n**Shembull:** /moti Tirana';
            }

        case '/wiki':
        case '/wikipedia':
            if (argument) {
                return `🌐 **Wikipedia për "${argument}":**\n${argument} është një temë interesante. Informacioni aktual do të gjenerohet nga sistemi i plotë i kërkimit.\n*Kjo është përgjigje demo*`;
            } else {
                return '📝 **Shkruani:** /wiki [temë]\n**Shembull:** /wiki Shqipëria';
            }

        case '/perkthim':
        case '/translate':
            if (argument) {
                return `🔤 **Përkthimi:**\n"${argument}" → "Informacion demo i përkthimit"\n*Sistemi i plotë i përkthimit do të implementohet më vonë*`;
            } else {
                return '🌐 **Shkruani:** /perkthim [tekst]\n**Shembull:** /perkthim "Mirëdita"';
            }

        case '/llogarit':
        case '/calc':
        case '/calculate':
            if (argument) {
                return solveMath(argument);
            } else {
                return '🧮 **Shkruani:** /llogarit [shprehje]\n**Shembull:** /llogarit 2+2*3';
            }

        case '/google':
        case '/search':
            if (argument) {
                return `🔍 **Rezultatet për "${argument}":**\n1. Informacion demo...\n2. Rezultati i dytë...\n*Kërkimi aktual do të implementohet më vonë*`;
            } else {
                return '📝 **Shkruani:** /google [kërkim]\n**Shembull:** /google teknologji';
            }

        default:
            return "E kuptoj! Si mund të ndihmoj?";
    }
}

// 🧮 FUNKSIONET PËR MATEMATIKË
function isMathExpression(text) {
    const cleanText = text.replace(/\s/g, '');
    const mathRegex = /^[\d+\-*/().^]+$/;
    return mathRegex.test(cleanText) || text.toLowerCase().includes('sa bejne') || text.includes('+') || text.includes('-') || text.includes('*') || text.includes('/');
}

function solveMath(expression) {
    try {
        let mathExpr = expression;
        
        // Nxjerr nga komanda /llogarit
        if (mathExpr.toLowerCase().startsWith('/llogarit')) {
            mathExpr = mathExpr.substring(10).trim();
        }
        
        // Pastro shprehjen
        let cleanExpr = mathExpr.replace(/[^0-9+\-*/().^]/g, '');
        
        // Zëvendëso ^ me ** për fuqi
        cleanExpr = cleanExpr.replace(/\^/g, '**');
        
        // Llogarit me siguri
        const result = Function(`"use strict"; return (${cleanExpr})`)();
        
        return `🧮 **${mathExpr}** = **${result}**`;
    } catch (error) {
        return '❌ Nuk mund ta llogaris shprehjen matematikore. Kontrolloni sintaksën.';
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
