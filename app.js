// ======================================================
// 🌟 ChatAI ALBA - PËRDORIM SKEDARËT EKZISTUES
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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ======================================================
// ✅ SESION MIDDLEWARE (NGARKO NGA SKEDARI)
// ======================================================

const chatSessionMiddleware = require('./middleware/chatSession');
app.use(chatSessionMiddleware);

// ======================================================
// ✅ RUTAT EKZISTUESE - PA NDRYSHIME!
// ======================================================

// 🟢 RUTAT E AUTH (EKZISTUESE)
app.use('/api/auth', require('./routes/auth'));

// 🟢 RUTAT E USERS (EKZISTUESE - ME RIPARIME TË VOGLA)
app.use('/api/users', require('./routes/users'));

// 🟢 RUTAT E CHAT (EKZISTUESE)  
app.use('/api/chat', require('./routes/chat'));

// 🟢 RUTAT E GEMINI (EKZISTUESE)
app.use('/api/gemini', require('./routes/gemini'));

// ======================================================
// ✅ STATIC FILES
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
    console.log(`✅ Përdorim skedarët ekzistues`);
    console.log(`📸 Users API: /api/users/profile-picture`);
});
