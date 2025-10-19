const crypto = require('crypto');
const express = require('express');
const db = require('../database');
const router = express.Router();

// ✅ IMPORT I KONSTANTAVE
const constants = require('../config/constants');

// ✅ IMPORT I COMMAND SERVICE
const CommandService = require('../services/commandService');

// ✅ FUNKSIONET NDIHMËSE ME DATABASE CORRECT
async function checkApiKey(userId) {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT api_key FROM api_keys WHERE user_id = ? AND service_name = ?',
            [userId, 'gemini'],
            (err, result) => {
                if (err) {
                    console.error('❌ Gabim në checkApiKey:', err);
                    resolve(false);
                } else {
                    resolve(!!result);
                }
            }
        );
    });
}

async function getUserById(userId) {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT * FROM users WHERE id = ?',
            [userId],
            (err, user) => {
                if (err) {
                    console.error('❌ Gabim në getUserById:', err);
                    resolve(null);
                } else {
                    resolve(user);
                }
            }
        );
    });
}

function getSimpleNaturalResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('përshëndetje') || lowerMessage.includes('tungjatjeta') || lowerMessage.includes('hello')) {
        return "Përshëndetje! 😊 Mirë se ju gjetëm! Si mund t'ju ndihmoj sot?";
    }
    
    if (lowerMessage.includes('si je') || lowerMessage.includes('si jeni')) {
        return "Jam shumë mirë, faleminderit që pyetët! 😊 Çfarë mund të bëj për ju?";
    }
    
    if (lowerMessage.includes('faleminderit') || lowerMessage.includes('rrofsh') || lowerMessage.includes('thanks')) {
        return "S'ka përse! 😊 Gjithmonë i lumtur të ndihmoj!";
    }
    
    if (lowerMessage.includes('ndihmë') || lowerMessage.includes('help')) {
        return "Sigurisht! 😊 Çfarë lloj ndihme keni nevojë? Mund të përdorni /ndihmo për të parë të gjitha mundësitë.";
    }
    
    if (lowerMessage.includes('mirëmëngjes')) {
        return "Mirëmëngjes! ☀️ Fillim të mbarë të ditës! Si mund t'ju ndihmoj sot?";
    }
    
    if (lowerMessage.includes('mirëmbrëma')) {
        return "Mirëmbrëma! 🌙 Mbrëmje e mbarë! Si mund t'ju shërbej?";
    }
    
    return "E kuptoj! 😊 Përdorni /ndihmo për të parë të gjitha komandat e mia, ose më tregoni më shumë se çfarë keni nevojë.";
}

