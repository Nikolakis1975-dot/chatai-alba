// ======================================================
// 🚀 chat.js - RRUFE-TESLA 10.5 - VERSION FINAL
// ======================================================

console.log("✅ chat.js - RRUFE-TESLA 10.5 po ngarkohet...");

// ======================================================
// 📊 VARIABLA GLOBALE
// ======================================================

window.chatHistory = window.chatHistory || [];
window.isTyping = window.isTyping || false;
window.currentAIMode = window.currentAIMode || 'SIMPLE';

// ======================================================
// 💬 FUNKSIONET KRYESORE TË CHAT
// ======================================================

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
        
        // Formatimi i tekstit
        const formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <span class="message-text">${formattedText}</span>
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

function showTypingIndicator() {
    if (window.isTyping) return;
    
    const chat = document.getElementById('chat');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'message bot typing';
    typingDiv.innerHTML = `
        <div class="message-content">
            <span class="message-text">
                <span class="typing-dots">
                    <span>.</span><span>.</span><span>.</span>
                </span>
            </span>
        </div>
    `;
    
    chat.appendChild(typingDiv);
    chat.scrollTop = chat.scrollHeight;
    window.isTyping = true;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    window.isTyping = false;
}

// ======================================================
// 🎯 FUNKSIONI KRYESOR I DËRGIMIT - VERSION I INTEGRUAR
// ======================================================

