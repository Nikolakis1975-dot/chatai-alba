// routes/knowledge.js - SISTEMI I THJESHTË DHE FUNKSIONAL
const express = require('express');
const router = express.Router();
const db = require('../database');

console.log('🧠 RRUFE-TESLA: Knowledge system loaded');

// ✅ 1. SHTO NJOHURI TË RE (për /meso)
router.post('/learn', (req, res) => {
    const { userId, question, answer } = req.body;
    
    console.log('💾 [KNOWLEDGE-LEARN] Saving:', { userId, question, answer });
    
    if (!userId || !question || !answer) {
        return res.status(400).json({ 
            success: false, 
            error: 'Missing data' 
        });
    }
    
    // Ruaj në database
    db.run(
        `INSERT INTO knowledge_base (user_id, question, answer, created_at) 
         VALUES (?, ?, ?, datetime('now'))`,
        [userId, question, answer],
        function(err) {
            if (err) {
                console.error('❌ Save error:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Database error' 
                });
            }
            
            console.log('✅ Saved knowledge with ID:', this.lastID);
            res.json({ 
                success: true, 
                message: '✅ Mësova diçka të re!',
                id: this.lastID 
            });
        }
    );
});

// ✅ 2. KËRKO NJOHURI (për checkKnowledge)
router.get('/search/:userId/:question', (req, res) => {
    const { userId, question } = req.params;
    const searchText = decodeURIComponent(question).toLowerCase().trim();
    
    console.log('🔍 [KNOWLEDGE-SEARCH] Looking for:', { userId, question: searchText });
    
    // Kërko me 3 metoda:
    // 1. Match i saktë
    // 2. Pyetja përmban pyetjen e ruajtur
    // 3. Pyetja e ruajtur përmban pyetjen
    
    const query = `
        SELECT answer 
        FROM knowledge_base 
        WHERE user_id = ? 
        AND (
            LOWER(question) = ? 
            OR ? LIKE '%' || LOWER(question) || '%'
            OR LOWER(question) LIKE '%' || ? || '%'
        )
        ORDER BY 
            CASE 
                WHEN LOWER(question) = ? THEN 1
                WHEN ? LIKE '%' || LOWER(question) || '%' THEN 2
                WHEN LOWER(question) LIKE '%' || ? || '%' THEN 3
                ELSE 4
            END
        LIMIT 1
    `;
    
    db.get(query, 
        [userId, searchText, searchText, searchText, searchText, searchText], 
        (err, row) => {
            if (err) {
                console.error('❌ Search error:', err);
                return res.json({ success: true, answer: null });
            }
            
            if (row && row.answer) {
                console.log('✅✅✅ Found answer!');
                return res.json({ 
                    success: true, 
                    found: true,
                    answer: row.answer 
                });
            }
            
            console.log('❌ No match found');
            res.json({ 
                success: true, 
                found: false,
                answer: null 
            });
        }
    );
});

// ✅ 3. DEBUG: SHFAQ TË GJITHA NJOHURITË
router.get('/debug/:userId', (req, res) => {
    const { userId } = req.params;
    
    console.log('🔍 [KNOWLEDGE-DEBUG] All knowledge for user:', userId);
    
    db.all(
        'SELECT id, question, answer, created_at FROM knowledge_base WHERE user_id = ? ORDER BY created_at DESC',
        [userId],
        (err, rows) => {
            if (err) {
                console.error('❌ Debug error:', err);
                return res.json({ success: false, error: err.message });
            }
            
            console.log(`📚 Total ${rows.length} knowledge entries`);
            
            rows.forEach((row, index) => {
                console.log(`${index + 1}. ID: ${row.id}`);
                console.log(`   Q: "${row.question}"`);
                console.log(`   A: "${row.answer.substring(0, 50)}..."`);
            });
            
            res.json({ 
                success: true, 
                count: rows.length,
                knowledge: rows 
            });
        }
    );
});

// ✅ 4. TEST ROUTE
router.get('/test', (req, res) => {
    console.log('🧪 Testing knowledge system...');
    
    res.json({ 
        success: true, 
        message: 'Knowledge system is working!',
        endpoints: {
            'POST /api/knowledge/learn': 'Save new knowledge',
            'GET /api/knowledge/search/:userId/:question': 'Search knowledge',
            'GET /api/knowledge/debug/:userId': 'Debug all knowledge'
        }
    });
});

module.exports = router;
