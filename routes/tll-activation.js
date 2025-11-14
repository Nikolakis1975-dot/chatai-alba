// ================================================== tll-activation =============================================
const express = require('express');
const TLLActivationService = require('../services/TLL_Activation_Service');
const router = express.Router();

const tllService = new TLLActivationService();

// 📊 STATUS I SHËRBIMIT
router.get('/status', (req, res) => {
    res.json(tllService.getServiceStatus());
});

// 🎯 AKTIVIZIMI I TERMINALIT
router.post('/activate', async (req, res) => {
    try {
        const { userID, userLanguage } = req.body;
        const result = await tllService.activateTerminal(userID, userLanguage);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
