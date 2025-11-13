// ========================================== context-memory ====================================================
const express = require('express');
const ContextMemoryService = require('../services/contextMemoryService');
const router = express.Router();

const contextMemoryService = new ContextMemoryService();

// 📊 STATUS I SHËRBIMIT
router.get('/status', (req, res) => {
    res.json(contextMemoryService.getServiceStatus());
});

// 💾 RUAJT KONTEKST
router.post('/store', async (req, res) => {
    try {
        const { contextId, contextData, metadata } = req.body;
        const result = await contextMemoryService.storeContext(contextId, contextData, metadata);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 🔍 KËRKO KONTEKST
router.get('/retrieve/:contextId', async (req, res) => {
    try {
        const { contextId } = req.params;
        const result = await contextMemoryService.retrieveContext(contextId);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 🔗 KRIJO ASOCIIM
router.post('/associate', async (req, res) => {
    try {
        const { sourceContext, targetContext, associationType, strength } = req.body;
        const result = await contextMemoryService.createAssociation(sourceContext, targetContext, associationType, strength);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 📈 STATISTIKA
router.get('/stats', (req, res) => {
    res.json(contextMemoryService.getMemoryStats());
});

module.exports = router;
