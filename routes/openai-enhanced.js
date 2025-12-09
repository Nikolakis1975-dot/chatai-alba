// ========================================================
// Openai RRUFE TESLA 10.5
// ========================================================
const express = require('express');
const db = require('../database');
const encryption = require('../utils/encryption');
const jwt = require('jsonwebtoken');
const { OpenAI } = require('openai');
const router = express.Router();

// ✅ PËRDO TË NJËJTIN AUTH SI GEMINI
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

// ✅ STATUS - SI GEMINI
router.get('/status', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        // ✅ PËRDO TË NJËJTIN DATABASE PATTERN SI GEMINI
        db.get(
            'SELECT api_key FROM api_keys WHERE user_id = ? AND service_name = ?',
            [userId, 'openai'],
            (err, row) => {
                if (err) {
                    console.error('❌ Gabim në database:', err);
                    return res.status(500).json({ 
                        success: false, 
                        error: '❌ Gabim në server' 
                    });
                }

                res.json({
                    success: true,
                    hasApiKey: !!(row && row.api_key),
                    message: row && row.api_key ? 'OpenAI i konfiguruar' : 'OpenAI jo i konfiguruar'
                });
            }
        );
    } catch (error) {
        res.json({ 
            success: false, 
            error: '❌ ' + error.message 
        });
    }
});

// ✅ SAVE KEY - SI GEMINI
router.post('/save-key', authenticateToken, async (req, res) => {
    try {
        const { apiKey } = req.body;
        const userId = req.user.userId;

        console.log('💾 Duke ruajtur OpenAI Key për user:', userId);

        if (!apiKey) {
            return res.json({
                success: false,
                error: '❌ API Key është e zbrazët'
            });
        }

        if (!apiKey.startsWith('sk-proj') && !apiKey.startsWith('sk-')) {
            return res.json({
                success: false,
                error: '❌ API Key i pavlefshëm. Duhet të fillojë me "sk-proj" ose "sk-"'
            });
        }

        // ✅ ENKRIPTO SI GEMINI
        const encryptedKey = encryption.encrypt(apiKey);

        // ✅ PËRDO TË NJËJTIN DATABASE QUERY SI GEMINI
        db.run(
            `INSERT OR REPLACE INTO api_keys (user_id, service_name, api_key, created_at, updated_at) 
             VALUES (?, ?, ?, datetime('now'), datetime('now'))`,
            [userId, 'openai', encryptedKey],
            function(err) {
                if (err) {
                    console.error('❌ Gabim në database:', err);
                    return res.status(500).json({ 
                        success: false, 
                        error: '❌ Gabim në ruajtje' 
                    });
                }

                console.log('✅ OpenAI Key u ruajt në database');
                res.json({ 
                    success: true, 
                    message: '✅ OpenAI API Key u ruajt!' 
                });
            }
        );

    } catch (error) {
        console.error('❌ Save key error:', error);
        res.json({ 
            success: false, 
            error: '❌ Gabim në ruajtje: ' + error.message 
        });
    }
});

// ✅ DELETE KEY - SI GEMINI
router.delete('/delete-key', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        // ✅ PËRDO TË NJËJTIN DATABASE QUERY SI GEMINI
        db.run(
            'DELETE FROM api_keys WHERE user_id = ? AND service_name = ?',
            [userId, 'openai'],
            function(err) {
                if (err) {
                    console.error('❌ Gabim në database:', err);
                    return res.status(500).json({ 
                        success: false, 
                        error: '❌ Gabim në fshirje' 
                    });
                }

                console.log('✅ OpenAI Key u fshi nga database');
                res.json({ 
                    success: true, 
                    message: '✅ OpenAI API Key u fshi!' 
                });
            }
        );

    } catch (error) {
        console.error('❌ Delete key error:', error);
        res.json({ 
            success: false, 
            error: '❌ Gabim në fshirje: ' + error.message 
        });
    }
});

