// ==================== ✅ APP.JS BRIDGE - UPDATED WITH OPENAI SUPPORT ====================
// 📝 DESKRIMI: Ura e sigurt midis app.js ekzistues dhe sistemeve të reja + OpenAI integration
// 🎯 QËLLIMI: Lidhje e kontrolluar pa ndryshime në app.js ekzistues
// 🔧 AUTORI: ChatAI ALBA Team  
// 🏗️ ARKITEKTURA: Modular Bridge Pattern
// 🆕 VERSION: 2.0 - Me OpenAI Support
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

        // ✅ REGJISTRO RUTA TESTUESE DHE OPENAI
        this.registerTestRoutes(app);
    }

  static registerTestRoutes(app) {
    console.log('🔍 AppBridge: Duke regjistruar rrugët...');
    
    // ✅ RUTA TESTUESE - kontrollo nëse AppBridge po punon
    app.get('/api/bridge/test', (req, res) => {
        console.log('✅ AppBridge Test Route u thirr!');
        res.json({ 
            success: true, 
            message: '🌉 Ura e AppBridge punon!',
            timestamp: new Date().toISOString(),
            status: 'Operational',
            version: '2.0 - With OpenAI Support'
        });
    });

    // ... rest of your OpenAI routes ...

    console.log('✅ AppBridge: Të gjitha rrugët u regjistruan');
}

        // 🆕 ==================== OPENAI ROUTES ====================

        // ✅ RUTA E STATUSIT TË OPENAI
        app.get('/api/openai/status', async (req, res) => {
            try {
                const CommandBridge = require('./command-bridge');
                const status = await CommandBridge.checkOpenAIStatus();
                
                res.json({
                    success: true,
                    ...status,
                    timestamp: new Date().toISOString(),
                    bridge: 'app-bridge-openai-status'
                });
            } catch (error) {
                res.json({
                    success: false,
                    available: false,
                    status: 'error',
                    message: error.message,
                    timestamp: new Date().toISOString(),
                    bridge: 'app-bridge-openai-status-error'
                });
            }
        });

        // ✅ RUTA KRYESORE E OPENAI CHAT
        app.post('/api/openai/chat', async (req, res) => {
            try {
                const userId = req.userId || req.body.userId || 'user-' + Date.now();
                const sessionId = req.sessionId || req.body.sessionId || 'session-' + Date.now();
                
                console.log('🌉 AppBridge: Duke kapur kërkesë OpenAI - Session:', { userId, sessionId });

                const { message } = req.body;

                if (!message || message.trim() === '') {
                    return res.json({ 
                        success: false, 
                        response: '❌ Ju lutem shkruani një mesazh për OpenAI',
                        sessionData: { userId, sessionId },
                        bridge: 'app-bridge-openai-validation'
                    });
                }

                // ✅ PËRDOR URËN E COMMAND-BRIDGE PËR OPENAI
                try {
                    const CommandBridge = require('./command-bridge');
                    const db = require('../database');
                    
                    const user = await db.getAsync('SELECT * FROM users WHERE id = ?', [userId || 1]);
                    
                    if (user) {
                        console.log('🔮 AppBridge: Duke thirrur CommandBridge për OpenAI...');
                        const result = await CommandBridge.processOpenAICommand(message, user);
                        
                        console.log('📊 AppBridge: Rezultati OpenAI:', {
                            success: result.success,
                            bridge: result.bridge,
                            tokens: result.tokens || 0
                        });
                        
                        return res.json({
                            ...result,
                            sessionData: { userId, sessionId },
                            bridge: result.bridge || 'app-bridge-openai'
                        });
                    } else {
                        return res.json({
                            success: false,
                            response: '❌ Përdoruesi nuk u gjet për OpenAI',
                            sessionData: { userId, sessionId },
                            bridge: 'app-bridge-openai-user-error'
                        });
                    }
                } catch (bridgeError) {
                    console.error('❌ AppBridge: Gabim në CommandBridge për OpenAI:', bridgeError);
                    
                    // ✅ FALLBACK I SIGURT PËR OPENAI
                    return res.json({
                        success: true,
                        response: `🔮 **OpenAI via App Bridge**\n\n"${message}"\n\n🌉 *Kjo është version testues i OpenAI përmes sistemit tonë të urave*\n\n**Gabim:** ${bridgeError.message}`,
                        bridge: 'app-bridge-openai-fallback',
                        sessionData: { userId, sessionId },
                        timestamp: new Date().toISOString()
                    });
                }

            } catch (error) {
                console.error('❌ AppBridge: Gabim i përgjithshëm në /api/openai/chat:', error);
                
                // ✅ FALLBACK FINAL - ASNJËHERË NUK DËSHTO
                return res.json({
                    success: true,
                    response: `🔮 **OpenAI Bridge Active**\n\n"${req.body.message}"\n\n💡 *Infrastruktura e OpenAI është gati për integrim*\n\n**Gabim:** ${error.message}`,
                    bridge: 'app-bridge-openai-final-fallback',
                    sessionData: {
                        userId: req.userId || req.body.userId,
                        sessionId: req.sessionId || req.body.sessionId
                    },
                    timestamp: new Date().toISOString()
                });
            }
        });

        // ✅ RUTA E RE PËR MESAZHET NATYRORE - KAP PARA SE TË SHKOJNË TE GEMINI
        app.post('/api/chat', async (req, res) => {
            try {
                // ✅ KORRIGJIM I RI: SHTO SESSION DATA
                const userId = req.userId || req.body.userId || 'user-' + Date.now();
                const sessionId = req.sessionId || req.body.sessionId || 'session-' + Date.now();
                
                console.log('🌉 AppBridge: Duke kapur mesazh në /api/chat - Session:', { userId, sessionId });

                const { message } = req.body;

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
                                
                                // ✅ KORRIGJIM I RI: KTHE PËRGJIGJE ME SESSION DATA
                                return res.json({
                                    ...result,
                                    sessionData: {
                                        userId: userId,
                                        sessionId: sessionId
                                    }
                                });
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
                                    
                                    // ✅ KORRIGJIM I RI: KTHE PËRGJIGJE ME SESSION DATA
                                    return res.json({
                                        ...result,
                                        sessionData: {
                                            userId: userId,
                                            sessionId: sessionId
                                        }
                                    });
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
                // ✅ KORRIGJIM I RI: SHTO SESSION DATA
                const userId = req.userId || req.body.userId || 'user-' + Date.now();
                const sessionId = req.sessionId || req.body.sessionId || 'session-' + Date.now();
                
                console.log('🌉 AppBridge: Duke kapur mesazh në /api/chat/message - Session:', { userId, sessionId });

                const { message } = req.body;

                if (!message) {
                    return res.json({ 
                        success: false, 
                        response: '❌ Ju lutem shkruani një mesazh',
                        // ✅ KORRIGJIM I RI: KTHE SESSION DATA EDHE NË ERROR
                        sessionData: {
                            userId: userId,
                            sessionId: sessionId
                        }
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
                        
                        // ✅ KORRIGJIM I RI: KTHE PËRGJIGJE ME SESSION DATA
                        return res.json({
                            ...result,
                            sessionData: {
                                userId: userId,
                                sessionId: sessionId
                            }
                        });
                    } else {
                        return res.json({
                            success: false,
                            response: '❌ Përdoruesi nuk u gjet',
                            // ✅ KORRIGJIM I RI: KTHE SESSION DATA EDHE NË ERROR
                            sessionData: {
                                userId: userId,
                                sessionId: sessionId
                            }
                        });
                    }
                } catch (cmdError) {
                    console.error('❌ AppBridge: Gabim në CommandService për /api/chat/message:', cmdError.message);
                    return res.json({
                        success: false,
                        response: '❌ Gabim në procesimin e mesazhit',
                        // ✅ KORRIGJIM I RI: KTHE SESSION DATA EDHE NË ERROR
                        sessionData: {
                            userId: userId,
                            sessionId: sessionId
                        }
                    });
                }

            } catch (error) {
                console.error('❌ AppBridge: Gabim i përgjithshëm në /api/chat/message:', error);
                return res.json({
                    success: false,
                    response: '❌ Gabim në server. Provo përsëri.',
                    // ✅ KORRIGJIM I RI: KTHE SESSION DATA EDHE NË ERROR
                    sessionData: {
                        userId: req.userId || req.body.userId,
                        sessionId: req.sessionId || req.body.sessionId
                    }
                });
            }
        });

        console.log('✅ Ruta testuese e urës u regjistrua: /api/bridge/test');
        console.log('✅ Ruta e statusit OpenAI u regjistrua: /api/openai/status');
        console.log('✅ Ruta e chat-it OpenAI u regjistrua: /api/openai/chat');
        console.log('✅ Ruta e mesazheve natyrore u regjistrua: /api/chat');
        console.log('✅ Ruta e drejtpërdrejtë e mesazheve u regjistrua: /api/chat/message');
    }
}

module.exports = AppBridge;
