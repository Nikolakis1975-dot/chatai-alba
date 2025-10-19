// routes/chat.js - VERSION I RI I THJESHTË DHE STABIL
const express = require('express');
const db = require('../database');
const router = express.Router();

// ======================================================
// ✅ ENDPOINT-I BAZË PËR CHAT - VERSION I THJESHTË
// ======================================================

// ✅ ======================== KORRIGJIMI I SHPEJTË I routes ==========================================
router.post('/message', async (req, res) => {
    try {
        console.log('💬 /message endpoint i thirrur');
        
        const userId = req.userId || 'user-' + Date.now();
        const sessionId = req.sessionId || 'session-' + Date.now();
        const message = req.body.message;

        console.log('📨 Mesazhi:', message);

        if (!message || message.trim() === '') {
            return res.json({
                success: false,
                response: '❌ Ju lutem shkruani një mesazh'
            });
        }

        // ✅ SHQYRTIM I THJESHTË I MESAZHEVE - PA NLU KOMPLEKS
        let response;
        const lowerMessage = message.toLowerCase().trim();

        // ✅ KOMANDAT ME /
        if (lowerMessage.startsWith('/')) {
            if (lowerMessage.includes('pershendetje') || lowerMessage.includes('përshëndetje')) {
                response = 'Jam mirë, faleminderit që pyetët! Si jeni ju?';
            }
            else if (lowerMessage.includes('ndihme') || lowerMessage.includes('ndihmë')) {
                response = '👑 **SISTEMI I KOMANDAVE**\n• /pershendetje - Përshëndetje\n• /ndihme - Shfaq ndihmën\n• /apikey <key> - Vendos API Key';
            }
            else {
                response = '❌ Komandë e panjohur. Përdorni /ndihme për lista.';
            }
        }
        // ✅ MESAZHE NATYRORE - PA NLU
        else if (lowerMessage.includes('përshëndetje') || 
                lowerMessage.includes('pershendetje') ||
                lowerMessage.includes('hello') || 
                lowerMessage.includes('tung') ||
                lowerMessage.includes('si jeni') ||
                lowerMessage.includes('si je') ||
                lowerMessage.includes('si kaloni')) {
            response = 'Përshëndetje! 😊 Mirë se ju gjetëm! Si mund t\'ju ndihmoj sot?';
        }
        else if (lowerMessage.includes('faleminderit') || 
                 lowerMessage.includes('rrofsh') || 
                 lowerMessage.includes('thanks')) {
            response = 'S\'ka përse! 😊 Gjithmonë i lumtur të ndihmoj!';
        }
        else if (lowerMessage.includes('ndihmë') || 
                 lowerMessage.includes('help') || 
                 lowerMessage.includes('asistenc')) {
            response = 'Sigurisht! 😊 Çfarë lloj ndihme keni nevojë?';
        }
        // ✅ PYTJE TË AVANCUARA
        else if (lowerMessage.includes('kod') || 
                 lowerMessage.includes('code') || 
                 lowerMessage.includes('programim') ||
                 lowerMessage.includes('javascript') || 
                 lowerMessage.includes('html') ||
                 lowerMessage.includes('python') || 
                 lowerMessage.includes('java')) {
            
            // Kontrollo API Key
            const hasApiKey = await new Promise((resolve) => {
                db.get(
                    'SELECT api_key FROM api_keys WHERE user_id = ? AND service_name = ?',
                    [userId, 'gemini'],
                    (err, result) => {
                        if (err) {
                            console.error('❌ Gabim në kontrollimin e API key:', err);
                            resolve(false);
                        } else {
                            console.log('🔑 API Key status:', !!result);
                            resolve(!!result);
                        }
                    }
                );
            });

            if (hasApiKey) {
                response = '💻 **PO PROCESOJ KËRKESËN TUAJ...**\n\nPyetja juaj kërkon përgjigje të specializuar. Duke kontaktuar Gemini AI...';
            } else {
                response = '💻 **NDIHMË PËR KOD/PROGRAMIM**\n\nPyetja juaj kërkon përgjigje të avancuar teknike! 🤖\n\n🔑 **Vendosni API Key:** Përdorni komandën /apikey <key_juaj> për të aktivizuar Gemini AI!\n\n📚 **Alternative:** Përdorni /ndihme për opsione të tjera.';
            }
        }
        // ✅ PËRGJIGJE E PËRGJITHSHME
        else {
            response = 'E kuptoj! 😊 Si mund t\'ju shërbej më mirë? Përdorni /ndihme për opsione.';
        }

        // ✅ RUAJ MESAZHET
        db.run(
            'INSERT INTO messages (user_id, content, sender, timestamp) VALUES (?, ?, ?, ?)',
            [userId, message, 'user', new Date().toISOString()],
            function(err) {
                if (err) console.error('❌ Gabim në ruajtjen e mesazhit user:', err);
                else console.log('✅ Mesazhi i userit u ruajt');
            }
        );

        db.run(
            'INSERT INTO messages (user_id, content, sender, timestamp) VALUES (?, ?, ?, ?)',
            [userId, response, 'bot', new Date().toISOString()],
            function(err) {
                if (err) console.error('❌ Gabim në ruajtjen e përgjigjes:', err);
                else console.log('✅ Përgjigja u ruajt');
            }
        );

        console.log('✅ Duke kthyer përgjigjen:', response.substring(0, 50));
        
        res.json({
            success: true,
            response: response,
            sessionData: { userId, sessionId }
        });

    } catch (error) {
        console.error('❌ Gabim i përgjithshëm në /message:', error);
        res.json({
            success: false,
            response: '❌ Gabim në server. Provo përsëri.',
            sessionData: {
                userId: req.userId || 'user-' + Date.now(),
                sessionId: req.sessionId || 'session-' + Date.now()
            }
        });
    }
});

