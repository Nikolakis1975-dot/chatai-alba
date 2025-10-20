// ======================================================
// 🌟 ChatAI ALBA - VERSION I PLOTË ME TË GJITHA RUTAT
// ======================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// ======================================================
// ✅ KONFIGURIME BAZË
// ======================================================

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================================================
// ✅ SESION MIDDLEWARE
// ======================================================

const chatSessionMiddleware = require('./middleware/chatSession');
app.use(chatSessionMiddleware);

// ======================================================
// ✅ RUTAT E AUTH (LOGIN/REGJISTRIM) - KRYESORE!
// ======================================================

// 🟢 RUTAT E AUTHENTIKIMIT
app.use('/api/auth', require('./routes/auth'));
app.use('/api/auth', require('./routes/auth-enhanced'));

// 🟢 RUTAT E PËRDORUESVE
app.use('/api/users', require('./routes/users'));

// 🟢 RUTAT E EMAIL VERIFICATION
app.use('/api/email', require('./routes/email-verification'));

// 🟢 RUTAT E API KEYS
app.use('/api/api-keys', require('./routes/api'));

// 🟢 RUTAT E GEMINI
app.use('/api/gemini', require('./routes/gemini'));
app.use('/api/gemini-simple', require('./routes/gemini-simple'));

// 🟢 RUTAT E ADMIN
app.use('/admin', require('./routes/admin'));

// ======================================================
// ✅ RUTAT E CHAT (KRYESORE)
// ======================================================

const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);

// ======================================================
// ✅ RUTAT OPTIONAL (ME TRY-CATCH)
// ======================================================

try {
    app.use('/api/context', require('./routes/context-routes'));
    console.log('✅ Context routes u ngarkuan');
} catch (error) {
    console.log('⚠️  Context routes nuk u ngarkuan');
}

try {
    app.use('/api/voice', require('./routes/voice'));
    console.log('✅ Voice routes u ngarkuan');
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
// ✅ RUTA TESTUESE PËR AUTH
// ======================================================

app.get('/api/auth/test', (req, res) => {
    res.json({ 
        success: true, 
        message: '✅ Auth API po funksionon!',
        endpoints: [
            'POST /api/auth/register',
            'POST /api/auth/login', 
            'POST /api/auth/verify',
            'GET /api/auth/me'
        ]
    });
});

// ======================================================
// ✅ ERROR HANDLERS
// ======================================================

app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: `Ruta nuk u gjet: ${req.method} ${req.path}`,
        availableRoutes: [
            '/api/auth/register',
            '/api/auth/login',
            '/api/chat/message',
            '/api/users'
        ]
    });
});

app.use((err, req, res, next) => {
    console.error('❌ Gabim serveri:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Gabim i brendshëm i serverit'
    });
});

// ======================================================
// 🚀 START SERVER
// ======================================================

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CHATAI ALBA - PORT: ${PORT}`);
    console.log(`✅ Të gjitha rutat u ngarkuan`);
    console.log(`🔐 Auth API: /api/auth/register, /api/auth/login`);
    console.log(`💬 Chat API: /api/chat/message`);
});
