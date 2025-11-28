// ====================🔥 services/openaiService.js - VERSION I RI ME DATABASE ===============================
const OpenAI = require("openai");
const db = require('../database'); // ✅ Shto database connection

const MODE = process.env.NODE_ENV || "production";

const models = {
  development: {
    chat: "gpt-4o-mini",
    stt: "gpt-4o-mini-transcribe", 
    tts: "gpt-4o-mini-tts",
  },
  production: {
    chat: "gpt-4o",
    stt: "gpt-4o-transcribe",
    tts: "gpt-4o-tts",
  },
};

// ✅ FUNKSION PËR TË MARRË API KEY NGA DATABASE
function getApiKeyFromDB(userId) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT api_key FROM api_keys WHERE user_id = ? AND service_name = ?',
      [userId, 'openai'],
      (err, row) => {
        if (err) {
          console.error('❌ Gabim në lexim të API Key nga database:', err);
          resolve(null);
        } else {
          resolve(row ? row.api_key : null);
        }
      }
    );
  });
}

// ✅ FUNKSION PËR DEKRIPTIM (nëse është i enkriptuar)
function decryptApiKey(encryptedKey) {
  try {
    // Nëse ke encryption service, përdore këtu
    // Për momentin, supozojmë se API Key është i paenkriptuar
    return encryptedKey;
  } catch (error) {
    console.error('❌ Gabim në dekriptim:', error);
    return encryptedKey; // Fallback
  }
}

// ✅ FUNKSION KRYESOR PËR PROCESIM MESAZHESH
async function processMessage(message, userId = 1) {
  try {
    console.log('🔮 OpenAI Service - Duke procesuar mesazh për user:', userId);
    
    // ✅ MER API KEY NGA DATABASE
    const encryptedApiKey = await getApiKeyFromDB(userId);
    
    if (!encryptedApiKey) {
      throw new Error('Nuk ka OpenAI API Key të konfiguruar. Vendosni API Key në panelin OpenAI.');
    }

    // ✅ DEKRIPTO API KEY
    const apiKey = decryptApiKey(encryptedApiKey);
    console.log('🔑 API Key u gjet nga database. Gjatësia:', apiKey.length);
    
    // ✅ KRIJO OPENAI CLIENT ME KEY NGA DATABASE
    const openai = new OpenAI({
      apiKey: apiKey
    });

    const completion = await openai.chat.completions.create({
      model: getModel('chat'),
      messages: [
        { 
          role: "system", 
          content: "Ti je RRUFE-TESLA AI. Përgjigju në shqip dhe jep përgjigje të dobishme, kreative." 
        },
        { 
          role: "user", 
          content: message 
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const responseText = completion.choices[0].message.content;
    console.log('✅ OpenAI Service - Përgjigje e suksesshme!');
    
    return {
      success: true,
      response: `🔮 **OpenAI RRUFE-TESLA**: ${responseText}`,
      tokens: completion.usage.total_tokens
    };

  } catch (error) {
    console.error('❌ OpenAI Service - Gabim:', error.message);
    
    return {
      success: false,
      error: 'OpenAI: ' + error.message
    };
  }
}

// ✅ FUNKSIONI GET MODEL (mbetet i njëjtë)
function getModel(type) {
  const env = MODE === "development" ? "development" : "production";
  return models[env][type];
}

// ✅ EKSPORTO FUNKSIONET - COMMONJS
module.exports = {
  processMessage,
  getModel,
  getApiKeyFromDB
};
