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
// 1️⃣ KONFIGURIME THEMELORE - SË PARMI!
// ======================================================

// ✅ CORS & COOKIE PARSER - PARA TË GJITHAVE!
app.use(cors({
    origin: ['http://localhost:3000', 'https://chatai-alba-gr9dw.ondigitalocean.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ======================================================
// 2️⃣ MIDDLEWARE PËR SESSION - PARA TË GJITHA RUTAVE!
// ======================================================

// ✅ CHAT SESSION MIDDLEWARE - KRITIKE!
const chatSessionMiddleware = require('./middleware/chatSession');
app.use(chatSessionMiddleware); // ✅ APLIKO PËR TË GJITHA REQUEST-ET

// ======================================================
// 3️⃣ RUTAT - PAS SESSION MIDDLEWARE
// ======================================================

// 🟢 RUTAT E CHAT
const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);

// 🧠 RUTAT E CONTEXT
const contextRoutes = require('./routes/context-routes');
app.use('/api/context', contextRoutes);

// 🎤 RUTA PËR VOICE
const voiceRoutes = require('./routes/voice');
app.use('/api/voice', voiceRoutes);

// ======================================================
// 4️⃣ RUTAT E TJERA
// ======================================================

const authRoutes = require('./routes/auth');
const authEnhanced = require('./routes/auth-enhanced');
const userRoutes = require('./routes/users');
const emailVerification = require('./routes/email-verification');
const apiRoutes = require('./routes/api');
const geminiRoutes = require('./routes/gemini');
const adminRoutes = require('./routes/admin');
const geminiSimpleRoutes = require('./routes/gemini-simple');

app.use('/api/auth', authRoutes);
app.use('/api/auth', authEnhanced);
app.use('/api/users', userRoutes);
app.use('/api/email', emailVerification);
app.use('/api/api-keys', apiRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/admin', adminRoutes);
app.use('/api/gemini-simple', geminiSimpleRoutes);

// ======================================================
// 5️⃣ STATIC FILES & DEFAULT ROUTE
// ======================================================

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ======================================================
// 6️⃣ ERROR HANDLERS
// ======================================================

app.use((err, req, res, next) => {
    console.error('❌ Gabim në server:', err);
    res.status(500).json({ success: false, message: 'Gabim i brendshëm i serverit.' });
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Ruta nuk u gjet.' });
});

// ======================================================
// 7️⃣ INITIALIZIME TË TJERA
// ======================================================

const encryption = require('./utils/encryption');
setTimeout(() => {
    console.log('🛡️ Testi i enkriptimit AES-256-CBC:');
    encryption.testEncryption();
}, 2000);

const AppBridge = require('./bridges/app-bridge');
AppBridge.initializeSafeBridge(app);

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
    console.log(`║ 🔒 Session Middleware: ACTIVE                   ║`);
    console.log(`╚══════════════════════════════════════════════════╝`);
});
