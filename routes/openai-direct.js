const express = require('express');
const db = require('../database');
const encryption = require('../utils/encryption');
const jwt = require('jsonwebtoken');
const router = express.Router();

// ✅ AUTHENTICATION SIMPLE
const authenticateToken = (req, res, next) => {
    try {
        const token = req.cookies.auth_token;
        if (!token) return res.status(401).json({ success: false, error: 'Jo i loguar' });
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_2024');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, error: 'Session i pavlefshëm' });
    }
};

// ✅ ROUTA E RE E DREJTPËRDREDHT
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

                } catch (openaiError) {
                    console.error('❌ OpenAI API error:', openaiError);
                    res.json({ 
                        success: false, 
                        error: 'OpenAI API: ' + openaiError.message 
                    });
                }
            }
        );

    } catch (error) {
        console.error('❌ Gabim i përgjithshëm:', error);
        res.json({ success: false, error: 'Gabim në server' });
    }
});

module.exports = router;