// ✅ RUTA PËR MESAZHET E DREJTPËRDREDHURA (PËR FRONTEND) ME RUAJTJE NË DATABASE
router.post('/message', async (req, res) => {
    try {
        // ✅ PËRDOR COOKIES NGA MIDDLEWARE - KORRIGJIM KRITIK!
        const userId = req.userId || 'anonymous';
        const sessionId = req.sessionId || 'session-' + Date.now();
        const message = req.body.message;
        
        console.log('🔍 routes/chat/message: Marrë mesazh për urë:', message?.substring(0, 50));
        console.log('🔒 Session data nga middleware:', { userId, sessionId });

        if (!message || message.trim() === '') {
            return res.json({
                success: false,
                response: '❌ Ju lutem shkruani një mesazh'
            });
        }

        // ✅ 1. RUAJ MESAZHIN E PËRDORUESIT NË DATABASE - SHTIM I RI KRITIK!
        console.log('💾 Duke ruajtur mesazhin e USER në database...');
        db.run(
            'INSERT INTO messages (user_id, content, sender, timestamp) VALUES (?, ?, ?, ?)',
            [userId, message, 'user', new Date().toISOString()],
            function(err) {
                if (err) {
                    console.error('❌ Gabim në ruajtjen e mesazhit user:', err);
                } else {
                    console.log('✅ Mesazhi i userit u ruajt, ID:', this.lastID);
                }
            }
        );

        // ✅ 2. PERDOR DIRECT COMMAND SERVICE
        console.log('🎯 routes/chat/message: Duke thirrur CommandService direkt...');
        const CommandService = require('../services/commandService');
        
        // Merr përdoruesin
        const user = await new Promise((resolve) => {
            db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
                resolve(user || { id: userId, username: 'user-' + userId });
            });
        });

        const result = await CommandService.processCommand('', user, message);
        
        console.log('📊 routes/chat/message: Rezultati:', {
            success: result.success,
            messageLength: result.response?.length || 0
        });

        // ✅ 3. RUAJ PËRGJIGJEN E AI NË DATABASE - SHTIM I RI KRITIK!
        if (result.success && result.response) {
            console.log('💾 Duke ruajtur përgjigjen e BOT në database...');
            db.run(
                'INSERT INTO messages (user_id, content, sender, timestamp) VALUES (?, ?, ?, ?)',
                [userId, result.response, 'bot', new Date().toISOString()],
                function(err) {
                    if (err) {
                        console.error('❌ Gabim në ruajtjen e mesazhit bot:', err);
                    } else {
                        console.log('✅ Përgjigja e bot u ruajt, ID:', this.lastID);
                    }
                }
            );
        }
        
        // ✅ 4. KTHE SESSION DATA TË NJËJTË - JO TË REJA!
        return res.json({
            ...result,
            sessionData: {
                userId: userId,    // ✅ SESIONI I NJËJTË
                sessionId: sessionId // ✅ SESIONI I NJËJTË
            }
        });

    } catch (error) {
        console.error('❌ routes/chat/message: Gabim i përgjithshëm:', error);
        return res.json({
            success: false,
            response: '❌ Gabim në server. Provo përsëri.',
            sessionData: {
                userId: req.userId || 'anonymous',
                sessionId: req.sessionId || 'session-' + Date.now()
            }
        });
    }
});

// =============== ✅ ENDPOINT DEBUG PËR TË TESTUAR MIDDLEWARE =====================
router.get('/test-middleware', (req, res) => {
    console.log('🔍 TEST MIDDLEWARE - Request object:');
    console.log('   🍪 req.cookies:', req.cookies);
    console.log('   🔑 req.userId:', req.userId);
    console.log('   🔑 req.sessionId:', req.sessionId);
    console.log('   📨 req.headers.cookie:', req.headers.cookie);
    
    res.json({
        success: true,
        middleware_data: {
            userId: req.userId,
            sessionId: req.sessionId,
            cookies: req.cookies,
            headers_cookie: req.headers.cookie
        },
        message: 'Middleware test completed'
    });
});

// ==================== ✅ ENDPOINT I THJESHTË PËR TESTIM TË COOKIES ========================
router.get('/test-cookies', (req, res) => {
    console.log('🍪 TEST: Cookies të pranuara:', req.cookies);
    console.log('🔍 TEST: Session data nga middleware:', { 
        userId: req.userId, 
        sessionId: req.sessionId 
    });
    
    res.json({
        success: true,
        cookies: req.cookies,
        sessionData: {
            userId: req.userId,
            sessionId: req.sessionId
        },
        message: 'Test i cookies'
    });
});

// ✅ ENDPOINT TEST PËR DATABASE - SHTIM I RI!
router.get('/test-database', (req, res) => {
    console.log('🔍 Test database - Duke kontrolluar tabelën messages...');
    
    db.all('SELECT name FROM sqlite_master WHERE type="table"', (err, tables) => {
        if (err) {
            console.error('❌ Gabim në marrjen e tabelave:', err);
            return res.json({ success: false, error: err.message });
        }
        
        console.log('📊 Tabelat në database:', tables);
        
        // Kontrollo nëse ekziston tabela messages
        const messagesTableExists = tables.some(table => table.name === 'messages');
        
        if (messagesTableExists) {
            // Numëro mesazhet
            db.get('SELECT COUNT(*) as count FROM messages', (err, row) => {
                if (err) {
                    console.error('❌ Gabim në numërimin e mesazheve:', err);
                } else {
                    console.log(`📨 Total mesazhe në database: ${row.count}`);
                }
                
                res.json({
                    success: true,
                    tables: tables,
                    messages_table_exists: messagesTableExists,
                    total_messages: row?.count || 0
                });
            });
        } else {
            res.json({
                success: true,
                tables: tables,
                messages_table_exists: false,
                message: 'Tabela messages nuk ekziston!'
            });
        }
    });
});

