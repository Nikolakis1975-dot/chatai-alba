// ========================================================
// Openai RRUFE TESLA 10.5
// ========================================================
const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const encryption = require('../utils/encryption');
const OpenAIEnhancedService = require('../services/openaiEnhancedService');

// ✅ PËRDOR I NJËJTIN AUTH MIDDLEWARE SI GEMINI
const authenticateUser = async (req, res, next) => {
    try {
        console.log('🔐 OpenAI Auth Check - Session:', req.session);
        
        // I NJËJTI KOD SI NË GEMINI ROUTES
        if (req.session && req.session.userId) {
            req.user = { id: req.session.userId };
            console.log('✅ OpenAI Auth SUCCESS - User ID:', req.user.id);
            return next();
        }
        
        // Fallback: provo me cookie
        if (req.cookies && req.cookies.userId) {
            req.user = { id: req.cookies.userId };
            console.log('✅ OpenAI Auth SUCCESS nga cookie - User ID:', req.user.id);
            return next();
        }
        
        console.log('❌ OpenAI Auth FAILED - Session:', req.session);
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

// ✅ RUTA E STATUSIT - TESTONI KËTË SË PARI
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
            },
            session: req.session
        });
        
    } catch (error) {
        console.error('❌ Gabim në test session:', error);
        res.json({
            success: false,
            message: 'Test session FAILED: ' + error.message
        });
    }
});

// ✅ RUAJ OPENAI KEY
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

// ✅ STATUS I OPENAI KEY
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
