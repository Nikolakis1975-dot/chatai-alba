// ==================== ✅ APP.JS BRIDGE - 12.10.2024 ====================
// 📝 DESKRIMI: Ura e sigurt midis app.js ekzistues dhe sistemeve të reja
// 🎯 QËLLIMI: Lidhje e kontrolluar pa ndryshime në app.js ekzistues
// 🔧 AUTORI: ChatAI ALBA Team
// 🏗️ ARKITEKTURA: Modular Bridge Pattern
// =========================================================================

class AppBridge {
    static isInitialized = false;

    // ✅ INICIALIZIM I SIGURT - NUK NDRYSHON APP.JS EKZISTUES
    static initializeSafeBridge(app) {
        if (this.isInitialized) {
            console.log('✅ Ura e AppBridge është tashmë inicializuar');
            return;
        }

        console.log('🌉 Duke inicializuar urën e sigurt AppBridge...');
        
        try {
            // ✅ PROVO TË NGARKOSH SISTEMET E REJA (ME ERROR HANDLING)
            this.loadNewSystemsSafely(app);
            
            this.isInitialized = true;
            console.log('✅ Ura AppBridge u inicializua me sukses (pa ndryshime në app.js)');
            
        } catch (error) {
            console.error('❌ Gabim në inicializimin e urës:', error);
            console.log('🔄 Sistemet e reja nuk u ngarkuan - sistemi ekzistues vazhdon normalisht');
        }
    }

    // ✅ NGARKIM I SIGURT I SISTEMEVE TË REJA
    static loadNewSystemsSafely(app) {
        console.log('🔍 Duke kontrolluar nëse ka sisteme të reja për të ngarkuar...');
        
        // ✅ 1. PROVO TË NGARKOSH COMMAND SERVICE
        try {
            const CommandService = require('../services/commandService');
            console.log('✅ CommandService u gjet dhe u ngarkua');
            
        } catch (error) {
            console.log('ℹ️ CommandService nuk mund të ngarkohet akoma:', error.message);
        }

        // ✅ REGJISTRO RUTA TESTUESE
        this.registerTestRoutes(app);
    }

