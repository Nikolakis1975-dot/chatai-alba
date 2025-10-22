// ======================= RRUFE-API-001 =======================
// 📍 routes/rrufe/api-rrufe.js
// 🎯 API të reja RRUFE me database access të saktë
// =============================================================

const express = require('express');
const router = express.Router();
const database = require('../../database'); // ✅ IMPORT DATABASE

// ✅ RRUFE API - Historiku i mesazheve
router.get('/messages/history', async (req, res) => {
    try {
        const db = database.getDb(); // ✅ MER DATABASE
        const messages = await db.all(`
            SELECT m.*, u.username 
            FROM messages m 
            LEFT JOIN users u ON m.user_id = u.id 
            ORDER BY m.timestamp DESC
            LIMIT 50
        `);
        res.json({ success: true, messages });
    } catch (error) {
        console.error('❌ RRUFE API: Gabim në historinë e mesazheve:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ✅ RRUFE API - Mesazhet e përdoruesit
router.get('/messages/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const db = database.getDb(); // ✅ MER DATABASE
        const messages = await db.all(
            'SELECT * FROM messages WHERE user_id = ? ORDER BY timestamp DESC LIMIT 20',
            [userId]
        );
        res.json({ success: true, messages });
    } catch (error) {
        console.error('❌ RRUFE API: Gabim në mesazhet e përdoruesit:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
