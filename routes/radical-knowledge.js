// routes/radical-knowledge.js - SISTEMI I RI I NJOHURIVE
const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

console.log('🧠 RRUFE-TESLA: Sistemi radikal i njohurive u ngarkua!');

// ================================================= ✅ DATABASE E RE E PASTËR ==========================================

const dbPath = path.join(__dirname, '..', 'data', 'radical-knowledge.db');
const dataDir = path.join(__dirname, '..', 'data');

// Krijo dosjen data nëse nuk ekziston
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('✅ U krijua drejtoria data/');
}

console.log(`🗄️  Database radikale: ${dbPath}`);

// Krijo connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Gabim në database radikale:', err);
    } else {
        console.log('✅ U lidh me database radikale');
        initializeRadicalDatabase();
    }
});

// ================================================== ✅ INICIALIZO DATABASE-N E RE =========================================

function initializeRadicalDatabase() {
    console.log('🏗️  Duke inicializuar database radikale...');
    
    // Tabela e njohurive - VERSION I THJESHTË DHE I PASTËR
    db.run(`CREATE TABLE IF NOT EXISTS radical_knowledge (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        question_lower TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, question_lower)
    )`, (err) => {
        if (err) {
            console.error('❌ Gabim në tabelën radical_knowledge:', err);
        } else {
            console.log('✅ Tabela radical_knowledge u krijua');
            
            // Shto disa të dhëna testuese
            db.run(`INSERT OR IGNORE INTO radical_knowledge (user_id, question, question_lower, answer) 
                    VALUES (1, 'test pyetje 1', 'test pyetje 1', 'test përgjigje 1')`);
            db.run(`INSERT OR IGNORE INTO radical_knowledge (user_id, question, question_lower, answer) 
                    VALUES (1, 'si jeni?', 'si jeni?', 'mirë faleminderit')`);
            db.run(`INSERT OR IGNORE INTO radical_knowledge (user_id, question, question_lower, answer) 
                    VALUES (1, 'sa eshte 2+2?', 'sa eshte 2+2?', '4')`);
        }
    });
}

// =================================================== ✅ 1. SHTO NJOHURI TË RE =================================================

router.post('/radical-learn', (req, res) => {
    const { userId, question, answer } = req.body;
    
    console.log('💾 [RADICAL-LEARN] Duke ruajtur:', { userId, question, answer });
    
    if (!userId || !question || !answer) {
        return res.status(400).json({ 
            success: false, 
            error: 'Të dhëna të pamjaftueshme' 
        });
    }
    
    const questionLower = question.toLowerCase().trim();
    
    db.run(
        `INSERT OR REPLACE INTO radical_knowledge 
         (user_id, question, question_lower, answer) 
         VALUES (?, ?, ?, ?)`,
        [userId, question, questionLower, answer],
        function(err) {
            if (err) {
                console.error('❌ Gabim në ruajtje radikale:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Gabim në database' 
                });
            }
            
            console.log('✅✅✅ NJOHURI RADIKALE U RUAJT! ID:', this.lastID);
            
            res.json({ 
                success: true, 
                message: '✅ Mësova diçka të re! (Radikal)',
                id: this.lastID 
            });
        }
    );
});

// ====================================================== ✅ 2. KËRKO NJOHURI ====================================================

router.get('/radical-search/:userId/:question', (req, res) => {
    const { userId, question } = req.params;
    const searchText = decodeURIComponent(question).toLowerCase().trim();
    
    console.log('🔍 [RADICAL-SEARCH] Kërko:', searchText, 'për user:', userId);
    
    // ✅ KËRKIM I THJESHTË DHE I SIGURT
    db.get(
        `SELECT answer FROM radical_knowledge 
         WHERE user_id = ? AND question_lower = ?`,
        [userId, searchText],
        (err, row) => {
            if (err) {
                console.error('❌ Gabim në kërkim radikal:', err);
                return res.json({ 
                    success: true, 
                    found: false,
                    answer: null 
                });
            }
            
            if (row && row.answer) {
                console.log('✅✅✅ RADICAL-SEARCH: GJETËM!');
                return res.json({ 
                    success: true, 
                    found: true,
                    answer: row.answer 
                });
            }
            
            console.log('❌ RADICAL-SEARCH: Nuk u gjet');
            
  // ==================================================✅ KËRKIM I DYRTË ME LIKE =========================================
          
            db.get(
                `SELECT answer FROM radical_knowledge 
                 WHERE user_id = ? AND question_lower LIKE ?`,
                [userId, `%${searchText}%`],
                (err, row2) => {
                    if (err) {
                        console.error('❌ Gabim në LIKE radikal:', err);
                        return res.json({ 
                            success: true, 
                            found: false,
                            answer: null 
                        });
                    }
                    
                    if (row2 && row2.answer) {
                        console.log('✅✅✅ RADICAL-SEARCH (LIKE): GJETËM!');
                        return res.json({ 
                            success: true, 
                            found: true,
                            answer: row2.answer 
                        });
                    }
                    
                    console.log('❌❌❌ RADICAL-SEARCH: Të dyja metodat dështuan');
                    res.json({ 
                        success: true, 
                        found: false,
                        answer: null 
                    });
                }
            );
        }
    );
});

