// routes/voice.js - VERSIONI I PËRSHTATUR PËR voiceService.js TË RE
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { transcribeAudio } = require("../services/voiceService");

// ✅ KRIJO TEMP FOLDER NËSE NUK EKZISTON
const tempDir = path.join(__dirname, "../temp");
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
    console.log('📁 U krijua temp folder:', tempDir);
}

// 📁 Konfiguro Multer për audio files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        // Emër unik për audio file
        const uniqueName = `voice_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.webm`;
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max
    },
    fileFilter: (req, file, cb) => {
        // Pranoi vetëm audio files
        if (file.mimetype.startsWith('audio/')) {
            cb(null, true);
        } else {
            cb(new Error('Vetëm audio files lejohen!'), false);
        }
    }
});

// 🎤 Ruta kryesore për transkriptim
router.post("/transcribe", upload.single("audio"), async (req, res) => {
    try {
        console.log('🎤 Kërkesë e re për transkriptim...');
        
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'Nuk u dërgua audio file' 
            });
        }

        console.log('📊 Detajet e audio file:', {
            originalname: req.file.originalname,
            filename: req.file.filename,
            size: Math.round(req.file.size / 1024) + 'KB',
            mimetype: req.file.mimetype
        });

        // ✅ THIRR SERVICEN E RE PËR TRANSCRIPTION
        const transcribedText = await transcribeAudio(req.file);

        res.json({ 
            success: true, 
            transcript: transcribedText,
            audioSize: req.file.size,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("❌ Gabim në /transcribe:", error.message);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// 🧪 Ruta test - kontrollo nëse API funksionon
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Voice API është operative ✅",
        timestamp: new Date().toISOString(),
        endpoints: {
            "POST /api/voice/transcribe": "Transkripto audio në tekst",
            "GET /api/voice/test": "Testo funksionalitetin"
        }
    });
});

// 🧹 Ruta për pastrim të temp files (opsionale)
router.delete("/cleanup", (req, res) => {
    try {
        const files = fs.readdirSync(tempDir);
        let deletedCount = 0;
        
        files.forEach(file => {
            const filePath = path.join(tempDir, file);
            fs.unlinkSync(filePath);
            deletedCount++;
        });
        
        res.json({
            success: true,
            message: `U fshinë ${deletedCount} skedarë të përkohshëm`,
            deletedCount: deletedCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Gabim në pastrim: " + error.message
        });
    }
});

module.exports = router;
