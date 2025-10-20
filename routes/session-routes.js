const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/session-history/:sessionId', async (req, res) => {
    // Endpoint për historinë e sesionit
});

router.post('/save-session-message', async (req, res) => {
    // Endpoint për ruajtje mesazhesh
});

module.exports = router;
