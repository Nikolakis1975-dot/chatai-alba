// ========================================================
// OpenAI Direct - RRUFE TESLA 10.5
// Rrugë e drejtpërdrejtë për OpenAI API
// ========================================================
const express = require('express');
const db = require('../database');
const encryption = require('../utils/encryption');
const jwt = require('jsonwebtoken');
const router = express.Router();

// ✅ AUTHENTICATION SIMPLE
const authenticateToken = (req, res, next) => {
    try {
        const token = req.cookies.auth_token;
        if (!token) {
            return res.status(401).json({ success: false, error: 'Jo i loguar' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_2024');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Session i pavlefshëm' });
    }
};

// ✅ CHAT ROUTE - DIRECT TO OPENAI API
router.post('/chat', authenticateToken, async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.userId;

        console.log('🔮 OpenAI Direct - User:', userId, 'Message:', message?.substring(0, 50));

        if (!message) {
            return res.json({ success: false, error: 'Mesazhi është i zbrazët' });
        }

        // ✅ MER API KEY NGA DATABASE
        db.get(
            'SELECT api_key FROM api_keys WHERE user_id = ? AND service_name = ?',
            [userId, 'openai'],
            async (err, row) => {
                if (err) {
                    console.error('❌ Database error:', err);
                    return res.json({ success: false, error: 'Gabim në server' });
                }

                if (!row || !row.api_key) {
                    return res.json({ success: false, error: 'Nuk ke OpenAI API Key!' });
                }

                try {
                    // ✅ DEKRIPTO API KEY
                    console.log('🔓 Duke dekriptuar API Key...');
                    const apiKey = encryption.decrypt(row.api_key);
                    
                    // ✅ KONTROLLO NËSE ËSHTË VALID
                    if (!apiKey.startsWith('sk-')) {
                        return res.json({ success: false, error: 'API Key i pavlefshëm' });
                    }

                    console.log('🌐 Duke dërguar te OpenAI API...');

                    // ✅ DËRGO TE OPENAI API DIRECT
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
                            max_tokens: 1000,
                            temperature: 0.7
                        })
                    });

                    const data = await openaiResponse.json();
                    console.log('📥 Përgjigje nga OpenAI API:', data);

                    if (data.error) {
                        throw new Error(data.error.message);
                    }

                    const reply = data.choices?.[0]?.message?.content || 'Nuk ka përgjigje';
                    
                    res.json({
                        success: true,
                        response: `🔮 **OpenAI RRUFE-TESLA**: ${reply}`
                    });

                } catch (apiError) {
                    console.error('❌ Gabim në OpenAI API:', apiError);
                    res.json({
                        success: false,
                        error: 'Gabim në OpenAI API: ' + apiError.message
                    });
                }
            }
        );

    } catch (error) {
        console.error('❌ Gabim i përgjithshëm:', error);
        res.json({
            success: false,
            error: 'Gabim në server: ' + error.message
        });
    }
});

// ✅ STATUS ROUTE
router.get('/status', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        db.get(
            'SELECT api_key FROM api_keys WHERE user_id = ? AND service_name = ?',
            [userId, 'openai'],
            (err, row) => {
                if (err) {
                    console.error('❌ Database error:', err);
                    return res.json({ success: false, error: 'Gabim në server' });
                }

                res.json({
                    success: true,
                    hasApiKey: !!(row && row.api_key),
                    message: row && row.api_key ? 'OpenAI Direct i konfiguruar' : 'OpenAI Direct jo i konfiguruar',
                    service: 'OpenAI Direct',
                    status: 'Active'
                });
            }
        );
    } catch (error) {
        res.json({ success: false, error: '❌ ' + error.message });
    }
});

// ✅ TEST ROUTE - PA AUTH
router.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: '✅ OpenAI Direct Routes janë operative!',
        timestamp: new Date().toISOString(),
        version: 'RRUFE-TESLA 10.5 - OpenAI Direct'
    });
});

module.exports = router;