// ======================= ✅  endpoint routes API KEY  =====================
// ✅ Shto këtë në routes/chat.js - KOMANDA APIKEY
router.post('/apikey-command', async (req, res) => {
    try {
        const { userId, apiKey } = req.body;
        
        if (!userId || !apiKey) {
            return res.json({ 
                success: false, 
                message: 'userId dhe apiKey janë të detyrueshme' 
            });
        }

        console.log('🔑 Duke ruajtur API Key për user:', userId);
        
        const result = await new Promise((resolve) => {
            // Fshi të vjetrat
            db.run(
                'DELETE FROM api_keys WHERE user_id = ? AND service_name = ?',
                [userId, 'gemini'],
                function(deleteErr) {
                    if (deleteErr) {
                        console.error('❌ Gabim në fshirje:', deleteErr);
                        resolve({ success: false, error: deleteErr.message });
                        return;
                    }
                    
                    console.log(`✅ U fshinë ${this.changes} API keys`);
                    
                    // Shto të ren
                    db.run(
                        'INSERT INTO api_keys (user_id, api_key, service_name, created_at) VALUES (?, ?, ?, ?)',
                        [userId, apiKey, 'gemini', new Date().toISOString()],
                        function(insertErr) {
                            if (insertErr) {
                                console.error('❌ Gabim në insertim:', insertErr);
                                resolve({ success: false, error: insertErr.message });
                            } else {
                                console.log('✅ API Key u ruajt, ID:', this.lastID);
                                resolve({ success: true, lastID: this.lastID });
                            }
                        }
                    );
                }
            );
        });

        if (result.success) {
            res.json({ 
                success: true, 
                message: '✅ API Key u ruajt me sukses! Tani mund të përdorni Gemini AI.'
            });
        } else {
            res.json({ 
                success: false, 
                message: '❌ Gabim në ruajtje: ' + result.error 
            });
        }
        
    } catch (error) {
        console.error('❌ Gabim në apikey-command:', error);
        res.json({ 
            success: false, 
            message: 'Gabim i përgjithshëm: ' + error.message 
        });
    }
});

        // ✅ RUAJ PËRGJIGJEN NË DATABASE
        db.run(
            'INSERT INTO messages (user_id, content, sender, timestamp) VALUES (?, ?, ?, ?)',
            [userId, response, 'bot', new Date().toISOString()],
            function(err) {
                if (err) {
                    console.error('❌ Gabim në ruajtjen e përgjigjes:', err);
                } else {
                    console.log('✅ Përgjigja u ruajt, ID:', this.lastID);
                }
            }
        );

        console.log('✅ Duke kthyer përgjigjen:', response.substring(0, 50));
        
        // ✅ KTHE PËRGJIGJEN
        res.json({
            success: true,
            response: response,
            sessionData: {
                userId: userId,
                sessionId: sessionId
            }
        });

    } catch (error) {
        console.error('❌ Gabim i përgjithshëm në /message:', error);
        res.json({
            success: false,
            response: '❌ Gabim në server. Provo përsëri.',
            sessionData: {
                userId: req.userId || 'user-' + Date.now(),
                sessionId: req.sessionId || 'session-' + Date.now()
            }
        });
    }
});

