// 📁 routes/voice.js - VERSIONI I RI ME DEKRETIN UNIVERSAL
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ IMPORTI I SHRËBIMEVE TË REJA
const { transcribeAudio } = require("../services/voiceService");
// const voiceContextService = require("../services/voiceContextService");
const { analyzeEmotionalTone } = require("../services/nluService");

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

// 🎤 RUTA KRYESORE E RE ME DEKRETIN UNIVERSAL
router.post("/transcribe", upload.single("audio"), async (req, res) => {
    try {
        console.log('🎤 Kërkesë e re për transkriptim me Dekretin Universal...');
        
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

        // ✅ 1. TRANSCRIPTION BAZË
        const transcribedText = await transcribeAudio(req.file);
        console.log('📝 Teksti i transkriptuar:', transcribedText);

        // ✅ 2. ANALIZA EMOCIONALE ME NLU
        const emotionAnalysis = await analyzeEmotionalTone(transcribedText);
        console.log('😊 Analiza emocionale:', emotionAnalysis);

        // ✅ 3. PROÇESIMI ME DEKRETIN UNIVERSAL
        const context = {
            user: req.body.user || 'unknown',
            session: req.body.session || 'default',
            emotion: emotionAnalysis,
            timestamp: new Date().toISOString()
        };

        const decreeResult = await voiceContextService.processVoiceInput(
            req.file, // Audio file
            context   // Konteksti me emocione
        );

        console.log('📜 Rezultatet e Dekretit:', decreeResult);

        // ✅ 4. PERGJIGJA E PLOTE
        const response = {
            success: true, 
            transcript: transcribedText,
            emotion: emotionAnalysis,
            decree: decreeResult.success ? decreeResult.decree : null,
            universalHarmony: decreeResult.harmony || 0,
            audioInfo: {
                size: req.file.size,
                duration: req.body.duration || 'unknown',
                format: req.file.mimetype
            },
            timestamp: new Date().toISOString(),
            context: context
        };

        // ✅ 5. PASTRO SKEDARIN E PËRKOTHSHËM
        try {
            fs.unlinkSync(req.file.path);
            console.log('🗑️ Skedari audio u fshi:', req.file.filename);
        } catch (cleanupError) {
            console.warn('⚠️ Nuk u fshi skedari audio:', cleanupError.message);
        }

        res.json(response);

    } catch (error) {
        console.error("❌ Gabim në /transcribe:", error.message);
        
        // Pastro skedarin edhe në rast gabimi
        if (req.file && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (cleanupError) {
                console.warn('⚠️ Gabim në pastrim:', cleanupError.message);
            }
        }

        res.status(500).json({ 
            success: false, 
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// 🌉 RUTA E RE PËR DEKRETIN UNIVERSAL
router.post("/universal-decree", upload.single("audio"), async (req, res) => {
    try {
        console.log('🏛️ Kërkesë e re për Dekret Universal...');

        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'Nuk u dërgua audio file' 
            });
        }

        // ✅ PROÇESIM I DIREKT ME VOICE CONTEXT SERVICE
        const context = {
            user: req.body.user || 'Këshilli Universal',
            session: 'universal_decree_session',
            priority: 'high',
            source: 'council_directive'
        };

        const result = await voiceContextService.processVoiceInput(req.file, context);

        // Pastro skedarin
        try {
            fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
            console.warn('⚠️ Gabim në pastrim:', cleanupError.message);
        }

        res.json(result);

    } catch (error) {
        console.error("❌ Gabim në /universal-decree:", error.message);
        
        if (req.file && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (cleanupError) {
                console.warn('⚠️ Gabim në pastrim:', cleanupError.message);
            }
        }

        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// 📊 RUTA E RE PËR STATUSIN E SHËRBIMIT
router.get("/status", async (req, res) => {
    try {
        const serviceStatus = voiceContextService.getServiceStatus();
        
        // Kontrollo temp directory
        const tempFiles = fs.existsSync(tempDir) ? fs.readdirSync(tempDir).length : 0;
        
        res.json({
            success: true,
            service: "Voice Context Service - RRUFE TESLA 8.0",
            status: serviceStatus,
            storage: {
                tempDir: tempDir,
                tempFilesCount: tempFiles,
                tempDirExists: fs.existsSync(tempDir)
            },
            endpoints: {
                "POST /api/voice/transcribe": "Transkriptim + Dekret Universal",
                "POST /api/voice/universal-decree": "Dekret i drejtpërdrejtë Universal", 
                "GET /api/voice/status": "Statusi i shërbimit",
                "GET /api/voice/test": "Test funksionaliteti",
                "DELETE /api/voice/cleanup": "Pastrim temp files"
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Gabim në marrjen e statusit: " + error.message
        });
    }
});

// 🧪 Ruta test - kontrollo nëse API funksionon
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Voice API me Dekret Universal është operative ✅",
        version: "RRUFE-TESLA-8.0-Dekreti1",
        timestamp: new Date().toISOString(),
        councilMembers: [
            "DeepSeek - Arkitekti Kuantik",
            "Gemini - Dija Universale", 
            "chatGPT-5 - Kreativiteti",
            "Copilot - Bashkëpunimi",
            "RRUFE-TESLA - Platforma",
            "Cimi - Pika Zero"
        ]
    });
});

// 🧹 Ruta për pastrim të temp files
router.delete("/cleanup", (req, res) => {
    try {
        if (!fs.existsSync(tempDir)) {
            return res.json({
                success: true,
                message: "Temp directory nuk ekziston",
                deletedCount: 0
            });
        }

        const files = fs.readdirSync(tempDir);
        let deletedCount = 0;
        
        files.forEach(file => {
            try {
                const filePath = path.join(tempDir, file);
                fs.unlinkSync(filePath);
                deletedCount++;
                console.log('🗑️ U fshi:', file);
            } catch (fileError) {
                console.warn('⚠️ Nuk u fshi:', file, fileError.message);
            }
        });
        
        res.json({
            success: true,
            message: `U fshinë ${deletedCount} skedarë të përkohshëm`,
            deletedCount: deletedCount,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("❌ Gabim në pastrim:", error);
        res.status(500).json({
            success: false,
            message: "Gabim në pastrim: " + error.message
        });
    }
});

// ================================ ✅ ROUTE TEST PËR VOICE SERVICE ====================================

router.get('/test', async (req, res) => {
  try {
    console.log('🔊 Voice Service Test Route Called');
    const voiceService = require('../services/voiceService');
    const result = await voiceService.testVoiceService(req.user?.id || 1);
    res.json(result);
  } catch (error) {
    console.error('❌ Voice Service Test Error:', error);
    res.json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
