// ======================================================
// 🌟 ChatAI ALBA v4.0 — Context-Aware Voice Memory 
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
// 2️⃣ KONFIGURIME THEMELORE - SË PARMI!
// ======================================================

// ✅ CORS — KONFIGURIM PERFEKT PËR PRODUKSION
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://chatai-alba-gr9dw.ondigitalocean.app',
        'https://www.chatai-alba-gr9dw.ondigitalocean.app'
    ],
    credentials: true, // ✅ KRITIKE PËR COOKIES NË PRODUKSION
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With']
}));

// ✅ COOKIE & BODY PARSERS - SË PARMI!
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ======================================================
// 🔒 MIDDLEWARE PËR SESSION PERSISTENCE - KONFIGURIM PERFEKT
// ======================================================

// ✅ NGARKO MIDDLEWARE-I PARAPRAKISHT ME ERROR HANDLING
let chatSessionMiddleware;
try {
    chatSessionMiddleware = require('./middleware/chatSession');
    console.log('✅ ChatSession middleware u ngarkua me sukses në produksion');
} catch (error) {
    console.error('❌ ChatSession middleware nuk mund të ngarkohet:', error.message);
    // ✅ KRIJO FALLBACK MIDDLEWARE NËSE NUK EKZISTON
    chatSessionMiddleware = (req, res, next) => {
        console.log('🔄 Duke përdorur fallback session middleware');
        
        // ✅ APLIKO VETËM PËR RUTAT E CHAT & CONTEXT
        if (!req.path.startsWith('/api/chat') && !req.path.startsWith('/api/context')) {
            return next();
        }
        
        // ✅ KONTROLLO NËSE KA COOKIES EKZISTUESE
        let sessionId = req.cookies?.chatSessionId;
        let userId = req.cookies?.chatUserId;
        
        // ✅ VERIFIKO NËSE COOKIES JANË TË VLEFSHME
        const hasValidCookies = sessionId && userId;
        
        if (hasValidCookies) {
            console.log('🎯 Fallback: Duke përdorur cookies ekzistuese:', { userId, sessionId });
            req.userId = userId;
            req.sessionId = sessionId;
        } else {
            // ✅ KRIJO SESION TË RE
            userId = 'user-' + Date.now();
            sessionId = 'session-' + Date.now();
            
            console.log('🆕 Fallback: Duke krijuar session të re:', { userId, sessionId });
            
            // ✅ VENDOS COOKIE TË QËNDRUESHME
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // ✅ AUTOMATIK PËR PRODUKSION
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // ✅ 'none' PËR PRODUKSION
                path: '/',
                maxAge: 365 * 24 * 60 * 60 * 1000
            };
            
            res.cookie('chatUserId', userId, cookieOptions);
            res.cookie('chatSessionId', sessionId, cookieOptions);
            
            req.userId = userId;
            req.sessionId = sessionId;
        }
        
        next();
    };
    console.log('✅ Fallback session middleware u krijua');
}

// ✅ APLIKO MIDDLEWARE GLOBALISHT
app.use(chatSessionMiddleware);
console.log('🔒 Session middleware u aplikua globalisht');

// ======================================================
// 🔧 MIDDLEWARE TESTUES - VERIFIKIM NË PRODUKSION
// ======================================================

app.use((req, res, next) => {
    if (req.path.startsWith('/api/chat') || req.path.startsWith('/api/context')) {
        console.log('🧪 PRODUCTION TEST: Duke procesuar', req.method, req.path);
        console.log('🍪 Cookies në produksion:', req.cookies);
        console.log('🔑 Session data:', { userId: req.userId, sessionId: req.sessionId });
    }
    next();
});

// ======================================================
// 3️⃣ IMPORT & REGJISTRO RUTAT ME ERROR HANDLING
// ======================================================

// 🟢 RUTAT E CHAT - GJITHMONË EKZISTON
try {
    const chatRoutes = require('./routes/chat');
    app.use('/api/chat', chatRoutes);
    console.log('✅ Chat routes u ngarkuan');
} catch (error) {
    console.error('❌ Chat routes nuk mund të ngarkohen:', error.message);
}

// 🧠 RUTAT E CONTEXT - ME ERROR HANDLING
try {
    const contextRoutes = require('./routes/context-routes');
    app.use('/api/context', contextRoutes);
    console.log('✅ Context routes u ngarkuan');
} catch (error) {
    console.error('❌ Context routes nuk mund të ngarkohen:', error.message);
    console.log('⚠️  Duke vazhduar pa context routes...');
}

// 🎤 RUTA PËR VOICE - ME ERROR HANDLING
try {
    const voiceRoutes = require('./routes/voice');
    app.use('/api/voice', voiceRoutes);
    console.log('✅ Voice routes u ngarkuan');
} catch (error) {
    console.error('❌ Voice routes nuk mund të ngarkohen:', error.message);
}

// ======================================================
// 4️⃣ RUTAT E TJERA ME ERROR HANDLING
// ======================================================

// ✅ RUTAT THEMELORE QË GJITHMONË EKZISTOJNË
const authRoutes = require('./routes/auth');
const authEnhanced = require('./routes/auth-enhanced'); 
const userRoutes = require('./routes/users');
const emailVerification = require('./routes/email-verification');
const apiRoutes = require('./routes/api');
const geminiRoutes = require('./routes/gemini');
const adminRoutes = require('./routes/admin');
const geminiSimpleRoutes = require('./routes/gemini-simple');

