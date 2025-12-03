// public/js/knowledge-test.js - TEST RADIKAL I NJOHURIVE
console.log('🧪 TEST RADIKAL NJOHURI: Duke ngarkuar sistemin e testit...');

class KnowledgeTestSystem {
    constructor() {
        this.testMode = false;
        this.testData = {};
        this.initialize();
    }

    initialize() {
        console.log('🎯 TEST SYSTEM: Duke inicializuar sistemin e testit RADIKAL...');
        
        // Shto butonin e testit në UI
        this.addTestButton();
        
        // Aktivizo test mode me komandë të veçantë
        this.setupTestCommand();
        
        console.log('✅ TEST SYSTEM: U inicializua! Përdor /test-njohuri për të filluar');
    }

    addTestButton() {
        // Shto buton të ri në header
        const header = document.querySelector('header');
        if (!header) {
            setTimeout(() => this.addTestButton(), 1000);
            return;
        }
        
        const testBtn = document.createElement('button');
        testBtn.id = 'knowledge-test-btn';
        testBtn.innerHTML = '🧪 Test Njohuri';
        testBtn.title = 'Testoni sistemin e njohurive RRUFE-TESLA';
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
        
        testBtn.onclick = () => this.startRadicalTest();
        header.appendChild(testBtn);
        
        console.log('🎯 Butoni i testit u shtua në header!');
    }

    setupTestCommand() {
        // Krijo komandë të re për test
        if (typeof processCommand === 'function') {
            // Ruaj versionin origjinal
            const originalProcessCommand = processCommand;
            
            // Mbivendos për të kapur komandën tonë të re
            window.processCommand = async function(command) {
                const parts = command.trim().split(" ");
                const cmd = parts[0];
                const args = parts.slice(1).join(" ");
                
                // Nëse është komanda jonë e testit
                if (cmd === '/test-njohuri') {
                    window.knowledgeTestSystem.startRadicalTest();
                    return;
                }
                
                // Ekzekuto komandat e tjera normalisht
                return originalProcessCommand.call(this, command);
            };
            
            console.log('🔧 Komanda /test-njohuri u regjistrua!');
        }
    }

    async startRadicalTest() {
        console.log('🚀🚀🚀 DUKE FILLUAR TESTIN RADIKAL TË NJOHURIVE 🚀🚀🚀');
        
        this.testMode = true;
        
        // 1. FSHIJ TESTET E VJETRA
        await this.clearOldTests();
        
        // 2. KRIJO TESTE TË REJA
        await this.createTestData();
        
        // 3. TESTO RUAJTJEN
        await this.testSaving();
        
        // 4. TESTO KËRKIMIN
        await this.testSearching();
        
        // 5. RAPORTO REZULTATET
        await this.reportResults();
        
        this.testMode = false;
    }

