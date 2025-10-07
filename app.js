require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

// Importo rutat
const authRoutes = require('./routes/auth');
const authEnhanced = require('./routes/auth-enhanced');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/users');
const emailVerification = require('./routes/email-verification');
const apiRoutes = require('./routes/api');
const geminiRoutes = require('./routes/gemini');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ 1. CORS CONFIGURATION - FIXED!
app.use(cors({
    origin: 'https://chatai-alba-gr9dw.ondigitalocean.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// ✅ 2. COOKIE PARSER - DUHET TË JETË PARA BODY PARSER
app.use(cookieParser());

// ✅ 3. BODY PARSER ME LIMIT TË SHTUAR (10mb)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ✅ 4. STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

// ✅ 5. ROUTES - TË GJITHA PAS CORS DHE COOKIE PARSER
app.use('/api/auth', authRoutes);
app.use('/api/auth', authEnhanced);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/email', emailVerification);
app.use('/api/api-keys', apiRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/admin', adminRoutes);
// ✅ Shto këtë në seksionin e routes:
app.use('/api/gemini-simple', require('./routes/gemini-simple'));
// ✅ Rrugët e API Keys (për frontend-in e ri)
app.use('/api', require('./routes/api')); // ✅ Kjo ekziston
app.use('/api/api-keys', require('./routes/api')); // ✅ Shto edhe këtë për kompatibilitet

// ✅ 6. RUTA DEFAULT
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ 7. ERROR HANDLING MIDDLEWARE
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

// ✅ CORS CONFIGURATION - FIXED!
app.use(cors({
    origin: 'https://chatai-alba-gr9dw.ondigitalocean.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// ✅ 10. TESTO ENKRIPTIMIN
const encryption = require('./utils/encryption');
setTimeout(() => {
    console.log('🛡️ Testi i enkriptimit AES-256-CBC:');
    encryption.testEncryption();
}, 2000);
