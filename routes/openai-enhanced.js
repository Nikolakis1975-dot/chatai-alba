// ========================================================
// Openai RRUFE TESLA 10.5
// ========================================================
const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const encryption = require('../utils/encryption');
const OpenAIEnhancedService = require('../services/openaiEnhancedService');

// ✅ MIDDLEWARE PËR AUTHENTICATION - KORRIGJUAR
const authenticateUser = (req, res, next) => {
    try {
        // Kontrollo nëse ka session të aktiv
        if (req.session && req.session.userId) {
            req.user = { id: req.session.userId };
            return next();
        }
        
        // Kontrollo nëse ka token në header
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            // Verifiko token-in (implementoje këtë nëse ke JWT)
            // req.user = verifyToken(token);
            // return next();
        }
        
        // Kontrollo nëse ka cookie me user ID
        if (req.cookies && req.cookies.userId) {
            req.user = { id: req.cookies.userId };
            return next();
        }
        
        console.log('❌ Përdoruesi nuk është i identifikuar:', {
            session: req.session,
            cookies: req.cookies,
            headers: req.headers
        });
        
        return res.json({
            success: false,
            message: 'Përdoruesi nuk është i identifikuar. Ju lutem identifikohuni përsëri.'
        });
        
    } catch (error) {
        console.error('❌ Gabim në authentication:', error);
        return res.json({
            success: false,
            message: 'Gabim në identifikim'
        });
    }
};

// ✅ Përdor middleware-in për të gjitha rrugët
router.use(authenticateUser);

// ✅ Ruaj OpenAI API Key - VERSION I KORRIGJUAR
router.post('/save-key', async (req, res) => {
    try {
        const { apiKey } = req.body;
        const userId = req.user.id;

        console.log('🔐 Duke ruajtur OpenAI Key për user:', userId);

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
            message: 'Gabim në ruajtjen e API Key'
        });
    }
});

// ✅ Fshi OpenAI API Key - VERSION I KORRIGJUAR
router.delete('/delete-key', async (req, res) => {
    try {
        const userId = req.user.id;

        console.log('🗑️ Duke fshirë OpenAI Key për user:', userId);

        await User.update({
            openaiApiKey: null,
            isOpenaiActive: false
        }, { where: { id: userId } });

        console.log('✅ OpenAI Key u fshi për user:', userId);

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

// ✅ Status i OpenAI Key - VERSION I KORRIGJUAR
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

// ✅ Chat me OpenAI - VERSION I KORRIGJUAR
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.id;

        console.log('🔮 OpenAI Chat për user:', userId, 'Mesazhi:', message?.substring(0, 50));

        if (!message) {
            return res.json({
                success: false,
                message: 'Mesazhi është i zbrazët'
            });
        }

        const result = await OpenAIEnhancedService.chatWithOpenAI(userId, message);

        if (result.fallback) {
            // Fallback në Gemini nëse OpenAI dështon
            const geminiService = require('../services/geminiService');
            const geminiResult = await geminiService.generateResponse(message, userId);
            
            return res.json({
                success: true,
                response: `🔮 **OpenAI Fallback**\n\n${geminiResult.response}`,
                fallback: true,
                source: 'gemini'
            });
        }

        res.json({
            success: true,
            response: `🔮 **OpenAI**\n\n${result.response}`,
            model: result.model,
            tokens: result.tokens,
            source: 'openai'
        });

    } catch (error) {
        console.error('❌ Gabim në OpenAI chat:', error);
        
        // Fallback në Gemini
        try {
            const geminiService = require('../services/geminiService');
            const geminiResult = await geminiService.generateResponse(req.body.message, req.user.id);
            
            res.json({
                success: true,
                response: `🔮 **OpenAI Fallback**\n\n${geminiResult.response}`,
                fallback: true,
                source: 'gemini'
            });
        } catch (fallbackError) {
            res.json({
                success: false,
                response: '❌ Gabim në të dy shërbimet AI'
            });
        }
    }
});

module.exports = router;
