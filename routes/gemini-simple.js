const express = require('express');
const db = require('../database');
const encryption = require('../utils/encryption');
const router = express.Router();

// ✅ FUNKSION I THJESHTË PËR GEMINI
router.post('/chat', async (req, res) => {
    try {
        const { message, userId } = req.body;
        
        console.log('💬 Kërkesë Gemini:', { userId, message });

        if (!message) {
            return res.json({ 
                success: false, 
                response: '❌ Ju lutem shkruani një mesazh.' 
            });
        }

        // ✅ Merr API Key nga databaza
        db.get(
            'SELECT api_key FROM api_keys WHERE user_id = ? AND service_name = ?',
            [userId, 'gemini'],
            async (err, row) => {
                if (err) {
                    console.error('❌ Gabim database:', err);
                    return res.json({ 
                        success: false, 
                        response: '❌ Gabim në server' 
                    });
                }

                if (!row || !row.api_key) {
                    console.log('❌ Nuk ka API Key për user:', userId);
                    return res.json({ 
                        success: false, 
                        response: '❌ Nuk ka API Key. Përdor /apikey [key_jote]' 
                    });
                }

                try {
                    // ✅ Dekripto API Key
                    const apiKey = encryption.decrypt(row.api_key);
                    console.log('🔑 API Key u dekriptua');

                    // ✅ Përdor Gemini 1.5 Flash (model stabil)
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
                    
                    console.log('🚀 Duke dërguar në Gemini...');

                    const response = await fetch(apiUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{ text: message }]
                            }],
                            generationConfig: {
                                temperature: 0.7,
                                maxOutputTokens: 1000,
                            }
                        })
                    });

                    console.log('📨 Statusi:', response.status);

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('❌ Gabim Gemini:', response.status, errorText);
                        
                        if (response.status === 401) {
                            return res.json({
                                success: false,
                                response: '❌ API Key i pavlefshëm. Kontrollo API Key.'
                            });
                        }
                        
                        return res.json({
                            success: false,
                            response: '❌ Gabim në Gemini API. Provo përsëri.'
                        });
                    }

                    const data = await response.json();
                    console.log('✅ Përgjigja u mor');
                    
                    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                        const geminiResponse = data.candidates[0].content.parts[0].text;
                        
                        // ✅ Ruaj në historinë
                        db.run(
                            'INSERT INTO messages (user_id, message, response, timestamp) VALUES (?, ?, ?, datetime("now"))',
                            [userId, message, geminiResponse],
                            (err) => {
                                if (err) console.error('❌ Gabim në ruajtje:', err);
                            }
                        );

                        res.json({
                            success: true,
                            response: geminiResponse
                        });
                    } else {
                        console.error('❌ Struktura e gabuar:', data);
                        res.json({
                            success: false,
                            response: "❌ Nuk u mor përgjigje e pritshme"
                        });
                    }

                } catch (geminiError) {
                    console.error('❌ Gabim Gemini API:', geminiError);
                    res.json({ 
                        success: false, 
                        response: '❌ Gabim në Gemini: ' + geminiError.message 
                    });
                }
            }
        );

    } catch (error) {
        console.error('❌ Gabim i përgjithshëm:', error);
        res.json({ 
            success: false, 
            response: '❌ Gabim në server. Provo përsëri.' 
        });
    }
});

// ✅ TEST ROUTE
router.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: '✅ Gemini Simple Route është punuese!',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
