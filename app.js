// ======================================================
// 🌟 ChatAI ALBA v3.0 — Server kryesor ME MEMORY OPTIMIZATION
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
// 🆕 MEMORY MONITORING SYSTEM - RRUFE-TESLA 10.5 OPTIMIZED
// ======================================================

class MemoryMonitor {
    static startMonitoring() {
        // Monitoro memorie çdo 30 sekonda
        setInterval(() => {
            const used = process.memoryUsage();
            const memoryMB = Math.round(used.heapUsed / 1024 / 1024);
            const memoryPercentage = Math.round((memoryMB / 512) * 100);
            
            const status = memoryMB > 450 ? '🚨 CRITICAL' : 
                          memoryMB > 400 ? '⚠️ WARNING' : '✅ HEALTHY';
            
            console.log(`🧠 MEMORY MONITOR: ${memoryMB}MB / 512MB (${memoryPercentage}%) - ${status}`);
            
            // Aktivizo garbage collection nëse është kritike
            if (memoryMB > 450 && global.gc) {
                console.log('🔄 Duke aktivizuar Garbage Collection...');
                global.gc();
                
                // Kontrollo përsëri pas GC
                const afterGC = process.memoryUsage();
                const afterMB = Math.round(afterGC.heapUsed / 1024 / 1024);
                console.log(`🔄 Pas GC: ${afterMB}MB / 512MB`);
            }
        }, 30000); // Çdo 30 sekonda
        
        console.log('✅ MEMORY MONITORING SYSTEM U AKTIVIZUA');
    }
}

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
app.use(express.json({ limit: '5mb' })); // ✅ ULVUAR NGA 10mb NË 5mb
app.use(express.urlencoded({ limit: '5mb', extended: true })); // ✅ ULVUAR

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
const rrufeRoutes = require('./routes/rrufe/api-rrufe');
// ❌ KËTO NUK JANË TË IMPORTUARA:
const EmotionalContextEngine = require('./public/js/modules/emotionalContextEngine');
const QuantumMemory = require('./public/js/modules/quantumMemory');
const BioNeuralNetwork = require('./public/js/modules/bioNeuralNetwork');

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
app.use('/api/rrufe', rrufeRoutes);
// ❌ NUK KA ROUTES SPECIFIKE:
app.use('/api/emotional', emotionalRoutes);
app.use('/api/quantum', quantumRoutes);
app.use('/api/bioneural', bioNeuralRoutes);

// ======================================================
// 5️⃣ Static files (Frontend)
app.use(express.static(path.join(__dirname, 'public')));

// ======================================================
// 6️⃣ Default route — për SPA frontend
app.get('/', (req, res) => {
    // ✅ SHTESË E RE: Memory check për çdo request
    const used = process.memoryUsage();
    const memoryMB = Math.round(used.heapUsed / 1024 / 1024);
    
    if (memoryMB > 480) {
        console.log(`🚨 MEMORY CRITICAL ON ROOT: ${memoryMB}MB`);
        return res.status(503).json({
            success: false,
            message: "Serveri është duke u ringarkuar. Ju lutem provoni përsëri.",
            memory_usage: memoryMB + "MB"
        });
    }
    
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ======================================================
// 7️⃣ Error & 404 Handlers ME MEMORY MONITORING
// ======================================================

app.use((err, req, res, next) => {
    const used = process.memoryUsage();
    const memoryMB = Math.round(used.heapUsed / 1024 / 1024);
    
    console.error('❌ Gabim në server:', err.message);
    console.error(`🧠 Memory during error: ${memoryMB}MB`);
    
    res.status(500).json({
        success: false,
        message: 'Gabim i brendshëm i serverit.',
        memory_usage: memoryMB + "MB",
        system: "RRUFE_TESLA_10.5_OPTIMIZED"
    });
});

app.use((req, res) => {
    const used = process.memoryUsage();
    const memoryMB = Math.round(used.heapUsed / 1024 / 1024);
    
    res.status(404).json({
        success: false,
        message: 'Ruta nuk u gjet.',
        memory_usage: memoryMB + "MB",
        system: "RRUFE_TESLA_10.5_OPTIMIZED"
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
// 🔟 Start server - ME MEMORY MONITORING
// ======================================================

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveri është duke u drejtuar në portin ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`🔐 NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`🎤 Voice Routes u regjistruan: /api/voice/transcribe`);
    console.log(`🌌 RRUFE-TESLA 10.5 Routes u regjistruan: /api/consciousness`);
    console.log(`🧠 MEMORY OPTIMIZATION: AKTIVIZUAR PËR 512MB RAM`);
    
    // ✅ NIS MEMORY MONITORING
    MemoryMonitor.startMonitoring();
    
    // ✅ SHFAQ MEMORY STARTUP
    const used = process.memoryUsage();
    const startupMB = Math.round(used.heapUsed / 1024 / 1024);
    console.log(`🧠 STARTUP MEMORY: ${startupMB}MB / 512MB`);
});

// ======================================================
// 🔄 GARBAGE COLLECTION FALLBACK
// ======================================================

// Nëse node nuk është startuar me --expose-gc, krijo fallback
if (!global.gc) {
    console.log('⚠️  Garbage Collection nuk është i ekspozuar. Duke krijuar fallback...');
    
    // Fallback i thjeshtë për memory management
    global.simpleGarbageCollector = () => {
        const before = process.memoryUsage();
        const beforeMB = Math.round(before.heapUsed / 1024 / 1024);
        
        // Forcim i thjeshtë memory cleanup
        try {
            if (global.gc) {
                global.gc();
            } else {
                // Fallback: bëj loop të madh për të trigger garbage collection
                const arr = new Array(1000000).fill(null);
                arr.length = 0;
            }
        } catch (e) {}
        
        const after = process.memoryUsage();
        const afterMB = Math.round(after.heapUsed / 1024 / 1024);
        
        console.log(`🔄 SIMPLE GC: ${beforeMB}MB → ${afterMB}MB`);
        return afterMB;
    };
}

module.exports = app;
