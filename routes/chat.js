const express = require('express');
const db = require('../database');
const router = express.Router();

// ======================================================
// ✅ SISTEMI I PLOTË I KOMANDAVE - VERSION I RIPARUAR
// ======================================================

const commandSystem = {
    // ✅ KOMANDA NDIHMË - RIPARIM
    '/ndihmo': () => `👑 **SISTEMI I KOMANDAVE - CHATAI ALBA** 👑

📋 **KOMANDAT BAZE:**
• /ndihmo - Shfaq këtë listë
• /pershendetje - Përshëndetje
• /wiki <kerkimi> - Kërko në Wikipedia  
• /perkthim <teksti> - Përkthen tekst
• /moti <qyteti> - Informacion moti
• /llogarit <shprehja> - Llogarit matematikë
• /eksporto - Eksporto historinë
• /importo - Importo të dhëna
• /meso <pyetje>|<përgjigje> - Mëso diçka të re
• /apikey <key> - Vendos API Key
• /statistikat - Shfaq statistikat
• /shkarko - Shkarko historinë

💡 **SHEMBUJ:**
• /wiki Albania
• /perkthim anglisht "Mirëdita"
• /moti Tirana
• /llogarit 5+5*2
• /meso "Kryeqyteti"|"Tirana"`,

    // ✅ KOMANDA PERSHËNDETJE
    '/pershendetje': () => 'Përshëndetje! 😊 Si mund të të ndihmoj sot?',

    // ✅ KOMANDA WIKIPEDIA
    '/wiki': (args) => {
        if (!args) return '❌ Ju lutem jepni një kërkim për Wikipedia.';
        return `🌐 Rezultati për "${args}":\nInformacione nga Wikipedia do të shfaqeshin këtu.`;
    },

    // ✅ KOMANDA PËRKTHIM
    '/perkthim': (args) => {
        if (!args) return '❌ Ju lutem jepni tekst për të përkthyer.';
        return `🔤 Përkthimi i "${args}":\n[Përkthimi do të shfaqej këtu]`;
    },

    // ✅ KOMANDA MOTI
    '/moti': (args) => {
        if (!args) return '❌ Ju lutem jepni një qytet.';
        return `🌍 Moti në ${args}: ☀️ Informacioni moti do të shfaqej këtu.`;
    },

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

    // ✅ KOMANDA EKSPORTO - RIPARIM
    '/eksporto': async (args, userId) => {
        try {
            const history = await new Promise((resolve) => {
                db.all(
                    'SELECT content, sender, timestamp FROM messages WHERE user_id = ? ORDER BY timestamp DESC LIMIT 20',
                    [userId],
                    (err, rows) => {
                        if (err) {
                            console.error('❌ Gabim në eksportim:', err);
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
                const time = new Date(msg.timestamp).toLocaleTimeString('sq-AL');
                exportText += `${emoji} [${time}] ${msg.content}\n`;
                exportText += '─'.repeat(40) + '\n';
            });

            return exportText + `\n✅ Eksporti u krye me sukses!`;
            
        } catch (error) {
            console.error('❌ Gabim në /eksporto:', error);
            return '❌ Gabim gjatë eksportimit. Provo përsëri.';
        }
    },

    // ✅ KOMANDA IMPORTO - RIPARIM
    '/importo': (args, userId) => {
        return `📥 **SISTEMI I IMPORTIMIT**\n\n✅ Sistemi i importimit është aktiv!\n\n💡 Për importim të plotë, përdorni butonin "Ngarko" në ndërfaqe.\n\n🔧 *Të dhënat do të importohen automatikisht*`;
    },

    // ✅ KOMANDA MESO - RIPARIM
    '/meso': async (args, userId) => {
        try {
            if (!args) {
                return '❌ Format: /meso <pyetje>|<përgjigje>\n\n💡 Shembull: /meso "Kryeqyteti i Shqipërisë"|"Tirana"';
            }

            const parts = args.split('|').map(part => part.trim());
            
            if (parts.length < 2) {
                return '❌ Format i gabuar! Duhen të paktën 2 pjesë: <pyetje>|<përgjigje>';
            }

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

            return `✅ **NJOHURI E RE U MËSUA!**\n\n❓ **Pyetja:** "${pyetje}"\n\n💡 **Përgjigja:** "${pergjigje}"\n\n🎯 Tani unë do të mbaj mend këtë informacion!`;
            
        } catch (error) {
            console.error('❌ Gabim në /meso:', error);
            return '❌ Gabim gjatë mësimit. Provo përsëri.';
        }
    },

    // ✅ KOMANDA STATISTIKAT - RIPARIM
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

            return `📊 **STATISTIKAT E SISTEMIT:**\n👥 Përdorues të regjistruar: **${userCount}**\n💬 Mesazhe totale: **${messageCount}**\n🔄 Versioni: **2.0**\n🌟 Status: **Online & Stable**`;
        } catch (error) {
            return '❌ Gabim gjatë marrjes së statistikave.';
        }
    },

    // ✅ KOMANDA APIKEY - RIPARIM
    '/apikey': async (args, userId) => {
        if (!args) return '❌ Format: /apikey <key_juaj>';
        
        try {
            // Fshi të vjetrat
            db.run('DELETE FROM api_keys WHERE user_id = ? AND service_name = ?', [userId, 'gemini']);
            
            // Shto të rejat
            db.run(
                'INSERT INTO api_keys (user_id, api_key, service_name, created_at) VALUES (?, ?, ?, ?)',
                [userId, args, 'gemini', new Date().toISOString()]
            );

            return '✅ API Key u ruajt me sukses! Tani mund të përdorni pyetje të avancuara.';
        } catch (error) {
            return '❌ Gabim në ruajtjen e API key.';
        }
    },

    // ✅ KOMANDA SHKARKO - RIPARIM
    '/shkarko': async (args, userId) => {
        try {
            const downloadUrl = `https://chatai-alba-gr9dw.ondigitalocean.app/api/chat/download-history/${userId}`;
            
            return `📥 **SISTEMI I SHKARKIMIT**\n\n✅ Për të shkarkuar historinë tuaj:\n\n🔗 **Vizitoni këtë URL:**\n${downloadUrl}\n\n💾 Historia do të shkarkohet si skedar tekst (.txt)`;
        } catch (error) {
            return '❌ Gabim gjatë shkarkimit. Provo përsëri.';
        }
    }
};

// ======================================================
// ✅ FUNKSIONET PËR MESAZHE NATYRORE
// ======================================================

function getNaturalResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('përshëndetje') || lowerMessage.includes('pershendetje') || lowerMessage.includes('hello') || lowerMessage.includes('tung')) {
        return "Përshëndetje! 😊 Mirë se ju gjetëm! Si mund t'ju ndihmoj sot?";
    }
    
    if (lowerMessage.includes('si je') || lowerMessage.includes('si jeni')) {
        return "Jam shumë mirë, faleminderit që pyetët! 😊 Çfarë mund të bëj për ju?";
    }
    
    if (lowerMessage.includes('faleminderit') || lowerMessage.includes('rrofsh') || lowerMessage.includes('thanks')) {
        return "S'ka përse! 😊 Gjithmonë i lumtur të ndihmoj!";
    }

    if (lowerMessage.includes('mirëmëngjes')) {
        return "Mirëmëngjes! ☀️ Fillim të mbarë të ditës!";
    }

    if (lowerMessage.includes('mirëmbrëma')) {
        return "Mirëmbrëma! 🌙 Mbrëmje e mbarë!";
    }

    // Llogaritje matematikore automatikisht
    if (message.match(/\d+[\+\-\*\/]\d+/)) {
        try {
            const result = eval(message);
            return `🧮 Rezultati: ${message} = ${result}`;
        } catch (error) {
            // Vazhdo me përgjigjen normale
        }
    }

    return "E kuptoj! 😊 Përdorni /ndihmo për të parë të gjitha komandat e mia.";
}

