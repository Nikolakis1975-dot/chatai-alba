// ======================================================
// 🌟 ChatAI ALBA - VERSION I THJESHTË & STABIL
// ======================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// ======================================================
// ✅ KONFIGURIME BAZË - PA LOGIME TË MËDHA
// ======================================================

// CORS i thjeshtë
app.use(cors({
    origin: true, // Lejo të gjitha origin (më e thjeshtë)
    credentials: true
}));

// Parser bazë
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================================================
// ✅ SESION MIDDLEWARE - I THJESHTË & EFIKAS
// ======================================================

app.use((req, res, next) => {
    // ✅ VETËM PËR RUTAT E CHAT & CONTEXT
    if (!req.path.startsWith('/api/chat') && !req.path.startsWith('/api/context')) {
        return next();
    }
    
    // ✅ MERRE COOKIES EKZISTUESE
    let userId = req.cookies?.chatUserId;
    let sessionId = req.cookies?.chatSessionId;
    
    // ✅ KRJO SESION TË RI NËSE NUK KA
    if (!userId || !sessionId) {
        userId = 'user-' + Date.now();
        sessionId = 'session-' + Date.now();
        
        // ✅ VENDOS COOKIES TË REJA
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: 365 * 24 * 60 * 60 * 1000 // 1 vit
        };
        
        res.cookie('chatUserId', userId, cookieOptions);
        res.cookie('chatSessionId', sessionId, cookieOptions);
    }
    
    // ✅ VENDOS NË REQUEST
    req.userId = userId;
    req.sessionId = sessionId;
    
    next();
});

// ======================================================
// ✅ RUTAT BAZË - PA ERROR HANDLING TË MËDHA
// ======================================================

// 🟢 RUTAT E CHAT (KRYESORE)
const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);

// 🟢 RUTAT E TJERA THEMELORE
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/gemini', require('./routes/gemini'));

// 🟢 RUTAT OPTIONAL (ME TRY-CATCH)
try {
    app.use('/api/context', require('./routes/context-routes'));
} catch (error) {
    console.log('⚠️  Context routes nuk u ngarkuan');
}

try {
    app.use('/api/voice', require('./routes/voice'));
} catch (error) {
    console.log('⚠️  Voice routes nuk u ngarkuan');
}

// ======================================================
// ✅ STATIC FILES & DEFAULT ROUTE
// ======================================================

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ======================================================
// ✅ ERROR HANDLERS
// ======================================================

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Ruta nuk u gjet' });
});

app.use((err, req, res, next) => {
    console.error('❌ Gabim serveri:', err);
    res.status(500).json({ success: false, message: 'Gabim serveri' });
});

// ======================================================
// 🚀 START SERVER
// ======================================================

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CHATAI ALBA - PORT: ${PORT}`);
    console.log(`✅ Sistemi i thjeshtë u ngarkua`);
});
