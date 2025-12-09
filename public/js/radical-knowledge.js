// public/js/radical-knowledge.js - FRONTEND PËR TESTIN RADIKAL
console.log('🧪 JS radikal për testin e njohurive u ngarkua!');

const API_BASE = '/api/radical';

// ✅ 1. TEST AUTOMATIK
async function runAutoTest() {
    showResult('auto-test-result', '🧪 Duke ekzekutuar testin automatik...', 'info');
    
    try {
        const response = await fetch(`${API_BASE}/radical-test`);
        const data = await response.json();
        
        console.log('📊 Rezultatet e testit:', data);
        
        let html = '<div class="test-results">';
        html += `<h3>📊 REZULTATET:</h3>`;
        html += `<p><strong>Teste totale:</strong> ${data.summary.total}</p>`;
        html += `<p><strong>Teste të kaluara:</strong> ${data.summary.passed}</p>`;
        html += `<p><strong>Teste të dështuara:</strong> ${data.summary.failed}</p>`;
        html += `<p><strong>Sukses:</strong> ${data.summary.percentage}%</p>`;
        
        html += `<h4>🧪 DETAJET E TESTEVE:</h4>`;
        data.tests.forEach((test, index) => {
            html += `
                <div class="${test.success ? 'success' : 'error'}">
                    ${index + 1}. <strong>${test.name}</strong>: ${test.success ? '✅ SUKSES' : '❌ DËSHTIM'}
                    ${test.data ? ` (${test.data} rreshta)` : ''}
                    ${test.found ? ' (Gjetëm)' : ''}
                    ${test.id ? ` (ID: ${test.id})` : ''}
                </div>
            `;
        });
        
        html += `<h3>${data.conclusion}</h3>`;
        html += '</div>';
        
        showResult('auto-test-result', html);
        
    } catch (error) {
        console.error('❌ Gabim në testin automatik:', error);
        showResult('auto-test-result', `❌ Gabim: ${error.message}`, 'error');
    }
}

// ✅ 2. TESTO RUAJTJEN (/meso)
async function testLearn() {
    const question = document.getElementById('learn-question').value.trim();
    const answer = document.getElementById('learn-answer').value.trim();
    
    if (!question || !answer) {
        showResult('learn-result', '⚠️ Ju lutem shkruani pyetjen dhe përgjigjen', 'error');
        return;
    }
    
    showResult('learn-result', '💾 Duke ruajtur njohuri të re...', 'info');
    
    try {
        const response = await fetch(`${API_BASE}/radical-learn`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: 1,
                question: question,
                answer: answer
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showResult('learn-result', 
                `✅ ${data.message} (ID: ${data.id})` +
                `<br><small>Pyetja: "${question}"</small>` +
                `<br><small>Përgjigja: "${answer}"</small>`,
                'success'
            );
        } else {
            showResult('learn-result', `❌ ${data.error || 'Gabim në ruajtje'}`, 'error');
        }
        
    } catch (error) {
        showResult('learn-result', `❌ Gabim në lidhje: ${error.message}`, 'error');
    }
}

// ✅ 3. TESTO KËRKIMIN
async function testSearch() {
    const question = document.getElementById('search-question').value.trim();
    
    if (!question) {
        showResult('search-result', '⚠️ Shkruani një pyetje për të kërkuar', 'error');
        return;
    }
    
    showResult('search-result', '🔍 Duke kërkuar njohuri...', 'info');
    
    try {
        const response = await fetch(`${API_BASE}/radical-search/1/${encodeURIComponent(question)}`);
        const data = await response.json();
        
        if (data.success && data.found) {
            showResult('search-result', 
                `✅✅✅ GJETËM NJOHURI!` +
                `<br><strong>Pyetja:</strong> "${question}"` +
                `<br><strong>Përgjigja:</strong> ${data.answer}` +
                `<br><small>Status: Përgjigje e ruajtur e RRUFE-TESLA</small>`,
                'success'
            );
        } else {
            showResult('search-result', 
                `❌ NUK U GJET NJOHURI` +
                `<br><small>Pyetja: "${question}"</small>` +
                `<br><small>Sugjerim: Provoni /meso për ta mësuar RRUFE-s</small>`,
                'error'
            );
        }
        
    } catch (error) {
        showResult('search-result', `❌ Gabim në kërkim: ${error.message}`, 'error');
    }
}

