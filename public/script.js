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

// ====================== SISTEMI I RI I AUTHENTIKIMIT ====================

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

// ✅ LOGIN ME HTTP-ONLY COOKIES - VERSION I SIGURT
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
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
             // ✅ NUK ruajmë token në localStorage!
            currentUser = data.user;
            showChatScreen();
            loadHistory();
            updateUserInterface(data.user);
            addMessage("👑 Mirë se erdhe " + currentUser.username + "! Si mund të ndihmoj sot?", "bot");
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

// ======================= ✅ FUNKSIONI I KORRIGJUAR - LOADHISTORY ====================

async function loadHistory() {
    try {
        console.log('🔄 Duke ngarkuar historinë...');
        
        // ✅ METODA 1: Përdor userId nga session cookies
        const userId = await getCurrentUserId();
        
        if (!userId) {
            console.log('ℹ️ Nuk ka user aktiv, duke filluar bisedë të re');
            return; // Nuk ka histori për të ngarkuar
        }
        
        console.log('📊 Duke kërkuar historinë për user:', userId);
        
        const response = await fetch(`/api/chat/history/${userId}`, {
            method: 'GET',
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        
        console.log('📨 Përgjigja e historisë:', data);
        
        if (data.success && data.history) {
            const chat = document.getElementById("chat");
            if (!chat) {
                console.error('❌ Elementi #chat nuk u gjet');
                return;
            }
            
            // Pastro chat-in ekzistues
            chat.innerHTML = "";
            
            // Shto mesazhet historike
            data.history.forEach(msg => {
                addMessage(msg.content, msg.sender, msg.timestamp);
            });
            
            // Scroll në fund
            chat.scrollTop = chat.scrollHeight;
            
            console.log(`✅ U ngarkuan ${data.history.length} mesazhe historike`);
        } else {
            console.log('ℹ️ Nuk ka histori të mëparshme ose gabim në përgjigje:', data.message);
        }
        
    } catch (error) {
        console.error("❌ Gabim gjatë ngarkimit të historisë:", error.message);
        // Mos e shfaq error-in për përdoruesin, thjesht fillo bisedë të re
        console.log('🆕 Duke filluar bisedë të re pa histori...');
    }
}

// ✅ FUNKSION I RI - MER USER ID NGA SESIONI
async function getCurrentUserId() {
    try {
        // Provo të marrësh session nga server
        const response = await fetch('/api/chat/init-session', {
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.sessionData) {
                return data.sessionData.userId;
            }
        }
    } catch (error) {
        console.log('ℹ️ Nuk mund të merret session, duke përdorur default');
    }
    
    // Fallback nëse nuk funksionon
    return '2'; // ose '1' - përdoruesi default
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

// =================== Funksionet për download/upload history (mbetet e njëjta) ===========================
// ======================================================
// 💾 ENDPOINT PËR SHKARKIM TË HISTORISË SË BISEDËS SI JSON
// ======================================================

// ✅ ENDPOINT PËR SHKARKIM HISTORIE BISEDE SI JSON (PËR BUTONIN "SHKARKO")
router.get('/export/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        console.log('💾 SHKARKO JSON: Duke përgatitur historinë e bisedës si JSON për:', userId);
        
        // ✅ MERRE HISTORINË E BISEDËS NGA TABELA messages
        const chatHistory = await new Promise((resolve) => {
            db.all(
                `SELECT content, sender, timestamp 
                 FROM messages 
                 WHERE user_id = ? 
                 ORDER BY timestamp ASC`,
                [userId],
                (err, rows) => {
                    if (err) {
                        console.error('❌ GABIM SHKARKIMI JSON:', err);
                        resolve([]);
                    } else {
                        console.log(`✅ SHKARKO JSON: Gjetur ${rows?.length || 0} mesazhe`);
                        resolve(rows || []);
                    }
                }
            );
        });

        // ✅ NËSE NUK KA HISTORI, KTHE JSON ME GABIM
        if (chatHistory.length === 0) {
            return res.json({
                success: false,
                message: '❌ Nuk ka histori bisede për të shkarkuar'
            });
        }

        // ✅ NËSE KA HISTORI, KTHE JSON ME TË DHËNAT
        console.log(`✅ SHKARKO JSON: Duke dërguar ${chatHistory.length} mesazhe si JSON`);
        
        res.json({
            success: true,
            history: chatHistory,
            user: userId,
            exportDate: new Date().toISOString(),
            totalMessages: chatHistory.length
        });

    } catch (error) {
        console.error('❌ GABIM NË SHKARKIM JSON:', error);
        res.status(500).json({
            success: false,
            message: '❌ Gabim gjatë shkarkimit të historisë'
        });
    }
});


// ✅ FUNKSION I RI PËR TË MARRË USER ID NGA COOKIES
function getUserIdFromCookies() {
    try {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'chatUserId' && value) {
                return value;
            }
        }
        return '1'; // Fallback
    } catch (error) {
        return '1'; // Fallback
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

// ==================== GEMINI FUKSION ========================================
// ✅ FUNKSION I KORRIGJUAR - NUK DËRGON USERID, VETËM MESAZHIN
async function askGemini(question) {
    try {
        console.log('🚀 Duke dërguar pyetje në /api/gemini/ask...');

        const response = await fetch('/api/gemini/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // ✅ Dërgon HTTP-Only cookie automatikisht
            body: JSON.stringify({
                message: question // ✅ VETËM MESAZHI
            })
        });

        const data = await response.json();
        console.log('📥 Përgjigja nga serveri:', data);

        if (data.success) {
            return data.response;
        } else {
            return "❌ " + (data.error || 'Gabim në server');
        }

    } catch (error) {
        console.error('❌ Gabim në komunikim me serverin:', error);
        return "❌ Problem me serverin. Provo përsëri më vonë.";
    }
}

