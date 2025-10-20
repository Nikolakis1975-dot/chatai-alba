// ✅ MIDDLEWARE I THJESHTË PËR SESIONIN - PA CRYPTO
module.exports = (req, res, next) => {
    // ✅ VETËM PËR RUTAT E CHAT
    if (!req.path.startsWith('/api/chat')) {
        return next();
    }
    
    // ✅ MERRE COOKIES
    let userId = req.cookies?.chatUserId;
    let sessionId = req.cookies?.chatSessionId;
    
    // ✅ KRJO SESION TË RI NËSE NUK KA
    if (!userId) {
        userId = 'user-' + Date.now();
        sessionId = 'session-' + Date.now();
        
        // ✅ VENDOS COOKIES
        res.cookie('chatUserId', userId, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 365 * 24 * 60 * 60 * 1000 // 1 vit
        });
        
        res.cookie('chatSessionId', sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 365 * 24 * 60 * 60 * 1000 // 1 vit
        });
        
        console.log('🆕 SESION I RI:', userId);
    } else {
        console.log('🔁 SESION I VJETER:', userId);
    }
    
    // ✅ VENDOS NË REQUEST
    req.userId = userId;
    req.sessionId = sessionId;
    
    next();
};