// ✅ 4. SHFAQ TË GJITHA NJOHURITË
async function showAllData() {
    showResult('debug-output', '📊 Duke marrë të gjitha të dhënat...', 'info');
    
    try {
        const response = await fetch(`${API_BASE}/radical-list/1`);
        const data = await response.json();
        
        if (data.success) {
            let output = `📚 TOTAL ${data.count} NJOHURI TË RUAJTURA:\n\n`;
            
            if (data.knowledge && data.knowledge.length > 0) {
                data.knowledge.forEach((item, index) => {
                    output += `${index + 1}. ID: ${item.id}\n`;
                    output += `   🗣️  PYETJA: "${item.question}"\n`;
                    output += `   💡 PËRGJIGJE: "${item.answer}"\n`;
                    output += `   📅 DATA: ${item.created_at}\n`;
                    output += `   ──────────────────────────\n`;
                });
            } else {
                output += "❌ Nuk ka të dhëna në database!";
            }
            
            showResult('debug-output', output);
            
        } else {
            showResult('debug-output', '❌ Gabim në marrjen e të dhënave', 'error');
        }
        
    } catch (error) {
        showResult('debug-output', `❌ Gabim: ${error.message}`, 'error');
    }
}

// ✅ 5. TESTO CHAT ME RRUFE-TESLA
async function testChat() {
    const message = document.getElementById('chat-message').value.trim();
    
    if (!message) {
        showResult('chat-result', '⚠️ Shkruani një mesazh për RRUFE-TESLA', 'error');
        return;
    }
    
    showResult('chat-result', '💬 Duke dërguar te RRUFE-TESLA...', 'info');
    
    try {
        // Së pari kontrollo nëse ka njohuri të ruajtura
        const knowledgeResponse = await fetch(`${API_BASE}/radical-search/1/${encodeURIComponent(message)}`);
        const knowledgeData = await knowledgeResponse.json();
        
        if (knowledgeData.success && knowledgeData.found) {
            showResult('chat-result', 
                `💾 RRUFE-TESLA PËRDORI NJOHURI TË RUAJTUR:` +
                `<br><strong>Pyetja:</strong> "${message}"` +
                `<br><strong>Përgjigja:</strong> ${knowledgeData.answer}` +
                `<br><small>💡 Kjo tregon që sistemi i njohurive funksionon perfektisht!</small>`,
                'success'
            );
            return;
        }
        
        // Nëse nuk ka njohuri, dërgo te OpenAI/Gemini
        showResult('chat-result', '🔮 Duke dërguar te OpenAI/Gemini...', 'info');
        
        const response = await fetch('/api/openai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message,
                userId: 1
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showResult('chat-result', 
                `🤖 RRUFE-TESLA PËRGJIGJU:` +
                `<br><strong>Pyetja:</strong> "${message}"` +
                `<br><strong>Përgjigja:</strong> ${data.response}` +
                `<br><small>🎯 Tani mund ta mësoni këtë përgjigje me butonin "💾 Ruaj Njohuri"!</small>`,
                'success'
            );
        } else {
            showResult('chat-result', 
                `❌ RRUFE-TESLA NUK PËRGJIGJU` +
                `<br><small>Gabim: ${data.error || 'Nuk dihet'}</small>`,
                'error'
            );
        }
        
    } catch (error) {
        showResult('chat-result', `❌ Gabim në lidhje: ${error.message}`, 'error');
    }
}

