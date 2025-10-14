// services/geminiRealService.js
const db = require('../database');
const encryption = require('../utils/encryption');

class GeminiRealService {
    static async processMessage(message, userId) {
        try {
            console.log('🚀 GeminiRealService - Duke procesuar mesazh:', message.substring(0, 50));
            
            return new Promise((resolve, reject) => {
                // Merr API Key nga databaza
                db.get(
                    'SELECT api_key FROM api_keys WHERE user_id = ? AND service_name = ?',
                    [userId, 'gemini'],
                    async (err, row) => {
                        if (err) {
                            console.error('❌ Gabim në database:', err);
                            resolve({ success: false, response: '❌ Gabim në server' });
                            return;
                        }

                        if (!row || !row.api_key) {
                            console.log('❌ API Key nuk u gjet për user:', userId);
                            resolve({ success: false, response: '❌ Nuk ka API Key' });
                            return;
                        }

                        try {
                            // Dekripto API Key
                            console.log('🔓 Duke dekriptuar API Key...');
                            const apiKey = encryption.decrypt(row.api_key);
                            console.log('✅ API Key u dekriptua me sukses');

                            // ✅ PËRDOR GEMINI 2.5 FLASH ME TOKENA TË GJATA
                            const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
                            
                            console.log('🌐 Duke dërguar në Gemini API me modelin: gemini-2.5-flash');

                            const response = await fetch(apiUrl, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "x-goog-api-key": apiKey
                                },
                                body: JSON.stringify({
                                    contents: [{
                                        parts: [{
                                            text: message
                                        }]
                                    }],
                                    generationConfig: {
                                        temperature: 0.7,
                                        maxOutputTokens: 4000,  // ✅ RRIJ SHUMË - NGA 1000 NË 4000!
                                        topP: 0.8,
                                        topK: 40
                                    }
                                })
                            });

                            console.log('📨 Statusi i përgjigjes:', response.status);

                            if (!response.ok) {
                                const errorText = await response.text();
                                console.error('❌ Gabim nga Gemini API:', response.status, errorText);
                                
                                // ✅ PROVO MODELE ALTERNATIVE ME TOKENA TË GJATA
                                if (response.status === 404 || response.status === 400) {
                                    console.log('⚠️ Duke provuar modele alternative me tokena të gjata...');
                                    const fallbackResult = await this.tryFallbackModel(message, apiKey);
                                    if (fallbackResult) {
                                        console.log(`✅ ${fallbackResult.model} dha përgjigje`);
                                        
                                        // ✅ RUAJ NË DATABAZË
                                        this.saveToDatabase(userId, message, fallbackResult.response);
                                        
                                        resolve(fallbackResult);
                                        return;
                                    }
                                }
                                
                                if (response.status === 401 || response.status === 403) {
                                    resolve({ success: false, response: '❌ API Key i pavlefshëm' });
                                    return;
                                }
                                
                                resolve({ success: false, response: '❌ Gabim në Gemini API' });
                                return;
                            }

                            const data = await response.json();
                            console.log('✅ Përgjigja u mor nga Gemini 2.5 Flash');
                            
                            // ✅ TRAJTIM I PLOTË I PËRGJIGJES NGA GEMINI
                            let geminiResponse;

                            if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                                // ✅ PËRGJIGJE E PLOTË
                                geminiResponse = data.candidates[0].content.parts[0].text;
                                console.log('✅ Mori përgjigje të plotë nga Gemini');
                            } else if (data.candidates?.[0]?.finishReason === 'MAX_TOKENS' && data.candidates[0]?.content?.parts?.[0]?.text) {
                                // ✅ PËRGJIGJE E CUNGUAR - MERRE ATË QË KA DHE SHTO MESAZH
                                const partialResponse = data.candidates[0].content.parts[0].text;
                                geminiResponse = partialResponse + "\n\n🔹 *Shënim: Përgjigja u cungua për shkak të kufizimeve. Mund të pyesni përsëri për detaje shtesë.*";
                                console.log('⚠️ Përgjigja u cungua, por morëm:', partialResponse.length, 'karaktere');
                            } else if (data.candidates?.[0]?.finishReason === 'MAX_TOKENS') {
                                // ✅ NUK KA ASPAK PËRGJIGJE - PROVO MODELIN E GJATË
                                console.log('❌ Përgjigja u cungua plotësisht, duke provuar modelin 1.5 Pro...');
                                const longResponse = await this.tryLongerResponseModel(message, apiKey);
                                if (longResponse) {
                                    geminiResponse = longResponse.response;
                                } else {
                                    geminiResponse = "❌ Përgjigja u cungua plotësisht. Ju lutem formuloni pyetjen më shkurt ose ndani në pyetje më të vogla.";
                                }
                            } else {
                                // ✅ STRUKTURË E PAPRITUR
                                console.error('❌ Struktura e papritur e përgjigjes:', JSON.stringify(data, null, 2));
                                geminiResponse = "❌ Nuk u mor përgjigje e pritshme nga Gemini. Provo përsëri.";
                            }

                            // ✅ RUAJ NË DATABAZË
                            this.saveToDatabase(userId, message, geminiResponse);
                            
                            resolve({ success: true, response: geminiResponse });

                        } catch (geminiError) {
                            console.error('❌ Gabim në Gemini:', geminiError);
                            resolve({ success: false, response: '❌ Gabim në komunikim' });
                        }
                    }
                );
            });

        } catch (error) {
            console.error('❌ Gabim i përgjithshëm:', error);
            return { success: false, response: '❌ Gabim në procesim' };
        }
    }

    // ✅ METODË PËR MODELE ALTERNATIVE ME TOKENA TË NDRYSHME
    static async tryFallbackModel(message, apiKey) {
        const fallbackModels = [
            { name: 'gemini-1.5-pro-001', tokens: 8000 }, // ✅ MODEL I GJATË
            { name: 'gemini-2.0-flash', tokens: 4000 },
            { name: 'gemini-1.5-flash-001', tokens: 4000 },
            { name: 'gemini-pro', tokens: 2000 }
        ];

        for (const model of fallbackModels) {
            try {
                console.log(`🔄 Duke provuar ${model.name} me ${model.tokens} tokena...`);
                
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model.name}:generateContent`;
                
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-goog-api-key": apiKey
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: message
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: model.tokens, // ✅ PËRDOR TOKENA TË NDRYSHME
                            topP: 0.8
                        }
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                        console.log(`✅ ${model.name} u pergjigj me sukses`);
                        return {
                            success: true,
                            response: data.candidates[0].content.parts[0].text,
                            model: model.name
                        };
                    }
                }
            } catch (error) {
                console.log(`❌ ${model.name} dështoi:`, error.message);
            }
        }
        
        console.log('❌ Të gjitha modelet dështuan');
        return null;
    }

    // ✅ ALTERNATIVE - PËRDOR MODELIN 1.5 PRO PËR PËRGJIGJE MË TË GJATA
    static async tryLongerResponseModel(message, apiKey) {
        try {
            console.log('🔄 Duke provuar modelin 1.5 Pro për përgjigje më të gjata...');
            
            const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-001:generateContent';
            
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Jep një përgjigje të detajuar por të përqendruar: ${message}`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 8000,  // ✅ E GJATË!
                        topP: 0.8
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    console.log('✅ Gemini 1.5 Pro dha përgjigje të gjatë');
                    return {
                        success: true,
                        response: data.candidates[0].content.parts[0].text
                    };
                }
            }
        } catch (error) {
            console.log('❌ Gemini 1.5 Pro dështoi:', error.message);
        }
        return null;
    }

    // ✅ METODË NDIHMËSE PËR RUAJTJE NË DATABAZË
    static saveToDatabase(userId, message, response) {
        console.log('💾 Duke ruajtur në historinë...');
        
        db.run(
            'INSERT INTO messages (user_id, content, sender, response, timestamp) VALUES (?, ?, ?, ?, datetime("now"))',
            [userId, message, 'user', response],
            (err) => {
                if (err) {
                    console.error('❌ Gabim në ruajtje:', err.message);
                } else {
                    console.log('✅ Mesazhi u ruajt në historinë');
                }
            }
        );
    }

    // ✅ METODË TESTUESE
    static async testService() {
        return {
            success: true,
            message: '✅ GeminiRealService është punuese!',
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = GeminiRealService;
