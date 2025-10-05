let currentUser = null;
let knowledgeBase = {};

// ==================== INICIALIZIMI ====================
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    document.getElementById("username").focus();
    
    // Event listeners
    document.getElementById("user-input").addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    document.getElementById("send-btn").addEventListener("click", sendMessage);
    document.getElementById("clear-history").addEventListener("click", clearHistory);
    document.getElementById("download-history").addEventListener("click", downloadHistory);
    document.getElementById("upload-history").addEventListener("click", uploadHistory);
    document.getElementById("change-photo").addEventListener("click", changePhoto);
    document.getElementById("emoji-btn").addEventListener("click", toggleEmojiPanel);
    document.getElementById("new-photo").addEventListener("change", handlePhotoUpload);
    
    // Event listeners për emojis
    document.querySelectorAll("#emoji-panel span").forEach(span => {
        span.addEventListener("click", () => {
            const input = document.getElementById("user-input");
            input.value += span.textContent;
            input.focus();
        });
    });
});

// ==================== SISTEMI I RI I AUTHENTIKIMIT ====================

// ✅ KONTROLLO STATUSIN E AUTH ME HTTP-ONLY COOKIES
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth/me', {
            credentials: 'include' // ✅ Dërgon cookies automatikisht
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                currentUser = data.user;
                showChatScreen();
                loadHistory();
                updateUserInterface(data.user);
                return true;
            }
        }
    } catch (error) {
        console.error('Gabim në kontrollin e auth status:', error);
    }
    
    // Përdoruesi nuk është i loguar
    showLoginScreen();
    return false;
}

// ✅ LOGIN ME HTTP-ONLY COOKIES - VERSION I RI PËR ADMIN
async function login() {
    try {
        const username = document.getElementById("username").value.trim().toLowerCase();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            alert("Ju lutem plotësoni të dyja fushat!");
            return;
        }

        // Fshi çdo token të vjetër
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');

        const response = await fetch('/api/auth/login-with-verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // ✅ Dërgon cookies automatikisht
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            // ✅ NUK ruajmë token në localStorage!
            currentUser = data.user;
            showChatScreen();
            loadHistory();
            updateUserInterface(data.user);
            addMessage("Mirë se erdhe " + currentUser.username + "! Si mund të ndihmoj sot?", "bot");
        } else {
            alert("❌ " + data.message);
        }
    } catch (error) {
        console.error("Gabim gjatë login:", error);
        alert("❌ Problem me serverin. Provo përsëri.");
    }
}

// ✅ REGJISTRIM ME HTTP-ONLY COOKIES - VERSION I RI
async function registerWithEmail() {
    try {
        const username = document.getElementById("reg-username").value.trim();
        const email = document.getElementById("reg-email").value.trim();
        const password = document.getElementById("reg-password").value;
        const confirmPassword = document.getElementById("reg-confirm-password").value;

        // Validimi
        if (!username || !email || !password || !confirmPassword) {
            alert('❌ Ju lutem plotësoni të gjitha fushat!');
            return;
        }

        if (password !== confirmPassword) {
            alert('❌ Fjalëkalimet nuk përputhen!');
            return;
        }

        if (password.length < 6) {
            alert('❌ Fjalëkalimi duhet të jetë së paku 6 karaktere!');
            return;
        }

        // Shfaq loading
        const registerBtn = document.querySelector('.login-btn');
        registerBtn.textContent = '🔄 Po regjistrohet...';
        registerBtn.disabled = true;

        const response = await fetch('/api/auth/register-with-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ 
                username: username, 
                email: email, 
                password: password 
            })
        });

        const data = await response.json();

        if (data.success) {
            alert('✅ ' + data.message + '\n\nKontrollo email-in për linkun e verifikimit!');
            // Pastro formularin
            document.getElementById('reg-username').value = '';
            document.getElementById('reg-email').value = '';
            document.getElementById('reg-password').value = '';
            document.getElementById('reg-confirm-password').value = '';
        } else {
            alert('❌ ' + data.message);
        }
    } catch (error) {
        console.error('Gabim në regjistrim:', error);
        alert('❌ Problem me serverin. Provo përsëri më vonë.');
    } finally {
        // Rikthe butonin
        const registerBtn = document.querySelector('.login-btn');
        registerBtn.textContent = '📧 Regjistrohu me Email';
        registerBtn.disabled = false;
    }
}

