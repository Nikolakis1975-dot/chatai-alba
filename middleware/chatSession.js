const crypto = require('crypto');

// ✅ KONFIGURIM I FORTUAR PËR PRODUKSION
const sessionConfig = {
    cookieOptions: {
        httpOnly: true,
        secure: true, // TRUE për HTTPS
        sameSite: 'none', // DOMOSDOSHMË për cross-site
        path: '/',
        maxAge: 365 * 24 * 60 * 60 * 1000 // 1 VIT
    }
};

// ✅ MIDDLEWARE I RIPARUAR PËR SESIONIN
function chatSessionMiddleware(req, res, next) {
    try {
        // ✅ MERRE COOKIES PA LOGIME TË MËDHA
        const cookies = parseCookies(req.headers.cookie);
        
        let userId = cookies.chatUserId;
        let sessionId = cookies.chatSessionId;

        // ✅ KRJO SESION TË RI VETËM NËSE NUK EKZISTON
        if (!userId || !sessionId) {
            userId = 'user-' + Date.now();
            sessionId = 'session-' + Date.now();
            
            // ✅ VENDOS COOKIES TË REJA ME KONFIGURIM TË FORTUAR
            res.cookie('chatUserId', userId, sessionConfig.cookieOptions);
            res.cookie('chatSessionId', sessionId, sessionConfig.cookieOptions);
            
            console.log('🆕 SESION I RI:', userId);
        } else {
            console.log('🔁 SESION I VJETER:', userId);
        }

        // ✅ VENDOS NË REQUEST
        req.userId = userId;
        req.sessionId = sessionId;

        next();
    } catch (error) {
        console.error('❌ GABIM SESIONI:', error);
        // ✅ FALLBACK I SIGURT
        req.userId = 'user-' + Date.now();
        req.sessionId = 'session-' + Date.now();
        next();
    }
}

// ✅ FUNKSION I THJESHTË PËR COOKIES
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
