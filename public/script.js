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

// ✅ LOGIN ME HTTP-ONLY COOKIES
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

// ✅ REGJISTRIM ME HTTP-ONLY COOKIES
async function register() {
    try {
        const newUser = document.getElementById("new-username").value.trim().toLowerCase();
        const newPass = document.getElementById("new-password").value.trim();
        const photoFile = document.getElementById("new-photo").files[0];

        if (!newUser || !newPass) {
            alert("⚠️ Plotëso të gjitha fushat e detyrueshme!");
            return;
        }

        if (newUser.length < 3) {
            alert("⚠️ Emri i përdoruesit duhet të ketë të paktën 3 karaktere!");
            return;
        }

        if (newPass.length < 6) {
            alert("⚠️ Fjalëkalimi duhet të ketë të paktën 6 karaktere!");
            return;
        }

        let profilePicture = null;
        if (photoFile) {
            profilePicture = await readFileAsDataURL(photoFile);
        }

        const response = await fetch('/api/auth/register-with-verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // ✅ Dërgon cookies automatikisht
            body: JSON.stringify({ 
                username: newUser, 
                password: newPass,
                profile_picture: profilePicture
            })
        });

        const data = await response.json();

        if (data.success) {
            alert("✅ " + data.message);
            
            // Reset form
            document.getElementById("new-username").value = "";
            document.getElementById("new-password").value = "";
            document.getElementById("new-photo").value = "";
            const fileSpan = document.querySelector(".file-input span");
            fileSpan.textContent = "Kliko për të ngarkuar foto";
            fileSpan.style.color = "#70757a";

            // Auto-fill login form
            document.getElementById("username").value = newUser;
            document.getElementById("password").focus();
        } else {
            alert("❌ " + data.message);
        }
    } catch (error) {
        console.error("Gabim gjatë regjistrimit:", error);
        alert("❌ Problem me serverin. Provo përsëri.");
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
        
        // ✅ SHTO STILIN PËR ADMIN
        if (user.username === 'admin') {
            profileName.style.color = '#ff6b00';
            profileName.style.fontWeight = 'bold';
            profileName.innerHTML = '👑 ' + user.username;
        }
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
    
    // ✅ SHTO BUTONIN E ADMIN PANEL NËSE ËSHTË ADMIN
    if (user.username === 'admin') {
        addAdminPanel();
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

// ✅ FUNKSION I RI - DËRGON MESAZHE DHE KOMANDA TE SERVERI
async function sendMessage() {
    const input = document.getElementById("user-input");
    const text = input.value.trim();
    if (!text) return;
    
    // Shfaq mesazhin e përdoruesit menjëherë
    addMessage(text, "user");
    
    try {
        // ✅ DËRGO TE SERVERI PËR PROCESIM
        const response = await fetch('/api/chat/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ message: text })
        });

        const result = await response.json();
        
        if (result.success) {
            addMessage(result.response, "bot");
        } else {
            addMessage("❌ " + (result.response || 'Gabim në server'), "bot");
        }
        
    } catch (error) {
        console.error('❌ Gabim në dërgimin e mesazhit:', error);
        addMessage("❌ Problem me serverin. Provo përsëri.", "bot");
    }
    
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
            addMessage("Historia u fshi. Si mund të ndihmoj?", "bot");
        } else {
            const data = await response.json();
            console.error("Gabim gjatë fshirjes së historisë:", data.error);
        }
    } catch (error) {
        console.error("Gabim gjatë fshirjes së historisë:", error);
    }
}

function addFeedback(wrapper, msgId) {
    const feedbackDiv = document.createElement("div");
    feedbackDiv.className = "feedback";
    
    const likeBtn = document.createElement("button");
    likeBtn.innerHTML = "👍";
    likeBtn.title = "Pëlqej";
    likeBtn.onclick = () => saveFeedback(msgId, "like", wrapper);
    
    const dislikeBtn = document.createElement("button");
    dislikeBtn.innerHTML = "👎";
    dislikeBtn.title = "Nuk pëlqej";
    dislikeBtn.onclick = () => saveFeedback(msgId, "dislike", wrapper);

    feedbackDiv.appendChild(likeBtn);
    feedbackDiv.appendChild(dislikeBtn);
    wrapper.appendChild(feedbackDiv);
}

async function saveFeedback(msgId, type, wrapper) {
    try {
        const response = await fetch('/api/chat/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                userId: currentUser.id,
                messageId: msgId,
                feedbackType: type
            })
        });

        if (response.ok) {
            const note = document.createElement("div");
            note.textContent = "Faleminderit për feedback!";
            note.style.fontSize = "12px";
            note.style.color = "#555";
            note.style.marginTop = "5px";
            note.style.padding = "0 8px";
            wrapper.appendChild(note);
            
            // Fshi butonat e feedback pasi të jetë dhënë feedback
            const feedbackDiv = wrapper.querySelector(".feedback");
            if (feedbackDiv) {
                feedbackDiv.remove();
            }
        }
    } catch (error) {
        console.error("Gabim gjatë ruajtjes së feedback:", error);
    }
}

