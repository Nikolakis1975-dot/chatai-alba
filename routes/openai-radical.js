// 🔥 OPENAI RADICAL ROUTES - SISTEM I PASTËR
import express from 'express';
import openaiRadical from '../services/openaiRadical.js';

const router = express.Router();

console.log('🚀 OPENAI RADICAL ROUTES - Loading...');

// 🔥 ROUTA KRYESORE RADIKALE - PA SESIONE, PA VERIFIKIME
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        console.log('🎯 OPENAI RADICAL ROUTE - Message:', message);
        
        if (!message) {
            return res.json({
                success: false,
                error: 'OPENAI_RADICAL: No message provided'
            });
        }

        // 🔥 THIRR DIRECT OPENAI RADICAL SERVICE
        const result = await openaiRadical.processMessage(message);
        
        console.log('📤 OPENAI RADICAL RESULT:', result.success ? 'SUCCESS' : 'FAILED');
        
        res.json(result);
        
    } catch (error) {
        console.error('❌ OPENAI RADICAL ROUTE ERROR:', error);
        res.json({
            success: false,
            error: `OPENAI_RADICAL_ROUTE: ${error.message}`
        });
    }
});

// 🔥 ROUTA TEST - PA ASNJË KONTROLL
router.get('/test', (req, res) => {
    console.log('🧪 OPENAI RADICAL TEST ROUTE');
    res.json({
        success: true,
        message: '🔥 OPENAI RADICAL SYSTEM IS WORKING!',
        timestamp: new Date().toISOString(),
        apiKeyExists: !!process.env.OPENAI_API_KEY
    });
});

export default router;
