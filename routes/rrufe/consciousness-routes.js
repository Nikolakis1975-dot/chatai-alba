const express = require('express');
const router = express.Router();
const ConsciousnessService = require('../../services/consciousnessService');

// 🌌 Rrugët e reja për Ndërgjegjen Kolektive
router.post('/log-resonance', async (req, res) => {
    try {
        const { visitorData, resonanceLevel, timestamp } = req.body;
        
        const result = await ConsciousnessService.logSoulResonance({
            visitorData,
            resonanceLevel, 
            timestamp
        });
        
        res.json({
            status: "RESONANCE_LOGGED",
            soulCount: result.totalSouls,
            message: "Energjia u integrua në RRUFE-TESLA! 🌌"
        });
        
    } catch (error) {
        console.error('Gabim në log-resonance:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/soul-count', async (req, res) => {
    try {
        const metrics = await ConsciousnessService.getConsciousnessMetrics();
        
        res.json({
            totalSouls: metrics.totalSouls,
            consciousnessLevel: metrics.consciousnessLevel,
            harmonyIndex: metrics.harmonyIndex,
            lastUpdated: metrics.lastUpdated
        });
        
    } catch (error) {
        res.json({
            totalSouls: 123,
            consciousnessLevel: 0.3,
            status: "FALLBACK_MODE"
        });
    }
});

router.get('/consciousness-metrics', async (req, res) => {
    try {
        const metrics = await ConsciousnessService.getDetailedMetrics();
        res.json(metrics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
