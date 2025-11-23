// Në routes/gemini.js - shto në fillim të skedarit
console.log('🎯 routes/gemini.js po ekzekutohet...');

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

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 🧠 RRUFE-TESLA 11.0 - LONG-TERM MEMORY INTEGRATION
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++

// 🎯 ROUTE E RE PËR GEMINI ME LONG-TERM MEMORY
router.post('/chat-with-memory', authenticateToken, async (req, res) => {
    const { message, ltmPayload, mode = 'SIMPLE' } = req.body;
    const userId = req.user.userId;

    console.log('🧠 LTM Request:', { 
        userId, 
        mode, 
        messageLength: message?.length,
        hasLTM: !!ltmPayload 
    });

    if (!message) {
        return res.status(400).json({ 
            success: false, 
            error: '❌ Mesazhi është i zbrazët' 
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
                        error: '❌ Nuk është konfiguruar API Key për Gemini' 
                    });
                }

                try {
                    // Dekripto API Key
                    const apiKey = encryption.decrypt(row.api_key);
                    
                    // 🧠 RRUFE-TESLA IDENTITY
                    const RRUFE_IDENTITY = `
TI JE RRUFE-TESLA 11.0 - Sistemi i Inteligjencës Artificiale Shqiptare!

IDENTITETI:
- Emri: RRUFE TESLA 11.0 - Versioni 11.0.0
- Specializimi: Inxhinieri, Energji, Teknologji, Shkencë
- Gjuha: Shqip (primare)
- Karakteri: Profesionist, i dobishëm, miqësor

STILI I PËRGJIGJES:
- Përgjigju në shqip si profesionist
- Ji i detajuar dhe i dobishëm
- Përdor emoji të përshtatshme 🎯⚡🔧
- Ofro zgjidhje praktike
`;

                    let finalPayload;
                    let ltm_used = false;

                    // 🎯 PËRDOR LTM NËSE KA PAYLOAD DHE ËSHTË MOD I AVANCUAR
                    if (ltmPayload && (mode === 'ADVANCED' || mode === 'DIVINE')) {
                        ltm_used = true;
                        console.log('🎯 Duke përdorur LTM integration...');

                        finalPayload = {
                            contents: ltmPayload.contents || [{ parts: [{ text: message }] }],
                            systemInstruction: {
                                parts: [{
                                    text: `${RRUFE_IDENTITY}

KONTEKSTI I BISEDËS (Nga Long-Term Memory):
${JSON.stringify(ltmPayload.contents || [], null, 2)}

MODALITETI: ${mode}

PËRGJIGJU SI RRUFE-TESLA 11.0 ME MEMORIE AFATGJATË!`
                                }]
                            },
                            generationConfig: {
                                temperature: mode === 'DIVINE' ? 0.9 : 0.7,
                                topK: 40,
                                topP: 0.95,
                                maxOutputTokens: mode === 'DIVINE' ? 2048 : 1024,
                            }
                        };
                    } else {
                        // 🔄 PËRDOR SISTEMIN E THJESHTË
                        console.log('🔹 Duke përdorur sistemin e thjeshtë...');
                        
                        finalPayload = {
                            contents: [{ parts: [{ text: message }] }],
                            systemInstruction: {
                                parts: [{
                                    text: `${RRUFE_IDENTITY}

MODALITETI: ${mode}

PËRGJIGJU SI RRUFE-TESLA 11.0!`
                                }]
                            },
                            generationConfig: {
                                temperature: 0.7,
                                topK: 40,
                                topP: 0.95,
                                maxOutputTokens: 1024,
                            }
                        };
                    }

                    // ✅ THIRR GEMINI API
                    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
                    
                    const response = await fetch(apiUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-goog-api-key": apiKey
                        },
                        body: JSON.stringify(finalPayload)
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('❌ Gabim nga Gemini API:', errorText);
                        throw new Error(`❌ Gabim Gemini API: ${response.status}`);
                    }

                    const data = await response.json();

                    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                        res.json({
                            success: true,
                            response: data.candidates[0].content.parts[0].text,
                            ltm_used: ltm_used,
                            memory_enhanced: ltm_used,
                            mode: mode,
                            timestamp: new Date().toISOString()
                        });
                    } else {
                        throw new Error('❌ Nuk u mor përgjigje e pritshme nga Gemini');
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

// ✅ HEALTH CHECK PËR LTM
router.get('/ltm-health', (req, res) => {
    res.json({ 
        success: true, 
        message: '✅ LTM Routes janë operative!',
        timestamp: new Date().toISOString(),
        version: 'RRUFE-TESLA-11.0-LTM'
    });
});

// ============================= ✅ RUTË E THJESHTË PA AUTH - PERFEKTE PËR RRUFE-TESLA ===============================
router.post('/simple-chat', async (req, res) => {
    try {
        const { message, userId = 1 } = req.body;
        
        console.log('🤖 [GEMINI_SIMPLE] Mesazhi:', message?.substring(0, 50));

        if (!message || message.trim() === '') {
            return res.json({ 
                success: false, 
                error: '❌ Mesazhi është i zbrazët' 
            });
        }

        // Merr API Key për user default (userId = 1)
        db.get(
            'SELECT api_key FROM api_keys WHERE user_id = ? AND service_name = ?',
            [userId, 'gemini'],
            async (err, row) => {
                if (err) {
                    console.error('❌ Gabim në database:', err);
                    return res.json({ 
                        success: false, 
                        error: '❌ Gabim në server' 
                    });
                }

                if (!row || !row.api_key) {
                    return res.json({ 
                        success: false, 
                        error: '❌ API Key i Gemini nuk është konfiguruar' 
                    });
                }

                try {
                    // Dekripto API Key
                    const apiKey = encryption.decrypt(row.api_key);
                    console.log('🔓 API Key u dekriptua');
                    
                    // ✅ THIRR GEMINI API DIRECT
                    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
                    
                    console.log('🌐 Duke thirrur Gemini API...');
                    
                    const geminiResponse = await fetch(apiUrl, {
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

                    if (!geminiResponse.ok) {
                        const errorText = await geminiResponse.text();
                        console.error('❌ Gabim nga Gemini API:', errorText);
                        throw new Error(`Gemini API: ${geminiResponse.status}`);
                    }

                    const data = await geminiResponse.json();
                    console.log('📨 Përgjigja e papërpunuar:', data);

                    // Nxjerr përgjigjen
                    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    
                    if (responseText) {
                        console.log('✅ Gemini u përgjigj me sukses');
                        res.json({
                            success: true,
                            response: responseText,
                            source: 'gemini-ai'
                        });
                    } else {
                        console.error('❌ Struktura e papritur:', data);
                        throw new Error('Nuk u mor përgjigje e pritshme');
                    }

                } catch (geminiError) {
                    console.error('❌ Gabim në Gemini:', geminiError);
                    res.json({ 
                        success: false, 
                        error: '❌ ' + geminiError.message 
                    });
                }
            }
        );
    } catch (error) {
        console.error('❌ Gabim i përgjithshëm:', error);
        res.json({ 
            success: false, 
            error: '❌ Gabim në server' 
        });
    }
});

// ======================================================
// 🆕 OPENAI ROUTES - IMPLEMENTIM I DIREKT & I SIGURT
// ======================================================

// ✅ RUTA TESTUESE - kontrollo nëse rrugët po regjistrohen
router.get('/bridge/test', (req, res) => {
    console.log('✅ /api/bridge/test u thirr direkt nga gemini.js');
    res.json({ 
        success: true, 
        message: '🌉 Rrugët direkt në gemini.js punojnë! 🎉',
        timestamp: new Date().toISOString(),
        route: 'direct-gemini-route'
    });
});

// ✅ RUTA E STATUSIT TË OPENAI
router.get('/openai/status', async (req, res) => {
    try {
        console.log('🔮 /api/openai/status u thirr direkt nga gemini.js');
        
        let openaiStatus = {
            available: false,
            status: 'checking',
            message: 'Duke kontrolluar shërbimin OpenAI...'
        };

        try {
            // Provo të ngarkosh OpenAI service
            const { openai, getModel } = require('../services/openaiService');
            
            if (!openai) {
                openaiStatus = {
                    available: false,
                    status: 'service_not_loaded',
                    message: 'OpenAI service nuk u ngarkua'
                };
            } else if (!process.env.OPENAI_API_KEY) {
                openaiStatus = {
                    available: false,
                    status: 'api_key_missing',
                    message: 'OPENAI_API_KEY nuk është vendosur në .env'
                };
            } else {
                // Testo me një kërkesë të vogël
                const testCompletion = await openai.chat.completions.create({
                    model: getModel('chat'),
                    messages: [{ role: "user", content: "Test" }],
                    max_tokens: 5
                });

                openaiStatus = {
                    available: true,
                    status: 'active', 
                    message: 'OpenAI service është operative 🎉',
                    model: getModel('chat'),
                    test_response: testCompletion.choices[0].message.content
                };
            }
        } catch (error) {
            openaiStatus = {
                available: false,
                status: 'error',
                message: `OpenAI error: ${error.message}`,
                suggestion: 'Kontrollo OPENAI_API_KEY në .env file'
            };
        }

        res.json({
            success: true,
            ...openaiStatus,
            timestamp: new Date().toISOString(),
            route: 'direct-gemini-route'
        });
        
    } catch (error) {
        console.error('❌ Gabim në /api/openai/status:', error);
        res.json({
            success: false,
            available: false,
            status: 'error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// ✅ RUTA KRYESORE E OPENAI CHAT
router.post('/openai/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        console.log('🔮 /api/openai/chat u thirr:', message?.substring(0, 50));
        
        if (!message || message.trim() === '') {
            return res.json({
                success: false,
                response: '❌ Ju lutem shkruani një mesazh për OpenAI'
            });
        }

        // Provo OpenAI service direkt
        try {
            const { openai, getModel } = require('../services/openaiService');
            
            if (!process.env.OPENAI_API_KEY) {
                throw new Error('OPENAI_API_KEY nuk është konfiguruar në .env file');
            }

            const completion = await openai.chat.completions.create({
                model: getModel('chat'),
                messages: [
                    {
                        role: "system", 
                        content: "Ti je RRUFE-TESLA AI, një asistent inteligjent shqip. Përgjigju në shqip dhe jep përgjigje të dobishme dhe miqësore."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7
            });

            const response = completion.choices[0].message.content;
            
            console.log('✅ OpenAI Response Success');
            
            res.json({
                success: true,
                response: `🔮 **OpenAI**\n\n${response}`,
                model: getModel('chat'),
                tokens: completion.usage?.total_tokens || 0,
                timestamp: new Date().toISOString(),
                route: 'direct-gemini-route'
            });
            
        } catch (openaiError) {
            console.error('❌ OpenAI Service Error:', openaiError.message);
            
            // Fallback i mirë nëse OpenAI dështon
            res.json({
                success: true,
                response: `🔮 **OpenAI Test Mode**\n\n"${message}"\n\n💡 *OpenAI service is being configured*\n\n**Status:** ${openaiError.message}\n**Këshillë:** Kontrolloni OPENAI_API_KEY në .env file`,
                fallback: true,
                timestamp: new Date().toISOString()
            });
        }
        
    } catch (error) {
        console.error('❌ OpenAI Route Error:', error);
        res.json({
            success: false,
            response: `❌ Gabim server: ${error.message}`,
            timestamp: new Date().toISOString()
        });
    }
});

console.log('🎯 OpenAI routes u shtuan direkt në gemini.js:');
console.log('   - GET /api/bridge/test');
console.log('   - GET /api/openai/status');
console.log('   - POST /api/openai/chat');

module.exports = router;
