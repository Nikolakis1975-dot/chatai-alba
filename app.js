// ============================================================
// 🌟 ChatAI ALBA v3.0 — Server kryesor ME MEMORY OPTIMIZATION
// ============================================================

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
        'https://deklarata-rrufetesla.netlify.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-User-ID']
}));

// ✅ COOKIE & BODY parsers
app.use(cookieParser());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// ======================================================
// 🆕 SIMPLE SESSION EMULATION - PA EXPRESS-SESSION
// ======================================================

app.use((req, res, next) => {
    // Emulim i thjeshtë session - përdor cookie direkt
    if (req.cookies && req.cookies.userId) {
        req.user = { id: req.cookies.userId };
        console.log('🔐 Session Emulation - User ID:', req.cookies.userId);
    }
    next();
});

console.log('✅ SESSION EMULATION U AKTIVIZUA');

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
const tllActivationRoutes = require('./routes/tll-activation');
const ContextMemoryService = require('./services/contextMemoryService');
const contextMemoryRoutes = require('./routes/context-memory');
const contextMemoryService = new ContextMemoryService();
const knowledgeRoutes = require('./routes/knowledge');
const openaiEnhancedRoutes = require('./routes/openai-enhanced');

// ======================================================
// 🆕 SHTESË E RE: RRUFE-TESLA 10.5 INTEGRIMI
// ======================================================

// 🌌 Ruta të reja për Ndërgjegjen Kolektive
const consciousnessRoutes = require('./routes/rrufe/consciousness-routes');
app.use('/api/consciousness', consciousnessRoutes);

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
app.use('/api/context-memory', contextMemoryRoutes);
app.use('/api/tll', tllActivationRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/openai-enhanced', openaiEnhancedRoutes);

// ======================================================
// 🆕 OPENAI ROUTES - IMPLEMENTIM I DIREKT NË APP.JS
// ======================================================

// ✅ RUTA E STATUSIT TË OPENAI - DIREKT NË APP.JS
app.get('/api/openai/status', async (req, res) => {
    console.log('🎯 /api/openai/status u thirr direkt nga app.js');
    try {
        res.json({
            success: true,
            message: 'OpenAI route works direkt nga app.js! 🎉',
            status: 'active',
            timestamp: new Date().toISOString(),
            route: 'direct-app-route',
            system: 'RRUFE_TESLA_10.5_OPTIMIZED'
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Gabim në OpenAI status',
            error: error.message
        });
    }
});

// ==================== ✅ RUTA E CHAT-IT TË OPENAI - DIREKT NË APP.JS =========================
app.post('/api/openai/chat', async (req, res) => {
    try {
        const { message, apiKey } = req.body;
        
        console.log('🔮 OpenAI Request - API Key nga frontend:', !!apiKey);
        
        // ✅ PËRDOR API KEY NGA FRONTEND OSE ENVIRONMENT
        const openaiApiKey = apiKey || process.env.OPENAI_API_KEY;
        
        if (!openaiApiKey) {
            return res.json({
                success: true,
                response: `🔮 **OpenAI Setup Required**\n\n"${message}"\n\n💡 *Ju lutem vendosni API Key në panelin e OpenAI*`,
                fallback: true
            });
        }
        
        // ✅ PËRDOR OPENAI ME API KEY
        const { OpenAI } = require('openai');
        const openai = new OpenAI({ 
            apiKey: openaiApiKey 
        });
        
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: "system", 
                    content: "Ti je RRUFE-TESLA AI. Përgjigju në shqip dhe jep përgjigje të dobishme."
                },
                {
                    role: "user",
                    content: message
                }
            ],
            max_tokens: 500
        });

        const response = completion.choices[0].message.content;
        
        res.json({
            success: true,
            response: `🔮 **OpenAI**: ${response}`,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ OpenAI Error:', error.message);
        
        // Fallback nëse dështon
        res.json({
            success: true,
            response: `🔮 **OpenAI Test Mode**\n\n"${req.body.message}"\n\n💡 *Gabim: ${error.message}*`,
            fallback: true
        });
    }
});

// ======================================================
// 5️⃣ Static files (Frontend)
app.use(express.static(path.join(__dirname, 'public')));

// ======================================================
// 6️⃣ Default route — për SPA frontend
app.get('/', (req, res) => {
    // ✅ Memory check për çdo request
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
// 9️⃣ Ura (Bridge System) - VERSION I KORRIGJUAR
// ======================================================

const AppBridge = require('./bridges/app-bridge');

// ✅ INICIALIZO VETËM NJË HERË - NË FUND TË SKEDARIT
AppBridge.initializeSafeBridge(app);
console.log('🌉 AppBridge u inicializua në server');

// ======================================================
// 🔟 Start server - ME MEMORY MONITORING
// ======================================================

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveri është duke u drejtuar në portin ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`🔐 NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`🎤 Voice Routes u regjistruan: /api/voice/transcribe`);
    console.log(`🌌 RRUFE-TESLA 10.5 Routes u regjistruan: /api/consciousness`);
    console.log(`🔮 OpenAI Enhanced Routes u regjistruan: /api/openai-enhanced`);
    console.log(`🧠 MEMORY OPTIMIZATION: AKTIVIZUAR PËR 512MB RAM`);
    console.log(`🌉 APP BRIDGE: AKTIVIZUAR ME RUGËT OPENAI`