// ✅ LOGOUT ME HTTP-ONLY COOKIES
async function logout() {
    try {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include' // ✅ Dërgon cookies automatikisht
        });
    } catch (error) {
        console.error("Gabim gjatë logout:", error);
    } finally {
        currentUser = null;
        localStorage.removeItem('currentUser');
        showLoginScreen();
    }
}

// ✅ VERIFIKIM EMAIL ME HTTP-ONLY COOKIES
async function verifyEmail() {
    try {
        // Shfaq modal loading
        document.getElementById('email-verification-modal').style.display = 'block';
        document.getElementById('verification-message').textContent = '🔄 Po kontrollohen të dhënat...';

        // Merr të dhënat e përdoruesit direkt nga serveri
        const userResponse = await fetch('/api/auth/me', {
            credentials: 'include'
        });

        if (!userResponse.ok) {
            throw new Error('Nuk mund të merren të dhënat e përdoruesit');
        }

        const userData = await userResponse.json();
        
        if (!userData.success) {
            document.getElementById('verification-message').textContent = '❌ ' + userData.message;
            return;
        }

        const user = userData.user;

        // Kontrollo nëse ka email
        if (!user.email) {
            document.getElementById('verification-message').textContent = '❌ Përdoruesi nuk ka email të regjistruar.';
            return;
        }

        // Kontrollo nëse është i verifikuar
        if (user.is_verified) {
            document.getElementById('verification-message').textContent = '✅ Email-i juaj është tashmë i verifikuar!';
            return;
        }

        // Dërgo kërkesën për verifikim
        document.getElementById('verification-message').textContent = '🔄 Po dërgohet email-i i verifikimit...';

        const verificationResponse = await fetch('/api/auth/request-email-verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        const verificationData = await verificationResponse.json();

        if (verificationData.success) {
            document.getElementById('verification-message').textContent = '✅ ' + verificationData.message;
        } else {
            document.getElementById('verification-message').textContent = '❌ ' + verificationData.message;
        }

    } catch (error) {
        console.error('❌ Gabim në verifikim:', error);
        document.getElementById('verification-message').textContent = '❌ Problem me serverin. Provo përsëri më vonë.';
    }
}

// ✅ FUNKSION PËR TË PËRDITËSUAR UI-N
function updateUserInterface(user) {
    // Përditëso emrin e përdoruesit
    const profileName = document.getElementById('profile-name');
    if (profileName) {
        profileName.textContent = user.username || 'User';
    }
    
    // Përditëso butonin e verifikimit
    const verifyBtn = document.getElementById('verify-email-btn');
    if (verifyBtn) {
        if (user.email && user.email !== '') {
            if (user.is_verified) {
                verifyBtn.innerHTML = '✅ Email i Verifikuar';
                verifyBtn.style.background = '#4CAF50';
                verifyBtn.onclick = () => alert('✅ Email-i juaj është tashmë i verifikuar!');
            } else {
                verifyBtn.innerHTML = '📧 Verifiko Email';
                verifyBtn.style.background = '';
                verifyBtn.onclick = verifyEmail;
            }
        } else {
            verifyBtn.innerHTML = '📧 Shto Email';
            verifyBtn.style.background = '#ff9800';
            verifyBtn.onclick = () => alert('❌ Përdoruesi nuk ka email. Regjistrohu përsëri me email.');
        }
    }
}

// ==================== FUNKSIONET PER KODIN ====================
function escapeHTML(str) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function copyCode(btn) {
    const code = btn.parentElement.nextElementSibling.nextElementSibling.innerText;
    navigator.clipboard.writeText(code);
    btn.textContent = "✅ Kopjuar";
    setTimeout(() => btn.textContent = "📋 Kopjo", 2000);
}

function downloadCode(btn, lang) {
    const code = btn.parentElement.nextElementSibling.nextElementSibling.innerText;
    const blob = new Blob([code], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `code.${lang}`;
    link.click();
}

// ==================== FUNKSIONET KRYESORE ====================

function showChatScreen() {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("chat-screen").style.display = "flex";
    
    // Shfaq emrin e përdoruesit
    if (currentUser) {
        document.getElementById("profile-name").textContent = currentUser.username;
        
        // Shfaq foton e profilit nëse ekziston
        if (currentUser.profile_picture) {
            document.getElementById("profile-pic").src = currentUser.profile_picture;
        } else {
            // Foto default
            document.getElementById("profile-pic").src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234285f4'%3E%3Cpath d='M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
        }
    }
}

function showLoginScreen() {
    document.getElementById("chat-screen").style.display = "none";
    document.getElementById("login-screen").style.display = "flex";
    document.getElementById("chat").innerHTML = "";
}

// ==================== MENAXHIMI I MESAZHEVE ====================

function sendMessage() {
    const input = document.getElementById("user-input");
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, "user");
    processCommand(text);
    input.value = "";
}

async function addMessage(content, sender, customTimestamp = null) {
    // Nëse është mesazh boti dhe nuk ka timestamp të veçantë, përdor animacionin
    if (sender === 'bot' && !customTimestamp) {
        showTypingIndicator();
        // Shtyj përpunimin për të simuluar "mendimin"
        setTimeout(() => {
            removeTypingIndicator();
            addAnimatedMessage(content, sender, customTimestamp);
        }, 1000 + Math.random() * 1000);
        return;
    }
    
    // Për mesazhet e përdoruesit ose për ngarkime nga historia, përdor metodën standarde
    const chat = document.getElementById("chat");
    const wrapper = document.createElement("div");
    wrapper.className = `message-wrapper ${sender}`;
    const msg = document.createElement("div");
    msg.className = `${sender}-message message`;

    const timestamp = customTimestamp || new Date().toLocaleTimeString("sq-AL", { 
        hour: "2-digit", 
        minute: "2-digit",
        hour12: false
    }).replace(":", "").replace(/(\d{2})(\d{2})/, "$1:$2");
    
    // Zëvendëso karakteret e prishura
    content = content.replace(/¡/g, "ë").replace(/ì/g, "i");
    
    if (content.includes("```")) {
        const parts = content.split("```");
        let finalHTML = "";
        parts.forEach((part, i) => {
            if (i % 2 === 0) {
                finalHTML += "<p>" + part + "</p>";
            } else {
                const lines = part.trim().split("\n");
                let lang = "plaintext";
                if (lines[0].match(/^[a-z]+$/i)) {
                    lang = lines[0];
                    lines.shift();
                }
                const code = lines.join("\n");
                
                // Thekso kodin në mënyrë automatike
                let highlightedCode = code;
                if (typeof hljs !== 'undefined') {
                    highlightedCode = hljs.highlightAuto(code).value;
                }
                
                // Krijo butonat e kopjimit dhe shkarkimit
                const codeActions = `
                    <div class="code-actions">
                        <button onclick="copyCode(this)">📋 Kopjo</button>
                        <button onclick="downloadCode(this, '${lang}')">⬇ Shkarko</button>
                    </div>
                `;
                
                finalHTML += `
                <div class="code-block">
                    ${codeActions}
                    <div class="code-header">${lang.toUpperCase()}</div>
                    <pre><code class="language-${lang}">${highlightedCode}</code></pre>
                </div>`;
            }
        });
        msg.innerHTML = finalHTML;
        
        // Thekso sintaksën e kodit
        setTimeout(() => {
            if (typeof hljs !== 'undefined') {
                msg.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            }
        }, 100);
    } else {
        msg.innerHTML = content;
    }

    wrapper.appendChild(msg);

    const time = document.createElement("div");
    time.className = "timestamp";
    time.textContent = timestamp;
    wrapper.appendChild(time);

    chat.appendChild(wrapper);
    chat.scrollTop = chat.scrollHeight;

    document.querySelectorAll(".message-wrapper").forEach(el => el.classList.remove("last"));
    wrapper.classList.add("last");

    if(sender === 'bot') {
        const msgId = 'msg' + Date.now();
        addFeedback(wrapper, msgId);
    }
    
    // Ruaj në histori vetëm nëse nuk është ngargim nga historia
    if (!customTimestamp && currentUser) {
        saveToHistory(content, sender, timestamp);
    }
}

// Funksionet ndihmëse për animacion
function showTypingIndicator() {
    const chat = document.getElementById("chat");
    const typingDiv = document.createElement("div");
    typingDiv.className = "message-wrapper bot";
    typingDiv.id = "typing-indicator";
    typingDiv.innerHTML = `
        <div class="bot-message message">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
        <div class="timestamp">${new Date().toLocaleTimeString("sq-AL", { 
            hour: "2-digit", 
            minute: "2-digit",
            hour12: false 
        }).replace(":", "").replace(/(\d{2})(\d{2})/, "$1:$2")}</div>
    `;
    chat.appendChild(typingDiv);
    chat.scrollTop = chat.scrollHeight;
}

function removeTypingIndicator() {
    const typingDiv = document.getElementById("typing-indicator");
    if (typingDiv) {
        typingDiv.remove();
    }
}

function addAnimatedMessage(content, sender, customTimestamp) {
    const chat = document.getElementById("chat");
    const wrapper = document.createElement("div");
    wrapper.className = `message-wrapper ${sender}`;
    const msg = document.createElement("div");
    msg.className = `${sender}-message message`;

    const timestamp = customTimestamp || new Date().toLocaleTimeString("sq-AL", { 
        hour: "2-digit", 
        minute: "2-digit",
        hour12: false
    }).replace(":", "").replace(/(\d{2})(\d{2})/, "$1:$2");
    
    // Zëvendëso karakteret e prishura
    content = content.replace(/¡/g, "ë").replace(/ì/g, "i");
    
    if (content.includes("```")) {
        const parts = content.split("```");
        let finalHTML = "";
        parts.forEach((part, i) => {
            if (i % 2 === 0) {
                finalHTML += "<p>" + part + "</p>";
            } else {
                const lines = part.trim().split("\n");
                let lang = "plaintext";
                if (lines[0].match(/^[a-z]+$/i)) {
                    lang = lines[0];
                    lines.shift();
                }
                const code = lines.join("\n");
                
                let highlightedCode = code;
                if (typeof hljs !== 'undefined') {
                    highlightedCode = hljs.highlightAuto(code).value;
                }
                
                const codeActions = `
                    <div class="code-actions">
                        <button onclick="copyCode(this)">📋 Kopjo</button>
                        <button onclick="downloadCode(this, '${lang}')">⬇ Shkarko</button>
                    </div>
                `;
                
                finalHTML += `
                <div class="code-block">
                    ${codeActions}
                    <div class="code-header">${lang.toUpperCase()}</div>
                    <pre><code class="language-${lang}">${highlightedCode}</code></pre>
                </div>`;
            }
        });
        msg.innerHTML = finalHTML;
        
        setTimeout(() => {
            if (typeof hljs !== 'undefined') {
                msg.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            }
        }, 100);
    } else {
        msg.innerHTML = content;
    }

    wrapper.appendChild(msg);

    const time = document.createElement("div");
    time.className = "timestamp";
    time.textContent = timestamp;
    wrapper.appendChild(time);

    chat.appendChild(wrapper);
    chat.scrollTop = chat.scrollHeight;

    document.querySelectorAll(".message-wrapper").forEach(el => el.classList.remove("last"));
    wrapper.classList.add("last");

    if(sender === 'bot') {
        const msgId = 'msg' + Date.now();
        addFeedback(wrapper, msgId);
    }
    
    if (!customTimestamp && currentUser) {
        saveToHistory(content, sender, timestamp);
    }
}

// ==================== HISTORIA DHE FEEDBACK ====================

async function saveToHistory(content, sender, timestamp) {
    if (!currentUser) return;
    
    try {
        const response = await fetch('/api/chat/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                userId: currentUser.id,
                content,
                sender,
                timestamp
            })
        });

        const data = await response.json();
        if (!response.ok) {
            console.error("Gabim gjatë ruajtjes së historisë:", data.error);
        }
    } catch (error) {
        console.error("Gabim gjatë ruajtjes së historisë:", error);
    }
}

