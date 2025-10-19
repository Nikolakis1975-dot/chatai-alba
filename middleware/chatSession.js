const crypto = require('crypto');

// ✅ KONFIGURIM I FORTUAR I SESIONIT
const sessionConfig = {
    cookieOptions: {
        httpOnly: true,
        secure: true, // GJITHMONË TRUE PËR PRODUKSION
        sameSite: 'none', // GJITHMONË NONE PËR PRODUKSION
        path: '/',
        maxAge: 365 * 24 * 60 * 60 * 1000 // 1 VIT
    }
};

// ✅ MIDDLEWARE PËR MENAXHIMIN E SESIONIT
function chatSessionMiddleware(req, res, next) {
    try {
        // ✅ MERRE COOKIES NGA REQUEST
        const cookies = parseCookies(req.headers.cookie);
        
        let userId = cookies.chatUserId;
        let sessionId = cookies.chatSessionId;

        console.log('🍪 COOKIES TË PRANUARA:', { userId, sessionId });

        // ✅ KRJO SESION TË RI NËSE NUK KA
        if (!userId || userId === 'undefined' || userId === 'null') {
            userId = 'user-' + Date.now() + '-' + crypto.randomBytes(4).toString('hex');
            sessionId = 'session-' + Date.now();
            
            console.log('🆕 SESION I RI I KRIJUAR:', { userId, sessionId });

            // ✅ VENDOS COOKIES TË REJA ME KONFIGURIM TË FORTUAR
            res.cookie('chatUserId', userId, sessionConfig.cookieOptions);
            res.cookie('chatSessionId', sessionId, sessionConfig.cookieOptions);
            
            console.log('✅ COOKIES TË REJA U VENDOSËN');
        } else {
            console.log('🔁 SESION I VJETER I RIKTHYER:', { userId, sessionId });
        }

        // ✅ VENDOS NË REQUEST PËR PËRDORIM
        req.userId = userId;
        req.sessionId = sessionId;

        console.log('🎯 SESIONI I PERDORUAR:', { userId: req.userId, sessionId: req.sessionId });

        next();
    } catch (error) {
        console.error('❌ GABIM NË SESION MIDDLEWARE:', error);
        
        // ✅ FALLBACK NË RAST GABIMI
        req.userId = 'user-' + Date.now();
        req.sessionId = 'session-' + Date.now();
        next();
    }
}

// ✅ FUNKSION PËR PARSAKTIMIN E COOKIES
function parseCookies(cookieHeader) {
    const cookies = {};
    if (cookieHeader) {
        cookieHeader.split(';').forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            if (name && value) {
                cookies[name] = decodeURIComponent(value);
            }
        });
    }
    return cookies;
}

module.exports = chatSessionMiddleware;
