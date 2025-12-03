// server.js - Server testues minimal
const express = require('express');
const cors = require('cors');
const db = require('./db.js');

const app = express();
const PORT = 3001; // Port tjetër nga RRUFE-TESLA aktual

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

console.log(`🚀 RRUFE-TEST Server starting on port ${PORT}...`);

// ==================== ✅ ROUTE-T E THJESHTA TESTUESE ====================

// ✅ 1. SHTO NJOHURI (për /meso)
app.post('/api/knowledge/learn', (req, res) => {
    const { userId, question, answer } = req.body;
    
    console.log('💾 [TEST-LEARN] Saving:', { userId, question, answer });
    
    db.run(
        `INSERT INTO knowledge_base (user_id, question, answer) VALUES (?, ?, ?)`,
        [userId, question, answer],
        function(err) {
            if (err) {
                console.error('❌ Save error:', err);
                return res.json({ success: false, error: err.message });
            }
            
            console.log('✅✅✅ TEST: Saved with ID:', this.lastID);
            res.json({ 
                success: true, 
                message: '✅ Mësova diçka të re! (TEST)',
                id: this.lastID 
            });
        }
    );
});

// ✅ 2. KËRKO NJOHURI (për checkKnowledge)
app.get('/api/knowledge/search/:userId/:question', (req, res) => {
    const { userId, question } = req.params;
    const searchText = decodeURIComponent(question).toLowerCase().trim();
    
    console.log('🔍 [TEST-SEARCH] Looking for:', { userId, question: searchText });
    
    // METODA 1: Kërko me match të saktë
    db.get(
        `SELECT answer FROM knowledge_base WHERE user_id = ? AND LOWER(question) = ?`,
        [userId, searchText],
        (err, row) => {
            if (err) {
                console.error('❌ Search error (method 1):', err);
                return res.json({ success: true, answer: null });
            }
            
            if (row && row.answer) {
                console.log('✅✅✅ TEST: Found with exact match!');
                return res.json({ 
                    success: true, 
                    found: true,
                    method: 'exact_match',
                    answer: row.answer 
                });
            }
            
            console.log('❌ Method 1 failed, trying method 2...');
            
            // METODA 2: Kërko nëse pyetja përmban pyetjen e ruajtur
            db.get(
                `SELECT answer FROM knowledge_base WHERE user_id = ? AND ? LIKE '%' || LOWER(question) || '%'`,
                [userId, searchText],
                (err, row2) => {
                    if (err) {
                        console.error('❌ Search error (method 2):', err);
                        return res.json({ success: true, answer: null });
                    }
                    
                    if (row2 && row2.answer) {
                        console.log('✅✅✅ TEST: Found with LIKE!');
                        return res.json({ 
                            success: true, 
                            found: true,
                            method: 'like_search',
                            answer: row2.answer 
                        });
                    }
                    
                    console.log('❌❌❌ TEST: All methods failed!');
                    res.json({ 
                        success: true, 
                        found: false,
                        answer: null,
                        debug: 'no_match_found'
                    });
                }
            );
        }
    );
});

// ✅ 3. DEBUG: SHFAQ TË GJITHA NJOHURITË
app.get('/api/knowledge/debug/:userId', (req, res) => {
    const { userId } = req.params;
    
    console.log('🔍 [TEST-DEBUG] All knowledge for user:', userId);
    
    db.all(
        'SELECT * FROM knowledge_base WHERE user_id = ? ORDER BY created_at DESC',
        [userId],
        (err, rows) => {
            if (err) {
                console.error('❌ Debug error:', err);
                return res.json({ error: err.message });
            }
            
            console.log(`📊 TEST: Total ${rows.length} records`);
            
            rows.forEach((row, index) => {
                console.log(`${index + 1}. "${row.question}" → "${row.answer}"`);
            });
            
            res.json({ 
                total: rows.length,
                records: rows 
            });
        }
    );
});

// ✅ 4. TESTI AUTOMATIK
app.get('/api/knowledge/test', (req, res) => {
    console.log('🧪🧪🧪 DUKE EKZEKUTUAR TEST AUTOMATIK 🧪🧪🧪');
    
    const testUserId = 1;
    const testQuestion = "test pyetje 1";
    const testAnswer = "test përgjigje 1";
    
    // Test 1: Kërko të dhënat testuese ekzistuese
    db.get(
        `SELECT answer FROM knowledge_base WHERE user_id = ? AND LOWER(question) = ?`,
        [testUserId, testQuestion.toLowerCase()],
        (err, row) => {
            if (err) {
                console.log('❌ Test 1 FAILED - Database error:', err);
                return res.json({ test1: 'FAILED', error: err.message });
            }
            
            if (row && row.answer === testAnswer) {
                console.log('✅ Test 1 PASSED - Found test data!');
                
                // Test 2: Shto të dhëna të reja
                const newQuestion = "si jeni sot?";
                const newAnswer = "shumë mirë faleminderit!";
                
                db.run(
                    `INSERT INTO knowledge_base (user_id, question, answer) VALUES (?, ?, ?)`,
                    [testUserId, newQuestion, newAnswer],
                    function(err) {
                        if (err) {
                            console.log('❌ Test 2 FAILED - Save error:', err);
                            return res.json({ 
                                test1: 'PASSED', 
                                test2: 'FAILED',
                                error: err.message 
                            });
                        }
                        
                        console.log('✅ Test 2 PASSED - Saved new data with ID:', this.lastID);
                        
                        // Test 3: Kërko të dhënat e reja
                        db.get(
                            `SELECT answer FROM knowledge_base WHERE user_id = ? AND LOWER(question) = ?`,
                            [testUserId, newQuestion.toLowerCase()],
                            (err, row3) => {
                                if (err) {
                                    console.log('❌ Test 3 FAILED - Search error:', err);
                                    return res.json({ 
                                        test1: 'PASSED', 
                                        test2: 'PASSED',
                                        test3: 'FAILED',
                                        error: err.message 
                                    });
                                }
                                
                                if (row3 && row3.answer === newAnswer) {
                                    console.log('✅✅✅ TEST 3 PASSED - System works perfectly!');
                                    res.json({
                                        test1: 'PASSED - Found existing data',
                                        test2: 'PASSED - Saved new data',
                                        test3: 'PASSED - Retrieved new data',
                                        conclusion: '✅✅✅ KNOWLEDGE SYSTEM WORKS 100%!'
                                    });
                                } else {
                                    console.log('❌ Test 3 FAILED - Data not found after save');
                                    res.json({
                                        test1: 'PASSED',
                                        test2: 'PASSED', 
                                        test3: 'FAILED - Data saved but not found',
                                        conclusion: '❌ PROBLEM: Data saves but cannot be retrieved!'
                                    });
                                }
                            }
                        );
                    }
                );
            } else {
                console.log('❌ Test 1 FAILED - Test data not found');
                res.json({ 
                    test1: 'FAILED - Test data missing',
                    conclusion: '❌ Database not initialized properly'
                });
            }
        }
    );
});

app.listen(PORT, () => {
    console.log(`🎯 RRUFE-TEST Server running at: http://localhost:${PORT}`);
    console.log(`🔗 Test endpoints:`);
    console.log(`   - http://localhost:${PORT}/api/knowledge/test`);
    console.log(`   - http://localhost:${PORT}/api/knowledge/debug/1`);
});
