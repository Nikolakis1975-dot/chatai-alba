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