async function loadHistory() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`/api/chat/history/${currentUser.id}`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (response.ok) {
            const chat = document.getElementById("chat");
            chat.innerHTML = "";
            
            data.history.forEach(msg => {
                addMessage(msg.content, msg.sender, msg.timestamp);
            });
            
            chat.scrollTop = chat.scrollHeight;
        } else {
            console.error("Gabim gjatë ngarkimit të historisë:", data.error);
        }
    } catch (error) {
        console.error("Gabim gjatë ngarkimit të historisë:", error);
    }
}

async function clearHistory() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`/api/chat/clear/${currentUser.id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            document.getElementById("chat").innerHTML = "";
            addMessage("Historia u fshi me sukses!", "bot");
        } else {
            console.error("Gabim gjatë fshirjes së historisë");
        }
    } catch (error) {
        console.error("Gabim gjatë fshirjes së historisë:", error);
    }
}

// ==================== FUNKSIONET E TJERA ====================

function toggleEmojiPanel() {
    const panel = document.getElementById("emoji-panel");
    panel.classList.toggle("hidden");
}

function changePhoto() {
    document.getElementById("new-photo").click();
}

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById("profile-pic").src = e.target.result;
            // Ruaj në localStorage për sesionin aktual
            if (currentUser) {
                currentUser.profile_picture = e.target.result;
            }
        };
        reader.readAsDataURL(file);
    }
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function downloadHistory() {
    const chat = document.getElementById("chat");
    const messages = chat.innerHTML;
    const blob = new Blob([messages], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "chat-history.html";
    link.click();
}

function uploadHistory() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".html,.txt";
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById("chat").innerHTML = e.target.result;
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function addFeedback(wrapper, msgId) {
    const feedbackDiv = document.createElement("div");
    feedbackDiv.className = "feedback";
    feedbackDiv.innerHTML = `
        <button onclick="sendFeedback('${msgId}', 'like')">👍</button>
        <button onclick="sendFeedback('${msgId}', 'dislike')">👎</button>
    `;
    wrapper.appendChild(feedbackDiv);
}

async function sendFeedback(msgId, type) {
    try {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                messageId: msgId,
                type: type,
                userId: currentUser.id
            })
        });
        
        if (response.ok) {
            console.log(`Feedback ${type} u dërgua me sukses`);
        }
    } catch (error) {
        console.error("Gabim gjatë dërgimit të feedback:", error);
    }
}

// ==================== PROCESS COMMANDS ====================

async function processCommand(text) {
    // Komanda /apikey
    if (text.startsWith('/apikey ')) {
        const apiKey = text.replace('/apikey ', '').trim();
        await saveApiKeyToServer(apiKey);
        return;
    }
    
    // Komanda /clear
    if (text === '/clear') {
        clearHistory();
        return;
    }
    
    // Komanda /help
    if (text === '/help') {
        showHelp();
        return;
    }
    
    // Nëse nuk është komandë, përpunoj si mesazh normal
    await processNormalMessage(text);
}

async function processNormalMessage(text) {
    try {
        // Shfaq animacionin e "mendimit"
        showTypingIndicator();
        
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        
        // Hiq animacionin
        removeTypingIndicator();
        
        if (data.success) {
            addMessage(data.response, "bot");
        } else {
            addMessage("❌ " + data.response, "bot");
        }
    } catch (error) {
        removeTypingIndicator();
        console.error("Gabim gjatë përpunimit të mesazhit:", error);
        addMessage("❌ Nuk mora përgjigje nga Gemini. Kontrollo API Key.", "bot");
    }
}

function showHelp() {
    const helpText = `
