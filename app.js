require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

// ✅ IMPORTO APP BRIDGE SË PARI
const AppBridge = require('./bridges/app-bridge');

// Importo rutat
const authRoutes = require('./routes/auth');
const authEnhanced = require('./routes/auth-enhanced');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/users');
const emailVerification = require('./routes/email-verification');
const apiRoutes = require('./routes/api');
const geminiRoutes = require('./routes/gemini');
const adminRoutes = require('./routes/admin');
const geminiSimpleRoutes = require('./routes/gemini-simple');

// ✅ IMPORTO MIDDLEWARE TË RINJ
const { authenticateToken } = require('./middleware/auth');
const constants = require('./config/constants');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ INICIALIZO APP BRIDGE SË PARI - PARA TË GJITHA RUTAVE
AppBridge.initializeSafeBridge(app);

// ✅ 1. CORS CONFIGURATION - VETËM NJË HERË
app.use(cors({
    origin: 'https://chatai-alba-gr9dw.ondigitalocean.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// ✅ 2. COOKIE PARSER
app.use(cookieParser());

// ✅ 3. BODY PARSER
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ✅ 4. STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

// ✅ 5. ROUTES (TANI APP BRIDGE ËSHTË SË PARI)
app.use('/api/auth', authRoutes);
app.use('/api/auth', authEnhanced);
app.use('/api/chat', chatRoutes); // ✅ TANI KJO DO TË JETË PAS APP BRIDGE
app.use('/api/users', userRoutes);
app.use('/api/email', emailVerification);
app.use('/api/api-keys', apiRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/admin', adminRoutes);
app.use('/api/gemini-simple', geminiSimpleRoutes);

// ✅ 6. RUTA DEFAULT
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ 7. ERROR HANDLING
app.use((err, req, res, next) => {
    console.error('❌ Gabim në server:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Gabim i brendshëm i serverit' 
    });
});

// ✅ 8. 404 HANDLER
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Ruta nuk u gjet' 
    });
});

// ✅ 9. TESTO ENKRIPTIMIN
const encryption = require('./utils/encryption');
setTimeout(() => {
    console.log('🛡️ Testi i enkriptimit AES-256-CBC:');
    encryption.testEncryption();
}, 2000);

// ============================📄 app.js - Shto në FUND, para app.listen() =============================
 const AppBridge = require('./bridges/app-bridge');

// ================== ✅ INICIALIZO URËN E SIGURT (NUK NDRYSHON FUNKSIONIMIN EKZISTUES) ===================
 AppBridge.initializeSafeBridge(app);

// ✅ 10. START SERVER
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveri është duke u drejtuar në portin ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`🔐 NODE_ENV: ${process.env.NODE_ENV}`);
});
