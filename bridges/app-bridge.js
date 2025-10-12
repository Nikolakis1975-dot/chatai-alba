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

        console.log('✅ Ruta testuese e urës u regjistrua: /api/bridge/test');
    }
}

module.exports = AppBridge;
