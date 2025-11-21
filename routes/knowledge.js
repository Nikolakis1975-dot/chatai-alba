// ===========================================knowledge =================================================
const express = require('express');
const router = express.Router();
const db = require('../database'); // Përdor database.js ekzistues

// ==================== API ROUTES PËR KNOWLEDGE DISTILLER ====================

// ✅ Kontrollo statusin e databazës
router.get('/database/status', (req, res) => {
    console.log('🔍 Duke kontrolluar statusin e databazës...');
    
    try {
        res.json({ 
            success: true, 
            database: 'connected',
            type: 'SQLite', 
            path: process.env.NODE_ENV === 'production' ? '/tmp/chat.db' : './data/chat.db',
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
        // Merr user ID nga session ose localStorage (përmes frontend)
        const userId = req.headers['user-id'] || req.query.userId || 'anonymous';
        
        console.log(`🔍 Duke kërkuar njohuri për user: ${userId}`);
        
        // Merr të dhënat nga databaza
        db.get(
            'SELECT knowledge_data FROM user_knowledge WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1',
            [userId],
            (err, row) => {
                if (err) {
                    console.error('❌ Gabim në query:', err);
                    return res.status(500).json({ 
                        success: false, 
                        error: err.message 
                    });
                }
                
                if (row && row.knowledge_data) {
                    try {
                        const knowledgeData = JSON.parse(row.knowledge_data);
                        const categories = Object.keys(knowledgeData).length;
                        const totalEntries = Object.values(knowledgeData).reduce(
                            (sum, category) => sum + Object.keys(category).length, 0
                        );
                        
                        console.log(`✅ U gjetën ${categories} kategori me ${totalEntries} njohuri`);
                        
                        res.json({
                            success: true,
                            knowledge: knowledgeData,
                            message: 'Knowledge loaded from database'
                        });
                    } catch (parseError) {
                        console.error('❌ Gabim në parsing JSON:', parseError);
                        res.json({
                            success: true,
                            knowledge: {},
                            message: 'Error parsing knowledge data'
                        });
                    }
                } else {
                    console.log('ℹ️ Nuk u gjetën njohuri për këtë user');
                    res.json({
                        success: true,
                        knowledge: {},
                        message: 'No knowledge found for user'
                    });
                }
            }
        );
        
    } catch (error) {
        console.error('❌ Gabim në ngarkimin e njohurive:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            knowledge: {}
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
        
        const categories = Object.keys(knowledge).length;
        const totalEntries = Object.values(knowledge).reduce(
            (sum, category) => sum + Object.keys(category).length, 0
        );
        
        console.log(`📊 Duke ruajtur ${categories} kategori me ${totalEntries} njohuri për user: ${userId}`);
        
        // Ruaj ose update të dhënat
        db.run(
            `INSERT OR REPLACE INTO user_knowledge 
             (user_id, knowledge_data, version, updated_at) 
             VALUES (?, ?, ?, ?)`,
            [userId, JSON.stringify(knowledge), version || '2.0-sql', timestamp || new Date().toISOString()],
            function(err) {
                if (err) {
                    console.error('❌ Gabim në ruajtjen e njohurive:', err);
                    return res.status(500).json({ 
                        success: false, 
                        error: err.message 
                    });
                }
                
                console.log('✅ Njohuritë u ruajtën me sukses në databazë, ID:', this.lastID);
                
                res.json({ 
                    success: true, 
                    message: 'Knowledge saved to database',
                    id: this.lastID 
                });
            }
        );
        
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
        const { query, category, userId } = req.query;
        
        if (!query) {
            return res.status(400).json({ 
                success: false, 
                error: 'Search query required' 
            });
        }
        
        console.log(`🔍 Duke kërkuar: "${query}" për user: ${userId}`);
        
        // Merr të dhënat e userit
        db.get(
            'SELECT knowledge_data FROM user_knowledge WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1',
            [userId || 'anonymous'],
            (err, row) => {
                if (err) {
                    console.error('❌ Gabim në query:', err);
                    return res.status(500).json({ 
                        success: false, 
                        error: err.message 
                    });
                }
                
                if (!row) {
                    return res.json({
                        success: true,
                        results: [],
                        message: 'No knowledge found'
                    });
                }
                
                try {
                    const knowledgeData = JSON.parse(row.knowledge_data);
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
                    
                } catch (parseError) {
                    console.error('❌ Gabim në parsing JSON:', parseError);
                    res.status(500).json({ 
                        success: false, 
                        error: 'Error parsing knowledge data' 
                    });
                }
            }
        );
        
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
        const { userId } = req.query;
        
        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                error: 'User ID required' 
            });
        }
        
        console.log(`🗑️ Duke fshirë njohuritë për user: ${userId}`);
        
        db.run(
            'DELETE FROM user_knowledge WHERE user_id = ?',
            [userId],
            function(err) {
                if (err) {
                    console.error('❌ Gabim në fshirjen e njohurive:', err);
                    return res.status(500).json({ 
                        success: false, 
                        error: err.message 
                    });
                }
                
                console.log('✅ Njohuritë u fshinë për user:', userId);
                
                res.json({
                    success: true,
                    message: 'Knowledge cleared successfully',
                    changes: this.changes
                });
            }
        );
        
    } catch (error) {
        console.error('❌ Gabim në fshirjen e njohurive:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

module.exports = router;