// ✅ CHAT - SI GEMINI
router.post('/chat', authenticateToken, async (req, res) => {
    const { message } = req.body;
    const userId = req.user.userId;

    console.log('💬 OpenAI Chat - User:', userId, 'Message:', message?.substring(0, 50));

    if (!message) {
        return res.status(400).json({ 
            success: false, 
            error: '❌ Mesazhi është i zbrazët' 
        });
    }

    try {
        // ✅ PËRDO TË NJËJTIN DATABASE PATTERN SI GEMINI
        db.get(
            'SELECT api_key FROM api_keys WHERE user_id = ? AND service_name = ?',
            [userId, 'openai'],
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
                        error: '❌ Nuk është konfiguruar API Key për OpenAI' 
                    });
                }

                try {
                    // ✅ DEKRIPTO SI GEMINI
                    console.log('🔓 Duke dekriptuar OpenAI API Key...');
                    const apiKey = encryption.decrypt(row.api_key);
                    console.log('✅ API Key u dekriptua');

                    // ✅ KRIJO OPENAI CLIENT
                    const openai = new OpenAI({ 
                        apiKey: apiKey 
                    });

                    console.log("🌐 Duke bërë thirrje në OpenAI API...");

                    const completion = await openai.chat.completions.create({
                        model: 'gpt-4',
                        messages: [
                            {
                                role: "system", 
                                content: "Ti je RRUFE-TESLA AI. Përgjigju në shqip dhe jep përgjigje të dobishme, kreative dhe intuitive."
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
                    
                    console.log('✅ OpenAI response received');

                    res.json({
                        success: true,
                        response: `🔮 **OpenAI**: ${response}`
                    });

                } catch (openaiError) {
                    console.error('❌ Gabim gjatë thirrjes së OpenAI API:', openaiError);
                    
                    let errorMessage = openaiError.message;
                    if (openaiError.message.includes('Incorrect API key')) {
                        errorMessage = '❌ API Key i pavlefshëm për OpenAI';
                    }
                    
                    res.status(500).json({ 
                        success: false, 
                        error: errorMessage 
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

// ✅ TEST ROUTE - SI GEMINI
router.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: '✅ Ruta e OpenAI është punuese!',
        timestamp: new Date().toISOString()
    });
});

// ==================== ✅ TESTIM I API KEY NGA DATABASE ====================

// ✅ 1. TESTO NËSE API KEY FUNKSIONON
router.get('/test-key', async (req, res) => {
    console.log('🧪 [OPENAI-TEST] Duke testuar API Key nga database...');
    
    try {
        // Kontrollo nëse ka API key në database
        db.get(
            'SELECT api_key, created_at FROM api_keys WHERE service_name LIKE ? LIMIT 1',
            ['%openai%'],
            async (err, row) => {
                if (err) {
                    console.error('❌ Database error:', err);
                    return res.json({
                        success: false,
                        message: '❌ Gabim në database',
                        error: err.message
                    });
                }
                
                if (!row || !row.api_key) {
                    console.log('❌ Nuk u gjet OpenAI API Key në database');
                    return res.json({
                        success: false,
                        hasKey: false,
                        message: '❌ Nuk ka OpenAI API Key të ruajtur në database'
                    });
                }
                
                console.log('✅ Gjetëm OpenAI API Key në database');
                console.log('🔑 Key (first 10 chars):', row.api_key.substring(0, 10) + '...');
                console.log('📅 Created:', row.created_at);
                
                // ✅ PROVO TË KONFIGUROSH OPENAI ME KEY-N E DATABASE
                try {
                    const { OpenAI } = require('openai');
                    const openai = new OpenAI({ apiKey: row.api_key });
                    
                    // Provo një query shumë të vogël për të testuar
                    const testResponse = await openai.chat.completions.create({
                        model: 'gpt-3.5-turbo',
                        messages: [{ role: 'user', content: 'Test - respond only "OK"' }],
                        max_tokens: 5
                    });
                    
                    console.log('✅✅✅ OpenAI API TEST SUCCESS!');
                    console.log('📊 Response:', testResponse.choices[0].message.content);
                    
                    res.json({
                        success: true,
                        hasKey: true,
                        isFunctional: true,
                        keySource: 'database',
                        keyLength: row.api_key.length,
                        keyStored: row.created_at,
                        testResponse: testResponse.choices[0].message.content,
                        message: '✅ OpenAI API Key funksionon perfektisht!'
                    });
                    
                } catch (openaiError) {
                    console.error('❌ OpenAI API Error:', openaiError.message);
                    
                    res.json({
                        success: false,
                        hasKey: true,
                        isFunctional: false,
                        keySource: 'database',
                        error: openaiError.message,
                        message: `❌ OpenAI API Key nuk funksionon: ${openaiError.message}`
                    });
                }
            }
        );
        
    } catch (error) {
        console.error('❌ Gabim në testin e API Key:', error);
        res.json({
            success: false,
            error: error.message,
            message: '❌ Gabim në server'
        });
    }
});

// ✅ 2. STATUS I DETAJUAR
router.get('/status-detailed', (req, res) => {
    console.log('🔍 [OPENAI-STATUS] Duke kontrolluar statusin e detajuar...');
    
    // Kontrollo të gjitha burimet e mundshme
    const status = {
        database: false,
        environment: false,
        functional: false,
        error: null
    };
    
    // 1. Kontrollo database
    db.get(
        'SELECT api_key FROM api_keys WHERE service_name LIKE ?',
        ['%openai%'],
        async (err, row) => {
            status.database = !!(row && row.api_key);
            
            // 2. Kontrollo environment
            status.environment = !!process.env.OPENAI_API_KEY;
            
            // 3. Provo të testosh funksionalitetin
            if (status.database || status.environment) {
                try {
                    const { OpenAI } = require('openai');
                    const apiKey = row?.api_key || process.env.OPENAI_API_KEY;
                    const openai = new OpenAI({ apiKey: apiKey });
                    
                    // Test i shpejtë
                    await openai.chat.completions.create({
                        model: 'gpt-3.5-turbo',
                        messages: [{ role: 'user', content: 'Test' }],
                        max_tokens: 1
                    });
                    
                    status.functional = true;
                    status.message = '✅ OpenAI është plotësisht funksional!';
                    
                } catch (testError) {
                    status.functional = false;
                    status.error = testError.message;
                    status.message = `⚠️ OpenAI i konfiguruar por nuk funksionon: ${testError.message}`;
                }
            } else {
                status.message = '❌ OpenAI nuk është i konfiguruar në asnjë burim';
            }
            
            console.log('📊 Statusi i detajuar:', status);
            
            res.json({
                success: true,
                status: status,
                timestamp: new Date().toISOString()
            });
        }
    );
});

// ✅ 3. FORCE INIT ME KEY NGA DATABASE
router.post('/force-init', (req, res) => {
    console.log('🔄 [OPENAI-FORCE] Duke forcuar inicializimin...');
    
    db.get(
        'SELECT api_key FROM api_keys WHERE service_name LIKE ?',
        ['%openai%'],
        (err, row) => {
            if (err) {
                return res.json({
                    success: false,
                    message: '❌ Gabim në database',
                    error: err.message
                });
            }
            
            if (!row || !row.api_key) {
                return res.json({
                    success: false,
                    message: '❌ Nuk ka API Key në database për të inicializuar'
                });
            }
            
            // Forco inicializimin në memory
            try {
                const { OpenAI } = require('openai');
                global.openaiClient = new OpenAI({ apiKey: row.api_key });
                
                console.log('✅✅✅ OpenAI u inicializua me forcë nga database!');
                
                res.json({
                    success: true,
                    message: '✅ OpenAI u inicializua me sukses nga database!',
                    keyLength: row.api_key.length,
                    initialized: true
                });
                
            } catch (initError) {
                res.json({
                    success: false,
                    message: `❌ Gabim në inicializim: ${initError.message}`,
                    error: initError.message
                });
            }
        }
    );
});

module.exports = router;
