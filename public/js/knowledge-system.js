// knowledge-system.js - SISTEM I IZOLUAR I NJOHURIVE
console.log('🧠 RRUFE-TESLA: Knowledge System (Izoluar) u ngarkua!');

class KnowledgeSystem {
    constructor() {
        this.userId = 1; // Ndryshoje me ID-në tënde
        this.isIntegrated = false;
        this.initialize();
    }

    initialize() {
        console.log('🎯 KnowledgeSystem: Duke inicializuar...');
        
        // 1. Shto event listeners pa prekur kodin ekzistues
        this.setupEventListeners();
        
        // 2. Shto buton për test
        this.addTestButton();
        
        console.log('✅ KnowledgeSystem: U inicializua!');
    }

    setupEventListeners() {
        console.log('🎧 Duke shtuar event listeners...');
        
        // Kontrollo çdo 2 sekonda nëse elementet ekzistojnë
        const checkInterval = setInterval(() => {
            const userInput = document.getElementById('user-input');
            const sendBtn = document.getElementById('send-btn');
            
            if (userInput && sendBtn && !this.isIntegrated) {
                console.log('✅ Elementet u gjetën, duke integruar...');
                this.integrateWithElements(userInput, sendBtn);
                this.isIntegrated = true;
                clearInterval(checkInterval);
            }
        }, 2000);
    }

    integrateWithElements(userInput, sendBtn) {
        console.log('🔗 Duke integruar me elementet ekzistuese...');
        
        // Ruaj event listener-ët origjinalë
        const originalSendBtnClick = sendBtn.onclick;
        const originalInputKeypress = userInput.onkeypress;
        
        // Shto event listener të ri për Enter
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleUserMessage(userInput.value.trim());
                
                // Ekzekuto edhe event-in origjinal nëse ekziston
                if (originalInputKeypress) {
                    originalInputKeypress.call(userInput, e);
                }
            }
        });
        
        // Shto event listener të ri për butonin
        sendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleUserMessage(userInput.value.trim());
            
            // Ekzekuto edhe klikun origjinal nëse ekziston
            if (originalSendBtnClick) {
                originalSendBtnClick.call(sendBtn, e);
            }
        });
        
        console.log('✅ U integrua me input dhe buton!');
    }

    async handleUserMessage(message) {
        if (!message) return;
        
        console.log('💬 KnowledgeSystem: User shkroi:', message);
        
        // 1. Së pari kontrollo nëse ka njohuri
        const hasKnowledge = await this.checkKnowledge(message);
        
        if (hasKnowledge) {
            console.log('✅ Përgjigja u gjet nga njohuritë, nuk dërgohet te AI');
            return true; // Ndalojmë këtu
        }
        
        console.log('❌ Nuk ka njohuri, vazhdon me sistemin ekzistues');
        return false;
    }

    async checkKnowledge(message) {
        try {
            const searchText = message.toLowerCase().trim();
            
            console.log('🔍 KnowledgeSystem: Duke kërkuar për:', searchText);
            
            const response = await fetch(
                `/api/chat/knowledge/${this.userId}/${encodeURIComponent(searchText)}`,
                { credentials: 'include' }
            );
            
            if (response.ok) {
                const data = await response.json();
                
                if (data.answer && data.answer !== 'null') {
                    console.log('✅✅✅ KnowledgeSystem: Gjetëm përgjigje!');
                    
                    // Shto përgjigjen në chat
                    this.addKnowledgeResponse(data.answer);
                    return true;
                }
            }
            
            return false;
            
        } catch (error) {
            console.error('❌ KnowledgeSystem: Gabim:', error);
            return false;
        }
    }

    addKnowledgeResponse(answer) {
        const chat = document.getElementById('chat');
        if (!chat) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';
        messageDiv.innerHTML = `
            <div class="message-text">
                💾 <strong>Përgjigje e ruajtur:</strong> ${answer}
            </div>
        `;
        
        chat.appendChild(messageDiv);
        chat.scrollTop = chat.scrollHeight;
        
        // Shto stile nëse është e nevojshme
        this.addStyles();
    }

    addStyles() {
        if (document.getElementById('knowledge-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'knowledge-styles';
        style.textContent = `
            .message.bot .message-text {
                animation: slideIn 0.3s ease-out;
            }
            
            @keyframes slideIn {
                from { transform: translateY(10px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
    }

    addTestButton() {
        // Shto buton test në header
        setTimeout(() => {
            const header = document.querySelector('header');
            if (!header) return;
            
            const testBtn = document.createElement('button');
            testBtn.id = 'knowledge-test-btn';
            testBtn.innerHTML = '🧪 Test Njohuri';
            testBtn.title = 'Testoni sistemin e njohurive';
            testBtn.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 20px;
                cursor: pointer;
                margin-left: 10px;
                font-size: 12px;
                font-weight: bold;
            `;
            
            testBtn.onclick = () => this.runTest();
            header.appendChild(testBtn);
            
            console.log('🎯 Butoni i testit u shtua!');
        }, 3000);
    }

    async runTest() {
        console.log('🧪🧪🧪 DUKE TESTUAR SISTEMIN E NJOHURIVE 🧪🧪🧪');
        
        // Test 1: Shto njohuri
        const testQuestion = 'test_knowledge_' + Date.now();
        const testAnswer = 'Kjo është përgjigje test ' + Date.now();
        
        const saveResponse = await fetch('/api/chat/knowledge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                userId: this.userId,
                question: testQuestion,
                answer: testAnswer
            })
        });
        
        const saveData = await saveResponse.json();
        console.log('💾 Ruajtja:', saveData);
        
        if (saveData.success) {
            // Test 2: Kërko njohurinë e sapo ruajtur
            setTimeout(async () => {
                const hasKnowledge = await this.checkKnowledge(testQuestion);
                
                if (hasKnowledge) {
                    alert('✅✅✅ SISTEMI I NJOHURIVE FUNKSIONON PERFEKTISHT!');
                } else {
                    alert('❌❌❌ PROBLEM: Njohuritë ruhen por nuk gjenden!');
                }
            }, 1000);
        }
    }
}

// ✅ INICIALIZO SISTEMIN
setTimeout(() => {
    window.knowledgeSystem = new KnowledgeSystem();
    console.log('🚀 KnowledgeSystem u ngarkua!');
    console.log('- User ID:', window.knowledgeSystem.userId);
    console.log('- Test buton: #knowledge-test-btn');
}, 2000);