// ==================== KOMANDAT ====================

async function processCommand(text) {
    const parts = text.trim().split(" ");
    const cmd = parts[0];

    switch (cmd) {
        case "/dil":
            addMessage("Dalje nga sistemi...", "bot");
            setTimeout(() => logout(), 1000);
            break;

        case "/ndihmo":
            addMessage("📌 Komandat: /ndihmo, /wiki <fjale>, /perkthim <gjuha> <tekst>, /meso <pyetje>|<përgjigje>, /moti <qyteti>, /eksporto, /importo, /dil, /apikey", "bot");
            break;

        case "/meso":
            const split = text.replace("/meso", "").split("|");
            if (split.length === 2) {
                const q = split[0].trim().toLowerCase();
                const a = split[1].trim();
                
                try {
                    const response = await fetch('/api/chat/knowledge', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            userId: currentUser.id,
                            question: q,
                            answer: a
                        })
                    });

                    const data = await response.json();
                    if (response.ok) {
                        knowledgeBase[q] = a;
                        addMessage("✅ Mësova diçka të re!", "bot");
                    } else {
                        addMessage("⚠️ Gabim gjatë ruajtjes së njohurive: " + data.error, "bot");
                    }
                } catch (error) {
                    addMessage("⚠️ Gabim gjatë ruajtjes së njohurive.", "bot");
                }
            } else {
                addMessage("⚠️ Përdorimi: /meso pyetje | përgjigje", "bot");
            }
            break;

        case "/wiki":
            const query = parts.slice(1).join(" ");
            if (!query) { addMessage("⚠️ Shkruaj diçka për të kërkuar.", "bot"); break; }
            try {
                showTypingIndicator();
                const res = await fetch(`https://sq.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
                const data = await res.json();
                removeTypingIndicator();
                if (data.extract) addMessage(`🌐 ${data.extract}`, "bot");
                else addMessage("❌ Nuk u gjet informacion.", "bot");
            } catch { 
                removeTypingIndicator();
                addMessage("⚠️ Gabim gjatë kërkimit në Wikipedia.", "bot"); 
            }
            break;

        case "/perkthim":
            if (parts.length < 3) return addMessage("⚠️ Përdorimi: /perkthim [gjuha] [tekst]", "bot");
            const targetLang = parts[1].toLowerCase();
            const tekst = parts.slice(2).join(" ");
            const sourceLang = (targetLang === "sq") ? "en" : "sq";
            
            showTypingIndicator();
            
            fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(tekst)}&langpair=${sourceLang}|${targetLang}`)
                .then(r => r.json())
                .then(d => {
                    removeTypingIndicator();
                    const translatedText = d?.responseData?.translatedText || "❌ Gabim përkthimi.";
                    addMessage(translatedText, "bot");
                })
                .catch(() => {
                    removeTypingIndicator();
                    addMessage("⚠️ Gabim përkthimi.", "bot");
                });
            break;

        case "/eksporto":
            try {
                const response = await fetch(`/api/chat/export/${currentUser.id}`);
                const data = await response.json();
                
                if (response.ok) {
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = "knowledge.json";
                    link.click();
                    addMessage("💾 Eksportova njohuritë.", "bot");
                } else {
                    addMessage("❌ Gabim gjatë eksportimit: " + data.error, "bot");
                }
            } catch (error) {
                addMessage("❌ Gabim gjatë eksportimit.", "bot");
            }
            break;

        case "/importo":
            const inp = document.createElement("input");
            inp.type = "file"; inp.accept = "application/json";
            inp.onchange = async e => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = async () => {
                    try {
                        const knowledgeData = JSON.parse(reader.result);
                        
                        const response = await fetch('/api/chat/import', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                userId: currentUser.id,
                                knowledge: knowledgeData
                            })
                        });

                        const data = await response.json();
                        if (response.ok) {
                            addMessage("✅ Importova njohuritë.", "bot");
                        } else {
                            addMessage("❌ Gabim gjatë importimit: " + data.error, "bot");
                        }
                    } catch (error) {
                        addMessage("❌ Gabim gjatë importimit.", "bot");
                    }
                };
                reader.readAsText(file);
            };
            inp.click();
            break;

        case "/moti":
            if (parts.length < 2) {
                addMessage("⚠️ Përdorimi: /moti [qyteti]", "bot");
            } else {
                const qyteti = parts.slice(1).join(" ");
                showTypingIndicator();
                fetch(`https://wttr.in/${encodeURIComponent(qyteti)}?format=%c+%t+%w+%h`)
                    .then(res => res.text())
                    .then(data => {
                        removeTypingIndicator();
                        addMessage("🌍 Moti në " + qyteti + ": " + data, "bot");
                    })
                    .catch(() => {
                        removeTypingIndicator();
                        addMessage("⚠️ Gabim gjatë marrjes së motit.", "bot");
                    });
            }
            break;

        case "/apikey":
            if (parts.length < 2) {
                // Shfaq statusin e API Key
                try {
                    // ✅ KORREKT - përdor endpoint-in e ri me authentication
const response = await fetch('/api/api-keys/status/gemini', {
    credentials: 'include'
});
                    const data = await response.json();
                    
                    if (data.hasApiKey) {
                        addMessage("🔑 API Key është konfiguruar në server (e ruajtur: " + new Date(data.createdAt).toLocaleDateString("sq-AL") + ")", "bot");
                    } else {
                        addMessage("❌ Nuk ka API Key të konfiguruar. Përdor: /apikey [key_jote]", "bot");
                    }
                } catch (error) {
                    addMessage("❌ Gabim gjatë kontrollimit të statusit të API Key.", "bot");
                }
            } else {
                // Vendos API Key të ri
                const newApiKey = parts.slice(1).join(" ");
                
                try {
                    const response = await fetch('/api/api-keys/save', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            userId: currentUser.id,
                            apiKey: newApiKey,
                            serviceName: 'gemini'
                        })
                    });

                    const data = await response.json();
                    if (response.ok) {
                        addMessage("✅ API Key u ruajt me sukses në server!", "bot");
                    } else {
                        addMessage("❌ Gabim gjatë ruajtjes së API Key: " + data.error, "bot");
                    }
                } catch (error) {
                    addMessage("❌ Gabim gjatë ruajtjes së API Key.", "bot");
                }
            }
            break;

        // ✅ KOMANDAT E REJA PËR ADMIN
        case "/admin":
            if (currentUser && currentUser.username === 'admin') {
                addMessage("👑 **PANELI I ADMINIT**\n\nKomandat:\n• /users - Shfaq të gjithë përdoruesit\n• /stats - Statistikat e sistemit\n• /clearall - Fshi të gjitha bisedat\n• /panel - Shfaq panelin e adminit", "bot");
            } else {
                addMessage("❌ Kjo komandë është vetëm për administratorët.", "bot");
            }
            break;

        case "/users":
            if (currentUser && currentUser.username === 'admin') {
                showAllUsers();
            } else {
                addMessage("❌ Kjo komandë është vetëm për administratorët.", "bot");
            }
            break;

        case "/stats":
            if (currentUser && currentUser.username === 'admin') {
                showSystemStats();
            } else {
                addMessage("❌ Kjo komandë është vetëm për administratorët.", "bot");
            }
            break;

        case "/clearall":
            if (currentUser && currentUser.username === 'admin') {
                clearAllChats();
            } else {
                addMessage("❌ Kjo komandë është vetëm për administratorët.", "bot");
            }
            break;

        case "/panel":
            if (currentUser && currentUser.username === 'admin') {
                addAdminPanel();
                addMessage("👑 Paneli i Adminit u shfaq!", "bot");
            } else {
                addMessage("❌ Kjo komandë është vetëm për administratorët.", "bot");
            }
            break;

        default:
            const key = text.toLowerCase();
            
            try {
                const response = await fetch(`/api/chat/knowledge/${currentUser.id}/${encodeURIComponent(key)}`);
                const data = await response.json();
                
                if (data.answer) {
                    addMessage(data.answer, "bot");
                    return;
                }
            } catch (error) {
                console.error("Gabim gjatë kërkimit të njohurive:", error);
            }

            const calc = tryCalculate(text);
            if (calc !== null) { 
                addMessage("🧮 Rezultati: " + calc, "bot"); 
                return; 
            }

            // Kontrollo nëse ka API Key në server
            try {
                // ✅ KORREKT - përdor endpoint-in e ri me authentication
const response = await fetch('/api/api-keys/status/gemini', {
    credentials: 'include'
});
                const data = await response.json();
                
                if (!data.hasApiKey) {
                    addMessage("❌ Nuk është konfiguruar API Key për Gemini. Përdor komandën /apikey [key_jote] për të vendosur një API Key.", "bot");
                    return;
                }
                
                // Nëse ka API Key, bëj thirrjen për Gemini përmes serverit
                showTypingIndicator();
                
                // ✅ KORREKT - dërgon vetëm mesazhin
const geminiResponse = await fetch('/api/gemini/ask', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: 'include', // ✅ Shto këtë
    body: JSON.stringify({ 
        message: text  // ✅ VETËM MESAZHI
    })
});
                const geminiData = await geminiResponse.json();
                removeTypingIndicator();
                
                if (geminiData.success && geminiData.response) {
                    addMessage(geminiData.response, "bot");
                } else {
                    addMessage("❌ Nuk mora përgjigje nga Gemini. Kontrollo API Key.", "bot");
                }
            } catch {
                removeTypingIndicator();
                addMessage("⚠️ Gabim gjatë lidhjes me serverin.", "bot");
            }
    }
}