// ======================================================
// ✅ ENDPOINT-E TESTUESE DHE DEBUG
// ======================================================

// ✅ TEST I THJESHTË
router.get('/simple-test', (req, res) => {
    console.log('🧪 Simple Test i thirrur');
    res.json({
        success: true,
        message: '✅ Serveri po funksionon!',
        timestamp: new Date().toISOString()
    });
});

// ✅ DEBUG SESIONI
router.get('/debug-session', (req, res) => {
    const debugInfo = {
        success: true,
        timestamp: new Date().toISOString(),
        cookies_received: req.cookies,
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

// ✅ TEST DATABASE
router.get('/test-database', (req, res) => {
    console.log('🗄️ Test Database i thirrur');
    
    db.all('SELECT name FROM sqlite_master WHERE type="table"', (err, tables) => {
        if (err) {
            console.error('❌ Gabim në marrjen e tabelave:', err);
            return res.json({ success: false, error: err.message });
        }
        
        // Kontrollo numrin e mesazheve
        db.get('SELECT COUNT(*) as count FROM messages', (err, row) => {
            if (err) {
                console.error('❌ Gabim në numërimin e mesazheve:', err);
            } else {
                console.log(`📨 Total mesazhe: ${row.count}`);
            }
            
            res.json({
                success: true,
                tables: tables,
                messages_table_exists: tables.some(table => table.name === 'messages'),
                total_messages: row?.count || 0
            });
        });
    });
});

// ✅ PRODUCTION DEBUG
router.get('/production-debug', (req, res) => {
    res.json({
        success: true,
        environment: process.env.NODE_ENV,
        sessionData: {
            userId: req.userId,
            sessionId: req.sessionId
        },
        cookies: req.cookies,
        timestamp: new Date().toISOString(),
        message: '✅ Production debug endpoint po funksionon!'
    });
});

// ✅ INICIALIZIM I SESIONIT
router.get('/init-session', (req, res) => {
    const sessionData = {
        userId: req.userId || 'user-' + Date.now(),
        sessionId: req.sessionId || 'session-' + Date.now()
    };
    
    console.log('🎯 Session init:', sessionData);
    
    res.json({
        success: true,
        message: 'Session initialized successfully',
        sessionData: sessionData
    });
});

// ======================================================
// ✅ HISTORI DHE MENAXHIM I DHËNAVE
// ======================================================

// ✅ MERRE HISTORINË
router.get('/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        console.log('📊 Duke marrë historinë për user:', userId);
        
        const history = await new Promise((resolve) => {
            db.all(
                'SELECT content, sender, timestamp FROM messages WHERE user_id = ? ORDER BY timestamp DESC LIMIT 20',
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

// ✅ FSHI HISTORINË
router.delete('/clear-history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        console.log('🧹 Duke fshirë historinë për user:', userId);
        
        const result = await new Promise((resolve) => {
            db.run(
                'DELETE FROM messages WHERE user_id = ?',
                [userId],
                function(err) {
                    if (err) {
                        console.error('❌ Gabim në fshirjen e historisë:', err);
                        resolve({ success: false, error: err.message });
                    } else {
                        console.log(`✅ U fshinë ${this.changes} mesazhe`);
                        resolve({ success: true, deletedCount: this.changes });
                    }
                }
            );
        });
        
        res.json({
            success: true,
            message: `Historia u fshi me sukses`,
            deletedCount: result.deletedCount
        });
        
    } catch (error) {
        console.error('❌ Gabim në fshirjen e historisë:', error);
        res.status(500).json({
            success: false,
            message: 'Gabim në fshirjen e historisë'
        });
    }
});

module.exports = router;
