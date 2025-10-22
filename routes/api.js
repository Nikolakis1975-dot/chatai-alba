const express = require('express');
const db = require('../database');
const encryption = require('../utils/encryption');
const jwt = require('jsonwebtoken');
const router = express.Router();

// ✅ MIDDLEWARE PËR AUTHENTICATION ME HTTP-ONLY COOKIE
const authenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies.auth_token;
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Nuk jeni i loguar' 
            });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_2024');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: 'Session i pavlefshëm' 
        });
    }
};

// ✅ 1. RUAJ API KEY (ENDPOINT I RI)
router.post('/save', authenticateToken, async (req, res) => {
    try {
        const { apiKey, serviceName = 'gemini' } = req.body;
        const userId = req.user.userId;

        if (!apiKey) {
            return res.status(400).json({ 
                success: false, 
                message: 'API Key është i zbrazët' 
            });
        }

        console.log(`📥 Ruajtje API Key për user ${userId}, shërbim: ${serviceName}`);

        // Enkripto API Key
        const encryptedApiKey = encryption.encrypt(apiKey);

        // Kontrollo nëse ekziston duke përdorur Promise
        new Promise((resolve, reject) => {
            db.get(
                'SELECT id FROM api_keys WHERE user_id = ? AND service_name = ?',
                [userId, serviceName],
                (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                }
            );
        })
        .then(row => {
            if (row) {
                // UPDATE ekzistues
                db.run(
                    'UPDATE api_keys SET api_key = ? WHERE user_id = ? AND service_name = ?',
                    [encryptedApiKey, userId, serviceName],
                    function(err) {
                        if (err) {
                            console.error('❌ Gabim gjatë update:', err);
                            return res.status(500).json({ 
                                success: false, 
                                message: 'Gabim gjatë përditësimit të API Key' 
                            });
                        }
                        res.json({ 
                            success: true,
                            message: '✅ API Key u përditësua me sukses!' 
                        });
                    }
                );
            } else {
                // INSERT i ri
                db.run(
                    'INSERT INTO api_keys (user_id, api_key, service_name) VALUES (?, ?, ?)',
                    [userId, encryptedApiKey, serviceName],
                    function(err) {
                        if (err) {
                            console.error('❌ Gabim gjatë insert:', err);
                            return res.status(500).json({ 
                                success: false, 
                                message: 'Gabim gjatë ruajtjes së API Key' 
                            });
                        }
                        res.json({ 
                            success: true,
                            message: '✅ API Key u ruajt me sukses!' 
                        });
                    }
                );
            }
        })
        .catch(err => {
            console.error('❌ Gabim në database:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Gabim në server' 
            });
        });

    } catch (error) {
        console.error('❌ Gabim gjatë enkriptimit:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Gabim në server gjatë enkriptimit' 
        });
    }
});

// ✅ 2. FSHI API KEY (ENDPOINT I RI)
router.delete('/delete', authenticateToken, async (req, res) => {
    try {
        const { serviceName = 'gemini' } = req.body;
        const userId = req.user.userId;

        console.log(`🗑️ Fshirje API Key për user ${userId}, shërbim: ${serviceName}`);

        db.run(
            'DELETE FROM api_keys WHERE user_id = ? AND service_name = ?',
            [userId, serviceName],
            function(err) {
                if (err) {
                    console.error('❌ Gabim gjatë fshirjes:', err);
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Gabim gjatë fshirjes së API Key' 
                    });
                }
                res.json({ 
                    success: true,
                    message: '✅ API Key u fshi me sukses!' 
                });
            }
        );
    } catch (error) {
        console.error('❌ Gabim në fshirje:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Gabim i brendshëm i serverit' 
        });
    }
});

