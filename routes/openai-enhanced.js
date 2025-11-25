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
        console.log('   - Cookies:', req.cookies);
        console.log('   - Headers auth:', req.headers.authorization);
        
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
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
                userId = decoded.userId || decoded.id;
                console.log('✅ JWT Token valid - User ID:', userId);
                
                req.user = { id: userId };
                return next();
                
            } catch (tokenError) {
                console.log('❌ JWT Token invalid:', tokenError.message);
            }
        }

        // MËNYRA 3: Session fallback
        if (req.session && req.session.userId) {
            userId = req.session.userId;
            console.log('✅ Session auth - User ID:', userId);
            req.user = { id: userId };
            return next();
        }

        console.log('❌ Auth FAILED - No valid token or session');
        return res.json({
            success: false,
            message: 'Session ka skaduar. Ju lutem rifreskoni faqen dhe logoheni përsëri.',
            debug: {
                hasToken: !!token,
                hasSession: !!(req.session && req.session.userId)
            }
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
        res.json({
            success: true,
            message: 'JWT Auth Debug',
            user: req.user,
            tokenInfo: {
                hasToken: !!(req.cookies && req.cookies.auth_token),
                token: req.cookies && req.cookies.auth_token ? 'Present' : 'Missing'
            },
            session: req.session
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

        if (!apiKey) {
            return res.json({
                success: false,
                message: 'API Key është e zbrazët'
            });
        }

        // Kontrollo nëse API Key është valid (fillon me sk-proj)
        if (!apiKey.startsWith('sk-proj') && !apiKey.startsWith('sk-')) {
            return res.json({
                success: false,
                message: 'API Key nuk duket të jetë valid. Duhet të fillojë me "sk-proj" ose "sk-"'
            });
        }

        const encryptedKey = encryption.encrypt(apiKey);
        
        await User.update({
            openaiApiKey: encryptedKey,
            isOpenaiActive: true
        }, { where: { id: userId } });

        console.log('✅ OpenAI Key saved for user:', userId);

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

        await User.update({
            openaiApiKey: null,
            isOpenaiActive: false
        }, { where: { id: userId } });

        res.json({
            success: true,
            message: 'OpenAI API Key u fshi me sukses!'
        });

    } catch (error) {
        console.error('❌ Delete key error:', error);
        res.json({
            success: false,
            message: 'Gabim në fshirjen e API Key'
        });
    }
});

module.exports = router;