function tryCalculate(text) {
    const ops = {
        "+": ["plus", "shto", "mbledh", "mbledhje"],
        "-": ["minus", "hiq", "zbritje", "zbresim", "zbres"],
        "*": ["herë", "shumëzim", "shumëzo"],
        "/": ["pjesëto", "ndarje"]
    };
    let expr = text.toLowerCase();
    if (!/\d/.test(expr)) return null;
    for (const [sym, words] of Object.entries(ops)) {
        words.forEach(w => expr = expr.replace(new RegExp("\\b" + w + "\\b", "g"), sym));
    }
    expr = expr.replace(/sa\s+b[eë]jn[eë]?/g, "");
    try {
        const result = Function('"use strict";return (' + expr + ")")();
        if (typeof result === "number" && !isNaN(result)) return result;
    } catch {}
    return null;
}

// ==================== FUNKSIONET NDIHMËSE ====================

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

function showTypingIndicator() {
    const chat = document.getElementById("chat");
    const typingIndicator = document.createElement("div");
    typingIndicator.id = "typing-indicator";
    typingIndicator.className = "message-wrapper bot";
    typingIndicator.innerHTML = `
        <div class="bot-message message">
            <div class="typing-dots">
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
    chat.appendChild(typingIndicator);
    chat.scrollTop = chat.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById("typing-indicator");
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function addAnimatedMessage(content, sender, customTimestamp = null) {
    return new Promise((resolve) => {
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
        
        // Ruaj përmbajtjen origjinale për animim
        msg.dataset.fullContent = content;
        msg.innerHTML = ""; // Fillimisht bosh
        
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
        
        // Animo shkrimin e mesazhit
        animateMessageText(msg, content, () => {
            // Pas përfundimit të animacionit, kontrollo për kod dhe thelloje nëse është e nevojshme
            if (typeof hljs !== 'undefined' && msg.innerHTML.includes('```')) {
                setTimeout(() => {
                    const codeElements = msg.querySelectorAll('pre code');
                    codeElements.forEach(code => hljs.highlightElement(code));
                }, 100);
            }
            resolve();
        });
        
        // Ruaj në histori vetëm nëse nuk është ngargim nga historia
        if (!customTimestamp) {
            saveToHistory(content, sender, timestamp);
        }
    });
}

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