// ✅ 3. STATUS I API KEY (ENDPOINT I RI) - ME AUTHENTICATION
router.get('/status/:serviceName', authenticateToken, async (req, res) => {
    try {
        const { serviceName } = req.params;
        const userId = req.user.userId;

        console.log(`🔍 Kontrollo status API Key për user ${userId}, shërbim: ${serviceName}`);

        db.get(
            'SELECT id, created_at FROM api_keys WHERE user_id = ? AND service_name = ?',
            [userId, serviceName],
            (err, row) => {
                if (err) {
                    console.error('❌ Gabim në database:', err);
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Gabim në server' 
                    });
                }

                console.log(`📊 Rezultati i kërkimit:`, row);

                if (row) {
                    res.json({ 
                        success: true,
                        hasApiKey: true, 
                        createdAt: row.created_at 
                    });
                } else {
                    res.json({ 
                        success: true,
                        hasApiKey: false 
                    });
                }
            }
        );
    } catch (error) {
        console.error('❌ Gabim në status check:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Gabim i brendshëm i serverit' 
        });
    }
});

// ✅ 4. MER API KEY (ENDPOINT I RI)
router.get('/get/:serviceName', authenticateToken, async (req, res) => {
    try {
        const { serviceName } = req.params;
        const userId = req.user.userId;

        console.log(`📥 Kërkesë për API Key: ${serviceName}, user: ${userId}`);

        db.get(
            'SELECT api_key FROM api_keys WHERE user_id = ? AND service_name = ?',
            [userId, serviceName],
            (err, row) => {
                if (err) {
                    console.error('❌ Gabim në database:', err);
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Gabim në server' 
                    });
                }

                if (row && row.api_key) {
                    try {
                        // Dekripto API Key
                        const decryptedApiKey = encryption.decrypt(row.api_key);
                        console.log(`✅ API Key u gjet dhe u dekriptua për user ${userId}`);
                        
                        res.json({ 
                            success: true, 
                            apiKey: decryptedApiKey 
                        });
                    } catch (decryptError) {
                        console.error('❌ Gabim në dekriptim:', decryptError);
                        res.json({ 
                            success: false, 
                            message: 'Gabim në dekriptimin e API Key' 
                        });
                    }
                } else {
                    console.log(`❌ Nuk u gjet API Key për user ${userId}`);
                    res.json({ 
                        success: false, 
                        message: 'Nuk u gjet API Key për këtë shërbim' 
                    });
                }
            }
        );
    } catch (error) {
        console.error('❌ Gabim në marrjen e API Key:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Gabim i brendshëm i serverit' 
        });
    }
});

// ✅ 5. ENDPOINT-ET E VJETRA PËR KOMPATIBILITET
router.post('/save-old', async (req, res) => {
    try {
        const { userId, apiKey, serviceName } = req.body;

        if (!userId || !apiKey) {
            return res.status(400).json({ 
                success: false,
                message: 'Të dhëna të pamjaftueshme' 
            });
        }

        const encryptedApiKey = encryption.encrypt(apiKey);

        db.get(
            'SELECT id FROM api_keys WHERE user_id = ? AND service_name = ?',
            [userId, serviceName || 'gemini'],
            (err, row) => {
                if (err) {
                    return res.status(500).json({ 
                        success: false,
                        message: 'Gabim në server' 
                    });
                }

                if (row) {
                    // Update ekzistues
                    db.run(
                        'UPDATE api_keys SET api_key = ? WHERE user_id = ? AND service_name = ?',
                        [encryptedApiKey, userId, serviceName || 'gemini'],
                        function(err) {
                            if (err) {
                                console.error('❌ Gabim gjatë update:', err);
                                return res.status(500).json({ 
                                    success: false, 
                                    message: 'Gabim gjatë përditësimit të API Key' 
                                });
                            }
                            res.json({ 
                                success: true,
                                message: '✅ API Key u përditësua me sukses!' 
                            });
                        }
                    );
                } else {
                    // Krijo të ri
                    db.run(
                        'INSERT INTO api_keys (user_id, api_key, service_name) VALUES (?, ?, ?)',
                        [userId, encryptedApiKey, serviceName || 'gemini'],
                        function(err) {
                            if (err) {
                                console.error('❌ Gabim gjatë insert:', err);
                                return res.status(500).json({ 
                                    success: false, 
                                    message: 'Gabim gjatë ruajtjes së API Key' 
                                });
                            }
                            res.json({ 
                                success: true,
                                message: '✅ API Key u ruajt me sukses!' 
                            });
                        }
                    );
                }
            }
        );
    } catch (error) {
        console.error('❌ Gabim në save-old:', error);
        res.status(500).json({ 
            success: false,
            message: 'Gabim në server gjatë enkriptimit' 
        });
    }
});

