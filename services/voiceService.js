/**
 * ✅ Voice Service - Optimizuar për shqip, pa language param (auto-detect)
 * ✅ Version i korrigjuar - pa OPENAI_API_KEY nga environment
 */
const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
const db = require('../database');

const tempDir = path.join(__dirname, "../temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// ✅ FUNKSION PËR TË MARRË API KEY NGA DATABASE
function getOpenAIApiKey(userId = 1) {
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

// ✅ FUNKSION PËR DEKRIPTIM
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

// ✅ FUNKSION KRYESOR PËR TRANSKRIPTIM
async function transcribeAudio(file, userId = 1) {
  try {
    if (!file || !file.path) {
      throw new Error("Asnjë skedar audio nuk u dërgua për transkriptim.");
    }

    console.log(`🎧 Duke transkriptuar: ${file.originalname} për user: ${userId}`);

    // ✅ MER API KEY NGA DATABASE
    const encryptedApiKey = await getOpenAIApiKey(userId);
    
    if (!encryptedApiKey) {
      throw new Error("Nuk ka OpenAI API Key të konfiguruar për transkriptim. Vendosni API Key në panelin OpenAI.");
    }

    // ✅ DEKRIPTO API KEY
    const apiKey = decryptApiKey(encryptedApiKey);
    console.log('🔑 API Key u gjet nga database për voice service');

    // ✅ KRIJO OPENAI CLIENT ME KEY NGA DATABASE
    const openai = new OpenAI({
      apiKey: apiKey
    });

    // ✅ TRANSKRIPTO AUDIO
    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(file.path),
      model: "whisper-1",
      response_format: "json",
      prompt: "Ky audio është në gjuhën shqipe. Transkriptoje saktë në shqip.",
    });

    const text = response.text?.trim() || "";
    console.log(`✅ Transkriptimi përfundoi: ${text}`);

    // ✅ FSHI SKEDARIN E PËRKOTHSHËM
    fs.unlink(file.path, (err) => {
      if (err) console.warn("⚠️ S'u fshi skedari i përkohshëm:", err);
    });

    return {
      success: true,
      text: text,
      source: 'OpenAI Whisper'
    };

  } catch (err) {
    console.error("❌ Gabim gjatë transkriptimit:", err.message);
    
    // ✅ FSHI SKEDARIN EDHE NË RAST GABIMI
    if (file && file.path) {
      fs.unlink(file.path, (unlinkErr) => {
        if (unlinkErr) console.warn("⚠️ S'u fshi skedari i përkohshëm pas gabimit:", unlinkErr);
      });
    }

    return {
      success: false,
      error: "Gabim gjatë transkriptimit të zërit: " + err.message,
      suggestion: "Kontrolloni nëse keni vendosur OpenAI API Key në panel"
    };
  }
}

// ✅ FUNKSION TEST PËR VERIFIKIM
async function testVoiceService(userId = 1) {
  try {
    const apiKey = await getOpenAIApiKey(userId);
    return {
      service: 'Voice Service',
      apiKeyExists: !!apiKey,
      message: apiKey ? '✅ Voice service gati' : '❌ Mungon API Key për voice service',
      userId: userId
    };
  } catch (error) {
    return {
      service: 'Voice Service',
      apiKeyExists: false,
      error: error.message
    };
  }
}

module.exports = { 
  transcribeAudio,
  testVoiceService,
  getOpenAIApiKey
};
