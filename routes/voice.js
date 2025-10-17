const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { transcribeAudio } = require("../services/voiceService");

// 📁 Vendos skedarët në /temp
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../temp")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// 🎤 Ruta për transkriptim
router.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    const text = await transcribeAudio(req.file);
    res.json({ success: true, text });
  } catch (error) {
    console.error("❌ Gabim në /transcribe:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