// ✅ KODI EKZISTUES - RUAJ MESAZHIN NË HISTORI
router.post('/save', (req, res) => {
    const { userId, content, sender, timestamp } = req.body;

    if (!userId || !content || !sender) {
        return res.status(400).json({ error: 'Të dhëna të pamjaftueshme' });
    }

    db.run(
        'INSERT INTO messages (user_id, content, sender, timestamp) VALUES (?, ?, ?, ?)',
        [userId, content, sender, timestamp || new Date().toISOString()],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Gabim gjatë ruajtjes së mesazhit' });
            }

            res.json({ message: 'Mesazhi u ruajt me sukses', id: this.lastID });
        }
    );
});

// ================ ✅ KODI EKZISTUES - FSHI HISTORINË E PËRDORUESIT ==================
router.delete('/clear/:userId', (req, res) => {
    const { userId } = req.params;

    db.run(
        'DELETE FROM messages WHERE user_id = ?',
        [userId],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Gabim gjatë fshirjes së historisë' });
            }
            res.json({ message: 'Historia u fshi me sukses' });
        }
   );
 });

// =========================== ✅ ENDPOINT I RI PËR HISTORI ==============================
router.get('/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        console.log('📊 Duke marrë historinë për user:', userId);
        
        // Merr historinë nga database
        const history = await new Promise((resolve) => {
            db.all(
                'SELECT content, sender, timestamp FROM messages WHERE user_id = ? ORDER BY timestamp DESC LIMIT 50',
                [userId],
                (err, rows) => {
                    if (err) {
                        console.error('❌ Gabim në histori:', err);
                        resolve([]);
                    } else {
                        resolve(rows || []);
                    }
                }
            );
        });
        
        res.json({
            success: true,
            history: history,
            count: history.length
        });
        
    } catch (error) {
        console.error('❌ Gabim në marrjen e historisë:', error);
        res.status(500).json({
            success: false,
            message: 'Gabim në marrjen e historisë'
        });
    }
});

// ✅ ENDPOINT PËR FSHIRJEN E SESIONEVE PAS DALJES
router.post('/clear-session', async (req, res) => {
    try {
        const { userId, sessionId } = req.body;
        
        console.log('🧹 Duke fshirë sesionin:', { userId, sessionId });
        
        if (userId && sessionId) {
            // ✅ FSHI TË DHËNAT E KËTIJ SESIONI
            db.run(
                'DELETE FROM conversation_contexts WHERE user_id = ? AND session_id = ?',
                [userId, sessionId],
                function(err) {
                    if (err) {
                        console.error('❌ Gabim në fshirjen e sesionit:', err);
                    } else {
                        console.log(`✅ U fshinë ${this.changes} të dhëna sesioni`);
                    }
                }
            );
        }
        
        // ✅ FSHI COOKIES NË PËRGJIGJE
        res.clearCookie('chatUserId');
        res.clearCookie('chatSessionId');
        
        res.json({
            success: true,
            message: 'Sesioni u fshi me sukses',
            cookiesCleared: true
        });
        
    } catch (error) {
        console.error('❌ Gabim në fshirjen e sesionit:', error);
        res.json({
            success: false,
            message: 'Gabim në fshirjen e sesionit'
        });
    }
});

