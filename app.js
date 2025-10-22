// ======================================================
// 🌟 ChatAI ALBA v3.0 — Server kryesor
// ======================================================

// 1️⃣ Konfigurime fillestare
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const database = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// ======================================================
// 2️⃣ Konfigurime të përgjithshme
// ======================================================

// ✅ CORS — lejon komunikimin midis domain-eve
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://chatai-alba-gr9dw.ondigitalocean.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// ✅ MIDDLEWARE për database access në të gjitha routes
app.use((req, res, next) => {
    req.db = database.getDb();
    next();
});

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

// ✅ RRUFE ROUTES - SHTESË E RE
const contextRoutes = require('./routes/context-routes');
const sessionRoutes = require('./routes/session-routes');
const apiRrufeRoutes = require('./routes/rrufe/api-rrufe');
const analyticsRrufeRoutes = require('./routes/rrufe/analytics-rrufe');

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

// ✅ RRUFE ROUTES - SHTESË E RE
app.use('/api/context', contextRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/rrufe', apiRrufeRoutes);
app.use('/api/rrufe', analyticsRrufeRoutes);

// ======================================================
// 4️⃣ Ruta për frontend dhe skedarë statikë
// ======================================================

// ✅ Ruta për skedarët statikë (CSS, JS, imazhe)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Ruta për frontend (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ======================================================
// 5️⃣ Nisja e serverit
// ======================================================

app.listen(PORT, () => {
    console.log(`🚀 Serveri është duke u drejtuar në portin ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`🔐 NODE_ENV: ${process.env.NODE_ENV}`);
});

// ======================================================
// 6️⃣ Ruta testuese për shëndetin e serverit
// ======================================================

app.get('/api/health', (req, res) => {
    res.json({ 
        status: '✅ Serveri është aktiv', 
        timestamp: new Date().toISOString(),
        version: '3.0'
    });
});

// ✅ RRUFE HEALTH CHECK - SHTESË E RE
app.get('/api/rrufe/health', (req, res) => {
    res.json({ 
        status: '✅ RRUFE API është aktiv', 
        timestamp: new Date().toISOString(),
        features: ['messages/history', 'analytics/overview', 'messages/user/:id']
    });
});
