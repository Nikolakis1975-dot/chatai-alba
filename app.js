// ======================================================
// 🌟 ChatAI ALBA v4.0 — Context-Aware Voice Memory 
// ======================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// ======================================================
// 2️⃣ KONFIGURIME THEMELORE - SË PARMI!
// ======================================================

// ✅ CORS — KONFIGURIM PERFEKT PËR PRODUKSION
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://chatai-alba-gr9dw.ondigitalocean.app',
        'https://www.chatai-alba-gr9dw.ondigitalocean.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With']
}));

// ✅ COOKIE & BODY PARSERS - SË PARMI!
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ======================================================
// 🔒 MIDDLEWARE PËR SESSION PERSISTENCE
// ======================================================

const chatSessionMiddleware = require('./middleware/chatSession');
app.use(chatSessionMiddleware);

// ======================================================
// 3️⃣ IMPORT & REGJISTRO TË GJITHA RUTAT
// ======================================================

// 🟢 RUTAT E AUTHENTIKIMIT
app.use('/api/auth', require('./routes/auth'));
app.use('/api/auth', require('./routes/auth-enhanced'));

// 🟢 RUTAT E PËRDORUESVE & PROFILIT
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

// 🟢 RUTAT E CHAT (KRYESORE)
app.use('/api/chat', require('./routes/chat'));

// 🟢 RUTAT E VOICE
app.use('/api/voice', require('./routes/voice'));

// 🟢 RUTAT E CONTEXT
app.use('/api/context', require('./routes/context-routes'));

// ======================================================
// 4️⃣ STATIC FILES & DEFAULT ROUTE
// ======================================================

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ======================================================
// 5️⃣ ERROR HANDLERS
// ======================================================

app.use((err, req, res, next) => {
    console.error('❌ Gabim në server:', err);
    res.status(500).json({
        success: false,
        message: 'Gabim i brendshëm i serverit.'
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta nuk u gjet.'
    });
});

// ======================================================
// 🚀 START SERVER
// ======================================================

app.listen(PORT, '0.0.0.0', () => {
    console.log(`╔══════════════════════════════════════════════════╗`);
    console.log(`║                🚀 CHATAI ALBA v4.0              ║`);
    console.log(`║           Context-Aware Voice Memory            ║`);
    console.log(`╠══════════════════════════════════════════════════╣`);
    console.log(`║ 🌐 URL: http://localhost:${PORT}                 ║`);
    console.log(`║ 🔐 NODE_ENV: ${process.env.NODE_ENV}            ║`);
    console.log(`║ 🎤 Voice API: /api/voice/transcribe             ║`);
    console.log(`║ 🧠 Context API: /api/context/*                  ║`);
    console.log(`║ 💬 Chat API: /api/chat/message                  ║`);
    console.log(`║ 🔐 Auth API: /api/auth/*                        ║`);
    console.log(`╚══════════════════════════════════════════════════╝`);
});