// ✅ 6. STATUS I VJETËR PËR KOMPATIBILITET
router.get('/status-old/:userId/:serviceName?', (req, res) => {
    const { userId, serviceName } = req.params;

    db.get(
        'SELECT id, created_at FROM api_keys WHERE user_id = ? AND service_name = ?',
        [userId, serviceName || 'gemini'],
        (err, row) => {
            if (err) {
                console.error('❌ Gabim në database:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Gabim në server' 
                });
            }

            if (row) {
                res.json({ 
                    success: true,
                    hasApiKey: true, 
                    createdAt: row.created_at 
                });
            } else {
                res.json({ 
                    success: true,
                    hasApiKey: false 
                });
            }
        }
    );
});

// ✅ 7. FUNKSIONI I CHAT PËR GEMINI 2.5 FLASH (VERSION I RI)
// ✅ 7. FUNKSIONI I CHAT PËR GEMINI 2.5 FLASH (VERSION I KORRIGJUAR)
router.post('/chat', authenticateToken, async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.userId;
        
        console.log(`🤖 Duke përpunuar kërkesë chat për user ${userId}: ${message}`);

        if (!message) {
            return res.json({ 
                success: false, 
                response: '❌ Ju lutem shkruani një mesazh.' 
            });
        }

        // ✅ Merr API Key direkt nga databaza
        db.get(
            'SELECT api_key FROM api_keys WHERE user_id = ? AND service_name = ?',
            [userId, 'gemini'],
            async (err, row) => {
                if (err) {
                    console.error('❌ Gabim në database:', err);
                    return res.json({ 
                        success: false, 
                        response: '❌ Gabim në server' 
                    });
                }

                if (!row || !row.api_key) {
                    console.log('❌ API Key nuk u gjet për user:', userId);
                    return res.json({ 
                        success: false, 
                        response: '❌ API Key nuk u gjet. Përdor /apikey [key_jote]' 
                    });
                }

                try {
                    // ✅ Dekripto API Key
                    const apiKey = encryption.decrypt(row.api_key);
                    console.log('🔑 API Key u dekriptua');
                    
                    // ✅ Përdor URL-n e saktë për Gemini 2.5 Flash
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;
                    
                    console.log('🚀 Duke dërguar request në Gemini 2.5 Flash...');

                    const response = await fetch(apiUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "x-goog-api-key": apiKey  // ✅ HEADER I SAKTË!
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: message
                                }]
                            }],
                            generationConfig: {
                                temperature: 0.7,
                                maxOutputTokens: 1000,
                            }
                        })
                    });

                    console.log('📨 Statusi i përgjigjes:', response.status);

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('❌ Gabim nga Gemini API:', response.status, errorText);
                        
                        if (response.status === 401 || response.status === 403) {
                            return res.json({
                                success: false,
                                response: '❌ API Key i pavlefshëm. Kontrollo API Key.'
                            });
                        } else if (response.status === 404) {
                            // ✅ Fallback në Gemini 1.5 Flash
                            console.log('🔄 Gemini 2.5 nuk u gjet, duke provuar Gemini 1.5 Flash...');
                            return await tryGeminiFallback(apiKey, message, userId, res);
                        }
                        
                        return res.json({
                            success: false,
                            response: `❌ Gabim në Gemini API (${response.status}). Provo përsëri.`
                        });
                    }

                    const data = await response.json();
                    console.log('✅ Përgjigja nga Gemini 2.5 Flash u mor me sukses!');
                    
                    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                        const geminiResponse = data.candidates[0].content.parts[0].text;
                        
                        console.log('💬 Përgjigja:', geminiResponse.substring(0, 100) + '...');
                        
                        // ✅ Ruaj në historinë e bisedave
                        db.run(
                            'INSERT INTO messages (user_id, message, response, timestamp) VALUES (?, ?, ?, datetime("now"))',
                            [userId, message, geminiResponse],
                            (err) => {
                                if (err) console.error('❌ Gabim në ruajtjen e mesazhit:', err);
                                else console.log('💾 Mesazhi u ruajt në historinë');
                            }
                        );

                        res.json({
                            success: true,
                            response: geminiResponse
                        });
                    } else {
                        console.error('❌ Struktura e papritur e përgjigjes:', data);
                        res.json({
                            success: false,
                            response: "❌ Nuk u mor përgjigje e pritshme nga Gemini 2.5 Flash"
                        });
                    }

                } catch (geminiError) {
                    console.error('❌ Gabim gjatë thirrjes së Gemini API:', geminiError);
                    res.json({ 
                        success: false, 
                        response: '❌ Gabim në Gemini: ' + geminiError.message 
                    });
                }
            }
        );

    } catch (error) {
        console.error('❌ Gabim i përgjithshëm në /chat:', error);
        res.json({ 
            success: false, 
            response: '❌ Gabim në server. Provo përsëri.' 
        });
    }
});

