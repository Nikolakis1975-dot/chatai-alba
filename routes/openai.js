// 🔥 routes/openai.js - VERSION FINAL QË FUNKSIONON
const express = require('express');
const router = express.Router();
const OpenAI = require("openai");

console.log('🚀 OPENAI ROUTES - Loading FINAL Version...');

// ✅ ROUTE PËR OPENAI CHAT - VERSION FINAL
router.post('/chat', async (req, res) => {
    try {
        const { message, userId } = req.body;
        
        console.log('🎯 OPENAI CHAT FINAL - Message:', message);
        
        if (!message) {
            return res.json({ success: false, error: 'Nuk ka mesazh' });
        }

        // ✅ PËRDOR ENVIRONMENT VARIABLE DIRECT - 100% SI SISTEMI RADICAL
        const apiKey = process.env.OPENAI_API_KEY;
        
        if (!apiKey) {
            console.log('❌ Nuk ka OPENAI_API_KEY në environment');
            return res.json({
                success: false,
                error: 'OpenAI API Key nuk është konfiguruar në server.'
            });
        }

        console.log('✅ Duke përdorur Environment Variable (Radical Method)');
        console.log('🔑 API Key i përdorur:', apiKey.substring(0, 20) + '...');

        // ✅ KRIJO OPENAI CLIENT (NJËJITË SI RADICAL)
        const openai = new OpenAI({ 
            apiKey: apiKey 
        });

        // ✅ THIRR OPENAI API (NJËJITË SI RADICAL)
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
        console.log('🎉 OPENAI FINAL - Përgjigje e suksesshme!');
        
        return res.json({
            success: true,
            response: `🔮 **OpenAI RRUFE-TESLA**: ${responseText}`,
            source: 'environment_radical_method',
            tokens: completion.usage?.total_tokens
        });

    } catch (error) {
        console.error('❌ OPENAI FINAL ERROR:', error.message);
        return res.json({
            success: false,
            error: 'OpenAI: ' + error.message
        });
    }
});

module.exports = router;
