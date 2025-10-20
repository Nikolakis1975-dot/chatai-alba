// ✅ MIDDLEWARE I THJESHTË PËR SESIONIN
module.exports = (req, res, next) => {
    // ✅ VETËM PËR RUTAT QË KANË NEVOJË PËR SESION
    if (!req.path.startsWith('/api/chat') && 
        !req.path.startsWith('/api/voice') && 
        !req.path.includes('/upload') &&
        !req.path.startsWith('/api/context')) {
        return next();
    }
    
    // ✅ MERRE COOKIES EKZISTUESE
    let userId = req.cookies?.chatUserId;
    let sessionId = req.cookies?.chatSessionId;
    
    // ✅ KRJO SESION TË RI NËSE NUK KA
    if (!userId) {
        userId = 'user-' + Date.now();
        sessionId = 'session-' + Date.now();
        
        // ✅ VENDOS COOKIES TË REJA
        res.cookie('chatUserId', userId, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 ditë
        });
        
        res.cookie('chatSessionId', sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 ditë
        });
    }
    
    // ✅ VENDOS NË REQUEST
    req.userId = userId;
    req.sessionId = sessionId;
    
    next();
};