// ============================= Funksionet për eksport/import të historisë ====================================== 
// ✅ FUNKSIONI I RI PËR SHKARKIM TË HISTORISË 
async function downloadHistory() {
    try {
        console.log('📥 Duke shkarkuar historinë...');
        
        const userId = getCurrentUserId(); // Merr userId nga session
        
        if (!userId) {
            alert('❌ Nuk mund të gjendet sesioni. Rifresko faqen.');
            return;
        }

        // Krijo URL për shkarkim
        const downloadUrl = `https://chatai-alba-gr9dw.ondigitalocean.app/api/chat/download-history/${userId}`;
        
        console.log('🔗 Duke hapur URL për shkarkim:', downloadUrl);
        
        // Hap linkun në tab të ri për shkarkim
        window.open(downloadUrl, '_blank');
        
        // Ose përdor fetch për shkarkim direkt
        const response = await fetch(downloadUrl);
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `historia-chatai-${userId}-${Date.now()}.txt`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            showNotification('✅ Historia u shkarkua me sukses!', 'success');
        } else {
            throw new Error('Gabim në shkarkim');
        }
        
    } catch (error) {
        console.error('❌ Gabim në shkarkimin e historisë:', error);
        showNotification('❌ Gabim gjatë shkarkimit të historisë', 'error');
    }
}

// ✅ FUNKSIONI PËR TË MARRË USER ID - Shto në script.js
function getCurrentUserId() {
    // Provo të marrësh userId nga sessionStorage ose cookies
    return sessionStorage.getItem('chatUserId') || 
           localStorage.getItem('chatUserId') || 
           'user-1'; // Fallback për testim
}

// ======================================================================================================== //
// ✅ FUKSIONI UPLOAD
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

// =============================== FUKSIONI I URES TESTIMIT TE SISTEMIT ==========================================
// 📄 script.js - Shto në FUND, para përfundimit
// const ScriptBridge = require('../bridges/script-bridge');

// ✅ INICIALIZO URËN E SCRIPT-IT (NUK NDRYSHON FUNKSIONIMIN)
// ScriptBridge.initialize();

// ========================== Shfaq statistikat e sistemit =============================================

// ==================== ✅ KOMANDAT E REJA PËR SERVER ====================

// ✅ DËRGON KOMANDAT TE SERVERI I RI
async function sendCommandToServer(command) {
    try {
        showTypingIndicator();
        
        const response = await fetch('/api/chat/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ message: command })
        });
        
        const result = await response.json();
        removeTypingIndicator();
        
        if (result.success) {
            addMessage(result.response, "bot");
        } else {
            addMessage(`❌ ${result.response || result.message}`, "bot");
        }
        
    } catch (error) {
        removeTypingIndicator();
        console.error('❌ Gabim në dërgimin e komandës:', error);
        addMessage('❌ Gabim në lidhje me serverin', "bot");
    }
}