// ✅ 8. FUNKSION FALLBACK PËR GEMINI 1.5 FLASH
async function tryGeminiFallback(apiKey, message, userId, res) {
    try {
        console.log('🔄 Duke provuar Gemini 1.5 Flash si fallback...');
        
        const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;
        
        const response = await fetch(fallbackUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey
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

        if (!response.ok) {
            throw new Error(`Fallback failed: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            const geminiResponse = data.candidates[0].content.parts[0].text;
            
            // ✅ Ruaj në historinë e bisedave
            db.run(
                'INSERT INTO messages (user_id, message, response, timestamp) VALUES (?, ?, ?, datetime("now"))',
                [userId, message, geminiResponse],
                (err) => {
                    if (err) console.error('❌ Gabim në ruajtjen e mesazhit:', err);
                }
            );

            return res.json({
                success: true,
                response: geminiResponse
            });
        } else {
            throw new Error('No response from fallback model');
        }
    } catch (fallbackError) {
        console.error('❌ Gabim në fallback:', fallbackError);
        return res.json({
            success: false,
            response: '❌ Asnjë model Gemini nuk funksionon. Kontrollo API Key.'
        });
    }
}

// ======================= RRUFE-API-001 =======================
// ✅ RRUFE API - Shto në fund të routes/api.js EKZISTUES
// =============================================================

// ✅ RRUFE API - Historiku i mesazheve
app.get('/api/rrufe/messages/history', async (req, res) => {
    try {
        console.log('🔍 RRUFE API: Duke marrë historinë...');
        
        const messages = await req.db.all(`
            SELECT m.*, u.username 
            FROM messages m 
            LEFT JOIN users u ON m.user_id = u.id 
            ORDER BY m.timestamp DESC
            LIMIT 20
        `);
        
        res.json({ success: true, messages });
        
    } catch (error) {
        console.error('❌ RRUFE API: Gabim:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// =================================== ✅ RRUFE API - Statistika ===============================================
app.get('/api/rrufe/analytics/overview', async (req, res) => {
    try {
        console.log('🔍 RRUFE ANALYTICS: Duke gjeneruar...');
        
        const stats = await req.db.all(`
            SELECT 
                COUNT(*) as total_messages,
                COUNT(DISTINCT user_id) as total_users
            FROM messages
        `);
        
        res.json({ success: true, stats: stats[0] });
        
    } catch (error) {
        console.error('❌ RRUFE ANALYTICS: Gabim:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