// ✅ ENDPOINT I RI PËR INICIALIZIM TË SESIONIT
router.get('/init-session', (req, res) => {
    try {
        // ✅ MIDDLEWARE TASHMË KA KRIJUAR/KONTROLLUAR COOKIES
        const sessionData = {
            userId: req.userId || 'anonymous',
            sessionId: req.sessionId || 'session-' + Date.now()
        };
        
        console.log('🎯 Session init endpoint:', sessionData);
        
        res.json({
            success: true,
            message: 'Session initialized successfully',
            sessionData: sessionData
        });
        
    } catch (error) {
        console.error('❌ Gabim në session init:', error);
        res.json({
            success: false,
            message: 'Gabim në inicializimin e sesionit',
            sessionData: {
                userId: 'user-' + Date.now(),
                sessionId: 'session-' + Date.now()
            }
        });
    }
});

// ========================== ✅ ENDPOINT DEBUG PËR API KEYS ==============================
router.get('/debug-apikeys/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        console.log('🔍 DEBUG API KEYS për user:', userId);
        
        // Kontrollo të gjitha API keys për këtë user
        const apiKeys = await new Promise((resolve) => {
            db.all(
                'SELECT * FROM api_keys WHERE user_id = ?',
                [userId],
                (err, rows) => {
                    if (err) {
                        console.error('❌ Gabim në marrjen e API keys:', err);
                        resolve([]);
                    } else {
                        console.log('📊 API Keys të gjetur:', rows);
                        resolve(rows || []);
                    }
                }
            );
        });
        
        // Kontrollo specifikisht për Gemini
        const geminiKey = await new Promise((resolve) => {
            db.get(
                'SELECT * FROM api_keys WHERE user_id = ? AND service_name = ?',
                [userId, 'gemini'],
                (err, result) => {
                    if (err) {
                        console.error('❌ Gabim në marrjen e Gemini key:', err);
                        resolve(null);
                    } else {
                        console.log('🔑 Gemini Key:', result);
                        resolve(result);
                    }
                }
            );
        });
        
        res.json({
            success: true,
            userId: userId,
            allApiKeys: apiKeys,
            geminiKey: geminiKey,
            hasAnyKeys: apiKeys.length > 0,
            hasGeminiKey: !!geminiKey,
            count: apiKeys.length
        });
        
    } catch (error) {
        console.error('❌ Gabim në debug-apikeys:', error);
        res.status(500).json({
            success: false,
            message: 'Gabim në debug'
        });
    }
});

// ===================== ✅ ENDPOINT DEBUG PËR SESSION ==================
router.get('/debug-session', (req, res) => {
    const debugInfo = {
        success: true,
        timestamp: new Date().toISOString(),
        cookies_received: req.cookies,
        headers_cookie: req.headers.cookie,
        session_from_middleware: {
            userId: req.userId,
            sessionId: req.sessionId
        },
        middleware_exists: !!(req.userId && req.sessionId),
        has_chat_cookies: !!(req.cookies?.chatUserId && req.cookies?.chatSessionId)
    };
    
    console.log('🔍 DEBUG SESSION:', debugInfo);
    
    res.json(debugInfo);
});

// ✅ ENDPOINT DEBUG I DETAJUAR - Shto në routes/chat.js
router.get('/debug-database', (req, res) => {
    console.log('🔍 DEBUG DATABASE STRUCTURE');
    
    // Kontrollo strukturën e tabelës api_keys
    db.all("PRAGMA table_info(api_keys)", (err, columns) => {
        if (err) {
            console.error('❌ Gabim në marrjen e strukturës:', err);
            return res.json({ success: false, error: err.message });
        }
        
        console.log('📊 Struktura e api_keys:', columns);
        
        // Kontrollo të dhënat aktuale
        db.all("SELECT * FROM api_keys", (err, rows) => {
            if (err) {
                console.error('❌ Gabim në marrjen e të dhënave:', err);
                return res.json({ success: false, error: err.message });
            }
            
            console.log('📊 Të dhënat në api_keys:', rows);
            
            res.json({
                success: true,
                structure: columns,
                data: rows,
                count: rows.length
            });
        });
    });
});

module.exports = router;
