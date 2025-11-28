// 🔥 routes/openai.js - VERSION RADICAL (FUNKSIONON)
const express = require('express');
const router = express.Router();
const OpenAI = require("openai");

console.log('🚀 OPENAI ROUTES - Loading Radical Version...');

// ✅ ROUTE PËR OPENAI CHAT - VERSION RADICAL QË FUNKSIONON
router.post('/chat', async (req, res) => {
    try {
        const { message, userId } = req.body;
        
        console.log('🔮 OPENAI CHAT RADICAL - Message:', message);
        
        if (!message) {
            return res.json({ success: false, error: 'Nuk ka mesazh' });
        }

        // ✅ 1. PROVO ENVIRONMENT VARIABLE DIRECT (SI SISTEMI RADICAL)
        let apiKey = process.env.OPENAI_API_KEY;
        let source = 'environment';
        
        // ✅ 2. NËSE NUK KA ENVIRONMENT, PROVO DATABASE PA ENKRIPTIM
        if (!apiKey) {
            console.log('⚠️ Nuk ka environment variable, duke provuar database...');
            const db = require('../database');
            const apiKeyRow = await new Promise((resolve) => {
                db.get(
                    'SELECT api_key FROM api_keys WHERE user_id = ? AND service_name = ?',
                    [userId || 1, 'openai'],
                    (err, row) => resolve(row)
                );
            });
            
            if (apiKeyRow && apiKeyRow.api_key) {
                // ✅ KONTROLLO NËSE ËSHTË I ENKRIPTUAR
                if (apiKeyRow.api_key.startsWith('sk-')) {
                    apiKey = apiKeyRow.api_key; // ✅ I paenkriptuar
                    source = 'database_plain';
                } else {
                    // ❌ I enkriptuar - provo dekriptim të thjeshtë
                    console.log('⚠️ API Key është i enkriptuar, duke provuar dekriptim...');
                    apiKey = apiKeyRow.api_key; // Përdor siç është (fallback)
                    source = 'database_encrypted';
                }
            }
        }

        if (!apiKey) {
            return res.json({
                success: false,
                error: 'Nuk ka OpenAI API Key të konfiguruar.'
            });
        }

        console.log('🔑 API Key source:', source);
        console.log('🔑 API Key:', apiKey.substring(0, 20) + '...');

        // ✅ 3. THIRR OPENAI (NJËJITË SI SISTEMI RADICAL)
        const openai = new OpenAI({ apiKey });
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Ti je RRUFE-TESLA AI. Përgjigju në shqip." },
                { role: "user", content: message }
            ],
            max_tokens: 1000
        });

        return res.json({
            success: true,
            response: `🔮 **OpenAI RRUFE-TESLA**: ${completion.choices[0].message.content}`,
            source: source
        });

    } catch (error) {
        console.error('❌ OPENAI CHAT ERROR:', error.message);
        return res.json({
            success: false,
            error: 'OpenAI: ' + error.message
        });
    }
});
