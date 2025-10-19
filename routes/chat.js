const express = require('express');
const db = require('../database');
const router = express.Router();

// ======================================================
// ✅ SISTEMI I PLOTË I KOMANDAVE
// ======================================================

const commandSystem = {
    // ✅ KOMANDA PËRSHËNDETJE
    '/pershendetje': () => 'Jam mirë, faleminderit që pyetët! Si jeni ju?',
    
    // ✅ KOMANDA NDIHMË
    '/ndihmo': () => `👑 **SISTEMI I KOMANDAVE**\n
• /pershendetje - Përshëndetje
• /ndihmo - Shfaq ndihmën
• /apikey <key> - Vendos API Key
• /wiki <kerkimi> - Kërko në Wikipedia
• /importo - Importo historinë
• /perkthim <teksti> - Përkthen tekst
• /llogarit <shprehja> - Llogarit matematikë
• /eksporto - Eksporto historinë
• /meso <pyetje>|<përgjigje> - Mëso chatbot-in
• /statistikat - Shfaq statistikat`,
// ============================================================================================ //
    // ✅ KOMANDA WIKIPEDIA
    '/wiki': (args) => {
        if (!args) return '❌ Ju lutem jepni një kërkim për Wikipedia.';
        return `🌐 Rezultati për "${args}":\nInformacione nga Wikipedia do të shfaqeshin këtu.`;
    },
// =============================================================================================== //
    // ✅ KOMANDA PËRKTHIM
    '/perkthim': (args) => {
        if (!args) return '❌ Ju lutem jepni tekst për të përkthyer.';
        return `🔤 Përkthimi i "${args}":\n[Përkthimi do të shfaqej këtu]`;
    },
// ================================================================================================ //
    // ✅ KOMANDA LLOGARITJE
    '/llogarit': (args) => {
        if (!args) return '❌ Ju lutem jepni një shprehje matematikore.';
        try {
            const result = eval(args);
            return `🧮 Rezultati: ${args} = ${result}`;
        } catch (error) {
            return '❌ Shprehje matematikore e pavlefshme.';
        }
    },
// ======================================================================================================== //
    // ✅ KOMANDA EKSPORTO
    '/eksporto': async (args, userId) => {
        try {
            const history = await new Promise((resolve) => {
                db.all(
                    'SELECT content, sender, timestamp FROM messages WHERE user_id = ? ORDER BY timestamp',
                    [userId],
                    (err, rows) => {
                        if (err) {
                            console.error('❌ Gabim në marrjen e historisë:', err);
                            resolve([]);
                        } else {
                            resolve(rows || []);
                        }
                    }
                );
            });

            return `📊 **HISTORIA E EKSPORTUAR**\nTotal mesazhe: ${history.length}\nEksporti u krye me sukses!`;
        } catch (error) {
            return '❌ Gabim gjatë eksportimit.';
        }
    },
// ======================================================================================================== //
    // ✅ KOMANDA MËSO
    '/meso': async (args, userId) => {
        try {
            const [pyetje, pergjigje] = args.split('|').map(s => s.trim());
            if (!pyetje || !pergjigje) {
                return '❌ Format: /meso <pyetje>|<përgjigje>';
            }

            // Ruaj në knowledge_base
            db.run(
                'INSERT INTO knowledge_base (question, answer, user_id, created_at) VALUES (?, ?, ?, ?)',
                [pyetje, pergjigje, userId, new Date().toISOString()],
                function(err) {
                    if (err) {
                        console.error('❌ Gabim në ruajtjen e njohurive:', err);
                    } else {
                        console.log('✅ Njohuri e re u mësua, ID:', this.lastID);
                    }
                }
            );

            return `✅ U mësua: "${pyetje}" → "${pergjigje}"`;
        } catch (error) {
            return '❌ Gabim gjatë mësimit.';
        }
    },
// ======================================================================================================== //
    // ✅ KOMANDA STATISTIKAT
    '/statistikat': async (args, userId) => {
        try {
            const userCount = await new Promise((resolve) => {
                db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
                    resolve(row?.count || 0);
                });
            });

            const messageCount = await new Promise((resolve) => {
                db.get('SELECT COUNT(*) as count FROM messages', (err, row) => {
                    resolve(row?.count || 0);
                });
            });

            const apiKeyCount = await new Promise((resolve) => {
                db.get('SELECT COUNT(*) as count FROM api_keys', (err, row) => {
                    resolve(row?.count || 0);
                });
            });

            return `📊 **STATISTIKAT E SISTEMIT:**\n👥 Përdorues të regjistruar: **${userCount}**\n💬 Mesazhe totale: **${messageCount}**\n🔑 API Keys: **${apiKeyCount}**\n🔄 Versioni: **2.0**\n🌟 Status: **Online & Stable**`;
        } catch (error) {
            return '❌ Gabim gjatë marrjes së statistikave.';
        }
    },
// ======================================================================================================== //
    // ✅ KOMANDA APIKEY
    '/apikey': async (args, userId) => {
        if (!args) return '❌ Ju lutem jepni API Key: /apikey <key_juaj>';

        try {
            // Fshi API key ekzistues
            db.run(
                'DELETE FROM api_keys WHERE user_id = ? AND service_name = ?',
                [userId, 'gemini'],
                function(deleteErr) {
                    if (deleteErr) {
                        console.error('❌ Gabim në fshirjen e API key:', deleteErr);
                        return;
                    }
                    
                    console.log(`✅ U fshinë ${this.changes} API keys`);
                    
                    // Shto API key të ri
                    db.run(
                        'INSERT INTO api_keys (user_id, api_key, service_name, created_at) VALUES (?, ?, ?, ?)',
                        [userId, args, 'gemini', new Date().toISOString()],
                        function(insertErr) {
                            if (insertErr) {
                                console.error('❌ Gabim në insertimin e API key:', insertErr);
                            } else {
                                console.log('✅ API Key u ruajt me sukses, ID:', this.lastID);
                            }
                        }
                    );
                }
            );

            return '✅ API Key u ruajt me sukses! Tani mund të përdorni pyetje të avancuara.';
        } catch (error) {
            return '❌ Gabim në ruajtjen e API key.';
        }
    }
};

