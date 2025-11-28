// 🔥 routes/openai.js - SISTEM I RI PËR OPENAI
const express = require('express');
const router = express.Router();
const db = require('../database');

console.log('🚀 OPENAI ROUTES - Loading...');

// ✅ ROUTE TEST PËR OPENAI SERVICE DIRECT
router.post('/openai-test-direct', async (req, res) => {
    try {
        const { message, userId } = req.body;
        
        console.log('🧪🧪🧪 OPENAI TEST DIRECT - Duke testuar service...');
        
        // ✅ KONTROLLO DATABASE PËR API KEY
        const apiKeyRow = await new Promise((resolve) => {
            db.get(
                'SELECT api_key FROM api_keys WHERE user_id = ? AND service_name = ?',
                [userId || 1, 'openai'],
                (err, row) => {
                    if (err) {
                        console.error('❌ Gabim database:', err);
                        resolve(null);
                    } else {
                        resolve(row);
                    }
                }
            );
        });
        
        console.log('🔑🔑🔑 API Key status:', apiKeyRow ? '✅ EKZISTON' : '❌ NUK EKZISTON');
        console.log('👤👤👤 User ID:', userId || 1);
        
        if (!apiKeyRow || !apiKeyRow.api_key) {
            return res.json({
                success: false,
                error: 'Nuk ka OpenAI API Key në database për këtë user',
                userTested: userId || 1,
                suggestion: 'Shko në panelin OpenAI dhe vendos API Key'
            });
        }
        
        console.log('🔑 API Key gjatësia:', apiKeyRow.api_key.length);
        
        // ✅ PROVO OPENAI SERVICE
        try {
            const openaiService = require('../services/openaiService');
            console.log('🔮🔮🔮 Duke thirrur openaiService.processMessage...');
            
            const result = await openaiService.processMessage(message, userId || 1);
            
            console.log('📥📥📥 Rezultati nga openaiService:', {
                success: result.success,
                hasResponse: !!result.response,
                hasError: !!result.error
            });
            
            res.json(result);
            
        } catch (serviceError) {
            console.error('❌❌❌ Gabim në openaiService:', serviceError.message);
            console.error('❌❌❌ Stack:', serviceError.stack);
            
            res.json({
                success: false,
                error: 'openaiService gabim: ' + serviceError.message,
                stack: serviceError.stack
            });
        }
        
    } catch (error) {
        console.error('❌❌❌ Gabim kritik në test direkt:', error);
        res.json({
            success: false,
            error: 'Gabim kritik: ' + error.message,
            stack: error.stack
        });
    }
});

// ✅ ROUTE PËR OPENAI CHAT (për CommandService)
router.post('/chat', async (req, res) => {
    try {
        const { message, userId } = req.body;
        
        console.log('🔮 OPENAI CHAT ROUTE - Message:', message);
        
        if (!message) {
            return res.json({
                success: false,
                error: 'Nuk ka mesazh'
            });
        }

        // ✅ THIRR OPENAI SERVICE
        const openaiService = require('../services/openaiService');
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

// ✅ ROUTE PËR STATUSIN E OPENAI
router.get('/status', async (req, res) => {
    try {
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

console.log('✅ OPENAI ROUTES LOADED!');

module.exports = router;
