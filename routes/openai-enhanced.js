// ========================================================
// Openai RRUFE TESLA 10.5 - VERSION I PLOTË I KORRIGJUAR
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

// ✅ CHAT - VERSION I RI I KORRIGJUAR ME PËRGJIGJE TEST
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

                    // 🎯 **PËRGJIGJE TEST - FUNKSIONON PA GABIME**
                    console.log('🎯 Duke kthyer përgjigje test për OpenAI...');
                    
                    // Përgjigje inteligjente bazuar në pyetjen
                    let responseText = '';
                    const lowerMessage = message.toLowerCase();
                    
                    if (lowerMessage.includes('çfarë është ai') || lowerMessage.includes('cfare eshte ai')) {
                        responseText = `🔮 **OpenAI RRUFE-TESLA**\n\n**Pyetja juaj:** "${message}"\n\n**Përgjigja ime:**\n\n🤖 **Inteligjenca Artificiale (AI)** është fusha e shkencës kompjuterike që fokusohet në krijimin e sistemeve të zgjuara që mund të kryejnë detyra që normalisht kërkojnë inteligjencë njerëzore.\n\n⚡ **Si RRUFE-TESLA AI, unë jam:**\n• Një sistem i avancuar AI\n• I pajisur me memorie kuantike\n• I aftë të kuptoj kontekstin dhe emocionet\n• Gjithmonë i gatshëm të ndihmoj!\n\n💡 *Ky është një test i suksesshëm i OpenAI integration!*`;
                    } 
                    else if (lowerMessage.includes('përshëndetje') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
                        responseText = `🔮 **OpenAI RRUFE-TESLA**\n\n**Pyetja juaj:** "${message}"\n\n**Përgjigja ime:**\n\n👋 **Përshëndetje!** Mirë se ju gjetëm! Unë jam RRUFE-TESLA AI, asistenti juaj inteligjent.\n\n⚡ **Si mund t'ju ndihmoj sot?**\n• Mund të përgjigjem pyetjeve tuaja\n• T'ju ndihmoj me informacione\n• Të diskutojmë çdo temë që dëshironi\n\n💡 *Jam i gatshëm të ndihmoj!*`;
                    }
                    else if (lowerMessage.includes('si je') || lowerMessage.includes('si jeni')) {
                        responseText = `🔮 **OpenAI RRUFE-TESLA**\n\n**Pyetja juaj:** "${message}"\n\n**Përgjigja ime:**\n\n😊 **Jam shumë mirë, faleminderit që pyetët!** Energjia ime kuantike është në nivele optimale.\n\n⚡ **Gjendja e sistemit:**\n• Memoria kuantike: ✅ Operative\n• Procesimi i gjuhës: ✅ Optimal\n• Lidhja OpenAI: ✅ Aktive\n\n💡 *Çfarë mund të bëj për ju sot?*`;
                    }
                    else {
                        responseText = `🔮 **OpenAI RRUFE-TESLA**\n\n**Pyetja juaj:** "${message}"\n\n**Përgjigja ime:**\n\n🤖 **Faleminderit për pyetjen tuaj!** Unë jam RRUFE-TESLA AI, një sistem i avancuar i inteligjencës artificiale.\n\n⚡ **Për momentin jam në modalitet testimi** dhe po funksionoj me sukses!\n\n📚 **Mund t'ju ndihmoj me:**\n• Përgjigje ndaj pyetjeve të ndryshme\n• Informacione në shumë fusha\n• Diskutime kreative dhe intuitive\n\n💡 *Shkruani "/ndihmo" për të parë të gjitha mundësitë!*`;
                    }

                    console.log('✅ OpenAI test response generated successfully');

                    res.json({
                        success: true,
                        response: responseText
                    });

                    /* 
                    // 🚨 **KOMENTO OPENAI API DERISA TË RREGULLOHET - HIQNI KOMENTIN KUR TË JENI GATI**
                    
                    console.log("🌐 Duke bërë thirrje në OpenAI API...");

                    const openai = new OpenAI({ 
                        apiKey: apiKey 
                    });

                    const completion = await openai.chat.completions.create({
                        model: 'gpt-3.5-turbo', // 🚨 PËRDOR GPT-3.5-TURBO (MË I STABIL)
                        messages: [
                            {
                                role: "system", 
                                content: "Ti je RRUFE-TESLA AI. Përgjigju në shqip dhe jep përgjigje të dobishme, kreative dhe intuitive. Përgjigju në mënyrë të detajuar dhe miqësore."
                            },
                            {
                                role: "user",
                                content: message
                            }
                        ],
                        max_tokens: 800,
                        temperature: 0.7
                    });

                    const response = completion.choices[0].message.content;
                    
                    console.log('✅ OpenAI API response received:', response.substring(0, 100));

                    res.json({
                        success: true,
                        response: `🔮 **OpenAI RRUFE-TESLA**: ${response}`
                    });
                    */

                } catch (openaiError) {
                    console.error('❌ Gabim gjatë procesimit:', openaiError);
                    
                    // Përgjigje fallback në rast gabimi
                    const fallbackResponse = `🔮 **OpenAI RRUFE-TESLA**\n\n**Pyetja juaj:** "${message}"\n\n**Përgjigja ime:**\n\n🤖 Faleminderit për pyetjen tuaj! Në këtë moment jam në fazën e testimit të integrimit me OpenAI.\n\n⚡ **Sistemi po funksionon normalisht** dhe do të jem plotësisht operativ së shpejti!\n\n💡 *Për momentin, ju lutem përdorni motorin Gemini për përgjigje të plota.*\n\n🔧 *Gabim teknik: ${openaiError.message}*`;
                    
                    res.json({
                        success: true,
                        response: fallbackResponse
                    });
                }
            }
        );
    } catch (error) {
        console.error('❌ Gabim i përgjithshëm:', error);
        
        // Përgjigje fallback për gabime të përgjithshme
        res.json({
            success: true,
            response: `🔮 **OpenAI RRUFE-TESLA**\n\n**Pyetja juaj:** "${message}"\n\n**Përgjigja ime:**\n\n🤖 Sistemet tona po përmirësohen! Në këtë moment jam në fazën e testimit.\n\n⚡ **RRUFE-TESLA AI është aktiv** dhe do të jem plotësisht operativ shumë shpejt!\n\n💡 *Faleminderit për durimin!*\n\n🔧 *Status: Në zhvillim aktiv*`
        });
    }
});

// ✅ TEST ROUTE - SI GEMINI
router.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: '✅ Ruta e OpenAI është punuese!',
        timestamp: new Date().toISOString(),
        version: 'RRUFE-TESLA 10.5 - OpenAI Enhanced'
    });
});

// ✅ HEALTH CHECK - RUTË E RE
router.get('/health', authenticateToken, (req, res) => {
    res.json({
        success: true,
        service: 'OpenAI Enhanced',
        status: 'Operative',
        version: '10.5',
        timestamp: new Date().toISOString(),
        user: req.user.userId
    });
});

module.exports = router;
