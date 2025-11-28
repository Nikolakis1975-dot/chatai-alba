// ====================🔥 services/openaiService.js - VERSION I KORREKT ===============================
const OpenAI = require("openai");
const db = require('../database');

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

// ✅ FUNKSION KRYESOR PËR PROCESIM MESAZHESH - VERSION I KORREKT
async function processMessage(message, userId = 1) {
  try {
    console.log('🔮 OpenAI Service - Duke procesuar mesazh për user:', userId);
    
    // ✅ 1. MER API KEY NGA DATABASE (PËR USER) - PRIORITET I PARË
    const sqliteKey = await new Promise((resolve) => {
      db.get(
        "SELECT api_key FROM api_keys WHERE service_name='openai' AND user_id = ?",
        [userId],
        (err, row) => resolve(row)
      );
    });

    // ✅ 2. ZGJIDH API KEY TË PËRDORUR
    const apiKeyToUse = sqliteKey?.api_key
      ? sqliteKey.api_key
      : process.env.OPENAI_API_KEY;

    if (!apiKeyToUse) {
      throw new Error('Nuk u gjet asnjë API Key për OpenAI. Vendosni API Key në panelin OpenAI.');
    }

    console.log('🔑 API Key i përdorur:', apiKeyToUse.substring(0, 20) + '...');
    console.log('🎯 Burimi:', sqliteKey?.api_key ? 'Database (User)' : 'Environment (Server)');
    
    // ✅ 3. KRIJO OPENAI CLIENT
    const openai = new OpenAI({
      apiKey: apiKeyToUse
    });

    // ✅ 4. THIRR OPENAI API
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
      tokens: completion.usage.total_tokens,
      source: sqliteKey?.api_key ? 'user' : 'server'
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

// ✅ EKSPORTO FUNKSIONET
module.exports = {
  processMessage,
  getModel
};