app.use('/api/auth', authRoutes);
app.use('/api/auth', authEnhanced);
app.use('/api/users', userRoutes);
app.use('/api/email', emailVerification);
app.use('/api/api-keys', apiRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/admin', adminRoutes);
app.use('/api/gemini-simple', geminiSimpleRoutes);

// ======================================================
// 5️⃣ MIDDLEWARE PËR CONTEXT-AWARE SYSTEM - ME ERROR HANDLING
// ======================================================

try {
    const { 
        initializeContext, 
        analyzeVoiceContext, 
        enhanceWithContext,
        updateContextAfterResponse,
        contextErrorHandler 
    } = require('./middleware/contextMiddleware');

    // ✅ APLIKO MIDDLEWARE PËR RUTAT E CHAT & VOICE
    app.use('/api/chat', initializeContext, analyzeVoiceContext, enhanceWithContext, updateContextAfterResponse);
    app.use('/api/voice', initializeContext, analyzeVoiceContext, enhanceWithContext, updateContextAfterResponse);
    
    console.log('✅ Context middleware u ngarkua');
} catch (error) {
    console.error('❌ Context middleware nuk mund të ngarkohet:', error.message);
    console.log('⚠️  Duke vazhduar pa context middleware...');
}

// ======================================================
// 6️⃣ STATIC FILES & DEFAULT ROUTE
// ======================================================

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ======================================================
// 7️⃣ ERROR & 404 HANDLERS
// ======================================================

// ✅ ERROR HANDLER I THJESHTË PA VARËSI
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
// 8️⃣ TEST ENKRIPTIMI - ME ERROR HANDLING
// ======================================================

try {
    const encryption = require('./utils/encryption');
    setTimeout(() => {
        console.log('🛡️ Testi i enkriptimit AES-256-CBC:');
        encryption.testEncryption();
    }, 2000);
} catch (error) {
    console.error('❌ Encryption test nuk mund të ekzekutohet:', error.message);
}

// ======================================================
// 9️⃣ URA (BRIDGE SYSTEM) - ME ERROR HANDLING
// ======================================================

try {
    const AppBridge = require('./bridges/app-bridge');
    AppBridge.initializeSafeBridge(app);
    console.log('✅ AppBridge u inicializua');
} catch (error) {
    console.error('❌ AppBridge nuk mund të inicializohet:', error.message);
}

// ======================================================
// 🎯 CONTEXT SYSTEM INITIALIZATION - ME ERROR HANDLING
// ======================================================

setTimeout(async () => {
    try {
        const contextMemoryService = require('./services/contextMemoryService');
        console.log('🧠 Context-Aware Voice Memory System u inicializua!');
        
        const testContext = await contextMemoryService.initializeContext(
            'system-test', 
            'initial-session'
        );
        
        if (testContext) {
            console.log('✅ Context Memory System: OPERATIVE');
        }
    } catch (error) {
        console.error('❌ Context Memory System: INITIALIZATION FAILED', error.message);
    }
}, 1000);

// ======================================================
// 🧹 AUTOMATIC CLEANUP - ME ERROR HANDLING
// ======================================================

setInterval(() => {
    try {
        console.log('🧹 Automatic cleanup: Duke fshirë sesionet e vjetra...');
        const db = require('./database');
        
        const cutoffTime = new Date(Date.now() - (24 * 60 * 60 * 1000)).toISOString();
        
        db.run(
            'DELETE FROM conversation_contexts WHERE created_at < ?',
            [cutoffTime],
            function(err) {
                if (err) {
                    console.error('❌ Gabim në automatic cleanup:', err);
                } else {
                    console.log(`✅ U fshinë ${this.changes} sesione të vjetra`);
                }
            }
        );
    } catch (error) {
        console.error('❌ Automatic cleanup failed:', error.message);
    }
}, 24 * 60 * 60 * 1000);

// ======================================================
// 🚀 START SERVER
// ======================================================

app.listen(PORT, '0.0.0.0', () => {
    console.log(`╔══════════════════════════════════════════════════╗`);
    console.log(`║                🚀 CHATAI ALBA v4.0              ║`);
    console.log(`║           Context-Aware Voice Memory            ║`);
    console.log(`╠══════════════════════════════════════════════════╣`);
    console.log(`║ 🌐 URL: http://localhost:${PORT}                 ║`);
    console.log(`║ 🔐 NODE_ENV: ${process.env.NODE_ENV}            ║`);
    console.log(`║ 🎤 Voice API: /api/voice/transcribe             ║`);
    console.log(`║ 🧠 Context API: /api/context/*                  ║`);
    console.log(`║ 🔍 Semantic Search: ACTIVE                      ║`);
    console.log(`║ 🎵 Voice Analysis: ACTIVE                       ║`);
    console.log(`║ 💾 Memory System: OPERATIVE                     ║`);
    console.log(`║ 🔒 Session Middleware: ACTIVE                   ║`);
    console.log(`║ 🍪 Cookie Security: ${process.env.NODE_ENV === 'production' ? 'STRICT' : 'DEV'} ║`);
    console.log(`╚══════════════════════════════════════════════════╝`);
    
    console.log(`\n📊 ENDPOINTS TË RINJ:`);
    console.log(`   🧠 GET  /api/context/test           - Test Context API`);
    console.log(`   🧠 GET  /api/context/summary        - Context Summary`);
    console.log(`   🧠 GET  /api/context/voice-profile/:userId - Voice Profile`);
    console.log(`   🧠 POST /api/context/create-prompt  - Create AI Context Prompt`);
    console.log(`   🧠 POST /api/context/semantic-search- Semantic Search`);
    console.log(`   🔍 GET  /api/chat/production-debug  - Production Debug`);
    console.log(`   🔍 GET  /api/chat/debug-session     - Session Debug`);
});