// ✅ DËRGON MESAZHE TE GEMINI
async function sendMessageToGemini(message) {
    try {
        showTypingIndicator();
        
        const response = await fetch('/api/chat/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ message: message })
        });
        
        const result = await response.json();
        removeTypingIndicator();
        
        if (result.success) {
            addMessage(result.response, "bot");
        } else {
            addMessage(`❌ ${result.response || result.message}`, "bot");
        }
        
    } catch (error) {
        removeTypingIndicator();
        console.error('❌ Gabim në dërgimin e mesazhit:', error);
        addMessage('❌ Gabim në lidhje me serverin', "bot");
    }
}

// ==================== ✅ MODIFIKIMI I processCommand() ====================

async function processCommand(text) {
    const parts = text.trim().split(" ");
    const cmd = parts[0];

    // ✅ MESAZHET NATYRORE (JO KOMANDË) - DËRGOJI DIREKT TE SERVERI
    if (!cmd.startsWith('/')) {
        console.log('🔍 Frontend: Mesazh natyror - duke dërguar te serveri...');
        
        try {
            const response = await fetch('/api/chat/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    userId: currentUser?.id || 1
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                addMessage(result.response, 'bot');
            } else {
                addMessage('❌ ' + result.response, 'bot');
            }
        } catch (error) {
            console.error('❌ Gabim në dërgimin e mesazhit natyror:', error);
            addMessage('❌ Gabim në lidhje me serverin', 'bot');
        }
        return;
    }

    // ✅ KOMANDAT E REJA QË DËRGOJNË TE SERVERI
    if (cmd === "/gjej" || cmd === "/google" || cmd === "/kërko" || cmd === "/ndihmo") {
        await sendCommandToServer(text);
        return;
    }

    
    // ✅ MBAJI TË GJITHA KOMANDAT EKZISTUESE SI JANË
    switch (cmd) {
        case "/dil":
            addMessage("Dalje nga sistemi...", "bot");
            setTimeout(() => logout(), 1000);
            break;

        case "/wiki":
            const query = parts.slice(1).join(" ");
            if (!query) { addMessage("⚠️ Shkruaj diçka për të kërkuar.", "bot"); break; }
            try {
                showTypingIndicator();
                const res = await fetch(`https://sq.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
                const data = await res.json();
                removeTypingIndicator();
                if (data.extract) addMessage(`🌐 ${data.extract}`, "bot");
                else addMessage("❌ Nuk u gjet informacion.", "bot");
            } catch { 
                removeTypingIndicator();
                addMessage("⚠️ Gabim gjatë kërkimit në Wikipedia.", "bot"); 
            }
            break;

        case "/meso":
            const split = text.replace("/meso", "").split("|");
            if (split.length === 2) {
                const q = split[0].trim().toLowerCase();
                const a = split[1].trim();
                
                try {
                    const response = await fetch('/api/chat/knowledge', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            userId: currentUser.id,
                            question: q,
                            answer: a
                        })
                    });

                    const data = await response.json();
                    if (response.ok) {
                        knowledgeBase[q] = a;
                        addMessage("✅ Mësova diçka të re!", "bot");
                    } else {
                        addMessage("⚠️ Gabim gjatë ruajtjes së njohurive: " + data.error, "bot");
                    }
                } catch (error) {
                    addMessage("⚠️ Gabim gjatë ruajtjes së njohurive.", "bot");
                }
            } else {
                addMessage("⚠️ Përdorimi: /meso pyetje | përgjigje", "bot");
            }
            break;

        case "/perkthim":
            if (parts.length < 3) return addMessage("⚠️ Përdorimi: /perkthim [gjuha] [tekst]", "bot");
            const targetLang = parts[1].toLowerCase();
            const tekst = parts.slice(2).join(" ");
            const sourceLang = (targetLang === "sq") ? "en" : "sq";
            
            showTypingIndicator();
            
            fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(tekst)}&langpair=${sourceLang}|${targetLang}`)
                .then(r => r.json())
                .then(d => {
                    removeTypingIndicator();
                    const translatedText = d?.responseData?.translatedText || "❌ Gabim përkthimi.";
                    addMessage(translatedText, "bot");
                })
                .catch(() => {
                    removeTypingIndicator();
                    addMessage("⚠️ Gabim përkthimi.", "bot");
                });
            break;

        case "/eksporto":
            try {
                const response = await fetch(`/api/chat/export/${currentUser.id}`);
                const data = await response.json();
                
                if (response.ok) {
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = "knowledge.json";
                    link.click();
                    addMessage("💾 Eksportova njohuritë.", "bot");
                } else {
                    addMessage("❌ Gabim gjatë eksportimit: " + data.error, "bot");
                }
            } catch (error) {
                addMessage("❌ Gabim gjatë eksportimit.", "bot");
            }
            break;

        case "/importo":
            const inp = document.createElement("input");
            inp.type = "file"; inp.accept = "application/json";
            inp.onchange = async e => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = async () => {
                    try {
                        const knowledgeData = JSON.parse(reader.result);
                        
                        const response = await fetch('/api/chat/import', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                userId: currentUser.id,
                                knowledge: knowledgeData
                            })
                        });

                        const data = await response.json();
                        if (response.ok) {
                            addMessage("✅ Importova njohuritë.", "bot");
                        } else {
                            addMessage("❌ Gabim gjatë importimit: " + data.error, "bot");
                        }
                    } catch (error) {
                        addMessage("❌ Gabim gjatë importimit.", "bot");
                    }
                };
                reader.readAsText(file);
            };
            inp.click();
            break;

        case "/moti":
            if (parts.length < 2) {
                addMessage("⚠️ Përdorimi: /moti [qyteti]", "bot");
            } else {
                const qyteti = parts.slice(1).join(" ");
                showTypingIndicator();
                fetch(`https://wttr.in/${encodeURIComponent(qyteti)}?format=%c+%t+%w+%h`)
                    .then(res => res.text())
                    .then(data => {
                        removeTypingIndicator();
                        addMessage("🌍 Moti në " + qyteti + ": " + data, "bot");
                    })
                    .catch(() => {
                        removeTypingIndicator();
                        addMessage("⚠️ Gabim gjatë marrjes së motit.", "bot");
                    });
            }
            break;

        case "/apikey":
            if (parts.length < 2) {
                try {
                    const response = await fetch('/api/api-keys/status/gemini', {
                        credentials: 'include'
                    });
                    const data = await response.json();
                    
                    if (data.hasApiKey) {
                        addMessage("🔑 API Key është konfiguruar në server (e ruajtur: " + new Date(data.createdAt).toLocaleDateString("sq-AL") + ")", "bot");
                    } else {
                        addMessage("❌ Nuk ka API Key të konfiguruar. Përdor: /apikey [key_jote]", "bot");
                    }
                } catch (error) {
                    addMessage("❌ Gabim gjatë kontrollimit të statusit të API Key.", "bot");
                }
            } else {
                const newApiKey = parts.slice(1).join(" ");
                
                try {
                    const response = await fetch('/api/api-keys/save', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            userId: currentUser.id,
                            apiKey: newApiKey,
                            serviceName: 'gemini'
                        })
                    });

                    const data = await response.json();
                    if (response.ok) {
                        addMessage("✅ API Key u ruajt me sukses në server!", "bot");
                    } else {
                        addMessage("❌ Gabim gjatë ruajtjes së API Key: " + data.error, "bot");
                    }
                } catch (error) {
                    addMessage("❌ Gabim gjatë ruajtjes së API Key.", "bot");
                }
            }
            break;

        // ✅ KOMANDAT E REJA PËR ADMIN
        case "/admin":
            if (currentUser && currentUser.username === 'admin') {
                addMessage("👑 **PANELI I ADMINIT**\n\nKomandat:\n• /users - Shfaq të gjithë përdoruesit\n• /stats - Statistikat e sistemit\n• /clearall - Fshi të gjitha bisedat\n• /panel - Shfaq panelin e adminit", "bot");
            } else {
                addMessage("❌ Kjo komandë është vetëm për administratorët.", "bot");
            }
            break;

        case "/users":
            if (currentUser && currentUser.username === 'admin') {
                showAllUsers();
            } else {
                addMessage("❌ Kjo komandë është vetëm për administratorët.", "bot");
            }
            break;

        case "/stats":
            if (currentUser && currentUser.username === 'admin') {
                showSystemStats();
            } else {
                addMessage("❌ Kjo komandë është vetëm për administratorët.", "bot");
            }
            break;

        case "/clearall":
            if (currentUser && currentUser.username === 'admin') {
                clearAllChats();
            } else {
                addMessage("❌ Kjo komandë është vetëm për administratorët.", "bot");
            }
            break;

        case "/panel":
            if (currentUser && currentUser.username === 'admin') {
                addAdminPanel();
                addMessage("👑 Paneli i Adminit u shfaq!", "bot");
            } else {
                addMessage("❌ Kjo komandë është vetëm për administratorët.", "bot");
            }
            break;

        default:
            const key = text.toLowerCase();
            
            try {
                const response = await fetch(`/api/chat/knowledge/${currentUser.id}/${encodeURIComponent(key)}`);
                const data = await response.json();
                
                if (data.answer) {
                    addMessage(data.answer, "bot");
                    return;
                }
            } catch (error) {
                console.error("Gabim gjatë kërkimit të njohurive:", error);
            }

            const calc = tryCalculate(text);
            if (calc !== null) { 
                addMessage("🧮 Rezultati: " + calc, "bot"); 
                return; 
            }

            // Kontrollo nëse ka API Key në server
            try {
                const response = await fetch('/api/api-keys/status/gemini', {
                    credentials: 'include'
                });
                const data = await response.json();
                
                if (!data.hasApiKey) {
                    addMessage("❌ Nuk është konfiguruar API Key për Gemini. Përdor komandën /apikey [key_jote] për të vendosur një API Key.", "bot");
                    return;
                }
                
                // Nëse ka API Key, bëj thirrjen për Gemini përmes serverit
                showTypingIndicator();
                
                const geminiResponse = await fetch('/api/gemini/ask', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include',
                    body: JSON.stringify({ 
                        message: text
                    })
                });
                const geminiData = await geminiResponse.json();
                removeTypingIndicator();
                
                if (geminiData.success && geminiData.response) {
                    addMessage(geminiData.response, "bot");
                } else {
                    addMessage("❌ Nuk mora përgjigje nga Gemini. Kontrollo API Key.", "bot");
                }
            } catch {
                removeTypingIndicator();
                addMessage("⚠️ Gabim gjatë lidhjes me serverin.", "bot");
            }
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

