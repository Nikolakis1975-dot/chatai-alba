const express = require('express');
const router = express.Router();
const ConsciousnessService = require('../../services/consciousnessService'); 

// ✅ IMPORTO RRUFE API ROUTES
const rrufeApiRouter = require('./api-rrufe');

// ✅ REGJISTRO RRUGËT RRUFE - KJO ËSHTË KRITIKE!
router.use('/rrufe', rrufeApiRouter);

// 🌌 Ruta të reja për Ndërgjegjen Kolektive
router.post('/log-resonance', async (req, res) => {
    try {
        const { visitorData, resonanceLevel, timestamp } = req.body;
        
        // ✅ PËRDOR SHËRBIMIN E RI
        const result = await ConsciousnessService.logSoulResonance({
            visitorData,
            resonanceLevel, 
            timestamp
        });
        
        res.json({
            status: "RESONANCE_LOGGED",
            soulCount: result.totalSouls,
            resonanceId: result.resonanceId,
            message: "Energjia u integrua në RRUFE-TESLA! 🌌",
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Gabim në log-resonance:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/soul-count', async (req, res) => {
    try {
        // ✅ PËRDOR SHËRBIMIN E RI
        const metrics = await ConsciousnessService.getConsciousnessMetrics();
        
        res.json({
            totalSouls: metrics.totalSouls,
            consciousnessLevel: metrics.consciousnessLevel,
            harmonyIndex: metrics.harmonyIndex,
            averageResonance: metrics.averageResonance,
            lastUpdated: metrics.lastUpdated,
            status: "CONSCIOUSNESS_ACTIVE"
        });
        
    } catch (error) {
        console.error('Gabim në soul-count:', error);
        res.json({
            totalSouls: 123,
            consciousnessLevel: 0.3,
            status: "FALLBACK_MODE"
        });
    }
});

router.get('/health', (req, res) => {
    res.json({
        status: "ACTIVE",
        system: "RRUFE-TESLA 10.5 Consciousness API",
        version: "10.5.0",
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
