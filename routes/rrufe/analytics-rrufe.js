// ======================= RRUFE-API-002 =======================
// 📍 routes/rrufe/analytics-rrufe.js - VERSION SUPER I THJESHTË
// =============================================================

const express = require('express');
const router = express.Router();

// ✅ RRUFE API - Statistika (VERSION I THJESHTË)
router.get('/analytics/overview', async (req, res) => {
    try {
        console.log('🔍 RRUFE ANALYTICS TEST: Duke testuar...');
        
        // ✅ TEST I THJESHTË
        res.json({ 
            success: true, 
            message: '✅ RRUFE ANALYTICS TEST - FUNKSIONON!',
            stats: {
                total_messages: 15,
                total_users: 1,
                avg_message_length: 25
            }
        });
        
    } catch (error) {
        console.error('❌ RRUFE ANALYTICS: Gabim:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Gabim analytics: ' + error.message 
        });
    }
});

module.exports = router;
