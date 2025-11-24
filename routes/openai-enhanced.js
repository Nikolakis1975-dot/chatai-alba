// ========================================================
// Openai RRUFE TESLA 10.5
// ========================================================
const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const encryption = require('../utils/encryption');
const OpenAIEnhancedService = require('../services/openaiEnhancedService');

// ✅ MIDDLEWARE I KORRIGJUAR - PËRDOR I NJËJTIN SISTEM SI GEMINI
const authenticateUser = async (req, res, next) => {
    try {
        console.log('🔐 OpenAI Auth Check - Cookies:', req.cookies);
        console.log('🔐 OpenAI Auth Check - Headers:', req.headers);
        
        // MËNYRA 1: Kontrollo session (si në Gemini)
        if (req.session && req.session.userId) {
            req.user = { id: req.session.userId };
            console.log('✅ OpenAI Auth SUCCESS nga session - User ID:', req.user.id);
            return next();
        }
        
        // MËNYRA 2: Kontrollo token nga headers (si në Gemini)
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            // Verifiko token-in - përdor të njëjtin sistem si Gemini
            try {
                const jwt = require('jsonwebtoken');
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
                req.user = { id: decoded.userId };
                console.log('✅ OpenAI Auth SUCCESS nga token - User ID:', req.user.id);
                return next();
            } catch (tokenError) {
                console.log('❌ Token i pavlefshëm:', tokenError.message);
            }
        }
        
        // MËNYRA 3: Kontrollo userId nga body (fallback)
        if (req.body && req.body.userId) {
            req.user = { id: req.body.userId };
            console.log('✅ OpenAI Auth SUCCESS nga body - User ID:', req.user.id);
            return next();
        }
        
        // MËNYRA 4: Kontrollo localStorage userId (përmes header)
        const userIdHeader = req.headers['x-user-id'];
        if (userIdHeader) {
            req.user = { id: userIdHeader };
            console.log('✅ OpenAI Auth SUCCESS nga header - User ID:', req.user.id);
            return next();
        }
        
        console.log('❌ OpenAI Auth FAILED - Asnjë metodë nuk funksionoi');
        return res.json({
            success: false,
            message: 'Session ka skaduar. Ju lutem rifreskoni faqen.'
        });
        
    } catch (error) {
        console.error('❌ Gabim në OpenAI auth:', error);
        return res.json({
            success: false,
            message: 'Gabim në identifikim'
        });
    }
};

// Përdor middleware
router.use(authenticateUser);

// ✅ RUTA TESTUESE - PROVO KËTË SË PARI
router.get('/test-session', async (req, res) => {
    try {
        console.log('🧪 Test Session - User:', req.user);
        
        const user = await User.findByPk(req.user.id);
        
        res.json({
            success: true,
            message: 'OpenAI session test SUCCESS',
            user: {
                id: user.id,
                username: user.username,
                hasOpenAIKey: !!user.openaiApiKey
            }
        });
        
    } catch (error) {
        console.error('❌ Gabim në test session:', error);
        res.json({
            success: false,
            message: 'Test session FAILED: ' + error.message
        });
    }
});

// ✅ RUAJ OPENAI KEY - VERSION I KORRIGJUAR
router.post('/save-key', async (req, res) => {
    try {
        const { apiKey } = req.body;
        const userId = req.user.id;

        console.log('💾 Duke ruajtur OpenAI Key për user:', userId);

        if (!apiKey) {
            return res.json({
                success: false,
                message: 'API Key është e zbrazët'
            });
        }

        const encryptedKey = encryption.encrypt(apiKey);
        
        await User.update({
            openaiApiKey: encryptedKey,
            isOpenaiActive: true
        }, { where: { id: userId } });

        console.log('✅ OpenAI Key u ruajt për user:', userId);

        res.json({
            success: true,
            message: 'OpenAI API Key u ruajt me sukses!'
        });

    } catch (error) {
        console.error('❌ Gabim në ruajtjen e OpenAI Key:', error);
        res.json({
            success: false,
            message: 'Gabim në ruajtjen e API Key: ' + error.message
        });
    }
});

// ✅ STATUS I OPENAI KEY - VERSION I KORRIGJUAR
router.get('/status', async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('🔍 Duke kontrolluar statusin OpenAI për user:', userId);

        const user = await User.findByPk(userId);

        if (!user) {
            return res.json({
                success: false,
                message: 'Përdoruesi nuk u gjet'
            });
        }

        res.json({
            success: true,
            hasApiKey: !!user.openaiApiKey,
            isActive: user.isOpenaiActive || false,
            message: user.openaiApiKey ? 
                'OpenAI është i konfiguruar' : 
                'OpenAI nuk është i konfiguruar'
        });

    } catch (error) {
        console.error('❌ Gabim në status OpenAI:', error);
        res.json({
            success: false,
            message: 'Gabim në kontrollimin e statusit'
        });
    }
});

module.exports = router;
