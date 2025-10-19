// middleware/chatSession.js - VERSIONI PERFEKT PËR PRODUKSION
const chatSessionMiddleware = (req, res, next) => {
    // ✅ APLIKO VETËM PËR RUTAT E CHAT & CONTEXT
    if (!req.path.startsWith('/api/chat') && !req.path.startsWith('/api/context')) {
        return next();
    }
    
    console.log('🔍 PRODUCTION ChatSession: Duke procesuar', req.method, req.path);
    console.log('🍪 PRODUCTION Cookies:', req.cookies);
    console.log('📨 PRODUCTION Headers cookie:', req.headers.cookie);
    
    // ✅ KONTROLLO NËSE KA COOKIES EKZISTUESE TË VLEFSHME
    let sessionId = req.cookies?.chatSessionId;
    let userId = req.cookies?.chatUserId;
    
    console.log('🎯 PRODUCTION Cookies specifike:', { userId, sessionId });
    
    // ✅ VERIFIKO NËSE COOKIES JANË TË VLEFSHME
    const hasValidCookies = sessionId && userId;
    
    if (hasValidCookies) {
        console.log('✅ PRODUCTION: Duke përdorur cookies ekzistuese:', { userId, sessionId });
        req.userId = userId;
        req.sessionId = sessionId;
        console.log('🔧 PRODUCTION: Vendosur në req:', { userId: req.userId, sessionId: req.sessionId });
        return next();
    }
    
    // ✅ NËSE NUK KA COOKIES TË VLEFSHME, KRIJO TË REJA
    userId = 'user-' + Date.now();
    sessionId = 'session-' + Date.now();
    
    console.log('🆕 PRODUCTION: Duke krijuar session të re:', { userId, sessionId });
    
    // ✅ VENDOS COOKIE TË QËNDRUESHME PËR PRODUKSION
    const cookieOptions = {
        httpOnly: true,
        secure: true, // ✅ TRUE PËR HTTPS NË PRODUKSION
        sameSite: 'none', // ✅ 'none' PËR CROSS-SITE NË PRODUKSION
        path: '/',
        maxAge: 365 * 24 * 60 * 60 * 1000 // 1 VIT
    };
    
    res.cookie('chatUserId', userId, cookieOptions);
    res.cookie('chatSessionId', sessionId, cookieOptions);
    
    // ✅ SHTO NË REQUEST - KJO ËSHTË SHUMË E RËNDËSISHME!
    req.userId = userId;
    req.sessionId = sessionId;
    
    console.log('🔒 PRODUCTION: New session created:', { 
        userId: req.userId, 
        sessionId: req.sessionId 
    });
    
    next();
};

module.exports = chatSessionMiddleware;
