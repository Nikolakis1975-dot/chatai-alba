// routes/knowledge.js
const express = require('express');
const router = express.Router();
const db = require('../database'); // Përshtat sipas strukturës sate të database

// ==================== API ROUTES PËR KNOWLEDGE DISTILLER ====================

// ✅ Kontrollo statusin e databazës
router.get('/database/status', (req, res) => {
    console.log('🔍 Duke kontrolluar statusin e databazës...');
    
    try {
        res.json({ 
            success: true, 
            database: 'connected',
            type: 'SQLite', 
            path: '/tmp/chat.db',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Gabim në kontrollin e databazës:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Database connection failed' 
        });
    }
});

// ✅ Ngarko njohuritë nga databaza
router.get('/load', async (req, res) => {
    console.log('📥 Duke ngarkuar njohuritë nga databaza...');
    
    try {
        // Merr user ID nga session ose cookies
        const userId = req.user?.username || req.user?.id || 'anonymous';
        
        console.log(`🔍 Duke kërkuar njohuri për user: ${userId}`);
        
        // Kontrollo nëse tabela ekziston
        const tableExists = await db.get(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='user_knowledge'"
        );
        
        if (!tableExists) {
            console.log('ℹ️ Tabela user_knowledge nuk ekziston, duke krijuar...');
            
            // Krijo tabelën nëse nuk ekziston
            await db.run(`
                CREATE TABLE IF NOT EXISTS user_knowledge (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT NOT NULL,
                    knowledge_data TEXT NOT NULL,
                    version TEXT DEFAULT '1.0',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);
            
            console.log('✅ Tabela user_knowledge u krijua');
            
            res.json({
                success: true,
                knowledge: {},
                message: 'New knowledge database created'
            });
            return;
        }
        
        // Merr të dhënat nga databaza
        const knowledge = await db.get(
            'SELECT knowledge_data FROM user_knowledge WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1',
            [userId]
        );
        
        if (knowledge && knowledge.knowledge_data) {
            const knowledgeData = JSON.parse(knowledge.knowledge_data);
            console.log(`✅ U gjetën ${Object.keys(knowledgeData).length} kategori njohurish`);
            
            res.json({
                success: true,
                knowledge: knowledgeData,
                message: 'Knowledge loaded from database'
            });
        } else {
            console.log('ℹ️ Nuk u gjetën njohuri për këtë user');
            res.json({
                success: true,
                knowledge: {},
                message: 'No knowledge found for user'
            });
        }
        
    } catch (error) {
        console.error('❌ Gabim në ngarkimin e njohurive:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            knowledge: {} // Kthe objekt bosh si fallback
        });
    }
});

// ✅ Ruaj njohuritë në databazë
router.post('/save', async (req, res) => {
    console.log('💾 Duke ruajtur njohuritë në databazë...');
    
    try {
        const { userId, knowledge, timestamp, version } = req.body;
        
        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                error: 'User ID required' 
            });
        }
        
        console.log(`📊 Duke ruajtur ${Object.keys(knowledge).length} kategori për user: ${userId}`);
        
        // Sigurohu që tabela ekziston
        await db.run(`
            CREATE TABLE IF NOT EXISTS user_knowledge (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                knowledge_data TEXT NOT NULL,
                version TEXT DEFAULT '1.0',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Ruaj ose update të dhënat
        const result = await db.run(
            `INSERT OR REPLACE INTO user_knowledge 
             (user_id, knowledge_data, version, updated_at) 
             VALUES (?, ?, ?, ?)`,
            [userId, JSON.stringify(knowledge), version || '2.0-sql', timestamp || new Date().toISOString()]
        );
        
        console.log('✅ Njohuritë u ruajtën me sukses në databazë');
        
        res.json({ 
            success: true, 
            message: 'Knowledge saved to database',
            id: result.lastID 
        });
        
    } catch (error) {
        console.error('❌ Gabim në ruajtjen e njohurive:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// ✅ Kërko njohuri
router.get('/search', async (req, res) => {
    try {
        const { query, category } = req.query;
        const userId = req.user?.username || 'anonymous';
        
        if (!query) {
            return res.status(400).json({ 
                success: false, 
                error: 'Search query required' 
            });
        }
        
        console.log(`🔍 Duke kërkuar: "${query}" për user: ${userId}`);
        
        // Merr të dhënat e userit
        const knowledge = await db.get(
            'SELECT knowledge_data FROM user_knowledge WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1',
            [userId]
        );
        
        if (!knowledge) {
            return res.json({
                success: true,
                results: [],
                message: 'No knowledge found'
            });
        }
        
        const knowledgeData = JSON.parse(knowledge.knowledge_data);
        const results = [];
        const searchTerms = query.toLowerCase().split(' ');
        
        // Implemento logjikën e kërkimit
        Object.entries(knowledgeData).forEach(([cat, entries]) => {
            if (category && category !== cat) return;
            
            Object.entries(entries).forEach(([key, data]) => {
                const keyLower = key.toLowerCase();
                const valueLower = JSON.stringify(data.value).toLowerCase();
                
                const matchScore = searchTerms.reduce((score, term) => {
                    if (keyLower.includes(term)) score += 3;
                    if (valueLower.includes(term)) score += 1;
                    return score;
                }, 0);
                
                if (matchScore > 0) {
                    results.push({
                        key: key,
                        category: cat,
                        data: data.value,
                        score: matchScore,
                        usageCount: data.usageCount || 0
                    });
                }
            });
        });
        
        // Rendit sipas relevancës
        results.sort((a, b) => b.score - a.score);
        
        res.json({
            success: true,
            results: results,
            count: results.length
        });
        
    } catch (error) {
        console.error('❌ Gabim në kërkim:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// ✅ Fshi njohuritë e userit
router.delete('/clear', async (req, res) => {
    try {
        const userId = req.user?.username || 'anonymous';
        
        console.log(`🗑️ Duke fshirë njohuritë për user: ${userId}`);
        
        await db.run(
            'DELETE FROM user_knowledge WHERE user_id = ?',
            [userId]
        );
        
        res.json({
            success: true,
            message: 'Knowledge cleared successfully'
        });
        
    } catch (error) {
        console.error('❌ Gabim në fshirjen e njohurive:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

module.exports = router;
