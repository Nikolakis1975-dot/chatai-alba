// 🔥 routes/openai.js - ROUTES FILE I SAKTË
const express = require('express');
const router = express.Router();
const openaiService = require('../services/openaiService');

console.log('🚀 OPENAI ROUTES - Loading...');

// ✅ ROUTE PËR OPENAI CHAT
router.post('/chat', async (req, res) => {
    try {
        const { message, userId } = req.body;
        
        console.log('🔮 OPENAI CHAT ROUTE - Message:', message);
        
        if (!message) {
            return res.json({ success: false, error: 'Nuk ka mesazh' });
        }

        // ✅ THIRR OPENAI SERVICE
        const result = await openaiService.processMessage(message, userId || 1);
        
        console.log('📤 OPENAI CHAT RESULT:', result.success ? 'SUCCESS' : 'FAILED');
        
        res.json(result);
        
    } catch (error) {
        console.error('❌ OPENAI CHAT ERROR:', error);
        res.json({
            success: false,
            error: 'OpenAI chat error: ' + error.message
        });
    }
});

// ✅ ROUTE PËR STATUS
router.get('/status', async (req, res) => {
    try {
        const db = require('../database');
        const userId = req.user?.id || 1;
        
        const apiKeyRow = await new Promise((resolve) => {
            db.get(
                'SELECT api_key FROM api_keys WHERE user_id = ? AND service_name = ?',
                [userId, 'openai'],
                (err, row) => resolve(row)
            );
        });
        
        res.json({
            success: true,
            hasApiKey: !!apiKeyRow,
            message: apiKeyRow ? 'OpenAI i konfiguruar' : 'OpenAI nuk është konfiguruar',
            userId: userId
        });
        
    } catch (error) {
        res.json({
            success: false,
            error: error.message
        });
    }
});

// ✅ KY DUHET TË JETË RRESHTI I FUNDIT
module.exports = router;
