// chat.js - Frontend minimal testues
const API_BASE = 'http://localhost:3001/api';

async function runAutoTest() {
    showResult('auto-test-result', '🧪 Duke ekzekutuar testin automatik...');
    
    try {
        const response = await fetch(`${API_BASE}/knowledge/test`);
        const data = await response.json();
        
        let html = '<div class="result">';
        for (const [key, value] of Object.entries(data)) {
            const isPass = value.includes('PASSED') || value.includes('WORKS');
            html += `<div class="${isPass ? 'pass' : 'fail'}">
                <strong>${key}:</strong> ${value}
            </div>`;
        }
        html += '</div>';
        
        showResult('auto-test-result', html);
    } catch (error) {
        showResult('auto-test-result', `❌ Gabim: ${error.message}`);
    }
}

async function testLearn() {
    const question = document.getElementById('learn-question').value;
    const answer = document.getElementById('learn-answer').value;
    
    if (!question || !answer) {
        showResult('learn-result', '⚠️ Shkruaj pyetjen dhe përgjigjen');
        return;
    }
    
    showResult('learn-result', '💾 Duke ruajtur...');
    
    try {
        const response = await fetch(`${API_BASE}/knowledge/learn`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: 1,
                question: question,
                answer: answer
            })
        });
        
        const data = await response.json();
        showResult('learn-result', 
            data.success ? 
            `✅ ${data.message} (ID: ${data.id})` : 
            `❌ ${data.error}`
        );
    } catch (error) {
        showResult('learn-result', `❌ Gabim në lidhje: ${error.message}`);
    }
}

async function testSearch() {
    const question = document.getElementById('search-question').value;
    
    if (!question) {
        showResult('search-result', '⚠️ Shkruaj një pyetje për të kërkuar');
        return;
    }
    
    showResult('search-result', '🔍 Duke kërkuar...');
    
    try {
        const response = await fetch(`${API_BASE}/knowledge/search/1/${encodeURIComponent(question)}`);
        const data = await response.json();
        
        if (data.found) {
            showResult('search-result', 
                `✅✅✅ GJETËM! (Metoda: ${data.method})<br>
                <strong>Përgjigja:</strong> ${data.answer}`
            );
        } else {
            showResult('search-result', 
                `❌ NUK U GJET!<br>
                <small>Debug: ${data.debug || 'Nuk ka përgjigje të ruajtur'}</small>`
            );
        }
    } catch (error) {
        showResult('search-result', `❌ Gabim: ${error.message}`);
    }
}

async function showAllData() {
    try {
        const response = await fetch(`${API_BASE}/knowledge/debug/1`);
        const data = await response.json();
        
        let output = `📊 Total ${data.total} njohuri:\n\n`;
        
        if (data.records && data.records.length > 0) {
            data.records.forEach((item, index) => {
                output += `${index + 1}. ID: ${item.id}\n`;
                output += `   Pyetja: "${item.question}"\n`;
                output += `   Përgjigja: "${item.answer}"\n`;
                output += `   Data: ${item.created_at}\n`;
                output += `   ---\n`;
            });
        } else {
            output += "❌ Nuk ka të dhëna në database!";
        }
        
        document.getElementById('debug-output').textContent = output;
    } catch (error) {
        document.getElementById('debug-output').textContent = `❌ Gabim: ${error.message}`;
    }
}

function showResult(elementId, content) {
    const element = document.getElementById(elementId);
    if (typeof content === 'string' && content.includes('<')) {
        element.innerHTML = content;
    } else {
        element.textContent = content;
    }
}
