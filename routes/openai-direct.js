// ========================================================
// 🚀 OPENAI DIRECT - RRUFE TESLA 10.5
// Rrugë e drejtpërdrejtë për OpenAI API
// ========================================================
const express = require('express');
const db = require('../database');
const router = express.Router();

// ✅ TEST ROUTE
router.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: '✅ OpenAI Direct API është operative!',
        timestamp: new Date().toISOString()
    });
});

// ✅ CHAT ROUTE
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        console.log('🔮 OpenAI Direct - Mesazh i marrë:', message);

        if (!message) {
            return res.json({ success: false, error: "Mesazhi është bosh" });
        }

        // ✅ MER API KEY NGA DATABASE
        const apiRow = await new Promise((resolve) => {
            db.get(
                "SELECT api_key FROM api_keys WHERE service_name = ? AND user_id = ?",
                ['openai', 1],
                (err, row) => resolve(row)
            );
        });

        if (!apiRow || !apiRow.api_key) {
            return res.json({
                success: false,
                error: "❌ Nuk ka API Key OpenAI në database"
            });
        }

        const apiKey = apiRow.api_key;

        // ✅ DËRGO TE OPENAI API
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { 
                        role: 'system', 
                        content: 'Ti je RRUFE-TESLA AI. Përgjigju në shqip.' 
                    },
                    { 
                        role: 'user', 
                        content: message 
                    }
                ],
                max_tokens: 500
            })
        });

        const data = await openaiResponse.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        const reply = data.choices?.[0]?.message?.content || 'Nuk ka përgjigje';
        
        res.json({
            success: true,
            response: `🔮 **OpenAI**: ${reply}`
        });

    } catch (error) {
        console.error('❌ Gabim në OpenAI Direct:', error);
        res.json({
            success: false,
            error: 'Gabim në OpenAI: ' + error.message
        });
    }
});

module.exports = router;
