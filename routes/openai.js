// 🔥 routes/openai.js - VERSION ME DEBUG EKSTREM
const express = require('express');
const router = express.Router();
const OpenAI = require("openai");

console.log('🚀 OPENAI ROUTES - Loading DEBUG Version...');

// ✅ ROUTE PËR OPENAI CHAT - ME DEBUG EKSTREM
router.post('/chat', async (req, res) => {
    try {
        const { message, userId } = req.body;
        
        console.log('🎯🎯🎯 [DEBUG-EKSTREM] OPENAI CHAT - Message:', message);
        
        if (!message) {
            return res.json({ success: false, error: 'Nuk ka mesazh' });
        }

        // ✅ DEBUG EKSTREM - KONTROLLO ENVIRONMENT VARIABLES
        console.log('🔍🔍🔍 [DEBUG-EKSTREM] Environment Variables Check:');
        console.log('🔍🔍🔍 [DEBUG-EKSTREM] OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
        console.log('🔍🔍🔍 [DEBUG-EKSTREM] OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length);
        console.log('🔍🔍🔍 [DEBUG-EKSTREM] OPENAI_API_KEY starts with:', process.env.OPENAI_API_KEY?.substring(0, 10));
        console.log('🔍🔍🔍 [DEBUG-EKSTREM] All env vars:', Object.keys(process.env).filter(key => key.includes('OPENAI')));
        
        // ✅ PËRDOR ENVIRONMENT VARIABLE DIRECT
        const apiKey = process.env.OPENAI_API_KEY;
        
        if (!apiKey) {
            console.log('❌❌❌ [DEBUG-EKSTREM] OPENAI_API_KEY NUK EKZISTON!');
            return res.json({
                success: false,
                error: 'OPENAI_API_KEY nuk u gjet në environment variables.'
            });
        }

        console.log('✅✅✅ [DEBUG-EKSTREM] Duke përdorur Environment Variable');
        console.log('🔑🔑🔑 [DEBUG-EKSTREM] API Key i përdorur:', apiKey.substring(0, 20) + '...');

        // ✅ KRIJO OPENAI CLIENT
        const openai = new OpenAI({ 
            apiKey: apiKey 
        });

        console.log('🚀🚀🚀 [DEBUG-EKSTREM] Duke thirrur OpenAI API...');

        // ✅ THIRR OPENAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { 
                    role: "system", 
                    content: "Ti je RRUFE-TESLA AI. Përgjigju në shqip." 
                },
                { 
                    role: "user", 
                    content: message 
                }
            ],
            max_tokens: 500
        });

        const responseText = completion.choices[0].message.content;
        console.log('🎉🎉🎉 [DEBUG-EKSTREM] OPENAI FINAL - SUKSES!');
        
        return res.json({
            success: true,
            response: `🔮 **OpenAI RRUFE-TESLA**: ${responseText}`,
            source: 'environment_debug_version'
        });

    } catch (error) {
        console.error('❌❌❌ [DEBUG-EKSTREM] OPENAI ERROR:', error.message);
        console.error('❌❌❌ [DEBUG-EKSTREM] ERROR STACK:', error.stack);
        return res.json({
            success: false,
            error: 'OpenAI: ' + error.message
        });
    }
});

// ✅ ROUTE TEST EKSTREM
router.get('/debug-env', (req, res) => {
    console.log('🔍🔍🔍 [DEBUG-ROUTE] Duke kontrolluar environment variables...');
    
    const envInfo = {
        openaiKeyExists: !!process.env.OPENAI_API_KEY,
        openaiKeyLength: process.env.OPENAI_API_KEY?.length,
        openaiKeyStart: process.env.OPENAI_API_KEY?.substring(0, 15),
        allOpenAiVars: Object.keys(process.env).filter(key => key.includes('OPENAI')),
        nodeEnv: process.env.NODE_ENV
    };
    
    console.log('📊📊📊 [DEBUG-ROUTE] Environment Info:', envInfo);
    
    res.json({
        success: true,
        message: 'DEBUG Environment Variables',
        data: envInfo
    });
});

module.exports = router;