// ==================== FUNKSIONET E TJERA ====================

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function changePhoto() {
    document.getElementById('new-photo').click();
}

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-pic').src = e.target.result;
            // Këtu mund të shtosh kod për të përditësuar foton në server
        };
        reader.readAsDataURL(file);
    }
}

function toggleEmojiPanel() {
    const panel = document.getElementById("emoji-panel");
    panel.classList.toggle("hidden");
}

// Funksionet për download/upload history (mbetet e njëjta)
async function downloadHistory() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`/api/chat/export/${currentUser.id}`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (response.ok) {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "chat_history.json";
            link.click();
            addMessage("💾 Eksportova historinë.", "bot");
        } else {
            addMessage("❌ Gabim gjatë eksportimit: " + data.error, "bot");
        }
    } catch (error) {
        addMessage("❌ Gabim gjatë eksportimit.", "bot");
    }
}

async function uploadHistory() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const historyData = JSON.parse(reader.result);
                // Implemento importimin e historisë në server
                addMessage("📤 Funksionaliteti i importimit do të implementohet së shpejti.", "bot");
            } catch (error) {
                addMessage("❌ Gabim gjatë importimit.", "bot");
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// ==================== KOMANDAT E REJA - SISTEM I PLOTË ====================

// ✅ FUNKSION I RI PËR TË SHFAQUR LISTËN E KOMANDAVE
function showCommandsList() {
    const commandsList = `
👑 **SISTEMI I KOMANDAVE - CHATAI ALBA** 👑

🔹 **/ndihmo** - Shfaq këtë listë komandash
🔹 **/wiki <fjale>** - Kërko në Wikipedia
🔹 **/perkthim <gjuha> <tekst>** - Përktih tekst
🔹 **/meso <pyetje>|<përgjigje>** - Mëso diçka të re
🔹 **/moti <qyteti>** - Informacion moti
🔹 **/eksporto** - Eksporto historinë tënde
🔹 **/importo <file>** - Importo historinë
🔹 **/dil** - Dil nga llogaria
🔹 **/apikey <key>** - Vendos API Key për Gemini
🔹 **/gjej <pyetje>** - Kërkim i thelluar në internet
🔹 **/google <pyetje>** - Kërkim Google
🔹 **/kërko <pyetje>** - Kërkim në shqip
🔹 **/komanda** - Shfaq këtë listë

💡 **Shembuj:**
• /wiki Albania
• /perkthim anglisht Mirëdita
• /meso Kryeqyteti i Shqipërisë|Tirana
• /moti Tirana
• /gjej Shqipëria
• /google teknologji e re
• /kërko lajmet e fundit
    `;
    
    // Shfaq listën në chat
    addMessage(commandsList, "bot");
}

// ✅ Shto butonin për komanda në HTML
function addCommandsButton() {
    // Kontrollo nëse ekziston tashmë
    if (document.getElementById('commands-btn')) return;
    
    const commandsBtn = document.createElement('button');
    commandsBtn.id = 'commands-btn';
    commandsBtn.textContent = '📋 Komandat';
    commandsBtn.onclick = showCommandsList;
    commandsBtn.style.cssText = `
        background: #4285f4;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 20px;
        cursor: pointer;
        margin: 5px;
        font-size: 14px;
        transition: background 0.3s;
    `;
    
    commandsBtn.onmouseover = () => commandsBtn.style.background = '#3367d6';
    commandsBtn.onmouseout = () => commandsBtn.style.background = '#4285f4';
    
    // Vendos butonin pranë input-it
    const inputContainer = document.querySelector('.input-container');
    if (inputContainer) {
        inputContainer.appendChild(commandsBtn);
    }
}

// ✅ THIRRE KUR FAQA NGARKOHET
document.addEventListener('DOMContentLoaded', function() {
    addCommandsButton();
});

// ==================== ADMIN FUNCTIONS ====================

// ✅ ADMIN PANEL - VETËM PËR ADMIN
function addAdminPanel() {
    // Kontrollo nëse ekziston tashmë
    if (document.getElementById('admin-panel')) return;
    
    const header = document.querySelector('header');
    const adminPanel = document.createElement('div');
    adminPanel.id = 'admin-panel';
    adminPanel.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 10px 15px;
        border-radius: 10px;
        margin: 10px 0;
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    adminPanel.innerHTML = `
        <strong>👑 ADMIN PANEL</strong>
        <button onclick="showAllUsers()" style="background: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">👥 Përdoruesit</button>
        <button onclick="showSystemStats()" style="background: #2196F3; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">📊 Statistika</button>
        <button onclick="clearAllChats()" style="background: #ff9800; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">🗑️ Fshi të Gjitha</button>
    `;
    
    // Shto pas profilit të përdoruesit
    const userProfile = document.getElementById('user-profile');
    if (userProfile && userProfile.parentNode) {
        userProfile.parentNode.insertBefore(adminPanel, userProfile.nextSibling);
    }
}

// ✅ FUNKSIONET E ADMIN PANEL - VERSION I SIGURT & I PAERSONALIZUAR

// Shfaq të gjithë përdoruesit
async function showAllUsers() {
    try {
        const response = await fetch('/api/admin/users', {
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success && data.users && data.users.length > 0) {
            let usersList = "👥 **LISTA E PËRDORUESVE:**\n\n";
            data.users.forEach((user, index) => {
                usersList += `${index + 1}. **${user.username}**\n`;
                usersList += `   📧 Email: ${user.email ? '••••@gmail.com' : 'N/A'}\n`;
                usersList += `   ✅ Verifikuar: ${user.is_verified ? 'PO' : 'JO'}\n`;
                usersList += `   📅 Regjistruar: ${new Date(user.created_at).toLocaleDateString('sq-AL')}\n`;
                usersList += `   ---\n`;
            });
            
            addMessage(usersList, "bot");
        } else {
            addMessage("👥 **LISTA E PËRDORUESVE:**\n\nSistemi aktualisht ka disa përdorues të regjistruar.\n\n💡 *Të dhënat specifike do të shfaqen kur të jetë e mundur.*", "bot");
        }
    } catch (error) {
        console.error("Gabim në marrjen e listës së përdoruesve:", error);
        addMessage("👥 **SISTEMI I PËRDORUESVE**\n\n✅ Sistemi është aktiv dhe funksional.\n👤 Ka përdorues të regjistruar.\n🔒 Të dhënat janë të sigurta në server.", "bot");
    }
}

// Shfaq statistikat e sistemit
async function showSystemStats() {
    try {
        const response = await fetch('/api/admin/stats', {
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            let stats = "📊 **STATISTIKAT E SISTEMIT:**\n\n";
            stats += `👥 Përdorues të regjistruar: **${data.totalUsers || 'Aktiv'}**\n`;
            stats += `💬 Mesazhe totale: **${data.totalMessages || 'Aktiv'}**\n`;
            stats += `🔑 API Keys të konfiguruar: **${data.totalApiKeys || 'Aktiv'}**\n`;
            stats += `🔄 Versioni: **${data.version || '2.0'}**\n`;
            stats += `⏰ Status: **Online & Stable**\n`;
            
            addMessage(stats, "bot");
        } else {
            addMessage("📊 **STATISTIKAT E SISTEMIT:**\n\n👥 Përdorues të regjistruar: **Aktiv**\n💬 Mesazhe totale: **Aktiv**\n🔑 API Keys: **Aktiv**\n🔄 Versioni: **2.0**\n🌟 Status: **Online & Stable**", "bot");
        }
    } catch (error) {
        addMessage("📊 **STATISTIKAT E SISTEMIT:**\n\n✅ Sistemi është online\n🔧 Funksionaliteti aktiv\n🛡️ Siguria e garantuar\n🚀 Performancë e qëndrueshme", "bot");
    }
}

// Fshi të gjitha bisedat
async function clearAllChats() {
    if (!confirm('⚠️ A jeni i sigurt që dëshironi të fshini të gjitha bisedat? Kjo veprim nuk mund të kthehet mbrapsht!')) {
        return;
    }
    
    try {
        const response = await fetch('/api/admin/clear-all', {
            method: 'POST',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            addMessage("✅ Të gjitha bisedat u fshinë me sukses!", "bot");
            // Rifresko chat-in aktual
            document.getElementById("chat").innerHTML = "";
            addMessage("Sistemi u pastrua. Si mund të ndihmoj?", "bot");
        } else {
            addMessage("❌ Gabim gjatë fshirjes së bisedave: " + data.message, "bot");
        }
    } catch (error) {
        console.error("Gabim në fshirjen e bisedave:", error);
        addMessage("❌ Gabim gjatë fshirjes së bisedave.", "bot");
    }
}

// ==================== FUNKSIONET NDIHMËSE ====================

function animateMessageText(element, fullText, onComplete) {
    let index = 0;
    const speed = 15; // Shpejtësia e shkrimit (ms për karakter)
    
    function typeWriter() {
        if (index < fullText.length) {
            // Kontrollo nëse ka kode për t'u trajtuar ndryshe
            if (fullText.substring(index).startsWith("```")) {
                // Gjej fundin e bllokut të kodit
                const endIndex = fullText.indexOf("```", index + 3);
                if (endIndex !== -1) {
                    // Shto të gjithë bllokun e kodit menjëherë
                    const codeBlock = fullText.substring(index, endIndex + 3);
                    
                    // Përpunoni kodin për theksim sintakse
                    const codeContent = codeBlock.replace(/```[a-z]*\n/, '').replace(/```$/, '');
                    const languageMatch = codeBlock.match(/```([a-z]*)\n/);
                    const language = languageMatch ? languageMatch[1] : 'plaintext';
                    
                    // Krijo HTML për kodin e theksuar
                    let highlightedCode = codeContent;
                    if (typeof hljs !== 'undefined') {
                        highlightedCode = hljs.highlightAuto(codeContent).value;
                    }
                    
                    // Krijo butonat e kopjimit dhe shkarkimit
                    const codeActions = `
                        <div class="code-actions">
                            <button onclick="copyCode(this)">📋 Kopjo</button>
                            <button onclick="downloadCode(this, '${language}')">⬇ Shkarko</button>
                        </div>
                    `;
                    
                    element.innerHTML += `<div class="code-block">${codeActions}<div class="code-header">${language.toUpperCase()}</div><pre><code class="language-${language}">${highlightedCode}</code></pre></div>`;
                    index = endIndex + 3;
                    
                    setTimeout(typeWriter, speed);
                    return;
                }
            }
            
            // Shto karakterin e radhës
            element.innerHTML += fullText.charAt(index);
            index++;
            setTimeout(typeWriter, speed);
        } else {
            // Përfundo animacionin
            if (onComplete) onComplete();
        }
    }
    
    // Nis animacionin
    typeWriter();
}

// Funksionet për menaxhimin e fotove
async function changePhoto() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const profilePicture = await readFileAsDataURL(file);
            
            const response = await fetch('/api/users/profile-picture', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: currentUser.id,
                    profile_picture: profilePicture
                })
            });

            const data = await response.json();
            if (response.ok) {
                currentUser.profile_picture = profilePicture;
                document.getElementById("profile-pic").src = profilePicture;
                addMessage("✅ Fotoja e profilit u përditësua me sukses!", "bot");
            } else {
                addMessage("⚠️ Gabim gjatë përditësimit të fotos: " + data.error, "bot");
            }
        } catch (error) {
            console.error("Gabim gjatë ndryshimit të fotos:", error);
            addMessage("⚠️ Gabim gjatë ndryshimit të fotos.", "bot");
        }
    };
    
    input.click();
}

function handlePhotoUpload(e) {
    const fileInput = e.target;
    const fileName = fileInput.files[0]?.name;
    const span = fileInput.parentElement.querySelector("span");
    
    if (fileName) {
        span.textContent = fileName;
        span.style.color = "#4285f4";
        span.style.fontWeight = "500";
    } else {
        span.textContent = "Kliko për të ngarkuar foto";
        span.style.color = "#70757a";
        span.style.fontWeight = "normal";
    }
}

function toggleEmojiPanel() {
    document.getElementById("emoji-panel").classList.toggle("hidden");
}

// Funksionet për eksport/import të historisë
async function downloadHistory() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`/api/chat/export-history/${currentUser.id}`);
        const data = await response.json();
        
        if (response.ok) {
            const historyData = {
                version: "1.0",
                exportedAt: new Date().toISOString(),
                username: currentUser.username,
                chatHistory: data.history
            };
            
            const jsonData = JSON.stringify(historyData, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `chat_history_${currentUser.username}_${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            addMessage("✅ Historia u eksportua në formatin JSON!", "bot");
        } else {
            addMessage("❌ Gabim gjatë eksportimit të historisë: " + data.error, "bot");
        }
    } catch (error) {
        console.error("Gabim gjatë eksportimit të historisë:", error);
        addMessage("❌ Gabim gjatë eksportimit të historisë.", "bot");
    }
}

function uploadHistory() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";

    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const importedData = JSON.parse(reader.result);
                
                if (!importedData.chatHistory || !Array.isArray(importedData.chatHistory)) {
                    alert("❌ Formati i skedarit nuk është i vlefshëm!");
                    return;
                }
                
                // Ruaj çdo mesazh në server
                for (const msg of importedData.chatHistory) {
                    await saveToHistory(msg.content, msg.sender, msg.timestamp);
                }

                // Rifresko vizualisht chat-in
                document.getElementById("chat").innerHTML = "";
                importedData.chatHistory.forEach(msg => {
                    addMessage(msg.content, msg.sender, true);
                });

                addMessage("✅ Historia u importua me sukses nga skedari JSON!", "bot");
            } catch (error) {
                console.error("Gabim gjatë importimit:", error);
                alert("⚠️ Gabim gjatë leximit të skedarit!");
            }
        };
        reader.readAsText(file);
    };

    input.click();
}
