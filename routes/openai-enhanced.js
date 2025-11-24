// ========================================================
// Openai RRUFE TESLA 10.5
// ========================================================
const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const encryption = require('../utils/encryption');

// ✅ MIDDLEWARE I THJESHTË - PA SESSION COMPLEX
const authenticateUser = async (req, res, next) => {
    try {
        console.log('🔐 OpenAI Auth - Headers:', req.headers);
        
        // MËNYRA 1: Merr userId nga header
        const userId = req.headers['x-user-id'];
        if (userId && userId !== 'null' && userId !== 'undefined') {
            req.user = { id: userId };
            console.log('✅ OpenAI Auth SUCCESS nga header - User ID:', userId);
            return next();
        }
        
        // MËNYRA 2: Merr userId nga body
        if (req.body && req.body.userId) {
            req.user = { id: req.body.userId };
            console.log('✅ OpenAI Auth SUCCESS nga body - User ID:', req.body.userId);
            return next();
        }
        
        // MËNYRA 3: Kontrollo session (fallback)
        if (req.session && req.session.userId) {
            req.user = { id: req.session.userId };
            console.log('✅ OpenAI Auth SUCCESS nga session - User ID:', req.session.userId);
            return next();
        }
        
        console.log('❌ OpenAI Auth FAILED - Asnjë userId nuk u gjet');
        return res.json({
            success: false,
            message: 'Ju duhet të jeni i loguar për të përdorur OpenAI.'
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

// ✅ RUTA TESTUESE - PA AUTH
router.get('/test-no-auth', async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Kjo rrutë funksionon pa auth!',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Test FAILED: ' + error.message
        });
    }
});

// ✅ RUTA TESTUESE - ME AUTH
router.get('/test-with-auth', async (req, res) => {
    try {
        console.log('🧪 Test Auth - User:', req.user);
        
        const user = await User.findByPk(req.user.id);
        
        res.json({
            success: true,
            message: 'Auth test SUCCESS',
            user: {
                id: user.id,
                username: user.username
            }
        });
        
    } catch (error) {
        console.error('❌ Gabim në test auth:', error);
        res.json({
            success: false,
            message: 'Auth test FAILED: ' + error.message
        });
    }
});

// ✅ RUAJ OPENAI KEY - VERSION I THJESHTË
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

        // ✅ RUAJ NË DATABASE - Kjo është ajo që duhet!
        const encryptedKey = encryption.encrypt(apiKey);
        
        await User.update({
            openaiApiKey: encryptedKey,
            isOpenaiActive: true
        }, { where: { id: userId } });

        console.log('✅ OpenAI Key u ruajt në database për user:', userId);

        res.json({
            success: true,
            message: 'OpenAI API Key u ruajt me sukses në database!'
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

// ✅ FSHI OPENAI KEY
router.delete('/delete-key', async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('🗑️ Duke fshirë OpenAI Key për user:', userId);

        await User.update({
            openaiApiKey: null,
            isOpenaiActive: false
        }, { where: { id: userId } });

        res.json({
            success: true,
            message: 'OpenAI API Key u fshi me sukses!'
        });

    } catch (error) {
        console.error('❌ Gabim në fshirjen e OpenAI Key:', error);
        res.json({
            success: false,
            message: 'Gabim në fshirjen e API Key'
        });
    }
});

module.exports = router;
