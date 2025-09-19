require('dotenv').config();
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

// Middleware ME LIMIT TË SHTUAR
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Përdor rutat
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/api-keys', apiRoutes);
app.use('/api/gemini', geminiRoutes);

// Ruta default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Nis serverin
app.listen(PORT, () => {
    console.log(`Serveri është duke u drejtuar në portin ${PORT}`);
});

// Testo enkriptimin
const encryption = require('./utils/encryption');
setTimeout(() => {
    console.log('🛡️ Testi i enkriptimit AES-256-CBC:');
    encryption.testEncryption();
}, 2000);