// ================================ FUKSION  initializeChatSession ==========================
// ✅ INITIALIZO CHAT ME SESSION COOKIES
async function initializeChatSession() {
    try {
        // THIRR ENDPOINT QË KRIJON/KONTROLLON COOKIES
        const response = await fetch('/api/chat/init-session', {
            credentials: 'include' // ✅ DËRGON COOKIES
        });
        
        const data = await response.json();
        console.log('🔒 Chat session initialized:', data);
        
        // SHFAQ SESIONIN NË CONSOLE PËR DEBUG
        if (data.success) {
            console.log('🎯 Sesioni aktiv:', data.sessionData);
            // Mund të ruaj session data në localStorage për referencë
            if (data.sessionData) {
                localStorage.setItem('currentSession', JSON.stringify(data.sessionData));
            }
        }
    } catch (error) {
        console.error('❌ Gabim në inicializim të sesionit:', error);
    }
}

// ✅ THIRR INIT KUR HA PET CHAT
document.addEventListener('DOMContentLoaded', function() {
    initializeChatSession();
    
    // Kontrollo nëse ka session të ruajtur
    const savedSession = localStorage.getItem('currentSession');
    if (savedSession) {
        console.log('💾 Sesioni i ruajtur:', JSON.parse(savedSession));
    }
});