// ======================================================
// ✅ ENDPOINT KRYESOR PËR MESAZHE
// ======================================================

router.post('/message', async (req, res) => {
    try {
        const userId = req.userId || 'user-' + Date.now();
        const sessionId = req.sessionId || 'session-' + Date.now();
        const message = req.body.message;

        console.log('💬 /message u thirr:', { message, userId, sessionId });

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

            if (commandSystem[`/${command}`]) {
                response = await commandSystem[`/${command}`](args, userId);
            } else {
                response = '❌ Komandë e panjohur. Përdorni /ndihmo për listën.';
            }
        }
        // ✅ MESAZHE NATYRORE
        else {
            response = getNaturalResponse(message);
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

// ======================================================
// ✅ ENDPOINT PËR SHKARKIM TË HISTORISË
// ======================================================

router.get('/download-history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        console.log('📥 Duke përgatitur shkarkimin për user:', userId);
        
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
                        resolve(rows || []);
                    }
                }
            );
        });

        if (history.length === 0) {
            return res.json({
                success: false,
                message: '❌ Nuk ka histori për të shkarkuar'
            });
        }

        let fileContent = `HISTORIA E BISEDËS - CHATAI ALBA\n`;
        fileContent += `Përdorues: ${userId}\n`;
        fileContent += `Data: ${new Date().toLocaleDateString('sq-AL')}\n`;
        fileContent += `Ora: ${new Date().toLocaleTimeString('sq-AL')}\n`;
        fileContent += `Total mesazhe: ${history.length}\n`;
        fileContent += '='.repeat(50) + '\n\n';

        history.forEach((msg, index) => {
            const person = msg.sender === 'user' ? 'USER' : 'BOT';
            const time = msg.timestamp ? new Date(msg.timestamp).toLocaleString('sq-AL') : 'Koha e panjohur';
            
            fileContent += `${index + 1}. ${person} [${time}]\n`;
            fileContent += `   ${msg.content}\n`;
            fileContent += '-'.repeat(40) + '\n';
        });

        fileContent += `\nShkarkuar nga ChatAI ALBA\n`;
        fileContent += `https://chatai-alba-gr9dw.ondigitalocean.app`;

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="historia-${userId}.txt"`);
        
        res.send(fileContent);

    } catch (error) {
        console.error('❌ Gabim në shkarkimin e historisë:', error);
        res.status(500).json({
            success: false,
            message: '❌ Gabim gjatë shkarkimit të historisë'
        });
    }
});

// ======================================================
// ✅ ENDPOINT-E TESTUESE
// ======================================================

router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: '✅ Serveri po funksionon!',
        timestamp: new Date().toISOString()
    });
});

router.get('/debug-session', (req, res) => {
    res.json({
        success: true,
        sessionData: {
            userId: req.userId,
            sessionId: req.sessionId
        },
        cookies: req.cookies
    });
});

module.exports = router;
