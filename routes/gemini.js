const express = require('express');
const db = require('../database');
const encryption = require('../utils/encryption');
const router = express.Router();

// ✅ API për Gemini me fetch direkt
router.post('/ask', async (req, res) => {
    const { userId, message } = req.body;

    console.log('💬 Duke përpunuar kërkesë për Gemini:', { userId, message });

    if (!userId || !message) {
        return res.status(400).json({ 
            success: false, 
            error: '❌ Të dhëna të pamjaftueshme' 
        });
    }

    try {
        // Merr API Key nga databaza
        db.get(
            'SELECT api_key FROM api_keys WHERE user_id = ? AND service_name = ?',
            [userId, 'gemini'],
            async (err, row) => {
                if (err) {
                    console.error('❌ Gabim në database:', err);
                    return res.status(500).json({ 
                        success: false, 
                        error: '❌ Gabim në server' 
                    });
                }

                if (!row || !row.api_key) {
                    return res.status(400).json({ 
                        success: false, 
                        error: '❌ API Key nuk u gjet. Përdor /apikey [key_jote]' 
                    });
                }

                try {
                    // Dekripto API Key
                    const apiKey = encryption.decrypt(row.api_key);
                    console.log('🔑 API Key u dekriptua');
                    
                    // ✅ Përdor Gemini API direkt me fetch
                    const response = await fetch(
                        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
                        {
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
                        }
                    );

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('❌ Gabim nga Gemini API:', response.status, errorText);
                        
                        if (response.status === 401 || response.status === 403) {
                            return res.json({
                                success: false,
                                error: '❌ API Key i pavlefshëm. Kontrollo API Key.'
                            });
                        }
                        
                        throw new Error(`HTTP ${response.status}: ${errorText}`);
                    }

                    const data = await response.json();
                    console.log('✅ Përgjigja nga Gemini u mor');
                    
                    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                        // ✅ Ruaj në historinë e bisedave
                        db.run(
                            'INSERT INTO messages (user_id, message, response, timestamp) VALUES (?, ?, ?, datetime("now"))',
                            [userId, message, data.candidates[0].content.parts[0].text],
                            (err) => {
                                if (err) console.error('❌ Gabim në ruajtjen e mesazhit:', err);
                            }
                        );

                        res.json({
                            success: true,
                            response: data.candidates[0].content.parts[0].text
                        });
                    } else {
                        console.error('❌ Struktura e papritur e përgjigjes:', data);
                        res.json({
                            success: false,
                            error: "❌ Nuk u mor përgjigje e pritshme nga Gemini"
                        });
                    }

                } catch (geminiError) {
                    console.error('❌ Gabim gjatë thirrjes së Gemini API:', geminiError);
                    res.json({ 
                        success: false, 
                        error: '❌ Gabim në Gemini: ' + geminiError.message 
                    });
                }
            }
        );
    } catch (error) {
        console.error('❌ Gabim i përgjithshëm:', error);
        res.status(500).json({ 
            success: false, 
            error: '❌ Gabim në server' 
        });
    }
});

// ✅ Ruta testuese
router.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: '✅ Ruta e Gemini është punuese!',
        timestamp: new Date().toISOString()
    });
});

// ✅ Ruta për testimin e API Key
router.post('/test-key', async (req, res) => {
    const { apiKey } = req.body;

    if (!apiKey) {
        return res.json({ 
            success: false, 
            message: '❌ Ju lutem jepni një API Key' 
        });
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: "Test: Pershendetje! A funksionon kjo?" }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 100,
                    }
                })
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: API Key i pavlefshëm`);
        }

        const data = await response.json();
        
        res.json({ 
            success: true, 
            message: '✅ API Key është VALID! Gemini 2.0 Flash funksionon.',
            response: data.candidates[0].content.parts[0].text
        });
    } catch (error) {
        res.json({ 
            success: false, 
            message: `❌ API Key është I PAVLEFSHËM: ${error.message}` 
        });
    }
});

module.exports = router;
