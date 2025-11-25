// ========================================================
// Openai RRUFE TESLA 10.5
// ========================================================
const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const encryption = require('../utils/encryption');
const jwt = require('jsonwebtoken');

// ✅ JWT AUTH MIDDLEWARE - PËRDO AUTH_TOKEN COOKIE
const authenticateUser = async (req, res, next) => {
    try {
        console.log('🔐 OpenAI JWT Auth Check:');
        
        let token = null;
        let userId = null;

        // MËNYRA 1: Merr token nga cookie (auth_token)
        if (req.cookies && req.cookies.auth_token) {
            token = req.cookies.auth_token;
            console.log('✅ Token u gjet nga cookie');
        }
        
        // MËNYRA 2: Merr token nga headers
        else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.substring(7);
            console.log('✅ Token u gjet nga headers');
        }

        // VERIFIKO TOKEN
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwt-super-secret-key-2024-alba-rrufe-tesla-strong');
                userId = decoded.userId || decoded.id;
                console.log('✅ JWT Token valid - User ID:', userId);
                console.log('✅ User decoded:', decoded);
                
                req.user = { id: userId };
                return next();
                
            } catch (tokenError) {
                console.log('❌ JWT Token invalid:', tokenError.message);
            }
        }

        console.log('❌ Auth FAILED - No valid token found');
        return res.json({
            success: false,
            message: 'Authentication failed. Please refresh and login again.'
        });
        
    } catch (error) {
        console.error('❌ Gabim në auth middleware:', error);
        return res.json({
            success: false,
            message: 'Gabim në identifikim'
        });
    }
};

// Përdor middleware
router.use(authenticateUser);

// ✅ DEBUG ROUTE
router.get('/debug-auth', async (req, res) => {
    try {
        // Test database connection too
        const user = await User.findByPk(req.user.id);
        
        res.json({
            success: true,
            message: 'JWT Auth Debug SUCCESS',
            user: {
                id: req.user.id,
                dbUser: user ? {
                    id: user.id,
                    username: user.username,
                    hasOpenAIKey: !!user.openaiApiKey
                } : 'User not found in DB'
            },
            tokenInfo: {
                hasToken: !!(req.cookies && req.cookies.auth_token),
                tokenPresent: req.cookies && req.cookies.auth_token ? 'YES' : 'NO'
            }
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Debug FAILED: ' + error.message
        });
    }
});

// ✅ STATUS
router.get('/status', async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('🔍 Status check for user:', userId);

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
            message: user.openaiApiKey ? 'OpenAI është i konfiguruar' : 'OpenAI nuk është i konfiguruar',
            user: {
                id: user.id,
                username: user.username
            }
        });

    } catch (error) {
        console.error('❌ Status error:', error);
        res.json({
            success: false,
            message: 'Gabim në kontrollimin e statusit'
        });
    }
});

// ✅ SAVE KEY
router.post('/save-key', async (req, res) => {
    try {
        const { apiKey } = req.body;
        const userId = req.user.id;

        console.log('💾 Saving OpenAI Key for user:', userId);
        console.log('🔑 API Key received:', apiKey ? 'YES (' + apiKey.substring(0, 10) + '...)' : 'NO');

        if (!apiKey) {
            return res.json({
                success: false,
                message: 'API Key është e zbrazët'
            });
        }

        // Kontrollo nëse API Key është valid
        if (!apiKey.startsWith('sk-proj') && !apiKey.startsWith('sk-')) {
            return res.json({
                success: false,
                message: 'API Key nuk duket të jetë valid. Duhet të fillojë me "sk-proj" ose "sk-"'
            });
        }

        const encryptedKey = encryption.encrypt(apiKey);
        
        const result = await User.update({
            openaiApiKey: encryptedKey,
            isOpenaiActive: true,
            updatedAt: new Date()
        }, { 
            where: { id: userId } 
        });

        console.log('✅ OpenAI Key saved for user:', userId, 'Result:', result);

        res.json({
            success: true,
            message: 'OpenAI API Key u ruajt me sukses!'
        });

    } catch (error) {
        console.error('❌ Save key error:', error);
        res.json({
            success: false,
            message: 'Gabim në ruajtjen e API Key: ' + error.message
        });
    }
});

// ✅ DELETE KEY
router.delete('/delete-key', async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('🗑️ Deleting OpenAI Key for user:', userId);

        const result = await User.update({
            openaiApiKey: null,
            isOpenaiActive: false,
            updatedAt: new Date()
        }, { where: { id: userId } });

        console.log('✅ OpenAI Key deleted for user:', userId, 'Result:', result);

        res.json({
            success: true,
            message: 'OpenAI API Key u fshi me sukses!'
        });

    } catch (error) {
        console.error('❌ Delete key error:', error);
        res.json({
            success: false,
            message: 'Gabim në fshirjen e API Key: ' + error.message
        });
    }
});

// ✅ TEST ROUTE - PA AUTH (vetëm për test)
router.get('/test-connection', async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'OpenAI Routes are working!',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Test failed: ' + error.message
        });
    }
});

module.exports = router;