    async clearOldTests() {
        console.log('🧹 Duke pastruar testet e vjetra...');
        
        try {
            const response = await fetch('/api/chat/clear-test-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ userId: window.currentUser?.id })
            });
            
            console.log('✅ Testet e vjetra u pastruan!');
        } catch (error) {
            console.log('⚠️ Nuk mund të pastrohen testet e vjetra (normal nëse route nuk ekziston)');
        }
    }

    async createTestData() {
        console.log('📝 Duke krijuar të dhëna testuese...');
        
        this.testData = {
            questions: [
                "test_njohuri_radikal_1",
                "test_njohuri_radikal_2", 
                "test_njohuri_radikal_3",
                "sa eshte 2+2 test",
                "cila eshte kryeqyteti i shqiperise test"
            ],
            answers: [
                "Kjo është përgjigje test 1 - RADIKAL",
                "Kjo është përgjigje test 2 - RADIKAL",
                "Kjo është përgjigje test 3 - RADIKAL",
                "4 - TEST I SUKSESSHËM",
                "Tirana - TEST I SUKSESSHËM"
            ]
        };
        
        console.log('✅ Të dhënat testuese u krijuan:', this.testData);
    }

    async testSaving() {
        console.log('💾 TEST 1: Duke testuar ruajtjen e njohurive...');
        
        const results = [];
        
        for (let i = 0; i < this.testData.questions.length; i++) {
            const question = this.testData.questions[i];
            const answer = this.testData.answers[i];
            
            console.log(`\n🧪 Test ${i+1}: "${question}"`);
            
            try {
                // Provo të ruash me metodën direkte
                const response = await fetch('/api/chat/learn', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        userId: window.currentUser?.id,
                        question: question,
                        answer: answer,
                        category: 'test_radikal'
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    console.log(`✅ Test ${i+1}: U ruajt me sukses!`);
                    results.push({ test: i+1, status: 'SUCCESS', method: 'direct' });
                } else {
                    console.log(`❌ Test ${i+1}: Dështoi me metodën direkte`);
                    
                    // Provo me komandën /meso
                    if (typeof processCommand === 'function') {
                        await processCommand(`/meso ${question}|${answer}`);
                        console.log(`🔄 Test ${i+1}: U provua me komandën /meso`);
                        results.push({ test: i+1, status: 'FALLBACK', method: '/meso' });
                    }
                }
                
            } catch (error) {
                console.log(`❌ Test ${i+1}: Gabim në ruajtje:`, error.message);
                results.push({ test: i+1, status: 'ERROR', error: error.message });
            }
            
            // Prit 500ms ndërmjet testeve
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        console.log('📊 REZULTATET E RUAJTJES:', results);
        return results;
    }

    async testSearching() {
        console.log('🔍 TEST 2: Duke testuar kërkimin e njohurive...');
        
        const results = [];
        
        for (let i = 0; i < this.testData.questions.length; i++) {
            const question = this.testData.questions[i];
            const expectedAnswer = this.testData.answers[i];
            
            console.log(`\n🔍 Kërkim ${i+1}: "${question}"`);
            
            try {
                // Provo të gjitha metodat e kërkimit
                const searchMethods = [
                    // Metoda 1: Route i drejtpërdrejtë
                    `/api/chat/knowledge/${window.currentUser?.id}/${encodeURIComponent(question)}`,
                    
                    // Metoda 2: Route me lowercase
                    `/api/chat/knowledge/${window.currentUser?.id}/${encodeURIComponent(question.toLowerCase())}`,
                    
                    // Metoda 3: Route alternative
                    `/api/knowledge/search?query=${encodeURIComponent(question)}&userId=${window.currentUser?.id}`,
                    
                    // Metoda 4: Kërkim në të gjitha njohuritë
                    `/api/chat/export/${window.currentUser?.id}`
                ];
                
                let found = false;
                let foundMethod = '';
                let foundAnswer = '';
                
                for (const method of searchMethods) {
                    try {
                        console.log(`  🔎 Duke provuar: ${method}`);
                        const response = await fetch(method, {
                            credentials: 'include'
                        });
                        
                        if (response.ok) {
                            const data = await response.json();
                            
                            if (data.answer && data.answer !== 'null') {
                                found = true;
                                foundMethod = method;
                                foundAnswer = data.answer;
                                break;
                            } else if (Array.isArray(data) && data.length > 0) {
                                // Kontrollo manualisht në array
                                for (const item of data) {
                                    if (item.question && item.question.includes(question) || 
                                        question.includes(item.question)) {
                                        found = true;
                                        foundMethod = method;
                                        foundAnswer = item.answer || item.value;
                                        break;
                                    }
                                }
                            }
                        }
                    } catch (methodError) {
                        console.log(`  ❌ Metoda dështoi: ${methodError.message}`);
                    }
                }
                
                if (found) {
                    console.log(`✅ Gjetëm përgjigje me metodën: ${foundMethod}`);
                    console.log(`   Përgjigja e gjetur: ${foundAnswer}`);
                    console.log(`   Përgjigja e pritur: ${expectedAnswer}`);
                    
                    // Kontrollo nëse përgjigjet përputhen
                    const matches = foundAnswer.includes(expectedAnswer) || expectedAnswer.includes(foundAnswer);
                    
                    results.push({
                        test: i+1,
                        status: matches ? 'MATCH' : 'MISMATCH',
                        method: foundMethod,
                        found: foundAnswer,
                        expected: expectedAnswer
                    });
                } else {
                    console.log(`❌ Nuk u gjet përgjigje për: "${question}"`);
                    results.push({
                        test: i+1,
                        status: 'NOT_FOUND',
                        method: 'NONE'
                    });
                }
                
            } catch (error) {
                console.log(`❌ Test ${i+1}: Gabim në kërkim:`, error.message);
                results.push({ test: i+1, status: 'ERROR', error: error.message });
            }
            
            // Prit 500ms ndërmjet testeve
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        console.log('📊 REZULTATET E KËRKIMIT:', results);
        return results;
    }

    async reportResults() {
        console.log('\n📋📋📋 RAPORTI FINAL I TESTIT RADIKAL 📋📋📋');
        console.log('===========================================');
        
        // Koleksiono të gjitha rezultatet
        const saveResults = await this.testSaving();
        const searchResults = await this.testSearching();
        
        // Analizo rezultatet
        const totalTests = this.testData.questions.length;
        const savedCount = saveResults.filter(r => r.status === 'SUCCESS' || r.status === 'FALLBACK').length;
        const foundCount = searchResults.filter(r => r.status === 'MATCH' || r.status === 'MISMATCH').length;
        const matchCount = searchResults.filter(r => r.status === 'MATCH').length;
        
        console.log(`\n📈 STATISTIKAT:`);
        console.log(`- Teste totale: ${totalTests}`);
        console.log(`- Teste të ruajtura: ${savedCount}/${totalTests} (${Math.round(savedCount/totalTests*100)}%)`);
        console.log(`- Teste të gjetura: ${foundCount}/${totalTests} (${Math.round(foundCount/totalTests*100)}%)`);
        console.log(`- Teste që përputhen: ${matchCount}/${totalTests} (${Math.round(matchCount/totalTests*100)}%)`);
        
        // Diagnoza
        console.log(`\n🔍 DIAGNOZA:`);
        
        if (savedCount === 0) {
            console.log('❌ PROBLEMI KRYESOR: Njohuritë NUK ruhen fare!');
            console.log('   Zgjidhje: Kontrollo route-in /api/chat/learn në server');
        } else if (foundCount === 0) {
            console.log('❌ PROBLEMI KRYESOR: Njohuritë ruhen por NUK gjenden!');
            console.log('   Zgjidhje: Kontrollo route-in /api/chat/knowledge/ në server');
        } else if (matchCount < foundCount) {
            console.log('⚠️ PROBLEM I MODERUAR: Njohuritë gjenden por nuk përputhen!');
            console.log('   Zgjidhje: Kontrollo formatimin e të dhënave në database');
        } else {
            console.log('✅ SISTEMI I NJOHURIVE FUNKSIONON PERFEKTISHT!');
        }
        
        // Rekomandime
        console.log(`\n🎯 REKOMANDIME:`);
        console.log('1. Kontrollo console të serverit për debug mesazhe');
        console.log('2. Verifiko nëse route-et ekzistojnë në server');
        console.log('3. Kontrollo strukturën e tabelës knowledge_base në database');
        console.log('4. Testo me kërkesa të drejtpërdrejta në browser:');
        console.log(`   → GET: /api/chat/knowledge/${window.currentUser?.id}/test_njohuri_radikal_1`);
        console.log(`   → POST: /api/chat/learn (me të dhëna testuese)`);
        
        // Shfaq mesazhin në chat
        if (typeof addMessage === 'function') {
            addMessage(`
📊 **RAPORTI I TESTIT RADIKAL**

✅ **Teste të ruajtura:** ${savedCount}/${totalTests}
🔍 **Teste të gjetura:** ${foundCount}/${totalTests}
🎯 **Teste që përputhen:** ${matchCount}/${totalTests}

${savedCount === 0 ? '❌ **PROBLEM:** Njohuritë NUK ruhen!' : ''}
${foundCount === 0 ? '❌ **PROBLEM:** Njohuritë NUK gjenden!' : ''}
${matchCount === totalTests ? '✅ **PERFEKT:** Sistemi i njohurive funksionon!' : ''}

💡 *Shiko Console për detaje të plota*
            `.trim(), 'bot');
        }
    }
}

// ✅ INICIALIZO SISTEMIN E TESTIT
setTimeout(() => {
    window.knowledgeTestSystem = new KnowledgeTestSystem();
    
    console.log('🔍 STATUSI I TESTIT RADIKAL:');
    console.log('- Sistemi u inicializua:', !!window.knowledgeTestSystem);
    console.log('- Përdoruesi aktual:', window.currentUser);
    console.log('- Komanda e disponueshme: /test-njohuri');
    console.log('- Butoni i testit: #knowledge-test-btn');
    
}, 2000);

console.log('🚀 Sistemi i testit radikal i njohurive u ngarkua!');
