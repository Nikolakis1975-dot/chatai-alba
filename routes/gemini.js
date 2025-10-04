const express = require('express');
const db = require('../database');
const encryption = require('../utils/encryption');
const jwt = require('jsonwebtoken');
const router = express.Router();

// ✅ MIDDLEWARE PËR AUTHENTICATION ME HTTP-ONLY COOKIE
const authenticateToken = (req, res, next) => {
    try {
        const token = req.cookies.auth_token;
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                error: '❌ Nuk jeni i loguar' 
            });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_2024');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            error: '❌ Session i pavlefshëm' 
        });
    }
};

// ✅ API PËR TË KOMUNIKUAR ME GEMINI 2.0 FLASH - MODELI I VJETËR QË PUNON
router.post('/ask', authenticateToken, async (req, res) => {
    const { message } = req.body;
    
    console.log('🔐 User objekti nga token:', req.user);
    console.log('📝 Mesazhi:', message);
    
    const userId = req.user.userId;

    console.log('💬 Duke përpunuar kërkesë për Gemini:', { 
        userId, 
        message: message ? message.substring(0, 50) + '...' : 'No message' 
    });

    if (!message) {
        return res.status(400).json({ 
            success: false, 
            error: '❌ Mesazhi është i zbrazët' 
        });
    }

    try {
        // Merr API Key nga databaza për këtë user
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

                console.log('📊 Rezultati nga databaza:', row);
                
                if (!row || !row.api_key) {
                    console.log('❌ API Key nuk u gjet për user:', userId);
                    return res.status(400).json({ 
                        success: false, 
                        error: '❌ Nuk është konfiguruar API Key për Gemini. Përdor /apikey [key_jote]' 
                    });
                }

                try {
                    // Dekripto API Key me AES-256
                    console.log('🔓 Duke dekriptuar API Key...');
                    const apiKey = encryption.decrypt(row.api_key);
                    console.log('✅ API Key u dekriptua me sukses');

                    // ✅ PËRDOR MODELIN E VJETËR QË PUNON: gemini-2.0-flash
                    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
                    
                    console.log("🌐 Duke bërë thirrje në Gemini API...");

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

// ✅ RUTA TESTUESE
router.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: '✅ Ruta e Gemini është punuese!',
        timestamp: new Date().toISOString()
    });
});

// ✅ ENDPOINT PËR TESTIM TË DEKRIPTIMIT
router.get('/test-decrypt', authenticateToken, (req, res) => {
    const userId = req.user.userId;

    db.get(
        'SELECT api_key FROM api_keys WHERE user_id = ? AND service_name = ?',
        [userId, 'gemini'],
        (err, row) => {
            if (err) {
                console.error('❌ Gabim në database:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: '❌ Gabim në server' 
                });
            }

            if (!row || !row.api_key) {
                return res.json({ 
                    success: false, 
                    message: '❌ Nuk u gjet API Key' 
                });
            }

            try {
                console.log('🔐 API Key i enkriptuar:', row.api_key);
                const decryptedKey = encryption.decrypt(row.api_key);
                console.log('🔓 API Key i dekriptuar:', decryptedKey);
                
                res.json({
                    success: true,
                    encrypted: row.api_key,
                    decrypted: decryptedKey,
                    length: decryptedKey ? decryptedKey.length : 0
                });
            } catch (decryptError) {
                console.error('❌ Gabim në dekriptim:', decryptError);
                res.json({
                    success: false,
                    error: '❌ Gabim në dekriptim: ' + decryptError.message
                });
            }
        }
    );
});

module.exports = router;
