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
        timestamp: new Date().toISOString(),
        version: 'RRUFE-TESLA 10.5'
    });
});

// ✅ CHAT ROUTE - DIRECT TO OPENAI API
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        console.log('🔮 OpenAI Direct - Mesazh i marrë:', message?.substring(0, 100));

        if (!message || !message.trim()) {
            return res.json({
                success: false,
                error: "Mesazhi është bosh."
            });
        }

        // ✅ MER API KEY NGA DATABASE
        const apiRow = await new Promise((resolve) => {
            db.get(
                "SELECT api_key FROM api_keys WHERE service_name = ? AND user_id = ?",
                ['openai', 1], // Përdor user_id = 1 për test
                (err, row) => {
                    if (err) {
                        console.error('❌ Gabim në database:', err);
                        resolve(null);
                    } else {
                        resolve(row);
                    }
                }
            );
        });

        if (!apiRow || !apiRow.api_key) {
            return res.json({
                success: false,
                error: "❌ Nuk ka API Key OpenAI në server. Vendosni API Key përmes panelit të adminit."
            });
        }

        const apiKey = apiRow.api_key;

        // ✅ KONTROLLO NËSE API KEY ËSHTË VALID
        if (!apiKey.startsWith('sk-')) {
            return res.json({
                success: false,
                error: "❌ API Key OpenAI i pavlefshëm. Duhet të fillojë me 'sk-'"
            });
        }

        console.log('🔑 API Key u gjet, duke dërguar te OpenAI...');

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
                        content: 'Ti je RRUFE-TESLA AI. Përgjigju në shqip dhe jij i shkurtër.' 
                    },
                    { 
                        role: 'user', 
                        content: message 
                    }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        // ✅ MER PËRGJIGJEN
        const data = await openaiResponse.json();
        console.log('📥 Përgjigje nga OpenAI API:', data);

        if (data.error) {
            throw new Error(data.error.message);
        }

        const reply = data.choices?.[0]?.message?.content || 'Nuk ka përgjigje nga OpenAI';
        
        res.json({
            success: true,
            response: `🔮 **OpenAI RRUFE-TESLA**: ${reply}`
        });

    } catch (error) {
        console.error('❌ Gabim në OpenAI Direct:', error);
        res.json({
            success: false,
            error: 'Gabim në OpenAI: ' + error.message
        });
    }
});

// ✅ STATUS ROUTE
router.get('/status', (req, res) => {
    db.get(
        "SELECT api_key FROM api_keys WHERE service_name = ? AND user_id = ?",
        ['openai', 1],
        (err, row) => {
            if (err) {
                return res.json({ success: false, error: 'Gabim në database' });
            }
            
            res.json({
                success: true,
                hasApiKey: !!(row && row.api_key),
                message: row && row.api_key ? 'OpenAI i konfiguruar' : 'OpenAI jo i konfiguruar',
                service: 'OpenAI Direct'
            });
        }
    );
});

module.exports = router;