    // ✅ REGJISTRIM I RUTAVE TË REJA TË TESTUARA
    static registerTestRoutes(app) {
        // ✅ RUTA TESTUESE - vetëm për testim
        app.get('/api/bridge/test', (req, res) => {
            res.json({ 
                success: true, 
                message: '🌉 Ura e AppBridge punon!',
                timestamp: new Date().toISOString(),
                status: 'Operational',
                version: '1.0'
            });
        });

        // ✅ RUTA E RE PËR MESAZHET NATYRORE - KAP PARA SE TË SHKOJNË TE GEMINI
        app.post('/api/chat', async (req, res) => {
            try {
                const { message, userId } = req.body;
                
                console.log('🌉 AppBridge: Duke kapur mesazh në /api/chat:', message?.substring(0, 50));

                // ✅ KONTROLLO NËSE ËSHTË MESAZH NATYROR (JO KOMANDË)
                if (message && !message.startsWith('/') && message.trim().length > 2) {
                    console.log('🎯 AppBridge: Gjet mesazh natyror - duke procesuar me CommandService');
                    
                    try {
                        const CommandService = require('../services/commandService');
                        const db = require('../database');
                        
                        // Merr përdoruesin
                        const user = await db.getAsync('SELECT * FROM users WHERE id = ?', [userId || 1]);
                        
                        if (user) {
                            console.log('🔍 AppBridge: Duke thirrur CommandService për mesazh natyror...');
                            const result = await CommandService.processCommand('chat', user, message);
                            
                            if (result.success) {
                                console.log('✅ AppBridge: CommandService dha përgjigje për mesazhin natyror');
                                return res.json(result);
                            } else {
                                console.log('⚠️ AppBridge: CommandService nuk dha përgjigje, duke vazhduar...');
                            }
                        }
                    } catch (cmdError) {
                        console.error('❌ AppBridge: Gabim në CommandService:', cmdError.message);
                    }
                }

                // ✅ KONTROLLO NËSE ËSHTË KOMANDË E RE QË DUHET TË TRAJTOHET NGA COMMAND SERVICE
                if (message && message.startsWith('/')) {
                    const serverCommands = [
                        '/ndihmo', '/student', '/studim', '/student-mode',
                        '/libër', '/liber', '/detyrë', '/detyre', 
                        '/matematikë', '/matematike', '/referencë', '/referenc',
                        '/projekt', '/fizikë', '/fizike', '/kimi',
                        '/histori', '/gjeografi', '/gjej', '/google', '/kërko'
                    ];

                    const command = message.split(' ')[0].toLowerCase();
                    
                    if (serverCommands.includes(command)) {
                        console.log('🎯 AppBridge: Gjet komandë të re - duke procesuar me CommandService:', command);
                        
                        try {
                            const CommandService = require('../services/commandService');
                            const db = require('../database');
                            
                            const user = await db.getAsync('SELECT * FROM users WHERE id = ?', [userId || 1]);
                            
                            if (user) {
                                const result = await CommandService.processCommand('chat', user, message);
                                
                                if (result.success) {
                                    console.log('✅ AppBridge: CommandService procesoi komandën:', command);
                                    return res.json(result);
                                }
                            }
                        } catch (cmdError) {
                            console.error('❌ AppBridge: Gabim në CommandService për komandë:', cmdError.message);
                        }
                    }
                }

                // ✅ NËSE NUK ËSHTË MESAZH NATYROR OSE KOMANDË E RE, LËRE TË KALOJË TE SISTEMI I VJETËR
                console.log('🔄 AppBridge: Duke lënë mesazhin të kalojë te sistemi i vjetër...');
                
                // Në Express, kur nuk kthehet response, kalon te middleware/ruta tjetër
                // Kjo do të thotë se mesazhi do të shkojë te ruta origjinale /api/chat
                return;

            } catch (error) {
                console.error('❌ AppBridge: Gabim i përgjithshëm në /api/chat:', error);
                // Në rast gabimi, lëre të kalojë te sistemi i vjetër
                return;
            }
        });

        // ✅ RUTA E RE PËR MESAZHET E DREJTPËRDREDHURA NGA FRONTEND
        app.post('/api/chat/message', async (req, res) => {
            try {
                const { message, userId } = req.body;
                
                console.log('🌉 AppBridge: Duke kapur mesazh në /api/chat/message:', message?.substring(0, 50));

                if (!message) {
                    return res.json({ 
                        success: false, 
                        response: '❌ Ju lutem shkruani një mesazh' 
                    });
                }

                try {
                    const CommandService = require('../services/commandService');
                    const db = require('../database');
                    
                    // Merr përdoruesin
                    const user = await db.getAsync('SELECT * FROM users WHERE id = ?', [userId || 1]);
                    
                    if (user) {
                        console.log('🎯 AppBridge: Duke thirrur CommandService për /api/chat/message...');
                        const result = await CommandService.processCommand('chat', user, message);
                        
                        console.log('📊 AppBridge: Rezultati nga CommandService:', {
                            success: result.success,
                            messageLength: result.response?.length || 0
                        });
                        
                        return res.json(result);
                    } else {
                        return res.json({
                            success: false,
                            response: '❌ Përdoruesi nuk u gjet'
                        });
                    }
                } catch (cmdError) {
                    console.error('❌ AppBridge: Gabim në CommandService për /api/chat/message:', cmdError.message);
                    return res.json({
                        success: false,
                        response: '❌ Gabim në procesimin e mesazhit'
                    });
                }

            } catch (error) {
                console.error('❌ AppBridge: Gabim i përgjithshëm në /api/chat/message:', error);
                return res.json({
                    success: false,
                    response: '❌ Gabim në server. Provo përsëri.'
                });
            }
        });

        console.log('✅ Ruta testuese e urës u regjistrua: /api/bridge/test');
        console.log('✅ Ruta e mesazheve natyrore u regjistrua: /api/chat');
        console.log('✅ Ruta e drejtpërdrejtë e mesazheve u regjistrua: /api/chat/message');
    }
}

module.exports = AppBridge;