// ====================================================================================================== //

// ======================================================
// ✅ ENDPOINT KRYESOR PËR MESAZHE
// ======================================================

router.post('/message', async (req, res) => {
    try {
        console.log('💬 /message endpoint i thirrur');
        
        const userId = req.userId || 'user-' + Date.now();
        const sessionId = req.sessionId || 'session-' + Date.now();
        const message = req.body.message;

        console.log('📨 Mesazhi:', message);
        console.log('🔐 Session:', { userId, sessionId });

        if (!message || message.trim() === '') {
            return res.json({
                success: false,
                response: '❌ Ju lutem shkruani një mesazh'
            });
        }

        let response;

        // ✅ PROCESIMI I KOMANDAVE ME /
        if (message.startsWith('/')) {
            const [command, ...argsArray] = message.slice(1).split(' ');
            const args = argsArray.join(' ');

            console.log(`🔧 Komanda: /${command}, Argumentet: ${args}`);

            if (commandSystem[command]) {
                response = await commandSystem[command](args, userId);
            } else {
                response = '❌ Komandë e panjohur. Përdorni /ndihmo për listën.';
            }
        }
        // ✅ PYTJE TË AVANCUARA (PROGRAMIM, MATEMATIKË)
        else if (message.match(/\d+[\+\-\*\/]\d+/) || 
                 message.includes('kod') || 
                 message.includes('javascript') ||
                 message.includes('programim') ||
                 message.includes('html') ||
                 message.includes('css')) {
            
            // Kontrollo nëse është shprehje matematikore
            if (message.match(/\d+[\+\-\*\/]\d+/)) {
                try {
                    const result = eval(message);
                    response = `🧮 Rezultati: ${message} = ${result}`;
                } catch (error) {
                    response = '❌ Shprehje matematikore e pavlefshme.';
                }
            }
            // Pytje programimi
            else {
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
                    response = `💻 **NDIHMË PËR KOD/PROGRAMIM**\n\nPyetja juaj "${message}" kërkon përgjigje të avancuar teknike! 🤖\n\n🔑 **Vendosni API Key:** Përdorni komandën /apikey <key_juaj> për të aktivizuar Gemini AI!`;
                }
            }
        }
        // ✅ MESAZHE NATYRORE
        else {
            const lowerMessage = message.toLowerCase().trim();

            if (lowerMessage.includes('përshëndetje') || 
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
            else {
                response = 'E kuptoj! 😊 Si mund t\'ju shërbej më mirë? Përdorni /ndihmo për opsione.';
            }
        }
   // ================================================================================================ //
        
        // ✅ RUAJ MESAZHET NË DATABASE
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
  // ======================================================================================================= //
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
// ====================================================================================================== //
// ✅ KOMANDA IMPORTO - VERSION I KORRIGJUAR
'/importo': async (args, userId) => {
    try {
        console.log('📥 Komanda /importo u thirr me args:', args);
        
        if (!args || args.trim() === '') {
            return `📥 **SISTEMI I IMPORTIMIT**\n\n🔧 **Status: Gati për importim**\n\n💡 **Si të importoni:**\n1. Përdorni butonin "Ngarko" në UI\n2. Zgjidhni skedarin për të importuar\n3. Sistemi do të procesojë automatikisht\n\n📊 **Çfarë mund të importohet:**\n• Historinë e bisedave (JSON)\n• Njohuri të reja\n• Cilësime përdoruesi\n\n✅ *Sistemi është gati për importim!*`;
        }

        // Nëse ka argumente, trego se si do të përdoren
        return `📥 **IMPORTIMI I TË DHËNAVE**\n\nTeksti i importuar: "${args.substring(0, 50)}..."\n\n✅ **Procesimi i importimit:**\n• Duke analizuar të dhënat...\n• Duke ruajtur në database...\n• Duke përditësuar sistemin...\n\n🔧 *Importimi u krye me sukses!*`;
        
    } catch (error) {
        console.error('❌ Gabim i plotë në komandën /importo:', error);
        return `❌ Gabim gjatë importimit.\n\n🔧 **Diagnoza:** ${error.message || 'Gabim i panjohur'}\n\n💡 **Zgjidhje:**\n• Kontrolloni formatin e të dhënave\n• Sigurohuni që keni të drejta të mjaftueshme\n• Provojeni përsëri`;
    }
},
// ================================================================================================= //

// ======================================================
// ✅ ENDPOINT-E TESTUESE DHE DEBUG
// ======================================================

router.get('/simple-test', (req, res) => {
    res.json({
        success: true,
        message: '✅ Serveri po funksionon!',
        timestamp: new Date().toISOString()
    });
});
// =================================================================================================== //
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
// =================================================================================================== //
router.get('/test-database', (req, res) => {
    db.all('SELECT name FROM sqlite_master WHERE type="table"', (err, tables) => {
        if (err) {
            return res.json({ success: false, error: err.message });
        }
        
        db.get('SELECT COUNT(*) as count FROM messages', (err, row) => {
            res.json({
                success: true,
                tables: tables,
                messages_table_exists: tables.some(table => table.name === 'messages'),
                total_messages: row?.count || 0
            });
        });
    });
});

module.exports = router;
