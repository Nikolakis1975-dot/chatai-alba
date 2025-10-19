// routes/chat.js - VERSION I THJESHTË DHE I PAKORRIPT
const express = require('express');
const db = require('../database');
const router = express.Router();

// ======================================================
// ✅ ENDPOINT-I BAZË - SHUMË I THJESHTË
// ======================================================

// ✅ TEST ENDPOINT
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: '✅ Serveri po funksionon!',
        timestamp: new Date().toISOString()
    });
});

// ✅ DEBUG SESSION
router.get('/debug-session', (req, res) => {
    res.json({
        success: true,
        sessionData: {
            userId: req.userId,
            sessionId: req.sessionId
        },
        cookies: req.cookies,
        timestamp: new Date().toISOString()
    });
});
// =================================================================================================== //
// ✅ CHAT MESSAGE - VERSION I THJESHTË
router.post('/message', (req, res) => {
    try {
        console.log('💬 /message i thirrur');
        
        const message = req.body.message;
        console.log('📨 Mesazhi:', message);

        if (!message) {
            return res.json({
                success: false,
                response: '❌ Ju lutem shkruani një mesazh'
            });
        }

        // Përgjigje e thjeshtë
        let response = 'Përshëndetje! 😊 Mirë se ju gjetëm!';
        
        if (message.toLowerCase().includes('si jeni')) {
            response = 'Jam shumë mirë, faleminderit! Si jeni ju?';
        }
        else if (message.toLowerCase().includes('faleminderit')) {
            response = 'S\'ka përse! 😊';
        }

        res.json({
            success: true,
            response: response,
            sessionData: {
                userId: req.userId || 'user-' + Date.now(),
                sessionId: req.sessionId || 'session-' + Date.now()
            }
        });

    } catch (error) {
        console.error('❌ Gabim në /message:', error);
        res.json({
            success: false,
            response: '❌ Gabim në server'
        });
    }
});
// ===================================================================================== //
// ✅ KORRIGJIMI I /message ENDPOINT - Shto në routes/chat.js
router.post('/message', (req, res) => {
    try {
        console.log('💬 /message i thirrur');
        
        const message = req.body.message;
        const userId = req.userId || 'user-' + Date.now();
        const sessionId = req.sessionId || 'session-' + Date.now();

        console.log('📨 Mesazhi:', message);

        if (!message) {
            return res.json({
                success: false,
                response: '❌ Ju lutem shkruani një mesazh'
            });
        }

        const lowerMessage = message.toLowerCase();
        let response;

        // ✅ KOMANDAT ME /
        if (lowerMessage.startsWith('/')) {
            if (lowerMessage.includes('wiki')) {
                response = '🌐 Wikipedia kërkimi aktiv...';
            }
            else if (lowerMessage.includes('moti')) {
                response = '🌍 Shërbimi i motit aktiv...';
            }
            else if (lowerMessage.includes('perkthim')) {
                response = '🔄 Shërbimi i përkthimit aktiv...';
            }
            else if (lowerMessage.includes('ndihmo')) {
                response = '👑 **SISTEMI I KOMANDAVE**\n\n📋 **KOMANDAT BAZË:**\n• /wiki [temë] - Kërko Wikipedia\n• /moti [qytet] - Informacion moti\n• /perkthim [tekst] - Përkthim anglisht/shqip\n• /ndihmo - Shfaq këtë listë\n\n💻 **PYETJE TË AVANCUARA:**\nPër pyetje teknike, vendosni API Key me /apikey';
            }
            else if (lowerMessage.includes('eksporto')) {
                response = '📥 Eksportimi i historisë...';
            }
            else if (lowerMessage.includes('importo')) {
                response = '📤 Importimi i të dhënave...';
            }
            else {
                response = '❌ Komandë e panjohur. Përdorni /ndihmo';
            }
        }
        // ✅ PYTJE TË AVANCUARA TEKNOLOGJIKE
        else if (lowerMessage.includes('kod') || 
                 lowerMessage.includes('code') || 
                 lowerMessage.includes('programim') ||
                 lowerMessage.includes('teknologji') || 
                 lowerMessage.includes('html') ||
                 lowerMessage.includes('javascript') || 
                 lowerMessage.includes('python') ||
                 lowerMessage.includes('chatbot')) {
            
            response = '💻 **NDIHMË PËR TEKNOLOGJI**\n\nPyetja juaj kërkon përgjigje të specializuar teknike! 🤖\n\n🔑 **Vendosni API Key:** Përdorni komandën /apikey <key_juaj> për të aktivizuar asistencën e avancuar AI!\n\n📚 **Alternative:** Përdorni komandat /wiki ose /google për kërkime.';
        }
        // ✅ LLIGJITJE MATEMATIKORE
        else if (/\d+[\+\-\*\/\^]\d+/.test(message)) {
            try {
                // Llogaritje e thjeshtë
                const result = eval(message.replace(/[^\d\+\-\*\/\(\)\.]/g, ''));
                response = `🧮 **REZULTATI:** ${message} = ${result}`;
            } catch (mathError) {
                response = '❌ Shprehja matematikore nuk është valide.';
            }
        }
        // ✅ PËRSHËNDETJE BAZË
        else if (lowerMessage.includes('përshëndetje') || 
                lowerMessage.includes('pershendetje') ||
                lowerMessage.includes('hello') || 
                lowerMessage.includes('si jeni') ||
                lowerMessage.includes('si je') ||
                lowerMessage.includes('si kaloni')) {
            response = 'Përshëndetje! 😊 Mirë se ju gjetëm! Si mund t\'ju ndihmoj sot?';
        }
        else if (lowerMessage.includes('faleminderit')) {
            response = 'S\'ka përse! 😊 Gjithmonë i lumtur të ndihmoj!';
        }
        // ✅ PËRGJIGJE E PËRGJITHSHME
        else {
            response = 'E kuptoj! 😊 Si mund t\'ju shërbej më mirë? Përdorni /ndihmo për opsione.';
        }

        // ✅ RUAJ NË DATABASE
        db.run(
            'INSERT INTO messages (user_id, content, sender, timestamp) VALUES (?, ?, ?, ?)',
            [userId, message, 'user', new Date().toISOString()],
            function(err) {
                if (err) console.error('❌ Gabim në ruajtjen e mesazhit user:', err);
            }
        );

        db.run(
            'INSERT INTO messages (user_id, content, sender, timestamp) VALUES (?, ?, ?, ?)',
            [userId, response, 'bot', new Date().toISOString()],
            function(err) {
                if (err) console.error('❌ Gabim në ruajtjen e përgjigjes:', err);
            }
        );

        res.json({
            success: true,
            response: response,
            sessionData: { userId, sessionId }
        });

    } catch (error) {
        console.error('❌ Gabim në /message:', error);
        res.json({
            success: false,
            response: '❌ Gabim në server. Provo përsëri.'
        });
    }
});

