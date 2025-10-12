// ==================== ✅ APP.JS BRIDGE - 08.10.2024 ====================
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

    // ✅ RUTA E RE PËR MESAZHET - KAP MESAZHET PARA SE TË SHKOJNË TE SISTEMI I VJETËR
    app.post('/api/chat/message', async (req, res) => {
        try {
            console.log('🌉 AppBridge: Duke kapur mesazh në /api/chat/message');
            
            const { message, userId } = req.body;
            
            if (!message) {
                return res.json({ 
                    success: false, 
                    response: '❌ Ju lutem shkruani një mesazh' 
                });
            }

            console.log('📝 AppBridge: Mesazhi:', message.substring(0, 50));
            console.log('👤 AppBridge: User ID:', userId);

            // ✅ PROVO TË PËRDORËSH COMMAND SERVICE
            try {
                const CommandService = require('../services/commandService');
                const db = require('../database');
                
                // Merr përdoruesin
                const user = await db.getAsync('SELECT * FROM users WHERE id = ?', [userId || 1]);
                
                if (user) {
                    console.log('🎯 AppBridge: Duke thirrur CommandService...');
                    const result = await CommandService.processCommand('chat', user, message);
                    
                    console.log('📊 AppBridge: Rezultati nga CommandService:', {
                        success: result.success,
                        handled: true
                    });
                    
                    return res.json(result);
                }
            } catch (cmdError) {
                console.error('❌ AppBridge: Gabim në CommandService:', cmdError.message);
            }

            // ✅ NËSE COMMAND SERVICE DËSHTOI, KTHE ERROR
            return res.json({
                success: false,
                response: '❌ Gabim në procesimin e mesazhit'
            });

        } catch (error) {
            console.error('❌ AppBridge: Gabim i përgjithshëm:', error);
            return res.json({
                success: false,
                response: '❌ Gabim në server. Provo përsëri.'
            });
        }
    });

    // ✅ KAP EDHE RUTËN E VJETËR /api/chat
    app.post('/api/chat', async (req, res) => {
        try {
            console.log('🌉 AppBridge: Duke kapur mesazh në /api/chat (ruta e vjetër)');
            
            const { message, userId } = req.body;
            
            if (!message) {
                return res.json({ 
                    success: false, 
                    response: '❌ Ju lutem shkruani një mesazh' 
                });
            }

            console.log('📝 AppBridge: Mesazhi në /api/chat:', message.substring(0, 50));

            // ✅ PROVO TË PËRDORËSH COMMAND SERVICE
            try {
                const CommandService = require('../services/commandService');
                const db = require('../database');
                
                // Merr përdoruesin
                const user = await db.getAsync('SELECT * FROM users WHERE id = ?', [userId || 1]);
                
                if (user) {
                    console.log('🎯 AppBridge: Duke thirrur CommandService për /api/chat...');
                    const result = await CommandService.processCommand('chat', user, message);
                    
                    if (result.success) {
                        console.log('✅ AppBridge: CommandService e trajtoi mesazhin nga /api/chat');
                        return res.json(result);
                    }
                }
            } catch (cmdError) {
                console.error('❌ AppBridge: Gabim në CommandService për /api/chat:', cmdError.message);
            }

            // ✅ NËSE COMMAND SERVICE NUK E TRAJTON, LËRE TË KALOJË TE RUTA E VJETËR
            console.log('🔄 AppBridge: CommandService nuk e trajtoi, duke lënë të kalojë te ruta e vjetër...');
            // Në Express, kur nuk kthehet response, kalon te middleware tjetër
            return;

        } catch (error) {
            console.error('❌ AppBridge: Gabim i përgjithshëm në /api/chat:', error);
            // Lëre të kalojë te ruta e vjetër në rast gabimi
            return;
        }
    });

    console.log('✅ Ruta testuese e urës u regjistrua: /api/bridge/test');
    console.log('✅ Ruta e mesazheve u regjistrua: /api/chat/message');
    console.log('✅ Ruta e vjetër /api/chat u kapur nga AppBridge');
}

module.exports = AppBridge;