// ✅ 6. FUNKSIONI PËR SHFAQJEN E REZULTATEVE
function showResult(elementId, content, type = 'info') {
    const element = document.getElementById(elementId);
    
    if (!element) {
        console.error(`❌ Elementi ${elementId} nuk u gjet!`);
        return;
    }
    
    // Nëse content është string i thjeshtë
    if (typeof content === 'string') {
        element.innerHTML = `<div class="${type}">${content}</div>`;
    } else {
        // Nëse ka HTML
        element.innerHTML = content;
    }
    
    // Scroll në fund
    element.scrollTop = element.scrollHeight;
}

// ✅ 7. SHËNDETI I SISTEMIT
async function checkSystemHealth() {
    console.log('❤️‍🩹 Duke kontrolluar shëndetin e sistemit...');
    
    try {
        const response = await fetch(`${API_BASE}/radical-health`);
        const data = await response.json();
        
        console.log('🏥 Shëndeti i sistemit:', data);
        
        if (data.healthy) {
            console.log(`✅ Sistemi radikal është i shëndetshëm! (${data.rows} rreshta)`);
            return true;
        } else {
            console.log('❌ Sistemi radikal nuk është i shëndetshëm:', data.error);
            return false;
        }
        
    } catch (error) {
        console.error('❌ Gabim në kontrollin e shëndetit:', error);
        return false;
    }
}

// ✅ 8. KRIJO NJOHURI TESTUESE
async function createTestData() {
    console.log('📝 Duke krijuar të dhëna testuese...');
    
    const testData = [
        { question: "Si quhet kryeqyteti i Shqipërisë?", answer: "Tirana" },
        { question: "Sa është 5 + 3?", answer: "8" },
        { question: "Cila është gjuhë zyrtare e Shqipërisë?", answer: "Shqipja" },
        { question: "Kush shpiku rrymën alternative?", answer: "Nikola Tesla" },
        { question: "Çfarë do të thotë RRUFE-TESLA?", answer: "Është fuzion i RRUFE (energjisë shqiptare) dhe TESLA (gjenit Nikola Tesla)" }
    ];
    
    let createdCount = 0;
    
    for (const item of testData) {
        try {
            const response = await fetch(`${API_BASE}/radical-learn`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 1,
                    question: item.question,
                    answer: item.answer
                })
            });
            
            const data = await response.json();
            if (data.success) createdCount++;
            
            // Prit 100ms midis çdo krijimi
            await new Promise(resolve => setTimeout(resolve, 100));
            
        } catch (error) {
            console.log(`❌ Gabim në krijimin e "${item.question}":`, error);
        }
    }
    
    console.log(`✅ Krijuam ${createdCount}/${testData.length} njohuri testuese`);
    return createdCount;
}

// ✅ 9. INITIALIZE PAS NGARKIMIT
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Faqja radikale u ngarkua!');
    
    // Kontrollo shëndetin e sistemit
    setTimeout(() => {
        checkSystemHealth();
    }, 1000);
    
    // Krijo disa të dhëna testuese nëse database është bosh
    setTimeout(async () => {
        const response = await fetch(`${API_BASE}/radical-list/1`);
        const data = await response.json();
        
        if (data.success && data.count === 0) {
            console.log('📝 Database është bosh, duke krijuar të dhëna testuese...');
            await createTestData();
            showResult('auto-test-result', '📝 U krijuan të dhëna testuese automatikisht!', 'info');
        }
    }, 2000);
});

// ✅ 10. EKSPORTO FUNKSIONET GLOBALE
window.runAutoTest = runAutoTest;
window.testLearn = testLearn;
window.testSearch = testSearch;
window.showAllData = showAllData;
window.testChat = testChat;
window.checkSystemHealth = checkSystemHealth;
window.createTestData = createTestData;

console.log('✅ Sistemi radikal i frontend-it u inicializua!');