// ======================== PASTRO COKJES ===========================================

// ✅ INITIALIZO PA RUAJTUR ASGJË NË LOCALSTORAGE
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Chat-i u hap - Sesion i ri i përkohshëm');
    
    // ✅ PASTRO ÇDO GJË TË MBETUR
    localStorage.removeItem('currentSession');
    localStorage.removeItem('chatHistory');
    localStorage.removeItem('userData');
    
    // ✅ INICIALIZO SESION TË RI
    initializeChatSession();
});

// ✅ FUNKSIONI I RI PËR FSHIRJEN E SESIONIT PARA DALJES
function cleanupBeforeExit() {
    console.log('🧹 Duke pastruar para daljes...');
    
    // Merr session nga cookies për t'i fshirë
    const cookies = document.cookie.split(';');
    let userId = null;
    let sessionId = null;
    
    cookies.forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name === 'chatUserId') userId = value;
        if (name === 'chatSessionId') sessionId = value;
    });
    
    // ✅ FSHI TË DHËNAT E SESIONIT NË SERVER
    if (userId && sessionId) {
        fetch('/api/chat/clear-session', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ userId, sessionId }),
            credentials: 'include'
        }).then(r => r.json()).then(data => {
            console.log('✅ Pastrimi i sesionit:', data);
        });
    }
    
    // ✅ PASTRO LOCALSTORAGE PLOTËSISHT
    localStorage.clear();
    
    // ✅ PASTRO COOKIES
    document.cookie = 'chatUserId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'chatSessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

// ✅ FSHI SESIONIN KUR MBYLET FAQJA/BRWSER
window.addEventListener('beforeunload', cleanupBeforeExit);
window.addEventListener('pagehide', cleanupBeforeExit);

// ✅ FSHI SESIONIN KUR PËRDORUESI LË CHAT-IN
function exitChat() {
    cleanupBeforeExit();
    // Redirect ose mbyll chat-in
    window.location.href = '/goodbye.html'; // ose ndonjë faqe tjetër
}

// ================================ TEST BUTON EXPORT HISTORI ==========================

// ✅ TESTO NËSE BUTONI I EKSPORTIT EKZISTON DHE FUNKSIONON
function testExportButton() {
    console.log('🔍 Duke kontrolluar butonin e eksportit...');
    
    // Kontrollo nëse ka buton eksporti
    const exportButtons = document.querySelectorAll('button, [onclick*="export"], [id*="export"], [class*="export"]');
    
    console.log('📋 Butonat e gjetur:', exportButtons.length);
    
    exportButtons.forEach((btn, index) => {
        console.log(`Button ${index}:`, {
            text: btn.textContent,
            id: btn.id,
            className: btn.className,
            onclick: btn.onclick
        });
        
        // Testo nëse është butoni i eksportit
        if (btn.textContent.toLowerCase().includes('export') || 
            btn.id.toLowerCase().includes('export') ||
            btn.className.toLowerCase().includes('export')) {
            console.log('🎯 BUTONI I EKSPORTIT U GJET!');
            
            // Shto funksion të ri të eksportit
            btn.onclick = function(e) {
                e.preventDefault();
                enhancedExportHistory();
            };
            
            console.log('✅ Butoni i eksportit u përmirësua!');
        }
    });
    
    // Nëse nuk gjen buton, krijo një të ri
    if (exportButtons.length === 0) {
        console.log('🆕 Nuk ka buton eksporti, duke krijuar të ri...');
        createEmergencyExportButton();
    }
}

