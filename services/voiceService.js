/**
 * ✅ Voice Service - Optimizuar për shqip, pa language param (auto-detect)
 */
const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const tempDir = path.join(__dirname, "../temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

async function transcribeAudio(file) {
  try {
    if (!file || !file.path) {
      throw new Error("Asnjë skedar audio nuk u dërgua për transkriptim.");
    }

    console.log(`🎧 Duke transkriptuar: ${file.originalname}`);

    // ✅ Mos dërgo language fare (auto-detect)
  const response = await openai.audio.transcriptions.create({
  file: fs.createReadStream(file.path),
  model: "whisper-1",
  response_format: "json",
  prompt: "Ky audio është në gjuhën shqipe. Transkriptoje saktë në shqip.",
});
    const text = response.text?.trim() || "";
    console.log(`✅ Transkriptimi përfundoi: ${text}`);

    fs.unlink(file.path, (err) => {
      if (err) console.warn("⚠️ S’u fshi skedari i përkohshëm:", err);
    });

    return text;
  } catch (err) {
    console.error("❌ Gabim gjatë transkriptimit:", err.message);
    throw new Error("Gabim gjatë transkriptimit të zërit. Detaje: " + err.message);
  }
}

module.exports = { transcribeAudio };
