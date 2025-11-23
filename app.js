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
const tllActivationRoutes = require('./routes/tll-activation');
const ContextMemoryService = require('./services/contextMemoryService');
const contextMemoryRoutes = require('./routes/context-memory');
const contextMemoryService = new ContextMemoryService();
const knowledgeRoutes = require('./routes/knowledge');

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
app.use('/api/context-memory', contextMemoryRoutes);
app.use('/api/tll', tllActivationRoutes);
app.use('/api/knowledge', knowledgeRoutes);

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

// ✅ RUTA E CHAT-IT TË OPENAI - DIREKT NË APP.JS
app.post('/api/openai/chat', async (req, res) => {
    console.log('🎯 /api/openai/chat u thirr direkt nga app.js');
    try {
        const { message } = req.body;
        
        if (!message || message.trim() === '') {
            return res.json({
                success: false,
                response: '❌ Ju lutem shkruani një mesazh për OpenAI'
            });
        }
        
        console.log('🔮 Mesazhi i OpenAI:', message.substring(0, 100));
        
        // PËRDOR OPENAI SERVICE TË VËRTETË
        try {
            const { openai, getModel } = require('./services/openaiService');
            
            if (!process.env.OPENAI_API_KEY) {
                throw new Error('OPENAI_API_KEY nuk është konfiguruar në .env file');
            }
            
            const completion = await openai.chat.completions.create({
                model: getModel('chat'),
                messages: [
                    {
                        role: "system", 
                        content: "Ti je RRUFE-TESLA AI, një asistent inteligjent shqip. Përgjigju në shqip dhe jep përgjigje të dobishme dhe miqësore."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7
            });

            const response = completion.choices[0].message.content;
            
            res.json({
                success: true,
                response: `🔮 **OpenAI**\n\n${response}`,
                model: getModel('chat'),
                tokens: completion.usage?.total_tokens || 0,
                timestamp: new Date().toISOString(),
                route: 'direct-app-route'
            });
            
        } catch (openaiError) {
            console.error('❌ OpenAI Service Error:', openaiError.message);
            
            // FALLBACK NËSE OPENAI DËSHTON
            res.json({
                success: true,
                response: `🔮 **OpenAI Test Mode**\n\n"${message}"\n\n💡 *OpenAI service is being configured*\n\n**Status:** ${openaiError.message}\n**Këshillë:** Kontrolloni OPENAI_API_KEY në .env file`,
                fallback: true,
                timestamp: new Date().toISOString()
            });
        }
        
    } catch (error) {
        console.error('❌ OpenAI Route Error:', error);
        res.json({
            success: false,
            response: `❌ Gabim server: ${error.message}`,
            timestamp: new Date().toISOString()
        });
    }
});

console.log('✅ OpenAI routes u regjistruan DIREKT në app.js:');
console.log('   - GET /api/openai/status');
console.log('   - POST /api/openai/chat');

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
    console.log(`🧠 MEMORY OPTIMIZATION: AKTIVIZUAR PËR 512MB RAM`);
    console.log(`🌉 APP BRIDGE: AKTIVIZUAR ME RUGËT OPENAI`);
    console.log(`🔮 OPENAI ROUTES: AKTIVIZUAR DIREKT NË APP.JS`);
    
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

// ✅ RUTA E CHAT-IT TË OPENAI - DIREKT NË APP.JS
app.post('/api/openai/chat', async (req, res) => {
    console.log('🎯 /api/openai/chat u thirr direkt nga app.js');
    
    try {
        const { message } = req.body;
        
        if (!message || message.trim() === '') {
            return res.json({
                success: false,
                response: '❌ Ju lutem shkruani një mesazh për OpenAI'
            });
        }
        
        console.log('🔮 Mesazhi:', message.substring(0, 100));
        console.log('🔮 OPENAI_API_KEY ekziston:', !!process.env.OPENAI_API_KEY);
        
        // PËRDOR OPENAI SERVICE TË VËRTETË
        try {
            const { openai, getModel } = require('./services/openaiService');
            
            console.log('🔮 Duke thirrur OpenAI API...');
            
            const completion = await openai.chat.completions.create({
                model: getModel('chat'),
                messages: [
                    {
                        role: "system", 
                        content: "Ti je RRUFE-TESLA AI, një asistent inteligjent shqip. Përgjigju në shqip dhe jep përgjigje të dobishme dhe miqësore."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7
            });

            const response = completion.choices[0].message.content;
            
            console.log('✅ OpenAI përgjigje e suksesshme');
            
            res.json({
                success: true,
                response: `🔮 **OpenAI**\n\n${response}`,
                model: getModel('chat'),
                tokens: completion.usage?.total_tokens || 0,
                timestamp: new Date().toISOString(),
                route: 'direct-app-route'
            });
            
        } catch (openaiError) {
            console.error('❌ OpenAI Service Error:', openaiError.message);
            console.error('❌ OpenAI Error Details:', openaiError);
            
            // FALLBACK NËSE OPENAI DËSHTON
            res.json({
                success: true,
                response: `🔮 **OpenAI Test Mode**\n\n"${message}"\n\n💡 *OpenAI service is being configured*\n\n**Gabim:** ${openaiError.message}`,
                fallback: true,
                timestamp: new Date().toISOString()
            });
        }
        
    } catch (error) {
        console.error('❌ OpenAI Route Error:', error);
        res.json({
            success: false,
            response: `❌ Gabim server: ${error.message}`,
            timestamp: new Date().toISOString()
        });
    }
});

console.log('✅ OpenAI routes u regjistruan DIREKT në app.js:');
console.log('   - GET /api/openai/status');
console.log('   - POST /api/openai/chat');

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
    console.log(`🔮 OPENAI ROUTES: AKTIVIZUAR DIREKT NË APP.JS`);
    
    // ✅ DIAGNOSTIKIM I OPENAI
    console.log('🔮 DIAGNOSTIKIM I OPENAI:');
    console.log('   - OPENAI_API_KEY ekziston:', !!process.env.OPENAI_API_KEY);
    console.log('   - Gjatësia e API Key:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);
    
    // ✅ NIS MEMORY MONITORING
    MemoryMonitor.startMonitoring();
    
    // ✅ SHFAQ MEMORY STARTUP
    const used = process.memoryUsage();
    const startupMB = Math.round(used.heapUsed / 1024 / 1024);
    console.log(`🧠 STARTUP MEMORY: ${startupMB}MB / 512MB`);
});

module.exports = app;
