// ======================================================
// 🌟 ChatAI ALBA v3.0 — Server kryesor
// ======================================================

// 1️⃣ Konfigurime fillestare
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// ======================================================
// 2️⃣ Konfigurime të përgjithshme
// ======================================================

// ✅ CORS — lejon komunikimin midis domain-eve
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://chatai-alba-gr9dw.ondigitalocean.app',
        'https://deklarata-rrufetesla.netlify.app' // ✅ SHTESË E RE: Lejon Deklaratën
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// ✅ COOKIE & BODY parsers
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ======================================================
// 3️⃣ Importo & Regjistro rutat
// ======================================================

// 🟢 Ruta për voice — DUHET të vijë PAS konfigurimit të parserëve
const voiceRoutes = require('./routes/voice');
app.use('/api/voice', voiceRoutes);

// Rutat ekzistuese
const authRoutes = require('./routes/auth');
const authEnhanced = require('./routes/auth-enhanced');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/users');
const emailVerification = require('./routes/email-verification');
const apiRoutes = require('./routes/api');
const geminiRoutes = require('./routes/gemini');
const adminRoutes = require('./routes/admin');
const geminiSimpleRoutes = require('./routes/gemini-simple');

// ======================================================
// 🆕 SHTESË E RE: RRUFE-TESLA 10.5 INTEGRIMI
// ======================================================

// 🌌 Ruta të reja për Ndërgjegjen Kolektive
const consciousnessRoutes = require('./routes/rrufe/consciousness-routes'); // ✅ SHTESË E RE
app.use('/api/consciousness', consciousnessRoutes); // ✅ SHTESË E RE

// ======================================================
// 4️⃣ Regjistro të gjitha rutat (vazhdim)
// ======================================================

// Regjistro të gjitha rutat
app.use('/api/auth', authRoutes);
app.use('/api/auth', authEnhanced);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/email', emailVerification);
app.use('/api/api-keys', apiRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/admin', adminRoutes);
app.use('/api/gemini-simple', geminiSimpleRoutes);

// ======================================================
// 5️⃣ Static files (Frontend)
app.use(express.static(path.join(__dirname, 'public')));

// ======================================================
// 6️⃣ Default route — për SPA frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ======================================================
// 7️⃣ Error & 404 Handlers
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
// 8️⃣ Test enkriptimi
const encryption = require('./utils/encryption');
setTimeout(() => {
    console.log('🛡️ Testi i enkriptimit AES-256-CBC:');
    encryption.testEncryption();
}, 2000);

// ======================================================
// 9️⃣ Ura (Bridge System)
const AppBridge = require('./bridges/app-bridge');
AppBridge.initializeSafeBridge(app);

// ======================================================
// 🔟 Start server - ME MESAZH TË RI
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveri është duke u drejtuar në portin ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`🔐 NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`🎤 Voice Routes u regjistruan: /api/voice/transcribe`);
    console.log(`🌌 RRUFE-TESLA 10.5 Routes u regjistruan: /api/consciousness`); // ✅ SHTESË E RE
});
