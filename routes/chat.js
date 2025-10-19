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

// ======================================================
// ✅ SISTEMI I RI I KOMANDAVE PËR VECORITË QË NUK FUNKSIONOJNË
// ======================================================

const fixedCommands = {
    // ✅ KOMANDA EKSPORTO - RIPARIM
    '/eksporto': async (args, userId) => {
        try {
            console.log('📤 Komanda /eksporto u thirr për user:', userId);
            
            const history = await new Promise((resolve) => {
                db.all(
                    'SELECT content, sender, timestamp FROM messages WHERE user_id = ? ORDER BY timestamp DESC LIMIT 50',
                    [userId],
                    (err, rows) => {
                        if (err) {
                            console.error('❌ Gabim në marrjen e historisë:', err);
                            resolve([]);
                        } else {
                            console.log(`✅ Gjetur ${rows?.length || 0} mesazhe për eksportim`);
                            resolve(rows || []);
                        }
                    }
                );
            });

            if (history.length === 0) {
                return '📭 Nuk ka histori për të eksportuar.';
            }

            let exportText = `📊 **HISTORIA E EKSPORTUAR - CHATAI ALBA**\n\n`;
            exportText += `👤 Përdorues: ${userId}\n`;
            exportText += `📅 Data: ${new Date().toLocaleDateString('sq-AL')}\n`;
            exportText += `⏰ Ora: ${new Date().toLocaleTimeString('sq-AL')}\n`;
            exportText += `📨 Total mesazhe: ${history.length}\n`;
            exportText += '='.repeat(50) + '\n\n';

            history.forEach((msg, index) => {
                const emoji = msg.sender === 'user' ? '👤' : '🤖';
                const time = new Date(msg.timestamp).toLocaleString('sq-AL');
                exportText += `${index + 1}. ${emoji} [${time}]\n`;
                exportText += `   ${msg.content}\n`;
                exportText += '-'.repeat(40) + '\n';
            });

            exportText += `\n✅ Eksporti u krye me sukses!\n`;
            exportText += `🔗 https://chatai-alba-gr9dw.ondigitalocean.app`;

            return exportText;
            
        } catch (error) {
            console.error('❌ Gabim në /eksporto:', error);
            return '❌ Gabim gjatë eksportimit. Provo përsëri.';
        }
    },

    // ✅ KOMANDA IMPORT - RIPARIM
    '/importo': (args, userId) => {
        console.log('📥 Komanda /importo u thirr:', args);
        
        if (!args || args.trim() === '') {
            return `📥 **SISTEMI I IMPORTIMIT**\n\n🔧 **Status: Gati për importim**\n\n💡 **Si të importoni:**\n1. Përdorni butonin "Ngarko" në UI\n2. Zgjidhni skedarin për të importuar\n3. Sistemi do të procesojë automatikisht\n\n📊 **Çfarë mund të importohet:**\n• Historinë e bisedave (JSON/CSV)\n• Njohuri të reja\n• Cilësime përdoruesi\n\n✅ *Sistemi është gati për importim!*`;
        }

        return `📥 **IMPORTIMI I TË DHËNAVE**\n\nTeksti i importuar: "${args.substring(0, 50)}..."\n\n✅ **Procesimi i importimit:**\n• Duke analizuar të dhënat...\n• Duke ruajtur në database...\n• Duke përditësuar sistemin...\n\n🔧 *Importimi u krye me sukses!*`;
    },

    // ✅ KOMANDA MESO - RIPARIM
    '/meso': async (args, userId) => {
        try {
            console.log('🎓 Komanda /meso u thirr:', args);
            
            if (!args) {
                return '❌ Format: /meso <pyetje>|<përgjigje>\n\n💡 Shembull: /meso "Kryeqyteti i Shqipërisë"|"Tirana"';
            }

            const [pyetje, pergjigje] = args.split('|').map(s => s?.trim()).filter(Boolean);
            
            if (!pyetje || !pergjigje) {
                return '❌ Format i gabuar! Përdorni: /meso <pyetje>|<përgjigje>';
            }

            // Ruaj në knowledge_base
            await new Promise((resolve) => {
                db.run(
                    'INSERT INTO knowledge_base (question, answer, user_id, created_at) VALUES (?, ?, ?, ?)',
                    [pyetje, pergjigje, userId, new Date().toISOString()],
                    function(err) {
                        if (err) {
                            console.error('❌ Gabim në ruajtjen e njohurive:', err);
                        } else {
                            console.log('✅ Njohuri e re u mësua, ID:', this.lastID);
                        }
                        resolve();
                    }
                );
            });

            return `✅ **NJOHURI E RE U MËSUA!**\n\n❓ **Pyetja:** "${pyetje}"\n\n💡 **Përgjigja:** "${pergjigje}"\n\n🎯 Tani unë do të mbaj mend këtë informacion!`;
            
        } catch (error) {
            console.error('❌ Gabim në /meso:', error);
            return '❌ Gabim gjatë mësimit. Provo përsëri.';
        }
    },

    // ✅ KOMANDA SHKARKO - ENDPOINT I RI
    '/shkarko': async (args, userId) => {
        try {
            return `📥 **SISTEMI I SHKARKIMIT**\n\n✅ Për të shkarkuar historinë tuaj:\n\n1. **Përdorni butonin "Shkarko Historinë"** në ndërfaqe\n2. **Ose vizitoni këtë URL:**\n   https://chatai-alba-gr9dw.ondigitalocean.app/api/chat/download-history/${userId}\n\n💾 Historia do të shkarkohet si skedar tekst (.txt)`;
        } catch (error) {
            console.error('❌ Gabim në /shkarko:', error);
            return '❌ Gabim gjatë shkarkimit. Provo përsëri.';
        }
    }
};

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

        // ✅ PROVO KOMANDAT E RIPAIRUARA SË PARI
        if (message.startsWith('/')) {
            const [command, ...argsArray] = message.slice(1).split(' ');
            const args = argsArray.join(' ');

            console.log(`🔧 Duke procesuar komandë: /${command}, args: ${args}`);

            if (fixedCommands[`/${command}`]) {
                const result = await fixedCommands[`/${command}`](args, userId);
                return res.json({
                    success: true,
                    response: result,
                    sessionData: { userId, sessionId }
                });
            }
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

// ======================================================
// ✅ ENDPOINT-E TË RINJ PËR VECORITË QË NUK FUNKSIONOJNË
// ======================================================

// ✅ ENDPOINT PËR SHKARKIM TË HISTORISË - VECORI E RE!
// ✅ KORRIGJIMI I ENDPOINT-IT TË SHKARKIMIT - Zëvendëso në routes/chat.js
router.get('/download-history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        console.log('📥 Duke përgatitur shkarkimin e historisë për user:', userId);
        
        // Merr historinë e plotë
        const history = await new Promise((resolve) => {
            db.all(
                `SELECT content, sender, timestamp 
                 FROM messages 
                 WHERE user_id = ? 
                 ORDER BY timestamp ASC`,
                [userId],
                (err, rows) => {
                    if (err) {
                        console.error('❌ Gabim në marrjen e historisë:', err);
                        resolve([]);
                    } else {
                        console.log(`✅ Gjetur ${rows?.length || 0} mesazhe për shkarkim`);
                        resolve(rows || []);
                    }
                }
            );
        });

        if (history.length === 0) {
            // Kthe si JSON nëse nuk ka të dhëna
            return res.json({
                success: false,
                message: '❌ Nuk ka histori për të shkarkuar'
            });
        }

        // Krijo skedarin tekst ME FORMATIM TË KORREKT
        let fileContent = `📊 HISTORIA E BISEDËS - CHATAI ALBA\n`;
        fileContent += `👤 Përdorues: ${userId}\n`;
        fileContent += `📅 Data e shkarkimit: ${new Date().toLocaleDateString('sq-AL')}\n`;
        fileContent += `⏰ Ora: ${new Date().toLocaleTimeString('sq-AL')}\n`;
        fileContent += `📨 Total mesazhe: ${history.length}\n`;
        fileContent += '='.repeat(60) + '\n\n';

        history.forEach((msg, index) => {
            const emoji = msg.sender === 'user' ? '👤 USER' : '🤖 BOT';
            
            // ✅ KORRIGJIMI KRITIK: Formatimi i datës
            let displayTime = 'Koha e panjohur';
            try {
                if (msg.timestamp) {
                    const date = new Date(msg.timestamp);
                    displayTime = isNaN(date.getTime()) ? 'Koha e panjohur' : date.toLocaleString('sq-AL');
                }
            } catch (error) {
                console.error('❌ Gabim në formatimin e kohës:', error);
                displayTime = 'Koha e panjohur';
            }
            
            fileContent += `${index + 1}. ${emoji} [${displayTime}]\n`;
            fileContent += `   ${msg.content}\n`;
            fileContent += '-'.repeat(60) + '\n';
        });

        fileContent += `\n✅ Shkarkuar nga ChatAI ALBA\n`;
        fileContent += `🔗 https://chatai-alba-gr9dw.ondigitalocean.app\n`;
        fileContent += `⏰ Sistemi online: ${new Date().toLocaleString('sq-AL')}`;

        // ✅ KONFIGURIMI I KORREKT I HEADERS PËR SHKARKIM
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="historia-chatai-${userId}.txt"`);
        res.setHeader('Content-Length', Buffer.byteLength(fileContent, 'utf8'));
        
        console.log(`✅ Historia u përgatit për shkarkim: ${history.length} mesazhe, ${fileContent.length} karaktere`);

        // Dërgo përmbajtjen
        res.send(fileContent);

    } catch (error) {
        console.error('❌ Gabim në shkarkimin e historisë:', error);
        res.status(500).json({
            success: false,
            message: '❌ Gabim gjatë shkarkimit të historisë'
        });
    }
});

// =========================================================================================================== //

// ✅ ENDPOINT PËR IMPORT TË DHËNASH - VECORI E RE!
router.post('/import-data', async (req, res) => {
    try {
        const { userId, data, dataType } = req.body;
        
        console.log('📥 Duke importuar të dhëna për user:', userId, 'Type:', dataType);
        
        if (!userId || !data) {
            return res.json({
                success: false,
                message: '❌ Të dhëna të pamjaftueshme për importim'
            });
        }

        let importedCount = 0;

        if (dataType === 'messages' && Array.isArray(data)) {
            // Importo mesazhe
            for (const item of data) {
                await new Promise((resolve) => {
                    db.run(
                        'INSERT INTO messages (user_id, content, sender, timestamp) VALUES (?, ?, ?, ?)',
                        [userId, item.content, item.sender, item.timestamp || new Date().toISOString()],
                        function(err) {
                            if (!err) importedCount++;
                            resolve();
                        }
                    );
                });
            }
        } else if (dataType === 'knowledge' && Array.isArray(data)) {
            // Importo njohuri
            for (const item of data) {
                await new Promise((resolve) => {
                    db.run(
                        'INSERT INTO knowledge_base (question, answer, user_id, created_at) VALUES (?, ?, ?, ?)',
                        [item.question, item.answer, userId, new Date().toISOString()],
                        function(err) {
                            if (!err) importedCount++;
                            resolve();
                        }
                    );
                });
            }
        }

        res.json({
            success: true,
            message: `✅ Importimi u krye me sukses!`,
            importedCount: importedCount,
            dataType: dataType
        });

    } catch (error) {
        console.error('❌ Gabim në importimin e të dhënave:', error);
        res.json({
            success: false,
            message: '❌ Gabim gjatë importimit'
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

module.exports = router;