🤖 **Komandat e disponueshme:**

🔑 **/apikey [key_jote]** - Vendos API Key për Gemini
🗑️ **/clear** - Fshi historinë e bisedës
📖 **/help** - Shfaq këtë ndihmë

💡 **Shembuj:**
/apikey AIzaSyBxLJZ9tXOyVNxgtLn7CAT61mC84bT1dWk
/clear
/help
    `;
    addMessage(helpText, "bot");
}

// ==================== API KEY FUNCTIONS ====================

// ✅ FUNKSION I KORRIGJUAR PËR RUAJTJE API KEY
async function saveApiKeyToServer(apiKey) {
    try {
        if (!apiKey) {
            addMessage("❌ Ju lutem vendosni një API Key valid.", "bot");
            return;
        }

        const response = await fetch('/api/api-keys/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                apiKey: apiKey,
                serviceName: 'gemini'
            })
        });

        const data = await response.json();

        if (data.success) {
            addMessage("✅ " + data.message, "bot");
        } else {
            addMessage("❌ " + data.message, "bot");
        }
    } catch (error) {
        console.error('❌ Gabim në ruajtjen e API Key:', error);
        addMessage("❌ Problem me serverin. Provo përsëri.", "bot");
    }
}

// ✅ FUNKSION PËR MODALIN E API KEY
async function openApiKeyModal() {
    const modal = document.getElementById('api-key-modal');
    modal.style.display = 'block';
    
    // Pastro input-in dhe shfaq loading
    document.getElementById('api-key-input').value = "";
    document.getElementById('api-key-status').textContent = "🔄 Po kontrollohet statusi...";
    document.getElementById('api-key-status').className = "api-status";
    
    // Kontrollo statusin e API Key DIREKT NGA SERVERI
    await updateApiKeyStatus();
}

// ✅ FUNKSION PËR STATUSIN E API KEY
async function updateApiKeyStatus() {
    const statusElement = document.getElementById('api-key-status');
    
    try {
        const response = await fetch('/api/api-keys/status/gemini', {
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            
            if (data.success && data.hasApiKey) {
                statusElement.textContent = "✅ API Key është i konfiguruar në server";
                statusElement.className = "api-status valid";
                document.getElementById('api-key-input').value = "••••••••••••••••";
            } else {
                statusElement.textContent = "❌ Nuk ka API Key të konfiguruar. Chatboti nuk do të funksionojë plotësisht.";
                statusElement.className = "api-status invalid";
                document.getElementById('api-key-input').value = "";
            }
        } else {
            statusElement.textContent = "❌ Gabim në kontrollimin e statusit";
            statusElement.className = "api-status invalid";
        }
    } catch (error) {
        console.error('Gabim në kontrollimin e statusit:', error);
        statusElement.textContent = "❌ Problem me serverin";
        statusElement.className = "api-status invalid";
    }
}

// ✅ FUNKSION PËR MBYLLJEN E MODALIT
function closeApiKeyModal() {
    document.getElementById('api-key-modal').style.display = 'none';
}

// ✅ INICIALIZIMI I MODALEVE
document.addEventListener('DOMContentLoaded', function() {
    // Modal për API Key
    const apiModal = document.getElementById('api-key-modal');
    const apiBtn = document.getElementById('api-key-btn');
    const apiClose = apiModal.querySelector('.close');
    
    apiBtn.onclick = openApiKeyModal;
    
    apiClose.onclick = function() {
        apiModal.style.display = 'none';
    }
    
    // Modal për verifikim email
    const verificationModal = document.getElementById('email-verification-modal');
    const verificationClose = verificationModal.querySelector('.close');
    
    verificationClose.onclick = function() {
        verificationModal.style.display = 'none';
    }
    
    window.onclick = function(event) {
        if (event.target == apiModal) {
            apiModal.style.display = 'none';
        }
        if (event.target == verificationModal) {
            verificationModal.style.display = 'none';
        }
    }
});
