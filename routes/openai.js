// 🔥 routes/openai.js - ROUTES FILE I SAKTË
const express = require('express');
const router = express.Router();
const db = require('../database');
const OpenAI = require("openai");

console.log('🚀 OPENAI ROUTES - Loading...');

// ✅ FUNKSION PËR TË MARRË API KEY PA KONFLIKTE
async function getOpenAIApiKey(userId = 1) {
    try {
        // 🟩 1. PROVO API KEY TË USER-IT (PRIORITET I PARË)
        const userApiKeyRow = await new Promise((resolve) => {
            db.get(
                'SELECT api_key FROM api_keys WHERE user_id = ? AND service_name = ?',
                [userId, 'openai'],
                (err, row) => resolve(row)
            );
        });
        
        if (userApiKeyRow && userApiKeyRow.api_key) {
            console.log('🎯 Duke përdorur API Key të User-it');
            return { apiKey: userApiKeyRow.api_key, source: 'user' };
        }
        
        // 🟦 2. PROVO API KEY TË SERVERIT (DIGITALOCEAN)
        const serverApiKey = process.env.OPENAI_API_KEY;
        if (serverApiKey) {
            console.log('🌍 Duke përdorur API Key të Serverit');
            return { apiKey: serverApiKey, source: 'server' };
        }
        
        // ❌ ASNJËRA NUK EKZISTON
        console.log('❌ Nuk ka API Key të konfiguruar');
        return null;
        
    } catch (error) {
        console.error('❌ Gabim në marrjen e API Key:', error);
        return null;
    }
}

// ✅ ROUTE PËR OPENAI CHAT
router.post('/chat', async (req, res) => {
    try {
        const { message, userId } = req.body;
        
        console.log('🔮 OPENAI CHAT ROUTE - Message:', message);
        
        if (!message) {
            return res.json({ success: false, error: 'Nuk ka mesazh' });
        }

        // ✅ MER API KEY PA KONFLIKTE
        const apiKeyData = await getOpenAIApiKey(userId || 1);
        
        if (!apiKeyData) {
            return res.json({
                success: false,
                error: 'Nuk ka OpenAI API Key të konfiguruar. Vendosni API Key në panelin OpenAI.'
            });
        }

        console.log('🔑 API Key source:', apiKeyData.source);
        console.log('🔑 API Key:', apiKeyData.apiKey.substring(0, 20) + '...');

        // ✅ KRIJO OPENAI CLIENT
        const openai = new OpenAI({ apiKey: apiKeyData.apiKey });

        // ✅ THIRR OPENAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { 
                    role: "system", 
                    content: "Ti je RRUFE-TESLA AI. Përgjigju në shqip dhe jep përgjigje të dobishme, kreative." 
                },
                { 
                    role: "user", 
                    content: message 
                }
            ],
            max_tokens: 1000,
            temperature: 0.7
        });

        const responseText = completion.choices[0].message.content;
        console.log('✅ OpenAI Route - Përgjigje e suksesshme!');
        
        res.json({
            success: true,
            response: `🔮 **OpenAI RRUFE-TESLA**: ${responseText}`,
            source: apiKeyData.source,
            tokens: completion.usage?.total_tokens
        });
        
    } catch (error) {
        console.error('❌ OPENAI CHAT ERROR:', error.message);
        res.json({
            success: false,
            error: 'OpenAI: ' + error.message
        });
    }
});

// ✅ ROUTE PËR STATUS
router.get('/status', async (req, res) => {
    try {
        const userId = req.user?.id || 1;
        
        const apiKeyData = await getOpenAIApiKey(userId);
        
        res.json({
            success: true,
            hasApiKey: !!apiKeyData,
            source: apiKeyData?.source,
            message: apiKeyData ? 'OpenAI i konfiguruar' : 'OpenAI nuk është konfiguruar',
            userId: userId
        });
        
    } catch (error) {
        res.json({
            success: false,
            error: error.message
        });
    }
});

// ✅ ROUTE TEST
router.get('/test', (req, res) => {
    console.log('🧪 OPENAI TEST ROUTE CALLED');
    res.json({
        success: true,
        message: '🔥 OPENAI ROUTES ARE WORKING!',
        timestamp: new Date().toISOString()
    });
});

// ✅ KY DUHET TË JETË RRESHTI I FUNDIT - EKSPORTO ROUTER
module.exports = router;

console.log('✅ OPENAI ROUTES LOADED SUCCESSFULLY!');