async function sendMessage() {
    try {
        const input = document.getElementById('user-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        console.log('🔍 chat.js - Duke dërguar mesazh:', message);
        
        input.value = '';
        
        // Shto mesazhin e përdoruesit
        addMessage(message, 'user');
        
        // 1. PARAQITJE NË KONSOLË PËR DEBUG
        console.log(`💬 [CHAT.JS] Mesazh: ${message}`);
        console.log(`🎯 [CHAT.JS] Modaliteti: ${window.currentAIMode || 'SIMPLE'}`);
        
        // 2. KONTROLLO NËSE ËSHTË KOMANDË E THJESHTË (sistemi ynë)
        const isSimpleCommand = isExactCommand(message) || isPureMathExpression(message) || isMathQuestion(message.toLowerCase()) || isGreeting(message.toLowerCase());
        
        if (isSimpleCommand) {
            console.log('✅ [CHAT.JS] Duke përdorur sistemin tonë të komandave');
            
            // Trego se po shtypet
            showTypingIndicator();
            
            // Proceso me sistemin tonë
            setTimeout(() => {
                hideTypingIndicator();
                let response = processUserMessage(message);
                addMessage(response, 'bot');
                
                // Ruaj në memory
                if (window.ltmManager) {
                    window.ltmManager.addUserMessage(message);
                    window.ltmManager.addAIResponse(response);
                    updateMemoryDisplay();
                }
            }, 1500);
            
        } else {
            // 3. KALO MESAZHIN NË SISTEMIN EKZISTUES RRUFE-TESLA
            console.log('🔄 [CHAT.JS] Duke kaluar mesazhin në sistemin RRUFE-TESLA');
            
            // Kontrollo nëse ekziston sistemi i vjetër
            if (typeof window.processUserMessage !== 'undefined') {
                console.log('🎯 [CHAT.JS] Duke përdorur processUserMessage të vjetër');
                
                // Përdor sistemin e vjetër
                try {
                    const response = await window.processUserMessage(message);
                    if (response) {
                        addMessage(response, 'bot');
                        
                        // Ruaj në memory
                        if (window.ltmManager) {
                            window.ltmManager.addUserMessage(message);
                            window.ltmManager.addAIResponse(response);
                            updateMemoryDisplay();
                        }
                    }
                } catch (error) {
                    console.error('❌ Gabim në processUserMessage:', error);
                    addMessage('❌ Gabim në sistem. Provo përsëri.', 'system');
                }
                
            } else if (typeof window.sendMessageToServer !== 'undefined') {
                // Ose përdor sistemin tjetër
                console.log('🎯 [CHAT.JS] Duke përdorur sendMessageToServer');
                window.sendMessageToServer(message);
                
            } else {
                // Fallback në sistemin tonë
                console.log('🔄 [CHAT.JS] Duke përdorur sistemin tonë si fallback');
                showTypingIndicator();
                
                setTimeout(() => {
                    hideTypingIndicator();
                    let response = processUserMessage(message);
                    addMessage(response, 'bot');
                    
                    if (window.ltmManager) {
                        window.ltmManager.addUserMessage(message);
                        window.ltmManager.addAIResponse(response);
                        updateMemoryDisplay();
                    }
                }, 1500);
            }
        }
        
    } catch (error) {
        console.error('❌ Gabim në sendMessage:', error);
        addMessage('❌ Gabim në sistem. Provo përsëri.', 'system');
    }
}

// ======================================================
// 🔄 FUNKSIONE SHTESË PËR INTEGRIM
// ======================================================

// Funksion për të kontrolluar sistemet ekzistuese
function checkExistingSystems() {
    console.log('🔍 Duke kontrolluar sistemet ekzistuese:');
    console.log('- processUserMessage:', typeof window.processUserMessage);
    console.log('- sendMessageToServer:', typeof window.sendMessageToServer);
    console.log('- rrufePlatform:', typeof window.rrufePlatform);
    console.log('- currentAIMode:', window.currentAIMode);
    
    // Kontrollo nëse ka API Key system
    if (typeof window.checkApiKeyStatus !== 'undefined') {
        console.log('- API Key System: ✅ EKZISTON');
    } else {
        console.log('- API Key System: ❌ NUK EKZISTON');
    }
}

// Ekzekuto kontrollin pas ngarkimit
setTimeout(checkExistingSystems, 3000);


// ======================================================
// 🧠 SISTEMI I PROCESIMIT TË MESAZHEVE
// ======================================================

function processUserMessage(message) {
    const lowerMessage = message.toLowerCase().trim();
    
    console.log('🎯 Duke procesuar mesazhin:', message);
    
    // 1. KONTROLLO KOMANDA TË QARTA
    if (isExactCommand(message)) {
        console.log('✅ Komandë e qartë u gjet');
        return processExactCommand(message);
    }
    
    // 2. KONTROLLO PËRSHËNDETJE
    if (isGreeting(lowerMessage)) {
        console.log('✅ Përshëndetje u gjet');
        return "Përshëndetje! 😊 Si mund t'ju ndihmoj sot?";
    }
    
    // 3. KONTROLLO MATEMATIKË (VETËM NËSE ËSHTË SHPREHJE E PASTËR)
    if (isPureMathExpression(message)) {
        console.log('✅ Shprehje matematikore e pastër u gjet');
        return solveMath(message);
    }
    
    // 4. KONTROLLO PYRJE MATEMATIKE
    if (isMathQuestion(lowerMessage)) {
        console.log('✅ Pyetje matematike u gjet');
        const mathExpr = extractMathFromQuestion(message);
        if (mathExpr) {
            return solveMath(mathExpr);
        }
    }
    
    // 5. PËRGJIGJE DEFAULT
    console.log('🔹 Duke përdorur përgjigjen default');
    return getDefaultResponse();
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

function isGreeting(message) {
    const greetings = ['pershendetje', 'hello', 'hi', 'tung', 'ciao', 'mirëmëngjes', 'mirëdita', 'mirëmbrëma', 'çkemi'];
    return greetings.some(greet => message.includes(greet));
}

function isPureMathExpression(text) {
    const cleanText = text.replace(/\s/g, '');
    const pureMathRegex = /^[\d+\-*/().^]+$/;
    return cleanText.length >= 2 && pureMathRegex.test(cleanText);
}

function isMathQuestion(message) {
    const mathQuestions = ['sa bejne', 'sa është', 'sa janë', 'llogarit', 'calc', 'calculate'];
    return mathQuestions.some(question => message.includes(question));
}

function extractMathFromQuestion(message) {
    const mathMatch = message.match(/[\d+\-*/().^]+/);
    return mathMatch ? mathMatch[0] : null;
}

function getDefaultResponse() {
    const defaultResponses = [
        'E kuptoj! Si mund të ndihmoj?',
        'Interesante! A keni ndonjë pyetje tjetër?',
        'Faleminderit për këtë informacion!',
        'Po dëgjoj... vazhdoni ju lutem!',
        'Kjo është shumë interesante!',
        'Mund të më tregoni më shumë për këtë?'
    ];
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
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
            return getDefaultResponse();
    }
}

// 🧮 FUNKSIONET PËR MATEMATIKË
function solveMath(expression) {
    try {
        let mathExpr = expression.trim();
        
        console.log('🧮 Duke llogaritur:', mathExpr);
        
        // Nxjerr nga komanda /llogarit
        if (mathExpr.toLowerCase().startsWith('/llogarit')) {
            mathExpr = mathExpr.substring(10).trim();
        }
        
        // Pastro shprehjen
        let cleanExpr = mathExpr.replace(/[^0-9+\-*/().^]/g, '');
        
        if (cleanExpr.length === 0) {
            return '❌ Nuk gjetëm shprehje matematikore.';
        }
        
        // Zëvendëso ^ me ** për fuqi
        cleanExpr = cleanExpr.replace(/\^/g, '**');
        
        // Llogarit me siguri
        const result = Function(`"use strict"; return (${cleanExpr})`)();
        
        return `🧮 **${mathExpr}** = **${result}**`;
        
    } catch (error) {
        console.error('❌ Gabim në llogaritje:', error);
        return '❌ Nuk mund ta llogaris shprehjen matematikore. Kontrolloni sintaksën.';
    }
}

// ======================================================
// 🌐 EKSPORTIMI I FUNKSIONEVE GLOBALE
// ======================================================

window.sendMessage = sendMessage;
window.addMessage = addMessage;

console.log("✅ chat.js - RRUFE-TESLA 10.5 u inicializua me sukses!");
