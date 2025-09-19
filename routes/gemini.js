const express = require('express');
const db = require('../database');
const encryption = require('../utils/encryption');
const router = express.Router();

// API për të komunikuar me Gemini 2.0 Flash
router.post('/ask', async (req, res) => {
    const { userId, message } = req.body;

    console.log('💬 Duke përpunuar kërkesë për Gemini:', { userId, message: message.substring(0, 50) + '...' });

    if (!userId || !message) {
        return res.status(400).json({ success: false, error: '❌ Të dhëna të pamjaftueshme' });
    }

    try {
        // Merr API Key nga databaza
        db.get(
            'SELECT api_key FROM api_keys WHERE user_id = ? AND service_name = ?',
            [userId, 'gemini'],
            async (err, row) => {
                if (err) {
                    console.error('❌ Gabim në database:', err);
                    return res.status(500).json({ success: false, error: '❌ Gabim në server' });
                }

                if (!row || !row.api_key) {
                    console.log('❌ API Key nuk u gjet për user:', userId);
                    return res.status(400).json({ 
                        success: false, 
                        error: '❌ API Key nuk u gjet. Përdor /apikey [key_jote]' 
                    });
                }

                try {
                    // Dekripto API Key me AES-256
                    console.log('🔓 Duke dekriptuar API Key...');
                    const apiKey = encryption.decrypt(row.api_key);
                    console.log('✅ API Key u dekriptua me sukses');

                    // Bëj thirrjen aktuale të Gemini API
                    console.log("🌐 Duke bërë thirrje në Gemini API...");
                    
                    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
                    
                    const response = await fetch(apiUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-goog-api-key": apiKey
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: message
                                }]
                            }],
                            generationConfig: {
                                temperature: 0.7,
                                topK: 40,
                                topP: 0.95,
                                maxOutputTokens: 1024,
                            }
                        })
                    });

                    console.log('📨 Përgjigja nga Gemini - Status:', response.status);

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('❌ Gabim nga Gemini API:', errorText);
                        
                        if (response.status === 401 || response.status === 403) {
                            return res.status(400).json({ 
                                success: false, 
                                error: '❌ API Key i pasaktë' 
                            });
                        }
                        
                        throw new Error(`❌ Gabim Gemini API: ${response.status}`);
                    }

                    const data = await response.json();

                    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                        res.json({
                            success: true,
                            response: data.candidates[0].content.parts[0].text
                        });
                    } 
                    else if (data.error) {
                        res.json({
                            success: false,
                            error: "❌ Gabim nga Gemini: " + data.error.message
                        });
                    }
                    else {
                        console.error('❌ Struktura e papritur e përgjigjes:', data);
                        res.json({
                            success: false,
                            error: "❌ Nuk u mor përgjigje e pritshme"
                        });
                    }

                } catch (geminiError) {
                    console.error('❌ Gabim gjatë thirrjes së Gemini API:', geminiError);
                    res.status(500).json({ 
                        success: false, 
                        error: '❌ Gabim gjatë thirrjes: ' + geminiError.message 
                    });
                }
            }
        );
    } catch (error) {
        console.error('❌ Gabim i përgjithshëm:', error);
        res.status(500).json({ 
            success: false, 
            error: '❌ Gabim në server: ' + error.message 
        });
    }
});

// Ruta testuese
router.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: '✅ Ruta e Gemini është punuese!',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;