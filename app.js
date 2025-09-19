// Në krye të app.js
require('dotenv').config();

// Pastaj përdor process.env.ENCRYPTION_KEY në vend të vlerës së hardcoduar
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');


// Importo rutat
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/users');
const apiRoutes = require('./routes/api');
const geminiRoutes = require('./routes/gemini');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Servo skedarët statikë nga dosja 'public'

// Përdor rutat
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/api-keys', apiRoutes);
app.use('/api/gemini', geminiRoutes);

// Ruta default për faqen kryesore
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Nis serverin
app.listen(PORT, () => {
    console.log(`Serveri është duke u drejtuar në portin ${PORT}`);
});

// ==================== FUND I APP.JS ====================

// Testo enkriptimin pasi serveri të jetë startuar
const encryption = require('./utils/encryption');

// Prit 2 sekonda pasi serveri të jetë startuar
setTimeout(() => {
    console.log('🛡️ Testi i enkriptimit AES-256-CBC:');
    const testResult = encryption.testEncryption();
    
    if (!testResult) {
        console.error('❌ RREZIK SIGURIE: Enkriptimi nuk funksionon si duhet!');
        // Mos e mbyll serverin, por vetëm paralajmëro
    }
}, 2000);

// Nëse ke module.exports në fund, vendose para asaj
// module.exports = app; (nëse e ke)

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveri online në portin ${PORT}`);
});