// ✅ FUNKSIONI I PERFEKT PËR EKSPORTIM
async function enhancedExportHistory() {
    try {
        console.log('💾 Duke filluar eksportim të përmirësuar...');
        
        // Merr session aktuale
        const sessionData = await getCurrentSession();
        const userId = sessionData?.userId || 'unknown-user';
        
        console.log('👤 User për eksport:', userId);
        
        // Merr historinë e plotë
        const response = await fetch(`/api/chat/history/${userId}`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.history && data.history.length > 0) {
            // Krijo JSON të organizuar
            const exportData = {
                meta: {
                    exportDate: new Date().toISOString(),
                    exportTime: new Date().toLocaleString('sq-AL'),
                    userId: userId,
                    totalMessages: data.history.length,
                    version: "ChatAI Alba v4.0"
                },
                messages: data.history.map(msg => ({
                    content: msg.content,
                    sender: msg.sender,
                    timestamp: msg.timestamp,
                    time: msg.timestamp ? new Date(msg.timestamp).toLocaleString('sq-AL') : 'N/A'
                }))
            };
            
            // Krijo download
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
                type: 'application/json;charset=utf-8' 
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `chat-history-${userId}-${Date.now()}.json`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log(`✅ EKSPORTIM I SUKSESHSHËM! ${data.history.length} mesazhe`);
            
            // Shfaq alert me sukses
            alert(`✅ HISTORIA U EKSPORTUA ME SUKSES!\n\n📊 ${data.history.length} mesazhe\n💾 Ruaj skedarin .json në siguri\n🔄 Mund ta importosh kur të kthehesh!`);
            
        } else {
            alert('ℹ️ Nuk ka histori për të eksportuar!');
        }
        
    } catch (error) {
        console.error('❌ Gabim në eksportim:', error);
        alert('❌ GABIM NË EKSPORTIM!\n\nShiko console për detaje.');
    }
}

// ✅ KRIJO BUTON EMERGJENCE NËSE NUK EKZISTON
function createEmergencyExportButton() {
    console.log('🚨 Duke krijuar buton emergjence për eksport...');
    
    const emergencyBtn = document.createElement('button');
    emergencyBtn.innerHTML = '💾 <strong>EXPORT HISTORI</strong>';
    emergencyBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        background: #ff4444;
        color: white;
        border: none;
        padding: 15px 20px;
        border-radius: 10px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    `;
    emergencyBtn.onclick = enhancedExportHistory;
    
    // Shto në body
    document.body.appendChild(emergencyBtn);
    
    // Shfaq alert për përdoruesin
    setTimeout(() => {
        alert('⚠️ IMPORTANTE!\n\nPara se të dalësh nga chat-i, KLIKO BUTONIN "EXPORT HISTORI" në cepin e sipërm djathtas për të ruajtur bisedën tënde!\n\nPastaj mund ta importosh kur të kthehesh.');
    }, 2000);
    
    console.log('✅ Butoni emergjence u krijua!');
}

// ✅ FUNKSIONI PËR MARRJEN E SESIONIT AKTUAL
async function getCurrentSession() {
    try {
        const response = await fetch('/api/chat/init-session', {
            credentials: 'include'
        });
        const data = await response.json();
        return data.sessionData;
    } catch (error) {
        console.log('ℹ️ Duke përdorur session fallback');
        return { userId: 'user-' + Date.now() };
    }
}

// ✅ AUTO-TESTO BUTONIN KUR FAQA NGARKOHET
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Duke testuar butonin e eksportit...');
    setTimeout(testExportButton, 1000);
});

// ✅ AUTO-EKSPORT PARA DALJES (BACKUP)
window.addEventListener('beforeunload', function() {
    console.log('🔄 Duke bërë backup automatik...');
    enhancedExportHistory().catch(() => {
        console.log('ℹ️ Backup automatik dështoi - jo problem');
    });
});

// ========== ✅ FUNKSIONI I PËRMBITUR PËR FSHIRJE - Përdor endpoint ekzistues ==============

async function clearChatHistory() {
    if (!confirm('⚠️ JE I SIGURT QË DO TË FSHISH TË GJITHË HISTORINË?\n\nKjo veprim nuk mund të zhbëhet!')) {
        return;
    }
    
    try {
        const sessionData = await getCurrentSession();
        const userId = sessionData?.userId;
        const sessionId = sessionData?.sessionId;
        
        if (!userId) {
            alert('❌ Nuk mund të identifikohet useri!');
            return;
        }
        
        // ✅ PËRDOR ENDPOINT-IN EKZISTUES /clear/:userId
        const response = await fetch(`/api/chat/clear/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ 
                sessionId: sessionId // ✅ Dërgo sessionId si pjesë e body
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(`✅ Historia u fshi me sukses!\n\nU fshinë ${result.deletedCount} mesazhe.`);
            
            // Rifresko chat-in
            const chat = document.getElementById("chat");
            if (chat) chat.innerHTML = "";
            
            console.log('✅ Historia u fshi manualisht nga useri');
        } else {
            throw new Error(result.error || result.message);
        }
        
    } catch (error) {
        console.error('❌ Gabim në fshirjen e historisë:', error);
        alert('❌ Gabim në fshirjen e historisë!');
    }
}
