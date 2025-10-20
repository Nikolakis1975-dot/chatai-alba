// ✅ MIDDLEWARE I RIPARUAR PËR SESIONIN - VERSION FINAL
module.exports = (req, res, next) => {
    // ✅ APLIKO PËR TË GJITHA RUTAT E API
    if (!req.path.startsWith('/api/')) {
        return next();
    }
    
    // ✅ MERRE COOKIES ME KONTROLL TË FORTUAR
    const cookies = req.cookies || {};
    let userId = cookies.chatUserId;
    let sessionId = cookies.chatSessionId;

    // ✅ VERIFIKO NËSE COOKIES JANË TË VLEFSHME
    const hasValidCookies = userId && sessionId && 
                           userId !== 'undefined' && 
                           sessionId !== 'undefined' &&
                           userId !== 'null' && 
                           sessionId !== 'null';

    // ✅ KRJO SESION TË RI NËSE NUK KA COOKIES TË VLEFSHME
    if (!hasValidCookies) {
        userId = 'user-' + Date.now();
        sessionId = 'session-' + Date.now();
        
        console.log('🆕 SESION I RI I KRIJUAR:', { userId, sessionId });

        // ✅ VENDOS COOKIES TË REJA ME KONFIGURIM TË FORTUAR
        const cookieOptions = {
            httpOnly: true,
            secure: true, // TRUE për HTTPS
            sameSite: 'none', // DOMOSDOSHMË për cross-site
            path: '/',
            maxAge: 365 * 24 * 60 * 60 * 1000 // 1 VIT
        };
        
        res.cookie('chatUserId', userId, cookieOptions);
        res.cookie('chatSessionId', sessionId, cookieOptions);
        
    } else {
        console.log('🔁 SESION I VJETER I RIKTHYER:', { userId, sessionId });
    }

    // ✅ VENDOS NË REQUEST PËR TË GJITHA RUTAT
    req.userId = userId;
    req.sessionId = sessionId;

    // ✅ LOG PËR DEBUG (VETËM PËR RUTAT E RËNDËSISHME)
    if (req.path.includes('/chat/') || req.path.includes('/users/')) {
        console.log('🎯 SESIONI I PËRDORUR:', { 
            path: req.path, 
            userId: req.userId, 
            sessionId: req.sessionId 
        });
    }

    next();
};