// ====================================================== ✅ 3. SHFAQ TË GJITHA NJOHURITË =====================================

router.get('/radical-list/:userId', (req, res) => {
    const { userId } = req.params;
    
    console.log('📚 [RADICAL-LIST] Duke listuar për user:', userId);
    
    db.all(
        `SELECT id, question, answer, created_at 
         FROM radical_knowledge 
         WHERE user_id = ? 
         ORDER BY created_at DESC`,
        [userId],
        (err, rows) => {
            if (err) {
                console.error('❌ Gabim në listim radikal:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: err.message 
                });
            }
            
            console.log(`✅ Gjithsej ${rows.length} njohuri radikale`);
            
            res.json({ 
                success: true, 
                count: rows.length,
                knowledge: rows 
            });
        }
    );
});

// ======================================================= ✅ 4. TEST AUTOMATIK =============================================

router.get('/radical-test', (req, res) => {
    console.log('🧪🧪🧪 DUKE EKZEKUTUAR TEST RADIKAL 🧪🧪🧪');
    
    const testUserId = 1;
    const tests = [];
    
    // Test 1: Listo të gjitha të dhënat
    db.all('SELECT * FROM radical_knowledge WHERE user_id = ?', [testUserId], (err, rows) => {
        tests.push({ name: 'Listimi i të dhënave', success: !err, data: rows?.length || 0 });
        
        // Test 2: Kërko njohuri specifike
        const testQuestion = 'si jeni?';
        db.get(
            'SELECT answer FROM radical_knowledge WHERE user_id = ? AND question_lower = ?',
            [testUserId, testQuestion],
            (err, row) => {
                tests.push({ 
                    name: 'Kërkimi i njohurive', 
                    success: !err && row, 
                    found: !!row 
                });
                
                // Test 3: Shto njohuri të re
                const newQuestion = 'test_' + Date.now();
                const newAnswer = 'përgjigje_test';
                
                db.run(
                    'INSERT INTO radical_knowledge (user_id, question, question_lower, answer) VALUES (?, ?, ?, ?)',
                    [testUserId, newQuestion, newQuestion.toLowerCase(), newAnswer],
                    function(err) {
                        tests.push({ 
                            name: 'Ruajtja e të dhënave', 
                            success: !err, 
                            id: this.lastID 
                        });
                        
                        // Test 4: Kontrollo të dhënat e reja
                        db.get(
                            'SELECT answer FROM radical_knowledge WHERE id = ?',
                            [this.lastID],
                            (err, row) => {
                                tests.push({ 
                                    name: 'Verifikimi i të dhënave të reja', 
                                    success: !err && row && row.answer === newAnswer,
                                    verified: !err && row 
                                });
                                
                                // Rezultatet finale
                                const successCount = tests.filter(t => t.success).length;
                                const totalTests = tests.length;
                                
                                console.log('📊 REZULTATET E TESTIT RADIKAL:');
                                tests.forEach((test, index) => {
                                    console.log(`${index + 1}. ${test.name}: ${test.success ? '✅' : '❌'}`);
                                });
                                
                                res.json({
                                    success: true,
                                    tests: tests,
                                    summary: {
                                        total: totalTests,
                                        passed: successCount,
                                        failed: totalTests - successCount,
                                        percentage: Math.round((successCount / totalTests) * 100)
                                    },
                                    conclusion: successCount === totalTests ? 
                                        '🎉 SISTEMI RADIKAL FUNKSIONON PERFEKTISHT!' :
                                        '⚠️ SISTEMI KA DISA PROBLEME'
                                });
                            }
                        );
                    }
                );
            }
        );
    });
});

// =================================================== ✅ 5. SHËNDETI I SISTEMIT ===============================================

router.get('/radical-health', (req, res) => {
    console.log('❤️‍🩹 Kontroll shëndeti për sistemin radikal');
    
    db.get("SELECT COUNT(*) as count FROM radical_knowledge", (err, row) => {
        if (err) {
            console.error('❌ Gabim në kontrollin e shëndetit:', err);
            res.json({ 
                healthy: false, 
                error: err.message,
                timestamp: new Date().toISOString()
            });
        } else {
            console.log('✅ Sistemi radikal është healthy! Rreshta:', row.count);
            res.json({ 
                healthy: true,
                rows: row.count,
                timestamp: new Date().toISOString(),
                system: 'radical_knowledge_system',
                version: '1.0.0'
            });
        }
    });
});

module.exports = router;
