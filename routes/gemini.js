const express = require('express');
const db = require('../database');
const encryption = require('../utils/encryption');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = express.Router();

// ✅ Inicializo Gemini Service
class GeminiService {
    constructor() {
        this.genAI = null;
    }

    // ✅ Dërgo mesazh në Gemini 2.0 Flash
    async sendMessage(message, apiKey) {
        try {
            console.log('🤖 Duke dërguar mesazh në Gemini 2.0 Flash...');
            console.log('🔑 API Key:', apiKey ? '***' + apiKey.slice(-4) : 'MUNGON');

            if (!apiKey) {
                throw new Error('❌ API Key është i zbrazët');
            }

            // ✅ Inicializo Google Generative AI
            this.genAI = new GoogleGenerativeAI(apiKey);
            
            // ✅ Përdor Gemini 2.0 Flash model të ri
            const model = this.genAI.getGenerativeModel({ 
                model: "gemini-2.0-flash-exp"  // Modeli i ri eksperimental
            });

            // ✅ Krijro prompt
            const prompt = `
            Ti je ChatAI ALBA, një asistent inteligjent shqip.
            
            Përdoruesi thotë: "${message}"
            
            Jep një përgjigje të shkurtër, të dobishme dhe në gjuhën shqipe.
            `;

            console.log('🚀 Duke dërguar request në Gemini 2.0 Flash...');

            // ✅ Dërgo request
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            console.log('✅ Përgjigja nga Gemini:', text.substring(0, 100) + '...');
            return text;

        } catch (error) {
            console.error('❌ Gabim në Gemini API:', error);
            
            // ✅ Gabime specifike
            if (error.message.includes('API_KEY_INVALID') || error.status === 401) {
                throw new Error('❌ API Key është i pavlefshëm. Ju lutem kontrolloni API Key.');
            } else if (error.message.includes('QUOTA_EXCEEDED')) {
                throw new Error('❌ Keni shfrytëzuar limitin e API. Provoni më vonë.');
            } else if (error.message.includes('MODEL_NOT_FOUND')) {
                throw new Error('❌ Modeli Gemini 2.0 Flash nuk u gjet. Provoni përsëri.');
            } else {
                throw new Error(`❌ Gabim në Gemini: ${error.message}`);
            }
        }
    }
}

const geminiService = new GeminiService();

// ✅ API për të komunikuar me Gemini 2.0 Flash
router.post('/ask', async (req, res) => {
    const { userId, message } = req.body;

    console.log('💬 Duke përpunuar kërkesë për Gemini:', { 
        userId, 
        message: message ? message.substring(0, 50) + '...' : 'MUNGON' 
    });

    if (!userId || !message) {
        return res.status(400).json({ 
            success: false, 
            error: '❌ Të dhëna të pamjaftueshme. Duhet userId dhe message.' 
        });
    }

    try {
        // ✅ Merr API Key nga databaza
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
                    console.log('❌ API Key nuk u gjet për user:', userId);
                    return res.status(400).json({ 
                        success: false, 
                        error: '❌ API Key nuk u gjet. Përdor /apikey [key_jote]' 
                    });
                }

                try {
                    // ✅ Dekripto API Key me AES-256
                    console.log('🔓 Duke dekriptuar API Key...');
                    const apiKey = encryption.decrypt(row.api_key);
                    console.log('✅ API Key u dekriptua me sukses');

                    // ✅ Përdor shërbimin e ri Gemini
                    const response = await geminiService.sendMessage(message, apiKey);

                    // ✅ Ruaj në historinë e bisedave
                    db.run(
                        'INSERT INTO messages (user_id, message, response, timestamp) VALUES (?, ?, ?, datetime("now"))',
                        [userId, message, response],
                        (err) => {
                            if (err) console.error('❌ Gabim në ruajtjen e mesazhit:', err);
                            else console.log('💾 Mesazhi u ruajt në historinë');
                        }
                    );

                    res.json({
                        success: true,
                        response: response
                    });

                } catch (geminiError) {
                    console.error('❌ Gabim gjatë thirrjes së Gemini API:', geminiError);
                    res.status(500).json({ 
                        success: false, 
                        error: geminiError.message 
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
        const testAI = new GoogleGenerativeAI(apiKey);
        const model = testAI.getGenerativeModel({ 
            model: "gemini-2.0-flash-exp" 
        });
        
        const result = await model.generateContent("Test: Pershendetje! A funksionon kjo?");
        const response = await result.response;
        
        res.json({ 
            success: true, 
            message: '✅ API Key është VALID! Gemini 2.0 Flash funksionon.',
            response: response.text()
        });
    } catch (error) {
        res.json({ 
            success: false, 
            message: `❌ API Key është I PAVLEFSHËM: ${error.message}` 
        });
    }
});

module.exports = router;
