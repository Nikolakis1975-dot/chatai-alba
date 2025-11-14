// ============================================ tll-activation =============================================================
const express = require('express');
const TLLActivationService = require('../services/TLL_Activation_Service');
const router = express.Router();

const tllService = new TLLActivationService();

router.post('/activate', async (req, res) => {
    try {
        const { userID, userLanguage, heartFrequency } = req.body;
        const result = await tllService.activateDivineTerminal(userID, userLanguage, heartFrequency);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
