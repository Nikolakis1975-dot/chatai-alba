// ========================================================
// Openai RRUFE TESLA 10.5
// ========================================================
const express = require('express');
const router = express.Router();
const { User } = require('../models/User'); // ✅ Rruga e saktë
const encryption = require('../utils/encryption');
const OpenAIEnhancedService = require('../services/openaiEnhancedService');

// ✅ Ruaj OpenAI API Key
router.post('/save-key', async (req, res) => {
    try {
        const { apiKey } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.json({
                success: false,
                message: 'Përdoruesi nuk është i identifikuar'
            });
        }

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

// ✅ Fshi OpenAI API Key
router.delete('/delete-key', async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.json({
                success: false,
                message: 'Përdoruesi nuk është i identifikuar'
            });
        }

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

// ✅ Status i OpenAI Key
router.get('/status', async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.json({
                success: false,
                message: 'Përdoruesi nuk është i identifikuar'
            });
        }

        const user = await User.findByPk(userId);

        res.json({
            success: true,
            hasApiKey: !!user?.openaiApiKey,
            isActive: user?.isOpenaiActive || false,
            message: user?.openaiApiKey ? 
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

// ✅ Chat me OpenAI
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.json({
                success: false,
                message: 'Përdoruesi nuk është i identifikuar'
            });
        }

        if (!message) {
            return res.json({
                success: false,
                message: 'Mesazhi është i zbrazët'
            });
        }

        const result = await OpenAIEnhancedService.chatWithOpenAI(userId, message);

        if (result.fallback) {
            // Fallback në Gemini nëse OpenAI dështon
            const geminiService = require('./../services/geminiService');
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
            const geminiService = require('./../services/geminiService');
            const geminiResult = await geminiService.generateResponse(req.body.message, req.user?.id);
            
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
