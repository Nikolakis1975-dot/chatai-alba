// services/openaiService.js - MODIFIKO PËR TË MARRË KEY NGA DATABASE

const OpenAI = require('openai');
const db = require('../database');

let openaiClient = null;
let openaiApiKey = null;

// ✅ FUNKSIONI PËR TË INICIALIZUAR ME KEY NGA DATABASE
async function initializeOpenAI() {
    try {
        console.log('🔑 Duke kontrolluar OpenAI API Key nga database...');
        
        // Merr API Key nga database
        const keyFromDB = await getOpenAIKeyFromDB();
        
        if (keyFromDB) {
            console.log('✅ Gjetëm OpenAI API Key në database');
            openaiApiKey = keyFromDB;
            openaiClient = new OpenAI({ apiKey: keyFromDB });
            return true;
        }
        
        // Provo nga environment variables
        const keyFromEnv = process.env.OPENAI_API_KEY;
        if (keyFromEnv) {
            console.log('✅ Gjetëm OpenAI API Key në environment');
            openaiApiKey = keyFromEnv;
            openaiClient = new OpenAI({ apiKey: keyFromEnv });
            return true;
        }
        
        console.log('❌ Nuk u gjet OpenAI API Key as në database as në environment');
        return false;
        
    } catch (error) {
        console.error('❌ Gabim në inicializimin e OpenAI:', error);
        return false;
    }
}

// ✅ FUNKSION PËR TË MARRË KEY NGA DATABASE
function getOpenAIKeyFromDB() {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT api_key FROM api_keys WHERE service_name = ? LIMIT 1',
            ['openai'],
            (err, row) => {
                if (err) {
                    console.error('❌ Gabim në database:', err);
                    reject(err);
                } else if (row && row.api_key) {
                    resolve(row.api_key);
                } else {
                    resolve(null);
                }
            }
        );
    });
}

// ✅ MODIFIKO FUNKSIONIN getOpenAIClient
async function getOpenAIClient() {
    if (!openaiClient) {
        const initialized = await initializeOpenAI();
        if (!initialized) {
            throw new Error('OpenAI nuk është i konfiguruar. Ju lutem vendosni API Key.');
        }
    }
    return openaiClient;
}

// ✅ MODIFIKO FUNKSIONIN generateResponse
async function generateResponse(prompt, options = {}) {
    try {
        const client = await getOpenAIClient();
        
        const response = await client.chat.completions.create({
            model: options.model || 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'Ti je RRUFE-TESLA, një asistencë AI shqiptare. Përgjigju në shqip dhe jep ndihmë të dobishme.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: options.maxTokens || 500,
            temperature: options.temperature || 0.7
        });
        
        return response.choices[0].message.content;
        
    } catch (error) {
        console.error('❌ Gabim në OpenAI API:', error.message);
        
        // Nëse është gabim authentication, provo të re-inicializosh
        if (error.message.includes('authentication') || error.message.includes('API key')) {
            console.log('🔄 Duke re-inicializuar OpenAI me key të ri...');
            openaiClient = null;
            openaiApiKey = null;
            
            // Provo përsëri
            try {
                const client = await getOpenAIClient();
                const response = await client.chat.completions.create({
                    model: options.model || 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: 'Ti je RRUFE-TESLA.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: options.maxTokens || 500
                });
                
                return response.choices[0].message.content;
            } catch (retryError) {
                throw new Error(`OpenAI API Error: ${retryError.message}`);
            }
        }
        
        throw error;
    }
}

module.exports = {
    getOpenAIClient,
    generateResponse,
    initializeOpenAI,
    getOpenAIKeyFromDB
};
