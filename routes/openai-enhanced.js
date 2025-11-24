// ========================================================
// Openai RRUFE TESLA 10.5
// ========================================================
const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const encryption = require('../utils/encryption');

// ✅ MIDDLEWARE I PËRMIRËSUAR - PROVO TË GJITHA MËNYRAT
const authenticateUser = async (req, res, next) => {
    try {
        console.log('🔐 OpenAI Auth Check:');
        console.log('   - Session ID:', req.sessionID);
        console.log('   - Session:', req.session);
        console.log('   - Cookies:', req.cookies);
        console.log('   - Headers:', req.headers);
        
        // MËNYRA 1: Session-based auth
        if (req.session && req.session.userId) {
            req.user = { id: req.session.userId };
            console.log('✅ Auth SUCCESS nga session - User ID:', req.session.userId);
            return next();
        }
        
        // MËNYRA 2: Kontrollo nëse ka session të ruajtur në database
        if (req.sessionID) {
            try {
                const sessionStore = req.sessionStore;
                sessionStore.get(req.sessionID, (err, sessionData) => {
                    if (!err && sessionData && sessionData.userId) {
                        req.user = { id: sessionData.userId };
                        console.log('✅ Auth SUCCESS nga session store - User ID:', sessionData.userId);
                        return next();
                    } else {
                        checkCookies();
                    }
                });
            } catch (e) {
                checkCookies();
            }
        } else {
            checkCookies();
        }
        
        function checkCookies() {
            // MËNYRA 3: Cookie-based auth
            if (req.cookies && req.cookies.userId) {
                req.user = { id: req.cookies.userId };
                console.log('✅ Auth SUCCESS nga cookie - User ID:', req.cookies.userId);
                return next();
            }
            
            // MËNYRA 4: Token nga cookie
            if (req.cookies && req.cookies.token) {
                try {
                    const jwt = require('jsonwebtoken');
                    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET || 'fallback-secret');
                    req.user = { id: decoded.userId || decoded.id };
                    console.log('✅ Auth SUCCESS nga token - User ID:', req.user.id);
                    return next();
                } catch (tokenError) {
                    console.log('❌ Token i pavlefshëm:', tokenError.message);
                }
            }
            
            // MËNYRA 5: Kontrollo nëse ka user të loguar në database për këtë session
            checkDatabaseAuth();
        }
        
        async function checkDatabaseAuth() {
            try {
                // Merr IP-në e klientit
                const clientIp = req.ip || req.connection.remoteAddress;
                console.log('🔍 Duke kontrolluar auth në database për IP:', clientIp);
                
                // Kjo është fallback - në realitet duhet të kesh një mënyrë për të lidhur session me user
                // Për momentin, le të kthejmë një error të qartë
                console.log('❌ Auth FAILED - Asnjë metodë nuk funksionoi');
                return res.json({
                    success: false,
                    message: 'Session ka skaduar. Ju lutem rifreskoni faqen dhe logoheni përsëri.',
                    debug: {
                        sessionId: req.sessionID,
                        hasSession: !!req.session,
                        hasCookies: !!req.cookies,
                        cookies: req.cookies
                    }
                });
                
            } catch (dbError) {
                console.error('❌ Gabim në database auth:', dbError);
                return res.json({
                    success: false,
                    message: 'Gabim në server. Ju lutem provoni përsëri.'
                });
            }
        }
        
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

// ✅ RUTA DEBUG - TREGO TË GJITHA TË DHËNAT
router.get('/debug-auth', async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Debug auth information',
            session: {
                id: req.sessionID,
                data: req.session
            },
            cookies: req.cookies,
            headers: req.headers,
            user: req.user,
            ip: req.ip
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Debug FAILED: ' + error.message
        });
    }
});

// ✅ RUTA TESTUESE - THJESHTË
router.get('/simple-test', async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'OpenAI route works!',
            user: req.user,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Test FAILED: ' + error.message
        });
    }
});

// ... (Ruajtja e API Key mbetet e njëjtë)
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

module.exports = router;
