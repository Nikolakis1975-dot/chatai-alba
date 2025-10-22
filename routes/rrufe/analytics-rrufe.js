// ======================= RRUFE-API-002 =======================
// 📍 routes/rrufe/analytics-rrufe.js
// 🎯 Analytics RRUFE pa prekur sistemin ekzistues
// =============================================================

const express = require('express');
const router = express.Router();

// ✅ RRUFE API - Statistika
router.get('/analytics/overview', async (req, res) => {
    try {
        const stats = await req.db.all(`
            SELECT 
                COUNT(*) as total_messages,
                COUNT(DISTINCT user_id) as total_users,
                AVG(LENGTH(content)) as avg_message_length
            FROM messages
        `);
        res.json({ success: true, stats: stats[0] });
    } catch (error) {
        console.error('❌ RRUFE API: Gabim në analytics:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ✅ RRUFE API - Aktiviteti i përdoruesve
router.get('/analytics/user-activity', async (req, res) => {
    try {
        const activity = await req.db.all(`
            SELECT 
                u.username,
                COUNT(m.id) as message_count,
                MAX(m.timestamp) as last_activity
            FROM users u
            LEFT JOIN messages m ON u.id = m.user_id
            GROUP BY u.id
            ORDER BY message_count DESC
        `);
        res.json({ success: true, activity });
    } catch (error) {
        console.error('❌ RRUFE API: Gabim në user activity:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
