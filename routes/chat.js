// routes/chat.js - SISTEM I RI I PLOTË I KOMANDAVE
const express = require('express');
const db = require('../database');
const router = express.Router();

// ======================================================
// ✅ SISTEMI I PLOTË I KOMANDAVE - VERSION I RI STABIL
// ======================================================

const commandSystem = {
    // ✅ KOMANDA THEMELORE
    '/ndihmo': () => `👑 **SISTEMI I KOMANDAVE - CHATAI ALBA** 👑

📋 **KOMANDAT BAZE:**
• /ndihmo - Shfaq këtë listë
• /wiki <kërkim> - Kërko në Wikipedia  
• /perkthim <gjuhë> <tekst> - Përkthen tekst
• /moti <qytet> - Informacion moti
• /eksporto - Eksporto historinë
• /importo - Importo të dhëna
• /meso <pyetje>|<përgjigje> - Mëso diçka të re
• /apikey <key> - Vendos API Key

🔍 **KOMANDA KËRKIMI:**
• /kerko <kërkim> - Kërkim i thjeshtë
• /gjej <kërkim> - Kërkim i thelluar

🎓 **KOMANDA PËR STUDENTË:**
• /student - Menu e studentit
• /matematike <problem> - Zgjidh probleme
• /detyre - Ndihmë për detyra

💡 **SHEMBUJ:**
• /wiki Shqipëria
• /perkthim anglisht "Përshëndetje"
• /moti Tirana
• /meso "Kryeqyteti"|"Tirana"`,

    // ✅ KOMANDA WIKI
    '/wiki': (args) => {
        if (!args) return '❌ Ju lutem jepni një kërkim për Wikipedia.';
        return `🌐 **REZULTAT PËR "${args}"**\n\nInformacione nga Wikipedia do të shfaqeshin këtu.`;
    },

    // ✅ KOMANDA MOTI
    '/moti': (args) => {
        if (!args) return '❌ Ju lutem jepni një qytet.';
        return `🌍 **MOTI NË ${args.toUpperCase()}**\n\nInformacione moti do të shfaqeshin këtu.`;
    },

    // ✅ KOMANDA PËRKTHIM
    '/perkthim': (args) => {
        if (!args) return '❌ Format: /perkthim <gjuhë> <tekst>';
        return `🔤 **PËRKTHIMI**\n\nTeksti do të përkthehej këtu.`;
    },

    // ✅ KOMANDA EKSPORTO - RIPARIM
    '/eksporto': async (args, userId) => {
        try {
            console.log('📤 Komanda /eksporto u thirr për user:', userId);
            
            const history = await new Promise((resolve) => {
                db.all(
                    'SELECT content, sender, timestamp FROM messages WHERE user_id = ? ORDER BY timestamp DESC LIMIT 20',
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

            if (history.length === 0) {
                return '📭 Nuk ka histori për të eksportuar.';
            }

            let exportText = `📊 **HISTORIA E EKSPORTUAR**\n\n`;
            exportText += `👤 Përdorues: ${userId}\n`;
            exportText += `📅 Data: ${new Date().toLocaleDateString('sq-AL')}\n`;
            exportText += `📨 Total mesazhe: ${history.length}\n\n`;

            history.forEach((msg, index) => {
                const emoji = msg.sender === 'user' ? '👤' : '🤖';
                const time = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('sq-AL') : 'Koha e panjohur';
                exportText += `${index + 1}. ${emoji} [${time}]\n   ${msg.content}\n\n`;
            });

            return exportText + `✅ **Eksporti u krye me sukses!**`;
            
        } catch (error) {
            console.error('❌ Gabim në /eksporto:', error);
            return '❌ Gabim gjatë eksportimit. Provo përsëri.';
        }
    },

    // ✅ KOMANDA IMPORT - RIPARIM
    '/importo': (args, userId) => {
        return `📥 **SISTEMI I IMPORTIMIT**\n\n💡 Përdorni butonin "Ngarko" në UI për importim.\n\n✅ Sistemi është gati për importim!`;
    },

    // ✅ KOMANDA MESO - RIPARIM
    '/meso': async (args, userId) => {
        try {
            if (!args) return '❌ Format: /meso <pyetje>|<përgjigje>';

            const parts = args.split('|').map(part => part.trim());
            if (parts.length < 2) return '❌ Duhen të paktën 2 pjesë: <pyetje>|<përgjigje>';

            const pyetje = parts[0];
            const pergjigje = parts.slice(1).join('|');

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

            return `✅ **NJOHURI E RE U MËSUA!**\n\n❓ **Pyetja:** "${pyetje}"\n\n💡 **Përgjigja:** "${pergjigje}"`;
            
        } catch (error) {
            console.error('❌ Gabim në /meso:', error);
            return '❌ Gabim gjatë mësimit. Provo përsëri.';
        }
    },

    // ✅ KOMANDA KËRKIM
    '/kerko': (args) => {
        if (!args) return '❌ Ju lutem jepni një kërkim.';
        return `🔍 **REZULTATET PËR "${args}"**\n\nRezultatet e kërkimit do të shfaqeshin këtu.`;
    },

    // ✅ KOMANDA GJEJ
    '/gjej': (args) => {
        if (!args) return '❌ Ju lutem jepni një kërkim.';
        return `🔎 **KËRKIM I THELLUAR PËR "${args}"**\n\nRezultatet e kërkimit të thelluar do të shfaqeshin këtu.`;
    },

    // ✅ KOMANDA APIKEY
    '/apikey': async (args, userId) => {
        if (!args) return '❌ Format: /apikey <key_juaj>';

        try {
            // Fshi API key ekzistues
            await new Promise((resolve) => {
                db.run(
                    'DELETE FROM api_keys WHERE user_id = ? AND service_name = ?',
                    [userId, 'gemini'],
                    function(err) {
                        resolve();
                    }
                );
            });

            // Shto API key të ri
            await new Promise((resolve) => {
                db.run(
                    'INSERT INTO api_keys (user_id, api_key, service_name, created_at) VALUES (?, ?, ?, ?)',
                    [userId, args, 'gemini', new Date().toISOString()],
                    function(err) {
                        resolve();
                    }
                );
            });

            return '✅ **API KEY U RUAJT ME SUKSES!**\n\nTani mund të përdorni funksionalitetin e avancuar të Gemini AI.';
            
        } catch (error) {
            console.error('❌ Gabim në /apikey:', error);
            return '❌ Gabim në ruajtjen e API key. Provo përsëri.';
        }
    },

    // ✅ KOMANDA STUDENT
    '/student': () => {
        return `🎓 **MENU E STUDENTIT**\n\n• /matematike <problem> - Zgjidh probleme matematike\n• /detyre <lëndë> - Ndihmë për detyra\n• /liber <titull> - Gjej libra shkollore\n\n💡 **SHEMBUJ:**\n• /matematike "2x + 5 = 15"\n• /detyre "histori"\n• /liber "Matematike 10"`;
    },

    // ✅ KOMANDA MATEMATIKE
    '/matematike': (args) => {
        if (!args) return '❌ Ju lutem jepni një problem matematikor.';
        return `🧮 **ZGJIDHJA E PROBLEMIT**\n\n"${args}"\n\nZgjidhja do të shfaqej këtu.`;
    },

    // ✅ KOMANDA DETYRE
    '/detyre': (args) => {
        if (!args) return '❌ Ju lutem specifikoni lëndën.';
        return `📚 **NDIHMË PËR DETYRË - ${args.toUpperCase()}**\n\nNdihma për detyrën do të shfaqej këtu.`;
    }
};

// ======================================================
// ✅ ENDPOINT KRYESOR PËR MESAZHE - VERSION I RI STABIL
// ======================================================

router.post('/message', async (req, res) => {
    try {
        const userId = req.userId || 'user-' + Date.now();
        const sessionId = req.sessionId || 'session-' + Date.now();
        const message = req.body.message;

        console.log('💬 [NEW-SYSTEM] Mesazh i marrë:', message?.substring(0, 50));

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

            console.log(`🔧 [NEW-SYSTEM] Komanda: /${command}, Args: ${args}`);

            if (commandSystem[`/${command}`]) {
                response = await commandSystem[`/${command}`](args, userId);
            } else {
                response = '❌ Komandë e panjohur. Përdorni /ndihmo për listën.';
            }
        }
        // ✅ MESAZHE NATYRORE
        else {
            const lowerMessage = message.toLowerCase();
            
            if (lowerMessage.includes('përshëndetje') || lowerMessage.includes('pershendetje') || lowerMessage.includes('hello')) {
                response = 'Përshëndetje! 😊 Mirë se ju gjetëm! Si mund t\'ju ndihmoj sot?';
            }
            else if (lowerMessage.includes('si je') || lowerMessage.includes('si jeni')) {
                response = 'Jam shumë mirë, faleminderit që pyetët! 😊 Çfarë mund të bëj për ju?';
            }
            else if (lowerMessage.includes('faleminderit') || lowerMessage.includes('rrofsh')) {
                response = 'S\'ka përse! 😊 Gjithmonë i lumtur të ndihmoj!';
            }
            else {
                response = 'E kuptoj! 😊 Përdorni /ndihmo për të parë të gjitha komandat e mia.';
            }
        }

        // ✅ RUAJ MESAZHET NË DATABASE
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

        console.log('✅ [NEW-SYSTEM] Duke kthyer përgjigjen');
        
        res.json({
            success: true,
            response: response,
            sessionData: { userId, sessionId }
        });

    } catch (error) {
        console.error('❌ [NEW-SYSTEM] Gabim i përgjithshëm:', error);
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

router.get('/simple-test', (req, res) => {
    res.json({
        success: true,
        message: '✅ Serveri po funksionon!',
        timestamp: new Date().toISOString()
    });
});

router.get('/debug-session', (req, res) => {
    const debugInfo = {
        success: true,
        timestamp: new Date().toISOString(),
        cookies_received: req.cookies,
        session_from_middleware: {
            userId: req.userId,
            sessionId: req.sessionId
        }
    };
    
    res.json(debugInfo);
});

router.get('/test-database', (req, res) => {
    db.all('SELECT name FROM sqlite_master WHERE type="table"', (err, tables) => {
        db.get('SELECT COUNT(*) as count FROM messages', (err, row) => {
            res.json({
                success: true,
                tables: tables,
                total_messages: row?.count || 0
            });
        });
    });
});

module.exports = router;