// ============================================================================================== //
// ✅ Shto këtë në routes/chat.js - KOMANDA APIKEY
router.post('/apikey', (req, res) => {
    try {
        const { userId, apiKey } = req.body;
        
        if (!userId || !apiKey) {
            return res.json({ 
                success: false, 
                message: 'userId dhe apiKey janë të detyrueshme' 
            });
        }

        console.log('🔑 Duke ruajtur API Key për user:', userId);
        
        // Fshi të vjetrat dhe shto të ren
        db.run(
            'DELETE FROM api_keys WHERE user_id = ? AND service_name = ?',
            [userId, 'gemini'],
            function(deleteErr) {
                if (deleteErr) {
                    console.error('❌ Gabim në fshirje:', deleteErr);
                    return res.json({ success: false, error: deleteErr.message });
                }
                
                db.run(
                    'INSERT INTO api_keys (user_id, api_key, service_name, created_at) VALUES (?, ?, ?, ?)',
                    [userId, apiKey, 'gemini', new Date().toISOString()],
                    function(insertErr) {
                        if (insertErr) {
                            console.error('❌ Gabim në insertim:', insertErr);
                            res.json({ success: false, error: insertErr.message });
                        } else {
                            console.log('✅ API Key u ruajt, ID:', this.lastID);
                            res.json({ 
                                success: true, 
                                message: '✅ API Key u ruajt me sukses! Tani mund të përdorni pyetje të avancuara.' 
                            });
                        }
                    }
                );
            }
        );
        
    } catch (error) {
        console.error('❌ Gabim në /apikey:', error);
        res.json({ 
            success: false, 
            message: 'Gabim: ' + error.message 
        });
    }
});

// =========================================================================================== //

// ✅ TEST DATABASE
router.get('/test-database', (req, res) => {
    db.all('SELECT name FROM sqlite_master WHERE type="table"', (err, tables) => {
        if (err) {
            return res.json({ success: false, error: err.message });
        }
        
        res.json({
            success: true,
            tables: tables,
            count: tables.length
        });
    });
});

module.exports = router;
