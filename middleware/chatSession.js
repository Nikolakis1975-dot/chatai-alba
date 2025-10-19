// ==== middleware/chatSession.js - VERSIONI I KORRIGJUAR PERFEKT =======
const chatSessionMiddleware = (req, res, next) => {
    // ✅ APLIKO VETËM PËR RUTAT E CHAT & CONTEXT
    if (!req.path.startsWith('/api/chat') && !req.path.startsWith('/api/context')) {
        return next();
    }
    
    console.log('🔍 ChatSession: Duke procesuar', req.method, req.path);
    console.log('🍪 Të gjitha cookies:', req.cookies);
    console.log('📨 Headers cookie:', req.headers.cookie);
    
    // ✅ KONTROLLO NËSE KA COOKIES EKZISTUESE TË VLEFSHME
    let sessionId = req.cookies?.chatSessionId;
    let userId = req.cookies?.chatUserId;
    
    console.log('🎯 Cookies specifike për chat:', { userId, sessionId });
    
    // ✅ VERIFIKO NËSE COOKIES JANË TË VLEFSHME
    const hasValidCookies = sessionId && userId;
    
    if (hasValidCookies) {
        console.log('✅ ChatSession: Duke përdorur cookies ekzistuese:', { userId, sessionId });
        req.userId = userId;
        req.sessionId = sessionId;
        console.log('🔧 ChatSession: Vendosur në req:', { userId: req.userId, sessionId: req.sessionId });
        return next();
    }
    
    // ✅ NËSE NUK KA COOKIES TË VLEFSHME, KRIJO TË REJA
    userId = 'user-' + Date.now();
    sessionId = 'session-' + Date.now();
    
    console.log('🆕 ChatSession: Duke krijuar session të re:', { userId, sessionId });
    
    // ✅ VENDOS COOKIE TË QËNDRUESHME
    const cookieOptions = {
        httpOnly: true,
        secure: false, // ✅ FALSE PËR LOCALHOST
        sameSite: 'lax',
        path: '/',
        maxAge: 365 * 24 * 60 * 60 * 1000 // 1 VIT
    };
    
    res.cookie('chatUserId', userId, cookieOptions);
    res.cookie('chatSessionId', sessionId, cookieOptions);
    
    // ✅ SHTO NË REQUEST - KJO ËSHTË SHUMË E RËNDËSISHME!
    req.userId = userId;
    req.sessionId = sessionId;
    
    console.log('🔒 ChatSession: New session created dhe vendosur në req:', { 
        userId: req.userId, 
        sessionId: req.sessionId 
    });
    
    next();
};

module.exports = chatSessionMiddleware;
